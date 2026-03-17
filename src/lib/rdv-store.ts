// ─── RDV Auto — Data Store & OtterFlow Sync ──────────────────────────────────
// Dual mode: Supabase when configured, localStorage fallback otherwise.

import { supabase, SUPABASE_ENABLED } from './supabase'
export { SUPABASE_ENABLED }

export type ServiceId = string  // UUID in Supabase mode, legacy string otherwise

export interface Service {
  id: string
  label: string
  description: string
  duration: number        // minutes
  estimatedValue: number
  active?: boolean
  position?: number
}

export interface Appointment {
  id: string
  serviceId: string
  serviceLabel: string
  date: string   // YYYY-MM-DD
  time: string   // HH:MM
  duration: number
  client: {
    name: string
    phone: string
    address: string
    notes?: string
    email?: string
  }
  status: 'pending' | 'confirmed' | 'cancelled'
  estimatedValue: number
  createdAt: string
}

// ─── Default services (used when Supabase not configured or artisan has none) ─

export const DEFAULT_SERVICES: Service[] = [
  { id: 'diagnostic',   label: 'Diagnostic',   description: 'Analyse complète de votre installation',      duration: 60,  estimatedValue: 150 },
  { id: 'intervention', label: 'Intervention', description: 'Travaux, réparations et installations sur site', duration: 120, estimatedValue: 350 },
  { id: 'devis',        label: 'Devis',        description: 'Estimation gratuite et personnalisée',           duration: 30,  estimatedValue: 0   },
]

// Keep SERVICES export for backward compat with components not yet migrated
export const SERVICES = DEFAULT_SERVICES

// ─── localStorage keys ────────────────────────────────────────────────────────

const STORAGE_KEY = 'rdv_auto_v1'
const EVENTS_KEY  = 'rdv_events_v1'
const MAX_STORED_EVENTS = 50

// ─── Broadcast ────────────────────────────────────────────────────────────────

function broadcastUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rdv:store-updated'))
  }
}

// ─── Init / Migration ─────────────────────────────────────────────────────────

export function initializeStore(): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: Appointment[] = JSON.parse(raw)
      const cleaned = parsed.filter((a) => !a.id.startsWith('seed-'))
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    }
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }
}

// ─── DB ↔ Appointment converters ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbToAppointment(row: any): Appointment {
  return {
    id:           String(row.id),
    serviceId:    String(row.service_id ?? row.serviceId ?? ''),
    serviceLabel: String(row.service_label ?? row.serviceLabel ?? ''),
    date:         String(row.date),
    time:         String(row.time ?? '').slice(0, 5),
    duration:     Number(row.duration),
    client: {
      name:    String(row.client_name ?? row.client?.name ?? ''),
      phone:   String(row.client_phone ?? row.client?.phone ?? ''),
      address: String(row.client_address ?? row.client?.address ?? ''),
      notes:   row.client_notes ?? row.client?.notes ?? undefined,
      email:   row.client_email ?? row.client?.email ?? undefined,
    },
    status:         (row.status ?? 'pending') as Appointment['status'],
    estimatedValue: Number(row.estimated_value ?? row.estimatedValue ?? 0),
    createdAt:      String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  }
}

function appointmentToDb(appt: Appointment, artisanId: string): Record<string, unknown> {
  return {
    id:              appt.id,
    artisan_id:      artisanId,
    service_id:      appt.serviceId || null,
    service_label:   appt.serviceLabel,
    date:            appt.date,
    time:            appt.time,
    duration:        appt.duration,
    status:          appt.status,
    estimated_value: appt.estimatedValue,
    client_name:     appt.client.name,
    client_phone:    appt.client.phone,
    client_address:  appt.client.address,
    client_notes:    appt.client.notes ?? null,
    client_email:    appt.client.email ?? null,
    created_at:      appt.createdAt,
  }
}

// ─── CRUD — localStorage (sync, used by FrozenCalendar / AdminTimeline) ───────

export function getAppointments(): Appointment[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function persist(appointments: Appointment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  broadcastUpdate()
}

export function saveAppointment(appt: Appointment): void {
  const list = getAppointments()
  list.push(appt)
  persist(list)

  // Background Supabase sync
  if (SUPABASE_ENABLED) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      supabase.from('appointments')
        .upsert(appointmentToDb(appt, session.user.id))
        .then(({ error }) => { if (error) console.error('[RDV] Supabase save error:', error) })
    })
  }
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): void {
  const list = getAppointments()
  const idx = list.findIndex((a) => a.id === id)
  if (idx !== -1) {
    list[idx].status = status
    persist(list)
  }

  if (SUPABASE_ENABLED) {
    supabase.from('appointments').update({ status }).eq('id', id)
      .then(({ error }) => { if (error) console.error('[RDV] Supabase update error:', error) })
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
    list[idx].status = 'pending'
    persist(list)
  }

  if (SUPABASE_ENABLED) {
    supabase.from('appointments').update({ date, time, status: 'pending' }).eq('id', id)
      .then(({ error }) => { if (error) console.error('[RDV] Supabase reschedule error:', error) })
  }
}

// ─── Supabase sync — pull remote appointments into localStorage ───────────────

export async function syncAppointmentsFromSupabase(artisanId: string): Promise<void> {
  if (!SUPABASE_ENABLED) return
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('artisan_id', artisanId)
    .neq('status', 'cancelled')
  if (error) { console.error('[RDV] Supabase fetch error:', error); return }
  if (data) {
    const appointments = data.map(dbToAppointment)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
      broadcastUpdate()
    }
  }
}

// ─── Services (Supabase or defaults) ─────────────────────────────────────────

export async function getServices(artisanId: string): Promise<Service[]> {
  if (!SUPABASE_ENABLED) return DEFAULT_SERVICES
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('artisan_id', artisanId)
    .eq('active', true)
    .order('position')
  if (error || !data || data.length === 0) return DEFAULT_SERVICES
  return data.map((s) => ({
    id:             String(s.id),
    label:          String(s.label),
    description:    String(s.description),
    duration:       Number(s.duration),
    estimatedValue: Number(s.estimated_value),
    active:         Boolean(s.active),
    position:       Number(s.position),
  }))
}

export async function createService(
  artisanId: string,
  service: Omit<Service, 'id' | 'active' | 'position'>,
): Promise<Service | null> {
  if (!SUPABASE_ENABLED) return null
  const { data, error } = await supabase.from('services').insert({
    artisan_id:      artisanId,
    label:           service.label,
    description:     service.description,
    duration:        service.duration,
    estimated_value: service.estimatedValue,
    active:          true,
    position:        0,
  }).select().single()
  if (error) { console.error('[Services] Create error:', error); return null }
  return {
    id:             String(data.id),
    label:          String(data.label),
    description:    String(data.description),
    duration:       Number(data.duration),
    estimatedValue: Number(data.estimated_value),
    active:         true,
    position:       0,
  }
}

export async function updateService(id: string, updates: Partial<Omit<Service, 'id'>>): Promise<void> {
  if (!SUPABASE_ENABLED) return
  const dbUpdates: Record<string, unknown> = {}
  if (updates.label       !== undefined) dbUpdates.label           = updates.label
  if (updates.description !== undefined) dbUpdates.description     = updates.description
  if (updates.duration    !== undefined) dbUpdates.duration        = updates.duration
  if (updates.estimatedValue !== undefined) dbUpdates.estimated_value = updates.estimatedValue
  if (updates.active      !== undefined) dbUpdates.active          = updates.active
  if (updates.position    !== undefined) dbUpdates.position        = updates.position
  const { error } = await supabase.from('services').update(dbUpdates).eq('id', id)
  if (error) console.error('[Services] Update error:', error)
}

export async function deleteService(id: string): Promise<void> {
  if (!SUPABASE_ENABLED) return
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) console.error('[Services] Delete error:', error)
}

// ─── Slot logic (pure functions — unchanged) ──────────────────────────────────

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function hasConflict(
  date: string, time: string, duration: number,
  excludeId?: string, appointments?: Appointment[],
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

export function generateSlots(
  date: string, duration: number, appointments?: Appointment[],
): string[] {
  const appts = appointments ?? getAppointments()
  const slots: string[] = []
  for (let h = 8; h < 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      if (timeToMinutes(time) + duration > 18 * 60) continue
      if (!hasConflict(date, time, duration, undefined, appts)) slots.push(time)
    }
  }
  return slots
}

export function hasAvailableSlot(
  date: string, duration: number, appointments?: Appointment[],
): boolean {
  return generateSlots(date, duration, appointments).length > 0
}

// ─── OtterFlow Analytics ──────────────────────────────────────────────────────

export interface OtterFlowEvent {
  type: 'APPOINTMENT_CREATED' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'APPOINTMENT_RESCHEDULED'
  timestamp: string
  payload: {
    appointmentId: string
    serviceId: string
    estimatedValue: number
    date: string
    time: string
    clientName: string
  }
}

function dispatchOtterFlow(event: OtterFlowEvent): void {
  if (typeof window === 'undefined') return

  // Persist to localStorage
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    const stored: OtterFlowEvent[] = raw ? JSON.parse(raw) : []
    stored.unshift(event)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(stored.slice(0, MAX_STORED_EVENTS)))
  } catch { /* ignore */ }

  window.dispatchEvent(new CustomEvent('otterflow:appointment', { detail: event }))

  // Background sync to Supabase rdv_events
  if (SUPABASE_ENABLED) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      supabase.from('rdv_events').insert({
        artisan_id:     session.user.id,
        appointment_id: event.payload.appointmentId,
        type:           event.type,
        payload:        event.payload,
        created_at:     event.timestamp,
      }).then(({ error }) => { if (error) console.error('[OtterFlow] Supabase event error:', error) })
    })
  }

  console.info(`[OtterFlow] ${event.type} →`, event.payload)
}

export function getStoredEvents(): OtterFlowEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function onAppointmentCreated(appointment: Appointment): void {
  dispatchOtterFlow({
    type: 'APPOINTMENT_CREATED', timestamp: new Date().toISOString(),
    payload: { appointmentId: appointment.id, serviceId: appointment.serviceId, estimatedValue: appointment.estimatedValue, date: appointment.date, time: appointment.time, clientName: appointment.client.name },
  })
}

export function onAppointmentConfirmed(appointment: Appointment): void {
  dispatchOtterFlow({
    type: 'APPOINTMENT_CONFIRMED', timestamp: new Date().toISOString(),
    payload: { appointmentId: appointment.id, serviceId: appointment.serviceId, estimatedValue: appointment.estimatedValue, date: appointment.date, time: appointment.time, clientName: appointment.client.name },
  })
}

export function onAppointmentCancelled(appointment: Appointment): void {
  dispatchOtterFlow({
    type: 'APPOINTMENT_CANCELLED', timestamp: new Date().toISOString(),
    payload: { appointmentId: appointment.id, serviceId: appointment.serviceId, estimatedValue: 0, date: appointment.date, time: appointment.time, clientName: appointment.client.name },
  })
}

export function onAppointmentRescheduled(appointment: Appointment, newDate: string, newTime: string): void {
  dispatchOtterFlow({
    type: 'APPOINTMENT_RESCHEDULED', timestamp: new Date().toISOString(),
    payload: { appointmentId: appointment.id, serviceId: appointment.serviceId, estimatedValue: appointment.estimatedValue, date: newDate, time: newTime, clientName: appointment.client.name },
  })
}
