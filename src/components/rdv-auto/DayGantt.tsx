'use client'

import { motion } from 'framer-motion'
import { Phone, MapPin } from 'lucide-react'
import { Appointment, timeToMinutes } from '@/lib/rdv-store'

// ── Constants ─────────────────────────────────────────────────────────────────
const DAY_START = 8 * 60   // 08:00 in minutes
const DAY_END   = 18 * 60  // 18:00 in minutes
const DAY_SPAN  = DAY_END - DAY_START // 600 minutes

const PX_PER_MIN = 1.1  // 66px per hour
const TOTAL_HEIGHT = DAY_SPAN * PX_PER_MIN

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i) // 08 → 18

const SVC_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  diagnostic: {
    bg: 'rgba(6,182,212,0.13)',
    border: 'rgba(6,182,212,0.45)',
    text: '#67E8F9',
    label: '#22D3EE',
  },
  intervention: {
    bg: 'rgba(139,92,246,0.13)',
    border: 'rgba(139,92,246,0.45)',
    text: '#A78BFA',
    label: '#A78BFA',
  },
  devis: {
    bg: 'rgba(212,175,114,0.13)',
    border: 'rgba(212,175,114,0.45)',
    text: '#D4AF72',
    label: '#D4AF72',
  },
}

interface Props {
  appointments: Appointment[]
  onConfirm: (id: string) => void
  onReschedule: (appt: Appointment) => void
  onCancel: (appt: Appointment) => void
  confirming: string | null
}

export default function DayGantt({ appointments, onConfirm, onReschedule, onCancel, confirming }: Props) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const isToday = true // this component is only shown for "today" filter
  const nowOffset = Math.max(0, Math.min(TOTAL_HEIGHT, (currentMinutes - DAY_START) * PX_PER_MIN))
  const isPastDay = currentMinutes > DAY_END

  // Active (non-cancelled) appointments sorted by time
  const active = appointments.filter((a) => a.status !== 'cancelled')

  return (
    <div className="frozen-card rounded-2xl border border-white/[0.07] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <span className="text-xs font-semibold text-white/55">Vue temporelle — Aujourd&apos;hui</span>
        <span className="text-[10px] font-mono text-white/25">08:00 – 18:00</span>
      </div>

      <div className="flex" style={{ minHeight: TOTAL_HEIGHT + 32 }}>
        {/* ── Hour axis ── */}
        <div className="relative flex-shrink-0 w-12 border-r border-white/[0.05]" style={{ height: TOTAL_HEIGHT }}>
          {HOURS.map((h) => {
            const top = (h * 60 - DAY_START) * PX_PER_MIN
            return (
              <div
                key={h}
                className="absolute right-0 flex items-center"
                style={{ top, transform: 'translateY(-50%)' }}
              >
                <span className="text-[9px] font-mono text-white/25 pr-2">
                  {String(h).padStart(2, '0')}h
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Timeline body ── */}
        <div className="relative flex-1 px-2 py-0" style={{ height: TOTAL_HEIGHT }}>
          {/* Hour grid lines */}
          {HOURS.map((h) => {
            const top = (h * 60 - DAY_START) * PX_PER_MIN
            return (
              <div
                key={h}
                className="absolute left-0 right-0 border-t border-white/[0.04]"
                style={{ top }}
              />
            )
          })}

          {/* Half-hour grid lines (lighter) */}
          {HOURS.slice(0, -1).map((h) => {
            const top = (h * 60 + 30 - DAY_START) * PX_PER_MIN
            return (
              <div
                key={`half-${h}`}
                className="absolute left-0 right-0 border-t border-white/[0.02]"
                style={{ top }}
              />
            )
          })}

          {/* Current time indicator */}
          {isToday && !isPastDay && currentMinutes >= DAY_START && currentMinutes <= DAY_END && (
            <div
              className="absolute left-0 right-0 z-20 pointer-events-none"
              style={{ top: nowOffset }}
            >
              <div className="flex items-center gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 -ml-1"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="flex-1 h-px bg-red-400/50" />
                <span className="text-[9px] font-mono text-red-400/70 pr-1">
                  {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

          {/* Appointment blocks */}
          {active.map((appt, i) => {
            const startMin = timeToMinutes(appt.time) - DAY_START
            const top = Math.max(0, startMin * PX_PER_MIN)
            const height = Math.max(28, appt.duration * PX_PER_MIN)
            const colors = SVC_COLORS[appt.serviceId] ?? SVC_COLORS.diagnostic
            const isPending = appt.status === 'pending'

            return (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, scaleY: 0.8 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.06 }}
                className="absolute left-1 right-1 rounded-xl overflow-hidden cursor-default group"
                style={{
                  top,
                  height,
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Pending stripe overlay */}
                {isPending && (
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 4px,
                        rgba(255,255,255,0.15) 4px,
                        rgba(255,255,255,0.15) 5px
                      )`,
                    }}
                  />
                )}

                <div className="relative z-10 px-2 py-1.5 h-full flex flex-col justify-between">
                  {/* Top row */}
                  <div className="flex items-start gap-1.5 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold truncate" style={{ color: colors.text }}>
                        {appt.client.name}
                      </p>
                      {height > 40 && (
                        <p className="text-[9px] truncate" style={{ color: colors.label, opacity: 0.7 }}>
                          {appt.serviceLabel} · {appt.time}
                        </p>
                      )}
                    </div>
                    {appt.estimatedValue > 0 && height > 36 && (
                      <span className="text-[9px] font-bold font-mono flex-shrink-0" style={{ color: '#D4AF72' }}>
                        {appt.estimatedValue}€
                      </span>
                    )}
                  </div>

                  {/* Bottom details (only if tall enough) */}
                  {height > 70 && (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 flex-shrink-0" style={{ color: colors.text, opacity: 0.5 }} />
                        <span className="text-[9px] font-mono truncate" style={{ color: colors.text, opacity: 0.6 }}>
                          {appt.client.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 flex-shrink-0" style={{ color: colors.text, opacity: 0.5 }} />
                        <span className="text-[9px] truncate" style={{ color: colors.text, opacity: 0.5 }}>
                          {appt.client.address}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover action bar */}
                <div className="absolute inset-x-0 bottom-0 hidden group-hover:flex items-center gap-1 px-2 py-1.5 bg-space/80 backdrop-blur-sm border-t border-white/[0.08]">
                  {isPending && (
                    <button
                      onClick={() => onConfirm(appt.id)}
                      disabled={confirming === appt.id}
                      className="flex-1 text-[9px] font-medium py-1 rounded-md bg-cyan-glacial/20 border border-cyan-glacial/30 text-cyan-glacial hover:bg-cyan-glacial/30 transition-all disabled:opacity-50"
                    >
                      {confirming === appt.id ? '…' : 'Confirmer'}
                    </button>
                  )}
                  <button
                    onClick={() => onReschedule(appt)}
                    className="flex-1 text-[9px] font-medium py-1 rounded-md bg-violet-neon/20 border border-violet-neon/30 text-violet-bright hover:bg-violet-neon/30 transition-all"
                  >
                    Déplacer
                  </button>
                  <button
                    onClick={() => onCancel(appt)}
                    className="flex-1 text-[9px] font-medium py-1 rounded-md bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </motion.div>
            )
          })}

          {/* Empty state */}
          {active.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-white/20">Aucun RDV planifié aujourd&apos;hui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
