import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'WAppZakelijk – WhatsApp Business inbox voor NL bedrijven'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#06060f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 30% 50%, rgba(37,211,102,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(16,185,129,0.1) 0%, transparent 60%)',
          }}
        />
        {/* Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'rgba(37,211,102,0.2)',
            borderRadius: '20px',
            border: '1px solid rgba(37,211,102,0.4)',
            marginBottom: '32px',
          }}
        >
          <div style={{ fontSize: '40px' }}>💬</div>
        </div>
        {/* Product name */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-2px',
            marginBottom: '16px',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          WAppZakelijk
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.4,
          }}
        >
          WhatsApp Business inbox voor Nederlandse bedrijven
        </div>
        <div
          style={{
            fontSize: '20px',
            color: '#6b7280',
            textAlign: 'center',
            marginTop: '12px',
          }}
        >
          Gedeelde inbox · Automatische antwoorden · iDEAL betaallinks
        </div>
        {/* Bottom row */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            right: '80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            {['WhatsApp API', 'iDEAL', 'Automations'].map((tag) => (
              <div
                key={tag}
                style={{
                  background: 'rgba(37,211,102,0.15)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  color: '#86efac',
                  fontSize: '16px',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ color: '#4b5563', fontSize: '14px' }}>AIOW BV</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
