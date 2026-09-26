<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { TaskRow } from './store'
import { locale } from './locale'

const props = defineProps<{ step: TaskRow; formatError?: (message?: string) => string }>()
const tr = (zh: string, en: string) => (locale.value === 'en' ? en : zh)

const open = ref(false)
const searchOpen = ref(false)

const tool = computed(() => (props.step.prompt || '').trim() || 'tool')
const isSearch = computed(() => ['websearch', 'web_search', 'search'].includes(tool.value))

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

const label = computed(() => {
  switch (tool.value) {
    case 'websearch': case 'web_search': case 'search': return tr('搜索', 'Search')
    case 'bash': return 'Bash'
    case 'write': return tr('写入', 'Write')
    case 'edit': case 'apply_patch': return tr('编辑', 'Edit')
    case 'read': return tr('读取', 'Read')
    case 'webfetch': return tr('请求', 'Fetch')
    case 'todowrite': return tr('待办', 'Todo')
    case 'task': return tr('子任务', 'Subtask')
    case 'skills_admin': case 'skill': return tr('技能', 'Skill')
    default: return tr('工具', 'Tool')
  }
})

const stateName = (value: string) => (locale.value === 'en'
  ? { pending: 'Queued', running: 'Running', done: 'Completed', failed: 'Failed', cancelled: 'Stopped' }
  : { pending: '等待执行', running: '执行中', done: '完成', failed: '失败', cancelled: '已停止' })[value] || value

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
  if (name === 'write') return typeof data.lines === 'number' ? `+${data.lines} ${tr('行', 'lines')}` : ''
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
    return query + (count ? ` · ${count} ${tr('条结果', 'results')}` : '')
  }
  if (name === 'bash') {
    const command = clip(String(a?.command ?? ''))
    const exit = d && d.exitCode !== undefined && props.step.state !== 'running' ? ` · ${tr('退出码', 'exit')} ${d.exitCode}` : ''
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
  if (name === 'bash' && d) {
    const out: Section[] = [{ label: tr('工作目录', 'cwd'), text: String(d.cwd || '') }]
    if (d.stdout) out.push({ label: 'stdout', text: String(d.stdout), mono: true })
    if (d.stderr) out.push({ label: 'stderr', text: String(d.stderr), mono: true })
    if (!d.stdout && !d.stderr) out.push({ label: '', text: tr('（无输出）', '(no output)') })
    return out
  }
  if (name === 'write' && d) {
    const out: Section[] = [{ label: tr('文件', 'File'), text: String(d.path || '') }]
    out.push({ label: tr('内容', 'Content'), text: `${typeof d.lines === 'number' ? d.lines : '—'} ${tr('行', 'lines')}${d.created ? ` · ${tr('新建文件', 'created')}` : ''} · ${d.bytes ?? '—'} B` })
    return out
  }
  // edit / apply_patch render a colored diff (see diffFiles) instead of raw text.
  if (name === 'edit' || name === 'apply_patch') return []
  if (name === 'read' && d) {
    const out: Section[] = [{ label: tr('文件', 'File'), text: String(d.path || '') }]
    out.push({ label: `${tr('第', 'line')} ${d.offset ?? '—'} ${tr('行起', 'onward')}`, text: String(d.content || ''), mono: true })
    return out
  }
  if (name === 'webfetch' && d) {
    return [
      { label: 'URL', text: String(d.url || '') },
      { label: tr('内容', 'Content'), text: String(d.content || ''), mono: true },
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

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && searchOpen.value) searchOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="tool-card" :class="{ expanded: open }">
    <button type="button" class="tool-card-head" @click="toggle">
      <span class="tool-dot" :class="step.state">●</span>
      <strong class="tool-kind">{{ label }}</strong>
      <span class="tool-summary">{{ summary }}</span>
      <small v-if="diffStat" class="tool-stat">{{ diffStat }}</small>
      <small class="tool-state">{{ stateName(step.state) }}</small>
      <span class="tool-chevron" aria-hidden="true">▸</span>
    </button>
    <div v-if="open && !isSearch" class="tool-card-body">
      <p v-if="step.state === 'running' && !sections.length && !diffFiles.length" class="muted">{{ tr('执行中…', 'Running…') }}</p>
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
      <template v-else>
        <template v-for="(section, index) in sections" :key="index">
          <small v-if="section.label" class="tool-section-label">{{ section.label }}</small>
          <pre v-if="section.mono">{{ section.text }}</pre>
          <p v-else class="tool-section-text">{{ section.text }}</p>
        </template>
      </template>
      <p v-if="!sections.length && !diffFiles.length && step.state !== 'running' && !step.error" class="muted">{{ tr('执行完成，无输出', 'Completed with no output') }}</p>
      <p v-if="step.error" class="tool-error">{{ formatError?.(step.error) || step.error }}</p>
    </div>
    <div v-if="searchOpen" class="tool-dialog-backdrop" @click.self="searchOpen = false">
      <section class="tool-dialog" role="dialog" aria-modal="true" :aria-label="tr('搜索结果', 'Search results')">
        <header>
          <h4>{{ tr('搜索', 'Search') }} · {{ searchText }}</h4>
          <button
            type="button"
            class="tool-dialog-close"
            :aria-label="tr('关闭', 'Close')"
            :title="tr('关闭', 'Close')"
            @click="searchOpen = false"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </header>
        <p v-if="step.state === 'running'" class="muted">{{ tr('搜索中…', 'Searching…') }}</p>
        <ol v-else-if="searchResults.length" class="tool-search-results">
          <li v-for="(item, index) in searchResults" :key="index">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title || item.url }}</a>
            <p v-if="item.snippet">{{ item.snippet }}</p>
            <small v-if="item.title && item.url">{{ item.url }}</small>
          </li>
        </ol>
        <p v-else class="muted">{{ searchFallback || tr('没有找到相关结果。', 'No relevant results found.') }}</p>
        <p v-if="step.error" class="tool-error">{{ formatError?.(step.error) || step.error }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.tool-card{--code-font:ui-monospace,'Cascadia Code','JetBrains Mono',Consolas,'SFMono-Regular',Menlo,monospace;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}
button.tool-card-head{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:12px}
button.tool-card-head:hover{background:var(--md-secondary-container)}
.tool-kind{flex-shrink:0;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface-variant)}
.tool-summary{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:11.5px}
.tool-stat{flex-shrink:0;font-size:11px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}
.tool-state{flex-shrink:0;font-size:11px;color:var(--md-on-surface-variant)}
.tool-chevron{flex-shrink:0;color:var(--md-on-surface-variant);font-size:11px;transition:transform .15s}
.tool-card.expanded .tool-chevron{transform:rotate(90deg)}
.tool-dot{font-size:9px}
.tool-dot.running,.tool-dot.pending{color:#b88412}
.tool-dot.failed{color:var(--md-error,#c44)}
.tool-dot.done{color:#3a6}
.tool-dot.cancelled{color:var(--md-on-surface-variant)}
.tool-card-body{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}
.tool-section-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}
.tool-card-body pre{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-family:var(--code-font);font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
.tool-section-text{margin:0;font-size:12.5px;overflow-wrap:anywhere}
.tool-error{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}
.muted{font-size:12px;color:var(--md-on-surface-variant);margin:0}
.tool-dialog-backdrop{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}
.tool-dialog{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}
.tool-dialog header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.tool-dialog h4{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}
#app .tool-dialog-close,.tool-dialog-close{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}
#app .tool-dialog-close:hover,.tool-dialog-close:hover{background:color-mix(in srgb, var(--md-on-surface) 8%, transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}
#app .tool-dialog-close:active,.tool-dialog-close:active{background:color-mix(in srgb, var(--md-on-surface) 12%, transparent);border-radius:50%}
.tool-search-results{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}
.tool-search-results a{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}
.tool-search-results a:hover{text-decoration:underline}
.tool-search-results p{margin:4px 0 0;font-size:12.5px;line-height:1.65;color:var(--md-on-surface)}
.tool-search-results small{display:block;margin-top:2px;font-size:11px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}

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
@media (prefers-color-scheme: dark){
  .diff-line.add{color:#7ee787}
  .diff-line.add .diff-sign{color:#7ee787}
  .diff-line.del{color:#ffa198}
  .diff-line.del .diff-sign{color:#ffa198}
}
</style>
