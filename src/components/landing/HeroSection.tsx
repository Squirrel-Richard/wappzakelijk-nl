'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, Zap, Shield, Users } from 'lucide-react'

const stats = [
  { value: '80%', label: 'NL bedrijven via WhatsApp' },
  { value: '< 2 min', label: 'Gemiddelde reactietijd' },
  { value: 'iDEAL', label: 'Betalen direct in chat' },
]

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 relative">
      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
        className="mb-8"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          #1 WhatsApp Business oplossing voor NL MKB
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black text-center max-w-5xl leading-[0.9] tracking-tight"
      >
        <span className="text-white">WhatsApp</span>
        <br />
        <span className="gradient-text">zakelijk gedaan.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 200, damping: 25 }}
        className="mt-8 text-xl md:text-2xl text-white/50 text-center max-w-2xl leading-relaxed"
      >
        Eén gedeelde inbox voor je hele team. Automatische antwoorden. 
        iDEAL betaallinks direct in chat. <strong className="text-white/80">Nederlands. Klaar voor gebruik.</strong>
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200, damping: 25 }}
        className="mt-12 flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/onboarding"
          className="group relative px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold text-lg rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-green-500/25 glow-green"
        >
          <span className="relative z-10">Gratis beginnen →</span>
        </Link>
        <Link
          href="/dashboard"
          className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl"
        >
          Bekijk demo
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, type: 'spring', stiffness: 200, damping: 25 }}
        className="mt-20 grid grid-cols-3 gap-8 md:gap-16"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
            <div className="mt-1 text-sm text-white/40">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Floating WhatsApp mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.0, type: 'spring', stiffness: 150, damping: 25 }}
        className="mt-24 w-full max-w-4xl"
      >
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Window bar */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center text-xs text-white/30">WAppZakelijk Dashboard</div>
          </div>

          {/* Dashboard preview */}
          <div className="flex h-64 md:h-80">
            {/* Sidebar */}
            <div className="w-56 border-r border-white/10 p-4 flex flex-col gap-2">
              <div className="text-xs text-white/30 uppercase tracking-widest mb-2">Gesprekken</div>
              {[
                { naam: 'Kapper Jan', msg: 'Wanneer kan ik...', unread: 2 },
                { naam: 'Bakkerij Smit', msg: 'Bedankt voor de...', unread: 0 },
                { naam: 'Auto Depot', msg: 'Is de proefrit...', unread: 1 },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    i === 0 ? 'bg-green-500/10 border border-green-500/20' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{item.naam}</div>
                    <div className="text-xs text-white/30 truncate">{item.msg}</div>
                  </div>
                  {item.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-green-500 text-black text-xs font-bold flex items-center justify-center">
                      {item.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Chat */}
            <div className="flex-1 p-6 flex flex-col gap-3">
              <div className="text-xs text-white/20 text-center">Vandaag</div>
              <div className="flex justify-start">
                <div className="max-w-xs bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-white/80">
                  Goedemorgen! Wanneer kan ik langskomen voor een knipbeurt? 💈
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-xs bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white">
                  Hoi! We hebben morgen om 10:00 een plek vrij. Wil ik een betaallink sturen voor €25? 🎉
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-xs bg-white/5 border border-green-500/30 rounded-2xl px-4 py-2.5 text-sm text-green-400 flex items-center gap-2">
                  💳 iDEAL betaallink · €25,00
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
