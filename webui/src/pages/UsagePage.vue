<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfirm } from '../composables/confirm'

const { t } = useI18n()
const { confirm } = useConfirm()

interface UsageBucket {
  prompt: number
  completion: number
  total: number
  count: number
}

interface UsageSnapshot {
  total_prompt_tokens?: number
  total_completion_tokens?: number
  total_tokens?: number
  request_count?: number
  session_count?: number
  by_model?: Record<string, UsageBucket>
  by_day?: Record<string, UsageBucket>
  recent?: any[]
}

const usage = ref<UsageSnapshot | null>(null)
const loading = ref(false)
const error = ref('')
const clearMsg = ref('')
let timer: number | undefined

async function fetchUsage() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/usage')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    usage.value = await res.json()
  } catch (e: any) {
    error.value = e?.message || 'failed'
  } finally {
    loading.value = false
  }
}

async function clearUsage() {
  const ok = await confirm({
    title: t('usage.clear'),
    message: t('usage.clearConfirm'),
    confirmLabel: t('usage.clear'),
    danger: true,
  })
  if (!ok) return
  error.value = ''
  clearMsg.value = ''
  try {
    const res = await fetch('/api/usage/clear', { method: 'POST' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    clearMsg.value = t('usage.cleared')
    await fetchUsage()
    setTimeout(() => { clearMsg.value = '' }, 2000)
  } catch (e: any) {
    error.value = e?.message || 'failed'
  }
}

const modelRows = computed(() => {
  const by = usage.value?.by_model || {}
  return Object.entries(by)
    .map(([model, b]) => ({ model, ...b }))
    .sort((a, b) => (b.total || 0) - (a.total || 0))
})

const dayRows = computed(() => {
  const by = usage.value?.by_day || {}
  return Object.entries(by)
    .map(([day, b]) => ({ day, ...b }))
    .sort((a, b) => (a.day < b.day ? 1 : -1))
    .slice(0, 14)
})

const chartDays = computed(() => [...dayRows.value].reverse())
const maxDay = computed(() => Math.max(1, ...chartDays.value.map((r) => r.total || 0)))
const maxModel = computed(() => Math.max(1, ...modelRows.value.map((r) => r.total || 0)))
const peakDay = computed(() => chartDays.value.reduce((best, r) => (r.total > (best?.total || 0) ? r : best), chartDays.value[0] || null))

function n(v: number | undefined | null) {
  return Number(v || 0).toLocaleString()
}
function compact(v: number | undefined | null) {
  const value = Number(v || 0)
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}k`
  return String(value)
}
function barHeight(v: number) {
  return `${Math.max(3, Math.round((Number(v || 0) / maxDay.value) * 100))}%`
}
function share(v: number) {
  return `${Math.round((Number(v || 0) / maxModel.value) * 100)}%`
}
function dayLabel(day: string) {
  const d = new Date(day)
  return Number.isNaN(d.getTime()) ? day.slice(5) : `${d.getMonth() + 1}/${d.getDate()}`
}

onMounted(() => {
  fetchUsage()
  timer = window.setInterval(fetchUsage, 15000)
})
onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <div class="usage-page">
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">0KAY · USAGE</p>
        <h1>{{ t('usage.title') }}</h1>
        <p class="subtitle">按模型与日期统计的 token 用量、请求与会话。</p>
      </div>
      <div class="hero-actions">
        <button class="btn btn-tonal" :disabled="loading" @click="fetchUsage">{{ t('memory.refresh') }}</button>
        <button class="btn btn-danger" :disabled="loading" @click="clearUsage">{{ t('usage.clear') }}</button>
      </div>
    </header>

    <div v-if="error" class="banner err">{{ error }}</div>
    <div v-if="clearMsg" class="banner ok">{{ clearMsg }}</div>

    <section class="stat-grid">
      <div class="stat-card tone-1">
        <span class="stat-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z" stroke="currentColor" stroke-width="1.8"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
        <span class="stat-label">{{ t('usage.totalTokens') }}</span>
        <span class="stat-value">{{ n(usage?.total_tokens) }}</span>
      </div>
      <div class="stat-card tone-2">
        <span class="stat-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <span class="stat-label">{{ t('usage.promptTokens') }}</span>
        <span class="stat-value">{{ n(usage?.total_prompt_tokens) }}</span>
      </div>
      <div class="stat-card tone-3">
        <span class="stat-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <span class="stat-label">{{ t('usage.completionTokens') }}</span>
        <span class="stat-value">{{ n(usage?.total_completion_tokens) }}</span>
      </div>
      <div class="stat-card tone-4">
        <span class="stat-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>
        <span class="stat-label">{{ t('usage.sessions') }}</span>
        <span class="stat-value">{{ n(usage?.session_count) }}</span>
      </div>
      <div class="stat-card tone-5">
        <span class="stat-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>
        <span class="stat-label">{{ t('usage.requests') }}</span>
        <span class="stat-value">{{ n(usage?.request_count) }}</span>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>{{ t('usage.byDay') }}</h2>
        <span v-if="peakDay" class="panel-note">峰值 {{ dayLabel(peakDay.day) }} · {{ compact(peakDay.total) }}</span>
      </div>
      <div v-if="chartDays.length === 0" class="empty">{{ t('usage.empty') }}</div>
      <div v-else class="chart-wrap">
        <div class="chart">
          <div v-for="d in chartDays" :key="d.day" class="col" :title="`${d.day} · ${t('usage.totalTokens')} ${n(d.total)} · ${t('usage.promptTokens')} ${n(d.prompt)} · ${t('usage.completionTokens')} ${n(d.completion)} · #${n(d.count)}`">
            <span class="col-val">{{ compact(d.total) }}</span>
            <div class="col-track"><div class="col-bar" :style="{ height: barHeight(d.total) }"></div></div>
            <span class="col-day">{{ dayLabel(d.day) }}</span>
          </div>
        </div>
        <div class="legend">
          <span class="dot legend-total"></span>{{ t('usage.totalTokens') }}
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>{{ t('usage.byModel') }}</h2>
        <span class="panel-note">{{ modelRows.length }} 个模型</span>
      </div>
      <div v-if="modelRows.length === 0" class="empty">{{ t('usage.empty') }}</div>
      <div v-else class="model-list">
        <div v-for="row in modelRows" :key="row.model" class="model-row">
          <div class="model-head">
            <code class="model-name">{{ row.model }}</code>
            <span class="model-total">{{ n(row.total) }} <small>tokens</small></span>
          </div>
          <div class="model-track"><div class="model-fill" :style="{ width: share(row.total) }"></div></div>
          <div class="model-meta">
            <span><b>{{ n(row.prompt) }}</b> {{ t('usage.promptTokens') }}</span>
            <span><b>{{ n(row.completion) }}</b> {{ t('usage.completionTokens') }}</span>
            <span><b>{{ n(row.count) }}</b> 次请求</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Usage page — Material 3 Expressive dashboard. */
.usage-page {
  height: 100%;
  overflow-y: auto;
  padding: clamp(22px, 3vw, 44px);
  background:
    radial-gradient(1100px 560px at 105% -12%, color-mix(in srgb, var(--md-primary) 10%, transparent), transparent 62%),
    var(--md-surface);
  color: var(--md-on-surface);
}

.hero { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-lg); margin-bottom: clamp(18px, 2.4vw, 28px); flex-wrap: wrap; }
.eyebrow { margin: 0 0 8px; color: var(--md-primary); font: 800 11px/1 ui-monospace, monospace; letter-spacing: .18em; }
.hero h1 { font-size: clamp(26px, 3vw, 38px); font-weight: 800; letter-spacing: -.02em; margin: 0; }
.subtitle { color: var(--md-on-surface-variant); font-size: 14.5px; margin-top: 8px; line-height: 1.6; max-width: 70ch; }
.hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.banner { padding: 13px 18px; border-radius: 18px; margin-bottom: 14px; font-size: 13px; font-weight: 600; }
.banner.err { background: var(--md-error-container); color: var(--md-on-error-container, #410E0B); }
.banner.ok { background: var(--md-success-container); color: #0d3b1e; }

#app .usage-page .btn {
  height: 46px; padding: 0 22px; border: 1px solid transparent; border-radius: 999px;
  font-weight: 700; font-size: 13.5px; cursor: pointer; color: var(--md-on-surface); background: var(--md-surface-container-high);
  transition: transform 240ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), background-color 180ms, box-shadow 200ms;
}
#app .usage-page .btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow-1); }
#app .usage-page .btn:disabled { opacity: .55; cursor: not-allowed; }
#app .usage-page .btn-tonal { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
#app .usage-page .btn-danger { background: var(--md-error-container); color: var(--md-on-error-container, #410E0B); }

.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(168px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-xl); }
.stat-card {
  padding: 20px; border-radius: 26px; display: flex; flex-direction: column; gap: 8px;
  box-shadow: var(--shadow-1); animation: up 520ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
  transition: transform 300ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), box-shadow 300ms;
}
.stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-2); }
.stat-ic { width: 40px; height: 40px; border-radius: 16px 16px 16px 6px; display: grid; place-items: center; background: color-mix(in srgb, currentColor 14%, transparent); }
.stat-label { font-size: 11.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; opacity: .8; }
.stat-value { font-size: 32px; font-weight: 800; letter-spacing: -.02em; line-height: 1.05; }
.tone-1 { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.tone-2 { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.tone-3 { background: var(--md-tertiary-container); color: var(--md-on-tertiary-container, #421326); }
.tone-4 { background: var(--md-success-container); color: #0d3b1e; }
.tone-5 { background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }

.panel {
  background: var(--md-surface-container-low); border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  border-radius: 28px; padding: clamp(20px, 2.2vw, 28px); margin-bottom: var(--space-lg); box-shadow: var(--shadow-1);
  animation: up 520ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
}
.panel-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
.panel-head h2 { font-size: 17px; font-weight: 800; letter-spacing: -.01em; margin: 0; }
.panel-note { font-size: 12.5px; color: var(--md-on-surface-variant); font-weight: 600; }

/* Bar chart */
.chart-wrap { display: flex; flex-direction: column; gap: 14px; }
.chart { display: flex; align-items: flex-end; gap: 6px; height: 230px; padding-top: 18px; }
.col { flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.col-val { font-size: 10px; color: var(--md-on-surface-variant); opacity: 0; transition: opacity 160ms; }
.col:hover .col-val { opacity: 1; }
.col-track { flex: 1; width: 100%; max-width: 46px; display: flex; align-items: flex-end; }
.col-bar {
  width: 100%; border-radius: 12px 12px 4px 4px;
  background: linear-gradient(180deg, var(--md-primary), color-mix(in srgb, var(--md-primary) 58%, var(--md-surface)));
  transition: height 500ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), filter 160ms;
}
.col:hover .col-bar { filter: brightness(1.08); }
.col-day { font-size: 10.5px; color: var(--md-on-surface-variant); white-space: nowrap; }
.legend { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--md-on-surface-variant); }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-total { background: var(--md-primary); }

/* Model ranked rows */
.model-list { display: flex; flex-direction: column; gap: 18px; }
.model-row { display: flex; flex-direction: column; gap: 9px; }
.model-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.model-name { font: 700 13px/1.3 ui-monospace, monospace; color: var(--md-on-surface); overflow-wrap: anywhere; }
.model-total { font-size: 17px; font-weight: 800; flex-shrink: 0; }
.model-total small { font-size: 11px; font-weight: 600; color: var(--md-on-surface-variant); }
.model-track { height: 12px; border-radius: 999px; background: var(--md-surface-container-high); overflow: hidden; }
.model-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--md-primary), color-mix(in srgb, var(--md-primary) 55%, var(--md-tertiary))); transition: width 500ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)); }
.model-meta { display: flex; gap: 18px; flex-wrap: wrap; font-size: 12px; color: var(--md-on-surface-variant); }
.model-meta b { color: var(--md-on-surface); font-weight: 700; }

.empty { padding: var(--space-xl); text-align: center; color: var(--md-on-surface-variant); background: var(--md-surface-container); border-radius: 20px; }

@keyframes up { from { opacity: 0; transform: translateY(16px) scale(.985); } to { opacity: 1; transform: none; } }

@media (max-width: 640px) {
  .chart { height: 180px; }
  .col-day { font-size: 9px; }
}
</style>
