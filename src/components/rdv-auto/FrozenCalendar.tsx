'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { generateSlots, getAppointments, hasAvailableSlot, Service } from '@/lib/rdv-store'
import { useStoreVersion } from '@/hooks/useStoreVersion'

const DAY_NAMES = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

// Max weeks in the future a client can book
const MAX_WEEKS_AHEAD = 8

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
  const storeVersion = useStoreVersion() // Re-runs memos when store changes

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [dir, setDir] = useState<1 | -1>(1)
  const [activeDay, setActiveDay] = useState<string | null>(selectedDate)

  const todayStr = formatDate(now.getFullYear(), now.getMonth(), now.getDate())

  // 8-week lookahead limit
  const maxDate = useMemo(() => {
    const d = new Date(now)
    d.setDate(d.getDate() + MAX_WEEKS_AHEAD * 7)
    return d.toISOString().split('T')[0]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // stable — computed once at mount

  // Compute available days — ONE getAppointments() call for the whole month
  const availableDays = useMemo(() => {
    const allAppts = getAppointments() // single parse
    const set = new Set<string>()
    const days = getDaysInMonth(year, month)
    for (let d = 1; d <= days; d++) {
      const dateStr = formatDate(year, month, d)
      if (dateStr < todayStr || dateStr > maxDate) continue
      const dow = new Date(year, month, d).getDay()
      if (dow === 0 || dow === 6) continue
      if (hasAvailableSlot(dateStr, service.duration, allAppts)) set.add(dateStr)
    }
    return set
  // storeVersion ensures we recompute after any booking/cancellation
  }, [year, month, service.duration, todayStr, maxDate, storeVersion])

  // Slots for selected day — fresh parse (single day, low cost)
  const slots = useMemo(
    () => (activeDay ? generateSlots(activeDay, service.duration) : []),
    // storeVersion ensures freshness after a new booking
    [activeDay, service.duration, storeVersion],
  )

  const canGoPrev = !(year === now.getFullYear() && month === now.getMonth())
  const canGoNext = (() => {
    const nextMonthFirst = formatDate(
      month === 11 ? year + 1 : year,
      month === 11 ? 0 : month + 1,
      1,
    )
    return nextMonthFirst <= maxDate
  })()

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
            onClick={() => canGoNext && goMonth(1)}
            disabled={!canGoNext}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Day name headers */}
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {DAY_NAMES.map((d, i) => (
            <div
              key={d}
              className={`text-center text-[10px] font-medium py-0.5 ${
                i >= 5 ? 'text-white/15' : 'text-white/25'
              }`}
            >
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
            {Array.from({ length: firstWeekday }, (_, i) => <div key={`e-${i}`} />)}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dateStr = formatDate(year, month, day)
              const isToday = dateStr === todayStr
              const isPast = dateStr < todayStr
              const isBeyond = dateStr > maxDate
              const dow = new Date(year, month, day).getDay()
              const isWeekend = dow === 0 || dow === 6
              const isAvailable = availableDays.has(dateStr)
              const isActive = dateStr === activeDay
              const disabled = isPast || isBeyond || isWeekend || !isAvailable

              return (
                <div key={day} className="relative group">
                  <motion.button
                    onClick={() => !disabled && setActiveDay(dateStr)}
                    disabled={disabled}
                    whileHover={!disabled ? { scale: 1.12 } : {}}
                    whileTap={!disabled ? { scale: 0.93 } : {}}
                    className={`
                      w-full aspect-square rounded-lg text-[11px] font-medium flex items-center justify-center
                      transition-all duration-200 select-none
                      ${
                        isActive
                          ? 'bg-gradient-to-br from-violet-neon to-cyan-glacial text-white shadow-[0_0_16px_rgba(139,92,246,0.55)]'
                          : isToday && isAvailable
                          ? 'bg-violet-neon/[0.18] border border-violet-neon/40 text-violet-bright'
                          : isAvailable
                          ? 'bg-cyan-glacial/[0.07] border border-cyan-glacial/[0.18] text-white/65 cursor-pointer hover:bg-cyan-glacial/[0.14] hover:border-cyan-glacial/35'
                          : isWeekend
                          ? 'text-white/12 cursor-default'
                          : 'text-white/15 cursor-not-allowed'
                      }
                    `}
                  >
                    {day}
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

                  {/* Tooltip for weekends */}
                  {isWeekend && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10 pointer-events-none">
                      <div className="bg-space/95 border border-white/[0.12] rounded-lg px-2 py-1 text-[9px] text-white/50 whitespace-nowrap backdrop-blur-md">
                        Fermé le week-end
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-glacial/[0.3] border border-cyan-glacial/40" />
            <span className="text-[10px] text-white/30">Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-violet-neon/80 to-cyan-glacial/80" />
            <span className="text-[10px] text-white/30">Sélectionné</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Info className="w-3 h-3 text-white/20" />
            <span className="text-[10px] text-white/20">Lun–Ven uniquement</span>
          </div>
        </div>
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
                          ? { background: 'linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(6,182,212,0.08) 100%)' }
                          : undefined
                      }
                    >
                      {isSelectedSlot && (
                        <motion.div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          animate={{ opacity: [0.4, 0.9, 0.4] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ background: 'linear-gradient(135deg, rgba(103,232,249,0.08) 0%, transparent 60%)' }}
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
