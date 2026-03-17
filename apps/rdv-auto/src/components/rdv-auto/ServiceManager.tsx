'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Pencil, Trash2, Check, X, Clock, Euro,
  Briefcase, AlertTriangle, Copy,
} from 'lucide-react'
import {
  Service, getServices, createService, updateService, deleteService, SUPABASE_ENABLED,
} from '@/lib/rdv-store'
import { useAuth } from '@/hooks/useAuth'

// ─── Inline edit form ─────────────────────────────────────────────────────────

interface ServiceFormData {
  label: string
  description: string
  duration: string
  estimatedValue: string
}

function ServiceForm({
  initial, onSave, onCancel, saving,
}: {
  initial?: Partial<Service>
  onSave: (data: ServiceFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<ServiceFormData>({
    label:          initial?.label          ?? '',
    description:    initial?.description    ?? '',
    duration:       String(initial?.duration        ?? 60),
    estimatedValue: String(initial?.estimatedValue  ?? 0),
  })

  const valid = form.label.trim().length > 0 && Number(form.duration) > 0

  return (
    <div className="frozen-card rounded-xl border border-violet-neon/25 p-4 space-y-3">
      <input
        value={form.label}
        onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
        placeholder="Nom de la prestation"
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-neon/40"
      />
      <input
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        placeholder="Description (optionnel)"
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-neon/40"
      />
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          <input
            type="number" min={15} step={15}
            value={form.duration}
            onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
            placeholder="Durée (min)"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-neon/40"
          />
        </div>
        <div className="relative">
          <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          <input
            type="number" min={0}
            value={form.estimatedValue}
            onChange={(e) => setForm((p) => ({ ...p, estimatedValue: e.target.value }))}
            placeholder="Prix estimé (€)"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-neon/40"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid || saving}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-neon/[0.2] border border-violet-neon/30 text-violet-bright text-xs font-medium hover:bg-violet-neon/[0.3] transition-all disabled:opacity-40"
        >
          <Check className="w-3.5 h-3.5" />
          {saving ? 'Sauvegarde…' : 'Enregistrer'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/[0.08] text-white/40 text-xs hover:bg-white/[0.05] transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ServiceManager() {
  const { user }                    = useAuth()
  const [services, setServices]     = useState<Service[]>([])
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [addingNew, setAddingNew]   = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)
  const [copied, setCopied]         = useState(false)

  const bookingUrl = typeof window !== 'undefined' && user?.id
    ? `${window.location.origin}/book/${user.id}`
    : ''

  const load = useCallback(async () => {
    if (!user?.id) return
    const svcs = await getServices(user.id)
    setServices(svcs)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  const handleAdd = async (data: ServiceFormData) => {
    if (!user?.id) return
    setSaving(true)
    const created = await createService(user.id, {
      label:          data.label.trim(),
      description:    data.description.trim(),
      duration:       Number(data.duration),
      estimatedValue: Number(data.estimatedValue),
    })
    if (created) setServices((prev) => [...prev, created])
    setAddingNew(false)
    setSaving(false)
  }

  const handleEdit = async (id: string, data: ServiceFormData) => {
    setSaving(true)
    await updateService(id, {
      label:          data.label.trim(),
      description:    data.description.trim(),
      duration:       Number(data.duration),
      estimatedValue: Number(data.estimatedValue),
    })
    setServices((prev) => prev.map((s) =>
      s.id === id ? { ...s, label: data.label.trim(), description: data.description.trim(), duration: Number(data.duration), estimatedValue: Number(data.estimatedValue) } : s,
    ))
    setEditingId(null)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await deleteService(id)
    setServices((prev) => prev.filter((s) => s.id !== id))
    setDeletingId(null)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(bookingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!SUPABASE_ENABLED) {
    return (
      <div className="frozen-card rounded-2xl border border-amber-500/20 p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm font-semibold text-white">Supabase requis</p>
        <p className="text-xs text-white/40">
          Configurez <code className="text-amber-300 font-mono">NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
          <code className="text-amber-300 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans votre{' '}
          <code className="text-white/50 font-mono">.env.local</code> pour gérer vos prestations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Booking link */}
      {bookingUrl && (
        <div className="frozen-card rounded-xl border border-cyan-glacial/[0.14] p-4">
          <p className="text-[10px] text-cyan-glacial/60 font-mono uppercase tracking-wider mb-2">
            Lien de réservation client
          </p>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-xs text-white/50 font-mono truncate bg-white/[0.04] rounded-lg px-3 py-2 border border-white/[0.07]">
              {bookingUrl}
            </span>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-glacial/[0.12] border border-cyan-glacial/25 text-cyan-glacial text-xs hover:bg-cyan-glacial/[0.2] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>
      )}

      {/* Services list */}
      <AnimatePresence mode="popLayout">
        {services.map((svc) => (
          <motion.div
            key={svc.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {editingId === svc.id ? (
              <ServiceForm
                initial={svc}
                onSave={(data) => handleEdit(svc.id, data)}
                onCancel={() => setEditingId(null)}
                saving={saving}
              />
            ) : deletingId === svc.id ? (
              <div className="frozen-card rounded-xl border border-red-500/25 p-4 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs text-white/60 flex-1">Supprimer «&nbsp;{svc.label}&nbsp;» ?</p>
                <button onClick={() => handleDelete(svc.id)} className="text-xs text-red-400 font-semibold hover:underline">Supprimer</button>
                <button onClick={() => setDeletingId(null)} className="text-xs text-white/30 hover:text-white/60">Annuler</button>
              </div>
            ) : (
              <div className="frozen-card rounded-xl border border-white/[0.07] p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-neon/[0.12] border border-violet-neon/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-violet-bright" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{svc.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-white/30 font-mono">{svc.duration < 60 ? `${svc.duration}min` : `${svc.duration / 60}h`}</span>
                    <span className="text-white/15">·</span>
                    <span className="text-[10px] text-white/30 font-mono">{svc.estimatedValue === 0 ? 'Gratuit' : `~${svc.estimatedValue}€`}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setEditingId(svc.id)}
                    className="p-2 rounded-lg hover:bg-white/[0.07] text-white/25 hover:text-white/60 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(svc.id)}
                    className="p-2 rounded-lg hover:bg-red-500/[0.1] text-white/25 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add new */}
      {addingNew ? (
        <ServiceForm onSave={handleAdd} onCancel={() => setAddingNew(false)} saving={saving} />
      ) : (
        <button
          onClick={() => setAddingNew(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/[0.12] text-white/30 text-sm hover:border-violet-neon/30 hover:text-violet-bright transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter une prestation
        </button>
      )}
    </div>
  )
}
