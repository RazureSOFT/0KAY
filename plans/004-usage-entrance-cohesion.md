# 004 — Unify the Usage page card entrances

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (template + style)

## Problem

`webui/src/pages/UsagePage.vue` declares its own `up` entrance animation on
several containers, while `webui/src/styles/theme.css:416-425` already applies a
higher-specificity staggered entrance to the same selectors:

```css
/* webui/src/pages/UsagePage.vue:285-289 — current */
.card {
  background: var(--md-surface-container-low); border: 1px solid …;
  border-radius: 32px; padding: 24px; box-shadow: var(--shadow-1);
  animation: up var(--duration-long) var(--ease-spring) both;
}
/* :322 .mini, :336 .panel, :364 .model-card all repeat the same line */
@keyframes up { from { opacity: 0; transform: translateY(16px) scale(.985); } to { opacity: 1; transform: none; } }  /* :385 */
```

Because `#app :is(.card, .plugin-card, …)` (theme.css) out-specifies the scoped
`.card`, the theme's `surface-arrive` + `animation-delay: calc(var(--i,0) * 45ms)`
wins on `.card` and the local `up` rule is dead there — yet `.panel`, `.mini`,
and `.model-card` still run `up` with a spring curve and no stagger. The page
therefore mixes two arrival styles and has no shared stagger.

## Target

One arrival style for the whole page — the theme's own `surface-arrive`
(`theme.css:286-289,416-425`), tokenized, staggered via `--i`:

- Remove the local `animation: up …` declaration from `.card`, `.mini`, `.panel`,
  `.model-card`.
- Delete the now-unused `@keyframes up` block (lines 385-386).
- Re-add `surface-arrive` explicitly where the theme does not cover the selector
  (`.panel`, `.mini`, `.model-card`) using the theme's exact values:
  `animation: surface-arrive var(--duration-long) var(--ease-emphasized) both;`
  `animation-delay: calc(var(--i, 0) * 45ms);`
- Drive `--i` from the template on the `v-for` items so the stagger is real.

## Repo conventions to follow

- The canonical staggered card entrance lives in
  `webui/src/styles/theme.css:416-425`:
  `animation: surface-arrive var(--duration-long) var(--ease-emphasized) both;`
  `animation-delay: calc(var(--i, 0) * 45ms);`
  Reuse these exact declarations; `--ease-emphasized: cubic-bezier(0.2, 0, 0, 1)`
  and `--duration-long: 360ms` (theme.css:114,122).
- `surface-arrive` is defined at `theme.css:286-289` (translateY(8px) + fade).

## Steps

Style (`webui/src/pages/UsagePage.vue`):
1. Delete the `animation: up var(--duration-long) var(--ease-spring) both;` line
   from `.card` (:288), `.mini` (:322), `.panel` (:336), `.model-card` (:364).
2. On `.panel`, `.mini`, and `.model-card`, add:
   ```css
   animation: surface-arrive var(--duration-long) var(--ease-emphasized) both;
   animation-delay: calc(var(--i, 0) * 45ms);
   ```
3. Delete the `@keyframes up { … }` block (:385-386).

Template:
4. Add a per-item index so `--i` is set:
   - Overview `<article class="card">` instances: add `:style="{ '--i': 0 }"`,
     `:style="{ '--i': 1 }"`, … in document order.
   - `<article … class="mini">` (`v-for` over the mini stats, if any): add
     `:style="{ '--i': idx }"` using the loop index.
   - `<article v-for="row in modelRows" class="model-card" :style="{ '--c': row.color }">`
     (:230): extend the existing style object to
     `:style="{ '--c': row.color, '--i': rowIndex }"` where `rowIndex` is the
     `v-for` index (`v-for="(row, rowIndex) in modelRows"`).
5. Leave `.panel` instances with no explicit `--i` (they fall back to `0`,
   matching today's single arrival).

## Boundaries

- Do NOT change any other property of these rules (colors, radii, padding).
- Do NOT change `theme.css`.
- Keep total stagger feel under ~180ms; do not raise the 45ms multiplier.
- If the lines above have drifted, STOP and report.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`; then
  `grep -n "keyframes up" webui/src/pages/UsagePage.vue` → no matches.
- **Feel check**: open the Usage page (with usage data):
  - Cards/panels rise the same 8px and settle together in one wave; the model
    cards should fan in left-to-right, each ~45ms apart.
  - In DevTools → Animations at 10%, confirm every container uses
    `surface-arrive` (not a spring overshoot) and that delays increase by 45ms.
  - Toggle `prefers-reduced-motion`: no movement, content visible.
- **Done when**: only `surface-arrive` is used on the page and the local `up`
  keyframe is gone.
