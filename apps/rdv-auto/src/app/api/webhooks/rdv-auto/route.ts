import { NextRequest, NextResponse } from 'next/server'
import type { RDVAutoEvent } from '../../dashboard/route'

// In-memory store — replace with DB/Redis in production
const eventBuffer: RDVAutoEvent[] = []

function verifyHmacSignature(body: string, signature: string, secret: string): boolean {
  // Simple HMAC-SHA256 verification stub
  // In production: use crypto.createHmac('sha256', secret).update(body).digest('hex')
  return signature.length > 0 && secret.length > 0
}

export async function POST(request: NextRequest) {
  const secret = process.env.RDV_AUTO_WEBHOOK_SECRET

  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const signature = request.headers.get('x-rdvauto-signature') ?? ''
  const body = await request.text()

  if (!verifyHmacSignature(body, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: RDVAutoEvent
  try {
    event = JSON.parse(body) as RDVAutoEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Store event (max 50 in buffer)
  eventBuffer.unshift(event)
  if (eventBuffer.length > 50) eventBuffer.pop()

  return NextResponse.json({ received: true, eventId: event.id })
}

// Allow dashboard to fetch buffered webhook events
export async function GET() {
  return NextResponse.json({ events: eventBuffer.slice(0, 20) })
}
