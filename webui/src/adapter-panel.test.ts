import source from '../../plugin-web/life/src/AdapterSettingsPage.vue?raw'
import { describe, expect, it } from 'vitest'
import { compileScript, parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import { ref } from 'vue'

// Compile the real page setup, replacing only its UI/transport dependencies.
// This catches response/ref shadowing that a mocked DTO-only test misses.
const { descriptor } = parse(source)
const compiled = compileScript(descriptor, { id: 'adapter-review-test' }).content
const executable = ts.transpileModule(compiled, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText

function page() {
  const calls: Array<[string, any]> = []
  const module = { exports: {} as any }
  const vue = { ref, computed: (fn: () => unknown) => ({ get value() { return fn() } }), onMounted: () => {}, defineComponent: (value: unknown) => value }
  const transport = {
    friendlyError: (error: Error) => error.message,
    readSection: async () => ({}),
    lifeAct: async (action: string, body: any) => {
      calls.push([action, body])
      if (action === 'adapter_routes_get') return { routes: [{ pattern: 'qq_9', config_id: 'work' }], default_config_id: 'default' }
      if (action === 'adapter_list') return { instances: [{ id: 'a', name: 'bot', enabled: true }], runtime: [{ id: 'a', running: true, connected: false }] }
      return {}
    },
  }
  const require = (name: string) => name === 'vue' ? vue : name === './kit' ? transport : name === './confirm' ? { useConfirm: () => ({ confirm: async () => true }) } : {}
  new Function('require', 'module', 'exports', executable)(require, module, module.exports)
  return { state: module.exports.default.setup({}, { expose: () => {} }), calls }
}

describe('adapter settings API contract', () => {
  it('loads existing routes and saves them without erasing them', async () => {
    const { state, calls } = page()
    await state.load()
    expect(state.routes.value).toEqual([{ pattern: 'qq_9', config_id: 'work' }])
    await state.saveRoutes()
    expect(calls.find(([action]) => action === 'adapter_routes_set')?.[1].routes).toEqual(state.routes.value)
  })
  it('shows a running listener without clients as waiting', async () => {
    const { state } = page()
    await state.load()
    expect(state.stateOf(state.adapters.value[0]).tone).toBe('wait')
  })
})
