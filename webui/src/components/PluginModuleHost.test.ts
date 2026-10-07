import { describe, expect, it } from 'vitest'
import template from './PluginModuleHost.vue?raw'

/**
 * Regression guard for a bug that blanked every page in the app.
 *
 * PluginModuleHost renders one of five branches in a v-if / v-else-if chain. The
 * `moduleUrl` branch is a loading skeleton, but `moduleUrl` is set for every ESM
 * route whether or not the import has resolved — so placing it before the
 * `<component :is="comp">` branch means the skeleton always wins and no page ever
 * renders. The symptom was a shell with a working nav and a permanently empty
 * content area, with no console error at all, which makes it expensive to
 * diagnose from the browser.
 *
 * There is no DOM renderer in this project (no jsdom / @vue/test-utils, and the
 * suite runs in plain node by design), so the SFC source is asserted directly.
 * That is enough here: the invariant is purely about branch order, and reading
 * the template is exactly how the bug would have been caught before it shipped.
 */

/** The `<template>` block, comments stripped so prose cannot satisfy an assertion. */
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
    // A failed import must win over a stale component: after a Retry that fails,
    // showing the previous page would hide the error entirely.
    const body = templateBody()
    const errorBranch = body.indexOf('v-else-if="loadError || renderError"')
    const componentBranch = body.indexOf(':is="comp"')
    expect(errorBranch, 'the error branch is missing').toBeGreaterThan(-1)
    expect(errorBranch).toBeLessThan(componentBranch)
  })

  it('keeps the loading state keyed on pending, not merely on a known module url', () => {
    // `loading` must require `pending`; keying it on moduleUrl alone reintroduces
    // the same always-a-skeleton behaviour through the back door.
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
