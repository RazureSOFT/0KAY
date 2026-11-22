<script setup lang="ts">
/**
 * MD3 tabs.
 *
 * Two variants, per spec: `primary` for three to five top-level destinations,
 * `secondary` for a larger set nested inside one of them. The distinction is not
 * decoration — primary tabs are allowed to carry the page's main hierarchy, so
 * using them for ten sub-views is what makes a tab bar look like a form.
 *
 * This replaces the task panel's ten flat tabs, which had no notion of "these are
 * top level, those are inside".
 *
 * The active indicator is a bar that slides between tabs rather than a background
 * that jumps, so movement tells you *which direction* the selection went. It is
 * the one place a spatial spring is used in this component: the bar overshoots
 * very slightly (the default spring's +1.5%) and settles.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface TabItem {
  /** Stable id; also the value emitted on change. */
  id: string
  /** Visible label. */
  label: string
  /** Optional leading glyph. IconSize is 24dp in the tab tokens. */
  icon?: string
  /** Optional count or short status shown after the label. */
  badge?: string | number
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  tabs: TabItem[]
  /** Selected tab id (v-model). */
  modelValue: string
  variant?: 'primary' | 'secondary'
  /** Accessible label for the tablist. */
  label?: string
}>(), {
  variant: 'primary',
  label: '',
})

const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()

const list = ref<HTMLElement | null>(null)
const indicator = ref<{ left: number; width: number } | null>(null)

/** Measure the selected tab so the indicator can sit under it. */
function measure() {
  const host = list.value
  if (!host) return
  const active = host.querySelector<HTMLElement>('[aria-selected="true"]')
  if (!active) {
    indicator.value = null
    return
  }
  indicator.value = { left: active.offsetLeft, width: active.offsetWidth }
}

function select(tab: TabItem) {
  if (tab.disabled || tab.id === props.modelValue) return
  emit('update:modelValue', tab.id)
}

/**
 * Arrow-key navigation, which a tablist is required to support.
 *
 * Selection and focus are separate in ARIA, but in a tablist they move together:
 * an arrow press moves focus *and* activates. So the starting point is the tab the
 * event came from, not `modelValue` — a controlled parent may not have applied the
 * previous emission yet, and reading the prop would then make two quick presses
 * both move from the same origin.
 */
function onKeydown(event: KeyboardEvent) {
  const enabled = props.tabs.filter((tab) => !tab.disabled)
  if (!enabled.length) return

  // Prefer the tab that actually had focus; fall back to the model.
  const focused = (event.target as HTMLElement | null)?.getAttribute('role') === 'tab'
    ? (event.target as HTMLElement).dataset.tabId
    : undefined
  const currentId = focused || props.modelValue
  const index = enabled.findIndex((tab) => tab.id === currentId)
  if (index < 0) return

  let next = -1
  if (event.key === 'ArrowRight') next = (index + 1) % enabled.length
  else if (event.key === 'ArrowLeft') next = (index - 1 + enabled.length) % enabled.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = enabled.length - 1
  if (next < 0) return

  event.preventDefault()
  emit('update:modelValue', enabled[next].id)
}

let observer: ResizeObserver | null = null

onMounted(() => {
  void nextTick(measure)
  if (typeof ResizeObserver !== 'undefined' && list.value) {
    observer = new ResizeObserver(() => measure())
    observer.observe(list.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

watch(() => props.modelValue, () => void nextTick(measure))
watch(() => props.tabs, () => void nextTick(measure), { deep: true })

const classes = computed(() => ['md-tabs', `md-tabs--${props.variant}`])

const indicatorStyle = computed(() => {
  const value = indicator.value
  if (!value) return { display: 'none' }
  return {
    '--md-tab-indicator-left': `${value.left}px`,
    '--md-tab-indicator-width': `${value.width}px`,
  } as Record<string, string>
})
</script>

<template>
  <div
    ref="list"
    :class="classes"
    role="tablist"
    :aria-label="label || undefined"
    @keydown="onKeydown"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="md-tabs__tab"
      :class="{ 'is-selected': tab.id === modelValue }"
      :data-tab-id="tab.id"
      :aria-selected="tab.id === modelValue"
      :disabled="tab.disabled"
      :tabindex="tab.id === modelValue ? 0 : -1"
      @click="select(tab)"
    >
      <span v-if="tab.icon" class="md-tabs__icon" aria-hidden="true">{{ tab.icon }}</span>
      <span class="md-tabs__label">{{ tab.label }}</span>
      <span v-if="tab.badge !== undefined && tab.badge !== ''" class="md-tabs__badge">{{ tab.badge }}</span>
    </button>

    <span
      class="md-tabs__indicator"
      :style="indicatorStyle"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.md-tabs {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 0;
  /* The indicator is absolutely positioned, so the bar itself must not clip it
     and the tablist must establish the coordinate space. */
  isolation: isolate;
}

.md-tabs__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  border: 0;
  background: transparent;
  color: var(--md-on-surface-variant);
  /* `PrimaryNavigationTabTokens.LabelTextFont = TitleSmall`, not LabelLarge. */
  font: var(--md-type-title-small-font);
  letter-spacing: var(--md-type-title-small-tracking);
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--duration-short) var(--ease-out);
}

/* Touch target: 48dp tall even though the visible label is smaller. A tab with an
   icon grows to 64dp (`IconAndLabelTextContainerHeight`). */
.md-tabs--primary .md-tabs__tab {
  block-size: 48px;
}
.md-tabs--primary .md-tabs__tab:has(.md-tabs__icon) {
  block-size: 64px;
}
.md-tabs--secondary .md-tabs__tab {
  block-size: 40px;
}

.md-tabs__tab:hover:not(:disabled) {
  /* InactiveHoverIconColor / InactiveHoverLabelTextColor = on-surface */
  color: var(--md-on-surface);
}

.md-tabs__tab.is-selected {
  color: var(--md-primary);
}

.md-tabs__tab:disabled {
  color: var(--md-on-surface-variant);
  opacity: 0.38;
  cursor: not-allowed;
}

.md-tabs__icon {
  display: inline-grid;
  place-items: center;
  inline-size: 24px;
  block-size: 24px;
  flex: none;
}

.md-tabs__badge {
  display: inline-grid;
  place-items: center;
  min-inline-size: 16px;
  block-size: 16px;
  padding-inline: 4px;
  border-radius: var(--md-shape-full);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font: var(--md-type-label-small-font);
  font-variant-numeric: tabular-nums;
}

/* The sliding bar. `translate` carries the movement so the browser can animate it
   without laying out; the spring gives it a small settle instead of a stop. */
.md-tabs__indicator {
  position: absolute;
  inset-block-end: 0;
  inset-inline-start: var(--md-tab-indicator-left, 0);
  inline-size: var(--md-tab-indicator-width, 0);
  block-size: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--md-primary);
  transition:
    inset-inline-start var(--md-spring-expressive-default-spatial-dur, 399ms) var(--md-spring-soft, ease-out),
    inline-size var(--md-spring-expressive-default-spatial-dur, 399ms) var(--md-spring-soft, ease-out),
    opacity var(--duration-short) var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .md-tabs__indicator {
    transition: opacity 1ms;
  }
}
</style>