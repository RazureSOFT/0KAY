/* CDP: model toggles + usage clear + plugin switch */
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
  const call = (m, p) => cdpCall(ws, id++, m, p)
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 2000))
  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true'); localStorage.setItem('0kay_lang','zh'); 'ok'`,
  })

  // Usage clear button
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/usage' })
  await new Promise((r) => setTimeout(r, 2000))
  const usage = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      clearBtn: [...document.querySelectorAll('button')].some(b => /清除用量|Clear usage/.test(b.textContent||'')),
      err: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('usage', usage.result.value)

  // Provider edit → model toggles
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/settings?tab=provider' })
  await new Promise((r) => setTimeout(r, 2500))
  const editClick = await call('Runtime.evaluate', {
    expression: `(() => {
      const b = [...document.querySelectorAll('button')].find(x => /编辑|Edit/.test(x.textContent||''));
      if (b) b.click();
      return !!b;
    })()`,
    returnByValue: true,
  })
  await new Promise((r) => setTimeout(r, 2500))
  const modelUi = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      clickedEdit: ${JSON.stringify(!!editClick.result.value)},
      hasToggles: document.querySelectorAll('.model-toggle-row').length,
      toggleNames: [...document.querySelectorAll('.model-toggle-name')].map(e => e.textContent.trim()),
      hasFetch: [...document.querySelectorAll('button')].some(b => /获取模型列表|Fetch models/.test(b.textContent||'')),
      runtimeFields: document.querySelectorAll('.provider-runtime .field').length,
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('model-toggles', modelUi.result.value)

  // Agent bool switch coercion
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/settings?tab=agent' })
  await new Promise((r) => setTimeout(r, 2500))
  const agent = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      toggles: document.querySelectorAll('.toggle-label input[type=checkbox]').length,
      checked: [...document.querySelectorAll('.toggle-label input[type=checkbox]')].map(e => e.checked),
      body: (document.querySelector('.settings-content')||{}).innerText?.slice(0,400) || '',
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('agent', agent.result.value)

  // Plugins switch present
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/plugins' })
  await new Promise((r) => setTimeout(r, 2000))
  const plugs = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      switches: document.querySelectorAll('.plugin-switch').length,
      labels: [...document.querySelectorAll('.plugin-switch-label')].map(e => e.textContent.trim()),
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('plugins', plugs.result.value)

  // searxng tab present in settings
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/settings?tab=searxng' })
  await new Promise((r) => setTimeout(r, 2000))
  const sx = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      body: (document.querySelector('.settings-content')||{}).innerText?.slice(0,300) || '',
      hasEngine: document.body.innerText.includes('搜索引擎') || document.body.innerText.includes('bing'),
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('searxng-tab', sx.result.value)

  ws.close()
}

main().catch((e) => {
  console.error('FAIL', e.message)
  process.exit(1)
})
