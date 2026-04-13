'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plus, ArrowRight } from 'lucide-react'

const faqs = [
  {
    question: 'Quels sont les délais pour avoir mon site en ligne ?',
    answer: 'Le Pack Essentiel (site vitrine 5 pages + GMB) est livré en 7 à 10 jours ouvrés. Le Pack Croissance, qui inclut un rebranding léger et une étude de marché locale, nécessite 14 à 18 jours. Le Pack Prestige avec app ou site haut de gamme se déploie en 3 à 5 semaines selon la complexité. Nous validons chaque étape avec vous avant de passer à la suivante.',
    category: 'Délais',
  },
  {
    question: 'Comment fonctionne le Personal Shopper IA sur WhatsApp ?',
    answer: 'Notre chatbot IA se connecte à votre compte WhatsApp Business via l\'API officielle de Meta. Il répond automatiquement à vos clients 24h/24 : recommandations produits ou plats, informations de disponibilité, prise de commande, support. Vous gardez la main à tout moment et pouvez reprendre la conversation. Aucune application à installer pour vos clients — ils écrivent sur WhatsApp comme d\'habitude.',
    category: 'Personal Shopper IA',
  },
  {
    question: 'Puis-je commencer par le Pack Essentiel et évoluer ?',
    answer: 'Absolument. Nos packs sont conçus pour s\'imbriquer. Vous démarrez avec l\'Essentiel, et dès que vous êtes prêt, vous upgradez vers Croissance ou Prestige en ne payant que la différence du setup. Votre site, votre GMB et vos contenus existants sont intégralement conservés et améliorés — pas de recommencement à zéro.',
    category: 'Tarification',
  },
  {
    question: 'Que comprend le rebranding ?',
    answer: 'Le rebranding léger (Pack Croissance) couvre : refonte ou modernisation du logo, palette de couleurs cohérente, typographies, et application sur votre site. Le rebranding complet (Pack Prestige) ajoute : identité visuelle complète, charte graphique livrée en PDF, templates réseaux sociaux, et si besoin une nouvelle carte de visite. Vous repartez avec des fichiers sources vectoriels (AI/SVG) qui vous appartiennent.',
    category: 'Services',
  },
  {
    question: 'Le SEO, ça prend combien de temps avant de voir des résultats ?',
    answer: 'Les premières améliorations de position sur Google My Business sont visibles en 2 à 4 semaines (citations locales, optimisation fiche, avis). Pour le SEO organique (positionnement sur Google Search), comptez 2 à 3 mois pour les premières remontées significatives. C\'est un investissement qui s\'accélère dans le temps — les sites que nous gérons depuis 6 mois voient en moyenne +180% de trafic organique.',
    category: 'SEO',
  },
  {
    question: 'Quels secteurs travaillez-vous ?',
    answer: 'Nous travaillons avec tous les secteurs locaux et digitaux : restaurants, hôtels, boutiques, salons de coiffure/beauté, e-commerce, immobilier, avocats, médecins, artisans, agences B2B, startups SaaS. Notre approche s\'adapte à votre marché, votre zone géographique et vos clients — pas de solution standardisée.',
    category: 'Secteurs',
  },
  {
    question: 'Puis-je résilier mon abonnement mensuel ?',
    answer: 'Oui, à tout moment avec 30 jours de préavis, sans pénalité. Le setup (paiement unique) couvre la conception, le développement et l\'intégration initiale — il n\'est pas remboursable une fois la prestation démarrée. Votre site, vos contenus et vos données vous appartiennent intégralement : nous vous livrons les accès complets à la résiliation.',
    category: 'Abonnement',
  },
  {
    question: 'Y a-t-il des options à la carte si je n\'ai pas besoin d\'un pack complet ?',
    answer: 'Oui. Vous pouvez commander séparément : un shooting photo professionnel, une étude de marché locale, une migration ou optimisation de votre fiche Google My Business, ou une refonte de votre identité visuelle seule. Contactez-nous avec votre besoin spécifique et nous établissons un devis sur-mesure.',
    category: 'Add-ons',
  },
]

const categoryColors: Record<string, string> = {
  'Délais': '#06B6D4',
  'Personal Shopper IA': '#25D366',
  'Tarification': '#8B5CF6',
  'Services': '#F59E0B',
  'SEO': '#0EA5E9',
  'Secteurs': '#EC4899',
  'Abonnement': '#8B5CF6',
  'Add-ons': '#D4AF72',
}

function FAQItem({ faq, index, inView }: { faq: typeof faqs[0]; index: number; inView: boolean }) {
  const [open, setOpen] = useState(false)
  const accent = categoryColors[faq.category] ?? '#8B5CF6'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="frozen-card rounded-2xl border overflow-hidden transition-all duration-300"
        style={{
          borderColor: open ? `${accent}30` : 'rgba(255,255,255,0.07)',
          boxShadow: open ? `0 0 30px ${accent}10` : 'none',
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Category dot */}
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
              style={{ background: accent }}
            />
            <span className="font-medium text-sm sm:text-base dark:text-white text-charcoal leading-snug">
              {faq.question}
            </span>
          </div>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="flex-shrink-0 w-7 h-7 rounded-full dark:bg-white/[0.06] bg-black/[0.04] flex items-center justify-center mt-0.5"
            style={open ? { background: `${accent}20` } : {}}
          >
            <Plus className="w-3.5 h-3.5" style={{ color: open ? accent : undefined }} />
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
              <div
                className="px-6 pb-6 border-t"
                style={{ borderColor: `${accent}15` }}
              >
                {/* Category badge */}
                <div className="flex items-center gap-2 pt-4 mb-3">
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    {faq.category}
                  </span>
                </div>
                <p className="text-sm dark:text-slate-400 text-charcoal/65 leading-relaxed pl-4">
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
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] dark:bg-violet-neon/[0.03] blur-[120px] pointer-events-none rounded-full" />

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
            Des réponses claires, sans jargon.
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
          <p className="text-sm dark:text-slate-500 text-charcoal/50 mb-5">
            Une autre question ? Réponse garantie sous 24h.
          </p>
          <a
            href="#configurateur"
            className="shimmer-btn inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
          >
            Nous contacter
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
