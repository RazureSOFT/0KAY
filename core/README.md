# Core

> Part of **[0KAY](../README.md)** · 0KAY 平台的 Go 核心 / The Go core of the 0KAY platform.

**Core** is the single source of truth of the platform: an HTTP/WebSocket
gateway (every route in [docs/HTTP_API.md](../docs/HTTP_API.md)), the gRPC
plugin registry (`core.v1.PluginService` / `core.v1.CoreService`, see
[docs/core-services.md](../docs/core-services.md)), task scheduling and the
durable task ledger, settings, provider credentials and pairing.

**Core** 是平台的唯一真相源：HTTP/WebSocket 网关（全部路由见
[docs/zh-CN/HTTP_API.md](../docs/zh-CN/HTTP_API.md)）、gRPC 插件注册表
（`core.v1.PluginService` / `core.v1.CoreService`，见
[docs/zh-CN/core-services.md](../docs/zh-CN/core-services.md)）、任务调度与
持久任务台账、设置、供应商凭据与配对。

## Run / 运行

```sh
go build ./... && go test ./... && go vet ./...
make dev-core        # from the repo root: HTTP :8080, gRPC :50051
```

| Inbound | Port | Notes |
|---|---|---|
| HTTP | 8080 | gateway + plugin UI assets + WebSocket |
| gRPC | 50051 | plugin registration and platform services |
| LAN mode | 8443 / 5443 (TLS) | `CORE_LAN_ENABLED=1` |

Layout: `cmd/core` (entrypoint), `internal/gateway` (HTTP routes),
`internal/server` (CoreService), `internal/pairing` (pairing + mocr proxy),
`internal/registry`, `internal/settings`, `internal/providers`, `internal/tasks`.
