<script setup lang="ts">
/**
 * L.I.F.E 消息平台设置页 — the standalone 「消息平台」 settings tab.
 *
 * This is the *server* side of every chat platform the character is reachable
 * on. L.I.F.E runs the reverse-WebSocket listener; a client such as NapCat
 * dials in. Several bots can be registered at once, each with its own host,
 * port and token, so one flaky bridge never takes the others down with it.
 *
 * Layout: 总开关 → 适配器列表 (CRUD) → 配置文件路由 → 群聊观察与主动行为.
 * The clockwork lives in the LIFE plugin; this page only reads and writes it.
 */
import { computed, nextTick, onMounted, ref } from 'vue'
import { AppSelect, useConfirm, i18n } from '@0kay/host'
import { FLASH_MS, friendlyError, lifeAct, lifeKitCss } from './kit'

const { confirm } = useConfirm()
const t = (key: string, named?: Record<string, unknown>) => i18n.global.t(key, named ?? {})

const loading = ref(true)
const error = ref('')
const notice = ref('')

function flash(message: string) {
  notice.value = message
  setTimeout(() => { if (notice.value === message) notice.value = '' }, FLASH_MS)
}

/* Every adapter is self-contained: there is no shared master switch or default
   host/port/limits on this page — each row carries its own settings. The
   character-level proactive limits live in 「L.I.F.E 设置」. */

/* ── 适配器实例 ─────────────────────────────────────────────────────────────── */
interface Adapter {
  id: string; name: string; platform: string; enabled: boolean
  direction: string; ws_path: string
  ws_host: string; ws_port: number; ws_token: string; has_ws_token?: boolean
  http_url: string; access_token: string
  config_id: string; trigger_keywords: string[]
  created_at?: string
}
interface RuntimeState {
  id: string; enabled?: boolean; running?: boolean; connected?: boolean
  clients?: number; error?: string
}

const adapters = ref<Adapter[]>([])
const runtime = ref<RuntimeState[]>([])
const platforms = ref<Array<{ id: string; implemented: boolean }>>([])
const busy = ref(false)
/** null = editor closed, '' = adding a new bot, otherwise the edited id. */
const editing = ref<string | null>(null)
const form = ref<any>(emptyForm())
/** Editor card element, so "Add adapter" can scroll it into view. */
const editorEl = ref<HTMLElement | null>(null)

function emptyForm() {
  return {
    id: '', name: '', platform: 'aiocqhttp', enabled: true,
    // reverse = LIFE listens (client dials in); connect = LIFE dials out to
    // the platform's own WS server at ws://host:port/ws_path.
    direction: 'reverse', ws_path: '/ws',
    ws_host: '127.0.0.1', ws_port: 6199, ws_token: '',
    http_url: '', access_token: '',
    config_id: 'default', trigger_keywords: '', observe_group: true,
  }
}

function runtimeOf(id: string): RuntimeState {
  return runtime.value.find((r) => r.id === id) || { id }
}

/** Human-readable listener state for one row. */
function stateOf(a: Adapter): { label: string; tone: string } {
  const r = runtimeOf(a.id)
  if (!a.enabled) return { label: t('life.adapters.stateDisabled'), tone: 'muted' }
  if (r.connected) return { label: t('life.adapters.stateConnected', { n: r.clients || 0 }), tone: 'ok' }
  if (r.running) return {
    label: t(a.direction === 'connect' ? 'life.adapters.stateConnecting' : 'life.adapters.stateWaiting'),
    tone: 'wait',
  }
  return { label: r.error ? t('life.adapters.stateFailed') : t('life.adapters.stateIdle'), tone: 'bad' }
}

const implemented = computed(() => platforms.value.filter((p) => p.implemented).map((p) => p.id))
const pending = computed(() => platforms.value.filter((p) => !p.implemented).map((p) => p.id))

async function load() {
  loading.value = true; error.value = ''
  try {
    const [list, facts, routesResponse] = await Promise.all([
      lifeAct('adapter_list'),
      lifeAct('adapter_platforms'),
      lifeAct('adapter_routes_get'),
    ])
    adapters.value = list?.instances || []
    runtime.value = list?.runtime || []
    platforms.value = facts?.platforms || []
    routes.value = (routesResponse?.routes || []).map(keyRoute)
    defaultConfig.value = routesResponse?.default_config_id || 'default'
    // A new bot starts from built-in defaults; there is no shared default
    // host/port to seed from any more.
    form.value = { ...emptyForm(), ws_port: nextFreePort() }
  } catch (e: any) {
    error.value = friendlyError(e)
  } finally { loading.value = false }
}

/** First unused port at or after the built-in default. */
function nextFreePort(): number {
  const used = new Set(adapters.value.map((a) => Number(a.ws_port) || 0))
  let port = 6199
  while (used.has(port) && port < 65535) port += 1
  return port
}

async function startAdd() {
  editing.value = ''
  form.value = {
    ...emptyForm(),
    ws_port: nextFreePort(),
  }
  // The editor sits below the list; without this the click looks like a no-op.
  await nextTick()
  editorEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function startEdit(row: Adapter) {
  editing.value = row.id
  form.value = {
    ...emptyForm(), ...row,
    trigger_keywords: Array.isArray(row.trigger_keywords)
      ? row.trigger_keywords.join(',')
      : (row.trigger_keywords || ''),
  }
  await nextTick()
  editorEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function saveAdapter() {
  busy.value = true
  try {
    const payload: any = { ...form.value }
    // Redacted credential fields are blank on edit; omission preserves them.
    if (payload.id && !payload.ws_token) delete payload.ws_token
    if (payload.id && !payload.access_token) delete payload.access_token
    payload.trigger_keywords = String(payload.trigger_keywords || '')
      .split(',').map((k: string) => k.trim()).filter(Boolean)
    // A blank port means "assign the next free one" — send the key omission,
    // not a 0, so the plugin's own allocator decides.
    const port = Number(payload.ws_port)
    if (payload.ws_port === '' || payload.ws_port === null || payload.ws_port === undefined) delete payload.ws_port
    else if (port > 0) payload.ws_port = port
    else delete payload.ws_port
    if (!payload.id) delete payload.id
    const result = await lifeAct('adapter_upsert', { instance: payload })
    if (result && result.ok === false) throw Error(result.error || t('life.adapters.saveFailed'))
    // A saved bot must actually take effect; say so if the listener did not bind.
    const sync = result?.sync
    if (sync?.failed?.includes(result?.instance?.id) && payload.enabled) {
      flash(t('life.adapters.savedUnlistened'))
    } else {
      flash(payload.enabled === false ? t('life.adapters.savedDisabled') : t('life.adapters.savedListening'))
    }
    editing.value = null
    await load()
  } catch (e: any) {
    error.value = friendlyError(e)
  } finally { busy.value = false }
}

async function toggleAdapter(row: Adapter) {
  busy.value = true
  try {
    await lifeAct('adapter_toggle', { id: row.id, enabled: !row.enabled })
    flash(row.enabled ? t('life.adapters.toggledDisabled', { name: row.name }) : t('life.adapters.toggledEnabled', { name: row.name }))
    await load()
  } catch (e: any) { error.value = friendlyError(e) } finally { busy.value = false }
}

async function removeAdapter(row: Adapter) {
  const ok = await confirm({
    title: t('life.adapters.deleteTitle'),
    message: t('life.adapters.deleteMessage', { name: row.name }),
    confirmLabel: t('life.adapters.delete'), danger: true,
  })
  if (!ok) return
  busy.value = true
  try {
    await lifeAct('adapter_delete', { id: row.id })
    flash(t('life.adapters.deleted'))
    if (editing.value === row.id) editing.value = null
    await load()
  } catch (e: any) { error.value = friendlyError(e) } finally { busy.value = false }
}

async function resync() {
  busy.value = true
  try {
    const result = await lifeAct('adapter_sync')
    const failed = result?.failed || []
    flash(failed.length
      ? t('life.adapters.resyncFailed', { count: failed.length, names: failed.join(t('life.adapters.listSeparator')) })
      : t('life.adapters.resynced'))
    await load()
  } catch (e: any) { error.value = friendlyError(e) } finally { busy.value = false }
}

/* ── 配置文件路由 ───────────────────────────────────────────────────────────
   第一条命中的规则生效，全部不命中时用默认配置文件。`*` 通配、`/正则/`、
   后缀 `*` 都支持；会话 ID 可以在对话里发 /sid 获取。 */
interface Route { pattern: string; config_id: string; _key?: string }
const routes = ref<Route[]>([])
const defaultConfig = ref('default')
const routeDraft = ref<Route>({ pattern: '*', config_id: 'default' })
const routeBusy = ref(false)

// Stable per-rule identity: index keys would make the TransitionGroup FLIP
// animate the wrong rows on ↑↓ reorder. The key never leaves the plugin.
let routeKeySeq = 0
function keyRoute(route: Route): Route {
  return { ...route, _key: `rule-${++routeKeySeq}` }
}
const routeWireFormat = (route: Route) => ({ pattern: route.pattern, config_id: route.config_id })

function addRoute() {
  const pattern = String(routeDraft.value.pattern || '').trim()
  if (!pattern) { error.value = t('life.adapters.routePatternRequired'); return }
  routes.value = [...routes.value, keyRoute({ pattern, config_id: String(routeDraft.value.config_id || 'default').trim() || 'default' })]
  routeDraft.value = { pattern: '*', config_id: 'default' }
  error.value = ''
}
function removeRoute(index: number) { routes.value = routes.value.filter((_, i) => i !== index) }
function moveRoute(index: number, delta: number) {
  const next = [...routes.value]
  const to = index + delta
  if (to < 0 || to >= next.length) return
  const [item] = next.splice(index, 1)
  next.splice(to, 0, item)
  routes.value = next
}
async function saveRoutes() {
  routeBusy.value = true
  try {
    await lifeAct('adapter_routes_set', {
      routes: routes.value.map(routeWireFormat),
      default_config_id: String(defaultConfig.value || 'default').trim() || 'default',
    })
    flash(t('life.adapters.routesSaved'))
  } catch (e: any) { error.value = friendlyError(e) } finally { routeBusy.value = false }
}

/* ── 样式 ───────────────────────────────────────────────────────────────────
   ESM plugin entries have no HTML host, so install the shared design tokens at
   import time (guarded against a double inject). */
const STYLE_ID = 'life-plugin-adapters-style'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = lifeKitCss('lsp') + `
.lsp .adapter-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.lsp .adapter-row strong{font-size:15px;font-weight:750;overflow-wrap:anywhere}
.lsp .adapter-row .meta{flex:1 1 100%}
.lsp .adapter-actions{display:flex;gap:8px;flex-wrap:wrap;flex:1 1 100%}
.lsp .rule-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
/* A route pattern is an unbreakable regex / path; without this it pushes the
   row (and the card) wider than its column. */
.lsp .rule-row code{font:600 12px/1.4 ui-monospace,monospace;background:var(--md-surface-container-high);
  padding:2px 8px;border-radius:8px;color:var(--md-on-surface);overflow-wrap:anywhere;max-width:100%}
.lsp .rule-row .idx{font:700 12px/1 ui-monospace,monospace;color:var(--md-on-surface-variant);min-width:20px}
.lsp .rule-row .to{color:var(--md-primary);font-weight:700;font-size:13px}
.lsp .pill{font-size:12px;padding:4px 12px;transition:background .3s,color .3s}
.lsp .pill.wait{background:var(--md-secondary-container);color:var(--md-on-secondary-container);display:inline-flex;align-items:center;gap:6px}
/* "Waiting for a client" breathes so it reads as alive, not frozen. */
.lsp .pill.wait::before{content:'';flex:0 0 auto;width:7px;height:7px;border-radius:50%;background:currentColor;animation:lsp-breath 1.6s ease-in-out infinite}
@keyframes lsp-breath{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
.lsp .pill.ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}
.lsp .pill.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.lsp .pill.bad{background:var(--md-error-container);color:var(--md-on-error-container)}
.lsp .platform-note{margin:10px 0 0}
.lsp .token-warn{color:var(--md-error,#b3261e);font-weight:700}
.lsp .editor-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
/* Editor card fade-in when "Add/Edit adapter" mounts it. */
.lsp .lsp-fade-enter-active{transition:opacity 220ms var(--ease-emphasized-decel),transform 220ms var(--ease-emphasized-decel)}
.lsp .lsp-fade-enter-from{opacity:0;transform:translateY(6px)}
/* Route-rule FLIP: rows glide to their new position on ↑↓ reorder. */
.lsp .rule-flip-move{transition:transform 260ms var(--ease-emphasized)}
.lsp .rule-flip-enter-active{transition:opacity 200ms var(--ease-emphasized-decel),transform 200ms var(--ease-emphasized-decel)}
.lsp .rule-flip-enter-from{opacity:0;transform:translateY(4px)}
.lsp .rule-flip-leave-active{transition:opacity 140ms var(--ease-emphasized-accel)}
.lsp .rule-flip-leave-to{opacity:0}
@media (prefers-reduced-motion: reduce){
  .lsp .pill.wait::before{animation:none}
  .lsp .lsp-fade-enter-active,.lsp .rule-flip-move,.lsp .rule-flip-enter-active,.lsp .rule-flip-leave-active{transition-duration:1ms}
}
`
  document.head.appendChild(el)
}

onMounted(load)
</script>

<template>
  <main class="lsp">
    <header class="hero">
      <div class="hero-main">
        <div class="hero-copy">
          <p class="eyebrow"><b>●</b> L.I.F.E · MESSAGING PLATFORMS</p>
          <h1>{{ t('life.adapters.title') }}</h1>
          <p class="sub">
            {{ t('life.adapters.subtitleBefore') }}<b>{{ t('life.adapters.subtitleServer') }}</b>{{ t('life.adapters.subtitleAfter') }}
          </p>
        </div>
        <div class="hero-actions">
          <button class="fab" :disabled="busy || loading" @click="resync">
            <span class="fab-ic" aria-hidden="true">↻</span>{{ busy ? t('life.adapters.processing') : t('life.adapters.relisten') }}
          </button>
        </div>
      </div>
      <div class="state-row">
        <span class="pill soft">{{ t('life.adapters.adapterCount', { n: adapters.length }) }}</span>
        <span class="pill soft">{{ t('life.adapters.enabledCount', { n: adapters.filter(a => a.enabled).length }) }}</span>
        <span class="pill soft">{{ t('life.adapters.connectedCount', { n: runtime.filter(r => r.connected).length }) }}</span>
      </div>
    </header>

    <p v-if="error" class="banner err">{{ error }}</p>
    <p v-if="notice" class="banner ok">{{ notice }}</p>
    <p v-if="loading" class="card empty">{{ t('life.adapters.loadingConfig') }}</p>

    <template v-if="!loading">
      <!-- 适配器列表 -->
      <article class="card">
        <h3>{{ t('life.adapters.adaptersHeading') }} <span class="count-pill">{{ adapters.length }}</span>
          <button class="btn filled sm" style="margin-left:auto" @click="startAdd">{{ t('life.adapters.addAdapter') }}</button>
        </h3>
        <p v-if="!adapters.length" class="empty">{{ t('life.adapters.emptyAdapters') }}</p>
        <ol v-else class="feed">
          <li v-for="a in adapters" :key="a.id">
            <div class="adapter-row">
              <strong>{{ a.name || a.id }}</strong>
              <span class="pill" :class="stateOf(a).tone">{{ stateOf(a).label }}</span>
              <span class="pill muted">{{ a.platform }}</span>
            </div>
            <div class="meta" style="margin-top:6px">
              <span class="pill soft">{{ a.direction === 'connect' ? t('life.adapters.directionConnect') : t('life.adapters.directionReverse') }}</span>
              {{ a.direction === 'connect'
                  ? t('life.adapters.connectingTo', { target: `${a.ws_host}:${a.ws_port}${a.ws_path || ''}` })
                  : t('life.adapters.listening', { host: a.ws_host, port: a.ws_port }) }}
              · {{ t('life.adapters.personaInline') }} <code>{{ a.config_id }}</code>
              <template v-if="a.http_url"> · HTTP {{ a.http_url }}</template>
            </div>
            <div class="meta">
              <span :class="{ 'token-warn': !a.has_ws_token && a.ws_host === '0.0.0.0' }">
                {{ a.has_ws_token ? t('life.adapters.tokenSet') : t('life.adapters.tokenUnset') }}
              </span>
              <template v-if="a.trigger_keywords && a.trigger_keywords.length">
                · {{ t('life.adapters.triggerWords') }} {{ a.trigger_keywords.join(t('life.adapters.listSeparator')) }}
              </template>
            </div>
            <p v-if="runtimeOf(a.id).error" class="hint" style="color:var(--md-error,#b3261e)">
              {{ t('life.adapters.listenError', { error: runtimeOf(a.id).error }) }}
            </p>
            <div class="adapter-actions">
              <button class="btn sm" :disabled="busy" @click="toggleAdapter(a)">{{ a.enabled ? t('life.adapters.disable') : t('life.adapters.enable') }}</button>
              <button class="btn sm" @click="startEdit(a)">{{ t('life.adapters.edit') }}</button>
              <button class="btn sm danger" :disabled="busy" @click="removeAdapter(a)">{{ t('life.adapters.delete') }}</button>
            </div>
          </li>
        </ol>
      </article>

      <!-- 编辑表单 -->
      <Transition name="lsp-fade">
        <article v-if="editing !== null" ref="editorEl" class="card">
        <h3>{{ form.id ? t('life.adapters.editAdapterTitle') : t('life.adapters.addAdapterTitle') }}</h3>
        <div class="settings-grid">
          <label><span>{{ t('life.adapters.platformCategory') }}</span>
            <AppSelect
              v-model="form.platform"
              :options="platforms.map((p) => ({ value: p.id, label: p.id + (p.implemented ? '' : t('life.adapters.notImplemented')) }))"
            />
          </label>
          <label><span>{{ t('life.adapters.direction') }}</span>
            <AppSelect
              v-model="form.direction"
              :options="[
                { value: 'reverse', label: t('life.adapters.directionReverse') },
                { value: 'connect', label: t('life.adapters.directionConnect') },
              ]"
            />
          </label>
          <label><span>{{ t('life.adapters.botName') }}</span>
            <input v-model="form.name" class="field" placeholder="napcat" /></label>
          <label><span>{{ t('life.adapters.wsHost') }}</span>
            <input v-model="form.ws_host" class="field" placeholder="0.0.0.0" /></label>
          <label><span>{{ t('life.adapters.wsPort') }}</span>
            <input v-model.number="form.ws_port" class="field" type="number" min="1" max="65535" placeholder="6199" /></label>
          <label v-if="form.direction === 'connect'"><span>{{ t('life.adapters.wsPath') }}</span>
            <input v-model="form.ws_path" class="field" :placeholder="t('life.adapters.wsPathPlaceholder')" /></label>
          <label><span>{{ t('life.adapters.wsToken') }}</span>
            <input v-model="form.ws_token" class="field" type="password" :placeholder="t('life.adapters.wsTokenPlaceholder')" /></label>
          <label><span>{{ t('life.adapters.httpUrl') }}</span>
            <input v-model="form.http_url" class="field" :placeholder="t('life.adapters.httpUrlPlaceholder')" /></label>
          <label><span>{{ t('life.adapters.accessToken') }}</span>
            <input v-model="form.access_token" class="field" :placeholder="t('life.adapters.accessTokenPlaceholder')" /></label>
          <label><span>{{ t('life.adapters.configFile') }}</span>
            <input v-model="form.config_id" class="field" placeholder="default" /></label>
          <label><span>{{ t('life.adapters.triggerKeywordsInherit') }}</span>
            <input v-model="form.trigger_keywords" class="field" :placeholder="t('life.adapters.triggerKeywordsPlaceholder')" /></label>
        </div>
        <p class="hint">{{ t('life.adapters.directionHint') }}</p>
        <label class="sw" style="margin-top:12px">
          <input v-model="form.enabled" type="checkbox" />
          <span>{{ t('life.adapters.enableThisAdapter') }}</span>
        </label>
        <label class="sw" style="margin-top:12px">
          <input v-model="form.observe_group" type="checkbox" />
          <span>{{ t('life.adapters.observeGroup') }}</span>
        </label>
        <p v-if="pending.length" class="hint platform-note">
          {{ t('life.adapters.pendingPlatforms', { names: pending.join(t('life.adapters.listSeparator')) }) }}
        </p>
        <div class="editor-actions">
          <button class="btn filled sm" :disabled="busy" @click="saveAdapter">{{ busy ? t('life.adapters.saving') : t('life.adapters.save') }}</button>
          <button class="btn sm" @click="editing = null">{{ t('life.adapters.cancel') }}</button>
        </div>
        </article>
      </Transition>

      <!-- 配置文件路由 -->
      <article class="card">
        <h3>{{ t('life.adapters.routesTitle') }}</h3>
        <p class="hint">
          {{ t('life.adapters.routesHintBefore') }}<b>{{ t('life.adapters.routesHintOrder') }}</b>{{ t('life.adapters.routesHintAfterOrder') }}<code>*</code>{{ t('life.adapters.routesHintMatchAll') }}<code>{{ t('life.adapters.routeRegexExample') }}</code>{{ t('life.adapters.routesHintAnd') }}<code>{{ t('life.adapters.routePrefixExample') }}</code>{{ t('life.adapters.routesHintTail') }}<code>/sid</code>{{ t('life.adapters.routesHintSid') }}
        </p>
        <!-- TransitionGroup FLIP: stable per-rule keys, so ↑↓ glides rows. -->
        <TransitionGroup tag="ol" name="rule-flip" class="feed">
          <li v-for="(r, i) in routes" :key="r._key" class="rule-row">
            <span class="idx">{{ i + 1 }}</span>
            <code>{{ r.pattern }}</code>
            <span class="to">→ {{ r.config_id }}</span>
            <span style="margin-left:auto;display:flex;gap:8px">
              <button class="btn sm" :disabled="i === 0" :aria-label="t('life.adapters.moveUp')" :title="t('life.adapters.moveUp')" @click="moveRoute(i, -1)">↑</button>
              <button class="btn sm" :disabled="i === routes.length - 1" :aria-label="t('life.adapters.moveDown')" :title="t('life.adapters.moveDown')" @click="moveRoute(i, 1)">↓</button>
              <button class="btn sm danger" :aria-label="t('life.adapters.delete')" @click="removeRoute(i)">{{ t('life.adapters.delete') }}</button>
            </span>
          </li>
        </TransitionGroup>
        <p v-if="!routes.length" class="empty">{{ t('life.adapters.emptyRoutes') }}</p>
        <div class="settings-grid" style="margin-top:14px">
          <label><span>{{ t('life.adapters.sessionPattern') }}*</span>
            <input v-model="routeDraft.pattern" class="field" :placeholder="t('life.adapters.sessionPatternPlaceholder')" /></label>
          <label><span>{{ t('life.adapters.configFile') }}</span>
            <input v-model="routeDraft.config_id" class="field" placeholder="default" /></label>
        </div>
        <div class="actions-row">
          <button class="btn sm" @click="addRoute">{{ t('life.adapters.addRule') }}</button>
          <label class="fld" style="margin-left:auto"><span>{{ t('life.adapters.defaultConfig') }}</span>
            <input v-model="defaultConfig" class="field" placeholder="default" /></label>
          <button class="btn filled sm" :disabled="routeBusy" @click="saveRoutes">
            {{ routeBusy ? t('life.adapters.saving') : t('life.adapters.saveRoutes') }}
          </button>
        </div>
      </article>
    </template>
  </main>
</template>
