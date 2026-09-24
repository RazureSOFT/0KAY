/* Verify settings provider + life plugin tab */
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
    }, 15000)
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
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/settings?tab=provider' })
  await new Promise((r) => setTimeout(r, 2500))

  const { result } = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      labels: [...document.querySelectorAll('.nav-label')].map(e => e.textContent.trim()),
      providerRows: document.querySelectorAll('.provider-row').length,
      hasAdd: [...document.querySelectorAll('button')].some(b => /添加供应商|Add provider/.test(b.textContent)),
      bodySnippet: (document.querySelector('.settings-content')||{}).innerText?.slice(0,300) || ''
    })`,
    returnByValue: true,
  })
  console.log('provider-tab', result.value)

  await call('Page.navigate', { url: 'http://127.0.0.1:3000/settings?tab=permissions' })
  await new Promise((r) => setTimeout(r, 2000))
  const { result: r2 } = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      labels: [...document.querySelectorAll('.nav-label')].map(e => e.textContent.trim()),
      tabLabels: [...document.querySelectorAll('.settings-nav .nav-item')].map(e => (e.textContent||'').trim()),
      hasModelsTab: [...document.querySelectorAll('.settings-nav .nav-item')].some(el => /模型|Models/i.test(el.textContent||'')),
      bodySnippet: (document.querySelector('.settings-content')||{}).innerText?.slice(0,400) || ''
    })`,
    returnByValue: true,
  })
  console.log('settings-no-life-tab', r2.value)

  ws.close()
}

main().catch((e) => {
  console.error('FAIL', e.message)
  process.exit(1)
})
