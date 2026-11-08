// @vitest-environment happy-dom
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { scalesAt, installTapTrigger } from './wobble'

describe('scalesAt', () => {
  it('starts at rest with the axes a quarter period apart', () => {
    // t=0: x is at the start of its sine (0), y is half a period in (also 0),
    // so both are neutral — the offset shows up as they move apart, not here.
    const { x, y } = scalesAt(0)
    expect(x).toBeCloseTo(1, 5)
    expect(y).toBeCloseTo(1, 5)
  })

  it('never exceeds the amplitude the effect declares', () => {
    for (let ms = 0; ms <= 500; ms += 5) {
      const { x, y } = scalesAt(ms)
      expect(x).toBeGreaterThanOrEqual(1 - 0.25 - 1e-9)
      expect(x).toBeLessThanOrEqual(1 + 0.25 + 1e-9)
      expect(y).toBeGreaterThanOrEqual(1 - 0.25 - 1e-9)
      expect(y).toBeLessThanOrEqual(1 + 0.25 + 1e-9)
    }
  })

  it('keeps the two axes out of phase, which is what makes it sway', () => {
    // A quarter period in, x is at its peak and y is at its trough: a uniform
    // pulse would have them equal at every moment.
    const quarter = scalesAt(125)
    expect(quarter.x).toBeCloseTo(1.25, 2)
    expect(quarter.y).toBeCloseTo(0.75, 2)
    const threeQuarter = scalesAt(375)
    expect(threeQuarter.x).toBeCloseTo(0.75, 2)
    expect(threeQuarter.y).toBeCloseTo(1.25, 2)
  })

  it('repeats every 500ms', () => {
    const a = scalesAt(37)
    const b = scalesAt(37 + 500)
    expect(a.x).toBeCloseTo(b.x, 6)
    expect(a.y).toBeCloseTo(b.y, 6)
  })
})

describe('installTapTrigger', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('fires only after the required number of taps', () => {
    const el = document.createElement('img')
    const fired = vi.fn()
    installTapTrigger(el, fired, 10, 1500)

    for (let i = 0; i < 9; i++) el.click()
    expect(fired).not.toHaveBeenCalled()
    el.click()
    expect(fired).toHaveBeenCalledTimes(1)
  })

  it('forgets a run that pauses too long', () => {
    const el = document.createElement('img')
    const fired = vi.fn()
    installTapTrigger(el, fired, 10, 1500)

    for (let i = 0; i < 9; i++) el.click()
    // Longer than the window: these nine taps are not part of the gesture.
    vi.advanceTimersByTime(1600)
    el.click()
    expect(fired).not.toHaveBeenCalled()
  })

  it('shows a countdown only in the last two taps', () => {
    const el = document.createElement('img')
    installTapTrigger(el, vi.fn(), 10, 1500)

    el.click()
    expect(el.dataset.secretHint).toBeUndefined()

    for (let i = 0; i < 7; i++) el.click()
    expect(el.dataset.secretHint).toBe('2')
    el.click()
    expect(el.dataset.secretHint).toBe('1')
  })

  it('clears the countdown after firing', () => {
    const el = document.createElement('img')
    const fired = vi.fn()
    installTapTrigger(el, fired, 10, 1500)
    for (let i = 0; i < 10; i++) el.click()
    expect(fired).toHaveBeenCalledTimes(1)
    expect(el.dataset.secretHint).toBeUndefined()
  })

  it('stops listening once disposed', () => {
    const el = document.createElement('img')
    const fired = vi.fn()
    const dispose = installTapTrigger(el, fired, 10, 1500)
    dispose()
    for (let i = 0; i < 12; i++) el.click()
    expect(fired).not.toHaveBeenCalled()
  })
})
