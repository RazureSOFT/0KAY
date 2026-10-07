import { describe, expect, it } from 'vitest'
import en from '../strings/values/strings.xml?raw'
import ja from '../strings/values-ja/strings.xml?raw'
import zh from '../strings/values-zh/strings.xml?raw'
import zhHant from '../strings/values-b+zh+Hant/strings.xml?raw'
import enJson from './locales/en.json'
import jaJson from './locales/ja.json'
import zhJson from './locales/zh.json'
import zhHantJson from './locales/zh-Hant.json'
import { flatten, nest, parseStringsXml, renderStringsXml } from '../scripts/i18n.mjs'

/**
 * src/locales/*.json is a build artefact of strings.xml. Editing the JSON
 * directly still compiles and still renders, so the drift would only surface
 * when someone next regenerates and silently loses their edit. This test fails
 * instead, and reports the differing keys rather than a wall of line noise.
 *
 * The XML is the source of truth; the JSON exists so the running app stays on
 * vue-i18n with no runtime parser.
 */

const PAIRS = [
  { locale: 'en', xml: en, json: enJson },
  { locale: 'zh', xml: zh, json: zhJson },
  { locale: 'ja', xml: ja, json: jaJson },
  { locale: 'zh-Hant', xml: zhHant, json: zhHantJson },
]

describe('strings.xml is the source of truth for the locale JSON', () => {
  for (const { locale, xml, json } of PAIRS) {
    it(`${locale}.json matches strings.xml`, () => {
      const fromXml = parseStringsXml(xml)
      const fromJson = flatten(json as Record<string, unknown>)

      const missing = Object.keys(fromXml).filter((k) => !(k in fromJson))
      const extra = Object.keys(fromJson).filter((k) => !(k in fromXml))
      const differing = Object.keys(fromXml).filter(
        (k) => k in fromJson && fromXml[k] !== fromJson[k],
      )

      expect({ missing, extra, differing }).toEqual({ missing: [], extra: [], differing: [] })
    })
  }

  it('parses every string with its whitespace intact', () => {
    // Several values are deliberately padded. A parser that trims would change
    // the rendered text, so the round trip is asserted explicitly.
    const flat = flatten(enJson as Record<string, unknown>)
    expect(flat['connection.lanMode']).toBe(' · LAN mode')

    const roundTripped = parseStringsXml(renderStringsXml(flat))
    expect(roundTripped).toEqual(flat)
  })

  it('round-trips values that need XML escaping', () => {
    // Apostrophes stay literal (aapt would want \'); ampersands and angle
    // brackets are entity-encoded. All three must survive.
    const tricky = {
      'a.apostrophe': "L.I.F.E's settings",
      'a.ampersand': 'Email (IMAP & SMTP)',
      'a.angles': 'a < b > c',
      'a.quotes': 'say "hi"',
      'a.padded': ' · LAN mode ',
    }
    expect(parseStringsXml(renderStringsXml(tricky))).toEqual(tricky)
  })

  it('nests back into the shape vue-i18n expects', () => {
    // Guards the flat <-> nested mapping: a key with dots must become an object
    // path, not a literal dotted property name.
    const nested = nest({ 'a.b.c': 'x', 'a.b.d': 'y', plain: 'z' }) as Record<string, any>
    expect(nested.a.b).toEqual({ c: 'x', d: 'y' })
    expect(nested.plain).toBe('z')
  })
})
