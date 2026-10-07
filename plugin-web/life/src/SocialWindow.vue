<script setup lang="ts">
/**
 * L.I.F.E 「社交账号」 on the chat page — an agent-style right dock with two
 * floating panels (conversation list + chat), plus the auto "L.I.F.E replied"
 * dialog. Shipped entirely with the plugin (`social.js` bootstrap module).
 *
 * The dock only shows on the 对话 page (`/`); the panels are draggable and
 * resizable like the Agent page's tool panels. Data is the adapter transcript
 * (`chat_conversations` / `chat_messages` / `chat_send`).
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { i18n } from '@0kay/host'
import { FLASH_MS } from './kit'

const t = (key: string, named?: Record<string, unknown>) => i18n.global.t(key, named ?? {})

interface Msg { id: string; conversation: string; kind: string; peer_id: string; peer_name: string; direction: string; text: string; media: string[]; at: string }
interface Conv { conversation: string; kind: string; peer_id: string; name: string; adapter_id: string; last_text: string; last_direction: string; last_at: string }

// --- shared state ----------------------------------------------------------
const conversations = ref<Conv[]>([])
const active = ref('')
const messages = ref<Msg[]>([])
const draft = ref('')
const sending = ref(false)
const scroller = ref<HTMLElement | null>(null)

// --- floating panels (drag + resize, agent style) --------------------------
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
/** Panel bounds must be re-fit to the viewport on load: a panel sized on a wide
 *  screen otherwise extends off-screen after the window narrows, and the title
 *  bar — the only drag handle — ends up outside the visible area. */
function fitPanel(p: { x: number; y: number; w: number; h: number }) {
  const vw = window.innerWidth || 1280
  const vh = window.innerHeight || 800
  const w = clamp(p.w, 280, Math.max(280, vw - 16))
  const h = clamp(p.h, 220, Math.max(220, vh - 16))
  return { w, h, x: clamp(p.x, 0, Math.max(0, vw - 90)), y: clamp(p.y, 0, Math.max(0, vh - 40)) }
}
function loadFloat(key: string, dp: { x: number; y: number }, ds: { w: number; h: number }) {
  try { const p = JSON.parse(localStorage.getItem(key) || 'null'); if (p && typeof p.x === 'number') return fitPanel({ ...ds, ...p }) } catch { /* ignore */ }
  const vw = window.innerWidth || 1280
  const vh = window.innerHeight || 800
  return { x: Math.max(16, vw - ds.w - dp.x), y: dp.y, w: Math.min(ds.w, vw - 16), h: Math.min(ds.h, vh - 16) }
}
function useFloating(key: string, dp: { x: number; y: number }, ds: { w: number; h: number }) {
  const s = ref(loadFloat(key, dp, ds))
  const style = computed(() => ({ translate: `${s.value.x}px ${s.value.y}px`, width: `${s.value.w}px`, height: `${s.value.h}px` }))
  const save = () => { try { localStorage.setItem(key, JSON.stringify(s.value)) } catch { /* ignore */ } }
  function startDrag(e: PointerEvent) {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    const sx = e.clientX, sy = e.clientY, ox = s.value.x, oy = s.value.y
    const move = (ev: PointerEvent) => { s.value = { ...s.value, x: Math.max(0, Math.min(window.innerWidth - 90, ox + ev.clientX - sx)), y: Math.max(0, Math.min(window.innerHeight - 40, oy + ev.clientY - sy)) } }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); save() }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  function startResize(e: PointerEvent) {
    e.stopPropagation()
    const sx = e.clientX, sy = e.clientY, ow = s.value.w, oh = s.value.h
    const move = (ev: PointerEvent) => { s.value = { ...s.value, w: Math.min(Math.max(280, ow + ev.clientX - sx), Math.max(280, window.innerWidth - 16)), h: Math.min(Math.max(220, oh + ev.clientY - sy), Math.max(220, window.innerHeight - 16)) } }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); save() }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  // Re-fit when the window narrows, so a wide-screen size cannot strand a panel.
  onMounted(() => { const refit = () => { s.value = fitPanel(s.value); save() }; window.addEventListener('resize', refit); onUnmounted(() => window.removeEventListener('resize', refit)) })
  return { s, style, startDrag, startResize }
}

const listOpen = ref(false)
const chatOpen = ref(false)
// Destructure: a nested `list.style` ref would NOT auto-unwrap in the template
// (only top-level setup bindings do), which left the panels stuck at 0,0 and
// made dragging update state without ever moving the window.
const { style: listStyle, startDrag: dragList, startResize: resizeList } =
  useFloating('0kay.life.social.list', { x: 12, y: 64 }, { w: 340, h: 460 })
const { style: chatStyle, startDrag: dragChat, startResize: resizeChat } =
  useFloating('0kay.life.social.chat', { x: 344, y: 64 }, { w: 380, h: 520 })

// --- only on the 对话 page -------------------------------------------------
const onChatPage = ref(location.pathname === '/')
function syncRoute() { onChatPage.value = location.pathname === '/' }
;(function hookHistory() {
  const push = history.pushState, replace = history.replaceState
  history.pushState = function (...a: any[]) { const r = push.apply(history, a as any); window.dispatchEvent(new Event('0kay:location')); return r }
  history.replaceState = function (...a: any[]) { const r = replace.apply(history, a as any); window.dispatchEvent(new Event('0kay:location')); return r }
})()

// --- auto dialog (agent inbox style) ---------------------------------------
const popup = ref(false)
const collapsed = ref(false)
const count = ref(0)
const popupConv = ref('')
const seen: Record<string, string> = {}
let primed = false
let timer: ReturnType<typeof setInterval> | undefined

async function api(action: string, payload: Record<string, unknown> = {}) {
  const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}

async function poll() {
  try {
    const res = await api('chat_conversations', { limit: 100 })
    const list: Conv[] = res.conversations || []
    conversations.value = list
    let newest = ''
    for (const c of list) {
      const prev = seen[c.conversation]
      if (primed && c.last_direction === 'out' && prev !== undefined && c.last_at !== prev) { if (!newest || c.last_at > newest) { newest = c.last_at; popupConv.value = c.conversation } }
    }
    if (primed && newest) { popup.value = true; collapsed.value = false; count.value += 1 }
    for (const c of list) seen[c.conversation] = c.last_at
    primed = true
  } catch { /* offline */ }
}

async function loadMessages() {
  if (!active.value) { messages.value = []; return }
  try {
    const res = await api('chat_messages', { conversation: active.value, limit: 200 })
    const next: Msg[] = res.messages || []
    const grew = next.length !== messages.value.length
    // Follow new messages only when the reader is already at the bottom (or the
    // conversation was just opened); a forced jump would yank someone reading
    // history back up out of their scroll position.
    const fresh = messages.value.length === 0
    const follow = fresh || nearBottom()
    messages.value = next
    if (grew && follow) scrollEnd()
  } catch { /* keep */ }
}
function nearBottom(): boolean {
  const el = scroller.value
  if (!el) return true
  return el.scrollHeight - el.scrollTop - el.clientHeight < 80
}
function scrollEnd() { nextTick(() => { const el = scroller.value; if (el) el.scrollTop = el.scrollHeight }) }

function title(c: Conv | undefined): string { return c ? (c.name || (c.kind === 'group' ? t('life.chat.groupPrefix', { id: c.peer_id }) : c.peer_id)) : '' }
function avatarUrl(c: Conv | undefined): string {
  if (!c || !c.peer_id || c.conversation.startsWith('bili')) return ''
  return c.kind === 'group' ? `https://p.qlogo.cn/gh/${c.peer_id}/${c.peer_id}/100` : `https://q1.qlogo.cn/g?b=qq&nk=${c.peer_id}&s=100`
}
function timeOf(iso: string): string { const d = new Date(iso); return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
function mediaLabel(kind: string): string { const m: Record<string, string> = { image: t('life.chat.image'), record: t('life.chat.voice'), video: t('life.chat.video'), face: t('life.chat.face') }; return m[kind] || t('life.chat.media') }
const activeConv = computed(() => conversations.value.find((c) => c.conversation === active.value) || null)

function pick(conv: string) { active.value = conv; messages.value = []; sendError.value = ''; void loadMessages(); chatOpen.value = true }
// Send failures surface here as a red strip above the composer (auto-cleared);
// the draft is kept so nothing the user typed is lost.
const sendError = ref('')
async function send() {
  const text = draft.value.trim()
  if (!text || sending.value || !active.value) return
  sending.value = true
  try {
    const adapter = activeConv.value?.adapter_id || ''
    const res = await api('chat_send', { conversation: active.value, text, adapter_id: adapter })
    if (res && res.ok === false) throw new Error(res.error || t('life.chat.sendFailed'))
    draft.value = ''; sendError.value = ''; await loadMessages()
  } catch (e: any) {
    const message = String(e?.message || '').trim() || t('life.chat.sendFailed')
    sendError.value = message
    setTimeout(() => { if (sendError.value === message) sendError.value = '' }, FLASH_MS)
    /* keep draft */ } finally { sending.value = false }
}
function openPopup() { popup.value = false; count.value = 0; pick(popupConv.value) }

// --- auto dialog: focus + Esc ----------------------------------------------
const dialogEl = ref<HTMLElement | null>(null)
const dialogOpen = computed(() => popup.value && !collapsed.value)
watch(dialogOpen, (open) => {
  if (!open) return
  // Move focus into the dialog so keyboard and screen-reader users land in it.
  nextTick(() => dialogEl.value?.focus())
})

onMounted(() => {
  void poll()
  timer = setInterval(() => { void poll(); if (chatOpen.value) void loadMessages() }, 2500)
  window.addEventListener('0kay:location', syncRoute)
  window.addEventListener('popstate', syncRoute)
  syncRoute()
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('0kay:location', syncRoute)
  window.removeEventListener('popstate', syncRoute)
})
</script>

<template>
  <!-- Right dock, only on the 对话 page -->
  <aside v-if="onChatPage" class="dock" :aria-label="t('life.chat.dockAria')">
    <button type="button" class="dock-btn" :class="{ active: listOpen }" :title="t('life.chat.tab')" @click="listOpen = !listOpen">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
    </button>
    <button type="button" class="dock-btn" :class="{ active: chatOpen }" :title="t('life.chat.title')" @click="chatOpen = !chatOpen">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16v11H8l-4 3V5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
    </button>
  </aside>

  <!-- Conversation list panel (same lsw-fade transition as the auto dialog) -->
  <Transition name="lsw-fade">
    <section v-if="listOpen" class="panel" :style="listStyle" :aria-label="t('life.chat.listAria')">
      <div class="toolbar" @pointerdown="dragList">
        <span class="grab" aria-hidden="true">⠿</span>
        <strong>{{ t('life.chat.tab') }}</strong>
        <span class="count">{{ conversations.length }}</span>
        <button type="button" :title="t('life.chat.collapse')" @click="listOpen = false">✕</button>
      </div>
      <div class="list-body">
        <p v-if="!conversations.length" class="muted pad">{{ t('life.chat.noConversations') }}</p>
        <button v-for="c in conversations" :key="c.conversation" class="row" :class="{ selected: c.conversation === active }" @click="pick(c.conversation)">
          <span class="avatar" :class="c.kind">
            <img v-if="avatarUrl(c)" :src="avatarUrl(c)" :alt="title(c)" loading="lazy" @error="($event.target as HTMLImageElement).style.display='none'" />
            <span class="fb">{{ c.kind === 'group' ? t('life.chat.groupInitial') : (title(c).slice(0, 1) || '?') }}</span>
          </span>
          <span class="row-main">
            <span class="row-top"><strong>{{ title(c) }}</strong><small>{{ timeOf(c.last_at) }}</small></span>
            <span class="row-sub"><span v-if="c.last_direction === 'out'" class="me">{{ t('life.chat.me') }}:</span> {{ c.last_text || t('life.chat.mediaOnly') }}</span>
          </span>
        </button>
      </div>
      <div class="resize" @pointerdown="resizeList" />
    </section>
  </Transition>

  <!-- Chat panel -->
  <Transition name="lsw-fade">
    <section v-if="chatOpen" class="panel" :style="chatStyle" :aria-label="t('life.chat.chatAria')">
    <div class="toolbar" @pointerdown="dragChat">
      <span class="grab" aria-hidden="true">⠿</span>
      <span class="avatar sm" :class="activeConv?.kind">
        <img v-if="avatarUrl(activeConv)" :src="avatarUrl(activeConv)" :alt="title(activeConv)" @error="($event.target as HTMLImageElement).style.display='none'" />
        <span class="fb">{{ activeConv ? (activeConv.kind === 'group' ? t('life.chat.groupInitial') : title(activeConv).slice(0, 1)) : '?' }}</span>
      </span>
      <strong>{{ title(activeConv) || t('life.chat.pickConversation') }}</strong>
      <button type="button" :title="t('life.chat.collapse')" @click="chatOpen = false">✕</button>
    </div>
    <div ref="scroller" class="thread">
      <p v-if="!active" class="muted pad">{{ t('life.chat.pickConversation') }}</p>
      <p v-else-if="!messages.length" class="muted pad">{{ t('life.chat.noMessages') }}</p>
      <div v-for="m in messages" :key="m.id" class="msg" :class="m.direction">
        <div class="bubble">
          <span v-if="m.direction === 'in' && m.peer_name" class="sender">{{ m.peer_name }}</span>
          <span v-if="m.text" class="text">{{ m.text }}</span>
          <span v-for="md in m.media" :key="md" class="chip">{{ mediaLabel(md) }}</span>
          <span class="time">{{ timeOf(m.at) }}</span>
        </div>
      </div>
    </div>
    <footer v-if="active" class="composer">
      <p v-if="sendError" class="send-error" role="alert">{{ sendError }}</p>
      <textarea v-model="draft" rows="1" :placeholder="t('life.chat.placeholder')" @keydown.enter.exact.prevent="send" />
      <button :disabled="sending || !draft.trim()" @click="send">{{ sending ? t('life.chat.sending') : t('life.chat.send') }}</button>
    </footer>
    <div class="resize" @pointerdown="resizeChat" />
    </section>
  </Transition>

  <!-- Auto dialog, styled like the agent inbox -->
  <Transition name="lsw-fade">
    <div v-if="popup && !collapsed" class="lsw-scrim" @click.self="collapsed = true" @keydown.esc="collapsed = true">
      <section ref="dialogEl" class="lsw-dialog" role="dialog" aria-modal="true" tabindex="-1" :aria-label="t('life.chat.replied')">
        <header>
          <div><span class="lsw-eyebrow">L.I.F.E · SOCIAL</span><h2>{{ t('life.chat.replied') }}</h2></div>
          <button @click="collapsed = true">{{ t('life.chat.later') }}</button>
        </header>
        <p class="lsw-meta">{{ title(conversations.find((c) => c.conversation === popupConv)) }}</p>
        <p class="lsw-body">{{ conversations.find((c) => c.conversation === popupConv)?.last_text || t('life.chat.mediaOnly') }}</p>
        <footer><button class="lsw-primary" @click="openPopup">{{ t('life.chat.open') }}</button></footer>
      </section>
    </div>
  </Transition>
  <Transition name="lsw-fab">
    <button v-if="popup && collapsed" class="lsw-fab" @click="collapsed = false">
      {{ t('life.chat.replied') }}<span v-if="count > 1" class="lsw-badge">{{ count }}</span>
    </button>
  </Transition>
</template>

<style scoped>
.muted { color: var(--md-on-surface-variant); font-size: 13px; }
.pad { padding: 14px; }

/* Dock + floating panels share the Agent page's tool-window chrome (58px dock
   rail, 42px/14px buttons, container-high toolbar, striped resize grip). The
   dock anchors to the same top-right corner the Agent rail starts at; it stays
   compact because a full-height rail would cover the chat page's own composer
   and footer controls. */
.dock { position: fixed; right: 16px; top: 76px; z-index: var(--z-panel, 3000); display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 10px 8px; border-radius: 28px; background: var(--md-surface-container-low); box-shadow: var(--shadow-1); }
.dock-btn { position: relative; width: 42px; height: 42px; display: grid; place-items: center; border: 0; border-radius: 14px; background: transparent; color: var(--md-on-surface-variant); cursor: pointer; transition: background-color 160ms, color 160ms, transform 160ms var(--ease-emphasized-decel); }
.dock-btn:hover { background: var(--md-secondary-container); color: var(--md-on-surface); transform: translateY(-1px); }
.dock-btn:active { transform: scale(.94); }
.dock-btn.active { background: color-mix(in srgb, var(--md-primary) 18%, transparent); color: var(--md-primary); }
.dock-btn:focus-visible { outline: 2px solid var(--md-primary); outline-offset: 2px; }

.panel { position: fixed; left: 0; top: 0; z-index: var(--z-panel, 3000); display: flex; flex-direction: column; border: 1px solid var(--md-outline-variant); border-radius: 14px; overflow: hidden; background: var(--md-surface-container-low); box-shadow: var(--shadow-4); color: var(--md-on-surface); }
.toolbar { display: flex; align-items: center; gap: 6px; padding: 7px 9px; background: var(--md-surface-container-high); color: var(--md-on-surface); cursor: grab; touch-action: none; user-select: none; flex: 0 0 auto; }
.toolbar:active { cursor: grabbing; }
.toolbar .grab { font-size: 13px; line-height: 1; color: var(--md-on-surface-variant); padding: 0 2px; cursor: grab; }
.toolbar strong { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12.5px; font-weight: 650; }
.toolbar .count { flex: none; min-width: 20px; height: 20px; padding: 0 6px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); font-size: 11.5px; font-weight: 700; }
.toolbar button { width: 28px; height: 28px; padding: 0; display: inline-grid; place-items: center; border: 0; border-radius: 8px; font-size: 13px; line-height: 1; color: var(--md-on-surface-variant); background: transparent; cursor: pointer; flex-shrink: 0; }
/* The host's `#app button{min-height:36px}` is (1,0,1) and would stretch these
   28x28 toolbar buttons to 28x36; this (1,1,2) selector wins the box back. */
#app .toolbar button { min-height: 0; }
.toolbar button:hover { background: var(--md-surface-container-highest); }

/* `min-height: 0` is required, not cosmetic: `.panel` is a fixed-height column
   flex with `overflow: hidden`, and an `auto` min-height lets this list keep its
   full content height, so the panel clipped it instead of scrolling and the
   last conversations were unreachable. The sibling `.thread` below already
   carries it. */
.list-body { flex: 1; min-height: 0; overflow-y: auto; padding: 6px; display: flex; flex-direction: column; gap: 2px; }
.row { display: flex; gap: 10px; align-items: center; width: 100%; text-align: left; border: 0; background: transparent; color: inherit; font: inherit; padding: 8px 9px; border-radius: 12px; cursor: pointer; }
.row:hover { background: var(--md-surface-container-high); }
.row.selected { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.row-main { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px; }
.row-top { display: flex; justify-content: space-between; gap: 8px; }
.row-top strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700; }
.row-top small { font-size: 11px; opacity: .6; flex: 0 0 auto; }
.row-sub { font-size: 12px; opacity: .75; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.me { color: var(--md-primary); font-weight: 700; }
.row.selected .me { color: inherit; opacity: .85; }

.avatar { position: relative; width: 38px; height: 38px; flex: 0 0 38px; border-radius: 50%; overflow: hidden; background: var(--md-primary); color: var(--md-on-primary, #fff); display: flex; align-items: center; justify-content: center; font-weight: 800; }
.avatar.group { border-radius: 12px; }
.avatar.sm { width: 26px; height: 26px; flex-basis: 26px; }
.avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.fb { font-size: 14px; }

.thread { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; min-height: 0; }
/* Bubble language mirrors the agent page's chat (AgentsPage .turn bubbles):
   asymmetric 24/8 radii, out on primary-container, in on a low surface. */
.msg { display: flex; opacity: 1; transform: none; transition: opacity var(--duration-medium) var(--ease-emphasized-decel), transform var(--duration-medium) var(--ease-emphasized-decel); }
@starting-style { .msg { opacity: 0; transform: translateY(4px); } }
.msg.out { justify-content: flex-end; }
.bubble { max-width: 82%; background: var(--md-surface-container-low); border-radius: 8px 24px 24px 24px; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; box-shadow: var(--shadow-1); }
.msg.out .bubble { background: var(--md-primary-container); color: var(--md-on-primary-container); border-radius: 24px 24px 8px 24px; }
.sender { font-size: 11px; font-weight: 700; opacity: .75; }
.text { white-space: pre-wrap; word-break: break-word; font-size: 13px; }
.chip { align-self: flex-start; font-size: 11px; padding: 1px 8px; border-radius: 999px; background: color-mix(in srgb, currentColor 16%, transparent); }
.time { align-self: flex-end; font-size: 10px; opacity: .6; }
.composer { display: flex; gap: 8px; padding: 8px 10px; border-top: 1px solid var(--md-outline-variant); align-items: flex-end; flex: 0 0 auto; flex-wrap: wrap; }
.send-error { flex: 1 0 100%; margin: 0; padding: 6px 10px; border-radius: 8px; background: var(--md-error-container); color: var(--md-on-error-container); font-size: 12px; overflow-wrap: anywhere; }
.composer textarea { flex: 1; resize: none; min-height: 38px; max-height: 110px; padding: 9px 12px; border-radius: 12px; border: 1px solid var(--md-outline-variant); background: var(--md-surface-container-high); color: var(--md-on-surface); font: inherit; outline: none; }
.composer textarea:focus { border-color: var(--md-primary); }
.composer button { height: 38px; padding: 0 16px; border: 0; border-radius: 12px; background: var(--md-primary); color: var(--md-on-primary, #fff); font-weight: 700; cursor: pointer; }
.composer button:disabled { opacity: .5; cursor: not-allowed; }
.resize { position: absolute; right: 1px; bottom: 1px; width: 16px; height: 16px; cursor: nwse-resize; touch-action: none; opacity: .5; background: repeating-linear-gradient(135deg, transparent 0 3px, var(--md-on-surface-variant) 3px 4px); }
.resize:hover { opacity: .85; }

.lsw-scrim { position: fixed; inset: 0; z-index: var(--z-modal, 4000); background: var(--md-scrim, color-mix(in srgb, #18132d 42%, transparent)); backdrop-filter: blur(6px); display: grid; place-items: center; padding: 20px; }
.lsw-dialog { width: min(560px, 100%); max-height: 85vh; overflow: auto; border-radius: 28px; background: var(--md-surface); color: var(--md-on-surface); padding: 28px; box-shadow: 0 24px 70px #18132d33; outline: none; }
.lsw-dialog header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.lsw-eyebrow { font-size: 12px; letter-spacing: 2px; color: var(--md-primary); font-weight: 700; }
.lsw-dialog h2 { font-size: 24px; margin: 8px 0; }
.lsw-meta { font-size: 12px; color: var(--md-on-surface-variant); overflow-wrap: anywhere; margin: 0; }
.lsw-body { margin: 16px 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.lsw-dialog button { border: 0; border-radius: 999px; padding: 12px 20px; font: inherit; cursor: pointer; background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.lsw-dialog .lsw-primary { background: var(--md-primary); color: var(--md-on-primary, #fff); }
.lsw-dialog footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
.lsw-fab { position: fixed; right: 24px; bottom: 24px; z-index: var(--z-toast, 6000); display: inline-flex; align-items: center; gap: 8px; border: 0; border-radius: 999px; padding: 12px 20px; background: var(--md-primary); color: var(--md-on-primary, #fff); font: inherit; font-weight: 700; cursor: pointer; box-shadow: var(--shadow-3); }
.lsw-badge { background: var(--md-error); color: var(--md-on-error, #fff); border-radius: 999px; padding: 0 8px; font-size: 12px; }
/* Same panel transition curve as the Agent page's tool windows. */
.lsw-fade-enter-active { transition: opacity 240ms var(--ease-emphasized-decel), transform 240ms var(--ease-emphasized-decel); }
.lsw-fade-leave-active { transition: opacity 140ms var(--ease-emphasized-accel), transform 140ms var(--ease-emphasized-accel); }
.lsw-fade-enter-from, .lsw-fade-leave-to { opacity: 0; transform: translateY(-6px) scale(.99); }
.lsw-fab-enter-active { transition: opacity 200ms var(--ease-emphasized-decel), transform 200ms var(--ease-emphasized-decel); }
.lsw-fab-leave-active { transition: opacity 140ms var(--ease-emphasized-accel), transform 140ms var(--ease-emphasized-accel); }
.lsw-fab-enter-from, .lsw-fab-leave-to { opacity: 0; transform: translateY(12px) scale(.9); }
@media (prefers-reduced-motion: reduce) { .lsw-fade-enter-active, .lsw-fade-leave-active, .lsw-fab-enter-active, .lsw-fab-leave-active { transition-duration: 1ms; } .msg { transition: none; } }
</style>
