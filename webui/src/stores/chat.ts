import { defineStore } from 'pinia'
import { ref, computed, onScopeDispose } from 'vue'
import { useWizardStore } from './wizard'
import { uid } from '../uid'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  requestId?: string
  images?: string[]
  emotion?: {
    valence: number
    arousal: number
    connection: number
    irritation: number
  }
  mentalEnergy?: number
  thinkSummary?: string
}

export const useChatStore = defineStore('chat', () => {
  const HISTORY_KEY = '0kay.life.chat.webui.default.v1'
  const SESSION_KEY = '0kay.life.session.v1'
  const sessionId = ref(sessionStorage.getItem(SESSION_KEY) || `webui:${uid()}`)
  sessionStorage.setItem(SESSION_KEY, sessionId.value)
  const messages = ref<Message[]>([])
  const isConnected = ref(false)
  const isTyping = ref(false)
  const currentTaskId = ref<string | null>(null)
  const lastUsage = ref<{
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  } | null>(null)
  const contextSummary = ref('')
  const compacting = ref(false)

  let ws: WebSocket | null = null
  let messageIdCounter = 0
  let activeSseController: AbortController | null = null
  let notificationTimer: ReturnType<typeof setInterval> | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  const lastMessage = computed(() =>
    messages.value.length > 0 ? messages.value[messages.value.length - 1] : null
  )
  const contextTokens = computed(() => {
    const text = `${contextSummary.value}\n${messages.value.map((message) => message.content).join('\n')}`
    return Math.max(0, Math.ceil(text.length / 4))
  })

  function persistHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify({
        summary: contextSummary.value,
        messages: messages.value.map((message) => ({ ...message, timestamp: message.timestamp.toISOString() })),
      }))
    } catch { /* quota/browser privacy mode */ }
  }

  function restoreHistory() {
    try {
      const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}')
      contextSummary.value = typeof stored.summary === 'string' ? stored.summary : ''
      if (Array.isArray(stored.messages)) {
        messages.value = stored.messages.map((message: any) => ({ ...message, timestamp: new Date(message.timestamp || Date.now()) }))
        messageIdCounter = messages.value.length
      }
    } catch { /* ignore corrupt local session */ }
  }

  function connect() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`

    ws = new WebSocket(wsUrl)
    if (!notificationTimer) {
      notificationTimer = setInterval(async () => {
        try {
          const response = await fetch(`/api/life/notifications?session_id=${encodeURIComponent(sessionId.value)}`)
          if (!response.ok) return
          const body = await response.json()
          for (const notification of body.notifications || []) {
            if(messages.value.some(message=>message.id===`notification_${notification.id}`))continue
            messages.value.push({ id: `notification_${notification.id}`, role: 'assistant', content: notification.text, timestamp: new Date(notification.created_at || Date.now()) })
          }
          if ((body.notifications || []).length) persistHistory()
          if ((body.notifications || []).length) await fetch('/api/life/notifications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:sessionId.value,ids:body.notifications.map((item:any)=>item.id)})})
        } catch { /* LIFE may be restarting */ }
      }, 4000)
    }

    ws.onopen = () => {
      isConnected.value = true
      console.log('WebSocket connected')
    }

    ws.onclose = () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
      if (reconnectTimer) clearTimeout(reconnectTimer)
      reconnectTimer = setTimeout(connect, 3000)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      } catch (e) {
        console.error('Failed to parse message:', e)
      }
    }
  }

  /** Stop background timers and sockets when the store scope is disposed. */
  function dispose() {
    if (notificationTimer) { clearInterval(notificationTimer); notificationTimer = null }
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
    if (ws) { ws.onclose = null; ws.close(); ws = null }
    activeSseController?.abort()
  }
  onScopeDispose(dispose)

  function handleWebSocketMessage(data: any) {
    switch (data.type) {
      case 'chunk':
        handleChunk(data)
        break
      case 'done':
        handleDone(data)
        break
      case 'usage':
        handleUsage(data)
        break
      case 'task_started':
        handleTaskStarted(data)
        break
      case 'error':
        handleError(data)
        break
    }
  }

  function findOrCreateAssistant(requestId?: string): Message | null {
    if (requestId) {
      const existing = messages.value.find(
        (m) => m.role === 'assistant' && m.requestId === requestId
      )
      if (existing) return existing
    }
    const last = messages.value[messages.value.length - 1]
    if (last && last.role === 'assistant' && last.content && !last.requestId) {
      return last
    }
    const msg: Message = {
      id: `msg_${++messageIdCounter}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      requestId,
    }
    messages.value.push(msg)
    return msg
  }

  function appendChunk(requestId: string | undefined, chunk: string, separate = false, payload?: any) {
    if (!chunk) return
    const current = requestId ? messages.value.find((message) => message.role === 'assistant' && message.requestId === requestId) : undefined
    if (!separate || (current && !current.content)) {
      const target = findOrCreateAssistant(requestId)
      if (target) {
        target.content += chunk
        if (payload?.emotion) target.emotion = payload.emotion
        if (payload?.mental_energy !== undefined) target.mentalEnergy = payload.mental_energy
        if (payload?.think_summary) target.thinkSummary = payload.think_summary
      }
      return
    }
    messages.value.push({
      id: `msg_${++messageIdCounter}`,
      role: 'assistant',
      content: chunk,
      timestamp: new Date(),
      requestId,
      emotion: payload?.emotion,
      mentalEnergy: payload?.mental_energy,
      thinkSummary: payload?.think_summary,
    })
  }

  function handleChunk(data: any) {
    appendChunk(data.request_id, data.chunk)
  }

  function handleUsage(data: any) {
    if (data.usage) {
      lastUsage.value = data.usage
    }
    isTyping.value = false
  }

  function handleDone(_data: any) {
    isTyping.value = false
  }

  function handleTaskStarted(data: any) {
    currentTaskId.value = data.task_id
    messages.value.push({
      id: `msg_${++messageIdCounter}`,
      role: 'assistant',
      content: `Task started: ${data.task_id}`,
      timestamp: new Date(),
    })
  }

  function handleError(data: any) {
    console.error('Chat error:', data.error)
    if (data.error) {
      const target = findOrCreateAssistant(data.request_id)
      if (target && !target.content) {
        target.content = `⚠ ${data.error}`
      }
    }
    isTyping.value = false
  }

  /**
   * Upload an image to Core and return its public URL.
   */
  async function uploadImage(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/images', { method: 'POST', body: form })
    if (!res.ok) throw new Error(`upload failed: HTTP ${res.status}`)
    const data = await res.json()
    if (!data.url) throw new Error('upload failed: no url')
    return data.url as string
  }

  /**
   * Send a chat message.
   * Primary: HTTP SSE (POST /api/chat?stream=true) for incremental token streaming.
   * Fallback: WebSocket when HTTP/SSE fails.
   */
  async function sendMessage(content: string, images: string[] = []) {
    messages.value.push({
      id: `msg_${++messageIdCounter}`,
      role: 'user',
      content,
      timestamp: new Date(),
      images: images.length ? [...images] : undefined,
    })
    persistHistory()

    isTyping.value = true
    const requestId = `req_${Date.now()}`

    // Ensure an assistant bubble exists for this request before first chunk
    messages.value.push({
      id: `msg_${++messageIdCounter}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      requestId,
    })

    // History: all messages except the empty assistant bubble we just created
    const history = messages.value
      .filter((m) => !(m.role === 'assistant' && m.requestId === requestId && !m.content))
      .slice(-20)
      .filter((m) => m.content || m.images?.length)
      .map((m) => {
        let text = m.content || ''
        if (m.images?.length) {
          const refs = m.images.map((u) => `[image: ${u}]`).join(' ')
          text = text ? `${text}\n${refs}` : refs
        }
        return { role: m.role, content: text }
      })

    try {
      await sendViaSSE(requestId, content, history)
    } catch (e) {
      console.warn('SSE chat failed, falling back to WebSocket:', e)
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Remove the empty assistant bubble; WS path will create its own
        const idx = messages.value.findIndex((m) => m.requestId === requestId && !m.content)
        if (idx >= 0) messages.value.splice(idx, 1)
        appendChunk(requestId, '⚠ LIFE 对话服务不可用，未回退到基础模型以避免丢失人设。')
        isTyping.value = false
      } else {
        isTyping.value = false
        appendChunk(requestId, `⚠ Connection error: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
  }

  async function sendViaSSE(
    requestId: string,
    prompt: string,
    history: Array<{ role: string; content: string }>
  ): Promise<void> {
    abortActiveSse()
    const controller = new AbortController()
    activeSseController = controller

    const persona = useWizardStore().persona
    const res = await fetch('/api/life/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        request_id: requestId,
        prompt,
        stream: true,
        session_id: sessionId.value,
        // Conversation history stays in LIFE memory; persona is an explicit
        // typed field so the base model cannot overwrite the selected identity.
        user_id: 'webui',
        persona,
        history: [{ role: 'system', content: contextSummary.value }, ...history],
      }),
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const contentType = res.headers.get('content-type') || ''

    // Server may fall back to JSON if SSE unsupported
    if (contentType.includes('application/json')) {
      const body = await res.json()
      appendChunk(requestId, body.response || '')
      if (body.usage) lastUsage.value = body.usage
      isTyping.value = false
      return
    }

    if (!res.body) {
      throw new Error('No response body')
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let sawDone = false

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // SSE frames separated by blank line
        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''

        for (const part of parts) {
          const eventMatch = part.match(/^event:\s*(.+)$/m)
          const dataMatch = part.match(/^data:\s*(.+)$/m)
          if (!eventMatch || !dataMatch) continue
          const eventName = eventMatch[1].trim()
          let payload: any = null
          try {
            payload = JSON.parse(dataMatch[1])
          } catch {
            continue
          }

          if (eventName === 'chunk') {
            if (payload.error) {
              handleError({ request_id: requestId, error: payload.error })
              sawDone = true
              break
            }
            appendChunk(requestId, payload.chunk || '', false, payload)
            if (payload.task_id) currentTaskId.value = payload.task_id
            if (payload.done) {
              sawDone = true
            }
          } else if (eventName === 'done') {
            sawDone = true
          } else if (eventName === 'error') {
            handleError({ request_id: requestId, error: payload.error || payload })
            sawDone = true
            break
          }
        }
        if (sawDone) break
      }
    } finally {
      try {
        reader.releaseLock()
      } catch {
        /* ignore */
      }
      if (activeSseController === controller) activeSseController = null
      isTyping.value = false
      persistHistory()
    }

    if (!sawDone) {
      // Stream ended without done — treat as complete
      isTyping.value = false
    }
  }

  function abortActiveSse() {
    if (activeSseController) {
      activeSseController.abort()
      activeSseController = null
    }
  }

  function clearMessages() {
    abortActiveSse()
    messages.value = []
    lastUsage.value = null
    contextSummary.value = ''
    sessionId.value = `webui:${uid()}`
    sessionStorage.setItem(SESSION_KEY, sessionId.value)
    try { localStorage.removeItem(HISTORY_KEY) } catch { /* ignore */ }
  }

  async function compactContext() {
    if (compacting.value || (!messages.value.length && !contextSummary.value)) return
    compacting.value = true
    try {
      const history = [{ role: 'system', content: contextSummary.value }, ...messages.value.map((message) => ({ role: message.role, content: message.content }))]
      const response = await fetch('/api/life/compact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId.value, history, persona: useWizardStore().persona }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const body = await response.json()
      contextSummary.value = body.summary || ''
      // Keep a short visible tail after compaction while the summary holds continuity.
      messages.value = messages.value.slice(-6)
      persistHistory()
    } finally { compacting.value = false }
  }

  return {
    messages,
    isConnected,
    isTyping,
    currentTaskId,
    lastUsage,
    contextTokens,
    contextSummary,
    compacting,
    lastMessage,
    connect,
    sendMessage,
    uploadImage,
    clearMessages,
    compactContext,
    restoreHistory,
  }
})
