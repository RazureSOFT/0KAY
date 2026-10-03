// Host runtime bridge for plugin `import { ... } from "@0kay/host"`.
// Resolved via index.html importmap; re-exports the WebUI shell's shared
// singletons (api client, pinia stores, i18n helpers, shared components) so
// plugin pages never create a second copy of any state.
const H = globalThis.__0KAY_HOST_RUNTIME__
if (!H) {
  throw new Error('[0kay] window.__0KAY_HOST_RUNTIME__ is not ready (load after WebUI main)')
}

export default H

export const {
  ApiError, readApiResponse, apiGet, apiSend, apiPost, apiPut, apiPatch, apiDelete,
  LOCALES, i18n, setLanguage, getLanguage,
  uid,
  THEME_STYLE_PREFIX, THEME_LINK_PREFIX, resolveTokenSets, buildThemeCSS,
  sortThemePatches, applyThemePatches, resetThemePatches,
  live2dRuntimeReady,
  useChatStore, useLifeStore, useProvidersStore, useSettingsSectionsStore,
  useWizardStore, useUIPatchesStore,
  BUILTIN_NAV, BUILTIN_STATUS, BUILTIN_SETTINGS, BUILTIN_CHAT,
  useConfirm, useSettingsMeta,
  DEFAULT_LIVE2D_MODELS, DEFAULT_LIVE2D_MODEL_URL, PROVIDERS, WIZARD_STEPS,
  AppSelect, ConfirmDialog, MarkdownContent, PinInput,
} = H
