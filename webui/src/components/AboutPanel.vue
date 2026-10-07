<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiGet, apiPost, ApiError } from '../api'

const { t } = useI18n()
const currentVersion = ref('0.1.3')

type Contributor = { login: string; avatar_url?: string; html_url?: string; contributions?: number }
const contributors = ref<Contributor[]>([])
const contributorsError = ref('')

const PLATFORM_REPO = 'https://github.com/RazureSOFT/0KAY'
const TEAM_URL = 'https://github.com/RazureSOFT'
const DEVELOPER = { login: 'razureink', url: 'https://github.com/razureink', avatar: 'https://github.com/razureink.png' }
const avatarOf = (login: string, size = 96) => `https://github.com/${login}.png?size=${size}`

// Platform (0KAY core) update check and apply.
const aboutLoading = ref(false)
type PlatformCheck = { current: string; latest?: string; has_update: boolean; url?: string; name?: string; notes?: string; published_at?: string; source_available?: boolean }
const updateResult = ref<PlatformCheck | null>(null)
const updateError = ref('')

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

function isUpdating(plugin: string) {
  return applyState.value?.status === 'running' && applyState.value.plugin === plugin
}

async function applyUpdate(plugin: string, version?: string) {
  if (applyState.value?.status === 'running') return
  applyError.value = ''
  try {
    applyState.value = await apiPost<ApplyState>('/api/plugins/pm/update', { plugin, version: version || '' })
    startPolling()
  } catch (error: unknown) {
    applyError.value = error instanceof Error ? error.message : String(error)
  }
}

async function refreshApply() {
  try {
    applyState.value = await apiGet<ApplyState>('/api/plugins/pm/status')
  } catch {
    return // Core is restarting after a self-update; keep polling.
  }
  if (applyState.value && applyState.value.status !== 'running') {
    stopPolling()
    void checkUpdates()
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

async function checkUpdates() {
  aboutLoading.value = true
  updateError.value = ''
  try {
    const result = await apiGet<PlatformCheck>('/api/plugins/pm/check')
    updateResult.value = result
    if (result?.current) currentVersion.value = String(result.current)
  } catch (error: unknown) {
    updateError.value = error instanceof ApiError && error.status === 404
      ? t('settings.about.unsupported')
      : error instanceof Error ? error.message : String(error)
  } finally {
    aboutLoading.value = false
  }
}

async function fetchContributors() {
  try {
    // GitHub's /contributors ranking is cached server-side and can lag for
    // hours. Merge it with the authors of recent commits on the default branch
    // so a just-pushed contributor shows up immediately (bot accounts skipped);
    // duplicates are de-duplicated by login.
    const headers = { Accept: 'application/vnd.github+json' }
    const [listRes, commitsRes] = await Promise.all([
      fetch('https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100', { headers }),
      fetch('https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100', { headers }),
    ])
    if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`)
    const byLogin = new Map<string, Contributor>()
    const listed = await listRes.json()
    for (const c of Array.isArray(listed) ? listed : []) {
      if (c?.login) byLogin.set(c.login, c)
    }
    if (commitsRes.ok) {
      const commits = await commitsRes.json()
      for (const item of Array.isArray(commits) ? commits : []) {
        const author = item?.author
        if (!author?.login || author.login.endsWith('[bot]')) continue
        if (byLogin.has(author.login)) continue
        byLogin.set(author.login, {
          login: author.login,
          avatar_url: author.avatar_url,
          html_url: author.html_url,
          contributions: 0,
        })
      }
    }
    contributors.value = [...byLogin.values()].sort(
      (a, b) => (b.contributions || 0) - (a.contributions || 0) || a.login.localeCompare(b.login),
    )
  } catch (error: unknown) {
    contributorsError.value = error instanceof Error ? error.message : String(error)
    contributors.value = []
  }
}

onMounted(() => {
  void checkUpdates()
  void fetchContributors()
  void apiGet<ApplyState>('/api/plugins/pm/status')
    .then((state: ApplyState | null) => {
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
      <img class="app-icon" src="/okay-logo.svg" alt="" aria-hidden="true" />
      <div class="app-id">
        <h2>0KAY <span class="ver-badge">v{{ currentVersion }}</span></h2>
        <p class="app-desc">{{ t('settings.about.description') }}</p>
      </div>
      <div class="identity-actions">
        <a class="btn btn-tonal sm" :href="PLATFORM_REPO" target="_blank" rel="noopener noreferrer">{{ t('settings.about.repository') }} ↗</a>
        <a class="btn btn-tonal sm" :href="`${PLATFORM_REPO}/releases`" target="_blank" rel="noopener noreferrer">Releases ↗</a>
      </div>
    </header>

    <!-- Platform (0KAY core) update -->
    <section class="section">
      <div class="section-head">
        <h3 class="section-title">0KAY</h3>
        <button class="btn btn-tonal sm" :disabled="aboutLoading" @click="checkUpdates">
          {{ t(aboutLoading ? 'settings.about.checking' : 'settings.about.check') }}
        </button>
      </div>
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
          <span v-else>0KAY v{{ updateResult?.current || currentVersion }}</span>
        </div>
        <div class="us-hero-actions">
          <button v-if="updateResult?.has_update" class="btn btn-primary sm" :disabled="isUpdating('core')" @click="applyUpdate('core', updateResult.latest)">
            {{ isUpdating('core') ? t('settings.about.updating') : t('settings.about.updateNow') }}
          </button>
          <button v-if="updateResult?.source_available !== false" class="btn btn-tonal sm" :disabled="isUpdating('core')" :title="t('settings.about.betaHint')" @click="applyUpdate('core')">
            {{ isUpdating('core') ? t('settings.about.updating') : t('settings.about.beta') }}
          </button>
          <a v-if="updateResult?.url" class="btn btn-ghost sm" :href="updateResult.url" target="_blank" rel="noopener noreferrer">Release ↗</a>
        </div>
      </div>

      <div v-if="updateResult?.notes" class="us-notes">
        <p class="us-notes-title">{{ t('settings.about.whatsNew') }}</p>
        <pre class="us-notes-body">{{ updateResult.notes }}</pre>
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

.identity { display: flex; align-items: center; gap: 16px; }
.app-icon {
  flex: none;
  width: 56px;
  height: 56px;
  /* the SVG tile carries its own squircle silhouette; drop-shadow keeps the
     glow on that outline instead of a rectangular halo. */
  filter: drop-shadow(0 6px 16px color-mix(in srgb, var(--md-primary) 25%, transparent));
}
.app-id { flex: 1; min-width: 0; }
.app-id h2 { margin: 0; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
.ver-badge { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.app-desc { margin: 4px 0 0; font-size: 14px; color: var(--md-on-surface-variant); }
.identity-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.section { display: flex; flex-direction: column; gap: 14px; }
.section-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.section-title { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 17px; font-weight: 650; color: var(--md-on-surface); }
.section-title::before { content: ''; width: 4px; height: 16px; border-radius: 2px; background: var(--md-primary); }

/* `.btn.sm` / `.btn.xs` shapes live in styles/settings.css so every panel
   agrees on one height (they used to drift between 34/30, 34/30 and 32/28). */

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
.person-info .role { font-size: 13px; color: var(--md-on-surface-variant); }
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
.contrib .count { font-size: 12px; color: var(--md-on-surface-variant); }

.foot { display: flex; align-items: center; gap: 12px; padding-top: 18px; border-top: 1px solid var(--md-outline-variant); font-size: 13px; color: var(--md-on-surface-variant); }
.foot .repo-link { margin-left: auto; }

.status-chip { height: 26px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); }
.repo-link { color: var(--md-primary); text-decoration: none; font-size: 13px; font-weight: 600; white-space: nowrap; }
.repo-link:hover { text-decoration: underline; }
.muted { color: var(--md-on-surface-variant); font-size: 12px; }

/* Platform (0KAY core) update */
.us-hero {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-low);
}
.us-hero.ok { background: var(--md-success-container); color: var(--md-on-success-container); border-color: transparent; }
.us-hero.warn { background: var(--md-warning-container); color: var(--md-on-warning-container); border-color: transparent; }
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

.us-notes {
  display: flex; flex-direction: column; gap: 8px;
  padding: 14px 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
  background: var(--md-surface-container-lowest);
}
.us-notes-title { margin: 0; font-size: 13px; font-weight: 700; color: var(--md-on-surface); }
.us-notes-body {
  margin: 0; max-height: 320px; overflow: auto;
  font: 12.5px/1.6 ui-monospace, monospace; white-space: pre-wrap;
  color: var(--md-on-surface-variant);
}

.us-apply-banner {
  display: flex; flex-direction: column; gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
  background: var(--md-surface-container);
}
.us-apply-banner.done { background: var(--md-success-container); color: var(--md-on-success-container); border-color: transparent; }
.us-apply-banner.failed { background: var(--md-error-container); color: var(--md-on-error-container); border-color: transparent; }
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

.alert { color: var(--md-error); }
</style>
