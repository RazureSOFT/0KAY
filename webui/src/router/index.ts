import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent, h, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUIPatchesStore } from '../stores/uiPatches'
import PatchPage from '../pages/PatchPage.vue'

/**
 * Resolves route.meta.module at render time so hot patch updates can change
 * the ESM URL without baking it into a stale addRoute closure.
 *
 * Every page in the app is now provided by a plugin bundle (served by Core
 * from plugin-ui/<name>/ and imported over the importmap bridge): the shell
 * ships no page components beyond the iframe fallback.
 */
const PluginModuleHost = defineComponent({
  name: 'PluginModuleHost',
  setup() {
    const route = useRoute()
    const comp = shallowRef<any>(null)
    const error = shallowRef('')

    watch(
      () => String(route.meta.module || ''),
      async (url) => {
        if (!url) {
          comp.value = null
          error.value = ''
          return
        }
        try {
          const mod: any = await import(/* @vite-ignore */ url)
          comp.value = mod?.default || mod
          error.value = ''
        } catch (e: any) {
          comp.value = null
          error.value = e?.message || String(e)
        }
      },
      { immediate: true },
    )

    return () => {
      if (comp.value) return h(comp.value)
      if (error.value) {
        // Fall back to PatchPage (iframe via meta.src when present).
        return h(PatchPage)
      }
      return h('div', { style: 'padding:24px;color:var(--md-on-surface-variant)' }, 'Loading plugin module…')
    }
  },
})

/** name -> cache key (path|module|component|src) to detect patch updates. */
const installedPatchRoutes = new Map<string, string>()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // No builtin pages: chat / plugins / settings / usage and plugin pages
    // (memory, companion, agents, …) are all registered by *.patch files at
    // runtime.  Until they load, the catch-all hosts an iframe fallback.
    { path: '/:pathMatch(.*)*', name: 'catch-all', component: PatchPage },
  ],
})

/**
 * Register extra routes from Core-served .patch files at runtime.
 * Called from main.ts after the uiPatches store has fetched ops.
 *
 * A route item with `module` resolves to a plugin-native ESM page; anything
 * else falls back to PatchPage (iframe via `src`).
 */
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

    const exists = router.getRoutes().some((r) => r.path === p.path || r.name === name)
    if (exists) {
      router.removeRoute(name)
      // Also remove any foreign route registered on the same path.
      for (const r of [...router.getRoutes()]) {
        if (r.path === p.path && r.name && r.name !== 'catch-all') router.removeRoute(r.name)
      }
      installedPatchRoutes.delete(name)
    }

    const component = p.module ? PluginModuleHost : PatchPage
    router.addRoute({
      path: p.path,
      name,
      component,
      meta: {
        titleKey: p.titleKey,
        title: p.title,
        patchId: p.id,
        src: p.src,
        module: p.module,
        plugin: p.plugin,
        patchComponent: p.component,
      },
    })
    installedPatchRoutes.set(name, key)
  }
}

export default router
