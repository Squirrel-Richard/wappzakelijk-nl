import { Metadata } from 'next'
import { OrganicBackground } from '@/components/OrganicBackground'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/landing/Footer'
import { PrijzenPreview } from '@/components/landing/PrijzenPreview'
import { CTASection } from '@/components/landing/CTASection'

export const metadata: Metadata = {
  title: 'Prijzen – WAppZakelijk',
  description: 'Transparante prijzen voor WhatsApp Business automation. Gratis tot €149/m. iDEAL beschikbaar. Geen verborgen kosten.',
}

export default function PrijzenPage() {
  return (
    <>
      <OrganicBackground />
      <Navigation />
      <main className="pt-20">
        <div className="py-20 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-black text-white">
            Eenvoudige{' '}
            <span className="gradient-text">prijzen.</span>
          </h1>
          <p className="mt-6 text-xl text-white/50 max-w-xl mx-auto">
            Begin gratis. Betaal pas als je groeit. iDEAL beschikbaar op alle betaalde plannen.
          </p>
        </div>
        <PrijzenPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
