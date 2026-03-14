'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, Calendar, Map,
  Activity, Zap, Settings, ChevronLeft, Menu, X,
  ExternalLink,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', label: 'Tableau de Bord', icon: LayoutDashboard },
  { id: 'revenue', label: 'Revenue Predictor', icon: TrendingUp },
  { id: 'pulse', label: 'Liaison RDV Auto', icon: Activity },
  { id: 'funnel', label: 'Tunnel Conversion', icon: Zap },
  { id: 'heatmap', label: 'Heatmap Demande', icon: Map },
  { id: 'calendar', label: 'Calendrier Perf.', icon: Calendar },
]

interface Props {
  activeSection: string
  onSectionChange: (id: string) => void
  isDemo: boolean
}

export default function DashboardSidebar({ activeSection, onSectionChange, isDemo }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden frozen-card rounded-xl p-2.5"
      >
        <Menu className="w-5 h-5 text-cyan-pale" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        <motion.aside
          animate={{ width: collapsed ? 72 : 240 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`
            fixed top-0 left-0 h-full z-50 flex flex-col
            frozen-card border-r border-white/[0.06] overflow-hidden
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform lg:transition-none lg:relative lg:flex-shrink-0
          `}
          style={{ minWidth: collapsed ? 72 : 240 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06] flex-shrink-0">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="text-sm font-bold gradient-text font-mono tracking-tight">
                    OtterFlow
                  </span>
                  <span className="text-[10px] text-slate-500 tracking-wider uppercase">
                    Analytics
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => { setCollapsed(!collapsed); setMobileOpen(false) }}
              className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors ml-auto"
            >
              <ChevronLeft
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id
              return (
                <button
                  key={id}
                  onClick={() => { onSectionChange(id); setMobileOpen(false) }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${isActive
                      ? 'bg-violet-neon/15 border border-violet-neon/25 text-violet-bright'
                      : 'hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-transparent'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-pale' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-medium whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </nav>

          {/* RDV Auto connection status */}
          <div className="p-3 border-t border-white/[0.06]">
            <div className={`
              flex items-center gap-2 px-3 py-2.5 rounded-xl
              ${isDemo
                ? 'bg-amber-500/10 border border-amber-500/20'
                : 'bg-green-500/10 border border-green-500/20'
              }
            `}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${isDemo ? 'bg-amber-400' : 'bg-green-400'}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className={`text-[10px] font-semibold ${isDemo ? 'text-amber-400' : 'text-green-400'}`}>
                      {isDemo ? 'Mode Démo' : 'RDV Auto Connecté'}
                    </p>
                    <p className="text-[9px] text-slate-600 truncate">
                      {isDemo ? 'Données simulées' : 'Sync en temps réel'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!collapsed && (
                <ExternalLink className="w-3 h-3 text-slate-600 flex-shrink-0" />
              )}
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onSectionChange('settings')}
                  className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all text-xs"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Réglages
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  )
}
