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
import { computed, onMounted, ref } from 'vue'
import AppSelect from './AppSelect.vue'
import { useConfirm } from './confirm'
import ConfirmDialog from './ConfirmDialog.vue'
import { friendlyError, lifeAct, lifeKitCss, readSection, writeSection } from './kit'

const { confirm } = useConfirm()

const loading = ref(true)
const error = ref('')
const notice = ref('')

function flash(message: string) {
  notice.value = message
  setTimeout(() => { if (notice.value === message) notice.value = '' }, 3200)
}

/* ── 总开关与共享默认值 ───────────────────────────────────────────────────────
   这些留在 Core settings（section id = life），因为它们不是机器人的属性：
   总开关决定整个反向 WS 运行时是否启动，后面的默认值只影响「新增」时的表单取值。 */
const master = ref({
  onebot_enabled: false,
   onebot_reverse_host: '127.0.0.1',
  onebot_reverse_port: 6199,
})
const shared = ref({
  onebot_trigger_keywords: '',
  onebot_observe_group: true,
  proactive_daily_limit: 3,
  proactive_target_limit: 1,
})
const settingsBusy = ref(false)

/* ── 适配器实例 ─────────────────────────────────────────────────────────────── */
interface Adapter {
  id: string; name: string; platform: string; enabled: boolean
  ws_host: string; ws_port: number; ws_token: string
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

function emptyForm() {
  return {
    id: '', name: '', platform: 'aiocqhttp', enabled: true,
    ws_host: '127.0.0.1', ws_port: 6199, ws_token: '',
    http_url: '', access_token: '',
    config_id: 'default', trigger_keywords: '',
  }
}

function runtimeOf(id: string): RuntimeState {
  return runtime.value.find((r) => r.id === id) || { id }
}

/** Human-readable listener state for one row. */
function stateOf(a: Adapter): { label: string; tone: string } {
  const r = runtimeOf(a.id)
  if (!a.enabled) return { label: '未启用', tone: 'muted' }
  if (r.connected) return { label: `已连接 · ${r.clients || 0} 客户端`, tone: 'ok' }
  if (r.running) return { label: '等待客户端接入', tone: 'wait' }
  return { label: r.error ? '监听失败' : '未监听', tone: 'bad' }
}

const implemented = computed(() => platforms.value.filter((p) => p.implemented).map((p) => p.id))
const pending = computed(() => platforms.value.filter((p) => !p.implemented).map((p) => p.id))

async function load() {
  loading.value = true; error.value = ''
  try {
    const [list, facts, routesResponse, section] = await Promise.all([
      lifeAct('adapter_list'),
      lifeAct('adapter_platforms'),
      lifeAct('adapter_routes_get'),
      readSection('life').catch(() => ({} as Record<string, any>)),
    ])
    adapters.value = list?.instances || []
    runtime.value = list?.runtime || []
    platforms.value = facts?.platforms || []
    routes.value = routesResponse?.routes || []
    defaultConfig.value = routesResponse?.default_config_id || 'default'
    master.value = {
      onebot_enabled: section.onebot_enabled === true,
      onebot_reverse_host: String(section.onebot_reverse_host ?? '127.0.0.1') || '127.0.0.1',
      onebot_reverse_port: Number(section.onebot_reverse_port ?? 6199) || 6199,
    }
    shared.value = {
      onebot_trigger_keywords: String(section.onebot_trigger_keywords ?? ''),
      onebot_observe_group: section.onebot_observe_group !== false,
      proactive_daily_limit: Number(section.proactive_daily_limit ?? 3),
      proactive_target_limit: Number(section.proactive_target_limit ?? 1),
    }
    // Seed the "add" form from the global defaults so a new bot starts sane.
    form.value = { ...emptyForm(), ws_host: master.value.onebot_reverse_host,
      ws_port: nextFreePort(), trigger_keywords: shared.value.onebot_trigger_keywords }
  } catch (e: any) {
    error.value = friendlyError(e)
  } finally { loading.value = false }
}

/** First unused port at or after the global default. */
function nextFreePort(): number {
  const used = new Set(adapters.value.map((a) => Number(a.ws_port) || 0))
  let port = master.value.onebot_reverse_port || 6199
  while (used.has(port) && port < 65535) port += 1
  return port
}

function startAdd() {
  editing.value = ''
  form.value = {
    ...emptyForm(),
    ws_host: master.value.onebot_reverse_host || '127.0.0.1',
    ws_port: nextFreePort(),
    trigger_keywords: shared.value.onebot_trigger_keywords,
  }
}

function startEdit(row: Adapter) {
  editing.value = row.id
  form.value = {
    ...emptyForm(), ...row,
    trigger_keywords: Array.isArray(row.trigger_keywords)
      ? row.trigger_keywords.join(',')
      : (row.trigger_keywords || ''),
  }
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
    if (result && result.ok === false) throw Error(result.error || '保存失败')
    // A saved bot must actually take effect; say so if the listener did not bind.
    const sync = result?.sync
    if (sync?.failed?.includes(result?.instance?.id) && payload.enabled) {
      flash('已保存，但未能开始监听（端口可能被占用），请检查端口后点「重新监听」')
    } else {
      flash(payload.enabled === false ? '已保存（未启用）' : '适配器已保存并开始监听')
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
    flash(row.enabled ? `已停用「${row.name}」` : `已启用「${row.name}」`)
    await load()
  } catch (e: any) { error.value = friendlyError(e) } finally { busy.value = false }
}

async function removeAdapter(row: Adapter) {
  const ok = await confirm({
    title: '删除该适配器',
    message: `将停止「${row.name}」的监听并删除它的连接配置。该机器人的会话记忆、关系与人设选择不会受影响。`,
    confirmLabel: '删除', danger: true,
  })
  if (!ok) return
  busy.value = true
  try {
    await lifeAct('adapter_delete', { id: row.id })
    flash('适配器已删除')
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
      ? `重新监听完成，${failed.length} 个适配器失败：${failed.join('、')}`
      : '已按配置重新监听')
    await load()
  } catch (e: any) { error.value = friendlyError(e) } finally { busy.value = false }
}

async function saveMaster() {
  settingsBusy.value = true
  try {
    await writeSection('life', {
      ...master.value,
      onebot_reverse_port: Number(master.value.onebot_reverse_port) || 6199,
      ...shared.value,
      proactive_daily_limit: Number(shared.value.proactive_daily_limit) || 0,
      proactive_target_limit: Number(shared.value.proactive_target_limit) || 0,
    })
    // The master switch flips a runtime gate; make it take effect immediately
    // instead of waiting for the next settings poll.
    await lifeAct('adapter_sync').catch(() => null)
    flash(master.value.onebot_enabled ? '已开启消息平台总开关并重新监听' : '已关闭消息平台总开关，所有适配器停止监听')
    await load()
  } catch (e: any) {
    error.value = friendlyError(e)
  } finally { settingsBusy.value = false }
}

/* ── 配置文件路由 ───────────────────────────────────────────────────────────
   第一条命中的规则生效，全部不命中时用默认配置文件。`*` 通配、`/正则/`、
   后缀 `*` 都支持；会话 ID 可以在对话里发 /sid 获取。 */
interface Route { pattern: string; config_id: string }
const routes = ref<Route[]>([])
const defaultConfig = ref('default')
const routeDraft = ref<Route>({ pattern: '*', config_id: 'default' })
const routeBusy = ref(false)

function addRoute() {
  const pattern = String(routeDraft.value.pattern || '').trim()
  if (!pattern) { error.value = '会话匹配不能为空'; return }
  routes.value = [...routes.value, { pattern, config_id: String(routeDraft.value.config_id || 'default').trim() || 'default' }]
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
      routes: routes.value,
      default_config_id: String(defaultConfig.value || 'default').trim() || 'default',
    })
    flash('路由已保存；规则自上而下，首条命中生效')
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
.lsp .adapter-row strong{font-size:15px;font-weight:750}
.lsp .adapter-row .meta{flex:1 1 100%}
.lsp .adapter-actions{display:flex;gap:8px;flex-wrap:wrap;flex:1 1 100%}
.lsp .rule-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.lsp .rule-row code{font:600 12px/1.4 ui-monospace,monospace;background:var(--md-surface-container-high);
  padding:2px 8px;border-radius:8px;color:var(--md-on-surface)}
.lsp .rule-row .idx{font:700 12px/1 ui-monospace,monospace;color:var(--md-on-surface-variant);min-width:20px}
.lsp .rule-row .to{color:var(--md-primary);font-weight:700;font-size:13px}
.lsp .pill.wait{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.lsp .pill.ok{background:var(--md-success-container);color:#0d3b1e}
.lsp .pill.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.lsp .pill.bad{background:var(--md-error-container);color:var(--md-on-error-container)}
.lsp .pill{font-size:12px;padding:4px 12px}
.lsp .platform-note{margin:10px 0 0}
.lsp .token-warn{color:var(--md-error,#b3261e);font-weight:700}
.lsp .editor-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
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
          <h1>消息平台</h1>
          <p class="sub">
            把角色接入 QQ / 企业微信 / 飞书 / Discord / Telegram。L.I.F.E 是<b>服务端</b>：
            在这里配置反向 WebSocket 的监听地址与 Token，由 NapCat 等客户端主动连入。
            可以同时添加多个机器人，各自独立启停、互不影响。
          </p>
        </div>
        <div class="hero-actions">
          <button class="fab" :disabled="busy || loading" @click="resync">
            <span class="fab-ic" aria-hidden="true">↻</span>{{ busy ? '处理中…' : '重新监听' }}
          </button>
        </div>
      </div>
      <div class="state-row">
        <span class="pill soft">{{ adapters.length }} 个适配器</span>
        <span class="pill soft">{{ adapters.filter(a => a.enabled).length }} 个已启用</span>
        <span class="pill soft">{{ runtime.filter(r => r.connected).length }} 个已连接</span>
        <span class="pill soft" :class="master.onebot_enabled ? '' : 'muted'">
          总开关 {{ master.onebot_enabled ? '已开启' : '已关闭' }}
        </span>
      </div>
    </header>

    <p v-if="error" class="banner err">{{ error }}</p>
    <p v-if="notice" class="banner ok">{{ notice }}</p>
    <p v-if="loading" class="card empty">正在读取适配器配置…</p>

    <template v-if="!loading">
      <!-- 总开关 -->
      <article class="card">
        <h3>总开关与默认值</h3>
        <p class="hint">
          关闭总开关会停止<b>全部</b>反向 WebSocket 监听，与逐个停用适配器等效；
          保留适配器配置，方便下次一键恢复。下面的监听地址与端口只作为新增机器人时的默认取值。
        </p>
        <label class="sw">
          <input v-model="master.onebot_enabled" type="checkbox" />
          <span>启用消息平台适配器</span>
        </label>
        <div class="settings-grid" style="margin-top:12px">
          <label><span>反向 WebSocket 默认主机</span>
            <input v-model="master.onebot_reverse_host" class="field" placeholder="0.0.0.0" /></label>
          <label><span>反向 WebSocket 默认端口</span>
            <input v-model.number="master.onebot_reverse_port" class="field" type="number" min="1" max="65535" placeholder="6199" /></label>
          <label><span>群聊触发关键词（逗号分隔，留空=全部）</span>
            <input v-model="shared.onebot_trigger_keywords" class="field" placeholder="bot,在吗" /></label>
          <label><span>每日主动消息上限</span>
            <input v-model.number="shared.proactive_daily_limit" class="field" type="number" min="0" placeholder="3" /></label>
          <label><span>单目标每日上限</span>
            <input v-model.number="shared.proactive_target_limit" class="field" type="number" min="0" placeholder="1" /></label>
        </div>
        <label class="sw" style="margin-top:12px">
          <input v-model="shared.onebot_observe_group" type="checkbox" />
          <span>群聊观察（未触发回复时仍记录有限的话题与成员活跃度）</span>
        </label>
        <p class="hint">
          主机填 <code>0.0.0.0</code> 会接受来自任意网卡的连接，此时<b>务必</b>为每个适配器设置 Token。
        </p>
        <div class="actions-row">
          <button class="btn filled sm" :disabled="settingsBusy" @click="saveMaster">
            {{ settingsBusy ? '保存中…' : '保存并生效' }}
          </button>
        </div>
      </article>

      <!-- 适配器列表 -->
      <article class="card">
        <h3>适配器 <span class="count-pill">{{ adapters.length }}</span>
          <button class="btn filled sm" style="margin-left:auto" @click="startAdd">＋ 添加适配器</button>
        </h3>
        <p v-if="!adapters.length" class="empty">还没有适配器。点「添加适配器」接入第一个机器人。</p>
        <ol v-else class="feed">
          <li v-for="a in adapters" :key="a.id">
            <div class="adapter-row">
              <strong>{{ a.name || a.id }}</strong>
              <span class="pill" :class="stateOf(a).tone">{{ stateOf(a).label }}</span>
              <span class="pill muted">{{ a.platform }}</span>
            </div>
            <div class="meta" style="margin-top:6px">
              监听 ws://{{ a.ws_host }}:{{ a.ws_port }} · 人设 <code>{{ a.config_id }}</code>
              <template v-if="a.http_url"> · HTTP {{ a.http_url }}</template>
            </div>
            <div class="meta">
              <span :class="{ 'token-warn': !a.ws_token && a.ws_host === '0.0.0.0' }">
                {{ a.ws_token ? 'Token 已设置' : '未设置 Token' }}
              </span>
              <template v-if="a.trigger_keywords && a.trigger_keywords.length">
                · 触发词 {{ a.trigger_keywords.join('、') }}
              </template>
            </div>
            <p v-if="runtimeOf(a.id).error" class="hint" style="color:var(--md-error,#b3261e)">
              监听错误：{{ runtimeOf(a.id).error }}
            </p>
            <div class="adapter-actions">
              <button class="btn sm" :disabled="busy" @click="toggleAdapter(a)">{{ a.enabled ? '停用' : '启用' }}</button>
              <button class="btn sm" @click="startEdit(a)">编辑</button>
              <button class="btn sm danger" :disabled="busy" @click="removeAdapter(a)">删除</button>
            </div>
          </li>
        </ol>
      </article>

      <!-- 编辑表单 -->
      <article v-if="editing !== null" class="card">
        <h3>{{ form.id ? '编辑适配器' : '添加适配器' }}</h3>
        <div class="settings-grid">
          <label><span>消息平台类别</span>
            <AppSelect
              v-model="form.platform"
              :options="platforms.map((p) => ({ value: p.id, label: p.id + (p.implemented ? '' : '（尚未实现）') }))"
            />
          </label>
          <label><span>机器人名称</span>
            <input v-model="form.name" class="field" placeholder="napcat" /></label>
          <label><span>反向 WebSocket 主机</span>
            <input v-model="form.ws_host" class="field" placeholder="0.0.0.0" /></label>
          <label><span>反向 WebSocket 端口</span>
            <input v-model.number="form.ws_port" class="field" type="number" min="1" max="65535" placeholder="6199" /></label>
          <label><span>反向 WebSocket Token</span>
            <input v-model="form.ws_token" class="field" type="password" placeholder="留空则不启用 Token 验证" /></label>
          <label><span>HTTP API 地址（可选）</span>
            <input v-model="form.http_url" class="field" placeholder="http://127.0.0.1:3000；留空则只走反向 WS" /></label>
          <label><span>Access Token（可选）</span>
            <input v-model="form.access_token" class="field" placeholder="HTTP API 鉴权" /></label>
          <label><span>配置文件</span>
            <input v-model="form.config_id" class="field" placeholder="default" /></label>
          <label><span>触发关键词（逗号分隔，留空=继承全局）</span>
            <input v-model="form.trigger_keywords" class="field" placeholder="bot,在吗" /></label>
        </div>
        <label class="sw" style="margin-top:12px">
          <input v-model="form.enabled" type="checkbox" />
          <span>启用该适配器（未启用则不会监听，对应平台收不到消息）</span>
        </label>
        <p v-if="pending.length" class="hint platform-note">
          已注册但尚无实现的平台：{{ pending.join('、') }}。选择它们可以先把配置存下来，等实现后无需重新录入。
        </p>
        <div class="editor-actions">
          <button class="btn filled sm" :disabled="busy" @click="saveAdapter">{{ busy ? '保存中…' : '保存' }}</button>
          <button class="btn sm" @click="editing = null">取消</button>
        </div>
      </article>

      <!-- 配置文件路由 -->
      <article class="card">
        <h3>配置文件路由</h3>
        <p class="hint">
          消息下发时，按<b>从上到下</b>的顺序匹配首个符合条件的配置文件。使用 <code>*</code> 匹配所有会话，
          也支持 <code>/正则/</code> 与 <code>前缀*</code>。全部不匹配时使用默认配置文件。
          在任意会话里发送 <code>/sid</code> 即可获取该会话 ID。
        </p>
        <ol class="feed">
          <li v-for="(r, i) in routes" :key="i" class="rule-row">
            <span class="idx">{{ i + 1 }}</span>
            <code>{{ r.pattern }}</code>
            <span class="to">→ {{ r.config_id }}</span>
            <span style="margin-left:auto;display:flex;gap:8px">
              <button class="btn sm" :disabled="i === 0" @click="moveRoute(i, -1)">↑</button>
              <button class="btn sm" :disabled="i === routes.length - 1" @click="moveRoute(i, 1)">↓</button>
              <button class="btn sm danger" @click="removeRoute(i)">删除</button>
            </span>
          </li>
          <li v-if="!routes.length" class="empty">还没有规则，所有会话都使用默认配置文件。</li>
        </ol>
        <div class="settings-grid" style="margin-top:14px">
          <label><span>会话 *</span>
            <input v-model="routeDraft.pattern" class="field" placeholder="qq_group_* 或 /^qq_.*/" /></label>
          <label><span>配置文件</span>
            <input v-model="routeDraft.config_id" class="field" placeholder="default" /></label>
        </div>
        <div class="actions-row">
          <button class="btn sm" @click="addRoute">添加规则</button>
          <label class="fld" style="margin-left:auto"><span>默认配置文件</span>
            <input v-model="defaultConfig" class="field" placeholder="default" /></label>
          <button class="btn filled sm" :disabled="routeBusy" @click="saveRoutes">
            {{ routeBusy ? '保存中…' : '保存路由' }}
          </button>
        </div>
      </article>
    </template>
  </main>
  <ConfirmDialog />
</template>
