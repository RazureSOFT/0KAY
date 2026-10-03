<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAgentsStore, type TaskRow } from './store'
import MarkdownContent from './MarkdownContent.vue'
import ToolStepCard from './ToolStepCard.vue'
import FileViewer from './FileViewer.vue'
import AppSelect from './AppSelect.vue'
import ThinkingSlider from './ThinkingSlider.vue'
import ThinkChain from './ThinkChain.vue'
import { locale, syncLocale } from './locale'
import { useConfirm } from './confirm'
import ConfirmDialog from './ConfirmDialog.vue'
const tr=(zh:string,en:string)=>locale.value==='en'?en:zh
const { confirm } = useConfirm()

const store = useAgentsStore()
const selectedId = ref(localStorage.getItem('0kay.agent.selected') || '')
const draft = ref('')
const attachments = ref<Array<{ name: string; url: string; mime: string; size: number }>>([])
const uploading = ref(false)
const attachError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
function pickFiles() { fileInput.value?.click() }
function removeAttachment(index: number) { attachments.value.splice(index, 1) }
async function addFiles(files: File[]) {
  if (!files.length) return
  uploading.value = true; attachError.value = ''
  try {
    for (const file of files) {
      const form = new FormData()
      form.append('file', file)
      const response = await fetch('/api/files', { method: 'POST', body: form })
      if (!response.ok) throw new Error(await response.text())
      const data = await response.json()
      attachments.value.push({ name: data.name || file.name, url: data.url, mime: data.mime || file.type || 'application/octet-stream', size: data.size ?? file.size })
    }
  } catch (e: any) { attachError.value = e.message }
  finally { uploading.value = false }
}
async function onFilesPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  await addFiles(files)
}
function onPaste(event: ClipboardEvent) {
  const files = Array.from(event.clipboardData?.files || [])
  if (!files.length) return
  event.preventDefault()
  void addFiles(files)
}
const search = ref('')
const source = ref('all')
const mode = ref('general')
const optionsOpen = ref(false)
const executorId = ref('')
const workdir = ref('')
const intensity = ref(50)
function savedIntensity(value:unknown):number {
 const legacy:Record<string,number>={off:0,low:20,medium:50,high:75,max:100}
 if(typeof value==='string'&&value in legacy)return legacy[value]
 const number=Number(value??50);return Number.isFinite(number)?Math.max(0,Math.min(100,number)):50
}
const modelId = ref('MOCR')
const permissionMode = ref('normal')
const folderName = ref('')
async function createFolder() {
  if(!folderName.value.trim() || !executor.value || browserBusy.value)return
  browserBusy.value=true;browserError.value=''
  try {const response=await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent(executor.value.plugin_id)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:directory.value.path,name:folderName.value.trim()})});if(!response.ok)throw new Error(await response.text());const result=await response.json();folderName.value='';await browse(result.path)}
  catch(e:any){browserError.value=e.message}finally{browserBusy.value=false}
}
const models = ref<Array<{ id: string; provider: string; provider_id?: string; provider_name?: string }>>([])
const hostOpen = ref(false)
const browserOpen = ref(false)
const browserBusy = ref(false)
const browserError = ref('')
const directory = ref<{path:string;parent:string;roots:string[];directories:Array<{name:string;path:string}>}>({path:'',parent:'',roots:[],directories:[]})
const hostUsage = ref<{cpu_percent:number;memory_percent:number;sampled_at:string}|null>(null)
const compactNotice = ref('')
let hostTimer: ReturnType<typeof setInterval> | null = null
let browseRequest = 0
let browserExecutor = ''
let hostFetching = false
const followLatest = ref(true)
function rememberEditor(id = selectedId.value) {
  try { localStorage.setItem(`0kay.agent.editor:${id}`, JSON.stringify({draft:draft.value,mode:mode.value,...options()})) } catch { /* storage unavailable */ }
}
function closeBrowser() { browseRequest++;browserOpen.value=false;browserBusy.value=false;workspacePick.value=false }
function onEscape(event: KeyboardEvent) {if(event.key==='Escape' && browserOpen.value) closeBrowser()}
// Slash menu: typing "/" offers the agent's skills (the agent resolves
// "/<skill> <request>") plus built-in commands.
const skills = ref<Array<{ name: string; description: string; tags?: string[]; source?: string }>>([])
let skillsLoaded = false
async function fetchSkills() {
  if (skillsLoaded) return
  skillsLoaded = true
  try {
    const response = await fetch('/api/skills')
    const data = await response.json()
    const list = data?.result?.skills ?? data?.skills
    if (Array.isArray(list)) skills.value = list
    else skillsLoaded = false
  } catch { skillsLoaded = false }
}
const slashCommands = [{ name: 'compact', description: tr('压缩当前会话上下文','Compact the session context') }]
const slashQuery = computed(() => { const match = /^\/([^\s]*)$/.exec(draft.value); return match ? match[1].toLowerCase() : null })
const slashItems = computed(() => {
  const query = slashQuery.value
  if (query === null) return [] as Array<{ name: string; description: string }>
  const all = [
    ...slashCommands,
    ...skills.value.map(skill => ({ name: skill.name, description: skill.description || '' })),
  ]
  const seen = new Set<string>()
  return all.filter(item => {
    if (seen.has(item.name) || !item.name.toLowerCase().startsWith(query)) return false
    seen.add(item.name)
    return true
  }).slice(0, 8)
})
const slashSuppressed = ref(false)
const slashOpen = computed(() => !slashSuppressed.value && slashItems.value.length > 0)
const slashIndex = ref(0)
watch(slashItems, () => { slashIndex.value = 0 })
watch(slashQuery, query => { slashSuppressed.value = false; if (query !== null) void fetchSkills() })
// The composer column clips its overflow, so the menu is teleported to <body>
// and positioned above the input from its bounding rect.
const composerInput = ref<HTMLElement | null>(null)
const slashMenuStyle = ref<Record<string, string>>({})
function positionSlashMenu() {
  const rect = composerInput.value?.getBoundingClientRect()
  if (!rect) return
  slashMenuStyle.value = {
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    bottom: `${Math.max(8, window.innerHeight - rect.top + 8)}px`,
  }
}
const onViewportChange = () => { if (slashOpen.value) positionSlashMenu() }
watch(slashOpen, open => { if (open) void nextTick(positionSlashMenu) })
onMounted(() => { window.addEventListener('resize', onViewportChange); window.addEventListener('scroll', onViewportChange, true) })
onUnmounted(() => { window.removeEventListener('resize', onViewportChange); window.removeEventListener('scroll', onViewportChange, true) })
function applySlash(item: { name: string }) {
  draft.value = '/' + item.name + ' '
  slashSuppressed.value = true
  nextTick(() => (document.querySelector('.composer-input textarea') as HTMLTextAreaElement | null)?.focus())
}
function onComposerKey(event: KeyboardEvent) {
  if (slashOpen.value) {
    const count = slashItems.value.length
    if (event.key === 'ArrowDown') { event.preventDefault(); slashIndex.value = (Math.min(slashIndex.value, count - 1) + 1) % count; return }
    if (event.key === 'ArrowUp') { event.preventDefault(); slashIndex.value = (Math.min(slashIndex.value, count - 1) - 1 + count) % count; return }
    if (event.key === 'Enter' || event.key === 'Tab') { event.preventDefault(); applySlash(slashItems.value[Math.min(slashIndex.value, count - 1)]); return }
    if (event.key === 'Escape') { event.preventDefault(); slashSuppressed.value = true; return }
  }
  if(event.key==='Enter' && !event.shiftKey && !event.isComposing && event.keyCode!==229) {event.preventDefault();void send()}
}
function onTranscriptScroll() {
  const element=transcript.value
  if(element) followLatest.value=element.scrollHeight-element.scrollTop-element.clientHeight<100
}
async function browse(path = '') {
  if (!executor.value) {error.value='请先选择在线执行器';return}
  const request=++browseRequest
  browserExecutor=executor.value.plugin_id
  browserOpen.value=true;browserBusy.value=true;browserError.value=''
  try {
    const response=await fetch(`/api/agent/workspace?${new URLSearchParams({executor_id:executor.value.plugin_id,path})}`)
    if(!response.ok) throw new Error(await response.text())
    const data=await response.json();if(request===browseRequest) directory.value=data
  } catch(e:any) {if(request===browseRequest) browserError.value=e.message}
  finally {if(request===browseRequest) browserBusy.value=false}
}
async function selectDirectory() {
  if (!executor.value || executor.value.plugin_id!==browserExecutor || browserBusy.value || browserError.value) return
  const chosen = directory.value.path
  if (workspacePick.value) {
    workspacePick.value=false;browserOpen.value=false
    const title = chosen.split(/[\\/]/).filter(Boolean).pop() || 'workspace'
    try { await workspaceAction('create', { path: chosen, title }) } catch (e: any) { error.value = e.message }
    return
  }
  executorId.value=executor.value.plugin_id
  workdir.value=chosen;browserOpen.value=false
}
async function fetchHost() {
  if(!hostOpen.value || !executor.value || hostFetching || document.hidden) return
  hostFetching=true
  const id=executor.value.plugin_id
  try {
    const response=await fetch(`/api/agent/host?executor_id=${encodeURIComponent(id)}`)
    if(!response.ok) throw new Error()
    const usage=await response.json();if(executor.value?.plugin_id===id) hostUsage.value=usage
  } catch {if(executor.value?.plugin_id===id) hostUsage.value=null}
  finally {hostFetching=false}
}
async function compact() {
  if(!session.value || active.value || busy.value || session.value.state==='archived') return
  const target=selectedId.value
  busy.value=true;error.value='';compactNotice.value='正在压缩上下文…'
  try {
    const response=await fetch('/api/agent/compact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:target,model_id:modelId.value})})
    if(!response.ok) throw new Error(await response.text())
    await response.json();await store.fetchAgents()
    compactNotice.value='上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。';if(draft.value.trim()==='/compact') draft.value=''
  } catch(e:any) {error.value=e.message;compactNotice.value=''}
  finally {busy.value=false}
}
const ringStyle=(value:number)=>({background:`conic-gradient(from -90deg, var(--md-primary) ${Math.max(0,Math.min(100,value))}%, var(--md-outline-variant) 0)`})
// Ease a number toward its target so the rings sweep instead of snapping.
function useTween(source: () => number, duration = 700) {
  const out = ref(0)
  let raf = 0, from = 0, to = 0, start = 0
  watch(source, (val) => {
    to = Number(val) || 0
    from = out.value
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { out.value = to; return }
    start = performance.now()
    cancelAnimationFrame(raf)
    const step = (t: number) => { const k = Math.min(1, (t - start) / duration); const e = 1 - Math.pow(1 - k, 3); out.value = from + (to - from) * e; if (k < 1) raf = requestAnimationFrame(step) }
    raf = requestAnimationFrame(step)
  }, { immediate: true })
  onUnmounted(() => cancelAnimationFrame(raf))
  return out
}
const cpuDisplay = useTween(() => Number(hostUsage.value?.cpu_percent) || 0)
const memDisplay = useTween(() => Number(hostUsage.value?.memory_percent) || 0)
const executor = computed(() => executorId.value ? store.agents.find(agent => agent.plugin_id === executorId.value) : store.agents.find(agent => store.isHealthy(agent)))
const gib = (bytes?: number) => bytes === undefined ? '—' : `${(bytes / 1024 ** 3).toFixed(1)} GiB`
// Live browser-automation status from the selected executor (see Agent browser tool).
const browserStatus = ref<{ enabled: boolean; available: boolean; running: boolean; url: string; title: string; tabs: number } | null>(null)
let browserTimer: ReturnType<typeof setInterval> | null = null
let browserFetching = false
async function fetchBrowserStatus() {
  if (browserFetching) return
  browserFetching = true
  try {
    const query = executor.value?.plugin_id ? `?executor_id=${encodeURIComponent(executor.value.plugin_id)}` : ''
    const response = await fetch(`/api/agent/browser${query}`, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    browserStatus.value = await response.json()
  } catch { browserStatus.value = null }
  finally { browserFetching = false }
}
const browserLabel = computed(() => {
  const b = browserStatus.value
  if (!b) return tr('浏览器 · 离线', 'Browser · offline')
  if (!b.enabled) return tr('浏览器 · 未启用', 'Browser · disabled')
  if (b.running) return `${tr('浏览器运行中', 'Browser running')}${b.tabs ? ` · ${b.tabs} ${tr('标签', 'tabs')}` : ''}`
  if (b.available) return tr('浏览器 · 空闲', 'Browser · idle')
  return tr('浏览器 · 不可用', 'Browser · unavailable')
})
const browserTooltip = computed(() => {
  const b = browserStatus.value
  if (!b) return tr('无法获取浏览器状态', 'Browser status unavailable')
  const parts = [b.enabled ? 'enabled' : 'disabled', b.available ? 'available' : 'not installed', b.running ? 'running' : 'stopped']
  if (b.url) parts.push(b.url)
  return parts.join(' · ')
})
// ZCode-style live viewport: a smooth MJPEG stream (CDP screencast) plus a
// toolbar that drives the page (back/forward/reload/goto).
const browserViewOpen = ref(false)
const browserStreamSrc = ref('')
let browserViewTimer: ReturnType<typeof setInterval> | null = null
let browserStreamRetry: ReturnType<typeof setTimeout> | null = null
function refreshBrowserStream() {
  const query = executor.value?.plugin_id ? `?executor_id=${encodeURIComponent(executor.value.plugin_id)}` : ''
  const next = browserViewOpen.value && browserStatus.value?.running ? `/api/agent/browser/stream${query}` : ''
  if (next !== browserStreamSrc.value) browserStreamSrc.value = next
}
const browserTabs = ref<Array<{ id: string; url: string; title: string; active: boolean }>>([])
async function fetchBrowserTabs() {
  if (!browserViewOpen.value || !browserStatus.value?.running) { browserTabs.value = []; return }
  try {
    const body = { action: 'tabs', ...(executor.value?.plugin_id ? { executor_id: executor.value.plugin_id } : {}) }
    const res = await fetch('/api/agent/browser/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(10000) })
    if (res.ok) { const data = await res.json(); browserTabs.value = data.tabs || [] }
  } catch { /* keep the last list */ }
}
function browserNewTab() { void postBrowserAction({ action: 'newtab' }); window.setTimeout(() => void fetchBrowserTabs(), 500) }
function browserActivateTab(id: string) { void postBrowserAction({ action: 'activate', id }) }
function browserCloseTab(id: string) { void postBrowserAction({ action: 'closetab', id }); window.setTimeout(() => void fetchBrowserTabs(), 500) }
function toggleBrowserView() {
  browserViewOpen.value = !browserViewOpen.value
  if (browserViewOpen.value) {
    void fetchBrowserStatus()
    void fetchBrowserTabs()
    refreshBrowserStream()
    if (!browserViewTimer) browserViewTimer = setInterval(() => { void fetchBrowserStatus(); void fetchBrowserTabs() }, 1500)
  } else {
    browserStreamSrc.value = ''
    browserTabs.value = []
    if (browserViewTimer) { clearInterval(browserViewTimer); browserViewTimer = null }
  }
}
function onBrowserStreamError() {
  if (!browserViewOpen.value) return
  browserStreamSrc.value = ''
  if (browserStreamRetry) clearTimeout(browserStreamRetry)
  browserStreamRetry = setTimeout(() => { void fetchBrowserStatus(); refreshBrowserStream() }, 1200)
}
const browserUrlInput = ref('')
const browserUrlFocused = ref(false)
const browserBusyAction = ref(false)
watch(() => browserStatus.value?.url, (url) => { if (url && !browserUrlFocused.value) browserUrlInput.value = url })
watch(browserStatus, () => { if (browserViewOpen.value) refreshBrowserStream() })
async function postBrowserAction(payload: Record<string, any>) {
  browserBusyAction.value = true
  try {
    const body = { ...payload, ...(executor.value?.plugin_id ? { executor_id: executor.value.plugin_id } : {}) }
    const response = await fetch('/api/agent/browser/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) })
    if (!response.ok) throw new Error(await response.text())
    await fetchBrowserStatus()
  } catch (e: any) {
    browserStatus.value = { ...(browserStatus.value || ({} as any)), error: e?.message || 'action failed' }
  } finally { browserBusyAction.value = false }
}
function browserGoto() {
  const url = browserUrlInput.value.trim()
  if (!url) return
  void postBrowserAction({ action: 'goto', url: /^https?:\/\//i.test(url) ? url : `https://${url}` })
}
// --- floating window geometry (drag + resize, persisted) ---
const clampv = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
function loadBrowserPos() {
  try { const p = JSON.parse(localStorage.getItem('0kay.agent.browser.pos') || ''); if (p && Number.isFinite(p.x)) return { x: p.x, y: p.y } } catch { /* default */ }
  return { x: Math.max(16, (window.innerWidth || 1280) - 560), y: Math.max(16, (window.innerHeight || 800) - 520) }
}
function loadBrowserSize() {
  try { const s = JSON.parse(localStorage.getItem('0kay.agent.browser.size') || ''); if (s && Number.isFinite(s.w)) return { w: s.w, h: s.h } } catch { /* default */ }
  return { w: 520, h: 420 }
}
const browserPos = ref(loadBrowserPos())
const browserSize = ref(loadBrowserSize())
const panelStyle = computed(() => ({ translate: `${browserPos.value.x}px ${browserPos.value.y}px`, width: `${browserSize.value.w}px`, height: `${browserSize.value.h}px` }))
let dragState: { dx: number; dy: number } | null = null
let resizeState: { sx: number; sy: number; w: number; h: number } | null = null
function onToolbarDown(event: PointerEvent) {
  if ((event.target as HTMLElement).closest('button,input,form,a')) return
  dragState = { dx: event.clientX - browserPos.value.x, dy: event.clientY - browserPos.value.y }
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragEnd)
}
function onDragMove(event: PointerEvent) {
  if (!dragState) return
  browserPos.value = { x: clampv(event.clientX - dragState.dx, 0, window.innerWidth - 120), y: clampv(event.clientY - dragState.dy, 0, window.innerHeight - 48) }
}
function onDragEnd() { dragState = null; window.removeEventListener('pointermove', onDragMove); window.removeEventListener('pointerup', onDragEnd); try { localStorage.setItem('0kay.agent.browser.pos', JSON.stringify(browserPos.value)) } catch { /* ignore */ } }
function onResizeDown(event: PointerEvent) {
  event.preventDefault(); event.stopPropagation()
  resizeState = { sx: event.clientX, sy: event.clientY, w: browserSize.value.w, h: browserSize.value.h }
  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', onResizeEnd)
}
function onResizeMove(event: PointerEvent) {
  if (!resizeState) return
  browserSize.value = { w: clampv(resizeState.w + (event.clientX - resizeState.sx), 340, 1600), h: clampv(resizeState.h + (event.clientY - resizeState.sy), 260, 1000) }
}
function onResizeEnd() { resizeState = null; window.removeEventListener('pointermove', onResizeMove); window.removeEventListener('pointerup', onResizeEnd); try { localStorage.setItem('0kay.agent.browser.size', JSON.stringify(browserSize.value)) } catch { /* ignore */ } }
// --- manual interaction: map streamed-image pixels to page CSS px, forward via CDP ---
const browserImg = ref<HTMLImageElement | null>(null)
function sendBrowserInput(payload: Record<string, any>) {
  const body = { ...payload, ...(executor.value?.plugin_id ? { executor_id: executor.value.plugin_id } : {}) }
  void fetch('/api/agent/browser/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) }).catch(() => { /* input is best-effort */ })
}
function pageCoords(event: PointerEvent | WheelEvent) {
  const rect = browserImg.value?.getBoundingClientRect()
  const vw = browserStatus.value?.viewportWidth || Math.round(rect?.width || 1280)
  const vh = browserStatus.value?.viewportHeight || Math.round(rect?.height || 720)
  if (!rect || !rect.width || !rect.height) return { x: 0, y: 0 }
  return { x: Math.round((event.clientX - rect.left) / rect.width * vw), y: Math.round((event.clientY - rect.top) / rect.height * vh) }
}
let viewDown = false
let lastMoveAt = 0
function onViewDown(event: PointerEvent) {
  if (event.button !== 0 && event.button !== 2) return
  event.preventDefault()
  ;(event.currentTarget as HTMLElement).focus?.()
  const p = pageCoords(event)
  viewDown = true
  sendBrowserInput({ action: 'mouse', type: 'down', x: p.x, y: p.y, button: event.button === 2 ? 'right' : 'left', buttons: event.button === 2 ? 2 : 1 })
}
function onViewMove(event: PointerEvent) {
  if (!viewDown) return
  const now = performance.now()
  if (now - lastMoveAt < 32) return // coalesce drag moves (~30/s) to cut round trips
  lastMoveAt = now
  const p = pageCoords(event)
  sendBrowserInput({ action: 'mouse', type: 'move', x: p.x, y: p.y, buttons: 1 })
}
function onViewUp(event: PointerEvent) {
  if (!viewDown) return
  viewDown = false
  const p = pageCoords(event)
  sendBrowserInput({ action: 'mouse', type: 'up', x: p.x, y: p.y, button: event.button === 2 ? 'right' : 'left', buttons: 0 })
}
function onViewWheel(event: WheelEvent) {
  event.preventDefault()
  const p = pageCoords(event)
  sendBrowserInput({ action: 'wheel', x: p.x, y: p.y, deltaX: event.deltaX, deltaY: event.deltaY })
}
function onViewKey(event: KeyboardEvent) {
  const key = event.key
  if (key.length === 1 && !event.ctrlKey && !event.metaKey) sendBrowserInput({ action: 'type', text: key })
  else if (key !== 'Shift' && key !== 'Control' && key !== 'Alt' && key !== 'Meta') sendBrowserInput({ action: 'press', key: key === ' ' ? 'space' : key })
  event.preventDefault()
}
// --- generic floating-window geometry (drag + resize, persisted) ---
function makeWindowHandlers(posRef: any, sizeRef: any, posKey: string, sizeKey: string) {
  let drag: { dx: number; dy: number } | null = null
  let rs: { sx: number; sy: number; w: number; h: number } | null = null
  const onMove = (e: PointerEvent) => { if (drag) posRef.value = { x: clampv(e.clientX - drag.dx, 0, window.innerWidth - 120), y: clampv(e.clientY - drag.dy, 0, window.innerHeight - 48) } }
  const onUp = () => { drag = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); try { localStorage.setItem(posKey, JSON.stringify(posRef.value)) } catch { /* ignore */ } }
  const onResizeMove = (e: PointerEvent) => { if (rs) sizeRef.value = { w: clampv(rs.w + (e.clientX - rs.sx), 320, 1600), h: clampv(rs.h + (e.clientY - rs.sy), 240, 1000) } }
  const onResizeUp = () => { rs = null; window.removeEventListener('pointermove', onResizeMove); window.removeEventListener('pointerup', onResizeUp); try { localStorage.setItem(sizeKey, JSON.stringify(sizeRef.value)) } catch { /* ignore */ } }
  return {
    down: (e: PointerEvent) => { if ((e.target as HTMLElement).closest('button,input,form,a')) return; drag = { dx: e.clientX - posRef.value.x, dy: e.clientY - posRef.value.y }; window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp) },
    rdown: (e: PointerEvent) => { e.preventDefault(); e.stopPropagation(); rs = { sx: e.clientX, sy: e.clientY, w: sizeRef.value.w, h: sizeRef.value.h }; window.addEventListener('pointermove', onResizeMove); window.addEventListener('pointerup', onResizeUp) },
  }
}
// --- project tree window ---
interface TreeRow { name: string; path: string; dir: boolean; depth: number; expanded: boolean; loading: boolean }
const treeOpen = ref(false)
const treeRows = ref<TreeRow[]>([])
const treeLoading = ref(false)
const treeError = ref('')
const treeRootPath = ref('')
// --- file editor window (opened when the agent writes/edits a file) ---
interface FileData { path: string; content: string; totalLines: number }
const fileOpen = ref(false)
const fileData = ref<FileData | null>(null)
const fileLoading = ref(false)
const fileError = ref('')
const fileDraft = ref('')
const fileSaving = ref(false)
const fileNotice = ref('')
const fileDirty = computed(() => !!fileData.value && fileDraft.value !== fileData.value.content)
// How the file window renders a given file.
type FileView = 'code' | 'markdown' | 'pdf' | 'docx' | 'pptx' | 'spreadsheet' | 'legacy' | 'text' | 'image' | 'unsupported'
const FILE_VIEW: Record<string, FileView> = {
  md: 'markdown', markdown: 'markdown', mdown: 'markdown', mkd: 'markdown',
  pdf: 'pdf', docx: 'docx', pptx: 'pptx', docm: 'docx', pptm: 'pptx', dotx: 'docx', potx: 'pptx',
  xlsx: 'spreadsheet', xls: 'spreadsheet', xlsm: 'spreadsheet', xlsb: 'spreadsheet', ods: 'spreadsheet',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image', bmp: 'image', avif: 'image', ico: 'image',
  doc: 'legacy', dot: 'legacy', wps: 'legacy', ppt: 'legacy', pot: 'legacy', pps: 'legacy',
}
const FILE_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
  svg: 'image/svg+xml', bmp: 'image/bmp', avif: 'image/avif', ico: 'image/x-icon',
}
const extOf = (path: string) => (path.split('.').pop() || '').toLowerCase()
function viewForFile(path: string): FileView { return FILE_VIEW[extOf(path)] || 'code' }
const fileView = ref<FileView>('code')
const fileBytes = ref<Uint8Array | null>(null)
const fileMime = ref('')
const fileText = ref('')
const fileByteLength = ref(0)
const mdSource = ref(false)
const fileEditable = computed(() => fileView.value === 'code' || (fileView.value === 'markdown' && mdSource.value))
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64 || '')
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}
const humanSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`
const baseName = (path?: string) => (path || '').split(/[\\/]/).pop() || ''
const filePos = ref(loadBrowserPosKey('0kay.agent.file.pos') || { x: Math.max(16, (window.innerWidth || 1280) - 660), y: 88 })
const fileSize = ref(loadBrowserSizeKey('0kay.agent.file.size') || { w: 560, h: 500 })
const fileHandlers = makeWindowHandlers(filePos, fileSize, '0kay.agent.file.pos', '0kay.agent.file.size')
const onFileDown = fileHandlers.down
const onFileResizeDown = fileHandlers.rdown
const filePanelStyle = computed(() => ({ translate: `${filePos.value.x}px ${filePos.value.y}px`, width: `${fileSize.value.w}px`, height: `${fileSize.value.h}px` }))
let fileRequest = 0
async function openFilePreview(path: string, opts: { confirmDiscard?: boolean } = {}) {
  if (!path) return
  if (fileDirty.value) {
    // Never clobber unsaved edits silently. Auto-open just skips; a manual open
    // or reload asks first.
    if (!opts.confirmDiscard) return
    const same = fileData.value?.path === path
    const ok = await confirm({
      title: tr('放弃修改？', 'Discard changes?'),
      message: same ? tr('重新加载会丢失未保存的修改。', 'Reloading will lose unsaved changes.') : tr('打开其他文件会丢失未保存的修改。', 'Opening another file will lose unsaved changes.'),
      confirmLabel: tr('放弃', 'Discard'), danger: true,
    })
    if (!ok) return
  }
  const view = viewForFile(path)
  const request = ++fileRequest
  fileOpen.value = true
  fileLoading.value = true
  fileError.value = ''
  fileView.value = view
  fileBytes.value = null
  fileByteLength.value = 0
  fileText.value = ''
  fileMime.value = FILE_MIME[extOf(path)] || ''
  mdSource.value = false
  try {
    if (view === 'legacy') {
      // Prefer converting to PDF (full layout) via LibreOffice; fall back to
      // plain-text extraction when the executor has no converter.
      const converted = await fetch(`/api/agent/file/convert?${treeQuery({ path, target: 'pdf' })}`, { signal: AbortSignal.timeout(170000) })
      if (converted.ok) {
        const data = await converted.json()
        if (request !== fileRequest) return
        const bytes = base64ToBytes(data.base64 || '')
        fileBytes.value = bytes
        fileByteLength.value = Number(data.size) || bytes.length
        fileMime.value = 'application/pdf'
        fileView.value = 'pdf'
        fileData.value = { path, content: '', totalLines: 0 }
      } else {
        const extracted = await fetch(`/api/agent/file/text?${treeQuery({ path })}`, { signal: AbortSignal.timeout(45000) })
        if (!extracted.ok) throw new Error(await extracted.text())
        const data = await extracted.json()
        if (request !== fileRequest) return
        fileText.value = data.content || ''
        fileView.value = 'text'
        fileData.value = { path, content: '', totalLines: 0 }
      }
    } else if (view === 'code' || view === 'markdown') {
      const res = await fetch(`/api/agent/file?${treeQuery({ path, limit: '4000' })}`, { signal: AbortSignal.timeout(15000) })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (request !== fileRequest) return
      const next: FileData = { path: data.path || path, content: data.content || '', totalLines: data.totalLines || 0 }
      fileData.value = next
      fileDraft.value = next.content
    } else if (view === 'unsupported') {
      fileData.value = { path, content: '', totalLines: 0 }
      fileDraft.value = ''
    } else {
      const res = await fetch(`/api/agent/file/raw?${treeQuery({ path })}`, { signal: AbortSignal.timeout(30000) })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (request !== fileRequest) return
      const bytes = base64ToBytes(data.base64 || '')
      fileBytes.value = bytes
      fileByteLength.value = Number(data.size) || bytes.length
      fileData.value = { path: data.path || path, content: '', totalLines: 0 }
      fileDraft.value = ''
    }
  } catch (e: any) {
    if (request !== fileRequest) return
    fileError.value = e?.message || 'read failed'
    fileData.value = { path, content: '', totalLines: 0 }
    fileDraft.value = ''
  } finally { if (request === fileRequest) fileLoading.value = false }
}
async function saveFile() {
  if (!fileData.value || fileSaving.value || !fileDirty.value) return
  fileSaving.value = true
  fileNotice.value = ''
  try {
    const res = await fetch('/api/agent/file', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: fileData.value.path, content: fileDraft.value, ...(executor.value?.plugin_id ? { executor_id: executor.value.plugin_id } : {}) }),
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) throw new Error(await res.text())
    fileData.value = { ...fileData.value, content: fileDraft.value, totalLines: fileDraft.value.split(/\r?\n/).length }
    fileNotice.value = tr('已保存', 'Saved')
    window.setTimeout(() => { if (fileNotice.value) fileNotice.value = '' }, 2200)
  } catch (e: any) { fileError.value = e?.message || 'save failed' }
  finally { fileSaving.value = false }
}
function onFileEditorKey(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void saveFile() }
}
function reloadFile() { if (fileData.value) void openFilePreview(fileData.value.path, { confirmDiscard: true }) }
async function closeFilePanel() {
  if (fileDirty.value) {
    const ok = await confirm({ title: tr('放弃修改？', 'Discard changes?'), message: tr('有未保存的修改，关闭会丢失。', 'You have unsaved changes. Closing will lose them.'), confirmLabel: tr('放弃', 'Discard'), danger: true })
    if (!ok) return
  }
  fileOpen.value = false
}

// --- terminal console: pick an executor and run shell commands on it ---
interface TermLine { kind: 'cmd' | 'out' | 'err' | 'note'; text: string }
const termOpen = ref(false)
const termPos = ref(loadBrowserPosKey('0kay.agent.term.pos') || { x: Math.max(16, (window.innerWidth || 1280) - 700), y: Math.max(16, (window.innerHeight || 800) - 540) })
const termSize = ref(loadBrowserSizeKey('0kay.agent.term.size') || { w: 640, h: 470 })
const termHandlers = makeWindowHandlers(termPos, termSize, '0kay.agent.term.pos', '0kay.agent.term.size')
const onTermDown = termHandlers.down
const onTermResizeDown = termHandlers.rdown
const termPanelStyle = computed(() => ({ translate: `${termPos.value.x}px ${termPos.value.y}px`, width: `${termSize.value.w}px`, height: `${termSize.value.h}px` }))
const termExecutorId = ref('')
const termCwd = ref('')
const termLines = ref<TermLine[]>([])
const termInput = ref('')
const termBusy = ref(false)
const termBody = ref<HTMLElement | null>(null)
const termHistory = ref<string[]>([])
let termHistoryIndex = 0
const termExecutor = computed(() => store.agents.find(agent => agent.plugin_id === termExecutorId.value) || null)
const executorOptions = computed(() => store.agents.map(agent => ({ value: agent.plugin_id, label: `${agent.host?.hostname || agent.name} · ${agent.plugin_id}`, disabled: !store.isHealthy(agent) })))
function termDefaultExecutor(): string {
  return executorId.value || executor.value?.plugin_id || store.agents.find(agent => store.isHealthy(agent))?.plugin_id || ''
}
function termPush(kind: TermLine['kind'], text: string) { if (text) termLines.value.push({ kind, text }) }
async function termScroll() { await nextTick(); if (termBody.value) termBody.value.scrollTop = termBody.value.scrollHeight }
function toggleTerm() {
  termOpen.value = !termOpen.value
  if (termOpen.value && !termExecutorId.value) termExecutorId.value = termDefaultExecutor()
  if (termOpen.value && !termCwd.value) termCwd.value = termExecutor.value?.host?.workdir || ''
}
function termChangeExecutor(id: string) {
  termExecutorId.value = id
  const agent = store.agents.find(a => a.plugin_id === id)
  termCwd.value = agent?.host?.workdir || ''
  termPush('note', tr(`已切换到 ${agent?.host?.hostname || id}${termCwd.value ? ' · ' + termCwd.value : ''}`, `Switched to ${agent?.host?.hostname || id}${termCwd.value ? ' · ' + termCwd.value : ''}`))
  void termScroll()
}
// Resolve a cd target against the current directory without a shell round-trip,
// so the working directory persists between commands.
function joinPath(base: string, rel: string): string {
  const win = /^[a-zA-Z]:[\\/]|\\\\/.test(base) || base.includes('\\')
  const isAbsolute = win ? /^([a-zA-Z]:[\\/]|\\\\)/.test(rel) : rel.startsWith('/')
  const combined = isAbsolute ? rel : `${base}${base.endsWith('/') || base.endsWith('\\') || !base ? '' : win ? '\\' : '/'}${rel}`
  const stack: string[] = []
  for (const part of combined.replace(/\\/g, '/').split('/')) {
    if (!part || part === '.') continue
    if (part === '..') stack.pop()
    else stack.push(part)
  }
  const out = stack.join(win ? '\\' : '/')
  if (!win) return out.startsWith('/') ? out : '/' + out
  return out
}
async function termRun() {
  if (termBusy.value) return
  const command = termInput.value.trim()
  if (!command) return
  termInput.value = ''
  termHistory.value = [...termHistory.value.filter(item => item !== command), command].slice(-100)
  termHistoryIndex = termHistory.value.length
  termPush('cmd', `${termCwd.value || '~'} $ ${command}`)
  await termScroll()
  const cd = /^cd(?:\s+(.+))?$/i.exec(command)
  if (cd) {
    const target = (cd[1] || '').trim().replace(/^"(.*)"$/, '$1')
    if (!target) { termPush('note', termCwd.value || ''); await termScroll(); return }
    termCwd.value = joinPath(termCwd.value, target)
    termPush('note', termCwd.value)
    await termScroll()
    return
  }
  if (!termExecutorId.value) { termPush('err', tr('请先选择执行器', 'Choose an executor first')); await termScroll(); return }
  termBusy.value = true
  try {
    const res = await fetch('/api/agent/exec', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ executor_id: termExecutorId.value, command, cwd: termCwd.value, timeout: 120000 }),
      signal: AbortSignal.timeout(300000),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    if (data.cwd) termCwd.value = data.cwd
    if (data.stdout) termPush('out', String(data.stdout).replace(/\s+$/, ''))
    if (data.stderr) termPush('err', String(data.stderr).replace(/\s+$/, ''))
    if (data.exitCode !== undefined && data.exitCode !== 0) termPush('note', tr(`退出码 ${data.exitCode}`, `exit code ${data.exitCode}`))
    if (data.truncated) termPush('note', tr('输出已截断', 'output truncated'))
  } catch (e: any) { termPush('err', e?.message || 'command failed') }
  finally { termBusy.value = false; await termScroll() }
}
function termKey(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.keyCode !== 229) { event.preventDefault(); void termRun(); return }
  if (event.key === 'ArrowUp' && termHistory.value.length) {
    event.preventDefault()
    termHistoryIndex = Math.max(0, termHistoryIndex - 1)
    termInput.value = termHistory.value[termHistoryIndex] || ''
    return
  }
  if (event.key === 'ArrowDown' && termHistory.value.length) {
    event.preventDefault()
    termHistoryIndex = Math.min(termHistory.value.length, termHistoryIndex + 1)
    termInput.value = termHistory.value[termHistoryIndex] || ''
  }
}
function termClear() { termLines.value = [] }

const treePos = ref(loadBrowserPosKey('0kay.agent.tree.pos') || { x: Math.max(16, (window.innerWidth || 1280) - 620), y: 64 })
const treeSize = ref(loadBrowserSizeKey('0kay.agent.tree.size') || { w: 340, h: 460 })
const treeHandlers = makeWindowHandlers(treePos, treeSize, '0kay.agent.tree.pos', '0kay.agent.tree.size')
const onTreeDown = treeHandlers.down
const onTreeResizeDown = treeHandlers.rdown
const treePanelStyle = computed(() => ({ translate: `${treePos.value.x}px ${treePos.value.y}px`, width: `${treeSize.value.w}px`, height: `${treeSize.value.h}px` }))
function loadBrowserPosKey(key: string) { try { const p = JSON.parse(localStorage.getItem(key) || ''); if (p && Number.isFinite(p.x)) return { x: p.x, y: p.y } } catch { /* default */ } return null }
function loadBrowserSizeKey(key: string) { try { const s = JSON.parse(localStorage.getItem(key) || ''); if (s && Number.isFinite(s.w)) return { w: s.w, h: s.h } } catch { /* default */ } return null }
function treeQuery(extra: Record<string, string>) {
  const p = new URLSearchParams(extra)
  if (executor.value?.plugin_id) p.set('executor_id', executor.value.plugin_id)
  return p.toString()
}
// Icon tint for the project tree, grouped by broad file category.
const FILE_KINDS: Record<string, string> = {
  code: 'ts,tsx,js,jsx,mjs,cjs,vue,py,go,rs,java,c,cpp,cc,cxx,h,hpp,cs,rb,php,swift,kt,kts,lua,sh,bash,zsh,ps1',
  data: 'json,jsonc,yaml,yml,toml,ini,xml,csv,sql',
  doc: 'md,markdown,txt,rst,log',
  image: 'png,jpg,jpeg,gif,svg,webp,ico,bmp,avif',
  archive: 'zip,tar,gz,tgz,7z,rar,exe,dll,bin,lock,woff,woff2,ttf,otf',
}
function fileKind(name: string, dir: boolean): string {
  if (dir) return 'dir'
  const ext = (name.split('.').pop() || '').toLowerCase()
  for (const [kind, list] of Object.entries(FILE_KINDS)) if (list.split(',').includes(ext)) return kind
  return 'file'
}
function treeRootPathFor(): string { return workdir.value || executor.value?.host?.workdir || '' }
function toggleTree() { treeOpen.value = !treeOpen.value; if (treeOpen.value && !treeRows.value.length) void treeReload(treeRootPathFor()) }
async function loadTreeDir(dirPath: string, depth: number): Promise<TreeRow[]> {
  const res = await fetch(`/api/agent/tree?${treeQuery({ path: dirPath })}`, { signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return (data.entries || []).map((e: any) => ({ name: e.name, path: e.path, dir: !!e.dir, depth, expanded: false, loading: false }))
}
async function treeReload(dirPath = '') {
  treeLoading.value = true; treeError.value = ''
  try { treeRootPath.value = dirPath; treeRows.value = await loadTreeDir(dirPath, 0) }
  catch (e: any) { treeError.value = e?.message || 'load failed' }
  finally { treeLoading.value = false }
}
let treeRefreshTimer: ReturnType<typeof setTimeout> | null = null
// The agent writes files under the workspace; reflect them without making the
// user close and reopen the tree.
function refreshTreeSoon() {
  if (!treeOpen.value) return
  if (treeRefreshTimer) clearTimeout(treeRefreshTimer)
  treeRefreshTimer = setTimeout(() => { treeRefreshTimer = null; void treeReload(treeRootPathFor()) }, 800)
}
async function treeToggle(row: TreeRow) {
  const idx = treeRows.value.indexOf(row)
  if (idx < 0) return
  if (!row.dir) { void treePreview(row); return }
  if (row.expanded) {
    row.expanded = false
    let i = idx + 1
    while (i < treeRows.value.length && treeRows.value[i].depth > row.depth) treeRows.value.splice(i, 1)
    return
  }
  row.loading = true
  try {
    const children = await loadTreeDir(row.path, row.depth + 1)
    row.expanded = true
    treeRows.value.splice(idx + 1, 0, ...children)
  } catch (e: any) { treeError.value = e?.message || 'load failed' }
  finally { row.loading = false }
}
function treePreview(row: TreeRow) { void openFilePreview(row.path, { confirmDiscard: true }) }
// The tree must follow the selected workspace; otherwise it falls back to the
// executor's process cwd, which is why it did not show the chosen project.
watch([workdir, executorId], () => { if (treeOpen.value) void treeReload(treeRootPathFor()) })
// --- usage window ---
const usageOpen = ref(false)
const usagePos = ref(loadBrowserPosKey('0kay.agent.usage.pos') || { x: Math.max(16, (window.innerWidth || 1280) - 336), y: 64 })
const usageSize = ref(loadBrowserSizeKey('0kay.agent.usage.size') || { w: 300, h: 300 })
const usageHandlers = makeWindowHandlers(usagePos, usageSize, '0kay.agent.usage.pos', '0kay.agent.usage.size')
const onUsageDown = usageHandlers.down
const onUsageResizeDown = usageHandlers.rdown
const usagePanelStyle = computed(() => ({ translate: `${usagePos.value.x}px ${usagePos.value.y}px`, width: `${usageSize.value.w}px`, height: `${usageSize.value.h}px` }))
function toggleUsage() { usageOpen.value = !usageOpen.value; if (usageOpen.value) void fetchContextUsage() }
// --- host window ---
const hostPos = ref(loadBrowserPosKey('0kay.agent.host.pos') || { x: Math.max(16, (window.innerWidth || 1280) - 336), y: 392 })
const hostSize = ref(loadBrowserSizeKey('0kay.agent.host.size') || { w: 360, h: 360 })
const hostHandlers = makeWindowHandlers(hostPos, hostSize, '0kay.agent.host.pos', '0kay.agent.host.size')
const onHostDown = hostHandlers.down
const onHostResizeDown = hostHandlers.rdown
const hostPanelStyle = computed(() => ({ translate: `${hostPos.value.x}px ${hostPos.value.y}px`, width: `${hostSize.value.w}px`, height: `${hostSize.value.h}px` }))
function loadOptions() {
  try {
    const saved = JSON.parse(localStorage.getItem(`0kay.agent.editor:${selectedId.value}`) || localStorage.getItem(`0kay.agent.options:${selectedId.value}`) || '{}')
    executorId.value = saved.executor_id || ''; workdir.value = saved.workdir || ''
    intensity.value = savedIntensity(saved.thinking_intensity); modelId.value = saved.model_id || 'MOCR'
    permissionMode.value=saved.permission_mode==='full_access'?'full_access':'normal'
    draft.value=saved.draft || '';mode.value=saved.mode || 'general'
  } catch { executorId.value='';workdir.value='';intensity.value=50;modelId.value='MOCR';draft.value='';mode.value='general' }
}
const providerNames = ref<Record<string, string>>({})
function modelLabel(model: { id: string; provider: string; provider_id?: string; provider_name?: string }) {
  const name = model.provider_name
    || (model.provider_id ? providerNames.value[model.provider_id] : '')
    || model.provider_id || model.provider
  return `${name}/${model.id}`
}
async function fetchModels() {
  try {
    const response = await fetch('/api/models')
    if (!response.ok) throw new Error(`模型目录 HTTP ${response.status}`)
    models.value = (await response.json()).models || []
  } catch (e: any) { error.value = e.message }
  try {
    const response = await fetch('/api/providers')
    if (response.ok) {
      const providers: any[] = (await response.json()).providers || []
      const names: Record<string, string> = {}
      // Key by provider id, not provider type: several providers can share a
      // type (e.g. three "custom" endpoints), and keying by type made the last
      // name win for every one of them.
      for (const provider of providers) if (provider.name && provider.id) names[provider.id] = provider.name
      providerNames.value = names
    }
  } catch { /* provider names are optional */ }
}
function options() { const level=intensity.value===0?'off':intensity.value<35?'low':intensity.value<62.5?'medium':intensity.value<87.5?'high':'max';return { executor_id: executorId.value, workdir: workdir.value.trim(), thinking_intensity: level, model_id: modelId.value, permission_mode:permissionMode.value, language:locale.value } }
const busy = ref(false)
const error = ref('')
const showArchived = ref(false)
const subStack = ref<TaskRow[]>([])
const activeSub = computed<TaskRow | null>(() => subStack.value[subStack.value.length - 1] || null)
const transcript = ref<HTMLElement | null>(null)
const session = computed(() => store.sessions.find(item => item.session_id === selectedId.value))
const isLife = (item: TaskRow) => item.caller_id !== 'webui'
const sessions = computed(() => store.sessions.filter(item =>
  (showArchived.value ? item.state === 'archived' : item.state !== 'archived') &&
  (source.value === 'all' || (source.value === 'life' ? isLife(item) : !isLife(item))) &&
  (item.prompt || '').toLowerCase().includes(search.value.toLowerCase())))

// --- dsh-style workspaces: sessions grouped under registered directories ---
interface WorkspaceRow { id: string; title: string; path: string; createdAt: string; updatedAt: string; sessionIds: string[]; exists?: boolean }
const workspaces = ref<WorkspaceRow[]>([])
const collapsed = ref<Set<string>>(new Set(JSON.parse(localStorage.getItem('0kay.agent.ws.collapsed') || '[]')))
const expandedGroups = ref<Set<string>>(new Set())
const workspacePick = ref(false)
function workspaceQuery(): string { return executor.value?.plugin_id ? `executor_id=${encodeURIComponent(executor.value.plugin_id)}` : '' }
async function fetchWorkspaces() {
  try {
    const query = workspaceQuery()
    const response = await fetch(`/api/agent/workspaces${query ? `?${query}` : ''}`)
    if (!response.ok) return
    const data = await response.json()
    workspaces.value = Array.isArray(data?.workspaces) ? data.workspaces : []
  } catch { /* offline */ }
}
async function workspaceAction(action: string, payload: Record<string, unknown> = {}) {
  const response = await fetch('/api/agent/workspaces', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, action, ...(executor.value ? { executor_id: executor.value.plugin_id } : {}) }),
  })
  if (!response.ok) throw new Error(await response.text())
  await fetchWorkspaces()
  return response.json()
}
const orderMode = ref<'manual' | 'recent'>(localStorage.getItem('0kay.agent.ws.order') === 'recent' ? 'recent' : 'manual')
function setOrderMode(mode: 'manual' | 'recent') { orderMode.value = mode; localStorage.setItem('0kay.agent.ws.order', mode) }
function sessionActivity(item: TaskRow): number {
  let latest = Date.parse(item.started_at || '') || 0
  for (const task of store.tasks) if (task.session_id === item.session_id && task.started_at) latest = Math.max(latest, Date.parse(task.started_at) || 0)
  return latest
}
const arrange = (list: TaskRow[]) => orderMode.value === 'recent' ? [...list].sort((a, b) => sessionActivity(b) - sessionActivity(a)) : list
const sessionGroups = computed(() => {
  const groups = workspaces.value.map(workspace => ({
    id: workspace.id, title: workspace.title, path: workspace.path, exists: workspace.exists !== false,
    sessions: arrange(sessions.value.filter(item => (workspace.sessionIds || []).includes(item.session_id || ''))),
  }))
  const claimed = new Set(workspaces.value.flatMap(workspace => workspace.sessionIds || []))
  return { groups, ungrouped: arrange(sessions.value.filter(item => !claimed.has(item.session_id || ''))) }
})
function toggleGroup(id: string) {
  const next = new Set(collapsed.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  collapsed.value = next
  localStorage.setItem('0kay.agent.ws.collapsed', JSON.stringify([...next]))
}
const isExpanded = (id: string) => expandedGroups.value.has(id)
function toggleExpanded(id: string) { const next = new Set(expandedGroups.value); if (next.has(id)) next.delete(id); else next.add(id); expandedGroups.value = next }
const visibleSessions = (group: { id: string; sessions: TaskRow[] }) => isExpanded(group.id) ? group.sessions : group.sessions.slice(0, 5)
async function addWorkspace() {
  if (!executor.value) { error.value = tr('请先选择在线执行器', 'Select an online executor first'); return }
  workspacePick.value = true
  await browse('')
}
async function createIn(workspaceId: string) {
  const workspace = workspaces.value.find(row => row.id === workspaceId)
  if (workspace) { workdir.value = workspace.path; executorId.value = executor.value?.plugin_id || executorId.value }
  await create()
}
async function renameWorkspace(workspace: WorkspaceRow) {
  const title = window.prompt(tr('工作区名称', 'Workspace name'), workspace.title)
  if (title == null || !title.trim()) return
  try { await workspaceAction('rename', { id: workspace.id, to: title.trim() }) } catch (e: any) { error.value = e.message }
}
async function deleteWorkspace(workspace: WorkspaceRow) {
  const ok = await confirm({
    title: tr('移除工作区', 'Remove workspace'),
    message: tr('只移除登记，目录与会话都会保留；其中的会话进入未分组。', 'Only the registration is removed; the directory and sessions are kept. Its sessions move to Ungrouped.'),
    confirmLabel: tr('移除', 'Remove'), danger: true,
  })
  if (!ok) return
  try { await workspaceAction('delete', { id: workspace.id }) } catch (e: any) { error.value = e.message }
}
let dragWorkspace = ''
function onGroupDragStart(id: string) { dragWorkspace = id }
async function onGroupDrop(targetId: string) {
  if (!dragWorkspace || dragWorkspace === targetId) return
  try { await workspaceAction('reorder', { id: dragWorkspace, before: targetId }) } catch (e: any) { error.value = e.message }
  dragWorkspace = ''
}
let workspaceTimer: ReturnType<typeof setInterval> | null = null
watch([executor, () => store.sessions.length], () => void fetchWorkspaces())

// --- debounced content search (title matches are instant; content adds snippets) ---
const contentMatches = ref<Array<{ session_id: string; title: string; snippet: string }>>([])
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  const query = String(value || '').trim()
  if (!query) { contentMatches.value = []; return }
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/agent/sessions/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) return
      const data = await response.json()
      contentMatches.value = Array.isArray(data?.matches) ? data.matches : []
    } catch { /* offline */ }
  }, 250)
})
const searchResults = computed(() => {
  const rows = [...sessions.value]
  const seen = new Set(rows.map(row => row.session_id))
  for (const match of contentMatches.value) {
    if (seen.has(match.session_id)) continue
    const row = store.sessions.find(item => item.session_id === match.session_id)
    if (row) { rows.push(row); seen.add(match.session_id) }
  }
  return rows
})
const snippetFor = (id?: string) => contentMatches.value.find(match => match.session_id === id)?.snippet || ''

// --- session fork / cross-workspace move ---
async function forkSession(item: TaskRow) {
  if (!item.session_id || busy.value) return
  busy.value = true; error.value = ''
  try {
    const response = await fetch('/api/agent/sessions/fork', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: item.session_id, ...(executor.value ? { executor_id: executor.value.plugin_id } : {}) }) })
    if (!response.ok) throw new Error(await response.text())
    const data = await response.json()
    await store.fetchAgents()
    if (data?.session_id) choose(data.session_id)
  } catch (e: any) { error.value = e.message }
  finally { busy.value = false }
}
async function moveSessionTo(item: TaskRow, workspaceId: string) {
  if (!item.session_id || !workspaceId) return
  try { await workspaceAction('move-session', { session: item.session_id, to: workspaceId }) } catch (e: any) { error.value = e.message }
}
function onMoveChange(item: TaskRow, event: Event) { const value = (event.target as HTMLSelectElement).value; if (value) void moveSessionTo(item, value) }
const turns = computed(() => store.tasks.filter(item => item.kind === 'agent' && item.session_id === selectedId.value)
  .sort((a,b) => (a.started_at || '').localeCompare(b.started_at || '') || a.task_id.localeCompare(b.task_id)))
const active = computed(() => store.tasks.find(item => item.session_id===selectedId.value && ['agent','compact'].includes(item.kind || '') && ['running','pending'].includes(item.state)))
const runningTasks = computed(() => store.tasks.filter(item => item.session_id === selectedId.value && ['running', 'pending'].includes(item.state) && ['agent', 'compact', 'tool', 'subagent'].includes(item.kind || '')))
const todos = computed<Array<{ content: string; status: string }>>(() => {
  const rows = store.tasks
    .filter(item => item.session_id === selectedId.value && item.kind === 'tool' && (item.prompt || '').trim() === 'todowrite')
    .sort((a, b) => (a.started_at || '').localeCompare(b.started_at || '') || a.task_id.localeCompare(b.task_id))
  const last = rows[rows.length - 1]
  if (!last) return []
  const parse = (raw?: string): any[] => { try { const value = JSON.parse(raw || ''); return Array.isArray(value?.todos) ? value.todos : [] } catch { return [] } }
  const list = parse(last.result).length ? parse(last.result) : parse(last.args)
  return list.filter((item: any) => item && typeof item.content === 'string' && item.status !== 'cancelled')
})
const todoDone = computed(() => todos.value.filter(item => item.status === 'completed').length)
// A finished todo list has served its purpose: collapse it automatically, and
// re-open when a new unfinished list arrives.
const todoOpen = ref(true)
watch([todos, todoDone], () => {
  todoOpen.value = !(todos.value.length > 0 && todoDone.value === todos.value.length)
})

// Context usage indicator (hollow ring + hover breakdown).
const contextUsage = ref<{ tokens?: number; window?: number; breakdown?: Record<string, number> } | null>(null)
async function fetchContextUsage() {
  if (!selectedId.value) { contextUsage.value = null; return }
  try {
    const response = await fetch(`/api/agent/context?session_id=${encodeURIComponent(selectedId.value)}&model_id=${encodeURIComponent(modelId.value)}`)
    if (response.ok) contextUsage.value = await response.json()
  } catch { /* offline */ }
}
let ctxTimer: ReturnType<typeof setTimeout> | null = null
function scheduleContextUsage() { if (ctxTimer) clearTimeout(ctxTimer); ctxTimer = setTimeout(() => void fetchContextUsage(), 800) }
const fmtK = (value?: number) => `${Math.round(((value || 0) / 1000) * 10) / 10}K`
const ctxRows = computed(() => {
  const breakdown = contextUsage.value?.breakdown || {}
  const k = (value: unknown) => fmtK(Number(value) || 0)
  return [
    { key: 'system', label: tr('系统提示', 'System Prompt'), value: k(breakdown.system) },
    { key: 'tools', label: tr('工具', 'Tools'), value: k(breakdown.tools) },
    { key: 'conversation', label: tr('对话', 'Conversation'), value: k(breakdown.conversation) },
    { key: 'mcp', label: 'MCP', value: k(breakdown.mcp) },
    { key: 'skills', label: tr('技能', 'Skills'), value: k(breakdown.skills) },
  ]
})
const contextSummary = computed(() => {
  const done = store.tasks.filter(item => item.kind === 'compact' && item.session_id === selectedId.value && item.state === 'done' && (item.result || '').trim())
  return done.length ? done.reduce((latest, item) => (item.started_at || '') >= (latest.started_at || '') ? item : latest) : null
})
const stateName = (value: string) => (locale.value==='en'?{pending:'Queued',running:'Running',done:'Completed',failed:'Failed',cancelled:'Stopped'}:{ pending:'等待执行', running:'执行中', done:'完成', failed:'失败', cancelled:'已停止' })[value] || value
const time = (value?: string) => value ? new Date(value).toLocaleString() : ''
// The model that actually produced a think step, from mocr's report (a fallback
// model may differ from the requested one).
function modelInfo(step: TaskRow) {
  let actual = '', requested = '', reason = ''
  try {
    if (step.args) { const parsed = JSON.parse(step.args); actual = String(parsed.model || ''); requested = String(parsed.requested || ''); reason = String(parsed.fallback || '') }
  } catch { /* args is not model metadata */ }
  return { actual, requested, reason, fellBack: !!actual && !!requested && actual !== requested }
}
function modelAnnotation(step: TaskRow): string {
  const info = modelInfo(step)
  if (info.fellBack) return tr(`${info.requested} 不可用，已回退 ${info.actual}`, `${info.requested} unavailable · fell back to ${info.actual}`)
  return info.actual || String(step.prompt || '')
}
function modelReason(step: TaskRow): string { return modelInfo(step).reason }
function steps(turn: TaskRow) {
  return store.tasks.filter(item => item.task_id !== turn.task_id && item.session_id === turn.session_id &&
    item.parent_id === turn.task_id)
    .sort((a,b) => (a.started_at || '').localeCompare(b.started_at || '') || a.task_id.localeCompare(b.task_id))
}
function childSteps(parent: TaskRow | null) {
  if (!parent) return []
  return store.tasks.filter(item => item.task_id !== parent.task_id && item.session_id === parent.session_id &&
    item.parent_id === parent.task_id)
    .sort((a,b) => (a.started_at || '').localeCompare(b.started_at || '') || a.task_id.localeCompare(b.task_id))
}
function allSteps(turn: TaskRow): TaskRow[] {
  const out: TaskRow[] = []
  for (const step of steps(turn)) {
    out.push(step)
    if (step.kind === 'subagent') out.push(...allSteps({ ...step, session_id: turn.session_id } as TaskRow))
  }
  return out
}
function openSub(step: TaskRow) { subStack.value = [...subStack.value, step] }
function closeSub() { subStack.value = subStack.value.slice(0, -1) }
function clearSubs() { subStack.value = [] }
function subFinal(step: TaskRow | null): string {
  if (!step?.result) return ''
  let text = step.result
  try {
    const parsed = JSON.parse(text)
    if (typeof parsed === 'string') text = parsed
    else if (parsed && typeof parsed.result === 'string') text = parsed.result
  } catch { /* plain-text result */ }
  if (!text.trim()) return ''
  if (childSteps(step).some(child => child.kind === 'think' && (child.result || '').trim() === text.trim())) return ''
  return text
}
function friendlyError(message?: string) {
  if (!message) return ''
  if (/User denied permission for task/i.test(message)) return tr('你拒绝了这次子 Agent 调用', 'You denied this sub-agent call')
  if (/User denied permission for (\S+)/i.test(message)) return tr(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`)
  if (/Permission request expired/i.test(message)) return tr('权限请求已超时', 'Permission request expired')
  return message
}
function stepLabel(step: TaskRow) {
  if (step.kind === 'subagent') return tr('子 Agent', 'Subagent')
  if (step.kind === 'tool') return tr('工具', 'Tool')
  if (step.kind === 'think') return tr('模型', 'Model')
  return step.kind || tr('步骤', 'Step')
}
function subChildCount(step: TaskRow) { return childSteps(step).length }
function hasFinalReply(turn: TaskRow) {
  return allSteps(turn).some(step => step.kind === 'think' && step.result?.trim() === turn.result?.trim())
}
async function manage(action: 'archive' | 'restore' | 'delete') {
  if (!session.value || busy.value) return
  if (action === 'delete') {
    const ok = await confirm({
      title: tr('删除会话', 'Delete session'),
      message: tr('永久删除此会话及其中的消息和工具记录？', 'Permanently delete this session and its messages and tool records?'),
      confirmLabel: tr('永久删除', 'Delete'),
      danger: true,
    })
    if (!ok) return
  }
  const target=selectedId.value
  busy.value=true
  try {
    rememberEditor(target)
    await store.manageSession(target, action)
    if(action==='delete') {localStorage.removeItem(`0kay.agent.editor:${target}`);localStorage.removeItem(`0kay.agent.options:${target}`)}
    if (action !== 'restore') { selectedId.value = ''; localStorage.removeItem('0kay.agent.selected') }
    else showArchived.value = false
  } catch (e: any) { error.value = e.message }
  finally {busy.value=false}
}
function choose(id: string) { if(busy.value)return;rememberEditor();selectedId.value = id; localStorage.setItem('0kay.agent.selected', id) }
async function create() {
  busy.value = true; error.value = ''
  try { const id=await store.createSession('新对话');rememberEditor();selectedId.value=id;localStorage.setItem('0kay.agent.selected',id);showArchived.value=false } catch (e: any) { error.value = e.message }
  finally { busy.value = false }
}
async function send() {
  if(draft.value.trim()==='/compact') {await compact();return}
  const hasAttachments = attachments.value.length > 0
  if ((!draft.value.trim() && !hasAttachments) || busy.value || active.value || session.value?.state === 'archived') return
  busy.value = true; error.value = ''
  try {
    const requestOptions: Record<string, any> = options()
    const message = draft.value.trim() || tr('请查看我上传的附件。','Please review the attached files.')
    const agentMode=mode.value
    if (!session.value) {
      const id=await store.createSession(message.slice(0,60))
      localStorage.setItem(`0kay.agent.editor:${id}`,JSON.stringify({...requestOptions,draft:message,mode:agentMode}))
      selectedId.value=id;localStorage.setItem('0kay.agent.selected',id)
    }
    rememberEditor()
    if (hasAttachments) requestOptions.attachments = attachments.value.map(item => ({ ...item }))
    await store.sendTask(selectedId.value, message, agentMode, requestOptions)
    draft.value = ''
    attachments.value = []
    attachError.value = ''
    rememberEditor();followLatest.value=true;await scrollBottom()
  } catch (e: any) { error.value = e.message }
  finally { busy.value = false }
}
async function stop() {
  if (!active.value || active.value.kind!=='agent') return
  try { await store.cancelTask(active.value.task_id) } catch (e: any) { error.value = e.message }
}
async function stopAll() {
  const ids = runningTasks.value.map(item => item.task_id)
  if (!ids.length) return
  const results = await Promise.allSettled(ids.map(id => store.cancelTask(id)))
  const failed = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined
  if (failed) error.value = failed.reason?.message || String(failed.reason)
}
async function scrollBottom() { await nextTick(); if(followLatest.value) transcript.value?.scrollTo({top:transcript.value.scrollHeight,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}) }

// --- auto-open windows while the agent works in the selected session ---
// Browser tool use pops the live viewport; write/edit/apply_patch pops the file
// preview. Existing steps are seeded on load/switch so nothing opens retroactively.
const handledSteps = new Set<string>()
let seededSession = ''
// Wall-clock when the current session was seeded: steps older than this are
// history the user just navigated to, not live work, so never auto-open for them.
let seededAt = 0
function parseStepJson(raw?: string): any { if (!raw) return null; try { return JSON.parse(raw) } catch { return null } }
function absolutePath(value: string): string {
  if (!value) return ''
  if (/^([a-zA-Z]:[\\/]|\\\\|\/)/.test(value)) return value
  const base = workdir.value || executor.value?.host?.workdir || ''
  return base ? `${base.replace(/[\\/]+$/, '')}/${value.replace(/^[\\/]+/, '')}` : ''
}
function editedPaths(step: TaskRow): string[] {
  const args = parseStepJson(step.args) || {}
  const raw = parseStepJson(step.result)
  const inner = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw.data ?? raw) : {}
  const found: string[] = []
  const add = (value: unknown) => { if (typeof value === 'string' && value) found.push(value) }
  add(inner?.path)
  add(inner?.file)
  if (Array.isArray(inner?.files)) inner.files.forEach((file: any) => add(typeof file === 'string' ? file : file?.path))
  add(args?.filePath)
  if (Array.isArray(args?.patches)) args.patches.forEach((patch: any) => add(patch?.filePath))
  if (Array.isArray(inner?.patches)) inner.patches.forEach((patch: any) => add(patch?.filePath))
  return found
}
function ensureBrowserView() {
  if (!browserViewOpen.value) toggleBrowserView()
  else { void fetchBrowserStatus(); void fetchBrowserTabs(); refreshBrowserStream() }
}
function considerStep(step: TaskRow) {
  const tool = (step.prompt || '').trim()
  if (tool === 'browser') {
    const action = String((parseStepJson(step.args) || {})?.action || '').toLowerCase()
    if (!action || ['status', 'frame'].includes(action)) { handledSteps.add(step.task_id); return }
    ensureBrowserView()
    handledSteps.add(step.task_id)
    return
  }
  // File-producing tools: open the artifact for the user as soon as it exists.
  if (['write', 'edit', 'apply_patch', 'document', 'slides', 'research'].includes(tool)) {
    const path = editedPaths(step).map(absolutePath).find(Boolean)
    if (path) { handledSteps.add(step.task_id); void openFilePreview(path) }
    else if (['done', 'failed', 'cancelled'].includes(step.state)) handledSteps.add(step.task_id)
    refreshTreeSoon()
    return
  }
  handledSteps.add(step.task_id)
}
watch([selectedId, () => store.tasks.map(item => `${item.task_id}:${item.session_id}:${item.state}:${item.result?.length || 0}`).join('|')], () => {
  const sid = selectedId.value
  if (!sid) return
  if (seededSession !== sid) {
    seededSession = sid
    seededAt = Date.now()
    handledSteps.clear()
    for (const step of store.tasks) if (step.session_id === sid) handledSteps.add(step.task_id)
    return
  }
  for (const step of store.tasks) {
    if (step.kind !== 'tool' || step.session_id !== sid || handledSteps.has(step.task_id)) continue
    // Older turns loaded on demand must not retroactively pop windows.
    if (Date.parse(step.started_at || '') <= seededAt) { handledSteps.add(step.task_id); continue }
    considerStep(step)
  }
})
// A store reset (Core restart) clears the client cache; re-seed so the refreshed
// rows are treated as history rather than live work.
watch(() => store.resetToken, () => { seededSession = ''; handledSteps.clear() })
watch(() => store.tasks.filter(item=>item.session_id===selectedId.value).map(item => `${item.task_id}:${item.state}:${item.result?.length}`).join('|'), scrollBottom)
watch(() => store.tasks.filter(item => item.session_id === selectedId.value).map(item => `${item.task_id}:${item.state}:${item.result?.length}`).join('|'), scheduleContextUsage)
watch(selectedId, () => { void fetchContextUsage() })
watch(modelId, () => { void fetchContextUsage() })
onMounted(() => { void fetchContextUsage() })
watch(selectedId, () => { followLatest.value=true;void scrollBottom();closeBrowser();clearSubs();error.value='' })
watch(selectedId, loadOptions)
watch(executorId,()=>{hostUsage.value=null;workdir.value='';closeBrowser();fetchHost();void fetchBrowserStatus()},{flush:'sync'})
watch(hostOpen,fetchHost)
watch(selectedId,()=>{compactNotice.value=''})
// Load the selected session's turns on demand, and re-load whenever the store
// resets (Core restart / new SSE cursor) because that clears the client cache.
watch([selectedId, () => store.resetToken], ([id]) => { if (id) void store.ensureSessionTurns(id) }, { immediate: true })
onMounted(() => { syncLocale(); store.connect(); loadOptions(); fetchModels();void fetchWorkspaces();hostTimer=setInterval(fetchHost,5000);workspaceTimer=setInterval(()=>{if(!document.hidden)void fetchWorkspaces()},5000);void fetchBrowserStatus();browserTimer=setInterval(fetchBrowserStatus,5000);window.addEventListener('keydown',onEscape) })
onUnmounted(() => {rememberEditor();closeBrowser();store.disconnect();if(hostTimer) clearInterval(hostTimer);if(workspaceTimer) clearInterval(workspaceTimer);if(browserTimer) clearInterval(browserTimer);if(browserViewTimer) clearInterval(browserViewTimer);if(browserStreamRetry) clearTimeout(browserStreamRetry);window.removeEventListener('keydown',onEscape)})
</script>

<template>
  <main class="workspace">
    <aside class="sessions">
      <header><h1>Agent</h1><button @click="create" :disabled="busy" :title="tr('新建会话','New session')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> {{ tr('新对话','New chat') }}</button></header>
      <div class="connection"><i :class="{online:store.onlineCount>0}" />{{ store.onlineCount }} {{ tr('个执行器在线','executors online') }} <button @click="store.fetchAgents()" :title="tr('刷新','Refresh')" aria-label="refresh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
      <input v-model="search" :placeholder="tr('搜索会话…','Search sessions…')" :aria-label="tr('搜索会话','Search sessions')" />
      <nav class="filter-bar"><button v-for="filter in [{id:'all',label:tr('全部','All')},{id:'life',label:tr('LIFE 发起','From LIFE')},{id:'user',label:tr('我的对话','My chats')}]" :key="filter.id" :class="{chosen:source===filter.id}" @click="source=filter.id">{{ filter.label }}</button></nav>
      <div class="sidebar-toggles">
        <label class="muted"><input v-model="showArchived" type="checkbox" /> {{ tr('显示已归档会话','Show archived sessions') }}</label>
        <nav class="order-toggle"><button type="button" :class="{chosen:orderMode==='manual'}" @click="setOrderMode('manual')">{{ tr('手动','Manual') }}</button><button type="button" :class="{chosen:orderMode==='recent'}" @click="setOrderMode('recent')">{{ tr('最近','Recent') }}</button></nav>
      </div>
      <div class="session-list">
        <section v-if="search.trim()" class="ws-group">
          <header class="ws-head static"><span class="ws-title">{{ tr('搜索结果','Search results') }}</span><span class="ws-count">{{ searchResults.length }}</span></header>
          <div class="ws-sessions">
            <div v-for="item in searchResults" :key="item.task_id" class="session-row" :class="{selected:selectedId===item.session_id}">
              <button class="session-card" :disabled="busy" @click="choose(item.session_id!)">
                <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : tr('你 ↔ Agent','You ↔ Agent') }}</span>
                <strong>{{ item.prompt || tr('未命名会话','Untitled session') }}</strong>
                <small>{{ snippetFor(item.session_id) || time(item.started_at) }}</small>
              </button>
              <span class="row-actions">
                <button type="button" :disabled="busy" :title="tr('Fork 会话','Fork session')" @click.stop="forkSession(item)">⑂</button>
                <select :disabled="busy || !workspaces.length" :title="tr('移动到工作区','Move to workspace')" @click.stop @change="onMoveChange(item, $event)"><option value="">↪</option><option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.title }}</option></select>
              </span>
            </div>
            <p v-if="!searchResults.length" class="muted ws-empty">{{ tr('无匹配会话','No matches') }}</p>
          </div>
        </section>

        <template v-else>
          <section v-for="group in sessionGroups.groups" :key="group.id" class="ws-group" :class="{collapsed:collapsed.has(group.id)}" @dragover.prevent @drop="onGroupDrop(group.id)">
            <header class="ws-head" draggable="true" @dragstart="onGroupDragStart(group.id)">
              <button type="button" class="ws-toggle" @click="toggleGroup(group.id)" :aria-expanded="!collapsed.has(group.id)" :title="collapsed.has(group.id) ? tr('展开','Expand') : tr('折叠','Collapse')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <span class="ws-title" :title="group.path">{{ group.title }}<i v-if="!group.exists" class="ws-missing" :title="tr('目录不存在','Missing directory')">!</i></span>
              <span class="ws-count">{{ group.sessions.length }}</span>
              <span class="ws-actions">
                <button type="button" @click.stop="createIn(group.id)" :disabled="busy" :title="tr('在此工作区新建会话','New session here')">+</button>
                <button type="button" @click.stop="renameWorkspace(group)" :title="tr('重命名','Rename')">✎</button>
                <button type="button" class="danger" @click.stop="deleteWorkspace(group)" :title="tr('移除工作区','Remove workspace')">×</button>
              </span>
            </header>
            <div class="ws-sessions">
              <div v-for="item in visibleSessions(group)" :key="item.task_id" class="session-row" :class="{selected:selectedId===item.session_id}">
                <button class="session-card" :disabled="busy" @click="choose(item.session_id!)">
                  <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : tr('你 ↔ Agent','You ↔ Agent') }}</span>
                  <strong>{{ item.prompt || tr('未命名会话','Untitled session') }}</strong><small>{{ time(item.started_at) }}</small>
                </button>
                <span class="row-actions">
                  <button type="button" :disabled="busy" :title="tr('Fork 会话','Fork session')" @click.stop="forkSession(item)">⑂</button>
                  <select :disabled="busy || !workspaces.length" :title="tr('移动到工作区','Move to workspace')" @click.stop @change="onMoveChange(item, $event)"><option value="">↪</option><option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.title }}</option></select>
                </span>
              </div>
              <button v-if="group.sessions.length > 5" class="ws-more" @click="toggleExpanded(group.id)">{{ isExpanded(group.id) ? tr('收起','Show less') : tr('展开其余','Show more') + ` (${group.sessions.length - 5})` }}</button>
              <p v-if="!group.sessions.length" class="muted ws-empty">{{ tr('暂无会话','No sessions') }}</p>
            </div>
          </section>

          <section v-if="sessionGroups.ungrouped.length" class="ws-group">
            <header class="ws-head static"><span class="ws-title">{{ tr('未分组','Ungrouped') }}</span><span class="ws-count">{{ sessionGroups.ungrouped.length }}</span></header>
            <div class="ws-sessions">
              <div v-for="item in sessionGroups.ungrouped" :key="item.task_id" class="session-row" :class="{selected:selectedId===item.session_id}">
                <button class="session-card" :disabled="busy" @click="choose(item.session_id!)">
                  <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : tr('你 ↔ Agent','You ↔ Agent') }}</span>
                  <strong>{{ item.prompt || tr('未命名会话','Untitled session') }}</strong><small>{{ time(item.started_at) }}</small>
                </button>
                <span class="row-actions">
                  <button type="button" :disabled="busy" :title="tr('Fork 会话','Fork session')" @click.stop="forkSession(item)">⑂</button>
                  <select :disabled="busy || !workspaces.length" :title="tr('移动到工作区','Move to workspace')" @click.stop @change="onMoveChange(item, $event)"><option value="">↪</option><option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.title }}</option></select>
                </span>
              </div>
            </div>
          </section>

          <button v-if="executor" class="ws-add" :disabled="busy" @click="addWorkspace()">+ {{ tr('添加工作区…','Add workspace…') }}</button>
          <p v-if="!sessions.length && !workspaces.length" class="muted">{{ tr('暂无会话。直接发送消息，或等待 LIFE 委派工作。','No sessions yet. Send a message or wait for LIFE to delegate work.') }}</p>
        </template>
      </div>
    </aside>

    <section class="conversation">
      <header class="conversation-header">
        <div class="conversation-heading"><h2>{{ session?.prompt || '与 Agent 对话' }}</h2><p>{{ session && isLife(session) ? 'LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话' : '持续对话 · 编程、调研与工具执行' }}</p></div>
        <div class="conversation-actions">
          <span class="browser-status" :class="{on:browserStatus?.running,off:browserStatus&&!browserStatus.enabled}" :title="browserTooltip"><i aria-hidden="true" />{{ browserLabel }}</span>
          <span v-if="active" class="running">{{ tr('正在执行','Running') }}</span>
          <div v-if="session" class="session-actions">
            <button type="button" class="icon-btn" :disabled="!!active" :title="session.state === 'archived' ? tr('恢复','Restore') : tr('归档','Archive')" @click="manage(session.state === 'archived' ? 'restore' : 'archive')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M6 7v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9.5 11h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <button type="button" class="icon-btn danger" :disabled="!!active" :title="tr('删除','Delete')" @click="manage('delete')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
        </div>
      </header>
      <div v-if="error || store.error" class="error" role="alert">{{ error || store.error }}</div>
      <div ref="transcript" class="transcript" @scroll.passive="onTranscriptScroll">
        <div v-if="activeSub" class="sub-view">
          <header class="sub-view-header">
            <button type="button" @click="closeSub">← {{ subStack.length > 1 ? tr('返回上一层', 'Back one level') : tr('返回会话', 'Back to chat') }}</button>
            <div>
              <h3>{{ tr('子 Agent', 'Subagent') }}</h3>
              <p class="muted">{{ activeSub.prompt }}</p>
            </div>
            <span :class="activeSub.state">{{ stateName(activeSub.state) }}</span>
          </header>
          <div class="sub-view-body">
            <div class="bubble user"><div class="message-head"><b>{{ tr('父 Agent', 'Parent agent') }}</b><time>{{ time(activeSub.started_at) }}</time></div><div class="message-text">{{ activeSub.prompt }}</div></div>
            <template v-for="step in childSteps(activeSub)" :key="step.task_id">
              <div v-if="step.kind === 'think' && (step.result || step.reasoning || step.state === 'running' || step.error)" class="agent-speech"><small v-if="modelAnnotation(step)" class="muted model-annotation" :class="{fallback: modelInfo(step).fellBack}" :title="modelReason(step)">{{ modelAnnotation(step) }}</small><ThinkChain v-if="step.reasoning" :reasoning="step.reasoning" :open="step.state === 'running' && !step.result" :label="tr('思维链', 'Reasoning')" /><template v-if="step.result"><MarkdownContent :content="step.result" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else-if="step.state === 'running'" class="muted">{{ tr('子 Agent 正在生成回复…', 'Subagent is drafting a reply…') }}</small><p v-if="step.error" class="error">{{ friendlyError(step.error) }}</p></div>
              <div v-else-if="step.kind === 'subagent'" class="subagent-card nested">
                <button type="button" class="subagent-card-head" @click="openSub(step)"><span :class="step.state">●</span><strong>{{ tr('子 Agent', 'Subagent') }}</strong><span class="subagent-prompt">{{ step.prompt }}</span><small>{{ stateName(step.state) }}</small><span class="subagent-chevron" aria-hidden="true">▸</span></button>
              </div>
              <ToolStepCard v-else-if="step.kind === 'tool'" :step="step" :format-error="friendlyError" @open="(path) => openFilePreview(path, { confirmDiscard: true })" />
              <details v-else-if="step.kind !== 'think'"><summary><span :class="step.state">●</span> {{ stepLabel(step) }} · {{ step.prompt }} <small>{{ stateName(step.state) }}</small></summary><pre>{{ step.result || step.error || (step.state === 'running' ? '执行中…' : '执行完成，无输出') }}</pre></details>
            </template>
            <div v-if="subFinal(activeSub)" class="agent-speech"><MarkdownContent :content="subFinal(activeSub)" /></div>
            <p v-if="activeSub.error" class="error">{{ friendlyError(activeSub.error) }}</p>
            <p v-if="!childSteps(activeSub).length && !subFinal(activeSub) && !activeSub.error" class="muted">{{ activeSub.state === 'running' ? tr('子 Agent 正在执行…', 'Subagent is running…') : tr('没有子步骤记录', 'No child steps recorded') }}</p>
          </div>
        </div>
        <template v-else>
        <div v-if="!turns.length && !contextSummary" class="welcome"><h2>想让 Agent 帮你做什么？</h2><p>直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。</p><p>左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。</p></div>
        <article v-if="contextSummary" class="context-summary">
          <div class="context-summary-head"><strong>{{ tr('上下文摘要', 'Context summary') }}</strong><time>{{ time(contextSummary.started_at) }}</time></div>
          <MarkdownContent :content="contextSummary.result || ''" />
        </article>
        <button v-if="store.hasOlderTurns(selectedId)" class="load-earlier" type="button" @click="store.olderSessionTurns(selectedId)">{{ tr('加载更早的记录','Load earlier messages') }}</button>
        <article v-for="turn in turns" :key="turn.task_id" class="turn">
          <div class="bubble user"><div class="message-head"><b>{{ isLife(turn) ? 'LIFE' : '你' }}</b><time>{{ time(turn.started_at) }}</time></div><div class="message-text">{{ turn.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, '') }}</div></div>
          <div class="bubble agent"><div class="message-head"><b>Agent</b><span :class="turn.state">{{ stateName(turn.state) }}</span></div>
            <div v-if="steps(turn).length" class="steps"><template v-for="step in steps(turn)" :key="step.task_id">
              <div v-if="step.kind === 'think' && (step.result || step.reasoning || step.state === 'running' || step.error)" class="agent-speech"><small v-if="modelAnnotation(step)" class="muted model-annotation" :class="{fallback: modelInfo(step).fellBack}" :title="modelReason(step)">{{ modelAnnotation(step) }}</small><ThinkChain v-if="step.reasoning" :reasoning="step.reasoning" :open="step.state === 'running' && !step.result" :label="tr('思维链', 'Reasoning')" /><template v-if="step.result"><MarkdownContent :content="step.result" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else-if="step.state === 'running'" class="muted">Agent 正在生成回复…</small><p v-if="step.error" class="error">{{ friendlyError(step.error) }}</p></div>
              <div v-else-if="step.kind === 'subagent'" class="subagent-card">
                <button type="button" class="subagent-card-head" @click="openSub(step)">
                  <span :class="step.state">●</span>
                  <strong>{{ tr('子 Agent', 'Subagent') }}</strong>
                  <span class="subagent-prompt">{{ step.prompt }}</span>
                  <small>{{ stateName(step.state) }}<template v-if="subChildCount(step)"> · {{ subChildCount(step) }} {{ tr('步', 'steps') }}</template></small>
                  <span class="subagent-chevron" aria-hidden="true">▸</span>
                </button>
                <p v-if="step.error" class="error subagent-card-error">{{ friendlyError(step.error) }}</p>
              </div>
              <ToolStepCard v-else-if="step.kind === 'tool'" :step="step" :format-error="friendlyError" @open="(path) => openFilePreview(path, { confirmDiscard: true })" />
              <details v-else-if="step.kind !== 'think'"><summary><span :class="step.state">●</span> {{ stepLabel(step) }} · {{ step.prompt }} <small>{{ stateName(step.state) }}</small></summary><pre>{{ step.result || step.error || (step.state === 'running' ? '执行中…' : '执行完成，无输出') }}</pre></details>
            </template></div>
            <MarkdownContent v-if="turn.result && !hasFinalReply(turn)" :content="turn.result" />
            <div v-if="turn.error" class="error">{{ friendlyError(turn.error) }}</div>
            <p v-if="['running','pending'].includes(turn.state)" class="muted">Agent 正在处理，执行过程会自动更新…</p>
          </div>
        </article>
        </template>
      </div>
      <form v-if="!activeSub" class="composer" @submit.prevent="send">
        <section v-if="todos.length" class="todo-panel" :class="{ collapsed: !todoOpen }" :aria-label="tr('待办清单','Todo list')">
          <header>
            <button type="button" class="todo-toggle" :aria-expanded="todoOpen" @click="todoOpen = !todoOpen">
              <strong>{{ tr('待办','Todo') }}</strong>
              <span>{{ todoDone }}/{{ todos.length }}</span>
              <span class="todo-caret" aria-hidden="true">▸</span>
            </button>
          </header>
          <ul>
            <li v-for="(item, index) in todos" :key="index" :class="item.status">
              <span class="todo-mark" aria-hidden="true">{{ item.status === 'completed' ? '✓' : item.status === 'in_progress' ? '◐' : '○' }}</span>
              <span class="todo-text">{{ item.content }}</span>
            </li>
          </ul>
        </section>
        <div v-if="compactNotice" class="compact-notice">{{ compactNotice }}</div>
        <div class="options-collapse" :class="{ open: optionsOpen }">
        <div class="execution-options">
          <label>{{ tr('权限','Permissions') }}<AppSelect v-model="permissionMode" :aria-label="tr('权限','Permissions')" :disabled="!!active || busy" :options="[{value:'normal',label:tr('Normal · 全部审批','Normal · Ask every time')},{value:'full_access',label:tr('Full access · 自动执行','Full access · Auto execute')}]" /></label>
          <label>{{ tr('执行器','Executor') }}<AppSelect v-model="executorId" :aria-label="tr('执行器','Executor')" :disabled="!!active || busy" :options="[{value:'',label:tr('自动选择在线执行器','Automatic executor')},...store.agents.map(agent=>({value:agent.plugin_id,label:`${agent.host?.hostname || agent.name} · ${agent.plugin_id}`,disabled:!store.isHealthy(agent)}))]" /></label>
          <label>{{ tr('工作区','Workspace') }}<button type="button" class="workspace-select" :disabled="!!active || busy || !executor" :title="workdir || executor?.host?.workdir" @click="browse(workdir || executor?.host?.workdir || '')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg> {{ workdir || tr('选择目录…','Select folder…') }}</button></label>
          <ThinkingSlider v-model="intensity" :disabled="!!active || busy" />
          <label>{{ tr('模型','Model') }}<AppSelect v-model="modelId" searchable :aria-label="tr('模型','Model')" :disabled="!!active || busy" @open="fetchModels" :options="[{value:'MOCR',label:tr('MOCR · 自动选型','MOCR · Automatic')},...models.map(model=>({value:model.id,label:modelLabel(model)}))]" /></label>
        </div>
        </div>
        <input ref="fileInput" type="file" multiple hidden @change="onFilesPicked" />
        <div ref="composerInput" class="composer-input">
          <Teleport to="body">
            <div v-if="slashOpen" class="slash-menu" :style="slashMenuStyle" role="listbox" :aria-label="tr('技能与命令','Skills and commands')">
              <button v-for="(item, index) in slashItems" :key="item.name" type="button" class="slash-item" :class="{ active: index === slashIndex }" role="option" :aria-selected="index === slashIndex" @mousedown.prevent="applySlash(item)" @mouseenter="slashIndex = index">
                <span class="slash-name">/{{ item.name }}</span>
                <span class="slash-desc">{{ item.description }}</span>
              </button>
            </div>
          </Teleport>
          <div v-if="attachments.length || attachError" class="attach-chips">
            <span v-for="(file, index) in attachments" :key="index" class="attach-chip" :title="`${file.mime} · ${file.size} B`">
              {{ file.name }}
              <button type="button" :aria-label="tr('移除附件','Remove attachment')" :title="tr('移除','Remove')" @click="removeAttachment(index)">×</button>
            </span>
            <span v-if="attachError" class="attach-error">{{ attachError }}</span>
          </div>
          <textarea v-model="draft" :disabled="busy || session?.state === 'archived'" :placeholder="session?.state === 'archived' ? '恢复会话后可以继续对话' : '给 Agent 发消息…（Enter 发送，Shift+Enter 换行，可 Ctrl+V 粘贴图片/文件）'" aria-label="给 Agent 发消息" @keydown="onComposerKey" @paste="onPaste" />
          <div class="composer-actions">
            <button type="button" class="attach-fly" :disabled="!!active || busy || uploading || session?.state === 'archived'" :aria-label="tr('添加附件','Add attachment')" :title="uploading ? tr('上传中…','Uploading…') : tr('添加附件（也可 Ctrl+V 粘贴）','Attach (or Ctrl+V to paste)')" @click="pickFiles">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button v-if="active?.kind !== 'agent'" type="submit" class="send-fly" :disabled="busy || !!active || !draft.trim() || session?.state === 'archived'" :aria-label="tr('发送','Send')" :title="tr('发送','Send')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.5 2.5 10.8 13.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5 2.5 14.5 21.5l-3.7-8.3-8.3-3.7 19-7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
            </button>
            <button v-else type="button" class="send-fly stop" @click="stop" :aria-label="tr('停止','Stop')" :title="tr('停止','Stop')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>
            </button>
            <button v-if="runningTasks.length > 1" type="button" class="send-fly stop-all" @click="stopAll" :aria-label="tr('停止全部','Stop all')" :title="tr('停止全部','Stop all')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="8" width="14" height="9" rx="2" fill="currentColor"/><path d="M8 5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
        <footer class="composer-footer">
          <div class="footer-status">
            <div v-if="contextUsage" class="ctx-usage" tabindex="0" :aria-label="tr('上下文用量','Context usage')"><svg class="ctx-ring" viewBox="0 0 20 20" aria-hidden="true"><circle class="ctx-track" cx="10" cy="10" r="8"/></svg><span class="ctx-value">{{ fmtK(contextUsage.tokens) }}</span><div class="ctx-tip" role="tooltip"><strong>{{ tr('上下文用量','Context Usage') }}</strong><div class="ctx-used"><b>{{ fmtK(contextUsage.tokens) }}</b><span>{{ tr('已用 tokens','tokens used') }}</span></div><div class="ctx-row" v-for="row in ctxRows" :key="row.key"><span>{{ row.label }}</span><span>{{ row.value }}</span></div></div></div>
            <span class="connection-hint"><i :class="{online:store.onlineCount>0}" />{{ active?.kind === 'compact' ? tr('上下文压缩中…','Compacting…') : store.onlineCount ? tr('执行器在线','Executor online') : tr('执行器离线','Executor offline') }}</span>
          </div>
          <div class="footer-actions">
            <label class="mode-field"><AppSelect v-model="mode" :disabled="busy" :aria-label="tr('Agent 模式','Agent mode')" :options="[{value:'general',label:tr('通用 Agent','General Agent')},{value:'code',label:tr('编程 Agent','Coding Agent')},{value:'code_explore',label:tr('编程 Agent · 多路探索 (5)','Coding Agent · Explore (5)')},{value:'research',label:tr('调研 Agent','Research Agent')},{value:'science',label:tr('科学 Agent','Science Agent')}]" /></label>
            <button type="button" class="chip-btn" :class="{active:hostOpen}" @click="hostOpen=!hostOpen"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 20h8M12 16v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>{{ tr('宿主机','Host') }}</button>
            <button type="button" class="chip-btn" :disabled="!session || !!active || busy || session.state === 'archived'" @click="compact"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9h16M4 15h16M9 4v16M15 4v16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>/compact</button>
            <button type="button" class="chip-btn" :class="{active:optionsOpen}" :aria-expanded="optionsOpen" @click="optionsOpen=!optionsOpen"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="1.6"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 13.6H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ tr('设置','Settings') }}</button>
          </div>
        </footer>
      </form>
    </section>
    <div v-if="browserOpen" class="directory-backdrop" @click.self="closeBrowser"><section class="directory-dialog" role="dialog" aria-modal="true" aria-label="选择工作区目录" tabindex="-1"><header><h2>选择 {{ executor?.host?.hostname || '执行器' }} 的工作区</h2><button @click="closeBrowser">关闭</button></header><div class="directory-roots"><button v-for="root in directory.roots" :key="root" :disabled="browserBusy" @click="browse(root)">{{ root }}</button><button :disabled="browserBusy" @click="browse(executor?.host?.workdir || '')">默认目录</button></div><code>{{ directory.path }}</code><form class="new-folder" @submit.prevent="createFolder"><input v-model="folderName" placeholder="新文件夹名称" aria-label="新文件夹名称" :disabled="browserBusy"/><button :disabled="browserBusy || !folderName.trim() || !directory.path">新建文件夹</button></form><p v-if="browserError" class="error">{{ browserError }}</p><p v-if="browserBusy">正在读取目录…</p><div v-else class="directory-list"><button v-if="directory.parent!==directory.path" @click="browse(directory.parent)">上一级</button><button v-for="folder in directory.directories" :key="folder.path" @click="browse(folder.path)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg> {{ folder.name }}</button><p v-if="!directory.directories.length" class="muted">没有子目录</p></div><footer><button :disabled="browserBusy || !!browserError || !directory.path" @click="selectDirectory">选择当前目录</button></footer></section></div>
    <aside class="dock" :aria-label="tr('工具','Tools')">
      <button type="button" class="dock-btn" :class="{active:browserViewOpen}" :disabled="!browserStatus?.running" :title="tr('浏览器画面','Browser view')" @click="toggleBrowserView">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="15" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M3 8.5h18" stroke="currentColor" stroke-width="1.7"/><circle cx="6.2" cy="6.3" r=".7" fill="currentColor"/><circle cx="8.7" cy="6.3" r=".7" fill="currentColor"/></svg>
        <span class="dock-dot" :class="{on:browserStatus?.running}" />
      </button>
      <button type="button" class="dock-btn" :class="{active:treeOpen}" :title="tr('项目树','Project tree')" @click="toggleTree">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
      </button>
      <button type="button" class="dock-btn" :class="{active:termOpen}" :title="tr('终端','Terminal')" @click="toggleTerm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M7.5 9l3 3-3 3M13 15h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button type="button" class="dock-btn" :class="{active:usageOpen}" :title="tr('上下文用量','Context usage')" @click="toggleUsage">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button type="button" class="dock-btn" :class="{active:hostOpen}" :title="tr('宿主机','Host')" @click="hostOpen=!hostOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 20h8M12 16v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
    </aside>

    <Transition name="browser-panel">
    <section v-if="browserViewOpen" class="browser-panel" :style="panelStyle">
      <div class="browser-toolbar" @pointerdown="onToolbarDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <button type="button" :disabled="!browserStatus?.running || !browserStatus?.canGoBack || browserBusyAction" :title="tr('后退','Back')" @click="postBrowserAction({ action: 'back' })">◀</button>
        <button type="button" :disabled="!browserStatus?.running || !browserStatus?.canGoForward || browserBusyAction" :title="tr('前进','Forward')" @click="postBrowserAction({ action: 'forward' })">▶</button>
        <button type="button" :disabled="!browserStatus?.running || browserBusyAction" :title="tr('刷新','Reload')" @click="postBrowserAction({ action: 'reload' })">⟳</button>
        <form class="browser-url" @submit.prevent="browserGoto">
          <span class="browser-lock" :class="{on:browserStatus?.running}">●</span>
          <input v-model="browserUrlInput" :placeholder="browserStatus?.url || 'about:blank'" @focus="browserUrlFocused = true" @blur="browserUrlFocused = false" />
        </form>
        <button type="button" :title="tr('关闭','Close')" @click="toggleBrowserView">✕</button>
      </div>
      <div v-if="browserTabs.length" class="browser-tabbar">
        <button v-for="tab in browserTabs" :key="tab.id" type="button" class="browser-tab" :class="{active:tab.active}" :title="tab.url" @click="browserActivateTab(tab.id)">
          <span class="browser-tab-title">{{ tab.title || tab.url || 'about:blank' }}</span>
          <span class="browser-tab-close" :title="tr('关闭标签','Close tab')" @click.stop="browserCloseTab(tab.id)">✕</span>
        </button>
        <button type="button" class="browser-tab-new" :title="tr('新标签页','New tab')" @click="browserNewTab">+</button>
      </div>
      <div class="browser-viewport" tabindex="0" @wheel="onViewWheel" @pointerdown="onViewDown" @pointermove="onViewMove" @pointerup="onViewUp" @keydown="onViewKey" @contextmenu.prevent>
        <img v-if="browserStreamSrc" ref="browserImg" :src="browserStreamSrc" alt="browser viewport" draggable="false" @error="onBrowserStreamError" />
        <p v-else class="browser-empty">{{ browserStatus?.error || (browserStatus?.running ? tr('正在连接画面…','Connecting…') : tr('浏览器未运行','Browser is not running')) }}</p>
      </div>
      <span class="browser-resize" :title="tr('调整大小','Resize')" @pointerdown="onResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="treeOpen" class="tree-panel" :style="treePanelStyle">
      <div class="browser-toolbar" @pointerdown="onTreeDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title">{{ tr('项目树','Project tree') }}</strong>
        <button type="button" :title="tr('回到工作区根目录','Workspace root')" @click="treeReload(treeRootPathFor())"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 11l8-7 8 7M6 10v9h12v-9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button type="button" :title="tr('刷新','Refresh')" @click="treeReload(treeRootPath)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button type="button" :title="tr('关闭','Close')" @click="treeOpen=false"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      </div>
      <div class="tree-crumb" :title="treeRootPath || executor?.host?.workdir || ''">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        <span>{{ treeRootPath || executor?.host?.workdir || tr('工作区根目录','Workspace root') }}</span>
      </div>
      <div class="tree-body">
        <div class="tree-list" role="tree">
          <div v-if="treeLoading" class="tree-state"><span class="tree-spin" aria-hidden="true"></span>{{ tr('加载中…','Loading…') }}</div>
          <div v-else-if="treeError" class="tree-state error">{{ treeError }}</div>
          <template v-else>
            <button v-for="row in treeRows" :key="row.path" type="button" class="tree-row" :class="{dir:row.dir,sel:fileData?.path===row.path}" :style="{ paddingLeft: (10 + row.depth * 16) + 'px' }" :title="row.path" @click="treeToggle(row)">
              <span class="tree-chev" :class="{open:row.expanded}">
                <span v-if="row.loading" class="tree-spin small" aria-hidden="true"></span>
                <svg v-else-if="row.dir" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="tree-icon" :class="fileKind(row.name, row.dir)">
                <svg v-if="row.dir" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="currentColor" opacity=".16"/><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h7l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="currentColor" opacity=".14"/><path d="M13 3v5h5M6 3h7l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
              </span>
              <span class="tree-name">{{ row.name }}</span>
            </button>
            <div v-if="!treeRows.length" class="tree-state">{{ tr('空目录','Empty folder') }}</div>
          </template>
        </div>
      </div>
      <span class="browser-resize" :title="tr('调整大小','Resize')" @pointerdown="onTreeResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="usageOpen" class="usage-panel" :style="usagePanelStyle">
      <div class="browser-toolbar" @pointerdown="onUsageDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title">{{ tr('上下文用量','Context usage') }}</strong>
        <button type="button" :title="tr('刷新','Refresh')" @click="fetchContextUsage()">⟳</button>
        <button type="button" :title="tr('关闭','Close')" @click="usageOpen=false">✕</button>
      </div>
      <div class="usage-body">
        <div class="usage-big"><b>{{ fmtK(contextUsage?.tokens || 0) }}</b><span>{{ tr('已用 tokens','tokens used') }}</span></div>
        <div class="ctx-row" v-for="row in ctxRows" :key="row.key"><span>{{ row.label }}</span><span>{{ row.value }}</span></div>
        <p v-if="!ctxRows.length" class="tree-msg">{{ tr('暂无数据','No data') }}</p>
      </div>
      <span class="browser-resize" :title="tr('调整大小','Resize')" @pointerdown="onUsageResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="hostOpen" class="host-window" :style="hostPanelStyle">
      <div class="browser-toolbar" @pointerdown="onHostDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title">{{ tr('宿主机','Host') }}</strong>
        <button type="button" :title="tr('刷新','Refresh')" @click="fetchHost()">⟳</button>
        <button type="button" :title="tr('关闭','Close')" @click="hostOpen=false">✕</button>
      </div>
      <div class="host-body">
        <template v-if="executor">
          <div class="host-head">
            <span class="host-name">{{ executor.host?.hostname || executor.name }}</span>
            <span class="host-status" :class="store.isHealthy(executor) ? 'ok' : 'off'">{{ store.isHealthy(executor) ? tr('在线','Online') : tr('离线','Offline') }}</span>
          </div>
          <div class="usage-rings">
            <div class="usage-metric"><div class="usage-ring" :style="ringStyle(cpuDisplay)"><b>{{ Math.round(cpuDisplay) }}%</b></div><span>CPU</span></div>
            <div class="usage-metric"><div class="usage-ring" :style="ringStyle(memDisplay)"><b>{{ Math.round(memDisplay) }}%</b></div><span>{{ tr('内存','Memory') }}</span></div>
            <small class="host-sampled">{{ hostUsage ? tr('采样','Sampled') + ' ' + time(hostUsage.sampled_at) : tr('等待采样…','Sampling…') }}</small>
          </div>
          <dl class="host-details">
            <div><dt>{{ tr('地址','Address') }}</dt><dd>{{ executor.address }}</dd></div>
            <div><dt>{{ tr('系统','OS') }}</dt><dd>{{ executor.host?.os || '—' }} / {{ executor.host?.arch || '—' }}</dd></div>
            <div><dt>CPU</dt><dd>{{ executor.host?.cpu_model || '—' }} · {{ executor.host?.cpu_cores || '—' }} {{ tr('核','cores') }}</dd></div>
            <div><dt>{{ tr('内存','Memory') }}</dt><dd>{{ gib(executor.host?.memory_available_bytes) }} / {{ gib(executor.host?.memory_total_bytes) }}</dd></div>
            <div><dt>{{ tr('活跃任务','Active') }}</dt><dd>{{ executor.active_tasks }}</dd></div>
            <div><dt>{{ tr('心跳','Heartbeat') }}</dt><dd>{{ executor.last_heartbeat_age_seconds }}s</dd></div>
            <div><dt>{{ tr('工作目录','Workdir') }}</dt><dd>{{ executor.host?.workdir || '—' }}</dd></div>
          </dl>
        </template>
        <p v-else class="host-empty">{{ tr('没有可用的执行器宿主机信息。','No executor host info.') }}</p>
      </div>
      <span class="browser-resize" :title="tr('调整大小','Resize')" @pointerdown="onHostResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="fileOpen" class="file-panel" :style="filePanelStyle">
      <div class="browser-toolbar" @pointerdown="onFileDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title" :title="fileData?.path">{{ baseName(fileData?.path) || tr('文件','File') }}</strong>
        <span v-if="fileDirty" class="file-dirty" :title="tr('未保存','Unsaved')" aria-hidden="true"></span>
        <button v-if="fileView === 'markdown'" type="button" :title="mdSource ? tr('渲染预览','Rendered preview') : tr('查看源码','View source')" @click="mdSource = !mdSource"><svg v-if="mdSource" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg><svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 6 3 12l5.5 6M15.5 6 21 12l-5.5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button v-if="fileEditable || fileDirty" type="button" :disabled="!fileDirty || fileSaving" :title="tr('保存 (Ctrl+S)','Save (Ctrl+S)')" @click="saveFile"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3h11l3 3v15H5V3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 3v6h8M8 21v-7h8v7" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button>
        <button type="button" :disabled="!fileData || fileLoading" :title="tr('重新加载','Reload')" @click="reloadFile"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button type="button" :title="tr('关闭','Close')" @click="closeFilePanel"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      </div>
      <p v-if="fileLoading" class="tree-msg">{{ tr('加载中…','Loading…') }}</p>
      <p v-else-if="fileError" class="tree-msg error">{{ fileError }}</p>
      <FileViewer v-else-if="fileData" v-model="fileDraft" :path="fileData.path" :view="fileView" :bytes="fileBytes" :mime="fileMime" :text="fileText" :md-source="mdSource" @keydown="onFileEditorKey" />
      <p v-else class="tree-msg">{{ tr('没有文件','No file') }}</p>
      <footer v-if="fileData" class="file-foot">
        <span :title="fileData.path">{{ fileData.path }}</span>
        <small v-if="fileNotice" class="file-saved">{{ fileNotice }}</small>
        <small v-else-if="fileEditable && fileDirty" class="file-unsaved">{{ tr('未保存','Unsaved') }}</small>
        <small v-else-if="fileByteLength">{{ humanSize(fileByteLength) }}</small>
        <small v-else-if="fileData.totalLines">{{ fileData.totalLines }} {{ tr('行','lines') }}</small>
      </footer>
      <span class="browser-resize" :title="tr('调整大小','Resize')" @pointerdown="onFileResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="termOpen" class="term-panel" :style="termPanelStyle">
      <div class="browser-toolbar" @pointerdown="onTermDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title">{{ tr('终端','Terminal') }}</strong>
        <div class="term-exec">
          <AppSelect :model-value="termExecutorId" :aria-label="tr('执行器','Executor')" :options="executorOptions" :placeholder="tr('选择执行器','Choose executor')" @change="termChangeExecutor" />
        </div>
        <button type="button" :title="tr('清屏','Clear')" @click="termClear"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button type="button" :title="tr('关闭','Close')" @click="termOpen=false"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      </div>
      <div ref="termBody" class="term-body">
        <p v-if="!termLines.length" class="term-hint">{{ tr('选择执行器，输入命令，按 Enter 运行。会沿用当前目录，cd 可直接切换。','Pick an executor, type a command and press Enter. The working directory persists; use cd to change it.') }}</p>
        <div v-for="(line, index) in termLines" :key="index" class="term-line" :class="line.kind">{{ line.text }}</div>
        <div v-if="termBusy" class="term-line note term-running"><span class="tree-spin small" aria-hidden="true"></span>{{ tr('运行中…','Running…') }}</div>
      </div>
      <form class="term-input" @submit.prevent="termRun">
        <span class="term-prompt" aria-hidden="true">❯</span>
        <input v-model="termInput" :disabled="termBusy" spellcheck="false" autocomplete="off" autocapitalize="off" :aria-label="tr('命令','Command')" :placeholder="termBusy ? tr('命令执行中…','Running…') : tr('输入命令…','Type a command…')" @keydown="termKey" />
        <button type="submit" :disabled="termBusy || !termInput.trim()">{{ tr('运行','Run') }}</button>
      </form>
      <span class="browser-resize" :title="tr('调整大小','Resize')" @pointerdown="onTermResizeDown"></span>
    </section>
    </Transition>
  </main>
  <ConfirmDialog />
</template>

<style scoped>
.workspace{--code-font:ui-monospace,'Cascadia Code','JetBrains Mono',Consolas,'SFMono-Regular',Menlo,monospace;display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}

/* ---- baseline controls ---- */
button,input,textarea,select{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}
button{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}
button:disabled{opacity:.45;cursor:default}
button:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}
input:focus,textarea:focus,select:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}
input[type="checkbox"]{width:auto;accent-color:var(--md-primary)}

/* ---- sessions sidebar ---- */
.sessions{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}
.sessions header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.sessions h1{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}
.sessions header>button{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}
.sessions header>button:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}
.sessions>input{border-radius:10px;background:var(--md-surface-container-lowest)}
.connection{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}
.connection button{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}
.connection i{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}
.connection i.online{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}

/* segmented filter */
.filter-bar{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}
.filter-bar button{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}
.filter-bar button:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}
.filter-bar button.chosen{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}

.sessions label input{margin-right:6px}
.session-list{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}
.session-card{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}
.session-card:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}
.session-card.selected{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}
.session-card.selected:hover{background:var(--md-secondary-container)}
.session-card strong{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:14px}
.origin,small,.sessions .muted{font-size:12px;color:var(--md-on-surface-variant)}
.origin{font-weight:600;letter-spacing:.02em}
.ledger-button{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:13px;font-weight:550}
.ledger-button.chosen{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}

/* ---- ledger ---- */
.ledger{flex:1;overflow-y:auto;padding:var(--space-xl)}
.ledger>header{margin-bottom:8px}
.ledger>header h2{font-size:18px;font-weight:650}
.ledger-entry{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}
.ledger-entry>div{display:flex;align-items:center;gap:10px;font-size:12px}
.ledger-entry>div>span:first-child{font-family:var(--code-font);background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}
.ledger-entry>div small{margin-left:auto}
.ledger-entry>p{margin:8px 0;font-size:14px;line-height:1.6;overflow-wrap:anywhere}
.ledger-entry details{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}
.ledger-entry summary{cursor:pointer;color:var(--md-on-surface-variant)}
.ledger-entry pre{margin:8px 0 0;max-height:300px}

/* ---- conversation ---- */
.conversation{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}
.conversation-header{display:flex;align-items:flex-start;gap:14px}
.conversation-header>div:first-child{flex:1;min-width:0}
.conversation-header h2{font-size:17px;font-weight:650;margin:0}
.conversation-header p{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:13px}
.session-actions{display:flex;gap:8px;flex-shrink:0}
.session-actions button{height:32px;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}
.session-actions .icon-btn{width:32px;padding:0}
.running{color:#B88412;font-weight:650;font-size:12px}
.browser-status{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:600;flex-shrink:0;color:var(--md-on-surface-variant);background:var(--md-surface-container-high)}
.browser-status i{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}
.browser-status.on{color:var(--md-success);background:color-mix(in srgb,var(--md-success) 14%,transparent)}
.browser-status.on i{background:var(--md-success)}
.browser-status.off{opacity:.7}
/* ---- shared button system ---- */
.icon-btn{width:32px;height:32px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);flex-shrink:0;transition:background-color 160ms,transform 160ms var(--ease-emphasized-decel)}
.icon-btn:hover:not(:disabled){background:var(--md-secondary-container)}
.icon-btn.active{background:color-mix(in srgb,var(--md-primary) 16%,transparent);color:var(--md-primary)}
.icon-btn.danger{color:var(--md-error)}
.icon-btn.danger:hover:not(:disabled){background:color-mix(in srgb,var(--md-error) 14%,transparent)}
.chip-btn{height:30px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;border-radius:999px;font-size:12.5px;font-weight:600;flex-shrink:0;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);transition:background-color 160ms,transform 160ms var(--ease-emphasized-decel)}
.chip-btn:hover:not(:disabled){background:var(--md-secondary-container)}
.chip-btn.active{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}
/* Press feedback: scale reads as "pressed" better than the global translateY(1px). */
#app .workspace :is(.icon-btn,.chip-btn,.attach-fly,.send-fly):active:not(:disabled){transform:scale(.97)}
#app .workspace :is(.icon-btn,.chip-btn):focus-visible,
.browser-toolbar button:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}

/* ---- conversation header layout ---- */
.conversation-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}
.conversation-heading{flex:1;min-width:180px}
.conversation-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.session-actions{display:flex;gap:6px;flex-shrink:0}

/* ---- composer footer layout ---- */
.composer-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.footer-status{display:flex;align-items:center;gap:12px;min-width:0}
.footer-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.connection-hint{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap}
.connection-hint i{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}
.connection-hint i.online{background:var(--md-success)}
.browser-panel,.tree-panel,.usage-panel,.host-window,.file-panel,.term-panel{position:fixed;left:0;top:0;z-index:var(--z-panel);display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;background:var(--md-surface-container-low);box-shadow:var(--shadow-4)}
.browser-panel-enter-active{transition:opacity 240ms var(--ease-emphasized-decel),transform 240ms var(--ease-emphasized-decel)}
.browser-panel-leave-active{transition:opacity 140ms var(--ease-emphasized-accel),transform 140ms var(--ease-emphasized-accel)}
.browser-panel-enter-from,.browser-panel-leave-to{opacity:0;transform:translateY(-6px) scale(.99)}
@media (prefers-reduced-motion: reduce){.browser-panel-enter-active,.browser-panel-leave-active{transition-duration:1ms}.browser-panel-enter-from,.browser-panel-leave-to{transform:none}}
.browser-toolbar{display:flex;align-items:center;gap:6px;padding:7px 9px;background:var(--md-surface-container-high);color:var(--md-on-surface);cursor:grab;touch-action:none;user-select:none}
.browser-toolbar:active{cursor:grabbing}
.browser-grab{font-size:13px;line-height:1;color:var(--md-on-surface-variant);padding:0 2px;cursor:grab}
.browser-toolbar button{width:28px;height:28px;padding:0;display:inline-grid;place-items:center;border-radius:8px;font-size:13px;line-height:1;color:var(--md-on-surface-variant);background:transparent;flex-shrink:0}
.browser-toolbar button svg{display:block}
.browser-toolbar button:hover:not(:disabled){background:var(--md-surface-container-highest)}
.browser-toolbar button:disabled{opacity:.35;cursor:default}
.browser-url{flex:1;display:flex;align-items:center;gap:7px;min-width:120px;height:30px;padding:0 12px;border-radius:15px;background:var(--md-surface-container)}
.browser-url input{flex:1;min-width:0;border:none;background:transparent;color:var(--md-on-surface);font-size:12.5px;outline:none}
.browser-url input::placeholder{color:var(--md-on-surface-variant)}
.browser-lock{font-size:8px;color:var(--md-on-surface-variant)}
.browser-lock.on{color:var(--md-success)}
.browser-page-title{max-width:26%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:var(--md-on-surface-variant)}
.browser-tabbar{display:flex;align-items:center;gap:4px;padding:5px 8px;background:var(--md-surface-container);overflow-x:auto}
.browser-tab{display:inline-flex;align-items:center;gap:5px;max-width:170px;height:26px;padding:0 4px 0 10px;border:0;border-radius:8px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12px;flex-shrink:0;cursor:pointer}
.browser-tab:hover{background:var(--md-surface-container-highest)}
.browser-tab.active{background:var(--md-surface-container-lowest);color:var(--md-on-surface);box-shadow:var(--shadow-1)}
.browser-tab-title{max-width:126px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.browser-tab-close{position:relative;width:16px;height:16px;display:grid;place-items:center;border-radius:50%;font-size:10px;flex-shrink:0}
.browser-tab-close::before{content:'';position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%)}
.browser-tab-close:hover{background:var(--md-surface-container-highest);color:var(--md-error)}
.browser-tab-new{width:26px;height:26px;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:16px;line-height:1;flex-shrink:0;cursor:pointer}
.browser-tab-new:hover{background:var(--md-surface-container-high)}
.browser-viewport{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;background:var(--md-surface-container-lowest);cursor:crosshair;outline:none;touch-action:none}
.browser-viewport:focus-visible{outline:2px solid var(--md-primary);outline-offset:-2px}
.browser-viewport img{width:100%;height:auto;display:block;user-select:none;-webkit-user-drag:none}
.browser-empty{margin:auto;padding:40px;color:var(--md-on-surface-variant);font-size:13px;text-align:center}
.browser-resize{position:absolute;right:1px;bottom:1px;width:16px;height:16px;cursor:nwse-resize;touch-action:none;opacity:.5;
  background:repeating-linear-gradient(135deg,transparent 0 3px,var(--md-on-surface-variant) 3px 4px)}
.browser-resize:hover{opacity:.85}

/* ---- right dock ---- */
.dock{width:58px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:10px;padding:16px 0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
.dock-btn{position:relative;width:42px;height:42px;display:grid;place-items:center;border:0;border-radius:14px;background:transparent;color:var(--md-on-surface-variant);transition:background-color 160ms,color 160ms,transform 160ms var(--ease-emphasized-decel)}
.dock-btn:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-surface)}
.dock-btn:active:not(:disabled){transform:scale(.94)}
.dock-btn.active{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}
.dock-btn:disabled{opacity:.35;cursor:default}
.dock-btn:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}
.dock-dot{position:absolute;right:6px;top:6px;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}
.dock-dot.on{background:var(--md-success)}
@media(max-width:800px){.dock{display:none}}

/* ---- project tree window ---- */
.tree-title{flex:1;min-width:0;font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tree-crumb{display:flex;align-items:center;gap:7px;padding:7px 12px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);border-bottom:1px solid var(--md-outline-variant);flex-shrink:0}
.tree-crumb svg{flex:none;opacity:.8}
.tree-crumb span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:11.5px}
.tree-body{flex:1;min-height:0;display:flex;flex-direction:column;background:var(--md-surface-container-lowest)}
.tree-list{flex:1;min-height:0;overflow:auto;padding:8px 6px 12px}
.tree-list::-webkit-scrollbar{width:11px}
.tree-list::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--md-on-surface-variant) 30%,transparent);border-radius:999px;border:3px solid transparent;background-clip:content-box}
.tree-list::-webkit-scrollbar-thumb:hover{background:color-mix(in srgb,var(--md-on-surface-variant) 48%,transparent);background-clip:content-box}
.tree-state{display:flex;align-items:center;justify-content:center;gap:9px;padding:34px 18px;color:var(--md-on-surface-variant);font-size:12.5px;text-align:center}
.tree-state.error{color:var(--md-error)}
.tree-msg{margin:14px;color:var(--md-on-surface-variant);font-size:12.5px}
.tree-msg.error{color:var(--md-error)}
.tree-spin{width:15px;height:15px;border-radius:50%;border:2px solid color-mix(in srgb,var(--md-primary) 28%,transparent);border-top-color:var(--md-primary);animation:tree-spin .7s linear infinite;flex:none}
.tree-spin.small{width:11px;height:11px;border-width:1.6px}
@keyframes tree-spin{to{transform:rotate(360deg)}}
.tree-row{display:flex;align-items:center;gap:7px;width:100%;min-height:30px;text-align:left;padding:0 8px;border:0;border-radius:9px;background:transparent;color:var(--md-on-surface);font-size:13px;font-weight:450;line-height:1.3;transition:background-color 140ms var(--ease-emphasized-decel),color 140ms}
.tree-row:hover:not(:disabled){background:color-mix(in srgb,var(--md-on-surface) 7%,transparent)}
.tree-row.dir{font-weight:600}
.tree-row.dir .tree-name{letter-spacing:-.003em}
.tree-row.sel{background:color-mix(in srgb,var(--md-primary) 15%,transparent);color:var(--md-primary)}
.tree-row.sel .tree-icon{color:var(--md-primary)}
.tree-chev{flex:none;width:14px;height:14px;display:grid;place-items:center;color:var(--md-on-surface-variant);transition:transform 180ms var(--ease-emphasized);opacity:.75}
.tree-chev.open{transform:rotate(90deg)}
.tree-chev svg{display:block}
.tree-icon{flex:none;width:16px;height:16px;display:grid;place-items:center;color:var(--md-on-surface-variant)}
.tree-icon svg{display:block}
.tree-icon.dir{color:#d9a441}
.tree-icon.code{color:#5b6ee1}
.tree-icon.data{color:#12a594}
.tree-icon.doc{color:#c07c1a}
.tree-icon.image{color:#9b5cf6}
.tree-icon.archive{color:#7c8598}
@media (prefers-color-scheme: dark){
  .tree-icon.dir{color:#e5bd6a}
  .tree-icon.code{color:#9aa8ff}
  .tree-icon.data{color:#4dd4c4}
  .tree-icon.doc{color:#e0a84e}
  .tree-icon.image{color:#c39bff}
  .tree-icon.archive{color:#9aa4b5}
}
@media (prefers-reduced-motion: reduce){.tree-chev{transition-duration:1ms}.tree-spin{animation-duration:1.6s}}
.tree-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* ---- file preview window ---- */
.file-dirty{width:8px;height:8px;border-radius:50%;background:var(--md-primary);flex-shrink:0}
.file-foot{display:flex;align-items:center;gap:10px;padding:5px 12px;background:var(--md-surface-container);font-size:11.5px;color:var(--md-on-surface-variant);border-top:1px solid var(--md-outline-variant)}
.file-foot span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font)}
.file-foot small{flex:none;font-variant-numeric:tabular-nums}
.file-saved{color:var(--md-success,#3ba55c);font-weight:650}
.file-unsaved{color:#B88412;font-weight:650}

/* ---- terminal window ---- */
.term-exec{flex:0 1 208px;min-width:112px}
.term-exec :deep(.app-select-trigger){min-height:30px;height:30px;border-radius:9px;font-size:12px;padding:0 6px 0 12px;background:var(--md-surface-container)}
.term-exec :deep(.app-select-chevron){width:20px;height:20px}
.term-body{flex:1;min-height:0;overflow:auto;padding:10px 13px;background:#0e1116;color:#d6deeb;font-family:var(--code-font);font-size:12px;line-height:1.6}
.term-hint{margin:4px 0;color:#7c8798;font-size:12px}
.term-line{white-space:pre-wrap;overflow-wrap:anywhere}
.term-line.cmd{margin-top:8px;color:#9ecbff;font-weight:600}
.term-line.cmd:first-child{margin-top:0}
.term-line.out{color:#d6deeb}
.term-line.err{color:#ff9d9d}
.term-line.note{color:#7c8798;font-style:italic}
.term-running{display:flex;align-items:center;gap:8px}
.term-input{display:flex;align-items:center;gap:9px;padding:8px 12px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}
.term-prompt{flex:none;color:var(--md-primary);font-family:var(--code-font);font-weight:750}
.term-input input{flex:1;min-width:0;border:0;background:transparent;padding:4px 0;font-family:var(--code-font);font-size:12.5px;color:var(--md-on-surface);outline:none}
.term-input input:focus{box-shadow:none;border:0}
.term-input button{flex:none;height:30px;padding:0 14px;border:0;border-radius:8px;background:var(--md-primary);color:var(--md-on-primary,#fff);font-size:12px;font-weight:650;transition:filter 160ms,transform 160ms var(--ease-emphasized-decel)}
.term-input button:hover:not(:disabled){filter:brightness(1.07)}
.term-input button:active:not(:disabled){transform:scale(.97)}
.term-input button:disabled{opacity:.45}

/* ---- usage window ---- */
.usage-body{flex:1;min-height:0;overflow:auto;padding:14px 16px}
.usage-big{display:flex;align-items:baseline;gap:8px;margin-bottom:12px}
.usage-big b{font-size:28px;font-weight:800;color:var(--md-primary);line-height:1;font-variant-numeric:tabular-nums}
.usage-big span{font-size:12px;color:var(--md-on-surface-variant)}
.usage-body .ctx-row{padding:7px 0}

/* ---- host window ---- */
.host-body{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:14px;padding:16px;background:var(--md-surface-container-lowest)}
.host-head{display:flex;align-items:center;gap:10px}
.host-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px;font-weight:750}
.host-status{padding:3px 10px;border-radius:999px;font-size:11.5px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.host-status.ok{background:color-mix(in srgb,var(--md-success) 18%,transparent);color:var(--md-success)}
.host-status.off{background:var(--md-error-container);color:var(--md-on-error-container,var(--md-on-error-container))}
.usage-rings{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.usage-metric{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;color:var(--md-on-surface-variant)}
.usage-ring{width:76px;height:76px;border-radius:50%;display:grid;place-items:center}
.usage-ring b{width:58px;height:58px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:14px;font-weight:750;box-shadow:var(--shadow-1);font-variant-numeric:tabular-nums}
.host-sampled{color:var(--md-on-surface-variant);font-size:11.5px}
.host-details{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:0}
.host-details>div{background:var(--md-surface-container);border-radius:12px;padding:8px 10px;min-width:0}
.host-details dt{color:var(--md-on-surface-variant);font-weight:600;font-size:11px}
.host-details dd{margin:3px 0 0;font-size:12.5px;overflow-wrap:anywhere}
.host-empty{margin:14px;color:var(--md-on-surface-variant);font-size:12.5px}
.failed{color:var(--md-error)}
.done{color:var(--md-success);font-weight:600;font-size:12px}
.cancelled,.muted{color:var(--md-on-surface-variant)}
.muted{font-size:12px;line-height:1.6}
.error{background:var(--md-error-container);color:var(--md-on-error-container);padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}

.transcript{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}
.context-summary{max-width:920px;margin:0 auto 22px;padding:14px 18px;border:1px dashed var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-low)}
.context-summary-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.context-summary-head strong{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--md-primary)}
.context-summary-head time{font-size:12px;opacity:.75}
.welcome{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}
.welcome::before{content:'';display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center}
.welcome h2{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}
.welcome p{margin:6px 0;font-size:14px}

/* ---- message bubbles ---- */
.load-earlier{display:block;margin:0 auto 22px;padding:8px 16px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:13px;cursor:pointer;transition:background 150ms var(--ease-emphasized-decel),color 150ms var(--ease-emphasized-decel)}
.load-earlier:hover{background:var(--md-surface-container);color:var(--md-on-surface)}
.turn{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}
.bubble{padding:15px 19px;font-size:14px}
.bubble.user{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px 16px}
.bubble.agent{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}
.bubble .message-head{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}
.bubble .message-head b{font-weight:700}
.bubble .message-head time{margin-left:auto;opacity:.75;font-size:12px}
.bubble .message-head span{margin-left:auto}
.bubble.user .message-head{margin-bottom:7px;opacity:.85}
.message-text{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}
.bubble.agent :deep(p){margin:.4em 0}
.bubble.agent :deep(pre){max-height:420px}

/* agent speech / markdown inside response */
.agent-speech{margin:6px 0;padding:2px 0;line-height:1.7}
.model-annotation{display:block;font-size:12px;opacity:.7;margin-bottom:4px;font-family:var(--code-font)}
.model-annotation.fallback{opacity:1;color:var(--md-error)}
.think-chain{margin:2px 0 8px;border:0;border-radius:10px;background:var(--md-surface-container-low);overflow:hidden}
.think-chain>summary{display:inline-flex;align-items:center;gap:5px;cursor:pointer;list-style:none;padding:3px 10px;font-size:11px;font-weight:600;letter-spacing:.03em;color:var(--md-on-surface-variant);user-select:none;border-radius:999px;background:var(--md-surface-container)}
.think-chain>summary::-webkit-details-marker{display:none}
.think-chain>summary::before{content:'▸';display:inline-block;transition:transform .15s}
.think-chain[open]>summary::before{transform:rotate(90deg)}
.think-chain>pre{margin:0;padding:6px 10px 8px;max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--code-font);font-size:11.5px;line-height:1.55;color:var(--md-on-surface-variant)}
.agent-speech :deep(p){margin:.45em 0}
.agent-speech :deep(pre){background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:13px}
.agent-speech :deep(code){font-family:var(--code-font)}
.agent-speech :deep(ul,.agent-speech :deep(ol)){padding-left:20px;margin:.4em 0}

/* ---- steps ---- */
.steps{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}
.steps details{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}
.steps summary{cursor:pointer;font-size:13px;font-weight:550}
.steps summary small{margin-left:10px;font-weight:600}
.steps summary::marker{color:var(--md-on-surface-variant)}
.steps details pre{margin:10px 0 0;font-family:var(--code-font);font-size:13px;white-space:pre-wrap;max-height:400px}
pre{max-height:450px;overflow:auto;font-family:var(--code-font)}

/* ---- subagent card ---- */
.subagent-card{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}
button.subagent-card-head{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:13px}
button.subagent-card-head:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}
button.subagent-card-head>span:first-child{color:var(--md-primary)}
button.subagent-card-head>strong{font-weight:700}
.subagent-prompt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}
.subagent-card small{font-weight:600}
.subagent-chevron{color:var(--md-on-surface-variant);font-size:12px}
.subagent-card-error{margin:0 10px 10px;padding:8px 12px;font-size:12px}
.subagent-card.nested{margin:6px 0;box-shadow:none}

/* ---- sub view ---- */
.sub-view{max-width:900px;margin:0 auto}
.sub-view-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}
.sub-view-header button{flex-shrink:0;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}
.sub-view-header h3{margin:0 0 4px;font-size:16px;font-weight:650}
.sub-view-header p{margin:0;max-width:520px}
.sub-view-header>span{margin-left:auto;font-weight:650;font-size:12px}
.sub-view-body{min-height:120px}

/* ---- todo panel ---- */
.todo-panel{padding:12px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);max-height:170px;overflow:auto;opacity:1;transform:none;transition:opacity 200ms var(--ease-emphasized-decel),transform 200ms var(--ease-emphasized-decel)}
@starting-style{.todo-panel{opacity:0;transform:translateY(6px)}}
.todo-panel>header{display:flex;align-items:center;font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);text-transform:uppercase}
.todo-toggle{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:0;padding:0;border:0;background:transparent;font:inherit;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);cursor:pointer}
.todo-toggle>span:first-of-type{color:var(--md-primary)}
.todo-caret{display:inline-grid;place-items:center;color:var(--md-on-surface-variant);transition:transform 200ms var(--ease-emphasized-decel)}
.todo-panel.collapsed .todo-caret{transform:rotate(-90deg)}
.todo-panel ul{list-style:none;margin:9px 0 0;padding:0;display:flex;flex-direction:column;gap:6px;transition:opacity 180ms var(--ease-emphasized-decel)}
.todo-panel.collapsed ul{display:none}
.todo-panel li{display:flex;align-items:flex-start;gap:9px;font-size:13px;line-height:1.5;color:var(--md-on-surface);transition:opacity .2s,color .2s,transform 200ms var(--ease-emphasized-decel)}
@starting-style{.todo-panel li{opacity:0;transform:translateY(6px)}}
.todo-panel li.completed{opacity:.6}
.todo-panel li.completed .todo-text{text-decoration:line-through}
.todo-panel li.in_progress .todo-text{font-weight:650}
.todo-mark{flex:none;width:16px;text-align:center;color:var(--md-primary);transition:color .2s,transform .2s}
.todo-panel li.completed .todo-mark{color:var(--md-success,#3ba55c)}
.composer .todo-panel{border-radius:28px 28px 0 0}

/* ---- context usage ring ---- */
.ctx-usage{position:relative;display:inline-flex;align-items:center;gap:6px;flex:none;outline:none;order:99;margin-left:6px;cursor:default}
.ctx-ring{width:20px;height:20px;flex:none}
.ctx-track{fill:none;stroke:var(--md-outline-variant);stroke-width:2.2}
.ctx-value{font-size:11px;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}
.ctx-tip{position:absolute;bottom:calc(100% + 12px);left:0;right:auto;transform-origin:bottom left;transform:translateY(4px) scale(.97);z-index:var(--z-popover);width:max-content;min-width:216px;max-width:280px;padding:12px 14px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:var(--shadow-3);color:var(--md-on-surface);opacity:0;visibility:hidden;pointer-events:none;transition:opacity 160ms var(--ease-emphasized-decel),transform 160ms var(--ease-emphasized-decel),visibility 160ms;font-size:12px;text-align:left}
.ctx-usage:hover .ctx-tip,.ctx-usage:focus-visible .ctx-tip,.ctx-usage:focus-within .ctx-tip{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
.ctx-tip strong{display:block;font-size:12px;font-weight:750;margin-bottom:8px}
.ctx-used{display:flex;align-items:baseline;gap:6px}
.ctx-used b{font-size:22px;font-weight:800;color:var(--md-primary);line-height:1}
.ctx-used span{color:var(--md-on-surface-variant)}
.ctx-row{display:flex;justify-content:space-between;gap:16px;padding:4px 0;border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}
.ctx-row span:last-child{font-weight:650;color:var(--md-primary)}

/* ---- composer ---- */
.composer{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:visible;box-shadow:var(--shadow-1)}
.composer-input{position:relative}
.composer-input textarea{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 124px 15px 16px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}
.composer-input textarea:focus{box-shadow:none;border:0}
.slash-menu{position:fixed;z-index:var(--z-popover);background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:14px;box-shadow:var(--shadow-3);padding:6px;max-height:min(320px,42vh);overflow:auto}
.slash-item{display:flex;align-items:baseline;gap:10px;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:10px;background:transparent;color:var(--md-on-surface);cursor:pointer}
.slash-item.active{background:var(--md-secondary-container)}
.slash-name{flex:none;font-family:var(--code-font);font-weight:650;font-size:13px;color:var(--md-primary)}
.slash-desc{font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.attach-chips{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 16px 0}
.composer-actions{position:absolute;right:10px;bottom:10px;z-index:2;display:flex;align-items:center;gap:8px}
.attach-fly{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:inline-flex;align-items:center;justify-content:center;line-height:0;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.attach-fly svg{width:18px;height:18px;display:block}
.attach-fly:hover:not(:disabled){filter:brightness(1.05)}
.attach-fly:disabled{opacity:.5;cursor:default}
.attach-chip{display:inline-flex;align-items:center;gap:6px;max-width:220px;font-size:12px;padding:4px 6px 4px 10px;border-radius:999px;background:var(--md-surface-container);border:1px solid var(--md-outline-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.attach-chip button{border:0;background:transparent;cursor:pointer;font-size:14px;line-height:1;padding:0 4px;color:var(--md-on-surface-variant)}
.attach-chip button:hover{color:var(--md-error)}
.attach-error{font-size:12px;color:var(--md-error)}
.send-fly{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:inline-flex;align-items:center;justify-content:center;line-height:0;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}
.send-fly svg{width:20px;height:20px;display:block}
.send-fly:hover:not(:disabled){filter:brightness(1.08)}
.send-fly:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}
.send-fly.stop{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}
.compact-notice{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}
.options-collapse{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--duration-medium) var(--ease-emphasized)}
.options-collapse.open{grid-template-rows:1fr}
.options-collapse>.execution-options{overflow:hidden;min-height:0}
.options-toggle{display:inline-flex;align-items:center;gap:6px;transition:background-color .18s,color .18s}
.options-toggle.open{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.execution-options{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}
.execution-options label{display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}
.execution-options :deep(.app-select-trigger),.execution-options .workspace-select{width:100%;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}
.workspace-select{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}
.composer footer{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}
.composer-footer .mode-field :deep(.app-select-trigger){min-height:30px;font-size:12.5px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent}

/* ---- host panel / rings ---- */
.host-panel>strong{font-size:14px}
.host-panel dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}
.host-panel dt{color:var(--md-on-surface-variant);font-weight:600}
.host-panel dd{margin:4px 0 0;overflow-wrap:anywhere}
.usage-rings{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}
.usage-metric{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}
.usage-ring{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}
.usage-ring b{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}

/* ---- directory dialog ---- */
.new-folder{display:flex;gap:8px}.new-folder input{flex:1;min-width:0}
.directory-backdrop{position:fixed;inset:0;background:var(--md-scrim);z-index:var(--z-modal);display:grid;place-items:center;padding:20px}
.directory-dialog{position:relative;z-index:var(--z-modal);background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4);outline:none}
.directory-dialog:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}
.directory-dialog>header{gap:12px}
.directory-dialog>header h2{font-size:16px;font-weight:650}
.directory-list{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}
.directory-list button{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}
.directory-roots{display:flex;gap:8px;flex-wrap:wrap}
.directory-roots button{border-radius:999px;font-size:12px;padding:6px 12px}
.directory-dialog code{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}
.directory-dialog>footer{display:flex;justify-content:flex-end}
.directory-dialog>footer button{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}
.permission-request{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}
.permission-request small{display:block;margin:8px 0}
.permission-request pre{max-height:160px;overflow:auto}
.permission-request>div{display:flex;justify-content:flex-end;gap:8px}

/* ============ Material 3 Expressive polish ============ */
#app .workspace{gap:12px;padding-left:6px;background:var(--md-surface-container)}
#app .workspace .sessions{
  width:296px;gap:14px;padding:18px 14px;border:0;border-radius:28px;
  background:var(--md-surface-container-low);box-shadow:var(--shadow-1);
}
#app .workspace .sessions h1{font-size:24px;font-weight:800;letter-spacing:-.02em}
#app .workspace .sessions header>button{
  height:40px;padding:0 16px;border:0;border-radius:999px;
  background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 13px/1 inherit;display:inline-flex;align-items:center;gap:7px;
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent);
}
#app .workspace .sessions header>button:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 34%,transparent)}
#app .workspace .sessions>input{
  min-height:48px;padding:0 16px;border:1px solid transparent;border-radius:16px;
  background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:14px;
}
#app .workspace .sessions>input:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app .workspace .filter-bar{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}
#app .workspace .filter-bar button{border-radius:999px;padding:8px 4px;font-weight:600}
#app .workspace .filter-bar button.chosen{background:var(--md-primary);color:var(--md-on-primary,#fff);font-weight:700;box-shadow:var(--shadow-1)}
#app .workspace .filter-bar button.chosen:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}
#app .workspace .session-list{margin:0 -2px;padding:0 2px}
#app .workspace .session-card{
  gap:5px;margin-bottom:8px;padding:13px 15px;
  border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);
  border-radius:18px;background:var(--md-surface-container-lowest);
  transition:transform 180ms var(--ease-emphasized-decel),background-color 200ms,border-color 200ms,box-shadow 220ms,border-radius 320ms var(--ease-emphasized);
}
@media (hover:hover) and (pointer:fine){
  #app .workspace .session-card:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-1);border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}
}
#app .workspace .session-card.selected{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent;border-radius:20px 20px 20px 7px;box-shadow:var(--shadow-1)}
#app .workspace .session-card .origin{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:12px;color:var(--md-primary)}
#app .workspace .session-card.selected .origin{color:var(--md-on-secondary-container);opacity:.75}
#app .workspace .ledger-button{
  min-height:44px;border-radius:16px;font-weight:650;
  background:var(--md-surface-container-lowest);
  border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);
}
#app .workspace .ledger-button.chosen{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}
#app .workspace .ledger-entry{border-radius:20px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-lowest);box-shadow:var(--shadow-1)}

/* conversation column */
#app .workspace .conversation{background:var(--md-surface);border-radius:30px;overflow:hidden;box-shadow:var(--shadow-1)}
#app .workspace .conversation-header{
  padding:20px 26px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
}
#app .workspace .conversation-header h2{font-size:20px;font-weight:750;letter-spacing:-.01em}
#app .workspace .session-actions button{height:36px;padding:0 15px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}
#app .workspace .session-actions button:hover:not(:disabled){background:var(--md-surface-container-highest);box-shadow:none}
#app .workspace .session-actions .icon-btn{width:36px;height:36px;padding:0;border-radius:50%;background:var(--md-surface-container-high)}
#app .workspace .session-actions .icon-btn.danger{color:var(--md-error);background:color-mix(in srgb,var(--md-error) 12%,transparent)}
#app .workspace .running{color:#B88412;background:color-mix(in srgb,#B88412 14%,transparent);padding:4px 11px;border-radius:999px;font-weight:700}
#app .workspace .transcript{padding:28px 30px}
#app .workspace .welcome{margin:64px auto 0}
#app .workspace .welcome::before{
  width:76px;height:76px;border-radius:26px 26px 26px 10px;
  background-color:var(--md-primary-container);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='%235944c6' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E");
  background-size:34px 34px;
}
#app .workspace .welcome h2{font-size:26px;font-weight:800;letter-spacing:-.02em}
#app .workspace .turn{gap:12px;margin-bottom:32px}
#app .workspace .bubble{padding:16px 20px;font-size:15px;line-height:1.7}
#app .workspace .bubble.user{
  background:var(--md-primary-container);color:var(--md-on-primary-container);
  border-radius:24px 24px 8px 24px;box-shadow:var(--shadow-1);max-width:82%;
}
#app .workspace .bubble.agent{
  background:var(--md-surface-container-low);
  border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);
  border-radius:8px 24px 24px 24px;box-shadow:var(--shadow-1);max-width:100%;
}
#app .workspace .bubble .message-head b{font-weight:750}
#app .workspace .steps{gap:9px;margin:14px 0}
#app .workspace .steps details{
  border-radius:16px;background:var(--md-surface-container);
  border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);padding:11px 15px;
}
#app .workspace .subagent-card{border-radius:18px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);box-shadow:var(--shadow-1)}
#app .workspace button.subagent-card-head{padding:12px 15px}
#app .workspace button.subagent-card-head:hover:not(:disabled){background:var(--md-secondary-container)}
#app .workspace .sub-view-header{padding-bottom:16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}
#app .workspace .sub-view-header button{border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}
#app .workspace .agent-speech :deep(pre){border-radius:16px;background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}

/* composer */
#app .workspace .composer{
  position:relative;z-index:5;
  margin:0 22px 20px;border-radius:28px;overflow:visible;
  background:var(--md-surface-container-lowest);
  border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
  box-shadow:var(--shadow-2);
}
#app .workspace .composer:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent),var(--shadow-2)}
#app .workspace .execution-options{padding:12px 16px;gap:10px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}
#app .workspace .execution-options label{font-weight:700;letter-spacing:.05em}
#app .workspace .execution-options .workspace-select{
  min-height:52px;border-radius:16px;border-color:transparent;
  background:var(--md-surface-container-high);font-size:13px;
}
#app .workspace .execution-options :deep(.app-select-trigger){
  min-height:52px;border-radius:16px;border-color:transparent;
  background:var(--md-surface-container-high);font-size:13px;
}
#app .workspace .composer-footer .mode-field :deep(.app-select-trigger){
  min-height:30px;border-radius:999px;border-color:transparent;
  background:var(--md-surface-container-high);font-size:12.5px;
}
#app .workspace .composer-input textarea{border-radius:0;background:transparent}
#app .workspace .send-fly,
#app .workspace .attach-fly{
  width:46px !important;height:46px !important;border-radius:50% !important;
}
#app .workspace .send-fly{box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 34%,transparent)}
#app .workspace .composer footer{border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);padding:12px 16px}
#app .workspace .composer footer>button{border-radius:999px;min-height:36px;padding-inline:15px;background:var(--md-surface-container-high);border-color:transparent}

/* host panel + rings */
#app .workspace .host-panel{margin:0 22px 10px;border-radius:24px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .workspace .usage-ring b{background:var(--md-surface-container-lowest)}
#app .workspace .directory-dialog{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}
#app .workspace .directory-list button{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}
#app .workspace .directory-list button:hover:not(:disabled){background:var(--md-secondary-container)}
#app .workspace .directory-roots button{background:var(--md-surface-container-high);border-color:transparent}

/* ---- responsive ---- */
/* ---- motion (restrained) ---- */
@keyframes caret-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes soft-pulse{0%,100%{opacity:1}50%{opacity:.5}}
/* Turns enter via interruptible transitions (@starting-style), not keyframes. */
.turn{opacity:1;transform:none;transition:opacity 220ms var(--ease-emphasized-decel),transform 220ms var(--ease-emphasized-decel)}
@starting-style{.turn{opacity:0;transform:translateY(10px)}}
#app .workspace .agent-speech .running{animation:caret-blink 1s steps(1,end) infinite;color:var(--md-primary)}
/* ---- motion: messages/steps ease in (staggered), running state breathes ---- */
.turn .bubble,
.turn .steps > *,
.turn .agent-speech,
.turn .subagent-card,
.turn .tool-card{transition:opacity 340ms var(--ease-emphasized-decel),transform 340ms var(--ease-emphasized-decel);transition-delay:calc(var(--stagger,0) * 55ms)}
@starting-style{
  .turn .bubble,
  .turn .steps > *,
  .turn .agent-speech,
  .turn .subagent-card,
  .turn .tool-card{opacity:0;transform:translateY(16px) scale(.985)}
}
.steps>*:nth-child(1){--stagger:0}
.steps>*:nth-child(2){--stagger:1}
.steps>*:nth-child(3){--stagger:2}
.steps>*:nth-child(4){--stagger:3}
.steps>*:nth-child(5){--stagger:4}
.steps>*:nth-child(6){--stagger:5}
.steps>*:nth-child(7){--stagger:6}
.steps>*:nth-child(8){--stagger:7}
.steps>*:nth-child(9){--stagger:8}
.steps>*:nth-child(10){--stagger:9}
.steps>*:nth-child(n+11){--stagger:10}
@keyframes sheen{0%{background-position:-140% 0}100%{background-position:240% 0}}
.agent-speech{position:relative}
.agent-speech:has(.running)::after{content:'';position:absolute;left:2px;right:2px;bottom:0;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--md-primary) 70%,transparent),transparent);background-size:280% 100%;animation:sheen 1.4s linear infinite}
.state.running,.running{animation:soft-pulse 1.4s var(--ease-emphasized) infinite}
.tool-card,.subagent-card{transition:transform 200ms var(--ease-emphasized-decel),box-shadow 220ms var(--ease-emphasized-decel),background-color 200ms}
.tool-card:hover,.subagent-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-3)}
.tool-card:active,.subagent-card:active{transform:translateY(0) scale(.995)}
.icon-btn:hover:not(:disabled),.dock-btn:hover:not(:disabled),.chip-btn:hover:not(:disabled){transform:translateY(-1px)}
.icon-btn:active:not(:disabled),.dock-btn:active:not(:disabled),.chip-btn:active:not(:disabled),.ws-actions button:active:not(:disabled),.row-actions button:active:not(:disabled){transform:scale(.94)}
.composer{transition:border-color 200ms var(--ease-emphasized-decel),box-shadow 220ms var(--ease-emphasized-decel)}
.composer:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));box-shadow:0 6px 22px color-mix(in srgb,var(--md-primary) 14%,transparent)}
.session-card{transition:background-color 180ms var(--ease-emphasized-decel),border-color 180ms,transform 160ms var(--ease-emphasized-decel)}
.session-card:hover:not(:disabled){transform:translateY(-1px)}
.transcript{scroll-behavior:smooth}
@media (prefers-reduced-motion: reduce){
  .turn{transition:opacity 120ms var(--ease-emphasized)}
  @starting-style{.turn{transform:none}}
  .todo-panel,.todo-panel li{animation:none;transition:opacity 120ms}
  @starting-style{.todo-panel,.todo-panel li{transform:none}}
  .options-collapse,.browser-panel-enter-active,.browser-panel-leave-active{transition-duration:1ms}
  .browser-panel-enter-from,.browser-panel-leave-to{transform:none}
  .browser-status.on i{animation:none}
  .ws-group{transition:none}
  .ws-toggle{transition:none}
  .ws-sessions,.ws-group.collapsed .ws-sessions{transition:none}
  .ws-sessions .session-row{transition:opacity 120ms var(--ease-emphasized)}
  @starting-style{.ws-sessions .session-row{transform:none}}
  .turn .bubble,.turn .steps>*,.turn .agent-speech,.turn .subagent-card,.turn .tool-card{transition:opacity 120ms;transition-delay:0ms}
  @starting-style{.turn .bubble,.turn .steps>*,.turn .agent-speech,.turn .subagent-card,.turn .tool-card{transform:none}}
  .state.running,.running,.agent-speech:has(.running)::after{animation:none}
  .tool-card:hover,.subagent-card:hover,.icon-btn:hover:not(:disabled),.session-card:hover:not(:disabled){transform:none}
  .transcript{scroll-behavior:auto}
}

@media(max-width:800px){.sessions{width:214px;padding:12px 10px}.transcript{padding:14px}.composer{margin:0 12px 12px}.connection-hint{display:none}.conversation-header{padding:14px 16px}.welcome{margin:30px auto 0}.turn{margin-bottom:22px}}
@media(max-width:560px){.workspace{flex-direction:column}.sessions{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input,.filter-bar,.connection{display:none}.session-list{display:flex;gap:6px;overflow-x:auto}.session-card{min-width:160px;width:160px;margin-bottom:0}.ledger-button{padding:5px;font-size:12px}}
/* ---- sidebar order toggle + session row actions ---- */
.sidebar-toggles{display:flex;align-items:center;justify-content:space-between;gap:8px}
.order-toggle{display:inline-flex;padding:2px;border-radius:999px;background:var(--md-surface-container-high)}
.order-toggle button{border:0;background:transparent;border-radius:999px;padding:4px 9px;font-size:11.5px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}
.order-toggle button.chosen{background:var(--md-primary);color:var(--md-on-primary,#fff)}
.session-row{position:relative}
.session-row .row-actions{position:absolute;top:6px;right:6px;display:none;align-items:center;gap:8px}
.session-row:hover .row-actions,
.session-row:focus-within .row-actions{display:inline-flex}
@media (hover: none){.session-row .row-actions{display:inline-flex}}
.row-actions button{position:relative;width:24px;height:24px;border:0;border-radius:7px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:13px;line-height:1}
.row-actions button::before{content:'';position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%)}
.row-actions button:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}
.row-actions select{max-width:78px;height:24px;border:0;border-radius:7px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12px}
.session-row.selected .session-card{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}

/* ---- workspace groups (dsh-style) ---- */
.ws-group{margin:0 0 10px;border:1px solid var(--md-outline-variant);border-radius:12px;overflow:hidden;background:var(--md-surface-container-lowest);display:grid;grid-template-rows:auto 1fr;transition:grid-template-rows var(--duration-medium) var(--ease-emphasized)}
.ws-group.collapsed{opacity:.92;grid-template-rows:auto 0fr}
.ws-head{display:flex;align-items:center;gap:6px;padding:8px 8px 8px 6px;background:var(--md-surface-container);cursor:grab}
.ws-head.static{cursor:default}
.ws-head:active{cursor:grabbing}
.ws-toggle{position:relative;width:22px;height:22px;flex:none;display:grid;place-items:center;border:0;background:transparent;color:var(--md-on-surface-variant);transition:transform var(--duration-medium) var(--ease-emphasized)}
.ws-toggle::before{content:'';position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%)}
.ws-group.collapsed .ws-toggle{transform:rotate(-90deg)}
.ws-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650;font-size:13.5px}
.ws-missing{color:var(--md-error);font-style:normal;font-weight:700;margin-left:5px}
.ws-count{flex:none;min-width:20px;height:20px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-size:11.5px;font-weight:700}
.ws-actions{display:inline-flex;gap:22px;flex:none}
.ws-actions button{position:relative;width:22px;height:22px;border:0;border-radius:6px;background:transparent;color:var(--md-on-surface-variant);font-size:13px;line-height:1}
.ws-actions button::before{content:'';position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%)}
.ws-actions button:hover:not(:disabled){background:var(--md-surface-container-highest)}
.ws-actions button.danger:hover:not(:disabled){color:var(--md-error)}
.ws-sessions{padding:8px;overflow:hidden;min-height:0;visibility:visible;transition:visibility 0s linear 0s}
.ws-group.collapsed .ws-sessions{visibility:hidden;transition:visibility 0s linear var(--duration-medium)}
.ws-sessions .session-row{transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}
@starting-style{.ws-sessions .session-row{opacity:0;transform:translateY(-4px)}}
.ws-sessions .session-card{margin-bottom:6px}
.ws-empty{margin:4px 6px}
.ws-more{margin:2px 0 4px;border:0;background:transparent;color:var(--md-primary);font-size:12.5px;font-weight:600;cursor:pointer}
.ws-add{width:100%;margin-top:2px;padding:9px;border:1.5px dashed var(--md-outline-variant);border-radius:10px;background:transparent;color:var(--md-on-surface-variant);font-size:13px;font-weight:600}
.ws-add:hover:not(:disabled){border-color:var(--md-primary);color:var(--md-primary)}
</style>
