# 001 — Use the motion tokens for chat message entrance

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, 1 declaration

## Problem

Every chat message mounts with a keyframe animation that uses the browser's
built-in `ease` curve and a raw `200ms` duration. `ease` is the weakest default
and starts slower than the recommended strong ease-out, so each message on the
core, high-frequency chat surface eases in sluggishly. It is also a
`@keyframes` animation, so it always plays from zero and cannot retarget if the
list settles mid-animation.

```css
/* webui/src/components/MessageBubble.vue:114 — current */
.message {
  display: flex;
  gap: var(--space-md);
  animation: slideUp 0.2s ease;
}
```

## Target

Use the repo's motion tokens instead of the built-in easing. The tokens are
defined in `webui/src/styles/theme.css:111-121`:

- `--ease-emphasized-decel: cubic-bezier(0.05, 0.7, 0.1, 1)` — the repo's
  strong decelerate curve for entrances.
- `--duration-medium: 220ms`.

The global `slideUp` keyframe (`theme.css:273`, `translateY(12px)` → `0`) is
reused unchanged. `both` keeps the element at the keyframe's start until the
animation begins so no full-opacity frame flashes.

```css
/* target */
.message {
  display: flex;
  gap: var(--space-md);
  animation: slideUp var(--duration-medium) var(--ease-emphasized-decel) both;
}
```

## Repo conventions to follow

- Motion tokens are the single source of truth — declared once in
  `webui/src/styles/theme.css:110-126`; do not inline curves or raw durations.
- The repo already ships the exact pattern to imitate:
  `webui/src/styles/theme.css:300`
  `.animate-slideUp { animation: slideUp var(--duration-medium) var(--ease-emphasized-decel); }`

## Steps

1. In `webui/src/components/MessageBubble.vue`, inside the `.message` rule
   (line 117), replace:
   `animation: slideUp 0.2s ease;`
   with:
   `animation: slideUp var(--duration-medium) var(--ease-emphasized-decel) both;`

## Boundaries

- Do NOT touch any other declaration, component, or the `slideUp` keyframe.
- Do NOT change markup.
- If line 117 no longer reads `animation: slideUp 0.2s ease`, STOP and report the
  drift instead of improvising.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build` — expected: no errors
  (`vue-tsc` passes).
- **Feel check**: run `npm run dev`, send ~10 messages quickly, and confirm each
  bubble rises the same 12px but feels snappier (fast start, gentle settle).
  - In DevTools → Animations, set playback to 10%: the bubble curve should
    decelerate (fast first half), not be symmetrical like `ease`.
  - Spamming send must never make a bubble restart its entrance from zero.
  - Toggle `prefers-reduced-motion` (Rendering panel): the global rule at
    `theme.css:580` reduces duration to 1ms, so messages appear instantly with
    no movement.
- **Done when**: `.message` uses `var(--duration-medium) var(--ease-emphasized-decel)`
  and the build passes.
