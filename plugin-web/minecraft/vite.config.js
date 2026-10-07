import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(root, '../../core/data/plugin-ui/minecraft')

// Pure plugin page (Minecraft panel) → CORE_DATA_DIR/plugin-ui/minecraft/.
// `vue` stays external → WebUI importmap maps it to the host bridge.

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

/**
 * Copy the plugin's string resources next to its bundles.
 *
 * Core serves them from CORE_DATA_DIR/plugin-ui/minecraft/strings, the same place
 * the ESM bundles land, and the WebUI fetches them from /api/plugins/minecraft/strings.
 * This has to run *after* the bundle is written: `emptyOutDir: true` wipes the
 * output directory at the start of every build, so anything placed there earlier
 * would be deleted. The source stays in plugin-web/minecraft/strings and is tracked.
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
  plugins: [vue(), injectCss('minecraft-plugin-style'), copyStrings()],
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
        entryFileNames: 'index.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
