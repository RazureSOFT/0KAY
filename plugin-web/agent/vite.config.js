import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(root, '../../core/data/plugin-ui/agent')

// Pure plugin page (agents workspace) → CORE_DATA_DIR/plugin-ui/agent/.
// `vue` stays external — WebUI importmap maps it to the host bridge.

/** Inline extracted CSS into the entry chunk (plugin ESM has no HTML to link from). */
function injectCss(styleId) {
  return {
    name: 'inject-css',
    enforce: 'post',
    apply: 'build',
    generateBundle(_options, bundle) {
      const cssAssets = Object.entries(bundle).filter(
        ([name, out]) => out.type === 'asset' && name.endsWith('.css'),
      )
      if (!cssAssets.length) return
      const css = cssAssets.map(([, out]) => out.source).join('\n')
      const inject = `\n;(()=>{if(typeof document!=='undefined'&&!document.getElementById('${styleId}')){const s=document.createElement('style');s.id='${styleId}';s.textContent=${JSON.stringify(String(css))};document.head.appendChild(s)}})();\n`
      for (const out of Object.values(bundle)) {
        if (out.type === 'chunk' && out.isEntry) out.code += inject
      }
      for (const [name] of cssAssets) delete bundle[name]
    },
  }
}

/**
 * Copy the plugin's string resources next to its bundle.
 *
 * Core serves them from CORE_DATA_DIR/plugin-ui/agent/strings, the same place
 * the ESM bundle lands, and the WebUI fetches them from
 * /api/plugins/agent/strings. It has to run *after* the bundle is written:
 * `emptyOutDir: true` wipes the output directory at the start of every build.
 * The source stays in plugin-web/agent/strings and is tracked.
 */
function copyStrings() {
  return {
    name: 'copy-strings',
    apply: 'build',
    async closeBundle() {
      const from = path.join(root, 'strings')
      if (!fs.existsSync(from)) return
      await fs.promises.cp(from, path.join(outDir, 'strings'), { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [vue(), injectCss('agent-plugin-style'), copyStrings()],
  // Some bundled preview libraries (pptx-preview → zrender) reference `process`
  // at module-evaluation time. The plugin runs in the browser, so shim it.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    global: 'globalThis',
  },
  build: {
    outDir,
    emptyOutDir: true,
    target: 'es2020',
    lib: {
      entry: path.join(root, 'index.js'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue', '@0kay/host'],
      output: {
        // `process` shim for libraries that touch process.nextTick/env at load.
        banner: 'var process=globalThis.process||{env:{NODE_ENV:"production"},nextTick:(fn,...a)=>Promise.resolve().then(()=>fn(...a))};',
        entryFileNames: 'index.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
