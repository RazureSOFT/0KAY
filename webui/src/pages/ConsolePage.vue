<script setup lang="ts">
/**
 * Observability console: live logs plus a trace timeline.
 *
 * Reads three Core endpoints and holds one SSE connection:
 *   GET  /api/console/logs    bounded snapshot
 *   GET  /api/console/spans   bounded snapshot
 *   GET  /api/console/stream  live `log` / `span` / `ready` frames
 *
 * The stream is opened once and re-opened on demand after an error; there is no
 * polling fallback, because a console that quietly stops updating is worse than
 * one that says it disconnected.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiGet, apiPost, apiPut, streamSSE } from '../api'
import { useConfirm } from '../composables/confirm'

interface LogField {
  [key: string]: unknown
}

interface LogRecord {
  time: string
  level: string
  message: string
  fields?: LogField
  trace_id?: string
  span_id?: string
  source?: string
}

interface SpanEvent {
  unix_nano: number
  name: string
  attrs?: Record<string, string>
}

interface SpanRecord {
  trace_id: string
  span_id: string
  parent_id?: string
  name: string
  kind: string
  start_unix_nano: number
  duration_ns: number
  status: string
  error?: string
  attrs?: Record<string, string>
  events?: SpanEvent[]
}

type Tab = 'logs' | 'traces'

const { t } = useI18n()
const { confirm } = useConfirm()

const tab = ref<Tab>('logs')
const logs = ref<LogRecord[]>([])
const spans = ref<SpanRecord[]>([])
const level = ref('INFO')
const query = ref('')
const follow = ref(true)
const connected = ref(false)
const streamError = ref('')
const busy = ref(false)
const pane = ref<HTMLElement | null>(null)

/** Bounded client-side buffers. Core already caps its own ring; these keep the
 *  DOM from growing without limit during a long session. */
const MAX_ROWS = 1000

let controller: AbortController | null = null

const LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR']

function levelIndex(name: string): number {
  const i = LEVELS.indexOf(String(name).toUpperCase())
  return i === -1 ? 1 : i
}

const levelClass = (name: string) => String(name || '').toLowerCase()

function fmtTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  const pad = (n: number, w = 2) => String(n).padStart(w, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
}

/**
 * Human-readable duration.
 *
 * The micro sign is written as an escape on purpose. This file has been through
 * a PowerShell encoding round-trip that silently swapped non-ASCII glyphs for
 * lookalike CJK characters (a middle dot became 路, the micro sign became 碌),
 * and both survived review because they render as *something* plausible-looking.
 * An escape cannot be mangled by any tool that mishandles the file's encoding.
 */
function fmtDuration(ns: number): string {
  if (!ns || ns < 0) return '\u2014'
  if (ns < 1_000) return `${ns}ns`
  if (ns < 1_000_000) return `${(ns / 1_000).toFixed(0)}\u00B5s`
  if (ns < 1_000_000_000) return `${(ns / 1_000_000).toFixed(1)}ms`
  return `${(ns / 1_000_000_000).toFixed(2)}s`
}

function parse<T>(raw: string | undefined): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/** Everything except the well-known envelope keys, so the row shows the
 *  attributes that actually carry information. */
function extraFields(rec: LogRecord): Array<[string, unknown]> {
  if (!rec.fields) return []
  return Object.entries(rec.fields).filter(
    ([key]) => key !== 'time' && key !== 'level' && key !== 'msg' && key !== 'component' && key !== 'trace_id' && key !== 'span',
  )
}

const componentOf = (rec: LogRecord) =>
    rec.fields && typeof rec.fields.component === 'string' ? (rec.fields.component as string) : rec.source || '—'

/* ---------------------------------------------------------------- filtering */

const minLevelIndex = computed(() => levelIndex(level.value))

const filteredLogs = computed(() => {
  const floor = minLevelIndex.value
  const needle = query.value.trim().toLowerCase()
  return logs.value.filter((rec) => {
    if (levelIndex(rec.level) < floor) return false
    if (!needle) return true
    return (
      rec.message.toLowerCase().includes(needle) ||
      (rec.trace_id || '').includes(needle) ||
      componentOf(rec).toLowerCase().includes(needle) ||
      extraFields(rec).some(([, v]) => String(v).toLowerCase().includes(needle))
    )
  })
})

/** Spans newest first, since that is how you read a failure. */
const filteredSpans = computed(() => {
  const needle = query.value.trim().toLowerCase()
  const list = [...spans.value].reverse()
  if (!needle) return list
  return list.filter(
    (s) =>
      s.name.toLowerCase().includes(needle) ||
      s.trace_id.includes(needle) ||
      (s.error || '').toLowerCase().includes(needle) ||
      Object.entries(s.attrs || {}).some(([, v]) => v.toLowerCase().includes(needle)),
  )
})

const errorCount = computed(() => logs.value.filter((r) => levelIndex(r.level) >= levelIndex('ERROR')).length)

/** Traces that have a child span, rendered as an indented tree. A flat list is
 *  much harder to read once a request fans out into mocr and the agent. */
interface TraceNode {
  span: SpanRecord
  depth: number
}

const traceTree = computed<TraceNode[]>(() => {
  const byParent = new Map<string, SpanRecord[]>()
  const roots: SpanRecord[] = []
  const ids = new Set(filteredSpans.value.map((s) => s.span_id))
  for (const span of filteredSpans.value) {
    const parent = span.parent_id && ids.has(span.parent_id) ? span.parent_id : ''
    if (!parent) {
      roots.push(span)
      continue
    }
    const bucket = byParent.get(parent)
    if (bucket) bucket.push(span)
    else byParent.set(parent, [span])
  }
  const out: TraceNode[] = []
  const walk = (span: SpanRecord, depth: number) => {
    out.push({ span, depth })
    for (const child of byParent.get(span.span_id) || []) walk(child, depth + 1)
  }
  // Longest trace first: a deep tree is the interesting one.
  for (const root of roots.sort((a, b) => a.start_unix_nano - b.start_unix_nano)) walk(root, 0)
  return out
})

/** Share the total wall time of each trace so a slow turn is obvious. */
const traceTotals = computed(() => {
  const totals = new Map<string, number>()
  for (const span of spans.value) {
    const current = totals.get(span.trace_id) || 0
    const end = span.start_unix_nano + span.duration_ns
    totals.set(span.trace_id, Math.max(current, end) - Math.min(current || end, span.start_unix_nano))
  }
  return totals
})

/* ------------------------------------------------------------------ loading */

function pushLog(rec: LogRecord) {
  logs.value.push(rec)
  if (logs.value.length > MAX_ROWS) logs.value.splice(0, logs.value.length - MAX_ROWS)
  scrollToEnd()
}

function pushSpan(span: SpanRecord) {
  // The same span can arrive from both the primed snapshot and the live stream.
  const index = spans.value.findIndex((s) => s.span_id === span.span_id)
  if (index !== -1) spans.value.splice(index, 1)
  spans.value.push(span)
  scrollToEnd()
}

/** Keep the newest row in view while tailing. Deliberately not done while the
 *  user has scrolled up: yanking the viewport back on every frame makes reading
 *  a backtrace impossible. */
function scrollToEnd() {
  if (!follow.value || tab.value !== 'logs') return
  const el = pane.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

/** Re-enable tailing when the user returns to the bottom by hand. */
function onPaneScroll() {
  const el = pane.value
  if (!el) return
  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24
  if (atBottom && !follow.value) follow.value = true
}

async function loadSnapshot() {
  busy.value = true
  try {
    const params = new URLSearchParams({ limit: '500', level: level.value })
    if (query.value.trim()) params.set('q', query.value.trim())
    const [logPage, spanPage] = await Promise.all([
      apiGet<{ level: string; logs: LogRecord[] }>(`/api/console/logs?${params}`),
      apiGet<{ spans: SpanRecord[] }>(`/api/console/spans?limit=500`),
    ])
    if (logPage) {
      level.value = logPage.level || level.value
      logs.value = logPage.logs || []
    }
    if (spanPage) spans.value = spanPage.spans || []
    streamError.value = ''
  } catch (err) {
    streamError.value = String(err)
  } finally {
    busy.value = false
  }
}

/* ------------------------------------------------------------------ streaming */

async function openStream() {
  controller?.abort()
  controller = new AbortController()
  const params = new URLSearchParams({ limit: '200', level: level.value })
  if (query.value.trim()) params.set('q', query.value.trim())
  connected.value = false
  try {
    await streamSSE(
      `/api/console/stream?${params}`,
      ({ event, data }) => {
        connected.value = true
        streamError.value = ''
        if (event === 'log') {
          const rec = parse<LogRecord>(data)
          if (rec) pushLog(rec)
        } else if (event === 'span') {
          const span = parse<SpanRecord>(data)
          if (span) pushSpan(span)
        } else if (event === 'ready') {
          const ready = parse<{ level: string }>(data)
          if (ready?.level) level.value = ready.level
        }
      },
      controller.signal,
    )
  } catch (err) {
    // An abort is the expected path on unmount and on reconnect.
    if (!controller?.signal.aborted) streamError.value = String(err)
  }
}

function reconnect() {
  void openStream()
}

async function setLevel(next: string) {
  level.value = next
  try {
    const res = await apiPut<{ level: string }>('/api/console/level', { level: next })
    if (res?.level) level.value = res.level
  } catch (err) {
    streamError.value = String(err)
  }
  // The filter changed, so the primed page has to be re-read.
  await loadSnapshot()
  await openStream()
}

async function clearAll() {
  // One click used to wipe logs AND traces with no way back.
  const ok = await confirm({
    title: t('console.clear'),
    message: t('console.clearConfirm'),
    confirmLabel: t('console.clear'),
    danger: true,
  })
  if (!ok) return
  try {
    await apiPost('/api/console/clear')
    logs.value = []
    spans.value = []
  } catch (err) {
    streamError.value = String(err)
  }
}

/** Jump to a trace: filter by it so the log rows and the timeline line up. */
function focusTrace(traceId: string) {
  query.value = traceId
  tab.value = 'traces'
}

onMounted(async () => {
  await loadSnapshot()
  await openStream()
  scrollToEnd()
})

onBeforeUnmount(() => {
  controller?.abort()
  controller = null
})
</script>

<template>
  <section class="console">
    <header class="console-bar">
      <div class="tabs" role="tablist" :aria-label="t('console.tabsLabel')">
        <button
          v-for="item in (['logs', 'traces'] as Tab[])"
          :key="item"
          role="tab"
          type="button"
          class="tab"
          :class="{ active: tab === item }"
          :aria-selected="tab === item"
          @click="tab = item"
        >
          {{ t(`console.tab.${item}`) }}
          <span v-if="item === 'logs' && errorCount" class="tab-badge">{{ errorCount }}</span>
        </button>
      </div>

      <div class="controls">
        <label class="field">
          <span class="field-label">{{ t('console.level') }}</span>
          <select
            class="input"
            :value="level"
            :aria-label="t('console.level')"
            @change="setLevel(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="name in LEVELS" :key="name" :value="name">{{ name }}</option>
          </select>
        </label>

        <label class="field grow">
          <span class="field-label">{{ t('console.search') }}</span>
          <input
            v-model="query"
            class="input"
            type="search"
            :placeholder="t('console.searchPlaceholder')"
            :aria-label="t('console.search')"
          />
        </label>

        <label class="check">
          <input v-model="follow" type="checkbox" />
          <span>{{ t('console.follow') }}</span>
        </label>

        <button type="button" class="btn" :disabled="busy" @click="loadSnapshot()">
          {{ t('console.refresh') }}
        </button>
        <button type="button" class="btn" @click="clearAll()">{{ t('console.clear') }}</button>

        <span class="status" :class="{ live: connected, dead: !!streamError }">
          <span class="dot" aria-hidden="true"></span>
          {{ streamError ? t('console.disconnected') : connected ? t('console.live') : t('console.connecting') }}
        </span>
      </div>
    </header>

    <p v-if="streamError" class="banner" role="alert">
      <span>{{ t('console.streamError') }}</span>
      <code>{{ streamError }}</code>
      <button type="button" class="btn" @click="reconnect">{{ t('console.reconnect') }}</button>
    </p>

    <!-- Logs -->
    <Transition name="pane" mode="out-in">
    <div v-if="tab === 'logs'" key="logs" ref="pane" class="pane" role="tabpanel" @scroll.passive="onPaneScroll">
      <p v-if="!filteredLogs.length" class="empty">{{ t('console.noLogs') }}</p>
      <ol v-else class="rows" :aria-label="t('console.tab.logs')">
        <li v-for="(rec, index) in filteredLogs" :key="`${rec.time}-${index}`" class="row" :class="levelClass(rec.level)">
          <time class="ts">{{ fmtTime(rec.time) }}</time>
          <span class="lvl">{{ rec.level }}</span>
          <span class="component">{{ componentOf(rec) }}</span>
          <span class="msg">{{ rec.message }}</span>
          <span v-for="[key, value] in extraFields(rec)" :key="key" class="kv">
            <span class="k">{{ key }}=</span><span class="v">{{ String(value) }}</span>
          </span>
          <button
            v-if="rec.trace_id"
            type="button"
            class="link trace"
            :title="t('console.showTrace')"
            @click="focusTrace(rec.trace_id)"
          >
            {{ rec.trace_id.slice(0, 8) }}
          </button>
        </li>
      </ol>
    </div>

    <!-- Traces -->
    <div v-else ref="pane" class="pane" role="tabpanel" @scroll.passive="onPaneScroll">
      <p v-if="!filteredSpans.length" class="empty">{{ t('console.noSpans') }}</p>
      <ol v-else class="rows" :aria-label="t('console.tab.traces')">
        <li
          v-for="node in traceTree"
          :key="node.span.span_id"
          class="row span"
          :class="[levelClass(node.span.status), node.span.kind]"
        >
          <!-- Indentation is a spacer with a width, not a repeated character:
               a literal indent glyph is one encoding mistake away from being
               rendered as the wrong symbol, and it would be copied as text. -->
          <span class="indent" :style="{ width: node.depth * 14 + 'px' }" aria-hidden="true"></span>
          <span class="lvl">{{ node.span.kind }}</span>
          <span class="component">{{ node.span.name }}</span>
          <span class="msg">
            <span v-for="[key, value] in Object.entries(node.span.attrs || {})" :key="key" class="kv">
              <span class="k">{{ key }}=</span><span class="v">{{ value }}</span>
            </span>
            <span v-if="node.span.error" class="err">{{ node.span.error }}</span>
          </span>
          <span v-for="(ev, i) in node.span.events || []" :key="i" class="event" :title="JSON.stringify(ev.attrs || {})">
            {{ ev.name }}
          </span>
          <span class="dur">{{ fmtDuration(node.span.duration_ns) }}</span>
          <button
            type="button"
            class="link trace"
            :title="t('console.totalTrace')"
            @click="focusTrace(node.span.trace_id)"
          >
            {{ fmtDuration(traceTotals.get(node.span.trace_id) || 0) }}
          </button>
        </li>
      </ol>
    </div>
    </Transition>
  </section>
</template>

<style scoped>
/*
 * The console is a dense, monospaced, scannable surface — deliberately not the
 * Material card treatment used elsewhere in the app. It borrows the app's colour
 * tokens so it stays in the same system, and adds a dark terminal surface that
 * works in both themes.
 */
.console {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: var(--md-surface);
  color: var(--md-on-surface);
}

/* Tab swap: logs/traces fade through instead of hard-cutting. */
.pane-enter-active { transition: opacity var(--duration-medium) var(--ease-emphasized-decel); }
.pane-leave-active { transition: opacity var(--duration-instant) var(--ease-emphasized-accel); }
.pane-enter-from, .pane-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .pane-enter-active, .pane-leave-active { transition-duration: 1ms; }
}

.console-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-low);
}

.tabs {
  display: flex;
  gap: var(--space-xs);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 14px;
  border: 0;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.tab:hover {
  background: color-mix(in srgb, var(--md-on-surface) 7%, transparent);
}

.tab.active {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

.tab:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.tab-badge {
  min-width: 18px;
  padding: 0 5px;
  border-radius: var(--radius-full);
  background: var(--md-error-container);
  color: var(--md-on-error-container);
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}

.controls {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-sm);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.field.grow {
  flex: 1;
  min-width: 180px;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--md-on-surface-variant);
}

.input {
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-sm);
  background: var(--md-surface-container-lowest);
  color: inherit;
  font: inherit;
  font-size: 13px;
}

.input:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 1px;
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  font-size: 12px;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
}

.btn {
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-full);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.btn:hover:not(:disabled) {
  background: var(--md-surface-container-high);
}

.btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.btn:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
}

.status .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--md-outline);
}

.status.live .dot {
  background: var(--md-success);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-success) 22%, transparent);
}

.status.dead .dot {
  background: var(--md-error);
}

.banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  margin: 0;
  padding: var(--space-sm) var(--space-lg);
  background: var(--md-error-container);
  color: var(--md-on-error-container);
  font-size: 13px;
}

.banner code {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pane {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.empty {
  padding: var(--space-xl);
  color: var(--md-on-surface-variant);
  font-size: 13px;
}

.rows {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.55;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  padding: 3px var(--space-lg);
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent);
}

.row:hover {
  background: color-mix(in srgb, var(--md-on-surface) 4%, transparent);
}

/* Level is carried by a left rule rather than a background wash, so long rows
 * stay readable and dense. */
.row::before {
  content: '';
  width: 3px;
  align-self: stretch;
  margin: 1px 0;
  border-radius: 2px;
  background: var(--md-outline);
}

.row.debug::before { background: var(--md-outline); }
.row.info::before { background: var(--md-primary); }
.row.warn::before { background: var(--md-warning); }
.row.error::before { background: var(--md-error); }
.row.ok::before { background: var(--md-success); }

.ts {
  color: var(--md-on-surface-variant);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.lvl {
  min-width: 46px;
  font-weight: 700;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
}

.row.warn .lvl { color: var(--md-warning); }
.row.error .lvl { color: var(--md-error); }

.component {
  min-width: 96px;
  padding: 0 6px;
  border-radius: var(--radius-sm);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  font-size: 11px;
  white-space: nowrap;
}

.msg {
  flex: 1;
  min-width: 200px;
  word-break: break-word;
}

.kv {
  color: var(--md-on-surface-variant);
  white-space: nowrap;
}

.kv .k {
  opacity: 0.7;
}

.kv .v {
  color: var(--md-on-surface);
}

.err {
  color: var(--md-error);
}

.event {
  padding: 0 6px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-full);
  color: var(--md-on-surface-variant);
  font-size: 11px;
  white-space: nowrap;
}

.dur {
  margin-left: auto;
  color: var(--md-on-surface-variant);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* Spacer for tree depth. `flex: none` keeps the inline width from being
   stretched by the flex row. */
.indent {
  flex: none;
}

.link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--md-primary);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  text-decoration: underline dotted;
}

.link:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

@media (max-width: 720px) {
  .console-bar {
    align-items: stretch;
  }
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  .component,
  .lvl {
    min-width: 0;
  }
}

/* The platform layer's `#app button { min-height: 36px; border-radius: 18px }`
 * and `#app :is(input, select, textarea) { border-radius: 14px }` are (1,0,1)
 * and beat this file's scoped rules (0,2,0). The console is a dense log view,
 * so its controls are deliberately tighter than the app-wide defaults; restating
 * them under `#app .console` (1,2,0) is what makes the declared boxes render.
 * (`.link` opts out of the button floor in theme.css, next to that rule.) */
#app .console :is(.tab, .btn) { min-height: 34px; border-radius: var(--radius-full); }
#app .console .input { min-height: 34px; border-radius: var(--radius-sm); }
</style>
