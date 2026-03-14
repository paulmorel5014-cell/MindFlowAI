'use client'

import { motion } from 'framer-motion'
import { HeartPulse } from 'lucide-react'

interface Props {
  fillRate: number
  conversionRate: number
  revenueTrend: number
}

function getScoreLabel(score: number): { label: string; color: string; emoji: string } {
  if (score >= 75) return { label: 'Optimal', color: '#A5F3FC', emoji: '⚡' }
  if (score >= 50) return { label: 'En Développement', color: '#A78BFA', emoji: '📈' }
  if (score >= 25) return { label: 'Attention Requise', color: '#FCD34D', emoji: '⚠️' }
  return { label: 'Action Urgente', color: '#F87171', emoji: '🔴' }
}

function getMotivationText(score: number): string {
  if (score >= 75) return 'Votre activité est en pleine santé. Continuez sur cette lancée et anticipez la croissance.'
  if (score >= 50) return 'Bon potentiel détecté. Quelques optimisations vous permettront d\'atteindre votre pleine capacité.'
  if (score >= 25) return 'Des opportunités inexploitées ont été identifiées. Une action ciblée peut transformer vos résultats.'
  return 'Le Moteur de Flux Prédictif a détecté des signaux critiques. Agissez maintenant pour relancer votre activité.'
}

export default function HealthScore({ fillRate, conversionRate, revenueTrend }: Props) {
  // Composite score formula
  const normalizedConversion = Math.min(conversionRate * 5, 100) // 20% conv = 100 points
  const normalizedTrend = Math.min(Math.max((revenueTrend + 30) / 60 * 100, 0), 100) // -30% to +30%
  const score = Math.round(fillRate * 0.4 + normalizedConversion * 0.35 + normalizedTrend * 0.25)
  const { label, color, emoji } = getScoreLabel(score)

  // SVG gauge
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - score / 100)
  const angle = (score / 100) * 270 - 135 // -135° to 135°
  const rad = (angle * Math.PI) / 180
  const dotX = 70 + radius * Math.cos(rad)
  const dotY = 72 + radius * Math.sin(rad)

  return (
    <div className="frozen-card rounded-2xl p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
          <HeartPulse className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Score de Santé Business
          </span>
          <p className="text-[10px] text-slate-600">Intelligence de Marché</p>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-shrink-0" style={{ width: 140, height: 100 }}>
          <svg viewBox="0 0 140 100" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A5F3FC" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <filter id="gaugeGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Background arc */}
            <path
              d="M 18 88 A 52 52 0 1 1 122 88"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={10}
              strokeLinecap="round"
            />
            {/* Score arc */}
            <motion.path
              d="M 18 88 A 52 52 0 1 1 122 88"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circumference * 0.75}
              initial={{ strokeDashoffset: circumference * 0.75 }}
              animate={{ strokeDashoffset: (circumference * 0.75) * (1 - score / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              filter="url(#gaugeGlow)"
            />
            {/* Dot */}
            <motion.circle
              cx={dotX}
              cy={dotY}
              r={5}
              fill={color}
              filter="url(#gaugeGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            />
            {/* Score text */}
            <text x="70" y="78" textAnchor="middle" fill="white" fontSize={24} fontWeight="bold" fontFamily="monospace">
              {score}
            </text>
            <text x="70" y="90" textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize={7} fontFamily="monospace">
              / 100
            </text>
          </svg>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div className="text-xs font-bold" style={{ color }}>
              {emoji} {label}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              {getMotivationText(score)}
            </p>
          </div>
        </div>
      </div>

      {/* Component breakdown */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        {[
          { label: 'Taux de remplissage', value: fillRate, weight: '40%' },
          { label: 'Taux de conversion', value: Math.round(normalizedConversion), weight: '35%' },
          { label: 'Tendance revenus', value: Math.round(normalizedTrend), weight: '25%' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-slate-500">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-600">{item.weight}</span>
                <span className="text-[9px] font-mono font-bold text-white">{item.value}%</span>
              </div>
            </div>
            <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #A5F3FC, #8B5CF6)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
