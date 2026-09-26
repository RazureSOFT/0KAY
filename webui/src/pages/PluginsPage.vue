<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSettingsSectionsStore } from '../stores/settingsSections'

const { t } = useI18n()
const router = useRouter()
const sections = useSettingsSectionsStore()

interface RuntimePlugin {
  plugin_id: string
  name: string
  version: string
  type: string
  capabilities: string[]
  status: string
  active_tasks: number
  disabled?: boolean
}

interface InstalledEntry {
  name: string
  repository?: string
  source?: string
}

interface PluginRow {
  key: string
  id: string
  name: string
  packageName: string
  version: string
  type: string
  capabilities: string[]
  status: string
  active_tasks: number
  disabled?: boolean
  runtime: boolean
  installedSource: 'platform' | 'pm' | ''
  repository?: string
}

const plugins = ref<PluginRow[]>([])
const loading = ref(false)
const error = ref('')
const notice = ref('')
const toggling = ref<string>('')
const uninstalling = ref<string>('')
let timer: ReturnType<typeof setInterval> | null = null

const healthyCount = computed(() => plugins.value.filter((p) => p.runtime && isHealthy(p)).length)
const disabledCount = computed(() => plugins.value.filter((p) => p.runtime && p.disabled).length)
const removableCount = computed(() => plugins.value.filter((p) => p.installedSource === 'pm').length)

function shortName(pkg: string) {
  const part = pkg.includes('/') ? pkg.split('/').pop() || pkg : pkg
  return part.replace(/^0kay-/, '') || pkg
}

function repoUrl(p: PluginRow) {
  return p.repository ? p.repository.replace(/\.git$/, '') : ''
}

function isHealthy(p: PluginRow) {
  if (!p.runtime || p.disabled) return false
  return p.status.includes('HEALTHY') || p.status === 'HEALTHY'
}

async function fetchPlugins() {
  loading.value = true
  error.value = ''
  try {
    const [rtRes, instRes] = await Promise.all([fetch('/api/plugins'), fetch('/api/plugins/installed')])
    const runtime: RuntimePlugin[] = rtRes.ok ? await rtRes.json() : []
    const instData = instRes.ok ? await instRes.json() : {}
    const installed: InstalledEntry[] = Array.isArray(instData) ? instData : instData.installed || []

    const runtimeList = Array.isArray(runtime) ? runtime : []
    const byBase = new Map<string, RuntimePlugin>()
    for (const p of runtimeList) byBase.set(p.name, p)

    const rows: PluginRow[] = []
    const seen = new Set<string>()
    for (const entry of installed) {
      const pkg = entry.name
      const base = shortName(pkg)
      const rt = byBase.get(base)
      if (rt) seen.add(base)
      rows.push({
        key: pkg,
        id: rt?.plugin_id || pkg,
        name: rt?.name || shortName(pkg),
        packageName: pkg,
        version: rt?.version || '',
        type: rt?.type || '',
        capabilities: rt?.capabilities || [],
        status: rt?.status || '',
        active_tasks: rt?.active_tasks || 0,
        disabled: rt?.disabled,
        runtime: !!rt,
        installedSource: entry.source === 'pm' ? 'pm' : 'platform',
        repository: entry.repository,
      })
    }
    for (const p of runtimeList) {
      if (seen.has(p.name)) continue
      rows.push({
        key: p.name,
        id: p.plugin_id,
        name: p.name,
        packageName: p.name,
        version: p.version,
        type: p.type,
        capabilities: p.capabilities || [],
        status: p.status,
        active_tasks: p.active_tasks,
        disabled: p.disabled,
        runtime: true,
        installedSource: '',
      })
    }
    rows.sort((a, b) => Number(b.runtime) - Number(a.runtime) || a.name.localeCompare(b.name))
    plugins.value = rows
  } catch (e: any) {
    error.value = e.message || 'failed'
  } finally {
    loading.value = false
  }
}

async function togglePlugin(p: PluginRow) {
  const enable = !!p.disabled
  toggling.value = p.name || p.id
  try {
    const res = await fetch(enable ? '/api/plugins/enable' : '/api/plugins/disable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plugin: p.name }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await Promise.all([fetchPlugins(), sections.fetchSections()])
  } catch (e: any) {
    error.value = e.message || 'failed'
  } finally {
    toggling.value = ''
  }
}

async function waitForOp() {
  for (let i = 0; i < 180; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    const res = await fetch('/api/plugins/install/status')
    if (!res.ok) continue
    const state = await res.json()
    if (state.status === 'done') return
    if (state.status === 'error') throw new Error(state.error || '操作失败')
  }
  throw new Error('操作超时')
}

async function uninstall(p: PluginRow) {
  const pkg = p.packageName
  if (!window.confirm(`确定卸载 ${pkg}？`)) return
  notice.value = ''
  uninstalling.value = pkg
  try {
    const res = await fetch('/api/plugins/uninstall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package: pkg }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || `HTTP ${res.status}`)
    }
    await waitForOp()
    notice.value = `已卸载 ${pkg}`
    await Promise.all([fetchPlugins(), sections.fetchSections()])
  } catch (e: any) {
    error.value = e.message || 'failed'
  } finally {
    uninstalling.value = ''
  }
}

function sectionFor(p: PluginRow) {
  return sections.sections.find(
    (s) => s.id === p.name || s.plugin_name === p.name || s.plugin_id === p.id
  )
}

function openSettings(p: PluginRow) {
  const sec = sectionFor(p)
  router.push({ path: '/settings', query: sec ? { tab: sec.id } : {} })
}

function statusLabel(p: PluginRow) {
  if (p.disabled) return t('plugins.disabled')
  if (p.runtime) return isHealthy(p) ? t('agents.healthy') : p.status
  return p.installedSource === 'pm' ? '已安装' : '平台组件'
}

function sourceLabel(p: PluginRow) {
  if (p.runtime) return '运行时'
  return p.installedSource === 'pm' ? '第三方' : '平台'
}

onMounted(() => {
  fetchPlugins()
  sections.fetchSections()
  timer = setInterval(() => {
    if (!uninstalling.value && !toggling.value) fetchPlugins()
  }, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="plugins-page">
    <header class="pp-hero">
      <div class="pp-hero-copy">
        <p class="pp-eyebrow">0KAY · PLUGINS</p>
        <h1>{{ t('plugins.title') }}</h1>
        <p class="subtitle">{{ t('plugins.subtitle') }}</p>
      </div>
      <button class="btn btn-tonal" @click="fetchPlugins" :disabled="loading">
        {{ loading ? t('agents.refreshing') : t('agents.refresh') }}
      </button>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>
    <div v-if="notice" class="notice-banner">{{ notice }}</div>

    <section class="pp-stats" v-if="plugins.length">
      <div class="pp-stat tone-primary"><b>{{ plugins.length }}</b><span>插件总数</span></div>
      <div class="pp-stat tone-success"><b>{{ healthyCount }}</b><span>运行健康</span></div>
      <div class="pp-stat tone-muted"><b>{{ disabledCount }}</b><span>已禁用</span></div>
      <div class="pp-stat tone-muted"><b>{{ removableCount }}</b><span>可卸载</span></div>
    </section>

    <div class="plugin-grid">
      <article
        v-for="(p, i) in plugins"
        :key="p.key"
        class="plugin-card"
        :class="{ healthy: isHealthy(p), disabled: p.runtime && p.disabled }"
        :style="{ animationDelay: `${Math.min(i, 12) * 40}ms` }"
      >
        <div class="plugin-top">
          <div class="plugin-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 4v4M16 4v4M4 10h16M7 14h4v6H7v-6zM13 14h4v3h-4v-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="plugin-titles">
            <h2>{{ p.name }}<span class="source-badge" :class="p.runtime ? 'rt' : p.installedSource">{{ sourceLabel(p) }}</span></h2>
            <span class="plugin-id">{{ p.packageName }}</span>
          </div>
          <span class="status-chip" :class="{ ok: isHealthy(p), off: p.runtime && p.disabled }">
            <span class="status-dot"></span>{{ statusLabel(p) }}
          </span>
        </div>

        <dl class="plugin-meta">
          <div>
            <dt>{{ t('agents.version') }}</dt>
            <dd>{{ p.version || '—' }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.tasks') }}</dt>
            <dd>{{ p.runtime ? p.active_tasks : '—' }}</dd>
          </div>
          <div>
            <dt>{{ t('plugins.type') }}</dt>
            <dd>{{ p.runtime ? (p.type || '—') : sourceLabel(p) }}</dd>
          </div>
        </dl>

        <div class="caps">
          <span v-for="c in p.capabilities" :key="c" class="cap-chip">{{ c }}</span>
          <span v-if="!p.capabilities?.length" class="cap-chip muted">—</span>
        </div>

        <div class="card-actions">
          <label
            v-if="p.runtime"
            class="plugin-switch"
            :class="{ on: !p.disabled, busy: toggling === p.name }"
            :title="p.disabled ? t('plugins.enable') : t('plugins.disable')"
          >
            <input
              type="checkbox"
              :checked="!p.disabled"
              :disabled="toggling === p.name"
              @change="togglePlugin(p)"
            />
            <span class="plugin-switch-slider"></span>
            <span class="plugin-switch-label">
              {{ p.disabled ? t('plugins.enable') : t('plugins.disable') }}
            </span>
          </label>
          <button
            v-if="p.installedSource === 'pm'"
            class="btn btn-danger"
            :disabled="uninstalling === p.packageName"
            @click="uninstall(p)"
          >
            {{ uninstalling === p.packageName ? '卸载中…' : '卸载' }}
          </button>
          <button
            v-if="sectionFor(p)"
            class="btn btn-tonal"
            @click="openSettings(p)"
          >
            {{ t('plugins.configure') }}
          </button>
          <router-link
            v-else-if="p.name === 'agent'"
            class="btn btn-tonal"
            to="/settings?tab=agent"
          >
            {{ t('plugins.configure') }}
          </router-link>
          <a
            v-if="repoUrl(p)"
            class="btn btn-tonal"
            :href="repoUrl(p)"
            target="_blank"
            rel="noopener noreferrer"
          >仓库</a>
        </div>
      </article>

      <div v-if="plugins.length === 0 && !loading" class="empty-state">
        <p>{{ t('plugins.empty') }}</p>
        <p class="hint">{{ t('plugins.emptyHint') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Plugins page — Material 3 Expressive. #app prefixes out-rank the host layer. */
.plugins-page {
  height: 100%;
  overflow-y: auto;
  padding: clamp(22px, 3vw, 44px);
  background:
    radial-gradient(1100px 560px at 105% -12%, color-mix(in srgb, var(--md-primary) 10%, transparent), transparent 62%),
    var(--md-surface);
  color: var(--md-on-surface);
}

.pp-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
  margin-bottom: clamp(18px, 2.4vw, 28px);
  flex-wrap: wrap;
}
.pp-eyebrow { margin: 0 0 8px; color: var(--md-primary); font: 800 12px/1 ui-monospace, monospace; letter-spacing: .18em; }
.page-header h1, .pp-hero h1 { font-size: clamp(26px, 3vw, 38px); font-weight: 800; letter-spacing: -.02em; margin: 0; }
.subtitle { color: var(--md-on-surface-variant); font-size: 15px; margin-top: 8px; line-height: 1.6; max-width: 70ch; }

.error-banner { padding: 14px 18px; border-radius: 18px; background: var(--md-error-container); color: var(--md-on-error-container, #410E0B); margin-bottom: var(--space-lg); }
.notice-banner { padding: 14px 18px; border-radius: 18px; background: var(--md-secondary-container); color: var(--md-on-secondary-container); margin-bottom: var(--space-lg); }

.pp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-lg); }
.pp-stat { border-radius: 24px; padding: 18px 20px; display: flex; flex-direction: column; gap: 4px; box-shadow: var(--shadow-1); }
.pp-stat b { font-size: 32px; font-weight: 800; letter-spacing: -.02em; line-height: 1.1; }
.pp-stat span { font-size: 12px; font-weight: 700; letter-spacing: .04em; opacity: .8; }
.tone-primary { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.tone-success { background: var(--md-success-container); color: #0d3b1e; }
.tone-muted { background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }

.plugin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(312px, 1fr)); gap: var(--space-lg); }

#app .plugins-page .plugin-card {
  position: relative;
  border-radius: 28px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 50%, transparent);
  background: var(--md-surface-container-low);
  padding: 22px;
  box-shadow: var(--shadow-1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: pp-card-in 520ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
  transition: transform 300ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), box-shadow 300ms, border-color 300ms;
}
@keyframes pp-card-in { from { opacity: 0; transform: translateY(16px) scale(.985); } to { opacity: 1; transform: none; } }
#app .plugins-page .plugin-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-2); border-color: color-mix(in srgb, var(--md-primary) 30%, var(--md-outline-variant)); }
#app .plugins-page .plugin-card.healthy::before {
  content: ''; position: absolute; left: 0; top: 22px; bottom: 22px; width: 4px; border-radius: 999px; background: var(--md-success);
}
#app .plugins-page .plugin-card.disabled { opacity: .62; }

.plugin-top { display: flex; align-items: center; gap: 14px; }
.plugin-icon {
  width: 52px; height: 52px; flex-shrink: 0;
  border-radius: 18px 18px 18px 7px;
  background: var(--md-primary-container); color: var(--md-on-primary-container);
  display: flex; align-items: center; justify-content: center;
}
.plugin-titles { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.plugin-titles h2 { font-size: 17px; font-weight: 750; letter-spacing: -.01em; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.plugin-id { font-size: 12px; color: var(--md-on-surface-variant); font-family: ui-monospace, monospace; overflow-wrap: anywhere; }
.source-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); }
.source-badge.rt { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.source-badge.pm { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }

.status-chip {
  display: inline-flex; align-items: center; gap: 6px;
  height: 30px; padding: 0 12px; border-radius: 999px;
  font-size: 12px; font-weight: 700; flex-shrink: 0;
  background: var(--md-surface-container-highest); color: var(--md-on-surface-variant);
}
.status-chip .status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.status-chip.ok { background: var(--md-success-container); color: #0d3b1e; }
.status-chip.off { background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); }

.plugin-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 0; }
.plugin-meta div { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.plugin-meta dt { font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--md-on-surface-variant); }
.plugin-meta dd { font-size: 14px; font-weight: 650; color: var(--md-on-surface); font-family: ui-monospace, monospace; overflow-wrap: anywhere; margin: 0; }

.caps { display: flex; flex-wrap: wrap; gap: 6px; }
.cap-chip { height: 26px; padding: 0 12px; border-radius: 999px; background: var(--md-secondary-container); color: var(--md-on-secondary-container); font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; }
.cap-chip.muted { background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }

.card-actions { display: flex; gap: var(--space-sm); margin-top: auto; align-items: center; flex-wrap: wrap; }

.plugin-switch { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; font-size: 13px; font-weight: 650; color: var(--md-on-surface-variant); }
.plugin-switch input { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
.plugin-switch-slider {
  width: 50px; height: 30px; flex-shrink: 0;
  background: var(--md-surface-container-highest);
  border: 2px solid var(--md-outline); border-radius: 999px; position: relative;
  transition: background-color 320ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), border-color 320ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1));
}
.plugin-switch-slider::after {
  content: ''; position: absolute; top: 50%; left: 4px; width: 18px; height: 18px;
  background: var(--md-outline); border-radius: 50%; transform: translateY(-50%);
  transition: left 340ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), width 340ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), height 340ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), background-color 300ms;
}
.plugin-switch.on .plugin-switch-slider { background: var(--md-primary); border-color: var(--md-primary); }
.plugin-switch.on .plugin-switch-slider::after { left: 24px; width: 20px; height: 20px; background: var(--md-on-primary); }
.plugin-switch.busy { opacity: .6; cursor: wait; }
.plugin-switch-label { white-space: nowrap; }

#app .plugins-page .btn {
  height: 46px; padding: 0 22px; border: 1px solid transparent; border-radius: 999px;
  font-weight: 700; font-size: 14px; color: var(--md-on-surface); background: var(--md-surface-container-high);
  display: inline-flex; align-items: center; justify-content: center; text-decoration: none; cursor: pointer;
  transition: transform 240ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), background-color 180ms, box-shadow 200ms;
}
#app .plugins-page .btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow-1); }
#app .plugins-page .btn:disabled { opacity: .6; cursor: not-allowed; }
#app .plugins-page .btn-tonal { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
#app .plugins-page .btn-danger { background: var(--md-error-container); color: #410e0b; }

.empty-state { grid-column: 1 / -1; padding: var(--space-xxl); text-align: center; background: var(--md-surface-container); border-radius: 32px; color: var(--md-on-surface-variant); }
.empty-state p { margin: 0; font-size: 15px; font-weight: 600; color: var(--md-on-surface); }
.empty-state .hint { font-size: 13px; margin-top: 8px; font-weight: 400; opacity: .8; }
</style>
