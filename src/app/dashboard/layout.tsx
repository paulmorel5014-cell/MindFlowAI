import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OtterFlow Analytics — Tableau de Bord',
  description: 'Moteur de Flux Prédictif — Intelligence de Marché pour artisans et indépendants',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="bg-space text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
