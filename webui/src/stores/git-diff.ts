// Turn a unified diff into lines a person can scan.
//
// A diff is text, and rendering it as text is the easy part. The hard part is
// the thing a reader actually needs from it: which lines are new, which are
// gone, and where the boundaries are — without the answer depending on whether
// the server sent `--- a/x` or `--- /dev/null`, or on whether the hunk header
// carries a function name.
//
// Kept separate from the component so it can be tested: a renderer that
// mislabels a `-` line as context turns a deletion into something that looks
// like it is still there.

export type DiffLineKind = 'add' | 'del' | 'context' | 'hunk' | 'meta';

export interface DiffLine {
  kind: DiffLineKind;
  /** The line with its leading marker removed (for add/del/context). */
  text: string;
  /** Old-file line number, when it applies. */
  oldLine?: number;
  /** New-file line number, when it applies. */
  newLine?: number;
}

export interface DiffFile {
  /** Best available path: the new one, falling back to the old. */
  path: string;
  /** True for a file that did not exist before (or was deleted). */
  added: boolean;
  deleted: boolean;
  lines: DiffLine[];
  added_: number;
  removed: number;
}

const HUNK_RE = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;

/**
 * Parse a unified diff.
 *
 * Everything that is not a hunk or a content line is metadata and kept as such,
 * because `index`, `new file mode` and `old mode` lines carry facts a reader
 * sometimes needs, and dropping them would be information loss in the name of
 * tidiness.
 */
export function parseUnifiedDiff(text: string): DiffFile[] {
  const source = String(text || '');
  if (!source.trim()) return [];

  const files: DiffFile[] = [];
  let current: DiffFile | null = null;
  let oldLine = 0;
  let newLine = 0;

  const startFile = (path: string, added: boolean, deleted: boolean) => {
    current = { path, added, deleted, lines: [], added_: 0, removed: 0 };
    files.push(current);
    oldLine = 0;
    newLine = 0;
  };

  const lines = source.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('diff --git ')) {
      // `diff --git a/path b/path` — take the new path, and strip the a/ prefix
      // later when the --- / +++ headers arrive (they are authoritative).
      const match = /^diff --git a\/(.+?) b\/(.+)$/.exec(line);
      startFile(match ? match[2] : '', false, false);
      current!.lines.push({ kind: 'meta', text: line });
      continue;
    }

    if (line.startsWith('+++ ') || line.startsWith('--- ')) {
      const marker = line.slice(0, 3);
      const raw = line.slice(4).trim();
      const value = raw === '/dev/null' ? '' : raw.replace(/^[ab]\//, '');
      if (!current) startFile(value, marker === '+++', false);
      if (marker === '---' && !value) current!.added = true;
      if (marker === '+++' && !value) current!.deleted = true;
      // The header path is authoritative over the `diff --git` guess.
      if (value && (marker === '+++' || !current!.path)) current!.path = value;
      current!.lines.push({ kind: 'meta', text: line });
      continue;
    }

    const hunk = HUNK_RE.exec(line);
    if (hunk) {
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[3]);
      if (!current) startFile('', false, false);
      current!.lines.push({ kind: 'hunk', text: line });
      continue;
    }

    if (!current) {
      // A diff body with no file header: treat it as one anonymous file rather
      // than dropping the lines.
      startFile('', false, false);
    }

    if (line.startsWith('+')) {
      current!.lines.push({ kind: 'add', text: line.slice(1), newLine });
      current!.added_ += 1;
      newLine += 1;
      continue;
    }
    if (line.startsWith('-')) {
      current!.lines.push({ kind: 'del', text: line.slice(1), oldLine });
      current!.removed += 1;
      oldLine += 1;
      continue;
    }
    if (line.startsWith(' ')) {
      current!.lines.push({ kind: 'context', text: line.slice(1), oldLine, newLine });
      oldLine += 1;
      newLine += 1;
      continue;
    }
    if (line.startsWith('\\')) {
      // "\ No newline at end of file" — true, and worth keeping.
      current!.lines.push({ kind: 'meta', text: line });
      continue;
    }
    if (line === '') {
      // A trailing blank line is an artefact of splitting, not a diff line.
      continue;
    }
    current!.lines.push({ kind: 'meta', text: line });
  }

  return files.filter((file) => file.path || file.lines.length > 0);
}

/**
 * The change a status entry describes, in words.
 *
 * Porcelain gives two letters; a person wants "new file", "modified", "renamed".
 * The index letter describes the staged change and the worktree letter the
 * unstaged one, so both are read.
 */
export function describeStatus(index: string, worktree: string): string {
  const i = index || ' ';
  const w = worktree || ' ';
  if (i === '?' && w === '?') return 'untracked';
  if (i === 'A') return 'added';
  if (i === 'D' || w === 'D') return 'deleted';
  if (i === 'R') return 'renamed';
  if (i === 'C') return 'copied';
  if (i === 'M' || w === 'M') return 'modified';
  if (i === 'U' || w === 'U') return 'conflict';
  return 'changed';
}

/**
 * Is one side of a porcelain entry staged?
 *
 * The index column is the staged state: `.` or a space means nothing is staged,
 * anything else means something is. `??` (untracked) is never staged.
 */
export function isStaged(index: string, worktree: string): boolean {
  if (index === '?' || worktree === '?') return false;
  return index !== ' ' && index !== '.' && index !== '';
}

/** Group status entries into what a commit screen shows. */
export function groupStatus(files: Array<{ path: string; index: string; worktree: string }>): {
  staged: Array<{ path: string; state: string }>;
  unstaged: Array<{ path: string; state: string }>;
} {
  const staged: Array<{ path: string; state: string }> = [];
  const unstaged: Array<{ path: string; state: string }> = [];
  for (const file of files) {
    const state = describeStatus(file.index, file.worktree);
    if (isStaged(file.index, file.worktree)) staged.push({ path: file.path, state });
    // A file can be both: staged content plus a further edit in the worktree.
    // Showing it in both lists is honest; hiding one side loses the fact that a
    // commit would not include what the person just typed.
    if (!isStaged(file.index, file.worktree) || (file.worktree !== ' ' && file.worktree !== '.')) {
      unstaged.push({ path: file.path, state });
    }
  }
  return { staged, unstaged };
}