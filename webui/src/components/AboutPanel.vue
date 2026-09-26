<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiGet } from '../api'

const { t } = useI18n()
const currentVersion = ref('0.1.0')

type Contributor = { login: string; avatar_url?: string; html_url?: string; contributions?: number }
const contributors = ref<Contributor[]>([])
const contributorsError = ref('')

const PLATFORM_REPO = 'https://github.com/RazureSOFT/0KAY'
const TEAM_URL = 'https://github.com/RazureSOFT'
const DEVELOPER = { login: 'razureink', url: 'https://github.com/razureink', avatar: 'https://github.com/razureink.png' }
const avatarOf = (login: string, size = 96) => `https://github.com/${login}.png?size=${size}`

async function fetchVersion() {
  try {
    const result = await apiGet('/api/update/check')
    if (result?.current) currentVersion.value = String(result.current)
  } catch {
    // Older Core without the update endpoint; keep the bundled version.
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
  void fetchVersion()
  void fetchContributors()
})
</script>

<template>
  <div class="content-card about">
    <!-- Identity -->
    <header class="identity">
      <div class="app-icon" aria-hidden="true">0K</div>
      <div class="app-id">
        <h2>0KAY <span class="ver-badge">v{{ currentVersion }}</span></h2>
        <p class="app-desc">{{ t('settings.about.description') }}</p>
      </div>
      <div class="identity-actions">
        <a class="btn btn-tonal sm" :href="PLATFORM_REPO" target="_blank" rel="noopener noreferrer">{{ t('settings.about.repository') }} ↗</a>
        <a class="btn btn-tonal sm" :href="`${PLATFORM_REPO}/releases`" target="_blank" rel="noopener noreferrer">Releases ↗</a>
      </div>
    </header>

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
.app-desc { margin: 4px 0 0; font-size: 14px; color: var(--md-on-surface-variant); }
.identity-actions { display: flex; gap: 8px; flex-wrap: wrap; }

.section { display: flex; flex-direction: column; gap: 14px; }
.section-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.section-title { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 17px; font-weight: 650; color: var(--md-on-surface); }
.section-title::before { content: ''; width: 4px; height: 16px; border-radius: 2px; background: var(--md-primary); }

.btn.sm { height: 34px; padding-inline: 16px; font-size: 13px; }

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
</style>
