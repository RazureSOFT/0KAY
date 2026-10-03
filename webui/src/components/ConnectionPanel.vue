<script setup lang="ts">
/**
 * Connection QR pairing panel.
 *
 * Shows a QR code the 0KAY Android app can scan to connect. The advertised
 * host/port/TLS can be overridden here (e.g. when Core is exposed through FRP
 * or another reverse proxy) without changing Core itself. Token/PIN are
 * optional: leave them empty for a trusted-LAN (CORE_TRUSTED_NETWORKS) setup.
 */
import { computed, onMounted, ref, watch } from 'vue'
import qrcodegen from '../vendor/qrcodegen'

const STORAGE_KEY = '0kay.connection.qr.v1'

interface Saved {
  host?: string
  port?: string
  tls?: boolean
  token?: string
  pin?: string
  name?: string
}

function loadSaved(): Saved {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Saved
  } catch {
    return {}
  }
}

const saved = loadSaved()
const host = ref(saved.host ?? location.hostname)
const port = ref(saved.port ?? (location.port || (location.protocol === 'https:' ? '443' : '8080')))
const tls = ref(saved.tls ?? location.protocol === 'https:')
const token = ref(saved.token ?? '')
const pin = ref(saved.pin ?? '')
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
    }
  } catch {
    /* offline */
  }
})

watch([host, port, tls, token, pin, name], () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      host: host.value,
      port: port.value,
      tls: tls.value,
      token: token.value,
      pin: pin.value,
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
    /* clipboard may be unavailable */
  }
}
</script>

<template>
  <div class="content-card">
    <h2>连接手机</h2>
    <p class="card-desc">
      用 0KAY 安卓 App 扫描下方二维码即可连接。若通过 FRP / 反向代理暴露，请把下方
      <strong>对外主机 / 端口 / TLS</strong> 改成外网可达地址（Core 本身无需修改）。
      Token / PIN 可留空（可信局域网）；公网访问请填写以便 App 直接认证。
    </p>

    <div class="connection-grid">
      <div class="connection-form">
        <div class="field">
          <label>对外主机 / IP</label>
          <input v-model="host" class="input" placeholder="192.168.1.10 或 your.domain.com" />
        </div>
        <div class="field">
          <label>端口</label>
          <input v-model="port" class="input" inputmode="numeric" placeholder="8080" />
        </div>
        <label class="toggle-label">
          <input type="checkbox" v-model="tls" />
          <span class="toggle-slider"></span>
          <span>使用 TLS (https / wss)</span>
        </label>
        <div class="field">
          <label>API Token（可选）</label>
          <input v-model="token" class="input" type="password" placeholder="留空则使用可信局域网" autocomplete="off" />
        </div>
        <div class="field">
          <label>访问 PIN（可选）</label>
          <input v-model="pin" class="input" type="password" placeholder="敏感操作 PIN" autocomplete="off" />
        </div>
        <div class="field">
          <label>设备显示名称（可选）</label>
          <input v-model="name" class="input" placeholder="0KAY" />
        </div>

        <div class="helper-text">
          连接地址：<code>{{ baseUrl }}</code>
          <span v-if="coreId"> · Core: {{ coreId }}</span>
          <span v-if="lanEnabled"> · LAN 模式</span>
        </div>

        <div class="actions-row">
          <button class="btn btn-tonal" type="button" @click="copyLink">
            {{ copied ? '已复制' : '复制连接串' }}
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
  grid-template-columns: minmax(280px, 1fr) auto;
  gap: 24px;
  align-items: start;
}
@media (max-width: 760px) {
  .connection-grid {
    grid-template-columns: 1fr;
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
}
.connection-link {
  max-width: 280px;
  word-break: break-all;
  font-size: 11px;
  opacity: 0.7;
  text-align: center;
}
.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
</style>
