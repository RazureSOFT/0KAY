import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressIndicator from './ProgressIndicator.vue'

/**
 * The wavy shape is gated on progress, not constant.
 *
 * androidx (`WavyProgressIndicatorDefaults.indicatorAmplitude`, v14_1_0) returns 0 for
 * `progress <= 0.1` and for `progress >= 0.95`, 1 in between, with the comment "Sets the
 * amplitude to the max on 10%, and back to zero on 95% of the progress". The wave is
 * therefore absent at the start and absent again at the end — the wavy-to-flat change.
 *
 * The first version of this component waved for the whole run, which made a finished bar
 * look like it was still moving. These tests pin the three regions and the flattening.
 */

const wavePath = (wrapper: ReturnType<typeof mount>) =>
  wrapper.find('.md-progress__wave-bar').attributes('d') || ''

describe('ProgressIndicator wavy amplitude', () => {
  it('is flat below 10% progress', () => {
    const wrapper = mount(ProgressIndicator, { props: { value: 5, shape: 'wavy' } })
    expect(wrapper.classes()).toContain('is-flattened')
  })

  it('is a wave between 10% and 95%', () => {
    const wrapper = mount(ProgressIndicator, { props: { value: 50, shape: 'wavy' } })
    expect(wrapper.classes()).not.toContain('is-flattened')
  })

  it('flattens again at 95% and above', () => {
    for (const value of [95, 99, 100]) {
      const wrapper = mount(ProgressIndicator, { props: { value, shape: 'wavy' } })
      expect(wrapper.classes(), `at ${value}%`).toContain('is-flattened')
    }
  })

  it('draws a wavy path mid-run and a straight one at the end', () => {
    // The path is sampled from a sine; flat means every y is the same, so the `d`
    // attribute contains only one distinct y coordinate.
    const mid = wavePath(mount(ProgressIndicator, { props: { value: 50, shape: 'wavy' } }))
    const end = wavePath(mount(ProgressIndicator, { props: { value: 100, shape: 'wavy' } }))
    const ys = (d: string) => new Set([...d.matchAll(/[ML]([\d.]+),([\d.]+)/g)].map((m) => m[2]))
    expect(ys(mid).size, 'mid-run must vary in y').toBeGreaterThan(1)
    expect(ys(end).size, 'at the end it must be one straight line').toBe(1)
  })

  it('leaves the flat variant unaffected', () => {
    // The gate belongs to the wavy shape only.
    const wrapper = mount(ProgressIndicator, { props: { value: 100, shape: 'flat' } })
    expect(wrapper.find('.md-progress__wave').exists()).toBe(false)
    expect(wrapper.find('.md-progress__bar').exists()).toBe(true)
  })
})
