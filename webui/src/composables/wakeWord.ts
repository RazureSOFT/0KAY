import { ref } from 'vue'

/**
 * 「喊一声唤醒」— wake-word listening for the LIFE chat.
 *
 * The companion is only reachable by typing unless something is listening, and
 * a wake word is the smallest useful version of that: the browser records short
 * chunks, transcribes them, and looks for the nickname the user configured in
 * Settings → L.I.F.E. On a hit it says hello and records one follow-up
 * utterance, which is sent as a normal chat message — so everything downstream
 * (THINK, memory, TTS) is unchanged.
 *
 * Transcription goes through Core's unified `/api/asr` (see docs/asr.md), which
 * means the engine is a plugin decision and this file never learns which one is
 * installed. When no ASR backend is configured it falls back to the browser's
 * own `SpeechRecognition` (Chrome/Edge); when neither exists the caller is told
 * to configure one instead of silently listening to nothing.
 *
 * Design notes:
 *   - Chunked recording, not a streaming socket: `/api/asr` is one POST per
 *     utterance, so the wake loop is "record 2.6s → transcribe → repeat". That
 *     costs a little latency at the boundary but needs no protocol support from
 *     plugins, which is the whole point of the unified endpoint.
 *   - The mic stays open between chunks (one permission prompt, no click-clack
 *     of a device opening every few seconds).
 *   - `setWakeMuted(true)` while the companion is speaking: otherwise the mic
 *     transcribes the TTS output and wakes itself.
 */

export type WakeStatus = 'off' | 'listening' | 'woken' | 'capturing' | 'error'
export type WakeEngine = 'core' | 'browser' | ''
/** Why listening could not start; the caller maps these to translated copy. */
export type WakeFailure = 'no-nickname' | 'no-engine' | 'mic-denied' | 'error'

export interface WakeConfig {
  /** Names that wake the companion (already split on commas by the caller). */
  nicknames: string[]
  /** Language hint for the recogniser, e.g. `zh`. */
  language: string
  onWake: (heard: string) => void
  onUtterance: (text: string) => void
  onHeard?: (text: string) => void
  onError?: (reason: WakeFailure, detail?: string) => void
}

export const wakeStatus = ref<WakeStatus>('off')
export const wakeEngine = ref<WakeEngine>('')
/** Last transcript, for the status chip ("听到了：…"). */
export const wakeHeard = ref('')

/** Length of one listening chunk. Short enough to feel responsive, long enough
 *  for a whole "美玖" to fit inside a single request. */
const CHUNK_MS = 2_600
/** A follow-up command is bounded: the user gets one breath, not a monologue. */
const FOLLOW_MAX_MS = 9_000
/** End the follow-up after this much silence *following* speech. */
const SILENCE_MS = 850
/** Below this RMS the chunk is silence. Tuned on a laptop mic with AGC on. */
const SILENCE_RMS = 0.012
/** Above this RMS we have definitely heard a voice, so silence can end it. */
const SPEECH_RMS = 0.02

let config: WakeConfig | null = null
let stream: MediaStream | null = null
let audioCtx: AudioContext | null = null
let stopped = true
let muted = false
let recognition: any = null
/** 'wake' looks for the nickname, 'capture' collects the command after it. */
let browserPhase: 'wake' | 'capture' = 'wake'
let browserBuffer = ''

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Strip spacing and punctuation so "美玖，" and "美 玖" both match "美玖". */
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

/** First MediaRecorder container the browser will actually produce. */
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
  // 503 is "no backend configured" — distinct from a backend that failed, so the
  // loop can switch engines instead of retrying forever.
  if (res.status === 503) return { text: '', configured: false }
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return { text: String(data.text || ''), configured: true }
}

/** RMS of the live mic, used only to find the end of an utterance. */
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
      try { source.disconnect() } catch { /* already gone */ }
      try { audioCtx?.close() } catch { /* already gone */ }
      audioCtx = null
    },
  }
}

/**
 * Record one chunk.
 *
 * With `stopOnSilence` the recording ends once speech has been heard and then
 * stops, which is what makes the follow-up utterance feel like it ends when the
 * user stops talking rather than at an arbitrary timeout.
 *
 * The recording is returned as a handle, not a promise, because the wake loop
 * overlaps it with transcription: Soniox needs ~3s for a 2.6s chunk, and if the
 * mic were closed for those 3s the nickname would land in the gap half the time.
 * `cancel()` abandons a chunk (waking up, or muting while the companion speaks).
 */
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
      try { if (recorder.state !== 'inactive') recorder.stop() } catch { /* already stopped */ }
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

/** Two rising notes: "I heard you, go ahead". Short enough to not cover speech. */
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
    setTimeout(() => { try { void ctx.close() } catch { /* already gone */ } }, 600)
  } catch { /* no audio output: the visual status is enough */ }
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
    } catch { /* a dropped follow-up must not kill the listener */ }
  }
  if (!stopped && wakeEngine.value === 'core') wakeStatus.value = 'listening'
}

/**
 * The wake loop.
 *
 * Recording and transcription overlap: the next chunk starts the moment the
 * previous one is handed to `/api/asr`, so a nickname spoken while the previous
 * chunk is still being recognised is not lost. Every exit path cancels the
 * in-flight chunk so the mic is never left recording after a stop.
 */
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
      // Start the next chunk before the network round-trip, not after it.
      current = startRecording(CHUNK_MS)
      // ~1 KB is the smallest chunk that can hold a spoken word in opus.
      if (!blob || blob.size < 1_200) continue
      let result: { text: string; configured: boolean }
      try {
        result = await transcribe(blob)
      } catch {
        continue
      }
      if (!result.configured) {
        // The backend disappeared mid-session (plugin stopped): fall back rather
        // than spinning on 503s.
        wakeEngine.value = ''
        startBrowserLoop()
        return
      }
      const text = result.text.trim()
      if (!text) continue
      wakeHeard.value = text
      config?.onHeard?.(text)
      if (config && matchNickname(text, config.nicknames)) {
        // The follow-up utterance needs the mic to itself.
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
  // Recognition ends by itself after a pause; that is the end of the utterance.
  rec.onend = () => {
    if (stopped) return
    if (browserPhase === 'capture' && browserBuffer) {
      config?.onUtterance(browserBuffer)
      browserBuffer = ''
      browserPhase = 'wake'
      wakeStatus.value = 'listening'
    }
    try { rec.start() } catch { /* restart races are harmless */ }
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

/** Start listening. Resolves once an engine is running (or the failure is reported). */
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
  try { stream?.getTracks().forEach((track) => track.stop()) } catch { /* already gone */ }
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
    try { rec.stop() } catch { /* already stopped */ }
  }
  browserPhase = 'wake'
  browserBuffer = ''
  wakeEngine.value = ''
  if (wakeStatus.value !== 'error') wakeStatus.value = 'off'
}

/** Mute the listener (the companion is speaking; do not transcribe ourselves). */
export function setWakeMuted(value: boolean): void {
  muted = value
}
