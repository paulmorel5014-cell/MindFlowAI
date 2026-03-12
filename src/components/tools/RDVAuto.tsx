'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, User } from 'lucide-react'

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const SLOTS = [
  { day: 3, time: '09h00', name: 'Sophie M.', type: 'Consultation initiale', confirmed: true },
  { day: 7, time: '14h30', name: 'Marc D.', type: 'Stratégie digitale', confirmed: true },
  { day: 11, time: '11h00', name: 'Isabelle R.', type: 'Audit algorithmes', confirmed: false },
  { day: 15, time: '16h00', name: 'Paul L.', type: 'Revue mensuelle', confirmed: false },
  { day: 18, time: '10h30', name: 'Claire V.', type: 'Onboarding', confirmed: false },
]

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
const activeSlotDays = [3, 7, 11, 15, 18]

export default function RDVAuto() {
  const [confirmedSlots, setConfirmedSlots] = useState([true, true, false, false, false])
  const [currentSlotIdx, setCurrentSlotIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setConfirmedSlots((prev) => {
        const nextFalse = prev.findIndex((v) => !v)
        if (nextFalse === -1) return prev
        const updated = [...prev]
        updated[nextFalse] = true
        return updated
      })
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlotIdx((i) => (i + 1) % SLOTS.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Mini calendar grid */}
      <div>
        <div className="grid grid-cols-7 gap-0.5 mb-1.5">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-[9px] dark:text-slate-600 text-charcoal/40 font-semibold py-0.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {calendarDays.map((day) => {
            const slotIdx = activeSlotDays.indexOf(day)
            const isActive = slotIdx !== -1
            const isConfirmed = isActive && confirmedSlots[slotIdx]
            const isCurrent = day === 7

            return (
              <div
                key={day}
                className={`
                  relative flex items-center justify-center aspect-square rounded-md text-[9px] font-medium transition-all duration-300
                  ${isCurrent
                    ? 'bg-gradient-to-br from-violet-neon to-cyan-glacial text-white shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                    : isConfirmed
                      ? 'bg-cyan-glacial/20 border border-cyan-glacial/40 text-cyan-ice'
                      : isActive
                        ? 'bg-violet-neon/10 border border-violet-neon/30 dark:text-violet-bright text-violet-glow'
                        : 'dark:text-slate-700 text-charcoal/20'
                  }
                `}
              >
                {day}
                {isConfirmed && !isCurrent && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-glacial" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Live booking feed */}
      <div className="flex-1 rounded-xl border border-white/[0.06] bg-black/20 overflow-hidden">
        <div className="px-3 py-2 border-b border-white/[0.05] flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-green-400"
          />
          <span className="text-[9px] font-mono dark:text-slate-500 text-charcoal/50 uppercase tracking-wider">
            Flux de réservations — Live
          </span>
        </div>
        <div className="p-2 space-y-1.5">
          <AnimatePresence mode="popLayout">
            {SLOTS.slice(0, 3).map((slot, i) => {
              const confirmed = confirmedSlots[i]
              return (
                <motion.div
                  key={slot.time + slot.name}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg border transition-all duration-500
                    ${confirmed
                      ? 'border-cyan-glacial/20 bg-cyan-glacial/[0.05]'
                      : 'border-white/[0.04] bg-white/[0.02]'
                    }
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                    ${confirmed ? 'bg-cyan-glacial/20' : 'bg-white/[0.05]'}
                  `}>
                    {confirmed
                      ? <Check className="w-2.5 h-2.5 text-cyan-glacial" />
                      : <Clock className="w-2.5 h-2.5 dark:text-slate-600 text-charcoal/30" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-semibold dark:text-white text-charcoal truncate">
                        {slot.name}
                      </span>
                      <span className="text-[9px] dark:text-slate-600 text-charcoal/40">·</span>
                      <span className="text-[9px] font-mono dark:text-slate-500 text-charcoal/50">{slot.time}</span>
                    </div>
                    <div className="text-[8px] dark:text-slate-600 text-charcoal/40 truncate">{slot.type}</div>
                  </div>
                  {confirmed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[8px] font-mono text-cyan-glacial font-semibold"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Auto-confirm badge */}
      <div className="flex items-center justify-between px-2">
        <span className="text-[9px] dark:text-slate-600 text-charcoal/40">Confirmations automatiques</span>
        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
          <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-green-400 font-semibold">Actif 24/7</span>
        </div>
      </div>
    </div>
  )
}
