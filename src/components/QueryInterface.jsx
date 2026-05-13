import { useRef } from 'react'
import QueryChip from './QueryChip.jsx'

const EXAMPLE_QUERIES = [
  'WW2 historical sites across Europe',
  'Ancient Silk Road through Central Asia',
  'Cherry blossom season in Japan',
  "Hemingway's literary trails",
  'Viking heritage across Scandinavia',
  'Jazz age New Orleans immersion',
]

export default function QueryInterface({ query, setQuery, onSubmit, isLoading }) {
  const textareaRef = useRef(null)

  const handleChipClick = label => {
    setQuery(label)
    textareaRef.current?.focus()
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSubmit()
    }
  }

  const canSubmit = query.trim().length > 0 && !isLoading

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Example query chips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
        }}
      >
        {EXAMPLE_QUERIES.map(label => (
          <QueryChip key={label} label={label} onClick={() => handleChipClick(label)} />
        ))}
      </div>

      {/* Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          className="textarea-glass"
          rows={5}
          value={query}
          onChange={e => setQuery(e.target.value.slice(0, 800))}
          onKeyDown={handleKeyDown}
          placeholder="Describe your dream journey — be as abstract or specific as you like…"
          aria-label="Travel query"
          aria-describedby="char-counter"
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.6 : 1 }}
        />
      </div>

      {/* Counter + Submit row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <span
          id="char-counter"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            color: 'rgba(138,154,176,0.6)',
          }}
        >
          {query.length} / 800
        </span>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Plan my journey"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 30px',
            borderRadius: '12px',
            background: canSubmit
              ? 'linear-gradient(135deg, #d4a853, #b8894a)'
              : 'rgba(212,168,83,0.2)',
            color: canSubmit ? '#0a0a0f' : 'rgba(245,240,232,0.3)',
            border: 'none',
            fontWeight: 600,
            fontSize: '15px',
            fontFamily: 'Inter, system-ui, sans-serif',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: canSubmit ? '0 4px 24px rgba(212,168,83,0.25)' : 'none',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            if (!canSubmit) return
            e.currentTarget.style.filter = 'brightness(1.1)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,168,83,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.filter = ''
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = canSubmit
              ? '0 4px 24px rgba(212,168,83,0.25)'
              : 'none'
          }}
          onMouseDown={e => {
            if (!canSubmit) return
            e.currentTarget.style.transform = 'scale(0.98)'
          }}
          onMouseUp={e => {
            if (!canSubmit) return
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
        >
          {/* Compass icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
          </svg>
          {isLoading ? 'Planning…' : 'Plan My Journey'}
        </button>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(138,154,176,0.45)',
          fontFamily: 'Inter, system-ui, sans-serif',
          marginTop: '-4px',
        }}
      >
        Press ⌘ + Enter to submit
      </p>
    </div>
  )
}
