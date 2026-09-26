import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UIPatchOp {
  patchId?: string
  target: 'nav' | 'router' | 'settings' | 'status' | string
  op: 'insert' | 'remove' | 'replace' | string
  anchor?: string
  position?: 'before' | 'after' | string
  id?: string
  item?: Record<string, any> | null
}

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
  /** Dotted path into life store, e.g. "life.onlineAgents" */
  badgeFrom?: string
}

export interface RouterPatchItem {
  id: string
  path: string
  name: string
  component?: string
  /** ESM entry served by Core, e.g. /api/plugins/{name}/ui/index.js */
  module?: string
  /** Owning plugin name (optional; useful for module URL building). */
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
  /** unit: 0..1 · remap01: (v+1)/2 for valence-style -1..1 */
  scale?: 'unit' | 'remap01'
}

/**
 * StatusPanel section — fully declarative.
 * kinds: mood | bar | bars | count | list | tasks | memory | connection | kv
 */
export interface StatusSection {
  id: string
  title?: string
  titleKey?: string
  kind: string
  order?: number
  /** bar: life path for percent */
  bind?: string
  /** count primary path */
  countBind?: string
  /** count secondary/total path */
  totalBind?: string
  /** list/tasks array path */
  listBind?: string
  empty?: string
  emptyKey?: string
  axes?: StatusAxis[]
  /** memory: GET endpoint */
  endpoint?: string
  pollMs?: number
  /** kv literal */
  value?: string
  valueKey?: string
}

export interface SettingsField {
  key: string
  type: 'bool' | 'number' | 'text' | 'select'
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
  /** Map to an existing builtin pane template */
  component?: string
  /** Plugin ESM entry served by Core, rendered as the tab body (native pane). */
  module?: string
  /** Owning plugin name (optional; used for module attribution). */
  plugin?: string
  fields?: SettingsField[]
  loadApi?: string
  saveApi?: string
}

/** ChatPage slot — region + builtin component (patch like editing one line). */
export interface ChatSlotItem {
  id: string
  /** stage = left column (Live2D + status); chat = right conversation column */
  region: 'stage' | 'chat' | string
  /** live2d | status | chat | iframe | note */
  component?: string
  order?: number
  enabled?: boolean
  src?: string
  title?: string
  titleKey?: string
}

/** Startup module a plugin loads globally (API compatibility shims, etc). */
export interface BootstrapItem {
  id: string
  /** ESM entry served by Core, e.g. /api/plugins/compat/ui/index.js */
  module?: string
  plugin?: string
}

/** Built-in sidebar items. Chat/对话 is registered by life.patch; Agent by agent.patch. */
export const BUILTIN_NAV: NavItem[] = [
  { id: 'plugins', to: '/plugins', labelKey: 'nav.plugins', icon: 'plugins', order: 30 },
  { id: 'settings', to: '/settings', labelKey: 'nav.settings', icon: 'settings', order: 100 },
]

/**
 * Built-in StatusPanel anchors. LIFE widgets are NOT hardcoded here —
 * they arrive via life.patch (kind: mood/bar/bars/count/tasks/memory).
 * Only the platform connection strip remains as a stable anchor.
 */
export const BUILTIN_STATUS: StatusSection[] = [
  { id: 'connection', kind: 'connection', titleKey: 'status.connection', order: 90 },
]

/** Built-in settings tabs (shell only; plugins/patches replace ownership). */
export const BUILTIN_SETTINGS: SettingsTabItem[] = [
  { id: 'general', icon: 'globe', order: 10 },
  { id: 'provider', icon: 'cloud', order: 20, component: 'provider' },
  { id: 'persona', icon: 'person', order: 40, component: 'persona' },
  { id: 'permissions', icon: 'lock', order: 60, component: 'permissions' },
  { id: 'danger', icon: 'warn', order: 100 },
  { id: 'updates', icon: 'download', order: 105 },
  { id: 'about', icon: 'info', order: 110 },
]

/**
 * L.I.F.E owns every chat surface. Keeping this empty is intentional: when
 * Core disables the life plugin it filters life.patch, removing the dialogue,
 * stage, and memory/status sidebar together instead of leaving a stale shell.
 */
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
      patches.value = Array.isArray(data?.ops) ? data.ops : []
      error.value = ''
      loaded.value = true
    } catch (e: any) {
      error.value = e?.message || 'failed'
    }
  }

  function startPolling(ms = 15000) {
    fetchPatches()
    if (timer) clearInterval(timer)
    timer = setInterval(fetchPatches, ms)
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

  /** Full StatusPanel list: builtin anchors + patch sections. */
  const statusSections = computed<StatusSection[]>(() =>
    applyListOps(BUILTIN_STATUS, opsFor('status'), (ex, incoming) => ({
      ...ex,
      ...incoming,
      id: incoming.id,
      // keep axes when replace omits them
      axes: incoming.axes ?? (ex as StatusSection).axes,
    })),
  )

  /** Legacy alias for simple kv appends. */
  const statusItems = computed(() =>
    statusSections.value.filter((s) => s.kind === 'kv' || s.kind === 'count'),
  )

  const settingsTabs = computed<SettingsTabItem[]>(() =>
    applyListOps(BUILTIN_SETTINGS, opsFor('settings'), (ex, incoming) => ({
      ...ex,
      ...incoming,
      id: incoming.id,
      fields: incoming.fields ?? (ex as SettingsTabItem).fields,
    })),
  )

  /**
   * Bootstrap modules: patches with target "bootstrap" whose ESM entry the host
   * imports once at startup. Used by plugins that must patch global behaviour
   * (for example an API compatibility layer).
   */
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

  /** Settings ids removed by patches (may target plugin-only sections). */
  const removedSettingsIds = computed(() =>
    patches.value
      .filter((p) => p.target === 'settings' && p.op === 'remove' && p.id)
      .map((p) => p.id!),
  )

  /** ChatPage slots: builtin layout + chat patches. */
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

  /** Patch-only tabs that declare their own fields (not a builtin component pane). */
  const patchFieldTabs = computed(() =>
    settingsTabs.value.filter((t) => t.fields && t.fields.length > 0 && !isBuiltinSettingsId(t.id)),
  )

  function isBuiltinSettingsId(id: string): boolean {
    return BUILTIN_SETTINGS.some((b) => b.id === id)
  }

  /** Whether a builtin id still exists after removes/replaces. */
  function hasSettingsTab(id: string): boolean {
    return settingsTabs.value.some((t) => t.id === id)
  }

  return {
    patches,
    loaded,
    error,
    navItems,
    routerPatches,
    statusSections,
    statusItems,
    settingsTabs,
    settingsTab,
    removedSettingsIds,
    chatSlots,
    chatRegion,
    bootstrapItems,
    patchFieldTabs,
    isBuiltinSettingsId,
    hasSettingsTab,
    fetchPatches,
    startPolling,
    stopPolling,
  }
})
