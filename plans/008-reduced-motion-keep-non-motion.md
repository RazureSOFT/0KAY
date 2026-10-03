# 008 — Reduced motion: drop movement, keep color/opacity feedback

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: LOW
- **Category**: Accessibility
- **Estimated scope**: 1 file, 1 media block

## Problem

The global reduced-motion block sets `transition-duration: 1ms !important` on
every element, which also removes the non-movement transitions (color, opacity,
background, border, focus rings) that aid comprehension — the comment above it
says the opposite is intended.

```css
/* webui/src/styles/theme.css:578-597 — current */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
  #app .nav-item::before, #app .nav-icon, #app button:active:not(:disabled),
  .route-enter-from, .route-leave-to, #app .empty-icon, #app .turn { transform: none !important; }
  .expressive-ripple { display: none !important; }
}
```

## Target

Neutralize **movement** while preserving non-movement feedback. Instead of
collapsing every transition to 1ms, restrict the transitioned properties to the
non-positional ones; this drops all `transform` / `width` / `height` / `margin`
transitions globally while keeping color and opacity feedback alive. The existing
`transform: none !important` list and the ripple kill remain.

```css
/* target — replace the block at theme.css:580-597 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    /* Keep comprehension feedback (color / opacity / elevation); drop all movement. */
    transition-property: opacity, color, background-color, border-color, box-shadow, fill, stroke, visibility !important;
    transition-duration: 160ms !important;
    scroll-behavior: auto !important;
  }
  #app .nav-item::before,
  #app .nav-icon,
  #app button:active:not(:disabled),
  .route-enter-from,
  .route-leave-to,
  #app .empty-icon,
  #app .turn {
    transform: none !important;
  }
  .expressive-ripple { display: none !important; }
}
```

`transition-property` with `!important` overrides every component's transition
list, so hover lifts (`translateY`), press scales, drawer slides, menu
scale/translate, and bar growth all become instant, while hover/selected
background-color and opacity changes still ease.

## Repo conventions to follow

- The block's own comment states the intent ("keep color/opacity state changes,
  drop all movement"). This change makes the code match it.
- Keep the reduced-motion treatment centralized here; components already defer to
  this global rule.

## Steps

1. In `webui/src/styles/theme.css`, replace the declaration list inside the
   `@media (prefers-reduced-motion: reduce)` block (lines 580-597) with the
   target block above. Do not touch the surrounding comments or the block that
   precedes it.

## Boundaries

- Do NOT weaken `animation-duration: 1ms` (animations are already fully removed).
- Do NOT add per-component reduced-motion rules in this plan.
- Keep the `transform: none !important` selector list intact.
- If the block doesn't match, STOP and report.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`.
- **Feel check**: DevTools → Rendering → **Emulate `prefers-reduced-motion: reduce`**:
  - Nav active pill, button press scale, card hover lifts, route transitions,
    drawer slide, and AppSelect/Thinking popover scale/slide should all be
    instant (no movement).
  - Hovering a nav item or a settings card should still ease its background
    color; toggles and selected chips should still show an animated color change.
  - Scroll behavior is instant.
  - Compare with reduced-motion **off** to confirm normal motion is unaffected.
- **Done when**: with reduced motion on, no element moves or resizes with a
  transition, but color/opacity transitions still run.
