export default function DayCard({ number, title, content, animationDelay = 0 }) {
  return (
    <div
      className="card-hover relative overflow-hidden rounded-2xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(30,58,95,0.3) 0%, rgba(10,10,15,0.85) 100%)',
        border: '1px solid rgba(212,168,83,0.15)',
        padding: '28px',
        animation: 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        animationDelay: `${animationDelay}ms`,
        opacity: 0,
      }}
    >
      {/* Gold accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '24px',
          right: '24px',
          height: '2px',
          background:
            'linear-gradient(90deg, transparent, #d4a853, transparent)',
        }}
      />

      {/* Day label */}
      <p
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: '#d4a853',
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        Day {number}
      </p>

      {/* Title */}
      {title && (
        <h3
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '18px',
            fontWeight: 600,
            color: '#f5f0e8',
            lineHeight: 1.3,
            marginBottom: '14px',
          }}
        >
          {title}
        </h3>
      )}

      {/* Content */}
      <p
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '13.5px',
          color: '#8a9ab0',
          lineHeight: 1.75,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {content}
      </p>
    </div>
  )
}
