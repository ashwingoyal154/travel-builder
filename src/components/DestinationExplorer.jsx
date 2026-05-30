import { useState, useEffect } from 'react'
import { WORLD_MAP_PATHS, CONTINENTS } from '../data/promptLibrary.js'
import QueryChip from './QueryChip.jsx'

// ── Helpers ──────────────────────────────────────────────────────────────────

function useIsMobile() {
  const getIsMobile = () =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 640px)').matches
      : false

  const [isMobile, setIsMobile] = useState(getIsMobile)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 640px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

// Build a lookup: mapPathIndex → continent
const PATH_INDEX_TO_CONTINENT = Object.fromEntries(
  CONTINENTS.map((c) => [c.mapPathIndex, c])
)

// ── Sub-components ────────────────────────────────────────────────────────────

function MapPath({ d, index, selectedContinentId, onSelect }) {
  const continent = PATH_INDEX_TO_CONTINENT[index]
  const isInteractive = !!continent
  const isComingSoon = isInteractive && continent.comingSoon
  const isSelected = isInteractive && continent.id === selectedContinentId

  const [hovered, setHovered] = useState(false)

  let fillOpacity
  if (isComingSoon) {
    fillOpacity = 0.06
  } else if (isSelected) {
    fillOpacity = 0.55
  } else if (hovered) {
    fillOpacity = 0.3
  } else {
    fillOpacity = 0.12
  }

  const style = {
    fill: '#d4a853',
    fillOpacity,
    stroke: '#d4a853',
    strokeWidth: isSelected ? 1.2 : 0.6,
    strokeOpacity: isSelected ? 0.7 : 0.35,
    cursor: isComingSoon ? 'not-allowed' : isInteractive ? 'pointer' : 'default',
    transition: 'fill-opacity 0.25s ease, stroke-width 0.25s ease, stroke-opacity 0.25s ease',
    filter: isSelected ? 'drop-shadow(0 0 6px rgba(212,168,83,0.7))' : undefined,
    outline: 'none',
  }

  function handleClick() {
    if (!isInteractive || isComingSoon) return
    onSelect(continent.id)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  if (!isInteractive) {
    return <path d={d} style={style} aria-hidden="true" />
  }

  return (
    <path
      d={d}
      style={style}
      role="button"
      tabIndex={isComingSoon ? -1 : 0}
      aria-label={continent.name + (isComingSoon ? ' (coming soon)' : '')}
      aria-pressed={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        if (!isComingSoon) setHovered(true)
      }}
      onMouseLeave={() => setHovered(false)}
    />
  )
}

function DrillDownPanel({ selectedContinentId, selectedCountry, onSelectCountry, onPromptSelect }) {
  const continent = CONTINENTS.find((c) => c.id === selectedContinentId)

  // Shared panel wrapper styles
  const panelStyle = {
    marginTop: '20px',
    borderRadius: '16px',
    padding: '20px 22px',
    animation: 'slideUp 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
  }

  if (!continent) {
    return (
      <div
        className="glass"
        style={{
          ...panelStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '72px',
        }}
      >
        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '17px',
            color: 'rgba(138,154,176,0.65)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Tap a continent to explore
        </p>
      </div>
    )
  }

  if (continent.comingSoon) {
    return (
      <div
        className="glass"
        style={{
          ...panelStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '72px',
        }}
      >
        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '17px',
            color: 'rgba(212,168,83,0.6)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          More destinations coming soon ✦
        </p>
      </div>
    )
  }

  // Has countries
  return (
    <div
      className="glass"
      style={{
        ...panelStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Continent name label */}
      <p
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#8a9ab0',
          margin: 0,
        }}
      >
        {continent.name}
      </p>

      {/* Country chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {continent.countries.map((country) => (
          <QueryChip
            key={country.name}
            label={country.name}
            variant="country"
            selected={selectedCountry === country.name}
            onClick={() => onSelectCountry(country.name)}
          />
        ))}
      </div>

      {/* Prompt chips — only shown when a country is selected */}
      {selectedCountry && (() => {
        const countryData = continent.countries.find((c) => c.name === selectedCountry)
        if (!countryData) return null
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              animation: 'fadeIn 0.5s ease forwards',
            }}
          >
            <p
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(138,154,176,0.6)',
                margin: 0,
              }}
            >
              Prompts
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {countryData.prompts.map((prompt) => (
                <QueryChip
                  key={prompt}
                  label={prompt}
                  variant="prompt"
                  onClick={() => onPromptSelect(prompt)}
                />
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function DestinationExplorer({ onPromptSelect }) {
  const [selectedContinentId, setSelectedContinentId] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  const isMobile = useIsMobile()

  function handleSelectContinent(continentId) {
    if (selectedContinentId === continentId) {
      // Toggle off
      setSelectedContinentId(null)
      setSelectedCountry(null)
    } else {
      setSelectedContinentId(continentId)
      setSelectedCountry(null) // reset country whenever continent changes
    }
  }

  function handleSelectCountry(countryName) {
    setSelectedCountry((prev) => (prev === countryName ? null : countryName))
  }

  return (
    <section
      style={{
        width: '100%',
        margin: '0 auto',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
      }}
      aria-label="Destination Explorer"
    >
      {/* ── Eyebrow heading ── */}
      <p
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#e8c97a',
          margin: '0 0 18px',
          textAlign: 'center',
        }}
      >
        Explore by destination
      </p>

      {/* ── Contained interactive map — hidden on mobile, shown above 640px ── */}
      {!isMobile && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            animation: 'fadeIn 0.5s ease forwards',
          }}
        >
          <svg
            viewBox="0 0 1000 500"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="World map — click a continent to explore"
            style={{
              width: '100%',
              maxWidth: '520px',
              height: 'auto',
              display: 'block',
              overflow: 'visible',
            }}
          >
            {/* Equator and meridian lines for context */}
            <line
              x1="0" y1="250" x2="1000" y2="250"
              stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.15"
              aria-hidden="true"
            />
            <line
              x1="500" y1="0" x2="500" y2="500"
              stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.15"
              aria-hidden="true"
            />

            {/* Continent paths */}
            {WORLD_MAP_PATHS.map((d, i) => (
              <MapPath
                key={i}
                d={d}
                index={i}
                selectedContinentId={selectedContinentId}
                onSelect={handleSelectContinent}
              />
            ))}

            {/* Continent name labels centered on each shape */}
            {CONTINENTS.map((continent) => {
              // We compute a rough label position by picking the midpoint of the
              // bounding box for each path.  Rather than parsing SVG commands, we
              // use hand-tuned offsets that look good on the existing path set.
              const labelPositions = {
                'north-america':  { x: 155, y: 160 },
                'south-america':  { x: 191, y: 338 },
                europe:           { x: 478,  y: 100 },
                africa:           { x: 490,  y: 268 },
                asia:             { x: 685,  y: 112 },
                oceania:          { x: 776,  y: 330 },
              }
              const pos = labelPositions[continent.id]
              if (!pos) return null
              const isSelected = continent.id === selectedContinentId
              const isComingSoon = !!continent.comingSoon
              return (
                <text
                  key={continent.id}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '22px',
                    fill: isSelected ? '#e8c97a' : isComingSoon ? 'rgba(212,168,83,0.3)' : 'rgba(212,168,83,0.55)',
                    letterSpacing: '0.04em',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    transition: 'fill 0.25s ease',
                    fontWeight: isSelected ? 700 : 400,
                  }}
                  aria-hidden="true"
                >
                  {continent.name.split(' ').map((word, wi) => (
                    <tspan key={wi} x={pos.x} dy={wi === 0 ? 0 : '1.15em'}>
                      {word}
                    </tspan>
                  ))}
                </text>
              )
            })}
          </svg>
        </div>
      )}

      {/* ── Mobile fallback: horizontal continent pill row ── */}
      {isMobile && (
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '8px',
            paddingBottom: '6px',
            animation: 'fadeIn 0.5s ease forwards',
            // hide scrollbar but keep scrollability
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          aria-label="Select a continent"
        >
          {CONTINENTS.map((continent) => (
            <QueryChip
              key={continent.id}
              label={continent.name}
              variant="country"
              selected={continent.id === selectedContinentId}
              disabled={!!continent.comingSoon}
              onClick={() => {
                if (!continent.comingSoon) handleSelectContinent(continent.id)
              }}
            />
          ))}
        </div>
      )}

      {/* ── Drill-down panel ── */}
      <DrillDownPanel
        selectedContinentId={selectedContinentId}
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
        onPromptSelect={onPromptSelect}
      />
    </section>
  )
}
