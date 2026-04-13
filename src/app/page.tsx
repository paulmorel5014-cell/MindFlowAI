import Navigation from '@/components/Navigation'
import Hero from '@/components/sections/Hero'
import Lab from '@/components/sections/Lab'
import Process from '@/components/sections/Process'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/Pricing'
import CEOEngagement from '@/components/sections/CEOEngagement'
import FAQ from '@/components/sections/FAQ'
import Configurator from '@/components/sections/Configurator'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import FloatingActions from '@/components/FloatingActions'

export default function Home() {
  return (
    <>
      <main className="relative overflow-x-hidden">
        <Navigation />
        <Hero />
        <Lab />
        <Process />
        <Testimonials />
        <Pricing />
        <CEOEngagement />
        <FAQ />
        <Configurator />
        <Footer />
      </main>
      <CookieBanner />
      <FloatingActions />
    </>
  )
}
