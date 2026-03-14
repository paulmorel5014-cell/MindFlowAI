'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plus } from 'lucide-react'

const faqs = [
  {
    question: 'Quels sont les délais de mise en place ?',
    answer: 'Le déploiement complet de votre architecture digitale prend entre 10 et 21 jours ouvrés selon le plan choisi. Le plan Launch est opérationnel en 10 jours, le Prestige en 14 jours. Pour le plan Élite, nous planifions ensemble un calendrier adapté à votre organisation.',
  },
  {
    question: 'Puis-je résilier à tout moment ?',
    answer: 'Oui, l\'abonnement mensuel est résiliable à tout moment avec un préavis de 30 jours, sans frais ni pénalités. Le setup (paiement unique) couvre les frais de conception et d\'intégration initiaux — il n\'est pas remboursable une fois la prestation démarrée, ce qui est clairement mentionné dans nos CGU.',
  },
  {
    question: 'Quels résultats puis-je espérer ?',
    answer: 'Nos études de cas montrent des résultats significatifs dès le 2e mois : +280% de réservations pour un restaurant gastronomique, ×8 leads qualifiés pour un BTP, +195% de RevPAR pour un hôtel 5★. Ces chiffres dépendent de votre secteur, votre marché local et votre offre. Lors de l\'audit initial, nous vous communiquons une estimation réaliste basée sur des données comparables.',
  },
  {
    question: 'Vos solutions sont-elles adaptées aux TPE/PME ?',
    answer: 'Absolument. Le plan Launch a été conçu spécifiquement pour les TPE et PME qui souhaitent professionnaliser leur présence digitale avec un budget maîtrisé (499€ + 49€/mois). Nos algorithmes s\'adaptent à votre volume d\'activité et votre zone géographique — un artisan local bénéficie de la même précision algorithmique qu\'un groupe international.',
  },
  {
    question: 'Qu\'est-ce qui est inclus dans le setup ?',
    answer: 'Le setup comprend : l\'audit complet de votre situation digitale, la conception de votre architecture sur-mesure, le développement et l\'intégration de tous les outils (site, outils analytiques, automatisations), la formation de votre équipe, et un premier bilan de performance à 30 jours. Aucun coût caché — tout est détaillé dans la proposition commerciale avant signature.',
  },
  {
    question: 'Comment se passe le suivi après déploiement ?',
    answer: 'Vous bénéficiez d\'un reporting mensuel avec les KPIs clés de votre activité, d\'ajustements algorithmiques continus basés sur vos données réelles, et d\'un accès direct à votre gestionnaire de compte via un canal dédié. Pour le plan Élite, un comité de pilotage trimestriel est inclus. Nous ne disparaissons pas après le déploiement — votre croissance est notre engagement.',
  },
]

function FAQItem({ faq, index, inView }: { faq: typeof faqs[0]; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="frozen-card rounded-2xl border dark:border-white/[0.07] border-black/[0.05] overflow-hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
        >
          <span className="font-medium text-sm sm:text-base dark:text-white text-charcoal leading-snug">
            {faq.question}
          </span>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="flex-shrink-0 w-7 h-7 rounded-full dark:bg-white/[0.06] bg-black/[0.04] flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5 dark:text-slate-400 text-charcoal/60" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t dark:border-white/[0.05] border-black/[0.04]">
                <p className="text-sm dark:text-slate-400 text-charcoal/65 leading-relaxed pt-4">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function FAQ() {
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })
  const listInView = useInView(listRef, { once: true, margin: '-60px' })

  return (
    <section id="faq" className="relative py-16 md:py-28 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space bg-ivory" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/20 to-transparent" />

      {/* Ambient */}
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[300px] dark:bg-cyan-glacial/[0.03] blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-violet-neon/10 bg-violet-neon/5 border border-violet-neon/20 mb-6">
            <span className="text-xs font-semibold text-violet-bright uppercase tracking-widest">
              Questions fréquentes
            </span>
          </div>
          <h2 className="font-serif text-fluid-lg font-bold dark:text-white text-charcoal mb-4">
            Tout savoir avant de se lancer
          </h2>
          <p className="text-lg dark:text-slate-400 text-charcoal/60">
            Des réponses claires pour avancer avec confiance.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div ref={listRef} className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} faq={faq} index={i} inView={listInView} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm dark:text-slate-500 text-charcoal/50 mb-4">
            Une autre question ? Nous répondons sous 24h.
          </p>
          <a
            href="#configurateur"
            className="shimmer-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
          >
            Nous contacter
          </a>
        </motion.div>
      </div>
    </section>
  )
}
