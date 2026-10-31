// @vitest-environment happy-dom
// The settings suite runs in node; only the panels need a DOM, so it is asked
// for here instead of switching the environment for every test file.
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Live2DPanel from './Live2DPanel.vue'
import { createI18n } from 'vue-i18n'

// A local instance on purpose: importing the app's i18n pulls in the whole shell,
// including the Live2D runtime, which asserts a Cubism core that is not loaded in
// a unit test. Keys are returned verbatim, which is what the assertions expect.
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } })

// The panel is presentation only: every action is an emit, and the page owns the
// state. These tests pin that contract, which is what lets the settings page stay
// a thin template.
function mountPanel(props: Record<string, unknown> = {}) {
  return mount(Live2DPanel, {
    props: { enabled: false, modelUrl: '', uploaded: [], msg: '', saving: false, ...props },
    global: { plugins: [i18n], stubs: { Live2DStage: true } },
  })
}

describe('Live2DPanel', () => {
  it('reflects the current model and enabled state', () => {
    const wrapper = mountPanel({ enabled: true, modelUrl: '/live2d/models/a/a.model3.json' })
    expect((wrapper.find('.toggle-label input').element as HTMLInputElement).checked).toBe(true)
    expect((wrapper.find('.field input.input').element as HTMLInputElement).value).toBe('/live2d/models/a/a.model3.json')
  })

  it('asks the page to enable the model when a url is typed', async () => {
    const wrapper = mountPanel()
    await wrapper.find('.field input.input').setValue('/live2d/models/b/b.model3.json')
    expect(wrapper.emitted('update:modelUrl')?.[0]).toEqual(['/live2d/models/b/b.model3.json'])
  })

  it('emits save and never performs the request itself', async () => {
    const wrapper = mountPanel()
    const save = wrapper.findAll('button').find((button) => button.classes().includes('btn-tonal'))
    await save!.trigger('click')
    expect(wrapper.emitted('save')).toHaveLength(1)
  })

  it('disables saving while a save is already running', () => {
    const wrapper = mountPanel({ saving: true })
    const save = wrapper.findAll('button').find((button) => button.classes().includes('btn-tonal'))
    expect(save!.attributes('disabled')).toBeDefined()
  })

  it('lists uploaded models and emits delete for the chosen one', async () => {
    const model = { id: 'm1', label: 'School', url: '/live2d/models/m1/m1.model3.json' }
    const wrapper = mountPanel({ uploaded: [model] })
    const row = wrapper.findAll('.model-choice').at(-1)!
    expect(row.text()).toContain('School')
    await row.find('button').trigger('click')
    expect(wrapper.emitted('delete')?.[0]).toEqual([model])
  })

  it('shows the status message it is given', () => {
    expect(mountPanel({ msg: 'uploaded' }).text()).toContain('uploaded')
  })
})
