import { describe, expect, it } from 'vitest'
import { resetIframeWarnings, warnIframeSlot } from './deprecations'

describe('warnIframeSlot', () => {
  it('warns once per slot', () => {
    resetIframeWarnings()
    const seen: string[] = []
    const sink = { warn: (message: string) => seen.push(message) }

    expect(warnIframeSlot('stage', sink)).toBe(true)
    expect(warnIframeSlot('stage', sink)).toBe(false)
    expect(seen).toHaveLength(1)
    expect(seen[0]).toContain('"stage"')
    expect(seen[0]).toContain('deprecated')
  })

  it('treats different slots as different warnings', () => {
    resetIframeWarnings()
    const seen: string[] = []
    const sink = { warn: (message: string) => seen.push(message) }
    warnIframeSlot('a', sink)
    warnIframeSlot('b', sink)
    expect(seen).toHaveLength(2)
  })

  it('says what to do instead, not just that something is wrong', () => {
    resetIframeWarnings()
    const seen: string[] = []
    warnIframeSlot('chat', { warn: (m: string) => seen.push(m) })
    expect(seen[0]).toContain('component: "module"')
  })

  it('ignores an empty slot id rather than warning about nothing', () => {
    resetIframeWarnings()
    const seen: string[] = []
    expect(warnIframeSlot('', { warn: (m: string) => seen.push(m) })).toBe(false)
    expect(seen).toHaveLength(0)
  })
})
