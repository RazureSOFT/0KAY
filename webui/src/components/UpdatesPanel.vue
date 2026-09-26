<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiGet, apiPost, ApiError } from '../api'

const { t } = useI18n()
const aboutLoading = ref(false)
const updateResult = ref<{ current: string; latest?: string; has_update: boolean; url?: string } | null>(null)
const updateError = ref('')
const pluginsLoading = ref(false)
const pluginResults = ref<Array<{ name: string; version: string; latest?: string; has_update: boolean; repository?: string; package?: string; can_update?: boolean; error?: string }> | null>(null)
const pluginsError = ref('')

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
const applyState = ref<ApplyState | null>(null)
const applyError = ref('')
let pollTimer: ReturnType<typeof setInterval> | null = null

// Global plugin source (GitHub mirror), e.g. https://gh-proxy.com
const githubProxy = ref('')
const proxyLoading = ref(false)
const proxySaving = ref(false)
const proxySaved = ref(false)
const proxyError = ref('')

function isUpdating(plugin: string) {
  return applyState.value?.status === 'running' && applyState.value.plugin === plugin
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
    return // Core is restarting after a self-update; keep polling.
  }
  if (applyState.value && applyState.value.status !== 'running') {
    stopPolling()
    void checkUpdates()
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

const applyLabel = computed(() => {
  switch (applyState.value?.status) {
    case 'running': return t('settings.about.updating')
    case 'done': return t('settings.about.updated')
    case 'failed': return t('settings.about.updateFailed')
    default: return ''
  }
})

const statusKind = computed<'ok' | 'warn' | 'none'>(() => {
  if (!updateResult.value) return 'none'
  if (updateResult.value.has_update) return 'warn'
  return updateResult.value.latest ? 'ok' : 'none'
})

const updateCount = computed(() => (pluginResults.value || []).filter((p) => p.has_update).length)

async function checkUpdates() {
  aboutLoading.value = true
  updateError.value = ''
  try {
    updateResult.value = await apiGet('/api/update/check')
  } catch (error: unknown) {
    updateError.value = error instanceof ApiError && error.status === 404
      ? t('settings.about.unsupported')
      : error instanceof Error ? error.message : String(error)
  } finally {
    aboutLoading.value = false
  }
}

async function checkPluginUpdates() {
  pluginsLoading.value = true
  pluginsError.value = ''
  try {
    const data = await apiGet('/api/update/check-plugins')
    pluginResults.value = data.plugins || []
  } catch (error: unknown) {
    pluginsError.value = error instanceof ApiError && error.status === 404
      ? t('settings.about.unsupported')
      : error instanceof Error ? error.message : String(error)
  } finally {
    pluginsLoading.value = false
  }
}

async function loadProxy() {
  proxyLoading.value = true
  proxyError.value = ''
  try {
    const data = await apiGet('/api/settings/updates')
    githubProxy.value = String(data?.values?.github_proxy ?? '')
  } catch {
    // Older Core without the updates section; leave the field empty.
  } finally {
    proxyLoading.value = false
  }
}

async function saveProxy() {
  proxySaving.value = true
  proxyError.value = ''
  try {
    await apiPost('/api/settings/updates', { values: { github_proxy: githubProxy.value.trim() } })
    proxySaved.value = true
    setTimeout(() => { proxySaved.value = false }, 1500)
  } catch (error: unknown) {
    proxyError.value = error instanceof Error ? error.message : String(error)
  } finally {
    proxySaving.value = false
  }
}

function useGhProxy() {
  githubProxy.value = 'https://gh-proxy.com'
  void saveProxy()
}

onMounted(() => {
  void checkUpdates()
  void checkPluginUpdates()
  void loadProxy()
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
  <div class="content-card updates">
    <!-- Global plugin source -->
    <section class="section">
      <h2 class="section-title">{{ t('settings.pluginSourceTitle') }}</h2>
      <p class="card-desc">{{ t('settings.pluginSourceDesc') }}</p>
      <div class="field">
        <label>{{ t('settings.pluginSource') }}</label>
        <input
          v-model="githubProxy"
          class="input"
          type="text"
          :disabled="proxyLoading"
          :placeholder="t('settings.pluginSourcePlaceholder')"
        />
        <p class="helper-text">{{ t('settings.pluginSourceHelp') }}</p>
        <div class="actions-row">
          <button class="btn btn-primary sm" type="button" :disabled="proxySaving" @click="saveProxy">
            {{ t('settings.save') }}
          </button>
          <button class="btn btn-tonal sm" type="button" :disabled="proxySaving" @click="useGhProxy">
            gh-proxy.com
          </button>
          <button class="btn btn-ghost sm" type="button" :disabled="proxySaving" @click="githubProxy = ''; saveProxy()">
            {{ t('settings.pluginSourceDirect') }}
          </button>
          <span v-if="proxySaved" class="ok-text">{{ t('settings.saved') }}</span>
        </div>
        <p v-if="proxyError" class="alert">{{ proxyError }}</p>
      </div>
    </section>

    <!-- Updates -->
    <section class="section">
      <div class="section-head">
        <h3 class="section-title">{{ t('settings.about.check') }}</h3>
        <div class="head-actions">
          <button class="btn btn-tonal sm" :disabled="aboutLoading" @click="checkUpdates">{{ t(aboutLoading ? 'settings.about.checking' : 'settings.about.check') }}</button>
          <button class="btn btn-tonal sm" :disabled="pluginsLoading" @click="checkPluginUpdates">{{ t(pluginsLoading ? 'settings.about.checking' : 'settings.about.plugins') }}</button>
        </div>
      </div>

      <p v-if="updateError" class="alert" role="alert">{{ updateError }}</p>
      <div v-else class="status-hero" :class="statusKind">
        <div class="status-icon" aria-hidden="true">
          <svg v-if="statusKind === 'ok'" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg v-else-if="statusKind === 'warn'" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4v11M12 19.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
        </div>
        <div class="status-text">
          <b>{{ t(statusKind === 'warn' ? 'settings.about.available' : (statusKind === 'ok' ? 'settings.about.latest' : 'settings.about.noRelease')) }}</b>
          <span v-if="updateResult?.latest">v{{ updateResult.current }} → v{{ updateResult.latest }}</span>
          <span v-else>0KAY v{{ updateResult?.current || '0.1.0' }}</span>
        </div>
        <div class="hero-actions">
          <button v-if="updateResult?.has_update" class="btn btn-primary sm" :disabled="isUpdating('core')" @click="applyUpdate('core', updateResult.latest)">
            {{ isUpdating('core') ? t('settings.about.updating') : t('settings.about.updateNow') }}
          </button>
          <button class="btn btn-tonal sm" :disabled="isUpdating('core')" :title="t('settings.about.betaHint')" @click="applyUpdate('core')">
            {{ isUpdating('core') ? t('settings.about.updating') : t('settings.about.beta') }}
          </button>
          <a v-if="updateResult?.url" class="btn btn-tonal sm" :href="updateResult.url" target="_blank" rel="noopener noreferrer">Release ↗</a>
        </div>
      </div>

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

      <div class="tiles">
        <div class="tile">
          <dt>{{ t('settings.about.currentVersion') }}</dt>
          <dd>v{{ updateResult?.current || '0.1.0' }}</dd>
        </div>
        <div class="tile" :class="{ accent: !!updateResult?.latest, good: statusKind === 'ok' }">
          <dt>{{ t('settings.about.latestVersion') }}</dt>
          <dd>{{ updateResult?.latest ? `v${updateResult.latest}` : '—' }}</dd>
        </div>
        <div class="tile">
          <dt>{{ t('settings.about.pluginUpdates') }}</dt>
          <dd>{{ updateCount }}</dd>
        </div>
      </div>

      <p v-if="pluginsError" class="alert" role="alert">{{ pluginsError }}</p>
      <div v-if="pluginResults" class="ptable">
        <div class="prow phead">
          <span>Plugin</span><span>Version</span><span>Status</span><span></span>
        </div>
        <div v-for="plugin in pluginResults" :key="plugin.name" class="prow">
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
        <p v-if="!pluginResults.length" class="empty">{{ t('settings.about.noPlugins') }}</p>
      </div>

      <p class="hint">{{ t('settings.about.updateHint') }} <code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code></p>
    </section>
  </div>
</template>

<style scoped>
.updates { display: flex; flex-direction: column; gap: 26px; }
.section { display: flex; flex-direction: column; gap: 14px; }
.section-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.section-title { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 17px; font-weight: 650; color: var(--md-on-surface); }
.section-title::before { content: ''; width: 4px; height: 16px; border-radius: 2px; background: var(--md-primary); }
.head-actions { display: flex; gap: 8px; }
.btn.sm { height: 34px; padding-inline: 16px; font-size: 13px; }
.btn.xs { height: 30px; padding-inline: 12px; font-size: 12px; }
.hero-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.ok-text { color: var(--md-success); font-size: 13px; }

.field { display: flex; flex-direction: column; gap: 8px; }
.actions-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.apply-banner { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border: 1px solid var(--md-outline-variant); border-radius: 16px; background: var(--md-surface-container); }
.apply-banner.done { background: var(--md-success-container); color: #0d1f06; border-color: transparent; }
.apply-banner.failed { background: var(--md-error-container); color: #410e0b; border-color: transparent; }
.apply-head { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.apply-head b { font-weight: 700; }
.apply-label { margin-left: auto; font-size: 13px; opacity: 0.85; }
.mode-chip { height: 22px; padding: 0 9px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 12px; font-weight: 700; background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.apply-spinner { flex: none; width: 14px; height: 14px; border-radius: 50%; border: 2px solid currentColor; border-top-color: transparent; opacity: 0.75; }
.apply-banner.running .apply-spinner { animation: apply-spin 0.8s linear infinite; }
.apply-banner.done .apply-spinner,
.apply-banner.failed .apply-spinner { display: none; }
.apply-log,
.apply-error { margin: 0; max-height: 220px; overflow: auto; font: 12px/1.5 ui-monospace, monospace; white-space: pre-wrap; color: inherit; }
@keyframes apply-spin { to { transform: rotate(360deg); } }

.prow-actions { display: inline-flex; align-items: center; gap: 10px; justify-self: end; }

.status-hero { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 18px; border: 1px solid transparent; }
.status-hero.ok { background: var(--md-success-container); color: #0d1f06; }
.status-hero.warn { background: #ffdf9e; color: #4a3800; }
.status-hero.none { background: var(--md-surface-container); color: var(--md-on-surface); border-color: var(--md-outline-variant); }
.status-icon { flex: none; width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: color-mix(in srgb, currentColor 12%, transparent); }
.status-text { flex: 1; min-width: 0; }
.status-text b { display: block; font-size: 15px; font-weight: 700; }
.status-text span { font-size: 13px; opacity: 0.8; }
.status-hero .btn.btn-primary { background: var(--md-primary); color: var(--md-on-primary); }

.tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.tile { padding: 14px 16px; border-radius: 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); }
.tile.accent { background: var(--md-primary-container); border-color: transparent; color: var(--md-on-primary-container); }
.tile.good { background: var(--md-success-container); border-color: transparent; color: #0d1f06; }
.tile dt { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.72; margin-bottom: 4px; }
.tile dd { margin: 0; font-size: 20px; font-weight: 700; font-variant-numeric: tabular-nums; }

.ptable { border: 1px solid var(--md-outline-variant); border-radius: 16px; overflow: hidden; }
.prow { display: grid; grid-template-columns: 1.4fr 1.3fr 1fr auto; gap: 12px; align-items: center; padding: 11px 16px; }
.phead { background: var(--md-surface-container); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--md-on-surface-variant); font-weight: 700; }
.prow:not(.phead) { background: var(--md-surface-container-lowest); border-top: 1px solid var(--md-outline-variant); }
.prow:not(.phead):nth-child(odd) { background: var(--md-surface-container-low); }
.pname { font-weight: 650; }
.pver { display: inline-flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
.pver em { font-style: normal; color: var(--md-on-surface-variant); }
.pver b { font-weight: 650; }
.pver b.good { color: var(--md-success); }
.arrow { color: var(--md-on-surface-variant); }
.status-chip { justify-self: start; height: 26px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); }
.status-chip.ok { background: var(--md-success-container); color: #0d1f06; }
.status-chip.warn { background: #ffdf9e; color: #4a3800; }
.repo-link { color: var(--md-primary); text-decoration: none; font-size: 13px; font-weight: 600; white-space: nowrap; }
.repo-link:hover { text-decoration: underline; }
.empty { padding: 16px; margin: 0; color: var(--md-on-surface-variant); }

.hint { margin: 2px 0 0; font-size: 13px; color: var(--md-on-surface-variant); }
.hint code { background: var(--md-surface-container); padding: 2px 8px; border-radius: 6px; font-size: 12px; }

.alert { color: var(--md-error); }
</style>
