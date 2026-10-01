/**
 * OpenAI-compatible loopback server in front of DeepSeek web.
 * mocr calls this as a normal OpenAI provider; it translates to chat.deepseek.com.
 */
import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { loadAuth } from './auth.mjs'
import { probe, streamCompletion, serializePrompt } from './deepseek.mjs'
import { registerProvider } from './register.mjs'

const PORT = Number(process.env.DEEPSEEK_WEB_PORT || 8792)
const MODELS = [
  { id: 'deepseek-web-chat', thinking: false },
  { id: 'deepseek-web-reasoner', thinking: true },
]

function send(res, status, body, headers = {}) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...headers })
  res.end(payload)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 8 * 1024 * 1024) {
        reject(new Error('body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function chunk(model, delta, finish = null) {
  return `data: ${JSON.stringify({
    id: `chatcmpl-${randomUUID()}`,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta, finish_reason: finish }],
  })}\n\n`
}

async function chatCompletions(req, res) {
  const auth = loadAuth()
  if (!auth) {
    send(res, 401, { error: { message: 'DeepSeek web is not logged in (no token). Set DEEPSEEK_WEB_TOKEN or capture it into ~/.dsh/web-login/deepseek-auth.json.', type: 'invalid_request_error' } })
    return
  }
  let body
  try {
    body = await readBody(req)
  } catch {
    send(res, 400, { error: { message: 'invalid JSON body', type: 'invalid_request_error' } })
    return
  }
  const model = String(body.model || 'deepseek-web-chat')
  const known = MODELS.find((m) => m.id === model)
  const thinking = known ? known.thinking : /reason|think/i.test(model)
  const prompt = serializePrompt(body.messages, body.tools)
  const controller = new AbortController()
  req.on('close', () => controller.abort())

  const id = `chatcmpl-${randomUUID()}`
  const created = Math.floor(Date.now() / 1000)
  try {
    if (body.stream) {
      res.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache',
        connection: 'keep-alive',
      })
      for await (const delta of streamCompletion(auth, { prompt, thinking, signal: controller.signal })) {
        if (delta.thinking) res.write(chunk(model, { reasoning_content: delta.thinking }))
        else if (delta.text) res.write(chunk(model, { content: delta.text }))
      }
      res.write(chunk(model, {}, 'stop'))
      res.write('data: [DONE]\n\n')
      res.end()
      return
    }
    let content = ''
    let reasoning = ''
    for await (const delta of streamCompletion(auth, { prompt, thinking, signal: controller.signal })) {
      if (delta.thinking) reasoning += delta.thinking
      else if (delta.text) content += delta.text
    }
    const message = { role: 'assistant', content }
    if (reasoning) message.reasoning_content = reasoning
    send(res, 200, {
      id,
      object: 'chat.completion',
      created,
      model,
      choices: [{ index: 0, message, finish_reason: 'stop' }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    })
  } catch (error) {
    if (res.headersSent) {
      res.end()
      return
    }
    send(res, 502, { error: { message: String(error?.message || error), type: 'upstream_error' } })
  }
}

const server = http.createServer((req, res) => {
  const url = req.url || '/'
  if (req.method === 'GET' && (url === '/health' || url === '/healthz')) {
    send(res, 200, { status: 'ok', service: 'deepseek-web' })
    return
  }
  if (req.method === 'GET' && url.startsWith('/v1/models')) {
    send(res, 200, { object: 'list', data: MODELS.map((m) => ({ id: m.id, object: 'model', created: 0, owned_by: 'deepseek-web' })) })
    return
  }
  if (req.method === 'POST' && url.startsWith('/v1/chat/completions')) {
    void chatCompletions(req, res)
    return
  }
  if (req.method === 'POST' && url.startsWith('/v1/probe')) {
    const auth = loadAuth()
    if (!auth) {
      send(res, 401, { ok: false, error: 'not logged in' })
      return
    }
    void probe(auth)
      .then((account) => send(res, 200, { ok: true, account }))
      .catch((error) => send(res, 200, { ok: false, error: String(error?.message || error) }))
    return
  }
  send(res, 404, { error: { message: `not found: ${req.method} ${url}` } })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[deepseek-web] OpenAI-compatible server on http://127.0.0.1:${PORT}/v1`)
  const refresh = () => {
    void registerProvider({ port: PORT, catalog: MODELS, log: console.log })
  }
  refresh()
  setInterval(refresh, 30 * 60 * 1000).unref()
})
