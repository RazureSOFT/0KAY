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

/**
 * Register Core .patch routes, then re-resolve the current URL if it was
 * swallowed by the catch-all before dynamic routes existed (full page load
 * race on /agents, /search, etc.).
 */
function applyPatchesAndRematch() {
  registerPatchRoutes()
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
