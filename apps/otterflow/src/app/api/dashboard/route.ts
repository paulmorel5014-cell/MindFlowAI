import { NextResponse } from 'next/server'

export interface DashboardStats {
  confirmedRdv: number
  totalSlots: number
  averageBasket: number
  lastMonthRevenue: number
  visitors: number
  calendarClicks: number
  weeklyAppointments: number[][]
  regions: { name: string; demand: number; city: string }[]
  monthlyTrend: number[]
}

export interface RDVAutoEvent {
  id: string
  timestamp: string
  clientName: string
  service: string
  amount: number
  source: 'rdv-auto' | 'manual' | 'website'
  status: 'confirmed' | 'pending' | 'cancelled'
}

function generateMockData(): { stats: DashboardStats; recentEvents: RDVAutoEvent[] } {
  const stats: DashboardStats = {
    confirmedRdv: 23,
    totalSlots: 32,
    averageBasket: 420,
    lastMonthRevenue: 7800,
    visitors: 1240,
    calendarClicks: 187,
    weeklyAppointments: [
      [2, 4, 3, 5, 6, 2, 1], // semaine 1 (L-D)
      [3, 5, 4, 6, 7, 3, 0], // semaine 2
      [4, 6, 5, 7, 8, 4, 1], // semaine 3 (prédictif)
      [5, 7, 6, 8, 9, 5, 2], // semaine 4 (prédictif)
    ],
    regions: [
      { name: 'Île-de-France', demand: 92, city: 'Paris' },
      { name: 'Auvergne-Rhône-Alpes', demand: 78, city: 'Lyon' },
      { name: 'Provence-Alpes-Côte d\'Azur', demand: 71, city: 'Marseille' },
      { name: 'Occitanie', demand: 58, city: 'Toulouse' },
      { name: 'Nouvelle-Aquitaine', demand: 52, city: 'Bordeaux' },
      { name: 'Hauts-de-France', demand: 45, city: 'Lille' },
      { name: 'Grand Est', demand: 38, city: 'Strasbourg' },
      { name: 'Bretagne', demand: 34, city: 'Rennes' },
    ],
    monthlyTrend: [5800, 6200, 5900, 7100, 6800, 7800],
  }

  const services = [
    'Consultation initiale',
    'Audit complet',
    'Suivi mensuel',
    'Devis personnalisé',
    'Formation client',
    'Prestation sur site',
  ]

  const clients = [
    'Sophie M.', 'Marc D.', 'Isabelle R.', 'Paul L.', 'Claire V.',
    'Thomas B.', 'Amandine K.', 'Romain F.', 'Léa P.', 'Antoine C.',
  ]

  const amounts = [320, 450, 380, 520, 290, 680, 410, 560, 340, 490]

  const recentEvents: RDVAutoEvent[] = Array.from({ length: 8 }, (_, i) => ({
    id: `evt-${Date.now()}-${i}`,
    timestamp: new Date(Date.now() - i * 7 * 60 * 1000).toISOString(),
    clientName: clients[i % clients.length],
    service: services[i % services.length],
    amount: amounts[i % amounts.length],
    source: i % 3 === 0 ? 'rdv-auto' : i % 3 === 1 ? 'website' : 'manual',
    status: i < 5 ? 'confirmed' : 'pending',
  }))

  return { stats, recentEvents }
}

export async function GET() {
  const rdvAutoUrl = process.env.RDV_AUTO_API_URL

  if (rdvAutoUrl) {
    try {
      const res = await fetch(`${rdvAutoUrl}/api/stats`, {
        headers: { Authorization: `Bearer ${process.env.RDV_AUTO_API_KEY ?? ''}` },
        next: { revalidate: 30 },
      })
      if (res.ok) {
        const data = await res.json()
        return NextResponse.json({ ...data, source: 'rdv-auto' })
      }
    } catch {
      // Fall through to mock data
    }
  }

  const mockData = generateMockData()
  return NextResponse.json({ ...mockData, source: 'demo' })
}
