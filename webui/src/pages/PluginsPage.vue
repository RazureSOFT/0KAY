<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSettingsSectionsStore } from '../stores/settingsSections'

const { t } = useI18n()
const router = useRouter()
const sections = useSettingsSectionsStore()

interface PluginRow {
  plugin_id: string
  name: string
  version: string
  type: string
  capabilities: string[]
  status: string
  active_tasks: number
  disabled?: boolean
}

const plugins = ref<PluginRow[]>([])
const loading = ref(false)
const error = ref('')
const toggling = ref<string>('')
let timer: ReturnType<typeof setInterval> | null = null

async function fetchPlugins() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/plugins')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    plugins.value = Array.isArray(data) ? data : []
  } catch (e: any) {
    error.value = e.message || 'failed'
  } finally {
    loading.value = false
  }
}

function isHealthy(p: PluginRow) {
  if (p.disabled) return false
  return p.status.includes('HEALTHY') || p.status === 'HEALTHY'
}

async function togglePlugin(p: PluginRow) {
  const enable = !!p.disabled
  toggling.value = p.name || p.plugin_id
  try {
    const res = await fetch(enable ? '/api/plugins/enable' : '/api/plugins/disable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plugin: p.name }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    // Refresh settings sections so disabled plugin tabs disappear/appear.
    await Promise.all([fetchPlugins(), sections.fetchSections()])
  } catch (e: any) {
    error.value = e.message || 'failed'
  } finally {
    toggling.value = ''
  }
}

function sectionFor(p: PluginRow) {
  return sections.sections.find(
    (s) => s.id === p.name || s.plugin_name === p.name || s.plugin_id === p.plugin_id
  )
}

function openSettings(p: PluginRow) {
  const sec = sectionFor(p)
  router.push({ path: '/settings', query: sec ? { tab: sec.id } : {} })
}

function capLabel(c: string) {
  return c
}

onMounted(() => {
  fetchPlugins()
  sections.fetchSections()
  timer = setInterval(fetchPlugins, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="plugins-page">
    <header class="page-header">
      <div>
        <h1>{{ t('plugins.title') }}</h1>
        <p class="subtitle">{{ t('plugins.subtitle') }}</p>
      </div>
      <button class="btn btn-tonal" @click="fetchPlugins" :disabled="loading">
        {{ loading ? t('agents.refreshing') : t('agents.refresh') }}
      </button>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <div class="plugin-grid">
      <article
        v-for="p in plugins"
        :key="p.plugin_id"
        class="plugin-card"
        :class="{ healthy: isHealthy(p), disabled: p.disabled }"
      >
        <div class="plugin-top">
          <div class="plugin-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 4v4M16 4v4M4 10h16M7 14h4v6H7v-6zM13 14h4v3h-4v-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="plugin-titles">
            <h2>{{ p.name || p.plugin_id }}</h2>
            <span class="plugin-id">{{ p.plugin_id }}</span>
          </div>
          <span class="status-chip" :class="{ ok: isHealthy(p) }">
            {{ p.disabled ? t('plugins.disabled') : isHealthy(p) ? t('agents.healthy') : p.status }}
          </span>
        </div>

        <dl class="plugin-meta">
          <div>
            <dt>{{ t('agents.version') }}</dt>
            <dd>{{ p.version || '—' }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.tasks') }}</dt>
            <dd>{{ p.active_tasks }}</dd>
          </div>
          <div class="full">
            <dt>{{ t('plugins.type') }}</dt>
            <dd>{{ p.type || '—' }}</dd>
          </div>
        </dl>

        <div class="caps">
          <span v-for="c in p.capabilities" :key="c" class="cap-chip">{{ capLabel(c) }}</span>
          <span v-if="!p.capabilities?.length" class="cap-chip muted">—</span>
        </div>

        <div class="card-actions">
          <label
            class="plugin-switch"
            :class="{ on: !p.disabled, busy: toggling === (p.name || p.plugin_id) }"
            :title="p.disabled ? t('plugins.enable') : t('plugins.disable')"
          >
            <input
              type="checkbox"
              :checked="!p.disabled"
              :disabled="toggling === (p.name || p.plugin_id)"
              @change="togglePlugin(p)"
            />
            <span class="plugin-switch-slider"></span>
            <span class="plugin-switch-label">
              {{ p.disabled ? t('plugins.enable') : t('plugins.disable') }}
            </span>
          </label>
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
.plugins-page {
  height: 100%;
  overflow-y: auto;
  padding: var(--space-xl);
  background: var(--md-surface);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.page-header h1 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--md-on-surface);
}

.subtitle {
  color: var(--md-on-surface-variant);
  font-size: 14px;
  margin-top: 4px;
}

.error-banner {
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  background: var(--md-error-container);
  color: #410E0B;
  margin-bottom: var(--space-lg);
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.plugin-card {
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-1);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.plugin-card.healthy {
  border-color: color-mix(in srgb, var(--md-success) 40%, var(--md-outline-variant));
}

.plugin-card.disabled {
  opacity: 0.65;
}

.plugin-top {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.plugin-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
}

.plugin-titles {
  flex: 1;
  min-width: 0;
}

.plugin-titles h2 {
  font-size: 16px;
  font-weight: 600;
  text-transform: capitalize;
}

.plugin-id {
  font-size: 12px;
  color: var(--md-on-surface-variant);
  font-family: monospace;
}

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

.status-chip.ok {
  background: var(--md-success-container);
  color: #0D1F06;
}

.plugin-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.plugin-meta .full {
  grid-column: 1 / -1;
}

.plugin-meta dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--md-on-surface-variant);
  margin-bottom: 2px;
}

.plugin-meta dd {
  font-size: 14px;
  font-weight: 500;
  color: var(--md-on-surface);
  font-family: monospace;
  word-break: break-all;
}

.caps {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cap-chip {
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-size: 12px;
  display: inline-flex;
  align-items: center;
}

.cap-chip.muted {
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
}

.card-actions {
  display: flex;
  gap: var(--space-sm);
  margin-top: auto;
  align-items: center;
  flex-wrap: wrap;
}

.plugin-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

.plugin-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.plugin-switch-slider {
  width: 44px;
  height: 26px;
  background: var(--md-surface-container-highest);
  border: 2px solid var(--md-outline);
  border-radius: var(--radius-full);
  position: relative;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  flex-shrink: 0;
}

.plugin-switch-slider::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 3px;
  width: 16px;
  height: 16px;
  background: var(--md-outline);
  border-radius: 50%;
  transform: translateY(-50%);
  transition: left var(--transition-fast), background var(--transition-fast), width var(--transition-fast), height var(--transition-fast);
}

.plugin-switch.on .plugin-switch-slider {
  background: var(--md-primary);
  border-color: var(--md-primary);
}

.plugin-switch.on .plugin-switch-slider::after {
  left: 21px;
  width: 18px;
  height: 18px;
  background: var(--md-on-primary);
}

.plugin-switch.busy {
  opacity: 0.6;
  cursor: wait;
}

.plugin-switch-label {
  white-space: nowrap;
}

.btn {
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-tonal {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

.btn-tonal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  grid-column: 1 / -1;
  padding: var(--space-xxl);
  text-align: center;
  background: var(--md-surface-container);
  border-radius: var(--radius-lg);
  color: var(--md-on-surface-variant);
}

.empty-state .hint {
  font-size: 13px;
  margin-top: 8px;
  opacity: 0.8;
}

/* ---------- Material 3 Expressive ---------- */
#app .plugins-page .page-header h1{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}
#app .plugins-page .subtitle{color:var(--md-on-surface-variant);font-size:14px;margin-top:8px;line-height:1.6}
#app .plugins-page .btn{
  height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;
  font-weight:700;font-size:13.5px;color:var(--md-on-surface);background:var(--md-surface-container-high);
  transition:transform 240ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 180ms,box-shadow 200ms;
}
#app .plugins-page .btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}
#app .plugins-page .btn-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .plugins-page .plugin-grid{gap:var(--space-lg)}
#app .plugins-page .plugin-card{
  border-radius:24px;border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
  background:var(--md-surface-container-low);box-shadow:var(--shadow-1);
  transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms,border-color 280ms;
}
#app .plugins-page .plugin-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}
#app .plugins-page .plugin-card.healthy{border-color:color-mix(in srgb,var(--md-success) 42%,var(--md-outline-variant))}
#app .plugins-page .plugin-icon{width:52px;height:52px;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container)}
#app .plugins-page .plugin-titles h2{font-size:17px;font-weight:750;letter-spacing:-.01em}
#app .plugins-page .status-chip{height:30px;padding:0 12px;border-radius:999px;font-weight:700;font-size:12px}
#app .plugins-page .cap-chip{height:26px;padding:0 11px;font-weight:600;border-radius:999px}
#app .plugins-page .plugin-meta dt{font-size:11px;font-weight:800;letter-spacing:.06em}
#app .plugins-page .plugin-meta dd{font-size:15px;font-weight:650}
#app .plugins-page .plugin-switch-slider{width:50px;height:30px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),border-color 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}
#app .plugins-page .plugin-switch-slider::after{left:4px;width:18px;height:18px;background:var(--md-outline);transition:left 340ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),width 340ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),height 340ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 300ms}
#app .plugins-page .plugin-switch.on .plugin-switch-slider{background:var(--md-primary);border-color:var(--md-primary)}
#app .plugins-page .plugin-switch.on .plugin-switch-slider::after{left:24px;width:20px;height:20px;background:var(--md-on-primary)}
#app .plugins-page .empty-state{background:var(--md-surface-container);border-radius:32px}
#app .plugins-page .empty-state p{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}
</style>
