<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { i18n, useConfirm } from '@0kay/host'

const t = (key, named) => i18n.global.t(key, named ?? {})

// Core proxies to the plugin service and injects its token, so the panel talks
// to Core same-origin with the owner session and never handles the secret.
const API = '/api/plugins/minecraft/proxy'
const status = ref(null)
const world = ref({ waypoints: [], skills: [] })
const loading = ref(true)
const showConnect = ref(false)
const form = ref({ edition: 'java', host: '', port: '', username: '', password: '' })
let timer = null

// Two error classes: connection problems (poll fetch threw / 5xx) vs action
// failures (unknown skill, bad args, per-action timeout). Each gets its own
// banner copy and styling; action success gets a transient toast instead.
const connError = ref('')
const actionError = ref('')
const toast = ref('')
let toastTimer = null

// Per-action busy state, keyed by action (plus args identity) so parallel
// actions each light up only their own button.
const busyActions = reactive(new Set())
const anyBusy = computed(() => busyActions.size > 0)
function busyKey(action, args) {
  return args && Object.keys(args).length ? `${action}:${JSON.stringify(args)}` : action
}
function actBusy(action, args) { return busyActions.has(busyKey(action, args)) }

// Host confirm dialog when the bridge provides it; two-step button otherwise.
let hostConfirm = null
try {
  const c = useConfirm()
  if (c && typeof c.confirm === 'function') hostConfirm = c.confirm
} catch { /* older host bridge without useConfirm */ }
const armedDisconnect = ref(false)
let armTimer = null

// Read-only action log: one entry per act(), newest first, capped at 50.
const actionLog = ref([])
let logId = 0
function pushLog(action, ok, detail) {
  actionLog.value.unshift({ id: ++logId, time: new Date().toLocaleTimeString(), action, ok, detail })
  if (actionLog.value.length > 50) actionLog.value.length = 50
}

const bot = computed(() => status.value?.bot || null)
const connected = computed(() => !!bot.value?.connected)
const autopilot = computed(() => status.value?.autopilot || { running: false })
const playerName = computed(() => bot.value?.username || '')

// Raw `bot.state` enums are English; map known ones through i18n and fall back
// to the raw value for anything new.
const STATE_KEYS = {
  idle: 'minecraft.stateIdle',
  connecting: 'minecraft.stateConnecting',
  connected: 'minecraft.stateConnected',
  spawning: 'minecraft.stateSpawning',
  error: 'minecraft.stateError',
}
const stateText = computed(() => {
  const s = bot.value?.state
  if (!s) return t('minecraft.disconnected')
  const key = STATE_KEYS[s]
  return key ? t(key) : s
})

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

// Slots whose contents changed since the previous poll flash once (600ms) so
// pickups and drops are noticeable without watching the whole grid.
const flashSlots = ref({})
let prevInv = null
let flashTimer = null
function diffInventory() {
  const now = {}
  for (const item of bot.value?.inventory || []) now[item.slot] = `${item.name}#${item.count ?? 1}`
  if (prevInv) {
    const changed = {}
    for (const [slotKey, sig] of Object.entries(now)) {
      const s = Number(slotKey)
      if (prevInv[s] !== sig) changed[s] = true
    }
    for (const slotKey of Object.keys(prevInv)) {
      const s = Number(slotKey)
      if (!(s in now)) changed[s] = true
    }
    if (Object.keys(changed).length) {
      flashSlots.value = changed
      clearTimeout(flashTimer)
      flashTimer = setTimeout(() => { flashSlots.value = {} }, 700)
    }
  }
  prevInv = now
}

function itemLabel(name) {
  return String(name || '').replace(/_/g, ' ')
}

async function refresh() {
  try {
    const res = await fetch(`${API}/status`, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    status.value = await res.json()
    connError.value = ''
    diffInventory()
    fetchWorld()
  } catch (e) {
    connError.value = t('minecraft.unreachable', { error: e?.message || 'unreachable' })
  } finally {
    loading.value = false
  }
}

async function fetchWorld() {
  try {
    const res = await fetch(`${API}/world`, { signal: AbortSignal.timeout(6000) })
    if (res.ok) world.value = await res.json()
  } catch { /* keep previous world snapshot */ }
}

async function act(action, args = {}) {
  const key = busyKey(action, args)
  if (busyActions.has(key)) return
  busyActions.add(key)
  actionError.value = ''
  clearTimeout(toastTimer)
  toast.value = ''
  try {
    const res = await fetch(`${API}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, args }),
      signal: AbortSignal.timeout(40000),
    })
    const data = await res.json().catch(() => ({}))
    if (res.status >= 500) {
      // Service-side trouble: same class as a poll failure.
      connError.value = t('minecraft.unreachable', { error: `HTTP ${res.status}` })
      pushLog(action, false, `HTTP ${res.status}`)
      return
    }
    if (!res.ok || data.ok === false) {
      const msg = data.error || `HTTP ${res.status}`
      actionError.value = t('minecraft.actionFailed', { error: msg })
      pushLog(action, false, msg)
      return
    }
    await refresh()
    toast.value = t('minecraft.actionOk')
    showToast()
    pushLog(action, true, t('minecraft.logOk'))
  } catch (e) {
    if (e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      const msg = t('minecraft.actionTimeout')
      actionError.value = msg
      pushLog(action, false, msg)
    } else {
      // fetch() itself threw (network down): connection-class error.
      const msg = e?.message || 'unreachable'
      connError.value = t('minecraft.unreachable', { error: msg })
      pushLog(action, false, msg)
    }
  } finally {
    busyActions.delete(key)
  }
}

function showToast() {
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
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

async function disconnect() {
  if (hostConfirm) {
    const ok = await hostConfirm({
      title: t('minecraft.disconnect'),
      message: t('minecraft.disconnectConfirm'),
      danger: true,
      confirmLabel: t('minecraft.disconnect'),
    })
    if (ok) await act('disconnect')
    return
  }
  // Two-step fallback: first click arms the button, second click within 3s fires.
  if (!armedDisconnect.value) {
    armedDisconnect.value = true
    clearTimeout(armTimer)
    armTimer = setTimeout(() => { armedDisconnect.value = false }, 3000)
    return
  }
  clearTimeout(armTimer)
  armedDisconnect.value = false
  await act('disconnect')
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
            <span class="dot" :class="connected ? 'on' : (connError ? 'err' : 'off')" />
            {{ connected ? (playerName || t('minecraft.connected')) : stateText }}
            <span v-if="autopilot.running" class="tag">{{ t('minecraft.autopilot') }}</span>
          </p>
        </div>
      </div>
      <div class="mc-actions">
        <button class="btn tonic" :disabled="anyBusy" @click="refresh">{{ t('minecraft.refresh') }}</button>
        <button class="btn filled" :disabled="anyBusy" @click="showConnect = !showConnect">{{ showConnect ? t('minecraft.collapse') : t('minecraft.connectSettings') }}</button>
        <button v-if="connected" class="btn danger" :class="{ armed: armedDisconnect }" :disabled="actBusy('disconnect')" @click="disconnect">
          <span v-if="actBusy('disconnect')" class="spinner" aria-hidden="true" />
          {{ actBusy('disconnect') ? t('minecraft.acting') : (armedDisconnect && !hostConfirm ? t('minecraft.confirmDisconnect') : t('minecraft.disconnect')) }}
        </button>
      </div>
    </header>

    <Transition name="toast">
      <p v-if="toast" class="toast" role="status">{{ toast }}</p>
    </Transition>
    <p v-if="connError" class="err">{{ connError }}</p>
    <p v-if="actionError" class="err action-err">{{ actionError }}</p>

    <Transition name="fold">
      <div v-if="showConnect" class="fold">
        <section class="card connect">
          <h2>{{ t('minecraft.connectTitle') }}</h2>
          <div class="connect-grid">
            <label><span>{{ t('minecraft.edition') }}</span>
              <select v-model="form.edition"><option value="java">Java</option><option value="bedrock">Bedrock</option></select>
            </label>
            <label><span>{{ t('minecraft.host') }}</span><input v-model="form.host" :placeholder="t('minecraft.hostPlaceholder')" spellcheck="false" /></label>
            <label><span>{{ t('minecraft.port') }}</span><input v-model="form.port" :placeholder="t('minecraft.portPlaceholder')" spellcheck="false" /></label>
            <label><span>{{ t('minecraft.username') }}</span><input v-model="form.username" :placeholder="t('minecraft.usernamePlaceholder')" spellcheck="false" /></label>
            <label class="wide"><span>{{ t('minecraft.password') }}</span><input v-model="form.password" :placeholder="t('minecraft.passwordPlaceholder')" spellcheck="false" /></label>
          </div>
          <div class="actions">
            <button class="btn filled" :disabled="actBusy('connect') || !form.host.trim()" @click="connect">
              <span v-if="actBusy('connect')" class="spinner" aria-hidden="true" />
              {{ actBusy('connect') ? t('minecraft.acting') : t('minecraft.connect') }}
            </button>
          </div>
        </section>
      </div>
    </Transition>

    <section class="card log-card">
      <h2>{{ t('minecraft.actionLog') }}</h2>
      <p v-if="!actionLog.length" class="muted log-empty">{{ t('minecraft.logEmpty') }}</p>
      <ul v-else class="log">
        <li v-for="entry in actionLog" :key="entry.id" :class="entry.ok ? 'ok' : 'fail'">
          <span class="log-time">{{ entry.time }}</span>
          <code class="log-action">{{ entry.action }}</code>
          <span class="log-detail">{{ entry.detail }}</span>
        </li>
      </ul>
    </section>

    <Transition name="dash">
      <div v-if="bot" class="dash">
        <section class="grid">
          <div class="card">
            <h2>{{ t('minecraft.server') }}</h2>
            <dl>
              <dt>{{ t('minecraft.address') }}</dt><dd>{{ bot.host || '-' }}:{{ bot.port || '-' }}</dd>
              <dt>{{ t('minecraft.edition') }}</dt><dd>{{ bot.edition === 'bedrock' ? 'Bedrock' : 'Java' }} {{ bot.version || '' }}</dd>
              <dt>{{ t('minecraft.dimension') }}</dt><dd>{{ bot.dimension || '-' }}</dd>
              <dt>{{ t('minecraft.position') }}</dt><dd>{{ bot.position ? `${bot.position.x}, ${bot.position.y}, ${bot.position.z}` : '-' }}</dd>
              <dt>{{ t('minecraft.held') }}</dt><dd>{{ itemLabel(bot.held) || t('minecraft.emptySlot') }}</dd>
            </dl>
          </div>

          <div class="card">
            <h2>{{ t('minecraft.status') }}</h2>
            <div class="bar-row"><span class="bar-label">{{ t('minecraft.health') }}</span><div class="bar"><i class="hp" :style="{ transform: `scaleX(${pct(bot.health) / 100})` }" /></div><span class="bar-num">{{ bot.health ?? '-' }}/20</span></div>
            <div class="bar-row"><span class="bar-label">{{ t('minecraft.food') }}</span><div class="bar"><i class="food" :style="{ transform: `scaleX(${pct(bot.food) / 100})` }" /></div><span class="bar-num">{{ bot.food ?? '-' }}/20</span></div>
            <p v-if="bot.error" class="err small">{{ bot.error }}</p>
          </div>

          <div class="card">
            <h2>{{ t('minecraft.players') }} <span class="muted">{{ (bot.players || []).length }}</span></h2>
            <ul class="list">
              <TransitionGroup name="list">
                <li v-for="p in bot.players || []" :key="p.name">
                  <b>{{ p.name }}</b>
                  <span class="muted">{{ p.position ? `${Math.round(p.position.x)}, ${Math.round(p.position.y)}, ${Math.round(p.position.z)}` : '' }}</span>
                  <span v-if="p.ping != null" class="chip muted">{{ p.ping }}ms</span>
                </li>
              </TransitionGroup>
              <li v-if="!(bot.players || []).length" class="muted">{{ t('minecraft.noPlayers') }}</li>
            </ul>
          </div>
        </section>

        <section class="card">
          <h2>{{ t('minecraft.waypoints') }} <span class="muted">{{ (world.waypoints || []).length }}</span></h2>
          <ul class="list">
            <TransitionGroup name="list">
              <li v-for="w in world.waypoints || []" :key="w.id">
                <b>{{ w.name }}</b>
                <span class="muted">{{ Math.round(w.x) }}, {{ Math.round(w.y) }}, {{ Math.round(w.z) }} · {{ w.type }}</span>
                <button class="btn sm tonic" :disabled="actBusy('waypoint_goto', { name: w.name })" @click="act('waypoint_goto', { name: w.name })">
                  <span v-if="actBusy('waypoint_goto', { name: w.name })" class="spinner" aria-hidden="true" />
                  {{ actBusy('waypoint_goto', { name: w.name }) ? t('minecraft.acting') : t('minecraft.goto') }}
                </button>
              </li>
            </TransitionGroup>
            <li v-if="!(world.waypoints || []).length" class="muted">{{ t('minecraft.noWaypoints') }}</li>
          </ul>
        </section>

        <section class="card">
          <h2>{{ t('minecraft.skills') }} <span class="muted">{{ (world.skills || []).length }}</span></h2>
          <ul class="list">
            <TransitionGroup name="list">
              <li v-for="s in world.skills || []" :key="s.id">
                <b>{{ s.name }}</b>
                <span class="muted">{{ t('minecraft.skillRuns', { steps: (s.steps || []).length, runs: s.runs || 0 }) }}</span>
                <button class="btn sm tonic" :disabled="actBusy('skill_run', { name: s.name })" @click="act('skill_run', { name: s.name })">
                  <span v-if="actBusy('skill_run', { name: s.name })" class="spinner" aria-hidden="true" />
                  {{ actBusy('skill_run', { name: s.name }) ? t('minecraft.acting') : t('minecraft.run') }}
                </button>
              </li>
            </TransitionGroup>
            <li v-if="!(world.skills || []).length" class="muted">{{ t('minecraft.noSkills') }}</li>
          </ul>
        </section>

        <section class="card">
          <h2>{{ t('minecraft.inventory') }} <span class="muted">{{ t('minecraft.hotbar') }}</span></h2>
          <div class="inv-wrap">
            <div class="inv hotbar">
              <div v-for="s in hotbar" :key="s.slot" class="cell" :class="{ flash: flashSlots[s.slot] }" :title="s.item ? `${itemLabel(s.item.name)} x${s.item.count}` : t('minecraft.emptySlot')">
                <span v-if="s.item" class="it">{{ itemLabel(s.item.name) }}<b v-if="s.item.count > 1">×{{ s.item.count }}</b></span>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>{{ t('minecraft.backpack') }}</h2>
          <div class="inv-wrap">
            <div class="inv">
              <div v-for="s in backpack" :key="s.slot" class="cell" :class="{ flash: flashSlots[s.slot] }" :title="s.item ? `${itemLabel(s.item.name)} x${s.item.count}` : t('minecraft.emptySlot')">
                <span v-if="s.item" class="it">{{ itemLabel(s.item.name) }}<b v-if="s.item.count > 1">×{{ s.item.count }}</b></span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Transition>

    <p v-if="!bot && loading" class="muted pad">{{ t('minecraft.loading') }}</p>
    <p v-else-if="!bot && !connError" class="muted pad">{{ t('minecraft.notConnectedHint') }}</p>
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
#app .mc .dot{
  width:9px;height:9px;border-radius:50%;background:var(--md-outline);flex-shrink:0;
  transition:background-color var(--duration-short,180ms) ease,box-shadow var(--duration-short,180ms) ease;
}
#app .mc .dot.on{background:var(--md-success);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-success) 22%,transparent);animation:mc-breath 2s ease-in-out infinite}
#app .mc .dot.err{background:var(--md-error);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-error) 20%,transparent)}
@keyframes mc-breath{
  0%,100%{box-shadow:0 0 0 4px color-mix(in srgb,var(--md-success) 22%,transparent)}
  50%{box-shadow:0 0 0 8px color-mix(in srgb,var(--md-success) 8%,transparent)}
}
#app .mc .tag{
  font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;
  background:var(--md-success-container);color:var(--md-on-success-container);
}
#app .mc .mc-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}

/* Success toast (auto-dismisses after 3s) */
#app .mc .toast{
  margin:0 0 14px;padding:11px 16px;border-radius:16px;font-size:13px;font-weight:700;
  background:var(--md-success-container);color:var(--md-on-success-container);box-shadow:var(--shadow-1);
}
#app .mc .toast-enter-active,#app .mc .toast-leave-active{transition:opacity var(--duration-short,180ms) ease,transform var(--duration-short,180ms) var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}
#app .mc .toast-enter-from,#app .mc .toast-leave-to{opacity:0;transform:translateY(-6px)}

/* Buttons */
#app .mc .btn{
  min-height:44px;padding:0 16px;border:1px solid transparent;border-radius:999px;
  font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;
  color:var(--md-on-surface);background:var(--md-surface-container-high);
  transition:transform 240ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 180ms,box-shadow 200ms,border-radius 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1));
}
#app .mc .btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){
  #app .mc .btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}
}
#app .mc .btn.sm{min-height:44px;padding:0 13px;font-size:13px}
#app .mc .btn.filled{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
#app .mc .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .mc .btn.danger{background:var(--md-error-container);color:var(--md-on-error-container)}
#app .mc .btn.danger.armed{background:var(--md-error);color:var(--md-on-error)}

/* Inline action spinner */
#app .mc .spinner{
  width:14px;height:14px;flex-shrink:0;border-radius:50%;
  border:2px solid color-mix(in srgb,currentColor 30%,transparent);border-top-color:currentColor;
  animation:mc-spin 700ms linear infinite;
}
@keyframes mc-spin{to{transform:rotate(360deg)}}

/* Inputs. `.url` used to be grouped in here and given `width:238px`, but no
   element in the template ever carries that class (the connect form uses
   `.connect input/select`), so the rules were dead and are removed. */
#app .mc .connect input,
#app .mc .connect select{
  height:44px;padding:0 14px;border:1px solid transparent;border-radius:14px;
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;
  transition:background-color 180ms,border-color 180ms,box-shadow 200ms;
}
#app .mc .connect input:focus-visible,#app .mc .connect select:focus-visible{
  border-color:var(--md-primary);background:var(--md-surface-container-lowest);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);
}

/* Cards */
#app .mc .card{
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
  border-radius:24px;padding:18px 20px;margin-bottom:16px;box-shadow:var(--shadow-1);
  transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms;
}
@media (hover: hover) and (pointer: fine){
  #app .mc .card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}
}
#app .mc .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:0}
#app .mc .grid .card{margin-bottom:16px}
#app .mc .connect-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}
#app .mc .connect-grid label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}
#app .mc .connect-grid label.wide{grid-column:1/-1}
#app .mc .connect .actions{display:flex;justify-content:flex-end;margin-top:14px}

/* Connect form fold: grid-rows 0fr→1fr expansion (200ms height + fade) */
#app .mc .fold{
  display:grid;grid-template-rows:1fr;margin-bottom:16px;
  transition:grid-template-rows 200ms ease,opacity 200ms ease;
}
#app .mc .fold > .card{min-height:0;overflow:hidden;margin-bottom:0}
#app .mc .fold-enter-from,#app .mc .fold-leave-to{grid-template-rows:0fr;opacity:0}
#app .mc .fold-enter-active,#app .mc .fold-leave-active{transition:grid-template-rows 200ms ease,opacity 200ms ease}

/* Dashboard entrance: fade via <Transition>, staggered card rise inside */
#app .mc .dash-leave-active{transition:opacity var(--duration-short,180ms) ease}
#app .mc .dash-leave-to{opacity:0}
#app .mc .dash > section{animation:mc-rise 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)) both}
#app .mc .dash > section:nth-child(2){animation-delay:40ms}
#app .mc .dash > section:nth-child(3){animation-delay:80ms}
#app .mc .dash > section:nth-child(4){animation-delay:120ms}
#app .mc .dash > section:nth-child(5){animation-delay:160ms}
#app .mc .grid .card{animation:mc-rise 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)) both}
#app .mc .grid .card:nth-child(2){animation-delay:40ms}
#app .mc .grid .card:nth-child(3){animation-delay:80ms}
@keyframes mc-rise{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}

/* Definition lists */
#app .mc dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0;font-size:13px}
#app .mc dt{color:var(--md-on-surface-variant)}
#app .mc dd{margin:0;overflow-wrap:anywhere}

/* Bars */
#app .mc .bar-row{display:flex;align-items:center;gap:12px;margin:10px 0;font-size:13px}
#app .mc .bar-label{min-width:36px;white-space:nowrap;color:var(--md-on-surface-variant);flex-shrink:0}
#app .mc .bar{flex:1;height:12px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
#app .mc .bar i{display:block;width:100%;height:100%;border-radius:999px;transform-origin:left;transform:scaleX(0);transition:transform var(--duration-long,360ms) var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}
#app .mc .bar i.hp{background:linear-gradient(90deg,var(--md-error),color-mix(in srgb,var(--md-error) 55%,var(--md-surface-container-lowest)))}
#app .mc .bar i.food{background:linear-gradient(90deg,var(--md-warning),color-mix(in srgb,var(--md-warning) 55%,var(--md-surface-container-lowest)))}
#app .mc .bar-num{width:54px;text-align:right;color:var(--md-on-surface-variant);flex-shrink:0}

/* Lists */
#app .mc .list{list-style:none;margin:0;padding:0;font-size:13px;display:flex;flex-direction:column;gap:2px;position:relative}
#app .mc .list li{display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}
#app .mc .list li:last-child{border-bottom:none}
#app .mc .list li .btn{margin-left:auto}
#app .mc .list li span.muted,#app .mc .list li .chip{margin-left:auto}
#app .mc .list li b + span.muted{flex:1;min-width:0}
/* TransitionGroup: entering/leaving rows fade+slide, siblings glide via .list-move */
#app .mc .list-move,#app .mc .list-enter-active,#app .mc .list-leave-active{transition:opacity 200ms ease,transform 260ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}
#app .mc .list-enter-from,#app .mc .list-leave-to{opacity:0;transform:translateY(-4px)}
#app .mc .list-leave-active{position:absolute;width:auto;min-width:60%}

/* Chips */
#app .mc .chip{
  display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:700;
  background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;
}
#app .mc .chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:600}
#app .mc .muted{color:var(--md-on-surface-variant)}
#app .mc .err{color:var(--md-error);font-size:13px;background:var(--md-error-container);padding:11px 16px;border-radius:16px;margin-bottom:14px}
#app .mc .err.action-err{border-left:4px solid var(--md-error);border-radius:10px 16px 16px 10px}
#app .mc .err.small{font-size:12px;margin:8px 0 0;background:transparent;padding:0}
#app .mc .pad{padding:8px 0}

/* Action log */
#app .mc .log-card .log-empty{font-size:13px;margin:0}
#app .mc .log{
  list-style:none;margin:0;padding:0;max-height:220px;overflow-y:auto;font-size:12.5px;
  display:flex;flex-direction:column;gap:2px;
}
#app .mc .log li{display:flex;gap:10px;align-items:baseline;padding:5px 0 5px 12px;border-left:3px solid transparent}
#app .mc .log li.ok{border-left-color:var(--md-success)}
#app .mc .log li.fail{border-left-color:var(--md-error)}
#app .mc .log .log-time{color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;flex-shrink:0}
#app .mc .log .log-action{font-family:ui-monospace,monospace;font-size:12px;font-weight:700;flex-shrink:0}
#app .mc .log .log-detail{color:var(--md-on-surface-variant);overflow-wrap:anywhere;min-width:0}
#app .mc .log li.fail .log-detail{color:var(--md-error)}

/* Inventory */
#app .mc .inv-wrap{overflow-x:auto}
#app .mc .inv{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}
#app .mc .inv.hotbar{margin-bottom:10px}
#app .mc .cell{
  aspect-ratio:1;border-radius:14px;background:var(--md-surface-container-high);
  border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);
  display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden;
  transition:transform 200ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 180ms;
}
@media (hover: hover) and (pointer: fine){
  #app .mc .cell:hover{background:var(--md-surface-container-highest)}
}
#app .mc .cell .it{font-size:11px;line-height:1.1;text-align:center;word-break:break-word}
#app .mc .cell .it b{display:block;font-size:11px;color:var(--md-primary);font-weight:800}
/* One-shot highlight when a slot's contents changed since the last poll */
#app .mc .cell.flash{animation:mc-cell-flash 600ms ease-out}
@keyframes mc-cell-flash{
  0%{outline:2px solid var(--md-primary);outline-offset:1px;background:color-mix(in srgb,var(--md-primary) 22%,var(--md-surface-container-high))}
  100%{outline:2px solid transparent;outline-offset:1px;background:var(--md-surface-container-high)}
}

@media(max-width:640px){
  #app .mc .mc-actions{width:100%}
  /* Keep the 9-column slot mapping on mobile: shrink cells (~30px min) and let
     the wrapper scroll horizontally rather than reflowing the grid. */
  #app .mc .inv{grid-template-columns:repeat(9,minmax(30px,1fr));min-width:min(100%,306px)}
  #app .mc .cell{border-radius:10px;padding:2px}
  #app .mc .cell .it{font-size:9px}
  #app .mc .cell .it b{font-size:9px}
}

@media (prefers-reduced-motion: reduce){
  #app .mc *, #app .mc *::before, #app .mc *::after{
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
    scroll-behavior:auto !important;
  }
  #app .mc .btn:hover:not(:disabled),
  #app .mc .card:hover{transform:none}
  #app .mc .dot.on{animation:none}
}
</style>
