import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DiffStat from './DiffStat.vue'

/**
 * The file-change stat.
 *
 * Two things are being pinned here beyond the numbers themselves, because both were real
 * bugs in the first draft:
 *
 *  1. **A space between the counts in the text.** The pills are separated by `gap`, but
 *     `textContent` came out as `+12−31`, which is what gets copied. Vue's compiler drops
 *     whitespace-only nodes between elements, so the space has to live inside an
 *     interpolation.
 *  2. **Zero counts are omitted, not printed.** `+8 −0` reports a fact nobody asked for.
 */

describe('DiffStat', () => {
  it('renders additions and deletions with an accessible label', () => {
    const wrapper = mount(DiffStat, { props: { added: 12, removed: 31 } })
    expect(wrapper.text()).toContain('+12')
    expect(wrapper.text()).toContain('−31')
    expect(wrapper.attributes('aria-label')).toBe('新增 12 行，删除 31 行')
  })

  it('keeps a space between the counts in textContent', () => {
    // `+12−31` reads as one number. The visual gap is CSS; the text gap must be real.
    const wrapper = mount(DiffStat, { props: { added: 12, removed: 31 } })
    expect(wrapper.text()).toContain('+12 −31')
  })

  it('omits a zero count instead of printing it', () => {
    const added = mount(DiffStat, { props: { added: 128, removed: 0 } })
    expect(added.text()).toBe('+128')
    expect(added.text()).not.toContain('−0')

    const removedOnly = mount(DiffStat, { props: { added: 0, removed: 7 } })
    expect(removedOnly.text()).toBe('−7')
  })

  it('renders nothing when there is no change', () => {
    // A tool that only reads a file has no diff; an empty span would still take a slot.
    const wrapper = mount(DiffStat, { props: { added: 0, removed: 0 } })
    expect(wrapper.text()).toBe('')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('uses the minus sign, not a hyphen', () => {
    // U+2212 sits at the right height next to a `+`; a hyphen reads as a dash.
    const wrapper = mount(DiffStat, { props: { added: 1, removed: 2 } })
    expect(wrapper.text()).toContain('\u2212')
    expect(wrapper.text()).not.toContain('-')
  })

  it('shows the path in the block variant', () => {
    const wrapper = mount(DiffStat, {
      props: { added: 3, removed: 1, variant: 'block', path: 'src/md/Toolbar.vue' },
    })
    expect(wrapper.classes()).toContain('md-diffstat--block')
    expect(wrapper.text()).toContain('src/md/Toolbar.vue')
  })
})