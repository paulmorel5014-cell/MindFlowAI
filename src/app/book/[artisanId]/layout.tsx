import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Réserver un rendez-vous — RDV Auto',
  description: 'Prenez rendez-vous en ligne en 3 étapes simples.',
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
