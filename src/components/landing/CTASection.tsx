'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="relative rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-16 overflow-hidden"
        >
          {/* Background orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 breathe" />

          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Klaar om te starten?
            </h2>
            <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
              Sluit je aan bij honderden Nederlandse bedrijven die WhatsApp professioneel beheren met WAppZakelijk.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="px-10 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold text-lg rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-green-500/25"
              >
                Gratis beginnen →
              </Link>
              <Link
                href="/prijzen"
                className="px-10 py-4 bg-white/5 border border-white/10 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all"
              >
                Bekijk prijzen
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/30">
              Geen creditcard nodig · iDEAL beschikbaar · NL support
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
