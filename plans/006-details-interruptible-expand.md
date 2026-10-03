# 006 — Make `<details>` content reveal interruptible

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: LOW
- **Category**: Interruptibility
- **Estimated scope**: 1 file, 1 rule

## Problem

The global rule that reveals `<details>` content uses a `@keyframes` animation.
A keyframe restarts from zero every time it is applied and cannot retarget, so
rapidly toggling a reasoning/tool `<details>` (common in the agent plugin, which
renders inside `#app`) causes the content to flash from invisible each time. It
also only animates on open, never on close.

```css
/* webui/src/styles/theme.css:450 — current */
#app details[open] > :not(summary) { animation: surface-arrive var(--duration-medium) var(--ease-out); }
```

## Target

Use an interruptible transition plus `@starting-style` for the first-frame state.
Transitions retarget from the current value, so repeated open/close is smooth.
`@starting-style` is already an accepted technique in this repo — see
`plugin-web/agent/src/AgentsPage.vue:2193`
(`@starting-style{.turn{opacity:0;transform:translateY(10px)}}`).

```css
/* target — replace the single rule at theme.css:450 */
#app details > :not(summary) {
  opacity: 1;
  transform: none;
  transition: opacity var(--duration-medium) var(--ease-out),
              transform var(--duration-medium) var(--ease-out);
}
@starting-style {
  #app details[open] > :not(summary) { opacity: 0; transform: translateY(-4px); }
}
```

`--duration-medium: 220ms` and `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` are
defined in `webui/src/styles/theme.css:111,121`. Closing cannot be animated
because the `details` element hides its content immediately — that is expected;
this plan only fixes the repeated-open flash and makes it interruptible.

## Repo conventions to follow

- `@starting-style` + transition (not keyframes) for enter-on-mount is the
  established pattern for interruptible entrances:
  `plugin-web/agent/src/AgentsPage.vue:2191-2193` and
  `plugin-web/agent/src/ToolStepCard.vue:421-422`.

## Steps

1. In `webui/src/styles/theme.css`, replace the rule at line 450
   (`#app details[open] > :not(summary) { animation: surface-arrive … }`) with
   the two target blocks above.

## Boundaries

- Do NOT touch the `surface-arrive` keyframe definition (it is used elsewhere:
  `theme.css:423, 466, 485`).
- Do NOT add JS.
- If line 450 does not match, STOP and report.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`.
- **Feel check**: in the agent workspace, expand/collapse a reasoning chain or
  tool `<details>` panel several times quickly:
  - The content should slide in and, when toggled fast, retarget smoothly rather
    than flashing from `opacity: 0` on every open.
  - In DevTools → Animations at 10%, confirm it is a transition (interruptible),
    not a restarted keyframe.
  - Toggle `prefers-reduced-motion`: the reveal should be instant with no
    vertical movement.
- **Done when**: `<details>` reveals use a transition and the keyframe rule is
  gone.
