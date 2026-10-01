# 0KAY · DeepSeek 网页版 provider

把 `chat.deepseek.com` 的网页登录态接进 0KAY：用你已登录的网页版（不是 API Key）
驱动模型调用。对 Core 暴露一个 **OpenAI 兼容**的本地服务，并自动注册成 provider。

请求构造 / PoW（SHA3 WASM 求解）/ SSE 解析移植自
[cv-superding/dsh-deepseek-web-login](https://github.com/cv-superding/dsh-deepseek-web-login)（Apache-2.0，见 `NOTICE`）。

## 工作原理

```
mocr ──▶ http://127.0.0.1:8792/v1/chat/completions
             │  login token（~/.dsh/web-login/deepseek-auth.json 或 DEEPSEEK_WEB_TOKEN）
             ├─ POST /api/v0/chat_session/create
             ├─ POST /api/v0/chat/create_pow_challenge → SHA3 WASM 求解
             ├─ POST /api/v0/chat/completion（SSE patch 流）
             └─ POST /api/v0/chat_session/delete
```

## 配置

| 变量 | 默认 | 说明 |
|---|---|---|
| `DEEPSEEK_WEB_TOKEN` | 空 | 直接给 Bearer token（优先级最高） |
| `DEEPSEEK_WEB_AUTH_FILE` | `~/.dsh/web-login/deepseek-auth.json` | DSH 插件捕获的凭据文件（对象或裸 token 字符串） |
| `DEEPSEEK_WEB_PORT` | `8792` | 本地监听端口 |
| `DEEPSEEK_WEB_CORE_HTTP` | `CORE_HTTP_ADDR` 或 `http://127.0.0.1:8080` | Core HTTP 地址 |

凭据文件支持 `{token|authorization, cookie, userAgent, extraHeaders, hifDliq, hifLeim, wasmUrl}`；
若你已用 DSH 的 dsh-deepseek-web-login 登录过，直接复用它的文件即可。

## 模型

- `deepseek-web-chat` — 快速模式（thinking 关）
- `deepseek-web-reasoner` — 快速模式（thinking 开，推理流走 `reasoning_content`）

## 启动

```bash
node src/server.mjs          # 监听 127.0.0.1:8792 并注册 provider
node src/register.mjs        # 只刷新注册
curl http://127.0.0.1:8792/v1/probe   # 校验登录态（只读，零额度）
```

已知限制：网页端无原生 function calling，工具调用为后续工作；`temperature`/`max_tokens` 等字段网页端忽略；usage 为估算值。
