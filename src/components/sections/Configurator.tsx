'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  UtensilsCrossed, Hotel, HardHat, Scale, Laptop2, Store,
  BarChart3, Users, Globe, Mail, ArrowRight, ArrowLeft,
  CheckCircle2, Sparkles, Megaphone, Camera,
  Rocket, TrendingUp, Cpu, Palette,
} from 'lucide-react'

/* ─── Step 1 — Secteur ─────────────────────────────── */
const sectors = [
  { id: 'gastro', label: 'Restauration / Gastronomie', icon: UtensilsCrossed, color: '#F59E0B' },
  { id: 'hotel', label: 'Hôtellerie / Tourisme', icon: Hotel, color: '#0EA5E9' },
  { id: 'btp', label: 'BTP / Immobilier', icon: HardHat, color: '#10B981' },
  { id: 'juridique', label: 'Juridique / Conseil', icon: Scale, color: '#8B5CF6' },
  { id: 'tech', label: 'Tech / SaaS', icon: Laptop2, color: '#06B6D4' },
  { id: 'commerce', label: 'Commerce / Retail', icon: Store, color: '#EC4899' },
]

/* ─── Step 2 — Besoin ──────────────────────────────── */
const needs = [
  { id: 'visibilite', label: 'Visibilité & SEO', icon: Globe, description: 'Algorithmes de positionnement organique' },
  { id: 'leads', label: 'Génération de leads', icon: Users, description: 'Prospect Radar & ciblage prédictif' },
  { id: 'analytics', label: 'Analytics & ROI', icon: BarChart3, description: 'Tableaux de bord et flux de données' },
  { id: 'shooting', label: 'Shooting photo', icon: Camera, description: 'Photos professionnelles pour votre image' },
  { id: 'reseaux', label: 'Réseaux sociaux', icon: Megaphone, description: 'Moteurs de contenu et engagement' },
  { id: 'rebranding', label: 'Rebranding', icon: Palette, description: 'Identité visuelle et refonte de marque' },
]

/* ─── Step 3 — Ambition ─────────────────────────────── */
const ambitions = [
  {
    id: 'demarrage',
    label: 'Démarrage',
    description: 'Je lance mon activité et j\'ai besoin d\'être visible en ligne, crédible et trouvé sur Google.',
    icon: Rocket,
    targetPlan: 'Pack Essentiel',
    color: '#06B6D4',
    badge: '890€ Setup · 79€/mois',
  },
  {
    id: 'croissance',
    label: 'Croissance',
    description: 'Je veux un site premium, un rebranding et dominer mon marché local grâce au SEO actif.',
    icon: TrendingUp,
    targetPlan: 'Pack Croissance',
    color: '#8B5CF6',
    badge: '1 490€ Setup · 149€/mois',
  },
  {
    id: 'expansion',
    label: 'Prestige',
    description: 'J\'ai besoin d\'une infrastructure digitale complète : app sur-mesure, rebranding total et suivi dédié.',
    icon: Cpu,
    targetPlan: 'Pack Prestige',
    color: '#D4AF72',
    badge: '2 990€ Setup · 249€/mois',
  },
]

const stepLabels = ['Votre secteur', 'Votre besoin', 'Votre ambition', 'Contact']

interface FormData {
  sector: string
  needs: string[]
  ambition: string
  name: string
  email: string
  phone: string
  message: string
}

function Step1({
  selected,
  onSelect,
}: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {sectors.map((sector, i) => {
        const active = selected === sector.id
        return (
          <motion.button
            key={sector.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(sector.id)}
            className={`
              relative p-4 rounded-xl text-left border transition-all duration-200 hover:scale-[1.02] group
              ${active
                ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10'
                : 'dark:border-white/[0.06] border-black/[0.05] dark:hover:border-white/[0.15] hover:border-black/[0.12] dark:bg-white/[0.02] bg-white/60'
              }
            `}
            style={{ '--accent': sector.color } as React.CSSProperties}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${sector.color}15` }}
            >
              <sector.icon className="w-4 h-4" style={{ color: sector.color }} />
            </div>
            <span className="text-sm font-medium dark:text-slate-300 text-charcoal/80 leading-snug block">
              {sector.label}
            </span>
            {active && (
              <motion.div
                layoutId="sectorCheck"
                className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: sector.color }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </motion.div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

function Step2({
  selected,
  onToggle,
}: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {needs.map((need, i) => {
        const active = selected.includes(need.id)
        return (
          <motion.button
            key={need.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onToggle(need.id)}
            className={`
              relative p-4 rounded-xl text-left border flex items-start gap-3 transition-all duration-200 hover:scale-[1.01]
              ${active
                ? 'border-violet-neon/40 bg-violet-neon/[0.08] dark:bg-violet-neon/[0.05]'
                : 'dark:border-white/[0.06] border-black/[0.05] dark:hover:border-white/[0.12] dark:bg-white/[0.02] bg-white/60'
              }
            `}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-violet-neon/20' : 'dark:bg-white/[0.05] bg-black/[0.03]'}`}>
              <need.icon className={`w-4 h-4 transition-colors ${active ? 'text-violet-bright' : 'dark:text-slate-500 text-charcoal/40'}`} />
            </div>
            <div>
              <div className={`text-sm font-semibold mb-0.5 transition-colors ${active ? 'text-violet-bright' : 'dark:text-slate-200 text-charcoal/80'}`}>
                {need.label}
              </div>
              <div className="text-xs dark:text-slate-500 text-charcoal/50">{need.description}</div>
            </div>
            {active && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-4 h-4 rounded-full bg-violet-neon flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </motion.div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

function Step3({
  selected,
  onSelect,
}: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {ambitions.map((ambition, i) => {
        const active = selected === ambition.id
        const Icon = ambition.icon
        return (
          <motion.button
            key={ambition.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelect(ambition.id)}
            className={`
              relative w-full p-5 rounded-xl text-left border transition-all duration-300
              hover:scale-[1.01] hover:-translate-y-0.5
              ${active ? 'shadow-[0_0_30px_rgba(0,0,0,0.2)]' : 'dark:border-white/[0.06] border-black/[0.05] dark:bg-white/[0.02] bg-white/60'}
            `}
            style={active
              ? { borderColor: `${ambition.color}50`, background: `${ambition.color}08` }
              : {}
            }
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{
                  background: active ? `${ambition.color}20` : 'rgba(255,255,255,0.04)',
                  border: `0.5px solid ${active ? ambition.color + '40' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors duration-300"
                  style={{ color: active ? ambition.color : undefined }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="font-serif font-bold text-lg transition-colors duration-300"
                    style={{ color: active ? ambition.color : undefined }}
                  >
                    {ambition.label}
                  </span>
                  {/* Plan badge */}
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-300"
                    style={{
                      background: active ? `${ambition.color}18` : 'rgba(255,255,255,0.04)',
                      color: active ? ambition.color : 'inherit',
                      border: `0.5px solid ${active ? ambition.color + '35' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {ambition.badge}
                  </span>
                </div>
                <p className="text-sm dark:text-slate-400 text-charcoal/60 leading-relaxed">
                  {ambition.description}
                </p>
                <div className="mt-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: `${ambition.color}${active ? 'CC' : '70'}` }}
                  >
                    → {ambition.targetPlan}
                  </span>
                </div>
              </div>

              {/* Selection indicator */}
              <div className="flex-shrink-0 mt-1">
                {active ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-5 h-5" style={{ color: ambition.color }} />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 rounded-full dark:border-white/[0.12] border-black/[0.12] border" />
                )}
              </div>
            </div>

            {/* Active background gradient */}
            {active && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: `linear-gradient(135deg, ${ambition.color}10, transparent)` }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

function Step4({
  data,
  onChange,
}: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold dark:text-slate-400 text-charcoal/60 uppercase tracking-widest mb-2">
            Nom complet
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Alexandre Dupont"
            className="w-full px-4 py-3 rounded-xl text-sm dark:bg-white/[0.04] bg-white/70 border dark:border-white/[0.08] border-black/[0.08] dark:text-white text-charcoal placeholder:dark:text-slate-600 placeholder:text-charcoal/30 focus:outline-none focus:border-violet-neon/40 focus:ring-1 focus:ring-violet-neon/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold dark:text-slate-400 text-charcoal/60 uppercase tracking-widest mb-2">
            Email professionnel
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="alex@entreprise.fr"
            className="w-full px-4 py-3 rounded-xl text-sm dark:bg-white/[0.04] bg-white/70 border dark:border-white/[0.08] border-black/[0.08] dark:text-white text-charcoal placeholder:dark:text-slate-600 placeholder:text-charcoal/30 focus:outline-none focus:border-violet-neon/40 focus:ring-1 focus:ring-violet-neon/20 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold dark:text-slate-400 text-charcoal/60 uppercase tracking-widest mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+33 6 12 34 56 78"
          className="w-full px-4 py-3 rounded-xl text-sm dark:bg-white/[0.04] bg-white/70 border dark:border-white/[0.08] border-black/[0.08] dark:text-white text-charcoal placeholder:dark:text-slate-600 placeholder:text-charcoal/30 focus:outline-none focus:border-violet-neon/40 focus:ring-1 focus:ring-violet-neon/20 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold dark:text-slate-400 text-charcoal/60 uppercase tracking-widest mb-2">
          Votre objectif principal
        </label>
        <textarea
          value={data.message}
          onChange={(e) => onChange('message', e.target.value)}
          placeholder="Décrivez votre situation et vos ambitions en quelques lignes..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl text-sm dark:bg-white/[0.04] bg-white/70 border dark:border-white/[0.08] border-black/[0.08] dark:text-white text-charcoal placeholder:dark:text-slate-600 placeholder:text-charcoal/30 focus:outline-none focus:border-violet-neon/40 focus:ring-1 focus:ring-violet-neon/20 transition-all resize-none"
        />
      </div>
    </div>
  )
}

export default function Configurator() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    sector: '',
    needs: [],
    ambition: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  const updateField = (k: keyof FormData, v: string) =>
    setFormData((prev) => ({ ...prev, [k]: v }))

  const toggleNeed = (id: string) =>
    setFormData((prev) => ({
      ...prev,
      needs: prev.needs.includes(id) ? prev.needs.filter((n) => n !== id) : [...prev.needs, id],
    }))

  const canAdvance = () => {
    if (step === 0) return formData.sector !== ''
    if (step === 1) return formData.needs.length > 0
    if (step === 2) return formData.ambition !== ''
    if (step === 3) return formData.name !== '' && formData.email !== ''
    return false
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <section id="configurateur" className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute inset-0 dark:bg-space-mid bg-white/40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />

      {/* Ambient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] dark:bg-cyan-glacial/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-cyan-glacial/10 bg-cyan-glacial/5 border border-cyan-glacial/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-glacial" />
            <span className="text-xs font-semibold text-cyan-glacial uppercase tracking-widest">
              Configurateur de Projet
            </span>
          </div>
          <h2 className="font-serif text-fluid-lg font-bold dark:text-white text-charcoal mb-4">
            Construisons ensemble
          </h2>
          <p className="text-lg dark:text-slate-400 text-charcoal/60 max-w-lg mx-auto">
            3 étapes pour définir votre stratégie sur-mesure.
            Nous vous répondons sous 24h.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="frozen-card rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
        >
          {!submitted ? (
            <>
              {/* Progress bar */}
              <div className="h-[3px] bg-white/[0.04] relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-neon to-cyan-glacial"
                  animate={{ width: `${((step + 1) / 4) * 100}%` }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Steps indicator */}
              <div className="px-8 pt-6 pb-0">
                <div className="flex items-center justify-between">
                  {stepLabels.map((label, i) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`
                        flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300
                        ${i < step ? 'bg-gradient-to-br from-violet-neon to-cyan-glacial text-white'
                          : i === step ? 'bg-gradient-to-br from-violet-neon to-cyan-glacial text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                          : 'dark:bg-white/[0.05] bg-black/[0.05] dark:text-slate-600 text-charcoal/30'
                        }
                      `}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span className={`hidden sm:block text-xs font-medium transition-colors ${i === step ? 'dark:text-white text-charcoal' : 'dark:text-slate-600 text-charcoal/30'}`}>
                        {label}
                      </span>
                      {i < stepLabels.length - 1 && (
                        <div className={`hidden sm:block flex-1 h-[1px] mx-2 transition-colors ${i < step ? 'bg-violet-neon/40' : 'dark:bg-white/[0.05] bg-black/[0.05]'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="font-serif font-bold text-xl dark:text-white text-charcoal mb-6">
                      {step === 0 && 'Quel est votre secteur d\'activité ?'}
                      {step === 1 && 'Quels sont vos besoins prioritaires ?'}
                      {step === 2 && 'Quelle est votre ambition actuelle ?'}
                      {step === 3 && 'Dernière étape — vos coordonnées'}
                    </h3>

                    {step === 0 && <Step1 selected={formData.sector} onSelect={(id) => updateField('sector', id)} />}
                    {step === 1 && <Step2 selected={formData.needs} onToggle={toggleNeed} />}
                    {step === 2 && <Step3 selected={formData.ambition} onSelect={(id) => updateField('ambition', id)} />}
                    {step === 3 && <Step4 data={formData} onChange={updateField} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="px-8 pb-8 flex items-center justify-between gap-4 border-t border-white/[0.05] pt-6">
                {step > 0 ? (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium dark:text-slate-400 text-charcoal/60 dark:hover:text-white hover:text-charcoal dark:bg-white/[0.04] bg-black/[0.04] hover:bg-white/[0.08] transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Retour
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <motion.button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canAdvance()}
                    whileHover={canAdvance() ? { scale: 1.02 } : {}}
                    whileTap={canAdvance() ? { scale: 0.98 } : {}}
                    className={`
                      shimmer-btn flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200
                      ${canAdvance() ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                    `}
                    style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
                  >
                    Continuer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!canAdvance()}
                    whileHover={canAdvance() ? { scale: 1.02 } : {}}
                    whileTap={canAdvance() ? { scale: 0.98 } : {}}
                    className={`
                      shimmer-btn flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200
                      ${canAdvance() ? 'opacity-100 cursor-pointer shadow-[0_0_30px_rgba(139,92,246,0.4)]' : 'opacity-40 cursor-not-allowed'}
                    `}
                    style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
                  >
                    <Sparkles className="w-4 h-4" />
                    Envoyer ma demande
                  </motion.button>
                )}
              </div>
            </>
          ) : (
            /* Success state */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-14 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-neon to-cyan-glacial flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(139,92,246,0.5)]"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="font-serif font-bold text-2xl dark:text-white text-charcoal mb-3">
                Demande reçue !
              </h3>
              <p className="dark:text-slate-400 text-charcoal/60 max-w-sm mx-auto mb-2">
                Notre équipe analysera votre profil et vous contactera
                sous <strong className="dark:text-white text-charcoal">24 heures</strong> avec une proposition personnalisée.
              </p>
              <p className="text-sm dark:text-slate-600 text-charcoal/40 mb-8">
                Un email de confirmation vient d&apos;être envoyé à{' '}
                <span className="text-violet-bright">{formData.email}</span>
              </p>
              <button
                onClick={() => { setSubmitted(false); setStep(0); }}
                className="text-sm font-medium dark:text-slate-500 text-charcoal/50 hover:dark:text-white hover:text-charcoal transition-colors underline underline-offset-4"
              >
                Soumettre une autre demande
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
