# 0kay - Modular AI Agent Platform

A distributed AI Agent platform with persona-driven responses, intelligent model selection, and modular architecture.

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

### Agent (TypeScript)
- Task execution engine
- Tool usage (filesystem, shell)
- Core-scheduled via gRPC

## Quick Start

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

- Go 1.21+
- Python 3.10+
- Node.js 18+
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
