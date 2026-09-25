/* Smoke: /skills renders native management-page style (page-header, stat cards, plugin cards). */
const http = require('http')
const fs = require('fs')

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
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve)
    ws.addEventListener('error', reject)
  })
  let id = 0
  const call = (method, params) => cdpCall(ws, ++id, method, params)
  await call('Page.enable')
  await call('Runtime.enable')
  await call('Page.navigate', { url: 'http://127.0.0.1:3000/skills' })
  await new Promise((r) => setTimeout(r, 3500))
  const evalResult = await call('Runtime.evaluate', {
    expression: `(() => {
      const body = document.body ? document.body.innerText : ''
      const page = document.querySelector('.skills-page')
      const header = document.querySelector('.skills-page .page-header')
      const h1 = document.querySelector('.skills-page .page-header h1')
      const subtitle = document.querySelector('.skills-page .subtitle')
      const stats = document.querySelectorAll('.skills-page .stat-grid .stat-card')
      const cards = document.querySelectorAll('.skills-page .skill-grid .plugin-card')
      const style = document.getElementById('skillsguishow-style')
      const cs = page ? getComputedStyle(page) : null
      const card = cards[0] ? getComputedStyle(cards[0]) : null
      return JSON.stringify({
        path: location.pathname,
        hasPage: !!page,
        hasHeader: !!header && !!h1 && !!subtitle && body.includes('技能管理'),
        h1Size: h1 ? getComputedStyle(h1).fontSize : '',
        statCount: stats.length,
        cardCount: cards.length,
        hasUploadBtn: body.includes('上传技能'),
        hasSlashHint: body.includes('对话输入 /'),
        hasStyleTag: !!style,
        pageBg: cs ? cs.backgroundImage : '',
        pageBgColor: cs ? cs.backgroundColor : '',
        btnRadius: (() => { const b = document.querySelector('.skills-page .btn'); return b ? getComputedStyle(b).borderRadius : '' })(),
        cardRadius: card ? card.borderRadius : '',
        hasFail: body.includes('无法读取技能列表'),
      })
    })()`,
    returnByValue: true,
  })
  console.log(evalResult.result.value)
  const parsed = JSON.parse(evalResult.result.value)
  const ok =
    parsed.path === '/skills' &&
    parsed.hasPage && parsed.hasHeader &&
    parsed.statCount === 4 && parsed.cardCount >= 3 &&
    parsed.hasUploadBtn && parsed.hasSlashHint && parsed.hasStyleTag &&
    parsed.pageBg === 'none' && parsed.pageBgColor === 'rgb(255, 255, 255)' &&
    !parsed.btnRadius.includes('999') && parsed.cardRadius.startsWith('14') &&
    !parsed.hasFail
  const shot = await call('Page.captureScreenshot', { format: 'png' })
  fs.writeFileSync(__dirname + '/skills-ui.png', Buffer.from(shot.data, 'base64'))
  console.log('screenshot: scripts/skills-ui.png')
  if (!ok) {
    console.error('FAIL: skills page does not match native management-page style')
    process.exit(1)
  }
  console.log('SKILLS_UI_OK')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
