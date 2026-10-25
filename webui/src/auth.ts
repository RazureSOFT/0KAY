import { ref } from 'vue'

export interface SessionState {
  authenticated: boolean
  method: string
  requires_auth: boolean
  core_id?: string
  lan_enabled?: boolean
}

export const AUTH_REQUIRED_EVENT = '0kay:auth-required'
export const PIN_REQUIRED_EVENT = '0kay:pin-required'

export const authRequired = ref(false)
export const authenticated = ref(false)
export const pinRequired = ref(false)
export const pinConfigured = ref(false)
export const pinEnabled = ref(true)
export const loginEnabled = ref(true)
export const pinPages = ref<string[]>([])
export const pinUnlocked = ref(false)
export const pinGuard = ref(false)
export const pinSetupRequired = ref(false)

let pinValue = ''

function normalize(path: string): string {
  const clean = (path || '/').split('?')[0].replace(/\/+$/, '')
  return clean || '/'
}

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
const loginInFlight = new Map<string, Promise<SessionState>>()

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

function canReplay(init?: RequestInit): boolean {
  return !(init?.body instanceof ReadableStream)
}

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
  return { ...(init || {}), headers }
}

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

export function requirePagePin(): void {
  pinGuard.value = true
  pinRequired.value = true
  window.dispatchEvent(new CustomEvent(PIN_REQUIRED_EVENT))
}

export function submitPin(pin: string): void {
  pinValue = pin.trim()
  pinUnlocked.value = true
  pinGuard.value = false
  pinRequired.value = false
  settlePin(true)
}

export function cancelPin(): void {
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
    pinSetupRequired.value = !data.configured && pinEnabled.value
  } catch { }
}

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

export async function submitLogin(token: string): Promise<SessionState> {
  const typed = token.trim()
  const existing = loginInFlight.get(typed)
  if (existing) return existing
  const doFetch = nativeFetch ?? window.fetch
  const promise = (async () => {
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
    if (pinConfigured.value && /^\d{6}$/.test(typed)) {
      pinValue = typed
      pinUnlocked.value = true
    }
    settleWaiters(true)
    return data as SessionState
  })()
  loginInFlight.set(typed, promise)
  try {
    return await promise
  } finally {
    loginInFlight.delete(typed)
  }
}

export function cancelLogin(): void {
  authRequired.value = false
  settleWaiters(false)
}

