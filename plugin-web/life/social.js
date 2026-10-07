import { createApp } from 'vue'
import SocialWindow from './src/SocialWindow.vue'

/**
 * Bootstrap module: L.I.F.E's global social-accounts window.
 *
 * The WebUI imports this once at startup (a UI patch with target "bootstrap")
 * and calls install(); the returned function is the cleanup it calls if the
 * patch disappears. It mounts a standalone Vue app onto the host page, so the
 * plugin needs no WebUI shell changes at all.
 */
export function install() {
  const host = document.createElement('div')
  host.id = '0kay-life-social-window'
  document.body.appendChild(host)
  const app = createApp(SocialWindow)
  app.mount(host)
  return () => {
    try { app.unmount() } catch { /* already gone */ }
    host.remove()
  }
}

export default install
