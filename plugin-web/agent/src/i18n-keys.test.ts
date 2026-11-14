import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Every key the page asks for must exist in the string file.
 *
 * The page once shipped `t('agent.page.taskScopeEngineering')` with no matching
 * `page.taskScopeEngineering` entry, so a user saw the key itself in the form —
 * not an error, not a blank, just the raw identifier. Nothing failed: the build
 * was clean, the types were fine, and the fallback is silent.
 *
 * The plugin's strings live under `page.*` and the host prefixes the plugin name,
 * so a template key `agent.page.foo` is declared as `page.foo`.
 */
const here = resolve(__dirname, '..')
const page = readFileSync(resolve(here, 'src/AgentsPage.vue'), 'utf8')
  + readFileSync(resolve(here, 'src/composables/useTaskDetail.ts'), 'utf8')
const xml = readFileSync(resolve(here, 'strings/values/strings.xml'), 'utf8')

const declared = new Set([...xml.matchAll(/name="([^"]+)"/g)].map((m) => m[1]))
const used = new Set([...page.matchAll(/\bt\('(agent\.page\.[\w.]+|agent\.[\w.]+)'/g)].map((m) => m[1]))

describe('translation keys', () => {
  it('declares every key the page uses', () => {
    const missing: string[] = []
    for (const key of used) {
      const bare = key.startsWith('agent.') ? key.slice('agent.'.length) : key
      // A key built by concatenation ends in `_`; it needs at least one
      // declared key with that prefix, not an exact match.
      if (bare.endsWith('_')) {
        if (![...declared].some((name) => name.startsWith(bare))) missing.push(`${key}*`)
        continue
      }
      if (!declared.has(bare)) missing.push(key)
    }
    expect(missing).toEqual([])
  })

  it('has the same key set in all four locales', () => {
    const locales = ['values', 'values-zh', 'values-ja', 'values-b+zh+Hant']
    const sets = locales.map((folder) => {
      const text = readFileSync(resolve(here, `strings/${folder}/strings.xml`), 'utf8')
      return new Set([...text.matchAll(/name="([^"]+)"/g)].map((m) => m[1]))
    })
    for (let i = 1; i < sets.length; i += 1) {
      const missing = [...sets[0]].filter((key) => !sets[i].has(key))
      const extra = [...sets[i]].filter((key) => !sets[0].has(key))
      expect({ locale: locales[i], missing, extra }).toEqual({ locale: locales[i], missing: [], extra: [] })
    }
  })
})
