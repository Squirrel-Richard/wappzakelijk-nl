'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'

const plannen = [
  {
    naam: 'Gratis',
    prijs: 0,
    periode: 'altijd gratis',
    features: ['1 gebruiker', '100 gesprekken/maand', 'Basis inbox'],
    highlight: false,
  },
  {
    naam: 'Starter',
    prijs: 25,
    periode: 'per maand',
    features: ['3 gebruikers', 'Onbeperkt gesprekken', 'Automations', 'Labels & toewijzing'],
    highlight: false,
  },
  {
    naam: 'Pro',
    prijs: 59,
    periode: 'per maand',
    features: ['10 gebruikers', 'Broadcasts', 'iDEAL betaallinks', 'Templates', 'Analytics'],
    highlight: true,
    badge: 'Meest gekozen',
  },
  {
    naam: 'Business',
    prijs: 149,
    periode: 'per maand',
    features: ['Onbeperkt gebruikers', 'REST API', 'Priority support', 'Custom integraties', 'SLA'],
    highlight: false,
  },
]

export function PrijzenPreview() {
  return (
    <section className="py-32 px-6" id="prijzen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="text-center mb-16"
        >
          <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Prijzen</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black text-white">
            Transparant geprijsd.{' '}
            <span className="text-white/30">Altijd.</span>
          </h2>
          <p className="mt-4 text-white/50 text-xl">iDEAL beschikbaar op alle betaalde plannen. Geen verborgen kosten.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plannen.map((plan, i) => (
            <motion.div
              key={plan.naam}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, delay: i * 0.1 }}
            >
              <div className={`relative rounded-2xl p-6 h-full flex flex-col ${
                plan.highlight
                  ? 'bg-gradient-to-b from-green-500/15 to-emerald-500/5 border-2 border-green-500/40'
                  : 'bg-white/5 border border-white/10'
              } backdrop-blur-xl`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs font-bold rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="text-sm font-semibold text-white/60 uppercase tracking-widest">{plan.naam}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">€{plan.prijs}</span>
                    <span className="text-white/40 text-sm">/{plan.periode}</span>
                  </div>
                </div>

                <ul className="mt-6 flex-1 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/onboarding"
                  className={`mt-8 block text-center py-3 rounded-xl font-semibold transition-all text-sm ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:opacity-90 shadow-lg shadow-green-500/20'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.prijs === 0 ? 'Gratis beginnen' : 'Probeer 14 dagen gratis'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
