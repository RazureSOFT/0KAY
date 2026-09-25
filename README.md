# 0KAY - Modular AI Agent Platform

A local-first AI platform with Core orchestration, a persona plugin, a model gateway, a WebUI, and an independent Agent repository.

## Documentation

- [Architecture](ARCHITECTURE.md) - component boundaries, communication, data flow, and UI patches.
- [Runtime Contracts](RUNTIME_CONTRACTS.md) - task identity, session scope, approvals, callbacks, and persistence rules.
- [Model Catalog](MODEL_CATALOG.md) - official model references and fallback model IDs.

Repository documentation uses Markdown. Runtime chat output remains ordinary
persona text unless the user explicitly requests formatted code or technical output.

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
- API Gateway (HTTP + WebSocket)
- Plugin Registry & Service Discovery
- Task Scheduling

### mocr (Go)
- Model Selection (think_model + output_model)
- Streaming Generation

### L.I.F.E (Python)
- Persona-driven responses
- Emotion system (valence, arousal, connection, irritation)
- Memory system (working, short-term, long-term)
- Circadian rhythm (mental energy, sleep/wake)
- Tools (getmail, useagent, search)

### Agent (TypeScript, independent repository)
- Task execution engine
- Tool usage (filesystem, shell)
- Core-scheduled via gRPC

## Quick Start

Plugin API reference: [docs/PLUGIN_API.md](docs/PLUGIN_API.md).
Modular installation and LAN pairing: [pm/README.md](pm/README.md).
Install the local CLI with `npm install -g ./pm`; package manifests live at the
repository root and in each module. GitHub/npm distribution requires publishing
the current manifests and package first.

### Agent permissions

The composer defaults to **Normal (approve every tool call)**. Tool requests are
held by the executor until the user allows or denies that exact call. Child
agents inherit the mode. **Full access** is an explicit per-turn setting and
automatically executes enabled tools. Direct LIFE/MCP/computer tool calls also
require approval. Read-only workspace browsing and explicit GUI folder creation
are user operations. Approval expires after ten minutes or on task cancellation.

Services bind to loopback by default. Docker exposes backend ports on host
loopback only. `CORE_BIND_HOST`, `AGENT_BIND_HOST`, `MOCR_BIND_HOST`, and
`LIFE_BIND_HOST` explicitly override this for trusted service networks. For an
externally exposed HTTP deployment use an authenticated reverse proxy; optional
`CORE_API_TOKEN` enforces a bearer token on Core HTTP requests. Foreign browser
origins are denied unless included in `CORE_ALLOWED_ORIGINS`.

`agent/` is maintained in an independent repository. On a fresh clone, run
`powershell -File bootstrap.ps1` to check out the revision recorded in
`dependencies.json`. Existing Agent worktrees are never overwritten.
When releasing coordinated changes, commit/publish Agent first and update its
revision in `dependencies.json` in the platform release. The manifest currently
records the baseline commit; uncommitted Agent fixes must be published before
that revision can represent a release containing them.

Local validation:

```powershell
python -B -m unittest discover -s life/tests -v
# In agent/: npm test; npx tsc --noEmit
# In core/ and mocr/: go test ./...
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Development

```bash
# Generate protobuf code
make proto

# Run individual services
make dev-core    # Core on :50051 (gRPC) + :8080 (HTTP)
make dev-mocr    # mocr on :50052
make dev-life    # L.I.F.E on :50053
make dev-agent   # Agent on :50054
```

## API Endpoints

### Core HTTP Gateway

- `GET /health` - Health check
- `GET /api/plugins` - List plugins
- `POST /api/chat` - Chat (sync/streaming)
- `WS /ws` - WebSocket real-time

### gRPC Services

- `core.v1.PluginService` - Plugin registration
- `core.v1.CoreService` - mocr/Agent dispatch
- `mocr.v1.MocrService` - Model selection
- `life.v1.LifeService` - Persona callbacks

## Development

### Prerequisites

- Go 1.27+
- Python 3.10+
- Node.js 22+
- Docker & Docker Compose

### Project Structure

```
0kay/
├── proto/          # Protobuf definitions
├── core/           # Go - API Gateway
├── mocr/           # Go - Model Selector
├── life/           # Python - Persona Plugin
├── agent/          # TypeScript - Task Engine
├── gen/            # Generated code
├── docker-compose.yml
└── Makefile
```

## License

MIT
