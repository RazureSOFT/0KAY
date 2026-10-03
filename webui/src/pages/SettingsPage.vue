<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/wizard'
import { useSettingsSectionsStore } from '../stores/settingsSections'
import { useUIPatchesStore } from '../stores/uiPatches'
import { DEFAULT_LIVE2D_MODELS } from '../composables/wizard'
import Live2DStage from '../components/Live2DStage.vue'
import LifeSettingsPanel from '../components/LifeSettingsPanel.vue'
import AboutPanel from '../components/AboutPanel.vue'
import UpdatesPanel from '../components/UpdatesPanel.vue'
import ProviderPanel from '../components/ProviderPanel.vue'
import GeneralPanel from '../components/GeneralPanel.vue'
import PersonaPanel from '../components/PersonaPanel.vue'
import PermissionsPanel from '../components/PermissionsPanel.vue'
import SecurityPanel from '../components/SecurityPanel.vue'
import McpPanel from '../components/McpPanel.vue'
import DangerPanel from '../components/DangerPanel.vue'
import PluginModulePane from '../components/PluginModulePane.vue'
import AppSelect from '../components/AppSelect.vue'
import ModelsField from '../components/ModelsField.vue'
import { useConfirm } from '../composables/confirm'
import { useSettingsMeta } from '../composables/settingsMeta'

const { t, locale } = useI18n()
const { confirm } = useConfirm()
const wizard = useWizardStore()
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
const saved = ref(false)

const uploadedModels = ref<{ id: string; label: string; url: string }[]>([])
const folderInput = ref<HTMLInputElement | null>(null)
const uploadMsg = ref('')

/** Plugin section draft values */
const sectionDrafts = ref<Record<string, Record<string, unknown>>>({})
const sectionMsg = ref('')
const sectionTesting = ref(false)
const sectionTestMsg = ref('')

/** Model catalog for `model` / `models` settings fields (dropdowns). */
const availableModels = ref<string[]>([])
const modelAutoLabel = computed(() => (locale.value === 'en' ? 'Auto (by strategy)' : '自动（按策略）'))
const modelOptions = computed(() => [
  { value: '', label: modelAutoLabel.value },
  ...availableModels.value.map((id) => ({ value: id, label: id })),
])
async function loadAvailableModels() {
  try {
    const res = await fetch('/api/models')
    if (!res.ok) return
    const body: { models?: Array<{ id?: string }> } = await res.json()
    availableModels.value = Array.from(new Set((body.models || []).map((model) => String(model.id || '')).filter(Boolean)))
  } catch { /* offline */ }
}

/** Run a plugin section's backend test; play the returned audio sample. */
async function testPluginSection(id: string) {
  sectionTesting.value = true
  sectionTestMsg.value = ''
  try {
    const res = await fetch(`/api/settings/${id}/test`, { method: 'POST' })
    const contentType = res.headers.get('content-type') || ''
    if (res.ok && contentType.startsWith('audio')) {
      const url = URL.createObjectURL(await res.blob())
      try { await new Audio(url).play() } catch { /* autoplay may be blocked */ }
      window.dispatchEvent(new CustomEvent('live2d-speak', { detail: { url } }))
      sectionTestMsg.value = '测试成功，正在播放…'
    } else {
      const data: { error?: string } = await res.json().catch(() => ({}))
      sectionTestMsg.value = data.error || `HTTP ${res.status}`
    }
  } catch (error: unknown) {
    sectionTestMsg.value = error instanceof Error ? error.message : String(error)
  } finally {
    sectionTesting.value = false
  }
}

const { tabMeta, isBuiltinTab, isPluginSection, tabLabel, fieldLabel, fieldHelp, pluginSection } = useSettingsMeta()

/** A patch-declared tab whose body is a plugin ESM module (native pane). */
const moduleTab = computed(() => {
  if (isBuiltinTab(activeTab.value)) return null
  return tabMeta(activeTab.value)?.module || null
})

/** Coerce section draft values — API may send bool, "true"/"false", 0/1. */
function sectionBool(id: string, key: string): boolean {
  const v = sectionDrafts.value[id]?.[key]
  if (typeof v === 'boolean') return v
  if (v === 'true' || v === 1 || v === '1') return true
  return false
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
    const response=await fetch(`/api/live2d/${encodeURIComponent(model.id)}`,{method:'DELETE'})
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
  void loadAvailableModels()
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
      <button v-if="activeTab !== 'about' && !moduleTab" class="btn btn-primary" @click="save">
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
            <!-- brightness / appearance -->
            <svg v-else-if="tab.icon === 'brightness'" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- warn -->
            <svg v-else-if="tab.icon === 'warn'" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4l9 16H3L12 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v4M12 17.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- info / about -->
            <svg v-else-if="tab.icon === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 11v5M12 7.5v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- download / updates -->
            <svg v-else-if="tab.icon === 'download'" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <!-- shield / security -->
            <svg v-else-if="tab.icon === 'shield'" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 4.2-2.8 7.6-7 9-4.2-1.4-7-4.8-7-9V6l7-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <!-- lock / permissions -->
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </span>
          <span class="nav-label">{{ tabLabel(tab.id) }}</span>
        </button>
      </nav>

      <section class="settings-content">
        <!-- General -->
        <GeneralPanel v-if="activeTab === 'general'" />

        <!-- Provider (multi-provider) — dedicated panel -->
        <template v-else-if="activeTab === 'provider'">
          <ProviderPanel />

          <!-- mocr runtime knobs live under the provider section (merged) -->
          <div
            v-if="pluginSection('provider')?.fields?.length"
            class="content-card provider-runtime"
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
            <div v-if="sectionMsg" class="helper-text">{{ sectionMsg }}</div>
            <div class="actions-row">
              <button class="btn btn-primary" type="button" @click="saveSection('provider')">
                {{ t('settings.save') }}
              </button>
            </div>
          </div>
        </template>

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

        <!-- Security — PIN / login switches and the per-page scope -->
        <SecurityPanel v-else-if="activeTab === 'security'" />

        <!-- Permissions — shell pane; fields/labels from life.patch when present -->
          <PermissionsPanel v-else-if="activeTab === 'permissions'" />
          <McpPanel v-else-if="activeTab === 'mcp'" />

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
            <template v-else-if="f.type === 'model'">
              <label>{{ f.label }}</label>
              <AppSelect class="input" :aria-label="f.label" :model-value="String(sectionDrafts[activeTab]?.[f.key] ?? '')" :options="modelOptions" @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }" />
              <p v-if="f.help" class="helper-text">{{ f.help }}</p>
            </template>
            <template v-else-if="f.type === 'models'">
              <label>{{ f.label }}</label>
              <ModelsField :model-value="String(sectionDrafts[activeTab]?.[f.key] ?? '')" :options="availableModels" @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }" />
              <p v-if="f.help" class="helper-text">{{ f.help }}</p>
            </template>
            <template v-else-if="f.type === 'test'">
              <label>{{ f.label }}</label>
              <div class="actions-row">
                <button class="btn btn-tonal" type="button" :disabled="sectionTesting" @click="testPluginSection(activeTab)">
                  {{ sectionTesting ? t('settings.testing') : (f.label || '测试') }}
                </button>
                <span v-if="sectionTestMsg" class="helper-text">{{ sectionTestMsg }}</span>
              </div>
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

        <!-- Patch-declared settings tab backed by a plugin ESM module (native pane) -->
        <PluginModulePane
          v-else-if="moduleTab"
          :key="moduleTab"
          :module="moduleTab || ''"
        />

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
            <template v-else-if="f.type === 'model'">
              <label>{{ fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`) }}</label>
              <AppSelect class="input" :aria-label="fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`)" :model-value="String(sectionDrafts[activeTab]?.[f.key] ?? '')" :options="modelOptions" @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }" />
              <p v-if="f.help || f.helpKey" class="helper-text">
                {{ fieldHelp(tabMeta(activeTab), f.key, `settings.${f.key}Desc`) }}
              </p>
            </template>
            <template v-else-if="f.type === 'models'">
              <label>{{ fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`) }}</label>
              <ModelsField :model-value="String(sectionDrafts[activeTab]?.[f.key] ?? '')" :options="availableModels" @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }" />
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
        <UpdatesPanel v-else-if="activeTab === 'updates'" />

        <!-- Danger -->
        <DangerPanel v-else />
      </section>
    </div>
  </div>
</template>

