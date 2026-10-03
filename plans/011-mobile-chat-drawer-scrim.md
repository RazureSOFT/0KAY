# 011 — Give the mobile chat drawer a drawer curve and a scrim

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 2 files (token + ChatPage)

## Problem

On mobile the chat column slides in as a drawer, but:

1. It uses the generic `--transition-normal` (a plain ease-out), not a drawer
   curve.
2. There is no scrim behind it, so the stage content stays fully bright while the
   panel slides over it — no spatial separation and no tap-to-dismiss target.

```css
/* webui/src/pages/ChatPage.vue:286-299 — current */
  .chat-column {
    position: absolute; right: 0; top: 0; bottom: 0;
    width: min(360px, 92vw); z-index: 5;
    box-shadow: var(--shadow-8);
    transform: translateX(100%);
    transition: transform var(--transition-normal);
  }
  .chat-column.open { transform: translateX(0); }
```
The open state is `showStatus && isMobile` (template line 145:
`:class="{ open: showStatus && isMobile }"`).

## Target

Add the iOS-like drawer curve from the audit to the shared tokens, use it for the
slide, and fade in a scrim under the drawer that dismisses on tap.

**Token** — `webui/src/styles/theme.css`, inside the `:root` motion block
(after `--ease-out` at line 111):

```css
/* target — add to :root tokens */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

**Drawer** — use a drawer budget (200–500ms) and the drawer curve:

```css
/* target — inside the @media (max-width: 960px) block */
  .chat-column {
    position: absolute; right: 0; top: 0; bottom: 0;
    width: min(360px, 92vw); z-index: 5;
    box-shadow: var(--shadow-8);
    transform: translateX(100%);
    transition: transform var(--duration-medium) var(--ease-drawer);
  }
  .chat-column.open { transform: translateX(0); }
```

**Scrim** — add a sibling element and CSS. It sits at `z-index: 4`, just under the
drawer (`z-index: 5`), and only exists on mobile.

```html
<!-- target — insert directly before the `.chat-column` div in the template -->
<div
  class="chat-scrim"
  :class="{ show: isMobile && showStatus && hasChat }"
  aria-hidden="true"
  @click="toggleStatus"
></div>
```
```css
/* target — add to ChatPage.vue's <style scoped> (mobile-relevant; hidden on desktop) */
.chat-scrim {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: var(--md-scrim);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-medium) var(--ease-out);
}
.chat-scrim.show { opacity: 1; pointer-events: auto; }
@media (min-width: 961px) { .chat-scrim { display: none; } }
```

`--duration-medium: 220ms` and `--ease-out` are already defined
(theme.css:111,121). `--md-scrim` is defined in the theme palette (theme.css:48).

## Repo conventions to follow

- Drawers/overlays fading a scrim with an opacity transition is the repo pattern:
  `webui/src/components/GlobalAgentInbox.vue:19,23`
  (`.inbox-fab-enter-active`, `.inbox-dialog-enter-active` use
  `var(--ease-emphasized-decel)`), and the scrim colors come from `--md-scrim`.
- Additive token goes in the same `:root` motion block as the other easings.

## Steps

1. `webui/src/styles/theme.css`: add `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);`
   inside `:root`, immediately after the `--ease-out` line (111).
2. `webui/src/pages/ChatPage.vue`:
   - Replace the mobile `.chat-column` transition (line 295) with
     `transition: transform var(--duration-medium) var(--ease-drawer);`.
   - Insert the `.chat-scrim` element (above) immediately before the
     `<div v-if="hasChat" class="chat-column">` block (template line 142).
   - Append the `.chat-scrim` CSS to the scoped `<style>` block.

## Boundaries

- Do NOT change `toggleStatus`, the mobile breakpoint (960px), or the drawer
  width.
- Do NOT add a scrim on desktop (`min-width: 961px` hides it).
- Do NOT alter the stage column or the status FAB.
- If the excerpts don't match, STOP and report.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`.
- **Feel check** (device emulation ≤ 960px wide):
  - Tap the status FAB: the chat drawer slides in from the right with the
    iOS-like curve (fast initial travel, soft settle) while a dim scrim fades in
    behind it.
  - Tapping the scrim (outside the drawer) closes it; the scrim fades out under
    the panel.
  - On desktop width (> 960px) there is no scrim.
  - DevTools → Animations at 10%: drawer uses `cubic-bezier(0.32, 0.72, 0, 1)`;
    scrim transitions opacity only.
  - `prefers-reduced-motion`: drawer snaps in/out and scrim appears instantly,
    but the scrim still blocks taps and still closes on tap.
- **Done when**: the drawer animates with the drawer curve and a dismissible
  scrim fades in behind it on mobile only.
