<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/wizard'
import { useProvidersStore } from '../stores/providers'
import { useSettingsSectionsStore } from '../stores/settingsSections'
import { useUIPatchesStore } from '../stores/uiPatches'
import { PROVIDERS, DEFAULT_LIVE2D_MODELS } from '../composables/wizard'
import type { ProviderConfig } from '../composables/wizard'
import { setLanguage, getLanguage } from '../i18n'
import Live2DStage from '../components/Live2DStage.vue'
import LifeSettingsPanel from '../components/LifeSettingsPanel.vue'
import PairingPanel from '../components/PairingPanel.vue'
import AppSelect from '../components/AppSelect.vue'
import { useConfirm } from '../composables/confirm'

const { t, locale } = useI18n()
const { confirm } = useConfirm()
const wizard = useWizardStore()
const provStore = useProvidersStore()
const sectionsStore = useSettingsSectionsStore()
const uiPatches = useUIPatchesStore()
const route = useRoute()
const router = useRouter()


// Tabs come from uiPatches (BUILTIN_SETTINGS + life.patch replace/insert/remove).
const tabs = computed<Array<{ id: string; icon: string }>>(() => uiPatches.settingsTabs.map(t => ({
  id: t.id,
  icon: t.icon || 'chip',
})))

/**
 * Plugin sections not already covered by settings tabs or removed by a patch.
 * life.patch removes plugin section id "life" so only the patch permissions pane remains.
 */
const pluginOnlyTabs = computed(() => {
  const seen = new Set(uiPatches.settingsTabs.map(t => t.id))
  const removed = new Set(uiPatches.removedSettingsIds)
  return sectionsStore.sections
    .filter(s => s.id !== 'permissions' && !seen.has(s.id) && !removed.has(s.id))
    .map(s => ({ id: s.id, icon: s.icon || 'lock' }))
})

const allTabs = computed(() => [...tabs.value, ...pluginOnlyTabs.value])

const activeTab = ref<string>('general')
const currentLang = ref(getLanguage())
const isLoading = ref(false)
const error = ref('')
const saved = ref(false)

// Life permissions (default OFF) — pane content, metadata from life.patch fields
const perms = ref({ screen_watch: false, computer_use: false, report_agent_host: '' })
const permMsg = ref('')
const uploadedModels = ref<{ id: string; label: string; url: string }[]>([])
const folderInput = ref<HTMLInputElement | null>(null)
const uploadMsg = ref('')

// Multi-provider editing state
const draftProviders = ref<ProviderConfig[]>([])
const draftDefaultProviderId = ref('')
const draftDefaultModel = ref('')
const providerMsg = ref('')
const editingProvider = ref<ProviderConfig | null>(null)
const fetchSource = ref<'api' | 'fallback' | ''>('')
const fetchError = ref('')
const fetchingProviderId = ref('')

/** Plugin section draft values */
const sectionDrafts = ref<Record<string, Record<string, unknown>>>({})
const sectionMsg = ref('')

/** About tab — platform version and update checks against GitHub releases. */
const aboutLoading = ref(false)
const updateResult = ref<{ current: string; latest?: string; has_update: boolean; url?: string } | null>(null)
const updateError = ref('')
const pluginsLoading = ref(false)
const pluginResults = ref<Array<{ name: string; version: string; latest?: string; has_update: boolean; repository?: string; error?: string }> | null>(null)
const pluginsError = ref('')

/** Parse an API response defensively: non-JSON bodies (404/HTML) become readable errors. */
async function readApiResponse(res: Response): Promise<any> {
  const text = await res.text()
  let data: any = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      if (res.status === 404) throw new Error(t('settings.about.unsupported'))
      throw new Error(text.trim().slice(0, 200) || `HTTP ${res.status}`)
    }
  }
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
  return data
}

async function checkUpdates() {
  aboutLoading.value = true
  updateError.value = ''
  try {
    updateResult.value = await readApiResponse(await fetch('/api/update/check'))
  } catch (error: unknown) {
    updateError.value = error instanceof Error ? error.message : String(error)
  } finally {
    aboutLoading.value = false
  }
}

async function checkPluginUpdates() {
  pluginsLoading.value = true
  pluginsError.value = ''
  try {
    const data = await readApiResponse(await fetch('/api/update/check-plugins'))
    pluginResults.value = data.plugins || []
  } catch (error: unknown) {
    pluginsError.value = error instanceof Error ? error.message : String(error)
  } finally {
    pluginsLoading.value = false
  }
}

function tabMeta(id: string) {
  return uiPatches.settingsTab(id)
}

function isBuiltinTab(id: string): boolean {
  return ['general', 'provider', 'persona', 'live2d', 'permissions', 'danger', 'about'].includes(id)
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

function pluginSection(id: string) {
  return sectionsStore.sections.find(s => s.id === id)
}

/** Coerce section draft values — API may send bool, "true"/"false", 0/1. */
function sectionBool(id: string, key: string): boolean {
  const v = sectionDrafts.value[id]?.[key]
  if (typeof v === 'boolean') return v
  if (v === 'true' || v === 1 || v === '1') return true
  return false
}

function providerMeta(id: string) {
  return PROVIDERS.find(p => p.id === id) || null
}

function providerLogo(p: ProviderConfig): string {
  return providerMeta(p.provider)?.logo || ''
}

function providerDisplayName(p: ProviderConfig): string {
  const meta = providerMeta(p.provider)
  if (meta?.name) return meta.name
  if (p.provider === 'custom') return t('providers.custom.name', 'Custom')
  return p.provider
}

function enabledCount(p: ProviderConfig): number {
  return p.models.filter(m => !isModelDisabled(p, m)).length
}

function isModelDisabled(p: ProviderConfig, m: string): boolean {
  return (p.disabled_models || []).includes(m)
}

function toggleModelEnabled(p: ProviderConfig, m: string) {
  const disabled = new Set(p.disabled_models || [])
  if (disabled.has(m)) disabled.delete(m)
  else disabled.add(m)
  p.disabled_models = [...disabled]
}

function loadSectionDraft(id: string) {
  const meta = tabMeta(id)
  if (meta?.fields?.length && !isBuiltinTab(id)) {
    void loadPatchFields(id)
    return
  }
  const sec = pluginSection(id)
  if (!sec) return
  const base: Record<string, unknown> = {}
  for (const f of sec.fields) {
    if (f.type === 'bool') base[f.key] = f.default_value === 'true' || f.default_value === '1'
    else if (f.type === 'number') base[f.key] = Number(f.default_value || 0)
    else base[f.key] = f.default_value || ''
  }
  const saved = sectionsStore.values[id] || {}
  const merged: Record<string, unknown> = { ...base }
  for (const f of sec.fields) {
    if (!(f.key in saved)) continue
    const v = saved[f.key]
    if (f.type === 'bool') {
      merged[f.key] = v === true || v === 'true' || v === 1 || v === '1'
    } else {
      merged[f.key] = v
    }
  }
  sectionDrafts.value = {
    ...sectionDrafts.value,
    [id]: merged,
  }
}

async function loadPatchFields(id: string) {
  const meta = tabMeta(id)
  if (!meta?.fields?.length) return
  const base: Record<string, unknown> = {}
  for (const f of meta.fields) {
    if (f.type === 'bool') base[f.key] = f.default_value === 'true' || f.default_value === '1'
    else if (f.type === 'number') base[f.key] = Number(f.default_value || 0)
    else base[f.key] = f.default_value || ''
  }
  if (meta.loadApi) {
    try {
      const res = await fetch(meta.loadApi)
      if (res.ok) {
        const data = await res.json()
        for (const f of meta.fields) {
          if (!(f.key in data)) continue
          const v = data[f.key]
          if (f.type === 'bool') base[f.key] = v === true || v === 'true' || v === 1 || v === '1'
          else base[f.key] = v
        }
      }
    } catch { /* offline */ }
  }
  sectionDrafts.value = { ...sectionDrafts.value, [id]: base }
}

async function savePatchFields(id: string) {
  const meta = tabMeta(id)
  sectionMsg.value = ''
  try {
    const body = sectionDrafts.value[id] || {}
    if (meta?.saveApi) {
      const res = await fetch(meta.saveApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(String(res.status))
    }
    sectionMsg.value = t('settings.saved')
    setTimeout(() => { sectionMsg.value = '' }, 1500)
  } catch {
    sectionMsg.value = t('settings.permFailed')
  }
}

async function saveSection(id: string) {
  sectionMsg.value = ''
  try {
    await sectionsStore.saveValues(id, sectionDrafts.value[id] || {})
    sectionMsg.value = t('settings.saved')
    setTimeout(() => { sectionMsg.value = '' }, 1500)
  } catch {
    sectionMsg.value = t('settings.permFailed')
  }
}

function startEditProvider(p: ProviderConfig) {
  editingProvider.value = { ...p, models: [...p.models], disabled_models: [...(p.disabled_models || [])] }
  fetchSource.value = ''
  fetchError.value = ''
  void autoFetchEditModels()
}

function startAddProvider() {
  editingProvider.value = {
    id: '',
    provider: 'openai',
    api_key: '',
    base_url: PROVIDERS.find(p => p.id === 'openai')?.baseUrl || '',
    models: [],
    disabled_models: [],
    default_model: '',
    enabled: true,
  }
}

/** Switching provider type updates base_url from PROVIDERS catalog. */
function onEditProviderType() {
  if (!editingProvider.value) return
  const p = PROVIDERS.find(x => x.id === editingProvider.value!.provider)
  if (p?.baseUrl) editingProvider.value.base_url = p.baseUrl
  void autoFetchEditModels()
}

/** Auto-fetch model list for the edit form when possible. */
async function autoFetchEditModels() {
  const ep = editingProvider.value
  if (!ep) return
  if (!ep.base_url) return
  // Prefer real key; fall back to fetch with empty key for public catalogs.
  isLoading.value = true
  fetchError.value = ''
  fetchSource.value = ''
  try {
    const res = await fetch('/api/models/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: ep.provider,
        base_url: ep.base_url,
        api_key: ep.api_key || '',
      }),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    const models: string[] = data.models || []
    fetchSource.value = data.source === 'api' ? 'api' : 'fallback'
    if (data.source === 'api' && data.error) fetchError.value = String(data.error)
    if (data.source === 'fallback' && data.error) fetchError.value = String(data.error)
    if (models.length) {
      ep.models = models
      if (!ep.default_model || !models.includes(ep.default_model)) {
        ep.default_model = models[0]
      }
      // Keep disabled_models aligned with fetched list
      ep.disabled_models = (ep.disabled_models || []).filter(m => models.includes(m))
    } else if (PROVIDERS.find(x => x.id === ep.provider)?.defaultModels?.length) {
      ep.models = [...(PROVIDERS.find(x => x.id === ep.provider)!.defaultModels)]
      if (!ep.default_model) ep.default_model = ep.models[0]
    }
  } catch (e: any) {
    fetchSource.value = 'fallback'
    fetchError.value = e?.message || 'fetch failed'
    const fallback = PROVIDERS.find(x => x.id === ep.provider)?.defaultModels
    if (fallback?.length && ep.models.length === 0) {
      ep.models = [...fallback]
      if (!ep.default_model) ep.default_model = ep.models[0]
    }
  } finally {
    isLoading.value = false
  }
}

/** Fetch models for a provider row (card action) without opening edit form. */
async function fetchModelsForRow(p: ProviderConfig) {
  if (!p.base_url) return
  fetchingProviderId.value = p.id
  fetchError.value = ''
  try {
    const res = await fetch('/api/models/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: p.provider,
        base_url: p.base_url,
        api_key: p.api_key || '',
      }),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    const models: string[] = data.models || []
    if (models.length) {
      p.models = models
      p.disabled_models = (p.disabled_models || []).filter(m => models.includes(m))
      if (!p.default_model || !models.includes(p.default_model)) {
        p.default_model = models[0]
      }
      // Persist immediately so Core catalog picks up real models
      try {
        await provStore.upsert({ ...p })
        draftProviders.value = [...provStore.providers]
        providerMsg.value = data.source === 'api'
          ? t('settings.modelsFetched')
          : t('settings.modelsFallback')
      } catch {
        providerMsg.value = t('settings.permFailed')
      }
      fetchSource.value = data.source === 'api' ? 'api' : 'fallback'
    }
    if (data.error) fetchError.value = String(data.error)
  } catch (e: any) {
    fetchError.value = e?.message || 'fetch failed'
    providerMsg.value = t('settings.permFailed')
  } finally {
    fetchingProviderId.value = ''
  }
}

/** Toggle a model on a provider card and persist. */
async function toggleModelOnCard(p: ProviderConfig, m: string) {
  toggleModelEnabled(p, m)
  try {
    await provStore.upsert({ ...p })
    draftProviders.value = [...provStore.providers]
  } catch {
    providerMsg.value = t('settings.permFailed')
  }
}

async function saveProviderEdit() {
  const p = editingProvider.value
  if (!p) return
  if (!p.id) {
    const norm = (u: string) => String(u || '').trim().replace(/\/+$/, '')
    const dup = draftProviders.value.find(x =>
      x.provider === p.provider && norm(x.base_url) === norm(p.base_url) && x.api_key === p.api_key)
    p.id = dup ? dup.id : p.provider + '_' + Date.now().toString(36)
  }
  if (!p.default_model && p.models.length) p.default_model = p.models[0]
  // Keep disabled_models aligned with current model list
  p.disabled_models = (p.disabled_models || []).filter(m => p.models.includes(m))
  try {
    await provStore.upsert(p)
    if (!draftDefaultProviderId.value) {
      draftDefaultProviderId.value = p.id
      draftDefaultModel.value = p.default_model
      await provStore.setDefaults(p.id, p.default_model)
    }
    draftProviders.value = [...provStore.providers]
    draftDefaultProviderId.value = provStore.defaultProviderId
    draftDefaultModel.value = provStore.defaultModel
    providerMsg.value = t('settings.saved')
    editingProvider.value = null
    setTimeout(() => { providerMsg.value = '' }, 1500)
  } catch {
    providerMsg.value = t('settings.permFailed')
  }
}

async function removeProvider(id: string) {
  try {
    await provStore.remove(id)
    draftProviders.value = [...provStore.providers]
    draftDefaultProviderId.value = provStore.defaultProviderId
    draftDefaultModel.value = provStore.defaultModel
  } catch {
    providerMsg.value = t('settings.permFailed')
  }
}

async function makeDefaultProvider(id: string, model: string) {
  try {
    await provStore.setDefaults(id, model)
    draftDefaultProviderId.value = provStore.defaultProviderId
    draftDefaultModel.value = provStore.defaultModel
    providerMsg.value = t('settings.saved')
    setTimeout(() => { providerMsg.value = '' }, 1500)
  } catch {
    providerMsg.value = t('settings.permFailed')
  }
}

function parseModelsInput(v: string): string[] {
  return v.split(',').map(m => m.trim()).filter(Boolean)
}

async function loadPermissions() {
  try {
    const res = await fetch('/api/life/permissions')
    if (res.ok) {
      const data = await res.json()
      perms.value = {
        screen_watch: !!data.screen_watch,
        computer_use: !!data.computer_use,
        report_agent_host: data.report_agent_host || '',
      }
    }
  } catch { /* offline */ }
}

async function savePermissions() {
  permMsg.value = ''
  try {
    const res = await fetch('/api/life/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perms.value),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    perms.value = {
      screen_watch: !!data.screen_watch,
      computer_use: !!data.computer_use,
      report_agent_host: data.report_agent_host || '',
    }
    permMsg.value = t('settings.permSaved')
  } catch {
    permMsg.value = t('settings.permFailed')
  }
}

async function loadUploadedModels() {
  try {
    const res = await fetch('/api/live2d')
    if (res.ok) {
      const data = await res.json()
      uploadedModels.value = data.models || []
    }
  } catch {
    uploadedModels.value = []
  }
}
async function deleteModel(model: {id:string;url:string;label:string}) {
  const ok = await confirm({
    title: t('settings.live2d'),
    message: `删除模型 ${model.label} 及所在模型文件夹中的全部资源？`,
    confirmLabel: locale.value === 'en' ? 'Delete' : '删除',
    danger: true,
  })
  if (!ok) return
  try {
    const response=await fetch(`/api/live2d?id=${encodeURIComponent(model.id)}`,{method:'DELETE'})
    if(!response.ok)throw new Error(await response.text())
    const body=await response.json();uploadedModels.value=body.models || []
    const folder=model.url.slice(0,model.url.indexOf('/', '/live2d/models/'.length)+1)
    if(wizard.live2d.modelUrl.startsWith(folder)) {wizard.live2d.modelUrl='';wizard.live2d.enabled=false;wizard.saveToStorage()}
    await saveLive2D();uploadMsg.value='模型已删除'
    window.dispatchEvent(new Event('live2d-models-changed'))
  }catch(error:any){uploadMsg.value=error.message}
}
async function saveLive2D() {
  wizard.saveToStorage()
  const response=await fetch('/api/settings/live2d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({values:{enabled:wizard.live2d.enabled,model_url:wizard.live2d.modelUrl}})})
  if(!response.ok)throw new Error(await response.text())
}

function openFolderPicker() {
  folderInput.value?.click()
}

async function onFolderSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return
  uploadMsg.value = ''
  try {
    const fd = new FormData()
    const paths: string[] = []
    for (const f of Array.from(files)) {
      const rel = (f as any).webkitRelativePath || f.name
      paths.push(rel)
      fd.append('files', f, f.name)
    }
    fd.append('paths', JSON.stringify(paths))
    const res = await fetch('/api/live2d', { method: 'POST', body: fd })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    uploadMsg.value = t('settings.uploadOk')
    if (data?.models) uploadedModels.value = data.models
    else await loadUploadedModels()
    if (data?.model_url) {
      wizard.live2d.modelUrl = data.model_url
      wizard.live2d.enabled = true
      wizard.saveToStorage()
      await saveLive2D()
      window.dispatchEvent(new Event('live2d-models-changed'))
    }
  } catch (error:any) {
    uploadMsg.value = `${t('settings.uploadFail')}：${error.message}`
  } finally {
    input.value = ''
  }
}

onMounted(async () => {
  wizard.loadFromStorage()
  currentLang.value = locale.value
  const q = route.query.tab as string | undefined
  if (q) activeTab.value = q
  if (q === 'about') {
    void checkUpdates()
    void checkPluginUpdates()
  }
  loadPermissions()
  loadUploadedModels()
  await provStore.fetchAll()
  draftProviders.value = [...provStore.providers]
  draftDefaultProviderId.value = provStore.defaultProviderId
  draftDefaultModel.value = provStore.defaultModel
  await sectionsStore.fetchSections()
  for (const sec of sectionsStore.sections) loadSectionDraft(sec.id)
})

function selectTab(id: string) {
  activeTab.value = id
  if (id === 'about' && !updateResult.value && !aboutLoading.value) {
    void checkUpdates()
    void checkPluginUpdates()
  }
  if (!isBuiltinTab(id)) loadSectionDraft(id)
  router.replace({ query: { tab: id } })
}

function save() {
  wizard.saveToStorage()
  if(activeTab.value==='live2d') void saveLive2D().catch(error=>{uploadMsg.value=error.message})
  saved.value = true
  setTimeout(() => { saved.value = false }, 1500)
}

function resetAll() {
  wizard.resetWizard()
  router.push('/')
}

function toggleLanguage() {
  const newLang = currentLang.value === 'en' ? 'zh' : 'en'
  currentLang.value = newLang
  locale.value = newLang
  setLanguage(newLang)
}
</script>

<template>
  <div class="settings-page">
    <header class="page-header">
      <div>
        <h1>{{ t('settings.title') }}</h1>
        <p class="subtitle">{{ t('settings.pageDesc') }}</p>
      </div>
      <button class="btn btn-primary" @click="save">
        <span v-if="saved">{{ t('settings.saved') }}</span>
        <span v-else>{{ t('settings.save') }}</span>
      </button>
    </header>

    <div class="settings-layout">
      <nav class="settings-nav" aria-label="settings categories">
        <button
          v-for="tab in allTabs"
          :key="tab.id"
          class="nav-item"
          :class="{ active: activeTab === tab.id }"
          @click="selectTab(tab.id)"
        >
          <span class="nav-indicator"></span>
          <span class="nav-icon" aria-hidden="true">
            <!-- globe -->
            <svg v-if="tab.icon === 'globe'" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" stroke="currentColor" stroke-width="2"/></svg>
            <!-- cloud -->
            <svg v-else-if="tab.icon === 'cloud'" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
            <!-- chip -->
            <svg v-else-if="tab.icon === 'chip'" width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- person -->
            <svg v-else-if="tab.icon === 'person'" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- avatar / live2d -->
            <svg v-else-if="tab.icon === 'avatar'" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="6" stroke="currentColor" stroke-width="2"/><path d="M5 21c1.5-3 4-4.5 7-4.5S17.5 18 19 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/></svg>
            <!-- warn -->
            <svg v-else-if="tab.icon === 'warn'" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4l9 16H3L12 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v4M12 17.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- info / about -->
            <svg v-else-if="tab.icon === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 11v5M12 7.5v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- lock / permissions -->
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </span>
          <span class="nav-label">{{ tabLabel(tab.id) }}</span>
        </button>
      </nav>

      <section class="settings-content">
        <!-- General -->
        <div v-if="activeTab === 'general'" class="content-card">
          <PairingPanel />
          <h2>{{ t('settings.tabs.general') }}</h2>
          <p class="card-desc">{{ t('settings.generalDesc') }}</p>

          <div class="field">
            <label>{{ t('settings.language') }}</label>
            <div class="segmented">
              <button
                class="seg"
                :class="{ active: currentLang === 'zh' }"
                @click="currentLang = 'zh'; locale = 'zh'; setLanguage('zh')"
              >中文</button>
              <button
                class="seg"
                :class="{ active: currentLang === 'en' }"
                @click="currentLang = 'en'; locale = 'en'; setLanguage('en')"
              >English</button>
            </div>
            <button class="btn btn-ghost lang-swap" @click="toggleLanguage">
              {{ t('settings.switchLang') }}
            </button>
          </div>
        </div>

        <!-- Provider (multi-provider) -->
        <div v-else-if="activeTab === 'provider'" class="content-card">
          <h2>{{ t('settings.tabs.provider') }}</h2>
          <p class="card-desc">{{ t('settings.providerDesc') }}</p>

          <div class="actions-row">
            <button class="btn btn-tonal" type="button" @click="startAddProvider">
              + {{ t('settings.addProvider') }}
            </button>
          </div>

          <div v-if="draftProviders.length" class="provider-list">
            <div
              v-for="p in draftProviders"
              :key="p.id"
              class="provider-list-item"
              :class="{ selected: draftDefaultProviderId === p.id }"
            >
              <div class="provider-card-head">
                <div class="provider-identity">
                  <img
                    v-if="providerLogo(p)"
                    :src="providerLogo(p)"
                    :alt="providerDisplayName(p)"
                    class="provider-logo"
                  />
                  <span v-else class="provider-logo-fallback" aria-hidden="true">
                    {{ providerMeta(p.provider)?.icon || '⚙️' }}
                  </span>
                  <div class="provider-identity-text">
                    <strong class="provider-title">{{ providerDisplayName(p) }}</strong>
                    <code class="provider-url">{{ p.base_url }}</code>
                  </div>
                </div>
                <div class="provider-badges">
                  <span v-if="draftDefaultProviderId === p.id" class="badge-default">
                    {{ t('settings.default') }}
                  </span>
                  <span class="badge-count">
                    {{ enabledCount(p) }}/{{ p.models.length }}
                  </span>
                </div>
              </div>

              <div class="provider-card-actions">
                <button class="btn btn-tonal" type="button" @click="startEditProvider(p)">
                  {{ t('settings.edit') }}
                </button>
                <button
                  class="btn btn-ghost"
                  type="button"
                  :disabled="fetchingProviderId === p.id"
                  @click="fetchModelsForRow(p)"
                >
                  {{ fetchingProviderId === p.id ? t('wizard.fetching') : t('settings.fetchModels') }}
                </button>
                <button
                  class="btn btn-ghost"
                  type="button"
                  @click="makeDefaultProvider(p.id, p.default_model || p.models[0] || '')"
                >
                  {{ t('settings.makeDefault') }}
                </button>
                <button class="btn btn-ghost danger-text" type="button" @click="removeProvider(p.id)">
                  {{ t('settings.remove') }}
                </button>
              </div>

              <div v-if="p.models.length" class="model-chip-card">
                <div class="model-chip-card-head">
                  <span class="model-chip-card-title">{{ t('settings.modelToggles') }}</span>
                  <span class="model-chip-card-hint">{{ t('settings.modelToggleHint') }}</span>
                </div>
                <div class="model-toggle-list">
                  <label
                    v-for="m in p.models"
                    :key="m"
                    class="model-toggle-row"
                    :class="{ off: isModelDisabled(p, m) }"
                  >
                    <span class="model-toggle-name">{{ m }}</span>
                    <span
                      v-if="m === p.default_model"
                      class="model-toggle-default"
                    >★</span>
                    <span class="model-toggle-state">
                      {{ isModelDisabled(p, m) ? t('settings.modelDisabled') : t('settings.modelEnabled') }}
                    </span>
                    <input
                      type="checkbox"
                      :checked="!isModelDisabled(p, m)"
                      @change="toggleModelOnCard(p, m)"
                    />
                    <span class="model-toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p v-else class="helper-text">{{ t('settings.noModelsYet') }}</p>
            </div>
          </div>
          <p v-else class="helper-text">{{ t('settings.noProviders') }}</p>

          <div v-if="providerMsg" class="helper-text">{{ providerMsg }}</div>
          <div v-if="fetchError && fetchSource" class="helper-text fetch-note">
            {{ t('settings.fetchSource') }}:
            {{ fetchSource === 'api' ? t('settings.fetchApi') : t('settings.fetchFallback') }}
            <span v-if="fetchError"> — {{ fetchError }}</span>
          </div>

          <!-- Edit / add form -->
          <div v-if="editingProvider" class="provider-edit card-inner">
            <div class="field">
              <label>{{ t('wizard.provider') }}</label>
              <AppSelect v-model="editingProvider.provider" class="input" :aria-label="t('wizard.provider')" :options="PROVIDERS.map(p=>({value:p.id,label:t(`providers.${p.id}.name`,p.name)}))" @change="onEditProviderType" />
            </div>
            <div class="field">
              <label>{{ t('wizard.apiKey') }}</label>
              <input
                type="password"
                v-model="editingProvider.api_key"
                :placeholder="t('wizard.apiKeyPlaceholder')"
                class="input"
              />
            </div>
            <div class="field">
              <label>{{ t('wizard.baseUrl') }}</label>
              <input
                v-model="editingProvider.base_url"
                :placeholder="t('wizard.baseUrlPlaceholder')"
                class="input"
              />
            </div>
            <div class="field">
              <label>{{ t('settings.modelsCsv') }}</label>
              <input
                :value="editingProvider.models.join(', ')"
                @input="editingProvider.models = parseModelsInput(($event.target as HTMLInputElement).value)"
                placeholder="gpt-4o, gpt-4o-mini"
                class="input"
              />
              <button class="btn btn-ghost" type="button" :disabled="isLoading" @click="autoFetchEditModels">
                {{ isLoading ? t('wizard.fetching') : t('settings.fetchModels') }}
              </button>
              <p v-if="fetchSource" class="helper-text">
                {{ t('settings.fetchSource') }}:
                {{ fetchSource === 'api' ? t('settings.fetchApi') : t('settings.fetchFallback') }}
              </p>
            </div>
            <div class="field" v-if="editingProvider.models.length">
              <label>{{ t('settings.modelToggles') }}</label>
              <div class="model-chip-card">
                <div class="model-toggle-list">
                  <label
                    v-for="m in editingProvider.models"
                    :key="m"
                    class="model-toggle-row"
                    :class="{ off: isModelDisabled(editingProvider, m) }"
                  >
                    <span class="model-toggle-name">{{ m }}</span>
                    <span class="model-toggle-state">
                      {{ isModelDisabled(editingProvider, m) ? t('settings.modelDisabled') : t('settings.modelEnabled') }}
                    </span>
                    <input
                      type="checkbox"
                      :checked="!isModelDisabled(editingProvider, m)"
                      @change="toggleModelEnabled(editingProvider, m)"
                    />
                    <span class="model-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="field">
              <label>{{ t('wizard.defaultModel') }}</label>
              <AppSelect v-model="editingProvider.default_model" class="input" :aria-label="t('wizard.defaultModel')" :options="editingProvider.models" />
            </div>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" @click="saveProviderEdit">
              {{ t('settings.save') }}
            </button>
            <button class="btn btn-ghost" type="button" @click="editingProvider = null">
              {{ t('settings.cancel') }}
            </button>
          </div>
          </div>

          <!-- mocr runtime knobs live under the provider section (merged) -->
          <div
            v-if="pluginSection('provider')?.fields?.length"
            class="provider-runtime card-inner"
          >
            <h3>{{ pluginSection('provider')!.label }}</h3>
            <p v-if="pluginSection('provider')!.description" class="helper-text">
              {{ pluginSection('provider')!.description }}
            </p>
            <div
              v-for="f in pluginSection('provider')!.fields"
              :key="f.key"
              class="field"
            >
              <template v-if="f.type === 'bool'">
                <label class="toggle-label">
                  <input
                    type="checkbox"
                    :checked="sectionBool('provider', f.key)"
                    @change="sectionDrafts = { ...sectionDrafts, provider: { ...sectionDrafts.provider, [f.key]: ($event.target as HTMLInputElement).checked } }"
                  />
                  <span class="toggle-slider"></span>
                  <span>
                    <strong>{{ f.label }}</strong>
                    <br v-if="f.help" />
                    <small v-if="f.help" class="helper-text">{{ f.help }}</small>
                  </span>
                </label>
              </template>
              <template v-else-if="f.type === 'select'">
                <label>{{ f.label }}</label>
                <AppSelect class="input" :aria-label="f.label" :model-value="String(sectionDrafts.provider?.[f.key] ?? '')" :options="f.options || []" @update:model-value="sectionDrafts = { ...sectionDrafts, provider: { ...sectionDrafts.provider, [f.key]: $event } }" />
                <p v-if="f.help" class="helper-text">{{ f.help }}</p>
              </template>
              <template v-else>
                <label>{{ f.label }}</label>
                <input
                  class="input"
                  :type="f.type === 'number' ? 'number' : 'text'"
                  :value="sectionDrafts.provider?.[f.key]"
                  @input="sectionDrafts = { ...sectionDrafts, provider: { ...sectionDrafts.provider, [f.key]: f.type === 'number' ? Number(($event.target as HTMLInputElement).value) : ($event.target as HTMLInputElement).value } }"
                />
                <p v-if="f.help" class="helper-text">{{ f.help }}</p>
              </template>
            </div>
            <div v-if="sectionMsg && activeTab === 'provider'" class="helper-text">{{ sectionMsg }}</div>
            <div class="actions-row">
              <button class="btn btn-primary" type="button" @click="saveSection('provider')">
                {{ t('settings.save') }}
              </button>
            </div>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
        </div>

        <!-- Persona (component pane — metadata may come from life.patch) -->
        <div v-else-if="activeTab === 'persona'" class="content-card">
          <h2>{{ tabLabel('persona') }}</h2>
          <p class="card-desc">{{ tabMeta('persona')?.descriptionKey ? t(tabMeta('persona')!.descriptionKey!) : t('settings.personaDesc') }}</p>

          <div class="field-row">
            <div class="field">
              <label>{{ t('wizard.name') }}</label>
              <input v-model="wizard.persona.name" :placeholder="t('wizard.namePlaceholder')" class="input" />
            </div>
            <div class="field">
              <label>{{ t('wizard.avatarUrl') }}</label>
              <input v-model="wizard.persona.avatar" :placeholder="t('wizard.avatarPlaceholder')" class="input" />
            </div>
            <div class="field">
              <label>出生日期</label>
              <input v-model="wizard.persona.birthDate" type="date" class="input" />
            </div>
          </div>

          <div class="field">
            <label>{{ t('wizard.description') }}</label>
            <textarea v-model="wizard.persona.description" :placeholder="t('wizard.descriptionPlaceholder')" class="input" rows="3"></textarea>
          </div>

          <div class="field">
            <label>{{ t('wizard.personality') }}</label>
            <textarea v-model="wizard.persona.personality" :placeholder="t('wizard.personalityPlaceholder')" class="input" rows="3"></textarea>
          </div>

          <div class="field">
            <label>{{ t('wizard.greeting') }}</label>
            <textarea v-model="wizard.persona.greeting" :placeholder="t('wizard.greetingPlaceholder')" class="input" rows="2"></textarea>
          </div>
        </div>

        <!-- Live2D (component pane — metadata may come from life.patch) -->
        <div v-else-if="activeTab === 'live2d'" class="content-card">
          <h2>{{ tabLabel('live2d') }}</h2>
          <p class="card-desc">{{ tabMeta('live2d')?.descriptionKey ? t(tabMeta('live2d')!.descriptionKey!) : t('settings.live2dDesc') }}</p>

          <Live2DStage class="live2d-preview" />

          <label class="toggle-label">
            <input type="checkbox" v-model="wizard.live2d.enabled" />
            <span class="toggle-slider"></span>
            <span>{{ t('wizard.enableLive2d') }}</span>
          </label>

          <div class="field">
            <label>{{ t('wizard.modelUrl') }}</label>
            <div class="model-choices">
              <label
                v-for="m in DEFAULT_LIVE2D_MODELS"
                :key="m.id"
                class="model-choice"
                :class="{ selected: wizard.live2d.modelUrl === m.url }"
              >
                <input
                  type="radio"
                  name="live2d-model"
                  :value="m.url"
                  :checked="wizard.live2d.modelUrl === m.url"
                  @change="wizard.live2d.modelUrl = m.url; wizard.live2d.enabled = true"
                />
                <span>{{ m.label }}</span>
                <code>{{ m.url }}</code>
              </label>
            </div>
            <input
              v-model="wizard.live2d.modelUrl"
              :placeholder="t('wizard.modelUrlPlaceholder')"
              class="input"
            />
            <p class="helper-text">
              {{ t('wizard.live2dHelp') }}
              <a href="https://www.live2d.com/en/learn/sample/" target="_blank" rel="noopener">
                {{ t('wizard.live2dSamples') }}
              </a>
            </p>
          </div>

          <p class="helper-text">支持 Cubism 2（.model.json + .moc）与 Cubism 3/4（.model3.json + .moc3）。请选择完整模型文件夹，包含纹理、动作等资源。</p>
          <button class="btn btn-tonal" @click="saveLive2D().catch(error => uploadMsg = error.message)">保存 LIFE 的 Live2D 设置</button>

          <div class="field">
            <label>{{ t('settings.uploadFolder') }}</label>
            <label class="upload-area" @click.prevent="openFolderPicker">
              <span>{{ t('settings.uploadFolderHint') }}</span>
            </label>
            <input
              ref="folderInput"
              type="file"
              webkitdirectory
              directory
              multiple
              class="file-input"
              @change="onFolderSelected"
            />
            <p v-if="uploadMsg" class="helper-text">{{ uploadMsg }}</p>
            <div v-if="uploadedModels.length" class="model-choices" style="margin-top: 12px">
              <label
                v-for="m in uploadedModels"
                :key="m.id"
                class="model-choice"
                :class="{ selected: wizard.live2d.modelUrl === m.url }"
              >
                <input
                  type="radio"
                  name="live2d-uploaded"
                  :value="m.url"
                  :checked="wizard.live2d.modelUrl === m.url"
                  @change="wizard.live2d.modelUrl = m.url; wizard.live2d.enabled = true; saveLive2D().catch(error => uploadMsg = error.message)"
                />
                <span>{{ m.label }}</span>
                <code>{{ m.url }}</code>
                <button type="button" class="btn btn-danger" @click.prevent="deleteModel(m)">删除模型</button>
              </label>
            </div>
          </div>
        </div>

        <!-- Permissions — shell pane; fields/labels from life.patch when present -->
        <div v-else-if="activeTab === 'permissions'" class="content-card">
          <h2>{{ tabLabel('permissions') }}</h2>
          <p class="card-desc">{{ tabMeta('permissions')?.descriptionKey ? t(tabMeta('permissions')!.descriptionKey!) : t('settings.permissionsDesc') }}</p>

          <label class="toggle-label">
            <input type="checkbox" v-model="perms.screen_watch" @change="savePermissions" />
            <span class="toggle-slider"></span>
            <span>
              <strong>{{ fieldLabel(tabMeta('permissions'), 'screen_watch', 'settings.screenWatch') }}</strong>
              <br />
              <small class="helper-text">{{ fieldHelp(tabMeta('permissions'), 'screen_watch', 'settings.screenWatchDesc') }}</small>
            </span>
          </label>

          <label class="toggle-label">
            <input type="checkbox" v-model="perms.computer_use" @change="savePermissions" />
            <span class="toggle-slider"></span>
            <span>
              <strong>{{ fieldLabel(tabMeta('permissions'), 'computer_use', 'settings.computerUse') }}</strong>
              <br />
              <small class="helper-text">{{ fieldHelp(tabMeta('permissions'), 'computer_use', 'settings.computerUseDesc') }}</small>
            </span>
          </label>

          <div class="field">
            <label>{{ fieldLabel(tabMeta('permissions'), 'report_agent_host', 'settings.reportAgentHost') }}</label>
            <input v-model="perms.report_agent_host" class="input" :placeholder="fieldHelp(tabMeta('permissions'), 'report_agent_host', 'settings.reportAgentHostDesc')" @change="savePermissions" />
            <p class="helper-text">{{ fieldHelp(tabMeta('permissions'), 'report_agent_host', 'settings.reportAgentHostDesc') }}</p>
          </div>

          <div v-if="permMsg" class="helper-text">{{ permMsg }}</div>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" @click="savePermissions">{{ t('settings.save') }}</button>
          </div>
        </div>

        <!-- Plugin-registered settings sections (declarative fields) -->
        <LifeSettingsPanel v-else-if="activeTab === 'life_settings'" />

        <!-- Plugin-registered settings sections (declarative fields) -->
        <div
          v-else-if="isPluginSection(activeTab) && pluginSection(activeTab)"
          class="content-card"
        >
          <h2>{{ pluginSection(activeTab)!.label }}</h2>
          <p v-if="pluginSection(activeTab)!.description" class="card-desc">
            {{ pluginSection(activeTab)!.description }}
          </p>
          <p v-if="pluginSection(activeTab)!.plugin_name" class="helper-text">
            {{ pluginSection(activeTab)!.plugin_name }}
          </p>

          <div
            v-for="f in pluginSection(activeTab)!.fields"
            :key="f.key"
            class="field"
          >
            <template v-if="f.type === 'bool'">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  :checked="sectionBool(activeTab, f.key)"
                  @change="sectionDrafts = { ...sectionDrafts, [activeTab]: { ...sectionDrafts[activeTab], [f.key]: ($event.target as HTMLInputElement).checked } }"
                />
                <span class="toggle-slider"></span>
                <span>
                  <strong>{{ f.label }}</strong>
                  <br v-if="f.help" />
                  <small v-if="f.help" class="helper-text">{{ f.help }}</small>
                </span>
              </label>
            </template>
            <template v-else-if="f.type === 'select'">
              <label>{{ f.label }}</label>
              <AppSelect class="input" :aria-label="f.label" :model-value="String(sectionDrafts[activeTab]?.[f.key] ?? '')" :options="f.options || []" @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }" />
              <p v-if="f.help" class="helper-text">{{ f.help }}</p>
            </template>
            <template v-else>
              <label>{{ f.label }}</label>
              <input
                class="input"
                :type="f.type === 'number' ? 'number' : 'text'"
                :value="sectionDrafts[activeTab]?.[f.key]"
                @input="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: f.type === 'number' ? Number(($event.target as HTMLInputElement).value) : ($event.target as HTMLInputElement).value }"
              />
              <p v-if="f.help" class="helper-text">{{ f.help }}</p>
            </template>
          </div>

          <div v-if="sectionMsg" class="helper-text">{{ sectionMsg }}</div>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" @click="saveSection(activeTab)">
              {{ t('settings.save') }}
            </button>
          </div>
        </div>

        <!-- Patch-declared settings tab (fields + loadApi/saveApi, not a builtin pane) -->
        <div
          v-else-if="!isBuiltinTab(activeTab) && tabMeta(activeTab)?.fields?.length"
          class="content-card"
        >
          <h2>{{ tabLabel(activeTab) }}</h2>
          <p v-if="tabMeta(activeTab)?.descriptionKey" class="card-desc">
            {{ t(tabMeta(activeTab)!.descriptionKey!) }}
          </p>
          <p v-else-if="tabMeta(activeTab)?.description" class="card-desc">
            {{ tabMeta(activeTab)!.description }}
          </p>

          <div v-for="f in tabMeta(activeTab)!.fields" :key="f.key" class="field">
            <template v-if="f.type === 'bool'">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  :checked="sectionBool(activeTab, f.key)"
                  @change="sectionDrafts = { ...sectionDrafts, [activeTab]: { ...sectionDrafts[activeTab], [f.key]: ($event.target as HTMLInputElement).checked } }"
                />
                <span class="toggle-slider"></span>
                <span>
                  <strong>{{ fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`) }}</strong>
                  <br v-if="f.help || f.helpKey" />
                  <small v-if="f.help || f.helpKey" class="helper-text">
                    {{ fieldHelp(tabMeta(activeTab), f.key, `settings.${f.key}Desc`) }}
                  </small>
                </span>
              </label>
            </template>
            <template v-else-if="f.type === 'select'">
              <label>{{ fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`) }}</label>
              <AppSelect class="input" :aria-label="fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`)" :model-value="String(sectionDrafts[activeTab]?.[f.key] ?? '')" :options="f.options || []" @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }" />
              <p v-if="f.help || f.helpKey" class="helper-text">
                {{ fieldHelp(tabMeta(activeTab), f.key, `settings.${f.key}Desc`) }}
              </p>
            </template>
            <template v-else>
              <label>{{ fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`) }}</label>
              <input
                class="input"
                :type="f.type === 'number' ? 'number' : 'text'"
                :value="sectionDrafts[activeTab]?.[f.key]"
                @input="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: f.type === 'number' ? Number(($event.target as HTMLInputElement).value) : ($event.target as HTMLInputElement).value }"
              />
              <p v-if="f.help || f.helpKey" class="helper-text">
                {{ fieldHelp(tabMeta(activeTab), f.key, `settings.${f.key}Desc`) }}
              </p>
            </template>
          </div>

          <div v-if="sectionMsg" class="helper-text">{{ sectionMsg }}</div>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" @click="savePatchFields(activeTab)">
              {{ t('settings.save') }}
            </button>
          </div>
        </div>

        <div v-else-if="activeTab === 'about'" class="content-card">
          <h2>{{ t('settings.tabs.about') }}</h2>
          <p class="card-desc">{{ t('settings.about.description') }}</p>
          <h3>0KAY <small>v{{ updateResult?.current || '0.1.0' }}</small></h3>
          <div class="actions-row">
            <button class="btn btn-tonal" :disabled="aboutLoading" @click="checkUpdates">{{ t(aboutLoading ? 'settings.about.checking' : 'settings.about.check') }}</button>
            <button class="btn btn-tonal" :disabled="pluginsLoading" @click="checkPluginUpdates">{{ t(pluginsLoading ? 'settings.about.checking' : 'settings.about.plugins') }}</button>
          </div>
          <p v-if="updateError" role="alert">{{ updateError }}</p>
          <p v-else-if="updateResult" role="status">
            {{ t(updateResult.has_update ? 'settings.about.available' : (updateResult.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
            <a v-if="updateResult.url" :href="updateResult.url" target="_blank" rel="noopener noreferrer">{{ updateResult.latest }}</a>
          </p>
          <p v-if="pluginsError" role="alert">{{ pluginsError }}</p>
          <div v-if="pluginResults" class="about-plugins">
            <div v-for="plugin in pluginResults" :key="plugin.name" class="about-plugin">
              <strong>{{ plugin.name }}</strong>
              <span>{{ plugin.version || '—' }} → {{ plugin.latest || '—' }}</span>
              <span>{{ plugin.error || t(plugin.has_update ? 'settings.about.available' : (plugin.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}</span>
            </div>
            <p v-if="!pluginResults.length">{{ t('settings.about.noPlugins') }}</p>
          </div>
          <p class="helper-text">{{ t('settings.about.updateHint') }}</p>
          <code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code>
        </div>

        <!-- Danger -->
        <div v-else class="content-card danger">
          <h2>{{ t('settings.tabs.danger') }}</h2>
          <p class="card-desc">{{ t('settings.resetDesc') }}</p>

          <div class="danger-box">
            <div>
              <strong>{{ t('settings.reset') }}</strong>
              <p>{{ t('settings.resetWarning') }}</p>
            </div>
            <button class="btn btn-danger" @click="resetAll">
              {{ t('settings.reset') }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-plugins { margin-top: 20px; }
.about-plugin { display: flex; flex-wrap: wrap; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border-color, #ddd); }
.about-plugin strong { min-width: 100px; }
.settings-page {
  height: 100%;
  overflow-y: auto;
  padding: var(--space-xl);
  background: var(--md-surface);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.page-header h1 {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.subtitle {
  color: var(--md-on-surface-variant);
  font-size: 14px;
  margin-top: 4px;
}

.settings-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--space-xl);
  align-items: start;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: sticky;
  top: 0;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 0 16px;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.nav-item:hover {
  background: color-mix(in srgb, var(--md-on-surface) 6%, transparent);
}

.nav-item.active {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

.nav-icon {
  display: flex;
  color: inherit;
}

.settings-content {
  min-width: 0;
}

.content-card {
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-1);
}

.content-card h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}

.card-desc {
  color: var(--md-on-surface-variant);
  font-size: 14px;
  margin-bottom: var(--space-xl);
}

.field {
  margin-bottom: var(--space-lg);
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
  margin-bottom: 8px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.helper-link {
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--md-primary);
  text-decoration: none;
}
.helper-link:hover { text-decoration: underline; }

.helper-text {
  margin-top: 8px;
  font-size: 13px;
  color: var(--md-on-surface-variant);
}
.helper-text a { color: var(--md-primary); }

.model-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.model-choice {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 2px 10px;
  align-items: center;
  padding: 12px 14px;
  border: 2px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  background: var(--md-surface-container-lowest);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.model-choice input { grid-row: 1 / span 2; }
.model-choice span { font-weight: 600; font-size: 14px; color: var(--md-on-surface); }
.model-choice code {
  grid-column: 2;
  font-size: 11px;
  color: var(--md-on-surface-variant);
  word-break: break-all;
}
.model-choice.selected,
.model-choice:has(input:checked) {
  border-color: var(--md-primary);
  background: var(--md-primary-container);
}

.error-message {
  padding: 12px 16px;
  background: var(--md-error-container);
  color: #410E0B;
  border-radius: var(--radius-md);
  font-size: 13px;
}

.provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.provider-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 16px;
  background: var(--md-surface-container-lowest);
  border: 2px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  transition: border-color var(--transition-fast), background var(--transition-fast), transform var(--transition-fast);
}

.provider-card:hover { transform: translateY(-1px); }

.provider-card.selected {
  border-color: var(--md-primary);
  background: var(--md-primary-container);
}

.provider-icon { font-size: 24px; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; }
.provider-logo { width: 28px; height: 28px; object-fit: contain; }
.provider-name { font-weight: 600; font-size: 14px; color: var(--md-on-surface); }
.provider-desc { font-size: 12px; color: var(--md-on-surface-variant); }

.actions-row { margin-bottom: var(--space-lg); }

.provider-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: var(--space-lg);
}

.provider-list-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 2px solid var(--md-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--md-surface-container-lowest);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.provider-list-item.selected {
  border-color: var(--md-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--md-primary) 35%, transparent);
}
.provider-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.provider-identity {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.provider-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  padding: 4px;
}
.provider-logo-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.provider-identity-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.provider-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--md-on-surface);
}
.provider-url {
  font-size: 12px;
  color: var(--md-on-surface-variant);
  word-break: break-all;
}
.provider-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.badge-count {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.provider-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.model-chip-card {
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  background: var(--md-surface-container-low);
  padding: 10px 12px;
}
.model-chip-card-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}
.model-chip-card-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface);
}
.model-chip-card-hint {
  font-size: 11px;
  color: var(--md-on-surface-variant);
}
.model-chip-card .model-toggle-list {
  margin-bottom: 0;
}
.model-toggle-default {
  color: #d4a017;
  font-size: 12px;
}
.fetch-note {
  margin-top: 4px;
}
.provider-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  background: var(--md-surface-container-lowest);
}
.provider-row.selected {
  border-color: var(--md-primary);
  background: var(--md-primary-container);
}
.provider-row-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.provider-row-main code {
  font-size: 12px;
  color: var(--md-on-surface-variant);
  word-break: break-all;
}
.provider-models {
  font-size: 12px;
  color: var(--md-on-surface-variant);
}
.badge-default {
  display: inline-block;
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-size: 11px;
  font-weight: 600;
}
.provider-row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.provider-edit {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--md-outline-variant);
}
.card-inner { /* spacing helper */ }
.danger-text { color: var(--md-error); }

.model-list {
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  background: var(--md-surface-container-lowest);
  margin-bottom: var(--space-lg);
}

.model-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--md-surface-container-high);
}
.model-item:last-child { border-bottom: none; }
.model-item:hover { background: var(--md-surface-container); }
.model-name { font-family: ui-monospace, monospace; font-size: 13px; }

.custom-models {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}
.custom-models .input { flex: 1; }

.segmented {
  display: inline-flex;
  padding: 4px;
  background: var(--md-surface-container-high);
  border-radius: var(--radius-full);
  gap: 4px;
}

.seg {
  min-height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  font-weight: 500;
  cursor: pointer;
}

.seg.active {
  background: var(--md-primary);
  color: var(--md-on-primary);
}

.lang-swap { margin-top: 12px; }

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  margin-bottom: var(--space-lg);
  font-weight: 500;
}
.toggle-label input { display: none; }

.toggle-slider {
  width: 48px;
  height: 28px;
  background: var(--md-surface-container-highest);
  border: 2px solid var(--md-outline);
  border-radius: var(--radius-full);
  position: relative;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  flex-shrink: 0;
}
.toggle-slider::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 4px;
  width: 16px;
  height: 16px;
  background: var(--md-outline);
  border-radius: 50%;
  transform: translateY(-50%);
  transition: transform var(--transition-fast), width var(--transition-fast), height var(--transition-fast), background var(--transition-fast), left var(--transition-fast);
}
.toggle-label input:checked + .toggle-slider {
  background: var(--md-primary);
  border-color: var(--md-primary);
}
.toggle-label input:checked + .toggle-slider::after {
  left: 24px;
  width: 20px;
  height: 20px;
  background: var(--md-on-primary);
}

.provider-runtime {
  margin-top: var(--space-xl);
}

.model-toggle-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--space-md);
}

.model-toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-md);
  background: var(--md-surface-container-low);
  cursor: pointer;
}

.model-toggle-row.off {
  opacity: 0.55;
}

.model-toggle-name {
  flex: 1;
  font-family: ui-monospace, monospace;
  font-size: 13px;
}

.model-toggle-state {
  font-size: 12px;
  color: var(--md-on-surface-variant);
}

.model-toggle-row input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.model-toggle-slider {
  width: 40px;
  height: 24px;
  background: var(--md-surface-container-highest);
  border: 2px solid var(--md-outline);
  border-radius: var(--radius-full);
  position: relative;
  flex-shrink: 0;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.model-toggle-slider::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 3px;
  width: 14px;
  height: 14px;
  background: var(--md-outline);
  border-radius: 50%;
  transform: translateY(-50%);
  transition: left var(--transition-fast), background var(--transition-fast);
}

.model-toggle-row input:checked + .model-toggle-slider {
  background: var(--md-primary);
  border-color: var(--md-primary);
}

.model-toggle-row input:checked + .model-toggle-slider::after {
  left: 19px;
  background: var(--md-on-primary);
}

.live2d-preview { margin-bottom: var(--space-xl); }

.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88px;
  padding: 24px;
  border: 2px dashed var(--md-outline);
  border-radius: var(--radius-lg);
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  text-align: center;
}
.upload-area:hover {
  border-color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 6%, transparent);
}
.file-input { display: none; }

.content-card.danger {
  border-color: color-mix(in srgb, var(--md-error) 35%, var(--md-outline-variant));
}

.danger-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--md-error-container);
  border-radius: var(--radius-lg);
  color: #410E0B;
}

.danger-box p {
  font-size: 13px;
  margin-top: 4px;
  opacity: 0.9;
}

@media (max-width: 800px) {
  .settings-layout { grid-template-columns: 1fr; }
  .settings-nav {
    flex-direction: row;
    flex-wrap: wrap;
    position: static;
  }
  .nav-item { min-height: 40px; padding: 0 12px; }
  .nav-label { display: none; }
  .field-row { grid-template-columns: 1fr; }
}
</style>
