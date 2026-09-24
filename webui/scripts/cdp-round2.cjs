/* CDP round2 — wait for load, diagnose tabs/routes */
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
  const call = (m, p) => cdpCall(ws, id++, m, p)
  await call('Page.enable')
  await call('Runtime.enable')

  async function nav(url, waitMs = 3000) {
    await call('Page.navigate', { url })
    await new Promise((r) => setTimeout(r, waitMs))
  }
  async function evalJs(expr) {
    const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
    return r.result.value
  }

  await nav('http://127.0.0.1:3000/', 2500)
  await evalJs(`localStorage.setItem('0kay_wizard_complete','true'); localStorage.setItem('0kay_lang','zh'); 'ok'`)

  // Hard reload to ensure patches/routes registered
  await call('Page.reload', { ignoreCache: true })
  await new Promise((r) => setTimeout(r, 4000))

  const patches = await evalJs(`fetch('/api/ui/patches').then(r=>r.json()).then(d=>({files:d.files, router:(d.ops||[]).filter(o=>o.target==='router'), nav:(d.ops||[]).filter(o=>o.target==='nav'&&o.id==='agents')}))`)
  console.log('patches', JSON.stringify(patches))

  await nav('http://127.0.0.1:3000/agents', 3500)
  const agents = await evalJs(`JSON.stringify({
    path: location.pathname + location.search,
    agentsPage: !!document.querySelector('.agents-page'),
    patchPage: !!document.querySelector('.patch-page'),
    pageTitle: (document.querySelector('h1')||{}).innerText || '',
    navHasAgent: [...document.querySelectorAll('.nav-item')].some(e=>/Agent/.test(e.textContent||'')),
    body: (document.body.innerText||'').slice(0,180),
    errors: window.__errs || []
  })`)
  console.log('agents', agents)

  await nav('http://127.0.0.1:3000/settings?tab=provider', 4000)
  const prov = await evalJs(`JSON.stringify({
    path: location.pathname + location.search,
    activeNav: [...document.querySelectorAll('.settings-nav .nav-item.active')].map(e=>e.textContent.trim()),
    logos: document.querySelectorAll('.provider-logo,.provider-logo-fallback').length,
    logoSrcs: [...document.querySelectorAll('.provider-logo')].map(e=>e.getAttribute('src')),
    listCards: document.querySelectorAll('.provider-list-item').length,
    modelChips: document.querySelectorAll('.model-chip-card').length,
    toggles: document.querySelectorAll('.model-toggle-row').length,
    fetchBtns: [...document.querySelectorAll('button')].filter(b=>/获取模型列表|Fetch models/.test(b.textContent||'')).length,
    cardText: (document.querySelector('.settings-content')||{}).innerText?.slice(0,250) || '',
    errors: window.__errs || []
  })`)
  console.log('provider', prov)

  await nav('http://127.0.0.1:3000/settings?tab=searxng', 3500)
  const sx = await evalJs(`JSON.stringify({
    path: location.pathname + location.search,
    activeNav: [...document.querySelectorAll('.settings-nav .nav-item.active')].map(e=>e.textContent.trim()),
    body: (document.querySelector('.settings-content')||{}).innerText?.slice(0,300) || '',
    selectValue: (document.querySelector('.settings-content select')||{}).value || '',
    hasCnbing: (document.querySelector('.settings-content')||{}).innerText?.includes('cnbing') || false,
    errors: window.__errs || []
  })`)
  console.log('searxng', sx)

  await nav('http://127.0.0.1:3000/settings?tab=agent', 3500)
  const agentSec = await evalJs(`JSON.stringify({
    body: (document.querySelector('.settings-content')||{}).innerText?.slice(0,500) || '',
    hasSkills: (document.querySelector('.settings-content')||{}).innerText?.includes('技能') || false,
    toggles: document.querySelectorAll('.toggle-label input[type=checkbox]').length,
    checked: [...document.querySelectorAll('.toggle-label input[type=checkbox]')].map(e=>e.checked),
    errors: window.__errs || []
  })`)
  console.log('agent-sec', agentSec)

  await nav('http://127.0.0.1:3000/usage', 3000)
  const usage = await evalJs(`JSON.stringify({
    clearBtn: [...document.querySelectorAll('button')].some(b=>/清除用量|Clear usage|清除/.test(b.textContent||'')),
    buttons: [...document.querySelectorAll('button')].map(b=>(b.textContent||'').trim()).slice(0,8),
    errors: window.__errs || []
  })`)
  console.log('usage', usage)

  await nav('http://127.0.0.1:3000/plugins', 3000)
  const plugs = await evalJs(`JSON.stringify({
    switches: document.querySelectorAll('.plugin-switch').length,
    labels: [...document.querySelectorAll('.plugin-switch-label')].map(e=>e.textContent.trim()),
    cards: document.querySelectorAll('.plugin-card').length,
    errors: window.__errs || []
  })`)
  console.log('plugins', plugs)

  ws.close()
}

main().catch((e) => {
  console.error('FAIL', e.message)
  process.exit(1)
})
