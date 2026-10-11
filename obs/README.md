# obs

> Part of **[0KAY](../README.md)** · Go 服务共用的观测库 / Observability library shared by the Go services.

**obs** is a small Go library (not a service): structured component loggers,
an in-memory span recorder and a fan-out hub that streams logs/spans to
subscribed WebUI clients. `core` and `mocr` import it; there is no port and no
process.

**obs** 是一个小型 Go 库（不是服务）：结构化的组件日志器、内存跨度记录器，
以及向订阅的 WebUI 客户端流式推送日志/跨度的扇出 hub。`core` 与 `mocr`
引用它；无端口、无进程。

```go
log := obs.Component("mocr")
ctx, span := obs.StartWithID(ctx, requestID, "mocr.generate", obs.KindServer)
defer span.End()
span.Attr("model", modelID)
```

```sh
go build ./... && go test ./... && go vet ./...
```
