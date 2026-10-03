# 009 — Grow the Usage daily bars from zero

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file

## Problem

The daily-trend bars set their height inline on mount, so the declared transform
transition never runs — the bars simply appear at full height.

```html
<!-- webui/src/pages/UsagePage.vue:211-213 — current -->
<div v-for="d in chartDays" :key="d.day" class="col" :title="…">
  <div class="col-bar" :style="{ transform: `scaleY(${barHeight(d.total)})` }"></div>
</div>
```
```css
/* webui/src/pages/UsagePage.vue:349-353 — current */
.col-bar {
  width: 100%; max-width: 44px; height: 100%; transform-origin: bottom; border-radius: 12px 12px 4px 4px;
  background: linear-gradient(180deg, var(--md-primary), color-mix(in srgb, var(--md-primary) 40%, var(--md-surface)));
  transition: transform var(--duration-long) var(--ease-spring), filter var(--duration-short) var(--ease-out);
}
```

Because the starting `transform` is applied in the same style pass as mount,
there is no transition: the bar is born at its final scale.

## Target

Give the bars a first-frame value with `@starting-style` so the existing
`transition: transform` plays on mount, growing each bar from `scaleY(0)` at its
`transform-origin: bottom`. `@starting-style` is already used in this repo (see
`plugin-web/agent/src/AgentsPage.vue:2193`). Add it as an **unscoped** style
block so Vue's scoped-CSS compiler does not interfere with the `@starting-style`
at-rule.

```css
/* target — appended as a second, unscoped <style> block at the end of UsagePage.vue */
@starting-style {
  #app .usage-page .col-bar { transform: scaleY(0); }
}
```

Keep the existing `.col-bar` transition and inline `scaleY(barHeight(...))`
unchanged; `--duration-long: 360ms` and `--ease-spring: cubic-bezier(0.22, 1.3, 0.36, 1)`
(theme.css:117,122) already give a lively grow. The slight spring overshoot on
the bar height is acceptable and matches the page's expressive tone.

## Repo conventions to follow

- `@starting-style` for a mount-time transition is the repo pattern:
  `plugin-web/agent/src/AgentsPage.vue:2191-2193`,
  `plugin-web/agent/src/ToolStepCard.vue:421-422`.
- The root of this page is `.usage-page`, which is why the selector is
  `#app .usage-page .col-bar` (matches the existing `#app .usage-page …` rules in
  the file).

## Steps

1. At the end of `webui/src/pages/UsagePage.vue`, after the existing
   `<style scoped> … </style>` block, add:
   ```html
   <style>
     @starting-style {
       #app .usage-page .col-bar { transform: scaleY(0); }
     }
   </style>
   ```
2. Leave `.col-bar`, `barHeight()`, and the template untouched.

## Boundaries

- Do NOT change the bar's transition, easing, or inline `scaleY` binding.
- Do NOT add JS or change the chart data.
- Do NOT convert other elements to `@starting-style` in this plan.
- If `.col-bar` doesn't match the excerpt, STOP and report.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build` (`@starting-style`
  inside a plain `<style>` is valid CSS and must survive the build).
- **Feel check**: reload the Usage page:
  - Every bar grows from the bottom axis to its value in one wave rather than
    appearing abruptly.
  - DevTools → Animations at 10%: confirm `col-bar` has a `transform` transition
    starting from `scaleY(0)`.
  - Toggle `prefers-reduced-motion` (and with the plan-008 change applied):
    bars appear at final height with no motion.
- **Done when**: bars animate from zero on mount.
