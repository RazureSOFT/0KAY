# 002 — Make the Thinking popover emerge from its trigger, and stop animating thumb layout

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: MEDIUM
- **Category**: Physicality & origin + Performance
- **Estimated scope**: 2 files (~6 edits each)

## Problem

The Thinking-effort popover (rendered by both the host WebUI and the agent
plugin) is physically disconnected from the button that opens it:

1. It enters with only `opacity` + `translateY(4px)` and no scale, and sets no
   `transform-origin`, so it fades in place instead of growing out of the
   trigger.
2. Its slider thumb animates `width`/`height`/`margin-top` — layout properties
   that trigger re-layout instead of compositing.

Same component is duplicated:
- `webui/src/components/ThinkingSlider.vue`
- `plugin-web/agent/src/ThinkingSlider.vue`

Current menu transition (host copy, minified in the `<style>` block):

```css
/* webui/src/components/ThinkingSlider.vue — current (inside the minified rule on line 45) */
.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity 130ms,transform 130ms}
.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}
```

Current thumb (both copies, `~line 69-74`):

```css
/* current */
.thinking-track input::-webkit-slider-thumb {
  width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;
  background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);
  transition:width 140ms,height 140ms,margin-top 140ms;
}
.thinking-track input:active::-webkit-slider-thumb {width:6px;height:48px;margin-top:-10px}
```

## Target

**Menu**: grow from the trigger. The `layout()` function already computes an
`up` flag; also derive whether the menu is clamped to the right viewport edge and
set `transform-origin` on the inline position object. Replace the enter/leave CSS
with a scale + slide using tokens
(`--duration-short: 140ms`, `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` from
`theme.css:111,120`).

**Thumb**: keep the resting geometry identical, reproduce the press squash with
`transform` only (never `width`/`height`/`margin-top`).

```css
/* target — append at the end of the <style> block so it overrides the earlier minified rule */
.thinking-menu-enter-active,
.thinking-menu-leave-active {
  transition: opacity var(--duration-short) var(--ease-out), transform var(--duration-short) var(--ease-out);
}
.thinking-menu-enter-from,
.thinking-menu-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.96);
}
```

```css
/* target — thumb (replace the two rules above) */
.thinking-track input::-webkit-slider-thumb {
  width: 10px; height: 44px; margin-top: -8px; border-radius: 999px; border: 0;
  background: var(--md-primary); box-shadow: 0 0 0 5px var(--md-surface-container-low);
  transform: scale(1); transform-origin: center;
  transition: transform var(--duration-short) var(--ease-out);
}
.thinking-track input:active::-webkit-slider-thumb { transform: scaleX(0.6) scaleY(1.09); }
.thinking-track input::-moz-range-thumb {
  width: 10px; height: 44px; border: 0; border-radius: 999px; background: var(--md-primary);
  box-shadow: 0 0 0 5px var(--md-surface-container-low);
  transform: scale(1); transform-origin: center;
  transition: transform var(--duration-short) var(--ease-out);
}
.thinking-track input:active::-moz-range-thumb { transform: scaleX(0.6) scaleY(1.09); }
```

`scaleX(0.6)` on a 10px thumb ≈ the old 6px; `scaleY(1.09)` on 44px ≈ 48px.

## Repo conventions to follow

- Menu enter/leave with a start offset and a scale is the shipped pattern in
  `webui/src/components/AppSelect.vue:119-121`:
  `.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}`
  using `--ease-spring` / `--ease-out` and `--duration-*`.
- `--ease-out` / `--duration-short` are defined in `webui/src/styles/theme.css:111,120`.
- Both plugin and host pages render inside `#app`, so the theme tokens are on
  `:root` and available (the file already uses `var(--duration-short)` on line 108/110).

## Steps

In **both** `webui/src/components/ThinkingSlider.vue` and
`plugin-web/agent/src/ThinkingSlider.vue`:

1. Update `layout()`. Current line 18 begins:
   `function layout(){const rect=trigger.value?.getBoundingClientRect();if(!rect)return;const width=Math.min(352,innerWidth-16),height=236;const up=rect.top>=height+8||innerHeight-rect.bottom<height;position.value={left:\`${Math.max(8,Math.min(rect.left,innerWidth-width-8))}px\`,width:\`${width}px\`,...(up?{bottom:\`${innerHeight-rect.top+8}px\`}:{top:\`${rect.bottom+8}px\`})}}`
   Replace the `position.value = { ... }` expression with the following
   (compute `left`, `alignRight`, then include `transformOrigin`):
   ```ts
   const width = Math.min(352, innerWidth - 16), height = 236
   const up = rect.top >= height + 8 || innerHeight - rect.bottom < height
   const maxLeft = innerWidth - width - 8
   const left = Math.max(8, Math.min(rect.left, maxLeft))
   const alignRight = rect.left > maxLeft
   position.value = {
     left: `${left}px`,
     width: `${width}px`,
     transformOrigin: `${up ? 'bottom' : 'top'} ${alignRight ? 'right' : 'left'}`,
     ...(up ? { bottom: `${innerHeight - rect.top + 8}px` } : { top: `${rect.bottom + 8}px` }),
   }
   ```
2. Append the menu transition override CSS (above) at the very end of the
   `<style>` block of each file. If `.thinking-menu-enter-active` does not exist
   in the file, still append it — the rule is additive.
3. Replace the two WebKit thumb rules (lines ~69-74) with the target thumb CSS
   above, and add the `-moz` equivalents.
4. In the existing `@media (prefers-reduced-motion: reduce)` block, add
   `.thinking-track input::-webkit-slider-thumb,
    .thinking-track input::-moz-range-thumb { transition: none; }`.

## Boundaries

- Do NOT change the component's markup, template bindings, or the reported
  `position` keys other than adding `transformOrigin`.
- Do NOT touch the "thunder" full-intensity keyframes, colors, or sizing.
- Do NOT change `theme.css` in this plan (token consolidation is plan 003).
- If `layout()` or the thumb rules do not match the excerpts above, STOP and
  report the drift.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`; and
  `cd plugin-web/agent; npm run build` (or the repo's plugin build:
  `cd webui; npm run build:plugin`). Expected: clean builds.
- **Feel check**: open the Thinking control on desktop and on a narrow window
  (trigger near the right edge), then:
  - In DevTools → Animations at 10% playback: the popover should appear to grow
    from the trigger corner — from the top-left when it opens below, from the
    bottom-right when it opens up and is edge-clamped.
  - Toggle it open/closed rapidly: it must not snap or jump; opacity/transform
    should retarget smoothly.
  - Press and drag the slider thumb: it narrows/talls smoothly; open DevTools →
    Performance and confirm no Layout/Paint rows fire on each press (only
    Composite).
  - Toggle `prefers-reduced-motion`: the popover should appear without the
    scale/slide and the thumb should not animate — but the value still updates.
- **Done when**: both copies set `transform-origin` from `layout()`, use the
  tokenized enter/leave, and no longer transition `width`/`height`/`margin-top`.
