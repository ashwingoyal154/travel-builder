import { useState, useRef, useEffect } from 'react'
import Hero from './components/Hero.jsx'
import LoadingOverlay from './components/LoadingOverlay.jsx'
import ItineraryResult from './components/ItineraryResult.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Toast from './components/Toast.jsx'
import { useItinerary } from './hooks/useItinerary.js'

function Footer() {
  return (
    <footer
      style={{
        background: '#060608',
        padding: '48px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(212,168,83,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Faint world map in footer */}
      <svg
        viewBox="0 0 1000 500"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          fill: '#d4a853',
          opacity: 0.018,
          pointerEvents: 'none',
        }}
      >
        <path d="M 80 80 L 180 60 L 220 90 L 245 135 L 215 185 L 175 230 L 145 250 L 100 205 L 68 155 Z" />
        <path d="M 155 265 L 200 252 L 225 280 L 235 345 L 215 405 L 185 428 L 158 396 L 148 340 L 152 295 Z" />
        <path d="M 425 58 L 515 52 L 538 78 L 528 125 L 496 145 L 448 133 L 418 102 Z" />
        <path d="M 438 162 L 512 152 L 542 182 L 554 254 L 532 336 L 490 375 L 458 343 L 437 272 L 428 202 Z" />
        <path d="M 540 48 L 705 38 L 808 68 L 835 122 L 805 175 L 722 185 L 640 165 L 568 142 L 538 100 Z" />
        <path d="M 718 282 L 802 270 L 845 302 L 843 364 L 800 384 L 738 372 L 706 332 Z" />
      </svg>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'rgba(138,154,176,0.45)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          Powered by AI Travel Agents
          <span
            style={{ margin: '0 10px', color: 'rgba(212,168,83,0.4)' }}
          >
            ·
          </span>
          Built with n8n
        </p>
        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'rgba(138,154,176,0.3)',
          }}
        >
          Your itinerary is crafted by three specialised AI agents working in sequence.
        </p>
      </div>
    </footer>
  )
}

function ErrorState({ message, onReset }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div
        className="glass"
        style={{
          maxWidth: '440px',
          width: '100%',
          borderRadius: '24px',
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            marginBottom: '20px',
            lineHeight: 1,
          }}
        >
          ✈️
        </div>
        <h3
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '24px',
            fontWeight: 600,
            color: '#f5f0e8',
            marginBottom: '12px',
          }}
        >
          Journey Interrupted
        </h3>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: '#8a9ab0',
            lineHeight: 1.6,
            marginBottom: '28px',
          }}
        >
          {message}
        </p>
        <button
          onClick={onReset}
          style={{
            padding: '13px 32px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #d4a853, #b8894a)',
            color: '#0a0a0f',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [itinerary, setItinerary] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [showToast, setShowToast] = useState(false)

  const resultRef = useRef(null)
  const { submit } = useItinerary()

  // Scroll to results when they arrive
  useEffect(() => {
    if (status === 'success' && resultRef.current) {
      const timer = setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleSubmit = () => {
    if (!query.trim() || status === 'loading') return
    submit(query, {
      onStart: () => {
        setStatus('loading')
        setItinerary(null)
        setErrorMsg('')
      },
      onSuccess: text => {
        setItinerary(text)
        setStatus('success')
      },
      onError: msg => {
        setErrorMsg(msg)
        setStatus('error')
      },
    })
  }

  const handleReset = () => {
    setStatus('idle')
    setItinerary(null)
    setErrorMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopy = () => {
    if (!itinerary) return
    navigator.clipboard.writeText(itinerary).then(() => {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Hero
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
        isLoading={status === 'loading'}
        isDimmed={status === 'success'}
      />

      {status === 'loading' && <LoadingOverlay />}

      {status === 'error' && (
        <ErrorState message={errorMsg} onReset={handleReset} />
      )}

      {status === 'success' && itinerary && (
        <div ref={resultRef}>
          <ErrorBoundary
            fallback={
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <pre
                  style={{
                    color: '#8a9ab0',
                    fontSize: '13px',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    lineHeight: 1.7,
                    maxWidth: '800px',
                    margin: '0 auto 24px',
                  }}
                >
                  {itinerary}
                </pre>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #d4a853, #b8894a)',
                    color: '#0a0a0f',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Plan Another Journey
                </button>
              </div>
            }
          >
            <ItineraryResult
              rawText={itinerary}
              onReset={handleReset}
              onCopy={handleCopy}
            />
          </ErrorBoundary>
        </div>
      )}

      <Footer />

      {showToast && <Toast message="Copied to clipboard!" />}
    </div>
  )
}
