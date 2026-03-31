import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { sendBookingConfirmation } from '@/lib/email'
import { dbToAppointment } from '@/lib/rdv-store'

// ─── POST /api/appointments — Public booking (client submits from /book/[id]) ─

export async function POST(request: Request) {
  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    artisanId, serviceId, serviceLabel,
    date, time, duration, estimatedValue,
    clientName, clientPhone, clientAddress, clientNotes, clientEmail,
  } = body as Record<string, string | number | null>

  if (!artisanId || !serviceLabel || !date || !time || !duration || !clientName || !clientPhone || !clientAddress) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Insert appointment (service role bypasses RLS)
  const { data: appt, error } = await supabase.from('appointments').insert({
    artisan_id:      artisanId,
    service_id:      serviceId ?? null,
    service_label:   serviceLabel,
    date,
    time,
    duration,
    status:          'pending',
    estimated_value: estimatedValue ?? 0,
    client_name:     clientName,
    client_phone:    clientPhone,
    client_address:  clientAddress,
    client_notes:    clientNotes ?? null,
    client_email:    clientEmail ?? null,
  }).select().single()

  if (error) {
    console.error('[API/appointments] Insert error:', error)
    return NextResponse.json({ error: 'Failed to save appointment' }, { status: 500 })
  }

  // Insert OtterFlow event so the artisan's dashboard updates in real-time
  await supabase.from('rdv_events').insert({
    artisan_id:     artisanId,
    appointment_id: appt.id,
    type:           'APPOINTMENT_CREATED',
    payload: {
      appointmentId:  appt.id,
      serviceId:      serviceId ?? '',
      estimatedValue: estimatedValue ?? 0,
      date,
      time,
      clientName,
    },
  })

  // Send confirmation email (fire and forget — never block response)
  if (clientEmail && typeof clientEmail === 'string') {
    sendBookingConfirmation({
      clientName:   String(clientName),
      clientEmail,
      serviceLabel: String(serviceLabel),
      date:         String(date),
      time:         String(time),
      address:      String(clientAddress),
    }).catch((err) => console.error('[Email] Confirmation failed:', err))
  }

  return NextResponse.json({ ok: true, appointmentId: appt.id })
}

// ─── GET /api/appointments?artisanId=xxx — Public availability fetch ──────────

export async function GET(request: Request) {
  const supabase = createServerClient()
  if (!supabase) return NextResponse.json([])

  const { searchParams } = new URL(request.url)
  const artisanId = searchParams.get('artisanId')
  if (!artisanId) return NextResponse.json([])

  const { data } = await supabase
    .from('appointments')
    .select('id, service_id, service_label, date, time, duration, status, estimated_value, created_at, client_name, client_phone, client_address')
    .eq('artisan_id', artisanId)
    .neq('status', 'cancelled')

  return NextResponse.json((data ?? []).map(dbToAppointment))
}
