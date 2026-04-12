'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map } from 'lucide-react'

interface Region {
  name: string
  demand: number
  city: string
}

interface Props {
  regions: Region[]
}

// Simplified France regions as SVG paths (approximate outlines)
const FRANCE_REGIONS = [
  { id: 'idf', name: 'Île-de-France', city: 'Paris', cx: 310, cy: 185 },
  { id: 'ara', name: 'Auvergne-Rhône-Alpes', city: 'Lyon', cx: 340, cy: 290 },
  { id: 'paca', name: 'Provence-Alpes-Côte d\'Azur', city: 'Marseille', cx: 360, cy: 345 },
  { id: 'occ', name: 'Occitanie', city: 'Toulouse', cx: 255, cy: 325 },
  { id: 'naq', name: 'Nouvelle-Aquitaine', city: 'Bordeaux', cx: 190, cy: 280 },
  { id: 'hdf', name: 'Hauts-de-France', city: 'Lille', cx: 295, cy: 110 },
  { id: 'gest', name: 'Grand Est', city: 'Strasbourg', cx: 380, cy: 165 },
  { id: 'bret', name: 'Bretagne', city: 'Rennes', cx: 115, cy: 200 },
  { id: 'norm', name: 'Normandie', city: 'Rouen', cx: 215, cy: 150 },
  { id: 'pdl', name: 'Pays de la Loire', city: 'Nantes', cx: 165, cy: 235 },
  { id: 'bfc', name: 'Bourgogne-Franche-Comté', city: 'Dijon', cx: 360, cy: 230 },
  { id: 'cvl', name: 'Centre-Val de Loire', city: 'Orléans', cx: 255, cy: 215 },
]

function getDemandForRegion(regions: Region[], name: string): number {
  const found = regions.find((r) => r.name === name)
  return found?.demand ?? 0
}

function demandToColor(demand: number): string {
  if (demand >= 80) return '#A5F3FC'
  if (demand >= 60) return '#8B5CF6'
  if (demand >= 40) return '#6D28D9'
  if (demand >= 20) return '#3B3270'
  return '#1E1B4B'
}

export default function DemandHeatmap({ regions }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const hoveredRegion = FRANCE_REGIONS.find((r) => r.id === hovered)
  const hoveredDemand = hoveredRegion
    ? getDemandForRegion(regions, hoveredRegion.name)
    : 0

  return (
    <div className="frozen-card rounded-2xl p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-cyan-pale/10 flex items-center justify-center">
          <Map className="w-4 h-4 text-cyan-pale" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Heatmap de Demande
          </span>
          <p className="text-[10px] text-slate-600">Zones géographiques actives</p>
        </div>
      </div>

      {/* SVG Map */}
      <div className="flex-1 relative">
        <svg
          viewBox="80 90 350 290"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {FRANCE_REGIONS.map((r) => {
              const demand = getDemandForRegion(regions, r.name)
              return (
                <radialGradient key={r.id} id={`grad-${r.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={demandToColor(demand)} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={demandToColor(demand)} stopOpacity={0.15} />
                </radialGradient>
              )
            })}
            <filter id="mapGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* France outline (simplified) */}
          <path
            d="M 130 120 L 200 100 L 290 95 L 370 110 L 410 145 L 415 185 L 400 230 L 410 270 L 390 320 L 355 360 L 310 375 L 265 365 L 215 350 L 170 320 L 140 290 L 110 250 L 100 210 L 110 165 Z"
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />

          {/* Glow points per region */}
          {FRANCE_REGIONS.map((r) => {
            const demand = getDemandForRegion(regions, r.name)
            if (demand === 0) return null
            const isHov = hovered === r.id
            const radius = 8 + (demand / 100) * 18

            return (
              <g
                key={r.id}
                onMouseEnter={(e) => {
                  setHovered(r.id)
                  const rect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect()
                  if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                }}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse ring */}
                <motion.circle
                  cx={r.cx} cy={r.cy}
                  r={radius * 1.8}
                  fill="none"
                  stroke={demand >= 70 ? '#A5F3FC' : '#8B5CF6'}
                  strokeWidth={0.5}
                  animate={{ r: [radius * 1.4, radius * 2.2], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: Math.random() }}
                />
                {/* Main glow */}
                <circle
                  cx={r.cx} cy={r.cy}
                  r={radius}
                  fill={`url(#grad-${r.id})`}
                  filter="url(#mapGlow)"
                  opacity={isHov ? 1 : 0.85}
                  style={{ transition: 'opacity 0.2s, r 0.2s' }}
                />
                {/* Core dot */}
                <circle
                  cx={r.cx} cy={r.cy}
                  r={isHov ? 4 : 3}
                  fill={demand >= 70 ? '#A5F3FC' : '#A78BFA'}
                  style={{ transition: 'r 0.2s' }}
                />
                {/* City label for high-demand */}
                {(demand >= 60 || isHov) && (
                  <text
                    x={r.cx + radius + 4} y={r.cy + 4}
                    fill="rgba(148,163,184,0.7)"
                    fontSize={8}
                    fontFamily="monospace"
                  >
                    {r.city}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hovered && hoveredRegion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none frozen-card rounded-xl px-3 py-2 border border-cyan-pale/20"
              style={{
                left: Math.min(tooltipPos.x + 8, 220),
                top: Math.max(tooltipPos.y - 60, 0),
              }}
            >
              <p className="text-[10px] font-semibold text-white">{hoveredRegion.city}</p>
              <p className="text-[9px] text-slate-500">{hoveredRegion.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: demandToColor(hoveredDemand) }}
                />
                <span className="text-[10px] font-mono font-bold text-cyan-pale">
                  {hoveredDemand}% demande
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
        <span className="text-[9px] text-slate-600">Intensité :</span>
        {[
          { label: 'Faible', color: '#3B3270' },
          { label: 'Moyenne', color: '#8B5CF6' },
          { label: 'Forte', color: '#A5F3FC' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-[9px] text-slate-500">{l.label}</span>
          </div>
        ))}
        <div className="ml-auto text-[9px] text-slate-600 font-mono">
          {regions.filter((r) => r.demand > 0).length} zones actives
        </div>
      </div>
    </div>
  )
}
