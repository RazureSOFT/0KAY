import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * A stop has to answer the click, not the next stream tick.
 *
 * The server marks a task cancelled immediately, but the delta used to arrive
 * empty, so the page kept showing "running" until a refresh pulled the full
 * list. The stream fix lives in Core; these checks pin the browser's half of
 * the contract: reflect the stop locally first, then read the real state back.
 */
const here = resolve(__dirname, '..')
const store = readFileSync(resolve(here, 'src/store.ts'), 'utf8')
const page = readFileSync(resolve(here, 'src/AgentsPage.vue'), 'utf8')

describe('stopping responds immediately', () => {
  it('marks the task cancelled locally before awaiting the request', () => {
    expect(store).toContain("taskCache.set(task_id, { ...row, state: 'cancelled' })")
    expect(store).toContain('recompute()')
  })

  it('reads server state back without a full reset', () => {
    expect(store).toContain('async function pullTasks()')
    expect(store).toContain('await pullTasks()')
    expect(store).toContain('incremental=1&cursor=${encodeURIComponent(taskCursor)}')
  })

  it('does not leave the optimistic mark behind when the request fails', () => {
    expect(store).toMatch(/catch \(error\) \{\s*await pullTasks\(\)\s*throw error/)
  })

  it('gives the stop button a target even when active is null', () => {
    expect(page).toContain('const target = active.value || steerTarget.value')
  })
})
