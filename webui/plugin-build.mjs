/**
 * Build the platform plugin pages one entry at a time.
 *
 * `vite.plugin.config.ts` is a single-entry config now: with one entry rollup can
 * inline every module (`inlineDynamicImports`), so each page ships as one
 * self-contained file. The multi-entry build it replaced split shared code into
 * `assets/<name>-<hash>.js`, and since `core/data/plugin-ui/webui/*.js` are
 * tracked but `assets/` is git-ignored, a fresh clone got entries pointing at
 * chunks that did not exist — the whole WebUI failed with "Failed to fetch
 * dynamically imported module".
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(root, '../core/data/plugin-ui/webui')
const ENTRIES = ['chat', 'plugins', 'settings', 'usage', 'console']

for (const [index, name] of ENTRIES.entries()) {
  process.env.PLUGIN_ENTRY = name
  process.env.PLUGIN_EMPTY = index === 0 ? '1' : '0'
  await build({ root, configFile: path.join(root, 'vite.plugin.config.ts'), logLevel: 'warn' })
  console.log(`built ${name}.js`)
}

// Vite extracts the page's CSS into `assets/<name>-<hash>.css`. Those are exactly
// the files the old cleanup below deleted, which is why every plugin page rendered
// unstyled: the markup carried its scope hash (`data-v-…`) but no rules ever
// arrived. Inline each page's CSS into its own entry before cleaning up.
for (const name of ENTRIES) {
  const entry = path.join(outDir, `${name}.js`)
  if (!fs.existsSync(entry)) continue
  const assetsDir = path.join(outDir, 'assets')
  if (!fs.existsSync(assetsDir)) continue
  const sheets = fs.readdirSync(assetsDir).filter((f) => f.startsWith(`${name}-`) && f.endsWith('.css'))
  if (!sheets.length) continue
  const css = sheets.map((f) => fs.readFileSync(path.join(assetsDir, f), 'utf8')).join(String.fromCharCode(10))
  const inject = `
;(() => { if (typeof document === 'undefined') return; const s = document.createElement('style'); s.setAttribute('data-plugin-page', ${JSON.stringify(name)}); s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s) })()
`
  fs.appendFileSync(entry, inject)
  for (const f of sheets) fs.rmSync(path.join(assetsDir, f), { force: true })
  console.log(`inlined ${sheets.length} stylesheet(s) into ${name}.js`)
}

// Chunks from an older multi-entry build are unreachable now; leaving them would
// just be dead weight that makes `git status` noisy.
const assets = path.join(outDir, 'assets')
if (fs.existsSync(assets)) {
  fs.rmSync(assets, { recursive: true, force: true })
  console.log('removed stale assets/')
}
