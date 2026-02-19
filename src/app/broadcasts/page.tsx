'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Radio, Send, Calendar, Users, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Broadcast } from '@/types/database'
import { GlassCard } from '@/components/GlassCard'
import { OrganicBackground } from '@/components/OrganicBackground'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { formatDate, formatTime } from '@/lib/utils'

const STATUS_CONFIG = {
  concept: { label: 'Concept', color: 'text-white/40', icon: Clock },
  gepland: { label: 'Gepland', color: 'text-yellow-400', icon: Calendar },
  verzonden: { label: 'Verzonden', color: 'text-green-400', icon: CheckCircle },
  mislukt: { label: 'Mislukt', color: 'text-red-400', icon: Clock },
}

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ naam: '', bericht: '', geplanned_op: '' })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false })
    if (data) setBroadcasts(data as Broadcast[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const create = async () => {
    if (!form.naam || !form.bericht) return
    setSaving(true)
    const { data } = await supabase.from('broadcasts').insert({
      naam: form.naam,
      bericht: form.bericht,
      geplanned_op: form.geplanned_op || null,
      status: form.geplanned_op ? 'gepland' : 'concept',
    }).select().single()
    if (data) {
      setBroadcasts(prev => [data as Broadcast, ...prev])
      setShowForm(false)
      setForm({ naam: '', bericht: '', geplanned_op: '' })
    }
    setSaving(false)
  }

  const deleteBroadcast = async (id: string) => {
    await supabase.from('broadcasts').delete().eq('id', id)
    setBroadcasts(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <OrganicBackground />
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Broadcasts</h1>
              <p className="text-white/40 text-sm mt-1">Stuur berichten naar je opt-in klantenlijst</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold rounded-xl text-sm shadow-lg shadow-green-500/20"
            >
              <Plus className="w-4 h-4" />
              Nieuwe broadcast
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
                  <h2 className="font-bold text-white mb-5">Nieuwe broadcast campagne</h2>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Campagnenaam</label>
                      <input
                        value={form.naam}
                        onChange={e => setForm(p => ({ ...p, naam: e.target.value }))}
                        placeholder="Bijv. Zomeraanbieding 2024"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Bericht</label>
                      <textarea
                        value={form.bericht}
                        onChange={e => setForm(p => ({ ...p, bericht: e.target.value }))}
                        placeholder="Hoi {{naam}}! We hebben een speciale aanbieding voor je..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50 resize-none"
                      />
                      <p className="text-xs text-white/30 mt-1">Gebruik {'{{naam}}'} voor de naam van de klant</p>
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Plannen (optioneel)</label>
                      <input
                        type="datetime-local"
                        value={form.geplanned_op}
                        onChange={e => setForm(p => ({ ...p, geplanned_op: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={create}
                      disabled={saving}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold rounded-xl text-sm disabled:opacity-60"
                    >
                      {saving ? 'Opslaan...' : form.geplanned_op ? 'Plannen' : 'Opslaan als concept'}
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm hover:bg-white/10"
                    >
                      Annuleren
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex flex-col gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}</div>
          ) : broadcasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Radio className="w-12 h-12 text-white/10 mb-4" />
              <div className="text-white/40 font-medium">Nog geen broadcasts</div>
              <div className="text-white/20 text-sm mt-1">Maak je eerste broadcast campagne</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {broadcasts.map((bc) => {
                const cfg = STATUS_CONFIG[bc.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.concept
                const StatusIcon = cfg.icon
                return (
                  <GlassCard key={bc.id} className="p-5 flex items-start gap-5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mt-0.5">
                      <Radio className="w-5 h-5 text-white/40" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-white">{bc.naam}</div>
                        <span className={`flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="text-sm text-white/40 mt-1 line-clamp-2">{bc.bericht}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/30">
                        {bc.verzonden_aan > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {bc.verzonden_aan} ontvangers
                          </span>
                        )}
                        {bc.geplanned_op && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(bc.geplanned_op)} {formatTime(bc.geplanned_op)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteBroadcast(bc.id)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
