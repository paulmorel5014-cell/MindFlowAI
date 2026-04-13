'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Target, Rocket, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Audit & Diagnostic',
    description: 'Analyse complète de votre présence digitale, de vos données et de votre marché. Nous identifions vos leviers de croissance les plus rentables.',
    color: '#06B6D4',
    delay: 0,
  },
  {
    number: '02',
    icon: Target,
    title: 'Stratégie sur-mesure',
    description: 'Conception d\'une présence digitale adaptée à votre secteur et vos objectifs. Chaque solution est adaptée à votre réalité terrain.',
    color: '#8B5CF6',
    delay: 0.15,
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Déploiement & Automatisation',
    description: 'Mise en place des outils intelligents, intégration de vos données et automatisation de vos processus commerciaux clés.',
    color: '#8B5CF6',
    delay: 0.3,
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Croissance continue',
    description: 'Optimisation permanente basée sur les résultats réels. Reporting mensuel, ajustements continus et accompagnement dédié.',
    color: '#06B6D4',
    delay: 0.45,
  },
]

export default function Process() {
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px' })

  return (
    <section id="processus" className="relative py-16 md:py-28 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space bg-ivory" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glacial/15 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] dark:bg-violet-neon/[0.04] blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-cyan-glacial/10 bg-cyan-glacial/5 border border-cyan-glacial/20 mb-6">
            <span className="text-xs font-semibold text-cyan-glacial uppercase tracking-widest">
              Notre Méthode
            </span>
          </div>
          <h2 className="font-serif text-fluid-lg font-bold dark:text-white text-charcoal mb-4">
            De l&rsquo;ambition aux résultats
          </h2>
          <p className="text-lg dark:text-slate-400 text-charcoal/60 max-w-2xl mx-auto">
            Un processus simple en 4 étapes pour passer
            de l&rsquo;invisible au incontournable.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={stepsRef} className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 4%, rgba(139,92,246,0.2) 20%, rgba(6,182,212,0.3) 50%, rgba(139,92,246,0.2) 80%, transparent 96%)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: Math.min(step.delay * 0.6, 0.1), ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center md:items-center text-left md:text-center"
              >
                {/* Vertical line mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute left-5 top-14 bottom-0 w-[1px] pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2), transparent)' }}
                  />
                )}

                <div className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 w-full">
                  {/* Number + icon circle */}
                  <div className="relative flex-shrink-0">
                    {/* Outer glow */}
                    <div
                      className="absolute -inset-[3px] rounded-full opacity-40 blur-[6px]"
                      style={{ background: step.color }}
                    />
                    <div
                      className="relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border"
                      style={{
                        background: `${step.color}12`,
                        borderColor: `${step.color}35`,
                      }}
                    >
                      <step.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: step.color }} />
                    </div>
                    {/* Step number badge */}
                    <div
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}AA)` }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 md:mt-5 pb-8 md:pb-0">
                    <h3 className="font-serif font-bold text-base md:text-lg dark:text-white text-charcoal mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm dark:text-slate-400 text-charcoal/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-14"
        >
          <a
            href="https://wa.me/33781364451"
            target="_blank"
            rel="noopener noreferrer"
            className="shimmer-btn inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            style={{ '--btn-bg': 'linear-gradient(135deg, #06B6D4, #8B5CF6)' } as React.CSSProperties}
          >
            Démarrer votre audit gratuit
            <TrendingUp className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
