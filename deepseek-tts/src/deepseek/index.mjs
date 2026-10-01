/**
 * Vendored DeepSeek web TTS client (self-contained, no external package).
 *
 * Ported verbatim from the MIT-licensed project
 * https://github.com/Eyeing0721/deepseek-tts-api (see NOTICE.md). It talks to
 * DeepSeek's web "read aloud" endpoints directly: session creation, the custom
 * DeepSeekHashV1 proof-of-work, the TTS ticket and the WebSocket audio stream.
 *
 * Node >= 22 (global fetch + WebSocket).
 */
export { HOST, HTTP_BASE, WS_ENDPOINT, ENDPOINTS, PCM, VOICES, VOICE_IDS, getVoice } from './constants.mjs'
export { DeepSeekTtsError, codeName, codeHint } from './errors.mjs'
export { resolveToken, issueTicket, listVoices, setVoice } from './http.mjs'
export { pcmToWav, parseWavHeader } from './wav.mjs'
export { synthesize } from './tts.mjs'
export { say } from './session.mjs'
