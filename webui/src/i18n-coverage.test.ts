import { describe, expect, it } from 'vitest'

const CJK = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/

const allSources = {
  ...import.meta.glob('./**/*.vue', { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob('./**/*.ts', { query: '?raw', import: 'default', eager: true }),
} as Record<string, string>

const isTest = (file: string) => /\.test\.ts$/.test(file)

const sources = Object.fromEntries(
  Object.entries(allSources).filter(([file]) => !isTest(file)),
)

const ALLOWED_FILES = new Set(['./i18n.ts'])

function stripComments(source: string): string {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .filter((line) => !/^\s*(\/\/|\/?\*)/.test(line))
    .join('\n')
}

describe('no hardcoded CJK in source', () => {
  it('found source files to scan', () => {
    expect(Object.keys(sources).length).toBeGreaterThan(40)
  })

  it('has no Chinese or Japanese outside the locale files', () => {
    const offenders: string[] = []
    for (const [file, source] of Object.entries(sources)) {
      if (ALLOWED_FILES.has(file)) continue
      stripComments(source)
        .split(/\r?\n/)
        .forEach((line, index) => {
          if (!CJK.test(line)) return
          const sample = line.trim().slice(0, 80)
          offenders.push(`${file.replace('./', 'src/')}:${index + 1}  ${sample}`)
        })
    }
    expect(offenders).toEqual([])
  })

  it('keeps the language endonyms in i18n.ts', () => {
    const i18nSource = sources['./i18n.ts']
    expect(i18nSource, 'src/i18n.ts not found by the glob').toBeTruthy()
    expect(i18nSource).toContain('日本語')
    expect(i18nSource).toContain('简体中文')
  })
})
