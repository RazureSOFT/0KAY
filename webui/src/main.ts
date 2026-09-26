import { createApp } from 'vue'
import * as VueRuntime from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router, { registerPatchRoutes } from './router'
import { i18n } from './i18n'
import { useWizardStore } from './stores/wizard'
import { useUIPatchesStore } from './stores/uiPatches'
import './styles/theme.css'
import './styles/settings.css'
import { installInteractionMotion } from './composables/motion'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

const wizard = useWizardStore(pinia)
wizard.loadFromStorage()

// Shared Vue runtime for plugin ESM modules (self-contained plugins that
// avoid a second vue copy). Contract: plugin pages may use bare `import from
// 'vue'` (importmap → public/vendor/vue-bridge.js) or window.__0KAY_VUE__;
// host router/pinia/i18n stay private.
window.__0KAY_VUE__ = VueRuntime

const ui = useUIPatchesStore(pinia)

/** Bootstrap modules already imported (by URL) so reloads don't re-run them. */
const loadedBootstrap = new Set<string>()

/**
 * Import each patch-declared bootstrap module once. A module exposes
 * `install(context)` (or a default function) and may patch global behaviour,
 * e.g. an API compatibility layer.
 */
async function installBootstrapModules() {
  for (const item of ui.bootstrapItems) {
    const url = item.module
    if (!url || loadedBootstrap.has(url)) continue
    loadedBootstrap.add(url)
    try {
      const mod: any = await import(/* @vite-ignore */ url)
      const install = mod?.install || mod?.default
      if (typeof install === 'function') install({ plugin: item.plugin, id: item.id })
    } catch (e) {
      loadedBootstrap.delete(url)
      console.warn('[0kay] bootstrap module failed:', url, e)
    }
  }
}

/**
 * Register Core .patch routes, load bootstrap modules, then re-resolve the
 * current URL if it was swallowed by the catch-all before dynamic routes
 * existed (full page load race on /agents, /search, etc.).
 */
function applyPatchesAndRematch() {
  registerPatchRoutes()
  void installBootstrapModules()
  const cur = router.currentRoute.value
  if (cur.matched.some((r) => r.name === 'catch-all')) {
    const path = cur.fullPath
    void router.replace(path).catch(() => {})
  }
}

ui.fetchPatches().then(applyPatchesAndRematch).catch(() => {
  registerPatchRoutes()
})

// Re-register when polling refreshes ops (new patch files at runtime).
ui.$subscribe(() => {
  if (ui.loaded) applyPatchesAndRematch()
}, { detached: true })

app.mount('#app')
const disposeMotion = installInteractionMotion()
if (import.meta.hot) import.meta.hot.dispose(disposeMotion)
