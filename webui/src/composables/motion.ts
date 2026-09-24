/** Shared state-layer feedback; delegated so dynamically loaded UI patches work. */
export function installInteractionMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  function press(event: PointerEvent) {
    if (reduced.matches || event.button !== 0) return
    const target = (event.target as Element)?.closest<HTMLElement>('button, .nav-item, [role="button"]')
    if (!target || target.matches(':disabled, [aria-disabled="true"]')) return
    const rect = target.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const layer = document.createElement('span')
    layer.className = 'expressive-ripple'
    layer.setAttribute('aria-hidden', 'true')
    Object.assign(layer.style, { width: `${size}px`, height: `${size}px`, left: `${event.clientX - rect.left - size / 2}px`, top: `${event.clientY - rect.top - size / 2}px` })
    target.classList.add('motion-surface')
    target.appendChild(layer)
    const animation = layer.animate([{ transform: 'scale(0)', opacity: .18 }, { transform: 'scale(1)', opacity: 0 }], { duration: 550, easing: 'cubic-bezier(.2,0,0,1)' })
    animation.finished.then(() => layer.remove(), () => layer.remove())
  }
  document.addEventListener('pointerdown', press)
  return () => { document.removeEventListener('pointerdown', press); document.querySelectorAll('.expressive-ripple').forEach(node => node.remove()) }
}
