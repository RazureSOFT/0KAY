# Plugin Lifecycle

Plugins connect to Core through `core.v1.PluginService`. They own their own
process, data directory and domain behavior; Core owns registration, health,
settings visibility and routing.

## Registration

Call `Register` once the plugin's own gRPC server is bound:

```json
{
  "plugin_info": {
    "name": "example",
    "version": "0.1.0",
    "description": "Example plugin",
    "author": "your-name",
    "plugin_type": "PLUGIN_TYPE_SERVICE"
  },
  "capabilities": ["example", "requires:mocr"],
  "address": "127.0.0.1:50100",
  "settings_sections": []
}
```

- `address` is the address Core uses for callbacks. Remote plugins must not send
  `localhost`.
- `version` must be read from the plugin's own `manifest.json`; 0kay-pm does not
  send the gRPC registration for the plugin.
- `capabilities` are stable names such as `agent`, `life`, `mocr`, `minecraft`;
  executors use `executor:<persistent-uuid>`.
- Runtime dependencies use `requires:<plugin>`, for example
  `["agent", "executor:uuid", "requires:mocr"]`.
- Core returns a stable runtime `plugin_id` for the current registration.

Registration does not imply schedulable: missing, unhealthy, disabled or
circularly-dependent plugins are withheld from service discovery and become
available automatically once the dependency recovers.

## Heartbeat

Send `Heartbeat` every ~10 seconds:

```json
{
  "plugin_id": "plugin_7",
  "status": "PLUGIN_STATUS_HEALTHY",
  "active_tasks": 0,
  "host": {
    "hostname": "host",
    "os": "Windows_NT",
    "arch": "x64",
    "workdir": "C:\\plugins\\example"
  }
}
```

A plugin that misses heartbeats is marked unhealthy. Re-register after
`UNAVAILABLE` or `NOT_FOUND` errors. Enable/disable is persisted by Core in
`data/disabled_plugins.json`; disabled plugins are hidden from routing, settings
and UI patches.

## Plugin types

- `PLUGIN_TYPE_ADAPTER` — input/output transport such as WebUI or OneBot.
- `PLUGIN_TYPE_PERSONA` — persona/runtime layer such as L.I.F.E.
- `PLUGIN_TYPE_TOOL` — search, mail, MCP or other tool provider (e.g. Minecraft).
- `PLUGIN_TYPE_SERVICE` — generic service such as mocr or the Agent.

## Settings registration

A plugin may contribute `SettingsSection{id,label,icon,order,description,fields}`
with `SettingsField{key,type,label,default_value,options,help}` where `type` is
`bool`, `number`, `text` or `select`. Values are persisted by Core and exposed
through `/api/settings/*`. Secrets stay local. See
[Settings and UI Patches](settings-ui.md).
