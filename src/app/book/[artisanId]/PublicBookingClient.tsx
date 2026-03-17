'use client'

import { motion } from 'framer-motion'
import { Zap, CalendarDays } from 'lucide-react'
import BookingTunnel from '@/components/rdv-auto/BookingTunnel'
import type { Service, Appointment } from '@/lib/rdv-store'

interface Props {
  artisanId: string
  artisanName: string
  services: Service[]
  appointments: Appointment[]
}

export default function PublicBookingClient({ artisanId, artisanName, services, appointments }: Props) {
  return (
    <div
      className="min-h-screen noise-overlay"
      style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0F1628 55%, #0A0F1E 100%)' }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-violet-neon/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/5 w-[400px] h-[400px] bg-cyan-glacial/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-white/[0.06] backdrop-blur-xl bg-space/70">
          <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-neon to-cyan-glacial flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(139,92,246,0.4)]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-sm font-bold text-white leading-none">RDV Auto</h1>
              <p className="text-[10px] text-white/30 font-mono leading-none mt-0.5">
                {artisanName}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/[0.1] border border-green-500/20">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-400"
              />
              <span className="text-[10px] text-green-400 font-mono">Disponible</span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-neon/[0.1] border border-violet-neon/25 mb-3">
                <CalendarDays className="w-3 h-3 text-violet-bright" />
                <span className="text-[11px] text-violet-bright/80 font-mono">Prise de RDV en ligne</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Réservez votre intervention
              </h1>
              <p className="text-sm text-white/40">
                3 étapes simples · Confirmation instantanée · Rappel la veille
              </p>
            </div>

            <BookingTunnel
              artisanId={artisanId}
              services={services}
              appointments={appointments}
            />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.05] py-4">
          <div className="max-w-xl mx-auto px-4 text-center">
            <span className="text-[10px] text-white/20 font-mono">
              Propulsé par RDV Auto — OtterFlow Ecosystem
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
