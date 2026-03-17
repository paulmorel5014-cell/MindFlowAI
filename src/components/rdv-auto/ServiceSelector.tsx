'use client'

import { motion } from 'framer-motion'
import { Wrench, Hammer, ClipboardList, Briefcase } from 'lucide-react'
import { Service } from '@/lib/rdv-store'

// Default visual styles keyed by legacy service IDs
const META: Record<string, {
  Icon: React.ComponentType<{ className?: string }>
  glow: string; selected: string; iconBg: string; iconColor: string; badge: string
}> = {
  diagnostic: {
    Icon: Wrench,
    glow: 'rgba(6,182,212,0.25)',
    selected: 'border-cyan-glacial/50 shadow-[0_0_28px_rgba(6,182,212,0.18)]',
    iconBg: 'bg-cyan-glacial/[0.15]', iconColor: 'text-cyan-glacial',
    badge: 'bg-cyan-glacial/[0.12] text-cyan-ice border-cyan-glacial/25',
  },
  intervention: {
    Icon: Hammer,
    glow: 'rgba(139,92,246,0.25)',
    selected: 'border-violet-neon/50 shadow-[0_0_28px_rgba(139,92,246,0.18)]',
    iconBg: 'bg-violet-neon/[0.15]', iconColor: 'text-violet-bright',
    badge: 'bg-violet-neon/[0.12] text-violet-bright border-violet-neon/25',
  },
  devis: {
    Icon: ClipboardList,
    glow: 'rgba(212,175,114,0.25)',
    selected: 'border-gold-light/50 shadow-[0_0_28px_rgba(212,175,114,0.18)]',
    iconBg: 'bg-gold-light/[0.15]', iconColor: 'text-gold-light',
    badge: 'bg-gold-light/[0.12] text-gold-light border-gold-light/25',
  },
}

// Cycling fallback styles for custom services
const FALLBACK_STYLES = [
  { Icon: Briefcase, glow: 'rgba(6,182,212,0.25)',    selected: 'border-cyan-glacial/50',  iconBg: 'bg-cyan-glacial/[0.15]',  iconColor: 'text-cyan-glacial',  badge: 'bg-cyan-glacial/[0.12] text-cyan-ice border-cyan-glacial/25' },
  { Icon: Briefcase, glow: 'rgba(139,92,246,0.25)',   selected: 'border-violet-neon/50',   iconBg: 'bg-violet-neon/[0.15]',   iconColor: 'text-violet-bright', badge: 'bg-violet-neon/[0.12] text-violet-bright border-violet-neon/25' },
  { Icon: Briefcase, glow: 'rgba(212,175,114,0.25)',  selected: 'border-gold-light/50',    iconBg: 'bg-gold-light/[0.15]',    iconColor: 'text-gold-light',    badge: 'bg-gold-light/[0.12] text-gold-light border-gold-light/25' },
]

interface Props {
  services: Service[]
  selected: Service | null
  onSelect: (service: Service) => void
}

export default function ServiceSelector({ services, selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {services.map((service, i) => {
        const style = META[service.id] ?? FALLBACK_STYLES[i % FALLBACK_STYLES.length]
        const { Icon, glow, selected: selectedCls, iconBg, iconColor, badge } = style
        const isSelected = selected?.id === service.id

        return (
          <motion.button
            key={service.id}
            onClick={() => onSelect(service)}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.09, duration: 0.35 }}
            whileHover={{ scale: 1.01, x: 3 }}
            whileTap={{ scale: 0.99 }}
            className={`
              w-full relative frozen-card rounded-2xl p-4 flex items-center gap-4
              border transition-all duration-300 cursor-pointer text-left
              ${isSelected ? selectedCls : 'border-white/[0.07] hover:border-white/[0.14]'}
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="service-glow"
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 20% 50%, ${glow} 0%, transparent 65%)` }}
              />
            )}

            <div className={`
              relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
              transition-all duration-300
              ${isSelected ? iconBg : 'bg-white/[0.05]'}
            `}>
              <Icon className={`w-5 h-5 transition-colors duration-300 ${isSelected ? iconColor : 'text-white/30'}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-base mb-0.5 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-white/60'}`}>
                {service.label}
              </p>
              <p className={`text-sm leading-snug transition-colors duration-300 ${isSelected ? 'text-white/55' : 'text-white/25'}`}>
                {service.description}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-mono border transition-all duration-300 ${isSelected ? badge : 'bg-white/[0.04] text-white/25 border-white/[0.07]'}`}>
                {service.duration < 60 ? `${service.duration}min` : `${service.duration / 60}h`}
              </span>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border transition-all duration-300 ${isSelected ? badge : 'bg-white/[0.04] text-white/25 border-white/[0.07]'}`}>
                {service.estimatedValue === 0 ? 'Gratuit' : `~${service.estimatedValue}€`}
              </span>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
