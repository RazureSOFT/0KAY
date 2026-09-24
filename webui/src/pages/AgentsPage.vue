<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAgentsStore, type AgentInfo } from '../stores/agents'
import { useLifeStore } from '../stores/life'

const { t } = useI18n()
const agents = useAgentsStore()
const life = useLifeStore()
const selected = ref<AgentInfo | null>(null)

const hostRows = computed(() => {
  const h = selected.value?.host
  if (!h) return []
  const rows: { label: string; value: string }[] = []
  if (h.hostname) rows.push({ label: t('agents.host'), value: h.hostname })
  if (h.os) rows.push({ label: 'OS', value: `${h.os}${h.arch ? ' / ' + h.arch : ''}` })
  if (h.cpu_model) rows.push({ label: 'CPU', value: `${h.cpu_model}${h.cpu_cores ? ` (${h.cpu_cores})` : ''}` })
  if (h.memory_total_bytes) {
    const total = (h.memory_total_bytes / 1024 / 1024 / 1024).toFixed(1)
    const avail = h.memory_available_bytes
      ? ` / ${(h.memory_available_bytes / 1024 / 1024 / 1024).toFixed(1)} free`
      : ''
    rows.push({ label: t('agents.memory'), value: `${total} GB${avail}` })
  }
  if (h.workdir) rows.push({ label: 'Workdir', value: h.workdir })
  return rows
})

function openDetail(a: AgentInfo) {
  selected.value = a
}

function closeDetail() {
  selected.value = null
}

onMounted(() => {
  agents.connect()
  if (!life.isConnected) life.connect()
})

onUnmounted(() => agents.disconnect())
</script>

<template>
  <div class="agents-page">
    <header class="page-header">
      <div>
        <h1>{{ t('agents.title') }}</h1>
        <p class="subtitle">{{ t('agents.subtitle') }}</p>
      </div>
      <div class="header-stats">
        <div class="stat-pill">
          <span class="dot" :class="{ on: agents.onlineCount > 0 }"></span>
          {{ agents.onlineCount }} / {{ agents.agents.length || life.totalAgents }}
          {{ t('agents.online') }}
        </div>
        <button class="btn btn-tonal" @click="agents.fetchAgents()" :disabled="agents.loading">
          {{ agents.loading ? t('agents.refreshing') : t('agents.refresh') }}
        </button>
      </div>
    </header>

    <div v-if="agents.error" class="error-banner">{{ agents.error }}</div>

    <div class="agent-grid">
      <article
        v-for="a in agents.agents"
        :key="a.plugin_id"
        class="agent-card"
        :class="{ healthy: agents.isHealthy(a) }"
        role="button"
        tabindex="0"
        @click="openDetail(a)"
        @keydown.enter="openDetail(a)"
      >
        <div class="agent-card-top">
          <div class="agent-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="7" width="16" height="12" rx="4" stroke="currentColor" stroke-width="2"/>
              <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
              <path d="M12 7V4M8 4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="agent-titles">
            <h2>{{ a.name }}</h2>
            <span class="plugin-id">{{ a.plugin_id }}</span>
          </div>
          <span class="status-chip" :class="{ ok: agents.isHealthy(a) }">
            {{ agents.isHealthy(a) ? t('agents.healthy') : a.status }}
          </span>
        </div>

        <dl class="agent-meta">
          <div>
            <dt>{{ t('agents.address') }}</dt>
            <dd>{{ a.address }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.version') }}</dt>
            <dd>{{ a.version }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.tasks') }}</dt>
            <dd>{{ a.active_tasks }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.heartbeat') }}</dt>
            <dd>{{ a.last_heartbeat_age_seconds }}s</dd>
          </div>
        </dl>
      </article>

      <div v-if="agents.agents.length === 0 && !agents.loading" class="empty-state">
        <p>{{ t('agents.empty') }}</p>
        <p class="hint">{{ t('agents.emptyHint') }}</p>
      </div>
    </div>

    <section class="tasks-card">
      <h2>任务记录</h2>
      <div v-if="agents.tasks.length === 0 && life.activeTasks.length === 0" class="empty-tasks">
        暂无任务记录
      </div>
      <ul v-else class="task-list">
        <li v-for="task in agents.tasks" :key="task.task_id">
          <div class="task-main">
            <code>{{ task.task_id }}</code>
            <span v-if="task.prompt" class="task-prompt">{{ task.prompt }}</span>
          </div>
          <span class="chip" :class="stateClass(task.state)">{{ stateLabel(task.state) }}</span>
        </li>
        <li v-for="task in life.activeTasks" :key="'life-' + task">
          <code>{{ task }}</code>
          <span class="chip active">{{ t('status.running') }}</span>
        </li>
      </ul>
    </section>

    <div v-if="selected" class="modal-backdrop" @click.self="closeDetail">
      <div class="agent-modal" role="dialog" aria-modal="true">
        <header class="modal-head">
          <div>
            <h2>{{ selected.name }}</h2>
            <span class="plugin-id">{{ selected.plugin_id }}</span>
          </div>
          <button class="btn btn-tonal" type="button" @click="closeDetail">
            {{ t('agents.close') }}
          </button>
        </header>
        <dl class="modal-grid">
          <div>
            <dt>{{ t('agents.status') }}</dt>
            <dd>{{ selected.status }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.version') }}</dt>
            <dd>{{ selected.version || '—' }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.address') }}</dt>
            <dd>{{ selected.address }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.tasks') }}</dt>
            <dd>{{ selected.active_tasks }}</dd>
          </div>
          <div>
            <dt>{{ t('agents.heartbeat') }}</dt>
            <dd>{{ selected.last_heartbeat_age_seconds }}s</dd>
          </div>
          <div v-if="selected.host?.hostname">
            <dt>{{ t('agents.host') }}</dt>
            <dd>{{ selected.host.hostname }}</dd>
          </div>
        </dl>
        <div v-if="hostRows.length" class="host-block">
          <h3>{{ t('agents.resources') }}</h3>
          <dl class="modal-grid host-grid">
            <div v-for="row in hostRows" :key="row.label">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value }}</dd>
            </div>
          </dl>
        </div>
        <div v-else class="host-empty">{{ t('agents.noHost') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function stateLabel(state: string): string {
  return (state || 'running').toUpperCase()
}

function stateClass(state: string): string {
  switch ((state || 'running').toLowerCase()) {
    case 'done':
      return 'done'
    case 'failed':
      return 'failed'
    case 'cancelled':
      return 'cancelled'
    default:
      return 'active'
  }
}
</script>

<style scoped>
.agents-page {
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

.header-stats {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-full);
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-weight: 500;
  font-size: 14px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--md-outline);
}
.dot.on { background: var(--md-success); box-shadow: 0 0 0 4px color-mix(in srgb, var(--md-success) 25%, transparent); }

.error-banner {
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  background: var(--md-error-container);
  color: #410E0B;
  margin-bottom: var(--space-lg);
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.agent-card {
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-1);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.agent-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.agent-card.healthy {
  border-color: color-mix(in srgb, var(--md-success) 40%, var(--md-outline-variant));
}

.agent-card-top {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.agent-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
}

.agent-titles { flex: 1; min-width: 0; }
.agent-titles h2 {
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

.agent-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.agent-meta dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--md-on-surface-variant);
  margin-bottom: 2px;
}
.agent-meta dd {
  font-size: 14px;
  font-weight: 500;
  color: var(--md-on-surface);
  font-family: monospace;
  word-break: break-all;
}

.empty-state {
  grid-column: 1 / -1;
  padding: var(--space-xxl);
  text-align: center;
  background: var(--md-surface-container);
  border-radius: var(--radius-lg);
  color: var(--md-on-surface-variant);
}
.empty-state .hint { font-size: 13px; margin-top: 8px; opacity: 0.8; }

.tasks-card {
  background: var(--md-surface-container-low);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.tasks-card h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.empty-tasks {
  padding: var(--space-lg);
  text-align: center;
  color: var(--md-on-surface-variant);
  background: var(--md-surface-container);
  border-radius: var(--radius-md);
  font-size: 14px;
}

.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.task-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: var(--md-surface-container);
  border-radius: var(--radius-sm);
}

.task-list code {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.task-prompt {
  font-size: 12px;
  color: var(--md-on-surface-variant);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip {
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.chip.active {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

.chip.done {
  background: var(--md-success-container);
  color: #0D1F06;
}

.chip.failed {
  background: var(--md-error-container);
  color: #410E0B;
}

.chip.cancelled {
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
}

.agent-card {
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
}

.agent-modal {
  width: min(520px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  background: var(--md-surface-container-high, var(--md-surface));
  border-radius: var(--radius-lg);
  border: 1px solid var(--md-outline-variant);
  padding: var(--space-lg);
  box-shadow: var(--shadow-3, 0 8px 24px rgba(0,0,0,0.25));
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
}

.modal-head h2 {
  font-size: 18px;
  font-weight: 600;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin: 0;
}

.modal-grid dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--md-on-surface-variant);
  margin-bottom: 2px;
}

.modal-grid dd {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  font-family: monospace;
  word-break: break-all;
}

.host-block h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 4px 0;
}

.host-empty {
  font-size: 13px;
  color: var(--md-on-surface-variant);
}
</style>
