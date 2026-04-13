'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const words = ['Prestige', 'Excellence', 'Innovation', 'Vision']
const VOWELS = ['A','E','I','O','U','É','È','Ê','Œ']
const getPrep = (w: string) => VOWELS.includes(w[0].toUpperCase()) ? "d'" : 'de '

const row1 = [
  'Création de sites web', 'SEO Local', 'Personal Shopper IA', 'Google My Business',
  'Rebranding', 'Shooting Photo', 'Applications sur-mesure', 'OtterFlow Analytics',
  'Étude de marché', 'WhatsApp IA',
]
const row2 = [
  'Restaurants & Gastronomie', 'Hôtellerie & Tourisme', 'E-commerce', 'PME & TPE',
  'Beauté & Bien-être', 'B2B & Conseil', 'Immobilier', 'Tech & SaaS', 'Commerce & Retail',
]

function MarqueeRow({ items, reverse = false, accent }: { items: string[]; reverse?: boolean; accent: string }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden w-full py-2 relative">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--fade-bg, #0A0F1E), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--fade-bg, #0A0F1E), transparent)' }} />

      <div
        className="flex whitespace-nowrap w-max gap-3"
        style={{
          animation: `marquee-${reverse ? 'right' : 'left'} ${reverse ? '32s' : '26s'} linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border flex-shrink-0"
            style={{
              background: `${accent}0A`,
              borderColor: `${accent}25`,
              color: i % 2 === 0 ? `${accent}CC` : 'rgba(148,163,184,0.7)',
            }}
          >
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent, opacity: 0.6 }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

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
        className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-24 w-full"
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-fluid-xl font-bold dark:text-white text-charcoal leading-[1.04] mb-10"
        >
          L&rsquo;Architecture Digitale<br />
          <span className="relative inline-block">
            {getPrep(words[wordIndex])}
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="gradient-text inline-block font-signature"
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#configurateur"
            className="group shimmer-btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)' } as React.CSSProperties}
          >
            Démarrer votre projet
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#laboratoire"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium dark:text-slate-300 text-charcoal/70 dark:hover:text-white hover:text-charcoal frozen-card hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02]"
          >
            Explorer le laboratoire
          </a>
        </motion.div>

        {/* Marquee strips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="w-screen relative left-1/2 -translate-x-1/2 space-y-2"
          style={{
            // @ts-expect-error custom property
            '--fade-bg': 'var(--marquee-bg)',
          }}
        >
          {/* Horizontal rule */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-4" />

          <MarqueeRow items={row1} accent="#8B5CF6" />
          <MarqueeRow items={row2} reverse accent="#06B6D4" />

          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mt-4" />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs dark:text-slate-600 text-charcoal/30 tracking-widest uppercase font-medium">
          Explorer
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 dark:text-slate-600 text-charcoal/30" />
        </motion.div>
      </motion.div>
    </section>
  )
}
