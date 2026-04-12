'use client'

import { motion } from 'framer-motion'
import { Filter, ArrowDown } from 'lucide-react'

interface Props {
  visitors: number
  calendarClicks: number
  confirmedRdv: number
}

interface FunnelStep {
  label: string
  sublabel: string
  value: number
  color: string
  glowColor: string
}

export default function ConversionFunnel({ visitors, calendarClicks, confirmedRdv }: Props) {
  const clickRate = visitors > 0 ? Math.round((calendarClicks / visitors) * 100) : 0
  const confirmRate = calendarClicks > 0 ? Math.round((confirmedRdv / calendarClicks) * 100) : 0
  const globalRate = visitors > 0 ? ((confirmedRdv / visitors) * 100).toFixed(1) : '0'

  const steps: FunnelStep[] = [
    {
      label: 'Visiteurs',
      sublabel: 'Arrivées sur le site',
      value: visitors,
      color: 'rgba(165, 243, 252, 0.18)',
      glowColor: '#A5F3FC',
    },
    {
      label: 'Clics Calendrier',
      sublabel: 'Intérêt confirmé',
      value: calendarClicks,
      color: 'rgba(167, 139, 250, 0.22)',
      glowColor: '#A78BFA',
    },
    {
      label: 'RDV Confirmés',
      sublabel: 'Conversion finale',
      value: confirmedRdv,
      color: 'rgba(139, 92, 246, 0.35)',
      glowColor: '#8B5CF6',
    },
  ]

  const maxValue = visitors || 1
  const widths = steps.map((s) => Math.max(30, (s.value / maxValue) * 100))

  return (
    <div className="frozen-card rounded-2xl p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-neon/15 flex items-center justify-center">
            <Filter className="w-4 h-4 text-violet-bright" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Tunnel de Conversion
            </span>
            <p className="text-[10px] text-slate-600">Parcours client glacial</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-slate-600">Taux global</div>
          <div className="text-lg font-bold font-mono gradient-text">{globalRate}%</div>
        </div>
      </div>

      {/* Funnel */}
      <div className="flex-1 flex flex-col gap-2 justify-center">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col gap-1">
            {/* Trapezoid */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
              className="flex justify-center"
            >
              <div
                className="relative h-12 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-500"
                style={{
                  width: `${widths[i]}%`,
                  background: step.color,
                  border: `0.5px solid ${step.glowColor}30`,
                  boxShadow: `0 0 20px ${step.glowColor}20`,
                }}
              >
                {/* Noise texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-sm font-bold font-mono text-white">
                    {step.value.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-[10px] text-slate-300 hidden sm:block">{step.label}</span>
                </div>
              </div>
            </motion.div>

            {/* Arrow + conversion rate between steps */}
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.4 }}
                className="flex items-center justify-center gap-2"
              >
                <ArrowDown className="w-3 h-3 text-slate-600" />
                <span className="text-[10px] font-mono text-slate-500">
                  {i === 0 ? clickRate : confirmRate}% de conversion
                </span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Footer labels */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06]">
        {steps.map((step) => (
          <div key={step.label} className="text-center">
            <div className="text-[9px] text-slate-600 mb-0.5">{step.sublabel}</div>
            <div className="text-xs font-bold font-mono" style={{ color: step.glowColor }}>
              {step.value.toLocaleString('fr-FR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
