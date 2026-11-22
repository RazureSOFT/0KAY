<script setup lang="ts">
/**
 * A draggable, resizable floating panel.
 *
 * The agent page is built around these: six of them (browser, file editor, terminal,
 * project tree, usage, host) share one behaviour and each persists its own position and
 * size (`0kay.agent.<panel>.pos` / `.size`). The earlier demos drew the dock as four
 * decorative buttons and never rendered a panel, so the whole right side of the page was
 * missing the thing it controls.
 *
 * Interaction, matching the real page's pointer handlers (`onToolbarDown`,
 * `onResizeDown`):
 *
 *   - drag the title bar to move
 *   - drag the bottom-right grip to resize
 *   - pointer capture, so a fast drag does not escape the handle
 *   - clamped to the viewport so a panel cannot be dragged out of reach
 *   - position and size written back to storage on release, not on every frame
 *
 * Geometry is applied with `translate` rather than `left/top` so moving a panel does not
 * trigger layout — it is a compositor-only change, which matters when the panel holds an
 * iframe or a terminal.
 */
import { computed, ref, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  /** Stable id; also the storage key suffix (`0kay.agent.<id>.pos`). */
  id: string
  title: string
  /** Optional subtitle, e.g. the current URL or working directory. */
  subtitle?: string
  /** Starting box, used when nothing is stored yet. */
  width?: number
  height?: number
  /** Rendered in the title bar, right of the title. */
  icon?: string
}>(), {
  width: 420,
  height: 300,
  subtitle: '',
  icon: '',
})

const emit = defineEmits<{ (event: 'close'): void }>()

interface Rect { x: number; y: number; w: number; h: number }

const MIN_W = 280
const MIN_H = 180

/** Panels must stay reachable: never let a drag put the title bar off-screen. */
function clamp(rect: Rect): Rect {
  const maxX = window.innerWidth - 120
  const maxY = window.innerHeight - 48
  return {
    x: Math.min(Math.max(-rect.w + 160, rect.x), maxX),
    y: Math.min(Math.max(0, rect.y), maxY),
    w: Math.max(MIN_W, rect.w),
    h: Math.max(MIN_H, rect.h),
  }
}

/**
 * Slot for a panel that has never been positioned.
 *
 * Derived from the id so it is stable across reloads, and spread across the free area to
 * the right of the sidebar. Centring every panel with the same offset made three open
 * windows look like one — which hid the fact that they had opened at all.
 */
const SLOT_ORDER: Record<string, number> = {
  browser: 0,
  tree: 1,
  file: 2,
  term: 3,
  git: 4,
  usage: 5,
}

function load(): Rect {
  const slot = SLOT_ORDER[props.id] ?? 0
  /* Two columns of three, offset down-right per row so the title bars stay clickable. */
  const col = slot % 2
  const row = Math.floor(slot / 2)
  const fallback: Rect = {
    x: Math.round(window.innerWidth * 0.34) + col * 300 + row * 24,
    y: 88 + row * 190 + slot * 6,
    w: props.width,
    h: props.height,
  }
  try {
    const pos = JSON.parse(localStorage.getItem(`agent.${props.id}.pos`) || 'null')
    const size = JSON.parse(localStorage.getItem(`agent.${props.id}.size`) || 'null')
    return clamp({
      x: Number.isFinite(pos?.x) ? pos.x : fallback.x,
      y: Number.isFinite(pos?.y) ? pos.y : fallback.y,
      w: Number.isFinite(size?.w) ? size.w : fallback.w,
      h: Number.isFinite(size?.h) ? size.h : fallback.h,
    })
  } catch {
    return fallback
  }
}

const rect = ref<Rect>(load())

const style = computed(() => ({
  translate: `${rect.value.x}px ${rect.value.y}px`,
  inlineSize: `${rect.value.w}px`,
  blockSize: `${rect.value.h}px`,
}) as Record<string, string>)

/* --- drag --- */
let dragging: { mode: 'move' | 'resize'; startX: number; startY: number; base: Rect } | null = null

function begin(mode: 'move' | 'resize', event: PointerEvent) {
  if (event.button !== 0) return
  dragging = { mode, startX: event.clientX, startY: event.clientY, base: { ...rect.value } }
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  event.preventDefault()
}

function onMove(event: PointerEvent) {
  if (!dragging) return
  const dx = event.clientX - dragging.startX
  const dy = event.clientY - dragging.startY
  if (dragging.mode === 'move') {
    rect.value = clamp({ ...dragging.base, x: dragging.base.x + dx, y: dragging.base.y + dy })
  } else {
    rect.value = clamp({
      ...dragging.base,
      /* Resizing grows from the top-left corner, which is where the grip's reference is. */
      w: dragging.base.w + dx,
      h: dragging.base.h + dy,
    })
  }
}

function onUp() {
  if (!dragging) return
  dragging = null
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  /* Persist on release only: writing on every frame would hit storage ~60 times a second. */
  try {
    localStorage.setItem(`agent.${props.id}.pos`, JSON.stringify({ x: rect.value.x, y: rect.value.y }))
    localStorage.setItem(`agent.${props.id}.size`, JSON.stringify({ w: rect.value.w, h: rect.value.h }))
  } catch {
    /* Storage may be full or disabled; the panel still works for this session. */
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
})

/** Keyboard nudging: dragging is not the only way to position a window. */
function nudge(event: KeyboardEvent) {
  const step = event.shiftKey ? 32 : 8
  const map: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
  }
  const delta = map[event.key]
  if (!delta) return
  rect.value = clamp({ ...rect.value, x: rect.value.x + delta[0], y: rect.value.y + delta[1] })
  event.preventDefault()
  onUp()
}
</script>

<template>
  <section class="float" :style="style" role="dialog" :aria-label="title">
    <header class="float-bar" tabindex="0" @pointerdown="begin('move', $event)" @keydown="nudge">
      <span v-if="icon" class="float-glyph" aria-hidden="true" v-html="icon" />
      <span class="float-title md-type-label-large">{{ title }}</span>
      <span v-if="subtitle" class="float-sub md-type-label-small">{{ subtitle }}</span>
      <span class="float-spacer" />
      <button type="button" class="float-x" aria-label="关闭" @pointerdown.stop @click="emit('close')">×</button>
    </header>

    <div class="float-body">
      <slot />
    </div>

    <span class="float-grip" aria-hidden="true" @pointerdown="begin('resize', $event)" />
  </section>
</template>

<style scoped>
.float {
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  /* `translate` instead of left/top: moving a window should not cause layout, and these
     can contain an iframe or a terminal where a relayout is visible. */
  overflow: hidden;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
  box-shadow: var(--md-elevation-3);
  /* No transition on translate: it would lag behind the pointer during a drag. */
}

.float-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px 12px;
  flex: none;
  background: var(--md-surface-container-high);
  border-block-end: 1px solid var(--md-outline-variant);
  cursor: grab;
  user-select: none;
}
.float-bar:active { cursor: grabbing; }
.float-bar:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: -2px;
}

.float-glyph {
  display: grid;
  place-items: center;
  inline-size: 18px;
  block-size: 18px;
  flex: none;
  color: var(--md-on-surface-variant);
}
.float-glyph :deep(svg) { inline-size: 100%; block-size: 100%; }

.float-title { color: var(--md-on-surface); white-space: nowrap; }
.float-sub {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--md-on-surface-variant);
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0;
}
.float-spacer { flex: 1; }

.float-x {
  display: grid;
  place-items: center;
  inline-size: 28px;
  block-size: 28px;
  flex: none;
  border: 0;
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: background-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat);
}
.float-x:hover { background: var(--md-surface-container-highest); color: var(--md-on-surface); }

.float-body {
  flex: 1;
  min-block-size: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

/* The resize grip is the conventional corner: a rounded L drawn with two borders. */
.float-grip {
  position: absolute;
  inset-inline-end: 0;
  inset-block-end: 0;
  inline-size: 16px;
  block-size: 16px;
  cursor: nwse-resize;
  border-inline-end: 9px solid var(--md-outline);
  border-block-end: 9px solid var(--md-outline);
  border-start-start-radius: 8px;
  opacity: 0.7;
  touch-action: none;
}
</style>