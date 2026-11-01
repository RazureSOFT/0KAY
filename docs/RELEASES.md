# Releases and Updates

## Repositories

The platform is split across independent repositories, each with its own
`v0.1.2` release:

| Repository | Contents |
|---|---|
| `RazureSOFT/0KAY` | Core, mocr, LIFE, WebUI, plugin web UIs, local search, umbrella manifest and docs |
| `RazureSOFT/0KAY-agent` | Agent task-execution plugin |
| `RazureSOFT/0KAY-mcp` | MCP client gateway (`@0kay/mcp`) and the shared `proto/` contracts |
| `RazureSOFT/0KAY-pm` | Package manager CLI |
| `razureink/0KAY-minecraft` | Minecraft companion bot plugin |

All modules share the release tag `v0.1.2`. The tag always points at the current
`main` commit, so `@0.1.2` and `main` currently resolve to the same source.

## Installers

Every release publishes prebuilt installers for Windows, macOS and Linux on
`x64` and `arm64`. The desktop and terminal variants share one stack: Core,
mocr, LIFE (frozen with PyInstaller), the built WebUI, the `0kay` supervisor,
`0kay-pm` and the TUI. Agent + MCP are included from the sibling repositories
(`0KAY-agent`, `0KAY-mcp`) together with a bundled Node runtime. Nothing is
compiled on the target machine and no Go/Node/Python/npm is required.

| Variant | Windows | macOS | Linux |
|---|---|---|---|
| Desktop + TUI | `0KAY-<version>-win-<arch>.exe` (NSIS) | `0KAY-<version>-mac-<arch>.dmg` | `0KAY-<version>-linux-<arch>.AppImage`, `.deb` |
| TUI only | `0KAY-Setup-<version>-<arch>.exe` (NSIS) | `0KAY-Setup-<version>-<arch>.pkg` | `0kay-terminal_<version>_<arch>.deb` |
| Portable stack | `0kay-windows-<arch>-v<version>.tar.gz` | `0kay-macos-<arch>-v<version>.tar.gz` | `0kay-linux-<arch>-v<version>.tar.gz` |

Each asset has a `.sha256`, and every target also publishes
`SHA256SUMS-<os>-<arch>`. The Windows installers offer component and port pages:
Core and `0kay-pm` are required, while WebUI, the TUI, LIFE, mocr and Agent + MCP
can be deselected. Core HTTP/gRPC and the mocr/LIFE/Agent gRPC ports are chosen on
the same page (defaults 8080/50051/50052/50053/50054) and written to
`runtime-env.json`; PATH is optional. The WebUI is served on the Core HTTP port.
The macOS and Linux packages install the full stack. The launcher detects missing
components by their files and simply skips them; manage optional plugins later
with `0kay-pm`.

Windows arm64 has no upstream wheels for tantivy/numpy/grpcio, so its LIFE and
TUI binaries are x64 and run under Windows' built-in x64 emulation. Everything
else (Go services, Electron shell, Node runtime) is native arm64.

The installers are built by `.github/workflows/release.yml` on every published
release (and on manual dispatch). macOS packages are unsigned unless signing
credentials are configured in the workflow; add them before shipping to end
users.

## Install (package manager)

```sh
npm install -g ./pm                        # install the CLI
0kay-pm install                            # prebuilt bundle (fast path)
0kay-pm install --build @razuresoft/0kay@0.1.4  # compile from source instead
```

The default install downloads the platform bundle, verifies its checksum,
unpacks it into `~/.0kay/packages/0kay`, writes `runtime-env.json` and starts
the `0kay` supervisor as a service. `--build` keeps the source flow below.

Each installable module declares its identity, version, build commands and
optional start command in `manifest.json`. The umbrella manifest declares the
agent and mcp repositories as sub-repositories, so one source install
assembles the full platform. Plugin web bundles are built by the umbrella
manifest and served by Core; they do not need a separate server process.

Installing the agent also fetches `@razuresoft/0kay-mcp` (which supplies `mcp/`
and the shared `proto/`) and arranges the sibling layout the agent expects.

Interactive source installation asks for Core HTTP, Core gRPC and WebUI ports as
applicable; press Enter for the default. Source release archives are downloaded
without git; Go, Node.js and Python are still build prerequisites for
`--build`.

## Update

```sh
0kay-pm update                                   # latest prebuilt bundle
0kay-pm update --build @razuresoft/0kay           # rebuild from main (beta)
0kay-pm update --build @razuresoft/0kay@0.1.4     # pin a source release
```

A bundle update re-downloads the platform asset and carries over `data/`,
`models/` and `runtime-env.json`. Stop the `0kay` service before updating and
start it afterwards. Without `--build`, update uses the latest published release
(the **beta** channel is `--build`, which follows `main`). Source updates carry
over `runtime-env.json` and the standard component data directories, and retain
the previous installation as an `.old-<id>` recovery copy.

## One-click updates (Settings → About)

Settings → About checks GitHub Releases and can run updates directly.

- **立即更新 / Update now** — installs the latest published release tag.
- **测试版（同步仓库） / Beta (sync repo)** — installs the latest `main` branch.

Core exposes:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/update/check` | latest platform release vs the running version |
| GET | `/api/update/check-plugins` | latest release vs every installed component |
| POST | `/api/update/apply` | start an update for one component |
| GET | `/api/update/status` | progress of the most recent update |

```json
// POST /api/update/apply
// {"plugin": "core"}            → beta: sync main
// {"plugin": "agent", "version":"0.1.2"} → pinned release
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

### GitHub mirror (global plugin source)

Settings → **Plugin updates** exposes a global mirror as `github_proxy` in the
`updates` settings section (`GET`/`POST /api/settings/updates`), for example
`https://gh-proxy.com`. When set, Core rewrites `https://github.com/...` through
the mirror for **source syncs and every git command 0kay-pm runs** during
install/update, using git's `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_n`/
`GIT_CONFIG_VALUE_n` environment (the global git config is never modified). The
release check itself still queries `api.github.com` directly. Leave the field
empty for direct GitHub access.

### Update-check details

- Version comparison is semver-aware: a leading `v` and prerelease/build
  suffixes are handled, so `0.1.1-rc.1 < 0.1.1`.
- `/api/update/check` also returns the release `name`, `notes` (the published
  release body, i.e. the changelog) and `published_at`, which Settings → About
  shows as the new version's features.
- `latest` is omitted when the repository has no published release. The platform
  check returns `502` with an `error` field when GitHub is unreachable; the
  plugin check reports a per-plugin `error` (including `unknown repository`).
- `check-plugins` also returns `package` and `can_update` so the WebUI only shows
  an update button for components it can update.
- `check-plugins` lists **every installed component**, not only running plugins:
  registered plugin services, platform components present in the source checkout
  (`core`, `webui`, `life`, `mocr`, `agent`, `mcp`, `minecraft`, `pm`)
  and third-party plugins installed through 0kay-pm, which appear under their
  package name. A component whose manifest declares no `start` command (`mcp`,
  `pm`) is synced/built without a restart.
- Plugin versions come from the gRPC `PluginInfo.version` registration field; no
  protocol change is required. Components that are not registered read their
  version from `manifest.json`/`package.json`.
