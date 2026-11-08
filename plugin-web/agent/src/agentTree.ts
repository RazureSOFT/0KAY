/**
 * The agents inside one conversation, as a flat list.
 *
 * A task is not one conversation. The main agent hands work to sub-agents, those
 * hand work to their own, and each of them has its own steps. Artex's task page
 * shows this as a sessions tab (planner / main / each worker); on the agent side
 * the same need is "let me open any of them without hunting for the card that
 * spawned it".
 *
 * Kept out of the page component so the traversal can be tested: the page itself
 * cannot mount in a test without a running WebUI.
 */

export interface AgentStepRow {
  task_id: string
  parent_id?: string
  kind?: string
  state?: string
  prompt?: string
  session_id?: string
  started_at?: string
}

export interface AgentNode<T extends AgentStepRow = AgentStepRow> {
  row: T
  /** 0 for a top-level turn, 1 for a sub-agent it spawned, and so on. */
  depth: number
  /** How many sub-agents this row spawned directly. */
  children: number
}

/**
 * Flatten a session's rows into main turns plus every sub-agent beneath them.
 *
 * Breadth-first on purpose: siblings end up next to each other, so a list of
 * eight parallel explorations reads as one group instead of eight interleaved
 * chains. A row whose parent is missing (a cut payload, an old record) is
 * treated as a top-level row rather than dropped — an unreachable transcript is
 * worse than an unindented one.
 *
 * `rows` must be every row for the session, not just the turns: the children are
 * found by walking `parent_id`.
 */
export function agentTree<T extends AgentStepRow>(rows: T[], kind: string = 'subagent'): Array<AgentNode<T>> {
  const byParent = new Map<string, T[]>()
  const ids = new Set(rows.map((row) => row.task_id))
  for (const row of rows) {
    const parent = row.parent_id || ''
    const list = byParent.get(parent) || []
    list.push(row)
    byParent.set(parent, list)
  }

  const out: Array<AgentNode<T>> = []
  const seen = new Set<string>()
  // Top level: a turn (no parent) or a row whose parent is not in the payload.
  const roots = rows.filter((row) => !row.parent_id || !ids.has(row.parent_id))
  const queue: Array<{ row: T; depth: number }> = roots.map((row) => ({ row, depth: 0 }))
  while (queue.length) {
    const next = queue.shift()!
    if (seen.has(next.row.task_id)) continue
    seen.add(next.row.task_id)
    const kids = (byParent.get(next.row.task_id) || []).filter((child) => (child.kind || '') === kind)
    out.push({ row: next.row, depth: next.depth, children: kids.length })
    for (const kid of kids) queue.push({ row: kid, depth: next.depth + 1 })
  }
  return out
}

/** Just the sub-agents, in tree order: what a picker lists. */
export function subAgents<T extends AgentStepRow>(rows: T[]): Array<AgentNode<T>> {
  return agentTree(rows).filter((node) => (node.row.kind || '') === 'subagent')
}

/**
 * The chain of sub-agents from the top down to `target`.
 *
 * This is how a picker jumps straight to a nested agent: the view navigates by a
 * stack, so "open the third child of the second child" means putting both on the
 * stack. An empty result means `target` is the main agent.
 */
export function focusChain<T extends AgentStepRow>(rows: T[], target: T): T[] {
  const byId = new Map(rows.map((row) => [row.task_id, row]))
  const chain: T[] = []
  let cursor: T | undefined = target
  const guard = new Set<string>()
  while (cursor && (cursor.kind || '') === 'subagent') {
    if (guard.has(cursor.task_id)) break // a cycle in corrupt data must not hang
    guard.add(cursor.task_id)
    chain.unshift(cursor)
    cursor = cursor.parent_id ? byId.get(cursor.parent_id) : undefined
  }
  return chain
}
