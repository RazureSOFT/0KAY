<script setup lang="ts">
/**
 * MD3 tooltip.
 *
 * Replaces two competing systems: `.hint` (a dark popover with a bold title and a
 * muted body, absolutely positioned above the control) and `.ctx-tip` (a light
 * card that duplicates content). They used different surfaces, different radii,
 * different delays, and only one of them was reachable by keyboard.
 *
 * This component owns both the positioning and the surface, because the two are
 * inseparable: a tooltip that opens upward must know where its trigger is, and it
 * must live outside any `overflow: hidden` ancestor. See `place()` for how that is
 * done and why the naive approach fails.
 *
 * Slots:
 *  - default: the trigger (a button, usually)
 *  - title: optional bold first line (the old `.hint b`)
 *  - body: optional muted second line (the old `.hint i`)
 *
 * Behaviour:
 *  - hover, and keyboard focus — the old CSS only handled hover, so a keyboard
 *    user never saw any tooltip
 *  - `Escape` dismisses without moving focus
 *  - a short open delay, except for keyboard focus, which shows immediately
 */
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** Where to prefer opening. The opposite side is used when there is no room. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Milliseconds before showing on hover. Keyboard focus always shows at once. */
  delay?: number
  /** Disable the tooltip without removing the trigger. */
  disabled?: boolean
}>(), {
  placement: 'top',
  delay: 350,
  disabled: false,
})

const open = ref(false)
const anchor = ref<HTMLElement | null>(null)
const bubble = ref<HTMLElement | null>(null)
const id = `md-tip-${useId()}`
let showTimer: ReturnType<typeof setTimeout> | null = null

/** Gap between the trigger and the bubble, and the minimum viewport margin. */
const GAP = 9
const EDGE = 8

function clearTimer() {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
}

function schedule(immediate = false) {
  if (props.disabled) return
  clearTimer()
  if (immediate) {
    open.value = true
    return
  }
  showTimer = setTimeout(() => {
    open.value = true
  }, props.delay)
}

function hide() {
  clearTimer()
  open.value = false
}

/**
 * Position the bubble against the viewport.
 *
 * Three things make this more than a `bottom: 100%`:
 *
 *  1. The trigger usually sits inside a container with `overflow: hidden` (the
 *     conversation pane, the route container, the app main column). An absolutely
 *     positioned bubble is clipped by the nearest such ancestor, so the tooltip is
 *     painted and invisible. The bubble is therefore `position: fixed`.
 *  2. `position: fixed` is still relative to the nearest ancestor with a
 *     `transform` — and many of these triggers animate `transform` on hover. The
 *     bubble would then move with the button and land at roughly doubled
 *     coordinates. So placement is calibrated: write the intended position, read
 *     back where the box actually landed, and correct by the difference. One layout
 *     read on open, correct for any nesting.
 *  3. It must stay inside the viewport even when the trigger is at an edge.
 */
function place() {
  const trigger = anchor.value
  const tip = bubble.value
  if (!trigger || !tip) return

  const box = trigger.getBoundingClientRect()
  const width = tip.offsetWidth || 190
  const height = tip.offsetHeight || 0
  const vw = window.innerWidth
  const vh = window.innerHeight

  const fits = {
    top: box.top - GAP - height >= EDGE,
    bottom: box.bottom + GAP + height <= vh - EDGE,
    left: box.left - GAP - width >= EDGE,
    right: box.right + GAP + width <= vw - EDGE,
  }

  // Honour the request when it fits, otherwise take the opposite, otherwise the
  // side with the most room.
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
  let side = props.placement as keyof typeof fits
  if (!fits[side]) {
    if (fits[opposite[side]]) side = opposite[side]
    else {
      const room = { top: box.top, bottom: vh - box.bottom, left: box.left, right: vw - box.right }
      side = (Object.entries(room).sort((a, b) => b[1] - a[1])[0][0]) as keyof typeof fits
    }
  }

  let x: number
  let y: number
  if (side === 'top' || side === 'bottom') {
    x = box.left + box.width / 2 - width / 2
    y = side === 'top' ? box.top - GAP - height : box.bottom + GAP
  } else {
    y = box.top + box.height / 2 - height / 2
    x = side === 'left' ? box.left - GAP - width : box.right + GAP
  }

  x = Math.max(EDGE, Math.min(x, vw - width - EDGE))
  y = Math.max(EDGE, Math.min(y, vh - height - EDGE))

  tip.style.translate = `${x}px ${y}px`
  const rect = tip.getBoundingClientRect()
  const dx = Math.abs(rect.left - x) < 1 ? 0 : rect.left - x
  const dy = Math.abs(rect.top - y) < 1 ? 0 : rect.top - y
  if (dx || dy) tip.style.translate = `${Math.round(x - dx)}px ${Math.round(y - dy)}px`
  tip.dataset.side = side
}

watch(open, async (value) => {
  if (!value) return
  // Let the bubble render so it can be measured, then place it before paint.
  await Promise.resolve()
  place()
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    hide()
    event.stopPropagation()
  }
}

/** Reposition while open, so a scroll does not leave the bubble behind. */
function onViewportChange() {
  if (open.value) place()
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', onViewportChange, { passive: true, capture: true })
  window.addEventListener('resize', onViewportChange, { passive: true })
}

onBeforeUnmount(() => {
  clearTimer()
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onViewportChange, { capture: true } as EventListenerOptions)
    window.removeEventListener('resize', onViewportChange)
  }
})

const bubbleClasses = computed(() => ['md-tooltip', `md-tooltip--${props.placement}`])
</script>

<template>
  <span
    ref="anchor"
    class="md-tooltip-anchor"
    @pointerenter="schedule(false)"
    @pointerleave="hide"
    @focusin="schedule(true)"
    @focusout="hide"
    @keydown="onKeydown"
  >
    <slot />
  </span>

  <Teleport to="body">
    <span
      v-if="open"
      :id="id"
      ref="bubble"
      :class="bubbleClasses"
      role="tooltip"
    >
      <slot name="title" />
      <slot name="body" />
    </span>
  </Teleport>
</template>

<style scoped>
.md-tooltip-anchor {
  display: inline-flex;
}

.md-tooltip {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: var(--z-popover, 5000);
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-inline-size: 280px;
  min-inline-size: 0;
  padding: 8px 12px;
  /* MD3 tooltip container: inverted surface, small radius, no border. */
  border-radius: var(--md-shape-small);
  background: var(--md-inverse-surface);
  color: var(--md-inverse-on-surface);
  font: var(--md-type-body-medium-font);
  letter-spacing: var(--md-type-body-medium-tracking);
  text-align: start;
  /* MD3 tooltips are not wrappable by default, but these carry sentences, so they
     wrap; the max width keeps a long sentence readable rather than a 600px line. */
  white-space: normal;
  box-shadow: var(--shadow-2);
  pointer-events: none;
  /* Enter only. A tooltip that fades out lingers over the thing it describes. */
  animation: md-tooltip-in 90ms var(--ease-out);
}

.md-tooltip :deep(b) {
  font-weight: 600;
}

.md-tooltip :deep(i) {
  font-style: normal;
  opacity: 0.78;
}

@keyframes md-tooltip-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .md-tooltip {
    animation: none;
  }
}
</style>