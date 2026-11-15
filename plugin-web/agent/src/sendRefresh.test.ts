import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * A send has to make the message visible, and three separate bugs stood between
 * "the request succeeded" and "you can see it":
 *
 *   1. The incremental task cursor does not carry a conversation created after it
 *      was issued, so a new conversation had no row in the list.
 *   2. `ensureSessionTurns` caches on first call, so a send into a conversation
 *      that had been opened once returned the pre-send page.
 *   3. Neither was re-read after a send, so the transcript stayed empty.
 *
 * This pins the fix in place. It reads the source rather than mounting the page:
 * the failure is a missing call, and a mount test with a stubbed store would not
 * see it.
 */
const here = resolve(__dirname, '..')
const page = readFileSync(resolve(here, 'src/AgentsPage.vue'), 'utf8')
const store = readFileSync(resolve(here, 'src/store.ts'), 'utf8')

/**
 * The function body, starting after the parameter list.
 *
 * Scanning from the first `{` after the signature lands inside the parameters
 * (`(override?: string, ...?: Array<{ name: string }>)`), which returns a type
 * literal instead of the body. Skip the parameter list first.
 */
function bodyOf(source: string, signature: string): string {
  const start = source.indexOf(signature)
  expect(start, `missing ${signature}`).toBeGreaterThanOrEqual(0)
  const paramsOpen = source.indexOf('(', start)
  let depth = 0
  let paramsClose = paramsOpen
  for (let i = paramsOpen; i < source.length; i += 1) {
    if (source[i] === '(') depth += 1
    else if (source[i] === ')') {
      depth -= 1
      if (depth === 0) { paramsClose = i; break }
    }
  }
  const brace = source.indexOf('{', paramsClose)
  depth = 0
  for (let i = brace; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1
    else if (source[i] === '}') {
      depth -= 1
      if (depth === 0) return source.slice(brace, i + 1)
    }
  }
  throw new Error(`unbalanced block for ${signature}`)
}

describe('a send refreshes what it changed', () => {
  it('re-reads the task page so the new conversation has a row', () => {
    expect(bodyOf(page, 'async function send(override')).toContain('store.reloadTasks()')
  })

  it('re-reads the session turns with reload, so the cache cannot hide the message', () => {
    const body = bodyOf(page, 'async function send(override')
    expect(body).toContain('ensureSessionTurns(target, true)')
  })

  it('reload clears the cursor before asking for a full page', () => {
    const body = bodyOf(store, 'async function reloadTasks()')
    expect(body).toContain("taskCursor = ''")
  })

  it('the turns cache is bypassable', () => {
    const body = bodyOf(store, 'async function ensureSessionTurns(')
    expect(body).toContain('reload')
  })
})
