'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Bot, Trash2, ToggleLeft, ToggleRight, Clock, MessageSquare, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Automation } from '@/types/database'
import { GlassCard } from '@/components/GlassCard'
import { OrganicBackground } from '@/components/OrganicBackground'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'

const TRIGGER_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  buiten_kantooruren: { label: 'Buiten kantooruren', icon: Clock },
  eerste_contact: { label: 'Eerste contact', icon: MessageSquare },
  keyword: { label: 'Keyword trigger', icon: Zap },
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    naam: '',
    trigger_type: 'buiten_kantooruren',
    trigger_waarde: '',
    actie_type: 'stuur_bericht',
    actie_bericht: '',
  })
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data } = await supabase.from('automations').select('*').order('created_at', { ascending: false })
    if (data) setAutomations(data as Automation[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const createAutomation = async () => {
    if (!form.naam || !form.actie_bericht) return
    const { data } = await supabase.from('automations').insert(form).select().single()
    if (data) {
      setAutomations(prev => [data as Automation, ...prev])
      setShowForm(false)
      setForm({ naam: '', trigger_type: 'buiten_kantooruren', trigger_waarde: '', actie_type: 'stuur_bericht', actie_bericht: '' })
    }
  }

  const toggleAutomation = async (id: string, actief: boolean) => {
    await supabase.from('automations').update({ actief: !actief }).eq('id', id)
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, actief: !actief } : a))
  }

  const deleteAutomation = async (id: string) => {
    await supabase.from('automations').delete().eq('id', id)
    setAutomations(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <OrganicBackground />
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Automations</h1>
              <p className="text-white/40 text-sm mt-1">Stel automatische antwoordregels in voor je WhatsApp</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20 text-sm"
            >
              <Plus className="w-4 h-4" />
              Nieuwe automation
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
                  <h2 className="font-bold text-white mb-5">Nieuwe automation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Naam</label>
                      <input
                        value={form.naam}
                        onChange={e => setForm(p => ({ ...p, naam: e.target.value }))}
                        placeholder="Bijv. Buiten kantooruren bericht"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Trigger</label>
                      <select
                        value={form.trigger_type}
                        onChange={e => setForm(p => ({ ...p, trigger_type: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
                      >
                        <option value="buiten_kantooruren">Buiten kantooruren</option>
                        <option value="eerste_contact">Eerste contact</option>
                        <option value="keyword">Keyword</option>
                      </select>
                    </div>
                    {form.trigger_type === 'keyword' && (
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Keyword</label>
                        <input
                          value={form.trigger_waarde}
                          onChange={e => setForm(p => ({ ...p, trigger_waarde: e.target.value }))}
                          placeholder="Bijv. prijs, openingstijden"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50"
                        />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Automatisch bericht</label>
                      <textarea
                        value={form.actie_bericht}
                        onChange={e => setForm(p => ({ ...p, actie_bericht: e.target.value }))}
                        placeholder="Hoi! We zijn momenteel gesloten. We reageren de volgende werkdag zo snel mogelijk..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500/50 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={createAutomation}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold rounded-xl text-sm"
                    >
                      Opslaan
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm hover:bg-white/10 transition-colors"
                    >
                      Annuleren
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
            </div>
          ) : automations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Bot className="w-12 h-12 text-white/10 mb-4" />
              <div className="text-white/40 font-medium">Nog geen automations</div>
              <div className="text-white/20 text-sm mt-1">Maak je eerste automatische antwoordregel</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {automations.map((auto) => {
                  const TriggerIcon = TRIGGER_LABELS[auto.trigger_type]?.icon || Zap
                  return (
                    <motion.div
                      key={auto.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <GlassCard className="p-5 flex items-center gap-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${auto.actief ? 'bg-green-500/10' : 'bg-white/5'}`}>
                          <TriggerIcon className={`w-5 h-5 ${auto.actief ? 'text-green-400' : 'text-white/30'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{auto.naam}</div>
                          <div className="text-xs text-white/40 mt-0.5">
                            {TRIGGER_LABELS[auto.trigger_type]?.label} → {auto.actie_bericht?.substring(0, 60)}...
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleAutomation(auto.id, auto.actief)}
                            className={`transition-colors ${auto.actief ? 'text-green-400' : 'text-white/30'}`}
                          >
                            {auto.actief
                              ? <ToggleRight className="w-7 h-7" />
                              : <ToggleLeft className="w-7 h-7" />
                            }
                          </button>
                          <button
                            onClick={() => deleteAutomation(auto.id)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
