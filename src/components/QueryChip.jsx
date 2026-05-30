export default function QueryChip({ label, onClick, variant = 'prompt', selected = false, disabled = false }) {
  // Base styles shared across variants
  const base = {
    padding: '6px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    transition: 'all 0.25s ease',
    whiteSpace: 'nowrap',
    fontFamily: 'Inter, system-ui, sans-serif',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
  }

  // Compute resting border/background/color by variant + selected
  let restingStyle
  if (selected) {
    // Selected state: gold fill, obsidian text — identical for both variants
    restingStyle = {
      border: '1px solid #d4a853',
      background: '#d4a853',
      color: '#0a0a0f',
      fontWeight: 600,
    }
  } else if (variant === 'country') {
    // Country variant: stronger border + background than prompt, same family
    restingStyle = {
      border: '1px solid rgba(212,168,83,0.5)',
      background: 'rgba(212,168,83,0.14)',
      color: '#f5f0e8',
      fontWeight: 500,
    }
  } else {
    // Default 'prompt' variant — byte-identical to the original
    restingStyle = {
      border: '1px solid rgba(212,168,83,0.25)',
      background: 'rgba(212,168,83,0.07)',
      color: 'rgba(245,240,232,0.75)',
      fontWeight: undefined,
    }
  }

  function handleMouseEnter(e) {
    if (disabled || selected) return
    if (variant === 'country') {
      e.currentTarget.style.borderColor = 'rgba(212,168,83,0.75)'
      e.currentTarget.style.color = '#f5f0e8'
      e.currentTarget.style.background = 'rgba(212,168,83,0.24)'
    } else {
      // prompt variant — original hover behaviour
      e.currentTarget.style.borderColor = 'rgba(212,168,83,0.55)'
      e.currentTarget.style.color = '#f5f0e8'
      e.currentTarget.style.background = 'rgba(212,168,83,0.13)'
    }
  }

  function handleMouseLeave(e) {
    if (disabled || selected) return
    if (variant === 'country') {
      e.currentTarget.style.borderColor = 'rgba(212,168,83,0.5)'
      e.currentTarget.style.color = '#f5f0e8'
      e.currentTarget.style.background = 'rgba(212,168,83,0.14)'
    } else {
      // prompt variant — original leave behaviour
      e.currentTarget.style.borderColor = 'rgba(212,168,83,0.25)'
      e.currentTarget.style.color = 'rgba(245,240,232,0.75)'
      e.currentTarget.style.background = 'rgba(212,168,83,0.07)'
    }
  }

  function handleClick() {
    if (disabled) return
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-disabled={disabled}
      style={{ ...base, ...restingStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
    </button>
  )
}
