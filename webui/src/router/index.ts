import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUIPatchesStore } from '../stores/uiPatches'
import PluginModuleHost from '../components/PluginModuleHost.vue'
import PatchPage from '../pages/PatchPage.vue'

const installedPatchRoutes = new Map<string, string>()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/:pathMatch(.*)*', name: 'catch-all', component: PatchPage },
  ],
})

export function registerPatchRoutes() {
  const ui = useUIPatchesStore()
  const desired = new Set(ui.routerPatches.map((p) => p.name || p.id).filter(Boolean))

  for (const [name] of [...installedPatchRoutes]) {
    if (!desired.has(name)) {
      router.removeRoute(name)
      installedPatchRoutes.delete(name)
    }
  }

  for (const p of ui.routerPatches) {
    if (!p.path) continue
    const name = String(p.name || p.id)
    const key = [p.path, p.module || '', p.component || '', p.src || ''].join('|')
    if (installedPatchRoutes.get(name) === key) continue

    if (router.getRoutes().some((r) => r.path === p.path || r.name === name)) {
      router.removeRoute(name)
      for (const r of [...router.getRoutes()]) {
        if (r.path === p.path && r.name && r.name !== 'catch-all') router.removeRoute(r.name)
      }
      installedPatchRoutes.delete(name)
    }

    const record: RouteRecordRaw = {
      path: p.path,
      name,
      component: p.module ? PluginModuleHost : PatchPage,
      meta: {
        titleKey: p.titleKey,
        title: p.title,
        patchId: p.id,
        src: p.src,
        module: p.module,
        plugin: p.plugin,
        patchComponent: p.component,
      },
    }
    router.addRoute(record)
    installedPatchRoutes.set(name, key)
  }
}

export function patchRouteNames(): string[] {
  return [...installedPatchRoutes.keys()]
}

export default router
