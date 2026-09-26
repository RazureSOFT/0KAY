<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type Approval = { id: string; tool: string; detail: string; created_at: string }

const items = ref<Approval[]>([])
const busy = ref(false)
let timer: number | undefined

function toolLabel(tool: string) {
  if (tool === 'getmail') return '读取收件箱邮件'
  if (tool === 'sendmail') return '发送邮件'
  return tool
}

async function poll() {
  if (document.hidden) return
  try {
    const res = await fetch('/api/life/companion', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approval_list', payload: {} }),
    })
    if (!res.ok) return
    const body = await res.json().catch(() => ({}))
    items.value = Array.isArray(body.approvals) ? body.approvals : []
  } catch { /* keep pending on transient errors */ }
}

async function decide(item: Approval, allow: boolean) {
  busy.value = true
  try {
    await fetch('/api/life/companion', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approval_resolve', payload: { id: item.id, allow } }),
    })
    items.value = items.value.filter((a) => a.id !== item.id)
  } catch { /* ignore */ } finally { busy.value = false }
}

onMounted(() => { poll(); timer = window.setInterval(poll, 2500) })
onUnmounted(() => { if (timer) window.clearInterval(timer) })
</script>

<template>
  <Teleport to="body">
    <div v-if="items.length" class="la-scrim" role="presentation">
      <section class="la-dialog" role="alertdialog" aria-modal="true" aria-labelledby="la-title">
        <span class="la-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.9"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <h2 id="la-title">L.I.F.E 邮件权限确认</h2>
        <p class="la-desc">L.I.F.E 想要执行邮件操作，是否允许这一次？</p>
        <div class="la-tool">{{ toolLabel(items[0].tool) }}</div>
        <pre v-if="items[0].detail" class="la-detail">{{ items[0].detail }}</pre>
        <p v-if="items.length > 1" class="la-more">还有 {{ items.length - 1 }} 个待确认请求…</p>
        <footer>
          <button class="la-btn la-deny" type="button" :disabled="busy" @click="decide(items[0], false)">拒绝</button>
          <button class="la-btn la-allow" type="button" :disabled="busy" @click="decide(items[0], true)">允许</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.la-scrim {
  position: fixed; inset: 0; z-index: 12000;
  background: #21173566; backdrop-filter: blur(6px);
  display: grid; place-items: center; padding: 20px;
  animation: la-fade 180ms ease-out;
}
.la-dialog {
  width: min(460px, 100%);
  background: var(--md-surface-container-low); color: var(--md-on-surface);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  border-radius: 32px; padding: 28px; box-shadow: var(--shadow-4, 0 24px 70px #18132d33);
  display: flex; flex-direction: column; gap: 14px;
  animation: la-pop 380ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
}
.la-icon {
  width: 56px; height: 56px; border-radius: 22px 22px 22px 8px;
  display: grid; place-items: center;
  background: var(--md-primary-container); color: var(--md-on-primary-container);
}
.la-dialog h2 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -.01em; }
.la-desc { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--md-on-surface-variant); }
.la-tool {
  align-self: flex-start; padding: 8px 16px; border-radius: 999px;
  background: var(--md-secondary-container); color: var(--md-on-secondary-container);
  font-size: 13.5px; font-weight: 750;
}
.la-detail {
  margin: 0; max-height: 180px; overflow: auto; padding: 12px 14px; border-radius: 16px;
  background: var(--md-surface-container); color: var(--md-on-surface-variant);
  font: 12px/1.6 ui-monospace, monospace; white-space: pre-wrap; overflow-wrap: anywhere;
}
.la-more { margin: 0; font-size: 12px; color: var(--md-on-surface-variant); }
.la-dialog footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
.la-btn {
  height: 46px; padding: 0 26px; border: 0; border-radius: 999px; cursor: pointer;
  font: 700 14px/1 inherit;
  transition: transform 220ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)), box-shadow 200ms;
}
.la-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow-1); }
.la-btn:disabled { opacity: .55; cursor: not-allowed; }
.la-deny { background: var(--md-surface-container-high); color: var(--md-on-surface); }
.la-allow { background: var(--md-primary); color: var(--md-on-primary); box-shadow: 0 8px 20px color-mix(in srgb, var(--md-primary) 30%, transparent); }
@keyframes la-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes la-pop { from { opacity: 0; transform: translateY(18px) scale(.94); } to { opacity: 1; transform: none; } }
</style>
