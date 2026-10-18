/**
 * Build the LIFE plugin pages as **self-contained** ESM bundles.
 *
 * Why one build per entry instead of the usual multi-entry lib build:
 * `core/data/plugin-ui/life/*.js` are tracked by git, but their `assets/`
 * chunks are git-ignored build output (see .gitignore). A multi-entry build
 * splits shared modules (kit, ConfirmDialog, AdapterSettingsPage) into
 * `assets/<name>-<hash>.js` and makes every entry `import` them — so a clone, a
 * `git checkout`, or any build that only rewrites the entries leaves four files
 * pointing at chunks that do not exist, and every page dies with
 * "Failed to fetch dynamically imported module" (2026-10-18: 记忆 page).
 *
 * With a single entry, `inlineDynamicImports` puts everything in the one file,
 * which is exactly the invariant the repository relies on: one file per page,
 * no sidecar chunks, nothing to go stale.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(root, '../../core/data/plugin-ui/life')
const ENTRIES = ['memory', 'companion', 'adapters', 'social']

/** Inline extracted CSS into the entry (plugin ESM has no HTML to link from). */
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
 * Copy the plugin's string resources next to the bundles.
 *
 * Core serves them from CORE_DATA_DIR/plugin-ui/life/strings, the same place the
 * ESM bundles land, and the WebUI fetches them from /api/plugins/life/strings.
 * This has to run *after* the bundles are written: the first build empties the
 * output directory, so anything placed there earlier would be deleted. The
 * source stays in plugin-web/life/strings and is tracked.
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

for (const [index, name] of ENTRIES.entries()) {
  await build({
    root,
    configFile: false,
    logLevel: 'warn',
    plugins: [vue(), injectCss('life-plugin-style'), copyStrings()],
    build: {
      outDir,
      // Only the first build may wipe the directory; the others would delete it.
      emptyOutDir: index === 0,
      target: 'es2020',
      lib: {
        entry: path.join(root, `${name}.js`),
        formats: ['es'],
        fileName: () => `${name}.js`,
      },
      rollupOptions: {
        // The WebUI import map owns these; a second copy of vue would break
        // reactivity across the plugin boundary.
        external: ['vue', 'vue-router', '@0kay/host'],
        output: { entryFileNames: `${name}.js`, inlineDynamicImports: true },
      },
    },
  })
  console.log(`built ${name}.js`)
}

// A leftover assets/ directory would be stale chunk files from an older
// multi-entry build; nothing imports them any more.
const assets = path.join(outDir, 'assets')
if (fs.existsSync(assets)) {
  fs.rmSync(assets, { recursive: true, force: true })
  console.log('removed stale assets/')
}
