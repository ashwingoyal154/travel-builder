import { useState } from 'react'

export default function PackingCard({ text }) {
  const rawItems = text
    .split('\n')
    .filter(l => /^[-•*✓]\s/.test(l.trim()))
    .map(l => l.replace(/^[-•*✓]\s+/, '').trim())
    .filter(Boolean)

  // Fallback: if no bullet lines found, split by newline
  const items =
    rawItems.length > 0
      ? rawItems
      : text
          .split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 3 && !l.toLowerCase().startsWith('packing'))

  const [checked, setChecked] = useState(() => new Array(items.length).fill(false))

  const toggle = i => {
    setChecked(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(212,168,83,0.15)',
        borderRadius: '20px',
        padding: '32px',
        animation: 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        animationDelay: '200ms',
        opacity: 0,
      }}
    >
      <h3
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '22px',
          fontWeight: 600,
          color: '#f5f0e8',
          marginBottom: '20px',
        }}
      >
        🎒 Packing List
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              padding: '6px 0',
            }}
          >
            {/* Custom gold checkbox */}
            <span
              style={{
                width: '20px',
                height: '20px',
                minWidth: '20px',
                border: checked[i]
                  ? '2px solid #d4a853'
                  : '2px solid rgba(212,168,83,0.4)',
                borderRadius: '4px',
                background: checked[i] ? 'rgba(212,168,83,0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                marginTop: '1px',
              }}
            >
              {checked[i] && (
                <svg
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  style={{ display: 'block' }}
                >
                  <path
                    d="M1 4L4.5 7.5L11 1"
                    stroke="#d4a853"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: checked[i] ? 'rgba(138,154,176,0.5)' : '#8a9ab0',
                textDecoration: checked[i] ? 'line-through' : 'none',
                transition: 'all 0.2s ease',
                lineHeight: 1.5,
              }}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
