'use client'

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">WAppZakelijk</span>
            </div>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              De Nederlandse WhatsApp Business oplossing voor MKB. Gebouwd door AIOW BV.
            </p>
          </div>

          <div>
            <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Product</div>
            <ul className="flex flex-col gap-3">
              {[
                ['Features', '/#features'],
                ['Prijzen', '/prijzen'],
                ['Dashboard', '/dashboard'],
                ['Onboarding', '/onboarding'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Bedrijf</div>
            <ul className="flex flex-col gap-3">
              {[
                ['Over ons', '/over'],
                ['Privacy', '/privacy'],
                ['Voorwaarden', '/voorwaarden'],
                ['Contact', 'mailto:hallo@wappzakelijk.nl'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">© 2024 AIOW BV · wappzakelijk.nl · KVK: 12345678</p>
          <p className="text-xs text-white/20">iDEAL betalingen · GDPR compliant · NL support</p>
        </div>
      </div>
    </footer>
  )
}
