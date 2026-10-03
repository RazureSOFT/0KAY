# 005 — Animate the Usage composition bar with transform, not width

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file (template + style)

## Problem

The prompt/completion composition bar animates the `width` property, which
triggers layout + paint + composite instead of compositing only.

```css
/* webui/src/pages/UsagePage.vue:306-309 — current */
.compose { display: flex; height: 18px; border-radius: 999px; overflow: hidden; background: var(--md-surface-container-high); }
.seg { height: 100%; transition: width var(--duration-long) var(--ease-spring); }
.seg.prompt { background: linear-gradient(90deg, var(--md-primary), color-mix(in srgb, var(--md-primary) 70%, var(--md-tertiary))); }
.seg.completion { background: linear-gradient(90deg, color-mix(in srgb, var(--md-tertiary) 80%, var(--md-primary)), var(--md-tertiary)); }
```
```html
<!-- webui/src/pages/UsagePage.vue:173-176 — current -->
<div class="compose" role="img" :aria-label="`prompt ${promptShare}% / completion ${completionShare}%`">
  <span class="seg prompt" :style="{ width: `${promptShare}%` }"></span>
  <span class="seg completion" :style="{ width: `${completionShare}%` }"></span>
</div>
```

## Target

Composite-only scale animation. Both segments are absolutely positioned; the
prompt segment scales from `0` to its share, the completion segment is offset by
`left: promptShare%` and scales to its own share. `--duration-long: 360ms` and
`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (theme.css:111,122). `--ease-out`
(not the spring) is used because a spring overshoot would push `scaleX` past 1
and clip against `overflow: hidden`.

```css
/* target */
.compose { position: relative; height: 18px; border-radius: 999px; overflow: hidden; background: var(--md-surface-container-high); }
.seg {
  position: absolute;
  inset: 0;
  height: 100%;
  transform-origin: left center;
  transform: scaleX(var(--seg, 0));
  transition: transform var(--duration-long) var(--ease-out);
}
.seg.prompt { background: linear-gradient(90deg, var(--md-primary), color-mix(in srgb, var(--md-primary) 70%, var(--md-tertiary))); }
.seg.completion { background: linear-gradient(90deg, color-mix(in srgb, var(--md-tertiary) 80%, var(--md-primary)), var(--md-tertiary)); }
```
```html
<!-- target -->
<div class="compose" role="img" :aria-label="`prompt ${promptShare}% / completion ${completionShare}%`">
  <span class="seg prompt" :style="{ '--seg': promptShare / 100 }"></span>
  <span class="seg completion" :style="{ left: `${promptShare}%`, '--seg': completionShare / 100 }"></span>
</div>
```
`--seg` is a unitless number so `scaleX(var(--seg, 0))` is valid.

## Repo conventions to follow

- The repo already animates bars with `transform: scaleX` + `transform-origin:
  left`, e.g. `plugin-web/minecraft/src/MinecraftPage.vue:315`
  (`.bar i { transform-origin: left; transform: scaleX(0); transition: transform … }`)
  and `webui/src/components/StatusPanel.vue:417-419`.
- Tokens: `webui/src/styles/theme.css:111` (`--ease-out`) and `:122`
  (`--duration-long`).

## Steps

1. In `webui/src/pages/UsagePage.vue`, replace the `.compose` / `.seg` rules
   (lines 306-307) with the target CSS above (keep `.seg.prompt` / `.seg.completion`
   backgrounds unchanged).
2. Replace the two `<span class="seg …">` template lines (174-175) with the
   target markup above.

## Boundaries

- Do NOT change `promptShare` / `completionShare` computations or `aria-label`.
- Do NOT change colors.
- Do NOT add a stagger or keyframes.
- If the template/style does not match the excerpts, STOP and report.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`.
- **Feel check**: open the Usage page and let data settle:
  - The prompt (violet) segment grows from the left edge to its share; the
    completion (tertiary) segment then grows from the prompt boundary.
  - Open DevTools → Performance and re-trigger a data refresh: the segment
    update should show Composite only, no Layout.
  - Toggle `prefers-reduced-motion`: segments jump to their final size (no growth)
    but remain correct.
- **Done when**: `.seg` transitions `transform` and no longer transitions `width`.
