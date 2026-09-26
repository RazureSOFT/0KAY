<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const storedUrl = (() => { try { return localStorage.getItem('0kay.minecraft.url') || '' } catch { return '' } })()
const serviceUrl = ref(storedUrl || `http://${location.hostname || '127.0.0.1'}:8765`)
const status = ref(null)
const world = ref({ waypoints: [], skills: [] })
const error = ref('')
const busy = ref(false)
const showConnect = ref(false)
const form = ref({ edition: 'java', host: '', port: '', username: 'XingYao', password: '' })
let timer = null

const bot = computed(() => status.value?.bot || null)
const connected = computed(() => !!bot.value?.connected)
const autopilot = computed(() => status.value?.autopilot || { running: false })
const playerName = computed(() => bot.value?.username || '')

function pct(v, max = 20) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, (n / max) * 100))
}

const itemBySlot = computed(() => {
  const map = {}
  for (const item of bot.value?.inventory || []) map[item.slot] = item
  return map
})
function slot(s) { return itemBySlot.value[s] || null }
const hotbar = computed(() => Array.from({ length: 9 }, (_, i) => ({ slot: 36 + i, item: slot(36 + i) })))
const backpack = computed(() => Array.from({ length: 27 }, (_, i) => ({ slot: 9 + i, item: slot(9 + i) })))

function itemLabel(name) {
  return String(name || '').replace(/_/g, ' ')
}

async function refresh() {
  try {
    const res = await fetch(`${serviceUrl.value.replace(/\/$/, '')}/status`, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    status.value = await res.json()
    error.value = ''
    fetchWorld()
  } catch (e) {
    error.value = e?.message || 'unreachable'
  }
}

async function fetchWorld() {
  try {
    const res = await fetch(`${serviceUrl.value.replace(/\/$/, '')}/world`, { signal: AbortSignal.timeout(6000) })
    if (res.ok) world.value = await res.json()
  } catch { /* keep previous world snapshot */ }
}

async function act(action, args = {}) {
  busy.value = true
  try {
    const res = await fetch(`${serviceUrl.value.replace(/\/$/, '')}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, args }),
      signal: AbortSignal.timeout(40000),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok === false) throw new Error(data.error || 'action failed')
    await refresh()
  } catch (e) {
    error.value = e?.message || 'action failed'
  } finally {
    busy.value = false
  }
}

async function connect() {
  await act('connect', {
    edition: form.value.edition,
    host: form.value.host.trim(),
    port: form.value.port ? Number(form.value.port) : undefined,
    username: form.value.username.trim() || undefined,
    password: form.value.password || undefined,
  })
}

function saveUrl() {
  try { localStorage.setItem('0kay.minecraft.url', serviceUrl.value) } catch { /* ignore */ }
  refresh()
}

onMounted(() => {
  refresh()
  timer = setInterval(refresh, 3000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="mc">
    <header class="mc-head">
      <div class="mc-title">
        <span class="dot" :class="connected ? 'on' : (error ? 'err' : 'off')" />
        <h1>Minecraft</h1>
        <span class="state">{{ connected ? '在线' : (bot?.state || '未连接') }}</span>
        <span v-if="autopilot.running" class="tag">AI 自动游玩</span>
      </div>
      <div class="mc-actions">
        <input v-model="serviceUrl" class="url" spellcheck="false" @change="saveUrl" />
        <button :disabled="busy" @click="refresh">刷新</button>
        <button :disabled="busy" @click="showConnect = !showConnect">{{ showConnect ? '收起' : '连接' }}</button>
        <button v-if="connected" class="danger" :disabled="busy" @click="act('disconnect')">断开</button>
      </div>
    </header>

    <p v-if="error" class="err">服务不可达：{{ error }}（地址 {{ serviceUrl }}）</p>

    <section v-if="showConnect" class="card connect">
      <select v-model="form.edition">
        <option value="java">Java</option>
        <option value="bedrock">Bedrock</option>
      </select>
      <input v-model="form.host" placeholder="服务器地址，如 razure.ink" spellcheck="false" />
      <input v-model="form.port" placeholder="端口（Java 25565 / Bedrock 19132）" spellcheck="false" />
      <input v-model="form.username" placeholder="昵称" spellcheck="false" />
      <input v-model="form.password" placeholder="服务器密码（留空自动用 LIFE 记忆里的）" spellcheck="false" />
      <button class="primary" :disabled="busy || !form.host.trim()" @click="connect">连接</button>
    </section>

    <template v-if="bot">
      <section class="grid">
        <div class="card">
          <h2>服务器</h2>
          <dl>
            <dt>地址</dt><dd>{{ bot.host || '-' }}:{{ bot.port || '-' }}</dd>
            <dt>版本</dt><dd>{{ bot.edition === 'bedrock' ? 'Bedrock' : 'Java' }} {{ bot.version || '' }}</dd>
            <dt>维度</dt><dd>{{ bot.dimension || '-' }}</dd>
            <dt>坐标</dt><dd>{{ bot.position ? `${bot.position.x}, ${bot.position.y}, ${bot.position.z}` : '-' }}</dd>
            <dt>手持</dt><dd>{{ itemLabel(bot.held) || '空' }}</dd>
          </dl>
        </div>

        <div class="card">
          <h2>状态</h2>
          <div class="bar-row"><span class="bar-label">生命</span><div class="bar"><i class="hp" :style="{ width: pct(bot.health) + '%' }" /></div><span class="bar-num">{{ bot.health ?? '-' }}/20</span></div>
          <div class="bar-row"><span class="bar-label">饥饿</span><div class="bar"><i class="food" :style="{ width: pct(bot.food) + '%' }" /></div><span class="bar-num">{{ bot.food ?? '-' }}/20</span></div>
          <p v-if="bot.error" class="err small">{{ bot.error }}</p>
        </div>

        <div class="card">
          <h2>玩家 <span class="muted">{{ (bot.players || []).length }}</span></h2>
          <ul class="players">
            <li v-for="p in bot.players || []" :key="p.name">
              <b>{{ p.name }}</b>
              <span class="muted">{{ p.position ? `${Math.round(p.position.x)}, ${Math.round(p.position.y)}, ${Math.round(p.position.z)}` : '' }}</span>
              <span v-if="p.ping != null" class="muted">{{ p.ping }}ms</span>
            </li>
            <li v-if="!(bot.players || []).length" class="muted">暂无其他玩家</li>
          </ul>
        </div>
      </section>

      <section class="card">
        <h2>记忆的地点 <span class="muted">{{ (world.waypoints || []).length }}</span></h2>
        <ul class="players">
          <li v-for="w in world.waypoints || []" :key="w.id">
            <b>{{ w.name }}</b>
            <span class="muted">{{ Math.round(w.x) }}, {{ Math.round(w.y) }}, {{ Math.round(w.z) }} · {{ w.type }}</span>
            <button class="mini" :disabled="busy" @click="act('waypoint_goto', { name: w.name })">前往</button>
          </li>
          <li v-if="!(world.waypoints || []).length" class="muted">暂无，机器人会随游玩自动记录</li>
        </ul>
      </section>

      <section class="card">
        <h2>学会的技能 <span class="muted">{{ (world.skills || []).length }}</span></h2>
        <ul class="players">
          <li v-for="s in world.skills || []" :key="s.id">
            <b>{{ s.name }}</b>
            <span class="muted">{{ (s.steps || []).length }} 步 · 用过 {{ s.runs || 0 }} 次</span>
            <button class="mini" :disabled="busy" @click="act('skill_run', { name: s.name })">执行</button>
          </li>
          <li v-if="!(world.skills || []).length" class="muted">暂无，LIFE 会定期复盘并沉淀技能</li>
        </ul>
      </section>

      <section class="card">
        <h2>物品栏 <span class="muted">快捷栏</span></h2>
        <div class="inv hotbar">
          <div v-for="s in hotbar" :key="s.slot" class="cell" :title="s.item ? `${itemLabel(s.item.name)} x${s.item.count}` : '空'">
            <span v-if="s.item" class="it">{{ itemLabel(s.item.name) }}<b v-if="s.item.count > 1">×{{ s.item.count }}</b></span>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>背包</h2>
        <div class="inv">
          <div v-for="s in backpack" :key="s.slot" class="cell" :title="s.item ? `${itemLabel(s.item.name)} x${s.item.count}` : '空'">
            <span v-if="s.item" class="it">{{ itemLabel(s.item.name) }}<b v-if="s.item.count > 1">×{{ s.item.count }}</b></span>
          </div>
        </div>
      </section>
    </template>

    <p v-else-if="!error" class="muted pad">未连接。点「连接」填写服务器，或让 L.I.F.E 说「连到 xxx 服务器」。</p>
  </div>
</template>

<style scoped>
.mc { padding: 20px 24px; color: var(--md-on-surface, #e6e1e5); max-width: 1100px; }
.mc-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.mc-title { display: flex; align-items: center; gap: 10px; }
.mc-title h1 { font-size: 20px; margin: 0; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: #888; }
.dot.on { background: #37c871; box-shadow: 0 0 8px #37c871; }
.dot.err { background: #e35d5d; }
.state { color: var(--md-on-surface-variant, #a8a2ab); font-size: 13px; }
.tag { font-size: 12px; padding: 2px 8px; border-radius: 999px; background: rgba(55,200,113,.15); color: #37c871; border: 1px solid rgba(55,200,113,.4); }
.mc-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.mc button { background: var(--md-surface-container, #2b2930); color: inherit; border: 1px solid var(--md-outline, #49454f); border-radius: 8px; padding: 6px 12px; cursor: pointer; }
.mc button:disabled { opacity: .5; cursor: default; }
.mc button.primary { background: #4a7dff; border-color: #4a7dff; color: #fff; }
.mc button.danger { border-color: #e35d5d; color: #e35d5d; }
.url, .connect input, .connect select { background: rgba(255,255,255,.04); color: inherit; border: 1px solid var(--md-outline, #49454f); border-radius: 8px; padding: 6px 10px; font: inherit; }
.url { width: 230px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 14px; }
.card { background: var(--md-surface-container, #2b2930); border: 1px solid var(--md-outline, #49454f); border-radius: 14px; padding: 14px 16px; margin-bottom: 14px; }
.card h2 { font-size: 14px; margin: 0 0 10px; font-weight: 600; }
.card h2 .muted { font-weight: 400; font-size: 12px; }
dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 14px; margin: 0; font-size: 13px; }
dt { color: var(--md-on-surface-variant, #a8a2ab); }
dd { margin: 0; }
.bar-row { display: flex; align-items: center; gap: 10px; margin: 8px 0; font-size: 13px; }
.bar-label { width: 34px; color: var(--md-on-surface-variant, #a8a2ab); }
.bar { flex: 1; height: 12px; border-radius: 6px; background: rgba(255,255,255,.08); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 6px; }
.bar i.hp { background: linear-gradient(90deg,#e35d5d,#ff8a8a); }
.bar i.food { background: linear-gradient(90deg,#d99a37,#f0c060); }
.bar-num { width: 54px; text-align: right; color: var(--md-on-surface-variant, #a8a2ab); }
.players { list-style: none; margin: 0; padding: 0; font-size: 13px; }
.players li { display: flex; gap: 10px; align-items: center; padding: 3px 0; }
.players li span:last-child { margin-left: auto; }
.mini { padding: 2px 10px; font-size: 12px; margin-left: auto; }
.inv { display: grid; grid-template-columns: repeat(9, 1fr); gap: 6px; }
.inv.hotbar { margin-bottom: 4px; }
.cell { aspect-ratio: 1; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; padding: 2px; overflow: hidden; }
.cell .it { font-size: 10px; line-height: 1.05; text-align: center; word-break: break-word; }
.cell .it b { display: block; font-size: 10px; color: #ffd76a; }
.muted { color: var(--md-on-surface-variant, #a8a2ab); }
.err { color: #e35d5d; }
.err.small { font-size: 12px; margin: 6px 0 0; }
.pad { padding: 8px 0; }
.connect { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.connect input { min-width: 160px; flex: 1; }
</style>
