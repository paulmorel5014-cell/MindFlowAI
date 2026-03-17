// ─── Email notifications via Resend ───────────────────────────────────────────
// Server-side only. Never import in client components.

interface BookingEmailData {
  clientName: string
  clientEmail: string
  serviceLabel: string
  date: string        // YYYY-MM-DD
  time: string        // HH:MM
  address: string
  artisanName?: string
}

const FROM = process.env.RESEND_FROM ?? 'RDV Auto <noreply@mindflow.fr>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

function formatDateFR(date: string): string {
  return new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function buildConfirmationHtml(data: BookingEmailData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Confirmation RDV</title></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0F1628;border-radius:16px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#8B5CF6,#06B6D4);padding:32px;text-align:center;">
          <div style="font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;font-family:monospace;margin-bottom:8px;">OtterFlow Ecosystem</div>
          <div style="font-size:24px;font-weight:700;color:#fff;">RDV Confirmé ✓</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;">Bonjour <strong style="color:#fff;">${data.clientName}</strong>,</p>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;">Votre rendez-vous a bien été enregistré. Voici le récapitulatif :</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;margin-bottom:24px;">
            ${row('Prestation', data.serviceLabel, '#A5F3FC')}
            ${row('Date', formatDateFR(data.date), '#A78BFA')}
            ${row('Heure', data.time, '#A78BFA')}
            ${row('Adresse', data.address, 'rgba(255,255,255,0.5)')}
          </table>

          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 8px;">Vous recevrez un rappel la veille de votre rendez-vous.</p>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">Pour toute modification, contactez directement votre artisan.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
          <span style="color:rgba(255,255,255,0.2);font-size:11px;font-family:monospace;">RDV Auto — ${APP_URL}</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildReminderHtml(data: BookingEmailData): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Rappel RDV demain</title></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0F1628;border-radius:16px;border:1px solid rgba(212,175,114,0.2);overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#D4AF72,#8B5CF6);padding:32px;text-align:center;">
          <div style="font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:3px;text-transform:uppercase;font-family:monospace;margin-bottom:8px;">Rappel</div>
          <div style="font-size:24px;font-weight:700;color:#fff;">Votre RDV est demain 🔔</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px;">Bonjour <strong style="color:#fff;">${data.clientName}</strong>, n&apos;oubliez pas votre rendez-vous de demain !</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;margin-bottom:24px;">
            ${row('Prestation', data.serviceLabel, '#A5F3FC')}
            ${row('Date', formatDateFR(data.date), '#FCD34D')}
            ${row('Heure', data.time, '#FCD34D')}
            ${row('Adresse', data.address, 'rgba(255,255,255,0.5)')}
          </table>
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
          <span style="color:rgba(255,255,255,0.2);font-size:11px;font-family:monospace;">RDV Auto — ${APP_URL}</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function row(label: string, value: string, color: string): string {
  return `<tr>
    <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.35);font-size:12px;width:40%;">${label}</td>
    <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.05);color:${color};font-size:13px;font-weight:600;">${value}</td>
  </tr>`
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set — email not sent')
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  })
  if (!res.ok) {
    const body = await res.text()
    console.error('[Email] Resend error:', res.status, body)
  }
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  await sendEmail(
    data.clientEmail,
    `Confirmation — ${data.serviceLabel} le ${formatDateFR(data.date)}`,
    buildConfirmationHtml(data),
  )
}

export async function sendBookingReminder(data: BookingEmailData): Promise<void> {
  await sendEmail(
    data.clientEmail,
    `Rappel — Votre RDV de demain : ${data.serviceLabel}`,
    buildReminderHtml(data),
  )
}
