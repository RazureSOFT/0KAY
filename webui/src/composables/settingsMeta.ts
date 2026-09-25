import { useI18n } from 'vue-i18n'
import { useUIPatchesStore } from '../stores/uiPatches'
import { useSettingsSectionsStore } from '../stores/settingsSections'

/** Shared settings tab/section metadata helpers (used by SettingsPage and panels). */
export function useSettingsMeta() {
  const { t } = useI18n()
  const uiPatches = useUIPatchesStore()
  const sectionsStore = useSettingsSectionsStore()

  function tabMeta(id: string) {
    return uiPatches.settingsTab(id)
  }

  function isBuiltinTab(id: string): boolean {
    return ['general', 'provider', 'persona', 'live2d', 'permissions', 'danger', 'about'].includes(id)
  }

  function pluginSection(id: string) {
    return sectionsStore.sections.find(s => s.id === id)
  }

  function isPluginSection(id: string): boolean {
    if (isBuiltinTab(id)) return false
    if (uiPatches.removedSettingsIds.includes(id)) return false
    if (tabMeta(id)) return false
    return !!pluginSection(id)
  }

  function tabLabel(id: string): string {
    const meta = tabMeta(id)
    if (meta?.labelKey) {
      const s = t(meta.labelKey)
      if (s && s !== meta.labelKey) return s
    }
    if (meta?.label) return meta.label
    if (isBuiltinTab(id)) return t(`settings.tabs.${id}`)
    const sec = pluginSection(id)
    if (sec?.label) return sec.label
    return id
  }

  function fieldLabel(meta: ReturnType<typeof tabMeta>, key: string, fallbackKey: string): string {
    const f = meta?.fields?.find(x => x.key === key)
    if (f?.labelKey) {
      const s = t(f.labelKey)
      if (s && s !== f.labelKey) return s
    }
    if (f?.label) return f.label
    return t(fallbackKey)
  }

  function fieldHelp(meta: ReturnType<typeof tabMeta>, key: string, fallbackKey: string): string {
    const f = meta?.fields?.find(x => x.key === key)
    if (f?.helpKey) {
      const s = t(f.helpKey)
      if (s && s !== f.helpKey) return s
    }
    if (f?.help) return f.help
    return t(fallbackKey)
  }

  return { tabMeta, isBuiltinTab, pluginSection, isPluginSection, tabLabel, fieldLabel, fieldHelp }
}
