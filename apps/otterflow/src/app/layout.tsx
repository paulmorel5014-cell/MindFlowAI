import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OtterFlow Analytics — Tableau de Bord',
  description: 'Moteur de Flux Prédictif — Intelligence de Marché pour artisans et indépendants.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OtterFlow',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A0F1E" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-space text-white antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
