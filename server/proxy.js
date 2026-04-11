import 'dotenv/config'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()
const PORT = 3001
const API_KEY = process.env.ANTHROPIC_API_KEY

if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set in .env')
  process.exit(1)
}

// Inject the API key on every proxied request
app.use('/api/anthropic', createProxyMiddleware({
  target: 'https://api.anthropic.com',
  changeOrigin: true,
  pathRewrite: { '^/api/anthropic': '/v1/messages' },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('x-api-key', API_KEY)
      proxyReq.setHeader('anthropic-version', '2023-06-01')
    },
  },
}))

app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT}`)
})
