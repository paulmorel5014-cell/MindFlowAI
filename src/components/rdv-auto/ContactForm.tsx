'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, FileText, ArrowRight, Loader2 } from 'lucide-react'

export interface ContactData {
  name: string
  phone: string
  address: string
  notes?: string
}

interface Props {
  onSubmit: (data: ContactData) => void
  isLoading?: boolean
}

const REQUIRED_FIELDS = [
  { key: 'name' as const, label: 'Nom complet', icon: User, type: 'text', placeholder: 'Jean Dupont' },
  { key: 'phone' as const, label: 'Téléphone', icon: Phone, type: 'tel', placeholder: '06 12 34 56 78' },
  { key: 'address' as const, label: "Adresse d'intervention", icon: MapPin, type: 'text', placeholder: '12 rue des Fleurs, Lyon' },
]

export default function ContactForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<ContactData>({ name: '', phone: '', address: '', notes: '' })
  const [focused, setFocused] = useState<keyof ContactData | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactData, string>>>({})

  const validate = (): boolean => {
    const e: Partial<Record<keyof ContactData, string>> = {}
    if (!form.name.trim()) e.name = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    if (!form.address.trim()) e.address = 'Adresse requise'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (validate()) onSubmit(form)
  }

  const renderField = (
    key: keyof ContactData,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    type: string,
    placeholder: string,
    required: boolean,
    i: number,
  ) => {
    const isFocused = focused === key
    const hasError = !!errors[key]

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.07 }}
      >
        <div
          className={`
            relative frozen-card rounded-xl flex items-center gap-3 px-4 py-3.5 border
            transition-all duration-200
            ${
              hasError
                ? 'border-red-500/40 shadow-[0_0_14px_rgba(239,68,68,0.1)]'
                : isFocused
                ? 'border-violet-neon/50 shadow-[0_0_22px_rgba(139,92,246,0.14)]'
                : 'border-white/[0.07] hover:border-white/[0.13]'
            }
          `}
        >
          <Icon
            className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
              isFocused ? 'text-violet-bright' : 'text-white/25'
            }`}
          />
          <div className="flex-1 min-w-0">
            <label
              className={`block text-[10px] font-medium mb-0.5 transition-colors duration-200 ${
                isFocused ? 'text-violet-bright/60' : 'text-white/25'
              }`}
            >
              {label}
              {!required && <span className="ml-1 text-white/20">(optionnel)</span>}
            </label>
            <input
              type={type}
              value={(form[key] as string) ?? ''}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, [key]: e.target.value }))
                if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
              }}
              onFocus={() => setFocused(key)}
              onBlur={() => setFocused(null)}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 outline-none"
            />
          </div>
        </div>

        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-red-400/80 mt-1 ml-2"
          >
            {errors[key]}
          </motion.p>
        )}
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {REQUIRED_FIELDS.map(({ key, label, icon, type, placeholder }, i) =>
        renderField(key, label, icon, type, placeholder, true, i),
      )}

      {/* Notes — optional */}
      {renderField('notes', 'Description du chantier', FileText, 'text', 'Ex: tableau électrique vétuste, 3 pièces…', false, 3)}

      <motion.button
        type="submit"
        disabled={isLoading}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        whileHover={!isLoading ? { scale: 1.01 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
        className="w-full mt-1 shimmer-btn rounded-xl py-4 flex items-center justify-center gap-2 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span>Confirmer le rendez-vous</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </form>
  )
}
