import * as PIXI from 'pixi.js'
/**
 * The Cubism 2 core, rewritten into globals at build time.
 *
 * It used to be assembled at runtime from the raw source string and injected
 * with `script.textContent`. Inline script is exactly what the Content-Security-
 * Policy on this app forbids, so the injection was blocked, the module graph
 * threw, and the window came up empty — with one CSP line in the console and no
 * hint about which feature caused it.
 *
 * The transform now lives in vite.config.ts as `virtual:live2d-globals`, which
 * makes it an ordinary chunk: served from 'self', cached like anything else,
 * and no policy exception is needed to run it.
 */
import 'virtual:live2d-globals'

const PIXI_GLOBAL: any = { ...PIXI }
;(window as any).PIXI = PIXI_GLOBAL

export const live2dRuntimeReady = import('pixi-live2d-display').then(runtime => {
  if (!(window as any).Live2D) throw new Error('live2d globals missing: the virtual:live2d-globals module did not run')
  PIXI_GLOBAL.live2d = runtime
  return PIXI_GLOBAL
})
