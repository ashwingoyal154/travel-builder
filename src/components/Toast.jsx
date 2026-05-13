export default function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #d4a853, #b8894a)',
        color: '#0a0a0f',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 600,
        fontSize: '14px',
        padding: '12px 28px',
        borderRadius: '999px',
        boxShadow: '0 8px 32px rgba(212,168,83,0.35)',
        animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1) forwards',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  )
}
