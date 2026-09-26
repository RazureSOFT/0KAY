# WebUI Custom Pages

A **custom page** is a plugin-owned frontend bundle that Core serves and the
WebUI mounts through its router. The plugin never edits the host frontend; it
ships a build artifact plus one `.patch` route entry. This page is the complete
guide for that flow.

## 1. Which registration is a "custom page"?

A `router` op resolves in this order (see [Settings and UI Patches](settings-ui.md)):

| Item | Renders | Use for |
|---|---|---|
| `module` | Your plugin ESM bundle, mounted as a native Vue component | **A fully custom page** |
| `component` | A whitelisted built-in page (`chat`, `agents`, `plugins`, `usage`, `settings`, `memory`, `companion`) | Standard platform pages |
| `src` | An iframe embed | Third-party pages you cannot build as ESM |

If you build your own UI, use `module`.

## 2. Source layout and build

Put the page in `plugin-web/{name}/`:

```text
plugin-web/my-plugin/
  index.js          # ESM entry, `export default` a Vue component
  src/MyPage.vue     # page component(s)
  vite.config.js     # library build → core/data/plugin-ui/my-plugin
  manifest.json
```

`manifest.json` uses the `ui` block so **0kay-pm** can build and publish it
(fields in [Plugin API §0.3](PLUGIN_API.md)):

```json
{
  "schema": 1,
  "name": "@razuresoft/0kay-web-my-plugin",
  "version": "0.1.0",
  "install": [["npm", "ci"]],
  "ui": { "dir": ".", "plugin": "my-plugin", "dist": "dist", "build": [["npm", "run", "build"]] }
}
```

To publish in the plugin marketplace, add the GitHub repository topic
`0kay-plugin` (repository → **Topics**); the topic, not a manifest field, is how
the marketplace finds 0kay plugins. See [Plugin API §0](PLUGIN_API.md).

The Vite config is a **library** build that keeps `vue` external and emits to
Core's data directory:

```js
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const root = path.dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  plugins: [vue() /* + a plugin that inlines the extracted CSS into index.js */],
  build: {
    outDir: path.resolve(root, '../../core/data/plugin-ui/my-plugin'),
    emptyOutDir: true, target: 'es2020',
    lib: { entry: path.join(root, 'index.js'), formats: ['es'], fileName: () => 'index.js' },
    rollupOptions: { external: ['vue'], output: { entryFileNames: 'index.js', chunkFileNames: 'assets/[name]-[hash].js' } },
  },
})
```

Output must land in `${CORE_DATA_DIR}/plugin-ui/{name}/`. This repo's
`plugin-web/{life,agent,minecraft,skillsguishow}` already do this; copy one.

## 3. Register nav + route with a `.patch`

Drop a JSON `.patch` in the plugin-owned UI patch directory (Core merges
`CORE_DATA_DIR/ui/*.patch` and `webui/patches/*.patch`):

```json
{
  "id": "my-plugin-ui",
  "plugin": "my-plugin",
  "enabled": true,
  "patches": [
    {
      "target": "nav",
      "op": "insert",
      "id": "my-plugin",
      "anchor": "plugins",
      "position": "before",
      "item": { "id": "my-plugin", "to": "/my-plugin", "label": "My Plugin", "icon": "chip", "order": 25 }
    },
    {
      "target": "router",
      "op": "insert",
      "id": "my-plugin",
      "item": {
        "id": "my-plugin",
        "path": "/my-plugin",
        "name": "my-plugin",
        "module": "/api/plugins/my-plugin/ui/index.js",
        "title": "My Plugin"
      }
    }
  ]
}
```

- `plugin` **must** equal your registered plugin name. Disabling the plugin
  filters this patch: nav entry, route and (if declared) settings tab all vanish.
- The router `module` URL is served by Core at
  `GET /api/plugins/{name}/ui/{path…}` (404 while the plugin is disabled, path
  traversal rejected). Only an explicit `/api/plugins/…` URL is allowed here.

## 4. Runtime contract

| Piece | Contract |
|---|---|
| Entry | `export default` a Vue component (or an object with `setup`) |
| Vue | Bare `import { h, ref, onMounted } from 'vue'` — resolved by the WebUI importmap to the host bridge (`window.__0KAY_VUE__`), so you use the **same** Vue instance as the host |
| Forbidden imports | `vue-router`, `pinia`, `vue-i18n`, and any host-private store; there is no host router/store access |
| HTTP | Same-origin `fetch('/api/…')` only |
| Mount point | Rendered inside `#app .app-main`; the router keeps it alive across tab switches |
| CSS | Ship styles inside the bundle (inject a `<style>` element, or a scoped SFC). Prefer a page-unique class prefix so host styles cannot collide |
| Theme tokens | Host MD3 variables (`--md-primary`, `--md-surface*`, `--shadow-*`, `--ease-spring`, …) and the shared component classes (`.btn`, `.input`, `.chip`) are available on `:root` — use them for a consistent look |
| Cache | Entry `index.js` is served `no-cache`; hashed `*-<hash>.{js,css}` are immutable. If you must force a refresh of the entry, bump a query (`index.js?v=2`) in the route `module` |

Error handling: if the module fails to import, the host falls back to an empty
patch page; log to the console and keep the component resilient.

## 5. Minimal page

```js
// index.js
import { h, ref, onMounted, onUnmounted } from 'vue'

const CSS = `#app .my-page{padding:24px}
#app .my-page .card{background:var(--md-surface-container-low);border-radius:28px;padding:20px}`

function ensureStyle() {
  if (typeof document === 'undefined' || document.getElementById('my-plugin-style')) return
  const el = document.createElement('style'); el.id = 'my-plugin-style'; el.textContent = CSS
  document.head.appendChild(el)
}

export default {
  name: 'MyPluginPage',
  setup() {
    ensureStyle()
    const items = ref([])
    let timer
    async function load() { items.value = (await fetch('/api/my-plugin/list').then(r => r.json())).items || [] }
    onMounted(() => { load(); timer = setInterval(load, 10000) })
    onUnmounted(() => clearInterval(timer))
    return () => h('div', { class: 'my-page' }, [
      h('header', {}, [h('h1', {}, 'My Plugin')]),
      h('section', { class: 'card' }, items.value.map((i) => h('div', { key: i.id }, i.name))),
    ])
  },
}
```

Or with a single-file component: `index.js` just does
`import Page from './src/MyPage.vue'; export default Page`.

## 6. Optional integrations

- **Settings tab** — either declare `type: bool|number|text|select` fields in the
  registration `SettingsSection`, or point a `settings` op at a built-in
  `component`. See [Settings and UI Patches](settings-ui.md).
- **In-page chat slots / status widgets** — `chat` and `status` targets extend
  the chat page; details in [Settings and UI Patches](settings-ui.md).

## 7. Checklist

- [ ] `manifest.json` has a matching `ui` block and the repo carries the GitHub
      topic `0kay-plugin`.
- [ ] `npm run build` emits `index.js` into `core/data/plugin-ui/{name}/`.
- [ ] `.patch` has `plugin` set to the exact registered name, a `nav` op and a
      `router` op whose `module` is `/api/plugins/{name}/ui/index.js`.
- [ ] Entry `export default`s a component and imports only bare `vue` +
      same-origin `fetch`.
- [ ] Disabling the plugin removes the nav entry, route and settings.
- [ ] No secrets in the bundle or repository.
