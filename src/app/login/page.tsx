'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Mail, Lock, Eye, EyeOff, User, Hammer,
  UserCircle, ArrowRight, Loader2, Sparkles, CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/lib/auth-store'

type Tab = 'login' | 'register'

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  suffix?: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div
      className={`
        frozen-card rounded-xl flex items-center gap-3 px-4 py-3.5 border transition-all duration-200
        ${focused
          ? 'border-violet-neon/55 shadow-[0_0_24px_rgba(139,92,246,0.15)]'
          : 'border-white/[0.08] hover:border-white/[0.15]'
        }
      `}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${focused ? 'text-violet-bright' : 'text-white/25'}`} />
      <div className="flex-1 min-w-0">
        <label className={`block text-[10px] font-medium mb-0.5 transition-colors duration-200 ${focused ? 'text-violet-bright/65' : 'text-white/25'}`}>
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white/85 placeholder:text-white/20 outline-none"
        />
      </div>
      {suffix}
    </div>
  )
}

// ── Role selector card ────────────────────────────────────────────────────────
function RoleCard({
  role,
  label,
  sub,
  icon: Icon,
  selected,
  onSelect,
}: {
  role: UserRole
  label: string
  sub: string
  icon: React.ComponentType<{ className?: string }>
  selected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`
        flex-1 relative frozen-card rounded-xl p-3.5 border transition-all duration-250 text-left
        ${selected
          ? 'border-violet-neon/50 shadow-[0_0_22px_rgba(139,92,246,0.18)]'
          : 'border-white/[0.07] hover:border-white/[0.14]'}
      `}
    >
      {selected && (
        <motion.div
          layoutId="role-glow"
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(139,92,246,0.18) 0%, transparent 70%)' }}
        />
      )}
      <div className="relative z-10 flex flex-col gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${selected ? 'bg-violet-neon/[0.22]' : 'bg-white/[0.06]'}`}>
          <Icon className={`w-4 h-4 transition-colors duration-200 ${selected ? 'text-violet-bright' : 'text-white/35'}`} />
        </div>
        <div>
          <p className={`text-sm font-semibold transition-colors duration-200 ${selected ? 'text-white' : 'text-white/55'}`}>{label}</p>
          <p className={`text-[10px] transition-colors duration-200 ${selected ? 'text-white/45' : 'text-white/25'}`}>{sub}</p>
        </div>
        {selected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-bright" />
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading, error, login, register, clearError } = useAuth()

  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('artisan')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      const from = searchParams.get('from')
      const dest = from && from !== '/login' ? from : user.role === 'artisan' ? '/dashboard' : '/'
      router.push(dest)
    }
  }, [user, isLoading, router, searchParams])

  const handleTabChange = (t: Tab) => {
    setTab(t)
    clearError()
    setEmail('')
    setPassword('')
    setName('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    clearError()

    let result
    if (tab === 'login') {
      result = await login(email, password)
    } else {
      result = await register(email, password, name, role)
    }

    if (result.ok && result.user) {
      setSuccess(true)
      setTimeout(() => {
        const from = searchParams.get('from')
        const dest = from && from !== '/login' ? from : result.user!.role === 'artisan' ? '/dashboard' : '/'
        router.push(dest)
      }, 900)
    }
    setSubmitting(false)
  }

  const handleDemo = async () => {
    setEmail('demo@mindflow.fr')
    setPassword('demo1234')
    setSubmitting(true)
    clearError()
    const result = await login('demo@mindflow.fr', 'demo1234')
    if (result.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 900)
    }
    setSubmitting(false)
  }

  const slideVariants = {
    enter: (d: 1 | -1) => ({ x: d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: 1 | -1) => ({ x: d * -40, opacity: 0 }),
  }

  if (isLoading) return null

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden noise-overlay"
      style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0F1628 55%, #0A0F1E 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-violet-neon/[0.07] rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-cyan-glacial/[0.06] rounded-full blur-3xl" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.025]"
          style={{
            background: 'conic-gradient(from 0deg, #8B5CF6, #06B6D4, #8B5CF6)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm frozen-card rounded-3xl border border-white/[0.09] overflow-hidden"
      >
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-neon/60 to-transparent" />

        <div className="p-7">
          {/* ── Brand ── */}
          <div className="flex flex-col items-center mb-7">
            <motion.div
              animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.3)', '0 0 40px rgba(139,92,246,0.6)', '0 0 20px rgba(139,92,246,0.3)'] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-lg font-bold text-white tracking-tight mb-1">MindFlow</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-neon/[0.12] border border-violet-neon/25">
              <motion.span
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-violet-bright"
              />
              <span className="text-[11px] text-violet-bright/80 font-mono">Espace Membre</span>
            </div>
          </div>

          {/* ── Tab switcher ── */}
          <div className="flex gap-0.5 p-1 bg-white/[0.04] rounded-2xl border border-white/[0.07] mb-6">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTabChange(t)}
                className={`
                  flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                  ${tab === t
                    ? 'bg-gradient-to-r from-violet-neon/30 to-cyan-glacial/20 text-white border border-white/[0.1]'
                    : 'text-white/35 hover:text-white/55'}
                `}
              >
                {t === 'login' ? 'Se connecter' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={tab === 'login' ? -1 : 1}>
              <motion.div
                key={tab}
                custom={tab === 'login' ? -1 : 1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="space-y-3"
              >
                {/* Register-only: name */}
                {tab === 'register' && (
                  <Field
                    icon={User}
                    label="Nom complet"
                    type="text"
                    value={name}
                    onChange={setName}
                    placeholder="Jean Dupont"
                  />
                )}

                {/* Email */}
                <Field
                  icon={Mail}
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="vous@exemple.fr"
                />

                {/* Password */}
                <Field
                  icon={Lock}
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={setPassword}
                  placeholder={tab === 'register' ? 'Min. 6 caractères' : '••••••••'}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-white/25 hover:text-white/50 transition-colors flex-shrink-0"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                {/* Register-only: role selector */}
                {tab === 'register' && (
                  <div>
                    <p className="text-[11px] text-white/30 mb-2 ml-1">Votre rôle</p>
                    <div className="flex gap-2">
                      <RoleCard
                        role="artisan"
                        label="Artisan"
                        sub="Gérant / Indépendant"
                        icon={Hammer}
                        selected={role === 'artisan'}
                        onSelect={() => setRole('artisan')}
                      />
                      <RoleCard
                        role="client"
                        label="Client"
                        sub="Particulier / Entreprise"
                        icon={UserCircle}
                        selected={role === 'client'}
                        onSelect={() => setRole('client')}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <p className="text-[12px] text-red-400/85 bg-red-500/[0.08] border border-red-500/20 rounded-xl px-3 py-2.5 leading-relaxed">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting || success}
              whileHover={!submitting ? { scale: 1.01 } : {}}
              whileTap={!submitting ? { scale: 0.98 } : {}}
              className="w-full mt-5 shimmer-btn rounded-xl py-3.5 flex items-center justify-center gap-2 text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ '--btn-bg': success ? 'linear-gradient(135deg, #10b981, #06B6D4)' : 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
            >
              {success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Connexion réussie
                </>
              ) : submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{tab === 'login' ? 'Se connecter' : 'Créer mon compte'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider + demo */}
          {tab === 'login' && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] text-white/25 font-mono">ou</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              <motion.button
                type="button"
                onClick={handleDemo}
                disabled={submitting || success}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.1] text-white/50 text-xs font-medium hover:border-violet-neon/30 hover:text-violet-bright/70 hover:bg-violet-neon/[0.05] transition-all disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Accès démonstration
              </motion.button>

              <p className="text-[10px] text-white/20 text-center mt-2">
                demo@mindflow.fr · demo1234
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 pb-5 pt-0 flex justify-center">
          <p className="text-[10px] text-white/20">
            {tab === 'login' ? (
              <>
                Pas de compte ?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="text-violet-bright/60 hover:text-violet-bright transition-colors"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-violet-bright/60 hover:text-violet-bright transition-colors"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
