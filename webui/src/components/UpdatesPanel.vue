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
const savedProxy = ref('')
const proxyLoading = ref(false)
const proxySaving = ref(false)
const proxySaved = ref(false)
const proxyError = ref('')

const proxyDirty = computed(() => githubProxy.value.trim() !== savedProxy.value)
const proxyActive = computed(() => githubProxy.value.trim() !== '')

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
    const value = String(data?.values?.github_proxy ?? '')
    githubProxy.value = value
    savedProxy.value = value
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
    const value = githubProxy.value.trim()
    await apiPost('/api/settings/updates', { values: { github_proxy: value } })
    savedProxy.value = value
    proxySaved.value = true
    setTimeout(() => { proxySaved.value = false }, 1500)
  } catch (error: unknown) {
    proxyError.value = error instanceof Error ? error.message : String(error)
  } finally {
    proxySaving.value = false
  }
}

function setProxy(value: string) {
  githubProxy.value = value
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
    <section class="us-block">
      <header class="us-head">
        <span class="us-ico" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 15a4 4 0 0 1 1.2-7.8A5.5 5.5 0 0 1 16 8.5a3.5 3.5 0 0 1 4 3.4A3.6 3.6 0 0 1 16.4 15H4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 11v7m0 0l-2.5-2.5M12 18l2.5-2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <div class="us-head-text">
          <h3 class="us-title">{{ t('settings.pluginSourceTitle') }}</h3>
          <p class="us-desc">{{ t('settings.pluginSourceDesc') }}</p>
        </div>
        <span class="us-tag" :class="{ on: proxyActive }">
          {{ proxyActive ? 'ghproxy' : t('settings.pluginSourceDirect') }}
        </span>
      </header>

      <div class="us-source">
        <div class="us-input-group">
          <span class="us-input-ico" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 14a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 10a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </span>
          <input
            v-model="githubProxy"
            class="us-input"
            type="text"
            :disabled="proxyLoading"
            :placeholder="t('settings.pluginSourcePlaceholder')"
            @keyup.enter="saveProxy"
          />
          <button class="btn btn-primary us-apply" type="button" :disabled="proxySaving || !proxyDirty" @click="saveProxy">
            {{ t('settings.save') }}
          </button>
        </div>

        <div class="us-chips">
          <button type="button" class="us-chip" :class="{ active: !proxyActive }" :disabled="proxySaving" @click="setProxy('')">
            {{ t('settings.pluginSourceDirect') }}
          </button>
          <button type="button" class="us-chip" :class="{ active: githubProxy.trim() === 'https://gh-proxy.com' }" :disabled="proxySaving" @click="setProxy('https://gh-proxy.com')">
            gh-proxy.com
          </button>
          <span v-if="proxySaved" class="us-saved">{{ t('settings.saved') }}</span>
        </div>
        <p class="helper-text">{{ t('settings.pluginSourceHelp') }}</p>
        <p v-if="proxyError" class="alert">{{ proxyError }}</p>
      </div>
    </section>

    <div class="us-divider"></div>

    <!-- Platform version -->
    <section class="us-block">
      <header class="us-head">
        <span class="us-ico" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </span>
        <div class="us-head-text">
          <h3 class="us-title">0KAY</h3>
          <p class="us-desc">{{ t('settings.about.description') }}</p>
        </div>
        <div class="us-head-actions">
          <button class="btn btn-tonal sm" :disabled="aboutLoading" @click="checkUpdates">{{ t(aboutLoading ? 'settings.about.checking' : 'settings.about.check') }}</button>
        </div>
      </header>

      <p v-if="updateError" class="alert" role="alert">{{ updateError }}</p>
      <div v-else class="us-hero" :class="statusKind">
        <div class="us-hero-icon" aria-hidden="true">
          <svg v-if="statusKind === 'ok'" width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg v-else-if="statusKind === 'warn'" width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 4v11M12 19.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
          <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
        </div>
        <div class="us-hero-text">
          <b>{{ t(statusKind === 'warn' ? 'settings.about.available' : (statusKind === 'ok' ? 'settings.about.latest' : 'settings.about.noRelease')) }}</b>
          <span v-if="updateResult?.latest">v{{ updateResult.current }} → <em>v{{ updateResult.latest }}</em></span>
          <span v-else>0KAY v{{ updateResult?.current || '0.1.0' }}</span>
        </div>
        <div class="us-hero-actions">
          <button v-if="updateResult?.has_update" class="btn btn-primary sm" :disabled="isUpdating('core')" @click="applyUpdate('core', updateResult.latest)">
            {{ isUpdating('core') ? t('settings.about.updating') : t('settings.about.updateNow') }}
          </button>
          <button class="btn btn-tonal sm" :disabled="isUpdating('core')" :title="t('settings.about.betaHint')" @click="applyUpdate('core')">
            {{ isUpdating('core') ? t('settings.about.updating') : t('settings.about.beta') }}
          </button>
          <a v-if="updateResult?.url" class="btn btn-ghost sm" :href="updateResult.url" target="_blank" rel="noopener noreferrer">Release ↗</a>
        </div>
      </div>

      <p v-if="applyError" class="alert" role="alert">{{ applyError }}</p>
      <div v-if="applyState && applyState.status !== 'idle'" class="us-apply-banner" :class="applyState.status">
        <div class="us-apply-head">
          <span class="us-spinner" aria-hidden="true"></span>
          <b>{{ applyState.package }}<span v-if="applyState.version">@{{ applyState.version }}</span><span v-else> · main</span></b>
          <span v-if="applyState.mode === 'source'" class="us-chip-tag">{{ t('settings.about.sourceMode') }}</span>
          <span class="us-apply-label">{{ applyLabel }}</span>
        </div>
        <p v-if="applyState.error" class="us-apply-error">{{ applyState.error }}</p>
        <pre v-if="applyState.log" class="us-apply-log">{{ applyState.log }}</pre>
      </div>
    </section>

    <div class="us-divider"></div>

    <!-- Components -->
    <section class="us-block">
      <header class="us-head">
        <span class="us-ico" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8"/></svg>
        </span>
        <div class="us-head-text">
          <h3 class="us-title">{{ t('settings.about.plugins') }}</h3>
          <p class="us-desc">{{ t('settings.about.updateHint') }}</p>
        </div>
        <div class="us-head-actions">
          <span class="us-count" :class="{ warn: updateCount > 0 }">{{ updateCount }}</span>
          <button class="btn btn-tonal sm" :disabled="pluginsLoading" @click="checkPluginUpdates">{{ t(pluginsLoading ? 'settings.about.checking' : 'settings.about.check') }}</button>
        </div>
      </header>

      <p v-if="pluginsError" class="alert" role="alert">{{ pluginsError }}</p>
      <div v-if="pluginResults" class="us-table">
        <div class="us-row us-thead">
          <span>Plugin</span><span>Version</span><span>Status</span><span></span>
        </div>
        <div v-for="plugin in pluginResults" :key="plugin.name" class="us-row">
          <span class="us-name">
            <span class="us-dot" :class="plugin.error ? 'bad' : (plugin.has_update ? 'warn' : (plugin.latest ? 'ok' : ''))"></span>
            {{ plugin.name }}
          </span>
          <span class="us-ver">
            <em>v{{ plugin.version || '—' }}</em>
            <span class="us-arrow">→</span>
            <b :class="{ good: !!plugin.latest }">{{ plugin.latest ? `v${plugin.latest}` : '—' }}</b>
          </span>
          <span class="us-status" :class="plugin.error ? 'bad' : (plugin.has_update ? 'warn' : (plugin.latest ? 'ok' : ''))">
            {{ plugin.error || t(plugin.has_update ? 'settings.about.available' : (plugin.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
          </span>
          <span class="us-actions">
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
            <a v-if="plugin.repository" class="us-repo" :href="plugin.repository" target="_blank" rel="noopener noreferrer" :title="plugin.repository">Repo ↗</a>
          </span>
        </div>
        <p v-if="!pluginResults.length" class="us-empty">{{ t('settings.about.noPlugins') }}</p>
      </div>
      <p class="us-foot-hint"><code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code></p>
    </section>
  </div>
</template>

<style scoped>
.updates { display: flex; flex-direction: column; gap: 4px; }

.us-block { display: flex; flex-direction: column; gap: 14px; padding: 6px 0 10px; }
.us-divider { height: 1px; background: var(--md-outline-variant); margin: 4px 0; }

.us-head { display: flex; align-items: center; gap: 12px; }
.us-ico {
  flex: none;
  width: 38px; height: 38px;
  border-radius: 12px;
  display: grid; place-items: center;
  background: color-mix(in srgb, var(--md-primary) 14%, transparent);
  color: var(--md-primary);
}
.us-head-text { flex: 1; min-width: 0; }
.us-title { margin: 0; font-size: 16px; font-weight: 700; color: var(--md-on-surface); }
.us-desc { margin: 2px 0 0; font-size: 12.5px; color: var(--md-on-surface-variant); }
.us-head-actions { display: flex; align-items: center; gap: 8px; }

.us-tag {
  flex: none;
  height: 24px; padding: 0 10px;
  border-radius: 999px;
  display: inline-flex; align-items: center;
  font-size: 12px; font-weight: 700;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
}
.us-tag.on { background: var(--md-primary-container); color: var(--md-on-primary-container); }

.us-count {
  min-width: 26px; height: 26px; padding: 0 8px;
  border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
  font-variant-numeric: tabular-nums;
}
.us-count.warn { background: #ffdf9e; color: #4a3800; }

/* Plugin source */
.us-source { display: flex; flex-direction: column; gap: 10px; }
.us-input-group {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 4px 4px 12px;
  border: 1.5px solid var(--md-outline-variant);
  border-radius: 14px;
  background: var(--md-surface-container-lowest);
  transition: border-color 160ms, box-shadow 160ms;
}
.us-input-group:focus-within {
  border-color: var(--md-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-primary) 16%, transparent);
}
.us-input-ico { flex: none; display: grid; place-items: center; color: var(--md-on-surface-variant); }
.us-input {
  flex: 1; min-width: 0;
  border: 0; outline: 0; background: transparent;
  color: var(--md-on-surface);
  font-size: 14px; padding: 9px 0;
}
.us-input::placeholder { color: var(--md-on-surface-variant); opacity: 0.7; }
.us-apply { flex: none; height: 34px; padding-inline: 18px; border-radius: 10px; }

.us-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.us-chip {
  height: 30px; padding: 0 14px;
  border-radius: 999px;
  border: 1.5px solid var(--md-outline-variant);
  background: var(--md-surface-container-low);
  color: var(--md-on-surface-variant);
  font-size: 12.5px; font-weight: 650;
  cursor: pointer;
  transition: all 160ms;
}
.us-chip:hover { border-color: var(--md-primary); color: var(--md-primary); }
.us-chip.active { background: var(--md-primary); border-color: var(--md-primary); color: var(--md-on-primary); }
.us-saved { color: var(--md-success); font-size: 13px; font-weight: 600; }

/* Version hero */
.us-hero {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-low);
}
.us-hero.ok { background: var(--md-success-container); color: #0d1f06; border-color: transparent; }
.us-hero.warn { background: linear-gradient(135deg, #ffe4a3, #ffd680); color: #4a3800; border-color: transparent; }
.us-hero.none { background: var(--md-surface-container-low); }
.us-hero-icon {
  flex: none; width: 46px; height: 46px; border-radius: 14px;
  display: grid; place-items: center;
  background: color-mix(in srgb, currentColor 12%, transparent);
}
.us-hero-text { flex: 1; min-width: 0; }
.us-hero-text b { display: block; font-size: 15px; font-weight: 750; }
.us-hero-text span { font-size: 13px; opacity: 0.85; }
.us-hero-text em { font-style: normal; font-weight: 700; }
.us-hero-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.us-hero .btn.btn-primary { background: var(--md-primary); color: var(--md-on-primary); }

/* Apply banner */
.us-apply-banner {
  display: flex; flex-direction: column; gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
  background: var(--md-surface-container);
}
.us-apply-banner.done { background: var(--md-success-container); color: #0d1f06; border-color: transparent; }
.us-apply-banner.failed { background: var(--md-error-container); color: #410e0b; border-color: transparent; }
.us-apply-head { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.us-apply-head b { font-weight: 700; }
.us-apply-label { margin-left: auto; font-size: 13px; opacity: 0.85; }
.us-chip-tag {
  height: 22px; padding: 0 9px; border-radius: 999px;
  display: inline-flex; align-items: center;
  font-size: 12px; font-weight: 700;
  background: var(--md-secondary-container); color: var(--md-on-secondary-container);
}
.us-spinner {
  flex: none; width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid currentColor; border-top-color: transparent; opacity: 0.75;
}
.us-apply-banner.running .us-spinner { animation: us-spin 0.8s linear infinite; }
.us-apply-banner.done .us-spinner,
.us-apply-banner.failed .us-spinner { display: none; }
.us-apply-log,
.us-apply-error { margin: 0; max-height: 220px; overflow: auto; font: 12px/1.5 ui-monospace, monospace; white-space: pre-wrap; color: inherit; }
@keyframes us-spin { to { transform: rotate(360deg); } }

/* Component table */
.us-table {
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
  overflow: hidden;
}
.us-row {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1.1fr) minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 11px 16px;
}
.us-thead {
  background: var(--md-surface-container);
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px;
  color: var(--md-on-surface-variant); font-weight: 700;
}
.us-row:not(.us-thead) {
  background: var(--md-surface-container-lowest);
  border-top: 1px solid var(--md-outline-variant);
  transition: background-color 140ms;
}
.us-row:not(.us-thead):hover { background: var(--md-surface-container-low); }
.us-name { display: inline-flex; align-items: center; gap: 8px; font-weight: 650; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.us-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--md-outline); }
.us-dot.ok { background: var(--md-success); }
.us-dot.warn { background: #e0a800; }
.us-dot.bad { background: var(--md-error); }
.us-ver { display: inline-flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
.us-ver em { font-style: normal; color: var(--md-on-surface-variant); }
.us-ver b { font-weight: 650; }
.us-ver b.good { color: var(--md-success); }
.us-arrow { color: var(--md-on-surface-variant); opacity: 0.6; }
.us-status {
  justify-self: start; max-width: 100%;
  height: 26px; padding: 0 10px; border-radius: 999px;
  display: inline-flex; align-items: center;
  font-size: 12px; font-weight: 600;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.us-status.ok { background: var(--md-success-container); color: #0d1f06; }
.us-status.warn { background: #ffdf9e; color: #4a3800; }
.us-status.bad { background: var(--md-error-container); color: #410e0b; }
.us-actions { display: inline-flex; align-items: center; gap: 10px; justify-self: end; }
.us-repo { color: var(--md-primary); text-decoration: none; font-size: 13px; font-weight: 600; white-space: nowrap; }
.us-repo:hover { text-decoration: underline; }
.us-empty { padding: 18px; margin: 0; color: var(--md-on-surface-variant); }
.us-foot-hint { margin: 0; font-size: 12.5px; color: var(--md-on-surface-variant); }
.us-foot-hint code { background: var(--md-surface-container); padding: 3px 8px; border-radius: 6px; font-size: 12px; }

.btn.sm { height: 34px; padding-inline: 16px; font-size: 13px; }
.btn.xs { height: 30px; padding-inline: 12px; font-size: 12px; }
.alert { color: var(--md-error); }

@media (max-width: 720px) {
  .us-row { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) auto; }
  .us-status { display: none; }
  .us-hero { flex-wrap: wrap; }
  .us-hero-actions { width: 100%; }
}
</style>
