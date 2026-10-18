// 0kay API devkit — Node client (Node 22+, global fetch).
//
//   import { Okay } from './okay-devkit.mjs'
//   const ok = new Okay({ port: 8080 })          // or { baseUrl } / env OKAY_CORE_PORT
//   await ok.health()                            // { status: 'ok', healthy: 6, plugins: 6 }
//   const agent = await ok.getPlugin('agent')    // by name or plugin_id
//   agent.isEnabled                              // -> boolean
//   agent.isHealthy                              // -> boolean
//   await ok.get('/api/models')                  // raw JSON from any route

export const DEFAULT_PORT = 8080

export function resolveBaseUrl({ port, host = '127.0.0.1', baseUrl } = {}) {
  if (baseUrl) return baseUrl.replace(/\/$/, '')
  if (port) return `http://${host}:${port}`
  const explicit = process.env.CORE_HTTP || process.env.CORE_HTTP_ADDR
  if (explicit) return explicit.replace(/\/$/, '')
  const envPort = (process.env.OKAY_CORE_PORT || '').trim()
  if (/^\d+$/.test(envPort)) return `http://${host}:${envPort}`
  return `http://${host}:${DEFAULT_PORT}`
}

export class Plugin {
  constructor(data) { this._data = data || {} }
  get id() { return this._data.plugin_id || '' }
  get name() { return this._data.name || '' }
  get version() { return this._data.version || '' }
  get type() { return this._data.type || '' }
  get status() { return this._data.status || '' }
  get capabilities() { return [...(this._data.capabilities || [])] }
  get activeTasks() { return Number(this._data.active_tasks || 0) }
  get isEnabled() { return !this._data.disabled }
  get isHealthy() { return this.status === 'PLUGIN_STATUS_HEALTHY' }
  raw() { return { ...this._data } }
  toString() { return `<Plugin ${this.name} (${this.id}) enabled=${this.isEnabled} status=${this.status}>` }
}

export class Core {
  constructor(client, data) { this._client = client; this._data = data || {} }
  get status() { return this._data.status || '' }
  get healthy() { return Number(this._data.healthy || 0) }
  get plugins() { return Number(this._data.plugins || 0) }
  get baseUrl() { return this._client.baseUrl }
  toString() { return `<Core ${this.baseUrl} status=${this.status} healthy=${this.healthy}/${this.plugins}>` }
}

export class Okay {
  constructor({ port, host = '127.0.0.1', baseUrl, timeout = 10000 } = {}) {
    this.baseUrl = resolveBaseUrl({ port, host, baseUrl })
    this.timeout = timeout
  }

  async #fetch(path, init = {}) {
    const response = await fetch(this.baseUrl + path, { ...init, signal: AbortSignal.timeout(this.timeout) })
    const text = await response.text()
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text}`)
    return text ? JSON.parse(text) : null
  }

  get(path, params) {
    let url = path
    if (params) url += (url.includes('?') ? '&' : '?') + new URLSearchParams(params)
    return this.#fetch(url)
  }

  post(path, body) {
    return this.#fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })
  }

  health() { return this.get('/health') }
  async plugins() { return ((await this.get('/api/plugins')) || []).map(p => new Plugin(p)) }
  async settingsSections() { const payload = await this.get('/api/settings/sections'); return (payload && payload.sections) || [] }

  async getPlugin(key) {
    const needle = String(key || '').trim().toLowerCase()
    for (const plugin of await this.plugins()) {
      if (plugin.id.toLowerCase() === needle || plugin.name.toLowerCase() === needle) return plugin
    }
    return null
  }

  async requirePlugin(key) {
    const plugin = await this.getPlugin(key)
    if (!plugin) throw new Error(`plugin not found: ${key}`)
    return plugin
  }

  async getCore() { return new Core(this, await this.health()) }

  async surface() {
    return {
      base_url: this.baseUrl,
      health: await this.health(),
      plugins: (await this.plugins()).map(p => p.raw()),
      settings_sections: await this.settingsSections(),
    }
  }
}
