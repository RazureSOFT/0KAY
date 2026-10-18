/**
 * Widen Core's workspace allow-list from the UI.
 *
 * Core confines the git panel and the agent's write/edit tools to a set of
 * directories: the Core working directory, the repository it runs from, the
 * user's home and the temp dir (see `agentWorkspaceRoots` in
 * core/internal/gateway/agent_git.go). The agent page's workspace picker browses
 * the whole filesystem, so picking a project on another drive is a normal
 * action — and it then fails every git call with
 * "path is outside the configured agent workspace roots".
 *
 * Settings → 工作区 exposes that list as `allowed_roots`; this helper appends one
 * directory to it. It is intentionally a read-modify-write against the settings
 * endpoint rather than a dedicated route: the value is ordinary operator config
 * and must stay visible and editable in the settings UI.
 */

const SECTION = 'workspace'
const FIELD = 'allowed_roots'

/** Trailing separators and case are irrelevant on Windows, so dedupe on that. */
function normalize(value: string): string {
  return value.trim().replace(/[\\/]+$/, '').toLowerCase()
}

export function parseRoots(raw: unknown): string[] {
  return String(raw ?? '')
    .split(/[,\r\n]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export async function allowWorkspaceRoot(dir: string): Promise<boolean> {
  const target = dir.trim()
  if (!target) return false
  try {
    const read = await fetch(`/api/settings/${SECTION}`, { signal: AbortSignal.timeout(10000) })
    if (!read.ok) return false
    const data = await read.json().catch(() => null)
    const roots = parseRoots(data?.values?.[FIELD])
    if (roots.some((root) => normalize(root) === normalize(target))) return true
    roots.push(target)
    const save = await fetch(`/api/settings/${SECTION}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [FIELD]: roots.join(',') }),
      signal: AbortSignal.timeout(10000),
    })
    return save.ok
  } catch {
    // Best effort: a failure here must never break the action that triggered it
    // (picking a workspace, or retrying a git call).
    return false
  }
}
