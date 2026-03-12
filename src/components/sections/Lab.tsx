'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Radar, BarChart3, CalendarCheck, ArrowRight } from 'lucide-react'
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
    color: 'cyan',
    gradient: 'from-cyan-glacial/20 to-cyan-glacial/5',
    border: 'border-cyan-glacial/20',
    iconBg: 'bg-cyan-glacial/10',
    iconColor: 'text-cyan-glacial',
    component: ProspectRadar,
  },
  {
    id: 'analytics',
    icon: BarChart3,
    name: 'MindFlow Analytics',
    tagline: 'Intelligence prédictive',
    description:
      'Tableaux de bord vivants alimentés par nos moteurs analytiques. Visualisez l\'évolution de votre ROI avec une précision de 94.2% et anticipez les tendances marché.',
    color: 'violet',
    gradient: 'from-violet-neon/20 to-violet-neon/5',
    border: 'border-violet-neon/20',
    iconBg: 'bg-violet-neon/10',
    iconColor: 'text-violet-bright',
    component: MindFlowAnalytics,
  },
  {
    id: 'rdv',
    icon: CalendarCheck,
    name: 'RDV Auto',
    tagline: 'Orchestration automatisée',
    description:
      'Flux de données synchronisés avec vos agendas. Le système confirme, rappelle et adapte les créneaux selon les disponibilités — zéro friction, zéro no-show.',
    color: 'green',
    gradient: 'from-green-500/15 to-green-500/5',
    border: 'border-green-500/20',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    component: RDVAuto,
  },
]

function ToolCard({
  tool,
  index,
}: {
  tool: (typeof tools)[0]
  index: number
}) {
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
      {/* Mockup glass card */}
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
        {/* Card header */}
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

        {/* Tool component */}
        <div className="h-[280px]">
          <ToolComponent />
        </div>
      </div>

      {/* Tool info */}
      <div>
        <div className={`text-xs font-semibold uppercase tracking-widest ${tool.iconColor} mb-1.5`}>
          {tool.tagline}
        </div>
        <h3 className="font-serif font-bold text-xl dark:text-white text-charcoal mb-2">
          {tool.name}
        </h3>
        <p className="text-sm dark:text-slate-400 text-charcoal/60 leading-relaxed mb-4">
          {tool.description}
        </p>
        <button className={`
          inline-flex items-center gap-1.5 text-sm font-semibold ${tool.iconColor}
          hover:gap-2.5 transition-all duration-200
        `}>
          En savoir plus <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

export default function Lab() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="laboratoire" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dark:bg-space-mid bg-white/60" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glacial/20 to-transparent" />

      {/* Glow spots */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full dark:bg-violet-neon/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full dark:bg-cyan-glacial/[0.04] blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
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

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {tools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
