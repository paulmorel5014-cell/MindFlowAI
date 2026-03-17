'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { DashboardStats, RDVAutoEvent } from '@/app/api/dashboard/route'

const SERVICES = [
  'Consultation initiale', 'Audit complet', 'Suivi mensuel',
  'Devis personnalisé', 'Formation client', 'Prestation sur site',
]
const CLIENTS = [
  'Sophie M.', 'Marc D.', 'Isabelle R.', 'Paul L.', 'Claire V.',
  'Thomas B.', 'Amandine K.', 'Romain F.', 'Léa P.', 'Antoine C.',
]
const AMOUNTS = [320, 450, 380, 520, 290, 680, 410, 560, 340, 490]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateLiveEvent(): RDVAutoEvent {
  return {
    id: `live-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    clientName: randomItem(CLIENTS),
    service: randomItem(SERVICES),
    amount: randomItem(AMOUNTS),
    source: Math.random() > 0.5 ? 'rdv-auto' : 'website',
    status: 'confirmed',
  }
}

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

const DEFAULT_AVERAGE_BASKET = 420

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [liveEvents, setLiveEvents] = useState<RDVAutoEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(true)
  const [averageBasket, setAverageBasket] = useState(DEFAULT_AVERAGE_BASKET)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const liveRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (!res.ok) return
      const data = await res.json()
      setStats(data.stats)
      setLiveEvents(data.recentEvents ?? [])
      setIsDemo(data.source === 'demo')
    } catch {
      // Silent fail — keep existing data
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setIsLoading(true)
    fetchData()
  }, [fetchData])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Polling every 30s
  useEffect(() => {
    pollingRef.current = setInterval(fetchData, 30_000)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [fetchData])

  // Live event simulation (demo mode)
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000 // 8-15s
      liveRef.current = setTimeout(() => {
        if (isDemo) {
          const evt = generateLiveEvent()
          setLiveEvents((prev) => [evt, ...prev].slice(0, 20))
          setStats((prev) =>
            prev ? { ...prev, confirmedRdv: prev.confirmedRdv + 1 } : prev
          )
        }
        scheduleNext()
      }, delay)
    }
    scheduleNext()
    return () => {
      if (liveRef.current) clearTimeout(liveRef.current)
    }
  }, [isDemo])

  const confirmedRdv = stats?.confirmedRdv ?? 0
  const caActuel = confirmedRdv * averageBasket
  const caPrecedent = stats?.lastMonthRevenue ?? 0
  const tendency = caPrecedent > 0
    ? Math.round(((caActuel - caPrecedent) / caPrecedent) * 100)
    : 0

  return {
    stats,
    liveEvents,
    isLoading,
    isDemo,
    averageBasket,
    setAverageBasket,
    caActuel,
    caPrecedent,
    tendency,
    refresh,
  }
}
