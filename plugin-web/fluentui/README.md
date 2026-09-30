# @razuresoft/0kay-theme-fluentui

A declarative `target:"theme"` theme patch that restyles the 0KAY WebUI with
Microsoft **Fluent Design** (Windows 11) surfaces: `Segoe UI`, 4px/8px radii,
1px neutral strokes, accent `#005FB8` (light) / `#4CC2FF` (dark), Fluent focus
rectangles and Fluent elevations.

## Files

| file | role |
| --- | --- |
| `manifest.json` | pm manifest, installs `patches/fluentui.patch` |
| `patches/fluentui.patch` | one `insert` op whose `item` carries `tokens` + `css` |

The patch is **not** part of the platform checkout: installing this package
copies `patches/fluentui.patch` into Core's `data/ui/`, where its
`"plugin": "fluentui"` field ties the theme to its Plugins page row.

## How it works

The patch contains a single op:

```json
{ "target": "theme", "op": "insert", "id": "fluentui",
  "item": { "id": "fluentui", "order": 10, "tokens": { "light": {…}, "dark": {…} }, "css": "…" } }
```

- `tokens.light` is emitted into `html:root { … }`, `tokens.dark` into
  `html:root[data-theme="dark"] { … }` — specificity (0,2,1), so the dark
  palette outranks an imperatively injected `html[data-theme="dark"]` sheet
  (0,1,1), e.g. the darkmode bootstrap, regardless of `<head>` order.
- Only tokens whose keys start with `--` are emitted; values containing `;`,
  `{` or `}` are dropped.
- `css` is emitted verbatim into the same `<style>` element for component rules
  that token slots in `webui/src/styles/theme.css` do not cover (controls,
  surfaces, focus, motion). The motion layer retunes the host's M3 springs:
  entrances run `fluent-rise` at 200ms on a decelerate curve, controls at
  150ms `--ease-standard`, and hover lifts/brightness filters are removed.
- The component layer swaps the host's line-art SVG chrome for **Segoe Fluent
  Icons** glyphs (nav rail keyed by `href`, settings tabs by rendered
  position, tiles/composer by class; Segoe MDL2 Assets covers older Windows),
  demotes eyebrows to 11px neutral captions, reserves accent fills for
  primary actions (tonal/search go standard, destructive actions go
  text-type danger), and drops chip strokes, nested-card borders and the
  radial page washes.

Full contract: `docs/settings-ui.md` § **Theme items** and `docs/design-system.md` § **6**.

## Install

```sh
# local checkout
0kay-pm install @razuresoft/0kay-theme-fluentui --source .\plugin-web\fluentui
# published repository
0kay-pm install https://github.com/razureink/0kay-theme-fluentui
```

`manifest.patches` is what copies the file into `CORE_DATA_DIR/ui/` (and
`0kay-pm uninstall` takes it away again). Restart Core afterwards: the
`fluentui` row is registered at startup only when the file exists
(`gateway.HasUIPatch` → `registerBuiltins`), and until a row carries the
`fluentui` capability its ops are filtered out of `GET /api/ui/patches`.

## Enable / disable

The theme is a real plugin row, so it is switched from the Plugins page (插件栏)
— no file editing:

- Core registers a built-in `fluentui` plugin whenever `fluentui.patch` exists in
  a UI patch directory (`gateway.HasUIPatch` → `registerBuiltins`), which is what
  puts the row and its switch on the panel.
- The switch calls `PATCH /api/plugins/fluentui {"enabled": bool}`. Core persists
  the choice to `data/disabled_plugins.json` and reloads the patch store, and the
  WebUI immediately re-fetches `/api/ui/patches`, so nav/routes/**theme** flip on
  the spot.
- Two gates then drop every op until you switch it back on:
  `uiPatchStore.List(false)` skips the file because its owner is disabled, and
  `GET /api/ui/patches` filters on `GetPluginsByCapability("fluentui")`.
- The file-level `"enabled"` field is an independent second gate ANDed with the
  switch. Keep it `true` — otherwise the switch cannot turn the theme on.

Bootstrap-style plugins (darkmode, compat) differ: their `bootstrap` modules are
imported once per page load, so disabling them only takes full effect after a
page reload. A `theme` patch has no such residue — its `<style>` element is
removed as soon as the ops disappear.

Force a reload without restarting (rarely needed — Core re-scans on `GET` at
most once every 3s):

```sh
curl -X POST http://127.0.0.1:19420/api/ui/patches
```

## Customise

Edit `tokens` (palette) and `css` (shape/typography/elevation). Anything you add
is applied to *both* schemes only if you also add it there; the renderer never
merges schemes. Re-run `python docs/build.py` is not required — this package has
no docs page.

## Publish

Push this directory as its own repo with the GitHub topic `0kay-plugin` so
`0kay-pm` can install it from a source repo:

```sh
0kay-pm install https://github.com/razureink/0kay-theme-fluentui
```

> Note: `pm` only installs a manifest's own `patches[]` (root manifest), so this
> package is meant to be installed standalone — not linked as a `modules[]`
> entry of another manifest.
