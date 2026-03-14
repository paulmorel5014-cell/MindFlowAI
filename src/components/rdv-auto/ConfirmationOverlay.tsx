'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, X, Bell, Zap, Calendar, Clock, User, MapPin } from 'lucide-react'
import { Appointment } from '@/lib/rdv-store'

// ── Ice Crystal Particle ──────────────────────────────────────────────────────
function IceCrystal({
  angle,
  distance,
  delay,
  size,
}: {
  angle: number
  distance: number
  delay: number
  size: number
}) {
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance
  return (
    <motion.div
      className="absolute rounded-sm pointer-events-none"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background:
          'linear-gradient(135deg, rgba(103,232,249,0.9) 0%, rgba(6,182,212,0.6) 100%)',
        rotate: '45deg',
      }}
      initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0.15 }}
      transition={{ delay, duration: 1.3 + Math.random() * 0.4, ease: 'easeOut' }}
    />
  )
}

// ── Details row ───────────────────────────────────────────────────────────────
function Row({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${accent ?? 'text-white/30'}`} />
      <span className="text-xs text-white/35 w-14 flex-shrink-0">{label}</span>
      <span className="text-xs text-white/65 font-medium capitalize truncate">{value}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  appointment: Appointment
  onClose: () => void
}

export default function ConfirmationOverlay({ appointment, onClose }: Props) {
  // 28 particles at evenly distributed angles
  const particles = Array.from({ length: 28 }, (_, i) => ({
    angle: (i / 28) * Math.PI * 2,
    distance: 55 + ((i * 13) % 70),
    delay: ((i * 7) % 25) / 100,
    size: 4 + ((i * 3) % 7),
  }))

  const dateFormatted = new Date(appointment.date + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'rgba(10,15,30,0.88)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-sm frozen-card rounded-3xl border border-white/[0.1] overflow-hidden"
        initial={{ scale: 0.65, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320, delay: 0.08 }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 65%)',
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4 text-white/40" />
        </button>

        <div className="relative z-10 p-6 pt-8">
          {/* ── Icon + Particles ── */}
          <div className="relative flex justify-center mb-6">
            <div className="relative">
              {particles.map((p, i) => (
                <IceCrystal key={i} {...p} />
              ))}
              <motion.div
                className="relative w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(139,92,246,0.15) 100%)',
                  border: '1px solid rgba(6,182,212,0.4)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(6,182,212,0.3)',
                    '0 0 40px rgba(6,182,212,0.65)',
                    '0 0 20px rgba(6,182,212,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -120 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.25, type: 'spring', damping: 14, stiffness: 250 }}
                >
                  <CheckCircle2 className="w-8 h-8 text-cyan-glacial" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* ── Title ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="text-center mb-4"
          >
            <h2 className="text-xl font-bold text-white mb-1">Rendez-vous confirmé</h2>
            <p className="text-sm text-white/35">Votre créneau a été enregistré avec succès</p>
          </motion.div>

          {/* ── Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            className="bg-white/[0.04] rounded-2xl p-4 space-y-2.5 mb-4 border border-white/[0.07]"
          >
            <Row icon={Zap} label="Prestation" value={appointment.serviceLabel} accent="text-violet-bright" />
            <Row icon={Calendar} label="Date" value={dateFormatted} accent="text-cyan-glacial" />
            <Row icon={Clock} label="Heure" value={appointment.time} accent="text-cyan-glacial" />
            <Row icon={User} label="Client" value={appointment.client.name} />
            <Row icon={MapPin} label="Adresse" value={appointment.client.address} />
          </motion.div>

          {/* ── Notification badges ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58 }}
            className="space-y-2"
          >
            {/* SMS reminder */}
            <div className="flex items-center gap-2.5 bg-violet-neon/[0.07] border border-violet-neon/20 rounded-xl px-3 py-2.5">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-violet-bright flex-shrink-0"
              />
              <Bell className="w-3.5 h-3.5 text-violet-bright flex-shrink-0" />
              <span className="text-[11px] text-violet-bright/75 leading-tight">
                SMS de rappel programmé — 24h avant le RDV
              </span>
            </div>

            {/* OtterFlow sync */}
            <div className="flex items-center gap-2.5 bg-cyan-glacial/[0.07] border border-cyan-glacial/20 rounded-xl px-3 py-2.5">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.3, repeat: Infinity, delay: 0.35 }}
                className="w-1.5 h-1.5 rounded-full bg-cyan-glacial flex-shrink-0"
              />
              <Zap className="w-3.5 h-3.5 text-cyan-glacial flex-shrink-0" />
              <span className="text-[11px] text-cyan-glacial/75 leading-tight">
                OtterFlow Analytics synchronisé —{' '}
                {appointment.estimatedValue > 0
                  ? `${appointment.estimatedValue}€ transmis`
                  : 'Devis gratuit enregistré'}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
