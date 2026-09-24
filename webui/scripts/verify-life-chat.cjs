const http = require('http')
function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, (r) => {
      let d = ''
      r.on('data', (c) => (d += c))
      r.on('end', () => { try { res(JSON.parse(d)) } catch (e) { rej(e) } })
    }).on('error', rej)
  })
}
function cdpCall(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const h = (e) => {
      let m
      try { m = JSON.parse(e.data) } catch { return }
      if (m.id === id) {
        ws.removeEventListener('message', h)
        m.error ? reject(new Error(m.error.message)) : resolve(m.result)
      }
    }
    ws.addEventListener('message', h)
    ws.send(JSON.stringify({ id, method, params }))
    setTimeout(() => { ws.removeEventListener('message', h); reject(new Error('timeout ' + method)) }, 15000)
  })
}
;(async () => {
  const targets = await getJson('http://127.0.0.1:9333/json/list')
  const page = targets.find((t) => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
  let id = 1
  const call = (m, p) => cdpCall(ws, id++, m, p)
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 2500))
  await call('Runtime.evaluate', {
    expression: `localStorage.setItem('0kay_wizard_complete','true'); localStorage.setItem('0kay_lang','zh'); 'ok'`,
  })
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/' })
  await new Promise((r) => setTimeout(r, 2500))
  const home = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      chat: !!document.querySelector('.chat-panel'),
      stage: !!document.querySelector('.stage-column'),
      status: !!document.querySelector('[data-section="mood"]'),
      navIds: Array.from(document.querySelectorAll('.nav-rail .nav-item')).map(el => (el.textContent||'').trim()),
      navLabels: [...document.querySelectorAll('.nav-label')].map(e => e.textContent.trim()),
      activeNav: (document.querySelector('.nav-item.active .nav-label')||{}).textContent?.trim() || '',
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('home', home.result.value)
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/settings' })
  await new Promise((r) => setTimeout(r, 2500))
  const settings = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      tabs: Array.from(document.querySelectorAll('.settings-nav .nav-item')).map(el => (el.textContent||'').trim()),
      tabCount: document.querySelectorAll('.settings-nav .nav-item').length,
      hasModelsTab: Array.from(document.querySelectorAll('.settings-nav .nav-item')).some(el => /模型|Models/i.test(el.textContent||'')),
      lifeTabs: Array.from(document.querySelectorAll('.settings-nav .nav-item')).filter(el => /L\\.I\\.F\\.E|life/i.test(el.textContent||'')).map(el => (el.textContent||'').trim()),
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('settings', settings.result.value)
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/settings?tab=permissions' })
  await new Promise((r) => setTimeout(r, 2000))
  const perms = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      h2: (document.querySelector('.content-card h2')||{}).innerText||'',
      hasPluginLifeDesc: document.body.innerText.includes('persona plugin permissions'),
      hasScreen: document.body.innerText.includes('屏幕监听'),
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('perms', perms.result.value)
  // plugins enable/disable buttons + agent detail
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/plugins' })
  await new Promise((r) => setTimeout(r, 2000))
  const plugins = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      hasSwitch: !!document.querySelector('.plugin-switch'),
      hasToggleLabel: [...document.querySelectorAll('.plugin-switch-label')].map(e => e.textContent.trim()),
      cardCount: document.querySelectorAll('.plugin-card').length,
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('plugins', plugins.result.value)
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/agents' })
  await new Promise((r) => setTimeout(r, 2500))
  const agents = await call('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('.agent-card');
      if (card) card.click();
      return JSON.stringify({ clicked: !!card, hasCard: !!card });
    })()`,
    returnByValue: true,
  })
  await new Promise((r) => setTimeout(r, 800))
  const agents2 = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      modal: !!document.querySelector('.agent-modal'),
      modalText: (document.querySelector('.agent-modal')||{}).innerText?.slice(0,300) || '',
      errors: window.__errs || []
    })`,
    returnByValue: true,
  })
  console.log('agents', agents.result.value, agents2.result.value)
  ws.close()
})().catch((e) => { console.error('FAIL', e.message); process.exit(1) })
