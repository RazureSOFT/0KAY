# Plugin Lifecycle

Plugins connect to Core through `core.v1.PluginService`.

## Registration

Call `Register` with:

```json
{
  "plugin_info": {
    "name": "example",
    "version": "0.1.0",
    "description": "Example plugin",
    "author": "your-name",
    "plugin_type": "PLUGIN_TYPE_SERVICE"
  },
  "capabilities": ["example"],
  "address": "127.0.0.1:50100",
  "settings_sections": []
}
```

`address` is the gRPC address Core uses for callbacks. Bind plugin services
before registering. Core returns a stable runtime `plugin_id` for the current
registration.

## Heartbeat

Send `Heartbeat` periodically, normally every 10 seconds:

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

Core considers a plugin unhealthy after the heartbeat timeout. A plugin should
re-register after `UNAVAILABLE` or `NOT_FOUND` errors.

## Plugin Types

- `PLUGIN_TYPE_ADAPTER`: input/output transport such as WebUI or OneBot.
- `PLUGIN_TYPE_PERSONA`: persona/runtime layer such as L.I.F.E.
- `PLUGIN_TYPE_TOOL`: search, mail, MCP, or other tool provider.
- `PLUGIN_TYPE_SERVICE`: generic service such as mocr or Agent.
