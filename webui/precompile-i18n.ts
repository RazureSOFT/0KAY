import { readFileSync } from 'node:fs'
import path from 'node:path'
import { baseCompile } from '@intlify/message-compiler'

/**
 * Precompile vue-i18n messages so the page does not need `unsafe-eval`.
 *
 * vue-i18n compiles a message the first time it is used, with
 * `new Function('return ' + code)`. Core serves the WebUI under a strict CSP
 * (`script-src 'self'` plus three inline hashes, no `unsafe-eval`), so that call
 * is refused. It happens while the app is mounting, so the first translation
 * that runs kills the render and `#app` stays empty — the only console output is
 * a CSP EvalError pointing into the vendor bundle, which is why the page looked
 * like it simply "does not mount".
 *
 * The fix is to move that compiling to build time. `baseCompile` returns the
 * same function source vue-i18n would have generated, and the runtime accepts a
 * function as a message (that is exactly what its own cache stores). So a
 * message with placeholders ships as a real function expression, and one without
 * placeholders stays a plain string.
 */

const VIRTUAL_PREFIX = '\0i18n-locale:'

export function precompileI18nMessages() {
  return {
    name: 'precompile-i18n-messages',
    enforce: 'pre' as const,

    /**
     * Redirect `./locales/x.json` to a private virtual module.
     *
     * Vite's own `vite:json` plugin answers `load` for every .json id and runs
     * before a normal plugin's hook, so returning module code from `load` made it
     * parse that code as JSON and fail the build. Redirecting at `resolveId`
     * means the json plugin never sees the import at all.
     */
    resolveId(source: string, importer: string | undefined) {
      if (!source.endsWith('.json') || !source.includes('locales/')) return null
      if (!importer) return null
      const dir = path.dirname(importer.split('?')[0])
      const resolved = path.resolve(dir, source)
      // The .json suffix is dropped on purpose: `vite:json` claims every id that
      // ends in .json, virtual or not, and would try to parse this module.
      return VIRTUAL_PREFIX + resolved.replace(/\.json$/, '')
    },

    load(id: string) {
      if (!id.startsWith(VIRTUAL_PREFIX)) return null
      const file = id.slice(VIRTUAL_PREFIX.length) + '.json'
      let messages: unknown
      try {
        messages = JSON.parse(readFileSync(file, 'utf8'))
      } catch {
        return null
      }
      if (!messages || typeof messages !== 'object') return null

      const problems: string[] = []

      const walk = (node: Record<string, unknown>, prefix: string): Record<string, unknown> => {
        const out: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(node)) {
          const full = prefix ? `${prefix}.${key}` : key
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            out[key] = walk(value as Record<string, unknown>, full)
            continue
          }
          // No braces, nothing to interpolate: the runtime returns the text as-is.
          if (typeof value !== 'string' || !value.includes('{')) {
            out[key] = value
            continue
          }
          try {
            out[key] = { __code: baseCompile(value).code, __text: value }
          } catch (error) {
            // Left as a string on purpose: the runtime would compile it itself
            // and hit the CSP again, so this has to be visible, not silent.
            problems.push(`${full}: ${(error as Error).message}`)
            out[key] = value
          }
        }
        return out
      }

      const compiled = walk(messages as Record<string, unknown>, '')
      if (problems.length) {
        this.warn(`i18n messages left uncompiled in ${path.basename(file)}: ${problems.slice(0, 5).join('; ')}`)
      }

      // Emit JavaScript, not JSON: the compiled pieces have to stay function
      // expressions. Serialising them as text and rebuilding in the browser
      // would need eval again, which is the thing being removed.
      const emit = (value: unknown, depth: number): string => {
        const pad = '  '.repeat(depth)
        if (value && typeof value === 'object' && '__code' in (value as Record<string, unknown>)) {
          const { __code, __text } = value as { __code: string; __text: string }
          // The compiled function carries its own source text. Anything that reads
          // the message table as data — the strings.xml parity test, a tool that
          // dumps locales, a debugger — then still sees the sentence rather than
          // `function __msg__(ctx) {…}`. Without this, precompiling silently
          // changes what the table *is*, not just how it is evaluated.
          return `Object.assign(${__code}, { toString: () => ${JSON.stringify(__text)} })`
        }
        if (value && typeof value === 'object') {
          const entries = Object.entries(value as Record<string, unknown>)
          if (!entries.length) return '{}'
          const body = entries.map(([k, v]) => `${pad}  ${JSON.stringify(k)}: ${emit(v, depth + 1)}`).join(',\n')
          return `{\n${body}\n${pad}}`
        }
        return JSON.stringify(value)
      }

      return { code: `export default ${emit(compiled, 0)}\n`, map: null }
    },
  }
}
