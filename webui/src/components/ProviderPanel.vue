<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProvidersStore } from '../stores/providers'
import { PROVIDERS } from '../composables/wizard'
import type { ProviderConfig } from '../composables/wizard'
import { useConfirm } from '../composables/confirm'
import AppSelect from './AppSelect.vue'

const { t } = useI18n()
const { confirm } = useConfirm()
const store = useProvidersStore()

type ProbeState = 'idle' | 'checking' | 'ok' | 'error'
type Probe = { state: ProbeState; message?: string; count?: number; ms?: number; models?: string[] }

const probes = ref<Record<string, Probe>>({})
const view = ref<'list' | 'edit'>('list')
const edit = ref<ProviderConfig | null>(null)
const editorError = ref('')
const editorProbe = ref<Probe>({ state: 'idle' })
const discovered = ref<string[]>([])
const modelSearch = ref('')
const showKey = ref(false)
const editHasStoredKey = ref(false)
const saving = ref(false)

onMounted(async () => {
  await store.fetchAll()
  for (const provider of store.providers) void probe(provider)
})

function preset(id: string) {
  return PROVIDERS.find(p => p.id === id) || null
}
function displayName(p: ProviderConfig): string {
  if (p.name && p.name.trim()) return p.name.trim()
  return preset(p.provider)?.name || p.provider
}
function logo(p: ProviderConfig): string {
  return preset(p.provider)?.logo || ''
}
const modelTypeOptions = computed(() => [
  { value: 'chat', label: t('modelType.chat') },
  { value: 'embedding', label: t('modelType.embedding') },
  { value: 'rerank', label: t('modelType.rerank') },
  { value: 'vision', label: t('modelType.vision') },
  { value: 'tts', label: t('modelType.tts') },
  { value: 'image', label: t('modelType.image') },
  { value: 'audio', label: t('modelType.audio') },
])
function modelTypeOf(m: string): string {
  return (edit.value?.model_types || {})[m] || 'chat'
}
function setModelType(m: string, type: string) {
  if (!edit.value) return
  const map = { ...(edit.value.model_types || {}) }
  if (!type || type === 'chat') delete map[m]
  else map[m] = type
  edit.value.model_types = map
}
function enabledModels(p: ProviderConfig): string[] {
  const disabled = new Set(p.disabled_models || [])
  return p.models.filter(m => !disabled.has(m))
}
function isDefault(p: ProviderConfig): boolean {
  return store.defaultProviderId === p.id
}

function onProviderTypeChange(value: string) {
  const p = edit.value
  if (!p) return
  const preset = PROVIDERS.find(x => x.id === value)
  if (preset?.baseUrl && !p.base_url) p.base_url = preset.baseUrl
  p.format = preset?.format || ''
}

async function probeProvider(target: ProviderConfig, key = ''): Promise<Probe> {
  if (!target.base_url) return { state: 'error', message: t('settings.baseUrlRequired') }
  const started = performance.now()
  try {
    const response = await fetch('/api/models/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: target.id,
        provider: target.provider,
        base_url: target.base_url,
        format: target.format || '',
        api_key: key || '',
      }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    const ms = Math.round(performance.now() - started)
    if (data.source === 'api' && Array.isArray(data.models) && data.models.length) {
      return { state: 'ok', count: data.models.length, ms, models: data.models }
    }
    return { state: 'error', message: data.error || t('settings.connectionFailed'), ms }
  } catch (error: unknown) {
    return { state: 'error', message: error instanceof Error ? error.message : String(error) }
  }
}

async function probe(target: ProviderConfig, key = '') {
  probes.value = { ...probes.value, [target.id]: { state: 'checking' } }
  const result = await probeProvider(target, key)
  probes.value = { ...probes.value, [target.id]: result }
}

function probeAll() {
  for (const provider of store.providers) void probe(provider)
}

function startAdd() {
  edit.value = {
    id: '',
    provider: 'custom',
    name: '',
    api_key: '',
    base_url: '',
    models: [],
    disabled_models: [],
    default_model: '',
    enabled: true,
    format: '',
    model_types: {},
  }
  editorError.value = ''
  editorProbe.value = { state: 'idle' }
  discovered.value = []
  modelSearch.value = ''
  showKey.value = false
  editHasStoredKey.value = false
  view.value = 'edit'
}

function startEdit(p: ProviderConfig) {
  edit.value = {
    ...p,
    api_key: '',
    name: p.name || '',
    models: [...p.models],
    disabled_models: [...(p.disabled_models || [])],
    format: p.format || '',
    model_types: { ...(p.model_types || {}) },
  }
  // The catalog is redacted (api_key blank, api_key_masked present): remember a
  // key already exists so the blank field can be explained and preserved.
  editHasStoredKey.value = !!((p as unknown as { api_key_masked?: string }).api_key_masked)
  editorError.value = ''
  editorProbe.value = { state: 'idle' }
  discovered.value = []
  modelSearch.value = ''
  showKey.value = false
  view.value = 'edit'
}

function backToList() {
  view.value = 'list'
  edit.value = null
  editorError.value = ''
}

async function save() {
  const p = edit.value
  if (!p) return
  editorError.value = ''
  const name = (p.name || '').trim()
  if (!p.base_url.trim()) { editorError.value = t('settings.baseUrlRequired'); return }
  if (p.provider === 'custom' && !name) { editorError.value = t('settings.providerNameRequired'); return }
  if (!p.models.length) { editorError.value = t('settings.modelsRequired'); return }
  if (!p.id) p.id = `${p.provider}_${Date.now().toString(36)}`
  p.name = name
  p.disabled_models = (p.disabled_models || []).filter(m => p.models.includes(m))
  if (!p.default_model || !p.models.includes(p.default_model) || p.disabled_models.includes(p.default_model)) {
    p.default_model = enabledModels(p)[0] || p.models[0]
  }
  saving.value = true
  try {
    await store.upsert({ ...p })
    if (!store.defaultProviderId) await store.setDefaults(p.id, p.default_model)
    backToList()
    void probe(store.providers.find(x => x.id === p.id) || p)
  } catch (error: unknown) {
    editorError.value = error instanceof Error ? error.message : String(error)
  } finally {
    saving.value = false
  }
}

async function remove(p: ProviderConfig) {
  const ok = await confirm({
    title: t('settings.remove'),
    message: `${t('settings.remove')} ${displayName(p)}?`,
    confirmLabel: t('settings.remove'),
    danger: true,
  })
  if (!ok) return
  try { await store.remove(p.id) } catch { /* surfaced by store */ }
}

async function toggleEnabled(p: ProviderConfig) {
  try { await store.upsert({ ...p, enabled: !p.enabled }) } catch { /* ignore */ }
}

async function makeDefault(p: ProviderConfig) {
  const model = p.default_model || enabledModels(p)[0] || p.models[0] || ''
  try { await store.setDefaults(p.id, model) } catch { /* ignore */ }
}

async function testEditor() {
  const p = edit.value
  if (!p) return
  editorProbe.value = { state: 'checking' }
  const result = await probeProvider(p, p.api_key)
  editorProbe.value = result
  if (result.state === 'ok' && result.models) discovered.value = result.models
}

function applyDiscovered() {
  const p = edit.value
  if (!p || !discovered.value.length) return
  p.models = [...discovered.value]
  p.disabled_models = (p.disabled_models || []).filter(m => p.models.includes(m))
  if (!p.models.includes(p.default_model)) p.default_model = ''
}

function toggleModel(model: string) {
  const p = edit.value
  if (!p) return
  const disabled = new Set(p.disabled_models || [])
  if (disabled.has(model)) disabled.delete(model)
  else disabled.add(model)
  p.disabled_models = [...disabled]
  if (disabled.has(p.default_model)) {
    p.default_model = enabledModels(p)[0] || ''
  }
}

function setDefaultModel(model: string) {
  const p = edit.value
  if (!p) return
  p.default_model = model
  p.disabled_models = (p.disabled_models || []).filter(m => m !== model)
}

function selectAll(on: boolean) {
  const p = edit.value
  if (!p) return
  p.disabled_models = on ? [] : [...p.models]
}
function invertSelection() {
  const p = edit.value
  if (!p) return
  const disabled = new Set(p.disabled_models || [])
  p.disabled_models = p.models.filter(m => !disabled.has(m))
}

const filteredModels = computed(() => {
  const models = edit.value?.models || []
  const q = modelSearch.value.trim().toLowerCase()
  return q ? models.filter(m => m.toLowerCase().includes(q)) : models
})
const enabledCount = computed(() => (edit.value ? enabledModels(edit.value).length : 0))

function fetchedSummary(): string {
  return t('settings.fetchedSummary', { n: discovered.value.length })
}

const formatOptions = computed(() => [
  { value: '', label: t('settings.formatAuto') },
  { value: 'openai', label: t('settings.formatOpenai') },
  { value: 'anthropic', label: t('settings.formatAnthropic') },
])
const providerTypeOptions = computed(() =>
  PROVIDERS.map(p => ({ value: p.id, label: t(`providers.${p.id}.name`, p.name) })),
)
</script>

<template>
  <div class="content-card provider-panel">
    <!-- ─────────────── Editor sub-page ─────────────── -->
    <template v-if="view === 'edit' && edit">
      <div class="pp-editor-head">
        <button class="pp-back" type="button" @click="backToList" :aria-label="t('settings.back')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="pp-editor-title">
          <h2>{{ edit.id ? t('settings.edit') : t('settings.addProvider') }}</h2>
          <p class="card-desc">{{ t('settings.providerDesc') }}</p>
        </div>
        <span class="pp-status" :class="editorProbe.state">
          <span class="pp-dot"></span>
          {{ editorProbe.state === 'checking' ? t('settings.testing')
            : editorProbe.state === 'ok' ? t('settings.connectionOk')
            : editorProbe.state === 'error' ? t('settings.connectionFailed')
            : t('settings.statusIdle') }}
        </span>
      </div>

      <!-- Basics -->
      <section class="pp-section">
        <h3 class="pp-section-title">{{ t('settings.providerSectionBasic') }}</h3>
        <div class="pp-grid">
          <div class="field">
            <label>{{ t('wizard.provider') }}</label>
            <AppSelect
              v-model="edit.provider"
              class="input"
              :aria-label="t('wizard.provider')"
              :options="providerTypeOptions"
              @change="onProviderTypeChange"
            />
          </div>
          <div class="field">
            <label>
              {{ t('settings.providerName') }}
              <span v-if="edit.provider === 'custom'" class="pp-req">*</span>
            </label>
            <input v-model="edit.name" :placeholder="t('settings.providerNamePlaceholder')" class="input" />
          </div>
          <div class="field pp-span">
            <label>{{ t('wizard.baseUrl') }}</label>
            <input v-model="edit.base_url" :placeholder="t('wizard.baseUrlPlaceholder')" class="input" />
          </div>
          <div class="field">
            <label>{{ t('settings.apiFormat') }}</label>
            <AppSelect v-model="edit.format" class="input" :aria-label="t('settings.apiFormat')" :options="formatOptions" />
            <p class="helper-text">{{ t('settings.apiFormatHint') }}</p>
          </div>
          <div class="field">
            <label>{{ t('wizard.defaultModel') }}</label>
            <AppSelect v-model="edit.default_model" class="input" :aria-label="t('wizard.defaultModel')" :options="enabledModels(edit)" />
            <p class="helper-text">{{ t('settings.defaultModelHint') }}</p>
          </div>
        </div>
      </section>

      <!-- Credentials -->
      <section class="pp-section">
        <div class="pp-section-head">
          <h3 class="pp-section-title">{{ t('settings.providerSectionAuth') }}</h3>
          <button class="btn btn-tonal sm" type="button" :disabled="editorProbe.state === 'checking'" @click="testEditor">
            {{ editorProbe.state === 'checking' ? t('settings.testing') : t('settings.testConnection') }}
          </button>
        </div>
        <div class="field">
          <label>{{ t('wizard.apiKey') }}</label>
          <div class="pp-key">
            <input
              v-model="edit.api_key"
              :type="showKey ? 'text' : 'password'"
              :placeholder="editHasStoredKey ? t('settings.apiKeyKept') : t('wizard.apiKeyPlaceholder')"
              class="input"
            />
            <button class="pp-key-toggle" type="button" @click="showKey = !showKey">
              {{ showKey ? t('settings.hideKey') : t('settings.showKey') }}
            </button>
          </div>
          <p v-if="editHasStoredKey" class="helper-text">{{ t('settings.apiKeyKeptHint') }}</p>
          <p v-if="editorProbe.state === 'error'" class="pp-probe err">{{ editorProbe.message }}</p>
          <p v-else-if="editorProbe.state === 'ok'" class="pp-probe ok">
            {{ t('settings.connectionOk') }} · {{ fetchedSummary() }} · {{ editorProbe.ms }}ms
          </p>
        </div>
      </section>

      <!-- Models -->
      <section class="pp-section">
        <div class="pp-section-head">
          <h3 class="pp-section-title">{{ t('settings.providerSectionModels') }} <span class="pp-count">{{ enabledCount }}/{{ edit.models.length }}</span></h3>
          <button class="btn btn-tonal sm" type="button" :disabled="editorProbe.state === 'checking'" @click="testEditor">
            {{ t('settings.fetchModels') }}
          </button>
        </div>

        <div v-if="discovered.length && discovered.join('\u0000') !== edit.models.join('\u0000')" class="pp-discovered">
          <span>{{ fetchedSummary() }}</span>
          <button class="btn btn-primary xs" type="button" @click="applyDiscovered">{{ t('settings.applyFetched') }}</button>
        </div>

        <div class="pp-model-tools">
          <input v-model="modelSearch" class="input pp-search" :placeholder="t('settings.searchModels')" />
          <button class="pp-mini" type="button" @click="selectAll(true)">{{ t('settings.selectAll') }}</button>
          <button class="pp-mini" type="button" @click="invertSelection()">{{ t('settings.invertSelection') }}</button>
          <button class="pp-mini" type="button" @click="selectAll(false)">{{ t('settings.clearSelection') }}</button>
        </div>

        <div v-if="edit.models.length" class="pp-models">
          <div v-for="m in filteredModels" :key="m" class="pp-model" :class="{ off: (edit.disabled_models || []).includes(m) }">
            <span class="pp-model-name" :title="m">{{ m }}</span>
            <select
              class="pp-type"
              :value="modelTypeOf(m)"
              :class="{ tagged: modelTypeOf(m) !== 'chat' }"
              :title="t('settings.providerModelType')"
              @change="setModelType(m, ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="opt in modelTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <button
              v-if="edit.default_model !== m"
              class="pp-star"
              type="button"
              :title="t('settings.makeDefault')"
              :disabled="(edit.disabled_models || []).includes(m)"
              @click="setDefaultModel(m)"
            >☆</button>
            <span v-else class="pp-star on" :title="t('wizard.defaultModel')">★</span>
            <input type="checkbox" class="pp-switch" :checked="!(edit.disabled_models || []).includes(m)" @change="toggleModel(m)" />
          </div>
          <p v-if="!filteredModels.length" class="helper-text">{{ t('settings.searchModels') }}</p>
        </div>
        <p v-else class="helper-text">{{ t('settings.noModelsYet') }}</p>
      </section>

      <p v-if="editorError" class="pp-error" role="alert">{{ editorError }}</p>
      <div class="pp-editor-actions">
        <button class="btn btn-primary" type="button" :disabled="saving" @click="save">{{ saving ? t('settings.saving') : t('settings.save') }}</button>
        <button class="btn btn-ghost" type="button" @click="backToList">{{ t('settings.cancel') }}</button>
      </div>
    </template>

    <!-- ─────────────── List ─────────────── -->
    <template v-else>
      <div class="pp-list-head">
        <div>
          <h2>{{ t('settings.tabs.provider') }}</h2>
          <p class="card-desc">{{ t('settings.providerDesc') }}</p>
        </div>
        <div class="pp-list-actions">
          <button class="btn btn-ghost sm" type="button" @click="probeAll">{{ t('settings.refreshStatus') }}</button>
          <button class="btn btn-primary" type="button" @click="startAdd">+ {{ t('settings.addProvider') }}</button>
        </div>
      </div>

      <div v-if="store.providers.length" class="pp-cards">
        <article v-for="p in store.providers" :key="p.id" class="pp-card" :class="{ off: !p.enabled, default: isDefault(p) }">
          <header class="pp-card-head">
            <span class="pp-logo">
              <img v-if="logo(p)" :src="logo(p)" :alt="displayName(p)" />
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
            </span>
            <div class="pp-card-id">
              <strong>{{ displayName(p) }}</strong>
              <code :title="p.base_url">{{ p.base_url || '—' }}</code>
            </div>
            <div class="pp-card-badges">
              <span v-if="isDefault(p)" class="pp-badge primary">{{ t('settings.default') }}</span>
              <span class="pp-badge">{{ enabledModels(p).length }}/{{ p.models.length }}</span>
            </div>
          </header>

          <div class="pp-card-status">
            <span class="pp-status" :class="probes[p.id]?.state || 'idle'">
              <span class="pp-dot"></span>
              {{ probes[p.id]?.state === 'checking' ? t('settings.testing')
                : probes[p.id]?.state === 'ok' ? t('settings.connectionOk')
                : probes[p.id]?.state === 'error' ? t('settings.connectionFailed')
                : t('settings.statusIdle') }}
            </span>
            <span v-if="probes[p.id]?.state === 'ok'" class="pp-meta">{{ t('settings.fetchedSummary', { n: probes[p.id]?.count || 0 }) }} · {{ probes[p.id]?.ms }}ms</span>
            <span v-else-if="probes[p.id]?.state === 'error'" class="pp-meta err" :title="probes[p.id]?.message">{{ probes[p.id]?.message }}</span>
          </div>

          <div class="pp-chips">
            <span v-for="m in enabledModels(p).slice(0, 6)" :key="m" class="pp-chip">{{ m }}</span>
            <span v-if="enabledModels(p).length > 6" class="pp-chip more">+{{ enabledModels(p).length - 6 }}</span>
            <span v-if="!p.models.length" class="pp-chip empty">{{ t('settings.noModelsYet') }}</span>
          </div>

          <footer class="pp-card-actions">
            <button class="btn btn-tonal sm" type="button" @click="startEdit(p)">{{ t('settings.edit') }}</button>
            <button class="btn btn-ghost sm" type="button" :disabled="probes[p.id]?.state === 'checking'" @click="probe(p)">{{ t('settings.testConnection') }}</button>
            <button class="btn btn-ghost sm" type="button" :disabled="isDefault(p)" @click="makeDefault(p)">{{ t('settings.makeDefault') }}</button>
            <button class="btn btn-ghost sm" type="button" @click="toggleEnabled(p)">{{ p.enabled ? t('settings.disableProvider') : t('settings.enableProvider') }}</button>
            <button class="btn btn-ghost sm danger-text" type="button" @click="remove(p)">{{ t('settings.remove') }}</button>
          </footer>
        </article>
      </div>

      <div v-else class="pp-empty">
        <p>{{ t('settings.noProviders') }}</p>
        <button class="btn btn-primary" type="button" @click="startAdd">+ {{ t('settings.addFirstProvider') }}</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.provider-panel { display: flex; flex-direction: column; gap: 18px; }

/* Editor */
.pp-editor-head { display: flex; align-items: center; gap: 14px; }
.pp-back {
  flex: none; width: 40px; height: 40px; border-radius: 12px;
  display: grid; place-items: center; cursor: pointer;
  border: 1px solid var(--md-outline-variant); background: var(--md-surface-container-low);
  color: var(--md-on-surface); transition: background-color var(--duration-short) var(--ease-out), border-color var(--duration-short) var(--ease-out);
}
.pp-back:hover { background: var(--md-surface-container); border-color: var(--md-primary); }
.pp-editor-title { flex: 1; min-width: 0; }
.pp-editor-title h2 { margin: 0; font-size: 19px; font-weight: 700; }
.pp-editor-title .card-desc { margin: 3px 0 0; }

.pp-section { display: flex; flex-direction: column; gap: 12px; padding: 16px 18px; border: 1px solid var(--md-outline-variant); border-radius: 16px; background: var(--md-surface-container-lowest); }
.pp-section-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.pp-section-title { margin: 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--md-on-surface-variant); }
.pp-count { color: var(--md-primary); font-weight: 700; margin-left: 4px; }
.pp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pp-grid .field { margin-bottom: 0; }
.pp-span { grid-column: 1 / -1; }
.pp-req { color: var(--md-error); margin-left: 2px; }

.pp-key { display: flex; align-items: center; gap: 8px; }
.pp-key .input { flex: 1; }
.pp-key-toggle { flex: none; height: 40px; padding-inline: 14px; border-radius: 10px; border: 1px solid var(--md-outline-variant); background: var(--md-surface-container); color: var(--md-on-surface); cursor: pointer; font-size: 13px; font-weight: 600; }
.pp-key-toggle:hover { border-color: var(--md-primary); color: var(--md-primary); }

.pp-status { display: inline-flex; align-items: center; gap: 7px; height: 28px; padding: 0 12px; border-radius: 999px; font-size: 12.5px; font-weight: 650; background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); white-space: nowrap; }
.pp-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: .55; }
.pp-status.ok { background: var(--md-success-container); color: var(--md-on-success-container); }
.pp-status.error { background: var(--md-error-container); color: var(--md-on-error-container); }
.pp-status.checking { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.pp-status.checking .pp-dot { animation: pp-pulse 1s ease-in-out infinite; }
@keyframes pp-pulse { 50% { opacity: .15; } }

.pp-probe { margin: 6px 0 0; font-size: 12.5px; }
.pp-probe.ok { color: var(--md-success); }
.pp-probe.err { color: var(--md-error); }

.pp-discovered { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; border-radius: 12px; background: var(--md-primary-container); color: var(--md-on-primary-container); font-size: 13px; font-weight: 600; }
.pp-model-tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pp-search { flex: 1; min-width: 160px; }
.pp-mini { height: 34px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--md-outline-variant); background: var(--md-surface-container-low); color: var(--md-on-surface-variant); font-size: 12.5px; font-weight: 600; cursor: pointer; }
.pp-mini:hover { border-color: var(--md-primary); color: var(--md-primary); }

.pp-models { display: flex; flex-direction: column; border: 1px solid var(--md-outline-variant); border-radius: 14px; overflow: hidden; max-height: 340px; overflow-y: auto; }
.pp-model { display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-top: 1px solid var(--md-outline-variant); background: var(--md-surface-container-lowest); }
.pp-model:first-child { border-top: 0; }
.pp-model.off { opacity: .5; }
.pp-model-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13.5px; }
.pp-star { flex: none; width: 30px; height: 30px; border: 0; background: transparent; color: var(--md-on-surface-variant); font-size: 17px; cursor: pointer; border-radius: 8px; }
.pp-star:hover { background: var(--md-surface-container); color: var(--md-primary); }
.pp-star.on { color: #e0a800; cursor: default; }
.pp-switch { flex: none; width: 40px; height: 22px; accent-color: var(--md-primary); cursor: pointer; }
.pp-type { flex: none; height: 28px; max-width: 132px; padding: 0 6px; border-radius: 8px; border: 1px solid var(--md-outline-variant); background: var(--md-surface-container-low); color: var(--md-on-surface-variant); font-size: 12px; cursor: pointer; }
.pp-type.tagged { border-color: color-mix(in srgb, var(--md-primary) 55%, var(--md-outline-variant)); color: var(--md-primary); font-weight: 650; }

.pp-error { color: var(--md-error); margin: 0; }
.pp-editor-actions { display: flex; gap: 10px; }

/* List */
.pp-list-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.pp-list-head h2 { margin: 0; font-size: 19px; font-weight: 700; }
.pp-list-head .card-desc { margin: 3px 0 0; }
.pp-list-actions { display: flex; gap: 8px; }

.pp-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }
.pp-card {
  display: flex; flex-direction: column; gap: 12px; padding: 16px;
  border: 1px solid var(--md-outline-variant); border-radius: 18px;
  background: var(--md-surface-container-low);
  transition: border-color var(--duration-medium) var(--ease-out), transform var(--duration-medium) var(--ease-out), box-shadow var(--duration-medium) var(--ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .pp-card:hover { transform: translateY(-1px); box-shadow: var(--shadow-1); }
}
.pp-card.default { border-color: color-mix(in srgb, var(--md-primary) 60%, var(--md-outline-variant)); }
.pp-card.off { opacity: .62; }
.pp-card-head { display: flex; align-items: center; gap: 12px; }
.pp-logo { flex: none; width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); overflow: hidden; }
.pp-logo img { width: 26px; height: 26px; }
.pp-card-id { flex: 1; min-width: 0; }
.pp-card-id strong { display: block; font-size: 15.5px; font-weight: 700; }
.pp-card-id code { display: block; font-size: 12px; color: var(--md-on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pp-card-badges { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.pp-badge { font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); font-variant-numeric: tabular-nums; }
.pp-badge.primary { background: var(--md-primary-container); color: var(--md-on-primary-container); }

.pp-card-status { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pp-meta { font-size: 12px; color: var(--md-on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.pp-meta.err { color: var(--md-error); }

.pp-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.pp-chip { font-size: 11.5px; padding: 3px 9px; border-radius: 999px; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pp-chip.more, .pp-chip.empty { background: transparent; border: 1px dashed var(--md-outline-variant); }

.pp-card-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
/* `.btn.sm` / `.btn.xs` shapes live in styles/settings.css so every panel
   agrees on one height (they used to drift between 34/30, 34/30 and 32/28). */

.pp-empty { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 40px 16px; color: var(--md-on-surface-variant); border: 1px dashed var(--md-outline-variant); border-radius: 18px; }

@media (max-width: 640px) {
  .pp-grid { grid-template-columns: 1fr; }
  .pp-cards { grid-template-columns: 1fr; }
}
</style>
