import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Switching conversations must leave an open task behind.
 *
 * The bug: the task pane stayed up when another session was selected, so the
 * session list could not navigate anywhere while a task was open — the only exit
 * was the back button inside the pane. `choose()` and `create()` both now close
 * it, and this test pins that down: a static check, because the failure is a
 * missing line rather than a wrong value.
 */
const page = readFileSync(resolve(__dirname, 'AgentsPage.vue'), 'utf8')

function bodyOf(signature: string): string {
  const start = page.indexOf(signature)
  expect(start, `missing ${signature}`).toBeGreaterThanOrEqual(0)
  // Take the balanced block starting at the signature.
  const brace = page.indexOf('{', start)
  let depth = 0
  for (let i = brace; i < page.length; i += 1) {
    if (page[i] === '{') depth += 1
    else if (page[i] === '}') {
      depth -= 1
      if (depth === 0) return page.slice(brace, i + 1)
    }
  }
  throw new Error(`unbalanced block for ${signature}`)
}

describe('session navigation', () => {
  it('closes an open task when another session is chosen', () => {
    expect(bodyOf('function choose(id: string)')).toContain('closeTask()')
  })

  it('closes an open task when a new conversation starts', () => {
    expect(bodyOf('async function create()')).toContain('closeTask()')
  })
})
