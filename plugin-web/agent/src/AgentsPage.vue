<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAgentsStore, type TaskRow } from './store'
import MarkdownContent from './MarkdownContent.vue'
import ToolStepCard from './ToolStepCard.vue'
import AppSelect from './AppSelect.vue'
import ThinkingSlider from './ThinkingSlider.vue'
import { locale, syncLocale } from './locale'
import { useConfirm } from './confirm'
import ConfirmDialog from './ConfirmDialog.vue'
const tr=(zh:string,en:string)=>locale.value==='en'?en:zh
const { confirm } = useConfirm()

const store = useAgentsStore()
const selectedId = ref(localStorage.getItem('0kay.agent.selected') || '')
const draft = ref('')
const search = ref('')
const source = ref('all')
const mode = ref('general')
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
const models = ref<Array<{ id: string; provider: string }>>([])
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
function closeBrowser() { browseRequest++;browserOpen.value=false;browserBusy.value=false }
function onEscape(event: KeyboardEvent) {if(event.key==='Escape' && browserOpen.value) closeBrowser()}
function onComposerKey(event: KeyboardEvent) {
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
function selectDirectory() {
  if (!executor.value || executor.value.plugin_id!==browserExecutor || browserBusy.value || browserError.value) return
  executorId.value=executor.value.plugin_id
  workdir.value=directory.value.path;browserOpen.value=false
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
    const response=await fetch('/api/agent/compact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:target})})
    if(!response.ok) throw new Error(await response.text())
    await response.json();await store.fetchAgents()
    compactNotice.value='上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。';if(draft.value.trim()==='/compact') draft.value=''
  } catch(e:any) {error.value=e.message;compactNotice.value=''}
  finally {busy.value=false}
}
const ringStyle=(value:number)=>({background:`conic-gradient(var(--md-primary) ${Math.max(0,Math.min(100,value))}%, var(--md-outline-variant) 0)`})
const executor = computed(() => executorId.value ? store.agents.find(agent => agent.plugin_id === executorId.value) : store.agents.find(agent => store.isHealthy(agent)))
const gib = (bytes?: number) => bytes === undefined ? '—' : `${(bytes / 1024 ** 3).toFixed(1)} GiB`
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
function modelLabel(model: { id: string; provider: string }) {
  return `${providerNames.value[model.provider] || model.provider}/${model.id}`
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
      for (const provider of providers) if (provider.name) names[provider.provider] = provider.name
      providerNames.value = names
    }
  } catch { /* provider names are optional */ }
}
function options() { const level=intensity.value===0?'off':intensity.value<35?'low':intensity.value<62.5?'medium':intensity.value<87.5?'high':'max';return { executor_id: executorId.value, workdir: workdir.value.trim(), thinking_intensity: level, model_id: modelId.value, permission_mode:permissionMode.value, language:locale.value } }
const busy = ref(false)
const error = ref('')
const showLedger = ref(false)
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
const turns = computed(() => store.tasks.filter(item => item.kind === 'agent' && item.session_id === selectedId.value)
  .sort((a,b) => (a.started_at || '').localeCompare(b.started_at || '') || a.task_id.localeCompare(b.task_id)))
const active = computed(() => store.tasks.find(item => item.session_id===selectedId.value && ['agent','compact'].includes(item.kind || '') && ['running','pending'].includes(item.state)))
const stateName = (value: string) => (locale.value==='en'?{pending:'Queued',running:'Running',done:'Completed',failed:'Failed',cancelled:'Stopped'}:{ pending:'等待执行', running:'执行中', done:'完成', failed:'失败', cancelled:'已停止' })[value] || value
const time = (value?: string) => value ? new Date(value).toLocaleString() : ''
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
function choose(id: string) { if(busy.value)return;rememberEditor();selectedId.value = id; showLedger.value = false; localStorage.setItem('0kay.agent.selected', id) }
async function create() {
  busy.value = true; error.value = ''
  try { const id=await store.createSession('新对话');rememberEditor();selectedId.value=id;localStorage.setItem('0kay.agent.selected',id);showLedger.value=false;showArchived.value=false } catch (e: any) { error.value = e.message }
  finally { busy.value = false }
}
async function send() {
  if(draft.value.trim()==='/compact') {await compact();return}
  if (!draft.value.trim() || busy.value || active.value || session.value?.state === 'archived') return
  busy.value = true; error.value = ''
  try {
    const requestOptions = options()
    const message=draft.value.trim(),agentMode=mode.value
    if (!session.value) {
      const id=await store.createSession(message.slice(0,60))
      localStorage.setItem(`0kay.agent.editor:${id}`,JSON.stringify({...requestOptions,draft:message,mode:agentMode}))
      selectedId.value=id;localStorage.setItem('0kay.agent.selected',id)
    }
    rememberEditor()
    await store.sendTask(selectedId.value, message, agentMode, requestOptions)
    draft.value = ''
    rememberEditor();followLatest.value=true;await scrollBottom()
  } catch (e: any) { error.value = e.message }
  finally { busy.value = false }
}
async function stop() {
  if (!active.value || active.value.kind!=='agent') return
  try { await store.cancelTask(active.value.task_id) } catch (e: any) { error.value = e.message }
}
async function scrollBottom() { await nextTick(); if(followLatest.value) transcript.value?.scrollTo({top:transcript.value.scrollHeight,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}) }
watch(() => store.tasks.filter(item=>item.session_id===selectedId.value).map(item => `${item.task_id}:${item.state}:${item.result?.length}`).join('|'), scrollBottom)
watch(selectedId, () => { followLatest.value=true;void scrollBottom();closeBrowser();clearSubs();error.value='' })
watch(selectedId, loadOptions)
watch(executorId,()=>{hostUsage.value=null;workdir.value='';closeBrowser();fetchHost()},{flush:'sync'})
watch(hostOpen,fetchHost)
watch(selectedId,()=>{compactNotice.value=''})
onMounted(() => { syncLocale(); store.connect(); loadOptions(); fetchModels();hostTimer=setInterval(fetchHost,5000);window.addEventListener('keydown',onEscape) })
onUnmounted(() => {rememberEditor();closeBrowser();store.disconnect();if(hostTimer) clearInterval(hostTimer);window.removeEventListener('keydown',onEscape)})
</script>

<template>
  <main class="workspace">
    <aside class="sessions">
      <header><h1>Agent</h1><button @click="create" :disabled="busy" :title="tr('新建会话','New session')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> {{ tr('新对话','New chat') }}</button></header>
      <div class="connection"><i :class="{online:store.onlineCount>0}" />{{ store.onlineCount }} {{ tr('个执行器在线','executors online') }} <button @click="store.fetchAgents()" :title="tr('刷新','Refresh')" aria-label="refresh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
      <input v-model="search" :placeholder="tr('搜索会话…','Search sessions…')" :aria-label="tr('搜索会话','Search sessions')" />
      <nav class="filter-bar"><button v-for="filter in [{id:'all',label:tr('全部','All')},{id:'life',label:tr('LIFE 发起','From LIFE')},{id:'user',label:tr('我的对话','My chats')}]" :key="filter.id" :class="{chosen:source===filter.id}" @click="source=filter.id">{{ filter.label }}</button></nav>
      <label class="muted"><input v-model="showArchived" type="checkbox" /> {{ tr('显示已归档会话','Show archived sessions') }}</label>
      <div class="session-list">
        <button v-for="item in sessions" :key="item.task_id" class="session-card" :disabled="busy" :class="{selected:selectedId===item.session_id && !showLedger}" @click="choose(item.session_id!)">
          <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : tr('你 ↔ Agent','You ↔ Agent') }}</span>
          <strong>{{ item.prompt || '未命名会话' }}</strong><small>{{ time(item.started_at) }}</small>
        </button>
        <p v-if="!sessions.length" class="muted">{{ tr('暂无会话。直接发送消息，或等待 LIFE 委派工作。','No sessions yet. Send a message or wait for LIFE to delegate work.') }}</p>
      </div>
      <button class="ledger-button" :class="{chosen:showLedger}" @click="showLedger=true">{{ tr('全部任务记录','All task records') }} · {{ store.tasks.length }}</button>
    </aside>

    <section v-if="showLedger" class="ledger">
      <header><h2>{{ tr('全部任务记录','All task records') }}</h2><button @click="showLedger=false">{{ tr('返回会话','Back to chat') }}</button></header>
      <p class="muted">{{ tr('包括 LIFE 对话、模型调用、Agent 执行及工具活动。','LIFE conversations, model calls, Agent execution and tool activity.') }}</p>
      <article v-for="task in store.tasks" :key="task.task_id" class="ledger-entry">
        <div><span>{{ task.kind || 'agent' }}</span><span :class="task.state">{{ stateName(task.state) }}</span><small>{{ time(task.started_at) }}</small></div>
        <p>{{ task.prompt }}</p>
        <button v-if="store.sessions.some(s=>s.session_id===task.session_id)" @click="choose(task.session_id!)">打开所属会话</button>
        <details><summary>详情</summary><code>{{ task.task_id }}</code><pre>{{ task.result || task.error || '等待结果' }}</pre></details>
      </article>
    </section>

    <section v-else class="conversation">
      <header class="conversation-header"><div><h2>{{ session?.prompt || '与 Agent 对话' }}</h2><p>{{ session && isLife(session) ? 'LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话' : '持续对话 · 编程、调研与工具执行' }}</p></div><span v-if="active" class="running">正在执行</span><div v-if="session" class="session-actions"><button :disabled="!!active" @click="manage(session.state === 'archived' ? 'restore' : 'archive')">{{ session.state === 'archived' ? '恢复' : '归档' }}</button><button :disabled="!!active" @click="manage('delete')">删除</button></div></header>
      <div v-if="error || store.error" class="error" role="alert">{{ error || store.error }}</div>
      <section v-if="hostOpen" class="host-panel">
        <template v-if="executor"><strong>{{ executor.host?.hostname || executor.name }}</strong><span :class="store.isHealthy(executor) ? 'done' : 'failed'">{{ store.isHealthy(executor) ? '在线' : '离线' }}</span>
        <div class="usage-rings"><div v-for="metric in [{label:'CPU 占用',value:hostUsage?.cpu_percent},{label:'内存占用',value:hostUsage?.memory_percent}]" :key="metric.label" class="usage-metric"><div class="usage-ring" :style="ringStyle(metric.value || 0)"><b>{{ metric.value === undefined ? '—' : `${metric.value.toFixed(1)}%` }}</b></div><span>{{ metric.label }}</span></div><small>{{ hostUsage ? `采样时间：${time(hostUsage.sampled_at)}` : '等待宿主机实时采样' }}</small></div>
        <dl><div><dt>执行器地址</dt><dd>{{ executor.address }}</dd></div><div><dt>系统 / 架构</dt><dd>{{ executor.host?.os || '—' }} / {{ executor.host?.arch || '—' }}</dd></div><div><dt>CPU</dt><dd>{{ executor.host?.cpu_model || '—' }} · {{ executor.host?.cpu_cores || '—' }} 核</dd></div><div><dt>可用 / 总内存</dt><dd>{{ gib(executor.host?.memory_available_bytes) }} / {{ gib(executor.host?.memory_total_bytes) }}</dd></div><div><dt>活跃任务</dt><dd>{{ executor.active_tasks }}</dd></div><div><dt>距上次心跳</dt><dd>{{ executor.last_heartbeat_age_seconds }} 秒</dd></div><div><dt>默认工作目录</dt><dd>{{ executor.host?.workdir || '—' }}</dd></div></dl></template>
        <p v-else class="muted">没有可用的执行器宿主机信息。</p>
      </section>
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
              <div v-if="step.kind === 'think' && (step.result || step.state === 'running' || step.error)" class="agent-speech"><small v-if="step.prompt" class="muted model-annotation">{{ step.prompt }}</small><template v-if="step.result"><MarkdownContent :content="step.result" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else-if="step.state === 'running'" class="muted">{{ tr('子 Agent 正在生成回复…', 'Subagent is drafting a reply…') }}</small><p v-if="step.error" class="error">{{ friendlyError(step.error) }}</p></div>
              <div v-else-if="step.kind === 'subagent'" class="subagent-card nested">
                <button type="button" class="subagent-card-head" @click="openSub(step)"><span :class="step.state">●</span><strong>{{ tr('子 Agent', 'Subagent') }}</strong><span class="subagent-prompt">{{ step.prompt }}</span><small>{{ stateName(step.state) }}</small><span class="subagent-chevron" aria-hidden="true">▸</span></button>
              </div>
              <ToolStepCard v-else-if="step.kind === 'tool'" :step="step" :format-error="friendlyError" />
              <details v-else-if="step.kind !== 'think'"><summary><span :class="step.state">●</span> {{ stepLabel(step) }} · {{ step.prompt }} <small>{{ stateName(step.state) }}</small></summary><pre>{{ step.result || step.error || (step.state === 'running' ? '执行中…' : '执行完成，无输出') }}</pre></details>
            </template>
            <div v-if="subFinal(activeSub)" class="agent-speech"><MarkdownContent :content="subFinal(activeSub)" /></div>
            <p v-if="activeSub.error" class="error">{{ friendlyError(activeSub.error) }}</p>
            <p v-if="!childSteps(activeSub).length && !subFinal(activeSub) && !activeSub.error" class="muted">{{ activeSub.state === 'running' ? tr('子 Agent 正在执行…', 'Subagent is running…') : tr('没有子步骤记录', 'No child steps recorded') }}</p>
          </div>
        </div>
        <template v-else>
        <div v-if="!turns.length" class="welcome"><h2>想让 Agent 帮你做什么？</h2><p>直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。</p><p>左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。</p></div>
        <article v-for="turn in turns" :key="turn.task_id" class="turn">
          <div class="bubble user"><div class="message-head"><b>{{ isLife(turn) ? 'LIFE' : '你' }}</b><time>{{ time(turn.started_at) }}</time></div><div class="message-text">{{ turn.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, '') }}</div></div>
          <div class="bubble agent"><div class="message-head"><b>Agent</b><span :class="turn.state">{{ stateName(turn.state) }}</span></div>
            <div v-if="steps(turn).length" class="steps"><template v-for="step in steps(turn)" :key="step.task_id">
              <div v-if="step.kind === 'think' && (step.result || step.state === 'running' || step.error)" class="agent-speech"><small v-if="step.prompt" class="muted model-annotation">{{ step.prompt }}</small><template v-if="step.result"><MarkdownContent :content="step.result" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else-if="step.state === 'running'" class="muted">Agent 正在生成回复…</small><p v-if="step.error" class="error">{{ friendlyError(step.error) }}</p></div>
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
              <ToolStepCard v-else-if="step.kind === 'tool'" :step="step" :format-error="friendlyError" />
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
        <div v-if="compactNotice" class="compact-notice">{{ compactNotice }}</div>
        <div class="execution-options">
          <label>{{ tr('权限','Permissions') }}<AppSelect v-model="permissionMode" :aria-label="tr('权限','Permissions')" :disabled="!!active || busy" :options="[{value:'normal',label:tr('Normal · 全部审批','Normal · Ask every time')},{value:'full_access',label:tr('Full access · 自动执行','Full access · Auto execute')}]" /></label>
          <label>{{ tr('执行器','Executor') }}<AppSelect v-model="executorId" :aria-label="tr('执行器','Executor')" :disabled="!!active || busy" :options="[{value:'',label:tr('自动选择在线执行器','Automatic executor')},...store.agents.map(agent=>({value:agent.plugin_id,label:`${agent.host?.hostname || agent.name} · ${agent.plugin_id}`,disabled:!store.isHealthy(agent)}))]" /></label>
          <label>{{ tr('工作区','Workspace') }}<button type="button" class="workspace-select" :disabled="!!active || busy || !executor" :title="workdir || executor?.host?.workdir" @click="browse(workdir || executor?.host?.workdir || '')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg> {{ workdir || tr('选择目录…','Select folder…') }}</button></label>
          <ThinkingSlider v-model="intensity" :disabled="!!active || busy" />
          <label>{{ tr('模型','Model') }}<AppSelect v-model="modelId" searchable :aria-label="tr('模型','Model')" :disabled="!!active || busy" @open="fetchModels" :options="[{value:'MOCR',label:tr('MOCR · 自动选型','MOCR · Automatic')},...models.map(model=>({value:model.id,label:modelLabel(model)}))]" /></label>
        </div>
        <div class="composer-input">
          <textarea v-model="draft" :disabled="busy || session?.state === 'archived'" :placeholder="session?.state === 'archived' ? '恢复会话后可以继续对话' : '给 Agent 发消息…（Enter 发送，Shift+Enter 换行）'" aria-label="给 Agent 发消息" @keydown="onComposerKey" />
          <button v-if="active?.kind !== 'agent'" type="submit" class="send-fly" :disabled="busy || !!active || !draft.trim() || session?.state === 'archived'" :aria-label="tr('发送','Send')" :title="tr('发送','Send')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.6 11.2 20.4 4l-7.1 16.4-2.5-6.8-7.2-2.4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m10.8 13.6 3.4-3.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
          </button>
          <button v-else type="button" class="send-fly stop" @click="stop" :aria-label="tr('停止','Stop')" :title="tr('停止','Stop')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>
          </button>
        </div>
        <footer><AppSelect v-model="mode" :disabled="busy" :aria-label="tr('Agent 模式','Agent mode')" :options="[{value:'general',label:tr('通用 Agent','General Agent')},{value:'code',label:tr('编程 Agent','Coding Agent')},{value:'research',label:tr('调研 Agent','Research Agent')}]" /><button type="button" @click="hostOpen=!hostOpen">{{ tr('宿主机','Host') }}</button><button type="button" :disabled="!session || !!active || busy || session.state === 'archived'" @click="compact">/compact</button><span class="muted">{{ active?.kind === 'compact' ? tr('上下文压缩中…','Compacting…') : store.onlineCount ? tr('在当前会话中继续','Continue this session') : tr('执行器离线','Executor offline') }}</span></footer>
      </form>
    </section>
    <div v-if="browserOpen" class="directory-backdrop" @click.self="closeBrowser"><section class="directory-dialog" role="dialog" aria-modal="true" aria-label="选择工作区目录"><header><h2>选择 {{ executor?.host?.hostname || '执行器' }} 的工作区</h2><button @click="closeBrowser">关闭</button></header><div class="directory-roots"><button v-for="root in directory.roots" :key="root" :disabled="browserBusy" @click="browse(root)">{{ root }}</button><button :disabled="browserBusy" @click="browse(executor?.host?.workdir || '')">默认目录</button></div><code>{{ directory.path }}</code><form class="new-folder" @submit.prevent="createFolder"><input v-model="folderName" placeholder="新文件夹名称" aria-label="新文件夹名称" :disabled="browserBusy"/><button :disabled="browserBusy || !folderName.trim() || !directory.path">新建文件夹</button></form><p v-if="browserError" class="error">{{ browserError }}</p><p v-if="browserBusy">正在读取目录…</p><div v-else class="directory-list"><button v-if="directory.parent!==directory.path" @click="browse(directory.parent)">上一级</button><button v-for="folder in directory.directories" :key="folder.path" @click="browse(folder.path)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg> {{ folder.name }}</button><p v-if="!directory.directories.length" class="muted">没有子目录</p></div><footer><button :disabled="browserBusy || !!browserError || !directory.path" @click="selectDirectory">选择当前目录</button></footer></section></div>
  </main>
  <ConfirmDialog />
</template>

<style scoped>
.workspace{display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}

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
.session-card strong{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:13.5px}
.origin,small,.sessions .muted{font-size:11px;color:var(--md-on-surface-variant)}
.origin{font-weight:600;letter-spacing:.02em}
.ledger-button{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:12.5px;font-weight:550}
.ledger-button.chosen{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}

/* ---- ledger ---- */
.ledger{flex:1;overflow-y:auto;padding:var(--space-xl)}
.ledger>header{margin-bottom:8px}
.ledger>header h2{font-size:18px;font-weight:650}
.ledger-entry{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}
.ledger-entry>div{display:flex;align-items:center;gap:10px;font-size:12px}
.ledger-entry>div>span:first-child{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}
.ledger-entry>div small{margin-left:auto}
.ledger-entry>p{margin:8px 0;font-size:13.5px;line-height:1.6;overflow-wrap:anywhere}
.ledger-entry details{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}
.ledger-entry summary{cursor:pointer;color:var(--md-on-surface-variant)}
.ledger-entry pre{margin:8px 0 0;max-height:300px}

/* ---- conversation ---- */
.conversation{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}
.conversation-header{display:flex;align-items:flex-start;gap:14px}
.conversation-header>div:first-child{flex:1;min-width:0}
.conversation-header h2{font-size:17px;font-weight:650;margin:0}
.conversation-header p{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:12.5px}
.session-actions{display:flex;gap:8px;flex-shrink:0}
.session-actions button{height:32px;padding:0 13px;border-radius:9px;font-size:12.5px;font-weight:550;background:var(--md-surface-container-lowest)}
.running{color:#B88412;font-weight:650;font-size:12px}
.failed{color:var(--md-error)}
.done{color:var(--md-success);font-weight:600;font-size:12px}
.cancelled,.muted{color:var(--md-on-surface-variant)}
.muted{font-size:12px;line-height:1.6}
.error{background:var(--md-error-container);color:#410E0B;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}

.transcript{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}
.welcome{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}
.welcome::before{content:'';display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center}
.welcome h2{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}
.welcome p{margin:6px 0;font-size:13.5px}

/* ---- message bubbles ---- */
.turn{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}
.bubble{padding:15px 19px;font-size:14px}
.bubble.user{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px 16px}
.bubble.agent{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}
.bubble .message-head{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}
.bubble .message-head b{font-weight:700}
.bubble .message-head time{margin-left:auto;opacity:.75;font-size:11px}
.bubble .message-head span{margin-left:auto}
.bubble.user .message-head{margin-bottom:7px;opacity:.85}
.message-text{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}
.bubble.agent :deep(p){margin:.4em 0}
.bubble.agent :deep(pre){max-height:420px}

/* agent speech / markdown inside response */
.agent-speech{margin:6px 0;padding:2px 0;line-height:1.7}
.model-annotation{display:block;font-size:11px;opacity:.7;margin-bottom:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.agent-speech :deep(p){margin:.45em 0}
.agent-speech :deep(pre){background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:12.5px}
.agent-speech :deep(code){font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.agent-speech :deep(ul,.agent-speech :deep(ol)){padding-left:20px;margin:.4em 0}

/* ---- steps ---- */
.steps{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}
.steps details{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}
.steps summary{cursor:pointer;font-size:12.5px;font-weight:550}
.steps summary small{margin-left:10px;font-weight:600}
.steps summary::marker{color:var(--md-on-surface-variant)}
.steps details pre{margin:10px 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;white-space:pre-wrap;max-height:400px}
pre{max-height:450px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}

/* ---- subagent card ---- */
.subagent-card{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}
button.subagent-card-head{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:12.5px}
button.subagent-card-head:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}
button.subagent-card-head>span:first-child{color:var(--md-primary)}
button.subagent-card-head>strong{font-weight:700}
.subagent-prompt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}
.subagent-card small{font-weight:600}
.subagent-chevron{color:var(--md-on-surface-variant);font-size:11px}
.subagent-card-error{margin:0 10px 10px;padding:8px 12px;font-size:12px}
.subagent-card.nested{margin:6px 0;box-shadow:none}

/* ---- sub view ---- */
.sub-view{max-width:900px;margin:0 auto}
.sub-view-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}
.sub-view-header button{flex-shrink:0;border-radius:9px;font-size:12.5px;font-weight:550;background:var(--md-surface-container-lowest)}
.sub-view-header h3{margin:0 0 4px;font-size:16px;font-weight:650}
.sub-view-header p{margin:0;max-width:520px}
.sub-view-header>span{margin-left:auto;font-weight:650;font-size:12px}
.sub-view-body{min-height:120px}

/* ---- composer ---- */
.composer{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}
.composer-input{position:relative}
.composer-input textarea{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 58px 15px 18px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}
.composer-input textarea:focus{box-shadow:none;border:0}
.send-fly{position:absolute;right:12px;bottom:12px;width:38px;height:38px;display:grid;place-items:center;border:0;border-radius:50%;padding:0;background:var(--md-primary);color:var(--md-on-primary,#fff)}
.send-fly:hover:not(:disabled){filter:brightness(1.08)}
.send-fly:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7}
.send-fly.stop{background:var(--md-error);color:#fff}
.compact-notice{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}
.execution-options{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}
.execution-options label{display:flex;flex-direction:column;gap:5px;font-size:11px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}
.execution-options :deep(.app-select-trigger),.execution-options .workspace-select{width:100%;font-size:12.5px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}
.workspace-select{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}
.composer footer{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}
.composer footer>select,.composer footer>.app-select{font-size:12.5px;border-radius:10px;min-height:34px}
.composer footer .muted{flex:1;min-width:120px}
.composer footer>button{font-size:12.5px;font-weight:600;border-radius:9px;min-height:34px}

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
.directory-backdrop{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}
.directory-dialog{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}
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

/* ---- responsive ---- */
@media(max-width:800px){.sessions{width:214px;padding:12px 10px}.transcript{padding:14px}.composer{margin:0 12px 12px}.composer footer .muted{display:none}.conversation-header{padding:14px 16px}.welcome{margin:30px auto 0}.turn{margin-bottom:22px}}
@media(max-width:560px){.workspace{flex-direction:column}.sessions{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input,.filter-bar,.connection{display:none}.session-list{display:flex;gap:6px;overflow-x:auto}.session-card{min-width:160px;width:160px;margin-bottom:0}.ledger-button{padding:5px;font-size:12px}}
</style>
