/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

declare module '*?raw' {
  const content: string
  export default content
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
  __0KAY_VUE__?: typeof import('vue')
  __0KAY_VUE_I18N__?: typeof import('vue-i18n')
  __0KAY_VUE_ROUTER__?: typeof import('vue-router')
  __0KAY_PINIA__?: typeof import('pinia')
  __0KAY_HOST_RUNTIME__?: Record<string, any>
  __0KAY_UI__?: {
    confirm(options: OkayConfirmOptions | string): Promise<boolean>
  }
  __0KAY_HOST__?: {
    getPersona(): Record<string, string>
    setPersona(patch: Record<string, string>): void
    saveConfig(): void
  }
}
