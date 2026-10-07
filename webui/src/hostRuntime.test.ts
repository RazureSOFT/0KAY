import { describe, expect, it } from 'vitest'
import hostRuntimeSource from './hostRuntime.ts?raw'
import bridgeSource from '../public/vendor/0kay-host-bridge.js?raw'
import pluginViteConfig from '../vite.plugin.config.ts?raw'

/**
 * hostRuntime and public/vendor/0kay-host-bridge.js must export the same names.
 *
 * The bridge is a hand-written destructuring of the runtime object, so nothing
 * in the type system connects the two. Adding an export to hostRuntime and
 * forgetting the bridge compiles cleanly, passes vue-tsc, and produces a plugin
 * page that imports `undefined` at runtime — which fails only when that specific
 * plugin is installed. These tests turn that into a build failure.
 *
 * Both sides are parsed as text rather than imported. Importing hostRuntime
 * would pull in i18n.ts, which reads localStorage at module scope and throws in
 * this environment (there is no jsdom here, by design — the app is browser-only
 * and the project deliberately carries no @types/node). A static comparison is
 * also the more honest check: it compares the declarations, not the runtime.
 */

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

function bridgeExports(): Set<string> {
  const match = /export const \{([\s\S]*?)\}\s*=\s*H/.exec(bridgeSource)
  if (!match) throw new Error('could not find the destructured export block in the host bridge')
  return new Set(
    match[1]
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
  )
}

/** Keys of the `const hostRuntime = { ... }` object literal, comments stripped. */
function runtimeExports(): Set<string> {
  const marker = 'const hostRuntime = {'
  const start = hostRuntimeSource.indexOf(marker)
  if (start === -1) throw new Error('could not find the hostRuntime object literal')
  // Start *after* the opening brace: slicing from the declaration would put the
  // first key in the same comma-separated chunk as `const hostRuntime = {`, and
  // that chunk is not a bare identifier, so the first export would be dropped.
  const body = hostRuntimeSource.slice(start + marker.length)
  const stripped = body.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  const end = stripped.indexOf('\n}')
  if (end === -1) throw new Error('could not find the end of the hostRuntime object literal')
  const names = new Set<string>()
  for (const entry of stripped.slice(0, end).split(',')) {
    const name = entry.trim()
    if (IDENTIFIER.test(name)) names.add(name)
  }
  return names
}

describe('host bridge', () => {
  it('finds a non-empty host runtime', () => {
    // Guards the parsers above: if the source shape changes, fail here rather
    // than reporting a spurious "everything is missing".
    expect(runtimeExports().size).toBeGreaterThan(20)
    expect(bridgeExports().size).toBeGreaterThan(20)
  })

  it('exports exactly the host runtime surface', () => {
    const bridge = bridgeExports()
    const runtime = runtimeExports()
    const missing = [...runtime].filter((name) => !bridge.has(name)).sort()
    const extra = [...bridge].filter((name) => !runtime.has(name)).sort()
    expect({ missing, extra }).toEqual({ missing: [], extra: [] })
  })

  it('does not re-export the default binding as a named one', () => {
    // `export default H` covers the default; a named `default` would shadow it.
    expect(bridgeExports().has('default')).toBe(false)
  })
})

describe('shared component registration', () => {
  // A component missing from SHARED_PATHS is still bundled into every plugin
  // page, producing a second instance of stateful UI inside the host document.
  it('lists every stateful shared component in SHARED_PATHS', () => {
    for (const component of ['ModalShell.vue', 'ConfirmDialog.vue', 'PluginModuleHost.vue']) {
      expect(pluginViteConfig, `${component} must be in SHARED_PATHS`).toContain(component)
    }
  })

  it('exports the shared components through the runtime and the bridge', () => {
    for (const name of ['ModalShell', 'NavIcon', 'PluginModuleHost']) {
      expect(runtimeExports().has(name), `${name} missing from hostRuntime`).toBe(true)
      expect(bridgeExports().has(name), `${name} missing from the host bridge`).toBe(true)
    }
  })
})
