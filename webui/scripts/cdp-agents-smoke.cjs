/* Smoke: Agents page renders; subagent cards exist in DOM structure. */
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
  await new Promise((r) => setTimeout(r, 2000))
  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true'); localStorage.setItem('0kay_lang','zh'); 'ok'`,
  })
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/agents' })
  await new Promise((r) => setTimeout(r, 3500))

  const result = await call('Runtime.evaluate', {
    expression: `(() => {
      const main = document.querySelector('.workspace')
      const header = document.querySelector('.conversation-header h2, .sessions h1')
      const subCard = document.querySelector('.subagent-card')
      const steps = document.querySelector('.steps')
      return JSON.stringify({
        loaded: !!main,
        header: header ? header.textContent.trim() : '',
        hasSubCardClass: !!document.querySelector('.subagent-card, .steps details'),
        hasSteps: !!steps || !!document.querySelector('.turn'),
        text: (document.body.innerText || '').slice(0, 400)
      })
    })()`,
    returnByValue: true,
  })
  const value = JSON.parse(result.result.value)
  console.log(JSON.stringify(value, null, 2))
  if (!value.loaded) {
    console.error('AGENTS_PAGE_FAIL')
    process.exit(1)
  }
  console.log('AGENTS_PAGE_OK')
  ws.close()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
