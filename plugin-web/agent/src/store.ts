import { reactive } from 'vue'

export interface AgentInfo {
  plugin_id: string
  name: string
  version: string
  address: string
  status: string
  active_tasks: number
  missing_dependencies?: string[]
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
  args?: string
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

// Plugin-local store (host pinia stays private to the WebUI). Singleton per
// bundle; reactive() mirrors pinia's auto-unwrapped store property access
// (page templates read store.tasks.filter(...) directly).
function createStore() {
  const s = reactive({
    agents: [] as AgentInfo[],
    tasks: [] as TaskRow[],
    sessions: [] as TaskRow[],
    onlineCount: 0,
    loading: false,
    error: '',
  })

  let timer: ReturnType<typeof setInterval> | null = null
  let inFlight: Promise<void> | null = null
  let queuedRefresh: Promise<void> | null = null
  let taskCursor = ''
  const taskCache = new Map<string, TaskRow>()
  let taskEvents: EventSource | null = null
  let streaming = false

  function applyTasks(tdata: any) {
    if (tdata.reset) taskCache.clear()
    for (const id of tdata.removed || []) taskCache.delete(id)
    for (const row of tdata.tasks || []) taskCache.set(row.task_id, row)
    taskCursor = tdata.cursor || ''
    const rows = [...taskCache.values()].sort((a, b) => (b.started_at || '').localeCompare(a.started_at || '') || a.task_id.localeCompare(b.task_id))
    s.tasks = rows.filter((task) => task.kind !== 'agent_session')
    s.sessions = rows.filter((task) => task.kind === 'agent_session')
  }

  function streamTasks() {
    taskEvents?.close()
    streaming = false
    taskEvents = new EventSource(`/api/tasks/events?cursor=${encodeURIComponent(taskCursor)}`)
    taskEvents.onopen = () => { streaming = true }
    taskEvents.onerror = () => { streaming = false }
    taskEvents.addEventListener('tasks', (event) => { try { applyTasks(JSON.parse((event as MessageEvent).data)) } catch { streaming = false } })
  }

  function fetchAgents(): Promise<void> {
    if (inFlight) {
      if (!queuedRefresh) queuedRefresh = inFlight.then(() => { queuedRefresh = null; return fetchAgents() })
      return queuedRefresh
    }
    inFlight = refresh().finally(() => { inFlight = null })
    return inFlight
  }

  async function refresh() {
    s.loading = true
    s.error = ''
    try {
      const res = await fetch('/api/agents', { signal: AbortSignal.timeout(8000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      s.agents = data.agents || []
      s.onlineCount = data.online_count ?? s.agents.length
    } catch (e: any) {
      s.error = e.message || 'failed'
    }
    if (!streaming) {
      try {
        const tres = await fetch(`/api/tasks?incremental=1&cursor=${encodeURIComponent(taskCursor)}`, { signal: AbortSignal.timeout(8000) })
        if (!tres.ok) throw new Error(`任务记录 HTTP ${tres.status}`)
        const tdata = await tres.json()
        applyTasks(tdata)
      } catch (e: any) { s.error = e.message || '无法刷新任务记录' }
    }
    s.loading = false
  }

  function connect() {
    void fetchAgents().then(() => { if (timer) streamTasks() })
    if (timer) clearInterval(timer)
    timer = setInterval(() => { if (!document.hidden && !inFlight) void fetchAgents() }, 2000)
  }

  function disconnect() {
    taskEvents?.close()
    taskEvents = null
    streaming = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function isHealthy(a: AgentInfo) {
    return !a.missing_dependencies?.length && (a.status === 'PLUGIN_STATUS_HEALTHY' || a.status === 'HEALTHY')
  }

  async function createSession(title: string): Promise<string> {
    const response = await fetch('/api/agent/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
    if (!response.ok) throw new Error(await response.text())
    const body = await response.json()
    await fetchAgents()
    return body.session_id
  }
  async function manageSession(session_id: string, action: 'archive' | 'restore' | 'delete' | 'rename', title?: string) {
    const response = await fetch('/api/agent/sessions', { method: action === 'delete' ? 'DELETE' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id, action, title }) })
    if (!response.ok) throw new Error(await response.text())
    await fetchAgents()
  }
  async function sendTask(session_id: string, prompt: string, agent_type: string, options: Record<string, string> = {}) {
    const response = await fetch('/api/agent/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id, prompt, agent_type, ...options }) })
    const body = await response.text()
    await fetchAgents()
    if (!response.ok) {
      let message = body
      try { message = JSON.parse(body).message || body } catch { /* server returned plain text */ }
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

  return Object.assign(s, {
    fetchAgents,
    connect,
    disconnect,
    isHealthy,
    createSession,
    manageSession,
    sendTask,
    cancelTask,
  })
}

const store = createStore()

export function useAgentsStore() {
  return store
}
