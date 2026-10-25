// Stable for the lifetime of one page load; changes on every reload/boot.
const SESSION_BOOT = Date.now().toString(36)

export interface PluginStringsResponse {
  default?: string
  locales?: Record<string, Record<string, string>>
}

export type LocaleBundles = Record<string, Record<string, Record<string, unknown>>>

export function pluginNameFromModule(url: unknown): string {
  if (typeof url !== 'string') return ''
  const match = /^\/api\/plugins\/([^/]+)\/ui\//.exec(url)
  return match ? decodeURIComponent(match[1]) : ''
}

export function normalizeLocale(code: string): string {
  const trimmed = code.trim()
  if (!trimmed) return ''
  const lower = trimmed.toLowerCase().replace(/^([a-z]{2,3})-r([a-z]{2})$/, '$1-$2')
  if (lower === 'zh-hant' || lower === 'zh-tw' || lower === 'zh-hk' || lower === 'zh-mo') return 'zh-Hant'
  if (lower === 'zh-hans' || lower === 'zh-cn' || lower === 'zh-sg' || lower === 'zh') return 'zh'
  if (lower.startsWith('ja')) return 'ja'
  if (lower.startsWith('en')) return 'en'
  return trimmed
}

function nestKey(target: Record<string, unknown>, key: string, value: string): void {
  const parts = key.split('.')
  let node = target
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const child = node[part]
    if (typeof child !== 'object' || child === null) node[part] = {}
    node = node[part] as Record<string, unknown>
  }
  node[parts[parts.length - 1]] = value
}

export function buildLocaleBundles(
  entries: Array<{ name: string; response: PluginStringsResponse | null }>,
): LocaleBundles {
  const out: LocaleBundles = {}
  for (const { name, response } of entries) {
    if (!name || !response?.locales) continue
    for (const [rawLocale, messages] of Object.entries(response.locales)) {
      if (!messages || typeof messages !== 'object') continue
      const prefix = `${name}.`
      const localised: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(messages)) {
        if (typeof value !== 'string') continue
        nestKey(localised, key.startsWith(prefix) ? key.slice(prefix.length) : key, value)
      }
      if (!Object.keys(localised).length) continue
      const locale = normalizeLocale(rawLocale)
      if (!locale) continue
      out[locale] ??= {}
      if (out[locale][name]) continue
      out[locale][name] = localised as Record<string, Record<string, string>>
    }
  }
  return out
}

export async function fetchPluginStrings(
  name: string,
  doFetch: typeof fetch = fetch,
): Promise<PluginStringsResponse | null> {
  try {
    // no-cache: the endpoint sends no Cache-Control, and heuristic caching
    // served a stale strings table after plugin updates (new keys missing
    // from the UI until a hard refresh).
    // Session-unique query: the endpoint revalidates via no-cache+ETag in
    // well-behaved browsers, but some embedded WebViews cache regardless of
    // validators. One fetch per session, so a boot token costs nothing and
    // guarantees a fresh table.
    const res = await doFetch(`/api/plugins/${encodeURIComponent(name)}/strings?boot=${SESSION_BOOT}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-cache',
    })
    if (!res.ok) return null
    const data = (await res.json()) as PluginStringsResponse
    if (!data || typeof data !== 'object' || !data.locales) return null
    return data
  } catch {
    return null
  }
}
