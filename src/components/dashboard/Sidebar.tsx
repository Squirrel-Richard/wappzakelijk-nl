'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MessageSquare, Inbox, Bot, Layout, Radio,
  CreditCard, Settings, LogOut, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Inbox, label: 'Inbox', badge: null },
  { href: '/automations', icon: Bot, label: 'Automations', badge: null },
  { href: '/templates', icon: Layout, label: 'Templates', badge: null },
  { href: '/broadcasts', icon: Radio, label: 'Broadcasts', badge: null },
  { href: '/betaallinks', icon: CreditCard, label: 'Betaallinks', badge: null },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-64 h-screen flex-shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-none">WAppZakelijk</div>
            <div className="text-xs text-white/30 mt-0.5">Dashboard</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-green-400' : 'text-white/30 group-hover:text-white/60'}`} />
              {item.label}
              {item.badge && (
                <span className="ml-auto w-5 h-5 rounded-full bg-green-500 text-black text-xs font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 flex flex-col gap-1">
        <Link
          href="/instellingen"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
          Instellingen
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all text-left">
          <LogOut className="w-5 h-5" />
          Uitloggen
        </button>
      </div>
    </motion.aside>
  )
}
