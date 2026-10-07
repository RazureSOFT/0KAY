// Nav labels for the first-party plugin sidebar entries.
//
// Run: node scripts/add-nav-keys.mjs
//
// The nav items for memory / companion / marketplace / skills were patch-declared
// with a literal Chinese `label` and no `labelKey`, so the sidebar stayed Chinese
// in every language. App.vue resolves `navLabel(item)` as labelKey -> label, so a
// key is all that is missing.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { parseStringsXml, renderStringsXml } from './i18n.mjs'

const ADD = {
  en: {
    'nav.memory': 'Memory',
    'nav.companion': 'Companion',
    'nav.marketplace': 'Marketplace',
    'nav.skills': 'Skills',
  },
  zh: {
    'nav.memory': '记忆',
    'nav.companion': '陪伴',
    'nav.marketplace': '插件市场',
    'nav.skills': '技能',
  },
  ja: {
    'nav.memory': '記憶',
    'nav.companion': 'コンパニオン',
    'nav.marketplace': 'マーケット',
    'nav.skills': 'スキル',
  },
  'zh-Hant': {
    'nav.memory': '記憶',
    'nav.companion': '陪伴',
    'nav.marketplace': '外掛市集',
    'nav.skills': '技能',
  },
}

const DIRS = { en: 'values', zh: 'values-zh', ja: 'values-ja', 'zh-Hant': 'values-b+zh+Hant' }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'strings')

for (const [locale, additions] of Object.entries(ADD)) {
  const file = path.join(root, DIRS[locale], 'strings.xml')
  const flat = parseStringsXml(await readFile(file, 'utf8'))
  let added = 0
  for (const [key, value] of Object.entries(additions)) {
    if (key in flat) continue
    flat[key] = value
    added++
  }
  await writeFile(file, renderStringsXml(flat), 'utf8')
  console.log(`${locale}: +${added} (${Object.keys(flat).length} total)`)
}
