'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { Activity, Check, Clock, Zap } from 'lucide-react'
import type { RDVAutoEvent } from '@/app/api/dashboard/route'

interface Props {
  confirmedRdv: number
  totalSlots: number
  liveEvents: RDVAutoEvent[]
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  return `${Math.floor(diff / 3600)}h`
}

function sourceLabel(source: RDVAutoEvent['source']): string {
  switch (source) {
    case 'rdv-auto': return 'RDV Auto'
    case 'website': return 'Site Web'
    default: return 'Manuel'
  }
}

export default function RDVPulse({ confirmedRdv, totalSlots, liveEvents }: Props) {
  const fillRate = totalSlots > 0 ? Math.round((confirmedRdv / totalSlots) * 100) : 0

  const chartData = [
    { name: 'Rempli', value: fillRate, fill: '#A5F3FC' },
    { name: 'Libre', value: 100 - fillRate, fill: 'rgba(255,255,255,0.04)' },
  ]

  return (
    <div className="frozen-card rounded-2xl p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-cyan-pale/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-cyan-pale" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">The Pulse</span>
          <div className="flex items-center gap-1.5">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-green-400"
            />
            <span className="text-[9px] text-green-400 font-mono">LIVE</span>
          </div>
        </div>
      </div>

      {/* Ring chart + stats */}
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="68%" outerRadius="95%"
              startAngle={90} endAngle={-270}
              data={chartData}
            >
              <defs>
                <filter id="rdvGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: 'rgba(255,255,255,0.03)' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono text-cyan-pale leading-none">{fillRate}%</span>
            <span className="text-[9px] text-slate-500 mt-0.5">Rempli</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Confirmés</span>
            <span className="text-sm font-bold font-mono text-cyan-pale">{confirmedRdv}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Disponibles</span>
            <span className="text-sm font-bold font-mono text-slate-400">{totalSlots - confirmedRdv}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Capacité</span>
            <span className="text-sm font-bold font-mono text-slate-300">{totalSlots}</span>
          </div>
          {fillRate >= 80 && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1">
              <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="text-[9px] text-amber-400">Planning presque plein!</span>
            </div>
          )}
        </div>
      </div>

      {/* Live feed */}
      <div className="flex-1 rounded-xl border border-white/[0.06] bg-black/20 overflow-hidden min-h-0">
        <div className="px-3 py-2 border-b border-white/[0.05] flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-green-400"
          />
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
            Flux RDV Auto — Temps Réel
          </span>
        </div>
        <div className="p-2 space-y-1.5 overflow-y-auto max-h-48">
          {liveEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Activity className="w-5 h-5 text-slate-600" />
              <p className="text-[9px] text-slate-600 text-center font-mono">
                En attente d&apos;activité…<br />
                Créez un RDV pour voir les événements ici.
              </p>
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {liveEvents.slice(0, 6).map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`
                  flex items-start gap-2 p-2 rounded-lg border transition-all
                  ${event.status === 'confirmed'
                    ? 'border-cyan-pale/15 bg-cyan-pale/[0.04]'
                    : 'border-white/[0.04] bg-white/[0.02]'
                  }
                `}
              >
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                  ${event.status === 'confirmed' ? 'bg-cyan-pale/15' : 'bg-white/[0.05]'}
                `}>
                  {event.status === 'confirmed'
                    ? <Check className="w-2.5 h-2.5 text-cyan-pale" />
                    : <Clock className="w-2.5 h-2.5 text-slate-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] font-semibold text-white">{event.clientName}</span>
                    <span className="text-[8px] text-slate-600">via</span>
                    <span className="text-[8px] font-mono text-violet-bright">{sourceLabel(event.source)}</span>
                  </div>
                  <div className="text-[8px] text-slate-600 truncate">{event.service}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[9px] font-semibold font-mono text-green-400">+{event.amount}€</div>
                  <div className="text-[8px] text-slate-600">{timeAgo(event.timestamp)}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
