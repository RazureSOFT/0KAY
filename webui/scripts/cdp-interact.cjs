/* CDP: verify Live2D zoom / drag / eye-follow */
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
})); 'seeded'`,
  })
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 6000))

  // wait until model meta shows
  for (let i = 0; i < 20; i++) {
    const { result } = await call('Runtime.evaluate', {
      expression: `(document.querySelector('.meta-value')||{}).innerText || ''`,
      returnByValue: true,
    })
    if ((result.value || '').includes('model3.json')) break
    await new Promise((r) => setTimeout(r, 500))
  }

  const base = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      meta:(document.querySelector('.meta-value')||{}).innerText||'',
      resetBtn:!![...document.querySelectorAll('button.chip')].find(b=>b.innerText.includes('重置')||b.innerText.includes('Reset')),
      cursor:(document.querySelector('.stage-viewport')||{}).style?.cursor||'',
      transformKeys:Object.keys(localStorage).filter(k=>k.startsWith('0kay.web.live2d.transform.'))
    })`,
    returnByValue: true,
  })
  console.log('base', base.result.value)

  // wheel zoom in
  await call('Runtime.evaluate', {
    expression: `(() => {
      const stage=document.querySelector('.stage-viewport');
      const r=stage.getBoundingClientRect();
      stage.dispatchEvent(new WheelEvent('wheel',{deltaY:-120,bubbles:true,cancelable:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2}));
      stage.dispatchEvent(new WheelEvent('wheel',{deltaY:-120,bubbles:true,cancelable:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2}));
      return 'wheeled';
    })()`,
    returnByValue: true,
  })
  await new Promise((r) => setTimeout(r, 500))

  const afterWheel = await call('Runtime.evaluate', {
    expression: `JSON.stringify(Object.keys(localStorage).filter(k=>k.startsWith('0kay.web.live2d.transform.')).map(k=>({k,v:localStorage.getItem(k)})))`,
    returnByValue: true,
  })
  console.log('afterWheel', afterWheel.result.value)

  // drag
  await call('Runtime.evaluate', {
    expression: `(() => {
      const stage=document.querySelector('.stage-viewport');
      const r=stage.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      const opts=(x,y)=>({clientX:x,clientY:y,bubbles:true,cancelable:true,pointerId:1,pointerType:'mouse',button:0,isPrimary:true});
      stage.dispatchEvent(new PointerEvent('pointerdown',opts(cx,cy)));
      stage.dispatchEvent(new PointerEvent('pointermove',opts(cx+120,cy+60)));
      stage.dispatchEvent(new PointerEvent('pointerup',opts(cx+120,cy+60)));
      return 'dragged';
    })()`,
    returnByValue: true,
  })
  await new Promise((r) => setTimeout(r, 500))

  const afterDrag = await call('Runtime.evaluate', {
    expression: `JSON.stringify(Object.keys(localStorage).filter(k=>k.startsWith('0kay.web.live2d.transform.')).map(k=>({k,v:localStorage.getItem(k)})))`,
    returnByValue: true,
  })
  console.log('afterDrag', afterDrag.result.value)

  // eye follow across entire stage
  await call('Runtime.evaluate', {
    expression: `(() => {
      const stage=document.querySelector('.stage-viewport');
      const r=stage.getBoundingClientRect();
      const pts=[[r.left+2,r.top+2],[r.right-2,r.top+2],[r.left+2,r.bottom-2],[r.right-2,r.bottom-2],[r.left+r.width/2,r.top+r.height/3]];
      for (const [x,y] of pts) {
        stage.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y,bubbles:true,cancelable:true,pointerId:1,pointerType:'mouse',isPrimary:true}));
      }
      return 'eyeok';
    })()`,
    returnByValue: true,
  })
  console.log('eye ok')

  // reset view
  const reset = await call('Runtime.evaluate', {
    expression: `(() => {
      const b=[...document.querySelectorAll('button.chip')].find(x=>x.innerText.includes('重置')||x.innerText.includes('Reset'));
      if(!b) return 'noreset';
      b.click();
      return 'clicked';
    })()`,
    returnByValue: true,
  })
  console.log('reset', reset.result.value)
  await new Promise((r) => setTimeout(r, 500))

  const afterReset = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      keys:Object.keys(localStorage).filter(k=>k.startsWith('0kay.web.live2d.transform.')),
      meta:(document.querySelector('.meta-value')||{}).innerText||''
    })`,
    returnByValue: true,
  })
  console.log('afterReset', afterReset.result.value)

  // screenshot
  const shot = await call('Page.captureScreenshot', { format: 'png' })
  const out = (process.env.TEMP || require('os').tmpdir()) + '\\live2d_interact.png'
  require('fs').writeFileSync(out, Buffer.from(shot.data, 'base64'))
  console.log('screenshot', out, require('fs').statSync(out).size)

  ws.close()
}

main().catch((e) => {
  console.error('FAIL', e.message)
  process.exit(1)
})
