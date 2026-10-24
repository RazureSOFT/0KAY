import { defineStore } from 'pinia'
import { ref, computed, onScopeDispose } from 'vue'
import { useWizardStore } from './wizard'
import { parseMedia } from './media-markers'
import { useLifeStore } from './life'
import { i18n } from '../i18n'
import { uid } from '../uid'
import { readSSE } from '../api'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  requestId?: string
  images?: string[]
  files?: Array<{ name: string; url: string; mime?: string; size?: number }>
  emotion?: {
    valence: number
    arousal: number
    connection: number
    irritation: number
  }
  mentalEnergy?: number
  thinkSummary?: string
  media?: { voice?: boolean; selfie?: string; call?: boolean }
  selfieUrl?: string
}

export const useChatStore = defineStore('chat', () => {
  const HISTORY_KEY = '0kay.life.chat.webui.default.v1'
  const SESSION_KEY = '0kay.life.session.v1'
  const sessionId = ref(localStorage.getItem(SESSION_KEY) || `webui:${uid()}`)
  localStorage.setItem(SESSION_KEY, sessionId.value)
  const messages = ref<Message[]>([])
  const seenL2DMarkers = new Map<string, Set<string>>()
  const L2D_MARKER_RE = /\[\[\s*(motion|expression|emote|action)\s*:\s*([^\]]*?)\s*\]\]/gi
  const L2D_MARKER_STRIP_RE = /\[\[\s*(?:motion|expression|emote|action)\s*:[^\]]*?\]\]/gi
  function dispatchL2DMarker(kind: string, arg: string) {
    if (typeof window === 'undefined') return
    if (kind === 'expression' || kind === 'emote') {
      if (arg) window.dispatchEvent(new CustomEvent('live2d-motion', { detail: { expression: arg } }))
      return
    }
    let group: string | undefined
    let index: number | undefined
    const parts = arg.split(':')
    if (parts.length >= 2) {
      group = parts[0].trim() || undefined
      index = parts[1].trim() === '' ? undefined : Number(parts[1])
    } else if (/^\d+$/.test(arg)) {
      index = Number(arg)
    } else if (arg) {
      group = arg
    }
    if (!Number.isFinite(index as number)) index = undefined
    window.dispatchEvent(new CustomEvent('live2d-motion', { detail: { group, index } }))
  }
  function flushL2DMarkers(message: Message) {
    const text = `${message.thinkSummary || ''}\n${message.content || ''}`
    if (!text.includes('[[')) return
    const seen = seenL2DMarkers.get(message.id) || new Set<string>()
    L2D_MARKER_RE.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = L2D_MARKER_RE.exec(text))) {
      if (seen.has(match[0])) continue
      seen.add(match[0])
      dispatchL2DMarker(match[1].toLowerCase(), match[2].trim())
    }
    seenL2DMarkers.set(message.id, seen)
  }
  function pruneL2DMarkers() {
    if (!seenL2DMarkers.size) return
    const live = new Set(messages.value.map((message) => message.id))
    for (const id of seenL2DMarkers.keys()) {
      if (!live.has(id)) seenL2DMarkers.delete(id)
    }
  }
  const isConnected = ref(false)
  const isTyping = ref(false)
  const unread = ref(0)
  const chatVisible = ref(false)
  const currentTaskId = ref<string | null>(null)
  const lastUsage = ref<{
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  } | null>(null)
  const contextSummary = ref('')
  const compacting = ref(false)
  const voiceEnabled = ref(localStorage.getItem('0kay.voice') === '1')

  let ws: WebSocket | null = null
  let messageIdCounter = 0
  let activeSseController: AbortController | null = null
  let streamEpoch = 0
  let notificationTimer: ReturnType<typeof setInterval> | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let intentionalClose = false
  let reconnectDelay = 1000
  let lastTtsUrl: string | null = null

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
        messages: messages.value.map((message) => {
          const plain: Record<string, unknown> = { ...message, timestamp: message.timestamp.toISOString() }
          // blob: URLs are only valid inside this document; persisted, they
          // render as broken images after a reload.
          for (const key of Object.keys(plain)) {
            if (typeof plain[key] === 'string' && (plain[key] as string).startsWith('blob:')) delete plain[key]
          }
          return plain
        }),
      }))
    } catch { }
  }

  function restoreHistory() {
    try {
      const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}')
      contextSummary.value = typeof stored.summary === 'string' ? stored.summary : ''
      if (Array.isArray(stored.messages)) {
        messages.value = stored.messages.map((message: any) => ({ ...message, timestamp: new Date(message.timestamp || Date.now()) }))
        // Restored messages keep their original ids (msg_7..msg_12); seeding
        // the counter from length alone would mint a duplicate msg_7 after a
        // compact trimmed the list.
        messageIdCounter = messages.value.reduce((max, message) => {
          const numeric = Number(String(message.id || '').match(/^msg_(\d+)$/)?.[1] ?? 0)
          return Math.max(max, numeric)
        }, 0)
      }
    } catch { }
  }

  function connect() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`

    intentionalClose = false
    ws = new WebSocket(wsUrl)
    if (!notificationTimer) {
      notificationTimer = setInterval(async () => {
        if (document.hidden) return
        try {
          const response = await fetch('/api/life/notifications')
          if (!response.ok) return
          const body = await response.json()
          // Pull only broadcast notifications and our own session's: ACKing
          // every webui:* notification here starves other tabs and devices.
          const incoming = (body.notifications || []).filter((notification: any) => {
            const target = String(notification.session_id || '')
            return !target || target === 'all' || target === sessionId.value
          })
          if (!incoming.length) return
          const lifeStore = useLifeStore()
          let fresh = 0
          for (const notification of incoming) {
            if (messages.value.some((message) => message.id === `notification_${notification.id}`)) continue
            messages.value.push({
              id: `notification_${notification.id}`,
              role: 'assistant',
              content: notification.text,
              timestamp: new Date(notification.created_at || Date.now()),
              emotion: { ...lifeStore.emotion },
              mentalEnergy: lifeStore.mentalEnergy,
            })
            fresh += 1
          }
          if (!chatVisible.value && fresh) unread.value += fresh
          persistHistory()
          await fetch('/api/life/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sessionId.value, ids: incoming.map((item: any) => item.id) }) })
        } catch { }
      }, 4000)
    }

    ws.onopen = () => {
      isConnected.value = true
      reconnectDelay = 1000
      console.log('WebSocket connected')
    }

    ws.onclose = () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
      if (intentionalClose) return
      if (reconnectTimer) clearTimeout(reconnectTimer)
      // A fixed 3s retry hammers a Core that is down; back off to 30s.
      reconnectTimer = setTimeout(connect, reconnectDelay)
      reconnectDelay = Math.min(reconnectDelay * 2, 30000)
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

  function dispose() {
    if (notificationTimer) { clearInterval(notificationTimer); notificationTimer = null }
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
    if (ws) { intentionalClose = true; ws.onclose = null; ws.close(); ws = null }
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
    if (!chunk && !payload?.think_summary) return
    const current = requestId ? messages.value.find((message) => message.role === 'assistant' && message.requestId === requestId) : undefined
    if (!separate || (current && !current.content)) {
      const target = findOrCreateAssistant(requestId)
      if (target) {
        target.content += chunk
        if (payload?.emotion) target.emotion = payload.emotion
        if (payload?.mental_energy !== undefined) target.mentalEnergy = payload.mental_energy
        if (payload?.think_summary) target.thinkSummary = payload.think_summary
        flushL2DMarkers(target)
        if (target.content.includes('[[')) {
          target.content = target.content.replace(L2D_MARKER_STRIP_RE, '')
          const parsed = parseMedia(target.content)
          target.content = parsed.cleaned
          if (Object.keys(parsed.media).length) target.media = parsed.media
        }
      }
      return
    }
    const pushed: Message = {
      id: `msg_${++messageIdCounter}`,
      role: 'assistant',
      content: chunk,
      timestamp: new Date(),
      requestId,
      emotion: payload?.emotion,
      mentalEnergy: payload?.mental_energy,
      thinkSummary: payload?.think_summary,
    }
    messages.value.push(pushed)
    flushL2DMarkers(pushed)
    if (pushed.content.includes('[[')) {
      pushed.content = pushed.content.replace(L2D_MARKER_STRIP_RE, '')
      const parsed = parseMedia(pushed.content)
      pushed.content = parsed.cleaned
      if (Object.keys(parsed.media).length) pushed.media = parsed.media
    }
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
  }

  function handleError(data: any) {
    console.error('Chat error:', data.error)
    if (data.error) {
      const target = findOrCreateAssistant(data.request_id)
      if (target) {
        const line = `⚠ ${data.error}`
        target.content = target.content ? `${target.content}\n${line}` : line
      }
    }
    isTyping.value = false
  }

  async function uploadImage(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/images', { method: 'POST', body: form })
    if (!res.ok) throw new Error(`upload failed: HTTP ${res.status}`)
    const data = await res.json()
    if (!data.url) throw new Error('upload failed: no url')
    return data.url as string
  }

  async function uploadFile(file: File): Promise<{ name: string; url: string; mime?: string; size?: number }> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/files', { method: 'POST', body: form })
    if (!res.ok) throw new Error(`upload failed: HTTP ${res.status}`)
    const data = await res.json()
    if (!data.url) throw new Error('upload failed: no url')
    return { name: data.name || file.name, url: data.url as string, mime: data.mime, size: data.size }
  }

  async function sendMessage(content: string, images: string[] = [], files: Array<{ name: string; url: string; mime?: string; size?: number }> = []) {
    if (isTyping.value) return
    messages.value.push({
      id: `msg_${++messageIdCounter}`,
      role: 'user',
      content,
      timestamp: new Date(),
      images: images.length ? [...images] : undefined,
      files: files.length ? files.map((file) => ({ ...file })) : undefined,
    })
    persistHistory()

    isTyping.value = true
    const requestId = `req_${Date.now()}`

    messages.value.push({
      id: `msg_${++messageIdCounter}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      requestId,
    })

    const history = messages.value
      .filter((m) => !(m.role === 'assistant' && m.requestId === requestId && !m.content))
      .slice(-20)
      .filter((m) => m.content || m.images?.length || m.files?.length)
      .map((m) => {
        let text = m.content || ''
        if (m.images?.length) {
          const refs = m.images.map((u) => `[image: ${u}]`).join(' ')
          text = text ? `${text}\n${refs}` : refs
        }
        if (m.files?.length) {
          const refs = m.files.map((file) => `[file: ${file.name} ${file.url}]`).join(' ')
          text = text ? `${text}\n${refs}` : refs
        }
        return { role: m.role, content: text }
      })

    try {
      await sendViaSSE(requestId, content, history, files)
    } catch (e) {
      console.warn('SSE chat failed, falling back to WebSocket:', e)
      if (ws && ws.readyState === WebSocket.OPEN) {
        const idx = messages.value.findIndex((m) => m.requestId === requestId && !m.content)
        if (idx >= 0) messages.value.splice(idx, 1)
        appendChunk(requestId, i18n.global.t('chat.lifeUnavailable'))
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
    history: Array<{ role: string; content: string }>,
    attachments: Array<{ name: string; url: string; mime?: string; size?: number }> = []
  ): Promise<void> {
    const controller = new AbortController()
    activeSseController = controller
    const epoch = streamEpoch

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
        user_id: 'webui',
        persona,
        attachments: attachments.map((file) => ({ name: file.name, url: file.url, mime: file.mime, size: file.size })),
        history: [{ role: 'system', content: contextSummary.value }, ...history],
      }),
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const contentType = res.headers.get('content-type') || ''

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

    let sawDone = false
    try {
      await readSSE(
        res,
        ({ event: eventName, data }) => {
          if (epoch !== streamEpoch) return
          let payload: any = null
          try {
            payload = JSON.parse(data)
          } catch {
            return
          }
          if (eventName === 'chunk') {
            if (payload.error) {
              handleError({ request_id: requestId, error: payload.error })
              sawDone = true
              return
            }
            appendChunk(requestId, payload.chunk || '', false, payload)
            if (payload.task_id) currentTaskId.value = payload.task_id
            if (payload.done) sawDone = true
          } else if (eventName === 'done') {
            sawDone = true
          } else if (eventName === 'error') {
            handleError({ request_id: requestId, error: payload.error || payload })
            sawDone = true
          }
        },
      )
    } finally {
      if (activeSseController === controller) activeSseController = null
      isTyping.value = false
      persistHistory()
    }

    if (epoch !== streamEpoch) {
      return
    }

    if (!sawDone) {
      const target = findOrCreateAssistant(requestId)
      const marker = i18n.global.t('chat.interrupted')
      if (target && !target.content.endsWith(marker)) {
        target.content = target.content ? `${target.content}\n${marker}` : marker
      }
      persistHistory()
      isTyping.value = false
    }
    const settled = messages.value.find((m) => m.role === 'assistant' && m.requestId === requestId)
    if (settled?.media?.call) callMode.value = true
    if (settled?.media?.selfie) void generateSelfie(settled)
    void speakMessage(requestId)
  }

  function setVoiceEnabled(value: boolean) {
    voiceEnabled.value = value
    try { localStorage.setItem('0kay.voice', value ? '1' : '0') } catch { }
  }

  async function generateSelfie(message: Message) {
    const prompt = message.media?.selfie
    if (!prompt || message.selfieUrl) return
    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      message.selfieUrl = URL.createObjectURL(blob)
      persistHistory()
    } catch { }
  }

  const callMode = ref(false)
  function endCall() { callMode.value = false }

  async function speakMessage(requestId: string) {
    if (!voiceEnabled.value) return
    const message = messages.value.find((m) => m.role === 'assistant' && m.requestId === requestId)
    const text = (message?.content || '').trim()
    if (!text) return
    const speakTextOnly = () => window.dispatchEvent(new CustomEvent('live2d-speak', { detail: { text } }))
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 600) }),
      })
      if (!res.ok) { speakTextOnly(); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      // Live2DStage revokes on its next swap, but it is not always mounted;
      // without this every spoken line leaks one blob forever.
      if (lastTtsUrl && lastTtsUrl !== url) URL.revokeObjectURL(lastTtsUrl)
      lastTtsUrl = url
      window.dispatchEvent(new CustomEvent('live2d-speak', { detail: { url, text } }))
    } catch { speakTextOnly() }
  }

  function abortActiveSse() {
    if (activeSseController) {
      activeSseController.abort()
      activeSseController = null
    }
  }

  function markRead() { unread.value = 0 }

  function setChatVisible(visible: boolean) {
    chatVisible.value = visible
    if (visible) unread.value = 0
  }

  function clearMessages() {
    abortActiveSse()
    // Bump the epoch before clearing: the aborted stream still resolves, and
    // without this it recreates the bubble that was just deleted.
    streamEpoch++
    messages.value = []
    seenL2DMarkers.clear()
    lastUsage.value = null
    contextSummary.value = ''
    sessionId.value = `webui:${uid()}`
    localStorage.setItem(SESSION_KEY, sessionId.value)
    try { localStorage.removeItem(HISTORY_KEY) } catch { }
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
      messages.value = messages.value.slice(-6)
      pruneL2DMarkers()
      persistHistory()
    } finally { compacting.value = false }
  }

  return {
    messages,
    // Exposed so panels can read the recon graph for this conversation: the agent
    // keys its state by session id, and a different one reads an empty graph.
    sessionId,
    isConnected,
    isTyping,
    unread,
    chatVisible,
    currentTaskId,
    lastUsage,
    contextTokens,
    contextSummary,
    compacting,
    voiceEnabled,
    callMode,
    endCall,
    lastMessage,
    setVoiceEnabled,
    connect,
    sendMessage,
    uploadImage,
    uploadFile,
    clearMessages,
    compactContext,
    restoreHistory,
    markRead,
    setChatVisible,
  }
})
