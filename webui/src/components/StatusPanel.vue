<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLifeStore } from '../stores/life'
import { useUIPatchesStore, type StatusSection, type StatusAxis } from '../stores/uiPatches'

const { t } = useI18n()
const lifeStore = useLifeStore()
const ui = useUIPatchesStore()

/** Resolve dotted path against life store fields. */
function resolve(path?: string): any {
  if (!path) return undefined
  if (!path.startsWith('life.')) return undefined
  const key = path.slice(5) as keyof typeof lifeStore
  const v = (lifeStore as any)[key]
  return typeof v === 'function' ? undefined : v
}

function labelOf(item: { titleKey?: string; title?: string; id: string }) {
  if (item.titleKey) {
    const s = t(item.titleKey)
    if (s && s !== item.titleKey) return s
  }
  return item.title || item.id
}

function axisLabel(axis: StatusAxis) {
  if (axis.labelKey) {
    const s = t(axis.labelKey)
    if (s && s !== axis.labelKey) return s
  }
  return axis.label || axis.key
}

function axisValue(axis: StatusAxis): number {
  const raw = Number(resolve(`life.emotion.${axis.key}`) ?? 0)
  if (axis.scale === 'remap01') return (raw + 1) / 2
  return raw
}

function sectionValue(s: StatusSection): string {
  if (s.value) return s.value
  if (s.valueKey) {
    const v = t(s.valueKey)
    if (v !== s.valueKey) return v
  }
  return '—'
}

function emptyText(s: StatusSection): string {
  if (s.empty) return s.empty
  if (s.emptyKey) {
    const v = t(s.emptyKey)
    if (v !== s.emptyKey) return v
  }
  return '—'
}

function listItems(s: StatusSection): string[] {
  const v = resolve(s.listBind)
  return Array.isArray(v) ? v.map(String) : []
}

// --- memory widget state (kind: memory, endpoint from patch) ---
const memoryStats = ref<{ working: number; shortTerm: number; longTerm: number; avgStrength: number } | null>(null)
const memories = ref<{ id: string; content: string; strength: number }[]>([])
const memoryLoading = ref(false)
const memorySection = computed(() => ui.statusSections.find((s) => s.kind === 'memory') || null)

async function fetchMemory(endpoint?: string) {
  const url = endpoint || memorySection.value?.endpoint || '/api/life/memories'
  memoryLoading.value = true
  try {
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      memoryStats.value = data.stats || null
      memories.value = data.memories || []
    }
  } catch {
    memoryStats.value = null
    memories.value = []
  } finally {
    memoryLoading.value = false
  }
}

let memTimer: ReturnType<typeof setInterval> | null = null

function scheduleMemoryPoll() {
  if (memTimer) clearInterval(memTimer)
  memTimer = null
  if (memorySection.value) {
    const ms = memorySection.value.pollMs || 15000
    fetchMemory(memorySection.value.endpoint)
    memTimer = setInterval(() => fetchMemory(memorySection.value?.endpoint), ms)
  }
}

watch(
  () => [memorySection.value?.endpoint, memorySection.value?.pollMs, ui.loaded],
  scheduleMemoryPoll,
  { immediate: true },
)

onMounted(() => {
  if (!memorySection.value) scheduleMemoryPoll()
})
onUnmounted(() => {
  if (memTimer) clearInterval(memTimer)
})

const moodColor = computed(() => lifeStore.emotionColor)
const moodMood = computed(() => lifeStore.emotionMood)
const energyPercent = computed(() => lifeStore.energyPercent)
const energyColor = computed(() => lifeStore.energyColor)
const onlineAgents = computed(() => lifeStore.onlineAgents)
const totalAgents = computed(() => lifeStore.totalAgents)
const isConnected = computed(() => lifeStore.isConnected)
const source = computed(() => lifeStore.source)
const activeTasks = computed(() => lifeStore.activeTasks)
</script>

<template>
  <div class="status-panel">
    <div class="panel-header">
      <h2>{{ t('status.title') }}</h2>
      <span v-if="ui.loaded" class="patch-badge">patch</span>
    </div>

    <div class="panel-content">
      <div
        v-for="section in ui.statusSections"
        :key="section.id"
        class="section"
        :data-section="section.id"
        :data-kind="section.kind"
      >
        <div class="section-header">
          <span class="section-title">{{ labelOf(section) }}</span>
          <span v-if="section.kind === 'bar'" class="section-value">{{ energyPercent }}%</span>
          <span v-else-if="section.kind === 'count'" class="section-value">{{ onlineAgents }}</span>
          <span v-else-if="section.kind === 'tasks'" class="section-value">{{ activeTasks.length }}</span>
          <button
            v-else-if="section.kind === 'memory'"
            class="link-btn"
            type="button"
            :disabled="memoryLoading"
            @click="fetchMemory(section.endpoint)"
          >
            {{ t('memory.refresh') }}
          </button>
        </div>

        <!-- mood -->
        <div v-if="section.kind === 'mood'" class="mood-display">
          <div class="mood-icon" :style="{ color: moodColor }">
            <svg v-if="moodMood === 'happy'" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
              <circle cx="16" cy="20" r="2" fill="currentColor"/>
              <circle cx="32" cy="20" r="2" fill="currentColor"/>
              <path d="M14 30C17 34 31 34 34 30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="moodMood === 'sad'" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
              <circle cx="16" cy="20" r="2" fill="currentColor"/>
              <circle cx="32" cy="20" r="2" fill="currentColor"/>
              <path d="M16 34C19 30 29 30 32 34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="moodMood === 'irritated'" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
              <line x1="14" y1="18" x2="20" y2="20" stroke="currentColor" stroke-width="2"/>
              <line x1="34" y1="18" x2="28" y2="20" stroke="currentColor" stroke-width="2"/>
              <path d="M16 34C19 30 29 30 32 34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="moodMood === 'sleeping'" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
              <path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold">Z</text>
            </svg>
            <svg v-else width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
              <circle cx="16" cy="20" r="2" fill="currentColor"/>
              <circle cx="32" cy="20" r="2" fill="currentColor"/>
              <path d="M18 30H30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="mood-label" :style="{ color: moodColor }">
            {{ t(`emotion.${moodMood}`) }}
          </div>
        </div>

        <!-- bar (mental energy) -->
        <div v-else-if="section.kind === 'bar'" class="energy-bar">
          <div
            class="energy-fill"
            :style="{ width: `${energyPercent}%`, backgroundColor: energyColor }"
          ></div>
        </div>

        <!-- bars (emotion axes) -->
        <div v-else-if="section.kind === 'bars'" class="emotion-bars">
          <div v-for="axis in section.axes || []" :key="axis.key" class="emotion-row">
            <span class="emotion-label">{{ axisLabel(axis) }}</span>
            <div class="emotion-bar">
              <div
                class="emotion-fill"
                :style="{
                  width: `${Math.max(0, Math.min(1, axisValue(axis))) * 100}%`,
                  backgroundColor: axis.color || '#0078d4',
                }"
              ></div>
            </div>
          </div>
        </div>

        <!-- count (online agents) -->
        <div v-else-if="section.kind === 'count'" class="agents-display">
          <div class="agent-count">
            <span class="agent-number" :class="{ online: onlineAgents > 0 }">{{ onlineAgents }}</span>
            <span class="agent-label">{{ t('status.agentsOnline') }}</span>
          </div>
          <div v-if="totalAgents > onlineAgents" class="agent-offline">
            {{ totalAgents - onlineAgents }} {{ t('status.agentsOffline') }}
          </div>
        </div>

        <!-- tasks -->
        <div v-else-if="section.kind === 'tasks'">
          <div v-if="activeTasks.length === 0" class="empty-tasks">{{ emptyText(section) }}</div>
          <div v-else class="task-list">
            <div v-for="task in activeTasks" :key="task" class="task-item">
              <span class="task-id">{{ task.substring(0, 8) }}...</span>
              <span class="task-status">{{ t('status.running') }}</span>
            </div>
          </div>
        </div>

        <!-- list generic -->
        <div v-else-if="section.kind === 'list'">
          <div v-if="listItems(section).length === 0" class="empty-tasks">{{ emptyText(section) }}</div>
          <div v-else class="task-list">
            <div v-for="item in listItems(section)" :key="item" class="task-item">
              <span class="task-id">{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- memory -->
        <div v-else-if="section.kind === 'memory'">
          <div v-if="memoryStats" class="memory-stats">
            <div class="memory-stat">
              <span class="memory-stat-label">{{ t('memory.working') }}</span>
              <span class="memory-stat-value">{{ memoryStats.working }}</span>
            </div>
            <div class="memory-stat">
              <span class="memory-stat-label">{{ t('memory.shortTerm') }}</span>
              <span class="memory-stat-value">{{ memoryStats.shortTerm?.total ?? memoryStats.shortTerm }}</span>
            </div>
            <div class="memory-stat">
              <span class="memory-stat-label">{{ t('memory.longTerm') }}</span>
              <span class="memory-stat-value">{{ memoryStats.longTerm }}</span>
            </div>
          </div>
          <div v-if="memories.length === 0" class="empty-tasks">{{ t('memory.empty') }}</div>
          <div v-else class="memory-list">
            <div v-for="m in memories.slice(0, 5)" :key="m.id" class="memory-item" :title="m.content">
              <span class="memory-text">{{ m.content }}</span>
              <span class="memory-strength">{{ Math.round((m.strength || 0) * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- connection -->
        <div v-else-if="section.kind === 'connection'" class="connection-info">
          <span class="connection-dot" :class="{ connected: isConnected }"></span>
          <span>{{ isConnected ? t('status.connectedTo') : t('chat.disconnected') }}</span>
          <span v-if="source === 'core'" class="state-source">Core</span>
        </div>

        <!-- kv fallback -->
        <div v-else class="connection-info">
          <span>{{ sectionValue(section) }}</span>
        </div>
      </div>

      <div v-if="ui.statusSections.length === 0" class="empty-tasks">
        No status sections (load life.patch)
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--neutral-white);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--neutral-gray-6);
}

.panel-header h2 {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--neutral-gray-70);
}

.patch-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
}

.section {
  margin-bottom: var(--space-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.section-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--neutral-gray-50);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-value {
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-30);
}

.mood-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xl);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-md);
}

.mood-icon {
  margin-bottom: var(--space-md);
}

.mood-label {
  font-size: var(--font-size-md);
  font-weight: 600;
}

.energy-bar {
  height: 8px;
  background: var(--neutral-gray-6);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.energy-fill {
  height: 100%;
  border-radius: var(--radius-sm);
  transition: width var(--transition-normal), background-color var(--transition-normal);
}

.emotion-bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.emotion-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.emotion-label {
  width: 80px;
  font-size: var(--font-size-xs);
  color: var(--neutral-gray-40);
}

.emotion-bar {
  flex: 1;
  height: 6px;
  background: var(--neutral-gray-6);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.emotion-fill {
  height: 100%;
  border-radius: var(--radius-sm);
  transition: width var(--transition-normal);
}

.empty-tasks {
  padding: var(--space-md);
  text-align: center;
  color: var(--neutral-gray-20);
  font-size: var(--font-size-sm);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-sm);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-sm);
}

.task-id {
  font-family: monospace;
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-50);
}

.task-status {
  font-size: var(--font-size-xs);
  color: var(--brand-primary);
}

.connection-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-40);
}

.link-btn {
  border: none;
  background: none;
  color: var(--brand-primary);
  font-size: var(--font-size-xs);
  cursor: pointer;
  padding: 0;
}
.link-btn:disabled { opacity: 0.5; cursor: default; }

.memory-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.memory-stat {
  padding: var(--space-sm);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-sm);
  text-align: center;
}

.memory-stat-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--neutral-gray-30);
  margin-bottom: 2px;
}

.memory-stat-value {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--neutral-gray-50);
}

.memory-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.memory-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

.memory-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--neutral-gray-50);
}

.memory-strength {
  font-size: var(--font-size-xs);
  color: var(--brand-primary);
  font-weight: 600;
}

.connection-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--error);
}

.connection-dot.connected {
  background: var(--success);
}

.state-source {
  margin-left: auto;
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--brand-primary);
  letter-spacing: 0.5px;
}

.agents-display {
  padding: var(--space-md);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-md);
}

.agent-count {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
}

.agent-number {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--neutral-gray-30);
}

.agent-number.online {
  color: var(--success);
}

.agent-label {
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-40);
}

.agent-offline {
  margin-top: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--neutral-gray-20);
}
</style>
