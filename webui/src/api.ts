export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function readApiResponse<T = unknown>(res: Response): Promise<T | null> {
  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new ApiError(text.trim().slice(0, 200) || `HTTP ${res.status}`, res.status)
    }
  }
  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error
    throw new ApiError(message || `HTTP ${res.status}`, res.status)
  }
  return data as T | null
}

export async function apiGet<T = unknown>(path: string): Promise<T | null> {
  return readApiResponse<T>(await fetch(path))
}

export async function apiSend<T = unknown>(path: string, method: string, body?: unknown): Promise<T | null> {
  return readApiResponse<T>(await fetch(path, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }))
}

export const apiPost = <T = unknown>(path: string, body?: unknown) => apiSend<T>(path, 'POST', body)
export const apiPut = <T = unknown>(path: string, body?: unknown) => apiSend<T>(path, 'PUT', body)
export const apiPatch = <T = unknown>(path: string, body?: unknown) => apiSend<T>(path, 'PATCH', body)
export const apiDelete = <T = unknown>(path: string) => apiSend<T>(path, 'DELETE')

export interface SSEvent {
  event: string
  data: string
  id?: string
}

export class SSEError extends Error {
  constructor(message: string, readonly status = 0) {
    super(message)
    this.name = 'SSEError'
  }
}

export async function streamSSE(
  path: string,
  onEvent: (event: SSEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(path, { headers: { Accept: 'text/event-stream' }, signal })
  return readSSE(res, onEvent, signal)
}

export async function readSSE(
  res: Response,
  onEvent: (event: SSEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!res.ok || !res.body) {
    throw new SSEError(`HTTP ${res.status}`, res.status)
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const dispatch = (frame: string) => {
    if (!frame || frame.startsWith(':')) return
    let event = 'message'
    let id: string | undefined
    const data: string[] = []
    for (const line of frame.split('\n')) {
      if (!line || line.startsWith(':')) continue
      const colon = line.indexOf(':')
      const field = colon === -1 ? line : line.slice(0, colon)
      let value = colon === -1 ? '' : line.slice(colon + 1)
      if (value.startsWith(' ')) value = value.slice(1)
      if (field === 'event') event = value
      else if (field === 'data') data.push(value)
      else if (field === 'id') id = value
    }
    if (!data.length && event === 'message') return
    onEvent({ event, data: data.join('\n'), id })
  }

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let index: number
      while ((index = buffer.search(/\r?\n\r?\n/)) !== -1) {
        const match = /\r?\n\r?\n/.exec(buffer.slice(index))!
        dispatch(buffer.slice(0, index))
        buffer = buffer.slice(index + match[0].length)
      }
    }
    if (buffer.trim()) dispatch(buffer)
  } catch (err) {
    if (signal?.aborted) return
    throw err instanceof SSEError ? err : new SSEError(String(err))
  } finally {
    reader.cancel().catch(() => {})
  }
}
