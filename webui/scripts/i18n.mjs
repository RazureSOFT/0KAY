import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const STRINGS_DIR = path.join(ROOT, 'strings')
const LOCALES_DIR = path.join(ROOT, 'src', 'locales')

const LOCALE_DIRS = [
  { code: 'en', dir: 'values' },
  { code: 'ja', dir: 'values-ja' },
  { code: 'zh', dir: 'values-zh' },
  { code: 'zh-Hant', dir: 'values-b+zh+Hant' },
]

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }

function decodeXml(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole
    }
    return Object.prototype.hasOwnProperty.call(ENTITIES, body) ? ENTITIES[body] : whole
  })
}

function encodeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function parseStringsXml(text) {
  const out = {}
  const re = /<string\b[^>]*\bname\s*=\s*"([^"]+)"[^>]*\/?>([\s\S]*?)<\/string>/g
  let match
  while ((match = re.exec(text))) {
    out[match[1]] = decodeXml(match[2])
  }
  return out
}

export function renderStringsXml(flat) {
  const keys = Object.keys(flat).sort()
  const lines = keys.map((key) => `  <string name="${key}">${encodeXml(flat[key])}</string>`)
  return `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n${lines.join('\n')}\n</resources>\n`
}

export function nest(flat) {
  const root = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    let node = root
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (typeof node[part] !== 'object' || node[part] === null) node[part] = {}
      node = node[part]
    }
    node[parts[parts.length - 1]] = value
  }
  return root
}

export function flatten(value, prefix = '', out = {}) {
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out)
    }
    return out
  }
  out[prefix] = String(value)
  return out
}

function sortedEntries(flat) {
  return Object.keys(flat).sort().map((k) => [k, flat[k]])
}

function diffFlat(expected, actual, label) {
  const a = new Map(sortedEntries(expected))
  const b = new Map(sortedEntries(actual))
  const problems = []
  for (const [k, v] of a) {
    if (!b.has(k)) problems.push(`  missing in ${label}: ${k}`)
    else if (b.get(k) !== v) problems.push(`  differs in ${label}: ${k}\n    expected ${JSON.stringify(v)}\n    actual   ${JSON.stringify(b.get(k))}`)
  }
  for (const k of b.keys()) if (!a.has(k)) problems.push(`  extra in ${label}: ${k}`)
  return problems
}

async function readJsonLocales() {
  const out = {}
  for (const { code } of LOCALE_DIRS) {
    const file = path.join(LOCALES_DIR, `${code}.json`)
    out[code] = flatten(JSON.parse(await readFile(file, 'utf8')))
  }
  return out
}

async function readXmlLocales() {
  const out = {}
  for (const { code, dir } of LOCALE_DIRS) {
    const file = path.join(STRINGS_DIR, dir, 'strings.xml')
    if (!existsSync(file)) {
      throw new Error(`missing ${path.relative(ROOT, file)} — run \`node scripts/i18n.mjs migrate\` first`)
    }
    out[code] = parseStringsXml(await readFile(file, 'utf8'))
  }
  return out
}

async function eolFor(file) {
  if (!existsSync(file)) return '\n'
  return (await readFile(file, 'utf8')).includes('\r\n') ? '\r\n' : '\n'
}

async function migrate() {
  const flat = await readJsonLocales()
  for (const { code, dir } of LOCALE_DIRS) {
    const target = path.join(STRINGS_DIR, dir)
    await mkdir(target, { recursive: true })
    await writeFile(path.join(target, 'strings.xml'), renderStringsXml(flat[code]), 'utf8')
    console.log(`wrote strings/${dir}/strings.xml  (${Object.keys(flat[code]).length} strings)`)
  }
  const back = await readXmlLocales()
  let bad = 0
  for (const { code } of LOCALE_DIRS) {
    const problems = diffFlat(flat[code], back[code], `${code} (after XML round trip)`)
    if (problems.length) { bad += problems.length; console.log(`\n${code}:\n${problems.join('\n')}`) }
  }
  console.log(bad ? `\nROUND TRIP FAILED (${bad})` : '\nround trip verified: XML reproduces every string exactly')
  if (bad) process.exit(1)
}

async function generate({ check }) {
  const flat = await readXmlLocales()
  let drift = 0
  for (const { code } of LOCALE_DIRS) {
    const file = path.join(LOCALES_DIR, `${code}.json`)
    const eol = await eolFor(file)
    const body = JSON.stringify(nest(flat[code]), null, 2).split('\n').join(eol) + eol
    if (check) {
      const current = existsSync(file) ? await readFile(file, 'utf8') : ''
      if (current.replace(/\r\n/g, '\n') !== body.replace(/\r\n/g, '\n')) {
        const onDisk = existsSync(file) ? flatten(JSON.parse(current)) : {}
        const problems = diffFlat(flat[code], onDisk, `${code}.json`)
        console.log(`\nsrc/locales/${code}.json is out of date:`)
        console.log(problems.length ? problems.join('\n') : '  (only formatting/order differs — run generate)')
        drift++
      }
    } else {
      await writeFile(file, body, 'utf8')
      console.log(`wrote src/locales/${code}.json  (${Object.keys(flat[code]).length} strings)`)
    }
  }
  if (check) {
    console.log(drift ? `\n${drift} locale file(s) out of date — run \`node scripts/i18n.mjs generate\`` : 'locale JSON is in sync with strings.xml')
    if (drift) process.exit(1)
  }
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (invokedDirectly) {
  const command = process.argv[2]
  if (command === 'migrate') await migrate()
  else if (command === 'generate') await generate({ check: false })
  else if (command === 'check') await generate({ check: true })
  else {
    console.log('usage: node scripts/i18n.mjs <migrate|generate|check>')
    process.exit(1)
  }
}
