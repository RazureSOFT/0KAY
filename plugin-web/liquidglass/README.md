# @razuresoft/0kay-theme-liquidglass

## 0.2 clear-lens material

The runtime material in `ui/optics.css` replaces the original heavy frost with
2px blur, thin transparent tint, directional inner highlights and floating
shadows. The engine bends only an edge band and separates RGB displacement
slightly to produce subtle edge dispersion. Pointer position moves the surface
reflection; reduced-motion disables that interaction. Text is never filtered.

The patch remains the static fallback. The bootstrap loads and unloads both
the optical stylesheet and the filter resources. Edit `ui/optics.css` for the
runtime material and keep its blur/saturation synchronized with `BASE` in
`ui/theme.js`.

Design references (independent implementation):
- https://inspira-ui.com/docs/cn/components/visualization/liquid-glass
- https://juejin.cn/post/7514618352829448244
- https://github.com/mianbeishiwole/Liquid-Glass-Vue

Browser checks establish rendering and lifecycle behavior; visual fidelity
still needs human review on the actual application background.

An Apple-flavoured `target:"theme"` theme patch for the 0KAY WebUI with a real
refraction engine: translucent **liquid glass** chrome (nav rail, header,
chat input bar, agent composer, settings drawer, select menus) that optically bends the color wash
behind it via an SVG displacement filter (`feImage` + `feDisplacementMap`
mounted into `backdrop-filter: … url(#lg-disp-N)`), plus capsule controls,
24px cards, Apple system colors (`#007AFF` / `#0A84FF`) and the iOS motion
curve.

## Files

| file | role |
| --- | --- |
| `manifest.json` | pm manifest: installs `patches/liquidglass.patch` and publishes `ui/` |
| `patches/liquidglass.patch` | `theme` op (order 20, tokens + css) + `bootstrap` op (engine module) |
| `ui/theme.js` | self-contained refraction engine, served from `CORE_DATA_DIR/plugin-ui/liquidglass/` |

The patch is **not** part of the platform checkout: installing this package
copies `patches/liquidglass.patch` into Core's `data/ui/`, where its
`"plugin": "liquidglass"` field ties the theme to its Plugins page row, and
`manifest.ui` copies `ui/` into `data/plugin-ui/liquidglass/`.

## How it works

Two ops in one patch file:

```json
{ "target": "theme", "op": "insert", "id": "liquidglass",
  "item": { "id": "liquidglass", "order": 20, "tokens": { "light": {…}, "dark": {…} }, "css": "…" } }
{ "target": "bootstrap", "op": "insert", "id": "liquidglass-engine",
  "item": { "id": "liquidglass-engine", "plugin": "liquidglass",
            "module": "/api/plugins/liquidglass/ui/theme.js?v=2" } }
```

- **Tokens** follow the usual contract: `light` into `html:root { … }`,
  `dark` into `html:root[data-theme="dark"] { … }` (specificity 0,2,1), only
  `--` keys, values containing `;`/`{`/`}` dropped. Besides the palette the
  dark set carries `--lg-*` material variables (chrome fill, slab, hairline,
  inner light, mesh washes) so one component layer covers both schemes.
- **css** draws the stack: a fixed mesh wash on `html:root` (the thing glass
  refracts), one big translucent `app-main` slab over it, glass chrome panels
  with `backdrop-filter: blur(28px) saturate(190%)`, capsule controls, 24px
  cards with an inner-light hairline, Apple stat tints, and a motion layer on
  `cubic-bezier(.32,.72,0,1)` that retimes the host's M3 springs and removes
  hover lifts. Every rule carries `!important` (host rules are scoped
  `#app .page .x[data-v-…]`, see `docs/design-system.md` § 6).
- **bootstrap** loads `ui/theme.js`, which feature-detects
  `CSS.supports('backdrop-filter', 'blur() saturate() url(#a)')` and, when
  supported, builds a rounded-rectangle SDF displacement map on a canvas for
   each of six targets (header, rail, chat input bar, agent composer, settings
   drawer, select menu),
  mounts an SVG filter per element and appends ` url(#lg-disp-N)` to the
  element's inline `backdrop-filter` (with `!important`, so it outranks the
  stylesheet). Maps rebuild via `ResizeObserver`, targets are re-scanned via
  `MutationObserver`. Browsers that reject `url()` keep the stylesheet's plain
  blur — degradation is automatic and the theme still works with the engine
  missing entirely (disable the plugin and the glass CSS disappears too).

## Install

```sh
# local checkout
0kay-pm install @razuresoft/0kay-theme-liquidglass --source .\plugin-web\liquidglass
# published repository
0kay-pm install https://github.com/razureink/0kay-theme-liquidglass
```

`manifest.patches` copies the patch into `CORE_DATA_DIR/ui/` and
`manifest.ui` publishes `ui/` to `CORE_DATA_DIR/plugin-ui/liquidglass/`.
Restart Core afterwards: the `liquidglass` row is registered at startup only
when the file exists (`gateway.HasUIPatch` → `registerBuiltins`), and until a
row carries the `liquidglass` capability its ops are filtered out of
`GET /api/ui/patches`.

## Enable / disable

Same plugin-row mechanics as the fluent package — switch it from the Plugins
page (插件):

- Core registers the built-in `liquidglass` row whenever `liquidglass.patch`
  exists (`gateway.HasUIPatch` → `registerBuiltins`).
- `PATCH /api/plugins/liquidglass {"enabled": bool}` persists to
  `data/disabled_plugins.json`, reloads the patch store, and the WebUI
  re-fetches `/api/ui/patches` — the theme flips on the spot.
- With the lifecycle-aware bootstrap loader, disabling calls the module's
  `uninstall()` export: inline styles are restored, observers disconnected,
  timers cancelled, and SVG resources removed. Enabling installs it again.
  Older hosts require a page reload after changing the plugin switch.
- The file-level `"enabled"` field is an independent ANDed gate. Keep it
  `true`.

## Customise

- Refraction strength: band/amp inside `paint` (`ui/theme.js`); keep
  `BASE = 'blur(2px) saturate(140%)'` identical to the glass rules in
  `ui/optics.css` if you retune the base blur.
- Wash/material colors: the `--lg-*` token keys.
- `patches/liquidglass.patch` is the editable source: tokens and component CSS
  are carried directly in this JSON document. No external generator or build
  step is required; the manifest, patch and UI module form the complete package.

## Publish

Push this directory as its own repo with the GitHub topic `0kay-plugin`:

```sh
0kay-pm install https://github.com/razureink/0kay-theme-liquidglass
```

> Note: `pm` only installs a manifest's own `patches[]` (root manifest), so
> this package is meant to be installed standalone — not linked as a
> `modules[]` entry of another manifest.
