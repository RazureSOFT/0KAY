/**
 * 0KAY DeepSeek TTS service.
 *
 * A tiny loopback HTTP endpoint that LIFE (and the Core `/api/tts` proxy) call
 * to turn text into speech. It wraps the `deepseek-tts-api` CLI (`dstts`),
 * which synthesizes audio through DeepSeek's web "read aloud" feature.
 *
 *   POST /            {"text":"...","voice":"mira"} -> audio/wav bytes
 *   GET  /health      -> {"ok":true,...}
 *
 * Env:
 *   DEEPSEEK_TTS_PORT   listen port            (default 8792)
 *   DEEPSEEK_TTS_HOST   bind address           (default 127.0.0.1)
 *   DSTTS_BIN           CLI to run             (default "dstts"; e.g. "npx github:Eyeing0721/deepseek-tts-api")
 *   DSTTS_VOICE         default voice          (default "mira")
 *   DS_TOKEN            DeepSeek userToken     (required for synthesis)
 *   OKAY_TTS_AUTOREGISTER  "1" sets LIFE tts_endpoint on start (default on)
 */

import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawn } from 'node:child_process'
import { readFile, rm } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { registerWithCore } from './register.mjs'

const PORT = Number(process.env.DEEPSEEK_TTS_PORT || 8792)
const HOST = process.env.DEEPSEEK_TTS_HOST || '127.0.0.1'
const DEFAULT_VOICE = process.env.DSTTS_VOICE || 'mira'
const ENDPOINT = `http://${HOST}:${PORT}/`
const MAX_TEXT = 600

const log = (m) => console.log(`[deepseek-tts] ${m}`)

/** Split DSTTS_BIN so "npx github:..." works; extra args allowed. */
function dstrtsCommand() {
  const bin = process.env.DSTTS_BIN || 'dstts'
  return bin.split(/\s+/).filter(Boolean)
}

function synth(text, voice) {
  return new Promise((resolve, reject) => {
    const [cmd, ...prefix] = dstrtsCommand()
    const out = path.join(os.tmpdir(), `0kay-tts-${crypto.randomBytes(8).toString('hex')}.wav`)
    const args = [...prefix, 'say', text, '--voice', voice || DEFAULT_VOICE, '-o', out]
    const child = spawn(cmd, args, {
      env: { ...process.env },
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
    })
    let stderr = ''
    child.stderr?.on('data', (d) => { stderr += String(d) })
    const timer = setTimeout(() => { try { child.kill() } catch { /* ignore */ } }, 90000)
    child.once('error', (err) => { clearTimeout(timer); reject(err) })
    child.once('close', async (code) => {
      clearTimeout(timer)
      try {
        if (code !== 0) throw new Error(`dstts exited ${code}: ${stderr.trim().slice(-200)}`)
        const audio = await readFile(out)
        if (!audio.length) throw new Error('empty audio')
        resolve(audio)
      } catch (error) {
        reject(error)
      } finally {
        rm(out, { force: true }).catch(() => {})
      }
    })
  })
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost')
  if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/')) {
    return json(res, 200, { ok: true, service: 'deepseek-tts', voice: DEFAULT_VOICE, token: !!process.env.DS_TOKEN })
  }
  if (req.method !== 'POST' || (url.pathname !== '/' && url.pathname !== '/tts')) {
    return json(res, 404, { error: 'not found' })
  }
  let text = ''
  let voice = DEFAULT_VOICE
  try {
    const raw = await readBody(req)
    const body = raw ? JSON.parse(raw) : {}
    text = String(body.text || '').trim()
    voice = String(body.voice || DEFAULT_VOICE).trim() || DEFAULT_VOICE
  } catch (error) {
    return json(res, 400, { error: `bad request: ${error.message}` })
  }
  if (!text) return json(res, 400, { error: 'text is required' })
  if (!process.env.DS_TOKEN) return json(res, 503, { error: 'DS_TOKEN not set' })
  try {
    const audio = await synth(text.slice(0, MAX_TEXT), voice)
    res.writeHead(200, { 'Content-Type': 'audio/wav', 'Content-Length': audio.length, 'Cache-Control': 'no-store' })
    res.end(audio)
  } catch (error) {
    log(`synth failed: ${error.message}`)
    json(res, 502, { error: error.message })
  }
})

server.listen(PORT, HOST, () => {
  log(`listening on http://${HOST}:${PORT} -> ${ENDPOINT}`)
  if (!process.env.DS_TOKEN) {
    log('DS_TOKEN is not set; synthesis is disabled and LIFE tts_endpoint is not registered')
  } else if (process.env.OKAY_TTS_AUTOREGISTER !== '0') {
    registerWithCore(ENDPOINT, log).catch((error) => log(`register failed: ${error.message}`))
  }
})

// graceful shutdown
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => { server.close(() => process.exit(0)); delay(500).then(() => process.exit(0)) })
}
