import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemePatchItem } from '../theme'
import { pluginNameFromModule } from '../pluginStrings'

export interface UIPatchOp {
  patchId?: string
  target: 'nav' | 'router' | 'settings' | 'status' | 'theme' | string
  op: 'insert' | 'remove' | 'replace' | string
  anchor?: string
  position?: 'before' | 'after' | string
  id?: string
  plugin?: string
  item?: Record<string, any> | null
}

export type { ThemePatchItem }

export interface NavItem {
  id: string
  to?: string
  href?: string
  external?: boolean
  label?: string
  labelKey?: string
  icon?: string
  order?: number
  badge?: number | string | null
  badgeFrom?: string
}

export interface RouterPatchItem {
  id: string
  path: string
  name: string
  component?: string
  module?: string
  plugin?: string
  src?: string
  title?: string
  titleKey?: string
}

export interface StatusAxis {
  key: string
  label?: string
  labelKey?: string
  color?: string
  scale?: 'unit' | 'remap01'
}

export interface StatusSection {
  id: string
  title?: string
  titleKey?: string
  kind: string
  order?: number
  bind?: string
  countBind?: string
  totalBind?: string
  listBind?: string
  empty?: string
  emptyKey?: string
  axes?: StatusAxis[]
  endpoint?: string
  pollMs?: number
  value?: string
  valueKey?: string
}

export interface SettingsField {
  key: string
  type: 'bool' | 'number' | 'text' | 'select' | 'model' | 'models'
  label?: string
  labelKey?: string
  help?: string
  helpKey?: string
  options?: string[]
  default_value?: string
}

export interface SettingsTabItem {
  id: string
  icon?: string
  order?: number
  label?: string
  labelKey?: string
  description?: string
  descriptionKey?: string
  component?: string
  module?: string
  plugin?: string
  fields?: SettingsField[]
  loadApi?: string
  saveApi?: string
}

export interface ChatSlotItem {
  id: string
  region: 'stage' | 'chat' | string
  component?: string
  order?: number
  enabled?: boolean
  src?: string
  title?: string
  titleKey?: string
}

export interface BootstrapItem {
  id: string
  module?: string
  plugin?: string
}

export const BUILTIN_NAV: NavItem[] = [
  { id: 'plugins', to: '/plugins', labelKey: 'nav.plugins', icon: 'plugins', order: 30 },
  { id: 'console', to: '/console', labelKey: 'nav.console', icon: 'console', order: 90 },
  { id: 'settings', to: '/settings', labelKey: 'nav.settings', icon: 'settings', order: 100 },
]

export const BUILTIN_STATUS: StatusSection[] = [
  { id: 'connection', kind: 'connection', titleKey: 'status.connection', order: 90 },
]

export const BUILTIN_SETTINGS: SettingsTabItem[] = [
  { id: 'general', icon: 'globe', order: 10 },
  { id: 'provider', icon: 'cloud', order: 20, component: 'provider' },
  { id: 'security', icon: 'shield', order: 55, component: 'security' },
  { id: 'permissions', icon: 'lock', order: 60, component: 'permissions' },
  { id: 'connection', icon: 'link', order: 82, labelKey: 'settings.tabs.connection' },
  { id: 'mcp', icon: 'plug', order: 78 },
  { id: 'danger', icon: 'warn', order: 100 },
  { id: 'updates', icon: 'download', order: 105 },
  { id: 'about', icon: 'info', order: 110 },
]

export const BUILTIN_CHAT: ChatSlotItem[] = []

function insertSorted<T extends { id: string; order?: number }>(
  list: T[],
  item: T,
  anchor?: string,
  position?: string,
): T[] {
  const next = [...list]
  const order = typeof item.order === 'number' ? item.order : undefined

  if (anchor) {
    const idx = next.findIndex((n) => n.id === anchor)
    if (idx >= 0) {
      const at = position === 'before' ? idx : idx + 1
      next.splice(at, 0, item)
      return next
    }
  }
  if (order !== undefined) {
    const at = next.findIndex((n) => (n.order ?? 999) > order)
    if (at >= 0) {
      next.splice(at, 0, item)
      return next
    }
  }
  next.push(item)
  return next
}

function applyListOps<T extends { id: string; order?: number }>(
  base: T[],
  ops: UIPatchOp[],
  merge?: (existing: T, incoming: Partial<T> & { id: string }) => T,
): T[] {
  let list = base.map((n) => ({ ...n }))
  for (const op of ops) {
    if (op.op === 'insert' && op.item) {
      const item = { ...(op.item as any) } as T & { id: string }
      if (!item.id) continue
      const idx = list.findIndex((n) => n.id === item.id)
      if (idx >= 0) {
        list[idx] = merge
          ? merge(list[idx], item)
          : ({ ...list[idx], ...item, id: item.id } as T)
      } else {
        list = insertSorted(list, item, op.anchor, op.position)
      }
    } else if (op.op === 'remove' && op.id) {
      list = list.filter((n) => n.id !== op.id)
    } else if (op.op === 'replace' && op.id && op.item) {
      const item = { ...(op.item as any), id: op.id } as T & { id: string }
      const idx = list.findIndex((n) => n.id === op.id)
      if (idx >= 0) list[idx] = item
      else list = insertSorted(list, item, op.anchor, op.position)
    }
  }
  return list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export const PLUGIN_ASSET_PREFIX = '/api/plugins/'

// A plugin asset URL (module / stylesheet) must be a same-origin relative path
// under /api/plugins/. Anything else — an absolute https:// URL, a protocol-
// relative //host, or a data:/javascript: URI — would let an installed patch
// pull remote code straight into the app origin.
export function isPluginAssetURL(value: unknown): boolean {
  if (typeof value !== 'string' || value.length === 0) return false
  if (value.includes('://') || value.startsWith('//')) return false
  if (!value.startsWith(PLUGIN_ASSET_PREFIX)) return false
  return !/[\r\n]/.test(value)
}

// Page-facing URLs (iframe src, external nav href) may point anywhere the
// plugin likes, but never at a script-capable scheme.
export function isSafePageURL(value: unknown): boolean {
  if (typeof value !== 'string' || value.length === 0) return false
  if (/[\r\n]/.test(value)) return false
  const lower = value.trim().toLowerCase()
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) return false
  return true
}

const ASSET_FIELDS = new Set(['module', 'cssUrl'])
const PAGE_URL_FIELDS = new Set(['src', 'href'])

// sanitizePatchOps drops URL-bearing items that fail validation so no consumer
// (bootstrap imports, plugin module hosts, theme loader, iframe slots) ever
// sees an unvetted URL. It is the single chokepoint; callers stay naive.
export function sanitizePatchOps(ops: unknown): UIPatchOp[] {
  if (!Array.isArray(ops)) return []
  const out: UIPatchOp[] = []
  for (const raw of ops) {
    if (!raw || typeof raw !== 'object') continue
    const op = { ...(raw as UIPatchOp) }
    if (op.item && typeof op.item === 'object') {
      const item = { ...(op.item as Record<string, unknown>) }
      let dropped = false
      for (const field of Object.keys(item)) {
        if (ASSET_FIELDS.has(field) && item[field] !== undefined && item[field] !== null) {
          if (!isPluginAssetURL(item[field])) {
            console.warn(`[uiPatches] dropped op: item.${field} is not a /api/plugins/ asset URL`, op.patchId ?? op.target)
            dropped = true
            break
          }
        } else if (PAGE_URL_FIELDS.has(field) && item[field] !== undefined && item[field] !== null) {
          if (!isSafePageURL(item[field])) {
            console.warn(`[uiPatches] dropped op: item.${field} uses a forbidden scheme`, op.patchId ?? op.target)
            dropped = true
            break
          }
        }
      }
      if (dropped) continue
      op.item = item
    }
    out.push(op)
  }
  return out
}

export const useUIPatchesStore = defineStore('uiPatches', () => {
  const patches = ref<UIPatchOp[]>([])
  const loaded = ref(false)
  const error = ref('')
  let timer: ReturnType<typeof setInterval> | null = null

  async function fetchPatches() {
    try {
      const res = await fetch('/api/ui/patches')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      patches.value = sanitizePatchOps(data?.ops)
      error.value = ''
      loaded.value = true
    } catch (e: any) {
      error.value = e?.message || 'failed'
    }
  }

  function startPolling(ms = 15000) {
    fetchPatches()
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      if (document.hidden) return
      fetchPatches()
    }, ms)
  }

  function stopPolling() {
    if (timer) clearInterval(timer)
    timer = null
  }

  function opsFor(target: string): UIPatchOp[] {
    return patches.value.filter((p) => p.target === target)
  }

  const navItems = computed<NavItem[]>(() =>
    applyListOps(BUILTIN_NAV, opsFor('nav'), (ex, incoming) => ({ ...ex, ...incoming, id: incoming.id })),
  )

  const routerPatches = computed<RouterPatchItem[]>(() => {
    const out: RouterPatchItem[] = []
    for (const op of opsFor('router')) {
      if (op.op === 'insert' && op.item) {
        const it = op.item as RouterPatchItem
        if (it.path && !out.some((r) => r.path === it.path)) out.push(it)
      } else if (op.op === 'remove' && op.id) {
        const i = out.findIndex((r) => r.id === op.id || r.name === op.id)
        if (i >= 0) out.splice(i, 1)
      } else if (op.op === 'replace' && op.id && op.item) {
        const it = { ...(op.item as RouterPatchItem), id: op.id }
        const i = out.findIndex((r) => r.id === op.id)
        if (i >= 0) out[i] = it
        else if (it.path) out.push(it)
      }
    }
    return out
  })

  const statusSections = computed<StatusSection[]>(() =>
    applyListOps(BUILTIN_STATUS, opsFor('status'), (ex, incoming) => ({
      ...ex,
      ...incoming,
      id: incoming.id,
      axes: incoming.axes ?? (ex as StatusSection).axes,
    })),
  )

  const settingsTabs = computed<SettingsTabItem[]>(() =>
    applyListOps(BUILTIN_SETTINGS, opsFor('settings'), (ex, incoming) => ({
      ...ex,
      ...incoming,
      id: incoming.id,
      fields: incoming.fields ?? (ex as SettingsTabItem).fields,
    })),
  )

  const bootstrapItems = computed<BootstrapItem[]>(() => {
    const out: BootstrapItem[] = []
    for (const op of opsFor('bootstrap')) {
      if (op.op === 'insert' && op.item) {
        const it = op.item as BootstrapItem
        if (it.module && !out.some((b) => b.id === it.id)) out.push(it)
      } else if (op.op === 'remove' && op.id) {
        const i = out.findIndex((b) => b.id === op.id)
        if (i >= 0) out.splice(i, 1)
      }
    }
    return out
  })

  function settingsTab(id: string): SettingsTabItem | undefined {
    return settingsTabs.value.find((t) => t.id === id)
  }

  const themePatches = computed<ThemePatchItem[]>(() => applyListOps<ThemePatchItem>([], opsFor('theme')))

  const removedSettingsIds = computed(() =>
    patches.value
      .filter((p) => p.target === 'settings' && p.op === 'remove' && p.id)
      .map((p) => p.id!),
  )

  const chatSlots = computed<ChatSlotItem[]>(() =>
    applyListOps(BUILTIN_CHAT, opsFor('chat'), (ex, incoming) => ({
      ...ex,
      ...incoming,
      id: incoming.id,
    })).filter((s) => s.enabled !== false),
  )

  function chatRegion(region: string): ChatSlotItem[] {
    return chatSlots.value.filter((s) => s.region === region)
  }

  const patchFieldTabs = computed(() =>
    settingsTabs.value.filter((t) => t.fields && t.fields.length > 0 && !isBuiltinSettingsId(t.id)),
  )

  function isBuiltinSettingsId(id: string): boolean {
    return BUILTIN_SETTINGS.some((b) => b.id === id)
  }

  function hasSettingsTab(id: string): boolean {
    return settingsTabs.value.some((t) => t.id === id)
  }

  const pluginNames = computed<string[]>(() => {
    const names = new Set<string>()
    for (const op of patches.value) {
      if (op.plugin) names.add(op.plugin)
      const fromModule = pluginNameFromModule((op.item as { module?: unknown } | null)?.module)
      if (fromModule) names.add(fromModule)
    }
    return [...names].sort()
  })

  return {
    patches,
    loaded,
    error,
    pluginNames,
    navItems,
    routerPatches,
    statusSections,
    settingsTabs,
    settingsTab,
    removedSettingsIds,
    chatSlots,
    chatRegion,
    themePatches,
    bootstrapItems,
    patchFieldTabs,
    isBuiltinSettingsId,
    hasSettingsTab,
    fetchPatches,
    startPolling,
    stopPolling,
  }
})
