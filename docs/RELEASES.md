# Releases and Updates

## Repositories

The platform is split across independent repositories, each with its own
`v0.1.0` release:

| Repository | Contents |
|---|---|
| `RazureSOFT/0KAY` | Core, mocr, LIFE, WebUI, plugin web UIs, local search, umbrella manifest and docs |
| `RazureSOFT/0KAY-agent` | Agent task-execution plugin |
| `RazureSOFT/0KAY-mcp` | MCP client gateway (`@0kay/mcp`) and the shared `proto/` contracts |
| `RazureSOFT/0KAY-pm` | Package manager CLI |
| `razureink/0KAY-minecraft` | Minecraft companion bot plugin |

All modules share the release tag `v0.1.0`. The tag always points at the current
`main` commit, so `@0.1.0` and `main` currently resolve to the same source.

## Install

```sh
npm install -g ./pm                       # install the CLI
0kay-pm install @razuresoft/0kay@0.1.0     # platform (Core, mocr, LIFE, WebUI, plugin UIs)
0kay-pm install @razuresoft/0kay-agent@0.1.0
```

Each installable module declares its identity, version, build commands and
optional start command in `manifest.json`. The umbrella manifest declares the
agent and mcp repositories as sub-repositories, so one install assembles the
full platform. Plugin web bundles are built by the umbrella manifest and served
by Core; they do not need a separate server process.

Installing the agent also fetches `@razuresoft/0kay-mcp` (which supplies `mcp/`
and the shared `proto/`) and arranges the sibling layout the agent expects.

Interactive installation asks for Core HTTP, Core gRPC and WebUI ports as
applicable; press Enter for the default. Source release archives are downloaded
without git; Go, Node.js and Python are still build prerequisites.

## Update

```sh
0kay-pm update @razuresoft/0kay-agent@0.1.0
0kay-pm start @razuresoft/0kay-agent
```

Without a version suffix, update uses the `main` branch (the **beta** channel).
Update carries over `runtime-env.json` and the standard component data
directories, and retains the previous installation as an `.old-<id>` recovery
copy. Stop a component before updating it, then restart it.

## One-click updates (Settings → About)

Settings → About checks GitHub Releases and can run updates directly.

- **立即更新 / Update now** — installs the latest published release tag.
- **测试版（同步仓库） / Beta (sync repo)** — installs the latest `main` branch.

Core exposes:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/update/check` | latest platform release vs the running version |
| GET | `/api/update/check-plugins` | latest release vs each registered plugin |
| POST | `/api/update/apply` | start an update for one component |
| GET | `/api/update/status` | progress of the most recent update |

```json
// POST /api/update/apply
// {"plugin": "core"}            → beta: sync main
// {"plugin": "agent", "version":"0.1.0"} → pinned release
{"plugin":"core","package":"@razuresoft/0kay-core","mode":"source",
 "status":"running","started":"2026-09-26T05:42:52Z"}
```

Apply chooses the update path automatically:

- **pm mode** — the package is recorded in `~/.0kay/state.json` (`OKAY_PM_HOME`),
  so Core runs the detached `0kay-pm stop → update → start` script.
- **source mode** — no pm record exists, so Core syncs the component's git
  repository (`git pull --ff-only`), rebuilds it from its `manifest.json`
  (dependency installs are skipped), then restarts it on its listen port. This
  is what makes the beta channel usable on a plain source checkout, including
  components that have no published pm package (e.g. Minecraft).

Both paths run as a detached script so Core can replace and restart itself. The
script writes output to `$CORE_DATA_DIR/updates/apply.log` and prints a
completion marker; `GET /api/update/status` derives `running`/`done`/`failed`
from that file, so status survives a Core restart. On Windows the updater runs
with no console window.

### Update-check details

- Version comparison is semver-aware: a leading `v` and prerelease/build
  suffixes are handled, so `0.1.0-rc.1 < 0.1.0`.
- `latest` is omitted when the repository has no published release. The platform
  check returns `502` with an `error` field when GitHub is unreachable; the
  plugin check reports a per-plugin `error` (including `unknown repository`).
- `check-plugins` also returns `package` and `can_update` so the WebUI only shows
  an update button for components it can update.
- Plugin versions come from the gRPC `PluginInfo.version` registration field; no
  protocol change is required.
