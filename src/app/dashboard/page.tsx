'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDashboardData } from '@/hooks/useDashboardData'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import RevenuePredictor from '@/components/dashboard/widgets/RevenuePredictor'
import RDVPulse from '@/components/dashboard/widgets/RDVPulse'
import ConversionFunnel from '@/components/dashboard/widgets/ConversionFunnel'
import DemandHeatmap from '@/components/dashboard/widgets/DemandHeatmap'
import PerformanceCalendar from '@/components/dashboard/widgets/PerformanceCalendar'
import HealthScore from '@/components/dashboard/widgets/HealthScore'
import PredictiveAlerts from '@/components/dashboard/widgets/PredictiveAlerts'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const widgetVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const {
    stats,
    liveEvents,
    isLoading,
    isDemo,
    averageBasket,
    setAverageBasket,
    caActuel,
    caPrecedent,
    tendency,
    refresh,
  } = useDashboardData()

  const fillRate = stats
    ? Math.round((stats.confirmedRdv / stats.totalSlots) * 100)
    : 0

  const conversionRate = stats && stats.visitors > 0
    ? Math.round((stats.confirmedRdv / stats.visitors) * 100)
    : 0

  return (
    <div className="flex h-screen overflow-hidden bg-space">
      {/* Sidebar */}
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isDemo={isDemo}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <DashboardHeader
          isLoading={isLoading}
          isDemo={isDemo}
          onRefresh={refresh}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="frozen-card rounded-2xl h-64 bg-white/[0.02]" />
              ))}
            </div>
          )}

          {/* Dashboard bento grid */}
          {!isLoading && stats && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min"
            >
              {/* Widget 1 — Revenue Predictor (large, top-left) */}
              <motion.div
                variants={widgetVariants}
                className="lg:col-span-1 min-h-[320px]"
              >
                <RevenuePredictor
                  caActuel={caActuel}
                  caPrecedent={caPrecedent}
                  tendency={tendency}
                  confirmedRdv={stats.confirmedRdv}
                  averageBasket={averageBasket}
                  onAverageBasketChange={setAverageBasket}
                />
              </motion.div>

              {/* Widget 2 — RDV Pulse (tall, spans 2 rows on large) */}
              <motion.div
                variants={widgetVariants}
                className="lg:col-span-1 lg:row-span-2 min-h-[320px]"
              >
                <RDVPulse
                  confirmedRdv={stats.confirmedRdv}
                  totalSlots={stats.totalSlots}
                  liveEvents={liveEvents}
                />
              </motion.div>

              {/* Widget 6 — Health Score */}
              <motion.div
                variants={widgetVariants}
                className="lg:col-span-1 min-h-[320px]"
              >
                <HealthScore
                  fillRate={fillRate}
                  conversionRate={conversionRate}
                  revenueTrend={tendency}
                />
              </motion.div>

              {/* Widget 3 — Conversion Funnel */}
              <motion.div
                variants={widgetVariants}
                className="lg:col-span-1 min-h-[280px]"
              >
                <ConversionFunnel
                  visitors={stats.visitors}
                  calendarClicks={stats.calendarClicks}
                  confirmedRdv={stats.confirmedRdv}
                />
              </motion.div>

              {/* Widget 7 — Predictive Alerts */}
              <motion.div
                variants={widgetVariants}
                className="lg:col-span-1 min-h-[280px]"
              >
                <PredictiveAlerts
                  fillRate={fillRate}
                  tendency={tendency}
                  confirmedRdv={stats.confirmedRdv}
                />
              </motion.div>

              {/* Widget 4 — Demand Heatmap (wide) */}
              <motion.div
                variants={widgetVariants}
                className="md:col-span-2 lg:col-span-2 min-h-[380px]"
              >
                <DemandHeatmap regions={stats.regions} />
              </motion.div>

              {/* Widget 5 — Performance Calendar (wide) */}
              <motion.div
                variants={widgetVariants}
                className="md:col-span-2 lg:col-span-3 min-h-[280px]"
              >
                <PerformanceCalendar
                  weeklyAppointments={stats.weeklyAppointments}
                  averageBasket={averageBasket}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && !stats && (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-500">
              <p className="text-sm">Impossible de charger les données</p>
              <button
                onClick={refresh}
                className="text-xs text-cyan-pale underline underline-offset-2"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Settings section */}
          {activeSection === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4"
              onClick={() => setActiveSection('overview')}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="frozen-card rounded-2xl p-6 max-w-md w-full border border-cyan-pale/20 space-y-4"
              >
                <h2 className="text-base font-bold gradient-text font-mono">Réglages — Connexion RDV Auto</h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">URL de l&apos;API RDV Auto</label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.08] bg-black/20">
                      <span className="text-xs font-mono text-slate-600 flex-1">RDV_AUTO_API_URL</span>
                      <span className="text-[9px] text-amber-400 font-mono">Non configuré</span>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-1">
                      Définissez cette variable d&apos;environnement dans votre fichier .env pour connecter l&apos;app RDV Auto.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Webhook RDV Auto</label>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-pale/20 bg-cyan-pale/5">
                      <span className="text-xs font-mono text-cyan-pale flex-1">/api/webhooks/rdv-auto</span>
                      <span className="text-[9px] text-green-400 font-mono">Prêt</span>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-1">
                      Configurez ce endpoint dans votre app RDV Auto pour recevoir les événements en temps réel.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Panier Moyen par défaut</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={100}
                        max={2000}
                        step={10}
                        value={averageBasket}
                        onChange={(e) => setAverageBasket(Number(e.target.value))}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #A5F3FC ${((averageBasket - 100) / 1900) * 100}%, rgba(255,255,255,0.1) ${((averageBasket - 100) / 1900) * 100}%)`,
                        }}
                      />
                      <span className="text-sm font-mono text-cyan-pale font-bold w-16 text-right">
                        {averageBasket}€
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSection('overview')}
                  className="w-full py-2.5 rounded-xl shimmer-btn text-white text-sm font-semibold"
                >
                  Fermer
                </button>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
