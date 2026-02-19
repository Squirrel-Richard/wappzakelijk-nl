'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#hoe-werkt-het', label: 'Hoe werkt het' },
  { href: '/prijzen', label: 'Prijzen' },
  { href: '/dashboard', label: 'Dashboard' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 ${
          scrolled ? 'bg-black/40 backdrop-blur-xl border border-white/10' : ''
        }`}>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">WAppZakelijk</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2"
            >
              Inloggen
            </Link>
            <Link
              href="/onboarding"
              className="text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-black px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20"
            >
              Gratis starten →
            </Link>
          </div>

          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="mt-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-4 flex flex-col gap-3"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white py-2 px-3 rounded-xl hover:bg-white/5 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/onboarding"
                className="text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-black px-5 py-3 rounded-xl text-center"
                onClick={() => setMenuOpen(false)}
              >
                Gratis starten →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
