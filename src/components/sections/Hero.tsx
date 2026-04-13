'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useInView } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const stats = [
  { to: 98, prefix: '', suffix: '%', label: 'Taux de satisfaction' },
  { to: 340, prefix: '+', suffix: '%', label: 'ROI moyen sur 6 mois' },
  { to: 200, prefix: '', suffix: '+', label: 'Projets livrés' },
  { to: 12, prefix: '', suffix: '', label: 'Secteurs maîtrisés' },
]

const words = ['Prestige', 'Excellence', 'Innovation', 'Vision']
const VOWELS = ['A','E','I','O','U','É','È','Ê','Œ']
const getPrep = (w: string) => VOWELS.includes(w[0].toUpperCase()) ? "d'" : 'de '

/* ─── CountUp ─────────────────────────────────────────── */
function CountUp({ to, prefix = '', suffix = '', active }: { to: number; prefix?: string; suffix?: string; active: boolean }) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 45, damping: 18 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (active) motionValue.set(to)
  }, [active, to, motionValue])

  useEffect(() => {
    return springValue.on('change', (v) => setDisplay(Math.round(v)))
  }, [springValue])

  return <>{prefix}{display}{suffix}</>
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [wordIndex, setWordIndex] = useState(0)
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })

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
      {/* ── Background layers ── */}
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
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.color,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* ── Main content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center max-w-6xl mx-auto px-6 pt-24"
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-fluid-xl font-bold dark:text-white text-charcoal leading-[1.04] mb-12"
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
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-20"
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

        {/* Stats — animated counters */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              className="frozen-card rounded-2xl p-5 text-center group hover:scale-[1.03] transition-transform duration-300 cursor-default"
            >
              <div className="font-mono font-bold text-2xl md:text-3xl gradient-text mb-1">
                <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} active={statsInView} />
              </div>
              <div className="text-xs dark:text-slate-500 text-charcoal/50 font-medium leading-tight tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
