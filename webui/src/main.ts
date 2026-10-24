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

installAuthGate()

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

const wizard = useWizardStore(pinia)
wizard.loadFromStorage()

window.__0KAY_VUE__ = VueRuntime
window.__0KAY_VUE_I18N__ = VueI18nRuntime
window.__0KAY_VUE_ROUTER__ = VueRouterRuntime
window.__0KAY_PINIA__ = PiniaRuntime
window.__0KAY_HOST_RUNTIME__ = hostRuntime

window.__0KAY_UI__ = {
  confirm: (options) => useConfirm().confirm(options),
}

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

async function installBootstrapModules() {
  await bootstrap.sync(ui.bootstrapItems)
}

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
  for (const name of pending) mergedPluginStrings.add(name)
}

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

ui.$subscribe(() => {
  if (ui.loaded) applyPatchesAndRematch()
}, { detached: true })

app.mount('#app')

const splash = document.getElementById('splash')
if (splash) {
  splash.classList.add('splash--done')
  window.setTimeout(() => splash.remove(), 500)
}

void bootstrapSession()
const disposeMotion = installInteractionMotion()
if (import.meta.hot) import.meta.hot.dispose(disposeMotion)
