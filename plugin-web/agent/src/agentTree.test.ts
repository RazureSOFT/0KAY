import { describe, expect, it } from 'vitest'
import { agentTree, focusChain, subAgents, type AgentStepRow } from './agentTree'

function row(id: string, parent = '', kind = 'agent'): AgentStepRow {
  return { task_id: id, parent_id: parent, kind, state: 'done', prompt: id }
}

describe('agentTree', () => {
  it('lists main turns and the sub-agents they spawned', () => {
    const rows = [
      row('turn-1'),
      row('sub-a', 'turn-1', 'subagent'),
      row('turn-2'),
    ]
    const tree = agentTree(rows)
    expect(tree.map((node) => node.row.task_id)).toEqual(['turn-1', 'turn-2', 'sub-a'])
    expect(tree.find((node) => node.row.task_id === 'sub-a')?.depth).toBe(1)
    expect(tree.find((node) => node.row.task_id === 'turn-1')?.children).toBe(1)
  })

  it('nests a sub-agent under a sub-agent', () => {
    const rows = [
      row('turn-1'),
      row('sub-a', 'turn-1', 'subagent'),
      row('sub-b', 'sub-a', 'subagent'),
    ]
    const tree = agentTree(rows)
    expect(tree.find((node) => node.row.task_id === 'sub-b')?.depth).toBe(2)
  })

  it('groups siblings together rather than interleaving chains', () => {
    const rows = [
      row('turn-1'),
      row('sub-a', 'turn-1', 'subagent'),
      row('sub-b', 'turn-1', 'subagent'),
      row('sub-a1', 'sub-a', 'subagent'),
    ]
    const order = agentTree(rows).map((node) => node.row.task_id)
    // Both siblings before the grandchild: breadth-first, so parallel work reads
    // as one group.
    expect(order.indexOf('sub-a1')).toBeGreaterThan(order.indexOf('sub-b'))
  })

  it('keeps a row whose parent is missing instead of dropping it', () => {
    // A payload that was cut can lose a parent. The child must still be
    // reachable: an unindented transcript beats a missing one.
    const rows = [row('orphan', 'gone', 'subagent')]
    const tree = agentTree(rows)
    expect(tree.map((node) => node.row.task_id)).toEqual(['orphan'])
    expect(tree[0].depth).toBe(0)
  })

  it('does not visit a row twice when data names the same child in two places', () => {
    const rows = [row('turn-1'), row('dup', 'turn-1', 'subagent')]
    const ids = agentTree(rows).map((node) => node.row.task_id)
    expect(ids.filter((id) => id === 'dup')).toHaveLength(1)
  })

  it('returns only sub-agents for a picker', () => {
    const rows = [row('turn-1'), row('sub-a', 'turn-1', 'subagent'), row('tool-x', 'turn-1', 'tool')]
    expect(subAgents(rows).map((node) => node.row.task_id)).toEqual(['sub-a'])
  })

  it('is empty for a conversation with no sub-agents', () => {
    expect(agentTree([row('turn-1')])).toHaveLength(1)
    expect(subAgents([row('turn-1')])).toHaveLength(0)
  })
})

describe('focusChain', () => {
  const rows = [
    row('turn-1'),
    row('sub-a', 'turn-1', 'subagent'),
    row('sub-b', 'sub-a', 'subagent'),
  ]

  it('returns the whole path so a nested agent can be opened in one click', () => {
    const chain = focusChain(rows, rows[2])
    expect(chain.map((entry) => entry.task_id)).toEqual(['sub-a', 'sub-b'])
  })

  it('returns one entry for a sub-agent directly under a turn', () => {
    expect(focusChain(rows, rows[1]).map((entry) => entry.task_id)).toEqual(['sub-a'])
  })

  it('returns nothing for a main turn', () => {
    expect(focusChain(rows, rows[0])).toEqual([])
  })

  it('stops on a cycle instead of hanging', () => {
    const cyclic = [
      { task_id: 'a', parent_id: 'b', kind: 'subagent' },
      { task_id: 'b', parent_id: 'a', kind: 'subagent' },
    ] as AgentStepRow[]
    expect(focusChain(cyclic, cyclic[0]).length).toBeLessThanOrEqual(2)
  })
})
