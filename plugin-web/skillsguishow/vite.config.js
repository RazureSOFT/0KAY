import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(root, '../../core/data/plugin-ui/skillsguishow')

// Scheme C: emit ESM into CORE_DATA_DIR/plugin-ui/skillsguishow/.
// `vue` and `@0kay/host` stay external — the WebUI importmap maps both to the
// host bridge, so the plugin shares the shell's i18n composer.

/**
 * Copy the plugin's string resources next to its bundles (same mechanism as
 * the minecraft plugin): Core serves them from
 * CORE_DATA_DIR/plugin-ui/skillsguishow/strings at
 * GET /api/plugins/skillsguishow/strings, and the WebUI merges them into
 * vue-i18n under the `skillsguishow` namespace. Runs in closeBundle because
 * `emptyOutDir: true` wipes the output directory at the start of every build.
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
  plugins: [copyStrings()],
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
