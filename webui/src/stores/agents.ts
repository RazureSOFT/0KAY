import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AgentInfo {
  plugin_id: string
  name: string
  version: string
  address: string
  status: string
  active_tasks: number
  last_heartbeat_age_seconds: number
  host?: {
    hostname?: string
    os?: string
    arch?: string
    cpu_model?: string
    cpu_cores?: number
    memory_total_bytes?: number
    memory_available_bytes?: number
    workdir?: string
  } | null
}

export interface TaskRow {
  task_id: string
  caller_id?: string
  prompt?: string
  agent_id?: string
  state: string
  started_at?: string
  ended_at?: string
  result?: string
  error?: string
  session_id?: string
  kind?: string
  parent_id?: string
}

export const useAgentsStore = defineStore('agents', () => {
  const agents = ref<AgentInfo[]>([])
  const tasks = ref<TaskRow[]>([])
  const sessions = ref<TaskRow[]>([])
  const onlineCount = ref(0)
  const loading = ref(false)
  const error = ref('')
  let timer: ReturnType<typeof setInterval> | null = null
  let inFlight: Promise<void> | null = null
  let queuedRefresh: Promise<void> | null = null
  let taskCursor=''
  const taskCache=new Map<string,TaskRow>()

  function fetchAgents(): Promise<void> {
    if (inFlight) {
      if (!queuedRefresh) queuedRefresh = inFlight.then(() => {queuedRefresh=null;return fetchAgents()})
      return queuedRefresh
    }
    inFlight = refresh().finally(() => {inFlight=null})
    return inFlight
  }
  async function refresh() {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch('/api/agents', {signal:AbortSignal.timeout(8000)})
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      agents.value = data.agents || []
      onlineCount.value = data.online_count ?? agents.value.length
    } catch (e: any) {
      error.value = e.message || 'failed'
    }
    try {
      const tres = await fetch(`/api/tasks?incremental=1&cursor=${encodeURIComponent(taskCursor)}`, {signal:AbortSignal.timeout(8000)})
      if (!tres.ok) throw new Error(`任务记录 HTTP ${tres.status}`)
      if (tres.ok) {
        const tdata = await tres.json()
        if(tdata.reset) taskCache.clear()
        for(const id of tdata.removed || [])taskCache.delete(id)
        for(const row of tdata.tasks || [])taskCache.set(row.task_id,row)
        taskCursor=tdata.cursor || ''
        const rows: TaskRow[] = [...taskCache.values()].sort((a,b)=>(b.started_at || '').localeCompare(a.started_at || '') || a.task_id.localeCompare(b.task_id))
        tasks.value = rows.filter(task => task.kind !== 'agent_session')
        sessions.value = rows.filter(task => task.kind === 'agent_session')
      }
    } catch (e:any) {error.value = e.message || '无法刷新任务记录'}
    finally {loading.value=false}
  }

  function connect() {
    fetchAgents()
    if (timer) clearInterval(timer)
    timer = setInterval(() => {if(!document.hidden && !inFlight) void fetchAgents()}, 2000)
  }

  function disconnect() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function isHealthy(a: AgentInfo) {
    return a.status === 'PLUGIN_STATUS_HEALTHY' || a.status === 'HEALTHY'
  }

  async function createSession(title: string): Promise<string> {
    const response = await fetch('/api/agent/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
    if (!response.ok) throw new Error(await response.text())
    const body = await response.json()
    await fetchAgents()
    return body.session_id
  }
  async function manageSession(session_id: string, action: 'archive' | 'restore' | 'delete') {
    const response = await fetch('/api/agent/sessions', { method: action === 'delete' ? 'DELETE' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id, action }) })
    if (!response.ok) throw new Error(await response.text())
    await fetchAgents()
  }
  async function sendTask(session_id: string, prompt: string, agent_type: string, options: Record<string, string> = {}) {
    const response = await fetch('/api/agent/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id, prompt, agent_type, ...options }) })
    const body = await response.text()
    await fetchAgents()
    if (!response.ok) {
      let message=body
      try {message=JSON.parse(body).message || body} catch { /* server returned plain text */ }
      throw new Error(message)
    }
  }
  async function cancelTask(task_id: string) {
    const response = await fetch('/api/tasks/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task_id }) })
    if (!response.ok) throw new Error(await response.text())
    const body = await response.json()
    if (!body.success) throw new Error(body.message)
    await fetchAgents()
  }

  return {
    agents,
    tasks,
    sessions,
    createSession,
    manageSession,
    sendTask,
    cancelTask,
    onlineCount,
    loading,
    error,
    fetchAgents,
    connect,
    disconnect,
    isHealthy,
  }
})
