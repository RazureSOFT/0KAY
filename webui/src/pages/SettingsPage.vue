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
import Live2DStage from '../components/Live2DStage.vue'
import LifeSettingsPanel from '../components/LifeSettingsPanel.vue'
import AboutPanel from '../components/AboutPanel.vue'
import GeneralPanel from '../components/GeneralPanel.vue'
import PersonaPanel from '../components/PersonaPanel.vue'
import PermissionsPanel from '../components/PermissionsPanel.vue'
import DangerPanel from '../components/DangerPanel.vue'
import AppSelect from '../components/AppSelect.vue'
import { useConfirm } from '../composables/confirm'
import { useSettingsMeta } from '../composables/settingsMeta'

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
const isLoading = ref(false)
const error = ref('')
const saved = ref(false)

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

const { tabMeta, isBuiltinTab, isPluginSection, tabLabel, fieldLabel, fieldHelp, pluginSection } = useSettingsMeta()

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
  const q = route.query.tab as string | undefined
  if (q) activeTab.value = q
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
  if (!isBuiltinTab(id)) loadSectionDraft(id)
  router.replace({ query: { tab: id } })
}

function save() {
  wizard.saveToStorage()
  if(activeTab.value==='live2d') void saveLive2D().catch(error=>{uploadMsg.value=error.message})
  saved.value = true
  setTimeout(() => { saved.value = false }, 1500)
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
        <GeneralPanel v-if="activeTab === 'general'" />

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
              <label>{{ t('settings.providerName') }}</label>
              <input v-model="editingProvider.name" :placeholder="t('settings.providerNamePlaceholder')" class="input" />
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
        <PersonaPanel v-else-if="activeTab === 'persona'" />

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
        <PermissionsPanel v-else-if="activeTab === 'permissions'" />

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

        <AboutPanel v-else-if="activeTab === 'about'" />

        <!-- Danger -->
        <DangerPanel v-else />
      </section>
    </div>
  </div>
</template>

