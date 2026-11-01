import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DirectoryDialog from './DirectoryDialog.vue'

const baseProps = {
  open: true,
  path: '/work/app',
  parent: '/work',
  dirs: [{ name: 'src', path: '/work/app/src' }],
  roots: ['/work'],
  defaultDir: '/home/me',
  hostname: 'build-box',
}

function mountDialog(overrides: Record<string, unknown> = {}) {
  // `teleport: true` renders the slot in place: the dialog lives in body at
  // runtime (it must, to escape the transformed composer), but a test wants it
  // inside the wrapper it queries.
  return mount(DirectoryDialog, { props: { ...baseProps, ...overrides }, global: { stubs: { teleport: true } } })
}

describe('DirectoryDialog', () => {
  it('renders nothing while closed', () => {
    expect(mountDialog({ open: false }).find('.directory-dialog').exists()).toBe(false)
  })

  it('shows the current path and the folders in it', () => {
    const wrapper = mountDialog()
    expect(wrapper.find('code').text()).toBe('/work/app')
    expect(wrapper.text()).toContain('src')
    // The title string is a translation key here; the hostname is passed to it,
    // not rendered around it.
    expect(wrapper.text()).toContain('agent.page.directoryTitle')
  })

  it('asks to browse a child folder', async () => {
    const wrapper = mountDialog()
    const child = wrapper.findAll('.directory-list button').find((button) => button.text().includes('src'))
    await child!.trigger('click')
    expect(wrapper.emitted('browse')?.[0]).toEqual(['/work/app/src'])
  })

  it('offers "go up" only when it goes somewhere', () => {
    expect(mountDialog().findAll('.directory-list button')[0].text()).toContain('agent.page.parentDirectory')
    const atRoot = mountDialog({ parent: '/work/app' })
    expect(atRoot.text()).not.toContain('agent.page.parentDirectory')
  })

  it('will not create a folder without a name', async () => {
    const wrapper = mountDialog()
    const submit = wrapper.find('.new-folder button')
    expect(submit.attributes('disabled')).toBeDefined()
    await wrapper.find('.new-folder input').setValue('   ')
    expect(wrapper.find('.new-folder button').attributes('disabled')).toBeDefined()
    await wrapper.find('.new-folder input').setValue('build')
    expect(wrapper.find('.new-folder button').attributes('disabled')).toBeUndefined()
  })

  it('reports the new folder name and clears the field', async () => {
    const wrapper = mountDialog()
    await wrapper.find('.new-folder input').setValue('build')
    await wrapper.find('.new-folder form, .new-folder').trigger('submit')
    expect(wrapper.emitted('create')?.[0]).toEqual(['build'])
    expect((wrapper.find('.new-folder input').element as HTMLInputElement).value).toBe('')
  })

  it('refuses to select the current folder while busy or after an error', () => {
    const busy = mountDialog({ busy: true })
    expect(busy.find('footer button').attributes('disabled')).toBeDefined()
    const failed = mountDialog({ error: 'permission denied' })
    expect(failed.find('footer button').attributes('disabled')).toBeDefined()
    const fine = mountDialog()
    expect(fine.find('footer button').attributes('disabled')).toBeUndefined()
  })

  it('shows the error and hides the listing while it is there', () => {
    const wrapper = mountDialog({ error: 'permission denied' })
    expect(wrapper.find('.error').text()).toBe('permission denied')
    expect(wrapper.find('.directory-list').exists()).toBe(true)
  })

  it('says so when the folder has no subfolders', () => {
    expect(mountDialog({ dirs: [] }).text()).toContain('agent.page.noSubdirectories')
  })

  it('closes on the backdrop but not on the dialog itself', async () => {
    const wrapper = mountDialog()
    await wrapper.find('.directory-dialog').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
    await wrapper.find('.directory-backdrop').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
