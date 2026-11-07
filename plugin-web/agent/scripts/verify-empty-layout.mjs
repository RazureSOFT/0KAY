// Does the empty-state CSS actually put the greeting directly above the input,
// as one centred group?
//
// The real app does not mount in this headless browser (a pre-existing problem,
// tracked separately), so this renders the same DOM shape with the same rules —
// scoped stylesheet inlined — and measures the result. It tests the layout, not
// the app.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../../..')
const bundle = fs.readFileSync(path.join(repo, 'core/data/plugin-ui/agent/index.js'), 'utf8')

// Pull the empty-state rules out of the built bundle: that is what actually
// ships, so a rule that failed to compile cannot pass this test.
const rules = []
// Two sets: the empty-state rules, and the banner mark (which lives outside the
// empty-state block because the greeting also appears mid-conversation).
const re = /((?:#[^{}]*)?\.conversation\.is-empty[^{}]*|\.welcome[^{}]*:before[^{}]*)\{([^}]*)\}/g
let match
while ((match = re.exec(bundle))) {
  rules.push(`${match[1].replace(/\[data-v-[0-9a-f]+\]/g, '')}{${match[2]}}`)
}
if (!rules.length) {
  console.error('FAIL: no .is-empty rules found in the bundle')
  process.exit(1)
}
console.log(`found ${rules.length} empty-state rules`)

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;height:100%}
  body{font:14px system-ui;background:#fbf8ff;color:#1b1b1f}
  /* The two structural rules the app relies on and that my changes do not
     touch; copied so the measurement matches the real container. */
  #app,.workspace{display:flex;flex-direction:column;height:100%}
  .conversation{flex:1;display:flex;flex-direction:column;height:900px;padding:18px 20px 22px;box-sizing:border-box}
  .transcript{flex:1;min-height:0;overflow-y:auto}
  .welcome{text-align:center;color:#5f5f6a}
  .welcome::before{content:'';display:block}
  .welcome h2{color:#1b1b1f}
  .composer{border:1px solid #ccc;border-radius:28px;background:#fff;padding:14px}
  .composer-input textarea{border:0;width:100%;resize:none;font:inherit}
  ${rules.join('\n  ')}
</style></head>
<body>
  <div id="app"><main class="workspace">
  <section class="conversation is-empty">
    <div class="transcript">
      <div class="welcome">
        <h2>你好，让我们开始聊天吧</h2>
        <p>Describe what you want done.</p>
        <p>It will use the workspace you picked.</p>
        <p>This third line is hidden in the empty state.</p>
      </div>
    </div>
    <form class="composer"><div class="composer-input"><textarea rows="3">给 0KAY 发送消息</textarea></div></form>
  </section>
  </main></div>
</body></html>`

const fixture = path.join(here, '.empty-state-fixture.html')
fs.writeFileSync(fixture, html)

const BASE = process.env.BROWSER_DEBUG_URL || 'http://127.0.0.1:9224'
const r = await fetch(`${BASE}/json/new?about:blank`, { method: 'PUT' })
const t = await r.json()
const ws = new WebSocket(t.webSocketDebuggerUrl)
const p = new Map()
let id = 0
await new Promise(res => { ws.onopen = res })
ws.onmessage = e => {
  const m = JSON.parse(e.data)
  if (m.id && p.has(m.id)) {
    const { res, rej } = p.get(m.id)
    p.delete(m.id)
    m.error ? rej(new Error(m.error.message)) : res(m.result)
  }
}
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id
  p.set(i, { res, rej })
  ws.send(JSON.stringify({ id: i, method, params }))
})

await send('Runtime.enable')
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: 'file:///' + fixture.split(path.sep).join('/') })
await new Promise(res => setTimeout(res, 1200))

const expr = `
(function () {
  var conv = document.querySelector('.conversation');
  var welcome = conv.querySelector('.welcome');
  var composer = conv.querySelector('.composer');
  var third = conv.querySelectorAll('.welcome p')[2];
  var markStyle = getComputedStyle(welcome, '::before');
  var mark = (markStyle.backgroundImage || '') + ' ' + (markStyle.content || '');
  var c = conv.getBoundingClientRect();
  var w = welcome.getBoundingClientRect();
  var m = composer.getBoundingClientRect();
  return JSON.stringify({
    gapBetween: Math.round(m.top - w.bottom),
    spaceAbove: Math.round(w.top - c.top),
    spaceBelow: Math.round(c.bottom - m.bottom),
    centringDelta: Math.round((w.top - c.top) - (c.bottom - m.bottom)),
    widthDelta: Math.round(Math.abs(w.width - m.width)),
    composerWidth: Math.round(m.width),
    thirdLineHidden: third ? getComputedStyle(third).display : 'missing',
    mark: mark.indexOf('okay-logo.svg') >= 0 ? 'logo' : mark.slice(0, 80),
  });
})()
`
const out = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
const result = JSON.parse(out.result.value)
console.log(JSON.stringify(result, null, 1))

const shot = await send('Page.captureScreenshot', { format: 'png' })
const shotPath = process.env.SHOT_PATH || path.join(here, '.empty-state.png')
fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'))

// Assertions: the group is together and centred.
const problems = []
if (result.gapBetween < 0 || result.gapBetween > 40) problems.push(`gap between banner and input is ${result.gapBetween}px (want 0..40)`)
if (Math.abs(result.centringDelta) > 60) problems.push(`group is not centred (delta ${result.centringDelta}px)`)
// The greeting is a shorter measure than the input on purpose: a sentence reads
// badly at 720px, a textarea does not. Only a wildly different width is a bug.
if (result.widthDelta > 180) problems.push(`banner and input differ in width by ${result.widthDelta}px`)
if (result.thirdLineHidden !== 'none') problems.push('the guidance line is still visible')
if (result.mark !== 'logo') problems.push(`the banner is not the product mark: ${result.mark}`)
if (result.spaceBelow > 700) problems.push('input is still pinned to the bottom')

console.log(problems.length ? 'FAIL:\n  ' + problems.join('\n  ') : 'PASS: banner sits directly above the input, group is centred')
ws.close()
process.exit(problems.length ? 1 : 0)
