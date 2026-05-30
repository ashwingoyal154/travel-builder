// Production proxy for the n8n webhook.
//
// In dev, vite.config.js proxies /api/n8n → the n8n origin. That proxy does NOT
// exist in production (Vercel serves static files), so this Serverless Function
// reproduces it: it forwards POST /api/n8n/<path> to <n8n-origin>/<path>.
//
// Configure the upstream host with a Vercel env var (Project → Settings → Env):
//   • N8N_ORIGIN            e.g. https://my-n8n.app.n8n.cloud   (preferred), or
//   • VITE_N8N_WEBHOOK_URL  the full webhook URL — origin is derived from it.
// VITE_N8N_WEBHOOK_URL must be set anyway (the client derives the request path
// from it at build time), so setting just that one var is enough.

function resolveOrigin() {
  if (process.env.N8N_ORIGIN) return process.env.N8N_ORIGIN.replace(/\/+$/, '')
  const full = process.env.VITE_N8N_WEBHOOK_URL
  if (full) {
    try {
      return new URL(full).origin
    } catch {
      /* fall through */
    }
  }
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const origin = resolveOrigin()
  if (!origin) {
    return res
      .status(500)
      .json({ error: 'n8n origin not configured — set N8N_ORIGIN or VITE_N8N_WEBHOOK_URL in Vercel.' })
  }

  // Strip the /api/n8n prefix (mirrors the dev proxy rewrite) and forward the rest.
  const upstreamPath = req.url.replace(/^\/api\/n8n/, '')
  const target = `${origin}${upstreamPath}`

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {})
    const upstream = await fetch(target, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    })

    const text = await upstream.text()
    res.status(upstream.status)
    res.setHeader('content-type', upstream.headers.get('content-type') || 'text/plain; charset=utf-8')
    return res.send(text)
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach n8n', detail: String(err) })
  }
}
