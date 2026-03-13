'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Radar, BarChart3, CalendarCheck, ArrowRight, X, Zap, Shield, Clock, ChevronRight } from 'lucide-react'
import ProspectRadar from '@/components/tools/ProspectRadar'
import MindFlowAnalytics from '@/components/tools/MindFlowAnalytics'
import RDVAuto from '@/components/tools/RDVAuto'

const tools = [
  {
    id: 'radar',
    icon: Radar,
    name: 'Prospect Radar',
    tagline: 'Détection prédictive',
    description:
      'Notre algorithme cartographie en temps réel les zones d\'opportunité et qualifie automatiquement 847 prospects par mois via des flux de données comportementaux.',
    modalTitle: 'L\'Avantage Tactique',
    modalDescription:
      'Notre moteur de détection scanne votre zone géographique en temps réel pour identifier les opportunités que personne d\'autre ne voit. Nous positionnons votre entreprise là où la demande est la plus forte, avant même que vos prospects ne décrochent leur téléphone.',
    modalFeatures: [
      { icon: Zap, label: 'Détection en temps réel', desc: 'Scan continu de votre zone de chalandise' },
      { icon: Shield, label: 'Données exclusives', desc: 'Flux propriétaires non accessibles à vos concurrents' },
      { icon: Clock, label: 'Anticipation marché', desc: 'Positionnement avant la demande exprimée' },
    ],
    gradient: 'from-cyan-glacial/20 to-cyan-glacial/5',
    border: 'border-cyan-glacial/20',
    iconBg: 'bg-cyan-glacial/10',
    iconColor: 'text-cyan-glacial',
    glowColor: 'rgba(6,182,212,0.15)',
    accentHex: '#06B6D4',
    component: ProspectRadar,
  },
  {
    id: 'analytics',
    icon: BarChart3,
    name: 'MindFlow Analytics',
    tagline: 'Intelligence prédictive',
    description:
      'Tableaux de bord vivants alimentés par nos moteurs analytiques. Visualisez l\'évolution de votre ROI avec une précision de 94.2% et anticipez les tendances marché.',
    modalTitle: 'La Clarté sur vos Résultats',
    modalDescription:
      'Traduisez votre visibilité en chiffre d\'affaires. Oubliez les graphiques complexes : notre tableau de bord vous montre l\'essentiel — l\'impact réel de MindFlow sur votre croissance. Suivez en direct le volume d\'affaires généré et optimisez votre stratégie grâce à une analyse prédictive de votre marché local.',
    modalFeatures: [
      { icon: BarChart3, label: 'Dashboard simplifié', desc: 'Indicateurs essentiels, zéro bruit' },
      { icon: Zap, label: 'Impact en direct', desc: "Volume d'affaires généré visible instantanément" },
      { icon: Shield, label: 'Analyse prédictive', desc: 'Anticipez les tendances de votre marché local' },
    ],
    gradient: 'from-violet-neon/20 to-violet-neon/5',
    border: 'border-violet-neon/20',
    iconBg: 'bg-violet-neon/10',
    iconColor: 'text-violet-bright',
    glowColor: 'rgba(139,92,246,0.15)',
    accentHex: '#8B5CF6',
    component: MindFlowAnalytics,
  },
  {
    id: 'rdv',
    icon: CalendarCheck,
    name: 'RDV Auto',
    tagline: 'Orchestration automatisée',
    description:
      'Flux de données synchronisés avec vos agendas. Le système confirme, rappelle et adapte les créneaux selon les disponibilités — zéro friction, zéro no-show.',
    modalTitle: 'Votre Secrétariat Intelligent',
    modalDescription:
      'Libérez-vous des appels incessants et des rendez-vous manqués. Notre module de planification synchronisé gère votre calendrier 24h/24. Vos clients réservent leurs interventions en toute autonomie, et notre système de rappel automatique réduit vos absences de 80 %. Vous travaillez, MindFlow remplit votre planning.',
    modalFeatures: [
      { icon: Clock, label: 'Disponible 24h/24', desc: 'Réservations même pendant votre sommeil' },
      { icon: Zap, label: '-80% de no-shows', desc: 'Rappels automatiques multi-canaux' },
      { icon: Shield, label: 'Autonomie client', desc: 'Réservation et modification en libre-service' },
    ],
    gradient: 'from-green-500/15 to-green-500/5',
    border: 'border-green-500/20',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    glowColor: 'rgba(34,197,94,0.12)',
    accentHex: '#22C55E',
    component: RDVAuto,
  },
]

/* ─── Apple-style Modal ─────────────────────────────────────────── */
function ToolModal({ tool, onClose }: { tool: (typeof tools)[0]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const ToolIcon = tool.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop — Apple frosted glass style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/65 backdrop-blur-xl"
      />

      {/* Card — Apple sheet */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340, mass: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glow ring */}
        <motion.div
          className="absolute -inset-[1px] rounded-[28px] z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ background: `linear-gradient(135deg, ${tool.accentHex}55, transparent 55%, ${tool.accentHex}28)` }}
        />

        {/* Inner card */}
        <div className="relative z-10 dark:bg-[#1C1C1E]/95 bg-white/95 rounded-[26px] overflow-hidden backdrop-blur-2xl border dark:border-white/[0.10] border-black/[0.06] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          {/* Accent bar */}
          <div className="h-[2.5px] w-full" style={{ background: `linear-gradient(90deg, transparent 5%, ${tool.accentHex}, transparent 95%)` }} />

          {/* Ambient top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[160px] rounded-full blur-[80px] pointer-events-none opacity-60"
            style={{ background: tool.glowColor }}
          />

          <div className="relative p-7">
            {/* Close — Apple style circular button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full dark:bg-white/[0.08] bg-black/[0.06] dark:hover:bg-white/[0.14] hover:bg-black/[0.10] flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 dark:text-slate-400 text-charcoal/60" />
            </motion.button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pr-8">
              <motion.div
                initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 16, stiffness: 220, delay: 0.08 }}
                className={`${tool.iconBg} rounded-2xl p-3.5 border ${tool.border} flex-shrink-0`}
                style={{ boxShadow: `0 0 24px ${tool.glowColor}` }}
              >
                <ToolIcon className={`w-6 h-6 ${tool.iconColor}`} />
              </motion.div>
              <div>
                <div className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${tool.iconColor} mb-0.5`}>
                  {tool.tagline}
                </div>
                <h3 className="font-serif font-bold text-xl dark:text-white text-charcoal leading-tight">
                  {tool.name}
                </h3>
              </div>
            </div>

            {/* Modal title + description */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5"
            >
              <div className={`text-sm font-semibold ${tool.iconColor} mb-2.5`}>
                {tool.modalTitle}
              </div>
              <p className="text-sm dark:text-slate-300 text-charcoal/72 leading-relaxed">
                {tool.modalDescription}
              </p>
            </motion.div>

            {/* Divider */}
            <div className="dark:border-white/[0.06] border-black/[0.05] border-t mb-5" />

            {/* Features — Apple list style */}
            <div className="space-y-3.5">
              {tool.modalFeatures.map((feat, i) => {
                const FeatIcon = feat.icon
                return (
                  <motion.div
                    key={feat.label}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.22 + i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3.5"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${tool.accentHex}18`, border: `0.5px solid ${tool.accentHex}35` }}
                    >
                      <FeatIcon className="w-3.5 h-3.5" style={{ color: tool.accentHex }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold dark:text-white text-charcoal">{feat.label}</div>
                      <div className="text-xs dark:text-slate-500 text-charcoal/50 mt-0.5">{feat.desc}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 dark:text-slate-600 text-charcoal/30 flex-shrink-0" />
                  </motion.div>
                )
              })}
            </div>

            {/* CTA — Apple button style */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7"
            >
              <a
                href="#configurateur"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                style={{ background: `linear-gradient(135deg, ${tool.accentHex}EE, ${tool.accentHex}AA)` }}
              >
                Démarrer avec {tool.name}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Tool Card ──────────────────────────────────────────────────── */
function ToolCard({ tool, index, onOpen }: { tool: (typeof tools)[0]; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const ToolComponent = tool.component
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visualization card */}
      <motion.div
        animate={{ y: hovered ? -4 : 0, scale: hovered ? 1.01 : 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`
          frozen-card rounded-2xl p-5 mb-5 flex-1
          border ${tool.border}
          bg-gradient-to-br ${tool.gradient}
          transition-shadow duration-500
          ${hovered
            ? `shadow-[0_20px_60px_rgba(0,0,0,0.3)]`
            : 'shadow-[0_8px_32px_rgba(0,0,0,0.15)]'
          }
          min-h-[320px]
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`${tool.iconBg} rounded-xl p-2.5 border ${tool.border}`}>
            <tool.icon className={`w-4 h-4 ${tool.iconColor}`} />
          </div>
          <div className="flex gap-1">
            {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
              <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <div className="h-[280px]">
          <ToolComponent />
        </div>
      </motion.div>

      {/* Text + CTA — Apple typography */}
      <div className="px-1">
        <div className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${tool.iconColor} mb-1.5`}>
          {tool.tagline}
        </div>
        <h3 className="font-serif font-bold text-xl dark:text-white text-charcoal mb-2 leading-tight">
          {tool.name}
        </h3>
        <p className="text-sm dark:text-slate-400 text-charcoal/60 leading-relaxed mb-4">
          {tool.description}
        </p>

        {/* Apple-style pill button with hover fill */}
        <motion.button
          onClick={onOpen}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`
            group/btn relative inline-flex items-center gap-2 px-5 py-2 rounded-full
            text-sm font-semibold overflow-hidden
            border transition-all duration-300
            ${tool.iconColor}
          `}
          style={{ borderColor: `${tool.accentHex}35` }}
        >
          {/* Fill on hover */}
          <motion.span
            className="absolute inset-0 rounded-full"
            initial={{ scaleX: 0, originX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: `${tool.accentHex}18` }}
          />
          <span className="relative">En savoir plus</span>
          <motion.span
            className="relative"
            animate={hovered ? { x: 2 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ─── Section ────────────────────────────────────────────────────── */
export default function Lab() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const activeToolData = tools.find((t) => t.id === activeTool) ?? null

  return (
    <section id="laboratoire" className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space-mid bg-white/60" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glacial/20 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full dark:bg-violet-neon/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full dark:bg-cyan-glacial/[0.04] blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-violet-neon/10 bg-violet-neon/5 border border-violet-neon/20 mb-6">
            <span className="text-xs font-semibold text-violet-bright uppercase tracking-widest">
              Technologie Propriétaire
            </span>
          </div>
          <h2 className="font-serif text-fluid-lg font-bold dark:text-white text-charcoal mb-4">
            Le Laboratoire MindFlow
          </h2>
          <p className="text-lg dark:text-slate-400 text-charcoal/60 max-w-2xl mx-auto">
            Trois instruments de précision conçus pour transformer vos données
            en croissance mesurable — sans compromis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {tools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} onOpen={() => setActiveTool(tool.id)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeToolData && <ToolModal tool={activeToolData} onClose={() => setActiveTool(null)} />}
      </AnimatePresence>
    </section>
  )
}
