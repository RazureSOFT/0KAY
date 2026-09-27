/**
 * Declarative theme patches (patch target: "theme").
 *
 * A plugin replaces or layers over the host Material 3 Expressive palette
 * without shipping JavaScript: it contributes design tokens (`--md-*` maps)
 * and/or raw CSS, and the host renders both into <head> in patch order.
 *
 * Cascade rules the renderer guarantees:
 *   - one <style id="0kay-theme-patch-{id}"> per item, one <link> per cssUrl
 *   - elements are kept in patch order (`order` ascending) in <head>
 *   - light tokens compile to `:root { … }`
 *   - dark tokens compile to `:root:where([data-theme="dark"]) { … }`
 *     (same specificity as `:root`, so document order alone decides the winner
 *     across plugins and across schemes)
 */

/** Per-scheme token maps. Unset schemes inherit the host palette. */
export interface ThemeTokens {
  /** Applied while `html[data-theme]` is absent or anything but `dark`. */
  light?: Record<string, string>
  /** Applied while `html[data-theme="dark"]` (set by a darkmode plugin). */
  dark?: Record<string, string>
}

export interface ThemePatchItem {
  id: string
  plugin?: string
  order?: number
  /** Either a flat `{"--md-primary": "#6750A4"}` map (both schemes) or `{light, dark}`. */
  tokens?: Record<string, string> | ThemeTokens
  /** Raw CSS appended after the token declarations. */
  css?: string
  /** Stylesheet URL served by Core, e.g. `/api/plugins/{name}/ui/theme.css`. */
  cssUrl?: string
}

export const THEME_STYLE_PREFIX = '0kay-theme-patch-'
export const THEME_LINK_PREFIX = '0kay-theme-patch-css-'

/** Minimal DOM surface so the renderer is testable without jsdom. */
export interface ThemeDocument {
  createElement(tag: string): any
  head?: {
    appendChild(node: any): any
    readonly lastElementChild?: { id?: string } | null
  } | null
}

export interface ThemeNode {
  id?: string
  textContent?: string | null
  rel?: string
  href?: string
  remove?: () => void
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Custom property names we are willing to emit (`--name` only). */
function isCustomProperty(key: string): boolean {
  return /^--[A-Za-z0-9_-]+$/.test(key)
}

/** Token values that would break out of a declaration block are dropped. */
function isSafeValue(value: unknown): boolean {
  if (typeof value === 'number' && Number.isFinite(value)) return true
  if (typeof value !== 'string') return false
  return !/[;{}]/.test(value)
}

/** Split a patch item's `tokens` into `{light, dark}` declaration maps. */
export function resolveTokenSets(
  tokens: ThemePatchItem['tokens'],
): { light: Record<string, string>; dark: Record<string, string> } {
  const empty = { light: {}, dark: {} }
  if (!isPlainObject(tokens)) return empty
  const perScheme =
    isPlainObject((tokens as ThemeTokens).light) || isPlainObject((tokens as ThemeTokens).dark)
  if (!perScheme) {
    const flat = pickTokens(tokens)
    return { light: { ...flat }, dark: { ...flat } }
  }
  const scheme = tokens as ThemeTokens
  return { light: pickTokens(scheme.light), dark: pickTokens(scheme.dark) }
}

function pickTokens(map: Record<string, unknown> | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!isPlainObject(map)) return out
  for (const [key, value] of Object.entries(map)) {
    if (isCustomProperty(key) && isSafeValue(value)) out[key] = String(value)
  }
  return out
}

function declarationBlock(decls: Record<string, string>): string {
  const body = Object.entries(decls)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')
  return body ? `{\n${body}\n}` : ''
}

/** Compile one theme item into the CSS text its <style> element holds. */
export function buildThemeCSS(item: ThemePatchItem | null | undefined): string {
  if (!item) return ''
  const { light, dark } = resolveTokenSets(item.tokens)
  const parts: string[] = []
  const lightBlock = declarationBlock(light)
  if (lightBlock) parts.push(`:root ${lightBlock}`)
  const darkBlock = declarationBlock(dark)
  if (darkBlock) parts.push(`:root:where([data-theme="dark"]) ${darkBlock}`)
  const css = typeof item.css === 'string' ? item.css.trim() : ''
  if (css) parts.push(css)
  return parts.join('\n')
}

/** Stable `order`-ascending ordering (missing order sorts last). */
export function sortThemePatches(items: ThemePatchItem[]): ThemePatchItem[] {
  return items
    .filter((i) => i && typeof i.id === 'string' && i.id.length > 0)
    .slice()
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

function slug(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]/g, '-')
}

/** `<style>`/`<link>` nodes currently owned by this module, keyed by element id. */
const mounted = new Map<string, ThemeNode>()
let lastOrder: string[] = []

function defaultDocument(): ThemeDocument | undefined {
  if (typeof document === 'undefined') return undefined
  return document as unknown as ThemeDocument
}

/**
 * Render the active theme patches into <head>, pruning anything whose item was
 * removed. Safe to call on every patch refresh: unchanged items are left alone
 * and the DOM is only reordered when the effective order changed.
 */
export function applyThemePatches(items: ThemePatchItem[], doc?: ThemeDocument): void {
  const d = doc ?? defaultDocument()
  if (!d || !d.head) return

  const sorted = sortThemePatches(Array.isArray(items) ? items : [])
  const wanted: string[] = []

  for (const item of sorted) {
    const css = buildThemeCSS(item)
    if (css) {
      const id = THEME_STYLE_PREFIX + slug(item.id)
      let node = mounted.get(id)
      if (!node) {
        const created: ThemeNode = d.createElement('style')
        created.id = id
        mounted.set(id, created)
        d.head.appendChild(created)
        node = created
      }
      if (node.textContent !== css) node.textContent = css
      wanted.push(id)
    }
    if (typeof item.cssUrl === 'string' && item.cssUrl) {
      const id = THEME_LINK_PREFIX + slug(item.id)
      let node = mounted.get(id)
      if (!node) {
        const created: ThemeNode = d.createElement('link')
        created.id = id
        created.rel = 'stylesheet'
        created.href = item.cssUrl
        mounted.set(id, created)
        d.head.appendChild(created)
        node = created
      } else if (node.href !== item.cssUrl) {
        node.href = item.cssUrl
      }
      wanted.push(id)
    }
  }

  for (const [id, node] of Array.from(mounted.entries())) {
    if (wanted.includes(id)) continue
    node.remove?.()
    mounted.delete(id)
  }

  const changed =
    wanted.length !== lastOrder.length || wanted.some((id, i) => lastOrder[i] !== id)
  // Declarative patches outrank imperatively injected sheets: if some script
  // (the darkmode bootstrap, say) appended to <head> after us, move ours back
  // to the end so `order` keeps meaning what it says.
  const overtaken = isOvertaken(d, wanted)
  if (changed || overtaken) {
    for (const id of wanted) {
      const node = mounted.get(id)
      if (node) d.head.appendChild(node)
    }
    lastOrder = wanted
  }
}

function isOvertaken(d: ThemeDocument, wanted: string[]): boolean {
  if (!wanted.length) return false
  const head = d.head as any
  const last = head?.lastElementChild
  if (!last) return false
  return !wanted.includes(String(last.id ?? ''))
}

/** Drop every node this module created (used by tests / hot reload). */
export function resetThemePatches(): void {
  for (const node of Array.from(mounted.values())) node.remove?.()
  mounted.clear()
  lastOrder = []
}
