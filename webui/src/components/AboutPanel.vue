<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiGet, ApiError } from '../api'

const { t } = useI18n()
const aboutLoading = ref(false)
const updateResult = ref<{ current: string; latest?: string; has_update: boolean; url?: string } | null>(null)
const updateError = ref('')
const pluginsLoading = ref(false)
const pluginResults = ref<Array<{ name: string; version: string; latest?: string; has_update: boolean; repository?: string; error?: string }> | null>(null)
const pluginsError = ref('')

type Contributor = { login: string; avatar_url?: string; html_url?: string; contributions?: number }
const contributors = ref<Contributor[]>([])
const contributorsError = ref('')

const PLATFORM_REPO = 'https://github.com/RazureSOFT/0KAY'
const TEAM_URL = 'https://github.com/RazureSOFT'
const DEVELOPER = { login: 'razureink', url: 'https://github.com/razureink', avatar: 'https://github.com/razureink.png' }
const avatarOf = (login: string, size = 96) => `https://github.com/${login}.png?size=${size}`

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
})
</script>

<template>
  <div class="content-card about">
    <!-- Identity -->
    <header class="identity">
      <div class="app-icon" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 7v10M7.5 9.5l9 5M16.5 9.5l-9 5" stroke="currentColor" stroke-width="1.4"/></svg>
      </div>
      <div class="app-id">
        <h2>0KAY <span class="ver">v{{ updateResult?.current || '0.1.0' }}</span></h2>
        <p class="card-desc">{{ t('settings.about.description') }}</p>
      </div>
      <div class="identity-actions">
        <a class="btn btn-tonal mini" :href="PLATFORM_REPO" target="_blank" rel="noopener noreferrer">{{ t('settings.about.repository') }}</a>
        <a class="btn btn-tonal mini" :href="`${PLATFORM_REPO}/releases`" target="_blank" rel="noopener noreferrer">Releases</a>
      </div>
    </header>

    <div class="divider"></div>

    <!-- Updates -->
    <section class="block">
      <div class="block-head">
        <h3>{{ t('settings.about.check') }}</h3>
        <div class="head-actions">
          <button class="btn btn-tonal" :disabled="aboutLoading" @click="checkUpdates">{{ t(aboutLoading ? 'settings.about.checking' : 'settings.about.check') }}</button>
          <button class="btn btn-tonal" :disabled="pluginsLoading" @click="checkPluginUpdates">{{ t(pluginsLoading ? 'settings.about.checking' : 'settings.about.plugins') }}</button>
        </div>
      </div>

      <p v-if="updateError" class="alert" role="alert">{{ updateError }}</p>
      <dl v-else class="kv">
        <div>
          <dt>{{ t('settings.about.currentVersion') }}</dt>
          <dd>v{{ updateResult?.current || '0.1.0' }}</dd>
        </div>
        <div>
          <dt>{{ t('settings.about.latestVersion') }}</dt>
          <dd :class="{ good: !!updateResult?.latest }">{{ updateResult?.latest ? `v${updateResult.latest}` : '—' }}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span v-if="updateResult" class="status-chip" :class="updateResult.has_update ? 'warn' : (updateResult.latest ? 'ok' : '')">
              {{ t(updateResult.has_update ? 'settings.about.available' : (updateResult.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
            </span>
            <span v-else>—</span>
          </dd>
        </div>
      </dl>
      <p v-if="updateResult?.url" class="helper-text"><a :href="updateResult.url" target="_blank" rel="noopener noreferrer">Release ↗</a></p>

      <div v-if="pluginsError" class="alert" role="alert">{{ pluginsError }}</div>
      <div v-if="pluginResults" class="plugin-list">
        <div v-for="plugin in pluginResults" :key="plugin.name" class="plugin-row">
          <span class="pname">{{ plugin.name }}</span>
          <span class="pver">v{{ plugin.version || '—' }}</span>
          <span class="parrow">→</span>
          <span class="pver" :class="{ good: !!plugin.latest }">{{ plugin.latest ? `v${plugin.latest}` : '—' }}</span>
          <span class="status-chip" :class="plugin.error ? '' : (plugin.has_update ? 'warn' : (plugin.latest ? 'ok' : ''))">
            {{ plugin.error || t(plugin.has_update ? 'settings.about.available' : (plugin.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
          </span>
          <a v-if="plugin.repository" class="repo-link" :href="plugin.repository" target="_blank" rel="noopener noreferrer">Repo ↗</a>
        </div>
        <p v-if="!pluginResults.length" class="muted">{{ t('settings.about.noPlugins') }}</p>
      </div>

      <p class="helper-text">{{ t('settings.about.updateHint') }} <code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code></p>
    </section>

    <div class="divider"></div>

    <!-- Credits -->
    <section class="block">
      <h3>{{ t('settings.about.developerTitle') }} &amp; {{ t('settings.about.teamTitle') }}</h3>
      <div class="people">
        <a class="person" :href="DEVELOPER.url" target="_blank" rel="noopener noreferrer">
          <img :src="DEVELOPER.avatar" :alt="DEVELOPER.login" loading="lazy" />
          <div>
            <strong>{{ DEVELOPER.login }}</strong>
            <span>{{ t('settings.about.developerTitle') }}</span>
          </div>
        </a>
        <a class="person" :href="TEAM_URL" target="_blank" rel="noopener noreferrer">
          <img :src="avatarOf('RazureSOFT')" alt="RazureSOFT" loading="lazy" />
          <div>
            <strong>RazureSOFT</strong>
            <span>{{ t('settings.about.teamTitle') }}</span>
          </div>
        </a>
      </div>

      <div class="block-head contributors-head">
        <h3>{{ t('settings.about.contributorsTitle') }}</h3>
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
          :title="person.login"
        >
          <img :src="person.avatar_url || avatarOf(person.login, 64)" :alt="person.login" loading="lazy" />
          <span>{{ person.login }}</span>
        </a>
      </div>
      <p v-else class="muted">
        <a class="repo-link" :href="DEVELOPER.url" target="_blank" rel="noopener noreferrer">razureink ↗</a>
      </p>
    </section>

    <div class="divider"></div>

    <footer class="foot">
      <span class="status-chip">MIT</span>
      <span class="muted">© 2026 RazureSOFT</span>
      <a class="repo-link" :href="`${PLATFORM_REPO}/blob/main/LICENSE`" target="_blank" rel="noopener noreferrer">LICENSE ↗</a>
    </footer>
  </div>
</template>

<style scoped>
.about { display: block; }

/* Identity */
.identity { display: flex; align-items: center; gap: 16px; }
.app-icon {
  flex: none;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  display: grid;
  place-items: center;
}
.app-id { flex: 1; min-width: 0; }
.app-id h2 { font-size: 20px; font-weight: 650; margin: 0; }
.app-id .ver { margin-left: 8px; font-size: 13px; font-weight: 500; color: var(--md-on-surface-variant); }
.app-id .card-desc { margin: 2px 0 0; }
.identity-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* Buttons (match app) */
.btn { height: 36px; padding: 0 16px; border: none; border-radius: var(--radius-full); font-weight: 500; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
.btn-tonal { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.btn-tonal:disabled { opacity: 0.6; cursor: not-allowed; }
.btn.mini { height: 32px; padding: 0 14px; }

.divider { height: 1px; background: var(--md-outline-variant); margin: 20px 0; }

.block { display: block; }
.block-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.block h3 { font-size: 14px; font-weight: 650; margin: 0 0 12px; color: var(--md-on-surface); }
.block-head h3 { margin: 0; }
.head-actions { display: flex; gap: 8px; }

/* Key/value rows */
.kv { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin: 14px 0 0; }
.kv > div { background: var(--md-surface-container); border-radius: var(--radius-md); padding: 12px 14px; }
.kv dt { font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: var(--md-on-surface-variant); margin-bottom: 4px; }
.kv dd { margin: 0; font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; }
.kv dd.good { color: var(--md-success); }

/* Status chips (match PluginsPage) */
.status-chip {
  height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
}
.status-chip.ok { background: var(--md-success-container); color: #0D1F06; }
.status-chip.warn { background: #ffe6a8; color: #5c4600; }

/* Plugin update rows */
.plugin-list { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.plugin-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--radius-md);
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
}
.pname { font-weight: 600; min-width: 96px; }
.pver { font-variant-numeric: tabular-nums; color: var(--md-on-surface-variant); }
.pver.good { color: var(--md-success); font-weight: 600; }
.parrow { color: var(--md-on-surface-variant); }
.repo-link { margin-left: auto; color: var(--md-primary); text-decoration: none; font-size: 13px; font-weight: 500; }
.repo-link:hover { text-decoration: underline; }

/* People */
.people { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.person {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  text-decoration: none;
  color: inherit;
  transition: border-color 180ms, background-color 180ms;
}
.person:hover { border-color: var(--md-primary); background: var(--md-surface-container); }
.person img { width: 44px; height: 44px; border-radius: 50%; flex: none; }
.person strong { display: block; font-size: 15px; }
.person span { font-size: 12px; color: var(--md-on-surface-variant); }

.contributors-head { margin-top: 20px; }
.contribs { display: flex; flex-wrap: wrap; gap: 8px; }
.contrib {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 12px 3px 3px;
  border-radius: var(--radius-full);
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
}
.contrib:hover { filter: brightness(0.97); }
.contrib img { width: 26px; height: 26px; border-radius: 50%; }

/* Footer */
.foot { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--md-on-surface-variant); }
.foot .repo-link { margin-left: auto; }

.alert { color: var(--md-error); }
.muted { color: var(--md-on-surface-variant); }
.helper-text { margin-top: 12px; font-size: 13px; color: var(--md-on-surface-variant); }
.helper-text a { color: var(--md-primary); text-decoration: none; }
.helper-text a:hover { text-decoration: underline; }
code { background: var(--md-surface-container); padding: 2px 7px; border-radius: 6px; font-size: 12px; }
</style>
