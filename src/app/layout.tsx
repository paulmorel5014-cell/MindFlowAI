import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'OtterFlow — Agence Digitale | Sites Web, SEO & IA pour PME et TPE',
  description: 'OtterFlow crée des sites web professionnels, optimise votre référencement Google (SEO) et déploie des chatbots IA WhatsApp pour restaurants, hôtels, boutiques et PME. Setup rapide, résultats mesurables.',
  keywords: [
    'agence digitale',
    'création site web',
    'SEO local',
    'Google My Business',
    'chatbot WhatsApp IA',
    'rebranding',
    'shooting photo professionnel',
    'site vitrine',
    'application sur mesure',
    'marketing digital PME',
    'référencement naturel',
    'Personal Shopper IA',
    'OtterFlow',
  ],
  authors: [{ name: 'Paul Morel', url: 'https://otterflow.fr' }],
  creator: 'OtterFlow',
  publisher: 'OtterFlow',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'OtterFlow — Sites Web, SEO & Chatbot IA WhatsApp',
    description: 'Agence digitale spécialisée PME et TPE. Sites vitrine, SEO local, Google My Business, rebranding et Personal Shopper IA sur WhatsApp.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'OtterFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OtterFlow — Agence Digitale PME & TPE',
    description: 'Sites web, SEO, Google My Business et chatbot IA WhatsApp pour restaurants, hôtels, boutiques et PME.',
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
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Caveat:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
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
