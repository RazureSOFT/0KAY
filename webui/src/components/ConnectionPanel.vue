<script setup lang="ts">
/**
 * Connection QR pairing panel.
 *
 * Shows a QR code the 0KAY Android app can scan to connect. The advertised
 * host/port/TLS can be overridden here (e.g. when Core is exposed through FRP
 * or another reverse proxy) without changing Core's networking. Token/PIN are
 * optional: leave them empty for a trusted-LAN (CORE_TRUSTED_NETWORKS) setup.
 *
 * The default host is the machine's LAN IPv4, read from Core's read-only
 * `addresses` hint on /api/auth/session, so a phone on the same network can
 * scan and connect with no manual typing. Editing the host pins it.
 */
import { computed, onMounted, ref, watch } from 'vue'
import qrcodegen from '../vendor/qrcodegen'

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

/** Prefer classic private ranges, then anything else, keeping the first seen. */
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
// The WebUI (Vite :3000 in dev) is not where the phone talks to: the API lives
// on Core. Default to Core's HTTP port; only a standard TLS origin keeps its port.
const defaultPort = location.protocol === 'https:' ? location.port || '443' : '8080'
const port = ref(saved.port ?? defaultPort)
const tls = ref(saved.tls ?? location.protocol === 'https:')
// Token / PIN are secrets and are never persisted or pre-filled; the user
// re-enters them each time (or leaves them blank for a trusted LAN).
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
    /* offline */
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
    /* clipboard may be unavailable */
  }
}
</script>

<template>
  <div class="content-card">
    <h2>连接手机</h2>
    <p class="card-desc">
      用 0KAY 安卓 App 扫描下方二维码即可连接。默认使用本机局域网 IP；若通过 FRP /
      反向代理暴露，请把下方 <strong>对外主机 / 端口 / TLS</strong> 改成外网可达地址
      （Core 本身无需修改）。Token / PIN 可留空（可信局域网）；公网访问请填写以便 App 直接认证。
    </p>

    <div class="connection-grid">
      <div class="connection-form">
        <div class="field">
          <label>对外主机 / IP（默认局域网 IP）</label>
          <input
            v-model="host"
            class="input"
            placeholder="192.168.1.10 或 your.domain.com"
            @input="hostEdited = true"
          />
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
