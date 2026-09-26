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
  <div class="about">
    <!-- Brand hero -->
    <section class="content-card hero">
      <div class="brand">
        <span class="brand-mark">0K</span>
        <div class="brand-text">
          <h1>0KAY <span class="version">v{{ updateResult?.current || '0.1.0' }}</span></h1>
          <p>{{ t('settings.about.tagline') }}</p>
        </div>
      </div>
      <div class="hero-actions">
        <a class="text-link" :href="PLATFORM_REPO" target="_blank" rel="noopener noreferrer">
          <span>{{ t('settings.about.repository') }}</span><span class="ext">↗</span>
        </a>
        <a class="text-link" :href="`${PLATFORM_REPO}/releases`" target="_blank" rel="noopener noreferrer">
          <span>Releases</span><span class="ext">↗</span>
        </a>
        <span class="mit-badge">MIT</span>
      </div>
    </section>

    <!-- Updates -->
    <section class="content-card">
      <header class="card-head">
        <div>
          <h2>{{ t('settings.about.description') }}</h2>
        </div>
        <div class="head-actions">
          <button class="btn btn-tonal" :disabled="aboutLoading" @click="checkUpdates">{{ t(aboutLoading ? 'settings.about.checking' : 'settings.about.check') }}</button>
          <button class="btn btn-tonal" :disabled="pluginsLoading" @click="checkPluginUpdates">{{ t(pluginsLoading ? 'settings.about.checking' : 'settings.about.plugins') }}</button>
        </div>
      </header>

      <p v-if="updateError" class="alert" role="alert">{{ updateError }}</p>
      <div v-else class="compare">
        <div class="vstat">
          <span class="vlabel">{{ t('settings.about.currentVersion') }}</span>
          <span class="vnum">v{{ updateResult?.current || '0.1.0' }}</span>
        </div>
        <span class="connector" aria-hidden="true">→</span>
        <div class="vstat" :class="{ next: updateResult?.latest }">
          <span class="vlabel">{{ t('settings.about.latestVersion') }}</span>
          <span class="vnum">{{ updateResult?.latest ? `v${updateResult.latest}` : '—' }}</span>
        </div>
        <span v-if="updateResult" class="pill" :class="updateResult.has_update ? 'warn' : (updateResult.latest ? 'ok' : 'muted')">
          {{ t(updateResult.has_update ? 'settings.about.available' : (updateResult.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
        </span>
        <a v-if="updateResult?.url" class="release-link" :href="updateResult.url" target="_blank" rel="noopener noreferrer">Release ↗</a>
      </div>

      <div v-if="pluginsError" class="alert" role="alert">{{ pluginsError }}</div>
      <div v-if="pluginResults" class="plugins">
        <div v-for="plugin in pluginResults" :key="plugin.name" class="plugin-row">
          <span class="pname">{{ plugin.name }}</span>
          <span class="pver">v{{ plugin.version || '—' }}</span>
          <span class="connector" aria-hidden="true">→</span>
          <span class="pver" :class="{ good: !!plugin.latest }">{{ plugin.latest ? `v${plugin.latest}` : '—' }}</span>
          <span class="pill" :class="plugin.error ? 'muted' : (plugin.has_update ? 'warn' : (plugin.latest ? 'ok' : 'muted'))">
            {{ plugin.error || t(plugin.has_update ? 'settings.about.available' : (plugin.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
          </span>
          <a v-if="plugin.repository" class="release-link" :href="plugin.repository" target="_blank" rel="noopener noreferrer">Repo ↗</a>
        </div>
        <p v-if="!pluginResults.length" class="muted">{{ t('settings.about.noPlugins') }}</p>
      </div>

      <div class="tip">
        <span class="tip-icon">i</span>
        <span>{{ t('settings.about.updateHint') }} <code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code></span>
      </div>
    </section>

    <!-- Credits -->
    <section class="content-card">
      <div class="people">
        <a class="person-card" :href="DEVELOPER.url" target="_blank" rel="noopener noreferrer">
          <img class="avatar" :src="DEVELOPER.avatar" :alt="DEVELOPER.login" loading="lazy" />
          <div class="person-info">
            <strong>{{ DEVELOPER.login }}</strong>
            <span>{{ t('settings.about.developerTitle') }}</span>
          </div>
          <span class="ext">↗</span>
        </a>
        <a class="person-card" :href="TEAM_URL" target="_blank" rel="noopener noreferrer">
          <img class="avatar" :src="avatarOf('RazureSOFT')" alt="RazureSOFT" loading="lazy" />
          <div class="person-info">
            <strong>RazureSOFT</strong>
            <span>{{ t('settings.about.teamTitle') }}</span>
          </div>
          <span class="ext">↗</span>
        </a>
      </div>

      <div class="section-head">
        <h2>{{ t('settings.about.contributorsTitle') }}</h2>
        <span class="muted">{{ t('settings.about.contributorsFrom') }}</span>
      </div>
      <div v-if="contributors.length" class="contrib-grid">
        <a
          v-for="person in contributors"
          :key="person.login"
          class="contrib"
          :href="person.html_url || `https://github.com/${person.login}`"
          target="_blank"
          rel="noopener noreferrer"
          :title="`${person.login}${person.contributions ? ` · ${person.contributions} commits` : ''}`"
        >
          <img :src="person.avatar_url || avatarOf(person.login, 64)" :alt="person.login" loading="lazy" />
          <span class="contrib-name">{{ person.login }}</span>
          <span v-if="person.contributions" class="contrib-count">{{ person.contributions }}</span>
        </a>
      </div>
      <p v-else class="muted">
        <a class="text-link" :href="DEVELOPER.url" target="_blank" rel="noopener noreferrer">razureink ↗</a>
      </p>

      <footer class="license">
        <span class="mit-badge">MIT</span>
        <span>© 2026 RazureSOFT</span>
        <a class="text-link" :href="`${PLATFORM_REPO}/blob/main/LICENSE`" target="_blank" rel="noopener noreferrer">LICENSE ↗</a>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.about { display: flex; flex-direction: column; gap: 16px; }

/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  background: linear-gradient(120deg, var(--md-primary-container), var(--md-surface-container-low) 70%);
  color: var(--md-on-primary-container, var(--md-on-surface));
}
.brand { display: flex; align-items: center; gap: 16px; }
.brand-mark {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 18px 18px 18px 6px;
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-size: 22px;
  font-weight: 750;
  letter-spacing: -1px;
}
.brand-text h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin: 0; }
.brand-text h1 .version { margin-left: 8px; font-size: 14px; font-weight: 500; color: var(--md-on-surface-variant); }
.brand-text p { margin: 4px 0 0; font-size: 14px; color: var(--md-on-surface-variant); }
.hero-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

/* Text links */
.text-link { display: inline-flex; align-items: center; gap: 4px; color: var(--md-primary); text-decoration: none; font-size: 13px; font-weight: 600; }
.text-link:hover { text-decoration: underline; }
.ext { font-size: 11px; opacity: 0.75; }

.mit-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
}

/* Card head */
.card-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }
.card-head h2 { font-size: 16px; margin: 0; }
.head-actions { display: flex; gap: 8px; }

/* Version compare */
.compare {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--md-surface-container);
}
.vstat { display: flex; flex-direction: column; gap: 3px; min-width: 92px; }
.vlabel { font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--md-on-surface-variant); }
.vnum { font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; }
.vstat.next .vnum { color: var(--md-success, #27633e); }
.connector { color: var(--md-on-surface-variant); font-size: 16px; }
.release-link { margin-left: auto; color: var(--md-primary); text-decoration: none; font-size: 13px; font-weight: 600; }
.release-link:hover { text-decoration: underline; }

/* Pills */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
}
.pill::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.pill.ok { background: var(--md-success-container, #d3f0d9); color: var(--md-success, #27633e); }
.pill.warn { background: #fff1cf; color: #7a5900; }
.pill.muted { background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); }

/* Plugins */
.plugins { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.plugin-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--radius-md);
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  transition: border-color 180ms, background-color 180ms;
}
.plugin-row:hover { border-color: var(--md-primary); background: var(--md-surface-container); }
.pname { font-weight: 650; min-width: 96px; }
.pver { font-variant-numeric: tabular-nums; color: var(--md-on-surface-variant); }
.pver.good { color: var(--md-success, #27633e); font-weight: 600; }
.plugin-row .release-link { margin-left: auto; }

/* Tip */
.tip {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-size: 13px;
  line-height: 1.5;
}
.tip-icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--md-on-secondary-container);
  color: var(--md-secondary-container);
  font-size: 11px;
  font-weight: 700;
  font-style: italic;
}
.tip code { background: color-mix(in srgb, var(--md-on-secondary-container) 12%, transparent); padding: 1px 6px; border-radius: 6px; }

/* Credits */
.people { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.person-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  text-decoration: none;
  color: inherit;
  transition: border-color 180ms, background-color 180ms, transform 220ms;
}
.person-card:hover { border-color: var(--md-primary); background: var(--md-surface-container); transform: translateY(-1px); }
.person-card .ext { margin-left: auto; color: var(--md-on-surface-variant); }
.avatar { width: 48px; height: 48px; border-radius: 50%; box-shadow: 0 0 0 2px var(--md-surface-container-lowest), 0 0 0 4px var(--md-primary-container); }
.person-info { display: flex; flex-direction: column; gap: 2px; }
.person-info strong { font-size: 15px; }
.person-info span { font-size: 12px; color: var(--md-on-surface-variant); }

.section-head { display: flex; align-items: baseline; gap: 10px; margin: 22px 0 12px; }
.section-head h2 { font-size: 16px; margin: 0; }
.section-head .muted { font-size: 12px; }

.contrib-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.contrib {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: 999px;
  background: var(--md-surface-container);
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  font-size: 13px;
  transition: background-color 180ms, border-color 180ms, transform 200ms;
}
.contrib:hover { background: var(--md-surface-container-high); border-color: var(--md-outline-variant); transform: translateY(-1px); }
.contrib img { width: 26px; height: 26px; border-radius: 50%; }
.contrib-name { font-weight: 550; }
.contrib-count { font-size: 11px; color: var(--md-on-surface-variant); background: var(--md-surface-container-highest); border-radius: 999px; padding: 1px 8px; }

.license { display: flex; align-items: center; gap: 12px; margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--md-outline-variant); font-size: 13px; color: var(--md-on-surface-variant); }
.license .text-link { margin-left: auto; }

.alert { color: var(--md-error, #b3261e); }
.muted { color: var(--md-on-surface-variant); }
</style>
