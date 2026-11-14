import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

/**
 * The page used to crash on load with "Cannot access 'si' before initialization".
 *
 * The cause was a TDZ read: the page destructures five composables partway down,
 * and some top-level statements above them read those bindings during setup.
 * A type checker cannot see it (the types are fine), the build cannot see it
 * (the bundler only renames), and every unit test of a composable passes — only
 * evaluating the page module does. So this mounts it.
 *
 * If this fails with "Cannot access … before initialization", something at the
 * top of AgentsPage.vue reads a binding that is declared further down. Either
 * move the statement below the destructuring or wrap the reference in a
 * function so it resolves lazily.
 */
/**
 * Every store member the page touches, stubbed.
 *
 * The page reads the store from top-level watchers as well as from the template,
 * so a missing member surfaces as a TypeError that looks like a page bug. The
 * list is checked against `grep -o 'store\.[a-zA-Z]*'` in the page.
 */
vi.mock('./store', () => {
  const sessions: unknown[] = []
  const tasks: unknown[] = []
  const toasts: unknown[] = []
  const agents: unknown[] = []
  const noop = async () => {}
  return {
    useAgentsStore: () => ({
      sessions,
      tasks,
      toasts,
      agents,
      error: '',
      loading: false,
      isHealthy: true,
      onlineCount: 0,
      executors: [],
      providers: [],
      skills: [],
      dismissToast: () => {},
      refresh: noop,
      connect: noop,
      disconnect: noop,
      fetchAgents: noop,
      fetchExecutors: noop,
      fetchSessions: noop,
      fetchTasks: noop,
      createSession: async () => 's1',
      manageSession: noop,
      sendTask: noop,
      cancelTask: noop,
      steerTask: noop,
      resetToken: noop,
      ensureSessionTurns: noop,
      sessionHasTurns: () => true,
      olderSessionTurns: () => [],
      hasOlderTurns: () => false,
      turnsPending: () => false,
    }),
  }
})

describe('AgentsPage module evaluation', () => {
  it('evaluates without a temporal-dead-zone error', async () => {
    // Import at call time so the failure surfaces as a rejected expectation
    // rather than as a collection-time crash.
    const module = await import('./AgentsPage.vue')
    expect(module.default).toBeTruthy()
  })

  it('mounts without throwing', async () => {
    const Page = (await import('./AgentsPage.vue')).default
    const wrapper = mount(Page, {
      global: {
        stubs: {
          teleport: true,
          MarkdownContent: true,
          ToolStepCard: true,
          DirectoryDialog: true,
          FileViewer: true,
          ModelThinkingPicker: true,
          GitPanel: true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
})