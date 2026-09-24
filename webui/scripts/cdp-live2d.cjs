/* CDP check: Live2D model actually renders */
const http = require('http')

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
  if (!page) throw new Error('no page target')

  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res)
    ws.addEventListener('error', rej)
  })

  let id = 1
  const call = (method, params) => cdpCall(ws, id++, method, params)

  await call('Page.enable')
  await call('Runtime.enable')
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 2500))

  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true');
localStorage.setItem('0kay_lang','zh');
localStorage.setItem('0kay_config', JSON.stringify({
  provider:'openai', apiKey:'sk-test', baseUrl:'https://api.openai.com/v1',
  models:['gpt-4o-mini'], defaultModel:'gpt-4o-mini',
  persona:{name:'0kay',avatar:'',description:'t',personality:'nice',greeting:'hi'},
  live2d:{enabled:true,modelUrl:'',modelData:null}
})); 'seeded'`,
  })

  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 6000))

  const { result } = await call('Runtime.evaluate', {
    expression: `(() => {
      const libs = {
        pixi: !!window.PIXI,
        cubismCore: !!window.Live2DCubismCore,
        pixiLive2d: !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel),
        pixiVersion: window.PIXI ? window.PIXI.VERSION : null,
      };
      const stage = document.querySelector('.live2d-stage');
      const canvas = document.querySelector('.stage-canvas');
      let pixels = null;
      let canvasSize = null;
      let statusText = (document.querySelector('.stage-status')||{}).innerText || '';
      if (canvas) {
        canvasSize = { w: canvas.width, h: canvas.height, clientW: canvas.clientWidth, clientH: canvas.clientHeight };
        try {
          // sample via 2d is not available if webgl; use toDataURL length as proxy
          const data = canvas.toDataURL('image/png');
          pixels = { dataUrlLen: data.length };
        } catch (e) {
          pixels = { error: String(e.message) };
        }
      }
      return JSON.stringify({
        libs,
        hasStage: !!stage,
        hasCanvas: !!canvas,
        statusText,
        enabledChip: !!document.querySelector('.stage-chrome .chip.active'),
        canvasSize,
        pixels,
        modelName: (document.querySelector('.meta-value')||{}).innerText || '',
        wizard: !!document.querySelector('.wizard-overlay'),
        shell: !!document.querySelector('.app-shell'),
      });
    })()`,
    returnByValue: true,
  })
  console.log(result.value)

  // fetch model assets status
  const checks = [
    '/vendor/pixi.min.js',
    '/vendor/live2dcubismcore.min.js',
    '/vendor/cubism4.min.js',
    '/api/live2d',
  ]
  for (const path of checks) {
    const { result: r } = await call('Runtime.evaluate', {
      expression: `fetch('${path}').then(r => r.status + ' ' + r.headers.get('content-type')).catch(e => 'ERR '+e)`,
      awaitPromise: true,
      returnByValue: true,
    })
    console.log(path, '=>', r.value)
  }

  ws.close()
}

main().catch((e) => {
  console.error('FAIL', e.message)
  process.exit(1)
})
