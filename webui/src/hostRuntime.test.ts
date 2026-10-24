import { describe, expect, it } from 'vitest'
import hostRuntimeSource from './hostRuntime.ts?raw'
import bridgeSource from '../public/vendor/0kay-host-bridge.js?raw'
import pluginViteConfig from '../vite.plugin.config.ts?raw'

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

function runtimeExports(): Set<string> {
  const marker = 'const hostRuntime = {'
  const start = hostRuntimeSource.indexOf(marker)
  if (start === -1) throw new Error('could not find the hostRuntime object literal')
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
    expect(bridgeExports().has('default')).toBe(false)
  })
})

describe('shared component registration', () => {
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
