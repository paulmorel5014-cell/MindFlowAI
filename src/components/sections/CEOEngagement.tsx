'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote } from 'lucide-react'

export default function CEOEngagement() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="vision" className="relative py-32 overflow-hidden">
      {/* Background — blurred image simulation */}
      <div className="absolute inset-0 dark:bg-space bg-ivory overflow-hidden">
        {/* Blurred abstract shapes for depth */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full dark:bg-violet-neon/[0.12] bg-violet-neon/[0.06] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] rounded-full dark:bg-cyan-glacial/[0.08] bg-cyan-glacial/[0.04] blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full dark:bg-space-mid/80 bg-white/50 blur-[60px]" />
        </div>

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-br from-violet-neon/20 via-transparent to-cyan-glacial/15 z-0" />

          {/* Main card */}
          <div className="relative z-10 frozen-card rounded-[26px] p-10 md:p-16 border border-white/[0.10] shadow-[0_30px_80px_rgba(0,0,0,0.4)]">

            {/* Quote icon */}
            <div className="flex justify-center mb-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-neon/20 to-cyan-glacial/10 border border-violet-neon/20 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                <Quote className="w-6 h-6 text-violet-bright" />
              </div>
            </div>

            {/* Section label */}
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-violet-bright uppercase tracking-widest">
                L&apos;Engagement du Fondateur
              </span>
            </div>

            {/* Letter content — signature font */}
            <div className="relative">
              {/* Decorative line */}
              <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-neon/40 via-cyan-glacial/30 to-transparent rounded-full" />

              <div className="font-typewriter text-lg md:text-xl leading-relaxed dark:text-white/90 text-charcoal/90 pl-4 space-y-5">
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  Chaque projet que nous acceptons est une promesse.
                  Non pas de résultats standardisés, mais d&rsquo;une attention
                  absolue à <em className="text-violet-bright">votre réalité.</em>
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.45, duration: 0.7 }}
                >
                  Nos algorithmes s&rsquo;adaptent à vos contraintes budgétaires —
                  parce que la croissance ne devrait jamais être
                  le privilège des seules grandes entreprises.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.7 }}
                >
                  Qu&rsquo;il s&rsquo;agisse d&rsquo;un restaurant familial ou d&rsquo;un groupe
                  international, nos moteurs prédictifs délivrent
                  la <em className="text-cyan-glacial">même précision,</em> la même excellence.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.75, duration: 0.7 }}
                  className="dark:text-slate-400 text-charcoal/60 text-xl"
                >
                  Discutons ensemble. Je m&rsquo;engage personnellement à trouver
                  la formule qui correspond à vos ambitions et à votre budget.
                </motion.p>
              </div>
            </div>

            {/* Signature block */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-12"
            >
              <div className="font-typewriter text-3xl md:text-4xl gradient-text mb-1">
                Paul Morel
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-[1px] bg-gradient-to-r from-violet-neon to-transparent" />
                <span className="text-xs dark:text-slate-500 text-charcoal/50 tracking-widest uppercase">
                  Fondateur & CEO, MindFlow
                </span>
              </div>
            </motion.div>

            {/* Frost grain effect overlay */}
            <div
              className="absolute inset-0 rounded-[26px] pointer-events-none opacity-[0.4]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
