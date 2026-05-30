import QueryInterface from './QueryInterface.jsx'
import { WORLD_MAP_PATHS } from '../data/promptLibrary.js'

const SPARKLES = [
  { top: '18%', left: '12%', size: 14, delay: '0s' },
  { top: '24%', left: '88%', size: 10, delay: '0.6s' },
  { top: '62%', left: '6%', size: 12, delay: '1.2s' },
  { top: '70%', left: '92%', size: 16, delay: '1.8s' },
  { top: '8%', left: '46%', size: 8, delay: '2.4s' },
  { top: '78%', left: '40%', size: 9, delay: '0.9s' },
  { top: '38%', left: '95%', size: 11, delay: '1.5s' },
  { top: '44%', left: '4%', size: 10, delay: '2.1s' },
]

const SparkleIcon = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0 L13.6 9.4 L23 11 L13.6 12.6 L12 22 L10.4 12.6 L1 11 L10.4 9.4 Z" />
  </svg>
)

const PlaneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
)

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13 2 L4 14 H11 L10 22 L20 9 H13 Z" />
  </svg>
)

const CompassIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon fill="currentColor" points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
  </svg>
)

export default function Hero({ query, setQuery, onSubmit, isLoading, isDimmed }) {
  return (
    <section
      className="grain"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, #0a0a0f 0%, #0d1b2a 25%, #1a0f05 50%, #0d1b2a 75%, #0a0a0f 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 12s ease infinite',
        transition: 'filter 0.5s ease',
        filter: isDimmed ? 'brightness(0.6)' : 'brightness(1)',
      }}
    >
      {/* ── Rotating aurora glow ── */}
      <div className="hero-aurora" aria-hidden="true" />

      {/* ── World map SVG ── */}
      <svg
        viewBox="0 0 1000 500"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          fill: '#d4a853',
          opacity: 0.05,
          animation: 'float 10s ease-in-out infinite',
          zIndex: 0,
        }}
      >
        {WORLD_MAP_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="500" y1="0" x2="500" y2="500" stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.3" />
        <ellipse cx="500" cy="250" rx="480" ry="240" stroke="#d4a853" strokeWidth="0.5" fill="none" strokeOpacity="0.15" />
        <ellipse cx="500" cy="250" rx="480" ry="100" stroke="#d4a853" strokeWidth="0.5" fill="none" strokeOpacity="0.1" />
      </svg>

      {/* ── Floating sparkles ── */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="hero-sparkle"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            zIndex: 3,
          }}
          aria-hidden="true"
        >
          <SparkleIcon size={s.size} />
        </span>
      ))}

      {/* ── Top vignette ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, #0a0a0f 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      {/* ── Bottom vignette ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to top, #0a0a0f 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: '980px',
          gap: '0',
        }}
      >
        {/* Eyebrow pill badge */}
        <div
          className="hero-badge"
          style={{
            marginBottom: '32px',
            animation: 'fadeUp 0.6s ease 0.1s forwards, badgePulse 3.2s ease-in-out infinite',
            opacity: 0,
          }}
        >
          <span className="hero-badge-dot" aria-hidden="true" />
          <span
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '11px',
              letterSpacing: '0.24em',
              color: '#e8c97a',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Powered by 3 AI Travel Agents
          </span>
          <SparkleIcon size={11} />
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(44px, 8vw, 96px)',
            fontWeight: 800,
            color: '#f5f0e8',
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            margin: '0 0 28px',
            animation: 'fadeUp 0.6s ease 0.2s forwards',
            opacity: 0,
            textShadow: '0 4px 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(212, 168, 83, 0.08)',
          }}
        >
          Where do you{' '}
          <em
            className="hero-shimmer"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 700,
            }}
          >
            want
          </em>{' '}
          to go?
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(17px, 2.3vw, 23px)',
            color: '#a8b8cc',
            maxWidth: '620px',
            lineHeight: 1.55,
            margin: '0 0 28px',
            animation: 'fadeUp 0.6s ease 0.3s forwards',
            opacity: 0,
          }}
        >
          Describe any journey — historical, cultural, culinary, or completely
          abstract. Our AI agents will craft your perfect itinerary.
        </p>

        {/* Feature chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '32px',
            animation: 'fadeUp 0.6s ease 0.4s forwards',
            opacity: 0,
          }}
        >
          <span className="hero-chip">
            <CompassIcon />
            <span>City Selection</span>
          </span>
          <span className="hero-chip">
            <PlaneIcon />
            <span>City Guide</span>
          </span>
          <span className="hero-chip">
            <BoltIcon />
            <span>Travel Concierge</span>
          </span>
        </div>

        {/* Gold divider with star */}
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '36px',
            animation: 'fadeIn 0.6s ease 0.5s forwards',
            opacity: 0,
          }}
        >
          <span
            style={{
              width: '60px',
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, #d4a853)',
            }}
          />
          <span style={{ color: '#d4a853', filter: 'drop-shadow(0 0 6px rgba(212,168,83,0.7))' }}>
            <SparkleIcon size={12} />
          </span>
          <span
            style={{
              width: '60px',
              height: '1.5px',
              background: 'linear-gradient(90deg, #d4a853, transparent)',
            }}
          />
        </div>

        {/* Query interface */}
        <div
          style={{
            width: '100%',
            animation: 'fadeUp 0.6s ease 0.6s forwards',
            opacity: 0,
          }}
        >
          <QueryInterface
            query={query}
            setQuery={setQuery}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  )
}
