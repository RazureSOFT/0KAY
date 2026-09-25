import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// WEBUI_PORT and CORE_HTTP_ADDR come from runtime-env.json when installed via 0kay-pm.
const webuiPort = Number(process.env.WEBUI_PORT) || 3000
const coreHttp = process.env.CORE_HTTP_ADDR || process.env.CORE_HTTP || 'http://127.0.0.1:8080'
const coreWs = coreHttp.replace(/^http/, 'ws')

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: webuiPort,
    proxy: {
      '/live2d/models': { target: coreHttp },
      '/api': {
        target: coreHttp,
        changeOrigin: true,
        // Ensure SSE (text/event-stream) is not buffered by the dev proxy
        configure: (proxy) => {
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
      },
    },
  },
})
