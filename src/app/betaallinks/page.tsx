'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CreditCard, CheckCircle, Clock, Copy, ExternalLink, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PaymentLink } from '@/types/database'
import { GlassCard } from '@/components/GlassCard'
import { OrganicBackground } from '@/components/OrganicBackground'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { formatEuro, formatDate } from '@/lib/utils'

export default function BetaallinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ bedrag: '', omschrijving: '', telefoon: '' })
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data } = await supabase.from('payment_links').select('*, contact:contacts(naam, telefoon)').order('created_at', { ascending: false })
    if (data) setLinks(data as PaymentLink[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const create = async () => {
    if (!form.bedrag || !form.omschrijving) return
    setSaving(true)

    // Create payment link via API
    const res = await fetch('/api/betaallinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bedrag: parseFloat(form.bedrag),
        omschrijving: form.omschrijving,
        telefoon: form.telefoon,
      }),
    })

    const { paymentLink } = await res.json()

    if (paymentLink) {
      setLinks(prev => [paymentLink, ...prev])
      setShowForm(false)
      setForm({ bedrag: '', omschrijving: '', telefoon: '' })
    }
    setSaving(false)
  }

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const STATUS = {
    open: { label: 'Open', color: 'text-yellow-400', icon: Clock },
    betaald: { label: 'Betaald', color: 'text-green-400', icon: CheckCircle },
    verlopen: { label: 'Verlopen', color: 'text-white/30', icon: Clock },
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <OrganicBackground />
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">iDEAL Betaallinks</h1>
              <p className="text-white/40 text-sm mt-1">Genereer betaallinks en stuur ze direct via WhatsApp</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold rounded-xl text-sm shadow-lg shadow-green-500/20"
            >
              <Plus className="w-4 h-4" />
              Nieuwe betaallink
            </motion.button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="mb-6"
              >
                <GlassCard className="p-6">
                  <h2 className="font-bold text-white mb-5">Nieuwe iDEAL betaallink</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Bedrag (€)</label>
                      <input
                        type="number"
                        value={form.bedrag}
                        onChange={e => setForm(p => ({ ...p, bedrag: e.target.value }))}
                        placeholder="25.00"
                        min="0.01"
                        step="0.01"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Omschrijving</label>
                      <input
                        value={form.omschrijving}
                        onChange={e => setForm(p => ({ ...p, omschrijving: e.target.value }))}
                        placeholder="Knipbeurt 15 jan"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Telefoonnummer (opt.)</label>
                      <input
                        value={form.telefoon}
                        onChange={e => setForm(p => ({ ...p, telefoon: e.target.value }))}
                        placeholder="+31612345678"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={create}
                      disabled={saving}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold rounded-xl text-sm disabled:opacity-60 flex items-center gap-2"
                    >
                      {saving ? (
                        <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Aanmaken...</>
                      ) : (
                        <><CreditCard className="w-4 h-4" /> Betaallink aanmaken</>
                      )}
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm hover:bg-white/10"
                    >
                      Annuleren
                    </button>
                  </div>
                  <p className="text-xs text-white/20 mt-3">
                    iDEAL betaling via Stripe Testmodus · GDPR compliant
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex flex-col gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}</div>
          ) : links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <CreditCard className="w-12 h-12 text-white/10 mb-4" />
              <div className="text-white/40 font-medium">Nog geen betaallinks</div>
              <div className="text-white/20 text-sm mt-1">Genereer je eerste iDEAL betaallink</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {links.map((link) => {
                const cfg = STATUS[link.status as keyof typeof STATUS] || STATUS.open
                const StatusIcon = cfg.icon
                return (
                  <GlassCard key={link.id} className="p-5 flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      link.status === 'betaald' ? 'bg-green-500/10' : 'bg-white/5'
                    }`}>
                      <CreditCard className={`w-5 h-5 ${link.status === 'betaald' ? 'text-green-400' : 'text-white/40'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">{formatEuro(link.bedrag)}</span>
                        <span className={`flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="text-sm text-white/40 mt-0.5">{link.omschrijving}</div>
                      {link.contact && (
                        <div className="text-xs text-white/25 mt-0.5">{link.contact.naam || link.contact.telefoon}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {link.stripe_payment_link && (
                        <>
                          <button
                            onClick={() => copyLink(link.stripe_payment_link!, link.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              copiedId === link.id
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                            }`}
                          >
                            {copiedId === link.id ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedId === link.id ? 'Gekopieerd' : 'Kopieer'}
                          </button>
                          <a
                            href={link.stripe_payment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
