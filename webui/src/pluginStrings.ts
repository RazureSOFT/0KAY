/**
 * Plugin string resources.
 *
 * A plugin ships its UI copy as Android-style resources next to its ESM bundle
 * (under CORE_DATA_DIR/plugin-ui/<name>/strings, one `values` directory per
 * locale); Core serves them at GET /api/plugins/<name>/strings. This module
 * fetches them and works out how to merge them into vue-i18n under a namespace
 * equal to the plugin name, so a plugin's own UI addresses its copy as
 * `t('<plugin>.<key>')`.
 *
 * The merge shape is computed by a pure function so it can be tested without a
 * browser or a live Core.
 */

export interface PluginStringsResponse {
  /** Locale a bare `values` directory provides. */
  default?: string
  /** locale -> flat `key -> value` map. */
  locales?: Record<string, Record<string, string>>
}

/** locale -> namespace (plugin name) -> messages. */
export type LocaleBundles = Record<string, Record<string, Record<string, unknown>>>

/**
 * Extract the plugin name from a plugin asset URL.
 *
 * `/api/plugins/skillsguishow/ui/index.js?v=4` -> `skillsguishow`.
 *
 * This is the authoritative "which plugin owns this UI" signal: the URL is the
 * path Core actually serves the bundle from, whereas a patch file's `plugin`
 * field is author-supplied and has been left empty in practice (skillsguishow
 * shipped with `"plugin": ""`), which silently cost that plugin all of its
 * strings. Deriving from both keeps a mislabelled patch working.
 */
export function pluginNameFromModule(url: unknown): string {
  if (typeof url !== 'string') return ''
  const match = /^\/api\/plugins\/([^/]+)\/ui\//.exec(url)
  return match ? decodeURIComponent(match[1]) : ''
}

/** Map each locale code coming from a plugin onto the code the app runs with. */
export function normalizeLocale(code: string): string {
  const trimmed = code.trim()
  if (!trimmed) return ''
  // Android resource qualifiers write a region with an `r` prefix (zh-rTW);
  // BCP-47 does not (zh-TW). Strip it so both spellings land on the same code —
  // without this, `zh-rTW` lowercases to `zh-rtw` and matches nothing.
  const lower = trimmed.toLowerCase().replace(/^([a-z]{2,3})-r([a-z]{2})$/, '$1-$2')
  if (lower === 'zh-hant' || lower === 'zh-tw' || lower === 'zh-hk' || lower === 'zh-mo') return 'zh-Hant'
  if (lower === 'zh-hans' || lower === 'zh-cn' || lower === 'zh-sg' || lower === 'zh') return 'zh'
  if (lower.startsWith('ja')) return 'ja'
  if (lower.startsWith('en')) return 'en'
  // Unknown locales are passed through so a plugin can ship one before the app
  // itself supports it — vue-i18n simply will not select it.
  return trimmed
}

/**
 * Turn per-plugin responses into `locale -> namespace -> messages`.
 *
 * A plugin with no strings (null response) contributes nothing; a plugin whose
 * bundle is empty is skipped rather than registering an empty namespace. Later
 * plugins do not overwrite earlier ones for the same namespace, because a
 * namespace collision means two plugins claim the same name — the first wins and
 * the situation is visible as a missing string rather than silent corruption.
 */
/**
 * Set `a.b.c = value` as nested objects, so vue-i18n's path traversal finds it.
 *
 * A strings.xml key is flat and dotted (`memory.title`). Placing it verbatim in
 * the namespace object produces `{ life: { 'memory.title': … } }` — a *literal*
 * dotted key — and `t('life.memory.title')` then walks `life` -> `memory` ->
 * `title` and finds nothing, rendering the key path in the UI. The keys have to
 * be split into nested objects to be reachable.
 */
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
      // Keys are relative to the plugin's namespace, which is the plugin name.
      // A key that already repeats it (`life.memory.title` inside the life
      // namespace) would otherwise be doubled, so the redundant prefix is
      // dropped and both spellings resolve to the same string.
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

/**
 * Fetch one plugin's strings. Returns null — never throws — when the plugin
 * ships none (404) or the request fails: a plugin without translations is an
 * ordinary state, and it must not stop the app from booting or break the other
 * plugins' strings.
 */
export async function fetchPluginStrings(
  name: string,
  doFetch: typeof fetch = fetch,
): Promise<PluginStringsResponse | null> {
  try {
    const res = await doFetch(`/api/plugins/${encodeURIComponent(name)}/strings`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const data = (await res.json()) as PluginStringsResponse
    if (!data || typeof data !== 'object' || !data.locales) return null
    return data
  } catch {
    return null
  }
}
