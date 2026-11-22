/**
 * The press ripple, and why it no longer touches the host element's class list.
 *
 * The previous version did `target.classList.add('motion-surface')` and only ever
 * removed the ripple node it appended. `.motion-surface` is `overflow: hidden`,
 * so every button that had been pressed once kept a clipped box forever — and
 * this app positions tooltips above the button (`bottom: calc(100% + 9px)`), so
 * each of them disappeared after its first click.
 *
 * Whether the leak was visible depended on whether Vue re-patched the element's
 * `class` attribute on the next render. Buttons with a reactive `:class` binding
 * lost the class; buttons with a static `class` kept it. That is what made the
 * bug look intermittent instead of systematic.
 *
 * So: never write to the host's class list. The ripple gets its own clipping
 * wrapper, created and removed within one lifecycle.
 */
export function installInteractionMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

  function press(event: PointerEvent) {
    if (event.button !== 0) return
    const target = (event.target as Element)?.closest<HTMLElement>('button, .nav-item, [role="button"]')
    if (!target || target.matches(':disabled, [aria-disabled="true"]')) return

    const rect = target.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const size = Math.max(rect.width, rect.height) * 2

    const layer = document.createElement('span')
    layer.className = 'expressive-ripple'
    layer.setAttribute('aria-hidden', 'true')
    Object.assign(layer.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${event.clientX - rect.left - size / 2}px`,
      top: `${event.clientY - rect.top - size / 2}px`,
    })

    /* The wrapper does the clipping, so the button's own box is untouched. It is
       an absolutely-positioned child, so it cannot affect layout, and it leaves
       with the ripple. */
    const clip = document.createElement('span')
    clip.className = 'expressive-ripple-clip'
    clip.setAttribute('aria-hidden', 'true')
    Object.assign(clip.style, {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    })
    clip.appendChild(layer)

    /* `#app button` already sets position: relative, but a plugin-drawn control
       may not. This writes one property and restores it on the way out — unlike a
       class, it cannot be silently kept by a later render. */
    const hadPosition = target.style.position
    if (!hadPosition && getComputedStyle(target).position === 'static') {
      target.style.position = 'relative'
    }

    target.appendChild(clip)

    const done = () => {
      clip.remove()
      if (!hadPosition) target.style.position = hadPosition
    }

    if (reduced.matches) {
      /* Reduced motion still gets a cue: a flat, short flash reads as "pressed"
         without any travel. The old code returned early, and since theme.css also
         flattens the scale press effect, these users got no feedback at all. */
      layer.style.opacity = '0.16'
      const flash = layer.animate([{ opacity: 0.16 }, { opacity: 0 }], {
        duration: 140,
        easing: 'linear',
      })
      flash.finished.then(done, done)
      return
    }

    const animation = layer.animate(
      [{ transform: 'scale(.8)', opacity: 0.16 }, { transform: 'scale(1)', opacity: 0 }],
      { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' },
    )
    animation.finished.then(done, done)
  }

  document.addEventListener('pointerdown', press)

  return () => {
    document.removeEventListener('pointerdown', press)
    document.querySelectorAll('.expressive-ripple-clip, .expressive-ripple').forEach((node) => node.remove())
  }
}