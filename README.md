# 0KAY

0KAY is a local-first AI agent platform. Core (Go) is the gateway and scheduler;
the services around it handle model selection, the persona, and task execution.
A web UI ships with it, and the agent runtime lives in its own repository.

## Screenshots

| Chat | General settings | Provider settings |
|---|---|---|
| ![Chat](assets/chat.png) | ![General settings](assets/settings-general.png) | ![Provider settings](assets/settings-provider.png) |

Captured from the running WebUI (`webui`, Vite dev server).

## Documentation

- [Architecture](ARCHITECTURE.md): component boundaries, communication, data flow, UI patches.
- [Runtime Contracts](RUNTIME_CONTRACTS.md): task identity, session scope, approvals, callbacks, persistence.
- [Model Catalog](MODEL_CATALOG.md): model references and fallback IDs.

## Architecture

```
WebUI (TS) ──HTTP/WebSocket──┐
                              │
QQ/OneBot ──WebSocket───────┤
                              ▼
                        ┌──────────┐
                        │   Core   │ (Go, gRPC + HTTP)
                        │ 网关/调度 │
                        └────┬─────┘
                             │ gRPC
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌────────┐    ┌──────────┐   ┌──────────┐
         │  mocr  │    │  L.I.F.E │   │  Agent   │
         │  (Go)  │    │ (Python) │   │  (TS)    │
         └────────┘    └──────────┘   └──────────┘
```

## Components

### Core (Go)
Gateway (HTTP and WebSocket), plugin registry and service discovery, task scheduling.

### mocr (Go)
Model selection (think model plus output model) and streaming generation.

### L.I.F.E (Python)
Persona replies; emotion (valence, arousal, connection, irritation); memory
(working, short-term, long-term); a sleep/wake rhythm; and tools for mail,
agents, and search.

### Agent (TypeScript, separate repository)
Task execution and tools (filesystem, shell), scheduled by Core over gRPC.

## Quick start

Plugin API reference: [docs/PLUGIN_API.md](docs/PLUGIN_API.md).
Modular installation and LAN pairing: [pm/README.md](pm/README.md).
To use the local CLI, `npm install -g ./pm`; package manifests live at the
repository root and in each module. Publishing to GitHub or npm requires those
manifests and the package to be published first.

### Agent permissions

The composer starts in Normal mode, where every tool call waits for approval.
Child agents inherit the mode. Full access is set per turn and runs enabled
tools without asking. Calls to LIFE, MCP, and computer tools still need
approval; browsing the workspace and creating a GUI folder do not. An approval
expires after ten minutes or when the task is cancelled.

### Security

Services bind to loopback by default, and Docker publishes backend ports on host
loopback only. Set `CORE_BIND_HOST`, `AGENT_BIND_HOST`, `MOCR_BIND_HOST`, or
`LIFE_BIND_HOST` to override this on a trusted service network. To expose HTTP
externally, put an authenticated reverse proxy in front. `CORE_API_TOKEN` makes
Core require a bearer token, and a browser can exchange it for an HttpOnly
`0kay_session` cookie at `POST /api/auth/session`, which also authenticates
EventSource and WebSocket clients. Requests from origins outside
`CORE_ALLOWED_ORIGINS` are denied, and an unexpected `Host` header is rejected
to block DNS rebinding. `GET /api/providers` never returns provider API keys;
only the service-only `GET /api/providers/credentials` does.

### Agent repository

`agent/` is maintained in its own repository. On a fresh clone, run
`powershell -File bootstrap.ps1` to check out the revision recorded in
`dependencies.json`; existing agent worktrees are left untouched. For a
coordinated release, publish agent first and update its revision in
`dependencies.json`. That file records the baseline commit, so an uncommitted
agent fix is not part of a release until it is published.

### Local validation

```powershell
python -B -m unittest discover -s life/tests -v
# agent/: npm test; npx tsc --noEmit
# core/ and mocr/: go test ./...
```

### Docker Compose

```bash
docker-compose up -d      # start all services
docker-compose ps         # check status
docker-compose logs -f    # view logs
docker-compose down       # stop
```

### Running services

```bash
make proto     # generate protobuf code
make dev-core  # Core on :50051 (gRPC) and :8080 (HTTP)
make dev-mocr  # mocr on :50052
make dev-life  # L.I.F.E on :50053
make dev-agent # Agent on :50054
```

## API endpoints

### Core HTTP gateway

- `GET /health`: health check
- `GET /api/plugins`: list plugins
- `POST /api/chat`: chat, sync or streaming
- `WS /ws`: WebSocket

### gRPC services

- `core.v1.PluginService`: plugin registration
- `core.v1.CoreService`: mocr and agent dispatch
- `mocr.v1.MocrService`: model selection
- `life.v1.LifeService`: persona callbacks

## Requirements

- Go 1.27+
- Python 3.10+
- Node.js 22+
- Docker and Docker Compose

### Project structure

```
0kay/
├── proto/          # protobuf definitions
├── core/           # Go, gateway
├── mocr/           # Go, model selector
├── life/           # Python, persona plugin
├── agent/          # TypeScript, task engine
├── gen/            # generated code
├── docker-compose.yml
└── Makefile
```

## License

MIT
