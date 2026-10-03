/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

type OkayConfirmOptions = {
  title?: string
  message: string
  icon?: string
  description?: string
  readme?: string
  details?: string[]
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

interface Window {
  PIXI?: any
  /** Host Vue runtime shared with plugin ESM pages (see public/vendor/vue-bridge.js). */
  __0KAY_VUE__?: typeof import('vue')
  /** Host i18n / router / pinia runtimes shared with plugin ESM pages. */
  __0KAY_VUE_I18N__?: typeof import('vue-i18n')
  __0KAY_VUE_ROUTER__?: typeof import('vue-router')
  __0KAY_PINIA__?: typeof import('pinia')
  /** Host shared singletons (api/stores/i18n/components) for plugin pages. */
  __0KAY_HOST_RUNTIME__?: Record<string, any>
  /** Host UI helpers (native Material dialogs) shared with plugin ESM bundles. */
  __0KAY_UI__?: {
    confirm(options: OkayConfirmOptions | string): Promise<boolean>
  }
  /** Host persona/config bridge so a plugin page (e.g. LIFE companion) can edit
   *  the same persona the chat sends, and persist it via the wizard store. */
  __0KAY_HOST__?: {
    getPersona(): Record<string, string>
    setPersona(patch: Record<string, string>): void
    saveConfig(): void
  }
}
