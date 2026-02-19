import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard', '/gesprek/', '/automations', '/templates', '/broadcasts', '/betaallinks', '/onboarding'],
    },
    sitemap: 'https://wappzakelijk.nl/sitemap.xml',
  }
}
