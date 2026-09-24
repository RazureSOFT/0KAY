import { createRouter, createWebHistory } from 'vue-router'
import { useUIPatchesStore } from '../stores/uiPatches'
import ChatPage from '../pages/ChatPage.vue'
import AgentsPage from '../pages/AgentsPage.vue'
import PluginsPage from '../pages/PluginsPage.vue'
import UsagePage from '../pages/UsagePage.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import PatchPage from '../pages/PatchPage.vue'
import MemoryPage from '../pages/MemoryPage.vue'
import CompanionPage from '../pages/CompanionPage.vue'

/** Builtin page components that patches may reference by name. */
const PATCH_COMPONENTS: Record<string, any> = {
  agents: AgentsPage,
  plugins: PluginsPage,
  usage: UsagePage,
  settings: SettingsPage,
  chat: ChatPage,
  memory: MemoryPage,
  companion: CompanionPage,
}

const installedPatchRoutes = new Set<string>()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'chat', component: ChatPage, meta: { titleKey: 'nav.chat' } },
    // /agents is registered at runtime by agent.patch (agent plugin uiPatches).
    { path: '/plugins', name: 'plugins', component: PluginsPage, meta: { titleKey: 'nav.plugins' } },
    { path: '/usage', name: 'usage', component: UsagePage, meta: { titleKey: 'nav.usage' } },
    { path: '/settings', name: 'settings', component: SettingsPage, meta: { titleKey: 'nav.settings' } },
    { path: '/:pathMatch(.*)*', name: 'catch-all', component: PatchPage },
  ],
})

/**
 * Register extra routes from Core-served .patch files at runtime.
 * Called from main.ts after the uiPatches store has fetched ops.
 * `component: "agents"` maps to the AgentsPage bundled with WebUI.
 */
export function registerPatchRoutes() {
  const ui = useUIPatchesStore()
  const desired = new Set(ui.routerPatches.map((p) => p.name || p.id).filter(Boolean))
  for (const name of installedPatchRoutes) {
    if (!desired.has(name)) {
      router.removeRoute(name)
      installedPatchRoutes.delete(name)
    }
  }
  for (const p of ui.routerPatches) {
    if (!p.path) continue
    const exists = router.getRoutes().some((r) => r.path === p.path || r.name === p.name)
    if (exists) continue
    const mapped = p.component ? PATCH_COMPONENTS[p.component] : undefined
    router.addRoute({
      path: p.path,
      name: p.name || p.id,
      component: mapped || PatchPage,
      meta: {
        titleKey: p.titleKey,
        title: p.title,
        patchId: p.id,
        src: p.src,
        patchComponent: p.component,
      },
    })
    installedPatchRoutes.add(String(p.name || p.id))
  }
}

export default router
