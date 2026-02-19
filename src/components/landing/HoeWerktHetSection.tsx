'use client'

import { motion } from 'framer-motion'

const stappen = [
  {
    nr: '01',
    title: 'Koppel je WhatsApp',
    desc: 'Verbind je WhatsApp Business nummer via de Meta API. Onze onboarding wizard leidt je er stap voor stap doorheen. Klaar in 10 minuten.',
  },
  {
    nr: '02',
    title: 'Nodig je team uit',
    desc: 'Voeg collega\'s toe aan de gedeelde inbox. Wijs rollen toe, stel kantooruren in en bepaal wie welke gesprekken beheert.',
  },
  {
    nr: '03',
    title: 'Automatiseer het werk',
    desc: 'Stel automatische antwoorden in voor buiten kantooruren. Maak templates voor veelgestelde vragen. Zet broadcasts klaar.',
  },
  {
    nr: '04',
    title: 'Factureer via WhatsApp',
    desc: 'Genereer een iDEAL betaallink en stuur hem direct in het gesprek. Klant betaalt binnen minuten, jij ontvangt een melding.',
  },
]

export function HoeWerktHetSection() {
  return (
    <section id="hoe-werkt-het" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="text-center mb-20"
        >
          <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Hoe werkt het</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black text-white">
            Van nul naar volledig{' '}
            <span className="gradient-text">in 10 minuten.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/50 via-purple-500/30 to-transparent hidden md:block" />

          <div className="flex flex-col gap-16">
            {stappen.map((stap, i) => (
              <motion.div
                key={stap.nr}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 25, delay: i * 0.1 }}
                className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="flex-1 md:text-right">
                  <div className={`${i % 2 !== 0 ? 'md:text-left' : ''}`}>
                    <div className="text-6xl font-black text-white/5 mb-2">{stap.nr}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{stap.title}</h3>
                    <p className="text-white/50 leading-relaxed max-w-md ml-auto">{stap.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 items-center justify-center font-bold text-black text-lg flex-shrink-0 shadow-xl shadow-green-500/30">
                  {stap.nr}
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
