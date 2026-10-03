/**
 * Host runtime surface shared with plugin ESM bundles.
 *
 * The WebUI shell owns the singleton state (pinia stores, api client, i18n,
 * theme, shared dialogs).  Pages now live in a plugin bundle, so they reach
 * that state through this single namespace, exposed as
 * `window.__0KAY_HOST_RUNTIME__` and re-exported by
 * `public/vendor/0kay-host-bridge.js` (mapped to the bare specifier
 * `@0kay/host` via the index.html importmap).
 *
 * Keeping it as one object means the plugin build only ever externalizes
 * `@0kay/host`, and there is exactly one instance of every store.
 */
import { ApiError, readApiResponse, apiGet, apiSend, apiPost, apiPut, apiPatch, apiDelete } from './api'
import { LOCALES, i18n, setLanguage, getLanguage } from './i18n'
import { uid } from './uid'
import {
  THEME_STYLE_PREFIX,
  THEME_LINK_PREFIX,
  resolveTokenSets,
  buildThemeCSS,
  sortThemePatches,
  applyThemePatches,
  resetThemePatches,
} from './theme'
import { live2dRuntimeReady } from './live2d-runtime'
import { useChatStore } from './stores/chat'
import { useLifeStore } from './stores/life'
import { useProvidersStore } from './stores/providers'
import { useSettingsSectionsStore } from './stores/settingsSections'
import { useWizardStore } from './stores/wizard'
import { useUIPatchesStore, BUILTIN_NAV, BUILTIN_STATUS, BUILTIN_SETTINGS, BUILTIN_CHAT } from './stores/uiPatches'
import { useConfirm } from './composables/confirm'
import { useSettingsMeta } from './composables/settingsMeta'
import { DEFAULT_LIVE2D_MODELS, DEFAULT_LIVE2D_MODEL_URL, PROVIDERS, WIZARD_STEPS } from './composables/wizard'
import AppSelect from './components/AppSelect.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import MarkdownContent from './components/MarkdownContent.vue'
import PinInput from './components/PinInput.vue'

const hostRuntime = {
  // api
  ApiError, readApiResponse, apiGet, apiSend, apiPost, apiPut, apiPatch, apiDelete,
  // i18n
  LOCALES, i18n, setLanguage, getLanguage,
  // misc
  uid,
  THEME_STYLE_PREFIX, THEME_LINK_PREFIX, resolveTokenSets, buildThemeCSS,
  sortThemePatches, applyThemePatches, resetThemePatches,
  live2dRuntimeReady,
  // stores
  useChatStore, useLifeStore, useProvidersStore, useSettingsSectionsStore,
  useWizardStore, useUIPatchesStore,
  BUILTIN_NAV, BUILTIN_STATUS, BUILTIN_SETTINGS, BUILTIN_CHAT,
  // composables
  useConfirm, useSettingsMeta,
  DEFAULT_LIVE2D_MODELS, DEFAULT_LIVE2D_MODEL_URL, PROVIDERS, WIZARD_STEPS,
  // shared components
  AppSelect, ConfirmDialog, MarkdownContent, PinInput,
}

export default hostRuntime
