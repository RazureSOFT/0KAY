import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// WEBUI_PORT, WEBUI_HOST, CORE_HTTP_ADDR come from runtime-env.json when
// installed via 0kay-pm. WEBUI_HOST=0.0.0.0 exposes the dev server to the LAN.
const webuiPort = Number(process.env.WEBUI_PORT) || 3000
const webuiHost = process.env.WEBUI_HOST || '127.0.0.1'
const exposed = webuiHost !== '127.0.0.1' && webuiHost !== 'localhost'
const coreHttp = process.env.CORE_HTTP_ADDR || process.env.CORE_HTTP || 'http://127.0.0.1:8080'
const coreWs = coreHttp.replace(/^http/, 'ws')

// When exposed, a remote browser sends its own Origin; Core rejects unknown
// origins. Rewrite it to the proxy target so Core treats the request as
// same-origin (the request originates from this host either way).
const sameOrigin = (proxy: any) => {
  const rewrite = (proxyReq: any) => {
    if (exposed) proxyReq.setHeader('origin', coreHttp)
  }
  proxy.on('proxyReq', rewrite)
  proxy.on('proxyReqWs', rewrite)
}

export default defineConfig({
  plugins: [vue()],
  server: {
    host: webuiHost,
    port: webuiPort,
    ...(exposed ? { allowedHosts: true } : {}),
    proxy: {
      '/live2d/models': { target: coreHttp },
      '/api': {
        target: coreHttp,
        changeOrigin: true,
        // Ensure SSE (text/event-stream) is not buffered by the dev proxy
        configure: (proxy) => {
          sameOrigin(proxy)
          proxy.on('proxyRes', (proxyRes) => {
            if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
              proxyRes.headers['cache-control'] = 'no-cache'
              delete proxyRes.headers['content-length']
            }
          })
        },
      },
      '/ws': {
        target: coreWs,
        ws: true,
        changeOrigin: true,
        configure: (proxy) => sameOrigin(proxy),
      },
    },
  },
})
