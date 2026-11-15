import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * One composer, not two.
 *
 * The page used to stack a "say something while it works" input above the
 * textarea, so the box had two personalities and the user had to know which one
 * to use. The fix was to delete the extra input and let the composer switch
 * meaning when a run is in flight. This is a static check because the failure is
 * structural — a second input reappearing above the textarea is exactly the
 * regression, and it would still "work" if only the behaviour were tested.
 */
const here = resolve(__dirname, '..')
const page = readFileSync(resolve(here, 'src/AgentsPage.vue'), 'utf8')

describe('the composer is the only input', () => {
  it('has no separate steer input row', () => {
    expect(page).not.toContain('class="steer-row"')
    expect(page).not.toContain('class="steer-input"')
  })

  it('routes a send to the steer queue while a run is in flight', () => {
    expect(page).toContain("composerKind.value === 'steer'")
    expect(page).toContain('await sendSteer(text)')
  })

  it('drives the placeholder from the mode, not from the run state alone', () => {
    expect(page).toContain('const composerHint = computed(() => composerPlaceholder(')
  })

  it('renders the queue from the agent, not from what this tab sent', () => {
    expect(page).toContain('queuedRows(steerEntries.value, queuedMessages.value)')
    expect(page).toContain('store.steerQueue(')
  })

  it('polls the queue while a task runs, and stops with the page', () => {
    expect(page).toContain('steerTimer = setInterval(')
    expect(page).toContain('clearInterval(steerTimer)')
  })

  it('drops the queue when the conversation changes', () => {
    expect(page).toContain('watch(selectedId, () => { steerEntries.value = [] })')
  })

  it('says how many instructions the end of the run left unapplied', () => {
    expect(page).toContain("t('agent.page.steerDropped'")
  })

  // Clicking the send button used to call sendSteer() with no text while the
  // handler still read a second, now-deleted field: the click did nothing at
  // all, and only Enter worked. The button has to read the merged composer.
  it('the button path reads the merged composer', () => {
    expect(page).not.toContain('steerText')
    expect(page).toContain('text ?? draft.value')
    expect(page).toContain('@click="sendSteer()"')
  })

  it('a queued message keeps the files attached when it is drained', () => {
    expect(page).toContain('const files = attachments.value')
    expect(page).toContain('await send(next, files)')
  })
})