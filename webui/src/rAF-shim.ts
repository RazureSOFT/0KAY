// Some embedded WebViews (observed: ZCode in-app browser on Windows) never
// dispatch requestAnimationFrame callbacks and never fire transitionend.
// Vue's <Transition> is built on both: nextFrame() advances phases via nested
// rAF, and phase completion waits for transitionend. Without this shim every
// SPA navigation stalls in leave-from forever. A real browser is unaffected:
// the shim only installs when the native rAF demonstrably does not schedule.
if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
  const native = window.requestAnimationFrame.bind(window)
  let works = false
  const probe = () => { works = true }
  // Probe with a no-op frame; if it never runs, replace with a timer fallback.
  const handle = native(probe)
  setTimeout(() => {
    if (works) return
    const frame = (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as unknown as number
    window.requestAnimationFrame = frame
    window.cancelAnimationFrame = (id: number) => clearTimeout(id)
    void handle
  }, 60)
}
export {}
