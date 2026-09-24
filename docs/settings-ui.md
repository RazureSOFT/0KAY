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

Supported targets include `nav`, `router`, `settings`, `status`, and `chat`.
Supported operations are `insert`, `remove`, and `replace`.

The `plugin` field is important: disabling that plugin removes its patch
operations, settings visibility, navigation, and dynamic routes.
