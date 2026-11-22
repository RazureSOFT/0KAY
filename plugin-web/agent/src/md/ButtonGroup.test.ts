import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonGroup from './ButtonGroup.vue'

/**
 * Geometry and semantics of the MD3 button group.
 *
 * The eight segmented controls this replaces disagreed on height (26 / 30 / 32 /
 * 23px), on padding, and on what "selected" looked like. These tests pin the spec
 * values so a future tweak has to be deliberate:
 *
 *   - connected groups use 2dp between children at every size
 *   - the size steps drive height and inner corner radius
 *   - the smallest steps still give a 48dp target
 *   - the group renders its own buttons, so it can shape them at all
 */

const ITEMS = [
  { id: 'all', label: 'All' },
  { id: 'chat', label: 'Chats' },
  { id: 'life', label: 'Life' },
]

function mountGroup(props: Record<string, unknown> = {}) {
  return mount(ButtonGroup, { props: { items: ITEMS, modelValue: 'all', ...props } })
}

describe('ButtonGroup', () => {
  it('renders one button per item, not slot children', () => {
    // Owning the markup is what lets the group shape its children; a slot version
    // lost the cascade to the host `.btn` rule.
    const wrapper = mountGroup()
    expect(wrapper.findAll('.md-button-group__item')).toHaveLength(3)
    expect(wrapper.text()).toContain('All')
  })

  it('separates connected children by the token 2dp', () => {
    // ConnectedButtonGroupSmallTokens.BetweenSpace = 2dp
    const wrapper = mountGroup({ variant: 'connected' })
    expect(wrapper.attributes('style') || '').toContain('--md-bg-gap: 2px')
  })

  it('separates standard children by the token 12dp', () => {
    // ButtonGroupSmallTokens.BetweenSpace = 12dp. The first version used a
    // per-size ladder of 18/12/8, which does not exist upstream.
    const wrapper = mountGroup({ variant: 'standard' })
    expect(wrapper.attributes('style') || '').toContain('--md-bg-gap: 12px')
  })

  it('is 40dp tall, the only height the tokens define', () => {
    // Both ButtonGroupSmallTokens and ConnectedButtonGroupSmallTokens say 40dp, and
    // ButtonGroup.kt has no size-tier parameter. The first version used 48/56/64.
    const wrapper = mountGroup()
    expect(wrapper.attributes('style') || '').toContain('--md-bg-height: 40px')
  })

  it('uses the token inner corner 8dp, and 4dp while pressed', () => {
    // InnerCornerCornerSize = CornerValueSmall = 8dp
    // PressedInnerCornerCornerSize = CornerValueExtraSmall = 4dp
    const wrapper = mountGroup()
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--md-bg-inner: 8px')
    expect(style).toContain('--md-bg-inner-pressed: 4px')
  })

  it('rounds a selected middle segment fully, per SelectedInnerCornerPercent', () => {
    // SelectedInnerCornerCornerSizePercent = 50, i.e. the chosen segment becomes a pill
    // inside the group. Without this a selected segment is just a coloured square.
    const wrapper = mountGroup({ modelValue: 'chat' })
    const items = wrapper.findAll('.md-button-group__item')
    const middle = items[1].attributes('style') || ''
    expect(middle).toContain('var(--md-shape-full)')
  })

  it('rounds the outer corners with the full token, not a pixel value', () => {
    // The per-item radius is written inline (see itemRadius()), so the outer corner
    // is asserted on an item rather than on the container's style attribute.
    const wrapper = mountGroup({ shape: 'round' })
    const first = wrapper.findAll('.md-button-group__item')[0].attributes('style') || ''
    expect(first).toContain('var(--md-shape-full)')
  })

  it('has no background of its own', () => {
    const wrapper = mountGroup()
    expect(wrapper.classes()).toContain('md-button-group')
    expect(wrapper.attributes('style') || '').not.toContain('background')
  })

  it('emits single selection and marks it with aria-current', async () => {
    const wrapper = mountGroup()
    const buttons = wrapper.findAll('.md-button-group__item')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['chat'])
    // The controlled parent has not applied it yet, so 'all' is still current.
    expect(buttons[0].attributes('aria-current')).toBe('true')
  })

  it('does not emit when the selected item is clicked again', async () => {
    const wrapper = mountGroup({ modelValue: 'all' })
    await wrapper.findAll('.md-button-group__item')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('never emits for a disabled item', async () => {
    const wrapper = mount(ButtonGroup, {
      props: { items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B', disabled: true }], modelValue: 'a' },
    })
    const disabled = wrapper.findAll('.md-button-group__item')[1]
    expect(disabled.attributes('disabled')).toBeDefined()
    await disabled.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('toggles membership in multi-select mode', async () => {
    const wrapper = mount(ButtonGroup, {
      props: { items: ITEMS, multiple: true, modelValues: ['all'] },
    })
    const buttons = wrapper.findAll('.md-button-group__item')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValues')?.[0]).toEqual([['all', 'chat']])
    // Pressing an already-selected item removes it.
    await buttons[0].trigger('click')
    expect(wrapper.emitted('update:modelValues')?.[1]).toEqual([[]])
  })

  it('uses aria-pressed for multi-select and aria-current for single', () => {
    const single = mountGroup()
    expect(single.findAll('.md-button-group__item')[0].attributes('aria-current')).toBe('true')
    expect(single.findAll('.md-button-group__item')[0].attributes('aria-pressed')).toBeUndefined()

    const multi = mount(ButtonGroup, { props: { items: ITEMS, multiple: true, modelValues: ['all'] } })
    expect(multi.findAll('.md-button-group__item')[0].attributes('aria-pressed')).toBe('true')
    expect(multi.findAll('.md-button-group__item')[0].attributes('aria-current')).toBeUndefined()
  })

  it('exposes a group role only when labelled', () => {
    expect(mountGroup().attributes('role')).toBeUndefined()
    const labelled = mountGroup({ label: 'Task kind' })
    expect(labelled.attributes('role')).toBe('group')
    expect(labelled.attributes('aria-label')).toBe('Task kind')
  })
})