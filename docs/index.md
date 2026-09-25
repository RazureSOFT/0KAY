# 0KAY Plugin API

0KAY is a local-first modular platform. Core owns registration, health,
settings, routing, task dispatch, and provider credentials. Plugins own their
domain behavior and expose gRPC services over the shared protobuf contracts.

## Repositories

- Platform umbrella: [`0KAY`](https://github.com/RazureSOFT/0KAY)
- Independent task Agent: [`0KAY-agent`](https://github.com/RazureSOFT/0KAY-agent)

## API Sections

- [HTTP API Reference](HTTP_API.md)
- [Plugin API Overview](PLUGIN_API.md)
- [Plugin Lifecycle](plugin-lifecycle.md)
- [Core Services](core-services.md)
- [Agent Service](agent-service.md)
- [L.I.F.E Service](life-service.md)
- [mocr Service](mocr-service.md)
- [Settings and UI Patches](settings-ui.md)
- [Writing a Plugin](writing-a-plugin.md)
- [Security and Runtime Rules](security.md)

## Source Of Truth

The protobuf contracts live in [`proto/`](https://github.com/RazureSOFT/0KAY/tree/main/proto).
Generated bindings live in [`gen/`](https://github.com/RazureSOFT/0KAY/tree/main/gen).
If a generated binding differs from the protobuf source,
regenerate with:

```powershell
buf generate
```

The current implementation is the behavioral authority. This documentation
describes the public plugin boundary and intentionally does not promise private
internal helpers.
