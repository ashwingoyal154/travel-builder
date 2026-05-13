export default function BudgetCard({ text }) {
  return (
    <div
      className="animate-fade-up rounded-2xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(212,168,83,0.08) 0%, rgba(10,10,15,0.92) 100%)',
        border: '1px solid rgba(212,168,83,0.3)',
        borderRadius: '20px',
        padding: '32px',
        animation: 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        animationDelay: '100ms',
        opacity: 0,
      }}
    >
      <h3
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '22px',
          fontWeight: 600,
          color: '#d4a853',
          marginBottom: '16px',
        }}
      >
        💰 Budget Breakdown
      </h3>
      <pre
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '14px',
          color: '#8a9ab0',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
        }}
      >
        {text}
      </pre>
    </div>
  )
}
