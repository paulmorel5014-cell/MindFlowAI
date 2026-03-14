'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { generateSlots, hasAvailableSlot, Service } from '@/lib/rdv-store'

const DAY_NAMES = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** Returns Monday = 0 … Sunday = 6 */
function getFirstWeekday(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

interface Props {
  service: Service
  selectedDate: string | null
  selectedTime: string | null
  onSelect: (date: string, time: string) => void
}

const slideVariants = {
  enter: (dir: 1 | -1) => ({ x: dir * 50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({ x: dir * -50, opacity: 0 }),
}

export default function FrozenCalendar({ service, selectedDate, selectedTime, onSelect }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [dir, setDir] = useState<1 | -1>(1)
  const [activeDay, setActiveDay] = useState<string | null>(selectedDate)

  const todayStr = formatDate(now.getFullYear(), now.getMonth(), now.getDate())

  // Compute which days have at least one slot
  const availableDays = useMemo(() => {
    const set = new Set<string>()
    const days = getDaysInMonth(year, month)
    for (let d = 1; d <= days; d++) {
      const dateStr = formatDate(year, month, d)
      if (dateStr < todayStr) continue
      const dow = new Date(year, month, d).getDay()
      if (dow === 0 || dow === 6) continue // No weekends
      if (hasAvailableSlot(dateStr, service.duration)) set.add(dateStr)
    }
    return set
  }, [year, month, service.duration, todayStr])

  // Slots for selected day
  const slots = useMemo(
    () => (activeDay ? generateSlots(activeDay, service.duration) : []),
    [activeDay, service.duration],
  )

  const goMonth = (delta: 1 | -1) => {
    setDir(delta)
    setActiveDay(null)
    if (delta === 1) {
      if (month === 11) { setMonth(0); setYear((y) => y + 1) }
      else setMonth((m) => m + 1)
    } else {
      if (month === 0) { setMonth(11); setYear((y) => y - 1) }
      else setMonth((m) => m - 1)
    }
  }

  const canGoPrev = !(year === now.getFullYear() && month === now.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstWeekday = getFirstWeekday(year, month)

  return (
    <div className="space-y-3">
      {/* ── Calendar ── */}
      <div className="frozen-card rounded-2xl border border-white/[0.07] p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => canGoPrev && goMonth(-1)}
            disabled={!canGoPrev}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-white/50" />
          </button>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.span
              key={`${year}-${month}`}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="text-sm font-semibold text-white/75 capitalize select-none"
            >
              {MONTH_NAMES[month]} {year}
            </motion.span>
          </AnimatePresence>

          <button
            onClick={() => goMonth(1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Day name headers */}
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-[10px] text-white/25 font-medium py-0.5">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`grid-${year}-${month}`}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="grid grid-cols-7 gap-1"
          >
            {/* Empty cells */}
            {Array.from({ length: firstWeekday }, (_, i) => (
              <div key={`e-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dateStr = formatDate(year, month, day)
              const isToday = dateStr === todayStr
              const isPast = dateStr < todayStr
              const dow = new Date(year, month, day).getDay()
              const isWeekend = dow === 0 || dow === 6
              const isAvailable = availableDays.has(dateStr)
              const isActive = dateStr === activeDay
              const disabled = isPast || isWeekend || !isAvailable

              return (
                <motion.button
                  key={day}
                  onClick={() => !disabled && setActiveDay(dateStr)}
                  disabled={disabled}
                  whileHover={!disabled ? { scale: 1.12 } : {}}
                  whileTap={!disabled ? { scale: 0.93 } : {}}
                  className={`
                    relative aspect-square rounded-lg text-[11px] font-medium flex items-center justify-center
                    transition-all duration-200 select-none
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-violet-neon to-cyan-glacial text-white shadow-[0_0_16px_rgba(139,92,246,0.55)]'
                        : isToday
                        ? 'bg-violet-neon/[0.18] border border-violet-neon/40 text-violet-bright'
                        : isAvailable
                        ? 'bg-cyan-glacial/[0.07] border border-cyan-glacial/[0.18] text-white/65 cursor-pointer hover:bg-cyan-glacial/[0.14] hover:border-cyan-glacial/35'
                        : 'text-white/15 cursor-not-allowed'
                    }
                  `}
                >
                  {day}
                  {/* Soft pulse ring on available days */}
                  {isAvailable && !isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-lg border border-cyan-glacial/25 pointer-events-none"
                      animate={{ opacity: [0.25, 0.7, 0.25], scale: [1, 1.06, 1] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: (day % 9) * 0.18,
                      }}
                    />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Time slots ── */}
      <AnimatePresence>
        {activeDay && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="frozen-card rounded-2xl border border-white/[0.07] p-4"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-cyan-glacial capitalize">
                {new Date(activeDay + 'T12:00:00').toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/35">
                {slots.length} créneau{slots.length > 1 ? 'x' : ''} libre{slots.length > 1 ? 's' : ''}
              </span>
            </div>

            {slots.length === 0 ? (
              <p className="text-center py-4 text-white/30 text-sm">Aucun créneau disponible ce jour</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((time, i) => {
                  const isSelectedSlot = selectedTime === time && selectedDate === activeDay
                  return (
                    <motion.button
                      key={time}
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.025 }}
                      onClick={() => onSelect(activeDay, time)}
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.94 }}
                      className={`
                        relative py-2 rounded-xl text-[11px] font-mono font-semibold transition-all duration-200
                        ${
                          isSelectedSlot
                            ? 'border border-cyan-glacial text-cyan-ice shadow-[0_0_14px_rgba(6,182,212,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]'
                            : 'border border-white/[0.09] text-white/45 hover:border-white/[0.2] hover:text-white/65 bg-white/[0.03]'
                        }
                      `}
                      style={
                        isSelectedSlot
                          ? {
                              background:
                                'linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(6,182,212,0.08) 100%)',
                            }
                          : undefined
                      }
                    >
                      {/* Inner ice shimmer on selected */}
                      {isSelectedSlot && (
                        <motion.div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          animate={{ opacity: [0.4, 0.9, 0.4] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(103,232,249,0.08) 0%, transparent 60%)',
                          }}
                        />
                      )}
                      <span className="relative z-10">{time}</span>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
