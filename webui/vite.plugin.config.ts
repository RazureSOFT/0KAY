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

// Vite module ids use posix separators on Windows too, and the drive/dir casing
// is not stable (`D:/0KAY` vs `D:/0kay`), so every path comparison is done in a
// normalised lowercase form. Without this the alias-resolved src ids never match
// `src` and the shared-module rewrite is silently skipped (each plugin bundle
// then ships its own copy of confirm/stores/dialogs).
const toPosix = (p: string) => p.replace(/\\/g, '/')
const norm = (p: string) => toPosix(p).toLowerCase()
const srcNorm = norm(src)

/** Relative source paths whose module the host owns (never bundle them). */
const SHARED_PATHS = [
  'api.ts', 'i18n.ts', 'theme.ts', 'uid.ts', 'live2d-runtime.ts',
  'stores/chat.ts', 'stores/life.ts', 'stores/providers.ts',
  'stores/settingsSections.ts', 'stores/wizard.ts', 'stores/uiPatches.ts',
  'composables/confirm.ts', 'composables/settingsMeta.ts', 'composables/wizard.ts',
  'components/AppSelect.vue', 'components/ConfirmDialog.vue',
  'components/MarkdownContent.vue', 'components/PinInput.vue',
  // Shell chrome shared with plugin pages. ModalShell in particular must be the
  // host's instance: it owns a Teleport to body and the focus-restore logic, and
  // a second copy would stack two scrims over one another.
  'components/ModalShell.vue', 'components/NavIcon.vue', 'components/PluginModuleHost.vue',
]
/** Normalised absolute paths, for case-insensitive membership tests. */
const SHARED = new Set(SHARED_PATHS.map((p) => norm(path.join(src, p))))

// Shared Vue components are imported as *default* exports in source, but the
// host bridge exposes them as *named* exports (its default export is the whole
// host runtime). A default import would therefore resolve to the runtime object
// and render nothing, so those imports are rewritten to named ones.
const SHARED_COMPONENT_EXPORTS = new Map<string, string>(
  // Key is normalised for lookup; the value keeps the component's real casing
  // (`AppSelect`), which the host bridge exports — lowercasing it here produced
  // imports like `{ appselect }` that the bridge does not provide.
  SHARED_PATHS.filter((p) => p.endsWith('.vue'))
    .map((p) => [norm(path.join(src, p)), path.basename(p, '.vue')]),
)

function resolveShared(absNoExt: string): string | undefined {
  const key = norm(absNoExt)
  return [key, `${key}.ts`, `${key}.vue`, `${key}/index.ts`]
    .find((candidate) => SHARED.has(candidate))
}

function rewriteSharedToHost() {
  return {
    name: 'rewrite-shared-to-host',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const cleanId = toPosix(id.split('?')[0])
      if (!norm(cleanId).startsWith(srcNorm)) return null
      const dir = path.dirname(cleanId)
      let changed = false
      // 1) default component imports: `import X from './AppSelect.vue'`
      //    → `import { AppSelect as X } from '@0kay/host'`
      code = code.replace(
        /(\bimport\s+)([A-Za-z_$][\w$]*)(\s+from\s*)(['"])([^'"]+)\4/g,
        (match, keyword: string, local: string, from: string, quote: string, spec: string) => {
          if (!spec.startsWith('.')) return match
          const abs = path.resolve(dir, spec)
          const shared = resolveShared(abs)
          const exported = shared ? SHARED_COMPONENT_EXPORTS.get(shared) : undefined
          if (!exported) return match
          changed = true
          const binding = exported === local ? `{ ${exported} }` : `{ ${exported} as ${local} }`
          return `${keyword}${binding}${from}${quote}@0kay/host${quote}`
        },
      )
      // 2) every other relative import of a shared module: rewrite the specifier.
      code = code.replace(
        /(\bfrom\s*|\bimport\s*)(['"])([^'"]+)\2/g,
        (match, keyword: string, quote: string, spec: string) => {
          if (!spec.startsWith('.')) return match
          const abs = path.resolve(dir, spec)
          if (!resolveShared(abs)) return match
          changed = true
          return `${keyword}${quote}@0kay/host${quote}`
        },
      )
      return changed ? { code, map: null } : null
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
        console: path.join(root, 'plugin/entries/console.js'),
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
