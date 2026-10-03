import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Builds the *platform plugin* ESM pages (chat/plugins/settings/usage) that the
// WebUI shell now only hosts.  The page sources still live in webui/src so the
// SFC compiler/type-check stay in one place, but this build:
//   * aliases @webui -> src so entries can re-export the pages,
//   * rewrites every import of a *shared* module (api/stores/i18n/theme/… and
//     the shared dialogs) to the bare specifier @0kay/host, and
//   * externalizes vue / vue-i18n / vue-router / pinia / @0kay/host, which the
//     browser resolves through the index.html importmap to the host's single
//     runtime + state.
// Result: only page/panel component code is bundled here.
const root = path.dirname(fileURLToPath(import.meta.url))
const src = path.join(root, 'src')
const outDir = path.resolve(root, '../core/data/plugin-ui/webui')

// Vite module ids use posix separators on Windows too, so compare in posix.
const toPosix = (p: string) => p.replace(/\\/g, '/')
const srcPosix = toPosix(src)

/** Resolved absolute paths whose module the host owns (never bundle them). */
const SHARED = new Set(
  [
    'api.ts', 'i18n.ts', 'theme.ts', 'uid.ts', 'live2d-runtime.ts',
    'stores/chat.ts', 'stores/life.ts', 'stores/providers.ts',
    'stores/settingsSections.ts', 'stores/wizard.ts', 'stores/uiPatches.ts',
    'composables/confirm.ts', 'composables/settingsMeta.ts', 'composables/wizard.ts',
    'components/AppSelect.vue', 'components/ConfirmDialog.vue',
    'components/MarkdownContent.vue', 'components/PinInput.vue',
  ].map((p) => toPosix(path.join(src, p))),
)

function rewriteSharedToHost() {
  return {
    name: 'rewrite-shared-to-host',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const cleanId = toPosix(id.split('?')[0])
      if (!cleanId.startsWith(srcPosix)) return null
      const dir = path.dirname(cleanId)
      let changed = false
      const out = code.replace(
        /(\bfrom\s*|\bimport\s*)(['"])([^'"]+)\2/g,
        (match, kw: string, quote: string, spec: string) => {
          if (!spec.startsWith('.')) return match
          const abs = toPosix(path.resolve(dir, spec))
          const candidates = [abs, `${abs}.ts`, `${abs}.vue`, `${abs}/index.ts`]
          if (candidates.some((candidate) => SHARED.has(candidate))) {
            changed = true
            return `${kw}${quote}@0kay/host${quote}`
          }
          return match
        },
      )
      return changed ? { code: out, map: null } : null
    },
  }
}

/** Inline extracted CSS into the entry chunks (plugin ESM has no HTML). */
function injectCss(styleId: string) {
  return {
    name: 'inject-css',
    enforce: 'post' as const,
    apply: 'build' as const,
    generateBundle(_options: unknown, bundle: Record<string, any>) {
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
  plugins: [vue(), rewriteSharedToHost(), injectCss('webui-plugin-style')],
  resolve: {
    alias: { '@webui': src },
  },
  build: {
    outDir,
    emptyOutDir: true,
    // Plugin ESM has no HTML: never shovel public/ (live2d models, bridges) into it.
    copyPublicDir: false,
    target: 'es2020',
    lib: {
      entry: {
        chat: path.join(root, 'plugin/entries/chat.js'),
        plugins: path.join(root, 'plugin/entries/plugins.js'),
        settings: path.join(root, 'plugin/entries/settings.js'),
        usage: path.join(root, 'plugin/entries/usage.js'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vue-i18n', 'vue-router', 'pinia', '@0kay/host'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
