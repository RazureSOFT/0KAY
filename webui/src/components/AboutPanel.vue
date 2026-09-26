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
  <div class="about">
    <section class="content-card hero">
      <div class="hero-main">
        <h2>0KAY <span class="ver">v{{ updateResult?.current || '0.1.0' }}</span></h2>
        <p class="card-desc">{{ t('settings.about.tagline') }}</p>
        <div class="links">
          <a :href="PLATFORM_REPO" target="_blank" rel="noopener noreferrer">{{ t('settings.about.repository') }}</a>
          <a :href="`${PLATFORM_REPO}/releases`" target="_blank" rel="noopener noreferrer">{{ t('settings.tabs.about') }} · Releases</a>
        </div>
      </div>
      <span class="license-pill">MIT</span>
    </section>

    <section class="content-card">
      <div class="card-head">
        <h3>{{ t('settings.about.description') }}</h3>
        <div class="actions-row">
          <button class="btn btn-tonal" :disabled="aboutLoading" @click="checkUpdates">{{ t(aboutLoading ? 'settings.about.checking' : 'settings.about.check') }}</button>
          <button class="btn btn-tonal" :disabled="pluginsLoading" @click="checkPluginUpdates">{{ t(pluginsLoading ? 'settings.about.checking' : 'settings.about.plugins') }}</button>
        </div>
      </div>

      <p v-if="updateError" class="alert" role="alert">{{ updateError }}</p>
      <div v-else class="update-row">
        <div class="ver-block">
          <span class="ver-label">{{ t('settings.about.currentVersion') }}</span>
          <span class="ver-num">v{{ updateResult?.current || '0.1.0' }}</span>
        </div>
        <div class="arrow">→</div>
        <div class="ver-block">
          <span class="ver-label">{{ t('settings.about.latestVersion') }}</span>
          <span class="ver-num" :class="{ ok: !!updateResult?.latest }">{{ updateResult?.latest ? `v${updateResult.latest}` : '—' }}</span>
        </div>
        <span v-if="updateResult" class="pill" :class="updateResult.has_update ? 'warn' : (updateResult.latest ? 'ok' : 'muted')">
          {{ t(updateResult.has_update ? 'settings.about.available' : (updateResult.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
        </span>
        <a v-if="updateResult?.url" class="release-link" :href="updateResult.url" target="_blank" rel="noopener noreferrer">Release ↗</a>
      </div>

      <div v-if="pluginsError" class="alert" role="alert">{{ pluginsError }}</div>
      <div v-if="pluginResults" class="plugins">
        <div v-for="plugin in pluginResults" :key="plugin.name" class="plugin-row">
          <span class="plugin-name">{{ plugin.name }}</span>
          <span class="plugin-ver">v{{ plugin.version || '—' }}</span>
          <span class="plugin-arrow">→</span>
          <span class="plugin-ver" :class="{ ok: !!plugin.latest }">{{ plugin.latest ? `v${plugin.latest}` : '—' }}</span>
          <span class="pill" :class="plugin.error ? 'muted' : (plugin.has_update ? 'warn' : (plugin.latest ? 'ok' : 'muted'))">
            {{ plugin.error || t(plugin.has_update ? 'settings.about.available' : (plugin.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
          </span>
          <a v-if="plugin.repository" class="release-link" :href="plugin.repository" target="_blank" rel="noopener noreferrer">Repo ↗</a>
        </div>
        <p v-if="!pluginResults.length" class="muted">{{ t('settings.about.noPlugins') }}</p>
      </div>

      <p class="helper-text">{{ t('settings.about.updateHint') }}</p>
      <code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code>
    </section>

    <section class="content-card">
      <div class="credits">
        <div class="credit-col">
          <h3>{{ t('settings.about.developerTitle') }}</h3>
          <a class="person" :href="DEVELOPER.url" target="_blank" rel="noopener noreferrer">
            <img :src="DEVELOPER.avatar" alt="" loading="lazy" />
            <span>{{ DEVELOPER.login }}</span>
          </a>
        </div>
        <div class="credit-col">
          <h3>{{ t('settings.about.teamTitle') }}</h3>
          <a class="person" :href="TEAM_URL" target="_blank" rel="noopener noreferrer">
            <img src="https://github.com/RazureSOFT.png" alt="" loading="lazy" />
            <span>RazureSOFT</span>
          </a>
        </div>
      </div>

      <div class="contributors">
        <div class="contrib-head">
          <h3>{{ t('settings.about.contributorsTitle') }}</h3>
          <span class="muted">{{ t('settings.about.contributorsFrom') }}</span>
        </div>
        <div v-if="contributors.length" class="contrib-grid">
          <a v-for="person in contributors" :key="person.login" class="contrib" :href="person.html_url || `https://github.com/${person.login}`" target="_blank" rel="noopener noreferrer" :title="person.login">
            <img :src="person.avatar_url || `https://github.com/${person.login}.png?size=80`" alt="" loading="lazy" />
            <span>{{ person.login }}</span>
          </a>
        </div>
        <p v-else class="muted">{{ contributorsError || 'razureink' }}</p>
      </div>

      <div class="license">
        <h3>{{ t('settings.about.licenseTitle') }}</h3>
        <p><a :href="`${PLATFORM_REPO}/blob/main/LICENSE`" target="_blank" rel="noopener noreferrer">MIT License</a> © 2026 RazureSOFT</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about { display: flex; flex-direction: column; gap: 14px; }
.hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.hero .ver { font-size: 13px; font-weight: 400; color: var(--md-on-surface-variant, #a8a2ab); margin-left: 6px; }
.links { display: flex; gap: 14px; margin-top: 8px; }
.links a, .release-link { color: var(--md-primary, #6ea8fe); text-decoration: none; }
.links a:hover, .release-link:hover { text-decoration: underline; }
.license-pill { flex: none; font-size: 12px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--md-outline, #49454f); color: var(--md-on-surface-variant, #a8a2ab); }
.card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.card-head h3 { margin: 0; font-size: 14px; }
.actions-row { display: flex; gap: 8px; }
.update-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 12px 0 6px; }
.ver-block { display: flex; flex-direction: column; gap: 2px; min-width: 84px; }
.ver-label { font-size: 11px; color: var(--md-on-surface-variant, #a8a2ab); }
.ver-num { font-size: 16px; font-weight: 600; }
.ver-num.ok { color: #37c871; }
.arrow, .plugin-arrow { color: var(--md-on-surface-variant, #a8a2ab); }
.pill { font-size: 12px; padding: 2px 10px; border-radius: 999px; border: 1px solid transparent; }
.pill.ok { color: #37c871; background: rgba(55,200,113,.12); border-color: rgba(55,200,113,.4); }
.pill.warn { color: #f0b132; background: rgba(240,177,50,.12); border-color: rgba(240,177,50,.45); }
.pill.muted { color: var(--md-on-surface-variant, #a8a2ab); background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.1); }
.plugins { display: flex; flex-direction: column; gap: 6px; margin: 10px 0; }
.plugin-row { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 10px; background: rgba(255,255,255,.04); }
.plugin-name { font-weight: 600; min-width: 90px; }
.plugin-ver { font-variant-numeric: tabular-nums; color: var(--md-on-surface-variant, #a8a2ab); }
.plugin-ver.ok { color: #37c871; }
.plugin-row .release-link { margin-left: auto; font-size: 12px; }
.credits { display: flex; gap: 28px; flex-wrap: wrap; }
.credit-col h3, .contrib-head h3, .license h3 { margin: 0 0 10px; font-size: 14px; }
.person { display: flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; }
.person img { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--md-outline, #49454f); }
.contrib-head { display: flex; align-items: baseline; gap: 10px; margin-top: 18px; }
.contrib-head h3 { margin: 0; }
.contrib-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.contrib { display: flex; align-items: center; gap: 8px; padding: 4px 10px 4px 4px; border-radius: 999px; background: rgba(255,255,255,.05); text-decoration: none; color: inherit; font-size: 13px; }
.contrib:hover { background: rgba(255,255,255,.1); }
.contrib img { width: 24px; height: 24px; border-radius: 50%; }
.license { margin-top: 18px; }
.license p { margin: 0; color: var(--md-on-surface-variant, #a8a2ab); }
.license a { color: var(--md-primary, #6ea8fe); text-decoration: none; }
.license a:hover { text-decoration: underline; }
.alert { color: #e35d5d; }
.muted { color: var(--md-on-surface-variant, #a8a2ab); }
.helper-text { margin-top: 10px; }
code { display: inline-block; padding: 4px 8px; border-radius: 6px; background: rgba(255,255,255,.06); }
</style>
