# plugin-web — plugin UI build convention

> Part of **[0KAY](../README.md)** — a self-hosted AI companion that remembers
> you, with a real agent underneath. This directory documents how 0KAY plugins
> ship their own Vue pages without rebuilding the WebUI.

Scheme C: plugins ship a native Vue page without rebuilding WebUI.

## Layout

```text
plugin-web/{name}/
  package.json      # "build": "vite build"
  vite.config.js    # external: ['vue', '@0kay/host']; outDir → CORE_DATA_DIR/plugin-ui/{name}/
  index.js          # default export = Vue component options
  strings/          # optional: values*/strings.xml, copied into outDir by the build
  src/              # optional: SFC sources compiled at build time
```

## Rules

1. **Do not bundle Vue.** Mark `vue` external so the emitted ESM keeps
   `import { … } from 'vue'`. WebUI’s importmap maps `vue` →
   `/vendor/vue-bridge.js`, which re-exports the host runtime
   (`window.__0KAY_VUE__`).
2. **Default export** is a component (`setup` returning a render function,
   or options API). No SFC/`<script setup>` in the shipped file unless you
   compile it at build time.
3. **Allowed imports:** `vue` and `@0kay/host`. Host router, pinia and the
   `vue-i18n` module itself stay private, but a page translates through the host
   bridge (`import { i18n } from '@0kay/host'` then `i18n.global.t(...)`) so it
   shares the host's catalogs and locale instead of re-implementing them. Mark
   both `vue` and `@0kay/host` external in `vite.config.js`; the WebUI importmap
   resolves them to the host's single runtime.
4. **API calls:** use same-origin `fetch('/api/…')` (Core gateway).
5. **Deploy path:** build output must land under
   `${CORE_DATA_DIR:-data}/plugin-ui/{name}/`.
6. **Route:** register via a `.patch` router op with
   `module: "/api/plugins/{name}/ui/index.js"` (see
   `docs/writing-a-plugin.md`).
7. **Caching:** entry files without `-` in the basename are `no-cache`;
   hashed `*-*.{js,css}` assets are immutable.

## Build

```powershell
cd plugin-web/skillsguishow
npm install
npm run build
# → core/data/plugin-ui/skillsguishow/index.js
```

Reference implementation: `plugin-web/skillsguishow/`.

## Strings

A plugin that has its own copy ships it as Android-style resources:

```text
strings/values/strings.xml            # English (default)
strings/values-zh/strings.xml
strings/values-ja/strings.xml
strings/values-b+zh+Hant/strings.xml  # Traditional Chinese
```

Core serves them at `GET /api/plugins/{name}/strings`; the WebUI merges them into
vue-i18n under a namespace equal to the plugin name, so a page writes
`i18n.global.t('{name}.some.key')`. Keys are relative to that namespace.

The build copies `strings/` into `outDir` *after* bundling, because
`emptyOutDir: true` wipes the output directory at the start of every build — a
`copyStrings()` plugin runs on `closeBundle` for exactly this reason (see
`plugin-web/life/vite.config.js`).

## Plugin HTTP services

A plugin whose backend serves its own HTTP API registers that base URL as its
`address` at registration (minecraft registers `http://127.0.0.1:8765`). Core
stores it and exposes a same-origin proxy:

```text
GET|POST|… /api/plugins/{name}/proxy/{path}
```

Core forwards to the plugin and injects `Authorization: Bearer <service-token>`
— the token it issued the plugin at registration (`RegisterResponse.service_token`).
The service must authenticate inbound requests against that same token (see
`minecraft/src/index.js` `authorized()`, which verifies
`pluginServiceToken()` from `minecraft/src/plugin.js`).

The page therefore never holds the service URL or token: it calls
`fetch('/api/plugins/{name}/proxy/status')` and Core performs the authenticated
hop. Addresses that are not `http(s)` (e.g. the gRPC `host:port` life/agent/mocr
register) are rejected, so this cannot reach a plugin that exposes no HTTP API.

## Patch-only packages

`fluentui/` has no build step: it is a declarative `target:"theme"` patch
published as a standalone 0kay-pm package (`manifest.json` + `patches/` +
README), so it needs none of the layout rules above. Nothing about it ships
with the platform — `0kay-pm install` copies `patches/fluentui.patch` into
Core's `data/ui/`, which is also what materializes its Plugins page row.
