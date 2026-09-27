# Settings and UI Patches

Plugins extend the WebUI declaratively — a plugin never edits the host
frontend. Settings are contributed during registration; navigation, routes and
in-page surfaces come from JSON `.patch` files.

## Settings sections

Plugins contribute a `SettingsSection` during registration:

```json
{
  "id": "example",
  "label": "Example",
  "icon": "chip",
  "order": 70,
  "description": "Example plugin settings",
  "fields": [
    {
      "key": "enabled",
      "type": "bool",
      "label": "Enabled",
      "default_value": "true",
      "help": "Enable the feature"
    }
  ]
}
```

Field types are `bool`, `number`, `text` and `select`; `default_value` is always
a string. Values persist in Core's local settings store and are exposed at:

```text
GET  /api/settings/sections
GET  /api/settings/{section_id}
POST /api/settings/{section_id}
```

`POST` is a merge: omitted keys keep their previous value. Sections owned by a
disabled plugin return `403 section disabled`. Treat secrets as local runtime
values, never repository content.

## UI patches

UI patch files are JSON despite the `.patch` suffix:

```json
{
  "id": "example-ui",
  "plugin": "example",
  "enabled": true,
  "patches": [
    {
      "target": "nav",
      "op": "insert",
      "id": "example",
      "item": {
        "id": "example",
        "to": "/example",
        "labelKey": "nav.example",
        "icon": "chip",
        "order": 25
      }
    },
    {
      "target": "router",
      "op": "insert",
      "id": "example",
      "item": {
        "id": "example",
        "path": "/example",
        "name": "example",
        "module": "/api/plugins/example/ui/index.js",
        "title": "Example"
      }
    }
  ]
}
```

The `plugin` field is important: disabling that plugin removes its patch
operations, settings visibility, navigation and dynamic routes. An empty
`plugin` always shows the nav entry.

### Router items

Router items resolve in this order:

1. `module` — plugin ESM URL under `/api/plugins/{name}/ui/…` (native page).
2. `component` — built-in page (`chat`, `agents`, `plugins`, `usage`, `settings`,
   `memory`, `companion`).
3. `src` — iframe embed URL.

For a full custom page built in this repository, see
[WebUI Custom Pages](custom-pages.md).

### Settings items

A `settings` op inserts a tab into the Settings page. The tab body resolves in
this order (mirroring router items):

1. `module` — plugin ESM URL under `/api/plugins/{name}/ui/…`, mounted inline as
   a native pane (same runtime contract as a router module).
2. `component` — a built-in pane template (`provider`, `persona`, `permissions`,
   `live2d`, `life_settings`).
3. `fields` — declarative fields rendered by the host pane (see
   [Settings sections](#settings-sections)).

```json
{
  "target": "settings",
  "op": "insert",
  "anchor": "danger",
  "position": "before",
  "id": "appearance",
  "item": {
    "id": "appearance",
    "icon": "brightness",
    "label": "外观",
    "order": 15,
    "module": "/api/plugins/darkmode/ui/index.js?v=5"
  }
}
```

A module tab keeps the panel fully plugin-owned: the host only mounts your
default-exported Vue component and never injects its own Save button. `module`
and `fields` are mutually exclusive; when both are present `module` wins.

### Theme items

A `theme` op lets a plugin replace or layer over the Material 3 Expressive
palette without shipping any JavaScript: Core stores the item verbatim and the
WebUI compiles it into a `<style>` element in `<head>`.

| Field | Meaning |
|---|---|
| `tokens` | Flat `{"--md-primary": "#6750A4"}` map (both schemes) **or** `{ "light": {…}, "dark": {…} }` |
| `css` | Raw CSS appended after the token declarations (any selector or at-rule) |
| `cssUrl` | Stylesheet URL served by Core, e.g. `/api/plugins/{name}/ui/theme.css` |
| `order` | Cascade order, ascending; the higher `order` wins |

```json
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
    "css": "#app .btn-primary { letter-spacing: 0.02em }"
  }
}
```

How the host renders it:

1. Light tokens compile to `html:root { … }`, dark tokens to
   `html:root:where([data-theme="dark"]) { … }`. Both score specificity
   `(0,1,1)`, so they outrank a plain `:root` sheet and tie with an
   `html[data-theme="dark"]` sheet; across plugins and schemes **document order
   alone decides the winner**, and the host keeps its own elements last.
2. Each item owns exactly one `<style id="0kay-theme-patch-{id}">` (plus one
   `<link>` when `cssUrl` is set). Those elements are kept in patch order,
   updated in place, and pruned when the item is removed; no other stylesheet is
   ever modified. If some script appends a sheet to `<head>` afterwards (the
   darkmode bootstrap does), the host re-appends its own elements so a
   declarative patch still wins.
3. `dark` tokens only take effect while `html[data-theme="dark"]` is set, which
   the darkmode plugin does; on a light-only host they stay inert.
4. Only `--*` keys are emitted, and values containing `;`, `{` or `}` are
   dropped. Reach for `css` when you need anything other than token
   declarations.
5. `remove` and `replace` behave exactly as they do for every other target.

Token names come from the [WebUI Design System](design-system.md); override
roles there rather than restyling components one at a time.

### Targets and operations

Supported targets are `nav`, `router`, `settings`, `status`, `chat`, `theme`
and `bootstrap`. Supported operations are `insert`, `remove` and `replace`. Each
op may carry `anchor` and `position` to place it relative to an existing item.

The full flattened patch list (with plugin and capability attribution) is
available at `GET /api/ui/patches`; the WebUI polls it every 15 seconds and
reloads immediately after `POST /api/ui/patches` or a plugin enable/disable.
