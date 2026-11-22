/**
 * Assert the design system has not drifted.
 *
 * The agent page accumulated 12 border radii, 10 font sizes and 6 font weights
 * (one of them not a real weight) because every change added a literal instead
 * of a token. Nothing failed: the build was clean and it rendered fine. It only
 * looked like nothing had a hierarchy.
 *
 * This script is the failure that was missing. It reads the *built bundle* — what
 * actually ships — and counts the distinct values in use. A new literal fails the
 * check, which is the point: adding a 13th radius should be a decision, not an
 * accident.
 *
 * Values are read from declarations, not from computed styles, because the
 * question is "how many different numbers did someone write", not "what did the
 * cascade resolve to".
 *
 * Thresholds are the approved scale, not the current count: tightening them is
 * how the scale gets applied. Run after `npm run build`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
// scripts/ → plugin-web/agent/ → plugin-web/ → repo root
const bundlePath = path.resolve(here, '../../../core/data/plugin-ui/agent/index.js')

if (!fs.existsSync(bundlePath)) {
  console.error(`FAIL: no bundle at ${bundlePath} — run \`npm run build\` first`)
  process.exit(1)
}

const source = fs.readFileSync(bundlePath, 'utf8')

/**
 * Only inspect the injected stylesheet, not the whole bundle.
 *
 * The bundle is JS with CSS inlined as a string literal, so scanning it wholesale
 * matches object keys and fragments of Vue render code — the first run reported
 * `font-weight: ", ""), ""), ,` as a value. The stylesheet is the only place
 * where a declaration means a declaration.
 */
function extractCss(bundle) {
  // The build injects `s.textContent = "<css>"` — take the largest such literal.
  const candidates = []
  const re = /textContent\s*=\s*("(?:[^"\\]|\\.)*")/g
  for (const match of bundle.matchAll(re)) {
    try {
      const value = JSON.parse(match[1])
      if (value.includes('{') && value.includes('}')) candidates.push(value)
    } catch {
      // Not a JSON string literal; skip.
    }
  }
  return candidates.sort((a, b) => b.length - a.length)[0] || ''
}

const css = extractCss(source)
if (!css) {
  console.error('FAIL: could not locate the injected stylesheet in the bundle')
  process.exit(1)
}

/**
 * Limits. Each is the approved MD3 scale plus the few legacy values still in
 * flight during the migration; lower them as values get tokenised.
 */
const LIMITS = {
  borderRadius: { max: 14, label: 'distinct border-radius values' },
  fontSize: { max: 12, label: 'distinct font-size values' },
  fontWeight: { max: 8, label: 'distinct font-weight values' },
}

/** Font weights that exist in the app's typeface. Anything else is a fiction. */
const LEGAL_WEIGHTS = new Set(['400', '500', '600', '700'])

function collect(prop) {
  const values = new Set()
  // Match `prop:value` through `;` or `}`; ignore var()/calc()/inherit etc.
  const re = new RegExp(`(?<![\\w-])${prop}\\s*:\\s*([^;}]+)`, 'g')
  for (const match of css.matchAll(re)) {
    const raw = match[1].trim()
    if (/^(var|calc|inherit|initial|unset|revert|auto|none)\b/.test(raw)) continue
    for (const part of raw.split(/\s+/)) {
      const token = part.replace(/!important/, '').trim()
      if (!token || token === '0' || token === '0px') continue
      values.add(token)
    }
  }
  return [...values].sort()
}

/** Font weights only ever arrive as bare numbers; drop anything else. */
function collectWeights() {
  return collect('font-weight').filter((w) => /^\d{3}$/.test(w))
}

let failed = false
const report = []

for (const [prop, limit] of Object.entries(LIMITS)) {
  const values = prop === 'fontWeight' ? collectWeights() : collect(prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`))
  const ok = values.length <= limit.max
  report.push({ prop, count: values.length, max: limit.max, ok, values: values.length <= 8 ? values : undefined })
  if (!ok) failed = true
}

// Illegal font weights are a hard failure regardless of the count limit.
const weights = collectWeights()
const illegal = weights.filter((w) => !LEGAL_WEIGHTS.has(w))
if (illegal.length) {
  failed = true
  report.push({ prop: 'font-weight', illegal, note: 'not in the typeface' })
}

console.log('design token drift check')
for (const row of report) {
  const mark = row.ok === false || row.illegal ? 'FAIL' : ' ok '
  if (row.illegal) {
    console.log(` [${mark}] illegal font-weight: ${row.illegal.join(', ')} (${row.note})`)
  } else {
    console.log(` [${mark}] ${row.prop.padEnd(16)} ${String(row.count).padStart(2)} / ${row.max} allowed${row.values ? '  ' + row.values.join(' ') : ''}`)
  }
}

if (failed) {
  console.error('\nFAIL: design tokens drifted beyond the approved scale.')
  console.error('Use --md-shape-* for radii and .md-type-* for type, or raise the limit deliberately.')
  process.exit(1)
}
console.log('\nok: within the approved scale')