import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/** Where the captured DeepSeek web credentials live. */
export function authFilePath() {
  return process.env.DEEPSEEK_WEB_AUTH_FILE || path.join(os.homedir(), '.dsh', 'web-login', 'deepseek-auth.json')
}

/**
 * Load the DeepSeek web login credentials. Accepts an explicit token via
 * DEEPSEEK_WEB_TOKEN, else reads the DSH plugin's captured auth JSON (a raw
 * token string or an object with token/authorization/cookie/extraHeaders).
 * Returns null when nothing usable is found.
 */
export function loadAuth() {
  let raw = {}
  try {
    raw = JSON.parse(fs.readFileSync(authFilePath(), 'utf8'))
  } catch {
    raw = {}
  }
  if (typeof raw === 'string') raw = { token: raw }
  const bearer = String(raw.token || raw.authorization || raw.accessToken || '').replace(/^Bearer\s+/i, '').trim()
  const token = (process.env.DEEPSEEK_WEB_TOKEN || '').replace(/^Bearer\s+/i, '').trim() || bearer
  if (!token) return null
  return {
    token,
    cookie: typeof raw.cookie === 'string' ? raw.cookie : '',
    userAgent: typeof raw.userAgent === 'string' ? raw.userAgent : '',
    hifDliq: raw.hifDliq || raw['x-hif-dliq'] || '',
    hifLeim: raw.hifLeim || raw['x-hif-leim'] || '',
    extraHeaders: raw.extraHeaders && typeof raw.extraHeaders === 'object' ? raw.extraHeaders : {},
    wasmUrl: typeof raw.wasmUrl === 'string' ? raw.wasmUrl : '',
  }
}
