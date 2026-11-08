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

/**
 * Whether this context lets code be evaluated from a string.
 *
 * Pixi 6 builds its shader programs with `new Function`, and the CSP Core serves
 * has no `unsafe-eval` — so constructing a renderer throws immediately. That
 * throw happens inside the import itself, which is why the guard has to run
 * before the import rather than in a `.catch` after it.
 *
 * The alternative, adding `@pixi/unsafe-eval`, would reopen exactly the eval hole
 * the rest of this app was cleaned of, to save one optional decoration.
 */
export function evalAllowed(): boolean {
  try {
    // eslint-disable-next-line no-new-func
    new Function('return 1')
    return true
  } catch {
    return false
  }
}

export const live2dRuntimeSupported = evalAllowed()

/**
 * Resolves to the PIXI global once the Live2D runtime is usable, or `null` when
 * this context cannot run it.
 *
 * `null` rather than a rejection on purpose: this promise is handed to plugins
 * that may never await it, and an unhandled rejection is reported as an uncaught
 * exception on every page load — which reads as "the app is broken" when the
 * truth is "one feature is unavailable here". `Live2DStage` checks for `null`
 * and shows its own message.
 */
export const live2dRuntimeReady: Promise<any> = (async () => {
  if (!live2dRuntimeSupported) {
    console.warn('[live2d] unavailable: this page forbids eval, which Pixi 6 needs for its shaders')
    return null
  }
  try {
    // Loaded lazily: importing pixi.js is itself what throws under this CSP.
    const PIXI = await import('pixi.js')
    const runtime = await import('pixi-live2d-display')
    if (!(window as any).Live2D) throw new Error('live2d globals missing: the virtual:live2d-globals module did not run')
    const PIXI_GLOBAL: any = { ...PIXI }
    PIXI_GLOBAL.live2d = runtime
    ;(window as any).PIXI = PIXI_GLOBAL
    return PIXI_GLOBAL
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    console.warn(`[live2d] unavailable in this browser context: ${reason}`)
    return null
  }
})()
