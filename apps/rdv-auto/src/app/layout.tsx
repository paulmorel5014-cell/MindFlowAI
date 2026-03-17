import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RDV Auto — OtterFlow',
  description: 'Réservez votre intervention en ligne. 3 étapes simples, confirmation instantanée.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RDV Auto',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A0F1E" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
