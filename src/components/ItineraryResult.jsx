import { useRef } from 'react'
import DayCard from './DayCard.jsx'
import BudgetCard from './BudgetCard.jsx'
import PackingCard from './PackingCard.jsx'

function parseItinerary(text) {
  // Strip markdown heading markers
  const cleaned = text.replace(/^#{1,4}\s*/gm, '')

  // Split on "Day N" boundaries (handles Day 1, DAY 1, Day 1:, Day 1 —, etc.)
  const sections = cleaned.split(/(?=^(?:Day|DAY)\s+\d+)/m)

  const days = sections
    .map(section => {
      const match = section.match(/^(?:Day|DAY)\s+(\d+)[:\s—–\-]*([^\n]*)/)
      if (!match) return null
      const bodyLines = section.split('\n').slice(1).join('\n').trim()
      return {
        number: match[1],
        title: match[2].trim() || `Day ${match[1]}`,
        content: bodyLines,
      }
    })
    .filter(Boolean)

  const lower = cleaned.toLowerCase()

  let budget = null
  const budgetIdx = lower.search(/budget|cost breakdown|estimated cost|total cost/)
  if (budgetIdx !== -1) {
    budget = cleaned
      .slice(budgetIdx, budgetIdx + 1200)
      .split(/\n\n/)
      .slice(0, 8)
      .join('\n\n')
  }

  let packing = null
  const packingIdx = lower.search(/packing list|packing summary|packing recommendations|what to (pack|bring)|essentials|things to bring/)
  if (packingIdx !== -1) {
    packing = cleaned
      .slice(packingIdx, packingIdx + 1200)
      .split(/\n\n/)
      .slice(0, 8)
      .join('\n\n')
  }

  return { days, budget, packing, fullText: text }
}

export default function ItineraryResult({ rawText, onReset, onCopy }) {
  const detailsRef = useRef(null)
  const { days, budget, packing, fullText } = parseItinerary(rawText)

  const hasDays = days.length > 0

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1521 100%)',
        minHeight: '80vh',
        padding: '80px 24px 60px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '12px',
          }}
        >
          <h2
            className="text-gradient-gold"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Your Itinerary
          </h2>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={onCopy}
              aria-label="Copy itinerary to clipboard"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(212,168,83,0.4)',
                background: 'transparent',
                color: '#d4a853',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(212,168,83,0.08)'
                e.currentTarget.style.borderColor = 'rgba(212,168,83,0.7)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(212,168,83,0.4)'
              }}
            >
              Copy to Clipboard
            </button>

            <button
              onClick={onReset}
              aria-label="Plan another journey"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #d4a853, #b8894a)',
                color: '#0a0a0f',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter = 'brightness(1.1)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter = ''
                e.currentTarget.style.transform = ''
              }}
            >
              Plan Another Journey
            </button>
          </div>
        </div>

        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '15px',
            color: 'rgba(138,154,176,0.7)',
            marginBottom: '48px',
          }}
        >
          Your itinerary has also been saved and emailed to you.
        </p>

        {/* ── Day cards grid ── */}
        {hasDays ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {days.map((day, i) => (
              <DayCard
                key={i}
                number={day.number}
                title={day.title}
                content={day.content}
                animationDelay={i * 80}
              />
            ))}
          </div>
        ) : (
          /* Fallback: render as prose when no "Day N" structure detected */
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(212,168,83,0.15)',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '32px',
              animation: 'fadeUp 0.6s ease forwards',
            }}
          >
            <pre
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                color: '#8a9ab0',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
              }}
            >
              {fullText}
            </pre>
          </div>
        )}

        {/* ── Budget + Packing row ── */}
        {(budget || packing) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: budget && packing ? '1fr 1fr' : '1fr',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            {budget && <BudgetCard text={budget} />}
            {packing && <PackingCard text={packing} />}
          </div>
        )}

        {/* ── Collapsible full text ── */}
        {hasDays && (
          <details
            ref={detailsRef}
            style={{
              border: '1px solid rgba(212,168,83,0.15)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '18px 24px',
                background: 'rgba(212,168,83,0.04)',
                color: '#d4a853',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              View Full Itinerary
            </summary>
            <div style={{ padding: '24px' }}>
              <pre
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '13.5px',
                  color: '#8a9ab0',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                }}
              >
                {fullText}
              </pre>
            </div>
          </details>
        )}
      </div>
    </section>
  )
}
