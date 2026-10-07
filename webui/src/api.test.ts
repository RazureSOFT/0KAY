import { describe, expect, it } from 'vitest'
import { readSSE, SSEError, streamSSE, type SSEvent } from './api'

/**
 * Minimal Response stand-in. The repo has no DOM environment (no jsdom), and
 * readSSE only needs `ok`, `status` and a `body.getReader()`, so a hand-rolled
 * double keeps the test in plain node.
 */
function fakeResponse(chunks: string[], init: { ok?: boolean; status?: number } = {}) {
  const encoder = new TextEncoder()
  let i = 0
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    body: {
      getReader() {
        return {
          read() {
            if (i >= chunks.length) return Promise.resolve({ done: true, value: undefined })
            const value = encoder.encode(chunks[i++])
            return Promise.resolve({ done: false, value })
          },
          cancel() {
            return Promise.resolve()
          },
        }
      },
    },
  } as unknown as Response
}

async function collect(chunks: string[]): Promise<SSEvent[]> {
  const seen: SSEvent[] = []
  await readSSE(fakeResponse(chunks), (event) => seen.push(event))
  return seen
}

describe('readSSE', () => {
  it('parses a single-frame stream', async () => {
    const seen = await collect(['event: chunk\ndata: {"a":1}\n\n'])
    expect(seen).toEqual([{ event: 'chunk', data: '{"a":1}', id: undefined }])
  })

  it('parses several frames from one chunk', async () => {
    const seen = await collect(['event: a\ndata: 1\n\nevent: b\ndata: 2\n\n'])
    expect(seen.map((e) => e.event)).toEqual(['a', 'b'])
    expect(seen.map((e) => e.data)).toEqual(['1', '2'])
  })

  it('reassembles a frame split across chunks', async () => {
    // The chunk boundary lands mid-frame, which is the normal case for a stream.
    const seen = await collect(['event: chunk\ndata: {"val', 'ue":"x"}\n\n'])
    expect(seen).toHaveLength(1)
    expect(JSON.parse(seen[0].data)).toEqual({ value: 'x' })
  })

  // This is the regression the old ad-hoc parser in chat.ts had: it matched
  // /^data:\s*(.+)$/m, whose `.` stops at the newline, so any frame carrying a
  // real newline in its payload was silently dropped on JSON.parse failure.
  it('joins multi-line data payloads instead of truncating them', async () => {
    const payload = JSON.stringify({ message: 'line one\nline two' })
    const seen = await collect([`event: log\ndata: ${payload}\n\n`])
    expect(seen).toHaveLength(1)
    expect(JSON.parse(seen[0].data)).toEqual({ message: 'line one\nline two' })
  })

  it('joins repeated data: lines with a newline, per the SSE spec', async () => {
    const seen = await collect(['event: log\ndata: first\ndata: second\n\n'])
    expect(seen[0].data).toBe('first\nsecond')
  })

  it('ignores comment frames used as heartbeats', async () => {
    const seen = await collect([': heartbeat\n\nevent: log\ndata: x\n\n: heartbeat\n\n'])
    expect(seen).toHaveLength(1)
    expect(seen[0].event).toBe('log')
  })

  it('treats CRLF framing the same as LF', async () => {
    const seen = await collect(['event: chunk\r\ndata: {"a":1}\r\n\r\n'])
    expect(seen).toHaveLength(1)
    expect(JSON.parse(seen[0].data)).toEqual({ a: 1 })
  })

  it('strips only the single leading space after the colon', async () => {
    // Two spaces means the value genuinely starts with one space.
    const seen = await collect(['event: log\ndata:  padded\n\n'])
    expect(seen[0].data).toBe(' padded')
  })

  it('defaults the event name to message', async () => {
    const seen = await collect(['data: bare\n\n'])
    expect(seen[0].event).toBe('message')
  })

  it('carries the id field through', async () => {
    const seen = await collect(['id: 42\nevent: log\ndata: x\n\n'])
    expect(seen[0].id).toBe('42')
  })

  it('dispatches a final frame that has no trailing blank line', async () => {
    const seen = await collect(['event: log\ndata: tail'])
    expect(seen).toHaveLength(1)
    expect(seen[0].data).toBe('tail')
  })

  it('rejects a non-ok response with the status attached', async () => {
    await expect(
      readSSE(fakeResponse([], { ok: false, status: 503 }), () => {}),
    ).rejects.toBeInstanceOf(SSEError)
    await expect(
      readSSE(fakeResponse([], { ok: false, status: 503 }), () => {}),
    ).rejects.toMatchObject({ status: 503 })
  })

  it('stays quiet when the caller aborts', async () => {
    const controller = new AbortController()
    controller.abort()
    const reader = {
      read: () => Promise.reject(new Error('aborted')),
      cancel: () => Promise.resolve(),
    }
    const res = {
      ok: true,
      status: 200,
      body: { getReader: () => reader },
    } as unknown as Response
    await expect(readSSE(res, () => {}, controller.signal)).resolves.toBeUndefined()
  })
})

describe('streamSSE', () => {
  it('requests the SSE content type and reports a failed status', async () => {
    const original = globalThis.fetch
    let seenAccept = ''
    globalThis.fetch = (async (_input: unknown, init?: RequestInit) => {
      seenAccept = String((init?.headers as Record<string, string>)?.Accept ?? '')
      return fakeResponse([], { ok: false, status: 404 })
    }) as typeof fetch
    try {
      await expect(streamSSE('/api/console/stream', () => {})).rejects.toMatchObject({ status: 404 })
      expect(seenAccept).toBe('text/event-stream')
    } finally {
      globalThis.fetch = original
    }
  })
})
