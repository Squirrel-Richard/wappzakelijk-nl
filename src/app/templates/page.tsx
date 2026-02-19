'use client'
export const dynamic = 'force-dynamic'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Layout, Copy, CheckCircle, ShoppingBag, Clock, CreditCard } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { OrganicBackground } from '@/components/OrganicBackground'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'

const TEMPLATE_CATEGORIEEN = [
  {
    id: 'orderbevestiging',
    naam: 'Orderbevestiging',
    icon: ShoppingBag,
    color: 'from-blue-400 to-cyan-500',
    templates: [
      {
        naam: 'Order ontvangen',
        tekst: 'Hoi {{naam}}! 🎉 Je bestelling #{{ordernr}} is ontvangen. We verwerken hem zo snel mogelijk. Verwachte levertijd: {{datum}}. Vragen? Reageer op dit bericht!',
        status: 'Goedgekeurd',
      },
    ],
  },
  {
    id: 'afspraakherinnering',
    naam: 'Afspraakherinnering',
    icon: Clock,
    color: 'from-purple-400 to-pink-500',
    templates: [
      {
        naam: 'Afspraak morgen',
        tekst: 'Hoi {{naam}}! 👋 Herinnering: morgen om {{tijd}} heb je een afspraak bij ons. Adres: {{adres}}. Niet meer nodig? Laat het ons even weten. Tot morgen!',
        status: 'Goedgekeurd',
      },
      {
        naam: 'Afspraak bevestiging',
        tekst: 'Je afspraak op {{datum}} om {{tijd}} is bevestigd! We kijken ernaar uit je te zien. 📅',
        status: 'Goedgekeurd',
      },
    ],
  },
  {
    id: 'betaalverzoek',
    naam: 'Betaalverzoek',
    icon: CreditCard,
    color: 'from-green-400 to-emerald-500',
    templates: [
      {
        naam: 'iDEAL betaalverzoek',
        tekst: 'Hoi {{naam}}! 💳 Je kunt betalen via deze iDEAL link: {{betaallink}} (€{{bedrag}}). Na betaling ontvang je een bevestiging. Vragen? Laat het ons weten!',
        status: 'Goedgekeurd',
      },
    ],
  },
]

export default function TemplatesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeKat, setActiveKat] = useState('orderbevestiging')

  const copy = (tekst: string, id: string) => {
    navigator.clipboard.writeText(tekst)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const actieveKategorie = TEMPLATE_CATEGORIEEN.find(k => k.id === activeKat)

  return (
    <div className="flex h-screen overflow-hidden">
      <OrganicBackground />
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">WhatsApp Templates</h1>
              <p className="text-white/40 text-sm mt-1">Goedgekeurde templates voor professionele berichten</p>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {TEMPLATE_CATEGORIEEN.map((kat) => {
              const KatIcon = kat.icon
              return (
                <button
                  key={kat.id}
                  onClick={() => setActiveKat(kat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    activeKat === kat.id
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <KatIcon className="w-4 h-4" />
                  {kat.naam}
                </button>
              )
            })}
          </div>

          {/* Templates */}
          {actieveKategorie && (
            <motion.div
              key={activeKat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex flex-col gap-4"
            >
              {actieveKategorie.templates.map((tmpl, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${actieveKategorie.color} flex items-center justify-center`}>
                          <actieveKategorie.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{tmpl.naam}</div>
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> {tmpl.status}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 text-sm text-white/70 leading-relaxed border border-white/5">
                        {tmpl.tekst}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {tmpl.tekst.match(/\{\{(\w+)\}\}/g)?.map(v => (
                          <span key={v} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => copy(tmpl.tekst, `${activeKat}-${i}`)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                        copiedId === `${activeKat}-${i}`
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {copiedId === `${activeKat}-${i}`
                        ? <><CheckCircle className="w-4 h-4" /> Gekopieerd</>
                        : <><Copy className="w-4 h-4" /> Kopieer</>
                      }
                    </button>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
