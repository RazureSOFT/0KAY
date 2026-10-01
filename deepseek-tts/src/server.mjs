/**
 * 0KAY DeepSeek TTS service.
 *
 * A tiny loopback HTTP endpoint that LIFE (and the Core `/api/tts` proxy) call
 * to turn text into speech. Synthesis is done in-process by the vendored
 * DeepSeek web-TTS client (see src/deepseek/) — no external CLI and no
 * third-party runtime dependency.
 *
 *   POST /            {"text":"...","voice":"mira"} -> audio/wav bytes
 *   GET  /health      -> {"ok":true,...}
 *
 * Env:
 *   DEEPSEEK_TTS_PORT      listen port        (default 8792)
 *   DEEPSEEK_TTS_HOST      bind address       (default 127.0.0.1)
 *   DSTTS_VOICE            default voice      (default "mira")
 *   DS_TOKEN               DeepSeek userToken (fallback; the Settings value wins)
 *   OKAY_TTS_AUTOREGISTER  "0" disables pointing LIFE at this service on start
 */

import http from 'node:http'
import { registerWithCore, getSettings } from './register.mjs'
import { say, pcmToWav } from './deepseek/index.mjs'

const PORT = Number(process.env.DEEPSEEK_TTS_PORT || 8792)
const HOST = process.env.DEEPSEEK_TTS_HOST || '127.0.0.1'
const DEFAULT_VOICE = process.env.DSTTS_VOICE || 'mira'
const ENDPOINT = `http://${HOST}:${PORT}/`
const MAX_TEXT = 600

const log = (m) => console.log(`[deepseek-tts] ${m}`)

/** Synthesize text to a WAV buffer using the vendored DeepSeek client. */
async function synthesize(text, voice, token) {
  const result = await say({ text, voice, token, format: 'pcm' })
  if (!result?.audio || !result.audio.length) throw new Error('empty audio')
  return pcmToWav(result.audio)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 1 << 20) { req.destroy(); reject(new Error('body too large')); return }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function json(res, status, value) {
  const body = Buffer.from(JSON.stringify(value))
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': body.length })
  res.end(body)
}

function settingEnabled(value) {
  if (value === undefined || value === null || value === '') return true
  return !(value === false || value === 'false' || value === '0' || value === 0)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost')
  const settings = await getSettings()
  const token = String(settings.token || process.env.DS_TOKEN || '')
  const settingsVoice = String(settings.voice || DEFAULT_VOICE)

  if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/')) {
    return json(res, 200, { ok: true, service: 'deepseek-tts', voice: settingsVoice, token: !!token, enabled: settingEnabled(settings.enabled) })
  }
  if (req.method !== 'POST' || (url.pathname !== '/' && url.pathname !== '/tts')) {
    return json(res, 404, { error: 'not found' })
  }
  let text = ''
  let voice = settingsVoice
  try {
    const raw = await readBody(req)
    const body = raw ? JSON.parse(raw) : {}
    text = String(body.text || '').trim()
    voice = String(body.voice || settingsVoice).trim() || settingsVoice
  } catch (error) {
    return json(res, 400, { error: `bad request: ${error.message}` })
  }
  if (!text) return json(res, 400, { error: 'text is required' })
  if (!settingEnabled(settings.enabled)) return json(res, 503, { error: 'TTS disabled in settings' })
  if (!token) return json(res, 503, { error: 'DeepSeek userToken not set (Settings → DeepSeek TTS)' })
  try {
    const audio = await synthesize(text.slice(0, MAX_TEXT), voice, token)
    res.writeHead(200, { 'Content-Type': 'audio/wav', 'Content-Length': audio.length, 'Cache-Control': 'no-store' })
    res.end(audio)
  } catch (error) {
    log(`synth failed: ${error?.message || error}`)
    json(res, 502, { error: String(error?.message || error) })
  }
})

server.listen(PORT, HOST, () => {
  log(`listening on http://${HOST}:${PORT} -> ${ENDPOINT}`)
  try {
    registerWithCore(ENDPOINT, log)
  } catch (error) {
    log(`register error: ${error.message}`)
  }
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 500) })
}
