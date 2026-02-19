'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ── Scramble hook ──────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

function useScramble(target: string, delay = 400, speed = 40) {
  const [text, setText] = useState(() => target.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''))
  const frameRef = useRef(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (!startRef.current) startRef.current = ts
        const elapsed = ts - startRef.current
        const progress = Math.floor(elapsed / speed)
        setText(
          target
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' '
              if (i < progress) return char
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )
        if (progress < target.length) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          setText(target)
        }
      }
      frameRef.current = requestAnimationFrame(animate)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frameRef.current)
    }
  }, [target, delay, speed])

  return text
}

// ── Animated counter ───────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const duration = 2000

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (ts: number) => {
        if (!startRef.current) startRef.current = ts
        const elapsed = ts - startRef.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, 1200)
    return () => clearTimeout(timeout)
  }, [target])

  return <>{prefix}{value}{suffix}</>
}

// ── Star particles ────────────────────────────────────────────
function Stars() {
  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  )

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {stars.current.map((s) => (
        <motion.div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#ffffff',
          }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ── Planet arc glow ───────────────────────────────────────────
function PlanetArc() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        bottom: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '900px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(37,211,102,0.06) 0%, rgba(18,140,126,0.04) 40%, transparent 70%)',
        border: '1px solid rgba(37,211,102,0.08)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

const stats = [
  { value: 80, suffix: '%', label: 'NL bedrijven via WhatsApp' },
  { value: 2, suffix: 'min', prefix: '< ', label: 'Gemiddelde reactietijd' },
  { value: 0, suffix: 'IDEAL', prefix: '', label: 'Betalen direct in chat' },
]

export function HeroSection() {
  const line1 = useScramble('WhatsApp voor', 600, 35)
  const line2 = useScramble('jouw bedrijf.', 900, 35)

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', paddingTop: '128px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
      <Stars />

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
        style={{ marginBottom: '32px' }}
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '999px',
          background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)',
          color: '#25d366', fontSize: '13px', fontWeight: 600,
        }}>
          <motion.span
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#25d366', display: 'inline-block' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          #1 WhatsApp Business platform voor NL MKB
        </span>
      </motion.div>

      {/* Scramble headline */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 900,
          textAlign: 'center',
          maxWidth: '900px',
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#dde8f5',
          marginBottom: 0,
        }}
      >
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{line1}</span>
        <span style={{
          display: 'block',
          background: 'linear-gradient(135deg, #25d366 0%, #128c7e 60%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>{line2}</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          marginTop: '28px',
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'rgba(221,232,245,0.55)',
          textAlign: 'center',
          maxWidth: '600px',
          lineHeight: 1.6,
        }}
      >
        Eén gedeelde inbox voor je hele team. Automatische antwoorden. iDEAL betaallinks direct in chat.{' '}
        <strong style={{ color: 'rgba(221,232,245,0.85)' }}>Nederlands. Klaar voor gebruik.</strong>
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, type: 'spring', stiffness: 200, damping: 25 }}
        style={{ marginTop: '48px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}
      >
        <Link
          href="/onboarding"
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #25d366, #128c7e)',
            color: '#000',
            fontWeight: 700,
            fontSize: '17px',
            borderRadius: '14px',
            textDecoration: 'none',
            boxShadow: '0 0 30px rgba(37,211,102,0.3), 0 8px 24px rgba(0,0,0,0.4)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Gratis beginnen →
        </Link>
        <Link
          href="/dashboard"
          style={{
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#dde8f5',
            fontWeight: 600,
            fontSize: '17px',
            borderRadius: '14px',
            textDecoration: 'none',
            backdropFilter: 'blur(20px)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          Bekijk demo
        </Link>
      </motion.div>

      {/* Stats — animated counters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          marginTop: '64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px 48px',
        }}
      >
        {[
          { value: 80, suffix: '%', label: 'NL bedrijven via WhatsApp' },
          { value: 2, suffix: ' min', prefix: '< ', label: 'Gemiddelde reactietijd' },
          { value: 0, suffix: '', prefix: 'iDEAL', label: 'Betalen direct in chat' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#dde8f5' }}>
              {s.prefix === 'iDEAL' ? (
                <span style={{ color: '#25d366' }}>iDEAL</span>
              ) : (
                <AnimatedCounter target={s.value} suffix={s.suffix} prefix={s.prefix} />
              )}
            </div>
            <div style={{ marginTop: '4px', fontSize: '13px', color: 'rgba(221,232,245,0.4)' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Floating WhatsApp mockup with bob animation */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.0, type: 'spring', stiffness: 150, damping: 25 }}
        style={{ marginTop: '80px', width: '100%', maxWidth: '860px', zIndex: 1 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(37,211,102,0.04)',
          }}
        >
          {/* Window bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, opacity: 0.6 }} />
              ))}
            </div>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
              WAppZakelijk — Gedeelde Inbox
            </div>
          </div>

          {/* Dashboard preview */}
          <div style={{ display: 'flex', height: '320px' }}>
            {/* Sidebar — hidden on small screens via CSS class */}
            <div className="demo-sidebar" style={{
              width: '220px', borderRight: '1px solid rgba(255,255,255,0.06)',
              padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Gesprekken</div>
              {[
                { naam: 'Kapper Jan', msg: 'Wanneer kan ik...', unread: 2, active: true },
                { naam: 'Bakkerij Smit', msg: 'Bedankt voor de...', unread: 0, active: false },
                { naam: 'Auto Depot BV', msg: 'Is de proefrit...', unread: 1, active: false },
                { naam: 'Horeca Plus', msg: 'Kunnen jullie...', unread: 0, active: false },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '12px',
                    background: item.active ? 'rgba(37,211,102,0.08)' : 'transparent',
                    border: item.active ? '1px solid rgba(37,211,102,0.15)' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: ['linear-gradient(135deg,#25d366,#128c7e)', 'linear-gradient(135deg,#3b82f6,#06b6d4)', 'linear-gradient(135deg,#f59e0b,#ef4444)', 'linear-gradient(135deg,#8b5cf6,#ec4899)'][i],
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#dde8f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.naam}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(221,232,245,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.msg}</div>
                  </div>
                  {item.unread > 0 && (
                    <span style={{
                      minWidth: 18, height: 18, borderRadius: '999px',
                      background: '#25d366', color: '#000', fontSize: '10px',
                      fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 4px',
                    }}>{item.unread}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Chat */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>Vandaag</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', background: 'rgba(255,255,255,0.08)', borderRadius: '16px 16px 16px 4px',
                  padding: '10px 14px', fontSize: '13px', color: 'rgba(221,232,245,0.8)',
                }}>
                  Goedemorgen! Wanneer kan ik langskomen voor een knipbeurt? 💈
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '70%', background: 'linear-gradient(135deg, rgba(37,211,102,0.7), rgba(18,140,126,0.7))',
                  borderRadius: '16px 16px 4px 16px',
                  padding: '10px 14px', fontSize: '13px', color: '#fff',
                }}>
                  Hoi! We hebben morgen om 10:00 een plek vrij. Zal ik een betaallink sturen voor €25? 🎉
                </div>
              </div>
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <div style={{
                  maxWidth: '70%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(37,211,102,0.3)', borderRadius: '16px',
                  padding: '10px 14px', fontSize: '13px', color: '#25d366',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span>💳</span> iDEAL betaallink · €25,00
                </div>
              </motion.div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', background: 'rgba(255,255,255,0.08)', borderRadius: '16px 16px 16px 4px',
                  padding: '10px 14px', fontSize: '13px', color: 'rgba(221,232,245,0.8)',
                }}>
                  Ja graag! 🙏
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Planet arc glow */}
      <PlanetArc />
    </section>
  )
}
