# plugin-web — plugin UI build convention

> Part of **[0KAY](../README.md)** — a self-hosted AI companion that remembers
> you, with a real agent underneath. This directory documents how 0KAY plugins
> ship their own Vue pages without rebuilding the WebUI.

Scheme C: plugins ship a native Vue page without rebuilding WebUI.

## Layout

```text
plugin-web/{name}/
  package.json      # "build": "vite build"
  vite.config.js    # external: ['vue']; outDir → CORE_DATA_DIR/plugin-ui/{name}/
  index.js          # default export = Vue component options
```

## Rules

1. **Do not bundle Vue.** Mark `vue` external so the emitted ESM keeps
   `import { … } from 'vue'`. WebUI’s importmap maps `vue` →
   `/vendor/vue-bridge.js`, which re-exports the host runtime
   (`window.__0KAY_VUE__`).
2. **Default export** is a component (`setup` returning a render function,
   or options API). No SFC/`<script setup>` in the shipped file unless you
   compile it at build time.
3. **Allowed imports:** `vue` only. Host router, pinia, and vue-i18n are
   private.
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

## Patch-only packages

`fluentui/` has no build step: it is a declarative `target:"theme"` patch
published as a standalone 0kay-pm package (`manifest.json` + `patches/` +
README), so it needs none of the layout rules above. Nothing about it ships
with the platform — `0kay-pm install` copies `patches/fluentui.patch` into
Core's `data/ui/`, which is also what materializes its Plugins page row.
