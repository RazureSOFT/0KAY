# Settings and UI Patches

## Settings Sections

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

Field types are `bool`, `number`, `text`, and `select`. Values are persisted by
Core under its local settings store and exposed at:

```text
GET  /api/settings/sections
GET  /api/settings/{section_id}
POST /api/settings/{section_id}
```

Secrets must remain local and must never be committed to a repository.

## UI Patches

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
        "label": "Example",
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
        "component": "example"
      }
    }
  ]
}
```

Router items resolve in this order:

1. **`module`** — plugin ESM URL under `/api/plugins/{name}/ui/…` (native page; see [Writing a Plugin](writing-a-plugin.md) §5a).
2. **`component`** — built-in page name (`agents`, `plugins`, `usage`, `settings`, `chat`, `memory`, `companion`).
3. **`src`** — iframe embed URL.

```json
{
  "target": "router",
  "op": "insert",
  "id": "my-plugin",
  "item": {
    "id": "my-plugin",
    "path": "/my-plugin",
    "name": "my-plugin",
    "module": "/api/plugins/my-plugin/ui/index.js",
    "title": "My Plugin"
  }
}
```

Supported targets include `nav`, `router`, `settings`, `status`, and `chat`.
Supported operations are `insert`, `remove`, and `replace`.

The `plugin` field is important: disabling that plugin removes its patch
operations, settings visibility, navigation, and dynamic routes.
