import { Metadata } from 'next'
import { OrganicBackground } from '@/components/OrganicBackground'
import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HoeWerktHetSection } from '@/components/landing/HoeWerktHetSection'
import { PrijzenPreview } from '@/components/landing/PrijzenPreview'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'WAppZakelijk – WhatsApp Business inbox voor NL bedrijven',
  description: 'Beheer WhatsApp met je team. Automatische antwoorden. iDEAL betaallinks direct in chat. De NL-native WhatsApp Business oplossing voor MKB.',
}

export default function HomePage() {
  return (
    <>
      <OrganicBackground />
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HoeWerktHetSection />
        <PrijzenPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
