<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import qrcodegen from '../vendor/qrcodegen'

const { t } = useI18n()

const STORAGE_KEY = '0kay.connection.qr.v2'

interface Saved {
  host?: string
  hostOverride?: boolean
  port?: string
  tls?: boolean
  name?: string
}

function loadSaved(): Saved {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Saved
  } catch {
    return {}
  }
}

function pickLan(addresses: string[]): string {
  const rank = (ip: string) => {
    if (/^192\.168\./.test(ip)) return 0
    if (/^10\./.test(ip)) return 1
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return 2
    if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip)) return 4
    return 3
  }
  return [...addresses].sort((a, b) => rank(a) - rank(b))[0] || ''
}

const saved = loadSaved()
const hostOverride = !!saved.hostOverride
const host = ref(saved.hostOverride && saved.host ? saved.host : location.hostname)
const hostEdited = ref(hostOverride)
const defaultPort = location.protocol === 'https:' ? location.port || '443' : '8080'
const port = ref(saved.port ?? defaultPort)
const tls = ref(saved.tls ?? location.protocol === 'https:')
const token = ref('')
const pin = ref('')
const name = ref(saved.name ?? '0KAY')
const coreId = ref('')
const lanEnabled = ref(false)
const copied = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/api/auth/session')
    if (res.ok) {
      const data = await res.json()
      coreId.value = String(data.core_id || '')
      lanEnabled.value = !!data.lan_enabled
      const addresses: string[] = Array.isArray(data.addresses) ? data.addresses : []
      const lan = pickLan(addresses)
      if (!hostEdited.value && lan) host.value = lan
    }
  } catch {
  }
})

watch([host, port, tls, name, hostEdited], () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      host: host.value,
      hostOverride: hostEdited.value,
      port: port.value,
      tls: tls.value,
      name: name.value,
    } satisfies Saved),
  )
})

const baseUrl = computed(() => {
  const scheme = tls.value ? 'https' : 'http'
  const p = String(port.value || '').trim()
  return `${scheme}://${host.value.trim()}${p ? ':' + p : ''}`
})

const payload = computed(() => {
  const params: Array<[string, string]> = [['v', '1'], ['url', baseUrl.value]]
  if (name.value.trim()) params.push(['name', name.value.trim()])
  if (token.value.trim()) params.push(['token', token.value.trim()])
  if (pin.value.trim()) params.push(['pin', pin.value.trim()])
  if (coreId.value) params.push(['core_id', coreId.value])
  const query = params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
  return `0kay://pair?${query}`
})

const qr = computed(() => {
  const code = qrcodegen.QrCode.encodeText(payload.value, qrcodegen.QrCode.Ecc.MEDIUM)
  const n = code.size
  const border = 2
  const dim = n + border * 2
  const dark: Array<{ x: number; y: number }> = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (code.getModule(x, y)) dark.push({ x: x + border, y: y + border })
    }
  }
  return { dim, dark }
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(payload.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
  }
}
</script>

<template>
  <div class="content-card">
    <h2>{{ t('connection.title') }}</h2>
    <p class="card-desc">
      {{ t('connection.lead') }}
    </p>

    <div class="connection-grid">
      <div class="connection-form">
        <div class="field">
          <label>{{ t('connection.remoteHost') }}</label>
          <input
            v-model="host"
            class="input"
            :placeholder="t('connection.hostPlaceholder')"
            @input="hostEdited = true"
          />
        </div>
        <div class="field">
          <label>{{ t('connection.port') }}</label>
          <input v-model="port" class="input" inputmode="numeric" placeholder="8080" />
        </div>
        <label class="toggle-label">
          <input type="checkbox" v-model="tls" />
          <span class="toggle-slider"></span>
          <span>{{ t('connection.useTls') }}</span>
        </label>
        <div class="field">
          <label>{{ t('connection.token') }}</label>
          <input v-model="token" class="input" type="password" :placeholder="t('connection.tokenPlaceholder')" autocomplete="off" />
        </div>
        <div class="field">
          <label>{{ t('connection.pin') }}</label>
          <input v-model="pin" class="input" type="password" :placeholder="t('connection.pinPlaceholder')" autocomplete="off" />
        </div>
        <div class="field">
          <label>{{ t('connection.deviceName') }}</label>
          <input v-model="name" class="input" placeholder="0KAY" />
        </div>

        <div class="helper-text">
          {{ t('connection.address') }}<code>{{ baseUrl }}</code>
          <span v-if="coreId"> · Core: {{ coreId }}</span>
          <span v-if="lanEnabled">{{ t('connection.lanMode') }}</span>
        </div>

        <div class="actions-row">
          <button class="btn btn-tonal" type="button" @click="copyLink">
            {{ copied ? t('common.copied') : t('connection.copyLink') }}
          </button>
        </div>
      </div>

      <div class="connection-qr">
        <svg
          :viewBox="`0 0 ${qr.dim} ${qr.dim}`"
          width="264"
          height="264"
          shape-rendering="crispEdges"
          role="img"
          aria-label="0KAY connection QR code"
        >
          <rect x="0" y="0" :width="qr.dim" :height="qr.dim" fill="#ffffff" />
          <rect
            v-for="cell in qr.dark"
            :key="cell.x + ':' + cell.y"
            :x="cell.x"
            :y="cell.y"
            width="1"
            height="1"
            fill="#0b1020"
          />
        </svg>
        <code class="connection-link">{{ payload }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connection-grid {
  display: grid;
  
  grid-template-columns: minmax(0, 1fr) minmax(0, 264px);
  gap: 24px;
  align-items: start;
}

@media (max-width: 1000px) {
  .connection-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
.connection-form .field {
  margin-bottom: 12px;
}
.connection-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.connection-qr svg {
  background: #fff;
  border-radius: 8px;
  padding: 6px;
  
  width: 100%;
  max-width: 264px;
  height: auto;
}
.connection-link {
  max-width: 100%;
  word-break: break-all;
  font-size: 11px;
  opacity: 0.7;
  text-align: center;
}

.helper-text {
  overflow-wrap: anywhere;
}
.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
</style>
