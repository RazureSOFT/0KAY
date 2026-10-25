import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Plugin UI modules are committed artifacts under core/data/plugin-ui/<name>/.
// Serving them straight from disk beats proxying to Core in dev: the WebView's
// module loader chokes on the http-proxy response (fetch works, import does
// not), and disk serving picks up a fresh `build:plugin` instantly.
const MIME = {
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.html': 'text/html; charset=utf-8',
}
const pluginUiFromDisk = () => ({
  name: '0kay-plugin-ui-from-disk',
  // Version the entry module per HTML response: some embedded WebViews cache
  // module URLs across reloads even with ETag + no-store, so an edited file
  // never re-executes and a stale strings table sticks. A fresh query per
  // page load makes the whole module graph a cache miss — dev-only overhead,
  // production builds hash their filenames.
  transformIndexHtml(html) {
    return html.replace('<script type="module" src="/src/main.ts">', `<script type="module" src="/src/main.ts?boot=${Date.now().toString(36)}">`)
  },
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const match = /^\/api\/plugins\/([^/]+)\/ui\/([^?]+)/.exec(req.url || '')
      if (!match) return next()
      const resolved = path.resolve(path.join(repoRoot, 'core', 'data', 'plugin-ui', match[1], ...match[2].split('/')))
      const root = path.join(repoRoot, 'core', 'data', 'plugin-ui') + path.sep
      if (!resolved.startsWith(root) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) return next()
      const stat = fs.statSync(resolved)
      // no-cache alone is not honoured without validators by some embedded
      // HTTP caches; an ETag makes revalidation well-defined (304 or fresh).
      const etag = `W/"${stat.size.toString(16)}-${stat.mtimeMs.toString(16)}"`
      if (req.headers['if-none-match'] === etag) {
        res.statusCode = 304
        res.end()
        return
      }
      res.setHeader('ETag', etag)
      res.setHeader('Last-Modified', stat.mtime.toUTCString())
      res.setHeader('Content-Type', MIME[path.extname(resolved).toLowerCase()] || 'application/octet-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.end(fs.readFileSync(resolved))
    })
  },
})

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
  plugins: [vue(), pluginUiFromDisk()],
  test: {
    // Vitest stubs CSS modules by default, which makes `import css from
    // './x.css?raw'` yield an empty string. One test asserts that every `btn-*`
    // variant used in the app has a rule in the design system — the check that
    // catches a button silently rendering untitled because it names a variant
    // that does not exist. That needs the stylesheet as text.
    css: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Keep the heavy Live2D/WebGL runtime and vendor code out of the main
        // chunk so the app shell stays small and cacheable. pixi-live2d-display
        // must NOT be forced into the eager pixi chunk: its cubism2 submodule
        // asserts window.Live2D at import time, and live2d-runtime only injects
        // that runtime right before its own dynamic import. Eager evaluation
        // (prod-only, dev keeps dynamic imports lazy) crashed every static
        // deployment before main.ts ever ran. As a purely-dynamic import it
        // lands in its own lazy chunk, preserving dev's ordering.
        manualChunks: {
          pixi: ['pixi.js'],
          vendor: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
          markdown: ['marked', 'dompurify'],
        },
      },
    },
  },
  server: {
    host: webuiHost,
    port: webuiPort,
    // Dev-only: some embedded WebViews cache every response — even ETag'd,
    // no-cache ones — so edited modules and strings never refresh on reload.
    // no-store makes every dev fetch authoritative. Production (nginx) is a
    // separate config and unaffected.
    headers: {
      'Cache-Control': 'no-store',
    },
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
