/** Shared HTTP helpers. Every Core API call goes through here so response
 *  handling (errors, non-JSON bodies) stays consistent. */

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Parse a JSON response, turning non-JSON bodies (404/HTML) into readable errors.
 *
 *  The body shape is endpoint-specific and genuinely dynamic, so callers supply
 *  `T` (default `unknown`); this helper only guarantees parsed JSON or an
 *  `ApiError` — it does not validate the shape at runtime. */
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

/** One decoded Server-Sent Event. */
export interface SSEvent {
  /** The `event:` name, or "message" when the server omits it. */
  event: string
  /** Concatenated `data:` lines, newline-joined per the SSE spec. */
  data: string
  id?: string
}

/** Thrown when an SSE stream ends or fails, so callers can show it. */
export class SSEError extends Error {
  constructor(message: string, readonly status = 0) {
    super(message)
    this.name = 'SSEError'
  }
}

/**
 * Consume a `text/event-stream` response.
 *
 * This uses fetch + a reader rather than EventSource on purpose: EventSource
 * cannot send request headers, so it cannot carry the in-memory PIN or a bearer
 * token on a deployment that authenticates with one instead of the session
 * cookie. Going through fetch also means auth.ts's header injection applies.
 *
 * The parser follows the SSE grammar rather than assuming one `data:` line per
 * frame: fields accumulate until a blank line, `data:` lines are joined with
 * "\n", and comment lines (`:` heartbeats) are ignored. A parser that splits on
 * a single newline silently truncates any event whose payload contains one —
 * which is exactly what a log line or a JSON blob does.
 */
export async function streamSSE(
  path: string,
  onEvent: (event: SSEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(path, { headers: { Accept: 'text/event-stream' }, signal })
  return readSSE(res, onEvent, signal)
}

/**
 * Decode an SSE response the caller already has. Split out from streamSSE so a
 * POST-then-stream call (chat turns) reuses the same frame parser instead of
 * keeping a second, subtly different copy.
 */
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
    // A frame that is only a comment (": heartbeat") carries no event.
    if (!frame || frame.startsWith(':')) return
    let event = 'message'
    let id: string | undefined
    const data: string[] = []
    for (const line of frame.split('\n')) {
      if (!line || line.startsWith(':')) continue
      const colon = line.indexOf(':')
      const field = colon === -1 ? line : line.slice(0, colon)
      // A single leading space after the colon is part of the framing.
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
      // Frames are separated by a blank line; tolerate CRLF from proxies.
      let index: number
      while ((index = buffer.search(/\r?\n\r?\n/)) !== -1) {
        const match = /\r?\n\r?\n/.exec(buffer.slice(index))!
        dispatch(buffer.slice(0, index))
        buffer = buffer.slice(index + match[0].length)
      }
    }
    // A stream that closes without a trailing blank line still has a frame.
    if (buffer.trim()) dispatch(buffer)
  } catch (err) {
    if (signal?.aborted) return
    throw err instanceof SSEError ? err : new SSEError(String(err))
  } finally {
    reader.cancel().catch(() => {})
  }
}
