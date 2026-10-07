<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { TaskRow } from './store'
import { i18n, uid } from '@0kay/host'

const props = defineProps<{ step: TaskRow; formatError?: (message?: string) => string }>()
const emit = defineEmits<{ open: [path: string] }>()
const t = (key: string, named?: Record<string, unknown>) => i18n.global.t(key, named ?? {})

const open = ref(false)
const searchOpen = ref(false)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null
// ids for aria-controls: the collapsible body and the teleported search dialog
const bodyId = uid('tool-body')
const searchDialogId = uid('tool-dialog')

const tool = computed(() => (props.step.prompt || '').trim() || 'tool')
const isSearch = computed(() => ['websearch', 'web_search', 'search', 'papersearch', 'apidocsearch', 'apidoc_search'].includes(tool.value))
const searchKind = computed(() => {
  if (tool.value === 'papersearch') return t('agent.tool.paperSearch')
  if (tool.value === 'apidocsearch' || tool.value === 'apidoc_search') return t('agent.tool.apiDocsSearch')
  return t('agent.tool.search')
})

const args = computed<any | null>(() => {
  if (!props.step.args) return null
  try {
    const value = JSON.parse(props.step.args)
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null
  } catch { return null }
})

const payload = computed<any | null>(() => {
  if (!props.step.result) return null
  try { return JSON.parse(props.step.result) } catch { return props.step.result }
})

const inner = computed<any | null>(() => {
  const value = payload.value
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  if (value.data !== undefined && value.data !== null && typeof value.data === 'object' && !Array.isArray(value.data)) return value.data
  if ('success' in value) return null
  return value
})

const screenshot = computed<{ src: string; width?: number; height?: number; path?: string } | null>(() => {
  const d = inner.value
  if (!d || typeof d.base64 !== 'string' || typeof d.mime !== 'string' || !d.mime.startsWith('image/')) return null
  return { src: `data:${d.mime};base64,${d.base64}`, width: d.width, height: d.height, path: d.path }
})

// Files a tool produced and that the WebUI can open (research figures/docx,
// document, slides). Kept separate from the raw JSON dump.
const producedFiles = computed<string[]>(() => {
  const out: string[] = []
  const add = (value: unknown) => { if (typeof value === 'string' && value && !out.includes(value)) out.push(value) }
  const name = tool.value
  if (name === 'document' || name === 'slides') add(inner.value?.path)
  add(inner.value?.file)
  if (Array.isArray(inner.value?.files)) inner.value.files.forEach((file: any) => add(typeof file === 'string' ? file : file?.path))
  return out
})
const fileName = (value: string) => String(value || '').split(/[\\/]/).pop() || value

async function copyResult() {
  const text = props.step.result || ''
  if (!text) return
  try { await navigator.clipboard.writeText(text) } catch { /* clipboard unavailable */ }
  copied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => { copied.value = false }, 1500)
}

const label = computed(() => {
  switch (tool.value) {
    case 'websearch': case 'web_search': case 'search': return t('agent.tool.search')
    case 'papersearch': return t('agent.tool.paper')
    case 'apidocsearch': case 'apidoc_search': return t('agent.tool.apiDocs')
    case 'bash': return 'Bash'
    case 'write': return t('agent.tool.write')
    case 'edit': case 'apply_patch': return t('agent.tool.edit')
    case 'read': return t('agent.tool.read')
    case 'webfetch': return t('agent.tool.fetch')
    case 'todowrite': return t('agent.tool.todo')
    case 'task': return t('agent.tool.subtask')
    case 'skills_admin': case 'skill': return t('agent.tool.skill')
    case 'computeruse': return t('agent.tool.computer')
    case 'research': return t('agent.tool.research')
    case 'document': return t('agent.tool.document')
    case 'slides': return t('agent.tool.slides')
    case 'browser': return t('agent.tool.browser')
    case 'glob': return t('agent.tool.glob')
    case 'grep': return t('agent.tool.grep')
    case 'mcp': return 'MCP'
    case 'compress_context': return t('agent.tool.compressContext')
    case 'decompress_context': return t('agent.tool.expandContext')
    case 'search_context': return t('agent.tool.searchContext')
    case 'acp_status': return t('agent.tool.status')
    default: return t('agent.tool.tool')
  }
})

const stateName = (value: string) => ({
  pending: t('agent.tool.statePending'),
  running: t('agent.tool.stateRunning'),
  done: t('agent.tool.stateDone'),
  failed: t('agent.tool.stateFailed'),
  cancelled: t('agent.tool.stateCancelled'),
} as Record<string, string>)[value] || value

function countDiff(text: unknown) {
  let added = 0
  let removed = 0
  for (const line of String(text || '').split('\n')) {
    if (line.startsWith('---') || line.startsWith('+++')) continue
    if (line.startsWith('+')) added++
    else if (line.startsWith('-')) removed++
  }
  return { added, removed }
}

const diffStat = computed(() => {
  const name = tool.value
  const data = inner.value
  if (!data) return ''
  if (name === 'write') return typeof data.lines === 'number' ? `+${data.lines} ${t('agent.tool.lines')}` : ''
  if (name === 'edit') {
    const { added, removed } = countDiff(data.diff)
    return added || removed ? `+${added} −${removed}` : ''
  }
  if (name === 'apply_patch' && Array.isArray(data.files)) {
    let added = 0
    let removed = 0
    for (const file of data.files) { const part = countDiff(file?.diff); added += part.added; removed += part.removed }
    return added || removed ? `+${added} −${removed}` : ''
  }
  return ''
})

interface DiffLine { kind: 'add' | 'del' | 'hunk' | 'meta' | 'ctx'; oldNo: string; newNo: string; text: string }
interface DiffFile { path: string; lines: DiffLine[] }

/** Parse a unified diff, tracking old/new line numbers for each row. */
function parseDiff(text: string, fallbackPath: string): DiffFile[] {
  const files: DiffFile[] = []
  let current: DiffFile | null = null
  let oldNo = 0
  let newNo = 0
  const push = (line: DiffLine) => { if (!current) { current = { path: fallbackPath, lines: [] }; files.push(current) } current.lines.push(line) }
  for (const raw of String(text || '').split('\n')) {
    if (raw.startsWith('+++ ')) {
      const path = raw.slice(4).split('\t')[0].trim().replace(/^[ab]\//, '')
      current = { path: path === '/dev/null' ? fallbackPath : path, lines: [] }
      files.push(current)
      continue
    }
    if (raw.startsWith('--- ')) continue
    if (raw.startsWith('diff --git')) {
      if (!current) { current = { path: fallbackPath, lines: [] }; files.push(current) }
      continue
    }
    if (raw.startsWith('@@')) {
      const match = /@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(raw)
      if (match) { oldNo = parseInt(match[1], 10); newNo = parseInt(match[2], 10) }
      push({ kind: 'hunk', oldNo: '', newNo: '', text: raw })
      continue
    }
    if (/^(index |new file|deleted file|old mode|new mode|similarity |rename |copy )/.test(raw)) {
      push({ kind: 'meta', oldNo: '', newNo: '', text: raw })
      continue
    }
    if (raw.startsWith('+')) { push({ kind: 'add', oldNo: '', newNo: String(newNo++), text: raw.slice(1) }); continue }
    if (raw.startsWith('-')) { push({ kind: 'del', oldNo: String(oldNo++), newNo: '', text: raw.slice(1) }); continue }
    if (raw.startsWith('\\')) { push({ kind: 'meta', oldNo: '', newNo: '', text: raw }); continue }
    push({ kind: 'ctx', oldNo: String(oldNo++), newNo: String(newNo++), text: raw })
  }
  return files
}

const diffFiles = computed<DiffFile[]>(() => {
  const name = tool.value
  const d = inner.value
  const a = args.value
  if (name === 'edit' && d) return parseDiff(String(d.diff || ''), String(a?.filePath || d.path || ''))
  if (name === 'apply_patch') {
    const out: DiffFile[] = []
    if (Array.isArray(d?.files)) {
      for (const file of d.files) {
        const parsed = parseDiff(String(file?.diff || ''), String(file?.path || ''))
        if (parsed.length) out.push(...parsed)
        else out.push({ path: String(file?.path || ''), lines: [] })
      }
      return out
    }
    if (Array.isArray(a?.patches)) {
      const text = a.patches.map((patch: any) => String(patch?.patch ?? patch?.diff ?? patch?.text ?? '')).join('\n')
      return parseDiff(text, '')
    }
    return out
  }
  return []
})

function fileStat(file: DiffFile): string {
  const lines = file.lines || []
  const added = lines.filter((line) => line.kind === 'add').length
  const removed = lines.filter((line) => line.kind === 'del').length
  return added || removed ? `+${added} −${removed}` : ''
}

const summary = computed(() => {
  const name = tool.value
  const a = args.value
  const d = inner.value
  const clip = (text: string, max = 160) => (text || '').length > max ? `${text.slice(0, max)}…` : (text || '')
  if (isSearch.value) {
    const query = clip(String(d?.query ?? a?.query ?? ''))
    const count = Array.isArray(d?.results) ? d.results.length : 0
    return query + (count ? ` · ${count} ${t('agent.tool.results')}` : '')
  }
  if (name === 'bash') {
    const command = clip(String(a?.command ?? ''))
    const exit = d && d.exitCode !== undefined && props.step.state !== 'running' ? ` · ${t('agent.tool.exit')} ${d.exitCode}` : ''
    return command + exit
  }
  if (name === 'webfetch') {
    const url = clip(String(d?.url ?? a?.url ?? ''))
    return url + (d?.status !== undefined && d?.status !== null ? ` · HTTP ${d.status}` : '')
  }
  if (name === 'read' || name === 'write') return clip(String(d?.path ?? a?.filePath ?? ''))
  if (name === 'edit') return clip(String(a?.filePath ?? d?.path ?? ''))
  if (name === 'apply_patch') {
    const files = Array.isArray(a?.patches)
      ? a.patches.map((patch: any) => patch?.filePath).filter(Boolean)
      : Array.isArray(d?.files) ? d.files.map((file: any) => file?.path).filter(Boolean) : []
    return clip(files.join(', '))
  }
  if (name === 'todowrite') {
    const list = Array.isArray(a?.todos) ? a.todos : Array.isArray(d?.todos) ? d.todos : []
    if (!list.length) return clip(String(props.step.args || ''))
    const total = list.length
    const done = list.filter((item: any) => item?.status === 'completed').length
    const running = list.filter((item: any) => item?.status === 'in_progress').length
    return `${total} ${t('agent.tool.items')} · ${t('agent.tool.done')} ${done}${running ? ` · ${t('agent.tool.inProgress')} ${running}` : ''}`
  }
  if (name === 'glob' || name === 'grep') return clip(String(a?.pattern ?? a?.query ?? ''))
  if (name === 'search_context') return clip(String(a?.query ?? a?.q ?? ''))
  if (name === 'research') {
    const action = String(d?.action ?? a?.action ?? '')
    const produced = d?.file || (Array.isArray(d?.files) ? d.files[0] : '') || d?.out || ''
    return clip(`${action}${produced ? ` · ${produced}` : ''}`)
  }
  if (name === 'document' || name === 'slides') return clip(String(d?.path ?? a?.path ?? ''))
  if (name === 'computeruse') {
    const action = String(a?.action ?? d?.action ?? '')
    const position = a && a.x !== undefined ? ` (${a.x}, ${a.y})` : ''
    const dims = d?.width && d?.height ? ` · ${d.width}×${d.height}` : ''
    const count = Array.isArray(d?.windows) ? ` · ${d.windows.length} ${t('agent.tool.windows')}` : ''
    return clip(`${action}${position}${dims}${count}`)
  }
  if (a && Object.keys(a).length) { try { return clip(JSON.stringify(a)) } catch { /* fall through */ } }
  return clip(String(props.step.args || ''))
})

const searchText = computed(() => String(inner.value?.query ?? args.value?.query ?? props.step.args ?? ''))

const searchResults = computed<any[]>(() => (Array.isArray(inner.value?.results) ? inner.value.results : []))

const searchFallback = computed(() => {
  if (typeof payload.value === 'string') return payload.value
  if (payload.value === null && props.step.result) return props.step.result
  return ''
})

interface Section { label: string; text: string; mono?: boolean }

const sections = computed<Section[]>(() => {
  const name = tool.value
  const d = inner.value
  // Produced files are shown as open buttons, not as a raw JSON dump.
  if (['document', 'slides', 'research'].includes(name) && producedFiles.value.length) return []
  if (name === 'computeruse' && screenshot.value) return []
  if (name === 'bash' && d) {
    const out: Section[] = [{ label: t('agent.tool.cwd'), text: String(d.cwd || '') }]
    if (d.stdout) out.push({ label: 'stdout', text: String(d.stdout), mono: true })
    if (d.stderr) out.push({ label: 'stderr', text: String(d.stderr), mono: true })
    if (!d.stdout && !d.stderr) out.push({ label: '', text: t('agent.tool.noOutput') })
    return out
  }
  if (name === 'write' && d) {
    const out: Section[] = [{ label: t('agent.tool.file'), text: String(d.path || '') }]
    out.push({ label: t('agent.tool.content'), text: `${typeof d.lines === 'number' ? d.lines : '—'} ${t('agent.tool.lines')}${d.created ? ` · ${t('agent.tool.created')}` : ''} · ${d.bytes ?? '—'} B` })
    return out
  }
  // edit / apply_patch render a colored diff (see diffFiles) instead of raw text.
  if (name === 'edit' || name === 'apply_patch') return []
  if (name === 'read' && d) {
    const out: Section[] = [{ label: t('agent.tool.file'), text: String(d.path || '') }]
    out.push({ label: `${t('agent.tool.line')} ${d.offset ?? '—'} ${t('agent.tool.onward')}`, text: String(d.content || ''), mono: true })
    return out
  }
  if (name === 'webfetch' && d) {
    return [
      { label: 'URL', text: String(d.url || '') },
      { label: t('agent.tool.content'), text: String(d.content || ''), mono: true },
    ]
  }
  const raw = props.step.result
  if (!raw) return []
  try { return [{ label: 'JSON', text: JSON.stringify(payload.value, null, 2), mono: true }] }
  catch { return [{ label: '', text: String(raw), mono: true }] }
})

function toggle() {
  if (isSearch.value) { searchOpen.value = !searchOpen.value; return }
  open.value = !open.value
}

// --- search dialog focus management ---
const headButton = ref<HTMLButtonElement | null>(null)
const searchDialog = ref<HTMLElement | null>(null)
const searchClose = ref<HTMLButtonElement | null>(null)
let searchOpener: HTMLElement | null = null
watch(searchOpen, async (opened) => {
  if (opened) {
    searchOpener = document.activeElement as HTMLElement | null
    await nextTick()
    searchClose.value?.focus()
  } else {
    // Return focus to the card header so keyboard users are not dropped at
    // <body>; a no-op when the opener (or card) is already gone.
    ;(searchOpener || headButton.value)?.focus()
    searchOpener = null
  }
})
// Keep Tab cycling inside the dialog while it is open.
function trapDialogTab(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !searchDialog.value) return
  const focusables = Array.from(searchDialog.value.querySelectorAll<HTMLElement>(
    'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
  )).filter(el => el.offsetParent !== null)
  if (!focusables.length) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const current = document.activeElement
  const inside = current instanceof Node && searchDialog.value.contains(current)
  if (event.shiftKey && (current === first || !inside)) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && (current === last || !inside)) { event.preventDefault(); first.focus() }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && searchOpen.value) searchOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => { window.removeEventListener('keydown', onKeydown); if (copyTimer) clearTimeout(copyTimer) })
</script>

<template>
  <div class="tool-card" :class="{ expanded: open }">
    <button ref="headButton" type="button" class="tool-card-head" :aria-expanded="isSearch ? searchOpen : open" :aria-controls="isSearch ? undefined : bodyId" @click="toggle">
      <span class="tool-dot" :class="step.state">●</span>
      <strong class="tool-kind">{{ label }}</strong>
      <span class="tool-summary">{{ summary }}</span>
      <small v-if="diffStat" class="tool-stat">{{ diffStat }}</small>
      <small class="tool-state">{{ stateName(step.state) }}</small>
      <span class="tool-chevron" aria-hidden="true">▸</span>
    </button>
    <!-- The body always renders (except for search tools) inside a 0fr→1fr
         collapse grid, so both expand and collapse animate smoothly; the body
         itself fades via its `.open` class. -->
    <div class="collapse-grid" :class="{ open: open && !isSearch }">
      <div v-if="!isSearch" :id="bodyId" class="tool-card-body" :class="{ open }">
      <div v-if="producedFiles.length || step.result" class="tool-body-actions">
        <button v-for="(file, index) in producedFiles" :key="index" type="button" class="tool-open" :title="file" @click="emit('open', file)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3h7v7M21 3l-9 9M5 5h6M5 5v14h14v-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="tool-open-label">{{ t('agent.tool.open') }} · {{ fileName(file) }}</span>
        </button>
        <button type="button" class="tool-copy" :disabled="!step.result" @click="copyResult">{{ copied ? t('agent.tool.copied') : t('agent.tool.copy') }}</button>
      </div>
      <p v-if="step.state === 'running' && !sections.length && !diffFiles.length && !screenshot" class="muted">{{ t('agent.tool.running') }}</p>
      <figure v-if="screenshot" class="tool-shot">
        <img :src="screenshot.src" :alt="t('agent.tool.screenshot')" />
        <figcaption>{{ screenshot.width && screenshot.height ? `${screenshot.width}×${screenshot.height} · ` : '' }}{{ screenshot.path }}</figcaption>
      </figure>
      <div v-if="diffFiles.length" class="diff-wrap">
        <div v-for="(file, fi) in diffFiles" :key="fi" class="diff-file">
          <div class="diff-file-head">
            <span class="diff-file-path" :title="file.path">{{ file.path || '—' }}</span>
            <span v-if="fileStat(file)" class="diff-file-stat">{{ fileStat(file) }}</span>
          </div>
          <div class="diff-body">
            <div v-for="(line, li) in file.lines" :key="li" class="diff-line" :class="line.kind">
              <span class="diff-no">{{ line.oldNo }}</span>
              <span class="diff-no">{{ line.newNo }}</span>
              <span class="diff-sign">{{ line.kind === 'add' ? '+' : line.kind === 'del' ? '-' : '' }}</span>
              <span class="diff-text">{{ line.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <template v-else-if="!screenshot">
        <template v-for="(section, index) in sections" :key="index">
          <small v-if="section.label" class="tool-section-label">{{ section.label }}</small>
          <pre v-if="section.mono">{{ section.text }}</pre>
          <p v-else class="tool-section-text">{{ section.text }}</p>
        </template>
      </template>
      <p v-if="!sections.length && !diffFiles.length && !screenshot && step.state !== 'running' && !step.error" class="muted">{{ t('agent.tool.completedNoOutput') }}</p>
      <p v-if="step.error" class="tool-error">{{ formatError?.(step.error) || step.error }}</p>
      </div>
    </div>
    <!-- Teleport to <body>: a `position:fixed` overlay inside a message card is
         re-anchored by any transformed/overflow ancestor, which made the popup
         appear in the middle of the message instead of the viewport centre. -->
    <Teleport to="body">
    <div v-if="searchOpen" class="tool-dialog-backdrop" @click.self="searchOpen = false" @keydown="trapDialogTab">
      <section :id="searchDialogId" ref="searchDialog" class="tool-dialog" role="dialog" aria-modal="true" :aria-label="t('agent.tool.searchResults')">
        <header>
          <h4>{{ searchKind }} · {{ searchText }}</h4>
          <button
            ref="searchClose"
            type="button"
            class="tool-dialog-close"
            :aria-label="t('agent.tool.close')"
            :title="t('agent.tool.close')"
            @click="searchOpen = false"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </header>
        <p v-if="step.state === 'running'" class="muted">{{ t('agent.tool.searching') }}</p>
        <ol v-else-if="searchResults.length" class="tool-search-results">
          <li v-for="(item, index) in searchResults" :key="index">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title || item.url }}</a>
            <p v-if="item.snippet">{{ item.snippet }}</p>
            <small v-if="item.title && item.url">{{ item.url }}</small>
            <span v-if="item.source" class="tool-search-source">{{ item.source }}</span>
          </li>
        </ol>
        <p v-else class="muted">{{ searchFallback || t('agent.tool.noResults') }}</p>
        <p v-if="step.error" class="tool-error">{{ formatError?.(step.error) || step.error }}</p>
      </section>
    </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tool-card{--code-font:ui-monospace,'Cascadia Code','JetBrains Mono',Consolas,'SFMono-Regular',Menlo,monospace;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}
button.tool-card-head{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:13px}
button.tool-card-head:hover{background:var(--md-secondary-container)}
.tool-kind{flex-shrink:0;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface)}
.tool-summary{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:13px;color:var(--md-on-surface)}
.tool-stat{flex-shrink:0;font-size:12px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}
.tool-state{flex-shrink:0;font-size:13px;color:var(--md-on-surface-variant)}
.tool-chevron{flex-shrink:0;color:var(--md-on-surface-variant);font-size:12px;transition:transform var(--duration-short) var(--ease-out)}
.tool-card.expanded .tool-chevron{transform:rotate(90deg)}
.tool-dot{font-size:9px}
.tool-dot.running,.tool-dot.pending{color:var(--md-warning)}
.tool-dot.failed{color:var(--md-error)}
.tool-dot.done{color:var(--md-success)}
.tool-dot.cancelled{color:var(--md-on-surface-variant)}
/* Running breathes slowly; shut off under prefers-reduced-motion. */
.tool-dot.running{animation:tool-dot-breathe 2s ease-in-out infinite}
@keyframes tool-dot-breathe{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.8)}}
@media (prefers-reduced-motion: reduce){.tool-dot.running{animation:none}}
/* Fade is driven by the `.open` class, not by mounting: the body stays in the
   DOM inside the collapse grid (see template), so both expand and collapse get
   an opacity + height transition. */
.tool-card-body{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px;opacity:0;transform:translateY(-4px);transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}
.tool-card-body.open{opacity:1;transform:none}
.tool-section-label{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}
.tool-card-body pre{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-family:var(--code-font);font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
.tool-shot{margin:0;display:flex;flex-direction:column;gap:6px}
.tool-shot img{width:100%;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);display:block}
.tool-shot figcaption{font-family:var(--code-font);font-size:11.5px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}
.tool-section-text{margin:0;font-size:13px;overflow-wrap:anywhere}
.tool-error{background:var(--md-error-container);color:var(--md-on-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}
.muted{font-size:12px;color:var(--md-on-surface-variant);margin:0}
.tool-dialog-backdrop{position:fixed;inset:0;background:color-mix(in srgb,var(--md-scrim,#000) 53%,transparent);z-index:var(--z-modal, 4000);display:grid;place-items:center;padding:20px}
.tool-dialog{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}
.tool-dialog header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.tool-dialog h4{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}
#app .tool-dialog-close,.tool-dialog-close{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}
#app .tool-dialog-close:hover,.tool-dialog-close:hover{background:color-mix(in srgb, var(--md-on-surface) 8%, transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}
#app .tool-dialog-close:active,.tool-dialog-close:active{background:color-mix(in srgb, var(--md-on-surface) 12%, transparent);border-radius:50%}
.tool-search-results{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}
.tool-search-results a{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}
.tool-search-results a:hover{text-decoration:underline}
.tool-search-results p{margin:4px 0 0;font-size:13px;line-height:1.65;color:var(--md-on-surface)}
.tool-search-results small{display:block;margin-top:2px;font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}
.tool-search-source{display:inline-block;margin-top:4px;padding:1px 7px;border-radius:999px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);font-size:11px;color:var(--md-on-surface-variant)}
.tool-body-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.tool-body-actions button{font:inherit;font-size:12px;display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:5px 10px;border-radius:999px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);color:var(--md-on-surface);cursor:pointer;overflow:hidden;transition:background-color 160ms}
/* `text-overflow` does not apply to the inline-flex button itself (its text is
   an anonymous flex item), so a long produced-file path was hard-clipped
   mid-glyph. The inner span is what actually ellipsises. */
.tool-open-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tool-body-actions button:hover{background:var(--md-secondary-container)}
.tool-body-actions .tool-copy{margin-left:auto}
.tool-body-actions button svg{flex:none;color:var(--md-primary)}

/* Material 3 Expressive polish */
.tool-card{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent);background:var(--md-surface-container);transition:box-shadow 220ms,background-color 200ms}
.tool-card:hover{box-shadow:var(--shadow-1)}
button.tool-card-head{padding:12px 15px;gap:10px;min-height:46px;border-radius:0}
button.tool-card-head:hover{background:var(--md-secondary-container)}
.tool-kind{font-weight:700;letter-spacing:.06em}
.tool-stat{border-color:color-mix(in srgb,var(--md-primary) 30%,transparent);background:color-mix(in srgb,var(--md-primary) 10%,transparent)}
.tool-chevron{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:50%;background:var(--md-surface-container-high);transition:transform 300ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 160ms}
.tool-card-body{padding:8px 15px 15px;gap:8px;border-top-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}
.tool-card-body pre{border-radius:14px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}
.tool-section-label{font-weight:700}

/* Colored diff (edit / apply_patch): green = added, red = deleted */
.diff-wrap{display:flex;flex-direction:column;gap:10px}
.diff-file{border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);border-radius:14px;overflow:hidden;background:var(--md-surface-container-lowest)}
.diff-file-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;background:var(--md-surface-container);font-size:11.5px;font-weight:650}
.diff-file-path{font-family:var(--code-font);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.diff-file-stat{flex:none;font-family:var(--code-font);color:var(--md-on-surface-variant)}
.diff-body{max-height:360px;overflow:auto;font-family:var(--code-font);font-size:12px;line-height:1.55;padding:4px 0}
.diff-line{display:grid;grid-template-columns:40px 40px 18px 1fr;white-space:pre;min-width:max-content}
.diff-no{text-align:right;padding:0 6px;color:var(--md-on-surface-variant);opacity:.6;user-select:none;font-variant-numeric:tabular-nums}
.diff-sign{text-align:center;user-select:none;opacity:.9}
.diff-text{padding-right:12px}
.diff-line.add{background:color-mix(in srgb,#2ea043 20%,transparent);color:#116329}
.diff-line.del{background:color-mix(in srgb,#cf222e 18%,transparent);color:#82071e}
.diff-line.add .diff-sign{color:#116329;font-weight:700}
.diff-line.del .diff-sign{color:#cf222e;font-weight:700}
.diff-line.hunk{background:var(--md-surface-container);color:var(--md-on-surface-variant)}
.diff-line.meta{color:var(--md-on-surface-variant);opacity:.75}
</style>
<style>
/* Dark text colors ride on the host's html[data-theme] toggle rather than the
   OS media query, so a manual light/dark choice in Settings is honored too.
   Scoped styles cannot express an html-level selector; #app keeps the rules
   from leaking (unscoped block — see AgentsPage for the same pattern). */
html[data-theme="dark"] #app .diff-line.add{color:#7ee787}
html[data-theme="dark"] #app .diff-line.add .diff-sign{color:#7ee787}
html[data-theme="dark"] #app .diff-line.del{color:#ffa198}
html[data-theme="dark"] #app .diff-line.del .diff-sign{color:#ffa198}
</style>
