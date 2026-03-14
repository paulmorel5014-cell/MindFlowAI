'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { TrendingUp, TrendingDown, Euro, Sliders } from 'lucide-react'

interface Props {
  caActuel: number
  caPrecedent: number
  tendency: number
  confirmedRdv: number
  averageBasket: number
  onAverageBasketChange: (v: number) => void
}

function formatEuro(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K€`
  return `${v}€`
}

export default function RevenuePredictor({
  caActuel, caPrecedent, tendency, confirmedRdv, averageBasket, onAverageBasketChange
}: Props) {
  const [showSettings, setShowSettings] = useState(false)
  const motionVal = useMotionValue(0)
  const displayVal = useTransform(motionVal, (v) => formatEuro(Math.round(v)))
  const prevCa = useRef(0)

  useEffect(() => {
    const controls = animate(prevCa.current, caActuel, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => motionVal.set(v),
    })
    prevCa.current = caActuel
    return controls.stop
  }, [caActuel, motionVal])

  const isPositive = tendency >= 0

  return (
    <div className="frozen-card rounded-2xl p-5 h-full flex flex-col gap-4 border border-gradient-to-br from-cyan-pale/20 to-violet-neon/20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-violet-neon/15 flex items-center justify-center">
              <Euro className="w-4 h-4 text-violet-bright" />
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Revenue Predictor
            </span>
          </div>
          <p className="text-[11px] text-slate-600">CA Potentiel · Mois en cours</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-violet-neon/20 text-violet-bright' : 'hover:bg-white/[0.05] text-slate-500'}`}
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Main odometer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-4">
        <motion.div
          className="text-5xl font-bold font-mono gradient-text tracking-tight"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displayVal}
        </motion.div>

        {/* Tendency badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold font-mono ${
            isPositive
              ? 'bg-green-500/10 border-green-500/25 text-green-400'
              : 'bg-red-500/10 border-red-500/25 text-red-400'
          }`}
        >
          {isPositive
            ? <TrendingUp className="w-3.5 h-3.5" />
            : <TrendingDown className="w-3.5 h-3.5" />
          }
          {isPositive ? '+' : ''}{tendency}% vs mois précédent
        </motion.div>
      </div>

      {/* Settings panel */}
      <motion.div
        initial={false}
        animate={{ height: showSettings ? 'auto' : 0, opacity: showSettings ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="pt-3 border-t border-white/[0.06] space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400">Panier Moyen (€)</label>
              <span className="text-xs font-mono text-cyan-pale font-semibold">{averageBasket}€</span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={10}
              value={averageBasket}
              onChange={(e) => onAverageBasketChange(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #A5F3FC ${((averageBasket - 100) / 1900) * 100}%, rgba(255,255,255,0.1) ${((averageBasket - 100) / 1900) * 100}%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-slate-600 mt-1">
              <span>100€</span><span>2 000€</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer stats */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06]">
        {[
          { label: 'RDV Confirmés', value: `${confirmedRdv}` },
          { label: 'Panier Moyen', value: `${averageBasket}€` },
          { label: 'Mois Précédent', value: formatEuro(caPrecedent) },
        ].map((kpi) => (
          <div key={kpi.label} className="text-center">
            <div className="text-[9px] text-slate-600 mb-0.5">{kpi.label}</div>
            <div className="text-xs font-bold text-slate-300 font-mono">{kpi.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
