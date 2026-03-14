'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Twitter, Linkedin, Instagram, X, ChevronRight } from 'lucide-react'

const links = {
  Solutions: [
    { label: 'Prospect Radar', href: '#laboratoire' },
    { label: 'MindFlow Analytics', href: '#laboratoire' },
    { label: 'RDV Auto', href: '#laboratoire' },
    { label: 'Algorithmes SEO', href: '#laboratoire' },
  ],
  Secteurs: [
    { label: 'Restauration', href: '#portfolio' },
    { label: 'Hôtellerie', href: '#portfolio' },
    { label: 'BTP & Immobilier', href: '#portfolio' },
    { label: 'Juridique', href: '#portfolio' },
  ],
  Agence: [
    { label: 'Notre vision', href: '#vision' },
    { label: 'Études de cas', href: '#portfolio' },
    { label: 'Tarification', href: '#tarification' },
    { label: 'Contact', href: '#configurateur' },
  ],
}

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

/* ─── Legal content ─────────────────────────────────────────────── */
const legalContent = {
  'Mentions légales': {
    sections: [
      {
        title: 'Éditeur du site',
        content: `MindFlow — SAS au capital de 10 000€
SIRET : 123 456 789 00012
RCS Paris B 123 456 789
Siège social : 15 Avenue George V, 75008 Paris, France
Directeur de la publication : Alexandre Dupont
Email : contact@mindflow.fr
Téléphone : +33 1 23 45 67 89`,
      },
      {
        title: 'Hébergement',
        content: `Ce site est hébergé par :
Vercel Inc.
340 Pine Street, Suite 1200
San Francisco, CA 94104, États-Unis
https://vercel.com`,
      },
      {
        title: 'Propriété intellectuelle',
        content: `L'ensemble des éléments constituant ce site (textes, graphiques, logiciels, photographies, images, sons, plans, noms, logos, marques, créations et œuvres protégeables diverses) sont la propriété exclusive de MindFlow ou de ses partenaires. Toute reproduction, distribution, modification ou utilisation sans autorisation préalable écrite est strictement interdite.`,
      },
      {
        title: 'Limitation de responsabilité',
        content: `MindFlow s'efforce de maintenir à jour les informations publiées sur ce site, mais ne peut garantir leur exactitude, complétude ou actualité. MindFlow ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site.`,
      },
    ],
  },
  'Confidentialité': {
    sections: [
      {
        title: 'Collecte des données personnelles',
        content: `Dans le cadre de l'utilisation de nos services et de nos formulaires de contact, MindFlow collecte les données suivantes :
• Nom et prénom
• Adresse email professionnelle
• Numéro de téléphone
• Secteur d'activité et besoins professionnels

Ces données sont collectées avec votre consentement explicite et sont utilisées uniquement dans le cadre de la relation commerciale.`,
      },
      {
        title: 'Base légale et finalités',
        content: `Le traitement de vos données repose sur votre consentement (Art. 6 §1 a) RGPD) et l'exécution d'un contrat (Art. 6 §1 b) RGPD). Vos données sont utilisées pour :
• Répondre à vos demandes de contact
• Établir des propositions commerciales personnalisées
• Améliorer nos services
• Vous envoyer des communications avec votre accord`,
      },
      {
        title: 'Durée de conservation',
        content: `Vos données personnelles sont conservées pendant 3 ans à compter du dernier contact, puis supprimées ou anonymisées.`,
      },
      {
        title: 'Vos droits (RGPD)',
        content: `Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement ("droit à l'oubli")
• Droit à la portabilité
• Droit d'opposition au traitement

Pour exercer ces droits : privacy@mindflow.fr`,
      },
      {
        title: 'Cookies',
        content: `Ce site utilise des cookies techniques nécessaires à son fonctionnement et des cookies analytiques anonymisés (via Vercel Analytics). Aucune donnée personnelle identifiable n'est transmise à des tiers sans votre consentement.`,
      },
    ],
  },
  'CGU': {
    sections: [
      {
        title: 'Objet',
        content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site mindflow.fr ainsi que des services proposés par MindFlow SAS.`,
      },
      {
        title: 'Accès aux services',
        content: `L'accès au site est gratuit et ouvert à tout utilisateur disposant d'un accès à Internet. MindFlow se réserve le droit de modifier, suspendre ou interrompre l'accès au site à tout moment, sans préavis ni indemnité.`,
      },
      {
        title: 'Conditions d\'abonnement',
        content: `Les abonnements MindFlow sont souscrits par voie électronique ou par bon de commande. L'abonnement est mensuel et résiliable à tout moment avec un préavis de 30 jours. Le setup (paiement unique) n'est pas remboursable une fois la prestation démarrée.`,
      },
      {
        title: 'Obligations de l\'utilisateur',
        content: `L'utilisateur s'engage à :
• Fournir des informations exactes lors de l'inscription
• Ne pas utiliser les services à des fins illicites
• Respecter la propriété intellectuelle de MindFlow
• Ne pas tenter de contourner les mesures de sécurité du site`,
      },
      {
        title: 'Responsabilité',
        content: `MindFlow s'engage à fournir des services conformes aux descriptions publiées. Les résultats présentés dans les études de cas sont des performances passées et ne constituent pas une garantie de résultats futurs.`,
      },
      {
        title: 'Droit applicable',
        content: `Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution relève de la compétence exclusive des tribunaux de Paris.`,
      },
    ],
  },
}

/* ─── Legal Modal ──────────────────────────────────────────────── */
function LegalModal({
  title,
  onClose,
}: {
  title: keyof typeof legalContent
  onClose: () => void
}) {
  const content = legalContent[title]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

      {/* Modal — bottom sheet on mobile, centered on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full sm:max-w-2xl"
      >
        {/* Glow border */}
        <div className="absolute -inset-[1px] rounded-t-[28px] sm:rounded-[28px] z-0"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.4), transparent 55%, rgba(6,182,212,0.2))' }}
        />

        {/* Card */}
        <div className="relative z-10 dark:bg-[#1C1C1E]/98 bg-white/98 rounded-t-[26px] sm:rounded-[26px] overflow-hidden border dark:border-white/[0.08] border-black/[0.06] shadow-[0_-20px_80px_rgba(0,0,0,0.5)] sm:shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          {/* Accent bar */}
          <div className="h-[2.5px] w-full bg-gradient-to-r from-violet-neon via-cyan-glacial to-violet-neon opacity-60" />

          {/* Pull indicator on mobile */}
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="w-10 h-1 rounded-full dark:bg-white/20 bg-black/15" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b dark:border-white/[0.06] border-black/[0.05]">
            <div>
              <h2 className="font-serif font-bold text-xl dark:text-white text-charcoal">{title}</h2>
              <p className="text-xs dark:text-slate-500 text-charcoal/45 mt-0.5">MindFlow SAS — Paris, France</p>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full dark:bg-white/[0.08] bg-black/[0.05] flex items-center justify-center dark:hover:bg-white/[0.14] hover:bg-black/[0.10] transition-colors"
            >
              <X className="w-4 h-4 dark:text-slate-400 text-charcoal/60" />
            </motion.button>
          </div>

          {/* Content — scrollable */}
          <div className="overflow-y-auto max-h-[65vh] sm:max-h-[70vh] px-7 py-6 space-y-6 scrollbar-none">
            {content.sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Section header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-bright flex-shrink-0" />
                  <h3 className="text-sm font-bold dark:text-white text-charcoal uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                <div className="pl-4 border-l dark:border-white/[0.07] border-black/[0.06]">
                  <p className="text-sm dark:text-slate-400 text-charcoal/65 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Last updated */}
            <div className="pt-2 border-t dark:border-white/[0.05] border-black/[0.04]">
              <p className="text-xs dark:text-slate-600 text-charcoal/35 italic">
                Dernière mise à jour : Mars 2025 — Pour toute question : legal@mindflow.fr
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Footer ──────────────────────────────────────────────────────── */
export default function Footer() {
  const [legalOpen, setLegalOpen] = useState<keyof typeof legalContent | null>(null)

  return (
    <>
      <footer className="relative pt-20 pb-10 overflow-hidden dark:bg-space bg-ivory border-t dark:border-white/[0.05] border-black/[0.06]">
        {/* Top separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />

        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] dark:bg-violet-neon/[0.03] blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <a href="#" className="flex items-center gap-2.5 group mb-5 w-fit">
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-neon to-cyan-glacial opacity-80" />
                  <div className="absolute inset-0.5 rounded-[10px] dark:bg-space bg-white flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-glacial" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="font-serif font-bold text-xl dark:text-white text-charcoal">
                  Mind<span className="gradient-text">Flow</span>
                </span>
              </a>

              <p className="text-sm dark:text-slate-400 text-charcoal/60 leading-relaxed max-w-xs mb-6">
                L&rsquo;architecture digitale de prestige. Algorithmes prédictifs,
                flux de données et moteurs de croissance pour les marques d&rsquo;exception.
              </p>

              {/* Socials */}
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center dark:bg-white/[0.04] bg-black/[0.04] dark:border-white/[0.06] border border-black/[0.06] dark:text-slate-500 text-charcoal/50 dark:hover:text-white hover:text-charcoal dark:hover:bg-white/[0.08] hover:bg-black/[0.08] transition-all duration-200"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav links */}
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-xs font-bold uppercase tracking-widest dark:text-white text-charcoal mb-5">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-sm dark:text-slate-500 text-charcoal/50 dark:hover:text-white hover:text-charcoal transition-colors duration-200 flex items-center gap-1 group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all duration-200" />
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t dark:border-white/[0.05] border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs dark:text-slate-600 text-charcoal/40">
              © 2025 MindFlow SAS. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              {(Object.keys(legalContent) as Array<keyof typeof legalContent>).map((item) => (
                <button
                  key={item}
                  onClick={() => setLegalOpen(item)}
                  className="text-xs dark:text-slate-600 text-charcoal/40 dark:hover:text-slate-300 hover:text-charcoal/70 transition-colors duration-200 underline underline-offset-3 decoration-dotted"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal Portal */}
      <AnimatePresence>
        {legalOpen && (
          <LegalModal
            title={legalOpen}
            onClose={() => setLegalOpen(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
