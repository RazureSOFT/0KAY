# WebUI Design System (Material 3 Expressive)

The WebUI ships a **Material 3 Expressive** design system as CSS custom
properties and a small set of shared component classes. They are defined once in
`webui/src/styles/theme.css` on `:root`, so every part of the app — including
plugin-owned custom pages, which render inside `#app` — can use them for a
consistent look. Never hardcode colors, radii or shadows; use these tokens.

## 1. Color roles

Use a role token for each purpose (`primary` for the main action, `surface-*`
for backgrounds, `outline*` for borders, `error`/`success` for status):

| Token | Role |
|---|---|
| `--md-primary`, `--md-on-primary` | Main accent and text/icon on it |
| `--md-primary-container`, `--md-on-primary-container` | Tonal fill (selected, chips, fills) |
| `--md-secondary-container`, `--md-on-secondary-container` | Secondary/tonal buttons, quiet chips |
| `--md-tertiary`, `--md-tertiary-container`, `--md-on-tertiary-container` | Third accent for variety |
| `--md-error`, `--md-error-container`, `--md-on-error` | Errors and destructive actions |
| `--md-success`, `--md-success-container` | Success/healthy state |
| `--md-warning` | Warnings |
| `--md-surface`, `--md-surface-container-lowest/-low/(default)/-high/-highest` | Background elevation layers, low → high |
| `--md-on-surface`, `--md-on-surface-variant` | Primary / secondary text |
| `--md-outline`, `--md-outline-variant` | Strong / subtle borders and dividers |
| `--md-inverse-surface`, `--md-inverse-on-surface`, `--md-inverse-primary` | Snackbars, tooltips |
| `--md-scrim` | Modal scrim |

Legacy aliases (`--brand-primary`, `--success`, `--error`, `--info`, `--neutral-*`)
exist for older code; prefer the `--md-*` roles. The Expressive palette overrides
these `:root` values, so the token names — not the literal colors — are the API.

Use `color-mix(in srgb, var(--md-primary) 12%, transparent)` for tinted
state layers instead of inventing new colors.

## 2. Shape, elevation, motion, type, spacing

| Group | Tokens |
|---|---|
| Radius | `--radius-xs` `--radius-sm` `--radius-md` `--radius-lg` `--radius-xl` `--radius-full` `--radius-round` (Expressive raises these: e.g. `lg`≈28px, `xl`≈36px) |
| Elevation | `--shadow-1` `--shadow-2` `--shadow-3` `--shadow-4` `--shadow-8` `--shadow-16` |
| Easing | `--ease-spring` (overshoot, for entrances/selection), `--ease-emphasized`, `--ease-emphasized-decel`, `--ease-emphasized-accel`, `--ease-standard` |
| Duration | `--duration-short` (100ms) `--duration-medium` (300ms) `--duration-long` (500ms) |
| Transitions | `--transition-fast` `--transition-normal` `--transition-slow` |
| Type | `--font-family`, `--font-size-xs|sm|base|md|lg|xl|xxl` |
| Spacing | `--space-xs|sm|md|lg|xl|xxl` |

Prefer `var(--ease-spring)` for interactive motion and `--radius-*` for shapes;
wrap non-essential animation in a `@media (prefers-reduced-motion: reduce)`
opt-out.

## 3. Shared component classes

These classes are styled globally (under `#app`) and are safe to reuse:

| Class | Purpose |
|---|---|
| `.btn` + `.btn-primary` / `.btn-tonal` / `.btn-ghost` / `.btn-secondary` / `.btn-danger` | Filled, tonal, text, secondary and destructive buttons (pill shape, spring press) |
| `.input`, `.textarea` | Filled text fields and textareas (focus ring in `--md-primary`) |
| `.card` | Surface container with radius + `--shadow-1` |
| `.chip` / `.chip.active` | Compact pills; `active` uses the secondary container |
| `.avatar` / `.avatar-sm` / `.avatar-lg` | Circular identity tiles |
| `.icon-btn` | Square icon button used in the app header |

Plain `<input>`, `<select>` and `<textarea>` inside `#app` (and all `button`s)
already receive the Expressive treatment from `theme.css`, including the filled
select surface and the spring press/shape-morph.

## 4. Host components you can mirror (not import)

Plugin ESM pages cannot import host Vue components, but they can match their
look or ship a copy:

- **AppSelect** — the global dropdown (`webui/src/components/AppSelect.vue`,
  classes `.app-select`, `.app-select-trigger`, `.app-select-menu`,
  `.app-select-option`, `.app-select-check`). `plugin-web/life` and
  `plugin-web/agent` ship their own `AppSelect.vue`; copy that pattern.
- **ConfirmDialog** — modal confirm (`.confirm-scrim`, `.confirm-dialog`).
- **ThinkingSlider** — reasoning-effort slider used by the agent composer.

## 5. Rules for custom pages

- Scope your selectors with a page-unique class, e.g. `#app .my-page …`, so host
  styles never leak in and yours never leak out.
- Build surfaces from `--md-surface-container-*`, borders from
  `--md-outline-variant`, text from `--md-on-surface*`, accents from the
  primary/secondary/tertiary containers.
- Use `.btn`, `.input`, `.chip` for standard controls before writing your own.
- Motion: `var(--ease-spring)` + `--duration-*`; never animate on hover-only
  without respecting reduced motion.
- See [WebUI Custom Pages](custom-pages.md) for how a page is registered and
  loaded.

## 6. Replacing the theme from a plugin

The token names above are the contract: a plugin swaps the whole Material 3
Expressive palette by overriding them in a `theme` patch instead of editing
`webui/src/styles/theme.css` or injecting a `<style>` tag from JavaScript.

```json
{
  "id": "midnight-theme",
  "plugin": "midnight",
  "patches": [
    {
      "target": "theme",
      "op": "insert",
      "id": "midnight",
      "item": {
        "id": "midnight",
        "order": 10,
        "tokens": {
          "light": { "--md-primary": "#006874", "--md-surface": "#f5f9fa" },
          "dark": { "--md-primary": "#4fd8eb", "--md-surface": "#0e1416" }
        },
        "cssUrl": "/api/plugins/midnight/ui/theme.css"
      }
    }
  ]
}
```

- **`tokens`** is the fast path: only roles you name are redeclared, everything
  else keeps the host palette. A flat map (no `light`/`dark` wrapper) applies
  the same values in both schemes.
- **`css`** / **`cssUrl`** are the escape hatch for anything tokens cannot
  express — component restyling, an added font, a full replacement stylesheet.
- Declarations are ordered by `order` (ascending) in `<head>`; light and dark
  blocks share one specificity, so a later `order` always wins. `remove` takes
  the theme back off.

Full field reference and rendering rules:
[Settings and UI Patches → Theme items](settings-ui.md#theme-items).

**Worked example:** the repo ships a complete Fluent Design (Windows 11) theme
as a real patch — `plugin-web/fluentui/patches/fluentui.patch`, published as the
`@razuresoft/0kay-theme-fluentui` pm package. It redeclares all 37 color roles
per scheme plus `css` for shape, typography, elevation and control restyling, so
read it next to this section when authoring your own theme. Installing the
package copies the patch into Core's `data/ui/` (manifest `patches`), where the
`fluentui` registry row picks it up; it is owned by that row (a Core-managed,
process-less plugin), so the switch on the Plugins page turns the whole theme
off — see
[Theme items → Owning plugin](settings-ui.md#owning-plugin-and-the-plugins-page-switch).
