'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

const DATA_POINTS = [20, 35, 28, 55, 48, 72, 65, 88, 78, 105, 95, 128]
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

function buildPath(points: number[], w: number, h: number, padding = 20): string {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const xs = points.map((_, i) => padding + (i / (points.length - 1)) * (w - padding * 2))
  const ys = points.map((p) => h - padding - ((p - min) / range) * (h - padding * 2))

  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < points.length; i++) {
    const cpx1 = (xs[i - 1] + xs[i]) / 2
    const cpy1 = ys[i - 1]
    const cpx2 = (xs[i - 1] + xs[i]) / 2
    const cpy2 = ys[i]
    d += ` C ${cpx1} ${cpy1} ${cpx2} ${cpy2} ${xs[i]} ${ys[i]}`
  }
  return d
}

function buildArea(points: number[], w: number, h: number, padding = 20): string {
  const path = buildPath(points, w, h, padding)
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const xs = points.map((_, i) => padding + (i / (points.length - 1)) * (w - padding * 2))
  const firstX = xs[0]
  const lastX = xs[xs.length - 1]
  return `${path} L ${lastX} ${h - padding} L ${firstX} ${h - padding} Z`
}

export default function OtterFlowAnalytics() {
  const [progress, setProgress] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const W = 260, H = 140, PAD = 16

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start: number | null = null
      const animate = (ts: number) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / 1800, 1)
        setProgress(p)
        if (p < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, 300)
    return () => clearTimeout(timeout)
  }, [])

  const max = Math.max(...DATA_POINTS)
  const min = Math.min(...DATA_POINTS)
  const range = max - min || 1
  const xs = DATA_POINTS.map((_, i) => PAD + (i / (DATA_POINTS.length - 1)) * (W - PAD * 2))
  const ys = DATA_POINTS.map((p) => H - PAD - ((p - min) / range) * (H - PAD * 2))

  const linePath = buildPath(DATA_POINTS, W, H, PAD)
  const areaPath = buildArea(DATA_POINTS, W, H, PAD)
  const totalLength = 900

  const currentROI = Math.round(128 * progress + 20 * (1 - progress))

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header metrics */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs dark:text-slate-500 text-charcoal/50 font-medium mb-0.5">ROI Cumulé</div>
          <div className="flex items-end gap-1.5">
            <motion.span
              className="font-serif font-bold text-2xl gradient-text"
              animate={{ opacity: [0.7, 1] }}
            >
              +{currentROI}%
            </motion.span>
            <TrendingUp className="w-4 h-4 text-cyan-glacial mb-1" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs dark:text-slate-500 text-charcoal/50 mb-0.5">vs. N-1</div>
          <div className="text-sm font-semibold text-green-400">↑ 42%</div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative flex-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.0)" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={PAD} y1={PAD + t * (H - PAD * 2)}
              x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={0.5}
              strokeDasharray="3,3"
            />
          ))}

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#areaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            strokeDasharray={totalLength}
            strokeDashoffset={totalLength * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />

          {/* Data points */}
          {DATA_POINTS.map((_, i) => {
            const visible = i / (DATA_POINTS.length - 1) <= progress
            const isHovered = hoverIndex === i
            return (
              <g key={i} opacity={visible ? 1 : 0}>
                <circle
                  cx={xs[i]} cy={ys[i]}
                  r={isHovered ? 5 : 3}
                  fill={isHovered ? '#22D3EE' : '#8B5CF6'}
                  stroke={isHovered ? 'rgba(34,211,238,0.4)' : 'rgba(139,92,246,0.3)'}
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ transition: 'all 0.2s, opacity 0.3s' }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="cursor-pointer"
                />
                {isHovered && (
                  <g>
                    <rect
                      x={xs[i] - 18} y={ys[i] - 22}
                      width={36} height={16}
                      rx={3}
                      fill="rgba(14,20,40,0.9)"
                      stroke="rgba(34,211,238,0.3)"
                      strokeWidth={0.5}
                    />
                    <text
                      x={xs[i]} y={ys[i] - 11}
                      textAnchor="middle"
                      fill="#22D3EE"
                      fontSize={9}
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      +{DATA_POINTS[i]}%
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Month labels */}
          {MONTHS.map((m, i) => (
            <text
              key={i}
              x={xs[i]} y={H - 2}
              textAnchor="middle"
              fill="rgba(148,163,184,0.5)"
              fontSize={7}
              fontFamily="monospace"
            >
              {m}
            </text>
          ))}
        </svg>
      </div>

      {/* Footer KPIs */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/[0.05]">
        {[
          { label: 'Leads/mois', value: '847' },
          { label: 'Conv. %', value: '34.2' },
          { label: 'CA généré', value: '128K€' },
        ].map((kpi) => (
          <div key={kpi.label} className="text-center">
            <div className="text-[10px] dark:text-slate-600 text-charcoal/40 mb-0.5">{kpi.label}</div>
            <div className="text-xs font-bold dark:text-slate-300 text-charcoal/80 font-mono">{kpi.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
