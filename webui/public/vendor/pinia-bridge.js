// Host pinia bridge for plugin bare `import { defineStore } from "pinia"`.
// Resolved via index.html importmap; re-exports the host copy injected as
// window.__0KAY_PINIA__ so any store a plugin defines lands on the SAME pinia.
const M = globalThis.__0KAY_PINIA__
if (!M) {
  throw new Error('[0kay] window.__0KAY_PINIA__ is not ready (load after WebUI main)')
}

export default M

export const {
  createPinia, defineStore, storeToRefs, setActivePinia, getActivePinia, mapStores,
  mapState, mapActions, mapWritableState,
} = M
