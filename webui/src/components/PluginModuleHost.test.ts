import { describe, expect, it } from 'vitest'
import template from './PluginModuleHost.vue?raw'

function templateBody(): string {
  const start = template.indexOf('<template>')
  const end = template.lastIndexOf('</template>')
  expect(start, 'PluginModuleHost.vue has no <template> block').toBeGreaterThan(-1)
  return template
    .slice(start, end)
    .replace(/<!--[\s\S]*?-->/g, '')
}

describe('PluginModuleHost branch order', () => {
  it('renders the loaded component before the moduleUrl loading fallback', () => {
    const body = templateBody()
    const componentBranch = body.indexOf(':is="comp"')
    const moduleUrlFallback = body.indexOf('v-else-if="moduleUrl"')
    expect(componentBranch, 'the <component :is="comp"> branch is missing').toBeGreaterThan(-1)
    expect(moduleUrlFallback, 'the moduleUrl fallback branch is missing').toBeGreaterThan(-1)
    expect(
      componentBranch,
      'the component branch must come before the v-else-if="moduleUrl" skeleton, ' +
        'otherwise every ESM route renders as a permanent loading bar',
    ).toBeLessThan(moduleUrlFallback)
  })

  it('renders the error branch before the component branch', () => {
    const body = templateBody()
    const errorBranch = body.indexOf('v-else-if="loadError || renderError"')
    const componentBranch = body.indexOf(':is="comp"')
    expect(errorBranch, 'the error branch is missing').toBeGreaterThan(-1)
    expect(errorBranch).toBeLessThan(componentBranch)
  })

  it('keeps the loading state keyed on pending, not merely on a known module url', () => {
    const script = template.slice(0, template.indexOf('<template>'))
    const loading = /const loading = computed\(([\s\S]*?)\)\n/.exec(script)
    expect(loading, 'could not find the `loading` computed').not.toBeNull()
    expect(loading![1]).toContain('pending')
  })

  it('offers a retry action in the failure branch', () => {
    const body = templateBody()
    expect(body).toContain('@click="retry"')
  })
})
