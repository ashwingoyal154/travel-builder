import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const COLORS = {
  client: { bg: '#0d1b2a', border: '#1e3a5f' },
  api:    { bg: '#1e3a5f', border: '#d4a853' },
  agent:  { bg: '#0a0a0f', border: '#d4a853' },
}

const nodeStyle = kind => ({
  background: COLORS[kind].bg,
  border: `1px solid ${COLORS[kind].border}`,
  color: '#f5f0e8',
  padding: '10px 14px',
  borderRadius: '10px',
  width: 210,
  fontFamily: 'Inter, system-ui, sans-serif',
})

const labelOf = (title, sub, kind) => (
  <div style={{ textAlign: 'left' }}>
    <div
      style={{
        fontFamily: '"Courier New", monospace',
        fontSize: '9px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: kind === 'agent' ? '#d4a853' : '#8a9ab0',
        marginBottom: '4px',
      }}
    >
      {kind}
    </div>
    <div style={{ fontWeight: 600, fontSize: '13px', color: '#f5f0e8', marginBottom: '2px' }}>
      {title}
    </div>
    <div
      style={{
        fontSize: '11px',
        color: '#8a9ab0',
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontStyle: 'italic',
      }}
    >
      {sub}
    </div>
  </div>
)

const node = (id, x, y, kind, title, sub, extra = {}) => ({
  id,
  position: { x, y },
  data: { label: labelOf(title, sub, kind) },
  style: nodeStyle(kind),
  sourcePosition: extra.sourcePosition ?? 'right',
  targetPosition: extra.targetPosition ?? 'left',
})

const nodes = [
  node('user',     0,    220, 'client', 'User',                       'free-text prompt',           { targetPosition: 'right' }),
  node('app',      260,  220, 'client', 'App.jsx',                    'handleSubmit(query)'),
  node('hook',     520,  220, 'client', 'useItinerary.submit',        'JSON.stringify + fetch'),
  node('proxy',    780,  220, 'api',    'Vite Dev Proxy',             '/api/n8n/* → origin'),
  node('webhook',  1040, 220, 'api',    'n8n Webhook',                'POST /webhook/:id'),
  node('agent1',   1300, 40,  'agent',  'Agent 1 — City Selection',   'pick destinations',          { sourcePosition: 'bottom' }),
  node('agent2',   1300, 220, 'agent',  'Agent 2 — City Guide',       'expand each city',           { sourcePosition: 'bottom', targetPosition: 'top' }),
  node('agent3',   1300, 400, 'agent',  'Agent 3 — Travel Concierge', 'compose itinerary',          { sourcePosition: 'left',   targetPosition: 'top' }),
  node('response', 1040, 540, 'api',    'HTTP Response',              'text | JSON',                { sourcePosition: 'left',   targetPosition: 'right' }),
  node('unwrap',   780,  540, 'client', 'Response handler',           'data.output ?? data[0].output', { sourcePosition: 'left', targetPosition: 'right' }),
  node('parser',   520,  540, 'client', 'parseItinerary()',           'split on /^Day N/m',         { sourcePosition: 'left',   targetPosition: 'right' }),
  node('render',   260,  540, 'client', 'ItineraryResult',            'DayCard / Budget / Packing', { sourcePosition: 'left',   targetPosition: 'right' }),
]

const edge = (id, source, target, typeLabel) => ({
  id,
  source,
  target,
  label: typeLabel,
  labelShowBg: true,
  labelStyle: {
    fill: '#e8c97a',
    fontFamily: '"Courier New", monospace',
    fontSize: 11,
    fontWeight: 600,
  },
  labelBgStyle: { fill: '#0a0a0f', fillOpacity: 0.92 },
  labelBgPadding: [6, 4],
  labelBgBorderRadius: 4,
  style: { stroke: '#d4a853', strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#d4a853' },
  type: 'smoothstep',
})

const edges = [
  edge('e1',  'user',     'app',      'string'),
  edge('e2',  'app',      'hook',     'string'),
  edge('e3',  'hook',     'proxy',    'Request<{ prompt: string }>'),
  edge('e4',  'proxy',    'webhook',  'Request<{ prompt: string }>'),
  edge('e5',  'webhook',  'agent1',   '{ prompt: string }'),
  edge('e6',  'agent1',   'agent2',   '{ cities: string[] }'),
  edge('e7',  'agent2',   'agent3',   '{ guides: CityGuide[] }'),
  edge('e8',  'agent3',   'response', '{ output: string }'),
  edge('e9',  'response', 'unwrap',   'Response<JSON | text>'),
  edge('e10', 'unwrap',   'parser',   'string'),
  edge('e11', 'parser',   'render',   '{ days: Day[], budget?: string, packing?: string }'),
]

export default function PipelineDiagram() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          zIndex: 10,
          color: '#f5f0e8',
          fontFamily: '"Playfair Display", Georgia, serif',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: '#d4a853',
            textTransform: 'uppercase',
          }}
        >
          Data Pipeline
        </div>
        <div style={{ fontSize: '22px', marginTop: '4px' }}>
          Travel Builder — prompt → itinerary
        </div>
        <div
          style={{
            marginTop: '6px',
            fontSize: '12px',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#8a9ab0',
            maxWidth: 520,
          }}
        >
          Each node is a transformation step. Edge labels show the type flowing
          across the boundary.
        </div>
      </div>
      <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.15 }}>
        <Background color="#1e3a5f" gap={28} size={1} />
        <Controls
          style={{
            background: '#0d1b2a',
            border: '1px solid #1e3a5f',
            borderRadius: 8,
          }}
        />
      </ReactFlow>
    </div>
  )
}
