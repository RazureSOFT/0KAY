# WebUI

> Part of **[0KAY](../README.md)** · 0KAY 的单页前端 / The single-page frontend of the 0KAY platform.

**WebUI** is the Vue 3 + TypeScript single-page app. It only talks to Core over
HTTP/WebSocket and renders plugin pages as dynamic ESM modules served by Core
(`/api/plugins/{name}/ui/*` — see [plugin-web/](../plugin-web/)).

**WebUI** 是 Vue 3 + TypeScript 单页应用。它只通过 HTTP/WebSocket 与 Core
通信，并把插件页面作为 Core 提供的动态 ESM 模块渲染
（`/api/plugins/{name}/ui/*` —— 见 [plugin-web/](../plugin-web/)）。

- Built-in pages: chat, memory, agents, skills, plugins, marketplace, usage,
  console, settings.
- Plugin pages mount through `components/PluginModuleHost.vue` with router
  patches from `/api/ui/patches`.

## Run / 运行

```sh
npm install
npm run dev            # Vite dev server on :3000 (proxies /api to Core :8080)
npm run build          # vue-tsc && vite build
npm run build:plugin   # builds the built-in plugin bundles into core/data/plugin-ui/webui
npx vue-tsc --noEmit && npx eslint . && npx vitest run   # verify / 校验
```
