import { describe, expect, test } from 'vitest'
import { formatSpeed, tokenSpeed } from './token-speed'

const at = (ms: number) => ({ startedAt: 0, endedAt: ms })

describe('tokenSpeed', () => {
  test('a reported token count over the elapsed time is the rate', () => {
    // 200 tokens in 4s is 50 tok/s.
    const speed = tokenSpeed({ chars: 800, completionTokens: 200, ...at(4000) })
    expect(speed).toEqual({ perSecond: 50, tokens: 200, estimated: false })
  })

  test('a reported count is preferred over the character estimate', () => {
    // 800 chars would estimate ~267 tokens; the provider said 200, so 200 wins.
    const speed = tokenSpeed({ chars: 800, completionTokens: 200, ...at(4000) })
    expect(speed.tokens).toBe(200)
    expect(speed.estimated).toBe(false)
  })

  test('with nothing reported, the rate comes from characters and is flagged', () => {
    // 300 chars / 3 per token = 100 tokens over 2s = 50 tok/s.
    const speed = tokenSpeed({ chars: 300, ...at(2000) })
    expect(speed.estimated).toBe(true)
    expect(speed.tokens).toBe(100)
    expect(speed.perSecond).toBe(50)
  })

  test('zero elapsed time says nothing rather than dividing by zero', () => {
    expect(tokenSpeed({ chars: 300, ...at(0) }).perSecond).toBeNull()
  })

  test('a clock that went backwards is refused, not turned into a negative rate', () => {
    const speed = tokenSpeed({ chars: 300, completionTokens: 100, startedAt: 5000, endedAt: 1000 })
    expect(speed.perSecond).toBeNull()
    expect(speed.tokens).toBe(100)
  })

  test('no text and no reported count yet means no line', () => {
    const speed = tokenSpeed({ chars: 0, ...at(1000) })
    expect(speed).toEqual({ perSecond: null, tokens: null, estimated: false })
  })

  test('a reported zero is not used as a rate', () => {
    // 0 tokens in 2s is not "0 tok/s", it is "nothing to report".
    const speed = tokenSpeed({ chars: 0, completionTokens: 0, ...at(2000) })
    expect(speed.perSecond).toBeNull()
  })

  test('too little text to round to a single token is not reported as zero', () => {
    // 1 char / 3 per token rounds to 0 tokens, and "0 tok/s" would be a claim
    // the data does not support. Two characters do round to 1, so that case is
    // a real (if tiny) rate and is left to report itself.
    const speed = tokenSpeed({ chars: 1, ...at(4000) })
    expect(speed.perSecond).toBeNull()
    expect(speed.tokens).toBeNull()
  })

  test('the rate is rounded to one decimal', () => {
    const speed = tokenSpeed({ chars: 0, completionTokens: 100, ...at(3000) })
    expect(speed.perSecond).toBe(33.3)
  })
})

describe('formatSpeed', () => {
  test('a measured rate is stated plainly', () => {
    expect(formatSpeed({ perSecond: 50, tokens: 200, estimated: false })).toBe('50 tok/s · 200 tok')
  })

  test('an estimated rate is marked as one', () => {
    expect(formatSpeed({ perSecond: 50, tokens: 100, estimated: true })).toBe('~50 tok/s · ~100 tok')
  })

  test('nothing to report is an empty string, not "0 tok/s"', () => {
    expect(formatSpeed({ perSecond: null, tokens: null, estimated: false })).toBe('')
  })
})
