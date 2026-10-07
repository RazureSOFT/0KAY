<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLifeStore } from '../stores/life'
import { useWizardStore } from '../stores/wizard'
import { useUIPatchesStore, type StatusAxis } from '../stores/uiPatches'

const { t } = useI18n()
const lifeStore = useLifeStore()
const ui = useUIPatchesStore()
const wizard = useWizardStore()
const now = ref(new Date())
const age = computed(() => {
  const raw = wizard.persona.birthDate
  if (!raw) return null
  const birth = new Date(`${raw}T00:00:00`)
  if (Number.isNaN(birth.getTime()) || birth > now.value) return null
  const today = now.value
  return today.getFullYear() - birth.getFullYear() - Number(today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()))
})
let clockTimer: ReturnType<typeof setInterval> | null = null

/** Resolve dotted path against life store fields. */
function resolve(path?: string): any {
  if (!path) return undefined
  if (!path.startsWith('life.')) return undefined
  const v = path.slice(5).split('.').reduce((value: any, key) => value?.[key], lifeStore)
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

/* Only 年龄 / 时间 / 时区 (the profile block) plus 心情 (mood) and 情绪 (emotion
   bars) are rendered — see `visibleSections` below. The `bar` / `count` /
   `tasks` / `list` / `memory` / `connection` / kv branches, their helpers
   (`sectionValue` / `emptyText` / `listItems`) and the memory polling that used
   to live here could never be reached: the filter never yields those kinds, so
   they were a permanently dead network poll. Re-add the branch, its helper and
   the filter together if one of those widgets is wanted back. */

onMounted(() => {
  clockTimer = setInterval(() => { now.value = new Date() }, 1000)
})
onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})

const visibleSections = computed(() =>
  ui.statusSections.filter((s) => s.kind === 'mood' || s.kind === 'bars'),
)
const moodColor = computed(() => lifeStore.emotionColor)
const moodMood = computed(() => lifeStore.emotionMood)
</script>

<template>
  <div class="status-panel">
    <div class="panel-header">
      <h2>{{ t('status.title') }}</h2>
      <span v-if="ui.loaded" class="patch-badge">patch</span>
    </div>

    <div class="panel-content">
      <section class="section character-profile">
        <div class="section-header"><span class="section-title">{{ wizard.persona.name || t('chat.defaultCharacter') }}</span></div>
        <dl>
          <div><dt>{{ t('status.age') }}</dt><dd>{{ age === null ? t('status.birthdayUnset') : t('status.ageValue', { age }) }}</dd></div>
          <div><dt>{{ t('status.time') }}</dt><dd><time :datetime="now.toISOString()">{{ now.toLocaleString() }}</time></dd></div>
          <div><dt>{{ t('status.timezone') }}</dt><dd>{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}</dd></div>
        </dl>
      </section>
      <div
        v-for="section in visibleSections"
        :key="section.id"
        class="section"
        :data-section="section.id"
        :data-kind="section.kind"
      >
        <div class="section-header">
          <span class="section-title">{{ labelOf(section) }}</span>
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

        <!-- bars (emotion axes) -->
        <div v-else-if="section.kind === 'bars'" class="emotion-bars">
          <div v-for="axis in section.axes || []" :key="axis.key" class="emotion-row">
            <span class="emotion-label">{{ axisLabel(axis) }}</span>
            <div class="emotion-bar">
              <div
                class="emotion-fill"
                :style="{
                  transform: `scaleX(${Math.max(0, Math.min(1, axisValue(axis)))})`,
                  backgroundColor: axis.color || '#0078d4',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="ui.statusSections.length === 0" class="empty-tasks">
        No status sections (load life.patch)
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-profile dl > div { display: flex; justify-content: space-between; gap: 12px; margin: 10px 0; font-size: 12px; }
.character-profile dt { color: var(--md-on-surface-variant); flex-shrink: 0; }
.character-profile dd { margin: 0; text-align: right; overflow-wrap: anywhere; }
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
  font-size: 11px;
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
  width: 100%;
  transform-origin: left;
  border-radius: var(--radius-sm);
  transition: transform var(--duration-medium) var(--ease-out);
}

/* `.empty-tasks` is still used by the "no status sections" fallback below;
   everything that followed it belonged to the removed task / connection /
   memory / agent branches and has been deleted with them. */
.empty-tasks {
  padding: var(--space-md);
  text-align: center;
  color: var(--neutral-gray-20);
  font-size: var(--font-size-sm);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-sm);
}

</style>
