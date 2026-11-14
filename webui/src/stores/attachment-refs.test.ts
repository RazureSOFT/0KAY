import { describe, expect, test } from 'vitest'
import { nextIndex, parseRefs, refFor, refsForModel, resolveRefs } from './attachment-refs'

describe('parseRefs', () => {
  test('reads an image reference with its index and name', () => {
    const refs = parseRefs('看这张 @image#1:QQ_1794607548806.png 好吗')
    expect(refs).toHaveLength(1)
    expect(refs[0]).toMatchObject({ kind: 'image', index: 1, target: 'QQ_1794607548806.png' })
  })

  test('reads a file reference', () => {
    const refs = parseRefs('@file#2:report.pdf 里的数字对吗')
    expect(refs[0]).toMatchObject({ kind: 'file', index: 2, target: 'report.pdf' })
  })

  test('reads an on-disk path reference', () => {
    const refs = parseRefs('改一下 @//file/src/main.ts')
    expect(refs[0]).toMatchObject({ kind: 'path', index: 0, target: 'src/main.ts' })
  })

  test('keeps several references in the order they appear', () => {
    const refs = parseRefs('@file#2:b.ts and @image#1:a.png and @//file/c.ts')
    expect(refs.map((ref) => ref.target)).toEqual(['b.ts', 'a.png', 'c.ts'])
  })

  test('a reference at the start of the text is found', () => {
    expect(parseRefs('@image#1:a.png is here')[0].target).toBe('a.png')
  })

  test('does not treat an email address as a reference', () => {
    expect(parseRefs('write to user@example.com about it')).toEqual([])
  })

  test('does not swallow a trailing full stop', () => {
    expect(parseRefs('see @//file/a.ts.')[0].target).toBe('a.ts')
  })

  test('strips surrounding punctuation from the target', () => {
    expect(parseRefs('(@image#1:a.png)')[0].target).toBe('a.png')
    expect(parseRefs('[@file#1:b.txt],')[0].target).toBe('b.txt')
  })

  test('ignores an index of zero, which names nothing', () => {
    // The index is 1-based; accepting #0 would let a typo resolve to nothing
    // while still rendering as a chip.
    expect(parseRefs('@image#0:a.png')).toEqual([])
    expect(parseRefs('@file#0:b.txt')).toEqual([])
  })

  test('ignores a reference with no name', () => {
    expect(parseRefs('@image#1:')).toEqual([])
  })

  test('text with no @ is cheap and empty', () => {
    expect(parseRefs('只是普通的一句话')).toEqual([])
    expect(parseRefs('')).toEqual([])
  })

  test('a repeated reference is reported each time it appears', () => {
    const refs = parseRefs('@image#1:a.png again @image#1:a.png')
    expect(refs).toHaveLength(2)
  })
})

describe('resolveRefs', () => {
  const images = ['/api/images?file=one.png', '/api/images?file=two.png']
  const files = [{ name: 'report.pdf', url: '/api/files?file=r.pdf' }]

  test('an index resolves to the matching upload', () => {
    const [ref] = resolveRefs(parseRefs('@image#2:two.png'), images, files)
    expect(ref).toMatchObject({ resolved: true, url: '/api/images?file=two.png' })
  })

  test('an index past the end is unresolved, not silently dropped', () => {
    const [ref] = resolveRefs(parseRefs('@image#9:nine.png'), images, files)
    expect(ref.resolved).toBe(false)
    expect(ref.url).toBeUndefined()
  })

  test('a file reference resolves against the file list', () => {
    const [ref] = resolveRefs(parseRefs('@file#1:report.pdf'), images, files)
    expect(ref).toMatchObject({ resolved: true, url: '/api/files?file=r.pdf' })
  })

  test('a path reference always resolves — it is not an upload', () => {
    const [ref] = resolveRefs(parseRefs('@//file/src/main.ts'), [], [])
    expect(ref.resolved).toBe(true)
  })
})

describe('refFor and nextIndex', () => {
  test('builds the text for a newly added attachment', () => {
    expect(refFor('image', 1, 'a.png')).toBe('@image#1:a.png')
    expect(refFor('file', 3, 'notes.txt')).toBe('@file#3:notes.txt')
  })

  test('the next index follows what is already attached', () => {
    expect(nextIndex(['a'])).toBe(2)
    expect(nextIndex([])).toBe(1)
  })
})

describe('refsForModel', () => {
  test('text with no references is returned untouched', () => {
    expect(refsForModel('hello', [], [])).toBe('hello')
  })

  test('a resolved reference is left exactly as written', () => {
    const text = 'look at @image#1:a.png'
    expect(refsForModel(text, ['/api/images?file=a'], [])).toBe(text)
  })

  test('an unresolved reference is called out so the model is not misled', () => {
    const body = refsForModel('look at @image#2:missing.png', ['/api/images?file=a'], [])
    expect(body).toContain('@image#2:missing.png')
    expect(body).toMatch(/not match an attachment/)
  })
})
