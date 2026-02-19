import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'WAppZakelijk – WhatsApp Business inbox voor NL bedrijven',
    template: '%s | WAppZakelijk',
  },
  description: 'De #1 WhatsApp Business automation SaaS voor Nederlandse bedrijven. Gedeelde inbox, automatische antwoorden, iDEAL betaallinks. Begin gratis.',
  keywords: [
    'WhatsApp zakelijk NL',
    'WhatsApp Business inbox team',
    'WhatsApp automatisch antwoord',
    'WhatsApp betaallink iDEAL',
    'WhatsApp marketing NL',
    'WhatsApp zakelijk beheer',
    'WhatsApp customer service',
    'WhatsApp MKB Nederland',
    'WhatsApp gedeelde inbox',
    'WhatsApp automation software',
  ],
  authors: [{ name: 'AIOW BV' }],
  creator: 'AIOW BV',
  metadataBase: new URL('https://wappzakelijk.nl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://wappzakelijk.nl',
    siteName: 'WAppZakelijk',
    title: 'WAppZakelijk – WhatsApp Business inbox voor NL bedrijven',
    description: 'De #1 WhatsApp Business automation SaaS voor Nederlandse bedrijven. Gedeelde inbox, automatische antwoorden, iDEAL betaallinks.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WAppZakelijk – WhatsApp Business inbox voor NL bedrijven',
    description: 'De #1 WhatsApp Business automation SaaS voor Nederlandse bedrijven.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'WAppZakelijk',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://wappzakelijk.nl',
  description: 'WhatsApp Business inbox voor NL bedrijven. Gedeelde inbox, automatische antwoorden, iDEAL betaallinks.',
  inLanguage: 'nl-NL',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'EUR',
    lowPrice: '0',
    highPrice: '149',
    offerCount: 4,
    offers: [
      { '@type': 'Offer', name: 'Gratis', price: '0', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Starter', price: '25', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Pro', price: '59', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Business', price: '149', priceCurrency: 'EUR' },
    ],
  },
  publisher: {
    '@type': 'Organization',
    name: 'AIOW BV',
    url: 'https://aiow.io',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '47',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#030810] text-white antialiased" style={{ overflow: 'hidden auto' }}>
        {children}
      </body>
    </html>
  )
}
