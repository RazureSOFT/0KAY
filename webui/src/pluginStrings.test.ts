import { describe, expect, it } from 'vitest'
import {
  buildLocaleBundles,
  fetchPluginStrings,
  normalizeLocale,
  type PluginStringsResponse,
} from './pluginStrings'

describe('normalizeLocale', () => {
  it('folds Traditional Chinese variants onto the app code', () => {
    // A plugin author following Android convention writes values-zh-rTW or
    // values-b+zh+Hant. The app runs zh-Hant, so these must map onto it or those
    // users fall back to English for every plugin string.
    for (const code of ['zh-Hant', 'zh-rTW', 'zh-TW', 'zh-HK', 'zh-MO']) {
      expect(normalizeLocale(code), code).toBe('zh-Hant')
    }
  })

  it('maps Simplified Chinese and the other shipped locales', () => {
    for (const code of ['zh', 'zh-Hans', 'zh-CN', 'zh-SG']) expect(normalizeLocale(code)).toBe('zh')
    expect(normalizeLocale('ja')).toBe('ja')
    expect(normalizeLocale('ja-JP')).toBe('ja')
    expect(normalizeLocale('en')).toBe('en')
    expect(normalizeLocale('en-US')).toBe('en')
  })

  it('passes an unknown locale through and rejects an empty one', () => {
    expect(normalizeLocale('ko')).toBe('ko')
    expect(normalizeLocale('  ')).toBe('')
  })
})

describe('buildLocaleBundles', () => {
  const response = (locales: Record<string, Record<string, string>>): PluginStringsResponse => ({ locales })

  it('namespaces messages under the plugin name', () => {
    const bundles = buildLocaleBundles([
      { name: 'demo', response: response({ en: { 'panel.title': 'Demo' }, zh: { 'panel.title': '演示' } }) },
    ])
    expect(bundles.en.demo).toEqual({ panel: { title: 'Demo' } })
    expect(bundles.zh.demo).toEqual({ panel: { title: '演示' } })
  })

  it('does not mutate the response it was given', () => {
    const input = response({ en: { a: 'A' } })
    buildLocaleBundles([{ name: 'demo', response: input }])
    expect(input.locales!.en).toEqual({ a: 'A' })
    expect(input.locales!.en).not.toBe(buildLocaleBundles([{ name: 'demo', response: input }]).en.demo)
  })

  it('ignores plugins with no strings', () => {
    // A plugin without translations is ordinary, not an error.
    expect(buildLocaleBundles([{ name: 'silent', response: null }])).toEqual({})
    expect(buildLocaleBundles([{ name: 'empty', response: response({ en: {} }) }])).toEqual({})
  })

  it('drops an empty namespace rather than registering a blank one', () => {
    const bundles = buildLocaleBundles([
      { name: 'a', response: response({ en: { k: 'v' } }) },
      { name: 'b', response: response({}) },
    ])
    expect(Object.keys(bundles.en)).toEqual(['a'])
  })

  it('keeps the first plugin when two claim one namespace', () => {
    const bundles = buildLocaleBundles([
      { name: 'dup', response: response({ en: { k: 'first' } }) },
      { name: 'dup', response: response({ en: { k: 'second' } }) },
    ])
    expect(bundles.en.dup).toEqual({ k: 'first' })
  })

  it('normalises locale codes on the way in', () => {
    const bundles = buildLocaleBundles([
      { name: 'demo', response: response({ 'zh-rTW': { k: '繁' } }) },
    ])
    expect(bundles['zh-Hant'].demo).toEqual({ k: '繁' })
  })

  it('strips a key prefix that repeats the namespace', () => {
    // Keys are relative to the namespace, but a plugin author may write the full
    // path anyway. Left alone it would double and render as a key path; both
    // spellings must resolve to the same string.
    const bundles = buildLocaleBundles([
      {
        name: 'demo',
        response: response({
          en: { 'demo.title': 'Demo', title2: 'Other', nested: 'N' },
        }),
      },
    ])
    expect(bundles.en.demo).toEqual({ title: 'Demo', title2: 'Other', nested: 'N' })
  })

  it('nests dotted keys so vue-i18n can traverse them', () => {
    // A strings.xml key is flat and dotted. Placed verbatim it becomes a literal
    // key and t('demo.memory.title') finds nothing, rendering the key path in the
    // UI — which is exactly what shipped before this was fixed.
    const bundles = buildLocaleBundles([
      {
        name: 'demo',
        response: response({
          en: { 'memory.title': 'Memory', 'memory.tools.refresh': 'Refresh', plain: 'P' },
        }),
      },
    ])
    expect(bundles.en.demo).toEqual({
      memory: { title: 'Memory', tools: { refresh: 'Refresh' } },
      plain: 'P',
    })
  })

  it('drops non-string values rather than registering them', () => {
    const bundles = buildLocaleBundles([
      {
        name: 'demo',
        response: response({ en: { ok: 'yes', bad: { nested: true } } as never }),
      },
    ])
    expect(bundles.en.demo).toEqual({ ok: 'yes' })
  })
})

describe('fetchPluginStrings', () => {
  const ok = (body: unknown) =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as unknown as Response)

  it('requests the plugin endpoint and returns the payload', async () => {
    let seen = ''
    const doFetch = ((url: string) => { seen = url; return ok({ locales: { en: { k: 'v' } } }) }) as unknown as typeof fetch
    const result = await fetchPluginStrings('demo', doFetch)
    expect(seen).toBe('/api/plugins/demo/strings')
    expect(result?.locales?.en).toEqual({ k: 'v' })
  })

  it('returns null for a plugin without strings', async () => {
    const doFetch = (() => Promise.resolve({ ok: false, status: 404 } as unknown as Response)) as unknown as typeof fetch
    expect(await fetchPluginStrings('silent', doFetch)).toBeNull()
  })

  it('returns null instead of throwing when the request fails', async () => {
    // One plugin's failure must not stop the app booting.
    const doFetch = (() => Promise.reject(new Error('offline'))) as unknown as typeof fetch
    expect(await fetchPluginStrings('demo', doFetch)).toBeNull()
  })

  it('returns null for a payload without locales', async () => {
    const doFetch = (() => ok({ default: 'en' })) as unknown as typeof fetch
    expect(await fetchPluginStrings('demo', doFetch)).toBeNull()
  })

  it('escapes the plugin name in the URL', async () => {
    let seen = ''
    const doFetch = ((url: string) => { seen = url; return ok({ locales: {} }) }) as unknown as typeof fetch
    await fetchPluginStrings('a b/c', doFetch)
    expect(seen).toBe('/api/plugins/a%20b%2Fc/strings')
  })
})
