import { createApp } from 'vue'
import * as VueRuntime from 'vue'
import * as VueI18nRuntime from 'vue-i18n'
import * as VueRouterRuntime from 'vue-router'
import * as PiniaRuntime from 'pinia'
import { createPinia } from 'pinia'
import App from './App.vue'
import router, { registerPatchRoutes } from './router'
import { i18n } from './i18n'
import hostRuntime from './hostRuntime'
import { useWizardStore } from './stores/wizard'
import { useUIPatchesStore } from './stores/uiPatches'
import { applyThemePatches } from './theme'
import { createBootstrapManager } from './bootstrap'
import { buildLocaleBundles, fetchPluginStrings } from './pluginStrings'
import './styles/theme.css'
import './styles/settings.css'
import { installInteractionMotion } from './composables/motion'
import { useConfirm } from './composables/confirm'
import { installAuthGate, bootstrapSession } from './auth'

// Must run before the first Core request so an unauthenticated caller parks
// its request behind the login overlay instead of failing outright.
installAuthGate()

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
// Same idea for the other runtimes plugin pages need: they must resolve to the
// host's instances so injection keys (i18n/router/pinia) and stores are shared.
window.__0KAY_VUE_I18N__ = VueI18nRuntime
window.__0KAY_VUE_ROUTER__ = VueRouterRuntime
window.__0KAY_PINIA__ = PiniaRuntime
window.__0KAY_HOST_RUNTIME__ = hostRuntime

// Shared UI helpers so plugin ESM bundles use the platform's Material dialogs
// instead of the browser's native window.confirm / window.alert.
window.__0KAY_UI__ = {
  confirm: (options) => useConfirm().confirm(options),
}

// Host persona/config bridge: the LIFE companion page edits the same persona
// object the chat sends with each message, and persists it through the wizard
// store (the single source of truth). Without this a plugin page could only
// touch localStorage and the running app would not see the change.
window.__0KAY_HOST__ = {
  getPersona: () => ({ ...wizard.persona }),
  setPersona: (patch) => {
    wizard.setPersona(patch || {})
    wizard.saveToStorage()
  },
  saveConfig: () => wizard.saveToStorage(),
}

const ui = useUIPatchesStore(pinia)

const bootstrap = createBootstrapManager(url => import(/* @vite-ignore */ url))

/**
 * Import each patch-declared bootstrap module once. A module exposes
 * `install(context)` (or a default function) and may patch global behaviour,
 * e.g. an API compatibility layer.
 */
async function installBootstrapModules() {
  await bootstrap.sync(ui.bootstrapItems)
}

/**
 * Pull each UI-contributing plugin's string resources and merge them into
 * vue-i18n under a namespace equal to the plugin name, so a plugin's own UI can
 * address its copy as `t('<plugin>.<key>')`.
 *
 * Names already merged are skipped: this runs on every patch poll, and
 * re-merging would reset a locale the user had switched away from and re-issue
 * requests for plugins that ship no strings. A plugin installed at runtime is
 * picked up on the next poll because its name appears in the patch ops.
 */
const mergedPluginStrings = new Set<string>()
async function loadPluginStrings() {
  const pending = ui.pluginNames.filter((name) => !mergedPluginStrings.has(name))
  if (!pending.length) return
  const entries = await Promise.all(
    pending.map(async (name) => ({ name, response: await fetchPluginStrings(name) })),
  )
  for (const [locale, namespaces] of Object.entries(buildLocaleBundles(entries))) {
    for (const [namespace, messages] of Object.entries(namespaces)) {
      i18n.global.mergeLocaleMessage(locale, { [namespace]: messages })
    }
  }
  // Marked regardless of whether strings came back: a plugin that ships none
  // must not be re-requested on every poll.
  for (const name of pending) mergedPluginStrings.add(name)
}

/**
 * Register Core .patch routes, load bootstrap modules, then re-resolve the
 * current URL if it was swallowed by the catch-all before dynamic routes
 * existed (full page load race on /agents, /search, etc.).
 */
function applyPatchesAndRematch() {
  registerPatchRoutes()
  void installBootstrapModules()
  void loadPluginStrings()
  applyThemePatches(ui.themePatches)
  const cur = router.currentRoute.value
  if (cur.matched.some((r) => r.name === 'catch-all')) {
    const path = cur.fullPath
    void router.replace(path).catch(() => {})
  }
}

ui.fetchPatches().then(applyPatchesAndRematch).catch(() => {
  registerPatchRoutes()
  void installBootstrapModules()
  void loadPluginStrings()
  applyThemePatches(ui.themePatches)
})

// Re-register when polling refreshes ops (new patch files at runtime).
ui.$subscribe(() => {
  if (ui.loaded) applyPatchesAndRematch()
}, { detached: true })

app.mount('#app')
void bootstrapSession()
const disposeMotion = installInteractionMotion()
if (import.meta.hot) import.meta.hot.dispose(disposeMotion)
