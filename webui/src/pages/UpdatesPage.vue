<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiGet, apiPost, ApiError } from '../api'

const { t } = useI18n()

type PluginUpdate = {
  name: string
  version: string
  latest?: string
  has_update: boolean
  repository?: string
  package?: string
  can_update?: boolean
  error?: string
}

type ApplyState = {
  plugin: string
  package: string
  version?: string
  mode?: 'pm' | 'source' | string
  status: 'idle' | 'running' | 'done' | 'failed'
  started?: string
  error?: string
  log?: string
}

const plugins = ref<PluginUpdate[] | null>(null)
const pluginsLoading = ref(false)
const pluginsError = ref('')
const applyState = ref<ApplyState | null>(null)
const applyError = ref('')
let pollTimer: ReturnType<typeof setInterval> | null = null

const updateCount = computed(() => (plugins.value || []).filter((p) => p.has_update).length)

function isUpdating(plugin: string) {
  return applyState.value?.status === 'running' && applyState.value.plugin === plugin
}

const applyLabel = computed(() => {
  switch (applyState.value?.status) {
    case 'running': return t('settings.about.updating')
    case 'done': return t('settings.about.updated')
    case 'failed': return t('settings.about.updateFailed')
    default: return ''
  }
})

async function checkPluginUpdates() {
  pluginsLoading.value = true
  pluginsError.value = ''
  try {
    const data = await apiGet('/api/update/check-plugins')
    plugins.value = data.plugins || []
  } catch (error: unknown) {
    pluginsError.value = error instanceof ApiError && error.status === 404
      ? t('settings.about.unsupported')
      : error instanceof Error ? error.message : String(error)
  } finally {
    pluginsLoading.value = false
  }
}

async function applyUpdate(plugin: string, version?: string) {
  if (applyState.value?.status === 'running') return
  applyError.value = ''
  try {
    applyState.value = await apiPost('/api/update/apply', { plugin, version: version || '' })
    startPolling()
  } catch (error: unknown) {
    applyError.value = error instanceof Error ? error.message : String(error)
  }
}

async function refreshApply() {
  try {
    applyState.value = await apiGet('/api/update/status')
  } catch {
    return // Core may be restarting after a self-update; keep polling.
  }
  if (applyState.value && applyState.value.status !== 'running') {
    stopPolling()
    void checkPluginUpdates()
  }
}

function startPolling() {
  if (pollTimer) return
  pollTimer = setInterval(refreshApply, 2000)
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}

onMounted(() => {
  void checkPluginUpdates()
  void apiGet('/api/update/status')
    .then((state: ApplyState) => {
      applyState.value = state
      if (state?.status === 'running') startPolling()
    })
    .catch(() => { /* older Core without update apply */ })
})

onUnmounted(stopPolling)
</script>

<template>
  <div class="updates-page">
    <header class="up-head">
      <div>
        <p class="up-eyebrow">0KAY · UPDATES</p>
        <h1>{{ t('nav.updates') }}</h1>
        <p class="up-sub">{{ t('settings.about.updateHint') }}</p>
      </div>
      <button class="btn btn-tonal" :disabled="pluginsLoading" @click="checkPluginUpdates">
        {{ pluginsLoading ? t('settings.about.checking') : t('settings.about.check') }}
      </button>
    </header>

    <p v-if="pluginsError" class="alert" role="alert">{{ pluginsError }}</p>
    <p v-if="applyError" class="alert" role="alert">{{ applyError }}</p>

    <div v-if="applyState && applyState.status !== 'idle'" class="apply-banner" :class="applyState.status">
      <div class="apply-head">
        <span class="apply-spinner" aria-hidden="true"></span>
        <b>{{ applyState.package }}<span v-if="applyState.version">@{{ applyState.version }}</span><span v-else> · main</span></b>
        <span v-if="applyState.mode === 'source'" class="mode-chip">{{ t('settings.about.sourceMode') }}</span>
        <span class="apply-label">{{ applyLabel }}</span>
      </div>
      <p v-if="applyState.error" class="apply-error">{{ applyState.error }}</p>
      <pre v-if="applyState.log" class="apply-log">{{ applyState.log }}</pre>
    </div>

    <section class="up-summary">
      <div class="tile">
        <dt>{{ t('settings.about.plugins') }}</dt>
        <dd>{{ plugins?.length ?? 0 }}</dd>
      </div>
      <div class="tile" :class="{ accent: updateCount > 0, good: !!plugins && updateCount === 0 }">
        <dt>{{ t('settings.about.pluginUpdates') }}</dt>
        <dd>{{ updateCount }}</dd>
      </div>
    </section>

    <div v-if="plugins" class="ptable">
      <div class="prow phead">
        <span>Plugin</span><span>Version</span><span>Status</span><span></span>
      </div>
      <div v-for="plugin in plugins" :key="plugin.name" class="prow">
        <span class="pname">{{ plugin.name }}</span>
        <span class="pver">
          <em>v{{ plugin.version || '—' }}</em>
          <span class="arrow">→</span>
          <b :class="{ good: !!plugin.latest }">{{ plugin.latest ? `v${plugin.latest}` : '—' }}</b>
        </span>
        <span class="status-chip" :class="plugin.error ? '' : (plugin.has_update ? 'warn' : (plugin.latest ? 'ok' : ''))">
          {{ plugin.error || t(plugin.has_update ? 'settings.about.available' : (plugin.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
        </span>
        <span class="prow-actions">
          <button
            v-if="plugin.can_update && plugin.has_update"
            class="btn btn-primary xs"
            :disabled="isUpdating(plugin.name)"
            @click="applyUpdate(plugin.name, plugin.latest)"
          >
            {{ isUpdating(plugin.name) ? t('settings.about.updating') : t('settings.about.updateNow') }}
          </button>
          <button
            v-else-if="plugin.can_update"
            class="btn btn-tonal xs"
            :disabled="isUpdating(plugin.name)"
            @click="applyUpdate(plugin.name)"
          >
            {{ isUpdating(plugin.name) ? t('settings.about.updating') : t('settings.about.syncNow') }}
          </button>
          <a v-if="plugin.repository" class="repo-link" :href="plugin.repository" target="_blank" rel="noopener noreferrer">Repo ↗</a>
        </span>
      </div>
      <p v-if="!plugins.length" class="empty">{{ t('settings.about.noPlugins') }}</p>
    </div>

    <p class="hint">{{ t('settings.about.betaHint') }} <code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code></p>
  </div>
</template>

<style scoped>
.updates-page {
  height: 100%;
  overflow-y: auto;
  padding: clamp(22px, 3vw, 44px);
  background:
    radial-gradient(1100px 560px at 105% -12%, color-mix(in srgb, var(--md-primary) 10%, transparent), transparent 62%),
    var(--md-surface);
  color: var(--md-on-surface);
}
.up-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; flex-wrap: wrap; margin-bottom: 20px; }
.up-eyebrow { margin: 0 0 6px; color: var(--md-primary); font: 800 12px/1 ui-monospace, monospace; letter-spacing: .18em; }
.up-head h1 { margin: 0; font-size: clamp(26px, 3vw, 38px); font-weight: 800; letter-spacing: -.02em; }
.up-sub { margin: 8px 0 0; color: var(--md-on-surface-variant); font-size: 14px; }
.up-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 18px; }
.tile { padding: 14px 16px; border-radius: 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); }
.tile.accent { background: var(--md-primary-container); border-color: transparent; color: var(--md-on-primary-container); }
.tile.good { background: var(--md-success-container); border-color: transparent; color: #0d1f06; }
.tile dt { font-size: 12px; text-transform: uppercase; letter-spacing: .5px; opacity: .72; margin-bottom: 4px; }
.tile dd { margin: 0; font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }

.ptable { border: 1px solid var(--md-outline-variant); border-radius: 16px; overflow: hidden; }
.prow { display: grid; grid-template-columns: 1.4fr 1.3fr 1fr auto; gap: 12px; align-items: center; padding: 11px 16px; }
.phead { background: var(--md-surface-container); font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: var(--md-on-surface-variant); font-weight: 700; }
.prow:not(.phead) { background: var(--md-surface-container-lowest); border-top: 1px solid var(--md-outline-variant); }
.prow:not(.phead):nth-child(odd) { background: var(--md-surface-container-low); }
.pname { font-weight: 650; }
.pver { display: inline-flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
.pver em { font-style: normal; color: var(--md-on-surface-variant); }
.pver b { font-weight: 650; }
.pver b.good { color: var(--md-success); }
.arrow { color: var(--md-on-surface-variant); }
.status-chip {
  justify-self: start; height: 26px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center;
  font-size: 12px; font-weight: 600; background: var(--md-surface-container-highest); color: var(--md-on-surface-variant);
}
.status-chip.ok { background: var(--md-success-container); color: #0d1f06; }
.status-chip.warn { background: #ffdf9e; color: #4a3800; }
.repo-link { color: var(--md-primary); text-decoration: none; font-size: 13px; font-weight: 600; white-space: nowrap; }
.repo-link:hover { text-decoration: underline; }
.empty { padding: 16px; margin: 0; color: var(--md-on-surface-variant); }
.prow-actions { display: inline-flex; align-items: center; gap: 10px; justify-self: end; }

.btn.sm { height: 34px; padding-inline: 16px; font-size: 13px; }
.btn.xs { height: 30px; padding-inline: 12px; font-size: 12px; }

.apply-banner {
  display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; margin-bottom: 18px;
  border: 1px solid var(--md-outline-variant); border-radius: 16px; background: var(--md-surface-container);
}
.apply-banner.done { background: var(--md-success-container); color: #0d1f06; border-color: transparent; }
.apply-banner.failed { background: var(--md-error-container); color: #410e0b; border-color: transparent; }
.apply-head { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.apply-head b { font-weight: 700; }
.apply-label { margin-left: auto; font-size: 13px; opacity: .85; }
.mode-chip { height: 22px; padding: 0 9px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 12px; font-weight: 700; background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.apply-spinner { flex: none; width: 14px; height: 14px; border-radius: 50%; border: 2px solid currentColor; border-top-color: transparent; opacity: .75; }
.apply-banner.running .apply-spinner { animation: up-spin .8s linear infinite; }
.apply-banner.done .apply-spinner, .apply-banner.failed .apply-spinner { display: none; }
.apply-log, .apply-error { margin: 0; max-height: 220px; overflow: auto; font: 12px/1.5 ui-monospace, monospace; white-space: pre-wrap; color: inherit; }
@keyframes up-spin { to { transform: rotate(360deg); } }

.hint { margin: 16px 0 0; font-size: 13px; color: var(--md-on-surface-variant); }
.hint code { background: var(--md-surface-container); padding: 2px 8px; border-radius: 6px; font-size: 12px; }
.alert { color: var(--md-error); }
</style>
