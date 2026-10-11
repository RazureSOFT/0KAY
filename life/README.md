# L.I.F.E

> Part of **[0KAY](../README.md)** · 0KAY 的伙伴内核 / The companion kernel of the 0KAY platform.

**L.I.F.E** (Life Integral Framework & Engine) is the companion: persona,
emotion (valence/arousal/connection/irritation), short- and long-term memory
(SQLite fact store + rebuildable BM25/vector/Tantivy projections), a circadian
rhythm with a learned daily schedule, journal/dream generation, proactive
messages, companion tools and OneBot/QQ integration. It exposes
`life.v1.LifeService` (gRPC :50053) and is the `PLUGIN_TYPE_PERSONA` plugin.

**L.I.F.E** 是伙伴本体：人格、情绪（愉悦/唤醒/亲近/烦躁）、短期与长期记忆
（SQLite 事实库 + 可重建的 BM25/向量/Tantivy 投影）、带习得作息的昼夜节律、
日记/梦境生成、主动消息、陪伴工具与 OneBot/QQ 接入。暴露
`life.v1.LifeService`（gRPC :50053），是 `PLUGIN_TYPE_PERSONA` 插件。

- Service RPCs: [docs/life-service.md](../docs/life-service.md) /
  [docs/zh-CN/life-service.md](../docs/zh-CN/life-service.md)
- Companion HTTP surface (proxied by Core): `/api/life/*` — see
  [docs/HTTP_API.md](../docs/HTTP_API.md) §9.

## Run / 运行

```sh
make deps-python     # from the repo root: pip install -e ".[dev]" into life/.venv
make dev-life        # cd life && .venv/Scripts/python -m life.main

# tests (~1068; keep NO_PROXY so local httpx bypasses sandbox proxies)
NO_PROXY=127.0.0.1,localhost .venv/Scripts/python -m pytest tests -q
```

`life/src/life/engine/` holds the cognition kernel (five circuits:
decision arbitration, affect/physiology, language, social learning, selfhood
and time); `legacy.py` stays as a `sys.modules` compatibility alias.
