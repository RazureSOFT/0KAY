import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ThinkChain from './ThinkChain.vue'

// The harness check: a component with props and a reactive `<details>` renders as
// a user would see it, without a running WebUI. This is the pattern the bigger
// extractions are meant to reuse.
describe('ThinkChain', () => {
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
})
