import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export const PLANS = {
  gratis: {
    naam: 'Gratis',
    prijs: 0,
    gebruikers: 1,
    gesprekken: 100,
    features: ['1 gebruiker', '100 gesprekken/maand', 'Basis inbox'],
    stripeId: null,
  },
  starter: {
    naam: 'Starter',
    prijs: 25,
    gebruikers: 3,
    gesprekken: -1,
    features: ['3 gebruikers', 'Onbeperkt gesprekken', 'Automations', 'Labels & toewijzingen'],
    stripeId: 'price_starter_monthly',
  },
  pro: {
    naam: 'Pro',
    prijs: 59,
    gebruikers: 10,
    gesprekken: -1,
    features: ['10 gebruikers', 'Broadcasts', 'iDEAL betaallinks', 'Templates', 'Analytics'],
    stripeId: 'price_pro_monthly',
  },
  business: {
    naam: 'Business',
    prijs: 149,
    gebruikers: -1,
    gesprekken: -1,
    features: ['Onbeperkt gebruikers', 'REST API', 'Priority support', 'Custom integraties', 'SLA'],
    stripeId: 'price_business_monthly',
  },
}
