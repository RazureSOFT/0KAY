import { describe, expect, it } from 'vitest'
import { parseLive2DDirectives } from './live2dControl'

describe('live2d directives', () => {
  it('pulls an expression out of the reply', () => {
    const { text, commands } = parseLive2DDirectives('好呀 [[expr:smile]] 我在这儿')
    expect(text).toBe('好呀 我在这儿')
    expect(commands).toEqual([{ kind: 'expression', name: 'smile' }])
  })

  it('accepts the long form and a motion index', () => {
    const { commands } = parseLive2DDirectives('[[expression:shy]] [[motion:tapBody:2]]')
    expect(commands).toEqual([
      { kind: 'expression', name: 'shy' },
      { kind: 'motion', group: 'tapBody', index: 2 },
    ])
  })

  it('leaves a reply with no directives untouched', () => {
    const raw = '嗯……你在想什么呢？'
    const { text, commands } = parseLive2DDirectives(raw)
    expect(text).toBe(raw)
    expect(commands).toEqual([])
  })

  it('does not leak a directive that was split across the text', () => {
    // The protocol only matches a complete [[...]]; half a directive is text.
    const { text, commands } = parseLive2DDirectives('她说 [[expr:smile')
    expect(commands).toEqual([])
    expect(text).toBe('她说 [[expr:smile')
  })
})
