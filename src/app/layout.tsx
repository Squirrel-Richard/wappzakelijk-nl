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
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="bg-[#06060f] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
