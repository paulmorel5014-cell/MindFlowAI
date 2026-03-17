'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, LayoutDashboard, Zap, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import BookingTunnel from '@/components/rdv-auto/BookingTunnel'
import AdminTimeline from '@/components/rdv-auto/AdminTimeline'
import { initializeStore } from '@/lib/rdv-store'
import { useAuth } from '@/hooks/useAuth'

type View = 'booking' | 'admin'

export default function RDVAutoPage() {
  const [view, setView] = useState<View>('booking')
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    initializeStore()
  }, [])

  return (
    <div
      className="min-h-screen noise-overlay"
      style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0F1628 55%, #0A0F1E 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-violet-neon/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/5 w-[400px] h-[400px] bg-cyan-glacial/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-glacial/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Header ── */}
        <header className="sticky top-0 z-20 border-b border-white/[0.06] backdrop-blur-xl bg-space/70">
          <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Back link */}
            <Link
              href="/"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/10 transition-all flex-shrink-0"
              title="Retour à MindFlow"
            >
              <ArrowLeft className="w-4 h-4 text-white/40" />
            </Link>

            {/* Brand */}
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-neon to-cyan-glacial flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none">RDV Auto</h1>
                <p className="text-[10px] text-white/30 font-mono leading-none mt-0.5">
                  OtterFlow Ecosystem
                </p>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex gap-0.5 p-1 bg-white/[0.04] rounded-xl border border-white/[0.07]">
              <button
                onClick={() => setView('booking')}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${
                    view === 'booking'
                      ? 'bg-violet-neon/[0.25] text-violet-bright border border-violet-neon/30'
                      : 'text-white/30 hover:text-white/50'
                  }
                `}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Réservation</span>
              </button>
              <button
                onClick={() => setView('admin')}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${
                    view === 'admin'
                      ? 'bg-violet-neon/[0.25] text-violet-bright border border-violet-neon/30'
                      : 'text-white/30 hover:text-white/50'
                  }
                `}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Artisan</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6">
          <AnimatePresence mode="wait">
            {view === 'booking' ? (
              <motion.div
                key="booking"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
              >
                {/* Client header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-neon/[0.1] border border-violet-neon/25 mb-3">
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-violet-bright"
                    />
                    <span className="text-[11px] text-violet-bright/80 font-mono">Prise de RDV en ligne</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Réservez votre intervention
                  </h1>
                  <p className="text-sm text-white/40">
                    3 étapes simples, confirmation instantanée.
                  </p>
                </div>

                <BookingTunnel />
              </motion.div>
            ) : (
              <motion.div
                key="admin"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
              >
                {/* Admin header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-glacial/[0.1] border border-cyan-glacial/25 mb-3">
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-glacial"
                    />
                    <span className="text-[11px] text-cyan-glacial/80 font-mono">Vue Artisan — Accès sécurisé</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Moteur de Synchronisation Temporelle
                  </h1>
                  <p className="text-sm text-white/40">
                    Gérez votre planning, confirmez les RDV, suivez votre charge de travail.
                  </p>
                </div>

                {/* Auth gate */}
                {authLoading ? (
                  <div className="flex justify-center py-16">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="text-xs font-mono text-white/30 tracking-widest uppercase"
                    >
                      Vérification…
                    </motion.div>
                  </div>
                ) : !user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="frozen-card rounded-2xl p-8 flex flex-col items-center text-center gap-5 border border-white/[0.07]"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', boxShadow: '0 0 32px rgba(139,92,246,0.35)' }}
                    >
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white mb-1">Accès réservé aux artisans</h2>
                      <p className="text-sm text-white/40 max-w-xs">
                        Connectez-vous à votre espace MindFlow pour accéder au tableau de bord artisan.
                      </p>
                    </div>
                    <Link
                      href={`/login?from=${encodeURIComponent('/rdv-auto')}`}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}
                    >
                      Se connecter
                    </Link>
                  </motion.div>
                ) : (
                  <AdminTimeline />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.05] py-4">
          <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
            <span className="text-[10px] text-white/20 font-mono">RDV Auto v1.0 — OtterFlow Ecosystem</span>
            <div className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 rounded-full bg-green-400"
              />
              <span className="text-[10px] text-white/20 font-mono">Système opérationnel</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
