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
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero.mp4" type="video/mp4" />
        <source src="/hero.mp4" type="video/webm" />
      </video>

      {/* Gradient overlay — sky visible on top, dark at bottom for CTAs */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.20) 40%, rgba(0,0,0,0.70) 100%)',
        }}
      />

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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm mb-8"
        >
          <MapPin className="w-3 h-3 text-white/80" />
          <span className="text-xs font-medium text-white/80 tracking-wide">Paris &amp; France</span>
        </motion.div>

        {/* H1 — two lines only, overlaid on sky */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-fluid-xl font-bold text-white leading-[1.06] mb-6"
          style={{ textShadow: '0 2px 40px rgba(0,0,0,0.4)' }}
        >
          Plus de visibilité.<br />
          <em
            style={{
              fontStyle: 'italic',
              color: '#67E8F9',
              textShadow: '0 0 50px rgba(6,182,212,0.7)',
            }}
          >
            Sans vous prendre la tête.
          </em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium text-white hover:opacity-80 transition-all duration-300 hover:scale-[1.02]"
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
