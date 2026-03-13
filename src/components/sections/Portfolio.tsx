'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Star, TrendingUp } from 'lucide-react'
import { SiteMockupModal } from './SiteMockup'

const projects = [
  {
    id: 'gastro',
    category: 'Restauration Gastronomique',
    name: 'Maison Varel',
    tagline: 'Table étoilée · Paris 16e',
    result: '+280% de réservations',
    growth: '+280%',
    metric: 'réservations online',
    duration: '4 mois',
    gradient: 'from-amber-500/30 via-orange-500/20 to-rose-500/10',
    accent: '#F59E0B',
    tags: ['Prospect Radar', 'RDV Auto', 'Moteur sémantique'],
    description:
      'Algorithmes de visibilité locale et flux de réservation automatisés. La liste d\'attente passe de 2 jours à 3 semaines.',
    stars: 5,
    bgPattern: '🍽️',
  },
  {
    id: 'hotel',
    category: 'Hôtellerie 5 Étoiles',
    name: 'Grand Hôtel Aldric',
    tagline: 'Palace · Côte d\'Azur',
    result: '+195% RevPAR',
    growth: '+195%',
    metric: 'RevPAR trimestriel',
    duration: '6 mois',
    gradient: 'from-sky-500/25 via-blue-500/15 to-indigo-500/10',
    accent: '#0EA5E9',
    tags: ['Analytics', 'Pricing prédictif', 'Flux OTA'],
    description:
      'Moteurs prédictifs de tarification dynamique synchronisés avec 18 plateformes. Occupation à 94% en basse saison.',
    stars: 5,
    bgPattern: '🏨',
  },
  {
    id: 'btp',
    category: 'BTP de Luxe',
    name: 'Constructions Elaris',
    tagline: 'Promotion immobilière haut de gamme',
    result: '34 leads qualifiés/mois',
    growth: '×8',
    metric: 'leads qualifiés mensuels',
    duration: '3 mois',
    gradient: 'from-emerald-500/25 via-teal-500/15 to-cyan-500/10',
    accent: '#10B981',
    tags: ['Prospect Radar', 'Nurturing automatisé'],
    description:
      'Ciblage des investisseurs patrimoniaux via flux de données socio-démographiques. Coût par lead divisé par 6.',
    stars: 5,
    bgPattern: '🏗️',
  },
  {
    id: 'avocat',
    category: 'Cabinet Juridique',
    name: 'Maître Fontaine & Associés',
    tagline: 'Droit des affaires · Lyon',
    result: '+320% visibilité',
    growth: '+320%',
    metric: 'visibilité organique',
    duration: '5 mois',
    gradient: 'from-violet-500/25 via-purple-500/15 to-indigo-500/10',
    accent: '#8B5CF6',
    tags: ['Algorithmes SEO', 'Contenu sémantique', 'Analytics'],
    description:
      'Architecture de contenu pilotée par moteurs sémantiques. 1ère position Google pour 47 requêtes stratégiques.',
    stars: 5,
    bgPattern: '⚖️',
  },
  {
    id: 'tech',
    category: 'PME Tech',
    name: 'Nexora Solutions',
    tagline: 'SaaS B2B · Bordeaux',
    result: 'MRR ×4 en 8 mois',
    growth: '×4',
    metric: 'MRR sur 8 mois',
    duration: '8 mois',
    gradient: 'from-cyan-500/25 via-sky-500/15 to-blue-500/10',
    accent: '#06B6D4',
    tags: ['Analytics', 'Outbound prédictif', 'Nurturing'],
    description:
      'Flux de prospection outbound alimentés par algorithmes comportementaux. Pipeline commercial multiplié par 4.',
    stars: 5,
    bgPattern: '💡',
  },
]

function ProjectCard({
  project,
  index,
  onOpenMockup,
}: {
  project: (typeof projects)[0]
  index: number
  onOpenMockup: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpenMockup}
      className="relative group cursor-pointer"
    >
      <motion.div
        animate={{ scale: hovered ? 1.02 : 1, y: hovered ? -4 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`
          frozen-card rounded-2xl overflow-hidden border border-white/[0.08]
          bg-gradient-to-br ${project.gradient}
          transition-shadow duration-300
          ${hovered ? 'shadow-[0_20px_60px_rgba(0,0,0,0.35)]' : 'shadow-ice'}
        `}
      >
        {/* Card top */}
        <div className="relative p-6 pb-4">
          {/* Emoji watermark */}
          <div className="absolute top-4 right-6 text-5xl opacity-10 select-none">
            {project.bgPattern}
          </div>

          {/* Category badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
            style={{ background: `${project.accent}15`, border: `0.5px solid ${project.accent}30` }}
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: project.accent }}
            >
              {project.category}
            </span>
          </div>

          <h3 className="font-serif font-bold text-xl dark:text-white text-charcoal mb-1">
            {project.name}
          </h3>
          <p className="text-xs dark:text-slate-500 text-charcoal/50 mb-4">{project.tagline}</p>

          {/* Stars */}
          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: project.stars }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Description (revealed on hover) */}
          <AnimatePresence>
            {hovered && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sm dark:text-slate-300 text-charcoal/70 leading-relaxed mb-4"
              >
                {project.description}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[9px] font-medium dark:bg-white/[0.06] bg-black/[0.05] dark:text-slate-400 text-charcoal/60 border dark:border-white/[0.06] border-black/[0.06]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card footer */}
        <div className="px-6 py-4 border-t border-white/[0.05] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: project.accent }} />
              <span className="font-serif font-bold text-xl" style={{ color: project.accent }}>
                {project.growth}
              </span>
            </div>
            <div className="text-[10px] dark:text-slate-500 text-charcoal/50 mt-0.5">{project.metric}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] dark:text-slate-600 text-charcoal/40 mb-1">Durée</div>
            <div className="text-xs font-medium dark:text-slate-400 text-charcoal/60">{project.duration}</div>
          </div>
        </div>

        {/* Hover — "Voir le site" hint */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: `${project.accent}20`, border: `0.5px solid ${project.accent}40` }}
        >
          <ArrowUpRight className="w-3.5 h-3.5" style={{ color: project.accent }} />
        </motion.div>

        {/* "Voir le site" label on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold text-white whitespace-nowrap"
              style={{ background: `${project.accent}CC` }}
            >
              Voir le site →
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function Portfolio() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeMockup, setActiveMockup] = useState<string | null>(null)

  return (
    <section id="portfolio" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space bg-ivory" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-amber-500/10 bg-amber-500/5 border border-amber-500/20 mb-6">
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">
              Résultats Prouvés
            </span>
          </div>
          <h2 className="font-serif text-fluid-lg font-bold dark:text-white text-charcoal mb-4">
            Nos réalisations
          </h2>
          <p className="text-lg dark:text-slate-400 text-charcoal/60 max-w-xl mx-auto">
            Chaque projet est une démonstration de ce que nos algorithmes
            sont capables d&apos;accomplir pour votre secteur.
          </p>
        </motion.div>

        {/* Cards grid — 2 + 3 layout */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 2).map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                onOpenMockup={() => setActiveMockup(p.id)}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(2).map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i + 2}
                onOpenMockup={() => setActiveMockup(p.id)}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <a
            href="#configurateur"
            className="shimmer-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
          >
            Rejoindre ces références
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Site mockup modal */}
      {activeMockup && (
        <SiteMockupModal projectId={activeMockup} onClose={() => setActiveMockup(null)} />
      )}
    </section>
  )
}
