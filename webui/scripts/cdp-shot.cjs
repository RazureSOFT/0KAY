/* Screenshot pages via CDP → scripts/shots/*.png */
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = ''
      res.on('data', (c) => (d += c))
      res.on('end', () => {
        try { resolve(JSON.parse(d)) } catch (e) { reject(e) }
      })
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
        if (msg.error) reject(new Error(msg.error.message))
        else resolve(msg.result)
      }
    }
    ws.addEventListener('message', handler)
    ws.send(JSON.stringify({ id, method, params }))
    setTimeout(() => {
      ws.removeEventListener('message', handler)
      reject(new Error('timeout ' + method))
    }, 30000)
  })
}

async function main() {
  const routes = process.argv.slice(2)
  if (!routes.length) routes.push('/memory', '/companion', '/agents')
  const outDir = path.join(__dirname, 'shots')
  fs.mkdirSync(outDir, { recursive: true })

  const targets = await getJson('http://127.0.0.1:9333/json/list')
  const page = targets.find((t) => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res)
    ws.addEventListener('error', rej)
  })
  let id = 1
  const call = (m, p) => cdpCall(ws, id++, m, p)
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 1800))
  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true'); localStorage.setItem('0kay_lang','zh'); 'ok'`,
  })
  await call('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  })

  for (const route of routes) {
    await call('Page.navigate', { url: 'http://127.0.0.1:3000' + route })
    await new Promise((r) => setTimeout(r, 5000))
    const shot = await call('Page.captureScreenshot', { format: 'png' })
    const file = path.join(outDir, route.replace(/\//g, '_').replace(/^_$/, '_home') + '.png')
    fs.writeFileSync(file, Buffer.from(shot.data, 'base64'))
    console.log('shot:', file)
  }
  ws.close()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
