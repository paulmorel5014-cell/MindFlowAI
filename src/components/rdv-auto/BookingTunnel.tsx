'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Wrench, CalendarDays, User } from 'lucide-react'
import ServiceSelector from './ServiceSelector'
import FrozenCalendar from './FrozenCalendar'
import ContactForm, { ContactData } from './ContactForm'
import ConfirmationOverlay from './ConfirmationOverlay'
import {
  DEFAULT_SERVICES, Service, Appointment,
  saveAppointment, onAppointmentCreated, getServices, getAppointments,
  type OtterFlowEvent,
} from '@/lib/rdv-store'
import { useAuth } from '@/hooks/useAuth'

type Step = 1 | 2 | 3

const STEPS = [
  { id: 1 as Step, label: 'Prestation', Icon: Wrench },
  { id: 2 as Step, label: 'Créneau',    Icon: CalendarDays },
  { id: 3 as Step, label: 'Contact',    Icon: User },
]

const slideVariants = {
  enter:  (d: 1 | -1) => ({ x: d * 70, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: 1 | -1) => ({ x: d * -70, opacity: 0 }),
}

interface Props {
  /** Pre-loaded services (public booking page). When omitted, fetched from Supabase/defaults. */
  services?: Service[]
  /** Artisan's UUID. When provided, submit via API (public mode). */
  artisanId?: string
  /** Pre-loaded appointments for slot availability (public booking page) */
  appointments?: Appointment[]
}

export default function BookingTunnel({ services: servicesProp, artisanId, appointments: apptsProp }: Props) {
  const { user } = useAuth()
  const [services, setServices]           = useState<Service[]>(servicesProp ?? DEFAULT_SERVICES)
  const [step, setStep]                   = useState<Step>(1)
  const [slideDir, setSlideDir]           = useState<1 | -1>(1)
  const [service, setService]             = useState<Service | null>(null)
  const [selectedDate, setSelectedDate]   = useState<string | null>(null)
  const [selectedTime, setSelectedTime]   = useState<string | null>(null)
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading]         = useState(false)

  // Load services from Supabase when in artisan mode (not public booking)
  useEffect(() => {
    if (servicesProp) { setServices(servicesProp); return }
    const uid = artisanId ?? user?.id
    if (!uid) return
    getServices(uid).then(setServices)
  }, [servicesProp, artisanId, user?.id])

  const goTo = (next: Step) => { setSlideDir(next > step ? 1 : -1); setStep(next) }

  const handleServiceSelect = (svc: Service) => {
    setService(svc)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const handleContact = async (contact: ContactData) => {
    if (!service || !selectedDate || !selectedTime) return
    setIsLoading(true)

    const isPublicMode = !!artisanId && !user

    if (isPublicMode) {
      // Public booking page → POST to API (saves to Supabase + sends email)
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artisanId,
          serviceId:      service.id,
          serviceLabel:   service.label,
          date:           selectedDate,
          time:           selectedTime,
          duration:       service.duration,
          estimatedValue: service.estimatedValue,
          clientName:     contact.name,
          clientPhone:    contact.phone,
          clientAddress:  contact.address,
          clientNotes:    contact.notes ?? null,
          clientEmail:    contact.email ?? null,
        }),
      })

      if (!res.ok) { setIsLoading(false); return }
      const { appointmentId } = await res.json()

      const appt: Appointment = {
        id: appointmentId ?? `rdv-${Date.now()}`,
        serviceId:     service.id,
        serviceLabel:  service.label,
        date:          selectedDate,
        time:          selectedTime,
        duration:      service.duration,
        client:        { name: contact.name, phone: contact.phone, address: contact.address, notes: contact.notes, email: contact.email },
        status:        'pending',
        estimatedValue: service.estimatedValue,
        createdAt:     new Date().toISOString(),
      }
      setConfirmedAppt(appt)
    } else {
      // Artisan's own page → localStorage + Supabase sync
      await new Promise((r) => setTimeout(r, 900))
      const appt: Appointment = {
        id:            `rdv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        serviceId:     service.id,
        serviceLabel:  service.label,
        date:          selectedDate,
        time:          selectedTime,
        duration:      service.duration,
        client:        { name: contact.name, phone: contact.phone, address: contact.address, notes: contact.notes, email: contact.email },
        status:        'pending',
        estimatedValue: service.estimatedValue,
        createdAt:     new Date().toISOString(),
      }
      saveAppointment(appt)
      onAppointmentCreated(appt)
      setConfirmedAppt(appt)
    }

    setIsLoading(false)
  }

  const canNext = (): boolean => {
    if (step === 1) return !!service
    if (step === 2) return !!(selectedDate && selectedTime)
    return false
  }

  const resetBooking = () => {
    setStep(1); setSlideDir(1); setService(null)
    setSelectedDate(null); setSelectedTime(null); setConfirmedAppt(null)
  }

  // Appointments for FrozenCalendar: use prop (public page) or localStorage
  const calendarAppointments = apptsProp ?? (artisanId && !user ? [] : undefined)

  return (
    <div className="flex flex-col">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-6">
        {STEPS.map(({ id, label, Icon }, i) => {
          const done = step > id; const current = step === id
          return (
            <div key={id} className="flex items-center flex-1 min-w-0">
              <motion.div layout className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium
                border transition-all duration-300 whitespace-nowrap
                ${current ? 'bg-violet-neon/[0.18] text-violet-bright border-violet-neon/35'
                : done    ? 'bg-cyan-glacial/[0.12] text-cyan-glacial border-cyan-glacial/25'
                : 'text-white/20 border-transparent'}
              `}>
                <Icon className="w-3 h-3 flex-shrink-0" /><span>{label}</span>
              </motion.div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px mx-1.5 bg-white/[0.07]" />}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={slideDir}>
          <motion.div
            key={step} custom={slideDir} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Choisissez votre prestation</h2>
                <p className="text-sm text-white/35 mb-5">Sélectionnez le type d&apos;intervention dont vous avez besoin.</p>
                <ServiceSelector services={services} selected={service} onSelect={handleServiceSelect} />
              </div>
            )}

            {step === 2 && service && (
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Sélectionnez un créneau</h2>
                <p className="text-sm text-white/35 mb-5">Les jours lumineux indiquent les disponibilités.</p>
                <FrozenCalendar
                  service={service}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelect={handleSlotSelect}
                  appointments={calendarAppointments}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Vos coordonnées</h2>
                <p className="text-sm text-white/35 mb-5">Renseignez vos informations pour finaliser le rendez-vous.</p>
                <ContactForm onSubmit={handleContact} isLoading={isLoading} showEmail={!!artisanId} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < 3 && (
        <motion.div
          className="flex items-center gap-3 mt-6 pt-4 border-t border-white/[0.06]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          {step > 1 && (
            <motion.button
              onClick={() => goTo((step - 1) as Step)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/45 text-sm hover:bg-white/[0.08] hover:text-white/65 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />Retour
            </motion.button>
          )}
          <motion.button
            onClick={() => canNext() && goTo((step + 1) as Step)}
            disabled={!canNext()}
            whileHover={canNext() ? { scale: 1.01 } : {}} whileTap={canNext() ? { scale: 0.98 } : {}}
            className="flex-1 shimmer-btn rounded-xl py-3 text-white font-semibold text-sm disabled:opacity-35 disabled:cursor-not-allowed"
            style={{ '--btn-bg': 'linear-gradient(135deg, #8B5CF6, #06B6D4)' } as React.CSSProperties}
          >
            {step === 1 ? 'Choisir un créneau →' : 'Mes coordonnées →'}
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence>
        {confirmedAppt && <ConfirmationOverlay appointment={confirmedAppt} onClose={resetBooking} />}
      </AnimatePresence>
    </div>
  )
}
