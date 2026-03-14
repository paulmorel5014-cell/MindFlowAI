'use client'

import { motion } from 'framer-motion'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface Props {
  isLoading: boolean
  isDemo: boolean
  onRefresh: () => void
}

export default function DashboardHeader({ isLoading, isDemo, onRefresh }: Props) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] frozen-card rounded-none">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold gradient-text font-mono tracking-tight">
            OtterFlow Analytics
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-violet-neon/30 text-violet-bright bg-violet-neon/10 font-mono uppercase tracking-wider">
            Moteur de Flux Prédictif
          </span>
        </div>
        <p className="text-xs text-slate-500 capitalize mt-0.5">{dateStr}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection indicator */}
        <div className={`flex items-center gap-1.5 text-xs ${isDemo ? 'text-amber-400' : 'text-green-400'}`}>
          {isDemo
            ? <WifiOff className="w-3.5 h-3.5" />
            : <Wifi className="w-3.5 h-3.5" />
          }
          <span className="hidden sm:inline font-mono">
            {isDemo ? 'Démo' : 'Live'}
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-cyan-pale/30 text-slate-400 hover:text-cyan-pale transition-all text-xs disabled:opacity-50"
        >
          <motion.div
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </motion.div>
          <span className="hidden sm:inline">Actualiser</span>
        </button>

        {/* Live pulse */}
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-cyan-pale"
          />
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </header>
  )
}
