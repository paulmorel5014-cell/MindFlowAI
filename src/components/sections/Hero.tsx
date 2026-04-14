'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'

const WA_LINK = 'https://wa.me/33781364451'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      id="accueil"
    >
      {/* Background */}
      <div className="absolute inset-0 dark:bg-space bg-ivory" />

      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full dark:bg-violet-neon/[0.07] bg-violet-neon/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[400px] rounded-full dark:bg-cyan-glacial/[0.06] bg-cyan-glacial/[0.03] blur-[100px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      {[
        { x: '15%', y: '20%', size: 280, color: 'rgba(139,92,246,0.12)', delay: 0 },
        { x: '80%', y: '60%', size: 200, color: 'rgba(6,182,212,0.10)', delay: 1.5 },
        { x: '60%', y: '15%', size: 150, color: 'rgba(139,92,246,0.08)', delay: 0.8 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none blur-[60px]"
          style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size, background: orb.color }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-24 w-full"
      >
        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full dark:bg-white/[0.06] bg-black/[0.04] border dark:border-white/[0.08] border-black/[0.06] mb-8"
        >
          <MapPin className="w-3 h-3 dark:text-slate-400 text-charcoal/60" />
          <span className="text-xs font-medium dark:text-slate-400 text-charcoal/60 tracking-wide">Paris &amp; France</span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-fluid-xl font-bold dark:text-white text-charcoal leading-[1.06] mb-6"
        >
          Plus de clients.<br />
          Plus de visibilité.<br />
          <span className="gradient-text">Sans vous prendre la tête.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg md:text-xl dark:text-slate-400 text-charcoal/65 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          OtterFlow crée votre site, gère votre SEO et automatise votre relation client sur WhatsApp. Pour les restaurants, hôtels, boutiques et PME qui veulent grandir.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group shimmer-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)' } as React.CSSProperties}
          >
            Démarrer gratuitement
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium dark:text-white text-charcoal hover:opacity-80 transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: '2px solid rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            Voir nos offres
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
