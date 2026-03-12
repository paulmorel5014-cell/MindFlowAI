import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'MindFlow — L\'Architecture Digitale de Prestige',
  description: 'Agence digitale d\'excellence. Algorithmes prédictifs, flux de données et moteurs analytiques au service de votre croissance.',
  keywords: ['agence digitale', 'marketing digital', 'algorithmes', 'flux de données', 'croissance'],
  openGraph: {
    title: 'MindFlow — L\'Architecture Digitale de Prestige',
    description: 'Agence digitale d\'excellence. Algorithmes prédictifs et moteurs de croissance pour les marques d\'exception.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,800&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
