<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { i18n } from '@0kay/host'

// The chain of thought, with a clock on it.
//
// While the model is thinking, the user gets a live count ("thinking 3s") so a
// long pause reads as work rather than a hang. When it stops, the count freezes
// into "thought for 12s": one number, no log, and the reasoning stays folded
// behind it unless someone wants to read it.

const props = defineProps<{
  reasoning?: string
  open?: boolean
  label?: string
  /** Set while the model is still producing reasoning. */
  running?: boolean
  /** ISO timestamp of when this step started, used to seed the clock. */
  startedAt?: string
}>()

const t = (key: string, params?: Record<string, unknown>) => i18n.global.t(key, params || {})
const pre = ref<HTMLElement | null>(null)
const elapsed = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function seed(): void {
  const started = props.startedAt ? Date.parse(props.startedAt) : NaN
  elapsed.value = Number.isFinite(started) ? Math.max(0, Math.round((Date.now() - started) / 1000)) : 0
}

function stopClock(): void {
  if (timer) { clearInterval(timer); timer = null }
}

function startClock(): void {
  stopClock()
  seed()
  timer = setInterval(() => { elapsed.value += 1 }, 1000)
}

watch(() => props.running, (running) => {
  if (running) startClock()
  else stopClock()
}, { immediate: true })

// An idle chain that no longer receives text freezes at its last value; the
// value keeps something honest on screen rather than a stale spinner.
watch(() => props.reasoning, (value, previous) => {
  if (value && !previous) seed()
  if (props.open) void toBottom()
})

onUnmounted(stopClock)

async function toBottom() {
  await nextTick()
  const el = pre.value
  if (el) el.scrollTop = el.scrollHeight
}

watch(() => props.open, (value) => { if (value) void toBottom() })

const summary = computed(() => {
  if (props.running) return t('agent.page.thinkingNow', { n: elapsed.value })
  if (elapsed.value >= 1) return t('agent.page.thoughtFor', { n: elapsed.value })
  return props.label || t('agent.page.reasoning')
})
</script>

<template>
  <details class="think-chain" :open="open">
    <summary><span class="think-label">{{ summary }}</span><span v-if="running" class="think-pulse" aria-hidden="true" /></summary>
    <pre ref="pre">{{ reasoning }}</pre>
  </details>
</template>

<style scoped>
.think-chain{margin:2px 0 8px;border:0;border-radius:10px;background:var(--md-surface-container-low);overflow:hidden}
.think-chain>summary{display:inline-flex;align-items:center;gap:6px;cursor:pointer;list-style:none;padding:3px 10px;font-size:11px;font-weight:600;letter-spacing:.03em;color:var(--md-on-surface-variant);user-select:none;border-radius:999px;background:var(--md-surface-container)}
.think-chain>summary::-webkit-details-marker{display:none}
.think-chain>summary::before{content:'▸';display:inline-block;transition:transform .15s}
.think-chain[open]>summary::before{transform:rotate(90deg)}
.think-label{font-variant-numeric:tabular-nums}
.think-pulse{width:6px;height:6px;border-radius:50%;background:var(--md-primary);animation:think-pulse 1.4s ease-in-out infinite}
@keyframes think-pulse{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:1;transform:scale(1)}}
.think-chain>pre{margin:0;padding:6px 10px 8px;max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--code-font);font-size:11.5px;line-height:1.55;color:var(--md-on-surface-variant)}
@media (prefers-reduced-motion:reduce){.think-pulse{animation:none}}
</style>
