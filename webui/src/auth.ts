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
export const PIN_REQUIRED_EVENT = '0kay:pin-required'

/** True while the login overlay should be visible. */
export const authRequired = ref(false)
/** True once a credential has been accepted for this tab. */
export const authenticated = ref(false)
/** True while the PIN prompt should be visible (sensitive action). */
export const pinRequired = ref(false)
/** True once Core reports that a PIN is configured. */
export const pinConfigured = ref(false)
/** Master switch: false disables every PIN prompt (the PIN itself is kept). */
export const pinEnabled = ref(true)
/** Master switch: false lets any caller reach the API without a token. */
export const loginEnabled = ref(true)
/** Routes that ask for the PIN when entered. Empty = sensitive actions only. */
export const pinPages = ref<string[]>([])
/** True once this tab holds a PIN Core has accepted. */
export const pinUnlocked = ref(false)
/** True when the current prompt was opened by a page guard (not cancellable). */
export const pinGuard = ref(false)
/** True when Core requires the owner to choose a PIN (old install upgrading). */
export const pinSetupRequired = ref(false)

/** PIN kept in memory for this tab and sent as X-0kay-Pin on API requests. */
let pinValue = ''
/** Route the UI is on, sent as X-0kay-Page so Core can honour the scope. */
let currentPage = '/'

export function setCurrentPage(path: string): void {
  currentPage = path || '/'
}

function normalize(path: string): string {
  const clean = (path || '/').split('?')[0].replace(/\/+$/, '')
  return clean || '/'
}

/** Whether entering `path` should challenge for the PIN. */
export function pageRequiresPin(path: string): boolean {
  if (!pinConfigured.value || !pinEnabled.value) return false
  if (!pinPages.value.length) return false
  const target = normalize(path)
  return pinPages.value.some((p) => {
    const entry = normalize(p)
    return entry === target || target.startsWith(entry + '/')
  })
}

export interface SecurityState {
  configured: boolean
  enabled: boolean
  login_enabled: boolean
  pages: string[]
}

type PinWaiter = { resolve: () => void; reject: (reason: Error) => void }
const pinWaiters: PinWaiter[] = []

function settlePin(ok: boolean): void {
  const pending = pinWaiters.splice(0, pinWaiters.length)
  for (const waiter of pending) {
    if (ok) waiter.resolve()
    else waiter.reject(new Error('PIN entry cancelled'))
  }
}

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

/** Inject the in-memory PIN (and the current route) on our own API requests. */
function withApiHeaders(input: RequestInfo | URL, init?: RequestInit): RequestInit | undefined {
  const url = apiUrl(input)
  const isApi = url.startsWith('/api/') || (() => {
    try {
      const parsed = new URL(url, window.location.href)
      return parsed.origin === window.location.origin && parsed.pathname.startsWith('/api/')
    } catch { return false }
  })()
  if (!isApi) return init
  const headers = new Headers(init?.headers)
  if (pinValue && !headers.has('X-0kay-Pin')) headers.set('X-0kay-Pin', pinValue)
  // Tells Core which page the call came from so a scoped PIN can skip routes
  // the owner left unprotected.
  if (!headers.has('X-0kay-Page')) headers.set('X-0kay-Page', currentPage)
  return { ...(init || {}), headers }
}

/** `fetch` replacement: park 401s until the user has signed in. */
async function gatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const doFetch = nativeFetch ?? window.fetch
  const res = await doFetch(input, withApiHeaders(input, init))
  if (!canReplay(init)) return res
  if (res.status === 401 && isGatedApi(input)) {
    authRequired.value = true
    window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT))
    try {
      await new Promise<void>((resolve, reject) => waiters.push({ resolve, reject }))
    } catch {
      return res
    }
    return doFetch(input, withApiHeaders(input, init))
  }
  if (res.status === 403 && isGatedApi(input)) {
    const data: { code?: string } | null = await res.clone().json().catch(() => null)
    if (data?.code === 'pin_required') {
      pinRequired.value = true
      window.dispatchEvent(new CustomEvent(PIN_REQUIRED_EVENT))
      try {
        await new Promise<void>((resolve, reject) => pinWaiters.push({ resolve, reject }))
      } catch {
        return res
      }
      return doFetch(input, withApiHeaders(input, init))
    }
  }
  return res
}

/** Open the PIN prompt for a guarded page. It has no parked request behind it. */
export function requirePagePin(): void {
  pinGuard.value = true
  pinRequired.value = true
  window.dispatchEvent(new CustomEvent(PIN_REQUIRED_EVENT))
}

/** Accept a PIN entered for a sensitive action and replay the parked request. */
export function submitPin(pin: string): void {
  pinValue = pin.trim()
  pinUnlocked.value = true
  pinGuard.value = false
  pinRequired.value = false
  settlePin(true)
}

/** Dismiss the PIN prompt; parked requests fall back to their original 403. */
export function cancelPin(): void {
  // A page guard has no "later": the page stays locked until the PIN is given.
  if (pinGuard.value) return
  pinRequired.value = false
  settlePin(false)
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
  await refreshPinStatus()
  const state = await getSession()
  if (!state) return state
  authenticated.value = state.authenticated
  if (!state.authenticated && state.requires_auth) {
    authRequired.value = true
    window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT))
  }
  return state
}

/** Read the PIN plus its switches, and force the setup screen when needed. */
export async function refreshPinStatus(): Promise<void> {
  const doFetch = nativeFetch ?? window.fetch
  try {
    const res = await doFetch('/api/security/pin', { headers: { Accept: 'application/json' } })
    if (!res.ok) return
    const data: Partial<SecurityState> = await res.json()
    pinConfigured.value = !!data.configured
    pinEnabled.value = data.enabled !== false
    loginEnabled.value = data.login_enabled !== false
    pinPages.value = Array.isArray(data.pages) ? data.pages : []
    // A switched-off PIN never nags for one.
    pinSetupRequired.value = !data.configured && pinEnabled.value
  } catch { /* older Core without PIN support */ }
}

/** Persist the security switches / page scope. Undefined fields are untouched. */
export async function saveSecurityPrefs(patch: {
  enabled?: boolean
  login_enabled?: boolean
  pages?: string[]
}): Promise<void> {
  const doFetch = nativeFetch ?? window.fetch
  const res = await doFetch('/api/security/pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  const data: any = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
  if (typeof data?.enabled === 'boolean') pinEnabled.value = data.enabled
  if (typeof data?.login_enabled === 'boolean') loginEnabled.value = data.login_enabled
  if (Array.isArray(data?.pages)) pinPages.value = data.pages
  pinConfigured.value = !!data?.configured
  pinSetupRequired.value = !data?.configured && pinEnabled.value
}

/** Delete the stored PIN entirely (the switches survive). */
export async function clearPin(): Promise<void> {
  const doFetch = nativeFetch ?? window.fetch
  const res = await doFetch('/api/security/pin', { method: 'DELETE' })
  const data: any = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
  pinValue = ''
  pinUnlocked.value = false
  pinConfigured.value = false
  pinSetupRequired.value = pinEnabled.value
}

/** Set the access PIN (used by the first-run / upgrade setup screen). */
export async function setPin(pin: string): Promise<void> {
  const doFetch = nativeFetch ?? window.fetch
  const res = await doFetch('/api/security/pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })
  const data: any = await res.json().catch(() => null)
  if (!res.ok || !data?.configured) throw new Error(data?.error || `HTTP ${res.status}`)
  pinValue = pin.trim()
  pinUnlocked.value = true
  pinConfigured.value = true
  pinSetupRequired.value = false
  authenticated.value = true
  authRequired.value = false
  settleWaiters(true)
}

/** Verify a PIN by opening a session with it (used before replaying a request). */
export async function verifyPin(pin: string): Promise<boolean> {
  const doFetch = nativeFetch ?? window.fetch
  try {
    const res = await doFetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (!res.ok) return false
    const data: any = await res.json().catch(() => null)
    if (data?.authenticated) {
      authenticated.value = true
      authRequired.value = false
      pinUnlocked.value = true
      return true
    }
    return false
  } catch {
    return false
  }
}

/** POST a token (paired-device or API token) and mint the session cookie. */
export async function submitLogin(token: string): Promise<SessionState> {
  if (loginInFlight) return loginInFlight
  const doFetch = nativeFetch ?? window.fetch
  loginInFlight = (async () => {
    const typed = token.trim()
    const res = await doFetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: typed }),
    })
    const data: any = await res.json().catch(() => null)
    if (!res.ok || !data?.authenticated) {
      throw new Error(data?.error || `HTTP ${res.status}`)
    }
    authenticated.value = true
    authRequired.value = false
    // Core accepts the PIN in the token field; when that is what was typed the
    // tab is already verified, so keep it for the in-memory header and skip the
    // per-page / sensitive-action prompt.
    if (pinConfigured.value && /^\d{6}$/.test(typed)) {
      pinValue = typed
      pinUnlocked.value = true
    }
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
  pinValue = ''
  pinUnlocked.value = false
  pinGuard.value = false
  authenticated.value = false
  authRequired.value = true
  window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT))
}
