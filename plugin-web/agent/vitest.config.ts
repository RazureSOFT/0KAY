import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// The plugin pages are Vue SFCs with no other entry point, so the test setup is
// just the Vue plugin plus a DOM. `build.mjs` stays the build pipeline; this is
// only for tests.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // The page imports the host bridge by bare specifier; the WebUI resolves it
      // through an import map at runtime, so tests need a stand-in.
      '@0kay/host': new URL('./src/test/host-stub.ts', import.meta.url).pathname,
      /* The dev demos reuse the host's shared components (MarkdownContent for the task
         report). The dev server resolves this alias; tests need it too, or the import
         fails before a single assertion runs. */
      '@webui': new URL('../../webui/src', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'happy-dom',
    /* `dev/` is the layout-demo directory: not shipped, but the demos exercise the same
       components the page will use, and their tests guard behaviours that only show up
       when clicked through (ten task tabs, panel geometry). Run them with the rest. */
    include: ['src/**/*.test.ts', 'dev/**/*.test.ts'],
    globals: false,
  },
})
