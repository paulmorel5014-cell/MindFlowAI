'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Zap, Star, Crown, ArrowRight, Sparkles, Shield, RefreshCw, Headphones, Award, Camera, TrendingUp, MapPin, Palette } from 'lucide-react'

const plans = [
  {
    id: 'essentiel',
    name: 'Pack Essentiel',
    tagline: 'Exister et être trouvé.',
    icon: Zap,
    setupPrice: '890€',
    setupNote: 'Setup unique',
    monthlyPrice: '79€',
    monthlyNote: '/ mois',
    badge: null,
    accentColor: '#06B6D4',
    borderClass: 'border-cyan-glacial/20',
    glowClass: 'shadow-[0_0_40px_rgba(6,182,212,0.08)]',
    hoverGlowClass: 'hover:shadow-[0_0_60px_rgba(6,182,212,0.18)]',
    features: [
      'Site vitrine 5 pages',
      'Setup Google My Business',
      'Maintenance GMB mensuelle',
      'SEO de base (on-page)',
    ],
    cta: 'Commencer',
    featured: false,
    selfFinance: null,
  },
  {
    id: 'croissance',
    name: 'Pack Croissance',
    tagline: 'Dominez votre marché local.',
    icon: Star,
    setupPrice: '1 490€',
    setupNote: 'Setup unique',
    monthlyPrice: '149€',
    monthlyNote: '/ mois',
    badge: 'CONSEILLÉ',
    accentColor: '#8B5CF6',
    borderClass: 'border-violet-neon/40',
    glowClass: 'shadow-[0_0_60px_rgba(139,92,246,0.18)]',
    hoverGlowClass: 'hover:shadow-[0_0_90px_rgba(139,92,246,0.32)]',
    featured: true,
    features: [
      'Site web premium multi-pages',
      'Rebranding léger (logo + charte)',
      'Étude de marché locale',
      'SEO actif + GMB optimisé',
      'OtterFlow Analytics inclus',
    ],
    selfFinance: "S'autofinance dès les premiers clients générés.",
    cta: 'Démarrer ma croissance',
  },
  {
    id: 'prestige',
    name: 'Pack Prestige',
    tagline: 'Infrastructure digitale sur-mesure.',
    icon: Crown,
    setupPrice: '2 990€',
    setupNote: 'Setup unique',
    monthlyPrice: '249€',
    monthlyNote: '/ mois',
    badge: 'Premium',
    accentColor: '#D4AF72',
    borderClass: 'border-amber-400/20',
    glowClass: 'shadow-[0_0_40px_rgba(212,175,114,0.08)]',
    hoverGlowClass: 'hover:shadow-[0_0_60px_rgba(212,175,114,0.2)]',
    featured: false,
    features: [
      'App / dashboard OU site haut de gamme',
      'Rebranding complet (identité visuelle)',
      'Shooting photo professionnel',
      'SEO avancé + OtterFlow Analytics',
      'Suivi mensuel dédié (consultant)',
    ],
    selfFinance: null,
    cta: 'Contacter un expert',
  },
]

const addons = [
  { icon: Camera, label: 'Shooting photo', price: 'Sur devis', color: '#F59E0B' },
  { icon: TrendingUp, label: 'Étude de marché', price: 'Sur devis', color: '#0EA5E9' },
  { icon: MapPin, label: 'Migration / optimisation GMB', price: 'Sur devis', color: '#10B981' },
  { icon: Palette, label: 'Refonte identité visuelle', price: 'Sur devis', color: '#8B5CF6' },
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
          transition={{ duration: 0.4 }}
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
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.1), ease: [0.22, 1, 0.36, 1] }}
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
                  <div
                    className="font-serif font-bold text-3xl leading-tight mb-0.5"
                    style={{ color: plan.accentColor }}
                  >
                    {plan.setupPrice}
                  </div>
                  <div className="text-[11px] dark:text-slate-500 text-charcoal/45 mb-3 tracking-wide uppercase">
                    {plan.setupNote}
                  </div>
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

                {/* Self-finance mention */}
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
                  href="https://wa.me/33781364451"
                  target="_blank"
                  rel="noopener noreferrer"
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

        {/* Add-ons section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.65 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest dark:text-slate-500 text-charcoal/45">
              À la carte — Options complémentaires
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {addons.map((addon, i) => (
              <motion.div
                key={addon.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.5 }}
                className="frozen-card rounded-xl p-5 border dark:border-white/[0.06] border-black/[0.05] flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${addon.color}15`, border: `0.5px solid ${addon.color}35` }}
                >
                  <addon.icon className="w-4.5 h-4.5" style={{ color: addon.color }} />
                </div>
                <div>
                  <div className="text-sm font-semibold dark:text-white text-charcoal leading-tight mb-1">
                    {addon.label}
                  </div>
                  <div
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${addon.color}12`, color: addon.color }}
                  >
                    {addon.price}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12"
        >
          {[
            { icon: Shield, label: 'Paiement sécurisé', color: '#8B5CF6' },
            { icon: RefreshCw, label: 'Résiliable à tout moment', color: '#06B6D4' },
            { icon: Headphones, label: 'Accompagnement humain', color: '#8B5CF6' },
            { icon: Award, label: 'Premier bilan offert', color: '#06B6D4' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
              <span className="text-xs dark:text-slate-500 text-charcoal/50 font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
