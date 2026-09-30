import { describe, expect, it, vi } from 'vitest'
import { createBootstrapManager } from './bootstrap'

describe('bootstrap lifecycle', () => {
  it('cleans up on disable and reinstalls on enable without duplicate installs', async () => {
    const cleanup = vi.fn()
    const install = vi.fn(() => cleanup)
    const manager = createBootstrapManager(async () => ({ install }))
    const items = [{ module: '/theme.js' }]
    await manager.sync(items)
    await manager.sync(items)
    expect(install).toHaveBeenCalledTimes(1)
    await manager.sync([])
    expect(cleanup).toHaveBeenCalledTimes(1)
    await manager.sync(items)
    expect(install).toHaveBeenCalledTimes(2)
  })

  it('does not install a module disabled during import', async () => {
    const install = vi.fn()
    let resolve!: (value: { install: typeof install }) => void
    const manager = createBootstrapManager(() => new Promise(r => { resolve = r }))
    const pending = manager.sync([{ module: '/theme.js' }])
    await Promise.resolve()
    const disabled = manager.sync([])
    resolve({ install })
    await pending
    await disabled
    expect(install).not.toHaveBeenCalled()
  })

  it('supports exported uninstall and keeps legacy modules one-shot', async () => {
    const uninstall = vi.fn()
    const install = vi.fn()
    const manager = createBootstrapManager(async url => url === '/legacy.js' ? { install } : { install, uninstall })
    const items = [{ module: '/legacy.js' }, { module: '/theme.js' }]
    await manager.sync(items)
    await manager.sync([])
    await manager.sync(items)
    expect(uninstall).toHaveBeenCalledTimes(1)
    expect(install).toHaveBeenCalledTimes(3)
  })
})
