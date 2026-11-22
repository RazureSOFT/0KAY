import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolStepCard from './ToolStepCard.vue'
import type { TaskRow } from './store'

/**
 * The tool card's visual contract.
 *
 * Two things this file exists to hold:
 *
 *  1. **It must not lift on hover.** The card used to rise 2px with a `shadow-3` under the
 *     cursor. A transcript holds dozens of steps, so brushing the list made every row it
 *     crossed bob — a list of information behaving like a row of buttons.
 *  2. **It matches the demo's metrics** (radius 12, head padding 8/12, 44px touch target),
 *     which is the reference the visual work was pointed at.
 *
 * These are style assertions, not render assertions, so they read the stylesheet the
 * component ships. That is deliberate: the values are the deliverable here, and a
 * rendered-mount test would pass just as happily with the old 16px radius.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/* `__dirname` rather than `new URL(..., import.meta.url)`: under this vitest config the
   module URL is not a `file:` URL, and `readFileSync` rejects it. `craftPane.test.ts`
   reads sources the same way. */
const here = resolve(__dirname)
const source = readFileSync(resolve(here, 'ToolStepCard.vue'), 'utf8')
const pageCss = readFileSync(resolve(here, 'styles/agents-page.css'), 'utf8')
const themeCss = readFileSync(resolve(here, '../../../webui/src/styles/theme.css'), 'utf8')

/** The component's own `<style>` block. */
const style = source.slice(source.indexOf('<style'))

const step = {
  task_id: 't1',
  kind: 'tool',
  prompt: 'write',
  state: 'done',
  result: 'ok',
  started_at: '2026-11-21T10:00:00+08:00',
} as unknown as TaskRow

describe('ToolStepCard', () => {
  it('renders a tool kind label', () => {
    // No i18n bundle is loaded here, so the label resolves to its key. The assertion is
    // that the element renders and carries the tool's name through the lookup — not the
    // translated string, which depends on locale files this suite does not load.
    const wrapper = mount(ToolStepCard, { props: { step } })
    expect(wrapper.find('.tool-kind').text()).toContain('write')
    wrapper.unmount()
  })

  it('uses the shape token for its radius, not a literal', () => {
    // 16px was the old value; the demo uses `shape-medium` (12).
    expect(style).toContain('border-radius:var(--md-shape-medium)')
    expect(style).not.toMatch(/\.tool-card\{[^}]*border-radius:16px/)
  })

  it('sits on the quieter surface step', () => {
    // `surface-container-low`, one step below the `surface-container` it used, so a run of
    // steps does not read as a stack of bright panels.
    expect(style).toMatch(/\.tool-card\{[^}]*background:var\(--md-surface-container-low\)/)
  })

  it('keeps a 44px minimum on the header', () => {
    // The audit listed 44 as the touch minimum; the card was 46, the demo 44.
    expect(style).toContain('min-height:44px')
    expect(style).toContain('padding:8px 12px')
  })

  it('does not lift on hover, in the component or the page stylesheet', () => {
    // The component's own rule.
    expect(style).not.toMatch(/\.tool-card:hover\{[^}]*translateY/)
    expect(style).not.toMatch(/\.tool-card:hover\{[^}]*shadow/)

    // And the page's global rule, which would win anyway.
    const hoverRules = [...pageCss.matchAll(/\.tool-card:hover[^{]*\{([^}]*)\}/g)].map((m) => m[1])
    for (const body of hoverRules) {
      expect(body, 'a tool card must not move or cast a shadow on hover').not.toMatch(/translateY|shadow-[0-9]/)
    }
  })

  it('still lets the sub-agent card lift, because that one opens', () => {
    // The rule that removed the lift was shared by both cards; this keeps the other half.
    expect(pageCss).toMatch(/\.subagent-card:hover\{[^}]*translateY\(-2px\)/)
  })

  it('collapses to the header height, not to the header plus padding', () => {
    /*
     * The step body carries 8px + 15px of padding and a 1px rule. A `0fr` grid track has
     * an `auto` minimum, and `overflow: hidden` cannot remove the child's own padding — so
     * every collapsed step stood 24px taller than its header, which is 780px of nothing
     * across thirty steps.
     *
     * The contract lives in the host stylesheet (`.collapse-grid`), which MessageBubble
     * shares, and is asserted there. Whitespace is matched loosely: the rule is written
     * multi-line, and pinning that layout would make reformatting the file a test failure.
     */
    const collapsed = /\.collapse-grid:not\(\.open\)\s*>\s*\*\s*{([^}]*)}/.exec(themeCss)
    expect(collapsed, ".collapse-grid must zero the child's padding when closed").not.toBeNull()
    expect(collapsed![1]).toMatch(/padding-block:\s*0/)
    expect(collapsed![1]).toMatch(/border-block-start-width:\s*0/)
  })

  it('lets the open state keep its padding', () => {
    // The zeroing is scoped to `:not(.open)`; a blanket rule would flatten every body.
    const open = /\.collapse-grid\.open\s*{([^}]*)}/.exec(themeCss)
    expect(open, '.collapse-grid.open must exist').not.toBeNull()
    expect(open![1]).toMatch(/grid-template-rows:\s*1fr/)
    // And the blanketed form must not be present.
    expect(themeCss).not.toMatch(/\.collapse-grid\s*\*[^{]*\{[^}]*padding-block:\s*0/)
  })

  it('uses a state layer rather than a container fill for the header hover', () => {
    // A full `secondary-container` fill flashed every row the cursor crossed.
    expect(style).toMatch(/tool-card-head:hover\{background:color-mix/)
    expect(style).not.toMatch(/tool-card-head:hover\{background:var\(--md-secondary-container\)/)
  })
})