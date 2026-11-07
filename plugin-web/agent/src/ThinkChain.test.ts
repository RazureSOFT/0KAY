import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ThinkChain from './ThinkChain.vue'

// The harness check: a component with props and a reactive `<details>` renders as
// a user would see it, without a running WebUI. This is the pattern the bigger
// extractions are meant to reuse.
describe('ThinkChain', () => {
  afterEach(() => { vi.useRealTimers() })

  it('stays collapsed by default and shows the label', () => {
    const wrapper = mount(ThinkChain, { props: { reasoning: 'thinking…', label: 'Reasoning' } })
    expect(wrapper.find('summary').text()).toBe('Reasoning')
    expect(wrapper.find('details').attributes('open')).toBeUndefined()
  })

  it('opens when asked and shows the reasoning text', () => {
    const wrapper = mount(ThinkChain, { props: { reasoning: 'step one\nstep two', open: true, label: 'Reasoning' } })
    expect(wrapper.find('details').attributes('open')).toBeDefined()
    expect(wrapper.find('pre').text()).toContain('step two')
  })

  it('follows a prop change rather than snapshotting it', async () => {
    const wrapper = mount(ThinkChain, { props: { reasoning: 'first', label: 'Reasoning' } })
    await wrapper.setProps({ reasoning: 'second' })
    expect(wrapper.find('pre').text()).toBe('second')
  })

  it('renders an empty reasoning block without inventing text', () => {
    const wrapper = mount(ThinkChain, { props: { label: 'Reasoning' } })
    expect(wrapper.find('pre').text()).toBe('')
  })

  it('counts while the model is thinking and stops the clock afterwards', async () => {
    vi.useFakeTimers()
    // The host stub returns the key itself for messages with no placeholder, so
    // the summary text cannot show the number here. What this test can pin down
    // honestly is the clock's own behaviour: the pulse is present only while
    // running, so the ticker starts and stops with the `running` prop.
    const wrapper = mount(ThinkChain, {
      props: { reasoning: 'working', label: 'Reasoning', running: true, startedAt: new Date().toISOString() },
    })
    expect(wrapper.find('.think-pulse').exists()).toBe(true)
    vi.advanceTimersByTime(3000)
    await wrapper.setProps({ running: false })
    expect(wrapper.find('.think-pulse').exists()).toBe(false)
    // No timer survives the transition, so nothing updates the summary later.
    const frozen = wrapper.find('summary').text()
    vi.advanceTimersByTime(5000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('summary').text()).toBe(frozen)
  })
})
