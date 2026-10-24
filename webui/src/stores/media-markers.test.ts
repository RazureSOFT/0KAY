import { describe, expect, test } from 'vitest'
import { parseMedia } from './media-markers'

describe('parseMedia', () => {
  test('reads a voice tag and removes it from the text', () => {
    const { media, cleaned } = parseMedia('今天想你了[[voice]]')
    expect(media.voice).toBe(true)
    expect(cleaned).toBe('今天想你了')
  })

  test('reads a selfie description', () => {
    const { media, cleaned } = parseMedia('刚洗完头[[selfie:在咖啡馆，头发还在滴水]]')
    expect(media.selfie).toBe('在咖啡馆，头发还在滴水')
    expect(cleaned).toBe('刚洗完头')
  })

  test('reads a call tag', () => {
    const { media } = parseMedia('打电话说[[call]]')
    expect(media.call).toBe(true)
    expect(media.voice).toBeUndefined()
  })

  test('ignores an empty selfie description', () => {
    const { media } = parseMedia('看[[selfie:]]')
    expect(media.selfie).toBeUndefined()
  })

  test('the last selfie description wins', () => {
    const { media } = parseMedia('[[selfie:在图书馆]][[selfie:在便利店]]')
    expect(media.selfie).toBe('在便利店')
  })

  test('leaves text without tags alone', () => {
    const text = '普通的一句话 [[motion:Idle:0]]'
    const { media, cleaned } = parseMedia(text)
    expect(media).toEqual({})
    expect(cleaned).toBe(text)
  })

  test('a half-written tag is not a decision yet', () => {
    const { media, cleaned } = parseMedia('看我的自拍[[selfie:刚下')
    expect(media).toEqual({})
    expect(cleaned).toBe('看我的自拍[[selfie:刚下')
  })

  test('several tags in one reply', () => {
    const { media, cleaned } = parseMedia('喂？[[voice]][[call]] 拍一张[[selfie:窗边]]')
    expect(media).toEqual({ voice: true, call: true, selfie: '窗边' })
    expect(cleaned).toBe('喂？ 拍一张')
  })
})
