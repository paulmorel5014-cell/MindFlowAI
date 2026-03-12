'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LOG_LINES = [
  '> Initialisation algorithme...',
  '> Scanning: Paris 8ème — secteur premium',
  '> Analyse flux démographiques...',
  '> Signal détecté: 847 prospects actifs',
  '> Filtrage comportemental en cours...',
  '> Scoring prédictif: 94.2%',
  '> 127 opportunités qualifiées',
  '> Segmentation terminée ✓',
  '> Déploiement séquences...',
  '> Connexions établies: 43',
  '> Taux d\'engagement: 78.3%',
  '> Nouveaux leads: +12 ce soir',
]

const BLIPS = [
  { angle: 45, dist: 0.35, size: 3, color: '#22D3EE', delay: 0.3 },
  { angle: 120, dist: 0.6, size: 4, color: '#A78BFA', delay: 0.8 },
  { angle: 200, dist: 0.45, size: 2.5, color: '#22D3EE', delay: 1.4 },
  { angle: 300, dist: 0.55, size: 3.5, color: '#22D3EE', delay: 0.5 },
  { angle: 60, dist: 0.75, size: 2, color: '#A78BFA', delay: 1.1 },
  { angle: 160, dist: 0.3, size: 3, color: '#22D3EE', delay: 1.8 },
  { angle: 250, dist: 0.65, size: 2, color: '#A78BFA', delay: 0.9 },
  { angle: 330, dist: 0.4, size: 4, color: '#22D3EE', delay: 0.2 },
]

export default function ProspectRadar() {
  const [logIndex, setLogIndex] = useState(0)
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([LOG_LINES[0]])
  const [sweepAngle, setSweepAngle] = useState(0)
  const [revealedBlips, setRevealedBlips] = useState<number[]>([])

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIndex((i) => {
        const next = (i + 1) % LOG_LINES.length
        setDisplayedLogs((prev) => {
          const updated = [...prev, LOG_LINES[next]]
          return updated.slice(-5)
        })
        return next
      })
    }, 1200)
    return () => clearInterval(logTimer)
  }, [])

  useEffect(() => {
    let raf: number
    let start: number | null = null
    const duration = 3000
    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = (ts - start) % duration
      const angle = (elapsed / duration) * 360
      setSweepAngle(angle)

      // Reveal blips when sweep passes them
      BLIPS.forEach((blip, i) => {
        if (angle >= blip.angle && !revealedBlips.includes(i)) {
          setRevealedBlips((prev) => [...prev, i])
        }
      })

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [revealedBlips])

  const R = 90 // SVG radius

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Radar display */}
      <div className="relative flex-1 flex items-center justify-center">
        <svg
          viewBox="-100 -100 200 200"
          className="w-full max-w-[200px]"
          style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.3))' }}
        >
          {/* Rings */}
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <circle
              key={r}
              cx={0} cy={0}
              r={R * r}
              fill="none"
              stroke="rgba(6,182,212,0.15)"
              strokeWidth={0.5}
            />
          ))}

          {/* Crosshairs */}
          <line x1={-R} y1={0} x2={R} y2={0} stroke="rgba(6,182,212,0.1)" strokeWidth={0.5} />
          <line x1={0} y1={-R} x2={0} y2={R} stroke="rgba(6,182,212,0.1)" strokeWidth={0.5} />

          {/* Sweep gradient */}
          <defs>
            <radialGradient id="sweepGrad" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="rgba(6,182,212,0.0)" />
              <stop offset="60%" stopColor="rgba(6,182,212,0.08)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0.25)" />
            </radialGradient>
          </defs>

          {/* Sweep line */}
          <g transform={`rotate(${sweepAngle})`}>
            <line
              x1={0} y1={0}
              x2={0} y2={-R}
              stroke="rgba(6,182,212,0.9)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Sweep glow sector */}
            <path
              d={`M 0 0 L ${R * Math.sin(-0.3)} ${-R * Math.cos(-0.3)} A ${R} ${R} 0 0 0 0 ${-R} Z`}
              fill="rgba(6,182,212,0.06)"
            />
          </g>

          {/* Blips */}
          {BLIPS.map((blip, i) => {
            const rad = (blip.angle * Math.PI) / 180 - Math.PI / 2
            const bx = Math.cos(rad) * R * blip.dist
            const by = Math.sin(rad) * R * blip.dist
            const visible = revealedBlips.includes(i)
            return (
              <g key={i} opacity={visible ? 1 : 0} style={{ transition: 'opacity 0.3s' }}>
                {/* Ping rings */}
                {visible && (
                  <>
                    <circle cx={bx} cy={by} r={blip.size * 2} fill={blip.color} opacity={0.1} />
                    <circle cx={bx} cy={by} r={blip.size} fill={blip.color} opacity={0.8} />
                  </>
                )}
              </g>
            )
          })}

          {/* Center dot */}
          <circle cx={0} cy={0} r={2} fill="#06B6D4" />
        </svg>

        {/* Live counter badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-glacial/10 border border-cyan-glacial/20">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-glacial"
          />
          <span className="text-[10px] font-mono text-cyan-glacial font-semibold">
            {revealedBlips.length} signaux
          </span>
        </div>
      </div>

      {/* Console log */}
      <div className="rounded-xl bg-black/30 border border-white/[0.06] p-3 font-mono text-[10px] overflow-hidden h-28">
        <div className="text-cyan-glacial/60 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-glacial animate-pulse" />
          PROSPECT_RADAR v3.2 — Live
        </div>
        <div className="space-y-0.5 overflow-hidden h-[72px]">
          {displayedLogs.map((line, i) => (
            <motion.div
              key={`${line}-${i}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={i === displayedLogs.length - 1 ? 'text-cyan-ice' : 'text-slate-500'}
            >
              {line}
              {i === displayedLogs.length - 1 && (
                <span className="cursor-blink text-cyan-glacial ml-0.5">█</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
