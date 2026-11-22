import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Tabs from './Tabs.vue'
import ProgressIndicator from './ProgressIndicator.vue'
import ExtendedFab from './ExtendedFab.vue'
import Toolbar from './Toolbar.vue'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'findings', label: 'Findings', badge: 3 },
  { id: 'report', label: 'Report', disabled: true },
]

describe('Tabs', () => {
  it('marks exactly one tab selected and exposes a tablist', () => {
    const w = mount(Tabs, { props: { tabs: TABS, modelValue: 'overview' } })
    expect(w.attributes('role')).toBe('tablist')
    const selected = w.findAll('[role="tab"]').filter((t) => t.attributes('aria-selected') === 'true')
    expect(selected).toHaveLength(1)
    expect(selected[0].text()).toContain('Overview')
  })

  it('emits on click but never for a disabled tab', async () => {
    const w = mount(Tabs, { props: { tabs: TABS, modelValue: 'overview' } })
    await w.findAll('[role="tab"]')[1].trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['findings'])
    await w.findAll('[role="tab"]')[2].trigger('click')
    expect(w.emitted('update:modelValue')).toHaveLength(1)
  })

  it('moves with arrow keys, skipping disabled tabs', async () => {
    const w = mount(Tabs, { props: { tabs: TABS, modelValue: 'overview' } })
    const tabs = w.findAll('[role="tab"]')
    // Navigate from the focused tab, not from the (possibly stale) prop: a
    // controlled parent may not have applied the first emission yet.
    await tabs[0].trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['findings'])
    // 'report' is disabled, so right from the last enabled tab wraps to overview.
    await tabs[1].trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')?.[1]).toEqual(['overview'])
  })

  it('uses a 48dp target for primary tabs', () => {
    const w = mount(Tabs, { props: { tabs: TABS, modelValue: 'overview' } })
    expect(w.classes()).toContain('md-tabs--primary')
  })
})

describe('ProgressIndicator', () => {
  it('is determinate when given a value, with aria bounds', () => {
    const w = mount(ProgressIndicator, { props: { value: 40 } })
    expect(w.attributes('aria-valuenow')).toBe('40')
    expect(w.attributes('aria-valuemin')).toBe('0')
    expect(w.attributes('aria-valuemax')).toBe('100')
    expect(w.classes()).not.toContain('is-indeterminate')
  })

  it('clamps out-of-range values instead of rendering them', () => {
    expect(mount(ProgressIndicator, { props: { value: 140 } }).attributes('aria-valuenow')).toBe('100')
    expect(mount(ProgressIndicator, { props: { value: -20 } }).attributes('aria-valuenow')).toBe('0')
  })

  it('is indeterminate when no value is given', () => {
    // An unknown end time is not the same as 0% done.
    const w = mount(ProgressIndicator)
    expect(w.classes()).toContain('is-indeterminate')
    expect(w.attributes('aria-valuenow')).toBeUndefined()
  })

  it('renders a ring for the circular variant', () => {
    const w = mount(ProgressIndicator, { props: { variant: 'circular', value: 50, size: 44 } })
    expect(w.findAll('circle')).toHaveLength(2)
    expect(w.attributes('style')).toContain('--md-progress-size: 44px')
  })
})

describe('ExtendedFab', () => {
  it('is labelled, not icon-only', () => {
    const w = mount(ExtendedFab, { props: { label: 'New chat' } })
    expect(w.text()).toContain('New chat')
    expect(w.attributes('aria-label')).toBe('New chat')
  })

  it('is 56dp at the default size and 48dp at the small step', () => {
    expect(mount(ExtendedFab, { props: { label: 'x' } }).classes()).toContain('md-extended-fab--md')
    expect(mount(ExtendedFab, { props: { label: 'x', size: 'sm' } }).classes()).toContain('md-extended-fab--sm')
  })

  it('carries a state layer and disables natively', () => {
    const w = mount(ExtendedFab, { props: { label: 'x', disabled: true } })
    expect(w.classes()).toContain('md-state-layer')
    expect(w.attributes('disabled')).toBeDefined()
  })
})

describe('Toolbar', () => {
  it('is a toolbar region only when labelled', () => {
    expect(mount(Toolbar).attributes('role')).toBeUndefined()
    expect(mount(Toolbar, { props: { label: 'Terminal' } }).attributes('role')).toBe('toolbar')
  })

  it('renders leading, middle and trailing slots only when provided', () => {
    const bare = mount(Toolbar, { slots: { default: () => h('span', 'mid') } })
    expect(bare.findAll('.md-toolbar__slot')).toHaveLength(1)

    const full = mount(Toolbar, {
      slots: {
        leading: () => h('span', 'L'),
        default: () => h('span', 'M'),
        trailing: () => h('span', 'T'),
      },
    })
    expect(full.findAll('.md-toolbar__slot')).toHaveLength(3)
  })

  it('has standard and vibrant variants at two heights', () => {
    expect(mount(Toolbar).classes()).toContain('md-toolbar--standard')
    expect(mount(Toolbar, { props: { variant: 'vibrant' } }).classes()).toContain('md-toolbar--vibrant')
    expect(mount(Toolbar, { props: { size: 'sm' } }).classes()).toContain('md-toolbar--sm')
  })
})
