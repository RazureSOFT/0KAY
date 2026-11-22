import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Dev-only server for the MD3 kitchen sink.
 *
 * The plugin's own build (`vite.config.js`) emits a single ESM entry for Core to
 * serve; it has no HTML and no dev server, because the page is always loaded by the
 * host WebUI. That makes it impossible to look at a component in isolation, which
 * matters here: the components are not wired into a page yet, so they are excluded
 * from the bundle by tree-shaking, and unit tests can only assert attributes.
 *
 * This config exists solely to serve `dev/kit.html`. It is not referenced by
 * `npm run build`, and nothing in it ships.
 */
const here = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: path.join(here, 'dev'),
  plugins: [vue()],
  resolve: {
    alias: {
      /* The kit needs the host's token stylesheets. Those live two levels up, and a
         relative import breaks once `root` is `dev/` — Vite resolves module paths
         against the root, not the importing file. An explicit alias states the
         dependency instead of depending on where the server was started. */
      '@tokens': path.resolve(here, '../../webui/src/styles'),
      /* The host's shared components (MarkdownContent and whatever else the demo wants to
         reuse rather than re-implement). Same reason as @tokens: `root` is dev/, so a
         relative path would resolve against the wrong directory. */
      '@webui': path.resolve(here, '../../webui/src'),
      /* The host bridge. In the real page the WebUI import map provides it; standalone
         pages (the kit, the layout demos) have no host, so they get the same test double
         vitest uses. Without this, any component that imports `@0kay/host` fails to
         resolve and its dev server request 500s — which is why ToolStepCard could not be
         previewed here before. */
      '@0kay/host': path.resolve(here, 'src/test/host-stub.ts'),
    },
  },
  server: {
    port: 3020,
    strictPort: false,
    open: '/kit.html',
    // The kit imports from outside this package; allow that explicitly rather than
    // silently serving from a parent directory.
    fs: {
      allow: [path.resolve(here, '../..')],
    },
  },
})