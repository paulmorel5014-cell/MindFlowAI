'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  CalendarDays,
  Zap,
  RefreshCw,
  TrendingUp,
  Euro,
} from 'lucide-react'
import { Appointment, getAppointments, updateAppointmentStatus, timeToMinutes } from '@/lib/rdv-store'

// ── Helpers ────────────────────────────────────────────────────────────────────

function getDateStr(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

function dateLabel(dateStr: string): string {
  const today = getDateStr(0)
  const tomorrow = getDateStr(1)
  if (dateStr === today) return "Aujourd'hui"
  if (dateStr === tomorrow) return 'Demain'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
}

const SVC_STYLE: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  diagnostic: {
    bg: 'bg-cyan-glacial/[0.1]',
    border: 'border-cyan-glacial/25',
    text: 'text-cyan-glacial',
    dot: 'bg-cyan-glacial',
  },
  intervention: {
    bg: 'bg-violet-neon/[0.1]',
    border: 'border-violet-neon/25',
    text: 'text-violet-bright',
    dot: 'bg-violet-bright',
  },
  devis: {
    bg: 'bg-gold-light/[0.1]',
    border: 'border-gold-light/25',
    text: 'text-gold-light',
    dot: 'bg-gold-light',
  },
}

type Filter = 'today' | 'week' | 'all'

// ── Stat card ─────────────────────────────────────────────────────────────────
function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  accent: string
}) {
  return (
    <div className="frozen-card rounded-xl p-3 border border-white/[0.07] flex flex-col gap-1">
      <Icon className={`w-4 h-4 ${accent}`} />
      <span className={`text-lg font-bold font-mono ${accent}`}>{value}</span>
      <span className="text-[10px] text-white/30 leading-tight">{label}</span>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminTimeline() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<Filter>('today')
  const [confirming, setConfirming] = useState<string | null>(null)
  const [syncAt, setSyncAt] = useState<string>('')

  const loadAppointments = useCallback(() => {
    const all = getAppointments()
    const today = getDateStr(0)
    const weekEnd = getDateStr(7)

    let filtered = all
    if (filter === 'today') filtered = all.filter((a) => a.date === today)
    else if (filter === 'week') filtered = all.filter((a) => a.date >= today && a.date <= weekEnd)

    filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return timeToMinutes(a.time) - timeToMinutes(b.time)
    })

    setAppointments(filtered)
    setSyncAt(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }, [filter])

  useEffect(() => {
    loadAppointments()
    const handler = () => loadAppointments()
    window.addEventListener('otterflow:appointment', handler)
    return () => window.removeEventListener('otterflow:appointment', handler)
  }, [loadAppointments])

  const handleConfirm = async (id: string) => {
    setConfirming(id)
    await new Promise((r) => setTimeout(r, 650))
    updateAppointmentStatus(id, 'confirmed')
    loadAppointments()
    setConfirming(null)
  }

  // Today stats
  const todayAppts = getAppointments().filter((a) => a.date === getDateStr(0))
  const totalRevenue = todayAppts.reduce((s, a) => s + a.estimatedValue, 0)
  const confirmedCount = todayAppts.filter((a) => a.status === 'confirmed').length
  const workMinutes = todayAppts.reduce((s, a) => s + a.duration, 0)

  // Group by date
  const grouped = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    if (!acc[a.date]) acc[a.date] = []
    acc[a.date].push(a)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4">
      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2">
        <Stat icon={CalendarDays} label="RDV aujourd'hui" value={todayAppts.length} accent="text-white/55" />
        <Stat icon={CheckCircle2} label="Confirmés" value={confirmedCount} accent="text-cyan-glacial" />
        <Stat icon={Euro} label="CA estimé" value={`${totalRevenue}€`} accent="text-gold-light" />
      </div>

      {/* Workload bar */}
      {workMinutes > 0 && (
        <div className="frozen-card rounded-xl border border-white/[0.07] px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-violet-bright" />
              <span className="text-xs text-white/50">Charge du jour</span>
            </div>
            <span className="text-xs font-mono text-violet-bright">
              {Math.floor(workMinutes / 60)}h{workMinutes % 60 > 0 ? `${workMinutes % 60}min` : ''}
            </span>
          </div>
          <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-neon to-cyan-glacial"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((workMinutes / 600) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-white/25 mt-1.5">sur 10h de capacité journalière</p>
        </div>
      )}

      {/* ── Filter tabs ── */}
      <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.07]">
        {(['today', 'week', 'all'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${filter === f
                ? 'bg-violet-neon/[0.25] text-violet-bright border border-violet-neon/30'
                : 'text-white/30 hover:text-white/50'}
            `}
          >
            {f === 'today' ? "Aujourd'hui" : f === 'week' ? 'Cette semaine' : 'Tout afficher'}
          </button>
        ))}
      </div>

      {/* ── OtterFlow sync status ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-cyan-glacial/[0.05] border border-cyan-glacial/[0.14] rounded-xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-glacial" />
        </motion.div>
        <span className="text-[11px] text-cyan-glacial/65 font-mono flex-1">
          Moteur de Synchronisation Temporelle — Actif
        </span>
        <span className="text-[10px] text-white/25 font-mono">{syncAt}</span>
        <button
          onClick={loadAppointments}
          className="p-1 rounded hover:bg-white/[0.05] transition-all"
          title="Actualiser"
        >
          <RefreshCw className="w-3 h-3 text-white/25 hover:text-white/50" />
        </button>
      </div>

      {/* ── Timeline ── */}
      <div className="space-y-5 pb-6">
        <AnimatePresence mode="popLayout">
          {Object.keys(grouped).length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-14 text-center"
            >
              <CalendarDays className="w-10 h-10 text-white/12 mb-3" />
              <p className="text-white/30 text-sm">Aucun rendez-vous</p>
              <p className="text-white/20 text-xs mt-1">
                {filter === 'today'
                  ? "pour aujourd'hui"
                  : filter === 'week'
                  ? 'cette semaine'
                  : 'dans le planning'}
              </p>
            </motion.div>
          ) : (
            Object.entries(grouped).map(([date, appts], gi) => (
              <motion.div
                key={date}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06 }}
              >
                {/* Date separator */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-white/45 capitalize whitespace-nowrap">
                    {dateLabel(date)}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[10px] text-white/25 font-mono whitespace-nowrap">
                    {appts.length} RDV
                  </span>
                </div>

                {/* Appointment cards with vertical timeline */}
                <div className="relative pl-5">
                  <div className="absolute left-1.5 top-3 bottom-3 w-px bg-white/[0.08]" />

                  <div className="space-y-2.5">
                    {appts.map((appt, i) => {
                      const style = SVC_STYLE[appt.serviceId] ?? SVC_STYLE.diagnostic
                      const isConf = appt.status === 'confirmed'
                      const isConfirming = confirming === appt.id

                      return (
                        <motion.div
                          key={appt.id}
                          layout
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`
                            relative frozen-card rounded-xl p-3.5 border transition-all duration-300
                            ${isConf ? `${style.bg} ${style.border}` : 'border-white/[0.07]'}
                          `}
                        >
                          {/* Timeline dot */}
                          <div
                            className={`absolute -left-[18px] top-4 w-2 h-2 rounded-full border-2
                              ${isConf ? style.dot : 'bg-white/20'}
                            `}
                            style={{ borderColor: '#0A0F1E' }}
                          />

                          <div className="flex items-start gap-3">
                            {/* Time block */}
                            <div className="flex-shrink-0 text-center min-w-[40px]">
                              <span
                                className={`text-sm font-mono font-bold ${
                                  isConf ? style.text : 'text-white/45'
                                }`}
                              >
                                {appt.time}
                              </span>
                              <div className="text-[9px] text-white/25 mt-0.5">
                                {appt.duration < 60
                                  ? `${appt.duration}min`
                                  : `${appt.duration / 60}h`}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span className="text-sm font-semibold text-white/80">
                                  {appt.client.name}
                                </span>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}
                                >
                                  {appt.serviceLabel}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Phone className="w-3 h-3 text-white/22 flex-shrink-0" />
                                <span className="text-[11px] text-white/40 font-mono">
                                  {appt.client.phone}
                                </span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <MapPin className="w-3 h-3 text-white/22 flex-shrink-0 mt-0.5" />
                                <span className="text-[11px] text-white/40 truncate">
                                  {appt.client.address}
                                </span>
                              </div>
                            </div>

                            {/* Status / action */}
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              {appt.estimatedValue > 0 && (
                                <span className="text-xs font-bold text-gold-light font-mono">
                                  {appt.estimatedValue}€
                                </span>
                              )}
                              {isConf ? (
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/[0.1] border border-green-500/20 text-green-400 text-[10px]">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Confirmé
                                </div>
                              ) : (
                                <motion.button
                                  onClick={() => handleConfirm(appt.id)}
                                  disabled={!!confirming}
                                  whileHover={{ scale: 1.04 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-glacial/[0.14] border border-cyan-glacial/30 text-cyan-glacial text-[10px] font-medium hover:bg-cyan-glacial/[0.22] transition-all disabled:opacity-50"
                                >
                                  {isConfirming ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                                    >
                                      <Clock className="w-3 h-3" />
                                    </motion.div>
                                  ) : (
                                    <CheckCircle2 className="w-3 h-3" />
                                  )}
                                  Confirmer
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
