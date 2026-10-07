<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfirm } from '../composables/confirm'

interface PairingRequest {
  id: string
  name: string
  code: string
  expires: string
  approved: boolean
}

const { t } = useI18n()
const { confirm } = useConfirm()

const requests = ref<PairingRequest[]>([])
const devices = ref<Array<{ id: string; name: string }>>([])
const error = ref('')
const revoking = ref('')
let timer: ReturnType<typeof setInterval> | undefined

/**
 * Re-reads both lists. `refresh` runs on a 3s poll, so a failing call must not
 * clear the list it already has — a Core restart would otherwise blank the panel
 * and look like the devices disappeared.
 */
async function refresh() {
  try {
    const response = await fetch('/api/pairing/pending')
    if (!response.ok) throw new Error(await response.text())
    requests.value = (await response.json()).requests || []
  } catch (e: any) {
    error.value = e.message
  }
  try {
    const response = await fetch('/api/pairing/devices')
    if (response.ok) devices.value = (await response.json()).devices || []
    // An older Core may not expose the device list at all; keep what we have.
  } catch {
    /* ignored on purpose */
  }
}

async function decide(request: PairingRequest, allow: boolean) {
  try {
    const response = await fetch('/api/pairing/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...request, allow }),
    })
    if (!response.ok) throw new Error(await response.text())
    await refresh()
  } catch (e: any) {
    error.value = e.message
  }
}

async function disconnect(device: { id: string; name?: string }) {
  if (revoking.value) return
  // Revoking cuts the device's session; confirm before doing it.
  const ok = await confirm({
    title: t('pairing.disconnect'),
    message: t('pairing.disconnectConfirm', { name: device.name || device.id }),
    confirmLabel: t('pairing.disconnect'),
    danger: true,
  })
  if (!ok) return
  revoking.value = device.id
  try {
    const response = await fetch('/api/pairing/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: device.id }),
    })
    if (!response.ok) throw new Error(await response.text())
    await refresh()
  } catch (e: any) {
    error.value = e.message
  } finally {
    revoking.value = ''
  }
}

onMounted(() => {
  void refresh()
  timer = setInterval(refresh, 3000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="pairing-panel">
    <h3>{{ t('pairing.title') }}</h3>
    <p>{{ t('pairing.hint') }}</p>

    <p v-if="error" class="pairing-error" role="alert">{{ error }}</p>
    <p v-if="!requests.length">{{ t('pairing.empty') }}</p>

    <TransitionGroup tag="div" name="pair" class="pairing-list">
      <article v-for="request in requests" :key="request.id">
        <strong>{{ request.name }}</strong>
        <code>{{ request.code }}</code>
        <span v-if="request.approved">{{ t('pairing.approved') }}</span>
        <template v-else>
          <button type="button" class="btn btn-ghost" @click="decide(request, false)">
            {{ t('pairing.deny') }}
          </button>
          <button type="button" class="btn btn-primary" @click="decide(request, true)">
            {{ t('pairing.allow') }}
          </button>
        </template>
      </article>
    </TransitionGroup>

    <template v-if="devices.length">
      <h4>{{ t('pairing.pairedCount', { n: devices.length }) }}</h4>
      <TransitionGroup tag="div" name="pair" class="pairing-list">
        <article v-for="device in devices" :key="device.id">
          <strong>{{ device.name || device.id }}</strong>
          <button
            type="button"
            class="btn btn-danger-tonal"
            :disabled="revoking === device.id"
            @click="disconnect(device)"
          >
            {{ revoking === device.id ? t('pairing.disconnecting') : t('pairing.disconnect') }}
          </button>
        </article>
      </TransitionGroup>
    </template>
  </section>
</template>

<style scoped>
/* Layout only. The buttons take their look from the design-system variants
   (btn / btn-primary / btn-ghost / btn-danger-tonal) instead of local style:
   this panel previously used `class="danger"`, which no stylesheet defines, and
   tried to fake it with `border-color` on a button whose base border is `none`. */
.pairing-panel { margin: 24px 0; padding: 20px; background: var(--md-surface-container-low); border-radius: 12px; }
.pairing-panel p { margin: 12px 0; color: var(--md-on-surface-variant); }
.pairing-panel .pairing-error { color: var(--md-error); }
article { display: flex; align-items: center; gap: 14px; padding: 14px 0; flex-wrap: wrap; }
code { font-size: 24px; letter-spacing: 4px; }
h4 { margin: 18px 0 0; }
.pairing-list { position: relative; }

/* Device/request rows join and leave with a fade instead of popping. */
.pair-enter-active, .pair-leave-active { transition: opacity var(--duration-medium) var(--ease-out), transform var(--duration-medium) var(--ease-out); }
.pair-enter-from, .pair-leave-to { opacity: 0; transform: translateY(4px); }
.pair-leave-active { position: absolute; width: 100%; }
.pair-move { transition: transform var(--duration-medium) var(--ease-out); }
@media (prefers-reduced-motion: reduce) {
  .pair-enter-active, .pair-leave-active, .pair-move { transition-duration: 1ms; }
}
</style>
