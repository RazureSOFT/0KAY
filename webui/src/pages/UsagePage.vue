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

const PALETTE = ['#5944c6', '#9b405e', '#27633e', '#8a5a00', '#1a6fb4', '#7b4bb7', '#0d8a5f', '#b5473c']

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
    .map(([model, b], i) => ({ model, ...b, color: PALETTE[i % PALETTE.length] }))
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
const gridLines = [0.25, 0.5, 0.75, 1]

const total = computed(() => Number(usage.value?.total_tokens || 0))
const promptTokens = computed(() => Number(usage.value?.total_prompt_tokens || 0))
const completionTokens = computed(() => Number(usage.value?.total_completion_tokens || 0))
const promptShare = computed(() => (total.value ? Math.round((promptTokens.value / total.value) * 100) : 0))
const completionShare = computed(() => (total.value ? 100 - promptShare.value : 0))
const avgPerRequest = computed(() => {
  const c = Number(usage.value?.request_count || 0)
  return c ? Math.round(total.value / c) : 0
})

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
  return `${Math.max(3, Math.round((Number(v || 0) / maxModel.value) * 100))}%`
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

    <!-- Overview -->
    <section class="overview">
      <article class="card donut-card">
        <div class="donut">
          <svg viewBox="0 0 42 42" aria-hidden="true">
            <circle class="donut-track" cx="21" cy="21" r="15.9" pathLength="100" />
            <circle class="donut-prompt" cx="21" cy="21" r="15.9" pathLength="100"
              :stroke-dasharray="`${promptShare} 100`" />
            <circle class="donut-completion" cx="21" cy="21" r="15.9" pathLength="100"
              :stroke-dasharray="`${completionShare} 100`" :stroke-dashoffset="-promptShare" />
          </svg>
          <div class="donut-center">
            <b>{{ compact(total) }}</b>
            <span>{{ t('usage.totalTokens') }}</span>
          </div>
        </div>
      </article>

      <article class="card total-card">
        <div class="total-head">
          <span class="stat-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z" stroke="currentColor" stroke-width="1.8"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
          <div>
            <span class="stat-label">{{ t('usage.totalTokens') }}</span>
            <b class="big">{{ n(total) }}</b>
          </div>
        </div>
        <div class="compose" role="img" :aria-label="`prompt ${promptShare}% / completion ${completionShare}%`">
          <span class="seg prompt" :style="{ width: `${promptShare}%` }"></span>
          <span class="seg completion" :style="{ width: `${completionShare}%` }"></span>
        </div>
        <div class="legend">
          <span class="lg"><i class="dot prompt"></i>{{ t('usage.promptTokens') }}<b>{{ n(promptTokens) }}</b><small>{{ promptShare }}%</small></span>
          <span class="lg"><i class="dot completion"></i>{{ t('usage.completionTokens') }}<b>{{ n(completionTokens) }}</b><small>{{ completionShare }}%</small></span>
        </div>
      </article>

      <div class="mini-stack">
        <article class="mini">
          <span class="mini-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>
          <div><b>{{ n(usage?.session_count) }}</b><span>{{ t('usage.sessions') }}</span></div>
        </article>
        <article class="mini">
          <span class="mini-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>
          <div><b>{{ n(usage?.request_count) }}</b><span>{{ t('usage.requests') }}</span></div>
        </article>
        <article class="mini">
          <span class="mini-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
          <div><b>{{ n(avgPerRequest) }}</b><span>tokens / 请求</span></div>
        </article>
      </div>
    </section>

    <!-- Daily trend -->
    <section class="panel">
      <div class="panel-head">
        <h2>{{ t('usage.byDay') }}</h2>
        <span v-if="peakDay" class="panel-note">峰值 {{ dayLabel(peakDay.day) }} · {{ compact(peakDay.total) }}</span>
      </div>
      <div v-if="chartDays.length === 0" class="empty">{{ t('usage.empty') }}</div>
      <div v-else class="chart">
        <div class="bars">
          <div class="grid" aria-hidden="true">
            <span v-for="g in gridLines" :key="g" :style="{ bottom: `${g * 100}%` }"><i>{{ compact(maxDay * g) }}</i></span>
          </div>
          <div v-for="d in chartDays" :key="d.day" class="col"
            :title="`${d.day} · ${t('usage.totalTokens')} ${n(d.total)} · ${t('usage.promptTokens')} ${n(d.prompt)} · ${t('usage.completionTokens')} ${n(d.completion)} · #${n(d.count)}`">
            <div class="col-bar" :style="{ height: barHeight(d.total) }"></div>
          </div>
        </div>
        <div class="axis">
          <span v-for="d in chartDays" :key="d.day">{{ dayLabel(d.day) }}</span>
        </div>
      </div>
    </section>

    <!-- Models -->
    <section class="panel">
      <div class="panel-head">
        <h2>{{ t('usage.byModel') }}</h2>
        <span class="panel-note">{{ modelRows.length }} 个模型</span>
      </div>
      <div v-if="modelRows.length === 0" class="empty">{{ t('usage.empty') }}</div>
      <div v-else class="model-grid">
        <article v-for="row in modelRows" :key="row.model" class="model-card" :style="{ '--c': row.color }">
          <div class="mc-top">
            <span class="mc-avatar">{{ row.model.slice(0, 1).toUpperCase() }}</span>
            <code class="mc-name">{{ row.model }}</code>
            <span class="mc-share">{{ share(row.total).replace('%', '') }}%</span>
          </div>
          <b class="mc-total">{{ n(row.total) }} <small>tokens</small></b>
          <div class="mc-track"><div class="mc-fill" :style="{ width: share(row.total) }"></div></div>
          <div class="mc-meta">
            <span><b>{{ n(row.prompt) }}</b>{{ t('usage.promptTokens') }}</span>
            <span><b>{{ n(row.completion) }}</b>{{ t('usage.completionTokens') }}</span>
            <span><b>{{ n(row.count) }}</b>次请求</span>
          </div>
        </article>
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

/* Overview */
.overview { display: grid; grid-template-columns: minmax(220px, 0.9fr) minmax(280px, 1.5fr) minmax(200px, 1fr); gap: var(--space-lg); margin-bottom: var(--space-xl); }
.card {
  background: var(--md-surface-container-low); border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  border-radius: 32px; padding: 24px; box-shadow: var(--shadow-1);
  animation: up 520ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
}
.donut-card { display: grid; place-items: center; }
.donut { position: relative; width: min(190px, 100%); aspect-ratio: 1; }
.donut svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.donut circle { fill: none; stroke-width: 5; }
.donut-track { stroke: var(--md-surface-container-high); }
.donut-prompt { stroke: var(--md-primary); stroke-linecap: round; transition: stroke-dasharray 600ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)); }
.donut-completion { stroke: var(--md-tertiary); stroke-linecap: round; transition: stroke-dasharray 600ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), stroke-dashoffset 600ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)); }
.donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; text-align: center; }
.donut-center b { font-size: 30px; font-weight: 800; letter-spacing: -.02em; }
.donut-center span { font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--md-on-surface-variant); }

.total-card { display: flex; flex-direction: column; gap: 18px; }
.total-head { display: flex; align-items: center; gap: 16px; }
.stat-ic { width: 46px; height: 46px; flex-shrink: 0; border-radius: 18px 18px 18px 7px; display: grid; place-items: center; background: var(--md-primary-container); color: var(--md-on-primary-container); }
.stat-label { font-size: 11.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: var(--md-on-surface-variant); }
.big { display: block; font-size: clamp(30px, 3.4vw, 42px); font-weight: 800; letter-spacing: -.03em; line-height: 1.05; }
.compose { display: flex; height: 18px; border-radius: 999px; overflow: hidden; background: var(--md-surface-container-high); }
.seg { height: 100%; transition: width 600ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)); }
.seg.prompt { background: linear-gradient(90deg, var(--md-primary), color-mix(in srgb, var(--md-primary) 70%, var(--md-tertiary))); }
.seg.completion { background: linear-gradient(90deg, color-mix(in srgb, var(--md-tertiary) 80%, var(--md-primary)), var(--md-tertiary)); }
.legend { display: flex; gap: 20px; flex-wrap: wrap; }
.lg { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--md-on-surface-variant); }
.lg b { color: var(--md-on-surface); font-weight: 700; }
.lg small { color: var(--md-on-surface-variant); font-weight: 700; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.prompt { background: var(--md-primary); }
.dot.completion { background: var(--md-tertiary); }

.mini-stack { display: grid; grid-template-rows: repeat(3, 1fr); gap: var(--space-lg); }
.mini {
  display: flex; align-items: center; gap: 14px; padding: 18px 20px; border-radius: 26px;
  background: var(--md-surface-container-low); border: 1px solid color-mix(in srgb, var(--md-outline-variant) 50%, transparent);
  box-shadow: var(--shadow-1); animation: up 520ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
  transition: transform 280ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), box-shadow 280ms;
}
.mini:hover { transform: translateY(-3px); box-shadow: var(--shadow-2); }
.mini-ic { width: 40px; height: 40px; flex-shrink: 0; border-radius: 16px 16px 16px 6px; display: grid; place-items: center; background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.mini b { display: block; font-size: 24px; font-weight: 800; letter-spacing: -.02em; line-height: 1.1; }
.mini span { font-size: 12px; color: var(--md-on-surface-variant); font-weight: 600; }

/* Panels */
.panel {
  background: var(--md-surface-container-low); border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  border-radius: 32px; padding: clamp(20px, 2.2vw, 28px); margin-bottom: var(--space-lg); box-shadow: var(--shadow-1);
  animation: up 520ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
}
.panel-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.panel-head h2 { font-size: 17px; font-weight: 800; letter-spacing: -.01em; margin: 0; }
.panel-note { font-size: 12.5px; color: var(--md-on-surface-variant); font-weight: 600; }

/* Chart */
.chart { display: flex; flex-direction: column; height: 264px; padding-left: 42px; }
.bars { position: relative; flex: 1; display: flex; align-items: flex-end; gap: 6px; }
.grid { position: absolute; inset: 0; }
.grid span { position: absolute; left: 0; right: 0; border-top: 1px dashed color-mix(in srgb, var(--md-outline-variant) 70%, transparent); }
.grid span i { position: absolute; left: -42px; top: -8px; width: 36px; text-align: right; font-size: 10px; font-style: normal; color: var(--md-on-surface-variant); }
.col { flex: 1; min-width: 0; height: 100%; display: flex; justify-content: center; align-items: flex-end; }
.col-bar {
  width: 100%; max-width: 44px; border-radius: 12px 12px 4px 4px;
  background: linear-gradient(180deg, var(--md-primary), color-mix(in srgb, var(--md-primary) 40%, var(--md-surface)));
  transition: height 600ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), filter 160ms;
}
.col:hover .col-bar { filter: brightness(1.1) saturate(1.1); }
.axis { display: flex; gap: 6px; height: 22px; padding-top: 6px; }
.axis span { flex: 1; min-width: 0; text-align: center; font-size: 10.5px; color: var(--md-on-surface-variant); white-space: nowrap; }

/* Models */
.model-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(264px, 1fr)); gap: 16px; }
.model-card {
  position: relative; overflow: hidden; padding: 22px; border-radius: 26px;
  background: var(--md-surface-container); border: 1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent);
  display: flex; flex-direction: column; gap: 12px;
  animation: up 460ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
  transition: transform 300ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), box-shadow 300ms, border-color 300ms;
}
.model-card::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 5px; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 25%, transparent)); }
.model-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-2); border-color: color-mix(in srgb, var(--c) 40%, var(--md-outline-variant)); }
.mc-top { display: flex; align-items: center; gap: 10px; min-width: 0; }
.mc-avatar { width: 38px; height: 38px; flex-shrink: 0; border-radius: 15px 15px 15px 5px; display: grid; place-items: center; background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--c); font-weight: 800; font-size: 16px; }
.mc-name { flex: 1; min-width: 0; font: 700 12.5px/1.35 ui-monospace, monospace; overflow-wrap: anywhere; }
.mc-share { flex-shrink: 0; height: 26px; padding: 0 10px; border-radius: 999px; display: inline-flex; align-items: center; background: color-mix(in srgb, var(--c) 16%, transparent); color: var(--c); font-size: 12px; font-weight: 800; font-variant-numeric: tabular-nums; }
.mc-total { font-size: 26px; font-weight: 800; letter-spacing: -.02em; line-height: 1.05; }
.mc-total small { font-size: 11px; font-weight: 600; color: var(--md-on-surface-variant); }
.mc-track { height: 10px; border-radius: 999px; background: var(--md-surface-container-high); overflow: hidden; }
.mc-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 50%, var(--md-surface))); transition: width 600ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)); }
.mc-meta { display: flex; gap: 18px; flex-wrap: wrap; }
.mc-meta span { display: flex; flex-direction: column; gap: 1px; font-size: 11px; color: var(--md-on-surface-variant); font-weight: 600; }
.mc-meta b { color: var(--md-on-surface); font-weight: 750; font-size: 14px; font-variant-numeric: tabular-nums; }

.empty { padding: var(--space-xl); text-align: center; color: var(--md-on-surface-variant); background: var(--md-surface-container); border-radius: 20px; }

@keyframes up { from { opacity: 0; transform: translateY(16px) scale(.985); } to { opacity: 1; transform: none; } }

@media (max-width: 980px) {
  .overview { grid-template-columns: 1fr 1fr; }
  .mini-stack { grid-column: 1 / -1; grid-template-rows: none; grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .overview { grid-template-columns: 1fr; }
  .mini-stack { grid-template-columns: 1fr; }
  .chart { height: 200px; padding-left: 34px; }
  .grid span i { left: -34px; width: 28px; }
  .axis span { font-size: 9px; }
}
</style>
