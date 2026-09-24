/* CDP smoke test for 0kay WebUI routes */
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

  // Seed localStorage for origin
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 2500))
  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true');
localStorage.setItem('0kay_lang','zh');
localStorage.setItem('0kay_config', JSON.stringify({
  provider:'openai', apiKey:'sk-test', baseUrl:'https://api.openai.com/v1',
  models:['gpt-4o-mini'], defaultModel:'gpt-4o-mini',
  persona:{name:'0kay',avatar:'',description:'test',personality:'nice',greeting:'hi'},
  live2d:{enabled:true,modelUrl:'',modelData:null}
})); 'seeded'`,
  })

  const routes = [
    ['home', 'http://127.0.0.1:3000/'],
    ['settings', 'http://127.0.0.1:3000/settings'],
    ['settings-live2d', 'http://127.0.0.1:3000/settings?tab=live2d'],
    ['settings-perms', 'http://127.0.0.1:3000/settings?tab=permissions'],
    ['settings-agent', 'http://127.0.0.1:3000/settings?tab=agent'],
    ['settings-provider', 'http://127.0.0.1:3000/settings?tab=provider'],
    ['agents', 'http://127.0.0.1:3000/agents'],
    ['plugins', 'http://127.0.0.1:3000/plugins'],
    ['usage', 'http://127.0.0.1:3000/usage'],
    ['search', 'http://127.0.0.1:3000/search'],
  ]

  for (const [name, url] of routes) {
    await call('Page.navigate', { url })
    await new Promise((r) => setTimeout(r, 2000))
    const { result } = await call('Runtime.evaluate', {
      expression: `JSON.stringify({
        path: location.pathname + location.search,
shell: !!document.querySelector('.app-shell'),
        wizard: !!document.querySelector('.wizard-overlay'),
        chat: !!document.querySelector('.chat-panel'),
        settings: !!document.querySelector('.settings-page'),
        agents: !!document.querySelector('.agents-page'),
        usage: !!document.querySelector('.usage-page'),
        plugins: !!document.querySelector('.plugins-page'),
        pluginCards: document.querySelectorAll('.plugin-card').length,
live2d: !!document.querySelector('.live2d-stage'),
        stageColumn: !!document.querySelector('.stage-column'),
        resizer: !!document.querySelector('.page-resizer'),
        memorySection: !!document.querySelector('.memory-list, .memory-stats'),
        nav: !!document.querySelector('.nav-rail'),
        danger: !!document.querySelector('.danger-box'),
        agentCard: !!document.querySelector('.agent-card'),
        tabs: document.querySelectorAll('.nav-item').length,
        navIds: Array.from(document.querySelectorAll('.nav-item')).map(el => (el.getAttribute('title')||el.textContent||'').trim()).slice(0,10),
        pageTitle: (document.querySelector('.page-title')||{}).innerText || '',
        chatConnected: !!(document.querySelector('.connection-status.connected')),
        stateSource: !!document.querySelector('.state-source'),
        statusSections: Array.from(document.querySelectorAll('[data-section]')).map(el => el.getAttribute('data-section')),
        statusKinds: Array.from(document.querySelectorAll('[data-kind]')).map(el => el.getAttribute('data-kind')),
        lifeNav: Array.from(document.querySelectorAll('.nav-item')).some(el => (el.textContent||'').includes('L.I.F.E')),
        patchBadge: !!document.querySelector('.patch-badge'),
        errors: window.__errs || []
      })`,
      returnByValue: true,
    })
    console.log(name, result.value)
  }

  // Collect any page errors by reloading with listener
  await call('Runtime.evaluate', {
    expression: `window.__errs=[]; window.addEventListener('error', e=>window.__errs.push(String(e.message))); 'ok'`,
  })

  ws.close()
}

main().catch((e) => {
  console.error('FAIL', e.message)
  process.exit(1)
})
