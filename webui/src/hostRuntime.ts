import { ApiError, SSEError, readApiResponse, apiGet, apiSend, apiPost, apiPut, apiPatch, apiDelete, streamSSE, readSSE } from './api'
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
import ModalShell from './components/ModalShell.vue'
import NavIcon from './components/NavIcon.vue'
import PluginModuleHost from './components/PluginModuleHost.vue'

const hostRuntime = {
  ApiError, SSEError, readApiResponse, apiGet, apiSend, apiPost, apiPut, apiPatch, apiDelete,
  streamSSE, readSSE,
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
  ModalShell, NavIcon, PluginModuleHost,
}

export default hostRuntime
