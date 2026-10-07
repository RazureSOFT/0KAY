import { describe, expect, it } from 'vitest'

/**
 * Guards the i18n migration: no user-facing Chinese or Japanese may be hardcoded
 * in a component or module.
 *
 * Every such string is invisible to a non-CJK reader, renders in one language
 * only, and is missed by the type checker — which is exactly how 150 of them
 * accumulated. This test turns "someone added another one" into a build failure.
 *
 * Sources are pulled in with import.meta.glob(?raw) rather than node:fs: the
 * project deliberately carries no @types/node (it is a browser app, and Node
 * types would let application code reach for `fs` and only fail in the browser).
 *
 * Allowed exceptions, both narrow and deliberate:
 *   * src/i18n.ts — the language *endonyms* in LOCALES (`日本語`, `简体中文`,
 *     `繁體中文`). A language picker shows each language in its own script, so
 *     these must not be translated.
 *   * test files — a test that proves a locale round-trips needs sample
 *     translations to round-trip, and none of it is shipped.
 *   * comments — a comment referencing a UI label in Chinese is documentation,
 *     not a string a user ever sees.
 */

const CJK = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/

const allSources = {
  ...import.meta.glob('./**/*.vue', { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob('./**/*.ts', { query: '?raw', import: 'default', eager: true }),
} as Record<string, string>

/** Test files hold sample translations; they are never part of the bundle. */
const isTest = (file: string) => /\.test\.ts$/.test(file)

const sources = Object.fromEntries(
  Object.entries(allSources).filter(([file]) => !isTest(file)),
)

const ALLOWED_FILES = new Set(['./i18n.ts'])

/** Remove comments so prose cannot trip the check. */
function stripComments(source: string): string {
  return source
    .replace(/<!--[\s\S]*?-->/g, '') // HTML / SFC template
    .replace(/\/\*[\s\S]*?\*\//g, '') // block
    .split(/\r?\n/)
    .filter((line) => !/^\s*(\/\/|\/?\*)/.test(line)) // line / jsdoc continuation
    .join('\n')
}

describe('no hardcoded CJK in source', () => {
  it('found source files to scan', () => {
    // Guards against the glob silently matching nothing, which would make every
    // assertion below vacuously pass.
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
    // The one file we skip must still be the reason we skip it.
    const i18nSource = sources['./i18n.ts']
    expect(i18nSource, 'src/i18n.ts not found by the glob').toBeTruthy()
    expect(i18nSource).toContain('日本語')
    expect(i18nSource).toContain('简体中文')
  })
})
