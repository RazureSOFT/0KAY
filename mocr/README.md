# mocr

> Part of **[0KAY](../README.md)** · 0KAY 的模型网关 / The model gateway of the 0KAY platform.

**mocr** owns provider transports, model selection, retries and usage
accounting. It exposes `mocr.v1.MocrService` (gRPC :50052) with two RPCs:

- **`ChooseModels`** — embedded **jev router** (ported from the jev_router
  project): a char-3-gram kNN classifies the prompt into capability tags and a
  1–5 difficulty (keyword-heuristic fallback included), then the cheapest pool
  model meeting the bar wins under economy/balanced/performance/speed
  strategies. Returns the think/output pair for the duet and chat paths.
  Details: [docs/mocr-service.md](../docs/mocr-service.md).
- **`Generate`** — server-streaming generation across OpenAI-compatible and
  Anthropic-compatible endpoints, with thinking, native tool calls, usage
  accounting, transient-error retries and fallback auto-switching.

**mocr** 负责供应商传输、模型选型、重试与用量记账。暴露 `mocr.v1.MocrService`
（gRPC :50052）：`ChooseModels` 内嵌 **jev 路由器**（自 jev_router 项目移植），
字符 3-gram kNN 推断能力标签与难度，再按 economy/balanced/performance/speed
策略挑最便宜达标模型，返回 think/output 模型对；`Generate` 覆盖 OpenAI 兼容
与 Anthropic 兼容端点的流式生成、思考模式、原生工具调用、用量记账、瞬态错误
重试与回退切换。

## Run / 运行

```sh
go build ./... && go test ./... && go vet ./...
make dev-mocr        # from the repo root: gRPC :50052
```

Config lives in Core settings (strategy, prices, fallbacks); see
[docs/mocr-service.md](../docs/mocr-service.md).
