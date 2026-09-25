# Releases and updates

## Repositories

The platform is split across independent repositories, each with its own
`v0.1.0` release:

| Repository | Contents |
|---|---|
| `RazureSOFT/0KAY` | Core, MOCR, LIFE, WebUI, plugin web UIs, local search, umbrella manifest and docs |
| `RazureSOFT/0KAY-agent` | Agent task execution plugin |
| `RazureSOFT/0KAY-mcp` | MCP client gateway (`@0kay/mcp`) and the shared `proto/` contracts |
| `RazureSOFT/0KAY-pm` | Package manager CLI |

## 0.1.0

0KAY and its modules use the release tag `v0.1.0`. Each installable module
declares its identity, version, build commands and optional start command in
`manifest.json`. The umbrella manifest declares the agent and mcp repositories
as sub-repositories, so a single install assembles the full platform. Plugin web
bundles are built by the umbrella manifest and served by Core; they do not need
a separate server process.

```sh
0kay-pm install @razuresoft/0kay@0.1.0
0kay-pm install @razuresoft/0kay-agent@0.1.0
```

Installing the agent also fetches `@razuresoft/0kay-mcp` (the `KAY-mcp`
repository, which supplies `mcp/` and the shared `proto/`) and arranges the
sibling layout it expects.

Interactive installation asks for Core HTTP, Core gRPC and WebUI ports as
applicable. Press Enter to use the displayed default. Source release archives
are downloaded without git; Go, Node.js and Python are still build prerequisites.

Stop a component before updating it, then restart it:

```sh
0kay-pm update @razuresoft/0kay-agent@0.1.0
0kay-pm start @razuresoft/0kay-agent
```

Without a version suffix, install/update uses the main branch. Update carries
over runtime environment settings and standard component data directories,
and retains the previous installation as an `.old-<id>` recovery copy.

## Update check HTTP API

`GET /api/update/check` checks the latest published 0KAY GitHub release:

```json
{"current":"0.1.0","latest":"0.1.0","has_update":false,"url":"https://github.com/RazureSOFT/0KAY/releases/tag/v0.1.0"}
```

Network/upstream failures return HTTP 502 with an `error` field. If no release
exists, `latest` is omitted. `GET /api/update/check-plugins` returns a `plugins`
array with `name`, `version`, `latest`, `has_update`, `repository` and an optional
per-plugin `error`. Unknown plugin repositories are reported explicitly.
Both endpoints accept GET only and use the existing Core API authentication.

Settings → About exposes both checks. Plugin versions come from the existing
gRPC `PluginInfo.version` registration field; no protocol change is required.
