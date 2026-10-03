# 010 — Animate the connection dot and nav badge state changes

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file (template + style)

## Problem

Two status indicators change state by snapping:

1. The header connection dot toggles its color and halo instantly.
2. The nav badge appears/disappears and changes count with no motion.

```css
/* webui/src/App.vue:498-508 — current */
.conn-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--md-outline); margin-right: 4px; }
.conn-dot.on { background: var(--md-success); box-shadow: 0 0 0 4px color-mix(in srgb, var(--md-success) 20%, transparent); }
```
```html
<!-- webui/src/App.vue:432 — current -->
<span v-if="navBadge(item) != null" class="badge">{{ navBadge(item) }}</span>
```

## Target

**Dot** — ease the color/halo and give the "online" state a small scale pop.
Tokens from `webui/src/styles/theme.css:111,117,121`:
`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`,
`--ease-spring: cubic-bezier(0.22, 1.3, 0.36, 1)`, `--duration-medium: 220ms`.

```css
/* target */
.conn-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--md-outline); margin-right: 4px;
  transition: background-color var(--duration-medium) var(--ease-out),
              box-shadow var(--duration-medium) var(--ease-out),
              transform var(--duration-medium) var(--ease-spring);
}
.conn-dot.on {
  background: var(--md-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--md-success) 20%, transparent);
  transform: scale(1.08);
}
```

**Badge** — wrap in `<Transition name="badge">` so mounting/unmounting fades and
pops from its own size. Enter uses the spring (a rare, positive moment); leave
uses the plain ease-out.

```html
<!-- target -->
<Transition name="badge">
  <span v-if="navBadge(item) != null" class="badge">{{ navBadge(item) }}</span>
</Transition>
```
```css
/* target — add to the scoped <style> of App.vue */
.badge { transform-origin: center; }
.badge-enter-active {
  transition: opacity var(--duration-short) var(--ease-out),
              transform var(--duration-short) var(--ease-spring);
}
.badge-leave-active {
  transition: opacity var(--duration-short) var(--ease-out),
              transform var(--duration-short) var(--ease-out);
}
.badge-enter-from,
.badge-leave-to { opacity: 0; transform: scale(0.4); }
```

`--duration-short: 140ms` (theme.css:120). Do **not** add `:key` to the badge, so
a count change updates the text in place (no re-animation); only appear/disappear
animates.

## Repo conventions to follow

- State-feedback transitions using tokens: `webui/src/styles/theme.css:503`
  (`.inbox-dialog button { transition: transform var(--duration-short) var(--ease-out), … }`).
- Enter = decelerate/spring, leave = accelerate/ease-out is the repo's pattern
  (e.g. `webui/src/pages/PluginsPage.vue:693-697`).

## Steps

1. In `webui/src/App.vue`, replace the `.conn-dot` and `.conn-dot.on` rules
   (lines 498-508) with the target CSS above.
2. In the nav list template, wrap the badge `<span>` (line 432) with
   `<Transition name="badge"> … </Transition>` exactly as shown.
3. Append the `.badge-enter-*` / `.badge-leave-*` rules to App.vue's `<style scoped>`
   block.

## Boundaries

- Do NOT change `navBadge()` logic, badge markup classes, or the connect/disconnect
  store code.
- Do NOT add a `:key` to the badge.
- Do NOT change the nav item's own transitions.
- If the lines above have drifted, STOP and report.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`.
- **Feel check**:
  - Start/stop the life connection (or toggle network) and watch the header dot:
    color and halo fade in, the dot softly scales up when online.
  - Trigger/then clear an agent inbox item so a nav badge appears and disappears:
    it pops in over 140ms and fades out; changing only its number must **not**
    replay the animation.
  - DevTools → Animations at 10%: dot transitions `background-color` +
    `box-shadow` + `transform`; badge uses scale on enter.
  - `prefers-reduced-motion`: both appear/update without movement (color only).
- **Done when**: the dot eases between states and the badge animates on
  appear/disappear but not on count change.
