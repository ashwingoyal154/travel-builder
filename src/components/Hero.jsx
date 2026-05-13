import QueryInterface from './QueryInterface.jsx'

const WORLD_MAP_PATHS = [
  // North America
  'M 80 80 L 180 60 L 220 90 L 245 135 L 215 185 L 175 230 L 145 250 L 100 205 L 68 155 Z',
  // South America
  'M 155 265 L 200 252 L 225 280 L 235 345 L 215 405 L 185 428 L 158 396 L 148 340 L 152 295 Z',
  // Europe
  'M 425 58 L 515 52 L 538 78 L 528 125 L 496 145 L 448 133 L 418 102 Z',
  // Africa
  'M 438 162 L 512 152 L 542 182 L 554 254 L 532 336 L 490 375 L 458 343 L 437 272 L 428 202 Z',
  // Asia
  'M 540 48 L 705 38 L 808 68 L 835 122 L 805 175 L 722 185 L 640 165 L 568 142 L 538 100 Z',
  // Australia
  'M 718 282 L 802 270 L 845 302 L 843 364 L 800 384 L 738 372 L 706 332 Z',
]

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
          opacity: 0.045,
          animation: 'float 10s ease-in-out infinite',
          zIndex: 0,
        }}
      >
        {WORLD_MAP_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {/* Latitude/longitude grid lines */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="500" y1="0" x2="500" y2="500" stroke="#d4a853" strokeWidth="0.5" strokeOpacity="0.3" />
        <ellipse cx="500" cy="250" rx="480" ry="240" stroke="#d4a853" strokeWidth="0.5" fill="none" strokeOpacity="0.15" />
        <ellipse cx="500" cy="250" rx="480" ry="100" stroke="#d4a853" strokeWidth="0.5" fill="none" strokeOpacity="0.1" />
      </svg>

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
          maxWidth: '900px',
          gap: '0',
        }}
      >
        {/* Eyebrow label */}
        <p
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: '11px',
            letterSpacing: '0.22em',
            color: 'rgba(212,168,83,0.75)',
            textTransform: 'uppercase',
            marginBottom: '28px',
            animation: 'fadeUp 0.6s ease 0.1s forwards',
            opacity: 0,
          }}
        >
          Powered by AI Travel Agents
        </p>

        {/* Main headline */}
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 700,
            color: '#f5f0e8',
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            margin: '0 0 24px',
            animation: 'fadeUp 0.6s ease 0.2s forwards',
            opacity: 0,
          }}
        >
          Where do you{' '}
          <em
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#d4a853',
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
            fontSize: 'clamp(16px, 2.2vw, 22px)',
            color: '#8a9ab0',
            maxWidth: '560px',
            lineHeight: 1.55,
            margin: '0 0 32px',
            animation: 'fadeUp 0.6s ease 0.3s forwards',
            opacity: 0,
          }}
        >
          Describe any journey — historical, cultural, culinary, or completely
          abstract. Our AI agents will craft your perfect itinerary.
        </p>

        {/* Gold divider */}
        <div
          aria-hidden="true"
          style={{
            width: '60px',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
            marginBottom: '36px',
            animation: 'fadeIn 0.6s ease 0.4s forwards',
            opacity: 0,
          }}
        />

        {/* Query interface */}
        <div
          style={{
            width: '100%',
            animation: 'fadeUp 0.6s ease 0.5s forwards',
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
