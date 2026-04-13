'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Radar, BarChart3, MessageCircle, ArrowRight, X, Zap, Shield, Clock, ChevronRight, ShoppingBag, Users, Star } from 'lucide-react'
// App preview components are defined below — no external images needed

/* ─── Apple-style App Preview Components ────────────────────────── */

function RadarPreview() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-xl" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6,182,212,0.18) 0%, transparent 70%)' }} />

      {/* Glassmorphism card */}
      <div className="relative w-[220px] h-[220px] flex items-center justify-center">
        {/* Radar rings */}
        {[1, 0.72, 0.48, 0.26].map((scale, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-400/20"
            style={{ width: `${scale * 200}px`, height: `${scale * 200}px` }}
          />
        ))}
        {/* Scanning sweep */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(6,182,212,0.35) 0deg, transparent 70deg)',
          }}
        />
        {/* Center dot */}
        <div className="relative z-10 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
        {/* Prospect dots */}
        {[
          { top: '20%', left: '65%', delay: 0 },
          { top: '55%', left: '78%', delay: 0.4 },
          { top: '72%', left: '40%', delay: 0.8 },
          { top: '30%', left: '25%', delay: 1.2 },
          { top: '60%', left: '18%', delay: 0.6 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-300"
            style={{ top: dot.top, left: dot.left, boxShadow: '0 0 8px rgba(6,182,212,0.8)' }}
            animate={{ opacity: [0, 1, 0.6] }}
            transition={{ delay: dot.delay, duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Stat badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border border-cyan-400/25 backdrop-blur-md"
        style={{ background: 'rgba(6,182,212,0.10)' }}>
        <span className="text-xs font-semibold text-cyan-300 tracking-wider">847 prospects / mois</span>
      </div>
    </div>
  )
}

function AnalyticsPreview() {
  const bars = [38, 55, 42, 70, 58, 82, 65, 90, 74, 88]
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none p-6">
      <div className="absolute inset-0 rounded-xl" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,92,246,0.20) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-[240px]">
        {/* Header stat */}
        <div className="mb-5 flex items-end gap-2">
          <motion.span
            className="text-3xl font-bold"
            style={{ color: '#a78bfa', textShadow: '0 0 20px rgba(139,92,246,0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            +340%
          </motion.span>
          <span className="text-xs text-slate-400 mb-1.5">ROI moyen</span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5 h-[100px]">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: `${h}%`,
                transformOrigin: 'bottom',
                background: i >= 7
                  ? 'linear-gradient(to top, #7c3aed, #a78bfa)'
                  : 'rgba(139,92,246,0.35)',
                boxShadow: i >= 7 ? '0 0 10px rgba(139,92,246,0.5)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Sparkline */}
        <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="mt-2 flex justify-between text-[9px] text-slate-500">
          <span>Jan</span><span>Mar</span><span>Mai</span><span>Juil</span>
        </div>
      </div>
    </div>
  )
}

function ShopperPreview() {
  const messages = [
    { from: 'user', text: 'Bonjour, je cherche un plat végétarien 🌿', delay: 0 },
    { from: 'bot', text: 'Bonsoir ! Je vous recommande notre Risotto aux champignons — 18€. Très apprécié ce soir 🍄', delay: 0.5 },
    { from: 'user', text: 'Et pour le dessert ?', delay: 1.0 },
    { from: 'bot', text: 'Notre Fondant au chocolat est à emporter en combo — économisez 3€ 🍫', delay: 1.5 },
  ]
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none p-4">
      <div className="absolute inset-0 rounded-xl" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37,211,102,0.15) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-[240px]">
        {/* WhatsApp-style header */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-t-2xl mb-0.5"
          style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.25)', borderBottom: 'none' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-green-300 leading-tight">OtterFlow Shop</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[8px] text-green-400">en ligne</span>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="space-y-2 px-2 py-3 rounded-b-2xl"
          style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(37,211,102,0.15)', borderTop: 'none' }}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: msg.delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] px-2.5 py-1.5 rounded-xl text-[9px] leading-relaxed"
                style={msg.from === 'bot'
                  ? { background: 'rgba(37,211,102,0.18)', color: '#86efac', border: '0.5px solid rgba(37,211,102,0.25)' }
                  : { background: 'rgba(255,255,255,0.10)', color: '#e2e8f0', border: '0.5px solid rgba(255,255,255,0.10)' }
                }
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Panier moyen badge */}
        <div className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/20"
          style={{ background: 'rgba(37,211,102,0.08)' }}>
          <Star className="w-2.5 h-2.5 text-green-400" />
          <span className="text-[9px] font-semibold text-green-400 uppercase tracking-wider">+32% panier moyen</span>
        </div>
      </div>
    </div>
  )
}

const tools = [
  {
    id: 'radar',
    icon: Radar,
    Preview: RadarPreview,
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
    badge: null,
  },
  {
    id: 'shopper',
    icon: MessageCircle,
    Preview: ShopperPreview,
    name: 'Personal Shopper IA',
    tagline: 'Sur WhatsApp',
    badge: 'Nouveau',
    description:
      'Un chatbot IA conversationnel intégré à WhatsApp. Recommandations produits, support 24/7, augmentation du panier moyen. Disponible pour restaurants, hôtels, e-commerce, salons et B2B.',
    modalTitle: 'Votre Vendeur Disponible 24h/24',
    modalDescription:
      'Transformez WhatsApp en canal de vente intelligent. Notre Personal Shopper IA engage vos clients en langage naturel, recommande les bons produits au bon moment et augmente votre panier moyen de +32% en moyenne. Sans application à télécharger, sans formation — juste WhatsApp.',
    modalFeatures: [
      { icon: MessageCircle, label: 'WhatsApp natif', desc: 'Zéro friction — vos clients utilisent déjà WhatsApp' },
      { icon: Users, label: 'Multi-secteurs', desc: 'Restaurants, hôtels, e-commerce, salons, B2B' },
      { icon: ShoppingBag, label: '+32% panier moyen', desc: 'Recommandations personnalisées par IA' },
    ],
    gradient: 'from-green-500/15 to-green-500/5',
    border: 'border-green-500/20',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    glowColor: 'rgba(37,211,102,0.15)',
    accentHex: '#25D366',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    Preview: AnalyticsPreview,
    name: 'OtterFlow Analytics',
    tagline: 'Intelligence prédictive',
    description:
      'Tableaux de bord vivants alimentés par nos moteurs analytiques. Visualisez l\'évolution de votre ROI avec une précision de 94.2% et anticipez les tendances marché.',
    modalTitle: 'La Clarté sur vos Résultats',
    modalDescription:
      'Traduisez votre visibilité en chiffre d\'affaires. Oubliez les graphiques complexes : notre tableau de bord vous montre l\'essentiel — l\'impact réel de OtterFlow sur votre croissance. Suivez en direct le volume d\'affaires généré et optimisez votre stratégie grâce à une analyse prédictive de votre marché local.',
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
    badge: null,
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
      {/* Visualization card — glassmorphism + glow */}
      <motion.div
        animate={{ y: hovered ? -6 : 0, scale: hovered ? 1.015 : 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-5 flex-1 min-h-[340px] rounded-[24px] overflow-hidden"
        style={{
          background: 'rgba(15,15,20,0.75)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${tool.accentHex}28`,
          boxShadow: hovered
            ? `0 24px 70px rgba(0,0,0,0.5), 0 0 40px ${tool.accentHex}22, inset 0 1px 0 rgba(255,255,255,0.07)`
            : `0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        {/* Ambient glow from accent color */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-[200px] h-[140px] rounded-full blur-[60px] pointer-events-none transition-opacity duration-500"
          style={{ background: tool.accentHex, opacity: hovered ? 0.18 : 0.10 }}
        />
        {/* Accent bar top */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: `linear-gradient(90deg, transparent 5%, ${tool.accentHex}90, transparent 95%)` }} />

        {/* Header row */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <div
              className={`${tool.iconBg} rounded-xl p-2.5 border ${tool.border}`}
              style={{ boxShadow: `0 0 14px ${tool.accentHex}30` }}
            >
              <tool.icon className={`w-4 h-4 ${tool.iconColor}`} />
            </div>
            {tool.badge && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: `${tool.accentHex}22`, color: tool.accentHex, border: `0.5px solid ${tool.accentHex}40` }}
              >
                {tool.badge}
              </span>
            )}
          </div>
          {/* macOS traffic lights */}
          <div className="flex gap-1.5">
            {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full opacity-70" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="h-[280px] relative overflow-hidden">
          <tool.Preview />
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
      <div className="absolute inset-0 dark:bg-space-mid bg-slate-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glacial/20 to-transparent" />
      {/* Gradient mesh blobs — Pinterest style */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }} />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full blur-[110px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

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
            Le Laboratoire OtterFlow
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
