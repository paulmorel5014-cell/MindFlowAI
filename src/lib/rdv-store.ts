// ─── RDV Auto — Data Store & OtterFlow Sync ──────────────────────────────────

export type ServiceId = 'diagnostic' | 'intervention' | 'devis'

export interface Service {
  id: ServiceId
  label: string
  description: string
  duration: 30 | 60 | 120
  estimatedValue: number
}

export interface Appointment {
  id: string
  serviceId: ServiceId
  serviceLabel: string
  date: string   // YYYY-MM-DD
  time: string   // HH:MM
  duration: number
  client: {
    name: string
    phone: string
    address: string
    notes?: string
  }
  status: 'pending' | 'confirmed' | 'cancelled'
  estimatedValue: number
  createdAt: string
}

export const SERVICES: Service[] = [
  {
    id: 'diagnostic',
    label: 'Diagnostic',
    description: 'Analyse complète de votre installation électrique',
    duration: 60,
    estimatedValue: 150,
  },
  {
    id: 'intervention',
    label: 'Intervention',
    description: 'Travaux, réparations et installations sur site',
    duration: 120,
    estimatedValue: 350,
  },
  {
    id: 'devis',
    label: 'Devis',
    description: 'Estimation gratuite et personnalisée pour votre projet',
    duration: 30,
    estimatedValue: 0,
  },
]

const STORAGE_KEY = 'rdv_auto_v1'
const EVENTS_KEY = 'rdv_events_v1'
const MAX_STORED_EVENTS = 50

// ─── Store update broadcast ────────────────────────────────────────────────────
// All mutations dispatch this event so React components can invalidate their caches.
function broadcastUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rdv:store-updated'))
  }
}

export function initializeStore(): void {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }
}

// ─── CRUD ──────────────────────────────────────────────────────────────────────

export function getAppointments(): Appointment[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(appointments: Appointment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  broadcastUpdate()
}

export function saveAppointment(appt: Appointment): void {
  const list = getAppointments()
  list.push(appt)
  persist(list)
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): void {
  const list = getAppointments()
  const idx = list.findIndex((a) => a.id === id)
  if (idx !== -1) {
    list[idx].status = status
    persist(list)
  }
}

export function cancelAppointment(id: string): void {
  updateAppointmentStatus(id, 'cancelled')
}

export function rescheduleAppointment(id: string, date: string, time: string): void {
  const list = getAppointments()
  const idx = list.findIndex((a) => a.id === id)
  if (idx !== -1) {
    list[idx].date = date
    list[idx].time = time
    list[idx].status = 'pending' // Reset to pending after reschedule
    persist(list)
  }
}

// ─── Slot logic ───────────────────────────────────────────────────────────────

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Check for overlap. Accepts a pre-loaded array to avoid repeated JSON.parse.
 */
export function hasConflict(
  date: string,
  time: string,
  duration: number,
  excludeId?: string,
  appointments?: Appointment[],
): boolean {
  const all = appointments ?? getAppointments()
  const startMin = timeToMinutes(time)
  const endMin = startMin + duration
  return all
    .filter((a) => a.date === date && a.id !== excludeId && a.status !== 'cancelled')
    .some((a) => {
      const aStart = timeToMinutes(a.time)
      const aEnd = aStart + a.duration
      return startMin < aEnd && endMin > aStart
    })
}

/**
 * Generate available time slots for a given day.
 * Pass `appointments` to avoid repeated localStorage reads.
 */
export function generateSlots(
  date: string,
  duration: number,
  appointments?: Appointment[],
): string[] {
  const appts = appointments ?? getAppointments()
  const slots: string[] = []
  for (let h = 8; h < 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      if (timeToMinutes(time) + duration > 18 * 60) continue
      if (!hasConflict(date, time, duration, undefined, appts)) {
        slots.push(time)
      }
    }
  }
  return slots
}

export function hasAvailableSlot(
  date: string,
  duration: number,
  appointments?: Appointment[],
): boolean {
  return generateSlots(date, duration, appointments).length > 0
}

// ─── OtterFlow Analytics ──────────────────────────────────────────────────────

export interface OtterFlowEvent {
  type: 'APPOINTMENT_CREATED' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'APPOINTMENT_RESCHEDULED'
  timestamp: string
  payload: {
    appointmentId: string
    serviceId: ServiceId
    estimatedValue: number
    date: string
    time: string
    clientName: string
  }
}

function dispatchOtterFlow(event: OtterFlowEvent): void {
  if (typeof window !== 'undefined') {
    // Persist to localStorage
    try {
      const raw = localStorage.getItem(EVENTS_KEY)
      const stored: OtterFlowEvent[] = raw ? JSON.parse(raw) : []
      stored.unshift(event)
      localStorage.setItem(EVENTS_KEY, JSON.stringify(stored.slice(0, MAX_STORED_EVENTS)))
    } catch { /* ignore */ }

    window.dispatchEvent(new CustomEvent('otterflow:appointment', { detail: event }))
    // eslint-disable-next-line no-console
    console.info(`[OtterFlow] ${event.type} →`, event.payload)
  }
}

export function getStoredEvents(): OtterFlowEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Called when the CLIENT submits the booking form (RDV en attente) */
export function onAppointmentCreated(appointment: Appointment): void {
  dispatchOtterFlow({
    type: 'APPOINTMENT_CREATED',
    timestamp: new Date().toISOString(),
    payload: {
      appointmentId: appointment.id,
      serviceId: appointment.serviceId,
      estimatedValue: appointment.estimatedValue,
      date: appointment.date,
      time: appointment.time,
      clientName: appointment.client.name,
    },
  })
}

/** Called when the ARTISAN confirms (valeur transmise au moteur CA) */
export function onAppointmentConfirmed(appointment: Appointment): void {
  dispatchOtterFlow({
    type: 'APPOINTMENT_CONFIRMED',
    timestamp: new Date().toISOString(),
    payload: {
      appointmentId: appointment.id,
      serviceId: appointment.serviceId,
      estimatedValue: appointment.estimatedValue,
      date: appointment.date,
      time: appointment.time,
      clientName: appointment.client.name,
    },
  })
}

/** Called when an appointment is cancelled */
export function onAppointmentCancelled(appointment: Appointment): void {
  dispatchOtterFlow({
    type: 'APPOINTMENT_CANCELLED',
    timestamp: new Date().toISOString(),
    payload: {
      appointmentId: appointment.id,
      serviceId: appointment.serviceId,
      estimatedValue: 0,
      date: appointment.date,
      time: appointment.time,
      clientName: appointment.client.name,
    },
  })
}

/** Called when an appointment is rescheduled */
export function onAppointmentRescheduled(appointment: Appointment, newDate: string, newTime: string): void {
  dispatchOtterFlow({
    type: 'APPOINTMENT_RESCHEDULED',
    timestamp: new Date().toISOString(),
    payload: {
      appointmentId: appointment.id,
      serviceId: appointment.serviceId,
      estimatedValue: appointment.estimatedValue,
      date: newDate,
      time: newTime,
      clientName: appointment.client.name,
    },
  })
}
