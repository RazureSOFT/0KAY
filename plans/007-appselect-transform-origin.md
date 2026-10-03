# 007 — Anchor the AppSelect menu origin to its trigger

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: LOW
- **Category**: Physicality & origin
- **Estimated scope**: 1 file

## Problem

The teleported select menu scales from the vertical edge but always from the
horizontal **center** (`transform-origin: top` / `bottom`). When the menu is
wider than the trigger, it therefore grows out of thin air rather than from the
trigger the user clicked. Popovers/dropdowns should scale from their trigger.

```css
/* webui/src/components/AppSelect.vue:95-102 — current */
.app-select-menu{
  position:fixed;z-index:var(--z-popover,5000);overflow-y:auto;overscroll-behavior:contain;
  padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
  border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);
  box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;
  font-family:var(--font-family);font-size:14px;transform-origin:top;
}
.app-select-menu.opens-up{transform-origin:bottom}
```

`layout()` (line 16-24) already knows the trigger rect and whether the menu is
flipped to open upward. It just never exposes the horizontal anchor.

## Target

Have `layout()` set `transformOrigin` on the inline `position` object, matching
the trigger's horizontal side. The menu is left-aligned to the trigger unless it
is clamped against the right viewport edge, in which case its origin is `right`.

```ts
/* target — inside layout(), webui/src/components/AppSelect.vue:16-24 */
function layout(){
  const rect=trigger.value?.getBoundingClientRect();if(!rect)return
  const height=window.visualViewport?.height || innerHeight,width=window.visualViewport?.width || innerWidth
  const below=height-rect.bottom-10,above=rect.top-10
  upwards.value=below<Math.min(280,items.value.length*46+12)&&above>below
  const maxHeight=Math.max(48,Math.min(340,upwards.value?above:below))
  const menuWidth=Math.min(Math.max(rect.width,220),width-16)
  const maxLeft=width-menuWidth-8
  const clampedLeft=Math.max(8,Math.min(rect.left,maxLeft))
  const alignRight=rect.left>maxLeft
  position.value={
    position:'fixed',
    left:`${clampedLeft}px`,
    width:`${menuWidth}px`,
    maxHeight:`${maxHeight}px`,
    transformOrigin:`${upwards.value?'bottom':'top'} ${alignRight?'right':'left'}`,
    ...(upwards.value?{bottom:`${height-rect.top+8}px`}:{top:`${rect.bottom+8}px`}),
  }
}
```

The inline `transform-origin` overrides the static CSS, so the two
`transform-origin` declarations in the stylesheet may be left in place as a
fallback (or deleted — either is fine).

## Repo conventions to follow

- Popovers are expected to scale from their trigger (the enter already uses
  `translateY(-6px) scale(.97)` at `webui/src/components/AppSelect.vue:121`); this
  plan makes the origin match.
- Vue applies camelCase `transformOrigin` in a `:style` object as
  `transform-origin` — no extra CSS needed.

## Steps

1. In `webui/src/components/AppSelect.vue`, replace the body of `layout()` (lines
   16-24) with the target function above.
2. Ensure the inline style object is still bound as `:style="position"` on the
   menu (line 66) — no template change needed.

## Boundaries

- Do NOT change menu markup, option rendering, keyboard handling, or the
  enter/leave transitions.
- Do NOT change the mirror component `plugin-web/*/src/AppSelect.vue` in this
  plan (it has no `upwards` clamp logic of the same shape); only the host
  `webui/src/components/AppSelect.vue`.
- If `layout()` doesn't match the excerpt, STOP and report.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`.
- **Feel check**: open selects in Settings (语言 select in the header, provider
  fields):
  - With the trigger near the left/center, the menu should grow from its top-left
    / bottom-left corner (aligned to the trigger).
  - Widen/reposition the window so a trigger sits near the right edge and the
    menu is clamped: it should grow from the top-right / bottom-right.
  - Open upward (trigger near the bottom): origin flips to `bottom`.
  - At 10% playback in DevTools → Animations, confirm scale + translate originate
    from the anchored corner.
  - `prefers-reduced-motion`: menu appears instantly.
- **Done when**: `layout()` writes `transformOrigin` and the menu visually grows
  from the trigger corner in all four orientations.
