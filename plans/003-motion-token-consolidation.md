# 003 — Replace hand-typed curves/durations with the shared motion tokens

- **Status**: TODO
- **Commit**: 67ffb1b
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 3 files (2 components + the token file)

## Problem

`webui/src/styles/theme.css:110-126` defines the single source of truth for
motion (`--ease-out`, `--ease-spring`, `--duration-short/medium/long`, …). Two
components bypass it:

- `webui/src/components/SetupWizard.vue` writes fallback literals that duplicate
  the token (`var(--ease-spring, cubic-bezier(.22,1.3,.36,1))`, `var(--ease-spring, ease)`)
  and hard-codes `160/180/200/240/260/300/320/350/380/500ms`.
- `webui/src/components/LifeSettingsPanel.vue` creates a **second, self-referential**
  spring alias and hard-codes durations:

```css
/* webui/src/components/LifeSettingsPanel.vue:125 — current */
.life-settings { --ls-spring: var(--ease-spring); padding: 4px; }
/* used as: transition: transform 300ms var(--ls-spring), box-shadow 300ms var(--ls-spring); */
```

The literal fallbacks are dead code (the tokens always resolve), and the
duplicated values drift from the shared scale, so the same product uses several
near-identical curves/durations.

## Target

Every curve references a `-–ease-*` token and every duration references a
`--duration-*` token. Add one missing step to the scale. Final tokens in
`webui/src/styles/theme.css` after the edit:

```css
/* webui/src/styles/theme.css:119-123 — current */
  --duration-instant: 90ms;
  --duration-short: 140ms;
  --duration-medium: 220ms;
  --duration-long: 360ms;
```
```css
/* target — add one line */
  --duration-instant: 90ms;
  --duration-short: 140ms;
  --duration-medium: 220ms;
  --duration-long: 360ms;
  --duration-slower: 500ms;
```

Duration mapping to apply everywhere in the two components:

| Current literal | Replace with |
| --- | --- |
| 90ms | `var(--duration-instant)` |
| 140, 160, 180ms | `var(--duration-short)` |
| 200, 220, 240, 260, 300ms | `var(--duration-medium)` |
| 320, 340, 350, 360, 380ms | `var(--duration-long)` |
| 480, 500, 520ms | `var(--duration-slower)` |

Easing mapping:

| Current | Replace with |
| --- | --- |
| `var(--ease-spring, cubic-bezier(.22,1.3,.36,1))` | `var(--ease-spring)` |
| `var(--ease-spring, ease)` | `var(--ease-spring)` |
| `ease` (on an entrance keyframe) | `var(--ease-out)` |
| `ease-out` (literal) | `var(--ease-out)` |
| `var(--ls-spring)` | `var(--ease-spring)` (and delete the alias) |

## Repo conventions to follow

- Tokens are declared once in `webui/src/styles/theme.css:110-126`; extend that
  file (as above), never create a parallel set.
- `webui/src/styles/settings.css:9-11` shows the intended relationship: it
  *aliases* the shared tokens (`--set-spring: var(--ease-spring)`) rather than
  re-declaring curves. Follow that spirit; here we can use the tokens directly.
- An internal exemplar already in SetupWizard:
  `webui/src/components/SetupWizard.vue:565` —
  `transition: transform var(--duration-long) var(--ease-spring);`

## Steps

1. `webui/src/styles/theme.css`: after line 122 (`--duration-long: 360ms;`) add
   `--duration-slower: 500ms;`.
2. `webui/src/components/LifeSettingsPanel.vue`:
   - Line 125: remove `--ls-spring: var(--ease-spring);` leaving
     `.life-settings { padding: 4px; }`.
   - Replace every `var(--ls-spring)` with `var(--ease-spring)` (lines 144, 172,
     192, 193, 231, 248, 287, 317).
   - Apply the duration/easing mapping table to lines 144, 172, 192, 193, 231,
     248, 287, 317.
3. `webui/src/components/SetupWizard.vue`: apply the mapping table to the motion
   declarations at lines 470, 483, 540, 554, 575, 591, 599, 623, 634, 651, 663,
   667, 679, 680, 683, 684, 691. (Line 565 is already correct.) Keylines:
   - 483: `sheet-in 380ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both`
     → `sheet-in var(--duration-long) var(--ease-spring) both`
   - 575: `pane-in 260ms var(--ease-spring, ease) both`
     → `pane-in var(--duration-medium) var(--ease-out) both`
   - 683: `pane-in 240ms ease both`
     → `pane-in var(--duration-medium) var(--ease-out) both`
   - 599, 634: `opacity 180ms, transform 260ms var(--ease-spring, ease)`
     → `opacity var(--duration-short) var(--ease-out), transform var(--duration-medium) var(--ease-spring)`
   - 691: `emblem-in 500ms var(--ease-spring, ease) both`
     → `emblem-in var(--duration-slower) var(--ease-spring) both`
   - Do not forget the plain `ease-out`/`ease` literals: 470 (`fadeIn 200ms ease-out`)
     → `fadeIn var(--duration-medium) var(--ease-out)`.

## Boundaries

- Motion properties only. Do NOT change colors, layout, markup, or remove the
  `@keyframes sheet-in/pane-in/emblem-in/ls-rise/ls-card-in` definitions.
- Do NOT touch `--set-*` aliases in `settings.css` (they are already token-based).
- Do NOT introduce any new easing curve. Only the one `--duration-slower` token.
- If any listed line no longer matches, STOP and report the drift rather than
  guessing a replacement.

## Verification

- **Mechanical**: `cd webui; npm run lint; npm run build`; then grep to confirm
  no literals remain:
  `grep -rn "ls-spring" webui/src` → no matches;
  `grep -rn "ease-spring, " webui/src/components/SetupWizard.vue` → no matches.
- **Feel check**: run the first-run wizard end to end and the Settings → 人设
  (LIFE) panel:
  - Step changes still slide/fade at the same pace; nothing looks faster/slower
    by more than a hair (this is a refactor — the *visual* result should be the
    same or marginally cleaner).
  - The toggle switch, provider/language cards, and check badges still animate.
  - In DevTools → Animations, confirm the wizard sheet uses
    `cubic-bezier(0.22, 1.3, 0.36, 1)`.
  - Toggle `prefers-reduced-motion`: animations are neutralized as before.
- **Done when**: the two components reference only `--ease-*` / `--duration-*`
  tokens for motion, `--ls-spring` is gone, and the build passes.
