# Writing a Plugin

## 1. Define the Contract

Add or extend protobuf APIs under `proto/<package>/v1/`. Regenerate bindings:

```powershell
buf generate
```

Keep request/response fields backward-compatible and document state transitions.

## 2. Start a gRPC Server

Bind a loopback address, add the generated service implementation, and register
with Core only after the server is ready.

## 3. Register Capabilities

Use stable capability names. Core and other plugins use these names for service
discovery; do not derive them from display labels.

## 4. Add Settings

Contribute declarative settings fields during registration. Treat secrets as
local runtime values and validate them before use.

## 5. Add UI Through a Patch

Place a JSON patch in the plugin-owned UI patch directory with `plugin` set to
the exact registered plugin name. Do not hardcode plugin pages into the WebUI.

## 6. Heartbeat and Shutdown

Send heartbeats every 10 seconds, re-register after Core connectivity loss, and
close streams/processes on shutdown.

## 7. Test

At minimum verify:

- registration and heartbeat;
- disabled-plugin patch removal;
- settings defaults and persistence;
- service unavailable behavior;
- task cancellation and completion;
- no secrets in Git history or build artifacts.
