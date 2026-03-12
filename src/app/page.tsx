import Navigation from '@/components/Navigation'
import Hero from '@/components/sections/Hero'
import Lab from '@/components/sections/Lab'
import Portfolio from '@/components/sections/Portfolio'
import Pricing from '@/components/sections/Pricing'
import CEOEngagement from '@/components/sections/CEOEngagement'
import Configurator from '@/components/sections/Configurator'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <Navigation />
      <Hero />
      <Lab />
      <Portfolio />
      <Pricing />
      <CEOEngagement />
      <Configurator />
      <Footer />
    </main>
  )
}
