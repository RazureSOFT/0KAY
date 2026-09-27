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

The runtime copy the 0KAY server ships with lives at
`core/data/ui/fluentui.patch`; both copies are byte-identical and carry
`"plugin": "fluentui"`, which is what ties the theme to its Plugins page row.

## How it works

The patch contains a single op:

```json
{ "target": "theme", "op": "insert", "id": "fluentui",
  "item": { "id": "fluentui", "order": 10, "tokens": { "light": {…}, "dark": {…} }, "css": "…" } }
```

- `tokens.light` is emitted into `html:root { … }`, `tokens.dark` into
  `html:root:where([data-theme="dark"]) { … }` — same specificity, so document
  order decides, and the host re-appends its own `<style>` last (a theme patch
  therefore beats any bootstrap-injected dark stylesheet).
- Only tokens whose keys start with `--` are emitted; values containing `;`,
  `{` or `}` are dropped.
- `css` is emitted verbatim into the same `<style>` element for component rules
  that token slots in `webui/src/styles/theme.css` do not cover (controls,
  surfaces, focus).

Full contract: `docs/settings-ui.md` § **Theme items** and `docs/design-system.md` § **6**.

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
0kay-pm install https://github.com/<you>/0kay-theme-fluentui
```

> Note: `pm` only installs a manifest's own `patches[]` (root manifest), so this
> package is meant to be installed standalone — not linked as a `modules[]`
> entry of another manifest.
