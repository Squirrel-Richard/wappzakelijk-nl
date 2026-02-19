'use client'

import { motion } from 'framer-motion'
import { Users, Bot, Layout, Radio, CreditCard } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'

const features = [
  {
    icon: Users,
    title: 'Gedeelde inbox',
    description: 'Heel je team beheert WhatsApp berichten samen. Wijs gesprekken toe, label ze en sluit ze — nooit meer dubbele antwoorden.',
    color: 'from-blue-400 to-cyan-500',
    glow: 'shadow-blue-500/20',
  },
  {
    icon: Bot,
    title: 'Automatische antwoorden',
    description: 'Stel regels in voor buiten kantooruren, eerste contact of veelgestelde vragen. Jij bepaalt wat je klant krijgt te zien.',
    color: 'from-purple-400 to-pink-500',
    glow: 'shadow-purple-500/20',
  },
  {
    icon: Layout,
    title: 'WhatsApp templates',
    description: 'Goedgekeurde templates voor orderbevestiging, afspraakherinnering en betaalverzoek. In seconden verstuurd.',
    color: 'from-orange-400 to-amber-500',
    glow: 'shadow-orange-500/20',
  },
  {
    icon: Radio,
    title: 'Broadcast campagnes',
    description: 'Bereik je hele klantenlijst met één bericht. GDPR-compliant, opt-in beheer ingebouwd. Hoge open rates gegarandeerd.',
    color: 'from-green-400 to-emerald-500',
    glow: 'shadow-green-500/20',
  },
  {
    icon: CreditCard,
    title: 'iDEAL betaallinks',
    description: 'Genereer een iDEAL betaallink en stuur hem direct in het gesprek. Klant betaalt, jij krijgt melding. Zo simpel.',
    color: 'from-red-400 to-rose-500',
    glow: 'shadow-red-500/20',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="text-center mb-20"
        >
          <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Features</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black text-white leading-tight">
            Alles wat je nodig hebt.
            <br />
            <span className="text-white/30">Niets wat je niet nodig hebt.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <GlassCard hover className={`p-8 h-full ${i === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-xl ${feature.glow}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
