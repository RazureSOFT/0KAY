// One-off: regenerate webui/public/vendor/vue-bridge.js with the full Vue export list.
const fs = require('node:fs')
const path = require('node:path')

import('vue').then((m) => {
  // Skip `default` and cjs-interop junk keys that are not valid identifiers.
  const keys = Object.keys(m)
    .filter((k) => k !== 'default' && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k))
    .sort()
  const lines = []
  for (let i = 0; i < keys.length; i += 6) {
    lines.push('  ' + keys.slice(i, i + 6).join(', ') + ',')
  }
  const body = [
    '// Host Vue bridge for plugin bare `import ... from "vue"`.',
    '// Resolved via index.html importmap; re-exports the host copy',
    '// injected as window.__0KAY_VUE__ so plugins share one runtime.',
    '// Generated: full named re-export -- SFC-compiled plugin pages need runtime',
    '// helpers (withCtx, renderList, normalizeClass, ...) beyond a fixed list.',
    'const V = globalThis.__0KAY_VUE__',
    'if (!V) {',
    "  throw new Error('[0kay] window.__0KAY_VUE__ is not ready (load after WebUI main)')",
    '}',
    '',
    'export default V',
    '',
    'export const {',
    ...lines,
    '} = V',
    '',
  ].join('\n')
  const out = path.join(__dirname, '..', 'public', 'vendor', 'vue-bridge.js')
  fs.writeFileSync(out, body)
  console.log('wrote', keys.length, 'exports to', out)
})
