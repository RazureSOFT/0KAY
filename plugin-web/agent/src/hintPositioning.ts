/**
 * Place a `.hint` tooltip above the control that owns it.
 *
 * Two things make thisnon-trivial, and both come from the same root cause — the
 * hint lives *inside* the button it describes.
 *
 * 1. **Clipping.** The agent view sits inside three `overflow: hidden` ancestors
 *    (`.conversation`, `.route-view`, `.app-main`). An absolutely-positioned hint
 *    that opens upward is clipped by whichever is nearest, so it was painted but
 *    invisible. `position: fixed` escapes them, at the cost of needing real
 *    coordinates — which CSS cannot compute, hence this file.
 *
 * 2. **Transformed ancestors.** Several controls animate `transform` on hover
 *    (`translateY(-1px)` in `.icon-btn` / `.dock-btn` / `.chip-btn`, `scale` on
 *    `:active`). A transformed ancestor becomes the containing block for a fixed
 *    descendant, so the tooltip's coordinates were re-anchored to a button that
 *    was itself moving — it landed at x=2549 on a 1440px viewport.
 *
 * The fix for (2) is to write coordinates relative to that containing block, not
 * to the viewport: `getBoundingClientRect()` includes the ancestor's transform,
 * and so does the hint's own origin, so subtracting the control's local offset
 * cancels it exactly. That keeps the hint where it belongs in the markup (the
 * reveal rule is structural — `button:hover > .hint`) and keeps Vue able to patch
 * it. Re-parenting to `<body>` was tried and rejected: it breaks both.
 */
const GAP = 9
const EDGE = 8

type Side = 'left' | 'right' | 'auto'

/**
 * The control that owns the hint the pointer is inside.
 *
 * `pointerover` reports the innermost element, which for these controls is the
 * icon `<svg>` or one of its `<path>`s — not the hint. So the control is located
 * first and then checked for a direct-child hint, rather than the reverse.
 */
function ownerOf(node: EventTarget | null): HTMLElement | null {
  if (!(node instanceof Element)) return null

  const inlineHint = node.closest('.hint')
  if (inlineHint?.parentElement instanceof HTMLElement) return inlineHint.parentElement

  const control = node.closest<HTMLElement>('button, [role="button"], .nav-item')
  if (!control) return null
  return control.querySelector(':scope > .hint') ? control : null
}

function sideOf(hint: HTMLElement): Side {
  if (hint.classList.contains('left')) return 'left'
  if (hint.classList.contains('right')) return 'right'
  return 'auto'
}

/**
 * Write a viewport position onto the hint, accounting for its real containing block.
 *
 * `position: fixed` is only relative to the viewport when *no* ancestor is
 * transformed. Several controls here animate `transform` on hover, and a
 * transformed ancestor silently becomes the containing block for fixed
 * descendants — the hint then moves with the button, and the numbers land doubled
 * (measured: a dock button at x=1374 put its hint at 2549, i.e. 1374 + 1175).
 *
 * Which ancestor does that is not knowable up front: it may be the button itself,
 * or a wrapper. So it is calibrated rather than derived — write the wanted
 * position, read back where the box actually went, and correct by the difference.
 * One extra layout read per hover, and it is correct for any nesting.
 */
function commitPosition(hint: HTMLElement, x: number, y: number): void {
  hint.style.translate = `${x}px ${y}px`
  const rect = hint.getBoundingClientRect()
  // Sub-pixel differences are rounding, not a containing block offset.
  const dx = Math.abs(rect.left - x) < 1 ? 0 : rect.left - x
  const dy = Math.abs(rect.top - y) < 1 ? 0 : rect.top - y
  if (dx || dy) hint.style.translate = `${Math.round(x - dx)}px ${Math.round(y - dy)}px`
}

/**
 * Move the owner's hint into place and return its final viewport rectangle.
 *
 * The box is measured before it is shown. `offsetWidth` / `offsetHeight` stay
 * non-zero under `visibility: hidden` (unlike `display: none`), so the first
 * painted frame already lands in its final position instead of jumping.
 */
export function placeHint(owner: HTMLElement): void {
  const hint = owner.querySelector<HTMLElement>(':scope > .hint')
  if (!hint) return

  const vw = window.innerWidth
  const vh = window.innerHeight
  const w = hint.offsetWidth || 190
  const h = hint.offsetHeight || 0

  const box = owner.getBoundingClientRect()
  const side = sideOf(hint)

  let x: number
  let y: number

  if (side === 'left') {
    /* Beside the control, vertically centred. This is the dock rail: a vertical
       strip against the right edge, where "above the icon" would land the tooltip
       in the window's top strip. */
    x = box.left - GAP - w
    y = box.top + box.height / 2 - h / 2
  } else {
    /* Above by default; right-aligned when the control asks for `.right`. */
    x = side === 'right' ? box.right - w : box.left

    const above = box.top - GAP - h
    const below = box.bottom + GAP
    const roomAbove = box.top - GAP
    const roomBelow = vh - box.bottom - GAP

    if (h && roomAbove >= h) y = above
    else if (roomBelow >= h || roomBelow >= roomAbove) y = below
    else y = above
  }

  // Clamp last, so no branch can leave the box outside the viewport.
  x = Math.max(EDGE, Math.min(x, vw - w - EDGE))
  y = Math.max(EDGE, Math.min(y, vh - h - EDGE))

  commitPosition(hint, x, y)
}

/**
 * Install the hover/focus positioning. Returns a disposer.
 *
 * `pointerover` covers mouse entry and touch taps (touch fires it before
 * `pointerdown`); `focusin` covers keyboard focus, so the tooltip is reachable
 * without a pointer at all — the previous CSS only handled `:hover`, and only for
 * four hard-coded classes.
 */
export function installHintPositioning(): () => void {
  let current: HTMLElement | null = null

  function show(event: Event): void {
    const owner = ownerOf(event.target)
    if (!owner) return
    placeHint(owner)
    current = owner
  }

  function hide(event: Event): void {
    const owner = ownerOf(event.target)
    if (owner && owner === current) current = null
  }

  function reposition(): void {
    if (current?.isConnected) placeHint(current)
    else current = null
  }

  document.addEventListener('pointerover', show, true)
  document.addEventListener('pointerout', hide, true)
  document.addEventListener('focusin', show, true)
  document.addEventListener('focusout', hide, true)
  window.addEventListener('resize', reposition, { passive: true })
  // Capture phase: any scrollable ancestor can move the button under the hint.
  window.addEventListener('scroll', reposition, { passive: true, capture: true })

  return () => {
    document.removeEventListener('pointerover', show, true)
    document.removeEventListener('pointerout', hide, true)
    document.removeEventListener('focusin', show, true)
    document.removeEventListener('focusout', hide, true)
    window.removeEventListener('resize', reposition)
    window.removeEventListener('scroll', reposition, true)
    current = null
  }
}