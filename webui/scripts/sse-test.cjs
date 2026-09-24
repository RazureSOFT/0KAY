/* Direct SSE test against Core gateway */
const http = require('http')

const body = JSON.stringify({
  prompt: 'SSE streaming test',
  stream: true,
  session_id: 'sse_test',
  messages: [{ role: 'user', content: 'SSE streaming test' }],
})

const req = http.request(
  {
    host: '127.0.0.1',
    port: 8080,
    path: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Accept: 'text/event-stream',
    },
    timeout: 20000,
  },
  (res) => {
    console.log('status', res.statusCode)
    console.log('headers', JSON.stringify(res.headers))
    let buf = ''
    let chunkCount = 0
    const start = Date.now()
    res.on('data', (c) => {
      buf += c.toString()
      const parts = buf.split('\n\n')
      buf = parts.pop() || ''
      for (const p of parts) {
        chunkCount++
        const first = p.split('\n').filter(Boolean).slice(0, 2).join(' | ')
        console.log(`frame[${chunkCount}]`, first.slice(0, 200))
      }
    })
    res.on('end', () => {
      console.log('END frames=', chunkCount, 'ms=', Date.now() - start)
      process.exit(0)
    })
    res.on('error', (e) => {
      console.error('res error', e.message)
      process.exit(1)
    })
  }
)
req.on('error', (e) => {
  console.error('req error', e.message)
  process.exit(1)
})
req.on('timeout', () => {
  console.error('timeout')
  req.destroy()
  process.exit(1)
})
req.write(body)
req.end()
