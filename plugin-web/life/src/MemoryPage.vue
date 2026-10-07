<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { AppSelect, useConfirm, i18n } from '@0kay/host'
import { FLASH_MS, injectStyle, lifeKitCss } from './kit'

const { confirm } = useConfirm()
const t = (key: string, named?: Record<string, unknown>) => i18n.global.t(key, named ?? {})

type Memory = {
  id: string
  content: string
  importance: number
  strength: number
  created_at: string
  last_recalled?: string
  recall_count?: number
  tags: string[]
  tier: string
  scope?: string
  memory_type?: string
  source_kind?: string
}
type Note = { note_id: string; preview: string; bytes: number; scope?: string }
type Reflection = {
  id: string
  session_id: string
  status: string
  statement: string
  risk: string
  created_at: string
  user_text: string
  assistant_text: string
  scope?: string
}

const tab = ref<'memories' | 'notes' | 'reflections'>('memories')
const query = ref('')
const tier = ref('')
const sort = ref('recent')
const offset = ref(0)
const limit = 30
const memories = ref<Memory[]>([])
const total = ref(0)
const stats = ref<any>({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 })
const dashboard = ref<any>(null)
const maxTier = computed(() => Math.max(1, dashboard.value?.tiers?.short_term || 0, dashboard.value?.tiers?.long_term || 0))
const maxHist = computed(() => Math.max(1, ...(dashboard.value?.strength_histogram || [1])))
const decayPoints = computed(() => {
  const curve = dashboard.value?.decay_curve || []
  return curve.map((point: any) => `${(point.day / 90 * 200).toFixed(1)},${(60 - point.strength * 60).toFixed(1)}`).join(' ')
})
function barWidth(value: number, max: number) { return `${Math.round((value || 0) / Math.max(1, max) * 100)}%` }
const loading = ref(false)
const error = ref('')
const notice = ref('')
const expanded = ref<string>('')

const notes = ref<Note[]>([])
const noteQuery = ref('')
const noteForm = ref({ title: '', content: '', tags: '' })
const reading = ref<{ note_id: string; content: string; total_lines: number; has_more: boolean; offset: number } | null>(null)

const reflections = ref<Reflection[]>([])
const reflectionStatus = ref('proposed')

const pages = computed(() => Math.max(1, Math.ceil(total.value / limit)))
const page = computed(() => Math.floor(offset.value / limit) + 1)

function pct(value: number) { return `${Math.round(Math.max(0, Math.min(1, value || 0)) * 100)}%` }
function label(tier: string) { return tier === 'long_term' ? t('life.memory.tierLong') : tier === 'short_term' ? t('life.memory.tierShort') : t('life.memory.tierWorking') }
function fmtTime(value?: string) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString()
}
// Same banner lifetime as the companion and adapters pages (kit FLASH_MS), so
// all three L.I.F.E roots feel identical.
function flash(message: string) { notice.value = message; setTimeout(() => { if (notice.value === message) notice.value = '' }, FLASH_MS) }

async function call(action: string, payload: any) {
  const response = await fetch('/api/life/companion', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  })
  if (!response.ok) throw new Error((await response.text()) || `HTTP ${response.status}`)
  return response.json().catch(() => ({}))
}

async function loadStats() {
  try {
    const response = await fetch('/api/life/memories?limit=1')
    if (response.ok) {
      const body = await response.json()
      if (body.stats) stats.value = body.stats
    }
  } catch { /* optional */ }
}

async function loadDashboard() {
  try { dashboard.value = await call('memory_dashboard', {}) }
  catch { /* optional */ }
}

async function loadMemories() {
  loading.value = true
  error.value = ''
  try {
    const body = await call('memory_page', { tier: tier.value, query: query.value.trim(), limit, offset: offset.value, sort: sort.value })
    memories.value = body.items || []
    total.value = body.total || 0
  } catch (cause: any) { error.value = cause?.message || t('life.memory.errorReadMemories') }
  finally { loading.value = false }
}

async function loadNotes() {
  loading.value = true
  error.value = ''
  try {
    const body = await call('memory_note_list', { query: noteQuery.value.trim(), limit: 60 })
    notes.value = body.notes || []
  } catch (cause: any) { error.value = cause?.message || t('life.memory.errorReadNotes') }
  finally { loading.value = false }
}

async function loadReflections() {
  loading.value = true
  error.value = ''
  try {
    const body = await call('memory_reflection_list', { status: reflectionStatus.value, limit: 80 })
    reflections.value = body.reflections || []
  } catch (cause: any) { error.value = cause?.message || t('life.memory.errorReadReflections') }
  finally { loading.value = false }
}

function refresh() {
  void loadStats(); void loadDashboard()
  if (tab.value === 'notes') return loadNotes()
  if (tab.value === 'reflections') return loadReflections()
  return loadMemories()
}

async function reinforce(memory: Memory) {
  try { await call('memory_reinforce', { ids: [memory.id] }); flash(t('life.memory.toastReinforced')); await loadMemories() }
  catch (cause: any) { error.value = cause?.message || t('life.memory.errorReinforce') }
}
async function bumpImportance(memory: Memory, delta: number) {
  try { await call('memory_importance', { id: memory.id, delta }); await loadMemories() }
  catch (cause: any) { error.value = cause?.message || t('life.memory.errorAdjust') }
}
async function exportMemories() {
  try {
    const body = await call('memory_export', {})
    const blob = new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `0kay-memory-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    flash(t('life.memory.toastExported'))
  } catch (cause: any) { error.value = cause?.message || t('life.memory.errorExport') }
}
const importInput = ref<HTMLInputElement | null>(null)
async function onImportFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const snapshot = JSON.parse(await file.text())
    const result = await call('memory_import', { snapshot })
    flash(t('life.memory.toastImported', { added: result.imported || 0, skipped: result.skipped || 0 }))
    await loadMemories(); await loadStats()
  } catch (cause: any) { error.value = cause?.message || t('life.memory.errorImport') }
  finally { input.value = '' }
}

async function removeMemory(memory: Memory) {
  const ok = await confirm({
    title: t('life.memory.deleteMemoryTitle'),
    message: t('life.memory.deleteMemoryMessage'),
    confirmLabel: t('life.memory.deleteMemoryConfirm'),
    danger: true,
  })
  if (!ok) return
  try { await call('delete_memory', { id: memory.id }); await loadMemories(); await loadStats() }
  catch (cause: any) { error.value = cause?.message || t('life.memory.errorDelete') }
}

async function clearAll() {
  // Two-step confirm, mirroring the Companion page's "reset the whole person":
  // the button lives in a danger zone, so one accidental click must not be enough.
  const first = await confirm({
    title: t('life.memory.clearAll'),
    message: t('life.memory.clearAllMessage'),
    confirmLabel: t('life.memory.clearAll'),
    danger: true,
  })
  if (!first) return
  const second = await confirm({
    title: t('life.memory.clearAllConfirmTitle'),
    message: t('life.memory.clearAllConfirmMessage'),
    confirmLabel: t('life.memory.clearAllConfirm'),
    danger: true,
  })
  if (!second) return
  try { await call('clear_all_memory', {}); await loadMemories(); await loadStats() }
  catch (cause: any) { error.value = cause?.message || t('life.memory.errorClear') }
}

async function createNote() {
  if (!noteForm.value.content.trim() && !noteForm.value.title.trim()) return
  try {
    await call('memory_note_create', {
      title: noteForm.value.title,
      content: noteForm.value.content,
      tags: noteForm.value.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    noteForm.value = { title: '', content: '', tags: '' }
    flash(t('life.memory.toastNoteSaved')); await loadNotes()
  } catch (cause: any) { error.value = cause?.message || t('life.memory.errorSaveNote') }
}

async function readNote(note: Note, offset = 1) {
  try {
    const body = await call('memory_note_read', { note_id: note.note_id, offset, limit: 400 })
    reading.value = { ...body, offset: body.offset || offset }
  } catch (cause: any) { error.value = cause?.message || t('life.memory.errorReadNote') }
}

async function deleteNote(note: Note) {
  const ok = await confirm({ title: t('life.memory.deleteNoteTitle'), message: t('life.memory.deleteNoteMessage', { id: note.note_id }), confirmLabel: t('life.memory.delete'), danger: true })
  if (!ok) return
  try { await call('memory_note_delete', { note_id: note.note_id }); if (reading.value?.note_id === note.note_id) reading.value = null; await loadNotes() }
  catch (cause: any) { error.value = cause?.message || t('life.memory.errorDeleteNote') }
}

async function reviewReflection(item: Reflection, accept: boolean) {
  try { await call('memory_reflection_review', { id: item.id, accept }); await loadReflections(); await loadStats() }
  catch (cause: any) { error.value = cause?.message || t('life.memory.errorReview') }
}

async function runMaintenance() {
  try { const body = await call('memory_maintenance', {}); flash(t('life.memory.toastMaintained', { count: body.consolidated ?? 0 })); await loadMemories(); await loadStats() }
  catch (cause: any) { error.value = cause?.message || t('life.memory.errorMaintain') }
}

let memorySearchTimer: ReturnType<typeof setTimeout> | null = null
let noteSearchTimer: ReturnType<typeof setTimeout> | null = null
watch(query, () => { offset.value = 0; if (memorySearchTimer) clearTimeout(memorySearchTimer); memorySearchTimer = setTimeout(loadMemories, 250) })
watch([tier, sort], () => { offset.value = 0; loadMemories() })
watch(noteQuery, () => { if (noteSearchTimer) clearTimeout(noteSearchTimer); noteSearchTimer = setTimeout(loadNotes, 250) })
watch(reflectionStatus, loadReflections)
watch(tab, refresh)
onMounted(async () => { await loadMemories(); await loadStats(); await loadDashboard() })

/* Same design kit as the companion and adapter pages, so the three L.I.F.E
   pages stay one dialect (the kit CSS is injected once per document). */
injectStyle('life-plugin-memory-style', lifeKitCss('memory-page'))

const tierOptions = computed(() => [
  { value: '', label: t('life.memory.all') },
  { value: 'short_term', label: t('life.memory.shortTerm') },
  { value: 'long_term', label: t('life.memory.longTerm') },
])
const sortOptions = computed(() => [
  { value: 'recent', label: t('life.memory.sortRecent') },
  { value: 'strength', label: t('life.memory.sortStrength') },
  { value: 'importance', label: t('life.memory.sortImportance') },
  { value: 'recall', label: t('life.memory.sortRecall') },
])
const reflectionStatusOptions = computed(() => [
  { value: 'proposed', label: t('life.memory.statusProposed') },
  { value: 'pending', label: t('life.memory.statusPending') },
  { value: 'applied', label: t('life.memory.statusApplied') },
  { value: 'rejected', label: t('life.memory.statusRejected') },
  { value: '', label: t('life.memory.all') },
])

/** Notes have no separate title field: the first non-empty preview line is the
    readable title, and the raw note_id drops to secondary meta. */
function noteTitle(note: Note): string {
  const first = (note.preview || '').split('\n').map((s) => s.trim()).find(Boolean)
  return first || t('life.memory.emptyNotePreview')
}
/** How many skeleton cards to shimmer while the first page loads. */
const skeletonCount = 4
</script>

<template>
  <main class="memory-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">L.I.F.E / MEMORY</p>
        <h1>{{ t('life.memory.title') }}</h1>
        <p class="subtitle">{{ t('life.memory.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <button class="btn tonic" :disabled="loading" @click="runMaintenance">{{ t('life.memory.maintain') }}</button>
        <button class="btn tonic" :disabled="loading" @click="refresh">{{ loading ? t('life.memory.loading') : t('life.memory.refresh') }}</button>
      </div>
    </header>

    <!-- Banners live at the top of the page: at the bottom they scrolled out of
         view exactly when an action (delete/clear) reported its result. -->
    <p v-if="error" class="banner err">{{ error }}</p>
    <p v-if="notice" class="banner ok">{{ notice }}</p>

    <section class="stat-grid">
      <article class="stat-card">
        <div class="stat-head"><span class="icon-badge tone-1" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="stat-label">{{ t('life.memory.tierWorking') }}</span></div>
        <strong class="stat-value">{{ stats.working }}</strong><span class="stat-hint">{{ t('life.memory.workingHint') }}</span>
      </article>
      <article class="stat-card">
        <div class="stat-head"><span class="icon-badge tone-2" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">{{ t('life.memory.tierShort') }}</span></div>
        <strong class="stat-value">{{ stats.shortTerm?.total || 0 }}</strong><span class="stat-hint">{{ t('life.memory.shortHint') }}</span>
      </article>
      <article class="stat-card">
        <div class="stat-head"><span class="icon-badge tone-3" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="stat-label">{{ t('life.memory.tierLong') }}</span></div>
        <strong class="stat-value">{{ stats.longTerm || 0 }}</strong><span class="stat-hint">{{ t('life.memory.longHint') }}</span>
      </article>
      <article class="stat-card">
        <div class="stat-head"><span class="icon-badge tone-4" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 14l4-4 3 3 5-6 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">{{ t('life.memory.avgStrength') }}</span></div>
        <strong class="stat-value">{{ pct(stats.avgStrength) }}</strong><span class="stat-hint">{{ t('life.memory.avgStrengthHint') }}</span>
      </article>
    </section>

    <section v-if="dashboard" class="card" style="margin-top:16px">
      <div class="card-head"><h2 class="card-title">{{ t('life.memory.dynamicsTitle') }}</h2>
        <span class="chip muted">RRF k={{ dashboard.rrf_k }}</span></div>
      <div class="dynamics-grid">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin:6px 0">
            <span style="width:48px;font-size:12px">{{ t('life.memory.shortTerm') }}</span>
            <div class="dyn-track"><i class="dyn-bar" :style="{ width: barWidth(dashboard.tiers.short_term, maxTier) }"></i></div>
            <b>{{ dashboard.tiers.short_term }}</b>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin:6px 0">
            <span style="width:48px;font-size:12px">{{ t('life.memory.longTerm') }}</span>
            <div class="dyn-track"><i class="dyn-bar" :style="{ width: barWidth(dashboard.tiers.long_term, maxTier) }"></i></div>
            <b>{{ dashboard.tiers.long_term }}</b>
          </div>
          <p class="hint">{{ t('life.memory.dynamicsSummary', { avg: pct(dashboard.avg_strength), low: dashboard.low_strength, semantic: dashboard.types?.semantic || 0, episode: dashboard.types?.episode || 0 }) }}</p>
        </div>
        <div>
          <p class="hint">{{ t('life.memory.strengthHistogram') }}</p>
          <div class="dyn-hist">
            <i v-for="(count, index) in dashboard.strength_histogram" :key="index"
               :title="`${index / 10}~${(index + 1) / 10}: ${count}`"
               :style="{ height: barWidth(count, maxHist) }"></i>
          </div>
        </div>
        <div>
          <p class="hint">{{ t('life.memory.decayCurveHint') }}</p>
          <svg viewBox="0 0 200 60" class="dyn-curve" :aria-label="t('life.memory.decayCurveLabel')">
            <!-- pathLength=1 normalizes the stroke so dashoffset 1→0 is a draw-in
                 animation regardless of the polyline's point count; re-keying on
                 the points replays it when the dashboard refreshes. -->
            <polyline :key="decayPoints" class="decay-line" :points="decayPoints" fill="none" stroke="currentColor" stroke-width="2" pathLength="1" />
          </svg>
        </div>
      </div>
    </section>

    <nav class="tabs">
      <button class="tab" :class="{ active: tab === 'memories' }" @click="tab = 'memories'">{{ t('life.memory.tabMemories') }}</button>
      <button class="tab" :class="{ active: tab === 'notes' }" @click="tab = 'notes'">{{ t('life.memory.tabNotes') }}</button>
      <button class="tab" :class="{ active: tab === 'reflections' }" @click="tab = 'reflections'">{{ t('life.memory.tabReflections') }}</button>
    </nav>

    <!-- One keyed element per tab so the Transition can cross-fade them
         (mode="out-in" keeps both lists from fighting over the grid layout). -->
    <Transition name="tab-fade" mode="out-in">
      <!-- Memories -->
      <div v-if="tab === 'memories'" key="memories" class="tab-body">
      <section class="card toolbar">
        <div class="search-field">
          <svg class="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <input v-model="query" :placeholder="t('life.memory.searchMemories')" :aria-label="t('life.memory.searchMemoriesLabel')" />
        </div>
        <label class="fld"><span>{{ t('life.memory.tierLabel') }}</span>
          <AppSelect v-model="tier" :options="tierOptions" :aria-label="t('life.memory.tierLabel')" />
        </label>
        <label class="fld"><span>{{ t('life.memory.sortLabel') }}</span>
          <AppSelect v-model="sort" :options="sortOptions" :aria-label="t('life.memory.sortLabel')" />
        </label>
        <span class="chip muted">{{ t('life.memory.totalPages', { total, page, pages }) }}</span>
        <button class="btn tonic sm" @click="exportMemories">{{ t('life.memory.export') }}</button>
        <button class="btn tonic sm" @click="importInput?.click()">{{ t('life.memory.import') }}</button>
        <input ref="importInput" type="file" accept="application/json,.json" class="hidden-input" @change="onImportFile" />
      </section>

      <section class="memory-list">
        <TransitionGroup name="memory-card">
        <article v-for="memory in memories" :key="memory.id" class="memory-card" :class="{ open: expanded === memory.id }">
          <div class="card-top">
            <span class="chip" :class="'tier-' + (memory.tier === 'long_term' ? 'long' : 'short')">{{ label(memory.tier) }}</span>
            <span v-if="memory.scope && memory.scope !== 'public'" class="chip muted">{{ memory.scope }}</span>
            <span class="chip muted">{{ memory.memory_type || 'knowledge' }}</span>
            <button class="btn-icon danger" :title="t('life.memory.deleteMemory')" :aria-label="t('life.memory.deleteMemory')" @click="removeMemory(memory)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
          <p class="memory-content">{{ memory.content }}</p>
          <div v-if="memory.tags?.length" class="tags"><span v-for="tag in memory.tags" :key="tag">#{{ tag }}</span></div>
          <footer class="memory-foot">
            <div class="meter" :title="t('life.memory.importance')"><span>{{ t('life.memory.importance') }}</span><div class="meter-bar"><i :style="{ '--v': pct(memory.importance) }" class="fill-primary"></i></div><b>{{ pct(memory.importance) }}</b></div>
            <div class="meter" :title="t('life.memory.strength')"><span>{{ t('life.memory.strength') }}</span><div class="meter-bar"><i :style="{ '--v': pct(memory.strength) }" class="fill-secondary"></i></div><b>{{ pct(memory.strength) }}</b></div>
            <span class="meter-text">{{ t('life.memory.recallTimes', { count: memory.recall_count || 0 }) }}</span>
          </footer>
          <!-- Always mounted; grid-template-rows 0fr→1fr animates expand/collapse
               instead of the v-if hard cut. -->
          <div class="detail" :class="{ open: expanded === memory.id }">
            <div class="detail-clip">
              <dl>
                <div><dt>ID</dt><dd><code>{{ memory.id }}</code></dd></div>
                <div><dt>{{ t('life.memory.source') }}</dt><dd>{{ memory.source_kind || 'conversation' }}</dd></div>
                <div><dt>{{ t('life.memory.created') }}</dt><dd>{{ fmtTime(memory.created_at) }}</dd></div>
                <div><dt>{{ t('life.memory.lastRecalled') }}</dt><dd>{{ fmtTime(memory.last_recalled) }}</dd></div>
              </dl>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn sm tonic" @click="expanded = expanded === memory.id ? '' : memory.id">{{ expanded === memory.id ? t('life.memory.collapse') : t('life.memory.details') }}</button>
            <button class="btn sm tonic" @click="bumpImportance(memory, 0.1)">{{ t('life.memory.importanceUp') }}</button>
            <button class="btn sm tonic" @click="bumpImportance(memory, -0.1)">{{ t('life.memory.importanceDown') }}</button>
            <button class="btn sm tonic" @click="reinforce(memory)">{{ t('life.memory.reinforce') }}</button>
          </div>
        </article>
        </TransitionGroup>
        <!-- Shimmer skeleton while the first page loads, instead of an empty flash. -->
        <template v-if="loading && !memories.length">
          <article v-for="i in skeletonCount" :key="'sk' + i" class="memory-card skeleton-card" aria-hidden="true">
            <span class="sk-line w30"></span>
            <span class="sk-line w90"></span>
            <span class="sk-line w75"></span>
            <span class="sk-line w40"></span>
          </article>
        </template>
        <div v-if="!loading && !memories.length" class="empty-state"><p>{{ t('life.memory.emptyMemories') }}</p><p class="hint">{{ t('life.memory.emptyMemoriesHint') }}</p></div>
      </section>

      <div class="pager" v-if="pages > 1">
        <button class="btn sm tonic" :disabled="offset === 0" @click="offset = Math.max(0, offset - limit); loadMemories()">{{ t('life.memory.prevPage') }}</button>
        <span class="chip muted">{{ page }} / {{ pages }}</span>
        <button class="btn sm tonic" :disabled="page >= pages" @click="offset += limit; loadMemories()">{{ t('life.memory.nextPage') }}</button>
      </div>
      </div>

      <!-- Notes -->
      <div v-else-if="tab === 'notes'" key="notes" class="tab-body">
      <section class="grid-notes">
        <article class="card">
          <div class="card-head"><h2 class="card-title">{{ t('life.memory.newNote') }}</h2></div>
          <form class="stack-form" @submit.prevent="createNote">
            <input v-model="noteForm.title" class="field" :placeholder="t('life.memory.noteTitle')" :aria-label="t('life.memory.noteTitleLabel')" />
            <input v-model="noteForm.tags" class="field" :placeholder="t('life.memory.noteTags')" :aria-label="t('life.memory.noteTagsLabel')" />
            <textarea v-model="noteForm.content" class="field area" :placeholder="t('life.memory.noteContent')" :aria-label="t('life.memory.noteContentLabel')"></textarea>
            <button class="btn filled" type="submit" :disabled="!noteForm.content.trim() && !noteForm.title.trim()">{{ t('life.memory.saveNote') }}</button>
          </form>
        </article>
        <article class="card">
          <div class="card-head"><h2 class="card-title">{{ t('life.memory.noteLibrary') }}</h2><span class="chip muted">{{ notes.length }}</span></div>
          <div class="search-field mini"><input v-model="noteQuery" :placeholder="t('life.memory.searchNotes')" :aria-label="t('life.memory.searchNotesLabel')" /></div>
          <ul class="note-list">
            <li v-for="note in notes" :key="note.note_id" class="note-item">
              <div class="note-main">
                <strong>{{ noteTitle(note) }}</strong>
                <span class="item-meta">{{ note.note_id }} · {{ (note.bytes / 1024).toFixed(1) }} KB</span>
                <span class="chip muted" v-if="note.scope && note.scope !== 'public'">{{ t('life.memory.scopePrefix') }}{{ note.scope }}</span>
              </div>
              <div class="note-actions">
                <button class="btn sm tonic" @click="readNote(note)">{{ t('life.memory.read') }}</button>
                <button class="btn sm danger" :aria-label="t('life.memory.deleteNoteTitle') + ' ' + note.note_id" @click="deleteNote(note)">{{ t('life.memory.delete') }}</button>
              </div>
            </li>
            <li v-if="!notes.length" class="list-empty">{{ t('life.memory.emptyNotes') }}</li>
          </ul>
        </article>
      </section>
      <section v-if="reading" class="card reader">
        <div class="card-head"><h2 class="card-title">{{ reading.note_id }}</h2><button class="btn sm tonic" @click="reading = null">{{ t('life.memory.close') }}</button></div>
        <pre>{{ reading.content }}</pre>
        <div class="pager">
          <button class="btn sm tonic" :disabled="reading.offset <= 1" @click="readNote({ note_id: reading.note_id } as any, Math.max(1, reading.offset - 400))">{{ t('life.memory.prevChunk') }}</button>
          <span class="chip muted">{{ t('life.memory.lines', { count: reading.total_lines }) }}</span>
          <button class="btn sm tonic" :disabled="!reading.has_more" @click="readNote({ note_id: reading.note_id } as any, reading.offset + 400)">{{ t('life.memory.nextChunk') }}</button>
        </div>
      </section>
      </div>

      <!-- Reflections -->
      <div v-else key="reflections" class="tab-body">
      <section class="card toolbar">
        <label class="fld"><span>{{ t('life.memory.statusLabel') }}</span>
          <AppSelect v-model="reflectionStatus" :options="reflectionStatusOptions" :aria-label="t('life.memory.statusLabel')" />
        </label>
        <span class="chip muted">{{ t('life.memory.reflectionCount', { count: reflections.length }) }}</span>
      </section>
      <section class="reflection-list">
        <article v-for="item in reflections" :key="item.id" class="card reflection">
          <div class="card-head">
            <h3 class="card-title">{{ item.statement || t('life.memory.noSummary') }}</h3>
            <span class="chip" :class="item.status === 'applied' ? 'chip-ok' : item.status === 'rejected' ? 'chip-warn' : 'muted'">{{ item.status }}</span>
            <span class="chip muted" v-if="item.scope && item.scope !== 'public'">{{ t('life.memory.scopePrefix') }}{{ item.scope }}</span>
          </div>
          <p class="item-meta">{{ t('life.memory.sourceSession', { session: item.session_id }) }} · {{ fmtTime(item.created_at) }}</p>
          <details>
            <summary>{{ t('life.memory.viewConversation') }}</summary>
            <p class="quote">{{ t('life.memory.userPrefix') }}{{ item.user_text }}</p>
            <p class="quote">{{ t('life.memory.assistantPrefix') }}{{ item.assistant_text }}</p>
          </details>
          <div class="card-actions" v-if="item.status === 'proposed'">
            <button class="btn sm filled" @click="reviewReflection(item, true)">{{ t('life.memory.acceptAsMemory') }}</button>
            <button class="btn sm danger" @click="reviewReflection(item, false)">{{ t('life.memory.reject') }}</button>
          </div>
        </article>
        <div v-if="!reflections.length" class="empty-state"><p>{{ t('life.memory.emptyReflections') }}</p><p class="hint">{{ t('life.memory.emptyReflectionsHint') }}</p></div>
      </section>
      </div>
    </Transition>

    <!-- Irreversible actions live in their own danger zone at the very bottom,
         away from the everyday header actions, with a second confirm step. -->
    <section class="danger-zone">
      <div class="danger-copy">
        <h2>{{ t('life.memory.dangerTitle') }}</h2>
        <p class="hint">{{ t('life.memory.clearAllHint') }}</p>
      </div>
      <button class="btn danger" :disabled="loading" @click="clearAll">{{ t('life.memory.clearAll') }}</button>
    </section>
  </main>
</template>

<style scoped>
/* Shared design tokens + component vocabulary come from kit.ts (lifeKitCss on
   the .memory-page root); only memory-specific widgets live here. Rules that
   must out-rank the kit's #app realign layer repeat that #app prefix. */
.page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}
.page-header h1{margin:0;font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}
.subtitle{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}
.header-actions{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}

/* `auto-fit` + a shrinkable floor: a fixed `repeat(4, 1fr)` never steps down to
   a single column, so long localised labels squeeze instead of reflowing. */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}
.stat-card{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px;transition:transform 280ms var(--ease-spring),box-shadow 280ms}
@media (hover: hover) and (pointer: fine){.stat-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}
.stat-head{display:flex;align-items:center;gap:10px}
.stat-label{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}
.stat-value{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1}
.stat-hint{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}
.icon-badge{width:44px;height:44px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;flex-shrink:0}
.tone-1{background:var(--md-primary-container);color:var(--md-on-primary-container)}
.tone-2{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.tone-3{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}
.tone-4{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}

.card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.card-title{margin:0;font-size:16px;font-weight:650}

.toolbar{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}
.search-field{display:flex;align-items:center;gap:10px;flex:1;min-width:220px;height:52px;padding:0 14px;border-radius:16px;background:var(--md-surface-container-high)}
.search-icon{color:var(--md-on-surface-variant);flex-shrink:0}
.search-field input{flex:1;min-width:0;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}
.search-field input:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}
.search-field.mini{height:auto;padding:10px 12px;margin-bottom:12px}
#app .memory-page .field.area{height:auto;min-height:120px;padding:12px 14px;resize:vertical;line-height:1.6}

.chip{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}
.chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}
.tier-short{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.tier-long{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}
.chip-ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}
.chip-warn{background:var(--md-warning-container);color:var(--md-on-warning-container)}

.memory-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:var(--space-lg)}
.memory-card{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:transform 260ms var(--ease-spring),box-shadow 220ms,border-color 200ms}
@media (hover: hover) and (pointer: fine){.memory-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}
.memory-card-enter-active{transition:opacity 200ms var(--ease-emphasized-decel),transform 200ms var(--ease-emphasized-decel)}
.memory-card-leave-active{transition:opacity 160ms var(--ease-emphasized-accel),transform 160ms var(--ease-emphasized-accel)}
.memory-card-enter-from{opacity:0;transform:translateY(6px) scale(.98)}
.memory-card-leave-to{opacity:0;transform:scale(.98)}
.memory-card-move{transition:transform 260ms var(--ease-emphasized)}
@media (prefers-reduced-motion: reduce){.memory-card-enter-active,.memory-card-leave-active,.memory-card-move{transition-duration:1ms}.memory-card-enter-from,.memory-card-leave-to{transform:none}.stat-card:hover,.memory-card:hover{transform:none}}
.card-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.btn-icon{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}
/* The host's `#app button{min-height:36px}` would stretch this 30x30 control to
   30x36; the (1,2,0) selector wins the declared box back. The 44px `::after`
   hit area below keeps the touch target. */
#app .memory-page .btn-icon{min-height:0}
.btn-icon::after{content:'';position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}
.btn-icon.danger:hover{background:var(--md-error-container);color:var(--md-error)}
/* `pre-wrap` breaks at normal opportunities only, so a long token (URL, path,
   hash) in a memory still overflowed the card. `.item-meta` / `.quote` below
   already carry the `anywhere` variant. */
.memory-content{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tags span{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}
.memory-foot{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}
.meter{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}
.meter-bar{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.meter-bar i{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}
.fill-primary{background:var(--md-primary)}
.fill-secondary{background:var(--md-secondary,#536255)}
.meter-text{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}
.detail{display:grid;grid-template-rows:0fr;transition:grid-template-rows 240ms var(--ease-out,ease)}
.detail.open{grid-template-rows:1fr}
.detail-clip{overflow:hidden;min-height:0;border-top:0 solid transparent}
.detail-clip dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px;padding-top:10px}
.detail.open .detail-clip{border-top-width:1px;border-top-style:solid;border-top-color:var(--md-outline-variant)}
.detail dt{color:var(--md-on-surface-variant);font-weight:600}
.detail dd{margin:3px 0 0;overflow-wrap:anywhere}
.detail code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
.card-actions{display:flex;gap:8px;justify-content:flex-end}
.hidden-input{display:none}

.empty-state{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--r-lg);color:var(--md-on-surface-variant)}
.empty-state p{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}
.empty-state .hint{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}

.pager{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}

.grid-notes{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}
.stack-form{display:flex;flex-direction:column;gap:10px}
.note-list,.reflection-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.note-item{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:16px;background:var(--md-surface-container-low)}
.note-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.note-main strong{font-size:14px;font-weight:600;overflow-wrap:anywhere}
.item-meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}
.note-actions{display:flex;gap:6px;flex-shrink:0}
.list-empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}
.reader{margin-top:var(--space-lg)}
.reader pre{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}
.reflection .card-title{font-size:14px;font-weight:600}
.reflection details{margin-top:6px}
.reflection summary{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}
.quote{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}

@media (prefers-reduced-motion: reduce){.meter-bar i{transition:none}}

/* Tab cross-fade (~200ms, matches the memory-card enter/leave timings). */
.tab-body{min-width:0}
.tab-fade-enter-active{transition:opacity 200ms var(--ease-emphasized-decel)}
.tab-fade-leave-active{transition:opacity 140ms var(--ease-emphasized-accel)}
.tab-fade-enter-from,.tab-fade-leave-to{opacity:0}
@media (prefers-reduced-motion: reduce){.tab-fade-enter-active,.tab-fade-leave-active{transition-duration:1ms}}

/* Memory-dynamics read-outs: bars/curve animate instead of snapping when the
   dashboard refreshes. */
.dynamics-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px;align-items:end}
@media(max-width:900px){.dynamics-grid{grid-template-columns:1fr}}
.dyn-track{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.dyn-bar{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .5s var(--ease-out,ease)}
.dyn-hist{display:flex;align-items:flex-end;gap:3px;height:60px}
.dyn-hist i{flex:1;background:var(--md-primary);border-radius:3px 3px 0 0;transition:height .5s var(--ease-out,ease)}
.dyn-curve{width:100%;height:60px;color:var(--md-primary);display:block}
.decay-line{stroke-dasharray:1;stroke-dashoffset:1;animation:decay-draw .9s var(--ease-out,ease) forwards}
@keyframes decay-draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion: reduce){.dyn-bar,.dyn-hist i{transition:none}.decay-line{animation:none;stroke-dashoffset:0}}

/* First-load skeleton cards (same shimmer language as the shell's loading
   skeleton), hidden from assistive tech — the empty state announces for real. */
.skeleton-card{gap:12px;pointer-events:none}
.sk-line{display:block;height:12px;border-radius:6px;background:linear-gradient(90deg,var(--md-surface-container-high) 25%,color-mix(in srgb,var(--md-on-surface) 8%,var(--md-surface-container-high)) 45%,var(--md-surface-container-high) 65%);background-size:200% 100%;animation:sk-shimmer 1.4s linear infinite}
.sk-line.w30{width:30%}.sk-line.w40{width:40%}.sk-line.w75{width:75%}.sk-line.w90{width:90%}
@keyframes sk-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
@media (prefers-reduced-motion: reduce){.sk-line{animation:none}}

/* Bottom danger zone: a red-outlined card holding only irreversible actions,
   so "clear all" can no longer be mistaken for a routine header button. */
.danger-zone{display:flex;justify-content:space-between;align-items:center;gap:var(--space-lg);flex-wrap:wrap;margin-top:var(--space-xl);padding:var(--space-lg);border:1px solid color-mix(in srgb,var(--md-error,#b3261e) 45%,transparent);border-radius:var(--r-lg);background:color-mix(in srgb,var(--md-error,#b3261e) 5%,transparent)}
.danger-zone h2{margin:0;font-size:15px;font-weight:750;color:var(--md-error,#b3261e)}
.danger-zone .hint{margin:4px 0 0}
.danger-copy{flex:1;min-width:240px}

@media(max-width:900px){.stat-grid{grid-template-columns:repeat(2,1fr)}.grid-notes{grid-template-columns:1fr}}
@media(max-width:640px){.header-actions{padding-top:0}.memory-list{grid-template-columns:1fr}}
</style>
