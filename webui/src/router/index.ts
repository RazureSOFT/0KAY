import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUIPatchesStore } from '../stores/uiPatches'
import PluginModuleHost from '../components/PluginModuleHost.vue'
import PatchPage from '../pages/PatchPage.vue'

/**
 * The shell ships no page components. Every route — chat, plugins, settings,
 * usage, console and all plugin pages — is declared by a Core-served *.patch file
 * and registered at runtime, so the app can gain a page without a rebuild.
 *
 * The catch-all exists only to hold the gap between first paint and the patch
 * fetch landing; main.ts re-resolves the URL once routes exist.
 */

/** name -> cache key, so an unchanged patch is not re-registered. */
const installedPatchRoutes = new Map<string, string>()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/:pathMatch(.*)*', name: 'catch-all', component: PatchPage },
  ],
})

/**
 * Register (and prune) the routes declared by patch files.
 *
 * Called on first load and again whenever the poller sees the op set change, so
 * it must stay idempotent and free of side effects.
 */
export function registerPatchRoutes() {
  const ui = useUIPatchesStore()
  const desired = new Set(ui.routerPatches.map((p) => p.name || p.id).filter(Boolean))

  // Drop routes whose patch went away (plugin disabled, file deleted).
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

    // Two patches can claim the same path; whoever registers later takes over
    // explicitly, and any other route on that path is removed so a stale
    // registration cannot keep winning. (Today /usage is platform.patch's
    // alone — mocr.patch's duplicate router op was deleted — but the guard
    // stays for the next collision.)
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
      // A patch with no `module` can only render as an iframe via `src`; without
      // either there is nothing to show, and PatchPage says so.
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

/** Route names currently provided by patches. Exposed for the console/diagnostics. */
export function patchRouteNames(): string[] {
  return [...installedPatchRoutes.keys()]
}

export default router
