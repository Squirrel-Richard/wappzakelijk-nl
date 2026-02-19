'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ArrowRight, MessageSquare, Key, Webhook, Play } from 'lucide-react'
import { OrganicBackground } from '@/components/OrganicBackground'
import { GlassCard } from '@/components/GlassCard'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const STAPPEN = [
  {
    nr: 1,
    titel: 'Account aanmaken',
    beschrijving: 'Maak je WAppZakelijk account aan',
    icon: MessageSquare,
  },
  {
    nr: 2,
    titel: 'WhatsApp Business API',
    beschrijving: 'Koppel je WhatsApp nummer via Meta',
    icon: Key,
  },
  {
    nr: 3,
    titel: 'Webhook instellen',
    beschrijving: 'Verbind WAppZakelijk met Meta',
    icon: Webhook,
  },
  {
    nr: 4,
    titel: 'Klaar!',
    beschrijving: 'Je bent klaar om te beginnen',
    icon: Play,
  },
]

export default function OnboardingPage() {
  const [stap, setStap] = useState(1)
  const [form, setForm] = useState({
    bedrijfsnaam: '',
    email: '',
    wachtwoord: '',
    phone_number_id: '',
    access_token: '',
    business_id: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const maakAccount = async () => {
    if (!form.bedrijfsnaam || !form.email || !form.wachtwoord) {
      setError('Vul alle velden in')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.wachtwoord,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('companies').insert({
        user_id: data.user.id,
        naam: form.bedrijfsnaam,
      })
      await supabase.from('subscriptions').insert({
        company_id: null, // will be set after
        plan: 'gratis',
      })
    }

    setLoading(false)
    setStap(2)
  }

  const slaWAOP = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('companies').update({
        whatsapp_phone_number_id: form.phone_number_id,
        whatsapp_access_token: form.access_token,
        meta_business_id: form.business_id,
      }).eq('user_id', user.id)
    }
    setLoading(false)
    setStap(3)
  }

  const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_APP_URL || 'https://wappzakelijk.nl'}/api/webhook/whatsapp`
  const VERIFY_TOKEN = process.env.NEXT_PUBLIC_VERIFY_TOKEN || 'wappzakelijk_verify_token_2024'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <OrganicBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-2xl"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-white text-xl">WAppZakelijk</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STAPPEN.map((s, i) => (
            <div key={s.nr} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                stap > s.nr
                  ? 'bg-green-500 text-white'
                  : stap === s.nr
                    ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/5 border border-white/10 text-white/30'
              }`}>
                {stap > s.nr ? <CheckCircle className="w-4 h-4" /> : s.nr}
              </div>
              {i < STAPPEN.length - 1 && (
                <div className={`w-12 h-px transition-all ${stap > s.nr ? 'bg-green-500/60' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <GlassCard className="p-8">
          <AnimatePresence mode="wait">
            {stap === 1 && (
              <motion.div
                key="stap1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">Account aanmaken</h1>
                <p className="text-white/40 text-sm mb-8">Start gratis. Geen creditcard nodig.</p>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Bedrijfsnaam</label>
                    <input
                      value={form.bedrijfsnaam}
                      onChange={e => setForm(p => ({ ...p, bedrijfsnaam: e.target.value }))}
                      placeholder="Kapper Jan BV"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">E-mailadres</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="jan@kapper.nl"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Wachtwoord</label>
                    <input
                      type="password"
                      value={form.wachtwoord}
                      onChange={e => setForm(p => ({ ...p, wachtwoord: e.target.value }))}
                      placeholder="Minimaal 8 tekens"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                <button
                  onClick={maakAccount}
                  disabled={loading}
                  className="mt-8 w-full py-3.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <>Account aanmaken <ArrowRight className="w-5 h-5" /></>}
                </button>
              </motion.div>
            )}

            {stap === 2 && (
              <motion.div
                key="stap2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">WhatsApp Business API</h1>
                <p className="text-white/40 text-sm mb-2">Haal je gegevens op uit het Meta Business dashboard.</p>
                <a href="https://business.facebook.com/wa/manage" target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm hover:underline">
                  → Open Meta Business Manager
                </a>

                <div className="flex flex-col gap-4 mt-6">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Phone Number ID</label>
                    <input
                      value={form.phone_number_id}
                      onChange={e => setForm(p => ({ ...p, phone_number_id: e.target.value }))}
                      placeholder="1234567890123456"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Permanent Access Token</label>
                    <input
                      value={form.access_token}
                      onChange={e => setForm(p => ({ ...p, access_token: e.target.value }))}
                      placeholder="EAAxxxxxxxxx..."
                      type="password"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Business ID</label>
                    <input
                      value={form.business_id}
                      onChange={e => setForm(p => ({ ...p, business_id: e.target.value }))}
                      placeholder="1234567890"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                </div>

                <button
                  onClick={slaWAOP}
                  disabled={loading}
                  className="mt-8 w-full py-3.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <>Opslaan & verder <ArrowRight className="w-5 h-5" /></>}
                </button>
                <button onClick={() => setStap(3)} className="mt-3 w-full py-2.5 text-white/30 text-sm hover:text-white transition-colors">
                  Later instellen →
                </button>
              </motion.div>
            )}

            {stap === 3 && (
              <motion.div
                key="stap3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">Webhook instellen</h1>
                <p className="text-white/40 text-sm mb-6">Stel de webhook in via je Meta app dashboard zodat berichten binnenkomen.</p>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Webhook URL</label>
                    <div className="flex gap-2">
                      <div className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-green-400 text-sm font-mono truncate">
                        {WEBHOOK_URL}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(WEBHOOK_URL)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors text-sm"
                      >
                        Kopieer
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Verify Token</label>
                    <div className="flex gap-2">
                      <div className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-green-400 text-sm font-mono truncate">
                        {VERIFY_TOKEN}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(VERIFY_TOKEN)}
                        className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors text-sm"
                      >
                        Kopieer
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <p className="text-blue-400 text-sm leading-relaxed">
                    <strong>Instructies:</strong> Ga naar je Meta App Dashboard → WhatsApp → Configuratie. 
                    Voeg de Webhook URL en Verify Token in. Abonneer je op de &ldquo;messages&rdquo; velden.
                  </p>
                </div>

                <button
                  onClick={() => setStap(4)}
                  className="mt-8 w-full py-3.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  Volgende <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {stap === 4 && (
              <motion.div
                key="stap4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Je bent klaar! 🎉</h1>
                <p className="text-white/40 mb-8">Je WhatsApp Business account is gekoppeld. Ga naar je dashboard om berichten te beheren.</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  Open dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  )
}
