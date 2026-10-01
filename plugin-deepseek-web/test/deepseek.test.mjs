import test from 'node:test'
import assert from 'node:assert/strict'
import { parseSSE, serializePrompt, envelopeError, buildHeaders } from '../src/deepseek.mjs'

function streamOf(chunks) {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(new TextEncoder().encode(chunk))
      controller.close()
    },
  })
}

test('parseSSE handles fragments, -1/content and bare v', async () => {
  const body = streamOf([
    'data: {"p":"response/fragments","o":"APPEND","v":[{"type":"THINK","content":"think1"}]}\n\n',
    'data: {"p":"response/fragments","o":"APPEND","v":[{"type":"RESPONSE","content":"hi"}]}\n\n',
    'data: {"p":"response/fragments/-1/content","v":" there"}\n\n',
    'data: {"v":"!"}\n\n',
  ])
  const out = []
  for await (const delta of parseSSE(body)) out.push(delta)
  assert.deepEqual(out, [{ thinking: 'think1' }, { text: 'hi' }, { text: ' there' }, { text: '!' }])
})

test('serializePrompt labels roles and appends tools', () => {
  const prompt = serializePrompt(
    [
      { role: 'system', content: 'sys' },
      { role: 'user', content: 'hi' },
    ],
    [{ function: { name: 'read' } }],
  )
  assert.match(prompt, /System: sys/)
  assert.match(prompt, /User: hi/)
  assert.match(prompt, /Tools .*"name":"read"/)
})

test('envelopeError reads outer code and nested biz_code', () => {
  assert.equal(envelopeError({ code: 0, data: {} }), undefined)
  assert.deepEqual(envelopeError({ code: 40003, msg: 'Authorization Failed' }), { code: 40003, msg: 'Authorization Failed' })
  assert.deepEqual(envelopeError({ code: 0, data: { biz_code: 5, biz_msg: 'user is muted' } }), { code: 5, msg: 'user is muted' })
})

test('buildHeaders sets authorization and drops stale pow header', () => {
  const headers = buildHeaders({ token: 'abc', extraHeaders: { 'x-ds-pow-response': 'stale', 'x-custom': '1' } })
  assert.equal(headers.authorization, 'Bearer abc')
  assert.equal(headers['x-ds-pow-response'], undefined)
  assert.equal(headers['x-custom'], '1')
})
