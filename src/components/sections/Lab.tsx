'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Radar, BarChart3, CalendarCheck, ArrowRight, X, Zap, Shield, Clock } from 'lucide-react'
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

/* ─── Modal ──────────────────────────────────────────────────────────── */
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Outer glow border */}
        <div
          className="absolute -inset-[1px] rounded-[24px] z-0"
          style={{ background: `linear-gradient(135deg, ${tool.accentHex}50, transparent 60%, ${tool.accentHex}25)` }}
        />

        {/* Inner card */}
        <div className="relative z-10 frozen-card rounded-[22px] overflow-hidden border border-white/[0.10] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
          {/* Top glow bar */}
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${tool.accentHex}, transparent)` }} />

          {/* Ambient glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full blur-[80px] pointer-events-none"
            style={{ background: tool.glowColor }}
          />

          <div className="relative p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full dark:bg-white/[0.06] bg-black/[0.05] dark:hover:bg-white/[0.12] hover:bg-black/[0.10] flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 dark:text-slate-400 text-charcoal/60" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0.7, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
                className={`${tool.iconBg} rounded-2xl p-3.5 border ${tool.border}`}
                style={{ boxShadow: `0 0 20px ${tool.glowColor}` }}
              >
                <ToolIcon className={`w-6 h-6 ${tool.iconColor}`} />
              </motion.div>
              <div>
                <div className={`text-[10px] font-semibold uppercase tracking-widest ${tool.iconColor} mb-0.5`}>
                  {tool.tagline}
                </div>
                <h3 className="font-serif font-bold text-xl dark:text-white text-charcoal">
                  {tool.name}
                </h3>
              </div>
            </div>

            {/* Title + description */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div className={`text-sm font-semibold ${tool.iconColor} mb-3`}>{tool.modalTitle}</div>
              <p className="text-sm dark:text-slate-300 text-charcoal/75 leading-relaxed mb-6">
                {tool.modalDescription}
              </p>
            </motion.div>

            {/* Features */}
            <div className="space-y-3">
              {tool.modalFeatures.map((feat, i) => {
                const FeatIcon = feat.icon
                return (
                  <motion.div
                    key={feat.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.08, duration: 0.45 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${tool.accentHex}15`, border: `0.5px solid ${tool.accentHex}30` }}
                    >
                      <FeatIcon className="w-3.5 h-3.5" style={{ color: tool.accentHex }} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold dark:text-white text-charcoal mb-0.5">{feat.label}</div>
                      <div className="text-xs dark:text-slate-500 text-charcoal/50">{feat.desc}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-7"
            >
              <a
                href="#configurateur"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${tool.accentHex}CC, ${tool.accentHex}88)` }}
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

/* ─── Tool Card ──────────────────────────────────────────────────────── */
function ToolCard({ tool, index, onOpen }: { tool: (typeof tools)[0]; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const ToolComponent = tool.component

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div
        className={`
          frozen-card rounded-2xl p-5 mb-5 flex-1
          border ${tool.border}
          bg-gradient-to-br ${tool.gradient}
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500
          hover:-translate-y-1
          min-h-[320px]
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`${tool.iconBg} rounded-xl p-2.5`}>
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
      </div>

      <div>
        <div className={`text-xs font-semibold uppercase tracking-widest ${tool.iconColor} mb-1.5`}>
          {tool.tagline}
        </div>
        <h3 className="font-serif font-bold text-xl dark:text-white text-charcoal mb-2">{tool.name}</h3>
        <p className="text-sm dark:text-slate-400 text-charcoal/60 leading-relaxed mb-4">{tool.description}</p>
        <button
          onClick={onOpen}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold ${tool.iconColor} hover:gap-2.5 transition-all duration-200`}
        >
          En savoir plus <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

/* ─── Section ────────────────────────────────────────────────────────── */
export default function Lab() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const activeToolData = tools.find((t) => t.id === activeTool) ?? null

  return (
    <section id="laboratoire" className="relative py-32 overflow-hidden">
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
          className="text-center mb-20"
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
