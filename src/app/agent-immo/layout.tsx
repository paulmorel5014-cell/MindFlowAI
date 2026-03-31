import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindFlow — Espace Agent Immobilier',
  description: 'Gérez votre portefeuille, planifiez vos visites et suivez vos leads en temps réel.',
}

export default function AgentImmoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="bg-space text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
