'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, CreditCard, MoreVertical, Tag, User, CheckCheck, Check } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Conversation, Message } from '@/types/database'
import { formatTime } from '@/lib/utils'

export default function GesprekPage() {
  const params = useParams()
  const id = params.id as string
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const [convRes, msgRes] = await Promise.all([
      supabase.from('conversations').select('*, contact:contacts(*)').eq('id', id).single(),
      supabase.from('messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true }),
    ])
    if (convRes.data) setConversation(convRes.data as Conversation)
    if (msgRes.data) setMessages(msgRes.data as Message[])
    setLoading(false)
  }, [id, supabase])

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel(`conversation-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id, loadData, supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const inhoud = input.trim()
    setInput('')

    const { data: msg } = await supabase.from('messages').insert({
      conversation_id: id,
      richting: 'uitgaand',
      type: 'text',
      inhoud,
      status: 'verzonden',
    }).select().single()

    if (msg) {
      setMessages(prev => [...prev, msg as Message])
      // Update conversation last_message_at
      await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', id)

      // Send via WhatsApp API
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id, messageId: msg.id, inhoud }),
      })
    }

    setSending(false)
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl flex items-center gap-4">
        <Link href="/dashboard" className="p-2 rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </Link>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {conversation?.contact?.naam?.[0]?.toUpperCase() || '?'}
          </span>
        </div>

        <div className="flex-1">
          <div className="font-semibold text-white">
            {conversation?.contact?.naam || conversation?.contact?.telefoon || 'Onbekend'}
          </div>
          <div className="text-xs text-white/40">{conversation?.contact?.telefoon}</div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/betaallinks?contact=${conversation?.contact_id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            iDEAL link
          </Link>
          <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-white/20 text-sm">Nog geen berichten</div>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={`flex ${msg.richting === 'uitgaand' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.richting === 'uitgaand'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-tr-sm'
                        : 'bg-white/10 text-white/90 rounded-tl-sm'
                    }`}
                  >
                    <div>{msg.inhoud}</div>
                    <div className={`text-xs mt-1.5 flex items-center justify-end gap-1 ${
                      msg.richting === 'uitgaand' ? 'text-white/60' : 'text-white/30'
                    }`}>
                      {formatTime(msg.created_at)}
                      {msg.richting === 'uitgaand' && (
                        <CheckCheck className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Typ een bericht..."
            className="flex-1 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center disabled:opacity-40 transition-opacity shadow-lg shadow-green-500/20"
          >
            {sending
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send className="w-5 h-5 text-white" />
            }
          </motion.button>
        </div>
      </div>
    </div>
  )
}
