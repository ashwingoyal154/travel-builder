// Replace YOUR_N8N_INSTANCE_URL with your actual n8n host (e.g. https://my-n8n.app.n8n.cloud)
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL
  ? `/api/n8n${new URL(import.meta.env.VITE_N8N_WEBHOOK_URL).pathname}`
  : '/api/n8n/webhook/missing-webhook-url'

export function useItinerary() {
  const submit = async (query, { onStart, onSuccess, onError }) => {
    onStart()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120_000)

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) throw new Error(`status ${response.status}`)

      const contentType = response.headers.get('content-type') || ''
      let text
      if (contentType.includes('application/json')) {
        const data = await response.json()
        text =
          data?.output ??
          data?.[0]?.output ??
          (typeof data === 'string' ? data : JSON.stringify(data, null, 2))
      } else {
        text = await response.text()
      }

      onSuccess(text)
    } catch (err) {
      clearTimeout(timeout)
      if (err.name === 'AbortError') {
        onError('Your journey is taking longer than expected. Please try again.')
      } else {
        onError(
          'Something went wrong reaching our travel agents. Please try again.',
        )
      }
    }
  }

  return { submit }
}
