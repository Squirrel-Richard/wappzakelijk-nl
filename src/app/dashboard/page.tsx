'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Search, Filter, Tag, User, X, MessageSquare, Clock, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Conversation } from '@/types/database'
import { GlassCard } from '@/components/GlassCard'
import { formatTime } from '@/lib/utils'

const STATUS_LABELS = {
  open: { label: 'Open', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  in_behandeling: { label: 'In behandeling', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  gesloten: { label: 'Gesloten', color: 'text-white/40 bg-white/5 border-white/10' },
}

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filter, setFilter] = useState<'open' | 'in_behandeling' | 'gesloten'>('open')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadConversations = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        contact:contacts(*),
        last_message:messages(inhoud, created_at, richting)
      `)
      .eq('status', filter)
      .order('last_message_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      setConversations(data as Conversation[])
    }
    setLoading(false)
  }, [filter, supabase])

  useEffect(() => {
    loadConversations()

    // Realtime subscription
    const channel = supabase
      .channel('conversations-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
      }, () => {
        loadConversations()
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, () => {
        loadConversations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [filter, loadConversations, supabase])

  const filtered = conversations.filter(c =>
    !search || c.contact?.naam?.toLowerCase().includes(search.toLowerCase()) ||
    c.contact?.telefoon.includes(search)
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Gedeelde inbox</h1>
            <p className="text-white/40 text-sm mt-1">Beheer alle WhatsApp gesprekken van je team</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Zoek op naam of telefoonnummer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['open', 'in_behandeling', 'gesloten'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  filter === s
                    ? STATUS_LABELS[s].color
                    : 'text-white/40 border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {STATUS_LABELS[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <MessageSquare className="w-12 h-12 text-white/10 mb-4" />
            <div className="text-white/40 font-medium">Geen gesprekken</div>
            <div className="text-white/20 text-sm mt-1">
              {filter === 'open' ? 'Je bent helemaal bij!' : `Geen ${STATUS_LABELS[filter].label.toLowerCase()} gesprekken`}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="flex flex-col gap-3"
          >
            <AnimatePresence>
              {filtered.map((conv) => (
                <motion.div
                  key={conv.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
                  }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Link href={`/gesprek/${conv.id}`}>
                    <GlassCard hover className="p-4 flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {conv.contact?.naam?.[0]?.toUpperCase() || conv.contact?.telefoon[0]}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-white truncate">
                            {conv.contact?.naam || conv.contact?.telefoon || 'Onbekend'}
                          </div>
                          {conv.last_message_at && (
                            <span className="text-xs text-white/30 ml-4 flex-shrink-0">
                              {formatTime(conv.last_message_at)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-white/40 truncate flex-1">
                            {conv.last_message?.inhoud || 'Geen berichten'}
                          </span>
                        </div>
                        {conv.labels.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {conv.labels.map(label => (
                              <span key={label} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/40">
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {conv.unread_count && conv.unread_count > 0 ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 text-black text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {conv.unread_count}
                        </div>
                      ) : null}
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
