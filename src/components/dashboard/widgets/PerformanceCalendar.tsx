'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Zap } from 'lucide-react'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const WEEKS = ['S-2', 'S-1', 'Cette sem.', 'S+1']

interface Props {
  weeklyAppointments: number[][]
  averageBasket: number
}

function intensityColor(val: number, max: number): string {
  if (val === 0) return 'rgba(255,255,255,0.03)'
  const ratio = val / max
  const r1 = { r: 165, g: 243, b: 252 } // cyan.pale
  const r2 = { r: 139, g: 92, b: 246 }  // violet.neon
  const r = Math.round(r1.r + (r2.r - r1.r) * ratio)
  const g = Math.round(r1.g + (r2.g - r1.g) * ratio)
  const b = Math.round(r1.b + (r2.b - r1.b) * ratio)
  return `rgba(${r},${g},${b},${0.15 + ratio * 0.65})`
}

export default function PerformanceCalendar({ weeklyAppointments, averageBasket }: Props) {
  const [hovered, setHovered] = useState<{ week: number; day: number } | null>(null)
  const allValues = weeklyAppointments.flat()
  const maxVal = Math.max(...allValues, 1)

  const hoveredVal = hovered ? weeklyAppointments[hovered.week]?.[hovered.day] ?? 0 : 0
  const isPredictive = hovered ? hovered.week >= 2 : false

  return (
    <div className="frozen-card rounded-2xl p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-neon/15 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-violet-bright" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Calendrier de Performance
            </span>
            <p className="text-[10px] text-slate-600">Activité & pics prédictifs</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-violet-bright border border-violet-neon/20 bg-violet-neon/10 px-2 py-1 rounded-full">
          <Zap className="w-2.5 h-2.5" />
          Prédictif actif
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-8 gap-1.5">
        <div className="text-[9px] text-slate-700 font-mono" />
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9px] text-slate-500 font-mono">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 flex flex-col gap-1.5">
        {WEEKS.map((week, wi) => {
          const isPredWeek = wi >= 2
          return (
            <div key={week} className="grid grid-cols-8 gap-1.5 flex-1">
              <div className={`
                flex items-center text-[8px] font-mono
                ${isPredWeek ? 'text-violet-bright' : 'text-slate-600'}
              `}>
                {week}
              </div>
              {DAYS.map((_, di) => {
                const val = weeklyAppointments[wi]?.[di] ?? 0
                const isHov = hovered?.week === wi && hovered?.day === di
                const color = intensityColor(val, maxVal)
                return (
                  <motion.div
                    key={di}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: wi * 0.05 + di * 0.02 }}
                    onMouseEnter={() => setHovered({ week: wi, day: di })}
                    onMouseLeave={() => setHovered(null)}
                    className="relative rounded-lg flex-1 flex items-center justify-center cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: color,
                      border: isPredWeek
                        ? '0.5px dashed rgba(139,92,246,0.3)'
                        : `0.5px solid ${val > 0 ? 'rgba(165,243,252,0.15)' : 'rgba(255,255,255,0.03)'}`,
                      boxShadow: isHov ? `0 0 12px ${color}` : 'none',
                      minHeight: 28,
                    }}
                  >
                    {val > 0 && (
                      <span className="text-[9px] font-bold font-mono text-white/80">{val}</span>
                    )}
                    {isPredWeek && val > 0 && (
                      <Zap className="absolute top-0.5 right-0.5 w-1.5 h-1.5 text-violet-bright opacity-60" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="px-3 py-2 rounded-xl border border-white/[0.08] bg-black/40"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-white">
                  {hoveredVal} RDV · {DAYS[hovered.day]} {WEEKS[hovered.week]}
                </span>
                {isPredictive && (
                  <span className="ml-2 text-[9px] text-violet-bright font-mono">(prédictif)</span>
                )}
              </div>
              <span className="text-[10px] font-mono text-green-400">
                +{(hoveredVal * averageBasket).toLocaleString('fr-FR')}€
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(165,243,252,0.3)' }} />
          <span className="text-[9px] text-slate-500">Passé</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm border border-dashed border-violet-neon/40" style={{ backgroundColor: 'rgba(139,92,246,0.2)' }} />
          <span className="text-[9px] text-slate-500">Prédictif</span>
        </div>
      </div>
    </div>
  )
}
