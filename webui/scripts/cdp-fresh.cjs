/* Clear transforms, reload, screenshot fresh default view */
const http = require('http')
const fs = require('fs')
const os = require('os')

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
    }, 20000)
  })
}

async function main() {
  const targets = await getJson('http://127.0.0.1:9333/json/list')
  const page = targets.find((t) => t.type === 'page')
  if (!page) throw new Error('no page')

  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res)
    ws.addEventListener('error', rej)
  })

  let id = 1
  const call = (method, params) => cdpCall(ws, id++, method, params)

  await call('Page.enable')
  await call('Runtime.enable')
  await call('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  })
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 2500))
  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true');
localStorage.setItem('0kay_lang','zh');
localStorage.setItem('0kay_config', JSON.stringify({
  provider:'openai', apiKey:'sk-test', baseUrl:'https://api.openai.com/v1',
  models:['gpt-4o-mini'], defaultModel:'gpt-4o-mini',
  persona:{name:'0kay',avatar:'',description:'t',personality:'nice',greeting:'hi'},
  live2d:{enabled:true,modelUrl:'/live2d/models/mao_pro/mao_pro.model3.json',modelData:null}
}));
Object.keys(localStorage).filter(k=>k.startsWith('0kay.web.live2d.transform.')).forEach(k=>localStorage.removeItem(k));
'seeded'`,
  })
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 7000))

  const info = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      meta:(document.querySelector('.meta-value')||{}).innerText||'',
      keys:Object.keys(localStorage).filter(k=>k.startsWith('0kay.web.live2d.transform.')),
      stage:(()=>{const s=document.querySelector('.stage-viewport');if(!s)return null;const r=s.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}})()
    })`,
    returnByValue: true,
  })
  console.log('fresh', info.result.value)

  const shot = await call('Page.captureScreenshot', { format: 'png' })
  const out = (process.env.TEMP || os.tmpdir()) + '\\live2d_fresh.png'
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'))
  console.log('screenshot', out, fs.statSync(out).size)

  ws.close()
}

main().catch((e) => {
  console.error('FAIL', e.message)
  process.exit(1)
})
