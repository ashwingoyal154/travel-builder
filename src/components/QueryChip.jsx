export default function QueryChip({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        border: '1px solid rgba(212,168,83,0.25)',
        background: 'rgba(212,168,83,0.07)',
        color: 'rgba(245,240,232,0.75)',
        padding: '6px 14px',
        borderRadius: '999px',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        whiteSpace: 'nowrap',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(212,168,83,0.55)'
        e.currentTarget.style.color = '#f5f0e8'
        e.currentTarget.style.background = 'rgba(212,168,83,0.13)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(212,168,83,0.25)'
        e.currentTarget.style.color = 'rgba(245,240,232,0.75)'
        e.currentTarget.style.background = 'rgba(212,168,83,0.07)'
      }}
    >
      {label}
    </button>
  )
}
