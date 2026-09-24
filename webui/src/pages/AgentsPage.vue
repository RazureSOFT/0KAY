<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAgentsStore, type TaskRow } from '../stores/agents'
import MarkdownContent from '../components/MarkdownContent.vue'

const store = useAgentsStore()
const selectedId = ref(localStorage.getItem('0kay.agent.selected') || '')
const draft = ref('')
const search = ref('')
const source = ref('all')
const mode = ref('general')
const executorId = ref('')
const workdir = ref('')
const intensity = ref('medium')
const modelId = ref('MOCR')
const permissionMode = ref('normal')
const approvals = ref<Array<{id:string;executor_id:string;session_id:string;task_id:string;tool:string;args:Record<string,unknown>;cwd:string}>>([])
const approvalBusy = ref('')
const folderName = ref('')
let approvalTimer: ReturnType<typeof setInterval> | null = null
let approvalFetching=false
async function fetchApprovals() {
  if(approvalFetching || document.hidden)return
  approvalFetching=true
  try {const response=await fetch('/api/agent/approvals',{signal:AbortSignal.timeout(10000)});if(response.ok) approvals.value=(await response.json()).approvals || []} catch { /* retain pending decisions */ }
  finally {approvalFetching=false}
}
async function decideApproval(id:string,executor_id:string,allow:boolean) {
  approvalBusy.value=id
  try {const response=await fetch('/api/agent/approvals',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,executor_id,allow})});if(!response.ok)throw new Error(await response.text());await fetchApprovals()}
  catch(e:any){error.value=e.message}finally{approvalBusy.value=''}
}
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
    intensity.value = saved.thinking_intensity || 'medium'; modelId.value = saved.model_id || 'MOCR'
    permissionMode.value=saved.permission_mode==='full_access'?'full_access':'normal'
    draft.value=saved.draft || '';mode.value=saved.mode || 'general'
  } catch { executorId.value='';workdir.value='';intensity.value='medium';modelId.value='MOCR';draft.value='';mode.value='general' }
}
async function fetchModels() {
  try {
    const response = await fetch('/api/models')
    if (!response.ok) throw new Error(`模型目录 HTTP ${response.status}`)
    models.value = (await response.json()).models || []
  } catch (e: any) { error.value = e.message }
}
function options() { return { executor_id: executorId.value, workdir: workdir.value.trim(), thinking_intensity: intensity.value, model_id: modelId.value, permission_mode:permissionMode.value } }
const busy = ref(false)
const error = ref('')
const showLedger = ref(false)
const showArchived = ref(false)
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
const stateName = (value: string) => ({ pending:'等待执行', running:'执行中', done:'完成', failed:'失败', cancelled:'已停止' }[value] || value)
const time = (value?: string) => value ? new Date(value).toLocaleString() : ''
function steps(turn: TaskRow) {
  return store.tasks.filter(item => item.task_id !== turn.task_id && item.session_id === turn.session_id &&
    (item.parent_id === turn.task_id || item.parent_id?.startsWith(`${turn.task_id}:sub:`)))
    .sort((a,b) => (a.started_at || '').localeCompare(b.started_at || '') || a.task_id.localeCompare(b.task_id))
}
function hasFinalReply(turn: TaskRow) {
  return steps(turn).some(step => step.kind === 'think' && step.result?.trim() === turn.result?.trim())
}
async function manage(action: 'archive' | 'restore' | 'delete') {
  if (!session.value || busy.value) return
  if (action === 'delete' && !window.confirm('永久删除此会话及其中的消息和工具记录？')) return
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
watch(selectedId, () => { followLatest.value=true;void scrollBottom();closeBrowser();error.value='' })
watch(selectedId, loadOptions)
watch(executorId,()=>{hostUsage.value=null;workdir.value='';closeBrowser();fetchHost()},{flush:'sync'})
watch(hostOpen,fetchHost)
watch(selectedId,()=>{compactNotice.value=''})
onMounted(() => { store.connect(); loadOptions(); fetchModels();fetchApprovals();approvalTimer=setInterval(fetchApprovals,2000);hostTimer=setInterval(fetchHost,5000);window.addEventListener('keydown',onEscape) })
onUnmounted(() => {rememberEditor();closeBrowser();store.disconnect();if(hostTimer) clearInterval(hostTimer);if(approvalTimer)clearInterval(approvalTimer);window.removeEventListener('keydown',onEscape)})
</script>

<template>
  <main class="workspace">
    <aside class="sessions">
      <header><h1>Agent</h1><button @click="create" :disabled="busy" title="新建会话">＋ 新对话</button></header>
      <div class="connection"><i :class="{online:store.onlineCount>0}" />{{ store.onlineCount }} 个执行器在线 <button @click="store.fetchAgents()" title="刷新">↻</button></div>
      <input v-model="search" placeholder="搜索会话…" aria-label="搜索会话" />
      <nav class="filters"><button v-for="filter in [{id:'all',label:'全部'},{id:'life',label:'LIFE 发起'},{id:'user',label:'我的对话'}]" :key="filter.id" :class="{chosen:source===filter.id}" @click="source=filter.id">{{ filter.label }}</button></nav>
      <label class="muted"><input v-model="showArchived" type="checkbox" /> 显示已归档会话</label>
      <div class="session-list">
        <button v-for="item in sessions" :key="item.task_id" class="session-item" :disabled="busy" :class="{selected:selectedId===item.session_id && !showLedger}" @click="choose(item.session_id!)">
          <span class="origin">{{ isLife(item) ? 'LIFE → Agent' : '你 ↔ Agent' }}</span>
          <strong>{{ item.prompt || '未命名会话' }}</strong><small>{{ time(item.started_at) }}</small>
        </button>
        <p v-if="!sessions.length" class="muted">暂无会话。直接发送消息，或等待 LIFE 委派工作。</p>
      </div>
      <button class="ledger-button" :class="{chosen:showLedger}" @click="showLedger=true">全部任务记录 · {{ store.tasks.length }}</button>
    </aside>

    <section v-if="showLedger" class="ledger">
      <header><h2>全部任务记录</h2><button @click="showLedger=false">返回会话</button></header>
      <p class="muted">包括 LIFE 对话、模型调用、Agent 执行及工具活动。</p>
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
        <div v-if="!turns.length" class="welcome"><h2>想让 Agent 帮你做什么？</h2><p>直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。</p><p>左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。</p></div>
        <article v-for="turn in turns" :key="turn.task_id" class="turn">
          <div class="message request"><div class="message-head"><b>{{ isLife(turn) ? 'LIFE' : '你' }}</b><time>{{ time(turn.started_at) }}</time></div><div class="message-text">{{ turn.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, '') }}</div></div>
          <div class="message response"><div class="message-head"><b>Agent</b><span :class="turn.state">{{ stateName(turn.state) }}</span></div>
            <div v-if="steps(turn).length" class="steps"><template v-for="step in steps(turn)" :key="step.task_id">
              <div v-if="step.kind === 'think'" class="agent-speech"><template v-if="step.result"><MarkdownContent :content="step.result" /><span v-if="step.state === 'running'" class="running"> ▍</span></template><small v-else class="muted">{{ step.state === 'running' ? 'Agent 正在生成回复…' : '本轮仅调用工具，没有文本回复' }}</small><p v-if="step.error" class="error">{{ step.error }}</p></div>
              <details v-else><summary><span :class="step.state">●</span> {{ step.kind === 'tool' ? '工具' : '子 Agent' }} · {{ step.prompt }} <small>{{ stateName(step.state) }}</small></summary><pre>{{ step.result || step.error || (step.state === 'running' ? '执行中…' : '执行完成，无输出') }}</pre></details>
            </template></div>
            <MarkdownContent v-if="turn.result && !hasFinalReply(turn)" :content="turn.result" />
            <div v-if="turn.error" class="error">{{ turn.error }}</div>
            <p v-if="['running','pending'].includes(turn.state)" class="muted">Agent 正在处理，执行过程会自动更新…</p>
          </div>
        </article>
      </div>
      <form class="composer" @submit.prevent="send">
        <section v-for="approval in approvals" :key="approval.id" class="permission-request">
          <strong>等待你审批 · {{ approval.tool }}</strong><small>{{ approval.session_id===selectedId ? '当前会话' : '其他会话 / LIFE' }} · {{ approval.executor_id }} · {{ approval.cwd }}</small>
          <pre>{{ JSON.stringify(approval.args,null,2) }}</pre><div><button type="button" :disabled="!!approvalBusy" @click="decideApproval(approval.id,approval.executor_id,false)">拒绝</button><button type="button" class="btn-primary" :disabled="!!approvalBusy" @click="decideApproval(approval.id,approval.executor_id,true)">允许本次执行</button></div>
        </section>
        <div v-if="compactNotice" class="compact-notice">{{ compactNotice }}</div>
        <textarea v-model="draft" :disabled="busy || session?.state === 'archived'" :placeholder="session?.state === 'archived' ? '恢复会话后可以继续对话' : '给 Agent 发消息…（Enter 发送，Shift+Enter 换行）'" aria-label="给 Agent 发消息" @keydown="onComposerKey" />
        <div class="execution-options">
          <label>权限<select v-model="permissionMode" :disabled="!!active || busy"><option value="normal">Normal · 全部审批</option><option value="full_access">Full access · 自动执行</option></select></label>
          <label>执行器<select v-model="executorId" :disabled="!!active || busy"><option value="">自动选择在线执行器</option><option v-for="agent in store.agents" :key="agent.plugin_id" :value="agent.plugin_id">{{ agent.host?.hostname || agent.name }} · {{ agent.plugin_id }}</option></select></label>
          <label>工作区<button type="button" class="workspace-select" :disabled="!!active || busy || !executor" :title="workdir || executor?.host?.workdir" @click="browse(workdir || executor?.host?.workdir || '')">📁 {{ workdir || '选择目录…' }}</button></label>
          <label>思考强度<select v-model="intensity" :disabled="!!active || busy"><option value="low">低</option><option value="medium">中</option><option value="high">高</option><option value="max">最高</option></select></label>
          <label>模型<select v-model="modelId" :disabled="!!active || busy" @focus="fetchModels"><option value="MOCR">MOCR · 自动选型</option><option v-for="model in models" :key="`${model.provider}:${model.id}`" :value="model.id">{{ model.id }} · {{ model.provider }}</option></select></label>
        </div>
        <footer><select v-model="mode" :disabled="busy" aria-label="Agent 模式"><option value="general">通用 Agent</option><option value="code">编程 Agent</option><option value="research">调研 Agent</option></select><button type="button" @click="hostOpen=!hostOpen">宿主机</button><button type="button" :disabled="!session || !!active || busy || session.state === 'archived'" @click="compact">/compact</button><span class="muted">{{ active?.kind === 'compact' ? '上下文压缩中…' : store.onlineCount ? '在当前会话中继续' : '执行器离线' }}</span><button v-if="active?.kind === 'agent'" type="button" @click="stop">停止</button><button v-else type="submit" :disabled="busy || !!active || !draft.trim() || session?.state === 'archived'">{{ busy ? '处理中…' : '发送 ↑' }}</button></footer>
      </form>
    </section>
    <div v-if="browserOpen" class="directory-backdrop" @click.self="closeBrowser"><section class="directory-dialog" role="dialog" aria-modal="true" aria-label="选择工作区目录"><header><h2>选择 {{ executor?.host?.hostname || '执行器' }} 的工作区</h2><button @click="closeBrowser">关闭</button></header><div class="directory-roots"><button v-for="root in directory.roots" :key="root" :disabled="browserBusy" @click="browse(root)">{{ root }}</button><button :disabled="browserBusy" @click="browse(executor?.host?.workdir || '')">默认目录</button></div><code>{{ directory.path }}</code><form class="new-folder" @submit.prevent="createFolder"><input v-model="folderName" placeholder="新文件夹名称" aria-label="新文件夹名称" :disabled="browserBusy"/><button :disabled="browserBusy || !folderName.trim() || !directory.path">新建文件夹</button></form><p v-if="browserError" class="error">{{ browserError }}</p><p v-if="browserBusy">正在读取目录…</p><div v-else class="directory-list"><button v-if="directory.parent!==directory.path" @click="browse(directory.parent)">↰ 上一级</button><button v-for="folder in directory.directories" :key="folder.path" @click="browse(folder.path)">📁 {{ folder.name }}</button><p v-if="!directory.directories.length" class="muted">没有子目录</p></div><footer><button :disabled="browserBusy || !!browserError || !directory.path" @click="selectDirectory">选择当前目录</button></footer></section></div>
  </main>
</template>

<style scoped>
.new-folder{display:flex;gap:8px}.new-folder input{flex:1;min-width:0}.permission-request{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small{display:block;margin:8px 0}.permission-request pre{max-height:160px;overflow:auto}.permission-request>div{display:flex;justify-content:flex-end;gap:8px}
.directory-backdrop{position:fixed;inset:0;background:#0008;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:20px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh}.directory-list{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:5px}.directory-list button{text-align:left}.directory-roots{display:flex;gap:8px;flex-wrap:wrap}.directory-dialog code{overflow-wrap:anywhere}.workspace-select{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;text-align:left}.usage-rings{display:flex;align-items:center;gap:24px;padding:16px 0;flex-wrap:wrap}.usage-metric{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-low);display:grid;place-items:center;font-size:16px}.compact-notice{font-size:12px;padding:10px 16px;color:var(--md-primary)}.composer footer{flex-wrap:wrap}
.execution-options{display:flex;gap:10px;padding:12px 24px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label{display:flex;flex-direction:column;gap:5px;font-size:11px;flex:1;min-width:130px}.execution-options input,.execution-options select{width:100%;font-size:12px}.host-panel{padding:14px 24px;background:var(--md-surface-container-low);max-height:240px;overflow:auto}.host-panel>span{margin-left:12px}.host-panel dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;font-size:12px}.host-panel dt{color:var(--md-on-surface-variant)}.host-panel dd{margin:4px 0;overflow-wrap:anywhere}
.session-actions{display:flex;gap:8px;flex-shrink:0}.agent-speech{margin:16px 0;padding:6px 0}.sessions label input{width:auto;margin-right:6px}
.workspace{display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}
button,input,textarea,select{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container);padding:9px 12px}button{cursor:pointer}button:disabled{opacity:.45;cursor:default}button:hover:not(:disabled){background:var(--md-secondary-container)}
.sessions{width:280px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:18px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}header{display:flex;align-items:center;justify-content:space-between;gap:12px}h1{font-size:22px}h2{font-size:18px;margin:0}.connection{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button{margin-left:auto;padding:2px 8px}.connection i{width:7px;height:7px;border-radius:50%;background:var(--md-outline)}.connection i.online{background:#3a6}.filters{display:flex;gap:4px}.filters button{font-size:12px;flex:1;padding:7px 4px}.chosen,.session-item.selected{background:var(--md-secondary-container)}.session-list{overflow-y:auto;flex:1;min-height:0}.session-item{display:flex;flex-direction:column;width:100%;text-align:left;gap:7px;margin-bottom:8px;border-color:transparent}.session-item strong{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:500}.origin,small{font-size:11px;color:var(--md-on-surface-variant)}.ledger-button{text-align:left}
.conversation{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header{padding:20px 28px;border-bottom:1px solid var(--md-outline-variant)}.conversation-header p{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:12px}.transcript{flex:1;overflow-y:auto;padding:28px;min-height:0}.welcome{max-width:680px;margin:80px auto;color:var(--md-on-surface-variant);line-height:1.8}.welcome h2{color:var(--md-on-surface);font-size:26px}.turn{max-width:900px;margin:0 auto 30px}.message{padding:18px 20px;border-radius:12px;margin-bottom:14px}.request{background:var(--md-surface-container)}.response{border:1px solid var(--md-outline-variant)}.message-head{display:flex;align-items:center;gap:14px;margin-bottom:14px;font-size:12px}.message-head time{margin-left:auto;color:var(--md-on-surface-variant)}.message-text,pre{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}pre{max-height:450px;overflow:auto;font-family:monospace}.steps{margin-bottom:16px}.steps details{border-radius:8px;background:var(--md-surface-container);padding:10px 14px;margin:8px 0}.steps summary{cursor:pointer;font-size:12px}.steps summary small{margin-left:10px}.running,.pending{color:#b88412}.failed{color:var(--md-error,#c44)}.done{color:#3a6}.cancelled,.muted{color:var(--md-on-surface-variant)}.muted{font-size:12px;line-height:1.6}.error{background:var(--md-error-container);padding:12px 18px;border-radius:8px;margin:8px 18px;font-size:13px;overflow-wrap:anywhere}.composer{margin:0 28px 24px;border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container)}.composer textarea{width:100%;min-height:100px;max-height:260px;resize:vertical;border:none;background:transparent;padding:16px;outline:none}.composer footer{display:flex;align-items:center;gap:12px;padding:10px}.composer footer .muted{flex:1}.composer select{font-size:12px}.ledger{flex:1;overflow-y:auto;padding:24px}.ledger-entry{border-bottom:1px solid var(--md-outline-variant);padding:18px 0}.ledger-entry>div{display:flex;gap:14px;font-size:12px}.ledger-entry p{overflow-wrap:anywhere}
@media(max-width:800px){.sessions{width:210px;padding:10px}.transcript{padding:14px}.composer{margin:0 12px 12px}.composer footer .muted{display:none}.conversation-header{padding:14px}.welcome{margin:30px auto}}
@media(max-width:560px){.workspace{flex-direction:column}.sessions{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input,.filters,.connection{display:none}.session-list{display:flex;gap:6px}.session-item{min-width:160px;width:160px}.ledger-button{padding:5px;font-size:12px}}
</style>
