import * as PIXI from 'pixi.js'
import cubism2Source from 'live2d-widget/src/lib/live2d.core.js?raw'
const PIXI_GLOBAL: any = { ...PIXI }
;(window as any).PIXI = PIXI_GLOBAL
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
