import { describe, expect, test } from 'vitest'
import { describeStatus, groupStatus, isStaged, parseUnifiedDiff } from './git-diff'

const DIFF = [
  'diff --git a/src/a.ts b/src/a.ts',
  'index 1111111..2222222 100644',
  '--- a/src/a.ts',
  '+++ b/src/a.ts',
  '@@ -1,4 +1,5 @@',
  ' const keep = 1',
  '-const gone = 2',
  '+const added = 3',
  '+const also = 4',
  ' const tail = 5',
  '',
].join('\n')

describe('parseUnifiedDiff', () => {
  test('reads a hunk into numbered add, del and context lines', () => {
    const [file] = parseUnifiedDiff(DIFF)
    expect(file.path).toBe('src/a.ts')
    expect(file.added_).toBe(2)
    expect(file.removed).toBe(1)
    const kinds = file.lines.filter((line) => line.kind === 'add' || line.kind === 'del' || line.kind === 'context')
    expect(kinds.map((line) => line.kind)).toEqual(['context', 'del', 'add', 'add', 'context'])
  })

  test('line numbers follow both sides of the hunk', () => {
    const [file] = parseUnifiedDiff(DIFF)
    const context = file.lines.filter((line) => line.kind === 'context')
    const del = file.lines.find((line) => line.kind === 'del')!
    const adds = file.lines.filter((line) => line.kind === 'add')
    // The first context line is line 1 on both sides.
    expect(context[0]).toMatchObject({ oldLine: 1, newLine: 1 })
    // The deletion sits at old line 2, and does not advance the new side.
    expect(del.oldLine).toBe(2)
    expect(del.newLine).toBeUndefined()
    // The additions take the new-side numbers 2 and 3.
    expect(adds.map((line) => line.newLine)).toEqual([2, 3])
    // The trailing context is old 3 / new 4: the deletion and two additions
    // cancel out against each other.
    expect(context[1]).toMatchObject({ oldLine: 3, newLine: 4 })
  })

  test('a marker character inside a line is kept, not eaten', () => {
    // `+++` (add a line that starts with `+`) must not be mistaken for a header
    // when it is not at the start of a diff.
    const diff = ['--- a/x', '+++ b/x', '@@ -1 +1 @@', '-old', '++i'].join('\n')
    const [file] = parseUnifiedDiff(diff)
    expect(file.lines.find((line) => line.kind === 'add')?.text).toBe('+i')
  })

  test('a new file is marked as added and carries no old path', () => {
    const diff = ['diff --git a/new.ts b/new.ts', 'new file mode 100644', '--- /dev/null', '+++ b/new.ts', '@@ -0,0 +1,2 @@', '+one', '+two'].join('\n')
    const [file] = parseUnifiedDiff(diff)
    expect(file.added).toBe(true)
    expect(file.deleted).toBe(false)
    expect(file.path).toBe('new.ts')
    expect(file.added_).toBe(2)
  })

  test('a deleted file is marked as deleted', () => {
    const diff = ['diff --git a/gone.ts b/gone.ts', 'deleted file mode 100644', '--- a/gone.ts', '+++ /dev/null', '@@ -1,2 +0,0 @@', '-one', '-two'].join('\n')
    const [file] = parseUnifiedDiff(diff)
    expect(file.deleted).toBe(true)
    expect(file.path).toBe('gone.ts')
    expect(file.removed).toBe(2)
  })

  test('two files in one diff stay separate', () => {
    const diff = [
      'diff --git a/one.ts b/one.ts', '--- a/one.ts', '+++ b/one.ts', '@@ -1 +1 @@', '-a', '+b',
      'diff --git a/two.ts b/two.ts', '--- a/two.ts', '+++ b/two.ts', '@@ -1 +1 @@', '-c', '+d',
    ].join('\n')
    const files = parseUnifiedDiff(diff)
    expect(files.map((file) => file.path)).toEqual(['one.ts', 'two.ts'])
    expect(files[0].added_).toBe(1)
    expect(files[1].added_).toBe(1)
  })

  test('the no-newline marker is kept as metadata, not read as a change', () => {
    const diff = ['--- a/x', '+++ b/x', '@@ -1 +1 @@', '-old', '\\ No newline at end of file', '+new'].join('\n')
    const [file] = parseUnifiedDiff(diff)
    expect(file.lines.some((line) => line.kind === 'meta' && line.text.startsWith('\\'))).toBe(true)
    expect(file.added_).toBe(1)
    expect(file.removed).toBe(1)
  })

  test('an empty diff is no files, not one empty file', () => {
    expect(parseUnifiedDiff('')).toEqual([])
    expect(parseUnifiedDiff('   \n  ')).toEqual([])
  })

  test('the header path wins over the diff --git guess', () => {
    // A rename shows the old path in `diff --git`; `+++` carries the new one.
    const diff = ['diff --git a/old-name.ts b/new-name.ts', '--- a/old-name.ts', '+++ b/new-name.ts', '@@ -1 +1 @@', '-a', '+b'].join('\n')
    const [file] = parseUnifiedDiff(diff)
    expect(file.path).toBe('new-name.ts')
  })
})

describe('describeStatus', () => {
  test('porcelain letters become words', () => {
    expect(describeStatus('?', '?')).toBe('untracked')
    expect(describeStatus('A', ' ')).toBe('added')
    expect(describeStatus('M', ' ')).toBe('modified')
    expect(describeStatus(' ', 'M')).toBe('modified')
    expect(describeStatus('R', ' ')).toBe('renamed')
    expect(describeStatus('D', ' ')).toBe('deleted')
  })

  test('a deletion in the worktree is a deletion', () => {
    expect(describeStatus(' ', 'D')).toBe('deleted')
  })
})

describe('isStaged', () => {
  test('the index column decides, not the worktree one', () => {
    expect(isStaged('M', ' ')).toBe(true)
    expect(isStaged('M', 'M')).toBe(true)
    expect(isStaged(' ', 'M')).toBe(false)
    expect(isStaged('.', 'M')).toBe(false)
  })

  test('an untracked file is never staged', () => {
    expect(isStaged('?', '?')).toBe(false)
  })
})

describe('groupStatus', () => {
  test('splits staged from unstaged', () => {
    const groups = groupStatus([
      { path: 'staged.ts', index: 'M', worktree: ' ' },
      { path: 'loose.ts', index: ' ', worktree: 'M' },
      { path: 'new.ts', index: '?', worktree: '?' },
    ])
    expect(groups.staged.map((file) => file.path)).toEqual(['staged.ts'])
    expect(groups.unstaged.map((file) => file.path)).toEqual(['loose.ts', 'new.ts'])
  })

  test('a file staged and then edited again appears in both', () => {
    // Hiding one side would lose the fact that a commit will not include what
    // the person just typed.
    const groups = groupStatus([{ path: 'both.ts', index: 'M', worktree: 'M' }])
    expect(groups.staged.map((file) => file.path)).toEqual(['both.ts'])
    expect(groups.unstaged.map((file) => file.path)).toEqual(['both.ts'])
  })

  test('a clean tree is two empty lists', () => {
    expect(groupStatus([])).toEqual({ staged: [], unstaged: [] })
  })
})
