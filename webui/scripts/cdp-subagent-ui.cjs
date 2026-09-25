/* Seed a consistent subagent fixture, then verify card + drill-down + back. */
const http = require('http')
const crypto = require('crypto')

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

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body)
    const req = http.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, (res) => {
      let d = ''
      res.on('data', (c) => (d += c))
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`POST ${url} -> ${res.statusCode} ${d}`))
        else resolve(d)
      })
    })
    req.on('error', reject)
    req.end(data)
  })
}

async function ensureFixture() {
  const data = await getJson('http://127.0.0.1:8080/api/tasks')
  const rows = data.tasks || []
  const byId = new Map(rows.map((t) => [t.task_id, t]))
  // A usable fixture needs marker + parent turn agreeing on session_id (core's
  // startup upgrade rewrites agent rows whose session lacks an agent-session: prefix).
  const marker = rows.find((t) => t.kind === 'subagent' && byId.get(t.parent_id)?.kind === 'agent' && byId.get(t.parent_id).session_id === t.session_id)
  const turn = marker ? byId.get(marker.parent_id) : null
  let needle = '最终调研结论'
  if (marker?.result) {
    needle = String(marker.result).replace(/^"|"$/g, '').slice(0, 12) || needle
  }

  const base = { caller_id: 'webui', state: 'done' }
  let sid
  let turnId
  if (turn) {
    sid = turn.session_id
    turnId = turn.task_id
  } else {
    sid = `agent-session:subui-${crypto.randomUUID()}`
    turnId = `agent-task-${crypto.randomUUID()}`
    const markerId = `${turnId}:sub:${crypto.randomUUID()}`
    await postJson('http://127.0.0.1:8080/api/tasks', { ...base, session_id: sid, task_id: sid, kind: 'agent_session', prompt: 'Subagent card smoke' })
    await postJson('http://127.0.0.1:8080/api/tasks', { ...base, session_id: sid, task_id: turnId, kind: 'agent', prompt: '调研 razureink 的公开资料来源', result: '"调研完成"' })
    await postJson('http://127.0.0.1:8080/api/tasks', { ...base, session_id: sid, task_id: markerId, kind: 'subagent', parent_id: turnId, prompt: '调研 razureink 的公开资料来源（子 Agent）', result: '"最终调研结论：来源已交叉验证，结论可信"' })
    await postJson('http://127.0.0.1:8080/api/tasks', { ...base, session_id: sid, task_id: `agent-model:${crypto.randomUUID()}`, kind: 'think', parent_id: markerId, prompt: 'deepseek-chat · thinking', result: '已检索并交叉验证来源…' })
    await postJson('http://127.0.0.1:8080/api/tasks', { ...base, session_id: sid, task_id: `agent-tool:${crypto.randomUUID()}`, kind: 'tool', parent_id: markerId, prompt: 'web_search', result: '{"success":true,"data":"3 条结果"}' })
  }
  if (!rows.some((r) => r.session_id === sid && r.kind === 'agent_session' && r.state !== 'deleted')) {
    await postJson('http://127.0.0.1:8080/api/tasks', { ...base, session_id: sid, task_id: sid, kind: 'agent_session', prompt: 'Subagent card smoke' })
  }

  const toolRows = [
    {
      task_id: `toolui:${turnId}:websearch`, kind: 'tool', parent_id: turnId, session_id: sid, prompt: 'websearch',
      args: '{"query":"Vue Vapor Mode status 2025"}',
      result: '{"success":true,"data":{"query":"Vue Vapor Mode status 2025","engine":"searxng","results":[{"title":"Vue Vapor Mode","url":"https://vuejs.org/guide/extras/reactivity-in-depth","snippet":"Vapor mode removes the virtual DOM overhead."}]}}',
    },
    {
      task_id: `toolui:${turnId}:bash`, kind: 'tool', parent_id: turnId, session_id: sid, prompt: 'bash',
      args: '{"command":"node -e 42"}',
      result: '{"success":true,"data":{"cwd":"C:\\\\work","stdout":"42\\n","stderr":"","exitCode":0,"truncated":false}}',
    },
    {
      task_id: `toolui:${turnId}:write`, kind: 'tool', parent_id: turnId, session_id: sid, prompt: 'write',
      args: '{"filePath":"demo.txt"}',
      result: '{"success":true,"data":{"path":"C:\\\\work\\\\demo.txt","created":false,"bytes":120,"lines":6}}',
    },
  ]
  for (const row of toolRows) await postJson('http://127.0.0.1:8080/api/tasks', { ...base, ...row })
  return { sid, needle }
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
  const { sid: sessionId, needle } = await ensureFixture()
  console.log('fixture session', sessionId, 'needle', needle)

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

  let found
  for (let attempt = 0; attempt < 3; attempt++) {
    await call('Page.navigate', { url: 'http://127.0.0.1:3000/agents' })
    await new Promise((r) => setTimeout(r, 3000))
    await call('Runtime.evaluate', {
      expression: `localStorage.setItem('0kay.agent.selected', ${JSON.stringify(sessionId)}); localStorage.setItem('0kay_wizard_complete','true'); 'ok'`,
    })
    await call('Page.navigate', { url: 'http://127.0.0.1:3000/agents' })
    await new Promise((r) => setTimeout(r, 3500))
    found = await call('Runtime.evaluate', {
      expression: `JSON.stringify({
      cards: document.querySelectorAll('.subagent-card').length,
      turns: document.querySelectorAll('.turn').length,
      stepsDetails: document.querySelectorAll('.steps details').length,
      transcript: (document.querySelector('.transcript')?.innerText || '').slice(0, 300)
    })`,
      returnByValue: true,
    })
    if (Number(JSON.parse(found.result.value).cards) >= 1) break
  }
  console.log('layout', found.result.value)
  if (Number(JSON.parse(found.result.value).cards) < 1) {
    console.log('SUBAGENT_UI_FAIL (no card)')
    process.exit(1)
  }

  const enter = await call('Runtime.evaluate', {
    expression: `(() => {
      const head = document.querySelector('.subagent-card .subagent-card-head')
      if (!head) return 'no-card'
      head.click()
      return 'clicked'
    })()`,
    returnByValue: true,
  })
  console.log('enter', enter.result.value)

  await new Promise((r) => setTimeout(r, 500))
  const view = await call('Runtime.evaluate', {
    expression: `JSON.stringify({
      subView: !!document.querySelector('.sub-view'),
      back: document.querySelector('.sub-view-header button')?.textContent?.trim() || '',
      request: (document.querySelector('.sub-view .message.request')?.innerText || '').slice(0, 120),
      hasFinal: (document.querySelector('.sub-view-body')?.innerText || '').includes(${JSON.stringify(needle)}),
      composerHidden: !document.querySelector('.composer')
    })`,
    returnByValue: true,
  })
  console.log('view', view.result.value)

  const parsed = JSON.parse(view.result.value)
  if (!parsed.subView || !parsed.request || !parsed.hasFinal || !parsed.composerHidden) {
    console.log('SUBAGENT_UI_FAIL (drill view incomplete)')
    process.exit(1)
  }

  const back = await call('Runtime.evaluate', {
    expression: `(() => { document.querySelector('.sub-view-header button')?.click(); return 'back' })()`,
    returnByValue: true,
  })
  console.log('back', back.result.value)
  await new Promise((r) => setTimeout(r, 400))
  const returned = await call('Runtime.evaluate', {
    expression: `JSON.stringify({ subView: !!document.querySelector('.sub-view'), cards: document.querySelectorAll('.subagent-card').length })`,
    returnByValue: true,
  })
  console.log('returned', returned.result.value)

  const after = JSON.parse(returned.result.value)
  if (after.subView || after.cards <= 0) {
    console.log('SUBAGENT_UI_FAIL')
    process.exit(1)
  }

  const tools = await call('Runtime.evaluate', {
    expression: `(async () => {
      const cards = [...document.querySelectorAll('.tool-card')]
      const summary = (needle) => (cards.find(c => (c.querySelector('.tool-summary')?.textContent || '').includes(needle)) || null)
      const search = summary('Vue Vapor')
      const bash = summary('node -e 42')
      const write = summary('demo.txt')
      const out = {
        total: cards.length,
        search: !!search,
        bash: !!bash,
        write: !!write,
        writeStat: write?.querySelector('.tool-stat')?.textContent || '',
        searchLabel: search?.querySelector('.tool-kind')?.textContent || '',
      }
      if (bash) bash.querySelector('.tool-card-head').click()
      await new Promise((r) => setTimeout(r, 350))
      if (bash) out.bashExpanded = (bash.querySelector('.tool-card-body')?.innerText || '').includes('42')
      if (search) search.querySelector('.tool-card-head').click()
      await new Promise((r) => setTimeout(r, 350))
      if (search) {
        out.dialog = !!document.querySelector('.tool-dialog')
        out.results = document.querySelectorAll('.tool-search-results li').length
      }
      return JSON.stringify(out)
    })()`,
    awaitPromise: true,
    returnByValue: true,
  })
  console.log('tools', tools.result.value)

  const toolState = JSON.parse(tools.result.value)
  const dialogClose = await call('Runtime.evaluate', {
    expression: `(async () => {
      document.querySelector('.tool-dialog header button')?.click()
      await new Promise((r) => setTimeout(r, 350))
      return JSON.stringify({ dialogGone: !document.querySelector('.tool-dialog') })
    })()`,
    awaitPromise: true,
    returnByValue: true,
  })
  console.log('dialog-close', dialogClose.result.value)

  if (toolState.total >= 3 && toolState.search && toolState.bash && toolState.write &&
      toolState.bashExpanded && toolState.dialog && toolState.results >= 1 &&
      JSON.parse(dialogClose.result.value).dialogGone) {
    console.log('SUBAGENT_UI_OK')
    process.exit(0)
  }
  console.log('SUBAGENT_UI_FAIL (tool cards)')
  process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
