const SECTION = 'workspace'
const FIELD = 'allowed_roots'

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
    return false
  }
}
