import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://otterflow.fr'),
  title: 'OtterFlow — Agence Digitale Paris | Sites Web, SEO & Chatbot IA WhatsApp pour PME et TPE',
  description: 'OtterFlow crée des sites web, gère votre SEO local et déploie des chatbots IA sur WhatsApp pour les restaurants, hôtels, boutiques et PME en France. Devis gratuit en 24h.',
  keywords: [
    'agence digitale Paris',
    'création site web PME',
    'SEO local',
    'Google My Business',
    'chatbot WhatsApp IA',
    'Personal Shopper IA WhatsApp',
    'rebranding',
    'shooting photo professionnel',
    'site vitrine restaurant',
    'marketing digital PME TPE',
    'référencement naturel',
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
    title: 'OtterFlow — Agence Digitale Paris | Sites Web, SEO & Chatbot IA WhatsApp',
    description: 'OtterFlow crée des sites web, gère votre SEO local et déploie des chatbots IA sur WhatsApp pour les restaurants, hôtels, boutiques et PME en France. Devis gratuit en 24h.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'OtterFlow',
    images: [{ url: '/IMG_0258.webp', width: 800, height: 800, alt: 'OtterFlow — Agence Digitale Paris' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OtterFlow — Agence Digitale Paris | PME & TPE',
    description: 'Sites web, SEO local et chatbot IA WhatsApp pour restaurants, hôtels, boutiques et PME. Devis gratuit en 24h.',
    images: ['/IMG_0258.webp'],
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
