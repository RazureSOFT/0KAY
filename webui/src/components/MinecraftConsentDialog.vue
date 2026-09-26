<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type Pending = { id: string; action?: string; detail?: string; created_at?: string }

const pending = ref<Pending | null>(null)
const busy = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function base() {
  return (localStorage.getItem('0kay_minecraft_url') || 'http://127.0.0.1:8765').replace(/\/+$/, '')
}

async function poll() {
  try {
    const res = await fetch(`${base()}/status`, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) { pending.value = null; return }
    const data = await res.json()
    pending.value = data?.consent?.pending || null
  } catch {
    pending.value = null // service offline / not configured
  }
}

async function reply(approve: boolean) {
  if (!pending.value || busy.value) return
  busy.value = true
  try {
    await fetch(`${base()}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'consent_reply', args: { id: pending.value.id, approve } }),
    })
  } catch { /* best effort; the service will time out */ }
  pending.value = null
  busy.value = false
  void poll()
}

onMounted(() => {
  void poll()
  timer = setInterval(poll, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="pending" class="mc-consent-scrim">
      <section class="mc-consent-dialog" role="alertdialog" aria-modal="true" aria-labelledby="mc-consent-title">
        <div class="mc-consent-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 4l9 16H3L12 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M12 10v4M12 17.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="mc-consent-body">
          <h2 id="mc-consent-title">{{ t('minecraftConsent.title') }}</h2>
          <p>{{ pending.detail || pending.action }}</p>
        </div>
        <footer>
          <button type="button" :disabled="busy" @click="reply(false)">{{ t('minecraftConsent.deny') }}</button>
          <button type="button" class="primary" :disabled="busy" @click="reply(true)">{{ t('minecraftConsent.approve') }}</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.mc-consent-scrim {
  position: fixed; inset: 0; z-index: 13100;
  background: #21173566; backdrop-filter: blur(6px);
  display: grid; place-items: center; padding: 20px;
}
.mc-consent-dialog {
  width: min(440px, 100%);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  border: 1px solid var(--md-outline-variant);
  border-radius: 28px; padding: 24px;
  display: grid; grid-template-columns: auto 1fr; gap: 16px;
  box-shadow: 0 24px 70px #18132d33;
}
.mc-consent-icon {
  width: 46px; height: 46px; border-radius: 16px; display: grid; place-items: center;
  background: var(--md-error-container); color: #410e0b;
}
.mc-consent-body h2 { margin: 0 0 6px; font-size: 19px; font-weight: 700; }
.mc-consent-body p { margin: 0; font-size: 14px; line-height: 1.6; color: var(--md-on-surface-variant); overflow-wrap: anywhere; }
.mc-consent-dialog footer { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 12px; margin-top: 6px; }
.mc-consent-dialog footer button {
  border: 0; border-radius: 999px; padding: 12px 22px; font: inherit; font-weight: 600; cursor: pointer;
  background: var(--md-secondary-container); color: var(--md-on-secondary-container);
}
.mc-consent-dialog footer button.primary { background: var(--md-primary); color: var(--md-on-primary); }
.mc-consent-dialog footer button:disabled { opacity: .6; cursor: default; }
</style>
