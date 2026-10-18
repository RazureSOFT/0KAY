// Ambient types for the plugin page contract.
//
// `@0kay/host` is resolved by the WebUI importmap to a bridge that re-exports
// the host runtime (window.__0KAY_VUE__ / __0KAY_PINIA__ / __0KAY_I18N__).
// It is `external` in vite.config.js, so nothing in the npm tree provides it —
// without this declaration every import from it is TS2307 and the plugin page
// cannot be typechecked at all.
//
// Typed loosely on purpose: a plugin page has no compile-time access to the
// host's real types, so pretending otherwise would only move the error.
declare module '@0kay/host' {
  export const host: any
  export const i18n: any
  export const router: any
  export const pinia: any
  export const useFocusTrap: any
  export const useHostFetch: any
  export const useHostStore: any
  // Shared by every plugin page: a short collision-free DOM id for aria wiring.
  // The optional prefix keeps ids readable and stable across re-renders.
  export const uid: (prefix?: string) => string
  // The host's own combobox, so a plugin dropdown matches the platform's
  // keyboard and ARIA behaviour instead of re-implementing it worse.
  export const AppSelect: any
  // Promise-returning confirm() used for destructive actions. The host's shape is
  // a composable returning { confirm }, not a bare function.
  export const useConfirm: () => { confirm: (options: Record<string, unknown>) => Promise<boolean> }
  const _default: Record<string, any>
  export default _default
}

// Vite resolves this to an inline worker at build time; TypeScript needs to be
// told it is a module factory.
declare module '*?worker&inline' {
  const workerConstructor: { new (): Worker }
  export default workerConstructor
}
declare module '*?worker' {
  const workerConstructor: { new (): Worker }
  export default workerConstructor
}

// The WebUI serves plugin pages as raw ESM; these globals exist at runtime and
// are provided by the host, not by this package.
declare const __0KAY_VUE__: any
declare const __0KAY_PINIA__: any
declare const __0KAY_HOST__: any