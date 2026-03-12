'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Zap, Star, Crown, ArrowRight } from 'lucide-react'

const plans = [
  {
    id: 'launch',
    name: 'Launch',
    tagline: 'Décoller avec méthode',
    icon: Zap,
    price: 'Sur devis',
    priceNote: 'adapté à votre budget',
    badge: null,
    color: 'cyan',
    accentColor: '#06B6D4',
    borderClass: 'border-cyan-glacial/20',
    glowClass: 'shadow-[0_0_40px_rgba(6,182,212,0.1)]',
    hoverGlowClass: 'hover:shadow-[0_0_60px_rgba(6,182,212,0.2)]',
    features: [
      'Prospect Radar — 500 scans/mois',
      'Algorithmes SEO fondamentaux',
      'Tableau de bord Analytics',
      'RDV Auto — 50 créneaux/mois',
      'Support prioritaire 5j/7',
      'Rapport mensuel détaillé',
    ],
    cta: 'Commencer',
  },
  {
    id: 'prestige',
    name: 'Prestige',
    tagline: 'L\'expérience signature',
    icon: Star,
    price: 'Sur devis',
    priceNote: 'recommandé pour la croissance',
    badge: 'Populaire',
    color: 'violet',
    accentColor: '#8B5CF6',
    borderClass: 'border-violet-neon/40',
    glowClass: 'shadow-[0_0_60px_rgba(139,92,246,0.2)]',
    hoverGlowClass: 'hover:shadow-[0_0_80px_rgba(139,92,246,0.35)]',
    featured: true,
    features: [
      'Prospect Radar — Illimité',
      'MindFlow Analytics complet',
      'Moteurs prédictifs avancés',
      'RDV Auto — Illimité',
      'Flux de données multi-canaux',
      'Équipe dédiée 7j/7',
      'Rapport hebdomadaire + bilan trimestriel',
      'Accès API propriétaire',
    ],
    cta: 'Choisir Prestige',
  },
  {
    id: 'elite',
    name: 'Élite',
    tagline: 'Partenariat stratégique',
    icon: Crown,
    price: 'Sur mesure',
    priceNote: 'pour les ambitions sans limites',
    badge: 'Exclusif',
    color: 'gold',
    accentColor: '#D4AF72',
    borderClass: 'border-amber-400/20',
    glowClass: 'shadow-[0_0_40px_rgba(212,175,114,0.1)]',
    hoverGlowClass: 'hover:shadow-[0_0_60px_rgba(212,175,114,0.2)]',
    features: [
      'Tout Prestige inclus',
      'Algorithmes sur-mesure dédiés',
      'Data Scientist attitré',
      'Infrastructure propriétaire',
      'Tableaux de bord temps réel 24/7',
      'Conseil stratégique mensuel C-level',
      'SLA 99.9% garanti',
      'Intégrations CRM/ERP illimitées',
    ],
    cta: 'Nous contacter',
  },
]

export default function Pricing() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="tarification" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space-mid bg-white/60" />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glacial/20 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] dark:bg-violet-neon/[0.04] blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-violet-neon/10 bg-violet-neon/5 border border-violet-neon/20 mb-6">
            <span className="text-xs font-semibold text-violet-bright uppercase tracking-widest">
              Tarification Transparente
            </span>
          </div>
          <h2 className="font-serif text-fluid-lg font-bold dark:text-white text-charcoal mb-4">
            Investissez à la hauteur<br />de vos ambitions
          </h2>
          <p className="text-lg dark:text-slate-400 text-charcoal/60 max-w-xl mx-auto">
            Chaque formule est adaptée à votre réalité. Nos tarifs s&apos;ajustent
            à votre budget — discutons-en.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Featured glow ring */}
              {plan.featured && (
                <div
                  className="absolute -inset-[1px] rounded-[24px] z-0"
                  style={{
                    background: `linear-gradient(135deg, ${plan.accentColor}40, transparent, ${plan.accentColor}20)`,
                  }}
                />
              )}

              <div
                className={`
                  relative z-10 frozen-card h-full rounded-[22px] p-7 flex flex-col
                  border ${plan.borderClass}
                  ${plan.glowClass} ${plan.hoverGlowClass}
                  transition-all duration-500 hover:-translate-y-1
                  ${plan.featured ? 'dark:bg-white/[0.06]' : ''}
                `}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${plan.accentColor}, ${plan.accentColor}CC)` }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${plan.accentColor}15`, border: `0.5px solid ${plan.accentColor}30` }}
                  >
                    <plan.icon className="w-5 h-5" style={{ color: plan.accentColor }} />
                  </div>
                  <h3 className="font-serif font-bold text-2xl dark:text-white text-charcoal mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm dark:text-slate-500 text-charcoal/50">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/[0.06]">
                  <div
                    className="font-serif font-bold text-3xl mb-1"
                    style={{ color: plan.accentColor }}
                  >
                    {plan.price}
                  </div>
                  <div className="text-xs dark:text-slate-500 text-charcoal/50 italic">
                    {plan.priceNote}
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${plan.accentColor}15` }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: plan.accentColor }} />
                      </div>
                      <span className="text-sm dark:text-slate-300 text-charcoal/70 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#configurateur"
                  className={`
                    group/btn w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl
                    text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                    ${plan.featured
                      ? 'shimmer-btn text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)]'
                      : 'border dark:text-white text-charcoal hover:text-white'
                    }
                  `}
                  style={plan.featured
                    ? { '--btn-bg': `linear-gradient(135deg, ${plan.accentColor}, #06B6D4)` } as React.CSSProperties
                    : { borderColor: `${plan.accentColor}30`, color: plan.accentColor }
                  }
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm dark:text-slate-600 text-charcoal/40 mt-10"
        >
          Aucun engagement minimum · Résiliable à tout moment · Premier bilan offert
        </motion.p>
      </div>
    </section>
  )
}
