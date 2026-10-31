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
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
    globals: false,
  },
})
