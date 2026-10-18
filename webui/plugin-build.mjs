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

// Chunks from an older multi-entry build are unreachable now; leaving them would
// just be dead weight that makes `git status` noisy.
const assets = path.join(outDir, 'assets')
if (fs.existsSync(assets)) {
  fs.rmSync(assets, { recursive: true, force: true })
  console.log('removed stale assets/')
}
