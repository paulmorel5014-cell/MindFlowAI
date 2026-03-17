'use client'

import { useCallback, useEffect, useState } from 'react'
import type { DashboardStats, RDVAutoEvent } from '@/app/api/dashboard/route'
import {
  getAppointments, getStoredEvents, syncAppointmentsFromSupabase,
  type Appointment, type OtterFlowEvent,
} from '@/lib/rdv-store'
import { SUPABASE_ENABLED } from '@/lib/supabase'
import { useAuth } from './useAuth'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0]
}

function monthBounds(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}

function computeStats(appointments: Appointment[]): DashboardStats {
  const now = new Date()
  const active    = appointments.filter((a) => a.status !== 'cancelled')
  const confirmed = active.filter((a) => a.status === 'confirmed')

  const confirmedRdv   = confirmed.length
  const totalSlots     = active.length
  const totalValue     = confirmed.reduce((s, a) => s + a.estimatedValue, 0)
  const averageBasket  = confirmedRdv > 0 ? Math.round(totalValue / confirmedRdv) : 0

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lm = monthBounds(lastMonthDate.getFullYear(), lastMonthDate.getMonth())
  const lastMonthRevenue = confirmed
    .filter((a) => a.date >= lm.start && a.date <= lm.end)
    .reduce((s, a) => s + a.estimatedValue, 0)

  const dow    = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1))
  monday.setHours(0, 0, 0, 0)

  const weeklyAppointments = Array.from({ length: 4 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + week * 7 + day)
      return active.filter((a) => a.date === toYYYYMMDD(d)).length
    }),
  )

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const { start, end } = monthBounds(d.getFullYear(), d.getMonth())
    return confirmed
      .filter((a) => a.date >= start && a.date <= end)
      .reduce((s, a) => s + a.estimatedValue, 0)
  })

  return {
    confirmedRdv, totalSlots, averageBasket, lastMonthRevenue,
    visitors: 0, calendarClicks: 0,
    weeklyAppointments, monthlyTrend,
    regions: [
      { name: 'Île-de-France',             demand: 92, city: 'Paris'      },
      { name: 'Auvergne-Rhône-Alpes',      demand: 78, city: 'Lyon'       },
      { name: 'Provence-Alpes-Côte d\'Azur', demand: 71, city: 'Marseille' },
      { name: 'Occitanie',                 demand: 58, city: 'Toulouse'   },
      { name: 'Nouvelle-Aquitaine',        demand: 52, city: 'Bordeaux'   },
      { name: 'Hauts-de-France',           demand: 45, city: 'Lille'      },
      { name: 'Grand Est',                 demand: 38, city: 'Strasbourg' },
      { name: 'Bretagne',                  demand: 34, city: 'Rennes'     },
    ],
  }
}

function otterFlowToRDVEvent(e: OtterFlowEvent): RDVAutoEvent {
  const statusMap: Record<OtterFlowEvent['type'], RDVAutoEvent['status']> = {
    APPOINTMENT_CREATED:    'pending',
    APPOINTMENT_CONFIRMED:  'confirmed',
    APPOINTMENT_CANCELLED:  'cancelled',
    APPOINTMENT_RESCHEDULED:'pending',
  }
  const serviceLabel: Record<string, string> = {
    diagnostic: 'Diagnostic', intervention: 'Intervention', devis: 'Devis',
  }
  return {
    id:         `${e.payload.appointmentId}-${e.type}`,
    timestamp:  e.timestamp,
    clientName: e.payload.clientName,
    service:    serviceLabel[e.payload.serviceId] ?? e.payload.serviceId,
    amount:     e.payload.estimatedValue,
    source:     'rdv-auto',
    status:     statusMap[e.type],
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface DashboardData {
  stats: DashboardStats | null
  liveEvents: RDVAutoEvent[]
  isLoading: boolean
  isDemo: boolean
  averageBasket: number
  setAverageBasket: (v: number) => void
  caActuel: number
  caPrecedent: number
  tendency: number
  refresh: () => void
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth()
  const [stats, setStats]               = useState<DashboardStats | null>(null)
  const [liveEvents, setLiveEvents]     = useState<RDVAutoEvent[]>([])
  const [isLoading, setIsLoading]       = useState(true)
  const [averageBasket, setAverageBasket] = useState(0)

  const loadFromLocal = useCallback(() => {
    const appointments = getAppointments()
    const computed = computeStats(appointments)
    setStats(computed)
    if (computed.averageBasket > 0) setAverageBasket(computed.averageBasket)
    setLiveEvents(getStoredEvents().map(otterFlowToRDVEvent))
    setIsLoading(false)
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    if (SUPABASE_ENABLED && user?.id) {
      await syncAppointmentsFromSupabase(user.id)
    }
    loadFromLocal()
  }, [loadFromLocal, user?.id])

  // Initial load: sync from Supabase then render
  useEffect(() => {
    async function init() {
      if (SUPABASE_ENABLED && user?.id) {
        await syncAppointmentsFromSupabase(user.id)
      }
      loadFromLocal()
    }
    init()
  }, [loadFromLocal, user?.id])

  // React to local store changes (CustomEvent + Realtime via useStoreVersion)
  useEffect(() => {
    const handler = () => loadFromLocal()
    window.addEventListener('rdv:store-updated', handler)
    window.addEventListener('otterflow:appointment', handler)
    return () => {
      window.removeEventListener('rdv:store-updated', handler)
      window.removeEventListener('otterflow:appointment', handler)
    }
  }, [loadFromLocal])

  const confirmedRdv = stats?.confirmedRdv ?? 0
  const caActuel     = confirmedRdv * averageBasket
  const caPrecedent  = stats?.lastMonthRevenue ?? 0
  const tendency     = caPrecedent > 0
    ? Math.round(((caActuel - caPrecedent) / caPrecedent) * 100)
    : 0

  return {
    stats, liveEvents, isLoading, isDemo: false,
    averageBasket, setAverageBasket,
    caActuel, caPrecedent, tendency, refresh,
  }
}
