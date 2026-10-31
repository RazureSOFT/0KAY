<script setup lang="ts">
// The desktop pet: the model, plus a small voice bar.
//
// Hold the mic to talk: the browser records, Core transcribes through its unified
// /api/asr, and the text is shown in the bar. A pet you cannot talk to is just a
// wallpaper, so this is the first slice of the voice loop.
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Live2DStage from '../components/Live2DStage.vue'

const reply = ref('')
const asking = ref(false)
const { t } = useI18n()
const recording = ref(false)
const transcribing = ref(false)
const heard = ref('')
const error = ref('')
const level = ref(0)

let recorder: MediaRecorder | null = null
let chunks: Blob[] = []
let meter: number | null = null
let audioContext: AudioContext | null = null

const busy = computed(() => transcribing.value)

async function start() {
  if (recording.value || transcribing.value) return
  error.value = ''
  heard.value = ''
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
    chunks = []
    recorder = new MediaRecorder(stream, { mimeType: pickMime() })
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data) }
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop())
      void transcribe(new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' }))
    }
    recorder.start()
    recording.value = true
    watchLevel(stream)
  } catch (cause: any) {
    error.value = cause?.message || 'microphone unavailable'
  }
}

function stop() {
  if (!recording.value) return
  recording.value = false
  stopMeter()
  try { recorder?.stop() } catch { /* already stopped */ }
}

/** Whisper-style endpoints want webm/opus; Safari only does mp4. */
function pickMime() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
  return candidates.find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || ''
}

/** Drives the level ring, so holding the button gives some feedback. */
function watchLevel(stream: MediaStream) {
  try {
    audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)
    const data = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      if (!recording.value) return
      analyser.getByteFrequencyData(data)
      let sum = 0
      for (const value of data) sum += value
      level.value = Math.min(1, sum / data.length / 90)
      meter = requestAnimationFrame(tick)
    }
    tick()
  } catch {
    // The level display is cosmetic; recording still works without it.
  }
}

function stopMeter() {
  if (meter !== null) cancelAnimationFrame(meter)
  meter = null
  level.value = 0
  void audioContext?.close().catch(() => {})
  audioContext = null
}

async function transcribe(blob: Blob) {
  if (blob.size < 1200) {
    error.value = t('pet.tooShort')
    return
  }
  transcribing.value = true
  try {
    const form = new FormData()
    form.append('file', blob, 'speech.webm')
    const response = await fetch('/api/asr', { method: 'POST', body: form })
    const raw = await response.text()
    let body: any = {}
    try { body = raw ? JSON.parse(raw) : {} } catch { body = {} }
    if (!response.ok) throw new Error(friendlyAsrError(response.status, raw, body))
    heard.value = String(body.text || body.transcript || '').trim()
    if (!heard.value) error.value = t('pet.heardNothing')
    else void ask(heard.value)
  } catch (cause: any) {
    error.value = cause?.message || t('pet.asrFailed')
  } finally {
    transcribing.value = false
  }
}

/**
 * Send what she heard to LIFE and stream her answer back.
 *
 * Same endpoint and payload shape the chat page uses, so the pet and the chat page
 * share one conversation instead of two parallel ones.
 */
async function ask(prompt: string) {
  asking.value = true
  reply.value = ''
  try {
    const res = await fetch('/api/life/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request_id: `pet-${Date.now()}`,
        prompt,
        stream: true,
        session_id: 'pet',
        user_id: 'webui',
        history: [],
      }),
    })
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let pending = ''
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      pending += decoder.decode(value, { stream: true })
      const frames = pending.split('\n\n')
      pending = frames.pop() || ''
      for (const frame of frames) {
        const line = frame.split('\n').find((l) => l.startsWith('data: '))
        if (!line) continue
        try {
          const event = JSON.parse(line.slice(6))
          const chunk = event.chunk || event.text || event.delta || ''
          if (typeof chunk === 'string') reply.value += chunk
        } catch { /* keep-alive or partial frame */ }
      }
    }
    if (!reply.value.trim()) reply.value = '……'
  } catch (cause: any) {
    error.value = cause?.message || t('pet.replyFailed')
  } finally {
    asking.value = false
  }
}

/**
 * Core wraps the provider's failure in its own JSON, so the raw body is unreadable
 * ("{\"code\":\"asr_failed\",\"detail\":\"ASR 502: ...\"}"). Collapse it to the
 * sentence a person needs, and keep the status for the case that is genuinely new.
 */
function friendlyAsrError(status: number, raw: string, body: any): string {
  const detail = String(body?.detail || body?.error || raw || '')
  const lower = detail.toLowerCase()
  if (lower.includes('no speech')) return t('pet.noSpeech')
  if (lower.includes('not configured') || lower.includes('no provider')) return t('pet.asrNotConfigured')
  if (status === 401 || lower.includes('unauthorized')) return t('pet.asrBadKey')
  if (status === 413) return t('pet.asrTooLong')
  if (status >= 500) return `${t('pet.asrFailed')} (${status})`
  return detail.slice(0, 120) || `${t('pet.asrFailed')} (${status})`
}

onMounted(() => {
  // The styles above only apply under this class, so the pet cannot repaint the
  // rest of the app by having been visited.
  document.documentElement.classList.add('pet-mode')
})

onUnmounted(() => {
  document.documentElement.classList.remove('pet-mode')
  stop()
  stopMeter()
})
</script>

<template>
  <div class="pet-stage">
    <Live2DStage bare class="pet-canvas" />

    <div class="voice-bar" :class="{ live: recording }">
      <button
        class="mic"
        :class="{ on: recording, busy }"
        :disabled="busy"
        :aria-label="recording ? t('pet.releaseToSend') : t('pet.holdToTalk')"
        :title="recording ? t('pet.releaseToSend') : t('pet.holdToTalk')"
        @pointerdown.prevent="start"
        @pointerup.prevent="stop"
        @pointerleave="stop"
        @pointercancel="stop"
      >
        <span class="ring" :style="{ transform: `scale(${1 + level * 0.6})`, opacity: 0.25 + level * 0.75 }"></span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        </svg>
      </button>

      <p v-if="busy" class="say">{{ t('pet.transcribing') }}</p>
      <p v-else-if="asking" class="say">{{ reply || '……' }}</p>
      <p v-else-if="reply" class="say heard">{{ reply }}</p>
      <p v-else-if="heard" class="say heard">{{ heard }}</p>
      <p v-else-if="error" class="say bad">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.pet-stage { position: fixed; inset: 0; background: transparent; overflow: hidden; }

/* The theme paints html, body and #app, so the pet has to opt all three out — but
   only while it is on screen. Keying on `html.pet-mode` matters: a bare :global
   rule here leaks into every other page as soon as /pet has been visited once. */
:global(html.pet-mode),
:global(html.pet-mode body),
:global(html.pet-mode #app) {
  background: transparent !important;
  background-image: none !important;
  overflow: hidden;
}
:global(html.pet-mode #app) { padding: 0 !important; height: 100%; }
.pet-canvas { width: 100%; height: 100%; }

.voice-bar {
  position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px;
  padding: 6px 14px 6px 6px; border-radius: 999px;
  background: #0f1620cc; backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px #00000059, inset 0 1px 0 #ffffff14;
  color: #e8eef7; font: 500 12px/1.3 system-ui, -apple-system, 'Segoe UI', 'PingFang SC', sans-serif;
  max-width: min(90vw, 420px);
  -webkit-app-region: no-drag;
  transition: opacity .18s ease, background .18s ease;
}
/* Fades back so she is not framed by a permanent widget. */
.voice-bar:not(.live):not(:hover) { opacity: .5; }
.voice-bar.live { background: #1a2230e6; }

.mic {
  position: relative; width: 34px; height: 34px; flex: none;
  display: grid; place-items: center; border: 0; border-radius: 50%;
  background: #86afb5; color: #0b1118; cursor: pointer;
  transition: background .15s ease, transform .08s ease;
}
.mic:hover { background: #9cc3c9; }
.mic:active { transform: scale(.94); }
.mic:focus-visible { outline: 2px solid #86afb5; outline-offset: 2px; }
.mic.on { background: #e5484d; color: #fff; }
.mic.busy { opacity: .6; cursor: progress; }
.mic .ring {
  position: absolute; inset: -5px; border-radius: 50%;
  border: 2px solid #e5484d; opacity: 0; pointer-events: none;
  transition: transform .08s linear, opacity .12s ease;
}
.say { margin: 0; font-size: 12px; line-height: 1.35; overflow-wrap: anywhere; }
.say.heard { color: #dbe7f7; }
.say.bad { color: #ffb4b4; }
</style>
