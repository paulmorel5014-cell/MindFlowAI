'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, TrendingUp, Calendar, Users, Euro,
  ChevronLeft, Menu, X, Settings, LayoutDashboard,
  MapPin, Phone, Mail, Clock, CheckCircle2, Circle,
  AlertCircle, ArrowRight, Home, Briefcase, LogOut,
  Plus, ChevronRight, Zap, Target, Star, Filter,
} from 'lucide-react'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROPERTIES = [
  { id: 1, address: '12 Rue de la Paix, Paris 2e', type: 'Appartement', surface: 78, price: 650000, status: 'En vente', visits: 4, daysOnMarket: 12 },
  { id: 2, address: '34 Avenue Montaigne, Paris 8e', type: 'Appartement', surface: 120, price: 1200000, status: 'Sous compromis', visits: 9, daysOnMarket: 28 },
  { id: 3, address: '8 Impasse des Roses, Lyon 6e', type: 'Maison', surface: 210, price: 890000, status: 'En vente', visits: 2, daysOnMarket: 5 },
  { id: 4, address: '5 Boulevard Haussmann, Paris 9e', type: 'Appartement', surface: 55, price: 480000, status: 'Vendu', visits: 7, daysOnMarket: 45 },
  { id: 5, address: '23 Quai de la Tournelle, Paris 5e', type: 'Appartement', surface: 95, price: 985000, status: 'En vente', visits: 3, daysOnMarket: 8 },
  { id: 6, address: '17 Chemin des Vignes, Bordeaux', type: 'Villa', surface: 320, price: 1450000, status: 'Sous compromis', visits: 11, daysOnMarket: 31 },
]

const UPCOMING_VISITS = [
  { id: 1, time: '09:30', date: 'Auj.', client: 'M. & Mme Dupont', property: '12 Rue de la Paix', type: 'Première visite' },
  { id: 2, time: '11:00', date: 'Auj.', client: 'Sophie Martin', property: '23 Quai de la Tournelle', type: 'Contre-visite' },
  { id: 3, time: '14:30', date: 'Dem.', client: 'Pierre Leclerc', property: '8 Impasse des Roses', type: 'Première visite' },
  { id: 4, time: '16:00', date: 'Dem.', client: 'Famille Rousseau', property: '5 Bd Haussmann', type: 'Première visite' },
  { id: 5, time: '10:00', date: 'Jeu.', client: 'Antoine Bernard', property: '12 Rue de la Paix', type: 'Contre-visite' },
]

const PIPELINE = [
  { stage: 'Nouveau contact', count: 8, color: 'violet-neon', leads: ['Julie M.', 'Marc T.', 'Nadia R.'] },
  { stage: 'En discussion', count: 5, color: 'cyan-glacial', leads: ['Paul V.', 'Camille D.', 'Théo B.'] },
  { stage: 'Visite planifiée', count: 4, color: 'amber-400', leads: ['Sophie M.', 'Pierre L.', 'Fam. R.'] },
  { stage: 'Offre en cours', count: 2, color: 'orange-400', leads: ['M.&Mme D.', 'A. Bernard'] },
  { stage: 'Signé', count: 3, color: 'green-400', leads: ['Fam. Klein', 'L. Moreau', 'J. Durand'] },
]

const STATS = [
  { label: 'Biens actifs', value: '9', icon: Building2, iconClass: 'text-violet-bright', bgClass: 'bg-violet-neon/15', sub: '+2 ce mois' },
  { label: 'Visites planifiées', value: '8', icon: Calendar, iconClass: 'text-cyan-pale', bgClass: 'bg-cyan-glacial/15', sub: 'Ce mois' },
  { label: 'Mandats signés', value: '3', icon: CheckCircle2, iconClass: 'text-green-400', bgClass: 'bg-green-500/15', sub: 'Ce trimestre' },
  { label: 'Commissions', value: '47 500 €', icon: Euro, iconClass: 'text-amber-400', bgClass: 'bg-amber-500/15', sub: 'En cours' },
]

const NAV_ITEMS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'portfolio', label: 'Portefeuille', icon: Building2 },
  { id: 'visits', label: 'Agenda Visites', icon: Calendar },
  { id: 'leads', label: 'Pipeline Leads', icon: Users },
  { id: 'commission', label: 'Commissions', icon: Euro },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function AgentImmoSidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string
  onSectionChange: (id: string) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden frozen-card rounded-xl p-2.5"
      >
        <Menu className="w-5 h-5 text-amber-400" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          frozen-card border-r border-white/[0.06] overflow-hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform lg:transition-none lg:relative lg:flex-shrink-0
        `}
        style={{ minWidth: collapsed ? 72 : 240 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06] flex-shrink-0">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 font-mono tracking-tight">ImmoSpace</span>
                  <p className="text-[9px] text-slate-500 tracking-wider uppercase">Agent Pro</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false) }}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors ml-auto"
          >
            <ChevronLeft className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                onClick={() => { onSectionChange(id); setMobileOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-amber-500/15 border border-amber-500/25 text-amber-300'
                    : 'hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-transparent'
                  }
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <AnimatePresence>
            {!collapsed && user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03]"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[9px] text-slate-500 truncate">Agent Immobilier</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all text-xs"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Déconnexion
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = {
    'En vente': { bg: 'bg-violet-neon/15 border-violet-neon/30 text-violet-bright', dot: 'bg-violet-bright' },
    'Sous compromis': { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300', dot: 'bg-amber-400' },
    'Vendu': { bg: 'bg-green-500/15 border-green-500/30 text-green-300', dot: 'bg-green-400' },
  }[status] ?? { bg: 'bg-white/10 border-white/20 text-white/60', dot: 'bg-white/60' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  )
}

// ─── Commission Calculator ────────────────────────────────────────────────────

function CommissionCalculator() {
  const [price, setPrice] = useState(500000)
  const [rate, setRate] = useState(3.5)
  const commHT = price * (rate / 100)
  const commTTC = commHT * 1.2

  return (
    <div className="frozen-card rounded-2xl p-5 border border-white/[0.07] h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Euro className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="text-sm font-bold text-white">Calculateur Commission</h2>
      </div>

      <div className="space-y-4 flex-1">
        {/* Price */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-slate-400">Prix de vente</span>
            <span className="text-[11px] font-mono text-amber-300 font-bold">
              {price.toLocaleString('fr-FR')} €
            </span>
          </div>
          <input
            type="range" min={100000} max={3000000} step={10000} value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f59e0b ${((price - 100000) / 2900000) * 100}%, rgba(255,255,255,0.1) ${((price - 100000) / 2900000) * 100}%)`,
            }}
          />
        </div>

        {/* Rate */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-slate-400">Taux d&apos;agence</span>
            <span className="text-[11px] font-mono text-amber-300 font-bold">{rate.toFixed(1)} %</span>
          </div>
          <input
            type="range" min={1} max={8} step={0.1} value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f59e0b ${((rate - 1) / 7) * 100}%, rgba(255,255,255,0.1) ${((rate - 1) / 7) * 100}%)`,
            }}
          />
        </div>

        {/* Results */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 space-y-3 mt-auto">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Commission HT</span>
            <span className="text-sm font-mono font-bold text-white">
              {commHT.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
            </span>
          </div>
          <div className="h-px bg-white/[0.06]" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Commission TTC</span>
            <span className="text-base font-mono font-bold text-amber-300">
              {commTTC.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function AgentImmoPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [filterStatus, setFilterStatus] = useState<string>('Tous')
  const { user } = useAuth()

  const handleSectionChange = useCallback((id: string) => {
    setActiveSection(id)
  }, [])

  const filteredProps = filterStatus === 'Tous'
    ? PROPERTIES
    : PROPERTIES.filter((p) => p.status === filterStatus)

  const totalPortfolioValue = PROPERTIES
    .filter((p) => p.status !== 'Vendu')
    .reduce((acc, p) => acc + p.price, 0)

  return (
    <AuthGuard redirectTo="/login">
      <div className="flex h-screen overflow-hidden bg-space">
        <AgentImmoSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-space/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 pl-10 lg:pl-0">
              <div>
                <h1 className="text-sm font-bold text-white">
                  Bonjour{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
                </h1>
                <p className="text-[10px] text-slate-500">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] text-amber-400 font-mono font-semibold">Espace Pro Actif</span>
              </div>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/[0.07] text-slate-400 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-5 max-w-7xl mx-auto"
            >
              {/* ── KPI Row ── */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {STATS.map(({ label, value, icon: Icon, iconClass, bgClass, sub }) => (
                  <div key={label} className="frozen-card rounded-2xl p-4 border border-white/[0.07]">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${bgClass}`}>
                      <Icon className={`w-4 h-4 ${iconClass}`} />
                    </div>
                    <p className="text-xl font-bold text-white font-mono">{value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{sub}</p>
                  </div>
                ))}
              </motion.div>

              {/* ── Main grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* ── Portefeuille (col-span-2) ── */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <div className="frozen-card rounded-2xl p-5 border border-white/[0.07]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-neon/15 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-violet-bright" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-white">Portefeuille</h2>
                          <p className="text-[10px] text-slate-500">
                            Valeur totale : {totalPortfolioValue.toLocaleString('fr-FR')} €
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {['Tous', 'En vente', 'Sous compromis', 'Vendu'].map((s) => (
                          <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`text-[10px] px-2.5 py-1 rounded-lg transition-all ${filterStatus === s
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {filteredProps.map((prop) => (
                        <div
                          key={prop.id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                            <Home className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{prop.address}</p>
                            <p className="text-[10px] text-slate-500">{prop.type} · {prop.surface} m²</p>
                          </div>
                          <div className="text-right flex-shrink-0 hidden sm:block">
                            <p className="text-xs font-mono font-bold text-white">{prop.price.toLocaleString('fr-FR')} €</p>
                            <p className="text-[10px] text-slate-500">{prop.visits} visites</p>
                          </div>
                          <StatusBadge status={prop.status} />
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ── Agenda Visites (col-span-1) ── */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                  <div className="frozen-card rounded-2xl p-5 border border-white/[0.07] h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-cyan-glacial/15 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5 text-cyan-pale" />
                        </div>
                        <h2 className="text-sm font-bold text-white">Agenda Visites</h2>
                      </div>
                      <button className="w-6 h-6 rounded-lg bg-cyan-glacial/15 flex items-center justify-center text-cyan-pale hover:bg-cyan-glacial/25 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {UPCOMING_VISITS.map((visit) => (
                        <div key={visit.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-white/[0.04] hover:border-white/[0.09] transition-all">
                          <div className="text-center flex-shrink-0 w-12">
                            <p className="text-[9px] text-slate-500 uppercase">{visit.date}</p>
                            <p className="text-sm font-mono font-bold text-cyan-pale">{visit.time}</p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-white truncate">{visit.client}</p>
                            <p className="text-[10px] text-slate-500 truncate">{visit.property}</p>
                            <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-full ${
                              visit.type === 'Contre-visite'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                                : 'bg-violet-neon/15 text-violet-bright border border-violet-neon/25'
                            }`}>
                              {visit.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ── Pipeline Leads (col-span-2) ── */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <div className="frozen-card rounded-2xl p-5 border border-white/[0.07]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
                        <Target className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">Pipeline Prospects</h2>
                        <p className="text-[10px] text-slate-500">22 contacts actifs</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {PIPELINE.map((stage, idx) => (
                        <div key={stage.stage} className="flex flex-col gap-2">
                          <div className={`text-center p-2 rounded-xl border ${
                            idx === 4
                              ? 'bg-green-500/10 border-green-500/25'
                              : 'bg-white/[0.03] border-white/[0.06]'
                          }`}>
                            <p className="text-lg font-bold font-mono text-white">{stage.count}</p>
                            <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{stage.stage}</p>
                          </div>
                          <div className="space-y-1">
                            {stage.leads.map((lead) => (
                              <div key={lead} className="px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                                <p className="text-[9px] text-slate-400 truncate">{lead}</p>
                              </div>
                            ))}
                          </div>
                          {idx < PIPELINE.length - 1 && (
                            <div className="hidden" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 flex gap-1 h-1.5 rounded-full overflow-hidden">
                      {PIPELINE.map((stage, idx) => {
                        const colors = ['bg-violet-neon', 'bg-cyan-glacial', 'bg-amber-400', 'bg-orange-400', 'bg-green-400']
                        const total = PIPELINE.reduce((s, p) => s + p.count, 0)
                        return (
                          <div
                            key={stage.stage}
                            className={`${colors[idx]} rounded-full transition-all`}
                            style={{ width: `${(stage.count / total) * 100}%` }}
                          />
                        )
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* ── Commission Calculator (col-span-1) ── */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                  <CommissionCalculator />
                </motion.div>

              </div>

              {/* ── Performance Summary ── */}
              <motion.div variants={itemVariants}>
                <div className="frozen-card rounded-2xl p-5 border border-white/[0.07]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-violet-neon/15 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-violet-bright" />
                    </div>
                    <h2 className="text-sm font-bold text-white">Performance du trimestre</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Délai moyen de vente', value: '28 jours', trend: '-4j vs T-1', up: true },
                      { label: 'Prix net vendeur moyen', value: '96,8 %', trend: '+0.4% vs T-1', up: true },
                      { label: 'Visites par bien', value: '4.2', trend: '+0.8 vs T-1', up: true },
                      { label: 'Taux de transformation', value: '34 %', trend: '-2% vs T-1', up: false },
                    ].map(({ label, value, trend, up }) => (
                      <div key={label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <p className="text-[10px] text-slate-500 mb-1">{label}</p>
                        <p className="text-lg font-bold font-mono text-white">{value}</p>
                        <p className={`text-[10px] mt-1 font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>{trend}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
