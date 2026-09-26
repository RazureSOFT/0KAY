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

type Contributor = { login: string; avatar_url?: string; html_url?: string; contributions?: number }
const contributors = ref<Contributor[]>([])
const contributorsError = ref('')

type ApplyState = {
  plugin: string
  package: string
  version?: string
  status: 'idle' | 'running' | 'done' | 'failed'
  started?: string
  error?: string
  log?: string
}
const applyState = ref<ApplyState | null>(null)
const applyError = ref('')
let pollTimer: ReturnType<typeof setInterval> | null = null

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

const PLATFORM_REPO = 'https://github.com/RazureSOFT/0KAY'
const TEAM_URL = 'https://github.com/RazureSOFT'
const DEVELOPER = { login: 'razureink', url: 'https://github.com/razureink', avatar: 'https://github.com/razureink.png' }
const avatarOf = (login: string, size = 96) => `https://github.com/${login}.png?size=${size}`

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

async function fetchContributors() {
  try {
    const res = await fetch('https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100', {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    contributors.value = Array.isArray(data) ? data : []
  } catch (error: unknown) {
    contributorsError.value = error instanceof Error ? error.message : String(error)
    contributors.value = []
  }
}

onMounted(() => {
  void checkUpdates()
  void checkPluginUpdates()
  void fetchContributors()
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
  <div class="content-card about">
    <!-- Identity -->
    <header class="identity">
      <div class="app-icon" aria-hidden="true">0K</div>
      <div class="app-id">
        <h2>0KAY <span class="ver-badge">v{{ updateResult?.current || '0.1.0' }}</span></h2>
        <p class="app-desc">{{ t('settings.about.description') }}</p>
      </div>
      <div class="identity-actions">
        <a class="btn btn-tonal sm" :href="PLATFORM_REPO" target="_blank" rel="noopener noreferrer">{{ t('settings.about.repository') }} ↗</a>
        <a class="btn btn-tonal sm" :href="`${PLATFORM_REPO}/releases`" target="_blank" rel="noopener noreferrer">Releases ↗</a>
      </div>
    </header>

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
            <a v-if="plugin.repository" class="repo-link" :href="plugin.repository" target="_blank" rel="noopener noreferrer">Repo ↗</a>
          </span>
        </div>
        <p v-if="!pluginResults.length" class="empty">{{ t('settings.about.noPlugins') }}</p>
      </div>

      <p class="hint">{{ t('settings.about.updateHint') }} <code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code></p>
    </section>

    <!-- Credits -->
    <section class="section">
      <h3 class="section-title">{{ t('settings.about.developerTitle') }} &amp; {{ t('settings.about.teamTitle') }}</h3>
      <div class="credits">
        <a class="person" :href="DEVELOPER.url" target="_blank" rel="noopener noreferrer">
          <img :src="DEVELOPER.avatar" :alt="DEVELOPER.login" loading="lazy" />
          <div class="person-info">
            <span class="name">{{ DEVELOPER.login }}</span>
            <span class="role">{{ t('settings.about.developerTitle') }}</span>
          </div>
          <span class="go">↗</span>
        </a>
        <a class="person" :href="TEAM_URL" target="_blank" rel="noopener noreferrer">
          <img :src="avatarOf('RazureSOFT')" alt="RazureSOFT" loading="lazy" />
          <div class="person-info">
            <span class="name">RazureSOFT</span>
            <span class="role">{{ t('settings.about.teamTitle') }}</span>
          </div>
          <span class="go">↗</span>
        </a>
      </div>

      <div class="section-head contributors-head">
        <h3 class="section-title">{{ t('settings.about.contributorsTitle') }}</h3>
        <span class="muted">{{ t('settings.about.contributorsFrom') }}</span>
      </div>
      <div v-if="contributors.length" class="contribs">
        <a
          v-for="person in contributors"
          :key="person.login"
          class="contrib"
          :href="person.html_url || `https://github.com/${person.login}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="person.avatar_url || avatarOf(person.login, 64)" :alt="person.login" loading="lazy" />
          <span class="login">{{ person.login }}</span>
          <span v-if="person.contributions" class="count">{{ person.contributions }}</span>
        </a>
      </div>
      <p v-else class="muted">
        <a class="repo-link" :href="DEVELOPER.url" target="_blank" rel="noopener noreferrer">razureink ↗</a>
      </p>
    </section>

    <footer class="foot">
      <span class="status-chip">MIT</span>
      <span>© 2026 RazureSOFT</span>
      <a class="repo-link" :href="`${PLATFORM_REPO}/blob/main/LICENSE`" target="_blank" rel="noopener noreferrer">LICENSE ↗</a>
    </footer>
  </div>
</template>

<style scoped>
.about { display: flex; flex-direction: column; gap: 26px; }

/* Identity */
.identity { display: flex; align-items: center; gap: 16px; }
.app-icon {
  flex: none;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--md-primary);
  color: var(--md-on-primary);
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -1px;
  box-shadow: 0 6px 16px color-mix(in srgb, var(--md-primary) 35%, transparent);
}
.app-id { flex: 1; min-width: 0; }
.app-id h2 { margin: 0; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
.ver-badge { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.app-desc { margin: 4px 0 0; font-size: 13.5px; color: var(--md-on-surface-variant); }
.identity-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* Sections */
.section { display: flex; flex-direction: column; gap: 14px; }
.section-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.section-title { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 17px; font-weight: 650; color: var(--md-on-surface); }
.section-title::before { content: ''; width: 4px; height: 16px; border-radius: 2px; background: var(--md-primary); }
.head-actions { display: flex; gap: 8px; }

/* Buttons — use app classes, only shrink */
.btn.sm { height: 34px; padding-inline: 16px; font-size: 13px; }
.btn.xs { height: 30px; padding-inline: 12px; font-size: 12px; }
.hero-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }

/* Update progress */
.apply-banner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
  background: var(--md-surface-container);
}
.apply-banner.done { background: var(--md-success-container); color: #0d1f06; border-color: transparent; }
.apply-banner.failed { background: var(--md-error-container); color: #410e0b; border-color: transparent; }
.apply-head { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.apply-head b { font-weight: 700; }
.apply-label { margin-left: auto; font-size: 12.5px; opacity: 0.85; }
.apply-spinner {
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  opacity: 0.75;
}
.apply-banner.running .apply-spinner { animation: apply-spin 0.8s linear infinite; }
.apply-banner.done .apply-spinner,
.apply-banner.failed .apply-spinner { display: none; }
.apply-log,
.apply-error {
  margin: 0;
  max-height: 220px;
  overflow: auto;
  font: 12px/1.5 ui-monospace, monospace;
  white-space: pre-wrap;
  color: inherit;
}
@keyframes apply-spin { to { transform: rotate(360deg); } }

.prow-actions { display: inline-flex; align-items: center; gap: 10px; justify-self: end; }

/* Status hero */
.status-hero { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 18px; border: 1px solid transparent; }
.status-hero.ok { background: var(--md-success-container); color: #0d1f06; }
.status-hero.warn { background: #ffdf9e; color: #4a3800; }
.status-hero.none { background: var(--md-surface-container); color: var(--md-on-surface); border-color: var(--md-outline-variant); }
.status-icon { flex: none; width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: color-mix(in srgb, currentColor 12%, transparent); }
.status-text { flex: 1; min-width: 0; }
.status-text b { display: block; font-size: 15px; font-weight: 700; }
.status-text span { font-size: 13px; opacity: 0.8; }
.status-hero .btn.btn-primary { background: var(--md-primary); color: var(--md-on-primary); }

/* Stat tiles */
.tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.tile { padding: 14px 16px; border-radius: 16px; background: var(--md-surface-container); border: 1px solid var(--md-outline-variant); }
.tile.accent { background: var(--md-primary-container); border-color: transparent; color: var(--md-on-primary-container); }
.tile.good { background: var(--md-success-container); border-color: transparent; color: #0d1f06; }
.tile dt { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.72; margin-bottom: 4px; }
.tile dd { margin: 0; font-size: 20px; font-weight: 700; font-variant-numeric: tabular-nums; }

/* Plugin table */
.ptable { border: 1px solid var(--md-outline-variant); border-radius: 16px; overflow: hidden; }
.prow { display: grid; grid-template-columns: 1.4fr 1.3fr 1fr auto; gap: 12px; align-items: center; padding: 11px 16px; }
.phead { background: var(--md-surface-container); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--md-on-surface-variant); font-weight: 700; }
.prow:not(.phead) { background: var(--md-surface-container-lowest); border-top: 1px solid var(--md-outline-variant); }
.prow:not(.phead):nth-child(odd) { background: var(--md-surface-container-low); }
.pname { font-weight: 650; }
.pver { display: inline-flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
.pver em { font-style: normal; color: var(--md-on-surface-variant); }
.pver b { font-weight: 650; }
.pver b.good { color: var(--md-success); }
.arrow { color: var(--md-on-surface-variant); }
.status-chip {
  justify-self: start;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
}
.status-chip.ok { background: var(--md-success-container); color: #0d1f06; }
.status-chip.warn { background: #ffdf9e; color: #4a3800; }
.repo-link { color: var(--md-primary); text-decoration: none; font-size: 13px; font-weight: 600; white-space: nowrap; }
.repo-link:hover { text-decoration: underline; }
.empty { padding: 16px; margin: 0; color: var(--md-on-surface-variant); }

.hint { margin: 2px 0 0; font-size: 13px; color: var(--md-on-surface-variant); }
.hint code { background: var(--md-surface-container); padding: 2px 8px; border-radius: 6px; font-size: 12px; }

/* Credits */
.credits { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
.person {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 18px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  text-decoration: none;
  color: inherit;
  transition: border-color 180ms, background-color 180ms, transform 200ms;
}
.person:hover { border-color: var(--md-primary); background: var(--md-surface-container); transform: translateY(-1px); }
.person img { width: 54px; height: 54px; border-radius: 50%; flex: none; box-shadow: 0 0 0 3px var(--md-surface-container-low), 0 0 0 4px var(--md-outline-variant); }
.person-info { display: flex; flex-direction: column; min-width: 0; }
.person-info .name { font-size: 16px; font-weight: 650; }
.person-info .role { font-size: 12.5px; color: var(--md-on-surface-variant); }
.person .go { margin-left: auto; color: var(--md-primary); font-weight: 700; }

.contributors-head { margin-top: 6px; }
.contribs { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; }
.contrib {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border-radius: 16px;
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  text-decoration: none;
  color: inherit;
  transition: border-color 180ms, background-color 180ms, transform 200ms;
}
.contrib:hover { border-color: var(--md-primary); background: var(--md-surface-container); transform: translateY(-1px); }
.contrib img { width: 46px; height: 46px; border-radius: 50%; }
.contrib .login { font-size: 12px; font-weight: 600; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.contrib .count { font-size: 11px; color: var(--md-on-surface-variant); }

/* Footer */
.foot { display: flex; align-items: center; gap: 12px; padding-top: 18px; border-top: 1px solid var(--md-outline-variant); font-size: 13px; color: var(--md-on-surface-variant); }
.foot .repo-link { margin-left: auto; }

.alert { color: var(--md-error); }
.muted { color: var(--md-on-surface-variant); font-size: 12px; }
</style>
