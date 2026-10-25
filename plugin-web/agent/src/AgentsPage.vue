<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAgentsStore, type TaskRow } from './store'
import MarkdownContent from './MarkdownContent.vue'
import ToolStepCard from './ToolStepCard.vue'
import FileViewer from './FileViewer.vue'
import ModelThinkingPicker from './ModelThinkingPicker.vue'
import GitPanel from './GitPanel.vue'
import ThinkChain from './ThinkChain.vue'
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
    await runAssessments({ action: 'hint', id: taskSelectedId.value, text })
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
async function send(override?: string, overrideAttachments?: Array<{ name: string; url: string; mime: string; size: number }>) {
  const text = override ?? draft.value
  if (override === undefined && text.trim()==='/compact') {await compact();return}
  const outgoing = overrideAttachments ?? attachments.value
  const hasAttachments = outgoing.length > 0
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
    <aside class="sessions">
      <header><h1>Agent</h1><button @click="create" :disabled="busy" :title="t('agent.page.newSession')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> {{ t('agent.page.newChat') }}</button></header>
      <div class="connection"><i :class="{online:store.onlineCount>0}" />{{ store.onlineCount }} {{ t('agent.page.executorsOnline') }} <button @click="store.fetchAgents()" :title="t('agent.page.refresh')" aria-label="refresh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
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
                <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : t('agent.page.youAgent') }}</span>
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
                  <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : t('agent.page.youAgent') }}</span>
                  <strong>{{ item.prompt || t('agent.page.untitledSession') }}</strong><small>{{ time(item.started_at) }}</small>
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
                  <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : t('agent.page.youAgent') }}</span>
                  <strong>{{ item.prompt || t('agent.page.untitledSession') }}</strong><small>{{ time(item.started_at) }}</small>
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
        <!-- 任务详情：选中一个任务后列表就地换成详情（ARTEX 的任务详情页），← 返回列表。
             聊天列保持原样——看得见图，也看得见 agent 在干什么。 -->
        <div v-if="taskSelectedId" class="task-detail">
          <div class="recon-task-head">
            <button type="button" class="recon-back" :title="t('agent.page.tasksTitle')" @click="taskSelectedId = null; taskDetail = null">←</button>
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
            <label>{{ t('agent.page.taskModel') }}<AppSelect v-model="newTaskModel" :options="[{ value: '', label: t('agent.page.taskModelAuto') }, ...modelOptions]" /></label>
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
    </aside>

    <section class="conversation">
      <header class="conversation-header">
        <div class="conversation-heading"><h2>{{ session?.prompt || t('agent.page.conversationTitle') }}</h2><p>{{ session && isLife(session) ? t('agent.page.lifeSessionSubtitle') : t('agent.page.ongoingSubtitle') }}</p></div>
        <div class="conversation-actions">
          <span class="browser-status" :class="{on:browserStatus?.running,off:browserStatus&&!browserStatus.enabled}" :title="browserTooltip"><i aria-hidden="true" />{{ browserLabel }}</span>
          <span v-if="active" class="running">{{ t('agent.page.running') }}</span>
          <div v-if="session" class="session-actions">
            <button type="button" class="icon-btn" :disabled="!!active" :title="session.state === 'archived' ? t('agent.page.restore') : t('agent.page.archive')" @click="manage(session.state === 'archived' ? 'restore' : 'archive')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M6 7v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9.5 11h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <button type="button" class="icon-btn danger" :disabled="!!active" :title="t('agent.page.delete')" @click="manage('delete')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
        </div>
      </header>
      <div v-if="error || store.error" class="error error-bar" role="alert"><span class="error-text">{{ error || store.error }}</span><button type="button" class="error-close" :aria-label="t('agent.page.close')" :title="t('agent.page.close')" @click="dismissError"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
      <div ref="transcript" class="transcript" @scroll.passive="onTranscriptScroll" @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDropFiles">
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
              <div v-if="step.kind === 'think' && (step.result || step.reasoning || step.state === 'running' || step.error)" class="agent-speech"><small v-if="modelAnnotation(step)" class="muted model-annotation" :class="{fallback: modelInfo(step).fellBack}" :title="modelReason(step)">{{ modelAnnotation(step) }}</small><ThinkChain v-if="step.reasoning" :reasoning="step.reasoning" :open="step.state === 'running' && !step.result" :label="t('agent.page.reasoning')" /><template v-if="step.result"><MarkdownContent :content="step.result" @open="openPath" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else-if="step.state === 'running'" class="muted">{{ t('agent.page.subagentDrafting') }}</small><p v-if="step.error" class="error">{{ friendlyError(step.error) }}</p></div>
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
              <div class="message-text">{{ turn.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, '') }}</div>
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
            <details v-if="workSteps(turn).length" class="turn-collapse" :open="!turnFinished(turn)">
              <summary>
                <span class="turn-collapse-icon" :class="turn.state" aria-hidden="true">{{ turnStateIcon(turn.state) }}</span>
                <span class="turn-collapse-state">{{ stateName(turn.state) }}</span>
                <template v-if="turnDuration(turn)"><span class="turn-collapse-dot" aria-hidden="true">·</span>{{ turnDuration(turn) }}</template>
                <span class="turn-collapse-count">{{ workSteps(turn).length }} {{ t('agent.page.steps') }}</span>
              </summary>
            <div class="steps"><template v-for="step in workSteps(turn)" :key="step.task_id">
              <div v-if="step.kind === 'think' && (step.result || step.reasoning || step.state === 'running' || step.error)" class="agent-speech"><small v-if="modelAnnotation(step)" class="muted model-annotation" :class="{fallback: modelInfo(step).fellBack}" :title="modelReason(step)">{{ modelAnnotation(step) }}</small><ThinkChain v-if="step.reasoning" :reasoning="step.reasoning" :open="step.state === 'running' && !step.result" :label="t('agent.page.reasoning')" /><template v-if="step.result"><MarkdownContent :content="step.result" @open="openPath" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else-if="step.state === 'running'" class="muted">{{ t('agent.page.agentDrafting') }}</small><p v-if="step.error" class="error">{{ friendlyError(step.error) }}</p></div>
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
      <form v-if="!activeSub" class="composer" :class="{ dropping }" @submit.prevent="send()" @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDropFiles">
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
    <div v-if="browserOpen" class="directory-backdrop" @click.self="closeBrowser"><section class="directory-dialog" role="dialog" aria-modal="true" :aria-label="t('agent.page.selectWorkspaceDirAria')" tabindex="-1"><header><h2>{{ t('agent.page.directoryTitle', { name: executor?.host?.hostname || t('agent.page.executor') }) }}</h2><button @click="closeBrowser">{{ t('agent.page.close') }}</button></header><div class="directory-roots"><button v-for="root in directory.roots" :key="root" :disabled="browserBusy" @click="browse(root)">{{ root }}</button><button :disabled="browserBusy" @click="browse(executor?.host?.workdir || '')">{{ t('agent.page.defaultDirectory') }}</button></div><code>{{ directory.path }}</code><form class="new-folder" @submit.prevent="createFolder"><input v-model="folderName" :placeholder="t('agent.page.newFolderName')" :aria-label="t('agent.page.newFolderName')" :disabled="browserBusy"/><button :disabled="browserBusy || !folderName.trim() || !directory.path">{{ t('agent.page.createFolder') }}</button></form><p v-if="browserError" class="error">{{ browserError }}</p><p v-if="browserBusy">{{ t('agent.page.readingDirectory') }}</p><div v-else class="directory-list"><button v-if="directory.parent!==directory.path" @click="browse(directory.parent)">{{ t('agent.page.parentDirectory') }}</button><button v-for="folder in directory.directories" :key="folder.path" @click="browse(folder.path)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg> {{ folder.name }}</button><p v-if="!directory.directories.length" class="muted">{{ t('agent.page.noSubdirectories') }}</p></div><footer><button :disabled="browserBusy || !!browserError || !directory.path" @click="selectDirectory">{{ t('agent.page.selectCurrentDirectory') }}</button></footer></section></div>
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

<style scoped>
.workspace{--code-font:ui-monospace,'Cascadia Code','JetBrains Mono',Consolas,'SFMono-Regular',Menlo,monospace;display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}

button,input,textarea,select{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}
button{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}
button:disabled{opacity:.45;cursor:default}
button:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}
input:focus,textarea:focus,select:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}
input[type="checkbox"]{width:auto;accent-color:var(--md-primary)}

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

.session-card small{min-width:0;overflow-wrap:anywhere}
.origin,small,.sessions .muted{font-size:12px;color:var(--md-on-surface-variant)}
.origin{font-weight:600;letter-spacing:.02em}
.ledger-button{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:13px;font-weight:550}
.ledger-button.chosen{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}

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

.icon-btn{width:32px;height:32px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);flex-shrink:0;transition:background-color 160ms,transform 160ms var(--ease-emphasized-decel)}
.icon-btn:hover:not(:disabled){background:var(--md-secondary-container)}
.icon-btn.active{background:color-mix(in srgb,var(--md-primary) 16%,transparent);color:var(--md-primary)}
.icon-btn.danger{color:var(--md-error)}
.icon-btn.danger:hover:not(:disabled){background:color-mix(in srgb,var(--md-error) 14%,transparent)}
.chip-btn{height:30px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;border-radius:999px;font-size:12.5px;font-weight:600;flex-shrink:0;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);transition:background-color 160ms,transform 160ms var(--ease-emphasized-decel)}
.chip-btn:hover:not(:disabled){background:var(--md-secondary-container)}
.chip-btn.active{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}

.footer-sep{width:1px;height:18px;background:var(--md-outline-variant);flex:none;margin:0 2px}
.mode-switch{display:inline-flex;align-items:center;gap:2px;padding:2px;border-radius:999px;background:var(--md-surface-container-high);flex:none}
#app .workspace .mode-switch .mode-btn{position:relative;min-height:0;height:26px;padding:0 11px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;letter-spacing:.01em;cursor:pointer;transition:background-color 150ms,color 150ms}
#app .workspace .mode-switch .mode-btn:hover:not(:disabled):not(.active){background:color-mix(in srgb,var(--md-on-surface) 7%,transparent);color:var(--md-on-surface)}
#app .workspace .mode-switch .mode-btn.active{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 1px 3px color-mix(in srgb,var(--md-primary) 45%,transparent)}
#app .workspace .mode-switch .mode-btn:disabled{opacity:.5;cursor:not-allowed}
#app .workspace .ct{position:relative;min-height:0;width:30px;height:30px;padding:0;display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--md-on-surface-variant);cursor:pointer;transition:background-color 150ms,color 150ms}
#app .workspace .ct:hover:not(:disabled){background:var(--md-surface-container-high);color:var(--md-on-surface)}
#app .workspace .ct.on{background:color-mix(in srgb,var(--md-primary) 16%,transparent);color:var(--md-primary);border-color:color-mix(in srgb,var(--md-primary) 35%,transparent)}
#app .workspace .ct:disabled{opacity:.4;cursor:not-allowed}

#app .workspace :is(.icon-btn,.chip-btn,.attach-fly,.send-fly):active:not(:disabled){transform:scale(.97)}
#app .workspace :is(.icon-btn,.chip-btn):focus-visible,
.browser-toolbar button:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}

.conversation-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}
.conversation-heading{flex:1;min-width:180px}
.conversation-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.session-actions{display:flex;gap:6px;flex-shrink:0}

.composer-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.footer-status{display:flex;align-items:center;gap:12px;min-width:0}
.footer-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.connection-hint{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap}
.connection-hint i{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}
.connection-hint i.online{background:var(--md-success)}
.browser-panel,.tree-panel,.usage-panel,.host-window,.file-panel,.term-panel{position:fixed;left:0;top:0;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;background:var(--md-surface-container-low);box-shadow:var(--shadow-4)}
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

.dock{width:58px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:10px;padding:16px 0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
.dock-btn{position:relative;width:42px;height:42px;display:grid;place-items:center;border:0;border-radius:14px;background:transparent;color:var(--md-on-surface-variant);transition:background-color 160ms,color 160ms,transform 160ms var(--ease-emphasized-decel)}
.dock-badge{position:absolute;top:3px;right:3px;min-width:15px;height:15px;padding:0 4px;display:grid;place-items:center;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font-size:9.5px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;animation:dock-pulse 1.6s ease-in-out infinite;pointer-events:none}
@keyframes dock-pulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--md-primary) 45%,transparent)}50%{box-shadow:0 0 0 4px transparent}}

.dock-toggle{display:none}
.dock-btn:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-surface)}
.dock-btn:active:not(:disabled){transform:scale(.94)}
.dock-btn.active{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}
.dock-btn:disabled{opacity:.35;cursor:default}
.dock-btn:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}
.dock-dot{position:absolute;right:6px;top:6px;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}
.dock-dot.on{background:var(--md-success)}

@media(max-width:800px){
  .dock-toggle{display:grid}
  .dock:not(.open) .dock-btn:not(.dock-toggle){display:none}
  .dock:not(.open){gap:0}
}

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
@media (prefers-reduced-motion: reduce){.tree-chev{transition-duration:1ms}.tree-spin{animation-duration:1.6s}}
.tree-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.file-dirty{width:8px;height:8px;border-radius:50%;background:var(--md-primary);flex-shrink:0}

.file-live{display:inline-flex;align-items:center;gap:5px;flex:none;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:650;color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 14%,transparent);white-space:nowrap}
.file-live-dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:file-live-pulse 1s ease-in-out infinite}
@keyframes file-live-pulse{0%,100%{opacity:1}50%{opacity:.25}}
@media (prefers-reduced-motion: reduce){.file-live-dot{animation:none}}
.file-foot{display:flex;align-items:center;gap:10px;padding:5px 12px;background:var(--md-surface-container);font-size:11.5px;color:var(--md-on-surface-variant);border-top:1px solid var(--md-outline-variant)}
.file-foot span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font)}
.file-foot small{flex:none;font-variant-numeric:tabular-nums}
.file-saved{color:var(--md-success,#3ba55c);font-weight:650}
.file-unsaved{color:#B88412;font-weight:650}

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

.usage-body{flex:1;min-height:0;overflow:auto;padding:14px 16px}
.recon-body{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:14px;padding:14px 16px 20px;background:var(--md-surface-container-lowest)}
.recon-coverage-line{display:flex;align-items:baseline;justify-content:space-between;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}
.recon-coverage-line b{font-size:15px;font-weight:750;color:var(--md-on-surface);font-variant-numeric:tabular-nums}
.recon-coverage-line em{font-style:normal}
.recon-bar{margin-top:6px;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.recon-bar span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--md-primary),var(--md-tertiary));transition:width .3s ease}
.recon-block h4{display:flex;align-items:center;gap:6px;margin:0 0 8px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant)}
.recon-block h4 b{font-weight:700;opacity:.7}
.recon-chips{display:flex;flex-wrap:wrap;gap:6px}
.recon-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:11px}
.recon-chip b{font-weight:750}
.recon-items{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.recon-item{display:flex;gap:8px;font-size:12px;line-height:1.45;color:var(--md-on-surface-variant)}
.recon-item p{margin:0;color:var(--md-on-surface)}
.recon-item small{display:block;margin-top:2px;font-size:11px;color:var(--md-on-surface-variant);opacity:.85}
.recon-dot{flex:none;width:6px;height:6px;margin-top:6px;border-radius:50%;background:var(--md-outline-variant)}
.recon-item.finding .recon-dot{background:var(--md-warning)}
.recon-task-search{display:flex;align-items:center;gap:6px}
.recon-task-search input{flex:1;min-width:0;border:1px solid var(--md-outline-variant);border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font-size:11.5px;padding:5px 9px;font-family:inherit}
.recon-task-search select{border:1px solid var(--md-outline-variant);border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font-size:11px;padding:5px 4px;font-family:inherit}
.recon-task-count{color:var(--md-on-surface-variant);font-size:10.5px;font-variant-numeric:tabular-nums;white-space:nowrap}
.recon-idchip{font-family:ui-monospace,monospace;font-size:9.5px;color:var(--md-on-surface-variant);background:var(--md-surface-container-high);border-radius:5px;padding:1px 5px}
.recon-task-headtext{min-width:0;flex:1}
.recon-task-titleline{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.recon-task-chips{display:flex;align-items:center;gap:6px;margin-top:2px}
.recon-pillardot{width:5px;height:5px;border-radius:50%;background:currentColor;margin-right:4px}
.recon-sesslist-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px;border-bottom:1px solid var(--md-outline-variant);padding-bottom:6px}
.recon-sesslist-title{font-size:12px;font-weight:700;color:var(--md-on-surface)}
.recon-sesslist-usage{font-size:10px;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}
.recon-sessgroup{margin-top:10px}
.recon-sessgroup h5{margin:0 0 4px;font-size:10.5px;letter-spacing:.04em;color:var(--md-on-surface-variant);font-weight:700}
.recon-sessgroup h5 b{opacity:.7}
.recon-sessitem{display:flex;align-items:center;gap:6px;width:100%;text-align:left;border:0;background:transparent;color:var(--md-on-surface);font-size:11.5px;padding:5px 8px;border-radius:8px;cursor:pointer;font-family:inherit}
.recon-sessitem:hover,.recon-sessitem.open{background:var(--md-surface-container-high)}
.recon-sessmark{flex:none;width:14px;text-align:center;font-size:10.5px;color:var(--md-on-surface-variant)}
.recon-sessmark.done{color:#10b981}
.recon-sessmark.running{color:#6366f1;animation:dock-pulse 1.6s ease-in-out infinite}
.recon-sessmark.blocked{color:#ef4444}
.recon-sessnum{flex:none;font-family:ui-monospace,monospace;font-size:10px;color:var(--md-on-surface-variant)}
.recon-sesstext{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.recon-livebadge{flex:none;font-size:9.5px;font-weight:700;color:#6366f1;background:#6366f126;border-radius:999px;padding:1px 7px}
.recon-tracebox{margin:2px 0 6px;padding:8px 10px;border-left:2px solid var(--md-outline-variant);background:var(--md-surface-container-low);border-radius:0 8px 8px 0}
.recon-tracesteps{margin:0;padding-left:18px;font-size:11px;color:var(--md-on-surface-variant);display:flex;flex-direction:column;gap:4px}
.recon-tracesteps li.fail{color:var(--md-error)}
.recon-trace-action{font-family:ui-monospace,monospace;color:var(--md-on-surface);margin-right:6px}
.recon-trace-detail{display:block;font-size:10.5px}
.recon-usage{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;font-size:11.5px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:10px;padding:6px 10px}
.recon-usage-label{font-weight:700;color:var(--md-on-surface)}
.recon-usage-item b{color:var(--md-on-surface);font-variant-numeric:tabular-nums}
.recon-approval-args{margin:4px 0 6px;padding:8px;border-radius:8px;background:var(--md-surface-container);color:var(--md-on-surface-variant);font-size:10.5px;white-space:pre-wrap;overflow-wrap:anywhere;max-height:140px;overflow:auto}
.recon-report{margin:0;padding:10px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font-size:11px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere;max-height:60%;overflow:auto;font-family:ui-monospace,monospace}
.recon-dot.planner{background:var(--md-primary)}
.recon-dot.running{background:#6366f1;animation:dock-pulse 1.6s ease-in-out infinite}
.recon-dot.system{background:#06b6d4}
.recon-tabs{display:flex;flex-wrap:wrap;gap:3px;border-bottom:1px solid var(--md-outline-variant);padding-bottom:6px}
.recon-pct{font-style:normal;opacity:.85}
/* 任务详情住在左边侧边栏里：和任务列表共用一个滚动容器，不再是浮动窗口 */
.task-detail{display:flex;flex-direction:column;gap:12px}
.task-tab .recon-task-head{position:sticky;top:0;z-index:2;align-items:flex-start;background:var(--md-surface-container-low);padding-bottom:8px}
.task-detail .recon-canvas{max-height:none;height:260px;flex:none}
.task-detail .recon-report{max-height:340px}
.recon-canvas{overflow:hidden;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container);max-height:52%;min-height:120px;cursor:grab;touch-action:none;user-select:none}
.recon-canvas:active{cursor:grabbing}
.recon-canvas svg{display:block}
.recon-legend{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:10.5px;color:var(--md-on-surface-variant)}
.recon-legend-spacer{flex:1}
.recon-legend button{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:12px;padding:2px 6px;border-radius:6px;cursor:pointer;font-family:inherit}
.recon-legend button:hover,.recon-legend button.active{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.recon-edge-label{font-size:9px;fill:var(--md-on-surface-variant);text-anchor:middle;dominant-baseline:middle;pointer-events:none}
.recon-edge-label.proves{fill:#e11d48}
.recon-node{cursor:pointer}
.recon-node text{pointer-events:none}
.recon-badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:999px;font-size:10.5px;font-weight:700;background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.recon-badge.running{background:#3b82f626;color:#3b82f6}
.recon-badge.paused{background:#f59e0b26;color:#b45309}
.recon-badge.done{background:#10b98126;color:#059669}
.recon-badge.cancelled{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.recon-badge.failed{background:var(--md-error-container);color:var(--md-on-error-container)}
.recon-badge.goal{background:#10b98126;color:#059669}
.recon-badge.intent{background:#3b82f626;color:#2563eb}
.recon-badge.fact{background:#f59e0b26;color:#b45309}
.recon-badge.finding{background:#e11d4826;color:#e11d48}
.recon-badge.hint{background:#a855f726;color:#9333ea}
.recon-badge.digest{background:#06b6d426;color:#0891b2}
.recon-taskbar{display:flex;justify-content:flex-end}
.recon-newtask-btn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--md-outline-variant);background:transparent;color:var(--md-on-surface);font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;cursor:pointer;font-family:inherit}
.recon-newtask-btn.active,.recon-newtask-btn:hover{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.recon-taskform{display:flex;flex-direction:column;gap:8px;border:1px dashed var(--md-outline-variant);border-radius:10px;padding:10px}
.recon-taskform label{display:flex;flex-direction:column;gap:4px;font-size:11px;font-weight:600;color:var(--md-on-surface-variant)}
.recon-taskform textarea,.recon-taskform input{border:1px solid var(--md-outline-variant);border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font-size:12px;padding:6px 8px;font-family:inherit;resize:vertical}
.recon-taskform button[type="submit"]{align-self:flex-end;border:0;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px;cursor:pointer;font-family:inherit}
.recon-taskform button[type="submit"]:disabled{opacity:.5;cursor:default}
.recon-task-head{display:flex;align-items:center;gap:8px}
.recon-back{border:1px solid var(--md-outline-variant);background:transparent;color:var(--md-on-surface-variant);font-size:13px;width:24px;height:24px;border-radius:8px;cursor:pointer}
.recon-task-stopped{color:var(--md-on-surface-variant);opacity:.8}
.recon-task-objective{margin:0;font-size:13px;font-weight:600;color:var(--md-on-surface);line-height:1.45;overflow-wrap:anywhere}
.recon-task-controls{display:flex;gap:6px}
.recon-task-controls button{flex:1;border:1px solid var(--md-outline-variant);background:transparent;color:var(--md-on-surface);font-size:12px;font-weight:600;padding:5px 10px;border-radius:8px;cursor:pointer;font-family:inherit}
.recon-task-controls button:hover{background:var(--md-surface-container-high)}
.recon-task-controls button.danger{color:var(--md-error)}
.recon-hintform{display:flex;gap:6px}
.recon-hintform input{flex:1;border:1px solid var(--md-outline-variant);border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font-size:12px;padding:5px 9px;font-family:inherit;min-width:0}
.recon-hintform button{border:0;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;padding:4px 11px;border-radius:8px;cursor:pointer;font-family:inherit}
.recon-hintform button:disabled{opacity:.5;cursor:default}
.recon-taskrow{display:block;border:1px solid var(--md-outline-variant);border-radius:10px;padding:8px 11px;cursor:pointer}
.recon-taskrow:hover{background:var(--md-surface-container-high)}
.recon-taskrow p{margin:5px 0 4px;font-size:12.5px;font-weight:600;color:var(--md-on-surface);line-height:1.4;overflow-wrap:anywhere}
.recon-taskrow-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.recon-taskrow-meta{display:flex;justify-content:space-between;gap:8px;color:var(--md-on-surface-variant);font-size:10.5px;opacity:.85}
.recon-item.activity .recon-dot.finding{background:var(--md-warning)}
.recon-item.activity .recon-dot.digest{background:#06b6d4}
.recon-item.activity .recon-dot.hint{background:#a855f7}
.recon-edge{fill:none;stroke:var(--md-outline-variant);stroke-width:1.3;opacity:.8}
.recon-edge.proves{stroke:#e11d48;stroke-dasharray:4 3;stroke-width:1.6;opacity:1}
.recon-edge.covers{stroke:#06b6d4;stroke-dasharray:2 3;opacity:.6}
.recon-node rect{fill:var(--md-surface-container-lowest);stroke:var(--md-outline-variant);stroke-width:1.2}
.recon-node text{font-size:10px;fill:var(--md-on-surface);font-family:inherit}
.recon-node.goal rect{stroke:#10b981}
.recon-node.goal.met rect{stroke-width:2.2;fill:color-mix(in srgb,#10b981 12%,var(--md-surface-container-lowest))}
.recon-node.intent.open rect{stroke:#3b82f6}
.recon-node.intent.running rect{stroke:#6366f1;stroke-width:2}
.recon-node.intent.paused rect{stroke:#f59e0b;stroke-dasharray:3 2}
.recon-node.intent.done rect{stroke:#64748b}
.recon-node.intent.blocked rect,.recon-node.intent.exhausted rect{stroke:#ef4444}
.recon-node.intent.stopped rect{stroke:#94a3b8}
.recon-node.fact rect{stroke:#f59e0b}
.recon-node.finding rect{stroke:#e11d48;stroke-width:1.8}
.recon-node.hint rect{stroke:#a855f7}
.recon-node.digest rect{stroke:#06b6d4;stroke-dasharray:4 2}
.recon-item.goal .recon-dot{background:#10b981}
.recon-item.goal.met .recon-dot{box-shadow:0 0 0 2px color-mix(in srgb,#10b981 35%,transparent)}
.recon-item.running .recon-dot{background:#6366f1}
.recon-item.blocked .recon-dot,.recon-item.exhausted .recon-dot{background:#ef4444}
.recon-item.paused .recon-dot{background:#f59e0b}
.recon-error{margin:0;font-size:12px;color:var(--md-error)}
.usage-big{display:flex;align-items:baseline;gap:8px;margin-bottom:12px}
.usage-big b{font-size:28px;font-weight:800;color:var(--md-primary);line-height:1;font-variant-numeric:tabular-nums}
.usage-big span{font-size:12px;color:var(--md-on-surface-variant)}
.usage-body .ctx-row{padding:7px 0}

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

#app .workspace .jump-latest{position:sticky;bottom:0;z-index:var(--z-popover,5000);display:flex;align-items:center;gap:6px;width:max-content;margin:8px auto 0;min-height:0;height:30px;padding:0 13px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font-size:12.5px;font-weight:600;line-height:1;cursor:pointer;box-shadow:0 6px 20px #1624401f}
#app .workspace .jump-latest:hover{background:var(--md-surface-container-high)}

.copy-toast{position:sticky;bottom:44px;z-index:var(--z-popover,5000);display:flex;width:max-content;margin:0 auto;padding:6px 13px;border-radius:999px;background:var(--md-inverse-surface,#1f242b);color:var(--md-inverse-on-surface,#f4f6fb);font-size:12px;font-weight:600;box-shadow:0 8px 22px #0b12203d;pointer-events:none}
.toast-enter-active,.toast-leave-active{transition:opacity 120ms var(--ease-out)}
.toast-enter-from,.toast-leave-to{opacity:0}
.context-summary{max-width:920px;margin:0 auto 22px;padding:14px 18px;border:1px dashed var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-low)}
.context-summary-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.context-summary-head strong{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--md-primary)}
.context-summary-head time{font-size:12px;opacity:.75}
.welcome{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}
.welcome::before{content:'';display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center}
.welcome h2{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}
.welcome p{margin:6px 0;font-size:14px}

.turns-skeleton{max-width:920px;margin:0 auto;display:flex;flex-direction:column;gap:22px}
.turns-skeleton .skeleton-row{display:flex}
.turns-skeleton .skeleton-row.right{justify-content:flex-end}

.skeleton-bar{display:block;height:56px;background:linear-gradient(100deg,var(--md-surface-container-high) 40%,var(--md-surface-container-highest) 50%,var(--md-surface-container-high) 60%);background-size:280% 100%;animation:sheen 1.4s linear infinite}
.skeleton-bar.user{width:min(62%,340px);border-radius:16px 16px 4px 16px}
.skeleton-bar.agent{width:min(84%,560px);border-radius:16px 16px 16px 4px}
.skeleton-bar.short{width:min(38%,220px)}
.skeleton-bar.long{width:min(88%,640px);height:88px}

.view-swap-enter-active,.view-swap-leave-active{transition:opacity 200ms var(--ease-emphasized),transform 200ms var(--ease-emphasized)}
.view-swap-enter-from{opacity:0;transform:translateY(8px)}
.view-swap-leave-to{opacity:0;transform:translateY(-8px)}

.error-bar{display:flex;align-items:flex-start;gap:10px}
.error-bar .error-text{flex:1;min-width:0}
.error-bar .error-close{flex:none;width:22px;height:22px;display:inline-grid;place-items:center;border:0;border-radius:50%;background:transparent;color:inherit;padding:0}
.error-bar .error-close:hover:not(:disabled){background:color-mix(in srgb,currentColor 14%,transparent);box-shadow:none}

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

.bubble-files{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.bubble-file{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:5px 9px;border-radius:9px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);color:inherit;font-size:12px;font-weight:600;text-decoration:none;line-height:1.3;transition:background-color 140ms}
.bubble-file:hover{background:color-mix(in srgb,var(--md-on-primary-container) 18%,transparent)}
.bubble-file svg{flex:none;opacity:.75}
.bubble-file-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px}
.bubble-file small{flex:none;font-size:10.5px;font-weight:500;opacity:.7;font-variant-numeric:tabular-nums}

.turn-actions{display:flex;gap:4px;margin:6px 2px 0;opacity:0;transition:opacity 120ms var(--ease-out)}
.turn:hover .turn-actions,.turn:focus-within .turn-actions{opacity:1}
.turn-actions.end{justify-content:flex-end}
@media (hover:none){.turn-actions{opacity:1}}

.turn-artifacts{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:8px 2px 2px}
.turn-artifacts-title{font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant)}
#app .workspace .artifact-chip{display:inline-flex;align-items:center;gap:6px;max-width:min(320px,100%);min-height:0;height:28px;padding:0 10px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:background-color 140ms,border-color 140ms}
#app .workspace .artifact-chip:hover{background:var(--md-secondary-container);border-color:transparent}
.artifact-chip svg{flex:none;opacity:.7}
.artifact-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:600}
.artifact-desc{flex:none;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:var(--md-on-surface-variant)}
#app .workspace .bubble-action{display:inline-flex;align-items:center;gap:5px;min-height:0;height:26px;padding:0 9px;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:11.5px;font-weight:600;cursor:pointer;transition:background-color 140ms,color 140ms}
#app .workspace .bubble-action:hover:not(:disabled){background:var(--md-surface-container-high);color:var(--md-on-surface)}
#app .workspace .bubble-action:disabled{opacity:.45;cursor:not-allowed}
#app .workspace .bubble-action.primary{background:var(--md-primary);color:var(--md-on-primary,#fff)}
#app .workspace .bubble-action.copied{color:var(--md-success,#1a9e63);opacity:1;cursor:default}
#app .workspace .bubble-action.primary:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06)}

.bubble.user.editing{width:82%}
.bubble-edit{width:100%;resize:vertical;min-height:66px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--md-on-primary-container) 26%,transparent);border-radius:10px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:14px;line-height:1.6}
.bubble-edit:focus{outline:2px solid var(--md-primary);outline-offset:1px}
.bubble-edit-actions{display:flex;justify-content:flex-end;gap:6px;margin-top:6px}

.composer.dropping{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
.drop-veil{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:center;gap:9px;border-radius:inherit;background:color-mix(in srgb,var(--md-primary) 10%,var(--md-surface-container-lowest));color:var(--md-primary);font-size:13px;font-weight:700;pointer-events:none}
.bubble.agent :deep(p){margin:.4em 0}
.bubble.agent :deep(pre){max-height:420px}

.agent-speech{margin:6px 0;padding:2px 0;line-height:1.7}
.model-annotation{display:block;font-size:12px;opacity:.7;margin-bottom:4px;font-family:var(--code-font);overflow-wrap:anywhere}
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

.steps{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}

.turn-collapse{margin:10px 0 4px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}
.turn-collapse>summary{display:flex;align-items:center;gap:7px;padding:9px 12px;cursor:pointer;font-size:12.5px;color:var(--md-on-surface-variant);list-style:none}
.turn-collapse>summary::-webkit-details-marker{display:none}
.turn-collapse>summary::before{content:'▸';display:inline-block;transition:transform var(--duration-short) var(--ease-out);color:var(--md-on-surface-variant)}
.turn-collapse[open]>summary::before{transform:rotate(90deg)}
.turn-collapse-icon{font-weight:700}
.turn-collapse-icon.done{color:var(--md-success,#1a9e63)}
.turn-collapse-icon.cancelled{color:var(--md-on-surface-variant)}
.turn-collapse-icon.failed{color:#cf222e}
.turn-collapse-state{font-weight:600;color:var(--md-on-surface)}
.turn-collapse-dot{color:var(--md-on-surface-variant)}
.turn-collapse-count{margin-left:auto;padding:0 8px;border-radius:999px;background:var(--md-surface-container-high);font-size:11px;line-height:18px;font-variant-numeric:tabular-nums}
.turn-collapse>.steps{padding:0 12px 10px}
@media (prefers-reduced-motion: reduce){.turn-collapse>summary::before{transition:none}}
.steps details{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}
.steps summary{cursor:pointer;font-size:13px;font-weight:550}
.steps summary small{margin-left:10px;font-weight:600}
.steps summary::marker{color:var(--md-on-surface-variant)}
.steps details pre{margin:10px 0 0;font-family:var(--code-font);font-size:13px;white-space:pre-wrap;max-height:400px}
pre{max-height:450px;overflow:auto;font-family:var(--code-font)}

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

.sub-view{max-width:900px;margin:0 auto}
.sub-view-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}
.sub-view-header button{flex-shrink:0;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}
.sub-view-header h3{margin:0 0 4px;font-size:16px;font-weight:650}
.sub-view-header p{margin:0;max-width:520px}
.sub-view-header>span{margin-left:auto;font-weight:650;font-size:12px}
.sub-view-body{min-height:120px}

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

.todo-text{min-width:0;overflow-wrap:anywhere}
.todo-mark{flex:none;width:16px;text-align:center;color:var(--md-primary);transition:color .2s,transform .2s}
.todo-panel li.completed .todo-mark{color:var(--md-success,#3ba55c)}
.composer .todo-panel{border-radius:28px 28px 0 0}

.ctx-usage{position:relative;display:inline-flex;align-items:center;gap:6px;flex:none;outline:none;order:99;margin-left:6px;cursor:default}
.ctx-ring{width:20px;height:20px;flex:none}
.ctx-track{fill:none;stroke:var(--md-outline-variant);stroke-width:2.2}

.ctx-arc{fill:none;stroke-width:2.2;stroke-linecap:round;transform:rotate(-90deg);transform-origin:50% 50%;transition:stroke-dasharray var(--duration-long) var(--ease-emphasized),stroke var(--duration-medium) var(--ease-out)}
.ctx-value{font-size:11px;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}
.ctx-tip{position:absolute;bottom:calc(100% + 12px);left:0;right:auto;transform-origin:bottom left;transform:translateY(4px) scale(.97);z-index:var(--z-popover);width:max-content;min-width:216px;max-width:280px;padding:12px 14px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:var(--shadow-3);color:var(--md-on-surface);opacity:0;visibility:hidden;pointer-events:none;transition:opacity 160ms var(--ease-emphasized-decel),transform 160ms var(--ease-emphasized-decel),visibility 160ms;font-size:12px;text-align:left}
.ctx-usage:hover .ctx-tip,.ctx-usage:focus-visible .ctx-tip,.ctx-usage:focus-within .ctx-tip{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
.ctx-tip strong{display:block;font-size:12px;font-weight:750;margin-bottom:8px}
.ctx-used{display:flex;align-items:baseline;gap:6px}
.ctx-used b{font-size:22px;font-weight:800;color:var(--md-primary);line-height:1}
.ctx-used span{color:var(--md-on-surface-variant)}
.ctx-row{display:flex;justify-content:space-between;gap:16px;padding:4px 0;border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}
.ctx-row span:last-child{font-weight:650;color:var(--md-primary)}

.composer{position:relative;flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:visible;box-shadow:var(--shadow-1)}
.composer-input{position:relative}

.composer-input textarea{font-size:14px;width:100%;display:block;min-height:96px;max-height:120px;padding:15px 160px 15px 16px;line-height:1.6;resize:none;border:0;border-radius:0;background:transparent}
.composer-input textarea:focus{box-shadow:none;border:0}
.slash-menu{position:fixed;z-index:var(--z-popover);background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:14px;box-shadow:var(--shadow-3);padding:6px;max-height:min(320px,42vh);overflow:auto}

.slash-menu-enter-active,.slash-menu-leave-active{transition:opacity 130ms,transform 130ms}
.slash-menu-enter-from,.slash-menu-leave-to{opacity:0;transform:translateY(4px)}
.slash-item{display:flex;align-items:baseline;gap:10px;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:10px;background:transparent;color:var(--md-on-surface);cursor:pointer}
.slash-item.active{background:var(--md-secondary-container)}
.slash-name{flex:none;font-family:var(--code-font);font-weight:650;font-size:13px;color:var(--md-primary)}
.slash-desc{font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.attach-chips{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 16px 0}
.composer-actions{position:absolute;right:10px;bottom:10px;z-index:2;display:flex;align-items:center;gap:8px}
.attach-fly{position:relative;width:42px;height:42px;flex:none;aspect-ratio:1/1;display:inline-flex;align-items:center;justify-content:center;line-height:0;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.attach-fly svg{width:18px;height:18px;display:block}
.attach-fly:hover:not(:disabled){filter:brightness(1.05)}
.attach-fly:disabled{opacity:.5;cursor:default}
.attach-chip{display:inline-flex;align-items:center;gap:6px;max-width:220px;font-size:12px;padding:4px 6px 4px 10px;border-radius:999px;background:var(--md-surface-container);border:1px solid var(--md-outline-variant);overflow:hidden}

.attach-chip-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.attach-chip button{border:0;background:transparent;cursor:pointer;font-size:14px;line-height:1;padding:0 4px;color:var(--md-on-surface-variant)}
.attach-chip button:hover{color:var(--md-error)}
.attach-error{font-size:12px;color:var(--md-error)}
.send-fly{position:relative;width:42px;height:42px;flex:none;aspect-ratio:1/1;display:inline-flex;align-items:center;justify-content:center;line-height:0;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}
.send-fly svg{width:20px;height:20px;display:block}
.send-fly:hover:not(:disabled){filter:brightness(1.08)}
.send-fly:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}
.send-fly.stop{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}
.compact-notice{display:flex;align-items:center;gap:8px;font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}
.compact-notice.running{animation:soft-pulse 1.4s var(--ease-emphasized) infinite}
@media (prefers-reduced-motion: reduce){.compact-notice.running{animation:none}.compact-notice .tree-spin{animation-duration:1.6s}}

.options-collapse{max-height:0;overflow:hidden;opacity:0;transition:max-height var(--duration-medium) var(--ease-emphasized),opacity 140ms var(--ease-out)}
.options-collapse.open{max-height:220px;opacity:1}
.options-toggle{display:inline-flex;align-items:center;gap:6px;transition:background-color .18s,color .18s}
.options-toggle.open{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.execution-options{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}
.execution-options label{display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}
.execution-options :deep(.app-select-trigger),.execution-options .workspace-select{width:100%;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}
.workspace-select{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}
.composer footer{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}
.composer-footer .mode-field :deep(.app-select-trigger){min-height:30px;font-size:12.5px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent}

.usage-rings{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}
.usage-metric{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}
.usage-ring{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}
.usage-ring b{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}

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

#app .workspace .rename-dialog{width:min(420px,100%);background:var(--md-surface-container)}
#app .workspace .rename-dialog>h2{margin:0;font-size:16px;font-weight:650}
#app .workspace .rename-dialog>footer{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}
#app .workspace .rename-dialog>footer button{min-height:36px;padding:0 16px;border-radius:999px;font-weight:600}
#app .workspace .rename-dialog>footer button:first-child{background:var(--md-surface-container-high);color:var(--md-on-surface);border-color:transparent}
#app .workspace .rename-dialog>footer button:last-child{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}
.permission-request{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}
.permission-request small{display:block;margin:8px 0}
.permission-request pre{max-height:160px;overflow:auto}
.permission-request>div{display:flex;justify-content:flex-end;gap:8px}

#app .workspace{gap:12px;padding-left:6px;background:var(--md-surface-container)}

#app .workspace :is(.row-actions, .ws-actions, .browser-toolbar, .term-input) button,
#app .workspace :is(.ws-toggle, .icon-btn, .chip-btn, .session-actions button, .order-toggle button) { min-height: 0; }
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
/* 左边侧边栏的两个模式（会话 / 任务）：跟 filter-bar 同一套分段控件写法 */
#app .workspace .sidebar-mode{display:flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}
#app .workspace .sidebar-mode button{min-height:0;flex:1;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}
#app .workspace .sidebar-mode button:hover:not(:disabled){background:color-mix(in srgb,var(--md-on-surface) 6%,transparent);box-shadow:none}
#app .workspace .sidebar-mode button.chosen{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}
.sidebar-badge{display:inline-grid;place-items:center;min-width:16px;height:16px;margin-left:6px;padding:0 4px;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font-size:9.5px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}
/* 任务详情在 284px 的栏里：#app button 的 36px 底线会把 8 个页签撑成三行高楼 */
#app .workspace .task-tab .recon-back{min-height:0;width:26px;height:26px;border-radius:8px;flex:none;font-size:12px}
#app .workspace .task-tab .recon-tabs{gap:4px}
#app .workspace .task-tab .recon-tabs button{min-height:0;padding:4px 9px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font-size:11px;font-weight:600}
#app .workspace .task-tab .recon-tabs button:hover:not(:disabled){background:var(--md-surface-container-high);box-shadow:none}
#app .workspace .task-tab .recon-tabs button.active{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .workspace .task-tab .recon-task-controls button{min-height:0;padding:5px 8px;border-radius:8px;font-size:11.5px}
#app .workspace .task-tab .recon-hintform button{min-height:0;padding:5px 10px}
#app .workspace .task-tab .recon-newtask-btn{min-height:0;padding:5px 10px;font-size:11.5px}
#app .workspace .task-tab .recon-taskform button[type="submit"]{min-height:0;padding:6px 12px}
#app .workspace .task-tab .recon-sessitem{min-height:0}
#app .workspace .task-tab .recon-legend button{min-height:0;padding:2px 6px}
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

#app .workspace .usage-ring b{background:var(--md-surface-container-lowest)}
#app .workspace .directory-dialog{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}
#app .workspace .directory-list button{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}
#app .workspace .directory-list button:hover:not(:disabled){background:var(--md-secondary-container)}
#app .workspace .directory-roots button{background:var(--md-surface-container-high);border-color:transparent}

@keyframes caret-blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes soft-pulse{0%,100%{opacity:1}50%{opacity:.5}}

.turn{opacity:1;transform:none;transition:opacity 220ms var(--ease-emphasized-decel),transform 220ms var(--ease-emphasized-decel)}
@starting-style{.turn{opacity:0;transform:translateY(10px)}}
#app .workspace .agent-speech .running{animation:caret-blink 1s steps(1,end) infinite;color:var(--md-primary)}

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
  .skeleton-bar{animation:none}
  .view-swap-enter-active,.view-swap-leave-active,.slash-menu-enter-active,.slash-menu-leave-active{transition-duration:1ms}
  .ctx-arc{transition:none}
}

@media (max-height:760px){
  #app .workspace .composer{margin:0 16px 10px;border-radius:16px}
  #app .workspace .composer-input textarea{min-height:52px;max-height:72px;padding:10px 150px 10px 14px;font-size:13.5px}
  #app .workspace .composer footer{padding:7px 12px;gap:6px}
  #app .workspace .composer-footer{gap:8px}
  #app .workspace .footer-actions{gap:5px}
  #app .workspace .mode-switch .mode-btn{height:24px;padding:0 8px;font-size:12px}
  #app .workspace .ct{width:28px;height:28px}
  #app .workspace .composer-footer .mtp-trigger{height:28px}
  #app .workspace .transcript{padding:16px 20px}
}
@media (max-height:620px){
  #app .workspace .composer-input textarea{min-height:44px;max-height:60px}
  #app .workspace .connection-hint{display:none}
}
@media (max-width:1360px){
  #app .workspace .composer-footer{gap:8px}
  #app .workspace .footer-actions{gap:6px}
  #app .workspace .mode-switch .mode-btn{padding:0 9px}
}

@media(max-width:800px){#app .workspace .sessions{width:214px;padding:12px 10px}#app .workspace .transcript{padding:14px}#app .workspace .composer{margin:0 12px 12px}#app .workspace .connection-hint{display:none}#app .workspace .conversation-header{padding:14px 16px}#app .workspace .welcome{margin:30px auto 0}#app .workspace .turn{margin-bottom:22px}}
@media(max-width:560px){#app .workspace{flex-direction:column}#app .workspace .sessions{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}#app .workspace .sessions>input,#app .workspace .filter-bar,#app .workspace .connection{display:none}#app .workspace .session-list{display:flex;gap:6px;overflow-x:auto}#app .workspace .session-card{min-width:160px;width:160px;margin-bottom:0}#app .workspace .ledger-button{padding:5px;font-size:12px}}

.sidebar-toggles{display:flex;align-items:center;justify-content:space-between;gap:8px}
.order-toggle{display:inline-flex;padding:2px;border-radius:999px;background:var(--md-surface-container-high)}
.order-toggle button{border:0;background:transparent;border-radius:999px;padding:4px 9px;font-size:11.5px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}
.order-toggle button.chosen{background:var(--md-primary);color:var(--md-on-primary,#fff)}
.session-row{position:relative}
.session-row .row-actions{position:absolute;top:6px;right:6px;display:none;align-items:center;gap:8px}
.session-row:hover .row-actions,
.session-row:focus-within .row-actions{display:inline-flex}

@media (hover: none){
  .session-row .row-actions{display:none}
  .session-row.selected .row-actions{display:inline-flex}
  .session-row.selected .session-card .origin{padding-right:106px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
}
.row-actions button{position:relative;width:24px;height:24px;padding:0;border:0;border-radius:7px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:13px;line-height:1;display:inline-flex;align-items:center;justify-content:center}
.row-actions button::before{content:'';position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%)}
.row-actions button:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}
.row-actions select{max-width:78px;height:24px;border:0;border-radius:7px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12px}
.session-row.selected .session-card{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}

.ws-group{margin:0 0 10px;border:1px solid var(--md-outline-variant);border-radius:12px;overflow:hidden;background:var(--md-surface-container-lowest);display:grid;grid-template-rows:auto 1fr;transition:grid-template-rows var(--duration-medium) var(--ease-emphasized)}

.ws-group.drag-source{opacity:.45}
.ws-group.drag-over{outline:2px dashed var(--md-primary);outline-offset:-2px}
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
<style>

.hint{position:absolute;bottom:calc(100% + 9px);left:0;z-index:var(--z-popover,5000);display:flex;flex-direction:column;gap:3px;min-width:190px;max-width:270px;padding:9px 11px;border-radius:11px;background:var(--md-inverse-surface,#1f242b);color:var(--md-inverse-on-surface,#f4f6fb);text-align:left;font-size:11.5px;font-weight:500;line-height:1.45;letter-spacing:0;text-transform:none;white-space:normal;opacity:0;visibility:hidden;pointer-events:none;box-shadow:0 10px 26px #0b12204d;transition:opacity 70ms var(--ease-out)}
.hint b{font-size:12px;font-weight:700}
.hint i{font-style:normal;opacity:.78}
.hint.right{left:auto;right:0}

.hint.left{left:auto;right:calc(100% + 10px);top:50%;bottom:auto;transform:translateY(-50%)}
.mode-btn:hover .hint,.mode-btn:focus-visible .hint,.ct:hover .hint,.ct:focus-visible .hint,.dock-btn:hover .hint,.dock-btn:focus-visible .hint,#app .workspace .mtp-trigger:hover .hint,#app .workspace .mtp-trigger:focus-visible .hint{opacity:1;visibility:visible}
@media (prefers-reduced-motion: reduce){.hint{transition:none}}

html[data-theme="dark"] #app .tree-icon.dir{color:#e5bd6a}
html[data-theme="dark"] #app .tree-icon.code{color:#9aa8ff}
html[data-theme="dark"] #app .tree-icon.data{color:#4dd4c4}
html[data-theme="dark"] #app .tree-icon.doc{color:#e0a84e}
html[data-theme="dark"] #app .tree-icon.image{color:#c39bff}
html[data-theme="dark"] #app .tree-icon.archive{color:#9aa4b5}
</style>
