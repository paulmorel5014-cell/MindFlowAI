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
  }
  status: 'pending' | 'confirmed'
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

function getDateOffset(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function makeSeedAppointments(): Appointment[] {
  const today = getDateOffset(0)
  const tomorrow = getDateOffset(1)
  const d2 = getDateOffset(2)
  return [
    {
      id: 'seed-0',
      serviceId: 'diagnostic',
      serviceLabel: 'Diagnostic',
      date: today,
      time: '09:00',
      duration: 60,
      client: { name: 'Sophie Martin', phone: '06 12 34 56 78', address: '12 rue des Lilas, Lyon' },
      status: 'confirmed',
      estimatedValue: 150,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-1',
      serviceId: 'intervention',
      serviceLabel: 'Intervention',
      date: today,
      time: '14:00',
      duration: 120,
      client: { name: 'Marc Dupont', phone: '07 89 01 23 45', address: '5 avenue Foch, Lyon' },
      status: 'confirmed',
      estimatedValue: 350,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-2',
      serviceId: 'devis',
      serviceLabel: 'Devis',
      date: tomorrow,
      time: '10:00',
      duration: 30,
      client: { name: 'Isabelle Renard', phone: '06 55 44 33 22', address: '8 rue Voltaire, Villeurbanne' },
      status: 'pending',
      estimatedValue: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-3',
      serviceId: 'diagnostic',
      serviceLabel: 'Diagnostic',
      date: d2,
      time: '11:00',
      duration: 60,
      client: { name: 'Paul Laurent', phone: '06 77 88 99 00', address: '3 cours Gambetta, Lyon' },
      status: 'pending',
      estimatedValue: 150,
      createdAt: new Date().toISOString(),
    },
  ]
}

export function initializeStore(): void {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(makeSeedAppointments()))
  }
}

export function getAppointments(): Appointment[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveAppointment(appt: Appointment): void {
  const appointments = getAppointments()
  appointments.push(appt)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): void {
  const appointments = getAppointments()
  const idx = appointments.findIndex((a) => a.id === id)
  if (idx !== -1) {
    appointments[idx].status = status
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  }
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function hasConflict(
  date: string,
  time: string,
  duration: number,
  excludeId?: string,
): boolean {
  const startMin = timeToMinutes(time)
  const endMin = startMin + duration
  const allForDay = getAppointments().filter(
    (a) => a.date === date && a.id !== excludeId,
  )
  return allForDay.some((a) => {
    const aStart = timeToMinutes(a.time)
    const aEnd = aStart + a.duration
    return startMin < aEnd && endMin > aStart
  })
}

export function generateSlots(date: string, duration: number): string[] {
  const slots: string[] = []
  for (let h = 8; h < 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      const endMin = timeToMinutes(time) + duration
      if (endMin > 18 * 60) continue
      if (!hasConflict(date, time, duration)) {
        slots.push(time)
      }
    }
  }
  return slots
}

export function hasAvailableSlot(date: string, duration: number): boolean {
  return generateSlots(date, duration).length > 0
}

// ─── OtterFlow Analytics — Moteur de Synchronisation Temporelle ──────────────

export interface OtterFlowEvent {
  type: 'APPOINTMENT_CONFIRMED'
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

export function onAppointmentConfirm(appointment: Appointment): void {
  const event: OtterFlowEvent = {
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
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('otterflow:appointment', { detail: event }))
    // eslint-disable-next-line no-console
    console.info('[OtterFlow] Synchronisation Temporelle →', event)
  }
}
