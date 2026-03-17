import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RDV Auto — OtterFlow Ecosystem',
  description: 'Réservez votre intervention en ligne. 3 étapes simples, confirmation instantanée.',
}

export default function RdvAutoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
