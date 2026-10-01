import { beforeEach, describe, expect, it } from 'vitest'
import { pageRequiresPin, pinConfigured, pinEnabled, pinPages } from './auth'

describe('pageRequiresPin', () => {
  beforeEach(() => {
    pinConfigured.value = true
    pinEnabled.value = true
    pinPages.value = []
  })

  it('does not challenge when no page is scoped', () => {
    expect(pageRequiresPin('/settings')).toBe(false)
  })

  it('challenges scoped routes, including query strings and sub-paths', () => {
    pinPages.value = ['/settings']
    expect(pageRequiresPin('/settings')).toBe(true)
    expect(pageRequiresPin('/settings?tab=security')).toBe(true)
    expect(pageRequiresPin('/settings/advanced')).toBe(true)
    expect(pageRequiresPin('/usage')).toBe(false)
    expect(pageRequiresPin('/settings-x')).toBe(false)
  })

  it('matches the root route exactly', () => {
    pinPages.value = ['/']
    expect(pageRequiresPin('/')).toBe(true)
    expect(pageRequiresPin('/plugins')).toBe(false)
  })

  it('ignores trailing slashes on both sides', () => {
    pinPages.value = ['/poke/']
    expect(pageRequiresPin('/poke')).toBe(true)
    expect(pageRequiresPin('/poke/')).toBe(true)
  })

  it('never challenges while the PIN is switched off or unset', () => {
    pinPages.value = ['/settings']
    pinEnabled.value = false
    expect(pageRequiresPin('/settings')).toBe(false)
    pinEnabled.value = true
    pinConfigured.value = false
    expect(pageRequiresPin('/settings')).toBe(false)
  })
})
