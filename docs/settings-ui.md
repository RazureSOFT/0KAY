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

### Targets and operations

Supported targets are `nav`, `router`, `settings`, `status` and `chat`. Supported
operations are `insert`, `remove` and `replace`. Each op may carry `anchor` and
`position` to place it relative to an existing item.

The full flattened patch list (with plugin and capability attribution) is
available at `GET /api/ui/patches`; the WebUI polls it every 15 seconds and
reloads immediately after `POST /api/ui/patches` or a plugin enable/disable.
