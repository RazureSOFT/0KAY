/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  PIXI?: any
  /** Host Vue runtime shared with plugin ESM pages (see public/vendor/vue-bridge.js). */
  __0KAY_VUE__?: typeof import('vue')
}
