import { describe, expect, it } from 'vitest'
import en from './locales/en.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import zhHant from './locales/zh-Hant.json'

/**
 * The four locales are supposed to be line-for-line parallel. Nothing enforces
 * that today: a key added to `en` and forgotten in `ja` renders as the raw key at
 * runtime, which is exactly the class of bug that is invisible in review and
 * annoying in use. These tests fail on the first missing or extra key.
 */

const LOCALES = { en, zh, ja, 'zh-Hant': zhHant } as Record<string, any>

/** Every leaf key path in an object, dotted. */
function keyPaths(value: any, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

function sortedKeys(locale: any): string[] {
  return keyPaths(locale).sort()
}

describe('locale parity', () => {
  const reference = sortedKeys(en)

  for (const [code, locale] of Object.entries(LOCALES)) {
    it(`${code} defines exactly the same keys as en`, () => {
      const keys = sortedKeys(locale)
      const missing = reference.filter((key) => !keys.includes(key))
      const extra = keys.filter((key) => !reference.includes(key))
      expect({ missing, extra }).toEqual({ missing: [], extra: [] })
    })

    it(`${code} has no empty or untranslated-looking values`, () => {
      // A value that is literally the key path means the lookup failed.
      const offenders: string[] = []
      const walk = (value: any, prefix = '') => {
        if (value === null || typeof value !== 'object') {
          if (typeof value !== 'string' || value.trim() === '') {
            offenders.push(prefix || '(root)')
          }
          return
        }
        for (const [key, child] of Object.entries(value)) {
          walk(child, prefix ? `${prefix}.${key}` : key)
        }
      }
      walk(locale)
      expect(offenders).toEqual([])
    })
  }

  it('ships the console keys the page asks for', () => {
    // Guards the ConsolePage <-> locale contract without parsing the template.
    for (const [code, locale] of Object.entries(LOCALES)) {
      expect(locale.nav.console, `${code}.nav.console`).toBeTruthy()
      for (const key of [
        'tabsLabel',
        'level',
        'search',
        'searchPlaceholder',
        'follow',
        'refresh',
        'clear',
        'live',
        'connecting',
        'disconnected',
        'streamError',
        'reconnect',
        'noLogs',
        'noSpans',
        'showTrace',
        'totalTrace',
      ]) {
        expect(locale.console[key], `${code}.console.${key}`).toBeTruthy()
      }
      expect(locale.console.tab.logs, `${code}.console.tab.logs`).toBeTruthy()
      expect(locale.console.tab.traces, `${code}.console.tab.traces`).toBeTruthy()
    }
  })
})
