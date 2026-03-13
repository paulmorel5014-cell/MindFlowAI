'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Zap, Star, Crown, ArrowRight, Sparkles } from 'lucide-react'

const plans = [
  {
    id: 'launch',
    name: 'Launch',
    tagline: "L'essentiel pour exister.",
    icon: Zap,
    setupPrice: '499€',
    setupNote: 'Paiement unique',
    monthlyPrice: '49€',
    monthlyNote: '/ mois',
    badge: null,
    color: 'cyan',
    accentColor: '#06B6D4',
    borderClass: 'border-cyan-glacial/20',
    glowClass: 'shadow-[0_0_40px_rgba(6,182,212,0.08)]',
    hoverGlowClass: 'hover:shadow-[0_0_60px_rgba(6,182,212,0.18)]',
    features: [
      'Site vitrine Frozen Ice (1 page)',
      'Optimisation Google My Business',
      'Prospect Radar — Version Standard',
    ],
    cta: 'Commencer',
    featured: false,
    selfFinance: null,
  },
  {
    id: 'prestige',
    name: 'Prestige',
    tagline: 'Dominez votre marché local.',
    icon: Star,
    setupPrice: '1 299€',
    setupNote: 'Paiement unique',
    monthlyPrice: '99€',
    monthlyNote: '/ mois',
    badge: 'CONSEILLÉ',
    color: 'violet',
    accentColor: '#8B5CF6',
    borderClass: 'border-violet-neon/40',
    glowClass: 'shadow-[0_0_60px_rgba(139,92,246,0.18)]',
    hoverGlowClass: 'hover:shadow-[0_0_90px_rgba(139,92,246,0.32)]',
    featured: true,
    features: [
      'Site Multi-pages premium',
      'Écosystème RDV Auto & Analytics complet',
      'Prospect Radar — Illimité',
      'Support Prioritaire 7j/7',
    ],
    selfFinance: "S'autofinance dès votre premier chantier généré.",
    cta: 'Démarrer ma croissance',
  },
  {
    id: 'elite',
    name: 'Élite',
    tagline: 'Infrastructure digitale sur-mesure.',
    icon: Crown,
    setupPrice: 'Sur Devis',
    setupNote: 'À partir de 3 000€',
    monthlyPrice: '199€',
    monthlyNote: '/ mois',
    badge: 'Exclusif',
    color: 'gold',
    accentColor: '#D4AF72',
    borderClass: 'border-amber-400/20',
    glowClass: 'shadow-[0_0_40px_rgba(212,175,114,0.08)]',
    hoverGlowClass: 'hover:shadow-[0_0_60px_rgba(212,175,114,0.2)]',
    featured: false,
    features: [
      'Solutions logicielles dédiées',
      'Stratégie SEO agressive',
      'Accès API propriétaire',
      'Consultant dédié',
    ],
    selfFinance: null,
    cta: 'Contacter un expert',
  },
]

export default function Pricing() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="tarification" className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space-mid bg-white/60" />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glacial/20 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] dark:bg-violet-neon/[0.04] blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 md:mb-16"
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
            Setup unique. Abonnement simple. Résultats mesurables.
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
              transition={{ duration: 0.65, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Featured animated glow ring */}
              {plan.featured && (
                <>
                  <div
                    className="absolute -inset-[1px] rounded-[24px] z-0"
                    style={{
                      background: `linear-gradient(135deg, ${plan.accentColor}50, transparent 50%, ${plan.accentColor}25)`,
                    }}
                  />
                  {/* Subtle pulse animation for featured */}
                  <motion.div
                    className="absolute -inset-[2px] rounded-[25px] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${plan.accentColor}30, transparent 60%, ${plan.accentColor}15)`,
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </>
              )}

              <div
                className={`
                  relative z-10 frozen-card h-full rounded-[22px] p-7 flex flex-col
                  border ${plan.borderClass}
                  ${plan.glowClass} ${plan.hoverGlowClass}
                  transition-all duration-500 hover:-translate-y-1.5
                  ${plan.featured ? 'dark:bg-white/[0.06] bg-white/80' : ''}
                `}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold text-white whitespace-nowrap"
                    style={{ background: `linear-gradient(135deg, ${plan.accentColor}EE, ${plan.accentColor}AA)`, boxShadow: `0 4px 16px ${plan.accentColor}40` }}
                  >
                    {plan.featured && <Sparkles className="w-3 h-3" />}
                    {plan.badge}
                  </div>
                )}

                {/* Icon + Name */}
                <div className="mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${plan.accentColor}15`, border: `0.5px solid ${plan.accentColor}35` }}
                  >
                    <plan.icon className="w-5 h-5" style={{ color: plan.accentColor }} />
                  </div>
                  <h3 className="font-serif font-bold text-2xl dark:text-white text-charcoal mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm dark:text-slate-400 text-charcoal/55 italic">{plan.tagline}</p>
                </div>

                {/* Price Block */}
                <div className="mb-6 pb-6 border-b dark:border-white/[0.07] border-black/[0.05]">
                  {/* Setup — main price, large */}
                  <div
                    className="font-serif font-bold text-3xl leading-tight mb-0.5"
                    style={{ color: plan.accentColor }}
                  >
                    {plan.setupPrice}
                  </div>
                  <div className="text-[11px] dark:text-slate-500 text-charcoal/45 mb-3 tracking-wide uppercase">
                    {plan.setupNote}
                  </div>
                  {/* Subscription — subdued, secondary */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold dark:text-slate-300 text-charcoal/65">
                      {plan.monthlyPrice}
                    </span>
                    <span className="text-xs dark:text-slate-500 text-charcoal/40">
                      {plan.monthlyNote}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${plan.accentColor}18` }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: plan.accentColor }} />
                      </div>
                      <span className="text-sm dark:text-slate-300 text-charcoal/70 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Self-finance mention for Prestige */}
                {plan.selfFinance && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mb-5 px-3.5 py-2.5 rounded-xl text-xs"
                    style={{
                      background: `${plan.accentColor}08`,
                      borderLeft: `2px solid ${plan.accentColor}45`,
                    }}
                  >
                    <span className="dark:text-slate-400 text-charcoal/55 italic">
                      💡 {plan.selfFinance}
                    </span>
                  </motion.div>
                )}

                {/* CTA */}
                <a
                  href="#configurateur"
                  className={`
                    group/btn w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl
                    text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                    ${plan.featured
                      ? 'shimmer-btn text-white shadow-[0_4px_24px_rgba(139,92,246,0.35)]'
                      : 'border dark:hover:bg-white/[0.06] hover:bg-black/[0.04]'
                    }
                  `}
                  style={plan.featured
                    ? { '--btn-bg': `linear-gradient(135deg, ${plan.accentColor}, #06B6D4)` } as React.CSSProperties
                    : { borderColor: `${plan.accentColor}35`, color: plan.accentColor }
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
