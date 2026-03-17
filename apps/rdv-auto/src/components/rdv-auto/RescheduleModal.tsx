'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarDays, Check, Loader2 } from 'lucide-react'
import FrozenCalendar from './FrozenCalendar'
import { Appointment, SERVICES, Service, rescheduleAppointment, onAppointmentRescheduled } from '@/lib/rdv-store'

interface Props {
  appointment: Appointment
  onClose: () => void
  onDone: () => void
}

export default function RescheduleModal({ appointment, onClose, onDone }: Props) {
  const [newDate, setNewDate] = useState<string | null>(null)
  const [newTime, setNewTime] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Reconstruct a Service object (FrozenCalendar needs one for duration/display)
  const service: Service = SERVICES.find((s) => s.id === appointment.serviceId) ?? {
    id: appointment.serviceId,
    label: appointment.serviceLabel,
    description: '',
    duration: appointment.duration as 30 | 60 | 120,
    estimatedValue: appointment.estimatedValue,
  }

  const handleSlot = (date: string, time: string) => {
    setNewDate(date)
    setNewTime(time)
  }

  const handleConfirm = async () => {
    if (!newDate || !newTime) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    onAppointmentRescheduled(appointment, newDate, newTime)
    rescheduleAppointment(appointment.id, newDate, newTime)
    setIsLoading(false)
    onDone()
  }

  const dateFormatted = newDate
    ? new Date(newDate + 'T12:00:00').toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'rgba(10,15,30,0.85)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="relative w-full sm:max-w-md frozen-card rounded-t-3xl sm:rounded-3xl border border-white/[0.09] overflow-hidden max-h-[92vh] flex flex-col"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-neon/[0.18] border border-violet-neon/30 flex items-center justify-center">
              <CalendarDays className="w-3.5 h-3.5 text-violet-bright" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Déplacer le rendez-vous</p>
              <p className="text-[11px] text-white/35">{appointment.client.name} · {appointment.serviceLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-all"
          >
            <X className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>

        {/* Current slot info */}
        <div className="mx-5 mt-4 mb-2 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center gap-2">
          <span className="text-[11px] text-white/35">Créneau actuel :</span>
          <span className="text-[11px] font-mono text-white/55">
            {new Date(appointment.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à {appointment.time}
          </span>
          {newDate && newTime && (
            <>
              <span className="text-white/20 mx-1">→</span>
              <span className="text-[11px] font-mono text-cyan-glacial font-semibold">
                {dateFormatted} à {newTime}
              </span>
            </>
          )}
        </div>

        {/* Calendar */}
        <div className="flex-1 overflow-y-auto px-5 py-2 min-h-0">
          <FrozenCalendar
            service={service}
            selectedDate={newDate}
            selectedTime={newTime}
            onSelect={handleSlot}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <AnimatePresence mode="wait">
            {newDate && newTime ? (
              <motion.button
                key="confirm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleConfirm}
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full shimmer-btn rounded-xl py-3.5 flex items-center justify-center gap-2 text-white font-semibold text-sm disabled:opacity-50"
                style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirmer le déplacement
                  </>
                )}
              </motion.button>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-white/25 py-2"
              >
                Sélectionnez un nouveau créneau sur le calendrier
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
