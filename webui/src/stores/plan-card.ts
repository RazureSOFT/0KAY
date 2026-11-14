// A planning run ends with a plan, not with code. The agent's plan tool records
// it on the task row as a JSON string (see agent src/tools/plan.ts), and the
// transcript has to turn that into something a person can act on: a card with a
// Build button, not a wall of markdown.
//
// The parse is defensive on purpose. The row is written by one process and read
// by another, possibly after a version bump, so a missing or reshaped field has
// to degrade to "no plan here" instead of taking the whole transcript down.

export interface PlanCard {
  title: string
  markdown: string
  steps: number
  demoHtml?: string
}

/** Parse one row's `plan` field. Returns null when there is no usable plan. */
export function parsePlan(raw?: string): PlanCard | null {
  if (!raw) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') return null
  const value = parsed as Record<string, unknown>
  const markdown = String(value.markdown || '').trim()
  // A plan with no body is not a plan; an empty card with a Build button would
  // start a task with nothing in it.
  if (!markdown) return null
  const demo = value.demo_html
  return {
    title: String(value.title || ''),
    markdown,
    steps: Number(value.steps) || 0,
    ...(typeof demo === 'string' && demo ? { demoHtml: demo } : {}),
  }
}

/**
 * The most recent plan in a conversation.
 *
 * Only the newest one is offered for building: an older plan has usually been
 * superseded, and "build this plan" is only unambiguous when there is one
 * candidate. The earlier ones remain on disk as `.plan.md` files.
 */
export function latestPlan(rows: Array<Record<string, unknown>>): PlanCard | null {
  for (let i = rows.length - 1; i >= 0; i -= 1) {
    const raw = rows[i]?.plan
    const plan = parsePlan(typeof raw === 'string' ? raw : undefined)
    if (plan) return plan
  }
  return null
}
