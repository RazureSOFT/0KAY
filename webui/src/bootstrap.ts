type Item = { module?: string; plugin?: string; id?: string }
type Module = { install?: (context: Item) => unknown; default?: (context: Item) => unknown; uninstall?: () => void }

/** Serialize updates, including changes arriving while an import is pending. */
export function createBootstrapManager(load: (url: string) => Promise<Module>) {
  const active = new Map<string, (() => void) | undefined>()
  let desired: Item[] = []
  let queue = Promise.resolve()
  return {
    sync(items: Item[]) {
      desired = [...items]
      queue = queue.then(async () => {
        for (const [url, cleanup] of active) {
          if (!desired.some(item => item.module === url) && cleanup) {
            cleanup()
            active.delete(url)
          }
        }
        for (const item of [...desired]) {
          const url = item.module
          if (!url || active.has(url)) continue
          try {
            const mod = await load(url)
            if (!desired.some(entry => entry.module === url)) continue
            const result = await (mod.install || mod.default)?.(item)
            active.set(url, typeof result === 'function' ? result as () => void : mod.uninstall)
          } catch (error) {
            console.warn('[0kay] bootstrap module failed:', url, error)
          }
        }
      }).catch(error => { console.warn('[0kay] bootstrap cleanup failed:', error) })
      return queue
    },
  }
}
