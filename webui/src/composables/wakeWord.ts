import { ref } from 'vue'

export type WakeStatus = 'off' | 'listening' | 'woken' | 'capturing' | 'error'
export type WakeEngine = 'core' | 'browser' | ''
export type WakeFailure = 'no-nickname' | 'no-engine' | 'mic-denied' | 'error'

export interface WakeConfig {
  nicknames: string[]
  language: string
  onWake: (heard: string) => void
  onUtterance: (text: string) => void
  onHeard?: (text: string) => void
  onError?: (reason: WakeFailure, detail?: string) => void
}

export const wakeStatus = ref<WakeStatus>('off')
export const wakeEngine = ref<WakeEngine>('')
export const wakeHeard = ref('')

const CHUNK_MS = 2_600
const FOLLOW_MAX_MS = 9_000
const SILENCE_MS = 850
const SILENCE_RMS = 0.012
const SPEECH_RMS = 0.02

let config: WakeConfig | null = null
let stream: MediaStream | null = null
let audioCtx: AudioContext | null = null
let stopped = true
let muted = false
let recognition: any = null
let browserPhase: 'wake' | 'capture' = 'wake'
let browserBuffer = ''

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s\u3000]+/g, '')
    .replace(/[，。！？、,.!?~～…:：;；"'“”‘’()（）[\]【】<>《》\-—_/\\]+/g, '')
}

function matchNickname(text: string, nicknames: string[]): boolean {
  const heard = normalize(text)
  if (!heard) return false
  return nicknames.some((name) => {
    const target = normalize(name)
    return target.length > 0 && heard.includes(target)
  })
}

function pickMime(): string {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  if (typeof MediaRecorder === 'undefined') return ''
  for (const candidate of candidates) {
    if (MediaRecorder.isTypeSupported?.(candidate)) return candidate
  }
  return ''
}

async function coreConfigured(): Promise<boolean> {
  try {
    const res = await fetch('/api/asr', { signal: AbortSignal.timeout(5_000) })
    if (!res.ok) return false
    const data = await res.json()
    return !!data.configured
  } catch {
    return false
  }
}

async function transcribe(blob: Blob): Promise<{ text: string; configured: boolean }> {
  const form = new FormData()
  const type = blob.type || 'audio/webm'
  const ext = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : type.includes('wav') ? 'wav' : 'webm'
  form.append('audio', blob, `chunk.${ext}`)
  if (config?.language) form.append('language', config.language)
  const res = await fetch('/api/asr', { method: 'POST', body: form })
  if (res.status === 503) return { text: '', configured: false }
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return { text: String(data.text || ''), configured: true }
}

function analyser(streamRef: MediaStream): { read: () => number; close: () => void } {
  const Ctor = window.AudioContext || (window as any).webkitAudioContext
  audioCtx = new Ctor()
  const source = audioCtx.createMediaStreamSource(streamRef)
  const node = audioCtx.createAnalyser()
  node.fftSize = 1024
  source.connect(node)
  const buffer = new Float32Array(node.fftSize)
  return {
    read() {
      node.getFloatTimeDomainData(buffer)
      let sum = 0
      for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i]
      return Math.sqrt(sum / buffer.length)
    },
    close() {
      try { source.disconnect() } catch { }
      try { audioCtx?.close() } catch { }
      audioCtx = null
    },
  }
}

interface Recording {
  blob: Promise<Blob | null>
  cancel: () => void
}

function startRecording(maxMs: number, stopOnSilence = false): Recording {
  let cancel = () => {}
  const blob = new Promise<Blob | null>((resolve) => {
    if (!stream || typeof MediaRecorder === 'undefined') { resolve(null); return }
    const mime = pickMime()
    let recorder: MediaRecorder
    try {
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
    } catch {
      resolve(null)
      return
    }
    const parts: BlobPart[] = []
    const meter = stopOnSilence ? analyser(stream) : null
    let speechAt = 0
    let silenceSince = 0
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      if (meter) meter.close()
      clearTimeout(cap)
      clearInterval(poll)
      try { if (recorder.state !== 'inactive') recorder.stop() } catch { }
    }
    cancel = finish
    const cap = setTimeout(finish, maxMs)
    const poll = setInterval(() => {
      if (!meter) return
      const rms = meter.read()
      const now = Date.now()
      if (rms >= SPEECH_RMS) {
        speechAt = now
        silenceSince = 0
        return
      }
      if (!speechAt || now - speechAt < 500) return
      if (rms > SILENCE_RMS) { silenceSince = 0; return }
      if (!silenceSince) silenceSince = now
      else if (now - silenceSince >= SILENCE_MS) finish()
    }, 80)

    recorder.ondataavailable = (event) => { if (event.data && event.data.size) parts.push(event.data) }
    recorder.onstop = () => {
      if (meter) meter.close()
      resolve(parts.length ? new Blob(parts, { type: recorder.mimeType || mime || 'audio/webm' }) : null)
    }
    try { recorder.start() } catch { finish(); resolve(null) }
  })
  return { blob, cancel: () => cancel() }
}

function chime(): void {
  try {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new Ctor()
    const now = ctx.currentTime
    for (const [index, frequency] of [660, 880].entries()) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, now + index * 0.09)
      gain.gain.exponentialRampToValueAtTime(0.06, now + index * 0.09 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.13)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + index * 0.09)
      osc.stop(now + index * 0.09 + 0.15)
    }
    setTimeout(() => { try { void ctx.close() } catch { } }, 600)
  } catch { }
}

async function wakeUp(heard: string): Promise<void> {
  if (!config || stopped) return
  wakeStatus.value = 'woken'
  chime()
  config.onWake(heard)
  wakeStatus.value = 'capturing'
  const blob = await startRecording(FOLLOW_MAX_MS, true).blob
  if (stopped) return
  if (blob && blob.size > 2_000) {
    try {
      const result = await transcribe(blob)
      const text = result.text.trim()
      if (text) {
        wakeHeard.value = text
        config?.onUtterance(text)
      }
    } catch { }
  }
  if (!stopped && wakeEngine.value === 'core') wakeStatus.value = 'listening'
}

async function coreLoop(): Promise<void> {
  let current: Recording | null = startRecording(CHUNK_MS)
  try {
    while (!stopped && wakeEngine.value === 'core') {
      if (muted) {
        current?.cancel()
        current = null
        await sleep(250)
        continue
      }
      if (!current) current = startRecording(CHUNK_MS)
      const blob = await current.blob
      if (stopped || wakeEngine.value !== 'core') return
      current = startRecording(CHUNK_MS)
      if (!blob || blob.size < 1_200) continue
      let result: { text: string; configured: boolean }
      try {
        result = await transcribe(blob)
      } catch {
        continue
      }
      if (!result.configured) {
        wakeEngine.value = ''
        startBrowserLoop()
        return
      }
      const text = result.text.trim()
      if (!text) continue
      wakeHeard.value = text
      config?.onHeard?.(text)
      if (config && matchNickname(text, config.nicknames)) {
        current?.cancel()
        current = null
        await wakeUp(text)
        if (!stopped && wakeEngine.value === 'core') current = startRecording(CHUNK_MS)
      }
    }
  } finally {
    current?.cancel()
  }
}

function browserCtor(): any {
  const scope = window as any
  return scope.SpeechRecognition || scope.webkitSpeechRecognition || null
}

function startBrowserLoop(): void {
  const Ctor = browserCtor()
  if (!Ctor) { fail('no-engine'); return }
  if (wakeEngine.value !== 'browser') wakeEngine.value = 'browser'
  browserPhase = 'wake'
  browserBuffer = ''
  const rec = new Ctor()
  recognition = rec
  rec.lang = config?.language || 'zh-CN'
  rec.continuous = true
  rec.interimResults = true
  rec.onresult = (event: any) => {
    let final = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) final += event.results[i][0].transcript
    }
    final = final.trim()
    if (!final) return
    wakeHeard.value = final
    config?.onHeard?.(final)
    if (browserPhase === 'wake') {
      if (config && matchNickname(final, config.nicknames)) {
        wakeStatus.value = 'woken'
        config.onWake(final)
        browserPhase = 'capture'
        browserBuffer = ''
        wakeStatus.value = 'capturing'
      }
      return
    }
    browserBuffer = `${browserBuffer}${final}`.trim()
  }
  rec.onend = () => {
    if (stopped) return
    if (browserPhase === 'capture' && browserBuffer) {
      config?.onUtterance(browserBuffer)
      browserBuffer = ''
      browserPhase = 'wake'
      wakeStatus.value = 'listening'
    }
    try { rec.start() } catch { }
  }
  rec.onerror = (event: any) => {
    if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') { fail('mic-denied'); return }
    if (event?.error === 'no-speech' || event?.error === 'aborted') return
    fail('error', String(event?.error || 'speech recognition failed'))
  }
  try {
    rec.start()
    wakeStatus.value = 'listening'
  } catch (error: any) {
    fail('error', error?.message || 'speech recognition failed')
  }
}

function fail(reason: WakeFailure, detail?: string): void {
  stopWakeWord()
  wakeStatus.value = 'error'
  config?.onError?.(reason, detail)
}

export async function startWakeWord(next: WakeConfig): Promise<void> {
  stopWakeWord()
  config = next
  stopped = false
  muted = false
  wakeHeard.value = ''
  if (!next.nicknames.length) { fail('no-nickname'); return }

  if (await coreConfigured()) {
    if (stopped) return
    wakeEngine.value = 'core'
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
    } catch (error: any) {
      const denied = error?.name === 'NotAllowedError' || error?.name === 'SecurityError'
      fail(denied ? 'mic-denied' : 'error', error?.message)
      return
    }
    if (stopped) { releaseStream(); return }
    wakeStatus.value = 'listening'
    void coreLoop()
    return
  }

  if (browserCtor()) { startBrowserLoop(); return }
  fail('no-engine')
}

function releaseStream(): void {
  try { stream?.getTracks().forEach((track) => track.stop()) } catch { }
  stream = null
}

export function stopWakeWord(): void {
  stopped = true
  releaseStream()
  if (recognition) {
    const rec = recognition
    recognition = null
    rec.onend = null
    rec.onresult = null
    rec.onerror = null
    try { rec.stop() } catch { }
  }
  browserPhase = 'wake'
  browserBuffer = ''
  wakeEngine.value = ''
  if (wakeStatus.value !== 'error') wakeStatus.value = 'off'
}

export function setWakeMuted(value: boolean): void {
  muted = value
}

export type CallStatus = 'off' | 'dialing' | 'live' | 'ended'
export type CallEndReason = 'hangup' | 'silence' | 'error'

export interface CallConfig {
  language: string
  onUtterance: (text: string) => void
  onPeerSpeaking?: (speaking: boolean) => void
  onEnd?: (reason: CallEndReason) => void
}

export const callStatus = ref<CallStatus>('off')

const CALL_MAX_MS = 20_000
const CALL_IDLE_MS = 90_000

let callConfig: CallConfig | null = null
let callMuted = false
let lastSpeechAt = 0

// a call is the wake loop with the wake word removed: mic open, every utterance
// sent, replies spoken. mute while the peer talks or it transcribes itself.
export function setCallMuted(value: boolean): void {
  callMuted = value
}

export async function startCall(next: CallConfig): Promise<void> {
  stopWakeWord()
  endCall('hangup')
  callConfig = next
  callMuted = false
  callStatus.value = 'dialing'
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
  } catch {
    callStatus.value = 'off'
    next.onEnd?.('error')
    return
  }
  if (!callConfig) { releaseStream(); return }
  lastSpeechAt = Date.now()
  callStatus.value = 'live'
  void callLoop()
}

export function endCall(reason: CallEndReason = 'hangup'): void {
  const active = callStatus.value !== 'off'
  const config = callConfig
  callConfig = null
  callMuted = false
  callStatus.value = 'off'
  if (!active) return
  releaseStream()
  config?.onEnd?.(reason)
}

async function callLoop(): Promise<void> {
  while (callConfig && callStatus.value === 'live') {
    if (callMuted) { await sleep(200); continue }
    if (Date.now() - lastSpeechAt > CALL_IDLE_MS) { endCall('silence'); return }
    const recording = startRecording(CALL_MAX_MS, true)
    const blob = await recording.blob
    if (!callConfig || callStatus.value !== 'live') { recording.cancel(); return }
    if (callMuted || !blob || blob.size < 1_200) continue
    lastSpeechAt = Date.now()
    let text = ''
    try {
      const result = await transcribe(blob)
      if (!result.configured) { endCall('error'); return }
      text = result.text.trim()
    } catch {
      continue
    }
    if (!text || !callConfig || callStatus.value !== 'live') continue
    lastSpeechAt = Date.now()
    callConfig.onUtterance(text)
  }
}
