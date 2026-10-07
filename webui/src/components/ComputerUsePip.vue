<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type TaskRow = { task_id?: string; prompt?: string; state?: string }

const visible = ref(false)
const dismissed = ref(false)
const active = ref(false)
const status = ref<'unknown' | 'on' | 'off'>('unknown')
const streamSrc = ref('')
const position = ref<{ x: number; y: number } | null>(null)
const size = ref({ w: 380, h: 260 })
const dragging = ref(false)
const resizing = ref(false)
const root = ref<HTMLElement | null>(null)

const tasks = new Map<string, TaskRow>()
let source: EventSource | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
let statusTimer: ReturnType<typeof setInterval> | undefined

function recompute() {
  const running = [...tasks.values()].some(
    (task) => String(task.prompt || '').toLowerCase() === 'computeruse' && task.state === 'running',
  )
  if (running && !active.value) onStart()
  else if (!running && active.value) onStop()
  active.value = running
}

function applyDelta(delta: any) {
  if (!delta) return
  if (delta.reset) tasks.clear()
  for (const row of delta.tasks || []) if (row?.task_id) tasks.set(row.task_id, row)
  for (const gone of delta.removed || []) tasks.delete(gone)
  recompute()
}

function connect() {
  if (source) return
  try {
    const es = new EventSource('/api/tasks/events')
    es.addEventListener('tasks', (event: MessageEvent) => {
      try { applyDelta(JSON.parse(event.data)) } catch { /* ignore malformed frame */ }
    })
    source = es
  } catch { /* EventSource unavailable */ }
}

function onStart() {
  dismissed.value = false
  visible.value = true
  void refreshStatus()
}

function onStop() {
  if (!visible.value || dismissed.value) return
  clearTimeout(hideTimer)
  // Keep the window briefly after the last action so short tool steps do not flicker.
  hideTimer = setTimeout(() => { if (!active.value && !dismissed.value) visible.value = false }, 4000)
}

function close() {
  visible.value = false
  dismissed.value = true
  clearTimeout(hideTimer)
}

function open() {
  dismissed.value = false
  visible.value = true
  void refreshStatus()
}

async function refreshStatus() {
  try {
    const response = await fetch('/api/agent/computeruse', { signal: AbortSignal.timeout(6000) })
    if (!response.ok) { status.value = 'unknown'; return }
    const data = await response.json()
    status.value = data?.enabled ? 'on' : 'off'
  } catch { status.value = 'unknown' }
}

watch([visible, status], () => {
  if (visible.value && status.value === 'on') {
    if (!streamSrc.value) streamSrc.value = `/api/agent/computeruse/stream?ts=${Date.now()}`
  } else {
    streamSrc.value = ''
  }
})

const dragStart = { x: 0, y: 0, px: 0, py: 0 }
function startDrag(event: PointerEvent) {
  if ((event.target as HTMLElement).closest('button')) return
  const el = root.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  position.value = { x: rect.left, y: rect.top }
  dragStart.x = event.clientX
  dragStart.y = event.clientY
  dragStart.px = rect.left
  dragStart.py = rect.top
  dragging.value = true
  el.setPointerCapture(event.pointerId)
}
function onDrag(event: PointerEvent) {
  if (!dragging.value) return
  const x = Math.min(Math.max(8, dragStart.px + event.clientX - dragStart.x), Math.max(8, window.innerWidth - size.value.w - 8))
  const y = Math.min(Math.max(8, dragStart.py + event.clientY - dragStart.y), Math.max(8, window.innerHeight - 48))
  position.value = { x, y }
}
function endDrag(event: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  root.value?.releasePointerCapture?.(event.pointerId)
  persist()
}

const resizeStart = { x: 0, y: 0, w: 0, h: 0 }
function startResize(event: PointerEvent) {
  event.stopPropagation()
  resizeStart.x = event.clientX
  resizeStart.y = event.clientY
  resizeStart.w = size.value.w
  resizeStart.h = size.value.h
  resizing.value = true
  ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
}
function onResize(event: PointerEvent) {
  if (!resizing.value) return
  size.value = {
    w: Math.min(Math.max(260, resizeStart.w + event.clientX - resizeStart.x), 900),
    h: Math.min(Math.max(180, resizeStart.h + event.clientY - resizeStart.y), 700),
  }
}
function endResize(event: PointerEvent) {
  if (!resizing.value) return
  resizing.value = false
  ;(event.target as HTMLElement).releasePointerCapture?.(event.pointerId)
  persist()
}

function persist() {
  try {
    if (position.value) localStorage.setItem('0kay.web.computeruse.pos', JSON.stringify(position.value))
    localStorage.setItem('0kay.web.computeruse.size', JSON.stringify(size.value))
  } catch { /* storage disabled */ }
}

const style = computed<Record<string, string>>(() => {
  const s: Record<string, string> = { width: `${size.value.w}px`, height: `${size.value.h}px` }
  if (position.value) { s.left = `${position.value.x}px`; s.top = `${position.value.y}px` }
  else { s.right = '24px'; s.bottom = '88px' }
  return s
})

onMounted(() => {
  try {
    const savedPosition = localStorage.getItem('0kay.web.computeruse.pos')
    if (savedPosition) position.value = JSON.parse(savedPosition)
    const savedSize = localStorage.getItem('0kay.web.computeruse.size')
    if (savedSize) size.value = JSON.parse(savedSize)
  } catch { /* storage disabled */ }
  connect()
  statusTimer = setInterval(() => { if (visible.value) void refreshStatus() }, 15000)
})

onUnmounted(() => {
  source?.close()
  clearTimeout(hideTimer)
  clearInterval(statusTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cu-fab">
      <button v-if="active && !visible" class="cu-fab" @click="open">
        <span class="cu-fab-dot"></span>
        {{ t('computerUse.inUse') }}
      </button>
    </Transition>
    <Transition name="cu-win">
      <section
        v-if="visible"
        ref="root"
        class="cu-window"
        :class="{ dragging, resizing }"
        :style="style"
        role="dialog"
        :aria-label="t('computerUse.ariaInUse')"
        @pointermove="onDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      >
        <header class="cu-head" @pointerdown="startDrag">
          <span class="cu-dot" :class="{ live: active }"></span>
          <span class="cu-title">{{ t('computerUse.inUse') }}</span>
          <button class="cu-close" :title="t('common.close')" :aria-label="t('common.close')" @click="close">✕</button>
        </header>
        <div class="cu-body">
          <img v-if="streamSrc" class="cu-video" :src="streamSrc" :alt="t('computerUse.liveDesktop')" />
          <div v-else class="cu-placeholder">
            <p v-if="status === 'off'">{{ t('computerUse.off') }}</p>
            <p v-else-if="status === 'unknown'">{{ t('computerUse.noAgent') }}</p>
            <p v-else>{{ t('computerUse.waiting') }}</p>
          </div>
        </div>
        <span
          class="cu-resize"
          :title="t('computerUse.resize')"
          @pointerdown="startResize"
          @pointermove="onResize"
          @pointerup="endResize"
          @pointercancel="endResize"
        ></span>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cu-window {
  position: fixed;
  z-index: var(--z-popover);
  display: flex;
  flex-direction: column;
  min-width: 260px;
  min-height: 180px;
  overflow: hidden;
  border-radius: 20px;
  background: var(--md-surface-container);
  color: var(--md-on-surface);
  border: 1px solid var(--md-outline-variant);
  box-shadow: var(--shadow-3);
}
.cu-window.dragging,
.cu-window.resizing { user-select: none; }
.cu-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: grab;
  background: var(--md-surface-container-high, var(--md-surface-container));
  border-bottom: 1px solid var(--md-outline-variant);
}
.cu-window.dragging .cu-head { cursor: grabbing; }
.cu-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex: none;
  background: var(--md-outline);
}
.cu-dot.live {
  background: var(--md-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--md-success) 20%, transparent);
  animation: cu-pulse 1.6s var(--ease-emphasized) infinite;
}
.cu-title {
  flex: 1;
  font-size: 12.5px;
  font-weight: 650;
  letter-spacing: 0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cu-close {
  flex: none;
  border: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  font: inherit;
  line-height: 1;
  color: var(--md-on-surface-variant);
  background: transparent;
}
.cu-close:hover { background: var(--md-surface-container-highest, var(--md-surface-container)); }
.cu-body {
  position: relative;
  flex: 1;
  min-height: 0;
  background: #000;
}
.cu-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}
.cu-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
  text-align: center;
  color: var(--md-on-surface-variant);
  font-size: 13px;
}
.cu-resize {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: linear-gradient(135deg, transparent 50%, var(--md-outline) 50%);
  border-bottom-right-radius: 18px;
  opacity: 0.7;
}
.cu-fab {
  position: fixed;
  right: 24px;
  bottom: 88px;
  z-index: var(--z-popover);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 999px;
  padding: 10px 16px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  color: var(--md-on-primary);
  background: var(--md-primary);
  box-shadow: var(--shadow-3);
}
.cu-fab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--md-success);
  animation: cu-pulse 1.6s var(--ease-emphasized) infinite;
}
@keyframes cu-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.cu-fab-enter-active { transition: opacity 180ms var(--ease-emphasized-decel), transform 180ms var(--ease-emphasized-decel); }
.cu-fab-leave-active { transition: opacity 140ms var(--ease-emphasized-accel), transform 140ms var(--ease-emphasized-accel); }
.cu-fab-enter-from, .cu-fab-leave-to { opacity: 0; transform: translateY(10px) scale(0.94); }
.cu-win-enter-active { transition: opacity 200ms var(--ease-emphasized-decel), transform 200ms var(--ease-emphasized-decel); }
.cu-win-leave-active { transition: opacity 140ms var(--ease-emphasized-accel), transform 140ms var(--ease-emphasized-accel); }
.cu-win-enter-from, .cu-win-leave-to { opacity: 0; transform: translateY(12px) scale(0.97); }
@media (prefers-reduced-motion: reduce) {
  .cu-dot.live, .cu-fab-dot { animation: none; }
  .cu-fab-enter-active, .cu-fab-leave-active, .cu-win-enter-active, .cu-win-leave-active { transition-duration: 1ms; }
  .cu-fab-enter-from, .cu-fab-leave-to, .cu-win-enter-from, .cu-win-leave-to { transform: none; }
}
</style>
