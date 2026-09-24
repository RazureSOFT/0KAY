const http = require('http')
const fs = require('fs')

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
        if (msg.error) reject(new Error(msg.error.message))
        else resolve(msg.result)
      }
    }
    ws.addEventListener('message', handler)
    ws.send(JSON.stringify({ id, method, params }))
    setTimeout(() => { ws.removeEventListener('message', handler); reject(new Error('timeout ' + method)) }, 30000)
  })
}

async function main() {
  const targets = await getJson('http://127.0.0.1:9333/json/list')
  const page = targets.find((t) => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
  let id = 1
  const call = (m, p) => cdpCall(ws, id++, m, p)

  await call('Page.enable')
  await call('Runtime.enable')
  await call('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  })
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 2500))
  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true');
localStorage.setItem('0kay_config', JSON.stringify({
  provider:'openai', apiKey:'sk-test', baseUrl:'https://api.openai.com/v1',
  models:['gpt-4o-mini'], defaultModel:'gpt-4o-mini',
  persona:{name:'0kay',avatar:'',description:'t',personality:'nice',greeting:'hi'},
  live2d:{enabled:true,modelUrl:'',modelData:null}
}));'ok'`,
  })
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 7000))

  const { result } = await call('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('.stage-canvas');
      const stage = document.querySelector('.stage-viewport');
      let sample = null;
      if (canvas) {
        try {
          const url = canvas.toDataURL('image/png');
          // decode via image
          sample = { len: url.length };
        } catch(e) { sample = { err: String(e) }; }
      }
      // try read WebGL pixels
      let webglInfo = null;
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (gl) {
          const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
          const pixels = new Uint8Array(w * h * 4);
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          let nonZero = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i+3] > 10) nonZero++;
          }
          webglInfo = { w, h, nonZero, total: w*h };
        } else {
          webglInfo = { note: 'no gl context from canvas (owned by pixi)' };
        }
      }
      const status = document.querySelector('.stage-status');
      const rect = stage ? stage.getBoundingClientRect() : null;
      return JSON.stringify({
        sample, webglInfo,
        status: status ? status.innerText : null,
        statusClass: status ? status.className : null,
        rect: rect ? {w:rect.width,h:rect.height,top:rect.top,left:rect.left} : null,
        modelName: (document.querySelector('.meta-value')||{}).innerText,
        chips: [...document.querySelectorAll('.stage-actions .chip')].map(c => c.innerText + (c.classList.contains('active')?'*':'')),
      }, null, 0);
    })()`,
    returnByValue: true,
  })
  console.log(result.value)

  const shot = await call('Page.captureScreenshot', { format: 'png' })
  const out = process.env.TEMP ? process.env.TEMP + '\\live2d_shot.png' : require('os').tmpdir() + '\\live2d_shot.png'
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'))
  console.log('screenshot:', out, fs.statSync(out).size)

  ws.close()
}
main().catch((e) => { console.error('FAIL', e); process.exit(1) })
