'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin } from 'lucide-react'

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
      {/* Video — mobile (9:16 portrait) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="md:hidden absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/herotelephone.webm" type="video/webm" />
      </video>

      {/* Video — desktop (16:9 landscape) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/heroordinateur.webm" type="video/webm" />
      </video>

      {/* Gradient overlay — max 20% so video remains clearly visible */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.20) 100%)',
        }}
      />

      {/* Badge — positioned high in the hero, above the centred title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-28 left-0 right-0 z-10 flex justify-center"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
          <MapPin className="w-3 h-3 text-white/80" />
          <span className="text-xs font-medium text-white/80 tracking-wide">Paris &amp; France</span>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center max-w-4xl mx-auto px-6 w-full"
      >
        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-fluid-xl font-bold text-white leading-[1.1] mb-10"
          style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
        >
          Plus de visibilité<br />
          <em
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#67E8F9',
              textShadow: '0 0 50px rgba(6,182,212,0.7)',
            }}
          >
            Sans vous prendre la tête
          </em>
        </motion.h1>

        {/* CTA — single liquid glass button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex items-center justify-center"
        >
          <a
            href="#tarification"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.14] active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.60)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            Voir nos offres
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
