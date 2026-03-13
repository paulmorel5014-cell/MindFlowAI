'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Star, TrendingUp, Globe, ExternalLink, Monitor } from 'lucide-react'
import { SiteMockupModal } from './SiteMockup'

const projects = [
  {
    id: 'gastro',
    category: 'Restauration Gastronomique',
    name: 'Maison Varel',
    tagline: 'Table étoilée · Paris 16e',
    url: 'maisonvarel.fr',
    result: '+280%',
    metric: 'réservations online',
    duration: '4 mois',
    gradient: 'from-amber-500/30 via-orange-500/20 to-rose-500/10',
    accent: '#F59E0B',
    tags: ['Prospect Radar', 'RDV Auto', 'Moteur sémantique'],
    description:
      'Architecture algorithmique de visibilité locale et flux de réservation entièrement automatisés. La liste d\'attente est passée de 2 jours à 3 semaines — un signal de désirabilité rare dans le secteur.',
    techStack: ['SEO Sémantique', 'Booking Engine', 'Analytics'],
    stars: 5,
    bgPattern: '🍽️',
    mockupColors: ['#F59E0B', '#D97706', '#92400E'],
  },
  {
    id: 'hotel',
    category: 'Hôtellerie 5 Étoiles',
    name: 'Grand Hôtel Aldric',
    tagline: 'Palace · Côte d\'Azur',
    url: 'grandhotelaldric.com',
    result: '+195%',
    metric: 'RevPAR trimestriel',
    duration: '6 mois',
    gradient: 'from-sky-500/25 via-blue-500/15 to-indigo-500/10',
    accent: '#0EA5E9',
    tags: ['Analytics', 'Pricing prédictif', 'Flux OTA'],
    description:
      'Moteurs prédictifs de tarification dynamique synchronisés avec 18 plateformes OTA en temps réel. Taux d\'occupation à 94% en basse saison grâce à un re-pricing algorithmique sur 72h glissants.',
    techStack: ['Dynamic Pricing', 'OTA Sync', 'Prédictif'],
    stars: 5,
    bgPattern: '🏨',
    mockupColors: ['#0EA5E9', '#0284C7', '#075985'],
  },
  {
    id: 'btp',
    category: 'BTP de Luxe',
    name: 'Constructions Elaris',
    tagline: 'Promotion immobilière haut de gamme',
    url: 'elaris-construction.fr',
    result: '×8',
    metric: 'leads qualifiés',
    duration: '3 mois',
    gradient: 'from-emerald-500/25 via-teal-500/15 to-cyan-500/10',
    accent: '#10B981',
    tags: ['Prospect Radar', 'Nurturing automatisé'],
    description:
      'Ciblage socio-démographique des investisseurs patrimoniaux via flux de données comportementaux. 34 leads qualifiés par mois avec un coût d\'acquisition divisé par 6.',
    techStack: ['Targeting', 'Lead Scoring', 'CRM Auto'],
    stars: 5,
    bgPattern: '🏗️',
    mockupColors: ['#10B981', '#059669', '#065F46'],
  },
  {
    id: 'avocat',
    category: 'Cabinet Juridique',
    name: 'Maître Fontaine & Associés',
    tagline: 'Droit des affaires · Lyon',
    url: 'fontaine-avocats.fr',
    result: '+320%',
    metric: 'visibilité organique',
    duration: '5 mois',
    gradient: 'from-violet-500/25 via-purple-500/15 to-indigo-500/10',
    accent: '#8B5CF6',
    tags: ['Algorithmes SEO', 'Contenu sémantique', 'Analytics'],
    description:
      'Architecture de contenu pilotée par moteurs sémantiques NLP. 1ère position Google sur 47 requêtes stratégiques à haute intention d\'achat — dominance organique durable.',
    techStack: ['NLP', 'SEO Tech', 'Content AI'],
    stars: 5,
    bgPattern: '⚖️',
    mockupColors: ['#8B5CF6', '#7C3AED', '#5B21B6'],
  },
  {
    id: 'tech',
    category: 'PME Tech',
    name: 'Nexora Solutions',
    tagline: 'SaaS B2B · Bordeaux',
    url: 'nexora.io',
    result: '×4',
    metric: 'MRR sur 8 mois',
    duration: '8 mois',
    gradient: 'from-cyan-500/25 via-sky-500/15 to-blue-500/10',
    accent: '#06B6D4',
    tags: ['Analytics', 'Outbound prédictif', 'Nurturing'],
    description:
      'Flux d\'outbound alimentés par algorithmes comportementaux et scoring prédictif. Le pipeline commercial a été multiplié par 4 grâce à l\'automatisation des séquences de nurturing.',
    techStack: ['Outbound AI', 'Pipeline', 'Behavioral'],
    stars: 5,
    bgPattern: '💡',
    mockupColors: ['#06B6D4', '#0891B2', '#0E7490'],
  },
]

/* ─── Browser Mockup ──────────────────────────────────────────────── */
function BrowserMockup({ project }: { project: (typeof projects)[0] }) {
  return (
    <div className="rounded-xl overflow-hidden border dark:border-white/[0.08] border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
      {/* Browser chrome */}
      <div className="dark:bg-[#1C1C1E] bg-[#F0EFEB] px-3 py-2.5 flex items-center gap-2.5">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        {/* URL bar */}
        <div className="flex-1 mx-2">
          <div className="dark:bg-[#2C2C2E]/80 bg-white/80 rounded-md px-3 py-1 flex items-center gap-1.5">
            <Globe className="w-2.5 h-2.5 dark:text-slate-500 text-charcoal/40 flex-shrink-0" />
            <span className="text-[10px] dark:text-slate-400 text-charcoal/60 font-mono truncate">{project.url}</span>
          </div>
        </div>
        <ExternalLink className="w-3 h-3 dark:text-slate-600 text-charcoal/30" />
      </div>

      {/* Website preview */}
      <div
        className="relative h-[130px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${project.mockupColors[0]}18, ${project.mockupColors[1]}10, ${project.mockupColors[2]}08)` }}
      >
        {/* Nav bar simulation */}
        <div className="flex items-center justify-between px-4 py-2.5 dark:bg-black/20 bg-white/40">
          <div className="w-16 h-2 rounded-full" style={{ background: `${project.accent}60` }} />
          <div className="flex gap-2">
            {[40, 32, 28].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full dark:bg-white/10 bg-black/10" style={{ width: `${w}px` }} />
            ))}
          </div>
          <div className="px-3 py-1 rounded-full text-[8px] font-bold text-white" style={{ background: project.accent }}>
            Contact
          </div>
        </div>

        {/* Hero area */}
        <div className="px-4 pt-3">
          <div className="w-3/4 h-3 rounded-full dark:bg-white/15 bg-black/10 mb-2" />
          <div className="w-1/2 h-2 rounded-full dark:bg-white/08 bg-black/06 mb-3" />
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-lg text-[7px] font-bold text-white" style={{ background: project.accent }}>
              Découvrir
            </div>
            <div className="px-3 py-1.5 rounded-lg text-[7px] font-bold dark:text-white/60 text-black/50 dark:border-white/10 border border-black/10">
              En savoir plus
            </div>
          </div>
        </div>

        {/* Decorative pattern */}
        <div
          className="absolute bottom-0 right-0 w-20 h-20 rounded-full blur-xl opacity-30"
          style={{ background: project.accent }}
        />
        <div
          className="absolute top-0 right-4 text-3xl opacity-[0.08] select-none"
        >
          {project.bgPattern}
        </div>
      </div>
    </div>
  )
}

/* ─── Project Card ───────────────────────────────────────────────── */
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
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpenMockup}
      className="relative group cursor-pointer"
    >
      <motion.div
        animate={{
          scale: hovered ? 1.015 : 1,
          y: hovered ? -6 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`
          frozen-card rounded-2xl overflow-hidden border border-white/[0.08]
          bg-gradient-to-br ${project.gradient}
          transition-shadow duration-400
          ${hovered
            ? 'shadow-[0_24px_64px_rgba(0,0,0,0.4)]'
            : 'shadow-[0_8px_32px_rgba(0,0,0,0.18)]'
          }
        `}
      >
        {/* Browser mockup at top */}
        <div className="p-4 pb-0">
          <BrowserMockup project={project} />
        </div>

        {/* Card content */}
        <div className="p-5 pt-4">
          {/* Category + tags row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: `${project.accent}15`, border: `0.5px solid ${project.accent}30` }}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: project.accent }}>
                {project.category}
              </span>
            </div>
            {/* Stars */}
            <div className="flex gap-0.5 flex-shrink-0 mt-0.5">
              {Array.from({ length: project.stars }).map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {/* Name + tagline */}
          <h3 className="font-serif font-bold text-lg dark:text-white text-charcoal mb-0.5 leading-tight">
            {project.name}
          </h3>
          <p className="text-xs dark:text-slate-500 text-charcoal/50 mb-3">{project.tagline}</p>

          {/* Tech stack chips */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold dark:bg-white/[0.05] bg-black/[0.04] dark:text-slate-400 text-charcoal/55 border dark:border-white/[0.07] border-black/[0.06]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Description — revealed on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs dark:text-slate-300 text-charcoal/65 leading-relaxed mb-3">
                  {project.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-0">
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

        {/* Card footer — metric */}
        <div
          className="px-5 py-3.5 border-t border-white/[0.05] flex items-center justify-between"
          style={{ background: `${project.accent}05` }}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: project.accent }} />
              <span className="font-serif font-bold text-xl" style={{ color: project.accent }}>
                {project.result}
              </span>
            </div>
            <div className="text-[10px] dark:text-slate-500 text-charcoal/50 mt-0.5">{project.metric}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] dark:text-slate-600 text-charcoal/40 mb-0.5">Durée</div>
            <div className="text-xs font-semibold dark:text-slate-400 text-charcoal/60">{project.duration}</div>
          </div>
        </div>

        {/* Hover — "Voir le site" CTA */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-[60px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold text-white whitespace-nowrap pointer-events-none shadow-lg"
              style={{ background: `${project.accent}DD`, backdropFilter: 'blur(8px)' }}
            >
              <Monitor className="w-3 h-3" />
              Voir le site →
            </motion.div>
          )}
        </AnimatePresence>

        {/* Arrow badge */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
          className="absolute top-[165px] right-9 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: `${project.accent}25`, border: `0.5px solid ${project.accent}50` }}
        >
          <ArrowUpRight className="w-3.5 h-3.5" style={{ color: project.accent }} />
        </motion.div>
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

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full dark:bg-amber-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full dark:bg-violet-neon/[0.03] blur-[100px] pointer-events-none" />

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
            Études de cas
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
              <ProjectCard key={p.id} project={p} index={i} onOpenMockup={() => setActiveMockup(p.id)} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(2).map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i + 2} onOpenMockup={() => setActiveMockup(p.id)} />
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

      {/* Full-screen site mockup modal */}
      {activeMockup && (
        <SiteMockupModal projectId={activeMockup} onClose={() => setActiveMockup(null)} />
      )}
    </section>
  )
}
