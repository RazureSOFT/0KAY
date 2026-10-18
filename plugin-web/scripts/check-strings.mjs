// Cross-locale parity gate for plugin string resources.
//
// The host's `webui/scripts/i18n.mjs` only reads `webui/strings/`, and
// `i18n-coverage.test.ts` only globs `webui/src/`. Plugin pages ship their own
// `strings/values*/strings.xml` and were therefore covered by neither: a key
// added to `values/strings.xml` and forgotten in `values-zh/` rendered as the raw
// key path in Chinese, with nothing failing.
//
// This runs as a plain Node script so every plugin can share it without pulling
// a test runner into its dependency tree:
//
//   node ../../plugin-web/scripts/check-strings.mjs agent

import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const BASE = 'values'
const LOCALES = ['values-zh', 'values-ja', 'values-b+zh+Hant']

// Parse Android-style <string name="…">text</string> resources. Deliberately
// small: these files hold nothing but string elements, so a real XML parser would
// be a dependency for no gain.
function parseStrings(xml) {
  const out = new Map()
  const re = /<string\s+name="([^"]+)"(?:\s+[^>]*)?>([\s\S]*?)<\/string>/g
  let match
  while ((match = re.exec(xml)) !== null) {
    const value = match[2]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
    out.set(match[1], value.replace(/\s+/g, ' ').trim())
  }
  return out
}

// Positional placeholders: {0}, {name}, %1$s. A translation that drops one shows
// a raw token to the user, and a mismatch in count usually means the string was
// reworded without updating the placeholders.
function placeholders(value) {
  const found = new Set()
  for (const m of value.matchAll(/\{(\w+)\}/g)) found.add('{' + m[1] + '}')
  for (const m of value.matchAll(/%(\d+)\$[sd]/g)) found.add('%' + m[1])
  return [...found].sort()
}

const failures = []

function fail(message) {
  failures.push(message)
}

const plugin = process.argv[2]
if (!plugin) {
  console.error('usage: node check-strings.mjs <plugin-name>')
  process.exit(2)
}

const stringsDir = path.join(PLUGIN_ROOT, plugin, 'strings')
const basePath = path.join(stringsDir, BASE, 'strings.xml')

if (!existsSync(basePath)) {
  // A plugin with no strings of its own is a legitimate choice.
  console.log(`${plugin}: no strings/ directory, nothing to check`)
  process.exit(0)
}

const base = parseStrings(readFileSync(basePath, 'utf8'))
if (base.size === 0) {
  fail(`${plugin}: ${BASE}/strings.xml parsed as 0 strings — the format may have changed`)
}
console.log(`${plugin}: ${base.size} keys in ${BASE}/strings.xml`)

for (const locale of LOCALES) {
  const file = path.join(stringsDir, locale, 'strings.xml')
  if (!existsSync(file)) {
    fail(`${plugin}: missing ${locale}/strings.xml`)
    continue
  }
  const translated = parseStrings(readFileSync(file, 'utf8'))

  for (const key of base.keys()) {
    if (!translated.has(key)) {
      fail(`${plugin}/${locale}: missing key "${key}"`)
      continue
    }
    const want = placeholders(base.get(key))
    const got = placeholders(translated.get(key))
    if (want.length !== got.length || want.some((p, i) => p !== got[i])) {
      fail(`${plugin}/${locale}: placeholder mismatch for "${key}": base [${want}] vs ${locale} [${got}]`)
    }
    if (!translated.get(key)) {
      fail(`${plugin}/${locale}: empty translation for "${key}"`)
    }
  }

  for (const key of translated.keys()) {
    if (!base.has(key)) {
      fail(`${plugin}/${locale}: orphan key "${key}" is not in ${BASE}/strings.xml`)
    }
  }
}

if (failures.length) {
  console.error(`\n${plugin}: ${failures.length} i18n problem(s):`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log(`${plugin}: strings in sync across ${[BASE, ...LOCALES].join(', ')}`)