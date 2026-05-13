import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const webhookUrl = env.VITE_N8N_WEBHOOK_URL || ''
  const n8nOrigin = webhookUrl ? new URL(webhookUrl).origin : 'https://localhost'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/n8n': {
          target: n8nOrigin,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/n8n/, ''),
        },
      },
    },
  }
})
