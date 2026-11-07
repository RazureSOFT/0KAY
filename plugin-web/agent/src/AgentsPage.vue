<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAgentsStore, type TaskRow } from './store'
import MarkdownContent from './MarkdownContent.vue'
import ToolStepCard from './ToolStepCard.vue'
import DirectoryDialog from './DirectoryDialog.vue'
import FileViewer from './FileViewer.vue'
import ModelThinkingPicker from './ModelThinkingPicker.vue'
import GitPanel from './GitPanel.vue'
import ThinkChain from './ThinkChain.vue'
import IntentStrip from './IntentStrip.vue'
import { AppSelect, useConfirm, i18n } from '@0kay/host'
import { locale, syncLocale } from './locale'
const t = (key: string, named?: Record<string, unknown>) => i18n.global.t(key, named ?? {})
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
  } catch (e: any) { attachError.value = friendlyError(e?.message || String(e)) }
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

const dragDepth = ref(0)
const dropping = computed(() => dragDepth.value > 0)
function hasFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types || []).includes('Files')
}
function onDragEnter(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  dragDepth.value += 1
}
function onDragOver(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}
function onDragLeave(event: DragEvent) {
  if (!hasFiles(event)) return
  dragDepth.value = Math.max(0, dragDepth.value - 1)
}
async function onDropFiles(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  dragDepth.value = 0
  const files = Array.from(event.dataTransfer?.files || [])
  if (!files.length || busy.value || session.value?.state === 'archived') return
  await addFiles(files)
}
const dockOpen = ref((() => {
  try { const saved = localStorage.getItem('0kay.agent.dock.open'); if (saved === '1' || saved === '0') return saved === '1' } catch { }
  return (window.innerWidth || 1280) > 800
})())
function toggleDock() {
  dockOpen.value = !dockOpen.value
  try { localStorage.setItem('0kay.agent.dock.open', dockOpen.value ? '1' : '0') } catch { }
}
function dismissError() { error.value = ''; store.error = '' }
const composerArea = ref<HTMLTextAreaElement | null>(null)
function autosizeComposer() {
  const el = composerArea.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}
watch(draft, () => void nextTick(autosizeComposer))
onMounted(autosizeComposer)
const search = ref('')
const source = ref('all')
const taskKind = ref<'plan' | 'agent' | 'work'>('agent')
const agentSubKind = ref('general')
const duetMode = ref<'on' | 'off'>('off')
const agentMode = computed(() => (taskKind.value === 'agent' ? agentSubKind.value : taskKind.value))
const kindChoices = computed(() => [
  { value: 'plan' as const, label: 'Plan', tag: t('agent.page.kindPlanTag'), desc: t('agent.page.kindPlanDesc') },
  { value: 'agent' as const, label: 'Agent', tag: t('agent.page.kindAgentTag'), desc: t('agent.page.kindAgentDesc') },
  { value: 'work' as const, label: 'Work', tag: t('agent.page.kindWorkTag'), desc: t('agent.page.kindWorkDesc') },
])
const subKindOptions = computed(() => [
  { value: 'general', label: t('agent.page.modeGeneral') },
  { value: 'code', label: t('agent.page.modeCode') },
  { value: 'code_explore', label: t('agent.page.modeCodeExplore') },
  { value: 'research', label: t('agent.page.modeResearch') },
  { value: 'science', label: t('agent.page.modeScience') },
])
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
const minimalMode = ref<'on'|'off'>('off')
const folderName = ref('')
async function createFolder(name = folderName.value) {
  if(!String(name).trim() || !executor.value || browserBusy.value)return
  browserBusy.value=true;browserError.value=''
  try {const response=await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent(executor.value.plugin_id)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:directory.value.path,name:String(name).trim()})});if(!response.ok)throw new Error(await response.text());const result=await response.json();folderName.value='';await browse(result.path)}
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
const compacting = ref(false)
let hostTimer: ReturnType<typeof setInterval> | null = null
let browseRequest = 0
let browserExecutor = ''
let hostFetching = false
const followLatest = ref(true)
function rememberEditor(id = selectedId.value) {
  try { localStorage.setItem(`0kay.agent.editor:${id}`, JSON.stringify({draft:draft.value,mode:agentMode.value,kind:taskKind.value,duet:duetMode.value,...options()})) } catch { }
}
function closeBrowser() { browseRequest++;browserOpen.value=false;browserBusy.value=false;workspacePick.value=false }
function onEscape(event: KeyboardEvent) {if(event.key==='Escape' && browserOpen.value) closeBrowser()}
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
const slashCommands = [{ name: 'compact', description: t('agent.page.slashCompact') }]
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
  if (!executor.value) {error.value=t('agent.page.selectOnlineExecutor');return}
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
  busy.value=true;compacting.value=true;error.value='';compactNotice.value=t('agent.page.compacting')
  try {
    const response=await fetch('/api/agent/compact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:target,model_id:modelId.value})})
    if(!response.ok) throw new Error(await response.text())
    await response.json();await store.fetchAgents()
    compactNotice.value=t('agent.page.compacted');if(draft.value.trim()==='/compact') draft.value=''
  } catch(e:any) {error.value=e.message;compactNotice.value=''}
  finally {busy.value=false;compacting.value=false}
}
const ringStyle=(value:number)=>({background:`conic-gradient(from -90deg, var(--md-primary) ${Math.max(0,Math.min(100,value))}%, var(--md-outline-variant) 0)`})
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
const browserStatus = ref<{ enabled: boolean; available: boolean; running: boolean; url: string; title: string; tabs: number; canGoBack?: boolean; canGoForward?: boolean; viewportWidth?: number; viewportHeight?: number; error?: string } | null>(null)
let browserTimer: ReturnType<typeof setInterval> | null = null
const workspaceError = ref('')
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
  if (!b) return t('agent.page.browserOffline')
  if (!b.enabled) return t('agent.page.browserDisabled')
  if (b.running) return `${t('agent.page.browserRunning')}${b.tabs ? ` · ${b.tabs} ${t('agent.page.tabs')}` : ''}`
  if (b.available) return t('agent.page.browserIdle')
  return t('agent.page.browserUnavailable')
})
const browserTooltip = computed(() => {
  const b = browserStatus.value
  if (!b) return t('agent.page.browserStatusUnavailable')
  const parts = [
    b.enabled ? t('agent.page.browserStateEnabled') : t('agent.page.browserStateDisabled'),
    b.available ? t('agent.page.browserStateAvailable') : t('agent.page.browserStateNotInstalled'),
    b.running ? t('agent.page.browserStateRunning') : t('agent.page.browserStateStopped'),
  ]
  if (b.url) parts.push(b.url)
  return parts.join(' · ')
})
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
  } catch { }
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
const clampv = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
function loadBrowserPos() {
  try { const p = JSON.parse(localStorage.getItem('0kay.agent.browser.pos') || ''); if (p && Number.isFinite(p.x)) return { x: p.x, y: p.y } } catch { }
  return { x: Math.max(16, (window.innerWidth || 1280) - 560), y: Math.max(16, (window.innerHeight || 800) - 520) }
}
function loadBrowserSize() {
  try { const s = JSON.parse(localStorage.getItem('0kay.agent.browser.size') || ''); if (s && Number.isFinite(s.w)) return { w: s.w, h: s.h } } catch { }
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
function onDragEnd() { dragState = null; window.removeEventListener('pointermove', onDragMove); window.removeEventListener('pointerup', onDragEnd); try { localStorage.setItem('0kay.agent.browser.pos', JSON.stringify(browserPos.value)) } catch { } }
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
function onResizeEnd() { resizeState = null; window.removeEventListener('pointermove', onResizeMove); window.removeEventListener('pointerup', onResizeEnd); try { localStorage.setItem('0kay.agent.browser.size', JSON.stringify(browserSize.value)) } catch { } }
const browserImg = ref<HTMLImageElement | null>(null)
function sendBrowserInput(payload: Record<string, any>) {
  const body = { ...payload, ...(executor.value?.plugin_id ? { executor_id: executor.value.plugin_id } : {}) }
  void fetch('/api/agent/browser/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) }).catch(() => { })
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
  if (now - lastMoveAt < 32) return
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
  if (event.key === 'Escape' || event.ctrlKey || event.altKey || event.metaKey) return
  const key = event.key
  if (key.length === 1 && !event.ctrlKey && !event.metaKey) sendBrowserInput({ action: 'type', text: key })
  else if (key !== 'Shift' && key !== 'Control' && key !== 'Alt' && key !== 'Meta') sendBrowserInput({ action: 'press', key: key === ' ' ? 'space' : key })
  event.preventDefault()
}
function makeWindowHandlers(posRef: any, sizeRef: any, posKey: string, sizeKey: string) {
  let drag: { dx: number; dy: number } | null = null
  let rs: { sx: number; sy: number; w: number; h: number } | null = null
  const onMove = (e: PointerEvent) => { if (drag) posRef.value = { x: clampv(e.clientX - drag.dx, 0, window.innerWidth - 120), y: clampv(e.clientY - drag.dy, 0, window.innerHeight - 48) } }
  const onUp = () => { drag = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); try { localStorage.setItem(posKey, JSON.stringify(posRef.value)) } catch { } }
  const onResizeMove = (e: PointerEvent) => { if (rs) sizeRef.value = { w: clampv(rs.w + (e.clientX - rs.sx), 320, 1600), h: clampv(rs.h + (e.clientY - rs.sy), 240, 1000) } }
  const onResizeUp = () => { rs = null; window.removeEventListener('pointermove', onResizeMove); window.removeEventListener('pointerup', onResizeUp); try { localStorage.setItem(sizeKey, JSON.stringify(sizeRef.value)) } catch { } }
  return {
    down: (e: PointerEvent) => { if ((e.target as HTMLElement).closest('button,input,form,a')) return; drag = { dx: e.clientX - posRef.value.x, dy: e.clientY - posRef.value.y }; window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp) },
    rdown: (e: PointerEvent) => { e.preventDefault(); e.stopPropagation(); rs = { sx: e.clientX, sy: e.clientY, w: sizeRef.value.w, h: sizeRef.value.h }; window.addEventListener('pointermove', onResizeMove); window.addEventListener('pointerup', onResizeUp) },
  }
}
const gitOpen = ref(false)
const gitRoot = computed(() => (workdir.value.trim() || executor.value?.host?.workdir || ''))

interface TreeRow { name: string; path: string; dir: boolean; depth: number; expanded: boolean; loading: boolean }
const treeOpen = ref(false)
const treeRows = ref<TreeRow[]>([])
const treeLoading = ref(false)
const treeError = ref('')
const treeRootPath = ref('')
interface FileData { path: string; content: string; totalLines: number }
const fileOpen = ref(false)
const fileData = ref<FileData | null>(null)
const fileLoading = ref(false)
const fileError = ref('')
const fileDraft = ref('')
const fileSaving = ref(false)
const fileNotice = ref('')
const fileDirty = computed(() => !!fileData.value && fileDraft.value !== fileData.value.content)
type FileView = 'code' | 'markdown' | 'pdf' | 'docx' | 'pptx' | 'spreadsheet' | 'legacy' | 'text' | 'image' | 'html' | 'unsupported'
const FILE_VIEW: Record<string, FileView> = {
  md: 'markdown', markdown: 'markdown', mdown: 'markdown', mkd: 'markdown',
  pdf: 'pdf', docx: 'docx', pptx: 'pptx', docm: 'docx', pptm: 'pptx', dotx: 'docx', potx: 'pptx',
  xlsx: 'spreadsheet', xls: 'spreadsheet', xlsm: 'spreadsheet', xlsb: 'spreadsheet', ods: 'spreadsheet',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image', bmp: 'image', avif: 'image', ico: 'image',
  doc: 'legacy', dot: 'legacy', wps: 'legacy', ppt: 'legacy', pot: 'legacy', pps: 'legacy',
  html: 'html', htm: 'html',
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
async function openFilePreview(path: string, opts: { confirmDiscard?: boolean; auto?: boolean } = {}) {
  if (!path) return
  if (autoCloseTimer) { clearTimeout(autoCloseTimer); autoCloseTimer = null }
  autoOpened = false
  if (followPath.value && followPath.value !== path) stopFileFollow()
  if (fileDirty.value) {
    if (!opts.confirmDiscard) return
    const same = fileData.value?.path === path
    const ok = await confirm({
      title: t('agent.page.discardChanges'),
      message: same ? t('agent.page.reloadLoseChanges') : t('agent.page.openOtherLoseChanges'),
      confirmLabel: t('agent.page.discard'), danger: true,
    })
    if (!ok) return
  }
  const view = viewForFile(path)
  const request = ++fileRequest
  autoOpened = !!opts.auto
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
const followPath = ref('')
const followTask = ref('')
const fileFollowing = computed(() => !!followPath.value && fileOpen.value && !fileDirty.value)
const FOLLOW_INTERVAL_MS = 320
const FOLLOW_MAX_MS = 30_000
let followTimer: ReturnType<typeof setInterval> | null = null
let followStartedAt = 0
let followBusy = false

const AUTO_CLOSE_MS = 1_600
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null
let autoOpened = false
function cancelAutoClose() {
  if (autoCloseTimer) { clearTimeout(autoCloseTimer); autoCloseTimer = null }
  autoOpened = false
}
function scheduleAutoClose() {
  if (!autoOpened || fileDirty.value || fileSaving.value) return
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
  autoCloseTimer = setTimeout(() => {
    autoCloseTimer = null
    if (!autoOpened || fileDirty.value || fileSaving.value) return
    autoOpened = false
    stopFileFollow()
    fileOpen.value = false
  }, AUTO_CLOSE_MS)
}

function editorInput(): HTMLTextAreaElement | null {
  return document.querySelector('.file-panel .code-editor-input') as HTMLTextAreaElement | null
}
function applyLiveText(text: string) {
  if (!fileData.value) return
  fileError.value = ''
  const input = editorInput()
  const scrollTop = input?.scrollTop ?? 0
  const pinned = input ? input.scrollHeight - input.scrollTop - input.clientHeight < 24 : true
  fileData.value = { ...fileData.value, content: text, totalLines: text.split(/\r?\n/).length }
  fileDraft.value = text
  void nextTick(() => {
    const next = editorInput()
    if (!next) return
    next.scrollTop = pinned ? next.scrollHeight : scrollTop
  })
}
async function readFileSnapshot(path: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/agent/file?${treeQuery({ path, limit: '4000' })}`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = await res.json()
    const text = typeof data.content === 'string' ? data.content : ''
    return text.endsWith('\uFFFD') ? text.slice(0, -1) : text
  } catch { return null }
}
function startFileFollow(path: string, taskId: string) {
  if (!path) return
  stopFileFollow()
  followPath.value = path
  followTask.value = taskId
  followStartedAt = Date.now()
  followTimer = setInterval(() => { void pollFollowedFile() }, FOLLOW_INTERVAL_MS)
}
function stopFileFollow() {
  if (followTimer) { clearInterval(followTimer); followTimer = null }
  followPath.value = ''
  followTask.value = ''
}
async function settleFileFollow() {
  const path = followPath.value
  const live = !!path && fileOpen.value && fileData.value?.path === path && !fileDirty.value && !fileSaving.value
  stopFileFollow()
  if (!live || !path) return
  const text = await readFileSnapshot(path)
  if (text !== null && text !== fileDraft.value && !fileDirty.value && fileData.value?.path === path) applyLiveText(text)
  scheduleAutoClose()
}
async function pollFollowedFile() {
  if (followBusy) return
  const path = followPath.value
  if (!path) return
  if (Date.now() - followStartedAt > FOLLOW_MAX_MS) { void settleFileFollow(); return }
  if (!fileOpen.value) { stopFileFollow(); return }
  if (fileDirty.value || fileSaving.value) { stopFileFollow(); return }
  if (!fileData.value || fileLoading.value) return
  if (fileData.value.path !== path) { stopFileFollow(); return }
  if (!(fileView.value === 'code' || fileView.value === 'markdown')) return
  followBusy = true
  try {
    const text = await readFileSnapshot(path)
    if (text === null || text === fileDraft.value) return
    if (followPath.value !== path || !fileOpen.value || fileDirty.value) return
    if (fileData.value?.path !== path) return
    applyLiveText(text)
  } finally { followBusy = false }
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
    fileNotice.value = t('agent.page.saved')
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
    const ok = await confirm({ title: t('agent.page.discardChanges'), message: t('agent.page.closeLoseChanges'), confirmLabel: t('agent.page.discard'), danger: true })
    if (!ok) return
  }
  stopFileFollow()
  cancelAutoClose()
  fileOpen.value = false
}

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
  termPush('note', t('agent.page.switchedTo', { target: `${agent?.host?.hostname || id}${termCwd.value ? ' · ' + termCwd.value : ''}` }))
  void termScroll()
}
function safeUrl(value: unknown): string {
  const text = String(value ?? '').trim()
  return /^https?:\/\//i.test(text) ? text : ''
}

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
  // A UNC base (\\server\share) lost its leading slashes to the empty-part
  // filter, turning server shares into local paths.
  if (/^\\\\/.test(combined)) return `\\\\${out}`
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
  if (!termExecutorId.value) { termPush('err', t('agent.page.chooseExecutorFirst')); await termScroll(); return }
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
    if (data.exitCode !== undefined && data.exitCode !== 0) termPush('note', t('agent.page.exitCode', { code: data.exitCode }))
    if (data.truncated) termPush('note', t('agent.page.outputTruncated'))
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
function loadBrowserPosKey(key: string) { try { const p = JSON.parse(localStorage.getItem(key) || ''); if (p && Number.isFinite(p.x)) return { x: p.x, y: p.y } } catch { } return null }
function loadBrowserSizeKey(key: string) { try { const s = JSON.parse(localStorage.getItem(key) || ''); if (s && Number.isFinite(s.w)) return { w: s.w, h: s.h } } catch { } return null }
function treeQuery(extra: Record<string, string>) {
  const p = new URLSearchParams(extra)
  if (executor.value?.plugin_id) p.set('executor_id', executor.value.plugin_id)
  return p.toString()
}
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
watch([workdir, executorId], () => { if (treeOpen.value) void treeReload(treeRootPathFor()) })
const usageOpen = ref(false)
const usagePos = ref(loadBrowserPosKey('0kay.agent.usage.pos') || { x: Math.max(16, (window.innerWidth || 1280) - 336), y: 64 })
const usageSize = ref(loadBrowserSizeKey('0kay.agent.usage.size') || { w: 300, h: 300 })
const usageHandlers = makeWindowHandlers(usagePos, usageSize, '0kay.agent.usage.pos', '0kay.agent.usage.size')
const onUsageDown = usageHandlers.down
const onUsageResizeDown = usageHandlers.rdown
const usagePanelStyle = computed(() => ({ translate: `${usagePos.value.x}px ${usagePos.value.y}px`, width: `${usageSize.value.w}px`, height: `${usageSize.value.h}px` }))
function toggleUsage() { usageOpen.value = !usageOpen.value; if (usageOpen.value) void fetchContextUsage() }

// ---- the task detail (ARTEX's 任务 page) ------------------------------------
// Tasks live in the left sidebar — the list is the sidebar's second tab, and
// selecting one swaps the list for its detail in place. No floating window,
// no dock button: the chat column keeps running while you read the graph. The
// detail draws the same session graph the agent writes to (recon_graph, keyed
// by session), so the view cannot disagree with the model.

interface ReconAsset { id: string; kind: string; key: string }
interface ReconNode { id: string; kind: string; text: string; status: string; assetIds: string[]; derivedFrom: string[]; priority?: number }
interface ReconEdge { src: string; rel: string; dst: string }
const reconAssets = ref<ReconAsset[]>([])
const reconNodes = ref<ReconNode[]>([])
const reconEdges = ref<ReconEdge[]>([])

async function fetchRecon() {
  if (!selectedId.value) { resetRecon(); return }
  const response = await fetch('/api/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'recon_graph', args: JSON.stringify({ action: 'export' }), session_id: selectedId.value }),
  })
  const data = await response.json()
  if (!data?.success) throw new Error(data?.error || 'recon_graph export failed')
  const payload = typeof data.result === 'string' ? JSON.parse(data.result) : data.result
  reconAssets.value = Array.isArray(payload?.assets) ? payload.assets : []
  reconNodes.value = Array.isArray(payload?.nodes) ? payload.nodes : []
  reconEdges.value = Array.isArray(payload?.edges) ? payload.edges : []
}

function resetRecon() {
  reconAssets.value = []
  reconNodes.value = []
  reconEdges.value = []
}

function onTasksRefresh() { void pollAssessments().catch(() => {}); if (taskSelectedId.value) void loadTaskDetail().catch(() => {}) }

const RECON_LIMIT = 12
// ---- the layered drawing ---------------------------------------------------
// The original draws its exploration graph left to right along provenance
// depth, with finished regions folded under their digest. Same idea here: a
// column is the longest upstream path, rows stack within a column, and the
// members of an active digest collapse into that digest node. Goals end up at
// the right edge because a finding proves a goal — proof flows outward.
const RECON_NODE_W = 128
const RECON_NODE_H = 34
const RECON_GAP_X = 34
const RECON_GAP_Y = 10
const RECON_COL_W = RECON_NODE_W + RECON_GAP_X
const RECON_ROW_H = RECON_NODE_H + RECON_GAP_Y
const RECON_MAX_NODES = 160
const RECON_REL_GLYPH: Record<string, string> = { spawns: '＋', derived_from: '↳', yields: '→', proves: '✓', covers: '⊃' }

interface ReconLayoutNode extends ReconNode { x: number; y: number; l1: string; l2: string; members: number }
/** The layered drawing — the task detail's 探索链路 tab draws from this. */
function computeReconLayout(nodes: ReconNode[], edges: ReconEdge[], expanded: Set<string>) {
  if (!nodes.length) return null

  const folded = new Set<string>()
  const memberCount = new Map<string, number>()
  for (const digest of nodes) {
    if (digest.kind !== 'digest' || digest.status !== 'active') continue
    if (expanded.has(digest.id)) continue
    let count = 0
    for (const edge of edges) {
      if (edge.src === digest.id && edge.rel === 'covers') { folded.add(edge.dst); count += 1 }
    }
    if (count) memberCount.set(digest.id, count)
  }
  const visible = nodes.filter((node) => !(node.kind === 'digest' && node.status === 'superseded') && !folded.has(node.id))
  if (!visible.length || visible.length > RECON_MAX_NODES) return null

  const ids = new Set(visible.map((node) => node.id))
  const up = new Map<string, string[]>()
  for (const edge of edges) {
    if (edge.rel === 'covers' || !ids.has(edge.src) || !ids.has(edge.dst)) continue
    if (!up.has(edge.dst)) up.set(edge.dst, [])
    up.get(edge.dst)!.push(edge.src)
  }

  const colOf = new Map<string, number>()
  const visiting = new Set<string>()
  const depth = (id: string): number => {
    const memo = colOf.get(id)
    if (memo != null) return memo
    if (visiting.has(id)) return 0
    visiting.add(id)
    const parents = up.get(id) || []
    const col = parents.length ? Math.max(...parents.map(depth)) + 1 : 0
    visiting.delete(id)
    colOf.set(id, col)
    return col
  }
  for (const node of visible) depth(node.id)

  const layout: ReconLayoutNode[] = []
  const rows = new Map<number, number>()
  for (const node of visible) {
    const col = colOf.get(node.id) || 0
    const row = rows.get(col) || 0
    rows.set(col, row + 1)
    const text = node.text || ''
    const cut = text.length > 26 ? `${text.slice(0, 25)}…` : text
    const mid = Math.ceil(cut.length / 2)
    layout.push({
      ...node,
      x: col * RECON_COL_W + 8,
      y: row * RECON_ROW_H + 8,
      l1: cut.slice(0, mid),
      l2: cut.slice(mid),
      members: memberCount.get(node.id) || 0,
    })
  }
  const cols = Math.max(...[...rows.keys()], 0) + 1
  const rowCount = Math.max(...[...rows.values()], 0)
  const positions = new Map(layout.map((node) => [node.id, node]))
  const drawn = edges
    .filter((edge) => edge.rel !== 'covers' && positions.has(edge.src) && positions.has(edge.dst))
    .map((edge) => {
      const from = positions.get(edge.src)!
      const to = positions.get(edge.dst)!
      const x1 = from.x + RECON_NODE_W
      const y1 = from.y + RECON_NODE_H / 2
      const x2 = to.x
      const y2 = to.y + RECON_NODE_H / 2
      const bend = Math.max(RECON_GAP_X / 2, 12)
      return {
        rel: edge.rel,
        d: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
        // Midpoint of the cubic at t=0.5 collapses to the chord midpoint here.
        lx: (x1 + x2) / 2,
        ly: (y1 + y2) / 2,
        label: RECON_REL_GLYPH[edge.rel] || '',
      }
    })
  return {
    nodes: layout,
    edges: drawn,
    width: cols * RECON_COL_W + 8,
    height: rowCount * RECON_ROW_H + 8,
  }
}
// ---- ARTEX-style canvas: drag to pan, wheel to zoom -------------------------
const reconZoom = ref(1)
const reconPan = ref({ x: 0, y: 0 })
const expandedDigests = ref(new Set<string>())
let reconDrag: { x: number; y: number; panX: number; panY: number; moved: boolean } | null = null

function onReconCanvasDown(event: PointerEvent) {
  if (event.button !== 0) return
  const target = event.currentTarget as HTMLElement
  reconDrag = { x: event.clientX, y: event.clientY, panX: reconPan.value.x, panY: reconPan.value.y, moved: false }
  target.setPointerCapture(event.pointerId)
}
function onReconCanvasMove(event: PointerEvent) {
  if (!reconDrag) return
  const dx = event.clientX - reconDrag.x
  const dy = event.clientY - reconDrag.y
  if (Math.abs(dx) + Math.abs(dy) > 4) reconDrag.moved = true
  reconPan.value = { x: reconDrag.panX + dx, y: reconDrag.panY + dy }
}
function onReconCanvasUp(event: PointerEvent) {
  const target = event.currentTarget as HTMLElement
  if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId)
  reconDrag = null
}
function onReconCanvasWheel(event: WheelEvent) {
  event.preventDefault()
  const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15
  reconZoom.value = Math.min(3, Math.max(0.25, reconZoom.value * factor))
}
function reconFit() {
  const canvas = document.querySelector('.recon-canvas') as HTMLElement | null
  const layout = taskLayout.value
  if (!canvas || !layout) return
  const scale = Math.min(canvas.clientWidth / layout.width, canvas.clientHeight / layout.height, 1)
  reconZoom.value = Math.max(0.25, Math.round(scale * 100) / 100)
  reconPan.value = { x: 0, y: 0 }
}

// ---- the task tab: ARTEX's task list, fed by the assessments tool -----------
interface TaskRow {
  id: string
  objective: string
  status: string
  createdAt: string
  endedAt?: string
  stopped?: string
  error?: string
  goalTexts: Array<{ id: string; text: string }>
  scope: string[]
  report?: { rounds: number; intents: number; facts: number; findings: number; proven: boolean; pct: number | null }
}
interface TaskDetail {
  state: TaskRow & { activity: Array<{ at: string; round: number; kind: string; text: string }>; targets: string[]; coverageArg?: number; constraints: string[] }
  live?: {
    coverage: { total: number; tested: number; scope: { rows: number; denominator: number; pct: number | null } }
    goals: Array<{ id: string; text: string; status: string }>
    openIntents: Array<{ id: string; text: string }>
    runningIntents: number
    findings: Array<{ id: string; text: string; status: string }>
    digests: number
  }
}
const taskDetail = ref<TaskDetail | null>(null)
const taskSelectedId = ref<string | null>(null)
const taskShowNew = ref(false)
const taskCreating = ref(false)
const taskError = ref('')
const newTaskObjective = ref('')
const newTaskTargets = ref('')
const newTaskCoverage = ref('')
const newTaskModel = ref('')
const hintDraft = ref('')

async function runAssessments(args: Record<string, any>): Promise<any> {
  if (!selectedId.value) throw new Error(t('agent.page.taskNeedSession'))
  // Polls fail fast so a gated or stale agent cannot stack hung requests.
  // create/report run the goals phase / render a file first and legitimately
  // take longer, so they get their own budget.
  const long = args.action === 'create' || args.action === 'report'
  const response = await fetch('/api/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: 'assessments', args: JSON.stringify(args), session_id: selectedId.value }),
    signal: AbortSignal.timeout(long ? 180_000 : 8000),
  })
  const data = await response.json()
  if (!data?.success) throw new Error(data?.error || 'assessments call failed')
  return typeof data.result === 'string' ? JSON.parse(data.result) : data.result
}
async function loadTaskDetail() {
  if (!taskSelectedId.value) return
  taskDetail.value = await runAssessments({ action: 'get', id: taskSelectedId.value })
}
/** Leave the task pane and go back to the conversation it was opened from. */
function closeTask(): void {
  taskSelectedId.value = null
  taskDetail.value = null
}

async function openTask(id: string) {
  taskSelectedId.value = id
  taskDetail.value = null
  hintDraft.value = ''
  taskShowNew.value = false
  taskDetailTab.value = 'overview'
  await loadTaskDetail().catch(() => {})
}
// Every action shows its failure INLINE: an error escaping an event handler
// reaches the host's error boundary and takes the whole page down with it.
async function controlTask(operation: string) {
  if (!taskSelectedId.value) return
  taskError.value = ''
  try {
    await runAssessments({ action: 'control', id: taskSelectedId.value, operation })
    await Promise.all([pollAssessments().catch(() => {}), loadTaskDetail().catch(() => {})])
  } catch (e: any) {
    taskError.value = e?.message || String(e)
  }
}
async function sendHint() {
  const text = hintDraft.value.trim()
  if (!taskSelectedId.value || !text) return
  taskError.value = ''
  try {
    hintDraft.value = ''
    // `say` instead of `hint`: this input talks to the running agent (it lands in
    // the constraints the next planning round re-reads), which is what the box
    // promises. Graph-level hints stay available through the tool.
    await runAssessments({ action: 'say', id: taskSelectedId.value, text })
    await loadTaskDetail().catch(() => {})
  } catch (e: any) {
    taskError.value = e?.message || String(e)
  }
}
async function createTask() {
  const objective = newTaskObjective.value.trim()
  const targets = newTaskTargets.value.split(/[\n,]+/).map((entry) => entry.trim()).filter(Boolean)
  if (!objective || !targets.length) return
  taskError.value = ''
  if (!selectedId.value) { taskError.value = t('agent.page.taskNeedSession'); return }
  taskCreating.value = true
  try {
    const created = await runAssessments({
      action: 'create',
      objective,
      targets,
      ...(newTaskCoverage.value ? { coverage: Number(newTaskCoverage.value) } : {}),
      ...(newTaskModel.value ? { model: newTaskModel.value } : {}),
      language: locale.value.startsWith('zh') ? 'zh' : 'en',
    })
    newTaskObjective.value = ''; newTaskTargets.value = ''; newTaskCoverage.value = ''; newTaskModel.value = ''
    taskShowNew.value = false
    await pollAssessments().catch(() => {})
    if (created?.id) await openTask(created.id)
  } catch (e: any) {
    taskError.value = e?.message || String(e)
  } finally {
    taskCreating.value = false
  }
}
function deleteTask(id: string) {
  if (taskSelectedId.value === id) { taskSelectedId.value = null; taskDetail.value = null }
  void runAssessments({ action: 'control', id, operation: 'delete' }).then(() => pollAssessments()).catch(() => {})
}
const taskPercent = computed(() => {
  const live = taskDetail.value?.live
  if (!live) return null
  if (live.coverage.scope.pct != null) return live.coverage.scope.pct
  return live.coverage.total ? Math.round((live.coverage.tested / live.coverage.total) * 100) : 0
})

// ---- the task page tabs (ARTEX's task detail) -------------------------------
type TaskDetailTab = 'sessions' | 'overview' | 'graph' | 'board' | 'findings' | 'assets' | 'approvals' | 'report'
const taskDetailTab = ref<TaskDetailTab>('overview')
// 探索链路 draws the session graph — the same recon_graph export the agent
// writes to, laid out along provenance depth.
const taskLayout = computed(() => computeReconLayout(reconNodes.value, reconEdges.value, expandedDigests.value))

const taskAssets = computed(() => {
  // tested = anchored by a fact or finding in the fetched graph
  const tested = new Set<string>()
  for (const node of reconNodes.value) {
    if (node.kind !== 'fact' && node.kind !== 'finding') continue
    for (const assetId of node.assetIds) tested.add(assetId)
  }
  return reconAssets.value.map((asset) => ({ ...asset, tested: tested.has(asset.id) }))
})
const taskAssetsTested = computed(() => taskAssets.value.filter((asset) => asset.tested))
const taskAssetsUntested = computed(() => taskAssets.value.filter((asset) => !asset.tested))

const taskPlannerSessions = computed(() => (taskDetail.value?.live?.sessions || []).filter((s) => s.kind === 'planner').slice(-12).reverse())
const taskWorkerSessions = computed(() => (taskDetail.value?.live?.sessions || []).filter((s) => s.kind === 'worker').slice(-40).reverse())
const taskSystemSessions = computed(() => (taskDetail.value?.live?.sessions || []).filter((s) => s.kind === 'system').slice(-12).reverse())
const taskBoard = computed(() => [...(taskDetail.value?.state.activity || [])].reverse().slice(0, 80))

function fmtTokens(n: number): string {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

interface TaskApproval { id: string; tool: string; args?: string; cwd?: string; created_at?: string }
const taskApprovals = ref<TaskApproval[]>([])
async function fetchTaskApprovals() {
  if (!selectedId.value) { taskApprovals.value = []; return }
  try {
    const response = await fetch(`/api/agent/approvals?session_id=${encodeURIComponent(selectedId.value)}`, { signal: AbortSignal.timeout(8000) })
    const data = await response.json()
    taskApprovals.value = Array.isArray(data?.approvals) ? data.approvals : []
  } catch { taskApprovals.value = [] }
}
async function decideApproval(id: string, allow: boolean) {
  try {
    await fetch('/api/agent/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, allow }),
      signal: AbortSignal.timeout(8000),
    })
  } catch { /* the inbox is the source of truth; a failed decision just stays pending */ }
  void fetchTaskApprovals()
}

const taskReport = ref('')
const taskReportBusy = ref(false)

// ---- ARTEX-style task list: search + status filter + count ------------------
const taskSearch = ref('')
const taskStatusFilter = ref('')
const sidebarTab = ref<'sessions' | 'tasks'>('sessions')

/**
 * Is the right pane showing a task instead of a conversation?
 *
 * A task is a tree — planner rounds, worker intents, tool calls — and it needs
 * the width. While one is open the chat header, transcript and composer step
 * aside rather than stacking above it.
 */
const showingTask = computed(() => sidebarTab.value === 'tasks' && !!taskSelectedId.value)

/**
 * A session with nothing said in it yet.
 *
 * An empty conversation that pins the composer to the bottom of a tall pane
 * looks like a chat that lost its history. Centring the greeting and the input
 * together is what every chat product does, and it says "start here" without a
 * sentence explaining it.
 */
const isEmptyChat = computed(() =>
  !showingTask.value
  && !activeSub.value
  && !turnsLoading.value
  && turns.value.length === 0
  && !contextSummary.value
  && !currentPlan.value
  && !queuedMessages.value.length
  && !todos.value.length)

// Sidebar width, dragged and remembered. The bounds are what the layout can
// actually take: below 220 the session cards lose their titles, above 520 the
// conversation looks like a side panel.
const SIDEBAR_KEY = 'agent.sidebarWidth'
const SIDEBAR_MIN = 220
const SIDEBAR_MAX = 520
const sidebarWidth = ref(284)
const sidebarResizing = ref(false)
try {
  const saved = Number(window.localStorage.getItem(SIDEBAR_KEY))
  if (Number.isFinite(saved) && saved >= SIDEBAR_MIN && saved <= SIDEBAR_MAX) sidebarWidth.value = Math.round(saved)
} catch { }
function resetSidebarWidth(): void {
  sidebarWidth.value = 284
  try { window.localStorage.setItem(SIDEBAR_KEY, '284') } catch { }
}
function startSidebarResize(event: PointerEvent): void {
  event.preventDefault()
  sidebarResizing.value = true
  const startX = event.clientX
  const startWidth = sidebarWidth.value
  const move = (moveEvent: PointerEvent) => {
    const next = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, startWidth + (moveEvent.clientX - startX)))
    sidebarWidth.value = Math.round(next)
  }
  const up = () => {
    sidebarResizing.value = false
    try { window.localStorage.setItem(SIDEBAR_KEY, String(sidebarWidth.value)) } catch { }
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    document.body.classList.remove('resizing-sidebar')
  }
  document.body.classList.add('resizing-sidebar')
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}
// Double-click the handle snaps back: the discoverable way to undo a drag.
function onSidebarHandleDblClick(): void { resetSidebarWidth() }

// Poll while the 任务 tab is open — a scan is the one time this view matters,
// and a graph you have to refresh by hand is a report, not a view. Failures
// keep the last read.
let tasksTimer: ReturnType<typeof setInterval> | null = null
watch(sidebarTab, (tab) => {
  if (tasksTimer) { clearInterval(tasksTimer); tasksTimer = null }
  if (tab !== 'tasks') return
  void pollAssessments().catch(() => {})
  tasksTimer = setInterval(() => {
    if (document.visibilityState !== 'visible') return
    void pollAssessments().catch(() => {})
    if (taskSelectedId.value) void loadTaskDetail().catch(() => {})
    if (taskDetailTab.value === 'graph' || taskDetailTab.value === 'assets') void fetchRecon().catch(() => {})
  }, 4000)
})

// ---- 会话 tab: the grouped session tree with trace expansion ----------------
const taskSessionOpen = ref<string | null>(null)
const taskTraceSteps = ref<Array<{ action: string; detail: string; ok: boolean; at?: string }>>([])
const taskTraceLoading = ref(false)
const taskWorkerRows = computed(() => {
  const workers = (taskDetail.value?.live?.sessions || []).filter((s) => s.kind === 'worker')
  return workers.map((entry, index) => ({ ...entry, num: index + 1 }))
})
const taskPlannerRows = computed(() => (taskDetail.value?.live?.sessions || []).filter((s) => s.kind === 'planner').slice().reverse())
const taskSystemRows = computed(() => (taskDetail.value?.live?.sessions || []).filter((s) => s.kind === 'system').slice().reverse())
async function toggleSessionTrace(entry: { id: string; refId?: string; kind: string }) {
  if (taskSessionOpen.value === entry.id) { taskSessionOpen.value = null; taskTraceSteps.value = []; return }
  taskSessionOpen.value = entry.id
  taskTraceSteps.value = []
  if (entry.kind !== 'worker' || !entry.refId || !taskSelectedId.value) return
  taskTraceLoading.value = true
  try {
    const payload = await runAssessments({ action: 'trace', id: taskSelectedId.value, intent_id: entry.refId })
    taskTraceSteps.value = Array.isArray(payload?.steps) ? payload.steps : []
  } catch { taskTraceSteps.value = [] }
  finally { taskTraceLoading.value = false }
}
async function generateTaskReport(save: boolean) {
  if (!taskSelectedId.value) return
  taskReportBusy.value = true
  taskError.value = ''
  try {
    const result = await runAssessments({ action: 'report', id: taskSelectedId.value, ...(save ? {} : { preview: true }) })
    if (save && result.path) {
      taskReport.value = ''
      showToast(t('agent.page.taskReportSaved'), 4000)
    } else {
      taskReport.value = String(result.markdown || '')
    }
  } catch (e: any) {
    taskError.value = e?.message || String(e)
  } finally {
    taskReportBusy.value = false
  }
}

watch(taskDetailTab, (tab) => {
  if (tab === 'graph' || tab === 'assets') {
    // The sidebar canvas is narrow — fit the fresh graph once it lands, not the
    // stale one that was on screen when the tab was clicked.
    void fetchRecon().catch(() => {}).finally(() => {
      if (taskDetailTab.value === 'graph') void nextTick().then(() => reconFit())
    })
  }
  if (tab === 'approvals') void fetchTaskApprovals()
})
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
    minimalMode.value=saved.minimal_mode?'on':'off'
    duetMode.value=(saved.duet_mode==='1'||saved.duet===true||saved.duet==='on')?'on':'off'
    draft.value=saved.draft || ''
    if (saved.kind === 'plan' || saved.kind === 'work' || saved.kind === 'agent') { taskKind.value = saved.kind; agentSubKind.value = saved.kind === 'agent' ? (saved.mode || 'general') : agentSubKind.value }
    else if (saved.mode === 'plan' || saved.mode === 'work') { taskKind.value = saved.mode }
    else { taskKind.value = 'agent'; agentSubKind.value = saved.mode || 'general' }
  } catch { executorId.value='';workdir.value='';intensity.value=50;modelId.value='MOCR';draft.value='';taskKind.value='agent';agentSubKind.value='general';duetMode.value='off';minimalMode.value='off' }
}
// Applied at setup, not in onMounted: the refs' defaults (agent / 通用 Agent)
// would otherwise paint for one frame before the saved values land — that was
// the flash when the settings gear opened.
loadOptions()
const providerNames = ref<Record<string, string>>({})
function modelLabel(model: { id: string; provider: string; provider_id?: string; provider_name?: string }) {
  const name = model.provider_name
    || (model.provider_id ? providerNames.value[model.provider_id] : '')
    || model.provider_id || model.provider
  return `${name}/${model.id}`
}
const modelOptions = computed(() => models.value.map(model => ({ id: model.id, label: modelLabel(model) })))
/** Same list, reshaped for AppSelect, which keys on `value`. */
const modelSelectOptions = computed(() => modelOptions.value.map(option => ({ value: option.id, label: option.label })))
async function fetchModels() {
  try {
    const response = await fetch('/api/models')
    if (!response.ok) throw new Error(t('agent.page.modelCatalogHttp', { status: response.status }))
    models.value = (await response.json()).models || []
  } catch (e: any) { error.value = e.message }
  try {
    const response = await fetch('/api/providers')
    if (response.ok) {
      const providers: any[] = (await response.json()).providers || []
      const names: Record<string, string> = {}
      for (const provider of providers) if (provider.name && provider.id) names[provider.id] = provider.name
      providerNames.value = names
    }
  } catch { }
}
function options() { const level=intensity.value===0?'off':intensity.value<35?'low':intensity.value<62.5?'medium':intensity.value<87.5?'high':'max';return { executor_id: executorId.value, workdir: workdir.value.trim(), thinking_intensity: level, model_id: modelId.value, permission_mode:permissionMode.value, minimal_mode: minimalMode.value==='on', duet_mode: duetMode.value==='on'?'1':'0', language:locale.value } }
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

interface WorkspaceRow { id: string; title: string; path: string; createdAt?: string; updatedAt?: string; sessionIds?: string[]; sessions?: TaskRow[]; exists?: boolean }
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
  } catch (e) {
    // An empty list from a failed fetch reads as "no workspaces"; say so once.
    if (!workspaces.value.length) workspaceError.value = String((e as Error)?.message || e)
  }
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
/** Sessions with a task still in flight — the list marks them and floats them up. */
const runningSessionIds = computed(() => new Set(
  store.tasks.filter(row => row.session_id && ['running', 'pending'].includes(row.state)).map(row => row.session_id!),
))

/**
 * When each session last finished, so a run that just completed can sit at the
 * top for a few minutes instead of being buried under newer-but-idle sessions.
 */
const finishedAt = ref<Record<string, number>>({})
const RECENT_DONE_MS = 5 * 60 * 1000
const previousRunning = new Set<string>()
watch(runningSessionIds, (now) => {
  const stamp = Date.now()
  for (const id of previousRunning) {
    if (!now.has(id)) {
      finishedAt.value = { ...finishedAt.value, [id]: stamp }
      // A session that finished while another was selected is worth a word: the
      // run may have been long enough that the user moved on.
      if (id !== selectedId.value) {
        const row = sessions.value.find(item => item.session_id === id)
        notifyDone(row?.prompt || t('agent.page.untitledSession'))
      }
    }
  }
  previousRunning.clear()
  now.forEach(id => previousRunning.add(id))
}, { immediate: true })

const recentlyDone = (sessionId?: string) => {
  const at = finishedAt.value[sessionId || ''] || 0
  return at > 0 && Date.now() - at < RECENT_DONE_MS
}
/** '' | 'running' | 'done' — drives the dot on the session card. */
const sessionState = (item: TaskRow) => runningSessionIds.value.has(item.session_id || '')
  ? 'running'
  : recentlyDone(item.session_id) ? 'done' : ''

const arrange = (list: TaskRow[]) => {
  // Running first, then what just finished, then the user's chosen order.
  const running = list.filter(item => sessionState(item) === 'running')
  const done = list.filter(item => sessionState(item) === 'done')
    .sort((a, b) => (finishedAt.value[b.session_id!] || 0) - (finishedAt.value[a.session_id!] || 0))
  const seen = new Set([...running, ...done].map(item => item.task_id))
  const rest = list.filter(item => !seen.has(item.task_id))
  const ordered = orderMode.value === 'recent'
    ? [...rest].sort((a, b) => sessionActivity(b) - sessionActivity(a))
    : rest
  return [...running, ...done, ...ordered]
}
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
  if (!executor.value) { error.value = t('agent.page.selectOnlineExecutor'); return }
  workspacePick.value = true
  await browse('')
}
async function createIn(workspaceId: string) {
  const workspace = workspaces.value.find(row => row.id === workspaceId)
  if (workspace) { workdir.value = workspace.path; executorId.value = executor.value?.plugin_id || executorId.value }
  await create()
}
const renameOpen = ref(false)
const renameValue = ref('')
const renameTarget = ref<WorkspaceRow | null>(null)
const renameInput = ref<HTMLInputElement | null>(null)
function openRename(workspace: WorkspaceRow) {
  renameTarget.value = workspace
  renameValue.value = workspace.title
  renameOpen.value = true
  void nextTick(() => renameInput.value?.focus())
}
async function confirmRename() {
  const workspace = renameTarget.value
  const title = renameValue.value.trim()
  if (!workspace || !title) return
  try { await workspaceAction('rename', { id: workspace.id, to: title }) } catch (e: any) { error.value = e.message }
  renameOpen.value = false
}
function cancelRename() { renameOpen.value = false }
function onRenameKey(event: KeyboardEvent) { if (event.key === 'Escape') { event.preventDefault(); cancelRename() } }
async function deleteWorkspace(workspace: WorkspaceRow) {
  const ok = await confirm({
    title: t('agent.page.removeWorkspace'),
    message: t('agent.page.removeWorkspaceMessage'),
    confirmLabel: t('agent.page.remove'), danger: true,
  })
  if (!ok) return
  try { await workspaceAction('delete', { id: workspace.id }) } catch (e: any) { error.value = e.message }
}
let dragWorkspace = ''
const dragOverId = ref('')
function onGroupDragStart(id: string) { dragWorkspace = id }
function onGroupDragOver(id: string) { if (dragWorkspace && dragWorkspace !== id) dragOverId.value = id }
function onGroupDragEnd() { dragWorkspace = ''; dragOverId.value = '' }
async function onGroupDrop(targetId: string) {
  const source = dragWorkspace
  dragWorkspace = ''
  dragOverId.value = ''
  if (!source || source === targetId) return
  try { await workspaceAction('reorder', { id: source, before: targetId }) } catch (e: any) { error.value = e.message }
}
let workspaceTimer: ReturnType<typeof setInterval> | null = null
watch([executor, () => store.sessions.length], () => void fetchWorkspaces())

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
    } catch { }
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
const turnsLoading = computed(() => !!selectedId.value && store.turnsPending[selectedId.value] === true && !turns.value.length)

const editingId = ref('')
const editDraft = ref('')
const editArea = ref<HTMLTextAreaElement | null>(null)
const superseded = ref<Set<string>>(new Set())
const supersededKey = (id: string) => `0kay.agent.superseded:${id}`
function loadSuperseded(id: string) {
  try { superseded.value = new Set(JSON.parse(localStorage.getItem(supersededKey(id)) || '[]')) }
  catch { superseded.value = new Set() }
}
function markSuperseded(taskId: string) {
  const next = new Set(superseded.value)
  next.add(taskId)
  superseded.value = next
  try { localStorage.setItem(supersededKey(selectedId.value), JSON.stringify([...next])) } catch { }
}
const visibleTurns = computed(() => turns.value.filter(turn => !superseded.value.has(turn.task_id)))
function canEdit(turn: TaskRow): boolean {
  if (busy.value || active.value || session.value?.state === 'archived') return false
  const last = visibleTurns.value[visibleTurns.value.length - 1]
  return !!last && last.task_id === turn.task_id
}
function startEdit(turn: TaskRow) {
  editingId.value = turn.task_id
  editDraft.value = (turn.prompt || '').replace(/^\[thinking_intensity=\w+\]\s*/, '')
  void nextTick(() => {
    editArea.value?.focus()
    editArea.value?.setSelectionRange(editDraft.value.length, editDraft.value.length)
  })
}
function cancelEdit() { editingId.value = ''; editDraft.value = '' }
async function submitEdit(turn: TaskRow) {
  const text = editDraft.value.trim()
  if (!text || busy.value) return
  const files = turn.attachments?.length
    ? turn.attachments.map(file => ({ name: file.name, url: file.url, mime: file.mime || 'application/octet-stream', size: file.size ?? 0 }))
    : undefined
  cancelEdit()
  await send(text, files)
  markSuperseded(turn.task_id)
}
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(text: string, duration = 1600) {
  toast.value = text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, duration)
}
// Notifications pushed by the agent's session tool ride the task stream as
// `notification` rows; the store turns them into toasts, this consumes them.
watch(() => store.toasts.length, () => {
  for (const item of [...store.toasts]) {
    showToast(item.text, 5000)
    store.dismissToast(item.id)
  }
})

// ---- assessment task indicator ---------------------------------------------
// A background assessment must be visible even with the panel closed: the dock
// button carries a count while one runs, and finishing one — done, failed or
// cancelled — raises a toast, whichever tab or panel state you are in.
const assessmentRows = ref<Array<{ id: string; objective: string; status: string; createdAt: string; endedAt?: string; stopped?: string; error?: string; goalProgress?: { met: number; total: number }; findingsCount?: number }>>([])
const assessmentRowsFiltered = computed(() => {
  const q = taskSearch.value.trim().toLowerCase()
  const status = taskStatusFilter.value
  return assessmentRows.value.filter((row) => {
    if (status && row.status !== status) return false
    if (!q) return true
    return row.objective.toLowerCase().includes(q) || row.id.toLowerCase().includes(q)
  })
})
const assessmentPrev = new Map<string, string>()
let assessmentTimer: ReturnType<typeof setInterval> | null = null
const reconRunningCount = computed(() => assessmentRows.value.filter((row) => row.status === 'running').length)
async function pollAssessments() {
  if (!selectedId.value) { assessmentRows.value = []; return }
  try {
    const payload = await runAssessments({ action: 'list' })
    const rows: Array<{ id: string; objective: string; status: string; createdAt: string; endedAt?: string; stopped?: string; error?: string; goalProgress?: { met: number; total: number }; findingsCount?: number }> = Array.isArray(payload?.tasks) ? payload.tasks : []
    for (const row of rows) {
      const before = assessmentPrev.get(row.id)
      if (before === 'running' && row.status !== 'running') {
        const label = row.status === 'done'
          ? t('agent.page.taskDoneToast')
          : row.status === 'failed' ? t('agent.page.taskFailedToast') : t('agent.page.taskCancelledToast')
        showToast(`✦ ${row.objective.slice(0, 60)} — ${label}`, 6000)
      }
      assessmentPrev.set(row.id, row.status)
    }
    assessmentRows.value = rows
  } catch { /* the indicator is cosmetic; a failed poll just keeps the last state */ }
}

async function copyMessage(text?: string) {
  const value = (text || '').trim()
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    const area = document.createElement('textarea')
    area.value = value
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    try { document.execCommand('copy') } catch { }
    area.remove()
  }
  showToast(t('agent.page.copied'))
}
const active = computed(() => store.tasks.find(item => item.session_id===selectedId.value && ['agent','compact'].includes(item.kind || '') && ['running','pending'].includes(item.state)))

/** Self-reported progress of the running task, keyed by session. */
const progressBySession = computed(() => {
  const map: Record<string, { percent: number; note: string; phase: string }> = {}
  for (const row of store.tasks) {
    if (!row.session_id || typeof row.progress !== 'number') continue
    if (!['running', 'pending'].includes(row.state)) continue
    const percent = Math.max(0, Math.min(100, Math.round(Number(row.progress) || 0)))
    map[row.session_id] = { percent, note: row.note || '', phase: row.phase || '' }
  }
  return map
})
const activeProgress = computed(() => (selectedId.value ? progressBySession.value[selectedId.value] || null : null))

/** Short-lived banner: "a run finished while you were looking elsewhere". */
const doneBanner = ref('')
let doneBannerTimer: ReturnType<typeof setTimeout> | undefined
function notifyDone(title: string) {
  doneBanner.value = t('agent.page.runFinished', { title })
  if (doneBannerTimer) clearTimeout(doneBannerTimer)
  doneBannerTimer = setTimeout(() => { doneBanner.value = '' }, 6000)
}

/**
 * The plan a planning run submitted, if this session has one. It stays on the
 * task row, so reopening the session still offers the Build button.
 */
const currentPlan = computed<{ title: string; markdown: string; steps: number; demo: string } | null>(() => {
  const rows = store.tasks.filter(item => item.session_id === selectedId.value && item.plan)
  if (!rows.length) return null
  const raw = rows[rows.length - 1].plan || ''
  try {
    const parsed = JSON.parse(raw)
    if (!parsed?.markdown) return null
    return { title: parsed.title || 'Plan', markdown: String(parsed.markdown), steps: Number(parsed.steps) || 0, demo: parsed.demo_html || '' }
  } catch { return null }
})
const planOpen = ref(true)
/**
 * Reviewing a plan before building it.
 *
 * A plan is a list of steps, and the useful review is per step: "do these four,
 * not that one". Rejected steps are not deleted — they are handed to the executor
 * as open questions, so the run starts with the disagreement on the record
 * instead of silently skipping work the user actually wanted discussed.
 */
type PlanStep = { n: number; text: string }
// The alias also keeps `>>` out of the SFC parser, which reads it as a shift.
/** Long prompts and replies are clamped to four lines until asked for more. */
const expandedTurns = ref<Set<string>>(new Set())
function toggleTurn(id: string) {
  const next = new Set(expandedTurns.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedTurns.value = next
}

const planSteps = computed<PlanStep[]>(() => {
  const markdown = currentPlan.value?.markdown || ''
  const found: PlanStep[] = []
  for (const line of markdown.split(String.fromCharCode(10))) {
    const heading = /^#{2,4}\s+(.+)$/.exec(line.trim())
    const numbered = /^(\d{1,2})[.)]\s+(.+)$/.exec(line.trim())
    const text = heading ? heading[1].trim() : numbered ? numbered[2].trim() : ''
    if (!text) continue
    if (/^(问题|边界|数据|步骤|迁移|验证|风险|problem|scope|data|step|migration|verify|risk)/i.test(text)) continue
    found.push({ n: found.length + 1, text: text.replace(/[*`]/g, '').slice(0, 90) })
    if (found.length >= 12) break
  }
  return found
})

/** Steps the user vetoed, by number. Empty means "build the plan as written". */
const rejectedSteps = ref<number[]>([])
const isRejected = (n: number) => rejectedSteps.value.includes(n)
function toggleStep(n: number) {
  rejectedSteps.value = isRejected(n)
    ? rejectedSteps.value.filter((entry) => entry !== n)
    : [...rejectedSteps.value, n]
}

async function buildPlan() {
  if (!currentPlan.value || busy.value || active.value) return
  planOpen.value = false
  const vetoed = planSteps.value.filter((step) => isRejected(step.n))
  if (!vetoed.length) {
    await send(t('agent.page.planBuildMessage'))
    return
  }
  // The veto travels inside the message so every executor sees it, no matter
  // which transport carried the request.
  const note = t('agent.page.planRejectedNote', {
    steps: vetoed.map((step) => `${step.n}. ${step.text}`).join(String.fromCharCode(10)),
  })
  const gap = String.fromCharCode(10, 10)
  await send(`${t('agent.page.planBuildMessage')}${gap}${note}`)
  rejectedSteps.value = []
}
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
const todoOpen = ref(true)
watch([todos, todoDone], () => {
  todoOpen.value = !(todos.value.length > 0 && todoDone.value === todos.value.length)
})

const contextUsage = ref<{ tokens?: number; window?: number; breakdown?: Record<string, number> } | null>(null)
async function fetchContextUsage() {
  if (!selectedId.value) { contextUsage.value = null; return }
  try {
    const response = await fetch(`/api/agent/context?session_id=${encodeURIComponent(selectedId.value)}&model_id=${encodeURIComponent(modelId.value)}`)
    if (response.ok) contextUsage.value = await response.json()
  } catch { }
}
let ctxTimer: ReturnType<typeof setTimeout> | null = null
function scheduleContextUsage() { if (ctxTimer) clearTimeout(ctxTimer); ctxTimer = setTimeout(() => void fetchContextUsage(), 800) }
const fmtK = (value?: number) => `${Math.round(((value || 0) / 1000) * 10) / 10}K`
const ctxRows = computed(() => {
  const breakdown = contextUsage.value?.breakdown || {}
  const k = (value: unknown) => fmtK(Number(value) || 0)
  return [
    { key: 'system', label: t('agent.page.contextSystemPrompt'), value: k(breakdown.system) },
    { key: 'tools', label: t('agent.page.contextTools'), value: k(breakdown.tools) },
    { key: 'conversation', label: t('agent.page.contextConversation'), value: k(breakdown.conversation) },
    { key: 'mcp', label: 'MCP', value: k(breakdown.mcp) },
    { key: 'skills', label: t('agent.page.contextSkills'), value: k(breakdown.skills) },
  ]
})
const contextSummary = computed(() => {
  const done = store.tasks.filter(item => item.kind === 'compact' && item.session_id === selectedId.value && item.state === 'done' && (item.result || '').trim())
  return done.length ? done.reduce((latest, item) => (item.started_at || '') >= (latest.started_at || '') ? item : latest) : null
})
const CTX_RING_RADIUS = 8
const CTX_RING_CIRCUMFERENCE = 2 * Math.PI * CTX_RING_RADIUS
const contextRatio = computed(() => {
  const limit = Number(contextUsage.value?.window) || 0
  if (!limit) return null
  return Math.max(0, Math.min(1, (Number(contextUsage.value?.tokens) || 0) / limit))
})
const contextRingColor = computed(() => {
  const ratio = contextRatio.value
  if (ratio === null) return ''
  if (ratio > 0.95) return 'var(--md-error)'
  if (ratio > 0.8) return 'var(--md-warning)'
  return 'var(--md-primary)'
})
const stateName = (value: string) => ({ pending: t('agent.page.statePending'), running: t('agent.page.stateRunning'), done: t('agent.page.stateDone'), failed: t('agent.page.stateFailed'), cancelled: t('agent.page.stateCancelled') })[value] || value
const time = (value?: string) => value ? new Date(value).toLocaleString() : ''

const turnFinished = (turn: TaskRow) => ['done', 'failed', 'cancelled'].includes(turn.state)

/**
 * The intent ledger the agent wrote on this turn, as the gate will read it.
 *
 * Two sources, newest wins: the turn row's own `intent` column (what the agent
 * recorded), and any `intent` tool step the agent ran (what it said out loud).
 * Reading both means the strip is still right for turns recorded before the
 * column existed.
 */
function turnIntents(turn: TaskRow): { intents: any[]; rate: number; approach: string; review: any } {
  const fromRow = parseStepJson(turn.intent)
  if (fromRow && Array.isArray(fromRow.intents)) {
    return {
      intents: fromRow.intents,
      rate: Number(fromRow.completionRate) || 0,
      approach: String(fromRow.approach || ''),
      review: parseStepJson(turn.review) || null,
    }
  }
  let latest: any = null
  for (const step of steps(turn)) {
    if ((step.prompt || '').trim() !== 'intent') continue
    const parsed = parseStepJson(step.args) || parseStepJson(step.result)
    if (parsed && Array.isArray(parsed.intents)) latest = parsed
  }
  if (!latest) return { intents: [], rate: 0, approach: '', review: parseStepJson(turn.review) || null }
  const intents = latest.intents
  const score = intents.reduce((sum: number, row: any) => sum + (row.status === 'done' ? 1 : row.status === 'in_progress' ? 0.5 : 0), 0)
  return {
    intents,
    rate: intents.length ? Math.round((score / intents.length) * 100) : 0,
    approach: String(latest.approach || ''),
    review: parseStepJson(turn.review) || null,
  }
}

/** The turn a steer message belongs to: the running one, or the last one. */
const steerTarget = computed<TaskRow | null>(() => {
  const rows = store.tasks.filter(item => item.session_id === selectedId.value && (item.kind === 'agent' || item.kind === 'agent_session'))
  if (!rows.length) return null
  const running = rows.find(item => item.state === 'running' || item.state === 'pending')
  if (running) return running
  return [...rows].sort((a, b) => (b.started_at || '').localeCompare(a.started_at || ''))[0] || null
})

const steerText = ref('')
const steerBusy = ref(false)
const steerNotice = ref('')

async function sendSteer(): Promise<void> {
  const target = steerTarget.value
  const text = steerText.value.trim()
  if (!target || !text) return
  steerBusy.value = true
  steerNotice.value = ''
  try {
    await store.steerTask(target.task_id, text, target.session_id || '')
    steerText.value = ''
    steerNotice.value = t('agent.page.steerQueued')
    window.setTimeout(() => { steerNotice.value = '' }, 4000)
  } catch (error: any) {
    steerNotice.value = error?.message || String(error)
  } finally {
    steerBusy.value = false
  }
}
const turnStateIcon = (state: string) => ({ done: '✓', cancelled: '⊘', failed: '✕' } as Record<string, string>)[state] || '•'
function turnDuration(turn: TaskRow): string {
  const start = Date.parse(turn.started_at || '')
  const end = Date.parse(turn.ended_at || '')
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return ''
  const total = Math.round((end - start) / 1000)
  if (total < 60) return `${total}s`
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`
}

function looksLikeDirectory(path: string): boolean {
  return /[\\/]$/.test(path) || !/\.[A-Za-z0-9]{1,10}$/.test(path)
}
async function openPath(path: string) {
  if (!path) return
  if (looksLikeDirectory(path)) {
    treeOpen.value = true
    await treeReload(path)
    return
  }
  await openFilePreview(path, { confirmDiscard: true })
}
function modelInfo(step: TaskRow) {
  let actual = '', requested = '', reason = ''
  try {
    if (step.args) { const parsed = JSON.parse(step.args); actual = String(parsed.model || ''); requested = String(parsed.requested || ''); reason = String(parsed.fallback || '') }
  } catch { }
  return { actual, requested, reason, fellBack: !!actual && !!requested && actual !== requested }
}
function modelAnnotation(step: TaskRow): string {
  const info = modelInfo(step)
  if (info.fellBack) return t('agent.page.modelFallback', { requested: info.requested, actual: info.actual })
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
  } catch { }
  if (!text.trim()) return ''
  if (childSteps(step).some(child => child.kind === 'think' && (child.result || '').trim() === text.trim())) return ''
  return text
}
function friendlyError(message?: string) {
  if (!message) return ''
  if (/User denied permission for task/i.test(message)) return t('agent.page.permissionDeniedSubagent')
  if (/User denied permission for (\S+)/i.test(message)) return t('agent.page.permissionDeniedFor', { name: RegExp.$1 })
  if (/Permission request expired/i.test(message)) return t('agent.page.permissionExpired')
  return message
}
function stepLabel(step: TaskRow) {
  if (step.kind === 'subagent') return t('agent.page.subagent')
  if (step.kind === 'tool') return t('agent.page.tool')
  if (step.kind === 'think') return t('agent.page.model')
  return step.kind || t('agent.page.step')
}
function subChildCount(step: TaskRow) { return childSteps(step).length }
function finalAnswerStepId(turn: TaskRow): string {
  const answer = (turn.result || '').trim()
  if (!answer) return ''
  const matches = steps(turn).filter(step => step.kind === 'think' && (step.result || '').trim() === answer)
  return matches.length ? matches[matches.length - 1].task_id : ''
}
function workSteps(turn: TaskRow): TaskRow[] {
  const answerId = finalAnswerStepId(turn)
  return steps(turn).filter(step => step.task_id !== answerId)
}
function turnArtifacts(turn: TaskRow): Array<{ path: string; description: string }> {
  const found = new Map<string, { path: string; description: string }>()
  for (const step of steps(turn)) {
    if ((step.prompt || '').trim() !== 'report_artifacts') continue
    const parsed = parseStepJson(step.args) || parseStepJson(step.result)
    const list = Array.isArray(parsed?.artifacts) ? parsed.artifacts : []
    for (const item of list) {
      const raw = String(item?.path || '').trim()
      if (!raw) continue
      found.set(raw, { path: absolutePath(raw), description: String(item?.description || '').trim() })
    }
  }
  return [...found.values()]
}
async function manage(action: 'archive' | 'restore' | 'delete') {
  if (!session.value || busy.value) return
  if (action === 'delete') {
    const ok = await confirm({
      title: t('agent.page.deleteSession'),
      message: t('agent.page.deleteSessionMessage'),
      confirmLabel: t('agent.page.deletePermanently'),
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
function choose(id: string) { rememberEditor();selectedId.value = id; localStorage.setItem('0kay.agent.selected', id) }
async function create() {
  busy.value = true; error.value = ''
  try {
    // A click on 新对话 reuses the newest untouched empty session instead of
    // piling up another one — the old behavior left a new "新对话" behind
    // every time it was clicked without sending anything.
    const empty = [...store.sessions].reverse().find((session) =>
      session.prompt === t('agent.page.newChat') && session.state === 'done' && !store.sessionHasTurns(session.task_id))
    if (empty) { rememberEditor(); choose(empty.task_id); showArchived.value = false; return }
    const id=await store.createSession(t('agent.page.newChat'));rememberEditor();selectedId.value=id;localStorage.setItem('0kay.agent.selected',id);showArchived.value=false
  } catch (e: any) { error.value = e.message }
  finally { busy.value = false }
}
/**
 * Messages typed while the agent is still answering.
 *
 * They are not dropped and not interleaved: each one is appended to the queue and
 * sent as soon as the current answer finishes, in the order it was typed. That is
 * what the composer promises — "the agent is busy, your message is next".
 */
const queuedMessages = ref<string[]>([])

function queueMessage(text: string): void {
  const trimmed = text.trim()
  if (!trimmed) return
  queuedMessages.value = [...queuedMessages.value, trimmed]
}

function dropQueued(index: number): void {
  queuedMessages.value = queuedMessages.value.filter((_, position) => position !== index)
}

/** Drain one queued message; the rest wait for the next quiet moment. */
async function flushQueue(): Promise<void> {
  if (busy.value || active.value) return
  const [next, ...rest] = queuedMessages.value
  if (!next) return
  queuedMessages.value = rest
  await send(next, [])
}

// The queue drains itself the moment the answer lands — no extra click.
watch(
  () => [active.value?.task_id, busy.value, queuedMessages.value.length] as const,
  () => { if (!active.value && !busy.value && queuedMessages.value.length) void flushQueue() },
)

async function send(override?: string, overrideAttachments?: Array<{ name: string; url: string; mime: string; size: number }>) {
  const text = override ?? draft.value
  if (override === undefined && text.trim()==='/compact') {await compact();return}
  const outgoing = overrideAttachments ?? attachments.value
  const hasAttachments = outgoing.length > 0
  // Typing while a run is in flight queues instead of being refused.
  if (override === undefined && (busy.value || active.value) && (text.trim() || hasAttachments)) {
    queueMessage(text)
    draft.value = ''
    return
  }
  if ((!text.trim() && !hasAttachments) || busy.value || active.value || session.value?.state === 'archived') return
  busy.value = true; error.value = ''
  try {
    const requestOptions: Record<string, any> = options()
    const message = text.trim() || t('agent.page.attachedFilesFallback')
    const modeForTask=agentMode.value
    if (!session.value) {
      const id=await store.createSession(message.slice(0,60))
      localStorage.setItem(`0kay.agent.editor:${id}`,JSON.stringify({...requestOptions,draft:message,mode:modeForTask,kind:taskKind.value,duet:duetMode.value}))
      selectedId.value=id;localStorage.setItem('0kay.agent.selected',id)
    }
    const target = selectedId.value
    rememberEditor(target)
    if (hasAttachments) requestOptions.attachments = outgoing.map(item => ({ ...item }))
    await store.sendTask(target, message, modeForTask, requestOptions)
    if (override === undefined) {
      draft.value = ''
      attachments.value = []
      attachError.value = ''
    }
    rememberEditor(target);followLatest.value=true;await scrollBottom()
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
  const ok = await confirm({
    title: t('agent.page.stopAll'),
    message: t('agent.page.stopAllMessage', { count: ids.length }),
    confirmLabel: t('agent.page.stop'),
    danger: true,
  })
  if (!ok) return
  const results = await Promise.allSettled(ids.map(id => store.cancelTask(id)))
  const failed = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined
  if (failed) error.value = failed.reason?.message || String(failed.reason)
}
async function scrollBottom() { await nextTick(); if(followLatest.value) transcript.value?.scrollTo({top:transcript.value.scrollHeight,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}) }
async function jumpToLatest() {
  followLatest.value = true
  await nextTick()
  const element = transcript.value
  if (!element) return
  const instant = { top: element.scrollHeight, behavior: 'instant' as ScrollBehavior }
  element.scrollTo(instant)
  requestAnimationFrame(() => element.scrollTo({ top: element.scrollHeight, behavior: 'instant' as ScrollBehavior }))
}

const handledSteps = new Set<string>()
let seededSession = ''
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
function streamsWhileRunning(tool: string, args: any): boolean {
  return tool === 'write' && args?.stream !== false
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
  if (['write', 'edit', 'apply_patch', 'document', 'slides', 'research'].includes(tool)) {
    const path = editedPaths(step).map(absolutePath).find(Boolean)
    const settled = ['done', 'failed', 'cancelled'].includes(step.state)
    const live = streamsWhileRunning(tool, parseStepJson(step.args))
    if (path && (settled || live)) {
      handledSteps.add(step.task_id)
      void openFilePreview(path, { auto: true })
      if (live && !settled) startFileFollow(path, step.task_id)
      else if (tool === 'write') scheduleAutoClose()
    } else if (settled) handledSteps.add(step.task_id)
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
    if (Date.parse(step.started_at || '') <= seededAt) { handledSteps.add(step.task_id); continue }
    considerStep(step)
  }
  if (followTask.value) {
    const owner = store.tasks.find(item => item.task_id === followTask.value)
    if (!owner || ['done', 'failed', 'cancelled'].includes(owner.state)) void settleFileFollow()
  }
})
watch(() => store.resetToken, () => { seededSession = ''; handledSteps.clear(); stopFileFollow(); cancelAutoClose() })
watch(() => store.tasks.filter(item=>item.session_id===selectedId.value).map(item => `${item.task_id}:${item.state}:${item.result?.length}`).join('|'), scrollBottom)
watch(() => store.tasks.filter(item => item.session_id === selectedId.value).map(item => `${item.task_id}:${item.state}:${item.result?.length}`).join('|'), scheduleContextUsage)
watch(selectedId, () => { void fetchContextUsage() })
watch(modelId, () => { void fetchContextUsage() })
onMounted(() => { void fetchContextUsage() })
watch(selectedId, () => { followLatest.value=true;void scrollBottom();closeBrowser();clearSubs();stopFileFollow();error.value='';cancelEdit();loadSuperseded(selectedId.value) })
watch(selectedId, loadOptions)
watch(executorId,()=>{hostUsage.value=null;workdir.value='';closeBrowser();fetchHost();void fetchBrowserStatus()},{flush:'sync'})
watch(hostOpen,fetchHost)
watch(selectedId,()=>{compactNotice.value=''})
watch([selectedId, () => store.resetToken], ([id]) => { if (id) void store.ensureSessionTurns(id) }, { immediate: true })
onMounted(() => { syncLocale(); store.connect(); loadOptions(); fetchModels();void fetchWorkspaces();hostTimer=setInterval(fetchHost,5000);workspaceTimer=setInterval(()=>{if(!document.hidden)void fetchWorkspaces()},5000);void fetchBrowserStatus();browserTimer=setInterval(()=>{if(!document.hidden)void fetchBrowserStatus()},5000);window.addEventListener('keydown',onEscape);loadSuperseded(selectedId.value);void pollAssessments();assessmentTimer=setInterval(()=>{if(!document.hidden)void pollAssessments()},6000) })
onUnmounted(() => {stopFileFollow();cancelAutoClose();rememberEditor();closeBrowser();store.disconnect();if(hostTimer) clearInterval(hostTimer);if(workspaceTimer) clearInterval(workspaceTimer);if(browserTimer) clearInterval(browserTimer);if(browserViewTimer) clearInterval(browserViewTimer);if(browserStreamRetry) clearTimeout(browserStreamRetry);if(treeRefreshTimer) clearTimeout(treeRefreshTimer);if(searchTimer) clearTimeout(searchTimer);if(toastTimer) clearTimeout(toastTimer);if(ctxTimer) clearTimeout(ctxTimer);if(assessmentTimer) clearInterval(assessmentTimer);if(tasksTimer) clearInterval(tasksTimer);window.removeEventListener('keydown',onEscape)})
</script>

<template>
  <main class="workspace">
    <aside class="sessions" :style="{ width: sidebarWidth + 'px' }">
      <header><h1>Agent</h1><button @click="create" :disabled="busy" :title="t('agent.page.newSession')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> {{ t('agent.page.newChat') }}</button></header>
      <div class="connection"><i :class="{online:store.onlineCount>0}" />{{ store.onlineCount }} {{ t('agent.page.executorsOnline') }} <button @click="store.fetchAgents()" :title="t('agent.page.refresh')" aria-label="refresh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
      <p v-if="doneBanner" class="run-banner" role="status" @click="doneBanner = ''">{{ doneBanner }}</p>
      <nav class="sidebar-mode">
        <button type="button" :class="{ chosen: sidebarTab === 'sessions' }" @click="sidebarTab = 'sessions'">{{ t('agent.page.sidebarChats') }}</button>
        <button type="button" :class="{ chosen: sidebarTab === 'tasks' }" @click="sidebarTab = 'tasks'">
          {{ t('agent.page.tasksTitle') }}<span v-if="reconRunningCount" class="sidebar-badge">{{ reconRunningCount > 9 ? '9+' : reconRunningCount }}</span>
        </button>
      </nav>
      <template v-if="sidebarTab === 'sessions'">
      <input v-model="search" :placeholder="t('agent.page.searchSessions')" :aria-label="t('agent.page.searchSessionsLabel')" />
      <nav class="filter-bar"><button v-for="filter in [{id:'all',label:t('agent.page.all')},{id:'life',label:t('agent.page.fromLife')},{id:'user',label:t('agent.page.myChats')}]" :key="filter.id" :class="{chosen:source===filter.id}" @click="source=filter.id">{{ filter.label }}</button></nav>
      <div class="sidebar-toggles">
        <label class="muted"><input v-model="showArchived" type="checkbox" /> {{ t('agent.page.showArchived') }}</label>
        <nav class="order-toggle"><button type="button" :class="{chosen:orderMode==='manual'}" @click="setOrderMode('manual')">{{ t('agent.page.manual') }}</button><button type="button" :class="{chosen:orderMode==='recent'}" @click="setOrderMode('recent')">{{ t('agent.page.recent') }}</button></nav>
      </div>
      <div class="session-list">
        <section v-if="search.trim()" class="ws-group">
          <header class="ws-head static"><span class="ws-title">{{ t('agent.page.searchResults') }}</span><span class="ws-count">{{ searchResults.length }}</span></header>
          <div class="ws-sessions">
            <div v-for="item in searchResults" :key="item.task_id" class="session-row" :class="{selected:selectedId===item.session_id}">
              <button class="session-card" @click="choose(item.session_id!)">
                <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : t('agent.page.youAgent') }}<span v-if="sessionState(item)" class="session-state" :class="sessionState(item)" :title="sessionState(item) === 'running' ? t('agent.page.runRunning') : t('agent.page.runDone')" /></span>
                <strong>{{ item.prompt || t('agent.page.untitledSession') }}</strong>
                <small>{{ snippetFor(item.session_id) || time(item.started_at) }}</small>
              </button>
              <span class="row-actions">
                <button type="button" :disabled="busy" :title="t('agent.page.forkSession')" :aria-label="t('agent.page.forkSession')" @click.stop="forkSession(item)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="8" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M6 8.4v7.2M18 10.4c0 2.4-2 4.3-4.4 4.3H8.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
                <select :disabled="busy || !workspaces.length" :aria-label="t('agent.page.moveToWorkspace')" :title="t('agent.page.moveToWorkspace')" @click.stop @change="onMoveChange(item, $event)"><option value="">{{ t('agent.page.moveSelect') }}</option><option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.title }}</option></select>
              </span>
            </div>
            <p v-if="!searchResults.length" class="muted ws-empty">{{ t('agent.page.noMatches') }}</p>
          </div>
        </section>

        <template v-else>
          <section v-for="group in sessionGroups.groups" :key="group.id" class="ws-group" :class="{collapsed:collapsed.has(group.id),'drag-source':dragWorkspace===group.id,'drag-over':dragOverId===group.id}" @dragover.prevent="onGroupDragOver(group.id)" @drop.prevent="onGroupDrop(group.id)" @dragend="onGroupDragEnd">
            <header class="ws-head" draggable="true" @dragstart="onGroupDragStart(group.id)">
              <button type="button" class="ws-toggle" @click="toggleGroup(group.id)" :aria-expanded="!collapsed.has(group.id)" :title="collapsed.has(group.id) ? t('agent.page.expand') : t('agent.page.collapse')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <span class="ws-title" :title="group.path">{{ group.title }}<i v-if="!group.exists" class="ws-missing" :title="t('agent.page.missingDirectory')">!</i></span>
              <span class="ws-count">{{ group.sessions.length }}</span>
              <span class="ws-actions">
                <button type="button" @click.stop="createIn(group.id)" :disabled="busy" :title="t('agent.page.newSessionHere')">+</button>
                <button type="button" @click.stop="openRename(group)" :title="t('agent.page.rename')">✎</button>
                <button type="button" class="danger" @click.stop="deleteWorkspace(group)" :title="t('agent.page.removeWorkspace')">×</button>
              </span>
            </header>
            <div class="ws-sessions">
              <div v-for="item in visibleSessions(group)" :key="item.task_id" class="session-row" :class="{selected:selectedId===item.session_id}">
                <button class="session-card" @click="choose(item.session_id!)">
                  <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : t('agent.page.youAgent') }}<span v-if="sessionState(item)" class="session-state" :class="sessionState(item)" :title="sessionState(item) === 'running' ? t('agent.page.runRunning') : t('agent.page.runDone')" /></span>
                  <strong>{{ item.prompt || t('agent.page.untitledSession') }}</strong><small>{{ time(item.started_at) }}</small>
                  <span v-if="progressBySession[item.session_id!]" class="session-progress" :title="progressBySession[item.session_id!].note"><i :style="{ width: progressBySession[item.session_id!].percent + '%' }" /></span>
                </button>
                <span class="row-actions">
                  <button type="button" :disabled="busy" :title="t('agent.page.forkSession')" :aria-label="t('agent.page.forkSession')" @click.stop="forkSession(item)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="8" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M6 8.4v7.2M18 10.4c0 2.4-2 4.3-4.4 4.3H8.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
                  <select :disabled="busy || !workspaces.length" :aria-label="t('agent.page.moveToWorkspace')" :title="t('agent.page.moveToWorkspace')" @click.stop @change="onMoveChange(item, $event)"><option value="">{{ t('agent.page.moveSelect') }}</option><option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.title }}</option></select>
                </span>
              </div>
              <button v-if="group.sessions.length > 5" class="ws-more" @click="toggleExpanded(group.id)">{{ isExpanded(group.id) ? t('agent.page.showLess') : t('agent.page.showMore') + ` (${group.sessions.length - 5})` }}</button>
              <p v-if="!group.sessions.length" class="muted ws-empty">{{ t('agent.page.noSessions') }}</p>
            </div>
          </section>

          <section v-if="sessionGroups.ungrouped.length" class="ws-group">
            <header class="ws-head static"><span class="ws-title">{{ t('agent.page.ungrouped') }}</span><span class="ws-count">{{ sessionGroups.ungrouped.length }}</span></header>
            <div class="ws-sessions">
              <div v-for="item in sessionGroups.ungrouped" :key="item.task_id" class="session-row" :class="{selected:selectedId===item.session_id}">
                <button class="session-card" @click="choose(item.session_id!)">
                  <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : t('agent.page.youAgent') }}<span v-if="sessionState(item)" class="session-state" :class="sessionState(item)" :title="sessionState(item) === 'running' ? t('agent.page.runRunning') : t('agent.page.runDone')" /></span>
                  <strong>{{ item.prompt || t('agent.page.untitledSession') }}</strong><small>{{ time(item.started_at) }}</small>
                  <span v-if="progressBySession[item.session_id!]" class="session-progress" :title="progressBySession[item.session_id!].note"><i :style="{ width: progressBySession[item.session_id!].percent + '%' }" /></span>
                </button>
                <span class="row-actions">
                  <button type="button" :disabled="busy" :title="t('agent.page.forkSession')" :aria-label="t('agent.page.forkSession')" @click.stop="forkSession(item)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="8" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M6 8.4v7.2M18 10.4c0 2.4-2 4.3-4.4 4.3H8.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
                  <select :disabled="busy || !workspaces.length" :aria-label="t('agent.page.moveToWorkspace')" :title="t('agent.page.moveToWorkspace')" @click.stop @change="onMoveChange(item, $event)"><option value="">{{ t('agent.page.moveSelect') }}</option><option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.title }}</option></select>
                </span>
              </div>
            </div>
          </section>

          <button v-if="executor" class="ws-add" :disabled="busy" @click="addWorkspace()">+ {{ t('agent.page.addWorkspace') }}</button>
          <p v-if="!sessions.length && !workspaces.length" class="muted">{{ t('agent.page.noSessionsHint') }}</p>
          <p v-if="workspaceError" class="muted" role="alert">{{ workspaceError }}</p>
        </template>
      </div>
      </template>
      <div v-else class="session-list task-tab">
        <!-- The detail lives in the right pane now. Keeping the list here
             means switching tasks does not require going back first. -->
        <ul class="recon-items task-picklist">
          <li v-for="row in assessmentRowsFiltered" :key="row.id" class="recon-taskrow" :class="{ picked: row.id === taskSelectedId }" @click="openTask(row.id)">
            <div class="recon-taskrow-top">
              <span class="recon-badge" :class="row.status"><i class="recon-pillardot"></i>{{ t('agent.page.taskStatus_' + row.status) }}</span>
            </div>
            <p>{{ row.objective }}</p>
            <div class="recon-taskrow-meta">
              <small v-if="row.goalProgress">{{ t('agent.page.taskGoalProgress') }} <b>{{ row.goalProgress }}</b></small>
              <small>{{ row.createdAt.slice(5, 16).replace('T', ' ') }}</small>
            </div>
          </li>
        </ul>
        <p v-if="!assessmentRows.length" class="tree-msg">{{ t('agent.page.reconNoTasks') }}</p>
      </div>
      <div
        class="sidebar-resizer"
        :class="{ active: sidebarResizing }"
        role="separator"
        aria-orientation="vertical"
        :aria-label="t('agent.page.sidebarWidth')"
        :title="t('agent.page.sidebarWidth') + ' — ' + t('agent.page.sidebarResetWidth')"
        @pointerdown="startSidebarResize"
        @dblclick="onSidebarHandleDblClick"
      />
    </aside>

    <section class="conversation" :class="{ 'is-empty': isEmptyChat, 'is-task': showingTask }">

      <!-- 任务详情占满右栏。任务有层级（主 Agent → 子 Agent → 轮次 → 工具），
           284px 的侧栏放不下，只能横向滚动硬塞；而看任务时右栏本来就是空的。
           外层保留 task-tab 类，样式表里的 .task-tab .recon-* 规则继续生效。 -->
      <div v-if="sidebarTab === 'tasks' && taskSelectedId" class="conversation-task task-tab">
        <!-- 任务详情：选中一个任务后列表就地换成详情（ARTEX 的任务详情页），← 返回列表。
             聊天列保持原样——看得见图，也看得见 agent 在干什么。 -->
        <div v-if="taskSelectedId" class="task-detail">
          <div class="recon-task-head">
            <button type="button" class="recon-back" :title="t('agent.page.taskClose')" :aria-label="t('agent.page.taskClose')" @click="closeTask">←</button>
            <div class="recon-task-headtext">
              <div class="recon-task-titleline">
                <strong class="recon-task-objective">{{ taskDetail?.state.objective || '…' }}</strong>
                <span v-if="taskDetail" class="recon-idchip" :title="taskDetail.state.id">{{ taskDetail.state.id.slice(3, 15) }}</span>
              </div>
              <div class="recon-task-chips">
                <span v-if="taskDetail" class="recon-badge" :class="taskDetail.state.status"><i class="recon-pillardot"></i>{{ t('agent.page.taskStatus_' + taskDetail.state.status) }}</span>
                <small v-if="taskDetail?.state.stopped" class="recon-task-stopped">{{ taskDetail.state.stopped }}</small>
              </div>
            </div>
            <button type="button" class="recon-back" :title="t('agent.page.refresh')" @click="onTasksRefresh()">⟳</button>
          </div>
          <p v-if="taskError" class="recon-error">{{ taskError }}</p>
          <p v-if="!taskDetail" class="tree-msg">…</p>
          <template v-if="taskDetail">
            <div class="recon-usage" :title="t('agent.page.taskUsageTotal')">
              <span class="recon-usage-label">{{ t('agent.page.taskUsageTotal') }}</span>
              <span class="recon-usage-item">{{ t('agent.page.taskUsageIn') }} <b>{{ fmtTokens(taskDetail.live?.usage?.inTokens || 0) }}</b></span>
              <span class="recon-usage-item">{{ t('agent.page.taskUsageOut') }} <b>{{ fmtTokens(taskDetail.live?.usage?.outTokens || 0) }}</b></span>
              <span class="recon-usage-item">{{ t('agent.page.taskUsageCalls') }} <b>{{ taskDetail.live?.usage?.llmCalls || 0 }}</b></span>
            </div>
            <div v-if="taskDetail.state.status === 'running' || taskDetail.state.status === 'paused'" class="recon-task-controls">
              <button v-if="taskDetail.state.status === 'running'" type="button" @click="controlTask('pause')">{{ t('agent.page.taskPause') }}</button>
              <button v-if="taskDetail.state.status === 'paused'" type="button" @click="controlTask('resume')">{{ t('agent.page.taskResume') }}</button>
              <button type="button" class="danger" @click="controlTask('cancel')">{{ t('agent.page.taskStop') }}</button>
            </div>
            <div v-else class="recon-task-controls">
              <button type="button" class="danger" @click="deleteTask(taskDetail.state.id)">{{ t('agent.page.taskDelete') }}</button>
            </div>
            <form class="recon-hintform" @submit.prevent="sendHint">
              <input v-model="hintDraft" :placeholder="t('agent.page.taskHint')" />
              <button type="submit" :disabled="!hintDraft.trim()">{{ t('agent.page.taskSend') }}</button>
            </form>
            <div class="recon-tabs">
              <button type="button" :class="{ active: taskDetailTab === 'sessions' }" @click="taskDetailTab = 'sessions'">{{ t('agent.page.taskTabSessions') }}</button>
              <button type="button" :class="{ active: taskDetailTab === 'overview' }" @click="taskDetailTab = 'overview'">{{ t('agent.page.taskTabOverview') }}</button>
              <button type="button" :class="{ active: taskDetailTab === 'graph' }" @click="taskDetailTab = 'graph'">{{ t('agent.page.taskTabGraph') }}</button>
              <button type="button" :class="{ active: taskDetailTab === 'board' }" @click="taskDetailTab = 'board'">{{ t('agent.page.taskTabBoard') }}</button>
              <button type="button" :class="{ active: taskDetailTab === 'findings' }" @click="taskDetailTab = 'findings'">{{ t('agent.page.taskTabFindings') }}</button>
              <button type="button" :class="{ active: taskDetailTab === 'assets' }" @click="taskDetailTab = 'assets'">{{ t('agent.page.taskTabAssets') }}</button>
              <button type="button" :class="{ active: taskDetailTab === 'approvals' }" @click="taskDetailTab = 'approvals'">{{ t('agent.page.taskTabApprovals') }}</button>
              <button type="button" :class="{ active: taskDetailTab === 'report' }" @click="taskDetailTab = 'report'">{{ t('agent.page.taskTabReport') }}</button>
            </div>
            <!-- 会话：the conversation tree — planner rounds, worker intents, system events -->
            <template v-if="taskDetailTab === 'sessions'">
              <div class="recon-sesslist-head">
                <span class="recon-sesslist-title">{{ t('agent.page.taskSessList') }}</span>
                <small class="recon-sesslist-usage">{{ t('agent.page.taskUsageTotal') }} · in {{ fmtTokens(taskDetail.live?.usage?.inTokens || 0) }} · out {{ fmtTokens(taskDetail.live?.usage?.outTokens || 0) }}</small>
              </div>
              <div class="recon-sessgroup">
                <h5>⓿ 主 Agent</h5>
                <button type="button" class="recon-sessitem" :class="{ open: taskSessionOpen === 'main' }" @click="taskSessionOpen = taskSessionOpen === 'main' ? null : 'main'">
                  主 Agent · 编排
                </button>
                <div v-if="taskSessionOpen === 'main'" class="recon-tracebox">
                  <ul class="recon-items">
                    <li v-for="(entry, i) in taskSystemRows" :key="i" class="recon-item system"><i class="recon-dot system" />{{ entry.text }}</li>
                  </ul>
                </div>
              </div>
              <div class="recon-sessgroup">
                <h5>◉ 规划 Planner</h5>
                <button v-for="entry in taskPlannerRows" :key="entry.id" type="button" class="recon-sessitem" :class="{ open: taskSessionOpen === entry.id }" @click="taskSessionOpen = taskSessionOpen === entry.id ? null : entry.id">
                  规划 Planner · 态势研判 #{{ entry.round }}
                </button>
                <div v-if="taskPlannerRows.some((entry) => taskSessionOpen === entry.id)" class="recon-tracebox">
                  <ul class="recon-items">
                    <li v-for="(entry, i) in taskBoard.filter((row) => row.kind === 'planner' || row.kind === 'fact' || row.kind === 'finding').slice(0, 12)" :key="i" class="recon-item">
                      <i class="recon-dot" :class="entry.kind" />{{ entry.text }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="recon-sessgroup">
                <h5>((•)) Workers <b>{{ taskWorkerRows.length }}</b></h5>
                <template v-for="entry in taskWorkerRows" :key="entry.id">
                  <button type="button" class="recon-sessitem" :class="{ open: taskSessionOpen === entry.id }" @click="toggleSessionTrace(entry)">
                    <span class="recon-sessmark" :class="entry.status">{{ entry.status === 'done' ? '✓' : entry.status === 'running' ? '⟳' : entry.status === 'blocked' ? '✕' : entry.status === 'paused' ? '❚❚' : '○' }}</span>
                    <span class="recon-sessnum">#{{ entry.num }}</span>
                    <span class="recon-sesstext">{{ entry.title }}</span>
                    <span v-if="entry.status === 'running'" class="recon-livebadge">• {{ t('agent.page.taskLive') }}</span>
                  </button>
                  <div v-if="taskSessionOpen === entry.id" class="recon-tracebox">
                    <p v-if="taskTraceLoading" class="tree-msg">…</p>
                    <p v-else-if="!taskTraceSteps.length" class="tree-msg">{{ t('agent.page.taskNoTrace') }}</p>
                    <ol v-else class="recon-tracesteps">
                      <li v-for="(step, i) in taskTraceSteps" :key="i" :class="{ fail: !step.ok }">
                        <span class="recon-trace-action">{{ step.action }}</span>
                        <span class="recon-trace-detail">{{ step.detail }}</span>
                      </li>
                    </ol>
                  </div>
                </template>
              </div>
            </template>
            <!-- 总览 -->
            <template v-else-if="taskDetailTab === 'overview'">
              <div v-if="taskDetail.live" class="recon-coverage">
                <div class="recon-coverage-line">
                  <span>{{ t('agent.page.reconCoverage') }}</span>
                  <span><b>{{ taskDetail.live.coverage.tested }}</b> / {{ taskDetail.live.coverage.scope.denominator || taskDetail.live.coverage.total }} <em>{{ t('agent.page.reconTested') }}</em><i v-if="taskPercent != null" class="recon-pct"> · {{ taskPercent }}%</i></span>
                </div>
                <div class="recon-bar" role="progressbar" :aria-valuenow="taskPercent || 0" aria-valuemin="0" aria-valuemax="100"><span :style="{ width: (taskPercent || 0) + '%' }"></span></div>
              </div>
              <section v-if="taskDetail.live?.goals.length" class="recon-block">
                <h4>{{ t('agent.page.reconGoals') }} <b>{{ taskDetail.live.goals.filter((goal) => goal.status === 'met').length }}/{{ taskDetail.live.goals.length }}</b></h4>
                <ul class="recon-items">
                  <li v-for="goal in taskDetail.live.goals" :key="goal.id" class="recon-item goal" :class="{ met: goal.status === 'met' }"><i class="recon-dot" />{{ goal.text }}</li>
                </ul>
              </section>
              <section v-if="taskDetail.live?.openIntents.length" class="recon-block">
                <h4>{{ t('agent.page.reconIntents') }} <b>{{ taskDetail.live.openIntents.length }}</b></h4>
                <ul class="recon-items">
                  <li v-for="intent in taskDetail.live.openIntents" :key="intent.id" class="recon-item"><i class="recon-dot" />{{ intent.text }}</li>
                </ul>
              </section>
            </template>
            <!-- 探索链路：the layered graph, drawn from the session fetch -->
            <template v-else-if="taskDetailTab === 'graph'">
              <div class="recon-legend">
                <span class="recon-legend-spacer"></span>
                <button type="button" :title="t('agent.page.reconFit')" @click="reconFit()">⤢</button>
                <button type="button" title="−" @click="reconZoom = Math.max(0.25, reconZoom / 1.2)">−</button>
                <button type="button" title="+" @click="reconZoom = Math.min(3, reconZoom * 1.2)">＋</button>
              </div>
              <div
                class="recon-canvas"
                @pointerdown="onReconCanvasDown"
                @pointermove="onReconCanvasMove"
                @pointerup="onReconCanvasUp"
                @pointercancel="onReconCanvasUp"
                @wheel="onReconCanvasWheel"
              >
                <svg v-if="taskLayout" :width="Math.max(taskLayout.width * reconZoom + 40, 200)" :height="Math.max(taskLayout.height * reconZoom + 40, 120)" role="img" :aria-label="t('agent.page.taskTabGraph')">
                  <g :transform="`translate(${reconPan.x + 20},${reconPan.y + 20}) scale(${reconZoom})`">
                    <path v-for="(edge, i) in taskLayout.edges" :key="i" class="recon-edge" :class="edge.rel" :d="edge.d" />
                    <text v-for="(edge, i) in taskLayout.edges" :key="'l' + i" class="recon-edge-label" :class="edge.rel" :x="edge.lx" :y="edge.ly">{{ edge.label }}</text>
                    <g v-for="node in taskLayout.nodes" :key="node.id" class="recon-node" :class="[node.kind, node.status]" :transform="`translate(${node.x},${node.y})`">
                      <title>{{ node.kind }} · {{ node.status }} — {{ node.text }}</title>
                      <rect :width="RECON_NODE_W" :height="RECON_NODE_H" rx="8" />
                      <text :y="15"><tspan x="8">{{ node.l1 }}</tspan></text>
                      <text :y="27"><tspan x="8">{{ node.l2 }}</tspan></text>
                    </g>
                  </g>
                </svg>
                <p v-else class="tree-msg">{{ t('agent.page.reconEmpty') }}</p>
              </div>
            </template>
            <!-- 播报板 -->
            <template v-else-if="taskDetailTab === 'board'">
              <ul class="recon-items">
                <li v-for="(entry, i) in taskBoard" :key="i" class="recon-item activity">
                  <i class="recon-dot" :class="entry.kind"></i>
                  <div><p>{{ entry.text }}</p><small>{{ entry.kind }} · #{{ entry.round }}</small></div>
                </li>
              </ul>
            </template>
            <!-- 发现 -->
            <template v-else-if="taskDetailTab === 'findings'">
              <p v-if="!taskDetail.live?.findings.length" class="tree-msg">{{ t('agent.page.reconNoFindings') }}</p>
              <ul v-else class="recon-items">
                <li v-for="finding in taskDetail.live.findings" :key="finding.id" class="recon-item finding"><i class="recon-dot" />{{ finding.text }}</li>
              </ul>
            </template>
            <!-- 测试资产 -->
            <template v-else-if="taskDetailTab === 'assets'">
              <div class="recon-coverage">
                <div class="recon-coverage-line">
                  <span>{{ t('agent.page.reconCoverage') }}</span>
                  <span><b>{{ taskAssetsTested.length }}</b> / {{ taskAssets.length }} <em>{{ t('agent.page.reconTested') }}</em></span>
                </div>
                <div class="recon-bar" role="progressbar" :aria-valuenow="taskAssets.length ? Math.round((taskAssetsTested.length / taskAssets.length) * 100) : 0" aria-valuemin="0" aria-valuemax="100"><span :style="{ width: (taskAssets.length ? Math.round((taskAssetsTested.length / taskAssets.length) * 100) : 0) + '%' }"></span></div>
              </div>
              <section class="recon-block">
                <h4>{{ t('agent.page.taskTested') }} <b>{{ taskAssetsTested.length }}</b></h4>
                <ul class="recon-items">
                  <li v-for="asset in taskAssetsTested.slice(0, RECON_LIMIT)" :key="asset.id" class="recon-item goal"><i class="recon-dot" />{{ asset.kind }}:{{ asset.key }}</li>
                </ul>
              </section>
              <section class="recon-block">
                <h4>{{ t('agent.page.taskUntested') }} <b>{{ taskAssetsUntested.length }}</b></h4>
                <ul class="recon-items">
                  <li v-for="asset in taskAssetsUntested.slice(0, RECON_LIMIT)" :key="asset.id" class="recon-item"><i class="recon-dot" />{{ asset.kind }}:{{ asset.key }}</li>
                </ul>
              </section>
            </template>
            <!-- 拦截审批 -->
            <template v-else-if="taskDetailTab === 'approvals'">
              <p v-if="!taskApprovals.length" class="tree-msg">{{ t('agent.page.taskApprovalsEmpty') }}</p>
              <ul v-else class="recon-items">
                <li v-for="approval in taskApprovals" :key="approval.id" class="recon-taskrow">
                  <div class="recon-taskrow-top"><span class="recon-badge intent">{{ approval.tool }}</span></div>
                  <pre v-if="approval.args" class="recon-approval-args">{{ approval.args }}</pre>
                  <div class="recon-task-controls">
                    <button type="button" @click="decideApproval(approval.id, true)">{{ t('agent.page.taskAllow') }}</button>
                    <button type="button" class="danger" @click="decideApproval(approval.id, false)">{{ t('agent.page.taskDeny') }}</button>
                  </div>
                </li>
              </ul>
            </template>
            <!-- 报告 -->
            <template v-else>
              <div class="recon-task-controls">
                <button type="button" :disabled="taskReportBusy" @click="generateTaskReport(false)">{{ t('agent.page.taskReportGenerate') }}</button>
                <button type="button" :disabled="taskReportBusy" @click="generateTaskReport(true)">{{ t('agent.page.taskReportSave') }}</button>
              </div>
              <pre v-if="taskReport" class="recon-report">{{ taskReport }}</pre>
            </template>
          </template>
        </div>
        <!-- 任务列表 -->
        <template v-else>
          <form v-if="taskShowNew" class="recon-taskform" style="margin-bottom:10px" @submit.prevent="createTask">
            <label>{{ t('agent.page.taskObjective') }}<textarea v-model="newTaskObjective" rows="2"></textarea></label>
            <label>{{ t('agent.page.taskTargets') }}<textarea v-model="newTaskTargets" rows="3" placeholder="https://a.example&#10;10.0.0.0/24"></textarea></label>
            <label>{{ t('agent.page.taskCoverageGate') }}<input v-model="newTaskCoverage" type="number" min="0" max="100" /></label>
            <label>{{ t('agent.page.taskModel') }}<AppSelect v-model="newTaskModel" :options="[{ value: '', label: t('agent.page.taskModelAuto') }, ...modelSelectOptions]" /></label>
            <button type="submit" :disabled="taskCreating || !selectedId || !newTaskObjective.trim() || !newTaskTargets.trim()">{{ t('agent.page.taskCreate') }}</button>
          </form>
          <div class="recon-task-search" style="margin-bottom:8px">
            <input v-model="taskSearch" :placeholder="t('agent.page.taskSearchPlaceholder')" />
            <select v-model="taskStatusFilter" :aria-label="t('agent.page.taskFilterAll')">
              <option value="">{{ t('agent.page.taskFilterAll') }}</option>
              <option value="running">{{ t('agent.page.taskStatus_running') }}</option>
              <option value="paused">{{ t('agent.page.taskStatus_paused') }}</option>
              <option value="done">{{ t('agent.page.taskStatus_done') }}</option>
              <option value="cancelled">{{ t('agent.page.taskStatus_cancelled') }}</option>
              <option value="failed">{{ t('agent.page.taskStatus_failed') }}</option>
            </select>
          </div>
          <button type="button" class="recon-newtask-btn" style="width:100%;justify-content:center;margin-bottom:8px" @click="taskShowNew = !taskShowNew">{{ taskShowNew ? '✕' : '＋' }} {{ t('agent.page.taskNew') }}</button>
          <p v-if="!assessmentRows.length" class="tree-msg">{{ t('agent.page.reconNoTasks') }}</p>
          <ul v-else class="recon-items">
            <li v-for="row in assessmentRowsFiltered" :key="row.id" class="recon-taskrow" @click="openTask(row.id)">
              <div class="recon-taskrow-top">
                <span class="recon-badge" :class="row.status"><i class="recon-pillardot"></i>{{ t('agent.page.taskStatus_' + row.status) }}</span>
              </div>
              <p>{{ row.objective }}</p>
              <div class="recon-taskrow-meta">
                <small v-if="row.goalProgress">{{ t('agent.page.taskGoalProgress') }} <b>{{ row.goalProgress.met }}/{{ row.goalProgress.total }}</b></small>
                <small>{{ row.createdAt.slice(5, 16).replace('T', ' ') }}</small>
              </div>
            </li>
          </ul>
        </template>
      </div>
      <header v-if="!showingTask" class="conversation-header">
        <div class="conversation-heading"><h2>{{ session?.prompt || t('agent.page.conversationTitle') }}</h2><p>{{ session && isLife(session) ? t('agent.page.lifeSessionSubtitle') : t('agent.page.ongoingSubtitle') }}</p></div>
        <div class="conversation-actions">
          <span class="browser-status" :class="{on:browserStatus?.running,off:browserStatus&&!browserStatus.enabled}" :title="browserTooltip"><i aria-hidden="true" />{{ browserLabel }}</span>
          <span v-if="active" class="running">{{ t('agent.page.running') }}<template v-if="activeProgress"> · {{ activeProgress.percent }}%<template v-if="activeProgress.note"> — {{ activeProgress.note }}</template></template></span>
          <div v-if="session" class="session-actions">
            <button type="button" class="icon-btn" :disabled="!!active" :title="session.state === 'archived' ? t('agent.page.restore') : t('agent.page.archive')" @click="manage(session.state === 'archived' ? 'restore' : 'archive')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M6 7v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9.5 11h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <button type="button" class="icon-btn danger" :disabled="!!active" :title="t('agent.page.delete')" @click="manage('delete')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
        </div>
      </header>
      <div v-if="!showingTask && (error || store.error)" class="error error-bar" role="alert"><span class="error-text">{{ error || store.error }}</span><button type="button" class="error-close" :aria-label="t('agent.page.close')" :title="t('agent.page.close')" @click="dismissError"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
      <div v-if="!showingTask" ref="transcript" class="transcript" @scroll.passive="onTranscriptScroll" @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDropFiles">
        <Transition name="view-swap" mode="out-in">
        <div v-if="activeSub" key="sub" class="sub-view">
          <header class="sub-view-header">
            <button type="button" @click="closeSub">← {{ subStack.length > 1 ? t('agent.page.backOneLevel') : t('agent.page.backToChat') }}</button>
            <div>
              <h3>{{ t('agent.page.subagent') }}</h3>
              <p class="muted">{{ activeSub.prompt }}</p>
            </div>
            <span :class="activeSub.state">{{ stateName(activeSub.state) }}</span>
          </header>
          <div class="sub-view-body">
            <div class="bubble user"><div class="message-head"><b>{{ t('agent.page.parentAgent') }}</b><time>{{ time(activeSub.started_at) }}</time></div><div class="message-text">{{ activeSub.prompt }}</div></div>
            <template v-for="step in childSteps(activeSub)" :key="step.task_id">
              <div v-if="step.kind === 'think' && (step.result || step.reasoning || step.state === 'running' || step.error)" class="agent-speech"><small v-if="modelAnnotation(step)" class="muted model-annotation" :class="{fallback: modelInfo(step).fellBack}" :title="modelReason(step)">{{ modelAnnotation(step) }}</small><ThinkChain v-if="step.reasoning" :reasoning="step.reasoning" :open="step.state === 'running' && !step.result" :running="step.state === 'running' && !step.result" :started-at="step.started_at" :label="t('agent.page.reasoning')" /><template v-if="step.result"><MarkdownContent :content="step.result" @open="openPath" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else-if="step.state === 'running'" class="muted">{{ t('agent.page.subagentDrafting') }}</small><p v-if="step.error" class="error">{{ friendlyError(step.error) }}</p></div>
              <div v-else-if="step.kind === 'subagent'" class="subagent-card nested">
                <button type="button" class="subagent-card-head" @click="openSub(step)"><span :class="step.state">●</span><strong>{{ t('agent.page.subagent') }}</strong><span class="subagent-prompt">{{ step.prompt }}</span><small>{{ stateName(step.state) }}</small><span class="subagent-chevron" aria-hidden="true">▸</span></button>
              </div>
              <ToolStepCard v-else-if="step.kind === 'tool'" :step="step" :executor-id="executor?.plugin_id" :format-error="friendlyError" @open="(path) => openFilePreview(path, { confirmDiscard: true })" />
              <details v-else-if="step.kind !== 'think'"><summary><span :class="step.state">●</span> {{ stepLabel(step) }} · {{ step.prompt }} <small>{{ stateName(step.state) }}</small></summary><pre>{{ step.result || step.error || (step.state === 'running' ? t('agent.page.executing') : t('agent.page.completedNoOutput')) }}</pre></details>
            </template>
            <div v-if="subFinal(activeSub)" class="agent-speech"><MarkdownContent :content="subFinal(activeSub)" @open="openPath" /></div>
            <p v-if="activeSub.error" class="error">{{ friendlyError(activeSub.error) }}</p>
            <p v-if="!childSteps(activeSub).length && !subFinal(activeSub) && !activeSub.error" class="muted">{{ activeSub.state === 'running' ? t('agent.page.subagentRunning') : t('agent.page.noChildSteps') }}</p>
          </div>
        </div>
        <div v-else key="main" class="main-view">
        <div v-if="turnsLoading" class="turns-skeleton" role="status" :aria-label="t('agent.page.loading')">
          <div class="skeleton-row right"><span class="skeleton-bar user" /></div>
          <div class="skeleton-row"><span class="skeleton-bar agent" /></div>
          <div class="skeleton-row right"><span class="skeleton-bar user short" /></div>
          <div class="skeleton-row"><span class="skeleton-bar agent long" /></div>
        </div>
        <div v-else-if="!turns.length && !contextSummary" class="welcome"><h2>{{ t('agent.page.welcomeTitle') }}</h2><p>{{ t('agent.page.welcomeBody') }}</p><p>{{ t('agent.page.welcomeLife') }}</p></div>
        <article v-if="contextSummary" class="context-summary">
          <div class="context-summary-head"><strong>{{ t('agent.page.contextSummary') }}</strong><time>{{ time(contextSummary.started_at) }}</time></div>
          <MarkdownContent :content="contextSummary.result || ''" @open="openPath" />
        </article>
        <button v-if="store.hasOlderTurns(selectedId)" class="load-earlier" type="button" @click="store.olderSessionTurns(selectedId)">{{ t('agent.page.loadEarlier') }}</button>
        <article v-for="turn in visibleTurns" :key="turn.task_id" class="turn">
          <div class="bubble user" :class="{ editing: editingId === turn.task_id }"><div class="message-head"><b>{{ isLife(turn) ? 'LIFE' : t('agent.page.you') }}</b><time>{{ time(turn.started_at) }}</time></div>
                        <template v-if="editingId === turn.task_id">
              <textarea ref="editArea" v-model="editDraft" class="bubble-edit" rows="3" :aria-label="t('agent.page.edit')" @keydown.esc.prevent="cancelEdit" @keydown.ctrl.enter.prevent="submitEdit(turn)" @keydown.meta.enter.prevent="submitEdit(turn)" />
              <div class="bubble-edit-actions">
                <button type="button" class="bubble-action" @click="cancelEdit">{{ t('agent.page.cancel') }}</button>
                <button type="button" class="bubble-action primary" :disabled="!editDraft.trim() || busy" @click="submitEdit(turn)">{{ t('agent.page.editSend') }}</button>
              </div>
            </template>
            <template v-else>
              <div class="message-text" :class="{ clamped: !expandedTurns.has(turn.task_id) }">{{ turn.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, '') }}</div>
              <button
                v-if="(turn.prompt || '').length > 420"
                type="button"
                class="expand-toggle"
                @click="toggleTurn(turn.task_id)"
              >{{ expandedTurns.has(turn.task_id) ? t('agent.page.collapse') : t('agent.page.expand') }}</button>
                            <div v-if="turn.attachments?.length" class="bubble-files">
                <a v-for="(file, index) in turn.attachments" :key="`${file.url}-${index}`" class="bubble-file" :href="safeUrl(file.url) || undefined" target="_blank" rel="noopener" :title="file.name">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span class="bubble-file-name">{{ file.name }}</span>
                  <small v-if="file.size">{{ humanSize(file.size) }}</small>
                </a>
              </div>
            </template>
          </div>
          <div v-if="editingId !== turn.task_id" class="turn-actions end">
            <button v-if="canEdit(turn)" type="button" class="bubble-action" :title="t('agent.page.editHint')" @click="startEdit(turn)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>{{ t('agent.page.edit') }}
            </button>
            <button type="button" class="bubble-action" @click="copyMessage(turn.prompt)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
              <span class="bubble-action-label">{{ t('agent.page.copy') }}</span>
            </button>
          </div>
          <div class="bubble agent"><div class="message-head"><b>Agent</b><span :class="turn.state">{{ stateName(turn.state) }}</span></div>
            <IntentStrip
              v-if="turnIntents(turn).intents.length || turnIntents(turn).review"
              :intents="turnIntents(turn).intents"
              :rate="turnIntents(turn).rate"
              :approach="turnIntents(turn).approach"
              :review="turnIntents(turn).review"
            />
            <details v-if="workSteps(turn).length" class="turn-collapse" :open="!turnFinished(turn)">
              <summary>
                <span class="turn-collapse-icon" :class="turn.state" aria-hidden="true">{{ turnStateIcon(turn.state) }}</span>
                <span class="turn-collapse-state">{{ stateName(turn.state) }}</span>
                <template v-if="turnDuration(turn)"><span class="turn-collapse-dot" aria-hidden="true">·</span>{{ turnDuration(turn) }}</template>
                <span class="turn-collapse-count">{{ workSteps(turn).length }} {{ t('agent.page.steps') }}</span>
              </summary>
            <div class="steps"><template v-for="step in workSteps(turn)" :key="step.task_id">
              <div v-if="step.kind === 'think' && (step.result || step.reasoning || step.state === 'running' || step.error)" class="agent-speech"><small v-if="modelAnnotation(step)" class="muted model-annotation" :class="{fallback: modelInfo(step).fellBack}" :title="modelReason(step)">{{ modelAnnotation(step) }}</small><ThinkChain v-if="step.reasoning" :reasoning="step.reasoning" :open="step.state === 'running' && !step.result" :running="step.state === 'running' && !step.result" :started-at="step.started_at" :label="t('agent.page.reasoning')" /><template v-if="step.result"><MarkdownContent :content="step.result" @open="openPath" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else-if="step.state === 'running'" class="muted">{{ t('agent.page.agentDrafting') }}</small><p v-if="step.error" class="error">{{ friendlyError(step.error) }}</p></div>
              <div v-else-if="step.kind === 'subagent'" class="subagent-card">
                <button type="button" class="subagent-card-head" @click="openSub(step)">
                  <span :class="step.state">●</span>
                  <strong>{{ t('agent.page.subagent') }}</strong>
                  <span class="subagent-prompt">{{ step.prompt }}</span>
                  <small>{{ stateName(step.state) }}<template v-if="subChildCount(step)"> · {{ subChildCount(step) }} {{ t('agent.page.steps') }}</template></small>
                  <span class="subagent-chevron" aria-hidden="true">▸</span>
                </button>
                <p v-if="step.error" class="error subagent-card-error">{{ friendlyError(step.error) }}</p>
              </div>
              <ToolStepCard v-else-if="step.kind === 'tool'" :step="step" :executor-id="executor?.plugin_id" :format-error="friendlyError" @open="openPath" />
              <details v-else-if="step.kind !== 'think'"><summary><span :class="step.state">●</span> {{ stepLabel(step) }} · {{ step.prompt }} <small>{{ stateName(step.state) }}</small></summary><pre>{{ step.result || step.error || (step.state === 'running' ? t('agent.page.executing') : t('agent.page.completedNoOutput')) }}</pre></details>
            </template></div>
            </details>
            <MarkdownContent v-if="turn.result" :content="turn.result" @open="openPath" />
            <div v-if="turnArtifacts(turn).length" class="turn-artifacts">
              <strong class="turn-artifacts-title">{{ t('agent.page.artifacts') }}</strong>
              <button
                v-for="item in turnArtifacts(turn)"
                :key="item.path"
                type="button"
                class="artifact-chip"
                :title="item.path"
                @click="openPath(item.path)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3v5h5" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
                <span class="artifact-name">{{ baseName(item.path) }}</span>
                <small v-if="item.description" class="artifact-desc">{{ item.description }}</small>
              </button>
            </div>
            <div v-if="turn.error" class="error">{{ friendlyError(turn.error) }}</div>
            <p v-if="['running','pending'].includes(turn.state)" class="muted">{{ t('agent.page.agentProcessing') }}</p>
          </div>
          <div v-if="turn.result" class="turn-actions start">
            <button type="button" class="bubble-action" @click="copyMessage(turn.result)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
              <span class="bubble-action-label">{{ t('agent.page.copy') }}</span>
            </button>
          </div>
        </article>
        </div>
        </Transition>
        <Transition name="toast">
          <div v-if="toast" class="copy-toast" role="status" aria-live="polite">{{ toast }}</div>
        </Transition>
        <button v-if="!followLatest && !activeSub" type="button" class="jump-latest" :aria-label="t('agent.page.jumpLatest')" :title="t('agent.page.jumpLatest')" @click="jumpToLatest">↓ {{ t('agent.page.jumpLatest') }}</button>
      </div>
      <section v-if="!showingTask && !activeSub && currentPlan" class="plan-card" :class="{ collapsed: !planOpen }">
        <header class="plan-head">
          <span class="plan-dot" aria-hidden="true" />
          <strong>{{ t('agent.page.planReady') }}</strong>
          <span class="plan-meta">{{ currentPlan.title }}<template v-if="currentPlan.steps"> · {{ t('agent.page.planSteps', { n: currentPlan.steps }) }}</template></span>
          <span class="plan-actions">
            <button type="button" class="plan-btn primary" :disabled="!!active || busy" @click="buildPlan">{{ t('agent.page.planBuild') }}</button>
            <button type="button" class="plan-btn" @click="planOpen = !planOpen">{{ planOpen ? t('agent.page.planHide') : t('agent.page.planShow') }}</button>
          </span>
        </header>
        <div v-if="planOpen" class="plan-body">
          <ul v-if="planSteps.length" class="plan-review" :aria-label="t('agent.page.planReview')">
            <li v-for="step in planSteps" :key="step.n" :class="{ rejected: isRejected(step.n) }">
              <label>
                <input type="checkbox" :checked="!isRejected(step.n)" @change="toggleStep(step.n)" />
                <span class="plan-step-n">{{ step.n }}</span>
                <span>{{ step.text }}</span>
              </label>
            </li>
          </ul>
          <MarkdownContent :content="currentPlan.markdown" />
          <iframe v-if="currentPlan.demo" class="plan-demo" sandbox="" :srcdoc="currentPlan.demo" :title="currentPlan.title" />
        </div>
      </section>
      <form v-if="!showingTask && !activeSub" class="composer" :class="{ dropping }" @submit.prevent="send()" @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDropFiles">
        <ul v-if="queuedMessages.length" class="queued" :aria-label="t('agent.page.queuedTitle')">
          <li v-for="(item, index) in queuedMessages" :key="index">
            <span class="queued-n">{{ index + 1 }}</span>
            <span class="queued-text">{{ item }}</span>
            <button type="button" :title="t('agent.page.queuedRemove')" :aria-label="t('agent.page.queuedRemove')" @click="dropQueued(index)">✕</button>
          </li>
        </ul>
        <div v-if="dropping" class="drop-veil" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <span>{{ t('agent.page.dropToUpload') }}</span>
        </div>
        <section v-if="todos.length" class="todo-panel" :class="{ collapsed: !todoOpen }" :aria-label="t('agent.page.todoList')">
          <header>
            <button type="button" class="todo-toggle" :aria-expanded="todoOpen" @click="todoOpen = !todoOpen">
              <strong>{{ t('agent.page.todo') }}</strong>
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
        <div v-if="compactNotice" class="compact-notice" :class="{ running: compacting }"><span v-if="compacting" class="tree-spin small" aria-hidden="true"></span>{{ compactNotice }}</div>
        <div class="options-collapse" :class="{ open: optionsOpen }">
        <div class="execution-options">
          <label>{{ t('agent.page.executor') }}<AppSelect v-model="executorId" :aria-label="t('agent.page.executor')" :disabled="!!active || busy" :options="[{value:'',label:t('agent.page.autoExecutor')},...store.agents.map(agent=>({value:agent.plugin_id,label:`${agent.host?.hostname || agent.name} · ${agent.plugin_id}`,disabled:!store.isHealthy(agent)}))]" /></label>
          <label>{{ t('agent.page.workspace') }}<button type="button" class="workspace-select" :disabled="!!active || busy || !executor" :title="workdir || executor?.host?.workdir" @click="browse(workdir || executor?.host?.workdir || '')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg> {{ workdir || t('agent.page.selectFolder') }}</button></label>
          <label v-if="taskKind === 'agent'">{{ t('agent.page.agentSubKind') }}<AppSelect v-model="agentSubKind" :aria-label="t('agent.page.agentSubKind')" :disabled="!!active || busy" :options="subKindOptions" /></label>
        </div>
        </div>
        <input ref="fileInput" type="file" multiple hidden @change="onFilesPicked" />
        <div ref="composerInput" class="composer-input">
          <Teleport to="body">
            <Transition name="slash-menu">
            <div v-if="slashOpen" class="slash-menu" :style="slashMenuStyle" role="listbox" :aria-label="t('agent.page.skillsAndCommands')">
              <button v-for="(item, index) in slashItems" :key="item.name" type="button" class="slash-item" :class="{ active: index === slashIndex }" role="option" :aria-selected="index === slashIndex" @mousedown.prevent="applySlash(item)" @mouseenter="slashIndex = index">
                <span class="slash-name">/{{ item.name }}</span>
                <span class="slash-desc">{{ item.description }}</span>
              </button>
            </div>
            </Transition>
          </Teleport>
          <div v-if="attachments.length || attachError" class="attach-chips">
            <span v-for="(file, index) in attachments" :key="index" class="attach-chip" :title="`${file.mime} · ${file.size} B`">
              <span class="attach-chip-name">{{ file.name }}</span>
              <button type="button" :aria-label="t('agent.page.removeAttachment')" :title="t('agent.page.remove')" @click="removeAttachment(index)">×</button>
            </span>
            <span v-if="attachError" class="attach-error">{{ attachError }}</span>
          </div>
          <div v-if="steerNotice" class="steer-notice" role="status">{{ steerNotice }}</div>
          <div v-if="active?.kind === 'agent'" class="steer-row">
            <input
              v-model="steerText"
              class="steer-input"
              :placeholder="t('agent.page.steerPlaceholder')"
              :aria-label="t('agent.page.steerPlaceholder')"
              maxlength="4000"
              @keydown.enter.exact.prevent="sendSteer"
            />
            <button type="button" class="steer-send" :disabled="steerBusy || !steerText.trim()" @click="sendSteer">{{ t('agent.page.steerSend') }}</button>
          </div>
          <textarea ref="composerArea" v-model="draft" :disabled="busy || session?.state === 'archived'" :placeholder="session?.state === 'archived' ? t('agent.page.restoreToChat') : t('agent.page.composerPlaceholder')" :aria-label="t('agent.page.composerAria')" @keydown="onComposerKey" @paste="onPaste" />
          <div class="composer-actions">
            <button type="button" class="attach-fly" :disabled="!!active || busy || uploading || session?.state === 'archived'" :aria-label="t('agent.page.addAttachment')" :title="uploading ? t('agent.page.uploading') : t('agent.page.attachHint')" @click="pickFiles">
              <span v-if="uploading" class="tree-spin small" aria-hidden="true"></span>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="hint right"><b>{{ t('agent.page.addAttachment') }}</b><i>{{ uploading ? t('agent.page.uploading') : t('agent.page.attachHint') }}</i></span>
            </button>
            <button v-if="active?.kind !== 'agent'" type="submit" class="send-fly" :disabled="busy || !!active || (!draft.trim() && !attachments.length) || session?.state === 'archived'" :aria-label="t('agent.page.send')" :title="t('agent.page.send')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.5 2.5 10.8 13.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5 2.5 14.5 21.5l-3.7-8.3-8.3-3.7 19-7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
              <span class="hint right"><b>{{ t('agent.page.send') }}</b><i>{{ t('agent.page.tipSend') }}</i></span>
            </button>
            <button v-else type="button" class="send-fly stop" @click="stop" :aria-label="t('agent.page.stop')" :title="t('agent.page.stop')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>
            </button>
            <button v-if="runningTasks.length > 1" type="button" class="send-fly stop-all" @click="stopAll" :aria-label="t('agent.page.stopAll')" :title="t('agent.page.stopAll')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="8" width="14" height="9" rx="2" fill="currentColor"/><path d="M8 5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
        <footer class="composer-footer">
          <div class="footer-status">
            <div v-if="contextUsage" class="ctx-usage" tabindex="0" :aria-label="t('agent.page.contextUsage')"><svg class="ctx-ring" viewBox="0 0 20 20" aria-hidden="true"><circle class="ctx-track" cx="10" cy="10" r="8"/><circle v-if="contextRatio !== null" class="ctx-arc" cx="10" cy="10" r="8" :stroke="contextRingColor" :stroke-dasharray="`${(contextRatio * CTX_RING_CIRCUMFERENCE).toFixed(2)} ${CTX_RING_CIRCUMFERENCE.toFixed(2)}`"/></svg><span class="ctx-value">{{ fmtK(contextUsage.tokens) }}</span><div class="ctx-tip" role="tooltip"><strong>{{ t('agent.page.contextUsage') }}</strong><div class="ctx-used"><b>{{ fmtK(contextUsage.tokens) }}</b><span>{{ t('agent.page.tokensUsed') }}</span></div><div class="ctx-row" v-for="row in ctxRows" :key="row.key"><span>{{ row.label }}</span><span>{{ row.value }}</span></div></div></div>
            <span class="connection-hint"><span v-if="active?.kind === 'compact'" class="tree-spin small" aria-hidden="true" /><i v-else :class="{online:store.onlineCount>0}" />{{ active?.kind === 'compact' ? t('agent.page.compacting') : store.onlineCount ? t('agent.page.executorOnline') : t('agent.page.executorOffline') }}</span>
          </div>
          <div class="footer-actions">
                        <div class="mode-switch" role="group" :aria-label="t('agent.page.taskKind')">
              <button v-for="choice in kindChoices" :key="choice.value" type="button" class="mode-btn" :class="{ active: taskKind === choice.value }" :disabled="busy" :aria-pressed="taskKind === choice.value" :aria-label="choice.label" @click="taskKind = choice.value">
                {{ choice.label }}
                <span class="hint"><b>{{ choice.label }} · {{ choice.tag }}</b><i>{{ choice.desc }}</i></span>
              </button>
            </div>
            <span class="footer-sep" aria-hidden="true" />
                        <button type="button" class="ct" :class="{ on: permissionMode === 'full_access' }" :disabled="!!active || busy" :aria-pressed="permissionMode === 'full_access'" :aria-label="t('agent.page.permissions')" @click="permissionMode = permissionMode === 'full_access' ? 'normal' : 'full_access'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.3-2.9 7.6-7 9.5-4.1-1.9-7-5.2-7-9.5V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path v-if="permissionMode === 'full_access'" d="M9 12l2.2 2.2L15.5 10" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="hint right"><b>{{ t('agent.page.permissions') }} · {{ permissionMode === 'full_access' ? t('agent.page.permFullAccess') : t('agent.page.permNormal') }}</b><i>{{ t('agent.page.tipPermission') }}</i></span>
            </button>
            <button type="button" class="ct" :class="{ on: minimalMode === 'on' }" :disabled="!!active || busy" :aria-pressed="minimalMode === 'on'" :aria-label="t('agent.page.minimalMode')" @click="minimalMode = minimalMode === 'on' ? 'off' : 'on'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>
              <span class="hint right"><b>{{ t('agent.page.minimalMode') }} · {{ minimalMode === 'on' ? t('agent.page.minimalOn') : t('agent.page.minimalOff') }}</b><i>{{ t('agent.page.minimalModeHint') }}</i></span>
            </button>
            <button type="button" class="ct" :class="{ on: duetMode === 'on' }" :disabled="!!active || busy" :aria-pressed="duetMode === 'on'" :aria-label="t('agent.page.duetMode')" @click="duetMode = duetMode === 'on' ? 'off' : 'on'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8.5" cy="8" r="3" stroke="currentColor" stroke-width="1.7"/><circle cx="16" cy="14.5" r="2.6" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c.6-2.4 2.6-3.8 5-3.8s4.4 1.4 5 3.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
              <span class="hint right"><b>{{ t('agent.page.duetMode') }} · {{ duetMode === 'on' ? t('agent.page.duetOn') : t('agent.page.duetOff') }}</b><i>{{ t('agent.page.duetModeHint') }}</i></span>
            </button>
            <ModelThinkingPicker compact :model-id="modelId" :intensity="intensity" :models="modelOptions" :disabled="!!active || busy" @update:model-id="modelId = $event" @update:intensity="intensity = $event" @open="fetchModels" />
            <button type="button" class="ct" :disabled="!session || !!active || busy || session.state === 'archived'" :aria-label="t('agent.page.compactAction')" @click="compact">
              <span v-if="compacting" class="tree-spin small" aria-hidden="true"></span>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4v5H4M15 20v-5h5M4 9l5 5M20 15l-5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="hint right"><b>{{ t('agent.page.compactAction') }}</b><i>{{ t('agent.page.tipCompact') }}</i></span>
            </button>
            <button type="button" class="ct" :class="{ on: optionsOpen }" :aria-expanded="optionsOpen" :aria-label="t('agent.page.settings')" @click="optionsOpen = !optionsOpen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="1.6"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 13.6H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="hint right"><b>{{ t('agent.page.settings') }}</b><i>{{ t('agent.page.tipSettings') }}</i></span>
            </button>
          </div>
        </footer>
      </form>
    </section>
     <DirectoryDialog :open="browserOpen" :busy="browserBusy" :error="browserError"
       :path="directory.path" :parent="directory.parent" :dirs="directory.directories"
       :roots="directory.roots" :default-dir="executor?.host?.workdir || ''"
       :hostname="executor?.host?.hostname || ''" :folder="folderName"
       @browse="browse" @create="createFolder" @select="selectDirectory" @close="closeBrowser" />
        <div v-if="renameOpen" class="directory-backdrop" @click.self="cancelRename">
      <section class="directory-dialog rename-dialog" role="dialog" aria-modal="true" :aria-label="t('agent.page.rename')" @keydown="onRenameKey">
        <h2>{{ t('agent.page.rename') }}</h2>
        <input ref="renameInput" v-model="renameValue" :placeholder="t('agent.page.workspaceName')" :aria-label="t('agent.page.workspaceName')" @keydown.enter.prevent="confirmRename" />
        <footer>
          <button type="button" @click="cancelRename">{{ t('agent.page.cancel') }}</button>
          <button type="button" :disabled="!renameValue.trim()" @click="confirmRename">{{ t('agent.page.rename') }}</button>
        </footer>
      </section>
    </div>
    <aside class="dock" :class="{open:dockOpen}" :aria-label="t('agent.page.contextTools')">
      <button type="button" class="dock-btn dock-toggle" :title="dockOpen ? t('agent.page.collapse') : t('agent.page.contextTools')" :aria-expanded="dockOpen" @click="toggleDock">
        <svg v-if="!dockOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.7"/></svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span class="hint left"><b>{{ t('agent.page.contextTools') }}</b><i>{{ t('agent.page.tipDock') }}</i></span>
      </button>
      <button type="button" class="dock-btn" :class="{active:browserViewOpen}" :disabled="!browserStatus?.running" :title="t('agent.page.browserView')" @click="toggleBrowserView">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="15" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M3 8.5h18" stroke="currentColor" stroke-width="1.7"/><circle cx="6.2" cy="6.3" r=".7" fill="currentColor"/><circle cx="8.7" cy="6.3" r=".7" fill="currentColor"/></svg>
        <span class="dock-dot" :class="{on:browserStatus?.running}" />
        <span class="hint left"><b>{{ t('agent.page.browserView') }}</b><i>{{ t('agent.page.tipBrowser') }}</i></span>
      </button>
      <button type="button" class="dock-btn" :class="{active:treeOpen}" :title="t('agent.page.projectTree')" @click="toggleTree">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        <span class="hint left"><b>{{ t('agent.page.projectTree') }}</b><i>{{ t('agent.page.tipTree') }}</i></span>
      </button>
      <button type="button" class="dock-btn" :class="{active:gitOpen}" :title="t('agent.page.gitTitle')" :disabled="!gitRoot" @click="gitOpen=!gitOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="8" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M6 8.4v7.2M18 10.4c0 3-2.4 3.6-6 3.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        <span class="hint left"><b>{{ t('agent.page.gitTitle') }}</b><i>{{ t('agent.page.tipGit') }}</i></span>
      </button>
      <button type="button" class="dock-btn" :class="{active:termOpen}" :title="t('agent.page.terminal')" @click="toggleTerm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M7.5 9l3 3-3 3M13 15h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="hint left"><b>{{ t('agent.page.terminal') }}</b><i>{{ t('agent.page.tipTerm') }}</i></span>
      </button>
      <button type="button" class="dock-btn" :class="{active:usageOpen}" :title="t('agent.page.contextUsage')" @click="toggleUsage">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="hint left"><b>{{ t('agent.page.contextUsage') }}</b><i>{{ t('agent.page.tipUsage') }}</i></span>
      </button>
      <button type="button" class="dock-btn" :class="{active:hostOpen}" :title="t('agent.page.host')" @click="hostOpen=!hostOpen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 20h8M12 16v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        <span class="hint left"><b>{{ t('agent.page.host') }}</b><i>{{ t('agent.page.tipHost') }}</i></span>
      </button>
    </aside>

    <GitPanel v-if="gitOpen" :root="gitRoot" @close="gitOpen=false" />

    <Transition name="browser-panel">
    <section v-if="browserViewOpen" class="browser-panel" :style="panelStyle">
      <div class="browser-toolbar" @pointerdown="onToolbarDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <button type="button" :disabled="!browserStatus?.running || !browserStatus?.canGoBack || browserBusyAction" :title="t('agent.page.back')" @click="postBrowserAction({ action: 'back' })">◀</button>
        <button type="button" :disabled="!browserStatus?.running || !browserStatus?.canGoForward || browserBusyAction" :title="t('agent.page.forward')" @click="postBrowserAction({ action: 'forward' })">▶</button>
        <button type="button" :disabled="!browserStatus?.running || browserBusyAction" :title="t('agent.page.browserReload')" @click="postBrowserAction({ action: 'reload' })">⟳</button>
        <form class="browser-url" @submit.prevent="browserGoto">
          <span class="browser-lock" :class="{on:browserStatus?.running}">●</span>
          <input v-model="browserUrlInput" :placeholder="browserStatus?.url || 'about:blank'" @focus="browserUrlFocused = true" @blur="browserUrlFocused = false" />
        </form>
        <button type="button" :title="t('agent.page.close')" @click="toggleBrowserView">✕</button>
      </div>
      <div v-if="browserTabs.length" class="browser-tabbar">
        <button v-for="tab in browserTabs" :key="tab.id" type="button" class="browser-tab" :class="{active:tab.active}" :title="tab.url" @click="browserActivateTab(tab.id)">
          <span class="browser-tab-title">{{ tab.title || tab.url || 'about:blank' }}</span>
          <span class="browser-tab-close" :title="t('agent.page.closeTab')" @click.stop="browserCloseTab(tab.id)">✕</span>
        </button>
        <button type="button" class="browser-tab-new" :title="t('agent.page.newTab')" @click="browserNewTab">+</button>
      </div>
      <div class="browser-viewport" tabindex="0" @wheel="onViewWheel" @pointerdown="onViewDown" @pointermove="onViewMove" @pointerup="onViewUp" @keydown="onViewKey" @contextmenu.prevent>
        <img v-if="browserStreamSrc" ref="browserImg" :src="browserStreamSrc" alt="browser viewport" draggable="false" @error="onBrowserStreamError" />
        <p v-else class="browser-empty">{{ browserStatus?.error || (browserStatus?.running ? t('agent.page.connecting') : t('agent.page.browserNotRunning')) }}</p>
      </div>
      <span class="browser-resize" :title="t('agent.page.resize')" @pointerdown="onResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="treeOpen" class="tree-panel" :style="treePanelStyle">
      <div class="browser-toolbar" @pointerdown="onTreeDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title">{{ t('agent.page.projectTree') }}</strong>
        <button type="button" :title="t('agent.page.workspaceRootAction')" @click="treeReload(treeRootPathFor())"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 11l8-7 8 7M6 10v9h12v-9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button type="button" :title="t('agent.page.refresh')" @click="treeReload(treeRootPath)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button type="button" :title="t('agent.page.close')" @click="treeOpen=false"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      </div>
      <div class="tree-crumb" :title="treeRootPath || executor?.host?.workdir || ''">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        <span>{{ treeRootPath || executor?.host?.workdir || t('agent.page.workspaceRoot') }}</span>
      </div>
      <div class="tree-body">
        <div class="tree-list" role="tree">
          <div v-if="treeLoading" class="tree-state"><span class="tree-spin" aria-hidden="true"></span>{{ t('agent.page.loading') }}</div>
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
            <div v-if="!treeRows.length" class="tree-state">{{ t('agent.page.emptyFolder') }}</div>
          </template>
        </div>
      </div>
      <span class="browser-resize" :title="t('agent.page.resize')" @pointerdown="onTreeResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="usageOpen" class="usage-panel" :style="usagePanelStyle">
      <div class="browser-toolbar" @pointerdown="onUsageDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title">{{ t('agent.page.contextUsage') }}</strong>
        <button type="button" :title="t('agent.page.refresh')" @click="fetchContextUsage()">⟳</button>
        <button type="button" :title="t('agent.page.close')" @click="usageOpen=false">✕</button>
      </div>
      <div class="usage-body">
        <div class="usage-big"><b>{{ fmtK(contextUsage?.tokens || 0) }}</b><span>{{ t('agent.page.tokensUsed') }}</span></div>
        <div class="ctx-row" v-for="row in ctxRows" :key="row.key"><span>{{ row.label }}</span><span>{{ row.value }}</span></div>
        <p v-if="!ctxRows.length" class="tree-msg">{{ t('agent.page.noData') }}</p>
      </div>
      <span class="browser-resize" :title="t('agent.page.resize')" @pointerdown="onUsageResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="hostOpen" class="host-window" :style="hostPanelStyle">
      <div class="browser-toolbar" @pointerdown="onHostDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title">{{ t('agent.page.host') }}</strong>
        <button type="button" :title="t('agent.page.refresh')" @click="fetchHost()">⟳</button>
        <button type="button" :title="t('agent.page.close')" @click="hostOpen=false">✕</button>
      </div>
      <div class="host-body">
        <template v-if="executor">
          <div class="host-head">
            <span class="host-name">{{ executor.host?.hostname || executor.name }}</span>
            <span class="host-status" :class="store.isHealthy(executor) ? 'ok' : 'off'">{{ store.isHealthy(executor) ? t('agent.page.online') : t('agent.page.offline') }}</span>
          </div>
          <div class="usage-rings">
            <div class="usage-metric"><div class="usage-ring" :style="ringStyle(cpuDisplay)"><b>{{ Math.round(cpuDisplay) }}%</b></div><span>CPU</span></div>
            <div class="usage-metric"><div class="usage-ring" :style="ringStyle(memDisplay)"><b>{{ Math.round(memDisplay) }}%</b></div><span>{{ t('agent.page.memory') }}</span></div>
            <small class="host-sampled">{{ hostUsage ? t('agent.page.sampled') + ' ' + time(hostUsage.sampled_at) : t('agent.page.sampling') }}</small>
          </div>
          <dl class="host-details">
            <div><dt>{{ t('agent.page.address') }}</dt><dd>{{ executor.address }}</dd></div>
            <div><dt>{{ t('agent.page.os') }}</dt><dd>{{ executor.host?.os || '—' }} / {{ executor.host?.arch || '—' }}</dd></div>
            <div><dt>CPU</dt><dd>{{ executor.host?.cpu_model || '—' }} · {{ executor.host?.cpu_cores || '—' }} {{ t('agent.page.cores') }}</dd></div>
            <div><dt>{{ t('agent.page.memory') }}</dt><dd>{{ gib(executor.host?.memory_available_bytes) }} / {{ gib(executor.host?.memory_total_bytes) }}</dd></div>
            <div><dt>{{ t('agent.page.activeTasks') }}</dt><dd>{{ executor.active_tasks }}</dd></div>
            <div><dt>{{ t('agent.page.heartbeat') }}</dt><dd>{{ executor.last_heartbeat_age_seconds }}s</dd></div>
            <div><dt>{{ t('agent.page.workdir') }}</dt><dd>{{ executor.host?.workdir || '—' }}</dd></div>
          </dl>
        </template>
        <p v-else class="host-empty">{{ t('agent.page.noHostInfo') }}</p>
      </div>
      <span class="browser-resize" :title="t('agent.page.resize')" @pointerdown="onHostResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="fileOpen" class="file-panel" :style="filePanelStyle" @pointerdown="cancelAutoClose" @wheel.passive="cancelAutoClose" @keydown="cancelAutoClose">
      <div class="browser-toolbar" @pointerdown="onFileDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title" :title="fileData?.path">{{ baseName(fileData?.path) || t('agent.page.file') }}</strong>
        <span v-if="fileFollowing" class="file-live" :title="t('agent.page.streaming')"><span class="file-live-dot" aria-hidden="true"></span>{{ t('agent.page.streaming') }}</span>
        <span v-if="fileDirty" class="file-dirty" :title="t('agent.page.unsaved')" aria-hidden="true"></span>
        <button v-if="fileView === 'markdown'" type="button" :title="mdSource ? t('agent.page.renderedPreview') : t('agent.page.viewSource')" @click="mdSource = !mdSource"><svg v-if="mdSource" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg><svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 6 3 12l5.5 6M15.5 6 21 12l-5.5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button v-if="fileEditable || fileDirty" type="button" :disabled="!fileDirty || fileSaving" :title="t('agent.page.saveShortcut')" @click="saveFile"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3h11l3 3v15H5V3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 3v6h8M8 21v-7h8v7" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button>
        <button type="button" :disabled="!fileData || fileLoading" :title="t('agent.page.reload')" @click="reloadFile"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button type="button" :title="t('agent.page.close')" @click="closeFilePanel"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      </div>
      <p v-if="fileLoading" class="tree-msg">{{ t('agent.page.loading') }}</p>
      <p v-else-if="fileError" class="tree-msg error">{{ fileError }}</p>
      <FileViewer v-else-if="fileData" v-model="fileDraft" :path="fileData.path" :view="fileView" :bytes="fileBytes" :mime="fileMime" :text="fileText" :md-source="mdSource" @keydown="onFileEditorKey" />
      <p v-else class="tree-msg">{{ t('agent.page.noFile') }}</p>
      <footer v-if="fileData" class="file-foot">
        <span :title="fileData.path">{{ fileData.path }}</span>
        <small v-if="fileNotice" class="file-saved">{{ fileNotice }}</small>
        <small v-else-if="fileEditable && fileDirty" class="file-unsaved">{{ t('agent.page.unsaved') }}</small>
        <small v-else-if="fileByteLength">{{ humanSize(fileByteLength) }}</small>
        <small v-else-if="fileData.totalLines">{{ fileData.totalLines }} {{ t('agent.page.lines') }}</small>
      </footer>
      <span class="browser-resize" :title="t('agent.page.resize')" @pointerdown="onFileResizeDown"></span>
    </section>
    </Transition>

    <Transition name="browser-panel">
    <section v-if="termOpen" class="term-panel" :style="termPanelStyle">
      <div class="browser-toolbar" @pointerdown="onTermDown">
        <span class="browser-grab" aria-hidden="true">⠿</span>
        <strong class="tree-title">{{ t('agent.page.terminal') }}</strong>
        <div class="term-exec">
          <AppSelect :model-value="termExecutorId" :aria-label="t('agent.page.executor')" :options="executorOptions" :placeholder="t('agent.page.chooseExecutor')" @change="termChangeExecutor" />
        </div>
        <button type="button" :title="t('agent.page.clear')" @click="termClear"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button type="button" :title="t('agent.page.close')" @click="termOpen=false"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      </div>
      <div ref="termBody" class="term-body">
        <p v-if="!termLines.length" class="term-hint">{{ t('agent.page.terminalHint') }}</p>
        <div v-for="(line, index) in termLines" :key="index" class="term-line" :class="line.kind">{{ line.text }}</div>
        <div v-if="termBusy" class="term-line note term-running"><span class="tree-spin small" aria-hidden="true"></span>{{ t('agent.page.terminalRunning') }}</div>
      </div>
      <form class="term-input" @submit.prevent="termRun">
        <span class="term-prompt" aria-hidden="true">❯</span>
        <input v-model="termInput" :disabled="termBusy" spellcheck="false" autocomplete="off" autocapitalize="off" :aria-label="t('agent.page.command')" :placeholder="termBusy ? t('agent.page.commandRunning') : t('agent.page.typeCommand')" @keydown="termKey" />
        <button type="submit" :disabled="termBusy || !termInput.trim()">{{ t('agent.page.run') }}</button>
      </form>
      <span class="browser-resize" :title="t('agent.page.resize')" @pointerdown="onTermResizeDown"></span>
    </section>
    </Transition>
  </main>
</template>

<style scoped src="./styles/agents-page.css"></style>
<style src="./styles/agents-page-global.css"></style>
