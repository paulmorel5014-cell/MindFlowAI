'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageCircle, ArrowRight, Clock, Shield } from 'lucide-react'

const WA_LINK = 'https://wa.me/33781364451'

export default function Configurator() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="configurateur" className="relative py-16 md:py-28 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space-mid bg-white/40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />

      {/* Ambient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] dark:bg-cyan-glacial/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] dark:bg-violet-neon/[0.03] blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="frozen-card rounded-3xl p-10 md:p-14 text-center border dark:border-white/[0.08] border-black/[0.06] shadow-[0_30px_80px_rgba(0,0,0,0.2)]"
        >
          {/* WhatsApp icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(37,211,102,0.2), rgba(18,140,126,0.15))',
              border: '0.5px solid rgba(37,211,102,0.35)',
              boxShadow: '0 0 30px rgba(37,211,102,0.2)',
            }}
          >
            <MessageCircle className="w-8 h-8 text-green-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-fluid-md font-bold dark:text-white text-charcoal mb-4"
          >
            Parlez-nous de votre projet
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="text-base dark:text-slate-400 text-charcoal/60 leading-relaxed mb-8 max-w-sm mx-auto"
          >
            Devis gratuit, sans engagement. Notre équipe vous accompagne de A à Z et répond sous 24h.
          </motion.p>

          <motion.a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="shimmer-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white shadow-[0_0_40px_rgba(37,211,102,0.25)] hover:shadow-[0_0_60px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ '--btn-bg': 'linear-gradient(135deg, #25D366, #128C7E)' } as React.CSSProperties}
          >
            <MessageCircle className="w-5 h-5" />
            Démarrer sur WhatsApp
            <ArrowRight className="w-4 h-4" />
          </motion.a>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-7 pt-6 border-t dark:border-white/[0.06] border-black/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 dark:text-slate-500 text-charcoal/40" />
              <span className="text-xs dark:text-slate-500 text-charcoal/45">Réponse sous 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 dark:text-slate-500 text-charcoal/40" />
              <span className="text-xs dark:text-slate-500 text-charcoal/45">Devis gratuit</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
