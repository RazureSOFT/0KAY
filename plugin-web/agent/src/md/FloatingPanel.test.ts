import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FloatingPanel from './FloatingPanel.vue'

/**
 * The floating panel is the shell the agent page's tools live in: six of them, each
 * independently positioned and sized, each persisting its own geometry. The earlier
 * demos had a dock with nothing behind it, so this is the component that closes the
 * largest gap in the UI.
 *
 * These tests cover the behaviour that cannot be seen in a screenshot: where geometry is
 * stored, when it is written, and the clamping that keeps a panel reachable.
 */

function mountPanel(props: Record<string, unknown> = {}) {
  return mount(FloatingPanel, {
    props: { id: 'browser', title: '浏览器', ...props },
    attachTo: document.body,
  })
}

/** Read the geometry the component applied to its root. */
function geometry(wrapper: ReturnType<typeof mount>) {
  const style = wrapper.attributes('style') || ''
  const translate = /translate:\s*([-\d.]+)px\s*([-\d.]+)px/.exec(style)
  const width = /inline-size:\s*(\d+)px/.exec(style)
  const height = /block-size:\s*(\d+)px/.exec(style)
  return {
    x: translate ? Number(translate[1]) : null,
    y: translate ? Number(translate[2]) : null,
    w: width ? Number(width[1]) : null,
    h: height ? Number(height[1]) : null,
  }
}

describe('FloatingPanel', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders its title, subtitle and body', () => {
    const wrapper = mountPanel({ subtitle: 'localhost:3000', width: 400, height: 300 })
    expect(wrapper.find('.float-title').text()).toBe('浏览器')
    expect(wrapper.find('.float-sub').text()).toBe('localhost:3000')
    wrapper.unmount()
  })

  it('falls back to the requested size when nothing is stored', () => {
    const wrapper = mountPanel({ width: 420, height: 280 })
    const box = geometry(wrapper)
    expect(box.w).toBe(420)
    expect(box.h).toBe(280)
    wrapper.unmount()
  })

  it('restores a stored position and size', () => {
    localStorage.setItem('agent.browser.pos', JSON.stringify({ x: 200, y: 120 }))
    localStorage.setItem('agent.browser.size', JSON.stringify({ w: 500, h: 320 }))
    const wrapper = mountPanel()
    const box = geometry(wrapper)
    expect(box.x).toBe(200)
    expect(box.y).toBe(120)
    expect(box.w).toBe(500)
    expect(box.h).toBe(320)
    wrapper.unmount()
  })

  it('gives different ids different starting slots', () => {
    // Three windows at the same offset read as one window, which hid the fact that they
    // had opened at all.
    const a = mountPanel({ id: 'browser' })
    const b = mountPanel({ id: 'tree' })
    const c = mountPanel({ id: 'term' })
    const slots = [a, b, c].map((w) => JSON.stringify([geometry(w).x, geometry(w).y]))
    expect(new Set(slots).size).toBe(3)
    a.unmount(); b.unmount(); c.unmount()
  })

  it('persists geometry on release, not on every move', async () => {
    const wrapper = mountPanel()
    const bar = wrapper.find('.float-bar')

    /* Drag by 60 × 40. jsdom has no layout, so the component's own rect is what moves. */
    await bar.trigger('pointerdown', { button: 0, clientX: 100, clientY: 100, pointerId: 1 })
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 160, clientY: 140 }) as PointerEvent)
    await wrapper.vm.$nextTick()

    // Nothing written while the pointer is still down.
    expect(localStorage.getItem('agent.browser.pos')).toBeNull()

    window.dispatchEvent(new MouseEvent('pointerup') as PointerEvent)
    await wrapper.vm.$nextTick()

    const stored = JSON.parse(localStorage.getItem('agent.browser.pos') || 'null')
    expect(stored).not.toBeNull()
    expect(Number.isFinite(stored.x)).toBe(true)
    wrapper.unmount()
  })

  it('never lets a panel be dragged off-screen', async () => {
    localStorage.setItem('agent.browser.pos', JSON.stringify({ x: 99999, y: -99999 }))
    const wrapper = mountPanel()
    const box = geometry(wrapper)
    expect(box.y).toBeGreaterThanOrEqual(0)
    wrapper.unmount()
  })

  it('emits close from the close button', async () => {
    const wrapper = mountPanel()
    await wrapper.find('.float-x').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('supports keyboard nudging', async () => {
    // Position should not be reachable only by dragging.
    localStorage.setItem('agent.browser.pos', JSON.stringify({ x: 300, y: 200 }))
    const wrapper = mountPanel()
    const before = geometry(wrapper).x as number
    await wrapper.find('.float-bar').trigger('keydown', { key: 'ArrowRight' })
    expect(geometry(wrapper).x).toBe(before + 8)
    await wrapper.find('.float-bar').trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    expect(geometry(wrapper).x).toBe(before + 8 + 32)
    wrapper.unmount()
  })
})