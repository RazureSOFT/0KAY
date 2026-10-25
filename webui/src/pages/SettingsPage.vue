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
import NavIcon from '../components/NavIcon.vue'
import SettingsField from '../components/SettingsField.vue'
import ConnectionPanel from '../components/ConnectionPanel.vue'
import PersonaPanel from '../components/PersonaPanel.vue'
import PermissionsPanel from '../components/PermissionsPanel.vue'
import SecurityPanel from '../components/SecurityPanel.vue'
import McpPanel from '../components/McpPanel.vue'
import DangerPanel from '../components/DangerPanel.vue'
import PluginModulePane from '../components/PluginModulePane.vue'
import PathPicker from '../components/PathPicker.vue'
import { useConfirm } from '../composables/confirm'
import { useSettingsMeta } from '../composables/settingsMeta'
import { toast } from '../composables/toast'

const { t } = useI18n()
const { confirm } = useConfirm()
const wizard = useWizardStore()
const sectionsStore = useSettingsSectionsStore()
const uiPatches = useUIPatchesStore()
const route = useRoute()
const router = useRouter()

const tabs = computed<Array<{ id: string; icon: string }>>(() => uiPatches.settingsTabs.map(t => ({
  id: t.id,
  icon: t.icon || 'chip',
})))

const pluginOnlyTabs = computed(() => {
  const seen = new Set(uiPatches.settingsTabs.map(t => t.id))
  const removed = new Set(uiPatches.removedSettingsIds)
  return sectionsStore.sections
    .filter(s => s.id !== 'permissions' && !seen.has(s.id) && !removed.has(s.id))
    .map(s => ({ id: s.id, icon: s.icon || 'lock' }))
})

const allTabs = computed(() => [...tabs.value, ...pluginOnlyTabs.value])

// Seeded from the query BEFORE first paint: initializing to 'general' and
// switching in onMounted is what made the page flash the general tab.
const activeTab = ref<string>((route.query.tab as string | undefined) || 'general')
const saved = ref(false)

const uploadedModels = ref<{ id: string; label: string; url: string }[]>([])
const folderInput = ref<HTMLInputElement | null>(null)
const uploadMsg = ref('')

const sectionDrafts = ref<Record<string, Record<string, unknown>>>({})
const sectionMsg = ref('')
const sectionMsgKind = ref<'ok' | 'error'>('ok')
const sectionSaving = ref(false)
const sectionTesting = ref(false)
const sectionTestMsg = ref('')
const live2dSaving = ref(false)

const availableModels = ref<string[]>([])
const modelAutoLabel = computed(() => t('settings.modelAuto'))
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
  } catch { }
}

async function testPluginSection(id: string) {
  sectionTesting.value = true
  sectionTestMsg.value = ''
  try {
    const res = await fetch(`/api/settings/${id}/test`, { method: 'POST' })
    const contentType = res.headers.get('content-type') || ''
    if (res.ok && contentType.startsWith('audio')) {
      const url = URL.createObjectURL(await res.blob())
      try { await new Audio(url).play() } catch { }
      window.dispatchEvent(new CustomEvent('live2d-speak', { detail: { url } }))
      sectionTestMsg.value = t('settings.testSuccess')
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

const pickerField = ref('')
const pickerOpen = computed({
  get: () => pickerField.value !== '',
  set: (open: boolean) => { if (!open) pickerField.value = '' },
})
const pickerTitle = computed(() => {
  const field = pluginSection(activeTab.value)?.fields.find((f) => f.key === pickerField.value)
  return field?.label || ''
})
const pickerInitial = computed(() => String(sectionDrafts.value[activeTab.value]?.[pickerField.value] ?? ''))

function applyPickedPath(path: string) {
  const key = pickerField.value
  if (!key) return
  sectionDrafts.value = {
    ...sectionDrafts.value,
    [activeTab.value]: { ...sectionDrafts.value[activeTab.value], [key]: path },
  }
}

const moduleTab = computed(() => {
  if (isBuiltinTab(activeTab.value)) return null
  return tabMeta(activeTab.value)?.module || null
})


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
    if (f.type === 'note') continue
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
    } catch { }
  }
  sectionDrafts.value = { ...sectionDrafts.value, [id]: base }
}

async function savePatchFields(id: string) {
  const meta = tabMeta(id)
  if (sectionSaving.value) return
  sectionSaving.value = true
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
    sectionMsgKind.value = 'ok'
    setTimeout(() => { sectionMsg.value = '' }, 3000)
  } catch {
    sectionMsg.value = t('settings.permFailed')
    sectionMsgKind.value = 'error'
  } finally {
    sectionSaving.value = false
  }
}

async function saveSection(id: string) {
  if (sectionSaving.value) return
  sectionSaving.value = true
  sectionMsg.value = ''
  try {
    const notes = new Set((pluginSection(id)?.fields || []).filter((f) => f.type === 'note').map((f) => f.key))
    const payload = Object.fromEntries(
      Object.entries(sectionDrafts.value[id] || {}).filter(([key]) => !notes.has(key)),
    )
    await sectionsStore.saveValues(id, payload)
    sectionMsg.value = t('settings.saved')
    sectionMsgKind.value = 'ok'
    setTimeout(() => { sectionMsg.value = '' }, 3000)
  } catch {
    sectionMsg.value = t('settings.permFailed')
    sectionMsgKind.value = 'error'
  } finally {
    sectionSaving.value = false
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
    message: t('settings.deleteModelConfirm', { label: model.label }),
    confirmLabel: t('common.delete'),
    danger: true,
  })
  if (!ok) return
  try {
    const response=await fetch(`/api/live2d/${encodeURIComponent(model.id)}`,{method:'DELETE'})
    if(!response.ok)throw new Error(await response.text())
    const body=await response.json();uploadedModels.value=body.models || []
    const folder=model.url.slice(0,model.url.indexOf('/', '/live2d/models/'.length)+1)
    if(wizard.live2d.modelUrl.startsWith(folder)) {wizard.live2d.modelUrl='';wizard.live2d.enabled=false;wizard.saveToStorage()}
    await saveLive2D();uploadMsg.value=t('settings.modelDeleted')
    window.dispatchEvent(new Event('live2d-models-changed'))
  }catch(error:any){uploadMsg.value=error.message}
}
async function saveLive2D() {
  wizard.saveToStorage()
  const response=await fetch('/api/settings/live2d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({values:{enabled:wizard.live2d.enabled,model_url:wizard.live2d.modelUrl}})})
  if(!response.ok)throw new Error(await response.text())
}

async function saveLive2DNow() {
  if (live2dSaving.value) return
  live2dSaving.value = true
  uploadMsg.value = ''
  try {
    await saveLive2D()
    uploadMsg.value = t('settings.saved')
    setTimeout(() => { if (uploadMsg.value === t('settings.saved')) uploadMsg.value = '' }, 3000)
  } catch (error: any) {
    uploadMsg.value = error.message
    toast(t('settings.permFailed'), 'error')
  } finally {
    live2dSaving.value = false
  }
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
  loadUploadedModels()
  void loadAvailableModels()
  await sectionsStore.fetchSections()
  for (const sec of sectionsStore.sections) loadSectionDraft(sec.id)
  // A tab from the query stays selected even before the plugin tabs resolve;
  // only a tab that is still unknown AFTER the sections load falls back.
  if (sectionsStore.sections.length && !allTabs.value.some((tab) => tab.id === activeTab.value) && !isBuiltinTab(activeTab.value)) {
    activeTab.value = 'general'
  }
})

function selectTab(id: string) {
  activeTab.value = id
  if (!isBuiltinTab(id)) loadSectionDraft(id)
  router.replace({ query: { tab: id } })
}

function save() {
  wizard.saveToStorage()
  if (activeTab.value === 'live2d') {
    saveLive2D()
      .then(() => {
        saved.value = true
        setTimeout(() => { saved.value = false }, 1500)
      })
      .catch((error: any) => {
        uploadMsg.value = error.message
        toast(t('settings.permFailed'), 'error')
      })
    return
  }
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
      <!-- Only the tabs whose state lives in the wizard store are saved here.
           The other panels save themselves (provider/mcp have their own buttons,
           security/permissions/connection apply immediately); a global button
           here used to flash "已保存" without persisting anything. -->
      <button
        v-if="activeTab === 'persona' || activeTab === 'live2d'"
        class="btn btn-primary"
        @click="save"
      >
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
          :aria-current="activeTab === tab.id ? 'true' : undefined"
          :data-tab-id="tab.id"
          :title="tabLabel(tab.id)"
          :aria-label="tabLabel(tab.id)"
          @click="selectTab(tab.id)"
        >
          <span class="nav-indicator"></span>
          <span class="nav-icon" aria-hidden="true">
            <NavIcon :name="tab.icon || 'chip'" :size="20" />
          </span>
          <span class="nav-label">{{ tabLabel(tab.id) }}</span>
        </button>
      </nav>

      <section class="settings-content">
        <Transition name="tab" mode="out-in">
                <GeneralPanel v-if="activeTab === 'general'" key="general" />

                <ConnectionPanel v-else-if="activeTab === 'connection'" key="connection" />

                <template v-else-if="activeTab === 'provider'">
          <ProviderPanel />

                    <div
            v-if="pluginSection('provider')?.fields?.length"
            class="content-card provider-runtime"
          >
            <h3>{{ pluginSection('provider')!.label }}</h3>
            <p v-if="pluginSection('provider')!.description" class="helper-text">
              {{ pluginSection('provider')!.description }}
            </p>
            <SettingsField
              v-for="f in pluginSection('provider')!.fields"
              :key="f.key"
              :field="f"
              :label="f.label"
              :help="f.help"
              :model-value="sectionDrafts.provider?.[f.key]"
              :section-id="'provider'"
              :model-options="modelOptions"
              :available-models="availableModels"
              @update:model-value="sectionDrafts = { ...sectionDrafts, provider: { ...sectionDrafts.provider, [f.key]: $event } }"
              @browse="pickerField = f.key"
            />
            <div v-if="sectionMsg" class="helper-text" :class="sectionMsgKind === 'error' ? 'msg-error' : 'msg-success'" role="status">{{ sectionMsg }}</div>
            <div class="actions-row">
              <button class="btn btn-primary" type="button" :disabled="sectionSaving" @click="saveSection('provider')">
                {{ t('settings.save') }}
              </button>
            </div>
          </div>
        </template>

                <PersonaPanel v-else-if="activeTab === 'persona'" />

                <div v-else-if="activeTab === 'live2d'" key="live2d" class="content-card">
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

          <p class="helper-text">{{ t('settings.live2dHelper') }}</p>
          <button class="btn btn-tonal" :disabled="live2dSaving" @click="saveLive2DNow">{{ live2dSaving ? t('settings.saving') : t('settings.saveLife2d') }}</button>

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
                <button type="button" class="btn btn-danger" @click.prevent="deleteModel(m)">{{ t('settings.deleteModel') }}</button>
              </label>
            </div>
          </div>
        </div>

                <SecurityPanel v-else-if="activeTab === 'security'" />

                  <PermissionsPanel v-else-if="activeTab === 'permissions'" />
          <McpPanel v-else-if="activeTab === 'mcp'" />

                <LifeSettingsPanel v-else-if="activeTab === 'life_settings'" />

                <div
          v-else-if="isPluginSection(activeTab) && pluginSection(activeTab)"
          :key="`section-${activeTab}`"
          class="content-card"
        >
          <h2>{{ pluginSection(activeTab)!.label }}</h2>
          <p v-if="pluginSection(activeTab)!.description" class="card-desc">
            {{ pluginSection(activeTab)!.description }}
          </p>
                    <p
            v-if="pluginSection(activeTab)!.plugin_name && pluginSection(activeTab)!.plugin_name !== activeTab"
            class="helper-text"
          >
            {{ t('settings.pluginProvidedBy', { name: pluginSection(activeTab)!.plugin_name }) }}
          </p>

          <SettingsField
            v-for="f in pluginSection(activeTab)!.fields.filter(x => x.type !== 'test')"
            :key="f.key"
            :field="f"
            :label="f.label"
            :help="f.help"
            :model-value="sectionDrafts[activeTab]?.[f.key]"
            :section-id="activeTab"
            :model-options="modelOptions"
            :available-models="availableModels"
            @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }"
            @browse="pickerField = f.key"
          />
          <div
            v-for="f in pluginSection(activeTab)!.fields.filter(x => x.type === 'test')"
            :key="f.key"
            class="field"
          >
            <label>{{ f.label }}</label>
            <div class="actions-row">
              <button class="btn btn-tonal" type="button" :disabled="sectionTesting" @click="testPluginSection(activeTab)">
                {{ sectionTesting ? t('settings.testing') : (f.label || t('settings.test')) }}
              </button>
              <span v-if="sectionTestMsg" class="helper-text">{{ sectionTestMsg }}</span>
            </div>
            <p v-if="f.help" class="helper-text">{{ f.help }}</p>
          </div>

          <div v-if="sectionMsg" class="helper-text" :class="sectionMsgKind === 'error' ? 'msg-error' : 'msg-success'" role="status">{{ sectionMsg }}</div>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" :disabled="sectionSaving" @click="saveSection(activeTab)">
              {{ t('settings.save') }}
            </button>
          </div>
        </div>

                <PluginModulePane
          v-else-if="moduleTab"
          :key="moduleTab"
          :module="moduleTab || ''"
        />

                <div
          v-else-if="!isBuiltinTab(activeTab) && tabMeta(activeTab)?.fields?.length"
          :key="`patch-${activeTab}`"
          class="content-card"
        >
          <h2>{{ tabLabel(activeTab) }}</h2>
          <p v-if="tabMeta(activeTab)?.descriptionKey" class="card-desc">
            {{ t(tabMeta(activeTab)!.descriptionKey!) }}
          </p>
          <p v-else-if="tabMeta(activeTab)?.description" class="card-desc">
            {{ tabMeta(activeTab)!.description }}
          </p>

          <SettingsField
            v-for="f in tabMeta(activeTab)!.fields"
            :key="f.key"
            :field="f"
            :label="fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`)"
            :help="fieldHelp(tabMeta(activeTab), f.key, `settings.${f.key}Desc`)"
            :model-value="sectionDrafts[activeTab]?.[f.key]"
            :section-id="activeTab"
            :model-options="modelOptions"
            :available-models="availableModels"
            @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }"
            @browse="pickerField = f.key"
          />

          <div v-if="sectionMsg" class="helper-text" :class="sectionMsgKind === 'error' ? 'msg-error' : 'msg-success'" role="status">{{ sectionMsg }}</div>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" :disabled="sectionSaving" @click="savePatchFields(activeTab)">
              {{ t('settings.save') }}
            </button>
          </div>
        </div>

        <AboutPanel v-else-if="activeTab === 'about'" key="about" />
        <UpdatesPanel v-else-if="activeTab === 'updates'" key="updates" />

                <DangerPanel v-else-if="activeTab === 'danger'" key="danger" />

                <div v-else key="unknown" class="content-card tab-unknown">
          <p>{{ t('settings.tabNotFound') }}</p>
        </div>
        </Transition>
      </section>
    </div>

        <PathPicker
      v-model:open="pickerOpen"
      :initial="pickerInitial"
      :title="pickerTitle"
      @pick="applyPickedPath"
    />
  </div>
</template>

