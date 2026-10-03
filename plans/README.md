# Animation improvement plans

Advisor output from an `improve-animations` audit of `d:\0kay` at commit
**67ffb1b**. Scope: the product UI — `webui/` (Vue 3 SPA) and the plugin UIs in
`plugin-web/` (agent / life / minecraft / skillsguishow). Vendored `agent/opencode/`
and `ZCode/` were not audited.

These plans are **self-contained** and read-only against source until executed.
Do not edit source as part of this audit workflow; run a plan to implement it.

## Plans

| # | Title | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| 001 | [Chat message entrance easing](001-chat-message-entrance-easing.md) | MEDIUM | Easing & duration | TODO |
| 002 | [Thinking popover physicality + thumb perf](002-thinking-popover-physicality.md) | MEDIUM | Physicality / Performance | TODO |
| 003 | [Motion token consolidation](003-motion-token-consolidation.md) | MEDIUM | Cohesion & tokens | TODO |
| 004 | [Usage page entrance cohesion](004-usage-entrance-cohesion.md) | LOW | Cohesion & tokens | TODO |
| 005 | [Usage composition bar → transform](005-usage-seg-transform.md) | LOW | Performance | TODO |
| 006 | [`<details>` interruptible reveal](006-details-interruptible-expand.md) | LOW | Interruptibility | TODO |
| 007 | [AppSelect menu origin](007-appselect-transform-origin.md) | LOW | Physicality & origin | TODO |
| 008 | [Reduced motion keeps non-motion feedback](008-reduced-motion-keep-non-motion.md) | LOW | Accessibility | TODO |
| 009 | [Usage chart bars grow from zero](009-usage-chart-bar-grow.md) | LOW | Missed opportunity | TODO |
| 010 | [Connection dot + nav badge feedback](010-status-feedback-transitions.md) | LOW | Missed opportunity | TODO |
| 011 | [Mobile chat drawer curve + scrim](011-mobile-chat-drawer-scrim.md) | LOW | Missed opportunity | TODO |

## Recommended execution order

1. **008** first — it is a single global rule in `theme.css` and every later
   feel-check assumes the corrected reduced-motion semantics.
2. **003** — adds `--duration-slower` and removes token drift; do it before the
   plans that reference tokens by name so no plan has to re-touch the token block.
3. **001, 002, 006, 007** — independent, one-file-per-component fixes.
4. **004, 005, 009** — all in `UsagePage.vue`; run in numerical order to avoid
   conflicting edits to the same stylesheet.
5. **010, 011** — independent UI feedback additions.

## Dependencies

- **003** adds `--duration-slower: 500ms` to `theme.css`. No other plan depends on
  it, but applying 003 first avoids touching the token block twice.
- **004** and **005** both edit `webui/src/pages/UsagePage.vue`; **009** adds a
  new unscoped `<style>` block to the same file. Sequence them (004 → 005 → 009).
- **011** adds `--ease-drawer` to the same `:root` token block that **003** edits;
  if run out of order, merge the token additions rather than overwriting.
- **008** changes the global reduced-motion behavior that every plan's feel-check
  references; run it first.

## Shared conventions (all plans)

- Motion tokens are the single source of truth: `webui/src/styles/theme.css:110-126`.
  Do not inline new curves/durations; extend that block.
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`,
  `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`,
  `--ease-spring: cubic-bezier(0.22, 1.3, 0.36, 1)`,
  `--duration-short: 140ms`, `--duration-medium: 220ms`, `--duration-long: 360ms`.
- Enter = decelerate (`--ease-out` / `--ease-emphasized-decel`), leave = accelerate
  (`--ease-emphasized-accel`); entrances animate `transform` + `opacity` only.
- Each plan includes a mandatory slow-motion **feel check**; motion can be
  mechanically correct and still feel wrong.
