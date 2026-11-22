import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskViewDemo from './TaskViewDemo.vue'

/**
 * The task view, and the two things an earlier version got wrong:
 *
 *  1. It had ten tabs with content in only one. A tab that renders nothing is
 *     indistinguishable from a tab that is broken, and neither is visible without
 *     clicking through every one.
 *  2. It showed a recon page for every task kind. The three kinds have different goals
 *     (see `agent/src/analysis/recon/loop.ts`), so their sub-pages differ in vocabulary
 *     as well as data — 发现/图谱 for recon, 改动/回归 for engineering, 阶段/差异清单 for
 *     craft.
 *
 * "Has content" is asserted loosely (a character count) because pinning copy would make
 * every wording change a failure. The regression worth catching is a tab that shows
 * nothing, or a kind that shows another kind's page.
 */

const task = { objective: '对 dsh 目标做端口与服务取证', kind: 'recon', status: 'running', met: 4, total: 11 }

function mountView() {
  return mount(TaskViewDemo, { props: { task }, attachTo: document.body })
}

type Wrapper = ReturnType<typeof mountView>

/** Tab labels as rendered, with badge digits stripped. */
function tabLabels(wrapper: Wrapper) {
  return wrapper.findAll('[role="tab"]').map((t) => t.text().replace(/\d+/g, '').trim())
}

/** Click the tab whose label starts with the given text, then return the body. */
async function openTab(wrapper: Wrapper, label: string) {
  const target = wrapper.findAll('[role="tab"]').find((t) => t.text().startsWith(label))
  if (!target) throw new Error(`no tab labelled ${label}; have ${tabLabels(wrapper).join('/')}`)
  await target.trigger('click')
  await wrapper.vm.$nextTick()
  return wrapper.find('.tv-body')
}

/** Switch the demo's kind: 0 = recon, 1 = engineering, 2 = craft. */
async function pickKind(wrapper: Wrapper, index: number) {
  await wrapper.findAll('.tv-kinds .md-button-group__item')[index].trigger('click')
  await wrapper.vm.$nextTick()
}

describe('TaskViewDemo', () => {
  it('gives recon its own tab set', () => {
    const wrapper = mountView()
    expect(tabLabels(wrapper)).toEqual([
      '会话', '总览', '计划评审', '探索链路', '播报板', '发现', '测试资产', '拦截审批', '报告',
    ])
    wrapper.unmount()
  })

  it('gives engineering 改动清单 and 回归检查 instead of recon tabs', async () => {
    // An engineering task has no graph to explore and no assets to test; what it has is
    // a diff and a regression baseline.
    const wrapper = mountView()
    await pickKind(wrapper, 1)
    const labels = tabLabels(wrapper)
    expect(labels).toContain('改动清单')
    expect(labels).toContain('回归检查')
    expect(labels).not.toContain('探索链路')
    expect(labels).not.toContain('测试资产')
    wrapper.unmount()
  })

  it('gives craft 复刻 and 差异清单', async () => {
    const wrapper = mountView()
    await pickKind(wrapper, 2)
    const labels = tabLabels(wrapper)
    expect(labels).toContain('复刻')
    expect(labels).toContain('差异清单')
    expect(labels).not.toContain('探索链路')
    wrapper.unmount()
  })

  it('gives every tab of every kind substantive content', async () => {
    const wrapper = mountView()
    for (const kindIndex of [0, 1, 2]) {
      await pickKind(wrapper, kindIndex)
      const count = wrapper.findAll('[role="tab"]').length
      expect(count, `kind ${kindIndex} has tabs`).toBeGreaterThan(5)

      for (let index = 0; index < count; index += 1) {
        const label = wrapper.findAll('[role="tab"]')[index].text().replace(/\d+/g, '').trim()
        await wrapper.findAll('[role="tab"]')[index].trigger('click')
        await wrapper.vm.$nextTick()
        /* 40 characters is a low bar on purpose: a tab that renders only a heading has
           far fewer. */
        expect(
          wrapper.find('.tv-body').text().length,
          `kind ${kindIndex} / tab ${label} is empty`,
        ).toBeGreaterThan(40)
      }
    }
    wrapper.unmount()
  })

  it('draws the graph as SVG with nodes and edges', async () => {
    const wrapper = mountView()
    await openTab(wrapper, '探索链路')
    expect(wrapper.findAll('.gnode').length).toBeGreaterThan(4)
    expect(wrapper.findAll('.edge').length).toBeGreaterThan(3)
    wrapper.unmount()
  })

  it('renders four lane types differently', async () => {
    // main and planner are consoles (conversation + own composer), retest is a record
    // list, worker is a tool trace. One shared detail view was the earlier mistake.
    const wrapper = mountView()

    await wrapper.findAll('.sess-row')[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.console').exists()).toBe(true)
    expect(wrapper.find('.hint').exists()).toBe(true)
    await wrapper.find('.sess-back').trigger('click')

    const plannerRow = wrapper.findAll('.sess-row').find((r) => r.text().includes('第 3 轮'))
    expect(plannerRow, 'a planner round must be its own lane').toBeTruthy()
    await plannerRow!.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.console').exists()).toBe(true)
    expect(wrapper.text()).toContain('第 3 轮')
    await wrapper.find('.sess-back').trigger('click')

    const workerRow = wrapper.findAll('.sess-row').find((r) => r.text().includes('端口与服务枚举'))
    await workerRow!.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.trace').exists()).toBe(true)
    expect(wrapper.findAll('.trace-step').length).toBeGreaterThan(1)
    await wrapper.find('.sess-back').trigger('click')

    const retestRow = wrapper.findAll('.sess-row').find((r) => r.text().includes('复测'))
    await retestRow!.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.retests li').length).toBeGreaterThan(1)
    wrapper.unmount()
  })

  it('opens a planner round from the plans tab and lands on that round', async () => {
    // The plans tab is a summary across rounds; each round is still a lane of its own,
    // which is what stops three rounds reading as one plan that kept changing.
    const wrapper = mountView()
    await openTab(wrapper, '计划评审')
    const openButton = wrapper.find('.plan-open')
    expect(openButton.exists()).toBe(true)
    await openButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.console').exists()).toBe(true)
    expect(wrapper.find('.sess-view-head').exists()).toBe(true)
    wrapper.unmount()
  })

  it('keeps the sessions list grouped, not flat', () => {
    const wrapper = mountView()
    expect(wrapper.findAll('.sess-group').length).toBeGreaterThan(2)
    expect(wrapper.findAll('.sess-row').length).toBeGreaterThan(7)
    wrapper.unmount()
  })

  it('decides approvals and reports the outcome', async () => {
    const wrapper = mountView()
    await openTab(wrapper, '拦截审批')
    const before = wrapper.findAll('.approval-card').length
    expect(before).toBeGreaterThan(2)

    await wrapper.find('.approval-btn.is-deny').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.approval-card').length).toBe(before - 1)
    expect(wrapper.find('.tv-notice').exists()).toBe(true)
    wrapper.unmount()
  })

  it('changes the craft checks with the target type', async () => {
    // Craft rebuilds something observable, not specifically a web page: the backend
    // carries only `targets: string[]` with no type field. Three-width checks are
    // meaningful for a web page and meaningless for a CLI, so the check table has to
    // follow the target.
    const wrapper = mountView()
    await pickKind(wrapper, 2)
    await openTab(wrapper, '复刻')

    const webChecks = wrapper.find('.width-rows').text()
    expect(webChecks).toContain('768 px')
    expect(webChecks).toContain('截图')

    // switch to 命令行: the rows become commands and exit codes
    const targetGroup = wrapper.find('.craft-target .md-button-group')
    expect(targetGroup.exists()).toBe(true)
    await targetGroup.findAll('.md-button-group__item')[2].trigger('click')
    await wrapper.vm.$nextTick()

    const cliChecks = wrapper.find('.width-rows').text()
    expect(cliChecks).not.toBe(webChecks)
    expect(cliChecks).toContain('--help')
    expect(cliChecks).toContain('退出码')
    expect(cliChecks).not.toContain('768 px')
    wrapper.unmount()
  })

  it('changes the craft difference dimensions with the target type', async () => {
    const wrapper = mountView()
    await pickKind(wrapper, 2)

    await openTab(wrapper, '差异清单')
    expect(wrapper.find('.diffs').text()).toContain('spacing')

    /* The switch lives on the 复刻 tab, so change it there and come back. */
    await openTab(wrapper, '复刻')
    await wrapper.find('.craft-target .md-button-group').findAll('.md-button-group__item')[1].trigger('click')
    await wrapper.vm.$nextTick()
    await openTab(wrapper, '差异清单')
    const guiDiffs = wrapper.find('.diffs').text()
    expect(guiDiffs).toContain('control')
    expect(guiDiffs).not.toContain('spacing')
    wrapper.unmount()
  })

  it('writes a report that differs by kind', async () => {
    // The report is where all three kinds meet; its body must still say what kind of work
    // it is reporting.
    const wrapper = mountView()
    await openTab(wrapper, '报告')
    await wrapper.find('.report-btn').trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 800))
    await wrapper.vm.$nextTick()
    const reconReport = wrapper.find('.report-out').text()
    expect(reconReport.length).toBeGreaterThan(80)

    await pickKind(wrapper, 2)
    await openTab(wrapper, '报告')
    await wrapper.findAll('.report-btn')[0].trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 800))
    await wrapper.vm.$nextTick()
    const craftReport = wrapper.find('.report-out').text()
    expect(craftReport).not.toBe(reconReport)
    expect(craftReport).toContain('相似度')
    wrapper.unmount()
  })
})