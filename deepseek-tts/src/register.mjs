/**
 * Registers this service with Core as a plugin and contributes a settings
 * section, then heartbeats. Also exposes the current settings (voice/token/
 * enabled) so the TTS server can read them live from the Settings UI.
 *
 * The LIFE `tts_endpoint` is set separately (see registerTtsEndpoint) so LIFE's
 * voice path and the WebUI voice share the same backend.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function protoDir() {
  return process.env.PROTO_DIR || path.resolve(__dirname, '../../proto')
}

let identity = { name: '', token: '' }
let settingsCache = { at: 0, values: {} }

function coreHttpBase() {
  return (process.env.CORE_HTTP_ADDR || process.env.CORE_HTTP || 'http://127.0.0.1:8080').replace(/\/+$/, '')
}

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  if (identity.name && identity.token) {
    headers['X-0KAY-Plugin'] = identity.name
    headers.Authorization = `Bearer ${identity.token}`
  } else if (process.env.CORE_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.CORE_API_TOKEN}`
  }
  return headers
}

const SECTION = {
  id: 'deepseek-tts',
  label: 'DeepSeek TTS',
  icon: 'mic',
  order: 82,
  description: 'DeepSeek 网页朗读作为 LIFE 与 WebUI 的语音后端',
  fields: [
    { key: 'enabled', type: 'bool', label: '启用语音合成', defaultValue: 'true', help: '关闭后 /api/tts 会拒绝合成' },
    { key: 'voice', type: 'select', label: '音色', defaultValue: 'mira', options: ['mira', 'echo', 'stella', 'tide'], help: 'mira/echo 支持 29 种语言，stella/tide 支持 10 种' },
    { key: 'token', type: 'text', label: 'DeepSeek userToken', defaultValue: '', help: 'chat.deepseek.com 的 64 位 userToken；仅本地存储' },
    { key: 'test', type: 'test', label: '测试语音', help: '合成一句示例并播放（需先保存 userToken）' },
  ],
}

/** Read the plugin's own settings from Core (5s cache). */
export async function getSettings() {
  if (Date.now() - settingsCache.at < 5000) return settingsCache.values
  try {
    const res = await fetch(`${coreHttpBase()}/api/settings/${SECTION.id}`, { headers: authHeaders() })
    if (res.ok) {
      const data = await res.json().catch(() => ({}))
      settingsCache = { at: Date.now(), values: data?.values || {} }
    }
  } catch { /* Core not up yet */ }
  return settingsCache.values
}

/** Persist a value into one of our own settings sections. */
async function postSectionValues(id, values, log) {
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const res = await fetch(`${coreHttpBase()}/api/settings/${id}`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ values }),
      })
      if (res.ok) return true
    } catch { /* retry */ }
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
  log(`could not persist ${id} settings`)
  return false
}

/** Best-effort: point LIFE at this service when it has no TTS endpoint yet. */
async function registerTtsEndpoint(endpoint, log) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(`${coreHttpBase()}/api/settings/life`, { headers: authHeaders() })
      if (res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data?.values?.tts_endpoint) {
          log(`LIFE tts_endpoint already set (${data.values.tts_endpoint}); leaving it`)
          return
        }
        const put = await fetch(`${coreHttpBase()}/api/settings/life`, {
          method: 'POST', headers: authHeaders(), body: JSON.stringify({ values: { tts_endpoint: endpoint } }),
        })
        if (put.ok) { log(`registered LIFE tts_endpoint = ${endpoint}`); return }
      }
    } catch { /* retry */ }
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
  log('could not set LIFE tts_endpoint automatically; set it under Settings → LIFE')
}

/** Register with Core over gRPC, then heartbeat. Returns a shutdown function. */
export function registerWithCore(endpoint, log = () => {}) {
  const address = process.env.CORE_ADDRESS || 'localhost:50051'
  const name = process.env.PLUGIN_NAME || 'deepseek-tts'
  const version = process.env.PLUGIN_VERSION || '0.1.0'

  const def = protoLoader.loadSync(path.join(protoDir(), 'core/v1/core.proto'), {
    keepCase: false, longs: String, enums: String, defaults: true, oneofs: true,
    includeDirs: [protoDir()],
  })
  const pkg = grpc.loadPackageDefinition(def)
  const PluginService = pkg.core?.v1?.PluginService
  if (!PluginService) throw new Error('core.v1.PluginService not found (set PROTO_DIR)')
  const pluginClient = new PluginService(address, grpc.credentials.createInsecure())

  let pluginId = ''
  const register = () => new Promise((resolve) => {
    pluginClient.Register({
      pluginInfo: {
        name,
        version,
        description: 'DeepSeek web TTS backend for LIFE / WebUI',
        author: '0kay',
        pluginType: 'PLUGIN_TYPE_SERVICE',
        permissions: {
          apiRequires: [
            `GET /api/settings/${SECTION.id}`, `POST /api/settings/${SECTION.id}`,
            'GET /api/settings/life', 'POST /api/settings/life',
          ],
          egress: ['chat.deepseek.com', '*.deepseek.com'],
        },
      },
      capabilities: ['tts'],
      address: '',
      settingsSections: [{
        id: SECTION.id, label: SECTION.label, icon: SECTION.icon, order: SECTION.order, description: SECTION.description,
        fields: SECTION.fields.map((f) => ({ key: f.key, type: f.type, label: f.label, defaultValue: f.defaultValue || '', options: f.options || [], help: f.help || '' })),
      }],
    }, (err, resp) => {
      if (err || !resp?.success) { log(`register failed: ${err?.message || resp?.message || 'rejected'}`); resolve(false); return }
      pluginId = resp.pluginId
      identity = { name, token: resp.serviceToken || '' }
      log(`registered with Core: plugin_id=${pluginId}`)
      resolve(true)
    })
  })

  const timer = setInterval(async () => {
    if (!pluginId) { await register(); return }
    pluginClient.Heartbeat({ pluginId, status: 'PLUGIN_STATUS_HEALTHY', activeTasks: 0 }, (err, resp) => {
      if (err || !resp?.ok) pluginId = ''
    })
  }, 10000)

  ;(async () => {
    for (let i = 0; i < 10 && !pluginId; i++) { if (await register()) break; await new Promise((r) => setTimeout(r, 2000)) }
    if (!pluginId) return
    // Record our own endpoint so Core's /api/tts and the settings test work
    // without depending on LIFE.
    await postSectionValues(SECTION.id, { endpoint }, log)
    if (process.env.OKAY_TTS_AUTOREGISTER !== '0') await registerTtsEndpoint(endpoint, log)
  })()

  return () => { clearInterval(timer) }
}
