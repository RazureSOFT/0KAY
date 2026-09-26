# 0KAY Plugin API

0KAY is a local-first, modular AI companion platform. A small Go **Core**
owns registration, health, settings, routing, task dispatch, model access and
provider credentials. Every other capability — model gateway, persona, task
agent, tool bridges, Minecraft — is a **plugin** that talks to Core over shared
protobuf contracts and can be installed, updated or disabled independently.

## Repositories

| Repository | Contents |
|---|---|
| [`RazureSOFT/0KAY`](https://github.com/RazureSOFT/0KAY) | Core, mocr, LIFE, WebUI, plugin web UIs, local search, umbrella manifest and these docs |
| [`RazureSOFT/0KAY-agent`](https://github.com/RazureSOFT/0KAY-agent) | Agent task-execution plugin |
| [`RazureSOFT/0KAY-mcp`](https://github.com/RazureSOFT/0KAY-mcp) | MCP client gateway and the shared `proto/` contracts |
| [`RazureSOFT/0KAY-pm`](https://github.com/RazureSOFT/0KAY-pm) | Package manager CLI (`0kay-pm`) |
| [`razureink/0KAY-minecraft`](https://github.com/razureink/0KAY-minecraft) | Minecraft companion bot plugin (Java + Bedrock) |

## How to read these docs

- [HTTP API Reference](HTTP_API.md) — every Core gateway route, auth, errors.
- [Plugin API (v1)](PLUGIN_API.md) — protobuf contracts and package manifests.
- [Plugin Lifecycle](plugin-lifecycle.md) — register, heartbeat, types, disable.
- [Writing a Plugin](writing-a-plugin.md) — end-to-end plugin guide.
- [Core Services](core-services.md) — `core.v1.CoreService` RPCs.
- [Agent Service](agent-service.md) — `agent.v1.AgentService` and tools.
- [L.I.F.E Service](life-service.md) — persona, emotion, memory, companion.
- [mocr Service](mocr-service.md) — the model gateway.
- [Settings and UI Patches](settings-ui.md) — declarative settings and WebUI.
- [WebUI Custom Pages](custom-pages.md) — ship a plugin-owned Vue page end to end.
- [Thinking Intensity](THINKING.md) — reasoning levels and the execution loop.
- [Releases and Updates](RELEASES.md) — install, update, one-click updates.
- [Security and Runtime Rules](security.md) — non-negotiable constraints.

## Quick start

```sh
# install the package manager, then the platform and the agent
npm install -g ./pm
0kay-pm install @razuresoft/0kay@0.1.0
0kay-pm install @razuresoft/0kay-agent@0.1.0
```

Installing the platform builds Core, mocr, LIFE, the WebUI and the plugin web
bundles. Interactive installation asks for Core HTTP, Core gRPC and WebUI ports
and starts each component after a successful build. See
[Releases and Updates](RELEASES.md) for the full flow.

## Source of truth

- Protobuf contracts live in [`proto/`](https://github.com/RazureSOFT/0KAY/tree/main/proto);
  generated bindings live in [`gen/`](https://github.com/RazureSOFT/0KAY/tree/main/gen).
  If a binding differs from the source, regenerate:

  ```powershell
  buf generate
  ```

- The running implementation is the behavioral authority. This documentation
  describes the public plugin boundary and does not promise private helpers.
- The platform release version is `0.1.0` (`core/internal/version`, every
  `manifest.json` and every Git tag).
