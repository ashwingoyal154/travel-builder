import { useState, useEffect } from 'react'

const STAGES = [
  {
    label: 'Selecting your destinations',
    sub: 'City Selection Agent is scanning the world for you…',
  },
  {
    label: 'Crafting your city guides',
    sub: 'City Guide Agent is researching local secrets…',
  },
  {
    label: 'Building your perfect itinerary',
    sub: 'Travel Concierge Agent is writing your day-by-day plan…',
  },
]

const QUOTES = [
  '"Not all those who wander are lost." — J.R.R. Tolkien',
  '"The world is a book, and those who do not travel read only one page." — St. Augustine',
  '"Travel is the only thing you buy that makes you richer."',
  '"To travel is to live." — Hans Christian Andersen',
  '"Life is short and the world is wide."',
]

export default function LoadingOverlay() {
  const [stageIndex, setStageIndex] = useState(0)
  const [progressPct, setProgressPct] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [quoteFade, setQuoteFade] = useState(true)

  // Stage advancement + progress bar
  useEffect(() => {
    let stage = 0
    let stageElapsed = 0
    const TICK_MS = 120
    const STAGE_DURATION = 18_000

    const tick = setInterval(() => {
      stageElapsed += TICK_MS

      if (stage === 0 && stageElapsed >= STAGE_DURATION) {
        stage = 1
        stageElapsed = 0
        setStageIndex(1)
        setProgressPct(0)
      } else if (stage === 1 && stageElapsed >= STAGE_DURATION) {
        stage = 2
        stageElapsed = 0
        setStageIndex(2)
        setProgressPct(0)
      }

      if (stage < 2) {
        setProgressPct(Math.min((stageElapsed / STAGE_DURATION) * 100, 99))
      }
    }, TICK_MS)

    return () => clearInterval(tick)
  }, [])

  // Quote cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteFade(false)
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % QUOTES.length)
        setQuoteFade(true)
      }, 500)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Generating your travel itinerary"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        gap: '40px',
      }}
    >
      {/* Spinning globe */}
      <div style={{ position: 'relative', width: '88px', height: '88px' }}>
        <svg
          width="88"
          height="88"
          viewBox="0 0 80 80"
          style={{ animation: 'spin 20s linear infinite' }}
        >
          <circle cx="40" cy="40" r="36" stroke="#d4a853" strokeWidth="1" fill="none" strokeOpacity="0.3" />
          <ellipse cx="40" cy="40" rx="20" ry="36" stroke="#d4a853" strokeWidth="1" fill="none" strokeOpacity="0.25" />
          <ellipse cx="40" cy="40" rx="36" ry="12" stroke="#d4a853" strokeWidth="1" fill="none" strokeOpacity="0.25" />
          <circle cx="40" cy="40" r="2.5" fill="#d4a853" />
        </svg>
        {/* Outer pulse ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: '1px solid rgba(212,168,83,0.1)',
            animation: 'pulseGold 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Stage indicators */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '440px',
        }}
      >
        {STAGES.map((stage, i) => {
          const isCompleted = i < stageIndex
          const isActive = i === stageIndex
          const isPending = i > stageIndex

          return (
            <div
              key={i}
              style={{
                opacity: isPending ? 0.3 : isCompleted ? 0.55 : 1,
                transition: 'opacity 0.5s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: isActive ? '10px' : '0',
                }}
              >
                {/* Step number or checkmark */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    minWidth: '32px',
                    borderRadius: '50%',
                    border: isCompleted
                      ? '1px solid rgba(212,168,83,0.4)'
                      : isActive
                      ? '1px solid rgba(212,168,83,0.7)'
                      : '1px solid rgba(212,168,83,0.2)',
                    background: isCompleted
                      ? 'rgba(212,168,83,0.08)'
                      : isActive
                      ? 'rgba(212,168,83,0.1)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s ease',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {isCompleted ? (
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path
                        d="M1 5.5L5 9.5L13 1"
                        stroke="#d4a853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      style={{
                        fontFamily: '"Courier New", monospace',
                        fontSize: '11px',
                        color: '#d4a853',
                        fontWeight: 700,
                      }}
                    >
                      0{i + 1}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: '17px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#f5f0e8' : '#8a9ab0',
                      lineHeight: 1.3,
                      margin: '0 0 4px',
                      transition: 'color 0.4s ease',
                    }}
                  >
                    {stage.label}
                  </p>
                  {isActive && (
                    <p
                      style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: '14px',
                        fontStyle: 'italic',
                        color: 'rgba(138,154,176,0.8)',
                        margin: 0,
                        animation: 'fadeIn 0.4s ease',
                      }}
                    >
                      {stage.sub}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress bar — only for active stage */}
              {isActive && (
                <div
                  style={{
                    marginLeft: '48px',
                    height: '3px',
                    background: 'rgba(212,168,83,0.1)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: stageIndex < 2 ? `${progressPct}%` : '60%',
                      animation:
                        stageIndex === 2 ? 'pulseGold 2s ease-in-out infinite' : 'none',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Cycling quote */}
      <p
        className={quoteFade ? 'quote-visible' : 'quote-hidden'}
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontStyle: 'italic',
          fontSize: '15px',
          color: 'rgba(212,168,83,0.65)',
          textAlign: 'center',
          maxWidth: '400px',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {QUOTES[quoteIndex]}
      </p>
    </div>
  )
}
