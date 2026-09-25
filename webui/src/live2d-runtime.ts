// Load both SDK generations before registering the combined PIXI adapter.
import * as PIXI from 'pixi.js'
import cubism2Source from 'live2d-widget/src/lib/live2d.core.js?raw'
// ES module namespace objects are sealed; copy to a mutable object so
// pixi-live2d-display can attach PIXI.live2d (and Live2DStage can read it).
const PIXI_GLOBAL: any = { ...PIXI }
;(window as any).PIXI = PIXI_GLOBAL
// The legacy SDK uses duplicate declarations that are legal in a classic script
// but not in an ES module. Preserve its original execution mode and license.
const script = document.createElement('script')
script.textContent = cubism2Source.replace(/export\s*\{([\s\S]*?)\}\s*;?\s*$/, (_match, exports: string) =>
  exports.split(',').map(entry => {
    const match=entry.trim().match(/^(\w+)\s+as\s+(\w+)$/)
    return match ? `window.${match[2]}=${match[1]};` : ''
  }).join('\n'))
document.head.appendChild(script)
export const live2dRuntimeReady = import('pixi-live2d-display').then(runtime => {
  if (!(window as any).Live2D) throw new Error('live2d-widget export rewrite failed: window.Live2D missing')
  PIXI_GLOBAL.live2d = runtime
  return PIXI_GLOBAL
})
