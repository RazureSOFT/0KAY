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
`core/data/ui/fluentui.patch`. It is identical to this file except that it sets
`"enabled": false`, so running Core from the repo keeps the stock Material 3
palette until you opt in.

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

The patch ships `enabled: true`, so installing it turns Fluent on immediately.

- One-shot disable (survives reload, persisted server-side):

  ```sh
  curl -X POST http://127.0.0.1:19420/api/ui/patches \
    -H 'content-type: application/json' \
    -d '{"id":"fluentui-theme","enabled":false}'
  ```

- Re-enable with `"enabled":true`, or remove it entirely by editing
  `~/.0kay/ui/*` / the `ui-patches` store (see `docs/HTTP_API.md`).

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
