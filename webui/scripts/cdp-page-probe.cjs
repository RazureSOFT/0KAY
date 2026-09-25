/* Probe a page: collect console errors + render state after navigation. */
const http = require('node:http')

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
  const target = process.argv[2] || 'http://127.0.0.1:3000/agents'
  const waitMs = Number(process.argv[3] || 6000)
  const lang = process.argv[4] || 'zh'
  const targets = await getJson('http://127.0.0.1:9333/json/list')
  const page = targets.find((t) => t.type === 'page')
  if (!page) throw new Error('no page target')

  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res)
    ws.addEventListener('error', rej)
  })

  const errors = []
  let nextId = 1
  ws.addEventListener('message', (event) => {
    let msg
    try { msg = JSON.parse(event.data) } catch { return }
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails
      errors.push('EXC: ' + (d.exception && d.exception.description || d.text).split('\n')[0])
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      errors.push('LOG: ' + msg.params.entry.text.split('\n')[0])
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push('CONSOLE: ' + msg.params.args.map((a) => a.value || a.description || '').join(' ').split('\n')[0])
    }
  })

  const call = (method, params) => cdpCall(ws, nextId++, method, params)
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Log.enable')
  // Skip wizard + set language on the origin first.
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 1800))
  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true'); localStorage.setItem('0kay_lang','${lang}'); 'ok'`,
  })
  await call('Page.navigate', { url: target })
  await new Promise((r) => setTimeout(r, waitMs))

  const result = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      path: location.pathname,
      body: (document.body.innerText || '').slice(0, 1500),
      workspace: !!document.querySelector('.workspace'),
      loading: document.body.innerText.includes('Loading plugin module'),
      patchPage: !!document.querySelector('.patch-empty, .patch-frame'),
      mainHTML: (document.querySelector('#app') || {}).innerHTML ? document.querySelector('#app').innerHTML.slice(0, 300) : ''
    })`,
    returnByValue: true,
  })
  console.log('STATE:', result.result.value)
  console.log('ERRORS:', JSON.stringify(errors, null, 2))
  ws.close()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
