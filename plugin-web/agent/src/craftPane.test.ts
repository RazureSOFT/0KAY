import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * The craft pane is the visible half of the four-stage loop.
 *
 * Everything it needs can be quietly missing and still look fine: a stage list
 * that never highlights, a score that prints "undefined%", a mismatch list that
 * silently renders nothing, a change request box that sends an empty operation.
 * These are static assertions because the failure mode is a missing wire, not a
 * wrong calculation — the calculation is covered by the agent-side tests.
 */
const here = resolve(__dirname)
const page = readFileSync(resolve(here, 'AgentsPage.vue'), 'utf8')
const composable = readFileSync(resolve(here, 'composables/useCraftProject.ts'), 'utf8')

describe('craft pane', () => {
  it('is a tab that only a craft task offers', () => {
    /* The condition moved from a `v-if` in the button row into the `taskTabs` computed
       when the tab bar became a MD3 Tabs component. What matters is unchanged: the craft
       tab is gated on the task kind, and its panel is gated on the selected tab. */
    expect(page).toContain(`taskDetail.value?.state.kind === 'craft'`)
    expect(page).toContain(`id: 'craft'`)
    expect(page).toContain(`v-else-if="taskDetailTab === 'craft'"`)
  })

  it('renders the four stages from the project, not a hardcoded list', () => {
    expect(page).toContain('v-for="stage in craftStages"')
    expect(composable).toContain(`'study', 'build', 'check', 'ready'`)
  })

  it('shows every measurement the check produced', () => {
    for (const field of ['craftLatest?.overall', 'craftLatest?.element', 'craftLatest?.pixel', 'craftLatest?.confidence']) {
      expect(page).toContain(field)
    }
  })

  it('never prints a missing measurement as a number', () => {
    // A dash for "not measured yet"; `${undefined}%` is the bug this guards.
    expect(composable).toContain(`value == null ? '—' : \`\${value}%\``)
    expect(page).not.toContain('craftLatest?.pixel }}%')
  })

  it('lists the per-width checks with a pass verdict', () => {
    expect(page).toContain('v-for="row in craftChecklist"')
    expect(page).toContain('craftPass')
    expect(page).toContain('craftFail')
  })

  it('lists the actionable differences, and says so when there are none', () => {
    expect(page).toContain('v-for="(diff, index) in craftDifferences.slice(0, 40)"')
    expect(page).toContain('craftNoDifferences')
    expect(page).toContain('craftMore')
  })

  it('sends every button through the assessments craft action', () => {
    for (const op of ['study', 'build', 'check', 'request', 'apply', 'ready', 'mode', 'threshold', 'project']) {
      expect(composable).toContain(`operation: '${op}'`)
    }
    expect(composable).toContain(`action: 'craft'`)
    expect(composable).toContain(`id: taskId.value`)
  })

  it('refreshes the pane after every action so the state shown is the state saved', () => {
    expect(composable).toMatch(/const result = await runAssessments[\s\S]*await reload\(\)/)
  })

  it('reports a failure inline instead of throwing out of the handler', () => {
    expect(composable).toContain('craftError.value = e?.message || String(e)')
    expect(page).toContain('v-if="craftError"')
  })

  it('opens artifacts through the file viewer', () => {
    expect(composable).toContain('openPath(row.absolute)')
    expect(page).toContain('@click="craftOpen(row)"')
    expect(page).toContain('@click="craftOpenReport()"')
    expect(page).toContain('@click="craftOpenApp()"')
  })

  it('shows the evidence limitations rather than only the score', () => {
    expect(page).toContain('craftLimitations')
    expect(composable).toContain('craft.value?.limitations')
  })

  it('keeps the change-request box from sending an empty request', () => {
    expect(page).toContain(':disabled="craftBusy || !craftRequestText.trim()"')
    // The guard is in the handler too: a disabled attribute can be bypassed by
    // Enter in some browsers, and an empty request would reopen Build for nothing.
    expect(composable).toMatch(/const text = craftRequestText\.value\.trim\(\)\s*if \(!text\) return/)
  })
})