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
        <span class="mc-logo" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        </span>
        <div class="mc-copy">
          <h1>Minecraft</h1>
          <p class="mc-sub">
            <span class="dot" :class="connected ? 'on' : (error ? 'err' : 'off')" />
            {{ connected ? (playerName || '已连接') : (bot?.state || '未连接') }}
            <span v-if="autopilot.running" class="tag">AI 自动游玩</span>
          </p>
        </div>
      </div>
      <div class="mc-actions">
        <input v-model="serviceUrl" class="url" spellcheck="false" aria-label="服务地址" />
        <button class="btn tonic" :disabled="busy" @click="refresh">刷新</button>
        <button class="btn filled" :disabled="busy" @click="showConnect = !showConnect">{{ showConnect ? '收起' : '连接' }}</button>
        <button v-if="connected" class="btn danger" :disabled="busy" @click="act('disconnect')">断开</button>
      </div>
    </header>

    <p v-if="error" class="err">服务不可达：{{ error }}（地址 {{ serviceUrl }}）</p>

    <section v-if="showConnect" class="card connect">
      <h2>连接到服务器</h2>
      <div class="connect-grid">
        <label><span>版本</span>
          <select v-model="form.edition"><option value="java">Java</option><option value="bedrock">Bedrock</option></select>
        </label>
        <label><span>服务器地址</span><input v-model="form.host" placeholder="如 razure.ink" spellcheck="false" /></label>
        <label><span>端口</span><input v-model="form.port" placeholder="Java 25565 / Bedrock 19132" spellcheck="false" /></label>
        <label><span>昵称</span><input v-model="form.username" placeholder="XingYao" spellcheck="false" /></label>
        <label class="wide"><span>服务器密码</span><input v-model="form.password" placeholder="留空自动使用 LIFE 记忆里的密码" spellcheck="false" /></label>
      </div>
      <div class="actions"><button class="btn filled" :disabled="busy || !form.host.trim()" @click="connect">连接</button></div>
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
          <ul class="list">
            <li v-for="p in bot.players || []" :key="p.name">
              <b>{{ p.name }}</b>
              <span class="muted">{{ p.position ? `${Math.round(p.position.x)}, ${Math.round(p.position.y)}, ${Math.round(p.position.z)}` : '' }}</span>
              <span v-if="p.ping != null" class="chip muted">{{ p.ping }}ms</span>
            </li>
            <li v-if="!(bot.players || []).length" class="muted">暂无其他玩家</li>
          </ul>
        </div>
      </section>

      <section class="card">
        <h2>记忆的地点 <span class="muted">{{ (world.waypoints || []).length }}</span></h2>
        <ul class="list">
          <li v-for="w in world.waypoints || []" :key="w.id">
            <b>{{ w.name }}</b>
            <span class="muted">{{ Math.round(w.x) }}, {{ Math.round(w.y) }}, {{ Math.round(w.z) }} · {{ w.type }}</span>
            <button class="btn sm tonic" :disabled="busy" @click="act('waypoint_goto', { name: w.name })">前往</button>
          </li>
          <li v-if="!(world.waypoints || []).length" class="muted">暂无，机器人会随游玩自动记录</li>
        </ul>
      </section>

      <section class="card">
        <h2>学会的技能 <span class="muted">{{ (world.skills || []).length }}</span></h2>
        <ul class="list">
          <li v-for="s in world.skills || []" :key="s.id">
            <b>{{ s.name }}</b>
            <span class="muted">{{ (s.steps || []).length }} 步 · 用过 {{ s.runs || 0 }} 次</span>
            <button class="btn sm tonic" :disabled="busy" @click="act('skill_run', { name: s.name })">执行</button>
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
/* Minecraft plugin — Material 3 Expressive. #app prefixes out-rank theme.css. */
#app .mc{
  padding:clamp(18px,2.4vw,30px);max-width:1120px;margin:0 auto;
  color:var(--md-on-surface);font-family:var(--font-family);
}
#app .mc h1,#app .mc h2{margin:0;letter-spacing:-.01em}
#app .mc h2{font-size:15px;font-weight:750;margin-bottom:12px;display:flex;align-items:center;gap:8px}

/* Hero header */
#app .mc .mc-head{
  display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;
  margin-bottom:18px;padding:20px 22px;border-radius:28px;
  background:
    radial-gradient(520px 240px at 100% 0%, color-mix(in srgb,var(--md-primary) 12%,transparent), transparent 70%),
    linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-high)));
  box-shadow:var(--shadow-1);
}
#app .mc .mc-title{display:flex;align-items:center;gap:14px;min-width:0}
#app .mc .mc-logo{
  width:52px;height:52px;flex-shrink:0;display:grid;place-items:center;border-radius:18px 18px 18px 7px;
  background:var(--md-primary);color:var(--md-on-primary);
  box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 30%,transparent);
}
#app .mc .mc-copy h1{font-size:22px;font-weight:800}
#app .mc .mc-sub{display:flex;align-items:center;gap:8px;margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);flex-wrap:wrap}
#app .mc .dot{width:9px;height:9px;border-radius:50%;background:var(--md-outline);flex-shrink:0}
#app .mc .dot.on{background:var(--md-success);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-success) 22%,transparent)}
#app .mc .dot.err{background:var(--md-error);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-error) 20%,transparent)}
#app .mc .tag{
  font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:999px;
  background:var(--md-success-container);color:#0d3b1e;
}
#app .mc .mc-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}

/* Buttons */
#app .mc .btn{
  height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;
  font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;
  color:var(--md-on-surface);background:var(--md-surface-container-high);
  transition:transform 240ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 180ms,box-shadow 200ms,border-radius 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1));
}
#app .mc .btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}
#app .mc .btn:disabled{opacity:.5;cursor:not-allowed}
#app .mc .btn.sm{height:32px;padding:0 13px;font-size:12.5px}
#app .mc .btn.filled{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
#app .mc .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .mc .btn.danger{background:var(--md-error-container);color:var(--md-on-error-container,#410e0b)}

/* Inputs */
#app .mc .url,
#app .mc .connect input,
#app .mc .connect select{
  height:44px;padding:0 14px;border:1px solid transparent;border-radius:14px;
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 13.5px/1.4 inherit;outline:none;
  transition:background-color 180ms,border-color 180ms,box-shadow 200ms;
}
#app .mc .url{width:238px}
#app .mc .url:focus,#app .mc .connect input:focus,#app .mc .connect select:focus{
  border-color:var(--md-primary);background:var(--md-surface-container-lowest);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);
}

/* Cards */
#app .mc .card{
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
  border-radius:24px;padding:18px 20px;margin-bottom:16px;box-shadow:var(--shadow-1);
  transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms;
}
#app .mc .card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}
#app .mc .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:0}
#app .mc .grid .card{margin-bottom:16px}
#app .mc .connect-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}
#app .mc .connect-grid label{display:flex;flex-direction:column;gap:6px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}
#app .mc .connect-grid label.wide{grid-column:1/-1}
#app .mc .connect .actions{display:flex;justify-content:flex-end;margin-top:14px}

/* Definition lists */
#app .mc dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0;font-size:13px}
#app .mc dt{color:var(--md-on-surface-variant)}
#app .mc dd{margin:0;overflow-wrap:anywhere}

/* Bars */
#app .mc .bar-row{display:flex;align-items:center;gap:12px;margin:10px 0;font-size:13px}
#app .mc .bar-label{width:36px;color:var(--md-on-surface-variant);flex-shrink:0}
#app .mc .bar{flex:1;height:12px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
#app .mc .bar i{display:block;height:100%;border-radius:999px;transition:width 400ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}
#app .mc .bar i.hp{background:linear-gradient(90deg,#e35d5d,#ff9a9a)}
#app .mc .bar i.food{background:linear-gradient(90deg,#d99a37,#f0c060)}
#app .mc .bar-num{width:54px;text-align:right;color:var(--md-on-surface-variant);flex-shrink:0}

/* Lists */
#app .mc .list{list-style:none;margin:0;padding:0;font-size:13px;display:flex;flex-direction:column;gap:2px}
#app .mc .list li{display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}
#app .mc .list li:last-child{border-bottom:none}
#app .mc .list li .btn{margin-left:auto}
#app .mc .list li span.muted,#app .mc .list li .chip{margin-left:auto}
#app .mc .list li b + span.muted{flex:1;min-width:0}

/* Chips */
#app .mc .chip{
  display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;font-size:11.5px;font-weight:700;
  background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;
}
#app .mc .chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:600}
#app .mc .muted{color:var(--md-on-surface-variant)}
#app .mc .err{color:var(--md-error);font-size:13px;background:var(--md-error-container);padding:11px 16px;border-radius:16px;margin-bottom:14px}
#app .mc .err.small{font-size:12px;margin:8px 0 0;background:transparent;padding:0}
#app .mc .pad{padding:8px 0}

/* Inventory */
#app .mc .inv{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}
#app .mc .inv.hotbar{margin-bottom:10px}
#app .mc .cell{
  aspect-ratio:1;border-radius:14px;background:var(--md-surface-container-high);
  border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);
  display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden;
  transition:transform 200ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 180ms;
}
#app .mc .cell:hover{transform:translateY(-2px);background:var(--md-surface-container-highest)}
#app .mc .cell .it{font-size:10px;line-height:1.1;text-align:center;word-break:break-word}
#app .mc .cell .it b{display:block;font-size:10px;color:var(--md-primary);font-weight:800}

@media(max-width:640px){
  #app .mc .url{width:100%}
  #app .mc .mc-actions{width:100%}
  #app .mc .inv{grid-template-columns:repeat(5,1fr)}
}
</style>
