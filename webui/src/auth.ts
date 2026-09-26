import { ref } from 'vue'

/**
 * Session gate for the Core HTTP API.
 *
 * Core rejects unauthenticated non-loopback callers with 401 on every /api
 * route. Instead of teaching each caller about login, one fetch wrapper:
 *
 *  - `bootstrapSession()` runs once on boot and opens the login overlay when a
 *    credential is actually required (loopback / trusted-network callers never
 *    see it);
 *  - a 401 parks that request until the user signs in, then replays it once;
 *  - a replay that still fails 401 is returned untouched so `readApiResponse`
 *    raises a normal ApiError.
 *
 * The credential lands in an HttpOnly cookie, so EventSource / WebSocket —
 * which cannot send headers — authenticate on their next request too.
 */

export interface SessionState {
  authenticated: boolean
  method: string
  requires_auth: boolean
  core_id?: string
  lan_enabled?: boolean
}

export const AUTH_REQUIRED_EVENT = '0kay:auth-required'

/** True while the login overlay should be visible. */
export const authRequired = ref(false)
/** True once a credential has been accepted for this tab. */
export const authenticated = ref(false)

type Waiter = { resolve: () => void; reject: (reason: Error) => void }

const waiters: Waiter[] = []
let nativeFetch: typeof fetch | null = null
let installed = false
let loginInFlight: Promise<SessionState> | null = null

function settleWaiters(ok: boolean): void {
  const pending = waiters.splice(0, waiters.length)
  for (const waiter of pending) {
    if (ok) waiter.resolve()
    else waiter.reject(new Error('authentication cancelled'))
  }
}

function apiUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

/** Only our own JSON API is gated; asset/module requests are not. */
function isGatedApi(input: RequestInfo | URL): boolean {
  const url = apiUrl(input)
  if (url.startsWith('/api/')) return !url.startsWith('/api/auth/session')
  try {
    const parsed = new URL(url, window.location.href)
    if (parsed.origin !== window.location.origin) return false
    return parsed.pathname.startsWith('/api/') && !parsed.pathname.startsWith('/api/auth/session')
  } catch {
    return false
  }
}

/** A body can only be replayed if it is not a consumed stream. */
function canReplay(init?: RequestInit): boolean {
  return !(init?.body instanceof ReadableStream)
}

/** `fetch` replacement: park 401s until the user has signed in. */
async function gatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const doFetch = nativeFetch ?? window.fetch
  const res = await doFetch(input, init)
  if (res.status !== 401 || !isGatedApi(input) || !canReplay(init)) return res
  authRequired.value = true
  window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT))
  try {
    await new Promise<void>((resolve, reject) => waiters.push({ resolve, reject }))
  } catch {
    return res
  }
  return doFetch(input, init)
}

export function installAuthGate(): void {
  if (installed) return
  installed = true
  nativeFetch = window.fetch.bind(window)
  window.fetch = gatedFetch as typeof window.fetch
}

/** Read the current session. Never throws — a down Core reads as "unknown". */
export async function getSession(): Promise<SessionState | null> {
  const doFetch = nativeFetch ?? window.fetch
  try {
    const res = await doFetch('/api/auth/session', { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    return (await res.json()) as SessionState
  } catch {
    return null
  }
}

/**
 * Ask Core who we are. Opens the overlay only when the server says a
 * credential is required and we do not have one yet.
 */
export async function bootstrapSession(): Promise<SessionState | null> {
  const state = await getSession()
  if (!state) return state
  authenticated.value = state.authenticated
  if (!state.authenticated && state.requires_auth) {
    authRequired.value = true
    window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT))
  }
  return state
}

/** POST a token (paired-device or API token) and mint the session cookie. */
export async function submitLogin(token: string): Promise<SessionState> {
  if (loginInFlight) return loginInFlight
  const doFetch = nativeFetch ?? window.fetch
  loginInFlight = (async () => {
    const res = await doFetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.trim() }),
    })
    const data: any = await res.json().catch(() => null)
    if (!res.ok || !data?.authenticated) {
      throw new Error(data?.error || `HTTP ${res.status}`)
    }
    authenticated.value = true
    authRequired.value = false
    settleWaiters(true)
    return data as SessionState
  })()
  try {
    return await loginInFlight
  } finally {
    loginInFlight = null
  }
}

/** Dismiss the overlay; parked requests fall back to their original 401. */
export function cancelLogin(): void {
  authRequired.value = false
  settleWaiters(false)
}

/** Clear the HttpOnly cookie. */
export async function logout(): Promise<void> {
  const doFetch = nativeFetch ?? window.fetch
  try {
    await doFetch('/api/auth/session', { method: 'DELETE' })
  } catch { /* best effort */ }
  authenticated.value = false
  authRequired.value = true
  window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT))
}
