/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

type OkayConfirmOptions = {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

interface Window {
  PIXI?: any
  /** Host Vue runtime shared with plugin ESM pages (see public/vendor/vue-bridge.js). */
  __0KAY_VUE__?: typeof import('vue')
  /** Host UI helpers (native Material dialogs) shared with plugin ESM bundles. */
  __0KAY_UI__?: {
    confirm(options: OkayConfirmOptions | string): Promise<boolean>
  }
}
