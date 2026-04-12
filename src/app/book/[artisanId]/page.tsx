import { createServerClient } from '@/lib/supabase-server'
import { DEFAULT_SERVICES, dbToAppointment, type Service, type Appointment } from '@/lib/rdv-store'
import PublicBookingClient from './PublicBookingClient'

interface Props {
  params: { artisanId: string }
}

export default async function PublicBookingPage({ params }: Props) {
  const { artisanId } = params
  const supabase = createServerClient()

  let services: Service[] = DEFAULT_SERVICES
  let appointments: Appointment[] = []
  let artisanName = 'Votre artisan'

  if (supabase) {
    const [svcRes, apptRes, profileRes] = await Promise.all([
      supabase.from('services').select('*').eq('artisan_id', artisanId).eq('active', true).order('position'),
      supabase.from('appointments').select('id, service_id, service_label, date, time, duration, status, estimated_value, created_at, client_name, client_phone, client_address').eq('artisan_id', artisanId).neq('status', 'cancelled'),
      supabase.from('profiles').select('name').eq('id', artisanId).single(),
    ])

    if (svcRes.data && svcRes.data.length > 0) {
      services = svcRes.data.map((s) => ({
        id:             String(s.id),
        label:          String(s.label),
        description:    String(s.description),
        duration:       Number(s.duration),
        estimatedValue: Number(s.estimated_value),
        active:         Boolean(s.active),
        position:       Number(s.position),
      }))
    }

    if (apptRes.data) {
      appointments = apptRes.data.map(dbToAppointment)
    }

    if (profileRes.data?.name) {
      artisanName = profileRes.data.name
    }
  }

  return (
    <PublicBookingClient
      artisanId={artisanId}
      artisanName={artisanName}
      services={services}
      appointments={appointments}
    />
  )
}
