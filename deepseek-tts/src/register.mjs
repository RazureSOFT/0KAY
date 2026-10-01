/**
 * Best-effort registration of this service as LIFE's TTS endpoint.
 *
 * The LIFE `tts_endpoint` setting drives both OneBot voice messages and the
 * WebUI voice/lip-sync. We only set it when it is empty so an operator's choice
 * is never overwritten. The `life` settings section may not exist until LIFE has
 * registered with Core, so we retry for a short while.
 *
 * @param {string} endpoint - this service's URL, e.g. http://127.0.0.1:8792/
 * @param {(message: string) => void} [log]
 */
export async function registerWithCore(endpoint, log = () => {}) {
  const base = (process.env.CORE_HTTP_ADDR || process.env.CORE_HTTP || 'http://127.0.0.1:8080').replace(/\/+$/, '')
  const headers = { 'Content-Type': 'application/json' }
  if (process.env.CORE_API_TOKEN) headers.Authorization = `Bearer ${process.env.CORE_API_TOKEN}`
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const res = await fetch(`${base}/api/settings/life`, { headers })
      if (res.ok) {
        const data = await res.json().catch(() => ({}))
        const current = data?.values?.tts_endpoint
        if (current) {
          log(`LIFE tts_endpoint already set (${current}); leaving it`)
          return true
        }
        const put = await fetch(`${base}/api/settings/life`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ values: { tts_endpoint: endpoint } }),
        })
        if (put.ok) {
          log(`registered LIFE tts_endpoint = ${endpoint}`)
          return true
        }
      }
    } catch {
      /* Core not up yet */
    }
    await wait(3000)
  }
  log('could not set LIFE tts_endpoint automatically; set it under Settings → LIFE')
  return false
}
