/* Debug: probe store state + console/network errors on /agents. */
const http = require('http')

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
    setTimeout(() => { ws.removeEventListener('message', handler); reject(new Error('timeout ' + method)) }, 15000)
  })
}

async function main() {
  const targets = await getJson('http://127.0.0.1:9333/json/list')
  const page = targets.find((t) => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
  let id = 1
  const call = (method, params) => cdpCall(ws, id++, method, params)
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Log.enable')

  const logs = []
  ws.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data)
      if (msg.method === 'Log.entryAdded') logs.push(`LOG ${msg.params.entry.level}: ${msg.params.entry.text}`)
      if (msg.method === 'Runtime.exceptionThrown') logs.push(`EXC: ${JSON.stringify(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text)}`)
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') logs.push(`CONSOLE: ${msg.params.args.map((a) => a.value ?? a.description).join(' ')}`)
    } catch { /* ignore */ }
  })

  await call('Page.navigate', { url: 'http://127.0.0.1:3000/agents' })
  await new Promise((r) => setTimeout(r, 4000))

  const probe = await call('Runtime.evaluate', {
    expression: `(async () => {
      const out = { selected: localStorage.getItem('0kay.agent.selected') }
      try {
        const res = await fetch('/api/tasks?incremental=1&cursor=')
        out.apiStatus = res.status
        const data = await res.json()
        out.apiTasks = (data.tasks || []).length
      } catch (e) { out.apiError = String(e) }
      try {
        const res2 = await fetch('/api/tasks')
        const data2 = await res2.json()
        out.fullTasks = (data2.tasks || []).length
        out.hasSessionRow = (data2.tasks || []).some(t => (t.session_id || '') === out.selected)
        out.hasArgs = (data2.tasks || []).filter(t => t.args).length
      } catch (e) { out.fullError = String(e) }
      out.dom = { turns: document.querySelectorAll('.turn').length, cards: document.querySelectorAll('.tool-card').length }
      out.body = (document.querySelector('.transcript')?.innerText || '').slice(0, 150)
      out.route = location.pathname
      return JSON.stringify(out)
    })()`,
    awaitPromise: true,
    returnByValue: true,
  })
  console.log('probe', probe.result.value)
  console.log('logs', JSON.stringify(logs.slice(0, 20), null, 2))
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
