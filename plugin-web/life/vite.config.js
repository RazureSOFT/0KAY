import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(root, '../../core/data/plugin-ui/life')

// Pure plugin pages (memory/companion) → CORE_DATA_DIR/plugin-ui/life/.
// `vue` stays external — WebUI importmap maps it to the host bridge.

/** Inline extracted CSS into entry chunks (plugin ESM has no HTML to link from). */
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

export default defineConfig({
  plugins: [vue(), injectCss('life-plugin-style')],
  build: {
    outDir,
    emptyOutDir: true,
    target: 'es2020',
    lib: {
      entry: {
        memory: path.join(root, 'memory.js'),
        companion: path.join(root, 'companion.js'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
