# 0KAY

**A self-hosted AI companion that remembers you — with a real agent underneath.**

*一句话：在自己电脑上跑一个会记事、有情绪、还能帮你干活的 AI 伙伴。*
*(中文说明：[README.zh-CN.md](README.zh-CN.md))*

Most "AI companion" apps are a chat box with a system prompt. 0KAY is built around
two ideas that a chat box cannot do:

- **The companion keeps state.** Emotion, short- and long-term memory, a
  sleep/wake rhythm, relationships and proactive messages. It remembers what you
  told it last week — and can bring it up first.
- **It is also a real agent.** File edits, shell, web and desktop control, behind
  an approval gate. The same character that talks to you can actually do your work.

It runs locally. You bring your own model API key (OpenAI-compatible or
Anthropic-format providers), and your data stays in plain files on your disk.

## What you can do

- **Talk to a companion that remembers.** Conversations feed its memory and
  mood; it has good and bad days, journals, dreams, and reaches out on its own.
- **Give it a face and a voice.** Live2D avatar and TTS.
- **Delegate real work.** A coding/research agent with filesystem, shell, web
  fetch/search and whole-desktop tools. Risky calls wait for your approval.
- **Reach it where you already are.** Chat in the WebUI, or connect QQ / OneBot.
- **Extend everything.** Beyond a small Go core, every capability is a plugin:
  model gateway, persona, agent, TTS, search, Minecraft, and plugin-owned WebUI
  pages. Install, disable or swap each one on its own.
- **Keep it private.** Services bind to loopback by default; provider keys stay
  in Core; data is plain files you own.

## Who this is for

**This is for you if…**

- You want an AI companion whose memory and personality are *yours*, not a
  vendor's, and you care about that staying on your own machine.
- You're comfortable running a few local services (Go / Python / Node, or Docker)
  and pasting in your own model API key.
- You like to tinker: swap models, add plugins, run it on QQ, build a custom page.

**This is probably not for you if…**

- You want a zero-setup cloud app — 0KAY is self-hosted by design.
- You don't want to manage model API keys or ports.

## Screenshots

| Chat | General settings | Provider settings |
|---|---|---|
| ![Chat](assets/chat.png) | ![General settings](assets/settings-general.png) | ![Provider settings](assets/settings-provider.png) |

Captured from the running WebUI (`webui`, Vite dev server).

## Quick start

> Node.js 22+ is enough for the package-manager path. Docker Compose covers the
> container path. Running from source also needs Go 1.27+ and Python 3.10+.

Pick **one** of the three options below.

### Docker Compose

Compose refuses to start until its secrets are set: copy the example env file
and fill in each token (any long random string works; see
[docs/security.md](docs/security.md)).

```bash
cp docs/security-runtime.env.example .env   # then edit .env: set every token
docker-compose up -d                        # build and start core, mocr, L.I.F.E, webui
docker-compose --profile agent up -d        # also build and start the agent service
docker-compose ps                           # check status
docker-compose logs -f                      # follow logs
docker-compose down                         # stop
```

### Desktop / terminal installers

Download the installer for your OS and CPU from
[Releases](https://github.com/RazureSOFT/0KAY/releases):

| Asset | What it installs |
|---|---|
| `0KAY-<version>-win-<arch>.exe`, `-mac-<arch>.dmg`, `-linux-<arch>.AppImage` | Desktop shell + the full stack + the TUI |
| `0KAY-Setup-<version>-<arch>.exe` / `0KAY-Setup-<version>-<arch>.pkg` / `0kay-terminal_<version>_<arch>.deb` | Terminal-only install |

Every platform bundle ships Core, mocr, LIFE (frozen with PyInstaller), the built
WebUI, the TUI, the `0kay` supervisor, `0kay-pm`, and — unless the release was
built without them — Agent + MCP with a bundled Node runtime. Nothing is compiled
on the target and no Go/Node/Python/npm is required. Installers cover `x64` and
`arm64` for Windows, macOS and Linux. The Windows installers ask which components
to install (Core is required; WebUI, TUI, LIFE, mocr and Agent + MCP are optional),
which local ports to use (Core HTTP/gRPC and the mocr/LIFE/Agent gRPC ports;
defaults 8080/50051/50052/50053/50054) and whether to add 0KAY to PATH. The WebUI
is served on the Core HTTP port. More plugins can be installed later with the
bundled `0kay-pm`.
Runtime state lives in `<install>/data`, or in `~/.0kay/data` when the install
tree is read-only (AppImage, `/opt`, `.app`). On Windows arm64 the Python
components are x64 and run under Windows' built-in x64 emulation (upstream
wheels are missing for that target); everything else is native.

```sh
0kay            # start everything and open the TUI
0kay status     # health, ports and pids
0kay down       # stop
0kay-pm --help  # the bundled package manager (no npm install -g needed)
```

### Package manager (prebuilt, recommended)

```sh
# Standalone repository install (no git involved)
npm install -g https://codeload.github.com/RazureSOFT/0KAY-pm/tar.gz/main

# Or from a local checkout
npm install -g ./pm

0kay-pm install     # download the prebuilt bundle and start it
```

`0kay-pm install` downloads the matching release asset, verifies its checksum,
unpacks it into `~/.0kay`, and starts it as a background service (systemd user
unit / LaunchAgent / logon task). No toolchain is fetched. Add `--build` to
compile from source instead (needed for unreleased commits or LAN pairing), pin
a release with `0kay-pm install --build @razuresoft/0kay@0.1.4`, check with
`0kay-pm status 0kay`, and stop with `0kay-pm stop 0kay`.

### From source (development)

```sh
# one-time setup
make deps-python           # pip install -e . for L.I.F.E
make deps-node             # npm install for the agent
npm --prefix webui install # WebUI dependencies
make proto                 # generate protobuf code
```

Then run each service in its own terminal:

```sh
make dev-core     # Core on :50051 (gRPC) and :8080 (HTTP)
make dev-mocr     # mocr on :50052
make dev-life     # L.I.F.E on :50053
make dev-agent    # Agent on :50054
npm --prefix webui run dev   # WebUI on :3000
```

Then open the WebUI and, in Settings, add a provider and your model API key.
Health check: `GET http://127.0.0.1:8080/health`.

Core only trusts loopback origins on an allowlisted port, so a dev WebUI on
Vite's :3000 gets `403 origin_not_allowed` for every POST (`/api/run` included)
while GETs look fine — same-origin GETs send no `Origin` header at all. Put
`WEBUI_PORT=3000` in `.env` when running the UI that way. Packaged installs set
`CORE_WEBUI_DIR=<install>/webui` and Core serves the built UI on its own port,
so the packaged UI is always same-origin and needs no proxy.

### Security

Loopback by default; override with `CORE_BIND_HOST`, `AGENT_BIND_HOST`,
`MOCR_BIND_HOST`, `LIFE_BIND_HOST` only on a trusted network. Put an
authenticated reverse proxy in front to expose HTTP. `CORE_API_TOKEN` makes Core
require a bearer token (exchanged for an HttpOnly `0kay_session` cookie at
`POST /api/auth/session`), a browser access PIN gates the UI, and
`GET /api/providers` never returns provider API keys. See
[docs/security.md](docs/security.md).

## How it fits together

```
WebUI (TS) ──HTTP/WebSocket──┐
QQ/OneBot ──WebSocket───────┤
                             ▼
                       ┌──────────┐
                       │   Core   │  Go — gateway, tasks, plugin registry
                       └────┬─────┘
                            │ gRPC
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        ┌────────┐    ┌──────────┐   ┌──────────┐
        │  mocr  │    │  L.I.F.E │   │  Agent   │
        │  Go    │    │ (Python) │   │  (TS)    │
        │ models │    │ persona  │   │  tasks   │
        └────────┘    └──────────┘   └──────────┘
```

- **Core** (Go) — HTTP/WebSocket gateway, plugin registry and health, task
  scheduling, settings, provider credentials. It is the single source of truth.
- **mocr** (Go) — the model gateway: provider access, streaming, retries, and
  think/output model selection.
- **L.I.F.E** (Python) — the companion: persona, emotion, memory, circadian
  rhythm, proactive messages and companion tools.
- **Agent** (TypeScript, [separate repo](https://github.com/RazureSOFT/0KAY-agent))
  — the task engine and its tools.
- **WebUI** (Vue 3) — the single-page app; it only talks to Core over HTTP.

Everything except Core itself is a plugin, so a component can be installed,
updated or disabled on its own. Details: [ARCHITECTURE.md](ARCHITECTURE.md) and
[RUNTIME_CONTRACTS.md](RUNTIME_CONTRACTS.md).

## Documentation

- [Architecture](ARCHITECTURE.md) — component boundaries, data flow, UI patches.
- [Runtime Contracts](RUNTIME_CONTRACTS.md) — task identity, sessions, approvals, persistence.
- [Plugin API](docs/PLUGIN_API.md) — the protobuf contract every plugin speaks.
- [Writing a Plugin](docs/writing-a-plugin.md) — end-to-end plugin guide.
- [HTTP API](docs/HTTP_API.md) — every Core gateway route.
- [Model Catalog](MODEL_CATALOG.md) — fallback model IDs.
- [Releases and Updates](docs/RELEASES.md) — install and one-click updates.

## Requirements

- Go 1.27+
- Python 3.10+
- Node.js 22+
- Docker and Docker Compose

## Project structure

```
0KAY/
├── proto/       # shared Protobuf contracts
├── core/        # Go — gateway, registry, scheduling
├── mocr/        # Go — model gateway
├── life/        # Python — companion (persona, memory, emotion)
├── agent/       # TypeScript — task engine (separate repo)
├── webui/       # Vue 3 single-page app
├── plugin-web/  # plugin-owned web UIs
├── gen/         # generated bindings
└── docker-compose.yml
```

## Development

```powershell
python -B -m unittest discover -s life/tests -v   # L.I.F.E tests
# agent/: npm test; npx tsc --noEmit
# core/ and mocr/: go test ./...
```

## License

MIT
