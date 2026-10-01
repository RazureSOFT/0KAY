/**
 * Register (or refresh) the DeepSeek web provider with Core, using a raw
 * node:http request (no Fetch metadata headers) so Core always treats it as a
 * machine client on loopback.
 */
import http from 'node:http'
import https from 'node:https'

const PROVIDER_ID = 'deepseek-web'
const KEY = process.env.DEEPSEEK_WEB_KEY || 'dsw-local'
const UA = '0kay-deepseek-web/0.1'

function coreBase() {
  const value = process.env.DEEPSEEK_WEB_CORE_HTTP || process.env.CORE_HTTP_ADDR || 'http://127.0.0.1:8080'
  return String(value).replace(/\/+$/, '')
}

function postJSON(url, body, timeoutMs) {
  return new Promise((resolve, reject) => {
    const target = new URL(url)
    const payload = Buffer.from(JSON.stringify(body))
    const transport = target.protocol === 'https:' ? https : http
    const request = transport.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        path: `${target.pathname}${target.search}`,
        method: 'POST',
        headers: { 'content-type': 'application/json', 'content-length': payload.length, 'user-agent': UA },
      },
      (response) => {
        response.resume()
        response.once('end', () => resolve(response.statusCode ?? 0))
      },
    )
    request.setTimeout(timeoutMs, () => request.destroy(new Error('timeout')))
    request.once('error', reject)
    request.end(payload)
  })
}

export async function registerProvider({ port, catalog, log = () => {} }) {
  if (!catalog.length) return false
  const base = coreBase()
  const provider = {
    id: PROVIDER_ID,
    provider: 'custom',
    name: 'DeepSeek 网页版（免费）',
    base_url: `http://127.0.0.1:${port}/v1`,
    api_key: KEY,
    models: catalog.map((entry) => entry.id),
    default_model: catalog[0].id,
    enabled: true,
    format: 'openai',
  }
  try {
    const status = await postJSON(`${base}/api/providers`, { provider }, 8000)
    if (status < 200 || status >= 300) {
      log(`Core rejected the provider (HTTP ${status}); it will retry.`)
      return false
    }
    log(`Registered provider "${provider.name}" with Core (${catalog.length} models).`)
    return true
  } catch (error) {
    log(`Could not reach Core at ${base} (${error?.message ?? error}); will retry.`)
    return false
  }
}

// Allow `node src/register.mjs` for a one-shot refresh.
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  const port = Number(process.env.DEEPSEEK_WEB_PORT || 8792)
  await registerProvider({ port, catalog: [{ id: 'deepseek-web-chat' }, { id: 'deepseek-web-reasoner' }], log: console.log })
}
