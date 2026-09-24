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
}

export const useAgentsStore = defineStore('agents', () => {
  const agents = ref<AgentInfo[]>([])
  const tasks = ref<TaskRow[]>([])
  const onlineCount = ref(0)
  const loading = ref(false)
  const error = ref('')
  let timer: ReturnType<typeof setInterval> | null = null

  async function fetchAgents() {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch('/api/agents')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      agents.value = data.agents || []
      onlineCount.value = data.online_count ?? agents.value.length
    } catch (e: any) {
      error.value = e.message || 'failed'
    } finally {
      loading.value = false
    }
    try {
      const tres = await fetch('/api/tasks')
      if (tres.ok) {
        const tdata = await tres.json()
        tasks.value = tdata.tasks || []
      }
    } catch {
      // ignore task poll errors
    }
  }

  function connect() {
    fetchAgents()
    if (timer) clearInterval(timer)
    timer = setInterval(fetchAgents, 5000)
  }

  function disconnect() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function isHealthy(a: AgentInfo) {
    return a.status.includes('HEALTHY') || a.status === 'HEALTHY'
  }

  return {
    agents,
    tasks,
    onlineCount,
    loading,
    error,
    fetchAgents,
    connect,
    disconnect,
    isHealthy,
  }
})
