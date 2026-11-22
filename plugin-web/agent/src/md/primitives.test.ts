import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import IconButton from './IconButton.vue'
import Badge from './Badge.vue'
import LoadingIndicator from './LoadingIndicator.vue'
import Tooltip from './Tooltip.vue'

afterEach(() => {
  vi.useRealTimers()
})

describe('IconButton', () => {
  it('is a real button with an accessible name', () => {
    const wrapper = mount(IconButton, { props: { label: 'Add attachment' } })
    const button = wrapper.get('button')
    // Icon-only controls are unlabelled by nature; `aria-label` is not optional.
    expect(button.attributes('aria-label')).toBe('Add attachment')
    expect(button.attributes('type')).toBe('button')
  })

  it('uses the five-tier Expressive ramp from the tokens', () => {
    /* ContainerHeight from XSmall/Small/Medium/Large/XLargeIconButtonTokens:
       32 / 40 / 56 / 96 / 136. The first version used an invented 32/40/48/56/64,
       which understated medium by 8dp, large by 40dp and extra-large by 72dp. */
    const expected = { xs: 32, s: 40, m: 56, l: 96, xl: 136 } as const
    for (const [size, box] of Object.entries(expected)) {
      const wrapper = mount(IconButton, { props: { label: 'x', size: size as keyof typeof expected } })
      expect(wrapper.attributes('style') || '', `tier ${size}`).toContain(`--md-ib-box: ${box}px`)
      expect(wrapper.classes()).toContain('md-state-layer')
    }
  })

  it('scales the icon with the tier (IconSize 20/24/24/32/40)', () => {
    const expected = { xs: 20, s: 24, m: 24, l: 32, xl: 40 } as const
    for (const [size, icon] of Object.entries(expected)) {
      const wrapper = mount(IconButton, { props: { label: 'x', size: size as keyof typeof expected } })
      expect(wrapper.attributes('style') || '', `tier ${size} icon`).toContain(`--md-ib-icon: ${icon}px`)
    }
  })

  it('reserves the per-tier outlined border width', () => {
    // OutlinedOutlineWidth: 1dp at xs/s/m, 2dp at l, 3dp at xl.
    const expected = { xs: 1, s: 1, m: 1, l: 2, xl: 3 } as const
    for (const [size, width] of Object.entries(expected)) {
      const wrapper = mount(IconButton, { props: { label: 'x', size: size as keyof typeof expected } })
      expect(wrapper.attributes('style') || '', `tier ${size} border`).toContain(`--md-ib-outline: ${width}px`)
    }
  })

  it('re-emits click so a parent @click actually fires', async () => {
    /* Declaring an emit named `click` makes Vue bind the parent's `@click` to the emit
       rather than to the DOM button. Without an explicit re-emit the component silently
       swallows every click: the button looks pressable, the state layer reacts to hover,
       and nothing happens. This broke every icon control on the page — attachments, the
       dock, copy — and was invisible to any test that only checked rendering. */
    const wrapper = mount(IconButton, { props: { label: 'Add' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click while disabled', async () => {
    const wrapper = mount(IconButton, { props: { label: 'Add', disabled: true } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('tightens the corner while pressed', () => {
    // PressedContainerShape is one step below the rest shape.
    const wrapper = mount(IconButton, { props: { label: 'x', size: 'm' } })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--md-ib-radius: 16px')
    expect(style).toContain('--md-ib-radius-pressed: 12px')
  })

  it('round buttons use the full shape token rather than a pixel radius', () => {
    const wrapper = mount(IconButton, { props: { label: 'x', round: true } })
    expect(wrapper.attributes('style')).toContain('var(--md-shape-full)')
  })

  it('passes the disabled state to the native button', () => {
    const wrapper = mount(IconButton, { props: { label: 'x', disabled: true } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })
})

describe('Badge', () => {
  it('small is a dot and renders no text', () => {
    // A number cannot fit in a 6dp circle; the old badge tried both at once.
    const wrapper = mount(Badge, { props: { size: 'small', value: 9 } })
    expect(wrapper.text()).toBe('')
    expect(wrapper.classes()).toContain('md-badge--small')
  })

  it('large renders its count', () => {
    const wrapper = mount(Badge, { props: { size: 'large', value: 3 } })
    expect(wrapper.text()).toBe('3')
    expect(wrapper.classes()).toContain('md-badge--large')
  })

  it('large with no value renders an empty container, not a stray number', () => {
    const wrapper = mount(Badge, { props: { size: 'large', value: '' } })
    expect(wrapper.text()).toBe('')
  })

  it('can be hidden from assistive tech', () => {
    // Common case: a dot on a button that already says "3 unread".
    const wrapper = mount(Badge, { props: { decorative: true, value: 2 } })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})

describe('LoadingIndicator', () => {
  it('uses the token sizes: 38dp active inside a 48dp container', () => {
    const wrapper = mount(LoadingIndicator)
    expect(wrapper.attributes('style')).toContain('--md-loading-box: 48px')
    expect(wrapper.attributes('style')).toContain('--md-loading-active: 38px')
  })

  it('keeps the 48:38 ratio when scaled', () => {
    const wrapper = mount(LoadingIndicator, { props: { size: 96 } })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--md-loading-box: 96px')
    // 96 * 38/48 = 76
    expect(style).toContain('--md-loading-active: 76px')
  })

  it('draws a morphing shape, not a rotating arc', () => {
    // The component is a seven-shape morph sequence; a circle-and-arc would be the
    // indeterminate circular *progress* indicator it is meant to replace.
    const wrapper = mount(LoadingIndicator)
    expect(wrapper.find('.md-loading__shape').exists()).toBe(true)
    expect(wrapper.find('circle').exists()).toBe(false)
    expect(wrapper.find('path').exists()).toBe(true)
  })

  it('steps through the seven spec shapes over time', async () => {
    vi.useFakeTimers()
    const wrapper = mount(LoadingIndicator, { attachTo: document.body })
    const seen = new Set<string>()
    const read = () => wrapper.find('path').attributes('d') || ''
    for (let step = 0; step < 10; step += 1) {
      vi.advanceTimersByTime(340)
      await nextTick()
      seen.add(read().slice(0, 40))
    }
    // With 650ms per morph, ~3.4s of virtual time must produce several distinct
    // outlines rather than one static path.
    expect(seen.size).toBeGreaterThan(2)
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('shows the contrast container only when contained', () => {
    expect(mount(LoadingIndicator).find('.md-loading__container').exists()).toBe(false)
    expect(mount(LoadingIndicator, { props: { contained: true } }).find('.md-loading__container').exists()).toBe(true)
  })

  it('is a progressbar, hidden from AT unless labelled', () => {
    expect(mount(LoadingIndicator).attributes('role')).toBe('progressbar')
    expect(mount(LoadingIndicator).attributes('aria-hidden')).toBe('true')
    const labelled = mount(LoadingIndicator, { props: { label: 'Loading files' } })
    expect(labelled.attributes('aria-label')).toBe('Loading files')
  })
})

describe('Tooltip', () => {
  it('shows on hover after the delay, and hides on leave', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      props: { delay: 100 },
      slots: { default: () => 'trigger', title: () => 'Title', body: () => 'Body' },
      attachTo: document.body,
    })
    await wrapper.get('.md-tooltip-anchor').trigger('pointerenter')
    // Not visible yet: the delay exists so a tooltip does not flash while the
    // pointer crosses a toolbar.
    expect(document.querySelector('.md-tooltip')).toBeNull()
    vi.advanceTimersByTime(120)
    await nextTick()
    await nextTick()
    expect(document.querySelector('.md-tooltip')).not.toBeNull()
    await wrapper.get('.md-tooltip-anchor').trigger('pointerleave')
    await nextTick()
    expect(document.querySelector('.md-tooltip')).toBeNull()
    wrapper.unmount()
  })

  it('shows immediately on keyboard focus', async () => {
    // The CSS-only version handled :hover and nothing else, so keyboard users
    // never saw a tooltip at all.
    const wrapper = mount(Tooltip, {
      props: { delay: 5000 },
      slots: { default: () => 'trigger' },
      attachTo: document.body,
    })
    await wrapper.get('.md-tooltip-anchor').trigger('focusin')
    await nextTick()
    await nextTick()
    expect(document.querySelector('.md-tooltip')).not.toBeNull()
    wrapper.unmount()
  })

  it('dismisses on Escape', async () => {
    const wrapper = mount(Tooltip, {
      props: { delay: 0 },
      slots: { default: () => 'trigger' },
      attachTo: document.body,
    })
    await wrapper.get('.md-tooltip-anchor').trigger('focusin')
    await nextTick()
    await nextTick()
    expect(document.querySelector('.md-tooltip')).not.toBeNull()
    await wrapper.get('.md-tooltip-anchor').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(document.querySelector('.md-tooltip')).toBeNull()
    wrapper.unmount()
  })

  it('stays inert when disabled', async () => {
    const wrapper = mount(Tooltip, {
      props: { disabled: true },
      slots: { default: () => 'trigger' },
      attachTo: document.body,
    })
    await wrapper.get('.md-tooltip-anchor').trigger('pointerenter')
    await wrapper.get('.md-tooltip-anchor').trigger('focusin')
    await nextTick()
    expect(document.querySelector('.md-tooltip')).toBeNull()
    wrapper.unmount()
  })
})