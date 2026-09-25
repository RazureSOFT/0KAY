import { describe, expect, it } from 'vitest'
import { ApiError, readApiResponse } from './api'

describe('readApiResponse', () => {
  it('parses a JSON body', async () => {
    const res = new Response(JSON.stringify({ plugins: [] }), { status: 200 })
    await expect(readApiResponse(res)).resolves.toEqual({ plugins: [] })
  })

  it('turns a non-JSON body into a readable error with its status', async () => {
    const res = new Response('404 page not found', { status: 404 })
    await expect(readApiResponse(res)).rejects.toThrowError(/404 page not found/)
    await expect(readApiResponse(new Response('404 page not found', { status: 404 })))
      .rejects.toMatchObject({ status: 404 })
  })

  it('surfaces the error field of a failed JSON response', async () => {
    const res = new Response(JSON.stringify({ error: 'github unreachable' }), { status: 502 })
    await expect(readApiResponse(res)).rejects.toThrowError('github unreachable')
  })

  it('handles empty bodies', async () => {
    await expect(readApiResponse(new Response('', { status: 200 }))).resolves.toBeNull()
  })

  it('exposes ApiError', () => {
    expect(new ApiError('x', 500)).toBeInstanceOf(Error)
  })
})
