<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  if (!window.confirm(t('usage.clearConfirm'))) return
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

function n(v: number | undefined | null) {
  return Number(v || 0).toLocaleString()
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
    <header class="page-header">
      <div>
        <h1>{{ t('usage.title') }}</h1>
        <p class="subtitle">{{ t('usage.byModel') }} · {{ t('usage.byDay') }}</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-tonal" :disabled="loading" @click="fetchUsage">
          {{ t('memory.refresh') }}
        </button>
        <button class="btn btn-danger" :disabled="loading" @click="clearUsage">
          {{ t('usage.clear') }}
        </button>
      </div>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>
    <div v-if="clearMsg" class="clear-banner">{{ clearMsg }}</div>

    <div class="stat-grid">
      <div class="stat-card">
        <span class="stat-label">{{ t('usage.totalTokens') }}</span>
        <span class="stat-value">{{ n(usage?.total_tokens) }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">{{ t('usage.promptTokens') }}</span>
        <span class="stat-value">{{ n(usage?.total_prompt_tokens) }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">{{ t('usage.completionTokens') }}</span>
        <span class="stat-value">{{ n(usage?.total_completion_tokens) }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">{{ t('usage.sessions') }}</span>
        <span class="stat-value">{{ n(usage?.session_count) }}</span>
      </div>
    </div>

    <section class="panel">
      <h2>{{ t('usage.byModel') }}</h2>
      <div v-if="modelRows.length === 0" class="empty">{{ t('usage.empty') }}</div>
      <table v-else class="usage-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>{{ t('usage.promptTokens') }}</th>
            <th>{{ t('usage.completionTokens') }}</th>
            <th>{{ t('usage.totalTokens') }}</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in modelRows" :key="row.model">
            <td class="mono">{{ row.model }}</td>
            <td>{{ n(row.prompt) }}</td>
            <td>{{ n(row.completion) }}</td>
            <td>{{ n(row.total) }}</td>
            <td>{{ n(row.count) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="panel">
      <h2>{{ t('usage.byDay') }}</h2>
      <div v-if="dayRows.length === 0" class="empty">{{ t('usage.empty') }}</div>
      <table v-else class="usage-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>{{ t('usage.promptTokens') }}</th>
            <th>{{ t('usage.completionTokens') }}</th>
            <th>{{ t('usage.totalTokens') }}</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dayRows" :key="row.day">
            <td class="mono">{{ row.day }}</td>
            <td>{{ n(row.prompt) }}</td>
            <td>{{ n(row.completion) }}</td>
            <td>{{ n(row.total) }}</td>
            <td>{{ n(row.count) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.usage-page {
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
}

.header-actions {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.btn-danger {
  background: var(--md-error-container);
  color: #410E0B;
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-tonal {
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
}

.btn-tonal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-banner {
  padding: 12px 16px;
  margin-bottom: var(--space-md);
  background: var(--md-success-container);
  color: #0D1F06;
  border-radius: var(--radius-md);
  font-size: 13px;
}

.page-header h1 {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.subtitle {
  color: var(--md-on-surface-variant);
  font-size: 14px;
  margin-top: 4px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-card {
  padding: var(--space-lg);
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 12px;
  color: var(--md-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--md-on-surface);
}

.panel {
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.panel h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.usage-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.usage-table th,
.usage-table td {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 1px solid var(--md-outline-variant);
}

.usage-table th {
  color: var(--md-on-surface-variant);
  font-weight: 600;
  font-size: 12px;
}

.mono {
  font-family: ui-monospace, monospace;
}

.empty {
  padding: var(--space-lg);
  text-align: center;
  color: var(--md-on-surface-variant);
  background: var(--md-surface-container);
  border-radius: var(--radius-md);
}

.error-banner {
  padding: 12px 16px;
  margin-bottom: var(--space-md);
  background: var(--md-error-container);
  color: #410E0B;
  border-radius: var(--radius-md);
  font-size: 13px;
}
</style>
