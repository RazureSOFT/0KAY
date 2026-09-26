/* Screenshot the first-run wizard via CDP → scripts/shots/_wizard.png */
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = ''
      res.on('data', (c) => (d += c))
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch (e) { reject(e) } })
    }).on('error', reject)
  })
}

function cdpCall(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      let msg
      try { msg = JSON.parse(event.data) } catch { return }
      if (msg.id === id) {
        ws.removeEventListener('message', handler)
        if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result)
      }
    }
    ws.addEventListener('message', handler)
    ws.send(JSON.stringify({ id, method, params }))
    setTimeout(() => { ws.removeEventListener('message', handler); reject(new Error('timeout ' + method)) }, 30000)
  })
}

async function main() {
  const out = process.argv[2] || path.join(__dirname, 'shots', '_wizard.png')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  const targets = await getJson('http://127.0.0.1:9333/json/list')
  const page = targets.find((t) => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
  let id = 1
  const call = (m, p) => cdpCall(ws, id++, m, p)
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 860, deviceScaleFactor: 1, mobile: false })
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 1500))
  await call('Runtime.evaluate', { expression: `localStorage.setItem('0kay_lang','zh'); localStorage.removeItem('0kay_wizard_complete'); localStorage.removeItem('0kay_config'); 'ok'` })
  await call('Page.reload')
  await new Promise((r) => setTimeout(r, 5000))
  const shot = await call('Page.captureScreenshot', { format: 'png' })
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'))
  console.log('shot:', out)
  ws.close()
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
