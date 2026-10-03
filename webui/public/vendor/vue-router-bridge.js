// Host vue-router bridge for plugin bare `import { useRouter } from "vue-router"`.
// Resolved via index.html importmap; re-exports the host copy injected as
// window.__0KAY_VUE_ROUTER__ so plugin pages share the app's router/injection keys.
const M = globalThis.__0KAY_VUE_ROUTER__
if (!M) {
  throw new Error('[0kay] window.__0KAY_VUE_ROUTER__ is not ready (load after WebUI main)')
}

export default M

export const {
  useRouter, useRoute, createRouter, createWebHistory, createWebHashHistory,
  RouterLink, RouterView, onBeforeRouteLeave, onBeforeRouteUpdate,
  START_LOCATION, isNavigationFailure, NavigationFailureType,
} = M
