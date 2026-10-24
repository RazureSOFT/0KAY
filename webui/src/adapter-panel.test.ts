import source from '../../plugin-web/life/src/AdapterSettingsPage.vue?raw'
import { describe, expect, it } from 'vitest'
import { compileScript, parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import { ref } from 'vue'

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
  const host = {
    i18n: { global: { t: (key: string) => key } },
    useConfirm: () => ({ confirm: async () => true }),
    AppSelect: {},
  }
  const require = (name: string) => name === 'vue' ? vue : name === '@0kay/host' ? host : name === './kit' ? transport : {}
  new Function('require', 'module', 'exports', executable)(require, module, module.exports)
  return { state: module.exports.default.setup({}, { expose: () => {} }), calls }
}

describe('adapter settings API contract', () => {
  it('loads existing routes and saves them without erasing them', async () => {
    const { state, calls } = page()
    await state.load()
    expect(state.routes.value.map(({ _key, ...rest }: any) => rest)).toEqual([
      { pattern: 'qq_9', config_id: 'work' },
    ])
    expect(state.routes.value[0]._key).toBeTruthy()
    await state.saveRoutes()
    const sent = calls.find(([action]) => action === 'adapter_routes_set')?.[1].routes
    expect(sent).toEqual([{ pattern: 'qq_9', config_id: 'work' }])
    expect(sent[0]._key).toBeUndefined()
  })
  it('shows a running listener without clients as waiting', async () => {
    const { state } = page()
    await state.load()
    expect(state.stateOf(state.adapters.value[0]).tone).toBe('wait')
  })
})
