<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// The importmap maps `vue-router` to the host's shared bridge, so this is the
// app's own router instance (not a private copy) and SPA navigation keeps the
// shell's player/i18n state alive.
import { useRouter } from 'vue-router'
import { AppSelect, useConfirm, i18n } from '@0kay/host'
import { FLASH_MS, friendlyError, injectStyle, lifeAct, lifeGet, lifeKitCss, sleep } from './kit'
import AdapterSettingsPage from './AdapterSettingsPage.vue'

const { confirm } = useConfirm()
const t = (key: string, named?: Record<string, unknown>) => i18n.global.t(key, named ?? {})
//inject() must run in setup context, so grab the host router once here (it is
// undefined when this page is rendered outside the WebUI shell).
const router = useRouter()
// Canonical enum value for a settings key. The L.I.F.E backend keys these enums
// on the exact zh strings (life/src/life/cognition/persona_dynamics.py maps
// "傲娇型"/"依赖型"/… and companion/legacy.py validates the same tuples), so the
// persisted value is read from the zh catalog no matter the UI locale — only
// the option *label* is localized. Do not translate the persisted value.
const zhValue = (key: string) => (i18n.global.t as any)(key, {}, { locale: 'zh' }) as string
const enumOptions = (keys: string[]) => keys.map((k) => ({ value: zhValue(`life.companion.${k}`), label: t(`life.companion.${k}`) }))
const data = ref<any>({ settings: {}, cognition: null })
const loading = ref(false); const error = ref(''); const notice = ref('')
const tab = ref('cognition')
const pageEl = ref<HTMLElement | null>(null)
const navItems = [
  { key: 'cognition', i: '01', labelKey: 'life.companion.nav.cognition', icon: '◉' },
  { key: 'persona', i: '02', labelKey: 'life.companion.nav.persona', icon: '✎' },
  { key: 'world', i: '03', labelKey: 'life.companion.nav.world', icon: '✦' },
  { key: 'adapters', i: '04', labelKey: 'life.companion.nav.adapters', icon: '✉' },
  { key: 'state', i: '05', labelKey: 'life.companion.nav.state', icon: '☺' },
]
/** The standalone 消息平台 settings tab owns full adapter CRUD now; this panel
    keeps a read-only summary and sends you there instead of duplicating it. */
const ADAPTERS_SETTINGS_TAB = 'life_adapters'

function flash(message: string) { notice.value = message; setTimeout(() => { if (notice.value === message) notice.value = '' }, FLASH_MS) }
/** Open the standalone 消息平台 settings tab.
 *
 *  The host shell does not expose a navigation API on `@0kay/host`, but its
 *  importmap maps `vue-router` to a bridge that re-exports the app's own
 *  router, so `router.push` is a true SPA navigation (no full reload, so the
 *  chat socket and i18n state survive). location.href stays as a fallback for
 *  a context where the shell's router is not injected. */
function openAdapterSettings() {
  if (router) { void router.push({ path: '/settings', query: { tab: ADAPTERS_SETTINGS_TAB } }); return }
  window.location.href = `/settings?tab=${ADAPTERS_SETTINGS_TAB}`
}

async function load(attempt = 0): Promise<void> {
  loading.value = true; error.value = ''
  try {
    data.value = await lifeGet('/api/life/companion')
    syncSettings()
    loading.value = false
  } catch (e: any) {
    if (attempt < 4) { await sleep(1500); return load(attempt + 1) }
    error.value = friendlyError(e)
    loading.value = false
  }
}
async function act(action: string, payload: any) {
  try {
    const body = await lifeAct(action, payload)
    await load(); return body
  } catch (e: any) {
    error.value = friendlyError(e); return null
  }
}
function jump(target: string) {
  tab.value = target
  const behavior: ScrollBehavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  const el = pageEl.value
  if (el) el.scrollTo({ top: 0, behavior }); else window.scrollTo({ top: 0, behavior })
}
/** Replay the kit's entrance animation on the newly shown tab panel. The five
    panels are v-show-mounted once, so the .panel animation would otherwise only
    play on first paint; toggling the replay class (with a reflow in between)
    restarts it on every tab switch. */
function replayPanel(key: string) {
  const el = pageEl.value?.querySelector<HTMLElement>(`section[data-panel="${key}"]`)
  if (!el) return
  el.classList.remove('panel-replay')
  void el.offsetWidth // flush styles so re-adding the class restarts the animation
  el.classList.add('panel-replay')
  el.addEventListener('animationend', () => el.classList.remove('panel-replay'), { once: true })
}
watch(tab, (value) => { nextTick(() => replayPanel(value)) })
// 适配器状态是实时量（是否已连接），只在进入该页时拉取，不塞进 companion 快照。
watch(tab, (value) => { if (value === 'adapters') loadAdapters() })

// --- cognition core --------------------------------------------------------
// Mirrors CompanionSystem.SETTING_DEFAULTS on the backend.  Booleans are stored
// as '1'/'0' strings; every other knob is numeric except the two enums.
const COG_DEFAULTS: Record<string, string> = {
  cog_enabled: '1',
  cog_lite_mode: '0',
  cog_modulate_affect: '1', cog_modulate_language: '1', cog_modulate_social: '1', cog_modulate_selfhood: '1',
  cog_plan_depth: '2', cog_wm_capacity: '5', cog_tau: '0.4', cog_gamma: '0.9',
  cog_alpha_habit: '0.08', cog_alpha_mf: '0.2', cog_theta_pe: '0.25', cog_theta_n: '0.35',
  cog_prospection_horizon: '4',
  cog_use_cerebellum: '1', cog_use_thalamic_gate: '1', cog_use_ofc_map: '1',
  cog_use_prospection: '1', cog_use_limbic_bias: '1',
  cog_affect_enabled: '1', cog_affect_profile: 'typical', cog_affect_vagal: '0.6',
  cog_affect_threat: '0.2', cog_affect_reward: '1', cog_affect_somatic: '0', cog_affect_persona_llm: '1',
  cog_language_enabled: '1', cog_language_framing: 'weak_whorf', cog_language_boundary: '0.6',
  cog_social_enabled: '1', cog_social_empathy: '0.4', cog_social_stage: '2',
  cog_selfhood_enabled: '1', cog_selfhood_discount: '0.1', cog_selfhood_detail: '20',
  cog_attachment_enabled: '0', get cog_attachment_type() { return zhValue('life.companion.attach.dependent') },
  cog_tsundere_enabled: '0', get cog_tsundere_type() { return zhValue('life.companion.tsundere.classic') },
  cog_yandere_enabled: '0', get cog_yandere_type() { return zhValue('life.companion.yandere.mode.yandere') },
  cog_personadyn_enabled: '0', get cog_personadyn_type() { return zhValue('life.companion.pdt.0') }, get cog_personadyn_gender() { return zhValue('life.companion.pdGender.unspecified') },
  // memory & consolidation. On by default — they are what makes lived
  // experience leave a trace; turn one off to ablate it.
  cog_memory_encode: '1', cog_sleep_replay: '1', cog_memory_reconsolidate: '1',
  cog_cls_interleave: '1',
}
const COG_BOOL_KEYS = ['cog_enabled', 'cog_lite_mode', 'cog_modulate_affect', 'cog_modulate_language', 'cog_modulate_social',
  'cog_modulate_selfhood', 'cog_use_cerebellum', 'cog_use_thalamic_gate', 'cog_use_ofc_map',
  'cog_use_prospection', 'cog_use_limbic_bias', 'cog_affect_enabled', 'cog_affect_somatic', 'cog_affect_persona_llm', 'cog_language_enabled',
  'cog_social_enabled', 'cog_selfhood_enabled', 'cog_attachment_enabled', 'cog_tsundere_enabled',
  'cog_yandere_enabled',
  'cog_personadyn_enabled',
  'cog_memory_encode', 'cog_sleep_replay', 'cog_memory_reconsolidate', 'cog_cls_interleave']
const COG_TEXT_KEYS = ['cog_affect_profile', 'cog_language_framing', 'cog_attachment_type', 'cog_tsundere_type', 'cog_yandere_type', 'cog_personadyn_type', 'cog_personadyn_gender']
const attachmentTypeOptions = computed(() => enumOptions(['attach.secluded', 'attach.dependent', 'attach.delusional', 'attach.monitoring', 'attach.selfHarm', 'attach.exclusion']))
const tsundereTypeOptions = computed(() => enumOptions(['tsundere.classic', 'tsundere.cold', 'tsundere.gruff', 'tsundere.indulgent']))
// The yandere circuit's four archetypes. Their canonical stored values are the
// zh strings, so the option value is zhValue(...) like the tsundere enum.
const yandereTypeOptions = computed(() => enumOptions(['yandere.mode.yandere', 'yandere.mode.tsundere', 'yandere.mode.neutral', 'yandere.mode.hybrid']))
// The 18 research archetypes stay first (they are the ACG family the plugin
// shipped with); the extended library is grouped so a long list stays usable.
const PD_GROUP_KEYS: string[][] = [
  Array.from({ length: 18 }, (_, i) => `pdt.${i}`),
  Array.from({ length: 10 }, (_, i) => `pdt.${18 + i}`),
  Array.from({ length: 9 }, (_, i) => `pdt.${28 + i}`),
  Array.from({ length: 4 }, (_, i) => `pdt.${37 + i}`),
  Array.from({ length: 13 }, (_, i) => `pdt.${41 + i}`),
  Array.from({ length: 11 }, (_, i) => `pdt.${54 + i}`),
  Array.from({ length: 13 }, (_, i) => `pdt.${65 + i}`),
  Array.from({ length: 16 }, (_, i) => `pdt.${78 + i}`),
  Array.from({ length: 78 }, (_, i) => `pdt.${94 + i}`),
]
const personadynTypeGroups = computed(() => PD_GROUP_KEYS.map((keys, g) => ({ label: t(`life.companion.pdg.${g}`), keys })))
const personadynAllTypes = computed(() => [...new Set(PD_GROUP_KEYS.flat())].map((k) => ({ value: zhValue(`life.companion.${k}`), label: t(`life.companion.${k}`) })))
const personadynGenderOptions = computed(() => enumOptions(['pdGender.unspecified', 'pdGender.maleScript', 'pdGender.femaleScript', 'pdGender.neutral', 'pdGender.highTradMale', 'pdGender.lowTradMale', 'pdGender.highTradFemale', 'pdGender.feminist']))
// The affect-profile / language-framing enums are persisted by their internal
// key ('typical', 'bpd', 'weak_whorf', …), so only the label is localized here
// (see companion.profile.* / companion.framing.* in strings.xml).
const cogProfileOptions = computed(() => ['typical', 'depression', 'anxiety', 'bpd', 'alexithymia']
  .map((v) => ({ value: v, label: t(`life.companion.profile.${v}`) })))
const cogFramingOptions = computed(() => ['independent', 'interchanging', 'cognitive_determinism', 'weak_whorf',
  'thinking_for_speaking', 'radical_connectionism', 'determinism']
  .map((v) => ({ value: v, label: t(`life.companion.framing.${v}`) })))
// Selman's perspective-taking stages. The setting persists the stage *number*;
// the label is localized (unlike the archetype enums, whose canonical values
// are zh strings — see zhValue above).
const STAGE_NAMES = ['egocentric', 'subjective', 'self-reflective', 'mutual', 'societal-symbolic']
const cogStageOptions = computed(() => STAGE_NAMES.map((name, n) => ({ value: String(n), label: t(`life.companion.stage.${name}`) })))
const cogStageValue = computed({
  get: () => String(Number(settingsForm.value.cog_social_stage ?? 2)),
  set: (value: string) => { settingsForm.value.cog_social_stage = Number(value) },
})
function cogRaw(key: string) { return String(data.value.settings?.[key] ?? COG_DEFAULTS[key] ?? '') }
function syncCogSettings() {
  const out: Record<string, any> = {}
  for (const [key, fallback] of Object.entries(COG_DEFAULTS)) {
    const raw = cogRaw(key) || fallback
    out[key] = COG_BOOL_KEYS.includes(key) ? raw === '1' : COG_TEXT_KEYS.includes(key) ? raw : Number(raw)
  }
  return out
}
function cogPayload(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, fallback] of Object.entries(COG_DEFAULTS)) {
    const value = settingsForm.value[key]
    if (COG_BOOL_KEYS.includes(key)) out[key] = value ? '1' : '0'
    else out[key] = String(value ?? fallback)
  }
  return out
}
const cognition = computed(() => data.value.cognition || null)
const lastControl = computed(() => cognition.value?.last_control || null)
const wave1 = computed(() => cognition.value?.wave1 || null)
const wave2 = computed(() => cognition.value?.wave2 || null)
const wave3 = computed(() => cognition.value?.wave3 || null)
const wave4a = computed(() => cognition.value?.wave4a || null)
const wave4b = computed(() => cognition.value?.wave4b || null)
const personaInfo = computed(() => cognition.value?.persona || null)
const attachment = computed(() => cognition.value?.attachment || null)
const tsundere = computed(() => cognition.value?.tsundere || null)
const yandere = computed(() => cognition.value?.yandere || null)
const personadyn = computed(() => cognition.value?.personadyn || null)
// Extended read-outs: the backend ships grouped dictionaries; render a compact
// "top 3" line so the panel stays readable at a glance.
const big5Line = computed(() => {
  const b = personadyn.value?.big5
  if (!b) return '—'
  const order = ['o_open', 'c_conscientious', 'e_extravert', 'a_agreeable', 'n_neurotic']
  return order.map((k) => fmtNum(b[k], 2)).join(' · ')
})
const hexacoLine = computed(() => {
  const h = personadyn.value?.hexaco
  if (!h) return '—'
  const order = ['h_honesty', 'hex_e', 'hex_x', 'hex_a', 'hex_c', 'hex_o']
  return order.map((k) => fmtNum(h[k], 2)).join(' · ')
})
function topChannel(dict: Record<string, number> | undefined, n = 3): string[] {
  if (!dict) return []
  return Object.entries(dict)
    .filter(([, v]) => typeof v === 'number')
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k, v]) => `${channelLabel(k)} ${fmtNum(v, 2)}`)
}
const topDesires = computed(() => topChannel(personadyn.value?.desires, 3))
const topEmotions = computed(() => topChannel(personadyn.value?.emotions, 3))
const learningDrift = computed(() => {
  const d = personadyn.value?.learning?.theta_drift
  if (!d) return 0
  return Object.values(d as Record<string, number>).reduce((s, v) => s + Math.abs(v || 0), 0)
})
const episode = computed(() => wave2.value?.episode || null)
const episodeStateLabel = (value: string) => {
  const keys: Record<string, string> = { euthymic: 'life.companion.episode.euthymic', subthreshold: 'life.companion.episode.subthreshold', episode: 'life.companion.episode.episode' }
  return keys[value] ? t(keys[value]) : '—'
}

// --- life on/off (开始生命 / 暂停生命) -------------------------------------
const life = computed(() => cognition.value?.life || null)
const lifeBusy = ref(false)
/** Which of the two actions is in flight, so the button can say "Starting…" or
    "Pausing…" instead of a bare ellipsis. */
const lifeBusyAction = ref<'start' | 'stop'>('start')
const lifeGreet = ref(true)
function lifeAgeText() {
  const born = life.value?.born_at
  if (!born) return '—'
  const ms = Date.now() - new Date(born).getTime()
  if (!isFinite(ms) || ms < 0) return '—'
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  return days > 0 ? t('life.companion.life.ageDaysHours', { days, hours }) : t('life.companion.life.ageHours', { hours })
}
function lifeBusyLabel() {
  return lifeBusyAction.value === 'start' ? t('life.companion.life.starting') : t('life.companion.life.pausing')
}
async function startLife() {
  lifeBusy.value = true; lifeBusyAction.value = 'start'
  try {
    const result = await act('life_start', { greet: lifeGreet.value })
    if (result) flash(result.greeting ? t('life.companion.flash.lifeStartedGreeting', { greeting: result.greeting }) : t('life.companion.flash.lifeStarted'))
  } finally { lifeBusy.value = false }
}
async function stopLife() {
  lifeBusy.value = true; lifeBusyAction.value = 'stop'
  try {
    const result = await act('life_stop', {})
    if (result) flash(t('life.companion.flash.lifeStopped'))
  } finally { lifeBusy.value = false }
}

// One-click configurations: set the relevant knobs then save.
function applyPreset(fields: Record<string, any>, label: string) {
  Object.assign(settingsForm.value, fields)
  void saveSettings().then(() => flash(t('life.companion.flash.presetApplied', { label })))
}
const PRESETS = [
  { labelKey: 'life.companion.preset.regular', fields: { cog_affect_enabled: true, cog_affect_profile: 'typical', cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: false, cog_tsundere_enabled: false, cog_personadyn_enabled: false } },
  { labelKey: 'life.companion.preset.depression', fields: { cog_affect_enabled: true, cog_affect_profile: 'depression', cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
  { labelKey: 'life.companion.preset.tsundere', fields: { cog_tsundere_enabled: true, cog_tsundere_type: zhValue('life.companion.tsundere.classic') } },
  { labelKey: 'life.companion.preset.personadyn', fields: { cog_personadyn_enabled: true, cog_personadyn_type: zhValue('life.companion.pdt.1') } },
  { labelKey: 'life.companion.preset.yandereSecluded', fields: { cog_affect_enabled: true, cog_affect_profile: 'depression', cog_attachment_enabled: true, cog_attachment_type: zhValue('life.companion.attach.secluded') } },
  { labelKey: 'life.companion.preset.yandereDependent', fields: { cog_affect_enabled: true, cog_attachment_enabled: true, cog_attachment_type: zhValue('life.companion.attach.dependent') } },
  { labelKey: 'life.companion.preset.yandereDelusional', fields: { cog_affect_enabled: true, cog_affect_profile: 'depression', cog_attachment_enabled: true, cog_attachment_type: zhValue('life.companion.attach.delusional') } },
]
const somaticChannels = computed(() => cognition.value?.wave2?.somatic_channels || null)
const channelLabel = (name: string) => {
  const keys: Record<string, string> = { fatigue: 'channel.fatigue', pain: 'channel.pain', cardiorespiratory: 'channel.cardiorespiratory', gastrointestinal: 'channel.gastrointestinal', dizziness: 'channel.dizziness', sleep: 'channel.sleep' }
  return keys[name] ? t(`life.companion.${keys[name]}`) : name
}
const somScale = (value: any) => Math.max(0.02, Math.min(1, Number(value))).toFixed(3)
const personaEvidenceText = computed(() => {
  const evidence = personaInfo.value?.evidence || {}
  return Object.entries(evidence).map(([dim, words]) => t('life.companion.evidencePair', { dim, words: (words as string[]).join(t('life.companion.listSeparator')) })).join(t('life.companion.evidenceSeparator'))
})
function fmtNum(value: any, digits = 3) { return value == null || value === '' ? '—' : Number(value).toFixed(digits) }

// --- worldsim / state ------------------------------------------------------
const worldEvents = computed(() => (data.value.timeline || []).filter((item: any) => item.topic === zhValue('life.companion.val.world')).slice(0, 30))
const commitments = computed(() => data.value.commitments || [])
const userModels = computed(() => data.value.user_model || [])
const valuesList = computed(() => Object.entries(data.value.values || {})
  .map(([k, v]) => ({ k, v: Number(v) })).sort((a: any, b: any) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 20))
function parseList(text: string) { try { const v = JSON.parse(text || '[]'); return Array.isArray(v) ? v : [] } catch { return [] } }

// --- intuitive read-outs ("她现在") ------------------------------------------
// The snapshot already carries the raw numbers; this block turns them into
// gauges with a one-line "what it changes" so the panel reads at a glance.
const emotionNow = computed<any>(() => data.value.emotion || null)
const circadianNow = computed<any>(() => data.value.circadian || null)
const relationships = computed<any[]>(() => data.value.relationships || [])
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const moodDot = computed(() => {
  const e = emotionNow.value || {}
  const valence = Math.max(-1, Math.min(1, Number(e.valence) || 0))
  const arousal = clamp01(Number(e.arousal ?? 0.5))
  // viewBox 0 0 120 120; the frame spans 10..110, arousal points up.
  return { x: (10 + ((valence + 1) / 2) * 100).toFixed(1), y: (110 - arousal * 100).toFixed(1) }
})
const russellQuadrant = computed(() => {
  const e = emotionNow.value
  if (!e) return 'life.companion.quadrant.serene'
  const pleasant = Number(e.valence) >= 0
  const hot = Number(e.arousal) >= 0.5
  return pleasant ? (hot ? 'life.companion.quadrant.excited' : 'life.companion.quadrant.serene')
                  : (hot ? 'life.companion.quadrant.tense' : 'life.companion.quadrant.gloomy')
})
type Gauge = { label: string; value: number; max: number; kind: 'good' | 'bad' | 'neutral'; signed: boolean; effect: string; display: string; alias: string; state: string; stateTone: string }
const SIGNED_BAND = 0.15
const signedBand = (v: number) => (v <= -SIGNED_BAND ? 'lo' : v >= SIGNED_BAND ? 'hi' : 'mid')
/**
 * One builder per metric id: the id resolves the effect line, the
 * plain-language alias next to the term, and the 3-band state word
 * ("很沉着 / 还算稳 / 容易慌") so numbers read as words. `kind` is the
 * metric's good/bad direction (neutral = read by distance from zero).
 */
function gg(id: string, label: string, raw: any, opts: { max: number; kind: Gauge['kind']; signed?: boolean }): Gauge | null {
  const value = Number(raw)
  if (!isFinite(value)) return null
  const frac = clamp01(value / opts.max)
  const band = opts.signed ? signedBand(value) : frac < 0.34 ? 'lo' : frac < 0.67 ? 'mid' : 'hi'
  const g: Gauge = {
    label, value, max: opts.max, kind: opts.kind, signed: !!opts.signed,
    effect: t(`life.companion.effect.${id}`),
    display: fmtNum(value, 2),
    alias: t(`life.companion.alias.${id}`),
    state: t(`life.companion.gw.${id}.${band}`),
    stateTone: 'mid',
  }
  g.stateTone = g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)
  return g
}
function gaugeFrac(g: Gauge): number { return clamp01(g.value / g.max) }
function gaugeTone(g: Gauge): string {
  const r = gaugeFrac(g)
  if (g.kind === 'neutral') return 'mid'
  if (g.kind === 'bad') return r >= 0.67 ? 'bad' : r < 0.34 ? 'good' : 'mid'
  return r >= 0.67 ? 'good' : r < 0.34 ? 'bad' : 'mid'
}
function signedBarStyle(value: number) {
  const width = clamp01(Math.abs(value)) * 50
  return { width: `${width}%`, left: value >= 0 ? '50%' : `${50 - width}%` }
}
const gauges = (rows: Array<Gauge | null>): Gauge[] => rows.filter((g): g is Gauge => g !== null)
const emotionGauges = computed<Gauge[]>(() => {
  const e = emotionNow.value || {}
  return gauges([
    gg('valence', t('life.companion.gauge.valence'), e.valence, { max: 1, kind: 'neutral', signed: true }),
    gg('arousal', t('life.companion.gauge.arousal'), e.arousal, { max: 1, kind: 'neutral' }),
    gg('connection', t('life.companion.gauge.connection'), e.connection, { max: 1, kind: 'good' }),
    gg('irritation', t('life.companion.gauge.irritation'), e.irritation, { max: 1, kind: 'bad' }),
  ])
})
const bodyGauges = computed<Gauge[]>(() => {
  const c = circadianNow.value || {}
  return gauges([
    gg('energy', t('life.companion.body.energy'), c.mental_energy, { max: 100, kind: 'good' }),
    gg('hunger', t('life.companion.body.hunger'), c.hunger, { max: 100, kind: 'bad' }),
    gg('health', t('life.companion.body.health'), c.health, { max: 100, kind: 'good' }),
  ])
})
const moodGauges = computed<Gauge[]>(() => gauges([
  gg('mood', t('life.companion.gauge.mood'), wave2.value?.mood, { max: 1, kind: 'neutral', signed: true }),
  gg('vagal', t('life.companion.gauge.vagal'), wave2.value?.vagal_tone, { max: 1, kind: 'good' }),
  gg('somatization', t('life.companion.gauge.somatization'), wave2.value?.somatization_index, { max: 1, kind: 'bad' }),
  gg('healthAnxiety', t('life.companion.gauge.healthAnxiety'), wave2.value?.health_anxiety, { max: 1, kind: 'bad' }),
  gg('somaticBurden', t('life.companion.gauge.somaticBurden'), wave2.value?.somatic_burden, { max: 1, kind: 'bad' }),
  gg('allostatic', t('life.companion.gauge.allostatic'), wave2.value?.allostatic_load, { max: 1, kind: 'bad' }),
  gg('loneliness', t('life.companion.gauge.loneliness'), wave2.value?.loneliness, { max: 1, kind: 'bad' }),
]))
const socialGauges = computed<Gauge[]>(() => gauges([
  gg('empathy', t('life.companion.gauge.empathy'), wave4a.value?.empathy, { max: 1, kind: 'good' }),
  gg('patience', t('life.companion.gauge.patience'), wave4b.value?.patience, { max: 1, kind: 'good' }),
]))
const attachGauges = computed<Gauge[]>(() => gauges([
  gg('distress', t('life.companion.gauge.distress'), attachment.value?.distress, { max: 1, kind: 'bad' }),
  gg('comorbid', t('life.companion.gauge.comorbid'), attachment.value?.comorbid_depression, { max: 1, kind: 'bad' }),
]))
const tsundereGauges = computed<Gauge[]>(() => gauges([
  gg('affection', t('life.companion.gauge.affection'), tsundere.value?.affection, { max: 1, kind: 'good' }),
  gg('tsun', t('life.companion.gauge.tsun'), tsundere.value?.expression, { max: 1, kind: 'neutral' }),
  gg('fixation', t('life.companion.gauge.fixation'), tsundere.value?.fixation, { max: 1, kind: 'bad' }),
]))
const yandereGauges = computed<Gauge[]>(() => gauges([
  gg('jealousy', t('life.companion.gauge.jealousy'), yandere.value?.jealousy, { max: 1, kind: 'bad' }),
  gg('intensity', t('life.companion.gauge.intensity'), yandere.value?.intensity, { max: 1, kind: 'neutral' }),
  gg('darkness', t('life.companion.gauge.darkness'), yandere.value?.darkness, { max: 1, kind: 'bad' }),
]))
const pdGauges = computed<Gauge[]>(() => gauges([
  gg('pdPressure', t('life.companion.gauge.pdPressure'), personadyn.value?.pressure, { max: 1, kind: 'bad' }),
  gg('pdAffection', t('life.companion.gauge.pdAffection'), personadyn.value?.affection, { max: 1, kind: 'good' }),
  gg('pdAnxiety', t('life.companion.gauge.pdAnxiety'), personadyn.value?.anxiety, { max: 1, kind: 'bad' }),
  gg('pdPossession', t('life.companion.gauge.pdPossession'), personadyn.value?.possessiveness, { max: 1, kind: 'bad' }),
  gg('pdTrust', t('life.companion.gauge.pdTrust'), personadyn.value?.trust, { max: 1, kind: 'good' }),
  gg('pdSelfControl', t('life.companion.gauge.pdSelfControl'), personadyn.value?.self_control, { max: 1, kind: 'good' }),
  gg('pdSuppression', t('life.companion.gauge.pdSuppression'), personadyn.value?.suppression, { max: 1, kind: 'bad' }),
]))
// Relationship stages / interaction modes are stored as canonical zh strings
// (see CompanionState.RELATIONSHIP_STAGES / INTERACTION_LIMITS); the label is
// localized per UI locale, the value stays zh.
const REL_STAGES = ['警惕', '疏离', '陌生', '认识', '熟悉', '友好', '亲近', '亲密']
const INTERACTIONS = ['回避', '受伤', '放松', '活泼', '温暖', '亲近', '爱意']
const stageLabel = (s: string) => (REL_STAGES.includes(s) ? t(`life.companion.relStage.${s}`) : (s || '—'))
const relStageIndex = (s: string) => REL_STAGES.indexOf(s)
const interactionLabel = (i: string) => (INTERACTIONS.includes(i) ? t(`life.companion.interaction.${i}`) : (i || '—'))
const interactionEffect = (i: string) => (INTERACTIONS.includes(i) ? t(`life.companion.interactionEffect.${i}`) : '')

const settingsForm = ref<Record<string, any>>({})
const worldDensity = ref('off')
const worldDensityOptions = computed(() => [
  { value: 'off', label: t('life.companion.worldDensity.off') },
  { value: 'texture', label: t('life.companion.worldDensity.texture') },
  { value: 'full', label: t('life.companion.worldDensity.full') },
])
const worldFictional = ref('fictional')
const worldCountry = ref('')
const worldCity = ref('')
const worldDistrict = ref('')
const worldPremise = ref('')
const personaText = ref('')
const worldActors = ref('')
const worldPlaces = ref('')
const worldBusy = ref(false)
const personBusy = ref(false)
const worldFictionalOptions = computed(() => [
  { value: 'fictional', label: t('life.companion.worldFictional.fictional') },
  { value: 'real', label: t('life.companion.worldFictional.real') },
])

// worldview snapshot (identity + renderable map + current actor positions)
const worldview = computed(() => data.value.worldview || null)
const worldMap = computed(() => worldview.value?.map || { locations: [], edges: [], actors: [], width: 1000, height: 700, title: '' })
const actorLocations = computed(() => worldview.value?.actor_locations || {})
function locById(id: string) { return (worldMap.value.locations || []).find((l: any) => l.id === id) || null }
const MAP_KINDS = ['home', 'work', 'shop', 'food', 'park', 'transit', 'other']
const KIND_LABEL: Record<string, string> = { home: 'life.companion.kind.home', work: 'life.companion.kind.work', shop: 'life.companion.kind.shop', food: 'life.companion.kind.food', park: 'life.companion.kind.park', transit: 'life.companion.kind.transit', other: 'life.companion.kind.other' }
const KIND_COLOR: Record<string, string> = { home: '#e07a5f', work: '#5b8def', shop: '#e0a23d', food: '#57a773', park: '#3faead', transit: '#8b6fd6', other: '#8a94a6' }
const usedKinds = computed(() => MAP_KINDS.filter(k => (worldMap.value.locations || []).some((l: any) => (l.kind || 'other') === k)))
function escapeHtml(value: any) {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(value ?? '').replace(/[&<>"']/g, (c) => map[c])
}
// --- Map (zoom/pan). Real country -> 高德 raster tiles. Fictional -> the same
// Leaflet engine on a simple coordinate system, drawing the setting's
// districts / water / roads / locations. -----------------------------------
const mapEl = ref<HTMLElement | null>(null)
const offlineHint = ref(false)
let leafletMap: any = null
let markerLayer: any = null
let leafletKind = ''
const TILE_URL = 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
const DISTRICT_FILLS = ['#2b4250', '#33495a', '#2f4a44', '#3a4258', '#463f4f', '#3d4a3a', '#4a4436', '#39485c']
const BUILDING_FILLS = ['#dfe4ea', '#d6dce4', '#e6eaf0', '#cfd7e0']
let activeRoute = ''
const scope = ref<'city' | 'nation'>('city')
const routeLayers: Record<string, { layer: any; base: any }[]> = {}
function reg(id: string, layer: any, base: any) { (routeLayers[id] ||= []).push({ layer, base }) }
/** Highlight the whole route in place — no re-render, so nothing vanishes. */
function focusRoute(id: string) {
  activeRoute = activeRoute === id ? '' : id
  for (const [rid, entries] of Object.entries(routeLayers)) {
    const on = rid === activeRoute
    for (const { layer, base } of entries) {
      if (layer.setStyle) layer.setStyle({ ...base, weight: (base.weight || 2) + (on ? 3.5 : 0), opacity: on ? 1 : (base.opacity ?? 1) })
      if (on && layer.bringToFront) layer.bringToFront()
    }
  }
}
function resetView() { activeRoute = ''; renderMap(false) }
function toggleScope() { scope.value = scope.value === 'city' ? 'nation' : 'city'; renderMap(false) }

function mapSize() { return { w: worldMap.value.width || 1000, h: worldMap.value.height || 700 } }
/** Canvas (x right, y down) -> Leaflet simple CRS [lat, lng] (y up). */
function xy(x: number, y: number) { return [mapSize().h - y, x] }
function routeLabel(text: string, color: string) {
  return L.divIcon({ className: 'wm-route', html: `<span class="wm-route-inner" style="--c:${color}">${escapeHtml(text)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] })
}
function minorLabel(text: string, color: string) {
  return L.divIcon({ className: 'wm-route wm-minor', html: `<span class="wm-route-inner" style="--c:${color}">${escapeHtml(text)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] })
}
function stationLabel(text: string, color: string) {
  return L.divIcon({ className: 'wm-route wm-station', html: `<span class="wm-route-inner" style="--c:${color}">${escapeHtml(text)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] })
}
/** Greedy label de-clutter in canvas space: keep the first, drop overlaps. */
function declutter(labels: any[]) {
  const kept: { x: number; y: number; w: number; h: number }[] = []
  const out: any[] = []
  for (const label of labels) {
    const w = String(label.text).length * 13 + 20
    const h = 22
    const clash = kept.some((k) => Math.abs(k.x - label.x) < (k.w + w) / 2 && Math.abs(k.y - label.y) < (k.h + h) / 2)
    if (clash) continue
    kept.push({ x: label.x, y: label.y, w, h })
    out.push(label)
  }
  return out
}

function ensureMap() {
  const kind = worldMap.value.kind === 'real' ? 'real' : 'fictional'
  if (leafletMap && leafletKind !== kind) { leafletMap.remove(); leafletMap = null; markerLayer = null }
  if (leafletMap || !mapEl.value) return
  if (kind === 'real') {
    offlineHint.value = false
    leafletMap = L.map(mapEl.value, { zoomControl: true, attributionControl: true }).setView([35, 105], 5)
    const tiles = L.tileLayer(TILE_URL, { subdomains: ['1', '2', '3', '4'], maxZoom: 19, minZoom: 3, attribution: t('life.companion.map.attribution') })
    tiles.on('tileerror', () => { offlineHint.value = true })
    tiles.on('load', () => { offlineHint.value = false })
    tiles.addTo(leafletMap)
  } else {
    offlineHint.value = false
    const { w, h } = mapSize()
    leafletMap = L.map(mapEl.value, { crs: L.CRS.Simple, zoomControl: true, attributionControl: false, minZoom: -3, maxZoom: 3 }).setView([h / 2, w / 2], -1.5)
    // draw order: water < parks < blocks < roads < metro < bus < labels
    for (const [name, z] of [['pWater', 350], ['pParks', 360], ['pBlocks', 370], ['pRoads', 380], ['pMetro', 400], ['pBus', 410], ['pLabels', 620]] as [string, number][]) {
      leafletMap.createPane(name)
      leafletMap.getPane(name).style.zIndex = String(z)
    }
    const syncZoom = () => leafletMap.getContainer().classList.toggle('wm-zoom-low', leafletMap.getZoom() < 0)
    leafletMap.on('zoomend', syncZoom)
    setTimeout(syncZoom, 0)
  }
  leafletKind = kind
  markerLayer = L.layerGroup().addTo(leafletMap)
}

function renderMap(keepView = false) {
  if (!leafletMap || !markerLayer) return
  markerLayer.clearLayers()
  for (const key of Object.keys(routeLayers)) delete routeLayers[key]
  activeRoute = ''
  const locations = worldMap.value.locations || []
  if (!locations.length) return
  const fictional = leafletKind !== 'real'
  const byId: Record<string, any> = {}
  for (const loc of locations) byId[loc.id] = loc

  if (fictional) {
    const { w, h } = mapSize()
    const path = (points: any[]) => points.map((p: any) => xy(p[0], p[1]))
    // nationwide overview
    const nation = worldMap.value.nation
    if (scope.value === 'nation' && nation) {
      L.rectangle([[0, 0], [h, w]], { pane: 'pWater', stroke: false, fillColor: '#d9e6f0', fillOpacity: 1 }).addTo(markerLayer)
      L.polygon(path(nation.land), { pane: 'pWater', color: '#8fbfe6', weight: 1.5, fillColor: '#f4efe1', fillOpacity: 1 }).addTo(markerLayer)
      ;(nation.provinces || []).forEach((p: any, i: number) => {
        L.polygon(path(p.points), { pane: 'pParks', color: '#c9b98f', weight: 1, fillColor: i % 2 ? '#ece2c8' : '#e4d7b4', fillOpacity: 0.55 }).addTo(markerLayer)
        L.marker(path([p.label])[0], { pane: 'pLabels', interactive: false, icon: routeLabel(p.name, '#8a7a5c') }).addTo(markerLayer)
      })
      ;(nation.routes || []).forEach((r: any) => L.polyline(path(r.points), { pane: 'pRoads', color: '#b98a4a', weight: 2.5, dashArray: '2 7' }).addTo(markerLayer))
      ;(nation.cities || []).forEach((c: any) => {
        const pos = xy(c.x, c.y)
        L.circleMarker(pos, { pane: 'pLabels', radius: c.capital ? 9 : 6, color: '#ffffff', weight: 2, fillColor: c.capital ? '#d64545' : '#3a6ea5', fillOpacity: 1 }).bindPopup(escapeHtml(c.name)).addTo(markerLayer)
        L.marker(pos, { pane: 'pLabels', interactive: false, icon: routeLabel(c.name, c.capital ? '#d64545' : '#3a6ea5') }).addTo(markerLayer)
      })
      leafletMap.fitBounds([[0, 0], [h, w]], { padding: [6, 6] })
      return
    }
    L.rectangle([[0, 0], [h, w]], { pane: 'pWater', stroke: false, fillColor: '#eef1f4', fillOpacity: 1 }).addTo(markerLayer)
    // residential compounds (小区), under the buildings
    ;(worldMap.value.compounds || []).forEach((cp: any) => {
      L.polygon(path(cp.points), { pane: 'pParks', color: '#c9b98f', weight: 1.2, dashArray: '7 5', fillColor: '#f3ead0', fillOpacity: 0.5 }).addTo(markerLayer)
      L.marker(path(cp.points)[0], { pane: 'pLabels', interactive: false, icon: routeLabel(cp.name, '#a9884a') }).addTo(markerLayer)
    })
    // water
    ;(worldMap.value.lakes || []).forEach((lk: any) => {
      L.polygon(path(lk.points), { pane: 'pWater', color: '#8fbfe6', weight: 1.5, fillColor: '#bcd9f0', fillOpacity: 1 }).addTo(markerLayer)
      if (lk.name && lk.name !== '') L.marker(xy(lk.label[0], lk.label[1]), { pane: 'pLabels', interactive: false, icon: routeLabel(lk.name, '#3d7fb5') }).addTo(markerLayer)
    })
    ;(worldMap.value.rivers || []).forEach((rv: any) => {
      L.polyline(path(rv.points), { pane: 'pWater', color: '#8fbfe6', weight: 16, lineCap: 'round', lineJoin: 'round' }).addTo(markerLayer)
      L.polyline(path(rv.points), { pane: 'pWater', color: '#bcd9f0', weight: 11, lineCap: 'round', lineJoin: 'round' }).addTo(markerLayer)
      if (rv.name && rv.name !== '') L.marker(path(rv.points)[Math.floor(rv.points.length / 2)], { pane: 'pLabels', interactive: false, icon: routeLabel(rv.name, '#3d7fb5') }).addTo(markerLayer)
    })
    // parks
    ;(worldMap.value.parks || []).forEach((pk: any) => {
      L.polygon(path(pk.points), { pane: 'pParks', color: '#a9d3a0', weight: 1, fillColor: '#c9e6c4', fillOpacity: 1 }).addTo(markerLayer)
      ;(pk.trees || []).forEach((tree: any) => L.circleMarker(xy(tree[0], tree[1]), { pane: 'pParks', radius: 2.6, stroke: false, fillColor: '#82bd79', fillOpacity: 1 }).addTo(markerLayer))
      if (pk.name && pk.name !== zhValue('life.companion.val.park')) L.marker(path(pk.points)[0], { pane: 'pLabels', interactive: false, icon: routeLabel(pk.name, '#5a9e52') }).addTo(markerLayer)
    })
    // buildings: drop shadow, footprint, and a rooftop inset for "towers"
    const buildingLabels: { x: number; y: number; text: string; color: string }[] = []
    ;(worldMap.value.blocks || []).forEach((bl: any) => {
      const pts = path(bl.points)
      L.polygon(pts.map((p: any) => [p[0] - 3, p[1] + 3]), { pane: 'pBlocks', stroke: false, fillColor: '#5b6b7a', fillOpacity: 0.16 }).addTo(markerLayer)
      L.polygon(pts, { pane: 'pBlocks', color: '#b9c3cd', weight: 1, fillColor: BUILDING_FILLS[(bl.shade || 0) % BUILDING_FILLS.length], fillOpacity: 1 }).addTo(markerLayer)
      if (bl.tower) {
        const cx = pts.reduce((s: number, p: any) => s + p[0], 0) / pts.length
        const cy = pts.reduce((s: number, p: any) => s + p[1], 0) / pts.length
        L.polygon(pts.map((p: any) => [cx + (p[0] - cx) * 0.5, cy + (p[1] - cy) * 0.5]),
          { pane: 'pBlocks', color: '#aab4c0', weight: 1, fillColor: '#eef2f6', fillOpacity: 1 }).addTo(markerLayer)
      }
      if (bl.name) {
        const cx = bl.points.reduce((s: number, p: any) => s + p[0], 0) / bl.points.length
        const cy = bl.points.reduce((s: number, p: any) => s + p[1], 0) / bl.points.length
        buildingLabels.push({ x: cx, y: cy, text: bl.name, color: bl.tower ? '#6b5b8a' : '#7a8794' })
      }
    })
    // model-named landmarks always shown; filler building names de-cluttered
    ;(worldMap.value.named_buildings || []).forEach((b: any) => {
      L.circleMarker(xy(b.x, b.y), { pane: 'pLabels', radius: 4, color: '#ffffff', weight: 1.5, fillColor: '#8a5a2b', fillOpacity: 1 }).addTo(markerLayer)
      L.marker(xy(b.x, b.y), { pane: 'pLabels', interactive: false, icon: routeLabel(b.name, '#8a5a2b') }).addTo(markerLayer)
    })
    for (const label of declutter(buildingLabels)) {
      L.marker(xy(label.x, label.y), { pane: 'pLabels', interactive: false, icon: minorLabel(label.text, label.color) }).addTo(markerLayer)
    }
    // road hierarchy: highway > arterial > street
    const STREET_STYLE: Record<string, { casing: number; fill: number; color: string }> = {
      highway: { casing: 13, fill: 6.5, color: '#f08c2e' },
      arterial: { casing: 10, fill: 4.5, color: '#f7cf8a' },
      street: { casing: 5, fill: 2.4, color: '#ffffff' },
    }
    ;(worldMap.value.streets || []).forEach((st: any) => {
      const style = STREET_STYLE[st.kind] || STREET_STYLE.street
      const pts = path(st.points)
      L.polyline(pts, { pane: 'pRoads', color: '#ffffff', weight: style.casing, lineCap: 'round', lineJoin: 'round' }).addTo(markerLayer)
      L.polyline(pts, { pane: 'pRoads', color: style.color, weight: style.fill, lineCap: 'round', lineJoin: 'round' }).addTo(markerLayer)
    })
    // named roads on top (clickable / highlightable)
    ;(worldMap.value.roads || []).forEach((rd: any, i: number) => {
      if (!rd.name) return
      const pts = path(rd.points)
      const rid = 'road:' + i
      L.polyline(pts, { pane: 'pRoads', color: '#ffffff', weight: 11, lineCap: 'round', lineJoin: 'round' }).addTo(markerLayer)
      const base = { pane: 'pRoads', color: '#f6c56b', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }
      reg(rid, L.polyline(pts, base).on('click', () => focusRoute(rid)).addTo(markerLayer), base)
      L.marker(pts[Math.floor(pts.length / 2)], { pane: 'pLabels', interactive: true, icon: routeLabel(rd.name, '#9a8358') }).on('click', () => focusRoute(rid)).addTo(markerLayer)
    })
    // districts (faint zones) + labels
    ;(worldMap.value.districts || []).forEach((d: any, i: number) => {
      L.circle(xy(d.x, d.y), { pane: 'pRoads', radius: d.r || 200, color: '#93a2b0', weight: 1, dashArray: '4 7', fillColor: DISTRICT_FILLS[i % DISTRICT_FILLS.length], fillOpacity: 0.08 }).addTo(markerLayer)
      L.marker(xy(d.x, d.y), { pane: 'pLabels', interactive: false, icon: L.divIcon({ className: 'wm-district', html: `<span class="wm-district-inner">${escapeHtml(d.name)}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] }) }).addTo(markerLayer)
    })
    // metro (click a line / station / name to highlight the whole line)
    const stationLabels: { x: number; y: number; text: string; color: string }[] = []
    ;(worldMap.value.metro || []).forEach((m: any, i: number) => {
      const pts = path(m.points)
      const rid = 'metro:' + i
      L.polyline(pts, { pane: 'pMetro', color: '#ffffff', weight: 8, lineCap: 'round', lineJoin: 'round' }).addTo(markerLayer)
      const base = { pane: 'pMetro', color: m.color, weight: 4.5, opacity: 0.92, lineCap: 'round', lineJoin: 'round' }
      reg(rid, L.polyline(pts, base).on('click', () => focusRoute(rid)).addTo(markerLayer), base)
      ;(m.stations || []).forEach((s: any) => {
        L.circleMarker(xy(s.x, s.y), { pane: 'pMetro', radius: 5, color: '#ffffff', weight: 2.5, fillColor: m.color, fillOpacity: 1 })
          .bindPopup(escapeHtml(s.name || m.name)).on('click', () => focusRoute(rid)).addTo(markerLayer)
        if (s.name) stationLabels.push({ x: s.x, y: s.y, text: s.name, color: m.color })
      })
      L.marker(pts[Math.floor(pts.length / 2)], { pane: 'pLabels', interactive: true, icon: routeLabel(m.name, m.color) }).on('click', () => focusRoute(rid)).addTo(markerLayer)
    })
    // bus
    ;(worldMap.value.bus || []).forEach((b: any, i: number) => {
      const pts = path(b.points)
      const rid = 'bus:' + i
      const base = { pane: 'pBus', color: b.color, weight: 3, opacity: 0.95, dashArray: '7 7', lineCap: 'round' }
      reg(rid, L.polyline(pts, base).on('click', () => focusRoute(rid)).addTo(markerLayer), base)
      ;(b.stops || []).forEach((s: any) => L.circleMarker(xy(s.x, s.y), { pane: 'pBus', radius: 3.2, color: '#ffffff', weight: 1.5, fillColor: b.color, fillOpacity: 1 })
        .bindPopup(escapeHtml(s.name || b.name)).on('click', () => focusRoute(rid)).addTo(markerLayer))
      L.marker(pts[Math.floor(pts.length / 2)], { pane: 'pLabels', interactive: true, icon: routeLabel(b.name, b.color) }).on('click', () => focusRoute(rid)).addTo(markerLayer)
    })
    // station names, de-cluttered so they stay readable
    for (const label of declutter(stationLabels)) {
      L.marker(xy(label.x, label.y), { pane: 'pLabels', interactive: false, icon: stationLabel(label.text, label.color) }).addTo(markerLayer)
    }
  } else {
    for (const edge of worldMap.value.edges || []) {
      const a = byId[edge[0]]
      const b = byId[edge[1]]
      if (a?.lat != null && b?.lat != null) {
        L.polyline([[a.lat, a.lng], [b.lat, b.lng]], { color: '#5b8def', weight: 3, opacity: 0.55, dashArray: '2 8', lineCap: 'round' }).addTo(markerLayer)
      }
    }
  }

  for (const loc of locations) {
    const color = KIND_COLOR[loc.kind] || KIND_COLOR.other
    const pos = fictional ? xy(loc.x, loc.y) : (loc.lat != null ? [loc.lat, loc.lng] : null)
    if (!pos) continue
    const icon = L.divIcon({
      className: 'wm-pin-holder',
      html: `<span class="wm-pin" style="--c:${color}"></span><span class="wm-pin-label">${escapeHtml(loc.name)}</span>`,
      iconSize: [0, 0], iconAnchor: [0, 0],
    })
    L.marker(pos, { icon })
      .bindPopup(`<b>${escapeHtml(loc.name)}</b>${loc.desc ? '<br>' + escapeHtml(loc.desc) : ''}`)
      .addTo(markerLayer)
  }
  for (const actor of worldMap.value.actors || []) {
    const loc = byId[actorLocations.value[actor.id] || actor.location]
    if (!loc) continue
    const pos = fictional ? xy(loc.x, loc.y) : (loc.lat != null ? [loc.lat, loc.lng] : null)
    if (!pos) continue
    const icon = L.divIcon({
      className: 'wm-actor-holder',
      html: `<span class="wm-actor-badge">${escapeHtml((actor.name || '?').slice(0, 1))}</span><span class="wm-actor-name">${escapeHtml(actor.name)}</span>`,
      iconSize: [0, 0], iconAnchor: [0, 0],
    })
    L.marker(pos, { icon }).bindPopup(`${escapeHtml(actor.name)} · ${escapeHtml(loc.name)}`).addTo(markerLayer)
  }

  if (keepView) return
  if (fictional) {
    const { w, h } = mapSize()
    leafletMap.fitBounds([[0, 0], [h, w]], { padding: [0, 0] })
  } else {
    const points = locations.filter((l: any) => l.lat != null).map((l: any) => [l.lat, l.lng])
    if (points.length > 1) leafletMap.fitBounds(points, { padding: [56, 56], maxZoom: 15 })
    else if (points.length === 1) leafletMap.setView(points[0], 14)
  }
}
watch([tab, () => data.value.worldview], async () => {
  if (tab.value !== 'world') return
  await nextTick()
  ensureMap()
  renderMap()
  if (leafletMap) setTimeout(() => leafletMap.invalidateSize(), 80)
})
onUnmounted(() => { if (leafletMap) { leafletMap.remove(); leafletMap = null; markerLayer = null } })

function syncSettings() {
  settingsForm.value = { ...syncCogSettings() }
  worldDensity.value = String(data.value.settings?.world_density || 'off')
  worldFictional.value = String(data.value.settings?.world_fictional || 'fictional')
  worldCountry.value = String(data.value.settings?.world_country || '')
  worldCity.value = String(data.value.settings?.world_city || '')
  worldDistrict.value = String(data.value.settings?.world_district || '')
  worldPremise.value = String(data.value.settings?.world_premise || '')
  personaText.value = String(data.value.settings?.persona_text || '')
  worldActors.value = String(data.value.settings?.world_actors || '')
  worldPlaces.value = String(data.value.settings?.world_places || '')
}
/** Set by saveSettings while the request is in flight: the FAB and the two
    section-head save buttons disable on it, so a slow gateway cannot stack
    duplicate settings_set calls. */
const saving = ref(false)
async function saveSettings() {
  if (saving.value) return
  saving.value = true
  try {
    const settings = { ...cogPayload(), world_density: worldDensity.value,
      world_fictional: worldFictional.value, world_country: worldCountry.value,
      world_city: worldCity.value, world_district: worldDistrict.value,
      world_premise: worldPremise.value, world_actors: worldActors.value, world_places: worldPlaces.value,
      persona_text: personaText.value }
    const result = await act('settings_set', { settings })
    if (result?.rejected?.length) flash(t('life.companion.flash.settingsSavedIgnored', { items: result.rejected.join(t('life.companion.listSeparator')) })); else flash(t('life.companion.flash.settingsSaved'))
  } finally { saving.value = false }
}

/* ── 消息平台适配器（只读概览） ───────────────────────────────────────────────
   完整的多适配器增删改与配置文件路由已独立成「设置 → 消息平台」页面
   （AdapterSettingsPage.vue）。陪伴面板只保留运行状态，避免两处实现漂移。 */
const adapters = ref<any[]>([])
const adapterRuntime = ref<any[]>([])
const adapterBusy = ref(false)

function runtimeOf(id: string) { return adapterRuntime.value.find((r) => r.id === id) || {} }

async function loadAdapters() {
  const result = await act('adapter_list', {})
  if (!result) return
  adapters.value = result.instances || []
  adapterRuntime.value = result.runtime || []
}
async function syncAdapters() {
  adapterBusy.value = true
  try { await act('adapter_sync', {}); flash(t('life.companion.flash.adaptersRelistened')) }
  finally { adapterBusy.value = false }
}

async function generateWorld() {
  if (worldBusy.value) return
  const ok = await confirm({
    title: t('life.companion.world.rewriteTitle'),
    message: t('life.companion.world.rewriteMessage'),
    confirmLabel: t('life.companion.world.overwriteConfirm'),
    danger: true,
  })
  if (!ok) return
  worldBusy.value = true
  try {
    const result = await act('world_generate', { instructions: '' })
    if (result?.worldview) flash(t('life.companion.flash.worldGenerated'))
  } finally {
    worldBusy.value = false
  }
}
async function generateMapOnly() {
  if (worldBusy.value) return
  worldBusy.value = true
  try {
    const result = await act('world_map_generate', { instructions: '' })
    if (result?.worldview) flash(t('life.companion.flash.mapRegenerated'))
  } finally {
    worldBusy.value = false
  }
}
async function clearWorld() {
  const ok = await confirm({
    title: t('life.companion.world.clearTitle'),
    message: t('life.companion.world.clearMessage'),
    confirmLabel: t('life.companion.world.clearConfirm'),
    danger: true,
  })
  if (!ok) return
  const result = await act('world_clear', {})
  if (result) flash(t('life.companion.flash.worldCleared'))
}
async function resetPerson() {
  const first = await confirm({
    title: t('life.companion.reset.title'),
    message: t('life.companion.reset.message'),
    confirmLabel: t('life.companion.reset.continue'),
    danger: true,
  })
  if (!first) return
  const second = await confirm({
    title: t('life.companion.reset.confirmTitle'),
    message: t('life.companion.reset.confirmMessage'),
    confirmLabel: t('life.companion.reset.confirm'),
    danger: true,
  })
  if (!second) return
  personBusy.value = true
  try {
    await act('reset_person', {})
    flash(t('life.companion.flash.personReset'))
    await load()
  } finally { personBusy.value = false }
}
// --- persona (moved out of Settings → 人设) --------------------------------
type PersonaForm = { name: string; avatar: string; birthDate: string; gender: string; description: string; personality: string; greeting: string; customPrompt: string }
const emptyPersona = (): PersonaForm => ({ name: '', avatar: '', birthDate: '', gender: '', description: '', personality: '', greeting: '', customPrompt: '' })
const genderOptions = computed(() => [
  { value: '', label: t('life.companion.gender.none') },
  { value: 'female', label: t('life.companion.gender.female') },
  { value: 'male', label: t('life.companion.gender.male') },
  { value: 'other', label: t('life.companion.gender.other') },
])
function genderLabel(value: string) {
  return (genderOptions.value.find((o) => o.value === value) || genderOptions.value[0]).label
}
const personaForm = ref<PersonaForm>(emptyPersona())
const personaBusy = ref(false)
function personaHost() {
  return (globalThis as any).__0KAY_HOST__ as {
    getPersona?: () => Record<string, string>
    setPersona?: (patch: Record<string, string>) => void
    saveConfig?: () => void
  } | undefined
}
function loadPersona() {
  const host = personaHost()
  if (host?.getPersona) { personaForm.value = { ...emptyPersona(), ...(host.getPersona() || {}) }; return }
  try {
    const cfg = JSON.parse(localStorage.getItem('0kay_config') || '{}')
    personaForm.value = { ...emptyPersona(), ...(cfg.persona || {}) }
  } catch { personaForm.value = emptyPersona() }
}
// Analysis is required before saving: the model reads the persona into
// parameters, the owner reviews/tunes them, and only then can it be persisted.
const analysis = ref<any | null>(null)
const analyzeBusy = ref(false)
const characterSelectOptions = computed(() => [
  { value: '', label: t('life.companion.gender.undecidedBracket') },
  ...((analysis.value?.options?.character || []) as any[]).map((o) => ({ value: o.key, label: o.label })),
])
const relationshipSelectOptions = computed(() => [
  { value: '', label: t('life.companion.gender.undecidedBracket') },
  ...((analysis.value?.options?.relationship || []) as any[]).map((o) => ({
    value: o.key,
    label: o.label + (o.pathological ? t('life.companion.relationship.pathologicalSuffix') : ''),
  })),
])
function personaBody() {
  return { text: [personaForm.value.description, personaForm.value.personality].filter((v) => String(v || '').trim()).join('\n') }
}
// Editing the text invalidates the previous analysis — re-understand before save.
watch(() => [personaForm.value.description, personaForm.value.personality, personaForm.value.customPrompt], () => { analysis.value = null })
function relationshipOptionFor(key: string) {
  return ((analysis.value?.options?.relationship || []) as any[]).find((o) => o.key === key)
}
// The relationship style drives the attachment ODE: only the pathological
// family (病娇族) may switch it on, with the archetype its option declares; a
// healthy style (安全/焦虑/回避/...) always turns it off.  `immediate` so the
// freshly-analysed relationship is applied without needing a manual change.
watch(() => analysis.value?.relationship?.key, (key) => {
  const att = analysis.value?.attachment
  if (!att) return
  const opt = relationshipOptionFor(key)
  att.type = opt?.pathological ? (opt.attachment_type || '') : ''
}, { immediate: true })
// Give the attachment seeds a neutral default when a type is chosen but the
// analyzed text carried no attachment keywords.
watch(() => analysis.value?.attachment?.type, (type) => {
  const att = analysis.value?.attachment
  if (!type || !att) return
  if (!att.initial || typeof att.initial !== 'object') att.initial = {}
  for (const [key, value] of Object.entries({ A: 0.05, Am: 0, Tr: 0.5, J: 0, X: 0.05, S: 0.6, O: 0 })) {
    if (att.initial[key] == null) att.initial[key] = value
  }
})
async function analyzePersona() {
  const body = personaBody()
  if (!body.text.trim()) { flash(t('life.companion.flash.needDescriptionOrPersonality')); return }
  analyzeBusy.value = true
  try {
    const result = await act('persona_analyze', { text: body.text, gender: personaForm.value.gender })
    if (result) {
      analysis.value = result
      // Seed the analyser's gender/social-script pick from the backend's read,
      // else fall back to the currently-saved setting (identity if unset).
      analysis.value.personadynGender = result.personadyn?.gender || settingsForm.cog_personadyn_gender || zhValue('life.companion.pdGender.unspecified')
      if (!personaForm.value.gender && result.gender) personaForm.value.gender = result.gender
      flash(result.source === 'llm' ? t('life.companion.flash.analyzedLlm') : t('life.companion.flash.analyzedLocal'))
    }
  } finally { analyzeBusy.value = false }
}
async function savePersona() {
  if (!analysis.value) { flash(t('life.companion.flash.needLlmFirst')); return }
  personaBusy.value = true
  try {
    const body = personaBody()
    // The analyser's traits carry the style axes; the owner may have changed
    // the archetype selects afterwards, so sync them and drop the stale axes
    // (the backend recomputes axes from the chosen archetypes).
    const traits = { ...(analysis.value.traits || {}) }
    traits.gender = analysis.value.gender || personaForm.value.gender || null
    traits.character = analysis.value.character?.key || null
    traits.relationship = analysis.value.relationship?.key || null
    traits.expression = analysis.value.character?.expression || analysis.value.expression || null
    delete traits.axes
    const result = await act('persona_apply', {
      text: body.text,
      traits,
      attachment: analysis.value.attachment || {},
      tsundere: analysis.value.tsundere || {},
      personadyn: {
        ...(analysis.value.personadyn || {}),
        // The owner may override the archetype's implied gender/social script
        // after analysis; the backend applies it as the persona's G group.
        gender: analysis.value.personadynGender || settingsForm.cog_personadyn_gender || zhValue('life.companion.pdGender.unspecified'),
      },
    })
    if (!result) return
    const host = personaHost()
    if (host?.setPersona) {
      host.setPersona({ ...personaForm.value })
      host.saveConfig?.()
    } else {
      const cfg = JSON.parse(localStorage.getItem('0kay_config') || '{}')
      cfg.persona = { ...(cfg.persona || {}), ...personaForm.value }
      localStorage.setItem('0kay_config', JSON.stringify(cfg))
    }
    flash(t('life.companion.flash.personaSaved'))
  } finally { personaBusy.value = false }
}
onMounted(loadPersona)
watch(tab, (value) => { if (value === 'persona') loadPersona() })

onMounted(load)

// --- live refresh of the 实时状态 card --------------------------------------
// The card never refreshed on its own; poll a fresh snapshot every 12s while
// the page is visible (paused in a hidden tab) and stamp when it updated.
// Deliberately NOT load(): that would flip `loading` and re-sync the settings
// form, clobbering edits the user has not saved yet.
const stateUpdatedAt = ref('')
let pollTimer: ReturnType<typeof setInterval> | undefined
async function pollCompanion() {
  if (document.visibilityState !== 'visible') return
  try {
    data.value = await lifeGet('/api/life/companion')
    stateUpdatedAt.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch { /* keep the last snapshot */ }
}
function onVisibilityChange() { if (document.visibilityState === 'visible') void pollCompanion() }
onMounted(() => {
  pollTimer = setInterval(() => { void pollCompanion() }, 12000)
  // Returning to the tab should not wait up to 12s for fresh numbers.
  document.addEventListener('visibilitychange', onVisibilityChange)
})
onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

/* Install the shared design tokens once per document. A Vue <style scoped>
   block is compiled per component, so the kit has to be injected at runtime to
   stay literally identical to the 消息平台 settings page. */
injectStyle('life-plugin-kit', lifeKitCss('pcp'))
</script>

<template>
  <main class="pcp" ref="pageEl">
    <header class="hero">
      <div class="hero-main">
        <div class="hero-copy">
          <p class="eyebrow"><b>◉</b> L.I.F.E / COGNITION</p>
          <h1>{{ t('life.companion.title') }}</h1>
          <p class="sub">{{ t('life.companion.subtitle') }}</p>
        </div>
        <div class="hero-actions">
          <button class="btn" :class="{ tonic: !life?.alive }" :disabled="lifeBusy || loading" @click="life?.alive ? stopLife() : startLife()">{{ lifeBusy ? lifeBusyLabel() : (life?.alive ? t('life.companion.life.pause') : t('life.companion.life.start')) }}</button>
          <button class="fab" :disabled="saving || loading" @click="saveSettings"><span class="fab-ic">✦</span>{{ saving ? t('life.companion.saving') : t('life.companion.saveSettings') }}</button>
          <button class="btn tonic" :disabled="loading" @click="load">{{ loading ? t('life.companion.refreshing') : t('life.companion.refresh') }}</button>
        </div>
      </div>

      <div class="state-row">
        <span class="pill" :class="{ bad: cognition && !cognition.enabled }">{{ t('life.companion.cognitionCore') }} {{ cognition?.available === false ? t('life.companion.status.unavailable') : cognition?.enabled ? t('life.companion.status.running') : t('life.companion.status.stopped') }}</span>
        <span class="pill soft">{{ t('life.companion.state.decidedTurns', { n: wave1?.turns ?? 0 }) }}</span>
        <span class="pill soft">{{ t('life.companion.state.engrams', { n: wave1?.engrams ?? 0 }) }}</span>
        <span class="pill soft">{{ t('life.companion.state.lexicon', { n: wave3?.lexicon_size ?? 0 }) }}</span>
      </div>
    </header>

    <p v-if="error" class="banner err">{{ error }}</p>
    <p v-if="notice" class="banner ok">{{ notice }}</p>

    <nav class="tabs" :aria-label="t('life.companion.view')">
      <button v-for="item in navItems" :key="item.key" class="tab" :class="{ active: tab === item.key }" @click="jump(item.key)">
        <i>{{ item.i }}</i><span class="tab-ic">{{ item.icon }}</span>{{ t(item.labelKey) }}
      </button>
    </nav>

    <!-- 02 人设（原设置页 → 人设，移到陪伴） -->
    <section v-show="tab === 'persona'" data-panel="persona" class="panel">
      <div class="section-head"><div><h2>{{ t('life.companion.persona.title') }}</h2><p class="desc">{{ t('life.companion.persona.desc') }}</p></div>
        <div class="head-actions">
          <button class="btn tonic sm" :disabled="analyzeBusy || loading" @click="analyzePersona">{{ analyzeBusy ? t('life.companion.persona.analyzing') : t('life.companion.persona.analyze') }}</button>
          <button class="btn filled sm" :disabled="personaBusy || !analysis" @click="savePersona">{{ t('life.companion.persona.save') }}</button>
        </div>
      </div>
      <article class="card">
        <div class="settings-grid">
          <label><span>{{ t('life.companion.persona.name') }}</span><input v-model="personaForm.name" class="field" /></label>
          <label><span>{{ t('life.companion.persona.gender') }}</span><AppSelect v-model="personaForm.gender" :options="genderOptions" :aria-label="t('life.companion.persona.gender')" /></label>
          <label><span>{{ t('life.companion.persona.avatarUrl') }}</span><input v-model="personaForm.avatar" class="field" /></label>
          <label><span>{{ t('life.companion.persona.birthday') }}</span><input v-model="personaForm.birthDate" type="date" class="field" /></label>
        </div>
        <label class="pfield"><span>{{ t('life.companion.persona.description') }}</span><textarea v-model="personaForm.description" rows="3" class="field"></textarea></label>
        <label class="pfield"><span>{{ t('life.companion.persona.personality') }}</span><textarea v-model="personaForm.personality" rows="3" class="field"></textarea></label>
        <label class="pfield"><span>{{ t('life.companion.persona.greeting') }}</span><textarea v-model="personaForm.greeting" rows="2" class="field"></textarea></label>
        <label class="pfield"><span>{{ t('life.companion.persona.customPrompt') }}</span><textarea v-model="personaForm.customPrompt" rows="5" class="field"></textarea></label>
        <p class="hint">{{ t('life.companion.persona.hint') }}</p>
      </article>
      <article v-if="analysis" class="card">
        <h3>{{ t('life.companion.persona.analysisResult') }} <span class="count-pill ok">{{ analysis.source === 'llm' ? t('life.companion.persona.sourceLlm') : t('life.companion.persona.sourceLocal') }}</span></h3>
        <div class="settings-grid">
          <label><span>{{ t('life.companion.persona.gender') }}</span><AppSelect v-model="analysis.gender" :options="genderOptions" :aria-label="t('life.companion.persona.gender')" /></label>
          <label><span>{{ t('life.companion.persona.characterArchetype') }}</span><AppSelect v-model="analysis.character.key" :options="characterSelectOptions" :aria-label="t('life.companion.persona.characterArchetype')" /></label>
          <label><span>{{ t('life.companion.persona.relationshipType') }}</span><AppSelect v-model="analysis.relationship.key" :options="relationshipSelectOptions" :aria-label="t('life.companion.persona.relationshipTypeAria')" /></label>
        </div>
        <p class="hint">
          {{ t('life.companion.persona.genderLine', { gender: genderLabel(analysis.gender) }) }}
          <template v-if="analysis.relationship?.label">
            {{ t('life.companion.persona.relationshipLine', { label: analysis.relationship.label }) }}
            <template v-if="analysis.relationship.pathological">{{ t('life.companion.persona.pathologicalNote') }}</template>
            <template v-else>{{ t('life.companion.persona.healthyNote') }}</template>
          </template>
        </p>
        <p v-if="analysis.character?.expression || analysis.expression" class="hint">{{ t('life.companion.persona.speakingStyle', { style: analysis.character?.expression || analysis.expression }) }}</p>

        <h4>{{ t('life.companion.persona.emotionSomatic') }}</h4>
        <div class="settings-grid">
          <label><span>{{ t('life.companion.persona.threatBaseline') }}</span><input v-model.number="analysis.traits.threat_baseline" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>{{ t('life.companion.persona.rewardBaseline') }}</span><input v-model.number="analysis.traits.reward_baseline" type="number" step="0.1" min="0" max="2" class="field tiny" /></label>
          <label><span>{{ t('life.companion.persona.catastrophizing') }}</span><input v-model.number="analysis.traits.catastrophizing" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>{{ t('life.companion.persona.erqProfile') }}</span><AppSelect v-model="analysis.traits.erq_profile" :options="cogProfileOptions" :aria-label="t('life.companion.persona.erqProfile')" /></label>
          <label><span>{{ t('life.companion.persona.sleepHour') }}</span><input v-model.number="analysis.traits.sleep_hour" type="number" min="0" max="23" class="field tiny" /></label>
        </div>

        <h4>{{ t('life.companion.persona.personalityDims') }}</h4>
        <div class="settings-grid">
          <label><span>{{ t('life.companion.persona.extraversion') }}</span><input v-model.number="analysis.traits.extraversion" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>{{ t('life.companion.persona.agreeableness') }}</span><input v-model.number="analysis.traits.agreeableness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>{{ t('life.companion.persona.conscientiousness') }}</span><input v-model.number="analysis.traits.conscientiousness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>{{ t('life.companion.persona.openness') }}</span><input v-model.number="analysis.traits.openness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>{{ t('life.companion.persona.attachAnxiety') }}</span><input v-model.number="analysis.traits.attach_anxiety" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>{{ t('life.companion.persona.attachAvoidance') }}</span><input v-model.number="analysis.traits.attach_avoidance" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
        </div>
        <details class="pdetails">
          <summary>{{ t('life.companion.persona.moreStyle') }}</summary>
          <div class="settings-grid" style="margin-top:10px">
            <label><span>{{ t('life.companion.persona.expressiveness') }}</span><input v-model.number="analysis.traits.expressiveness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.initiative') }}</span><input v-model.number="analysis.traits.initiative" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.humor') }}</span><input v-model.number="analysis.traits.humor" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.warmth') }}</span><input v-model.number="analysis.traits.warmth" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.formality') }}</span><input v-model.number="analysis.traits.formality" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.assertiveness') }}</span><input v-model.number="analysis.traits.assertiveness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          </div>
        </details>

        <template v-if="analysis.attachment.type">
          <h4>{{ t('life.companion.persona.attachmentHeading', { label: analysis.relationship.label }) }}</h4>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.persona.attachTypeByRelationship') }}</span><input class="field" :value="t('life.companion.attachmentTypeValue', { type: analysis.attachment.type, label: analysis.relationship.label || '' })" disabled /></label>
            <label><span>{{ t('life.companion.persona.initialAnxietyX') }}</span><input v-model.number="analysis.attachment.initial.X" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.initialSecurityS') }}</span><input v-model.number="analysis.attachment.initial.S" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          </div>
          <p class="hint">{{ t('life.companion.persona.attachmentHint') }}</p>
        </template>
        <p v-else class="hint">{{ t('life.companion.persona.attachmentDisabled') }}</p>

        <template v-if="analysis.tsundere && analysis.tsundere.type">
          <h4>{{ t('life.companion.persona.tsundereHeading') }}</h4>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.persona.tsundereType') }}</span><input class="field" :value="analysis.tsundere.type" disabled /></label>
            <label><span>{{ t('life.companion.persona.initialAffectionA') }}</span><input v-model.number="analysis.tsundere.initial.A" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.initialTsunExpressionT') }}</span><input v-model.number="analysis.tsundere.initial.T" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.initialYandereY') }}</span><input v-model.number="analysis.tsundere.initial.Y" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          </div>
          <p class="hint">{{ t('life.companion.persona.tsundereHint') }}</p>
        </template>
        <p v-else class="hint">{{ t('life.companion.persona.tsundereDisabled') }}</p>

        <template v-if="analysis.personadyn && analysis.personadyn.type">
          <h4>{{ t('life.companion.persona.personadynHeading') }}</h4>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.persona.personaArchetype') }}</span><input class="field" :value="analysis.personadyn.type" disabled /></label>
            <label><span>{{ t('life.companion.persona.initialAffectionA') }}</span><input v-model.number="analysis.personadyn.initial.A" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.initialAnxietyX') }}</span><input v-model.number="analysis.personadyn.initial.X" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.initialPossessionO') }}</span><input v-model.number="analysis.personadyn.initial.O" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.initialTrustTr') }}</span><input v-model.number="analysis.personadyn.initial.Tr" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.initialSelfControlK') }}</span><input v-model.number="analysis.personadyn.initial.K" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.genderSocialScript') }}</span><AppSelect v-model="analysis.personadynGender" :options="personadynGenderOptions" :aria-label="t('life.companion.persona.genderSocialScriptAria')" /></label>
          </div>
          <p class="hint">{{ t('life.companion.persona.personadynHint') }}</p>
        </template>
        <p v-else class="hint">{{ t('life.companion.persona.personadynDisabled') }}</p>
      </article>
    </section>

    <!-- 01 认知 -->
    <section v-show="tab === 'cognition'" data-panel="cognition" class="panel">
      <div class="section-head"><div><h2>{{ t('life.companion.cognition.title') }}</h2><p class="desc">{{ t('life.companion.cognition.desc') }}</p></div>
        <div class="head-actions"><button class="btn filled sm" :disabled="saving" @click="saveSettings">{{ saving ? t('life.companion.saving') : t('life.companion.saveSettings') }}</button></div>
      </div>

      <article class="card">
        <h3>{{ t('life.companion.life.title') }} <span class="count-pill" :class="{ ok: life?.alive }">{{ life?.alive ? t('life.companion.life.alive') : t('life.companion.life.notStarted') }}</span></h3>
        <div class="settings-grid">
          <div class="cog-metric"><span>{{ t('life.companion.life.status') }}</span><strong>{{ life?.alive ? t('life.companion.life.alive') : t('life.companion.life.notStarted') }}</strong></div>
          <div class="cog-metric"><span>{{ t('life.companion.life.livedFor') }}</span><strong>{{ lifeAgeText() }}</strong></div>
          <div class="cog-metric"><span>{{ t('life.companion.life.ticks') }}</span><strong>{{ life?.ticks ?? 0 }}</strong></div>
          <div class="cog-metric"><span>{{ t('life.companion.life.residentThinking') }}</span><strong>{{ life?.resident_running ? t('life.companion.status.running') : t('life.companion.status.stopped') }}</strong></div>
          <div class="cog-metric"><span>{{ t('life.companion.life.proactive') }}</span><strong>{{ life?.proactive_enabled ? t('life.companion.on') : t('life.companion.off') }}</strong></div>
          <div class="cog-metric"><span>{{ t('life.companion.life.lastThought') }}</span><strong>{{ (life?.last_tick || '').slice(0, 16).replace('T', ' ') || '—' }}</strong></div>
        </div>
        <p v-if="life?.last_thought" class="hint">{{ t('life.companion.life.currentThought', { text: life.last_thought }) }}</p>
        <p v-if="life?.focus" class="hint">{{ t('life.companion.life.focus', { text: life.focus }) }}</p>
        <p v-if="life?.active_goal" class="hint">{{ t('life.companion.life.goal', { text: life.active_goal }) }}</p>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:10px">
          <label class="sw"><input type="checkbox" v-model="lifeGreet" /><span>{{ t('life.companion.life.greetOnStart') }}</span></label>
          <button class="btn sm" :class="{ filled: !life?.alive }" :disabled="lifeBusy || loading" @click="life?.alive ? stopLife() : startLife()">
            {{ lifeBusy ? lifeBusyLabel() : (life?.alive ? t('life.companion.life.pause') : t('life.companion.life.start')) }}
          </button>
        </div>
        <p class="hint">{{ t('life.companion.life.hint') }}</p>
      </article>

      <article class="card">
        <h3>{{ t('life.companion.realtime.title') }} <span class="count-pill" :class="{ ok: cognition?.enabled }">{{ cognition?.enabled ? t('life.companion.status.running') : t('life.companion.status.stopped') }}</span><span v-if="stateUpdatedAt" class="count-pill sync-pill">{{ t('life.companion.realtime.updatedAt', { time: stateUpdatedAt }) }}</span></h3>
        <div v-if="!cognition" class="empty">{{ t('life.companion.realtime.empty') }}</div>
        <template v-else>
          <!-- 她现在: Russell circumplex + the moment's emotion/body gauges. -->
          <div class="sub-label">{{ t('life.companion.realtime.atAGlance') }}</div>
          <p class="hint">{{ t('life.companion.realtime.atAGlanceHint') }}</p>
          <div class="at-a-glance">
            <div v-if="emotionNow" class="mood-plot-wrap" role="img" :aria-label="t(russellQuadrant)">
              <span class="plot-label plot-n">{{ t('life.companion.axis.arousalHigh') }}</span>
              <span class="plot-label plot-s">{{ t('life.companion.axis.arousalLow') }}</span>
              <span class="plot-label plot-w">{{ t('life.companion.axis.valenceLow') }}</span>
              <span class="plot-label plot-e">{{ t('life.companion.axis.valenceHigh') }}</span>
              <svg class="mood-plot" viewBox="0 0 120 120" aria-hidden="true">
                <rect class="plot-frame" x="10" y="10" width="100" height="100" rx="12" />
                <line class="plot-grid" x1="60" y1="10" x2="60" y2="110" />
                <line class="plot-grid" x1="10" y1="60" x2="110" y2="60" />
                <circle class="plot-halo" :cx="moodDot.x" :cy="moodDot.y" r="12" />
                <circle class="plot-dot" :cx="moodDot.x" :cy="moodDot.y" r="5" />
              </svg>
              <span class="plot-quadrant">{{ t(russellQuadrant) }}</span>
            </div>
            <div class="glance-col">
              <p class="glance-title">{{ t('life.companion.realtime.section.mood') }}</p>
              <div v-for="g in emotionGauges" :key="g.label" class="gauge" :title="g.effect">
                <span class="gauge-head"><span class="gauge-name">{{ g.label }}<em class="gauge-alias">{{ g.alias }}</em></span><span class="gauge-val"><b class="gauge-state" :class="g.stateTone">{{ g.state }}</b> {{ g.display }}</span></span>
                <span class="gauge-bar" :class="{ signed: g.signed }"><i class="gauge-fill" :class="g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)" :style="g.signed ? signedBarStyle(g.value) : { width: (gaugeFrac(g) * 100).toFixed(1) + '%' }"></i></span>
                <span class="gauge-effect">{{ g.effect }}</span>
              </div>
            </div>
            <div class="glance-col">
              <p class="glance-title">{{ t('life.companion.body.title') }} <span class="chip" :class="{ muted: circadianNow?.is_sleeping, ok: circadianNow && !circadianNow.is_sleeping }">{{ circadianNow ? (circadianNow.is_sleeping ? t('life.companion.body.sleeping') : t('life.companion.body.awake')) : '—' }}</span></p>
              <div v-for="g in bodyGauges" :key="g.label" class="gauge" :title="g.effect">
                <span class="gauge-head"><span class="gauge-name">{{ g.label }}<em class="gauge-alias">{{ g.alias }}</em></span><span class="gauge-val"><b class="gauge-state" :class="g.stateTone">{{ g.state }}</b> {{ g.display }}</span></span>
                <span class="gauge-bar" :class="{ signed: g.signed }"><i class="gauge-fill" :class="g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)" :style="g.signed ? signedBarStyle(g.value) : { width: (gaugeFrac(g) * 100).toFixed(1) + '%' }"></i></span>
                <span class="gauge-effect">{{ g.effect }}</span>
              </div>
            </div>
          </div>

          <!-- 情绪与身体 (第二波 slow physiology) -->
          <div class="sub-label">{{ t('life.companion.realtime.section.mood') }}</div>
          <p class="hint">{{ t('life.companion.realtime.sectionSub.mood') }}</p>
          <div class="gauge-grid">
            <div v-for="g in moodGauges" :key="g.label" class="gauge" :title="g.effect">
              <span class="gauge-head"><span class="gauge-name">{{ g.label }}<em class="gauge-alias">{{ g.alias }}</em></span><span class="gauge-val"><b class="gauge-state" :class="g.stateTone">{{ g.state }}</b> {{ g.display }}</span></span>
              <span class="gauge-bar" :class="{ signed: g.signed }"><i class="gauge-fill" :class="g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)" :style="g.signed ? signedBarStyle(g.value) : { width: (gaugeFrac(g) * 100).toFixed(1) + '%' }"></i></span>
              <span class="gauge-effect">{{ g.effect }}</span>
            </div>
          </div>
          <div v-if="somaticChannels" class="som-channels">
            <div v-for="(value, name) in somaticChannels" :key="name" class="som-chan">
              <span class="som-chan-name">{{ channelLabel(name) }}</span>
              <span class="som-chan-bar"><i :style="{ transform: 'scaleX(' + somScale(value) + ')' }"></i></span>
              <span class="som-chan-val">{{ fmtNum(value, 2) }}</span>
            </div>
            <p v-if="Number(wave2?.somatic_chronicity) > 0.1" class="hint">{{ t('life.companion.realtime.somaticChronicity', { value: fmtNum(wave2?.somatic_chronicity) }) }}</p>
          </div>

          <!-- 社会认知 -->
          <template v-if="wave4a || wave4b">
            <div class="sub-label">{{ t('life.companion.realtime.section.social') }}</div>
            <p class="hint">{{ t('life.companion.realtime.sectionSub.social') }}</p>
            <div class="gauge-grid">
              <div v-for="g in socialGauges" :key="g.label" class="gauge" :title="g.effect">
                <span class="gauge-head"><span class="gauge-name">{{ g.label }}<em class="gauge-alias">{{ g.alias }}</em></span><span class="gauge-val"><b class="gauge-state" :class="g.stateTone">{{ g.state }}</b> {{ g.display }}</span></span>
                <span class="gauge-bar" :class="{ signed: g.signed }"><i class="gauge-fill" :class="g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)" :style="g.signed ? signedBarStyle(g.value) : { width: (gaugeFrac(g) * 100).toFixed(1) + '%' }"></i></span>
                <span class="gauge-effect">{{ g.effect }}</span>
              </div>
            </div>
            <div class="chip-row">
              <span class="chip muted">{{ t('life.companion.metric.perspectiveStage') }} {{ wave4a?.perspective_name || '—' }}</span>
              <span class="chip muted">{{ t('life.companion.metric.attentionState') }} {{ wave4b?.attention_state || '—' }}</span>
            </div>
          </template>

          <!-- 依恋 -->
          <template v-if="attachment?.enabled">
            <div class="sub-label">{{ t('life.companion.realtime.section.attachment') }}</div>
            <p class="hint">{{ t('life.companion.realtime.sectionSub.attachment') }}</p>
            <div class="chip-row">
              <span class="chip">{{ attachment.label || attachment.type }}</span>
              <span class="chip muted">{{ t('life.companion.metric.severity') }} {{ fmtNum(attachment.severity, 2) }} · {{ attachment.band }}</span>
              <span class="chip muted">{{ t('life.companion.metric.dominantTendency') }} {{ attachment.dominant || '—' }}</span>
              <span class="chip" :class="attachment.safe_mode ? 'warn' : 'muted'">{{ t('life.companion.metric.safetyLayer') }} {{ attachment.safe_mode ? t('life.companion.metric.triggered') : t('life.companion.metric.normal') }}</span>
            </div>
            <div class="gauge-grid">
              <div v-for="g in attachGauges" :key="g.label" class="gauge" :title="g.effect">
                <span class="gauge-head"><span class="gauge-name">{{ g.label }}<em class="gauge-alias">{{ g.alias }}</em></span><span class="gauge-val"><b class="gauge-state" :class="g.stateTone">{{ g.state }}</b> {{ g.display }}</span></span>
                <span class="gauge-bar" :class="{ signed: g.signed }"><i class="gauge-fill" :class="g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)" :style="g.signed ? signedBarStyle(g.value) : { width: (gaugeFrac(g) * 100).toFixed(1) + '%' }"></i></span>
                <span class="gauge-effect">{{ g.effect }}</span>
              </div>
            </div>
          </template>

          <!-- 傲娇 -->
          <template v-if="tsundere?.enabled">
            <div class="sub-label">{{ t('life.companion.realtime.section.tsundere') }}</div>
            <p class="hint">{{ t('life.companion.realtime.sectionSub.tsundere') }}</p>
            <div class="chip-row">
              <span class="chip">{{ tsundere.label || tsundere.type }}</span>
              <span class="chip" :class="tsundere.safe_mode ? 'warn' : 'muted'">{{ t('life.companion.metric.safetyLayer') }} {{ tsundere.safe_mode ? t('life.companion.metric.triggered') : t('life.companion.metric.normal') }}</span>
            </div>
            <div class="gauge-grid">
              <div v-for="g in tsundereGauges" :key="g.label" class="gauge" :title="g.effect">
                <span class="gauge-head"><span class="gauge-name">{{ g.label }}<em class="gauge-alias">{{ g.alias }}</em></span><span class="gauge-val"><b class="gauge-state" :class="g.stateTone">{{ g.state }}</b> {{ g.display }}</span></span>
                <span class="gauge-bar" :class="{ signed: g.signed }"><i class="gauge-fill" :class="g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)" :style="g.signed ? signedBarStyle(g.value) : { width: (gaugeFrac(g) * 100).toFixed(1) + '%' }"></i></span>
                <span class="gauge-effect">{{ g.effect }}</span>
              </div>
            </div>
          </template>

          <!-- 病娇 -->
          <template v-if="yandere?.enabled">
            <div class="sub-label">{{ t('life.companion.realtime.section.yandere') }}</div>
            <p class="hint">{{ t('life.companion.realtime.sectionSub.yandere') }}</p>
            <div class="chip-row">
              <span class="chip">{{ yandere.label || yandere.type }}</span>
              <span class="chip muted">{{ t('life.companion.metric.yandereMode') }} {{ yandere.mode }} · {{ yandere.label_russell }}</span>
              <span class="chip" :class="yandere.safe_mode ? 'warn' : 'muted'">{{ t('life.companion.metric.safetyLayer') }} {{ yandere.safe_mode ? t('life.companion.metric.triggered') : t('life.companion.metric.normal') }}</span>
            </div>
            <div class="gauge-grid">
              <div v-for="g in yandereGauges" :key="g.label" class="gauge" :title="g.effect">
                <span class="gauge-head"><span class="gauge-name">{{ g.label }}<em class="gauge-alias">{{ g.alias }}</em></span><span class="gauge-val"><b class="gauge-state" :class="g.stateTone">{{ g.state }}</b> {{ g.display }}</span></span>
                <span class="gauge-bar" :class="{ signed: g.signed }"><i class="gauge-fill" :class="g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)" :style="g.signed ? signedBarStyle(g.value) : { width: (gaugeFrac(g) * 100).toFixed(1) + '%' }"></i></span>
                <span class="gauge-effect">{{ g.effect }}</span>
              </div>
            </div>
          </template>

          <!-- 人格动力 -->
          <template v-if="personadyn?.enabled">
            <div class="sub-label">{{ t('life.companion.realtime.section.pd') }}</div>
            <p class="hint">{{ t('life.companion.realtime.sectionSub.pd') }}</p>
            <div class="chip-row">
              <span class="chip">{{ personadyn.label || personadyn.type }}</span>
              <span class="chip muted">{{ t('life.companion.metric.emergentMode') }} {{ personadyn.mode_label || personadyn.mode }} · {{ personadyn.band }}</span>
              <span v-if="personadyn.gender" class="chip muted">{{ personadyn.gender }}</span>
              <span v-if="personadyn.clinical" class="chip warn">{{ t('life.companion.simulationMode') }}</span>
            </div>
            <div class="gauge-grid">
              <div v-for="g in pdGauges" :key="g.label" class="gauge" :title="g.effect">
                <span class="gauge-head"><span class="gauge-name">{{ g.label }}<em class="gauge-alias">{{ g.alias }}</em></span><span class="gauge-val"><b class="gauge-state" :class="g.stateTone">{{ g.state }}</b> {{ g.display }}</span></span>
                <span class="gauge-bar" :class="{ signed: g.signed }"><i class="gauge-fill" :class="g.signed ? (g.value >= 0 ? 'good' : 'bad') : gaugeTone(g)" :style="g.signed ? signedBarStyle(g.value) : { width: (gaugeFrac(g) * 100).toFixed(1) + '%' }"></i></span>
                <span class="gauge-effect">{{ g.effect }}</span>
              </div>
            </div>
            <details class="pdetails">
              <summary>{{ t('life.companion.realtime.moreReadouts') }}</summary>
              <div class="settings-grid" style="margin-top:10px">
                <div v-if="personadyn.help_seek != null" class="cog-metric"><span>{{ t('life.companion.metric.helpSeeking') }}</span><strong>{{ fmtNum(personadyn.help_seek, 2) }}</strong></div>
                <div v-if="personadyn.big5" class="cog-metric"><span>Big5 O·C·E·A·N</span><strong>{{ big5Line }}</strong></div>
                <div v-if="personadyn.hexaco" class="cog-metric"><span>HEXACO H·E·X·A·C·O</span><strong>{{ hexacoLine }}</strong></div>
                <div v-if="personadyn.mbti" class="cog-metric"><span>MBTI / DISC</span><strong>{{ personadyn.mbti }} · {{ personadyn.disc || '—' }}</strong></div>
                <div v-if="personadyn.theta_dim" class="cog-metric"><span>{{ t('life.companion.metric.thetaDim') }}</span><strong>{{ t('life.companion.dimensionsValue', { n: personadyn.theta_dim }) }} · {{ personadyn.family || '—' }}</strong></div>
                <div v-if="topDesires.length" class="cog-metric"><span>{{ t('life.companion.metric.topDesires') }}</span><strong>{{ topDesires.join(' · ') }}</strong></div>
                <div v-if="topEmotions.length" class="cog-metric"><span>{{ t('life.companion.metric.topEmotions') }}</span><strong>{{ topEmotions.join(' · ') }}</strong></div>
                <div v-if="personadyn.learning?.enabled" class="cog-metric"><span>{{ t('life.companion.metric.learningState') }}</span><strong>{{ personadyn.learning.q_size }} · {{ fmtNum(learningDrift, 3) }}</strong></div>
              </div>
            </details>
          </template>

          <!-- 内核原始读数 -->
          <details class="pdetails">
            <summary>{{ t('life.companion.realtime.moreReadouts') }}</summary>
            <div class="settings-grid" style="margin-top:10px">
              <div class="cog-metric"><span>{{ t('life.companion.metric.arbitrationMode') }}</span><strong>{{ lastControl?.mode || '—' }}</strong></div>
              <div class="cog-metric"><span>{{ t('life.companion.metric.currentStrategy') }}</span><strong>{{ lastControl?.action || '—' }}</strong></div>
              <div class="cog-metric"><span>{{ t('life.companion.metric.controlNeed') }}</span><strong>{{ fmtNum(lastControl?.need) }}</strong></div>
              <div class="cog-metric"><span>{{ t('life.companion.metric.confidence') }}</span><strong>{{ fmtNum(lastControl?.confidence) }}</strong></div>
              <div class="cog-metric"><span>{{ t('life.companion.metric.decidedTurns') }}</span><strong>{{ wave1?.turns ?? 0 }}</strong></div>
              <div class="cog-metric"><span>{{ t('life.companion.metric.engrams') }}</span><strong>{{ wave1?.engrams ?? 0 }}</strong></div>
              <div class="cog-metric"><span>{{ t('life.companion.metric.reliability') }}</span><strong>{{ fmtNum(wave1?.reliability) }}</strong></div>
              <div class="cog-metric"><span>{{ t('life.companion.metric.personaTraits') }}</span><strong>{{ personaInfo?.applied ? (personaInfo.source === 'llm' ? t('life.companion.metric.appliedLlm') : t('life.companion.metric.appliedLocal')) : t('life.companion.metric.notParsed') }}</strong></div>
              <div class="cog-metric"><span>{{ t('life.companion.metric.lexicon') }}</span><strong>{{ wave3?.lexicon_size ?? 0 }}</strong></div>
              <template v-if="episode">
                <div class="cog-metric"><span>{{ t('life.companion.metric.episodeCourse') }}</span><strong>{{ episodeStateLabel(episode.state) }}</strong></div>
                <div class="cog-metric"><span>{{ t('life.companion.metric.episodeSeverity') }}</span><strong>{{ fmtNum(episode.severity, 2) }}</strong></div>
                <div class="cog-metric"><span>{{ t('life.companion.metric.episodesRelapses') }}</span><strong>{{ episode.episodes }} / {{ episode.relapses }}</strong></div>
                <div v-if="episode.state === 'episode'" class="cog-metric"><span>{{ t('life.companion.metric.duration') }}</span><strong>{{ t('life.companion.daysValue', { n: fmtNum(episode.days_in_episode, 1) }) }}</strong></div>
              </template>
            </div>
          </details>
        </template>
        <p v-if="episode" class="hint">{{ t('life.companion.realtime.episodeHint') }}</p>
        <p v-if="attachment?.enabled" class="hint">{{ t('life.companion.realtime.attachmentHint', { label: attachment.label, severity: fmtNum(attachment.severity, 2), band: attachment.band, safety: attachment.safe_mode ? t('life.companion.realtime.safetyOnEmotion') : t('life.companion.realtime.safetyOff') }) }}</p>
        <p v-if="tsundere?.enabled" class="hint">{{ t('life.companion.realtime.tsundereHint', { label: tsundere.label || tsundere.type, affection: fmtNum(tsundere.affection, 2), expression: fmtNum(tsundere.expression, 2), fixation: fmtNum(tsundere.fixation, 2), band: tsundere.band, safety: tsundere.safe_mode ? t('life.companion.realtime.safetyOnFeeling') : t('life.companion.realtime.safetyOff') }) }}</p>
        <p v-if="personadyn?.enabled" class="hint">{{ t('life.companion.realtime.personadynHint', { label: personadyn.label || personadyn.type, family: personadyn.family || '—', theta: personadyn.theta_dim, mode: personadyn.mode_label || personadyn.mode, pressure: fmtNum(personadyn.pressure, 2), band: personadyn.band, gender: personadyn.gender || zhValue('life.companion.pdGender.unspecified'), learning: personadyn.learning?.enabled ? t('life.companion.realtime.learningOnline') : '', safety: personadyn.safe_mode ? t('life.companion.realtime.safetyOnFeeling') : t('life.companion.realtime.safetyOff') }) }}</p>
        <p v-if="personaInfo?.applied" class="hint">{{ t('life.companion.realtime.personaApplied', { source: personaInfo.source === 'llm' ? t('life.companion.realtime.personaSourceLlm') : t('life.companion.realtime.personaSourceLocal'), evidence: personaEvidenceText || '—' }) }}</p>
      </article>

      <article class="card">
        <h3>{{ t('life.companion.switches.title') }}</h3>
        <div class="switches">
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_enabled" /><span>{{ t('life.companion.switches.enableCognition') }}</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_lite_mode" /><span>{{ t('life.companion.switches.liteMode') }}</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_modulate_affect" /><span>{{ t('life.companion.switches.modulateAffect') }}</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_modulate_language" /><span>{{ t('life.companion.switches.modulateLanguage') }}</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_modulate_social" /><span>{{ t('life.companion.switches.modulateSocial') }}</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_modulate_selfhood" /><span>{{ t('life.companion.switches.modulateSelfhood') }}</span></label>
        </div>
        <p class="hint">{{ t('life.companion.switches.hint') }}</p>
      </article>

      <article class="card">
        <h3>{{ t('life.companion.presets.title') }}</h3>
        <p class="hint">{{ t('life.companion.presets.hint') }}</p>
        <div class="preset-row">
          <button v-for="preset in PRESETS" :key="preset.label" type="button" class="btn sm" @click="applyPreset(preset.fields, preset.label)">{{ t(preset.labelKey) }}</button>
        </div>
      </article>

      <div class="grid2">
        <article class="card">
          <h3>{{ t('life.companion.decision.title') }}</h3>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.decision.planDepth') }}</span><input v-model.number="settingsForm.cog_plan_depth" type="number" min="1" max="6" class="field tiny" /></label>
            <label><span>{{ t('life.companion.decision.wmCapacity') }}</span><input v-model.number="settingsForm.cog_wm_capacity" type="number" min="1" max="12" class="field tiny" /></label>
            <label><span>{{ t('life.companion.decision.strategyTemp') }}</span><input v-model.number="settingsForm.cog_tau" type="number" step="0.05" min="0.05" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.decision.discount') }}</span><input v-model.number="settingsForm.cog_gamma" type="number" step="0.01" min="0" max="0.999" class="field tiny" /></label>
            <label><span>{{ t('life.companion.decision.habitRate') }}</span><input v-model.number="settingsForm.cog_alpha_habit" type="number" step="0.01" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.decision.modelfreeRate') }}</span><input v-model.number="settingsForm.cog_alpha_mf" type="number" step="0.01" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.decision.surpriseThreshold') }}</span><input v-model.number="settingsForm.cog_theta_pe" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.decision.noveltyThreshold') }}</span><input v-model.number="settingsForm.cog_theta_n" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.decision.prospectionHorizon') }}</span><input v-model.number="settingsForm.cog_prospection_horizon" type="number" min="1" max="8" class="field tiny" /></label>
          </div>
          <div class="switches">
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_thalamic_gate" /><span>{{ t('life.companion.decision.thalamicGate') }}</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_cerebellum" /><span>{{ t('life.companion.decision.cerebellum') }}</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_ofc_map" /><span>{{ t('life.companion.decision.ofcMap') }}</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_prospection" /><span>{{ t('life.companion.decision.prospection') }}</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_limbic_bias" /><span>{{ t('life.companion.decision.limbicBias') }}</span></label>
          </div>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.affect.title') }}</h3>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.persona.erqProfile') }}</span><AppSelect v-model="settingsForm.cog_affect_profile" :options="cogProfileOptions" :aria-label="t('life.companion.persona.erqProfile')" /></label>
            <label><span>{{ t('life.companion.affect.vagalBaseline') }}</span><input v-model.number="settingsForm.cog_affect_vagal" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.threatBaseline') }}</span><input v-model.number="settingsForm.cog_affect_threat" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.persona.rewardBaseline') }}</span><input v-model.number="settingsForm.cog_affect_reward" type="number" step="0.1" min="0" max="2" class="field tiny" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_affect_enabled" /><span>{{ t('life.companion.affect.enable') }}</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_affect_somatic" /><span>{{ t('life.companion.affect.somatic') }}</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_affect_persona_llm" /><span>{{ t('life.companion.affect.personaLlm') }}</span></label>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.language.title') }}</h3>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.language.framing') }}</span><AppSelect v-model="settingsForm.cog_language_framing" :options="cogFramingOptions" :aria-label="t('life.companion.language.framing')" /></label>
            <label><span>{{ t('life.companion.language.boundary') }}</span><input v-model.number="settingsForm.cog_language_boundary" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_language_enabled" /><span>{{ t('life.companion.language.enable') }}</span></label>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.social.title') }}</h3>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.metric.empathy') }}</span><input v-model.number="settingsForm.cog_social_empathy" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.social.perspectiveStage') }}</span><AppSelect v-model="cogStageValue" :options="cogStageOptions" :aria-label="t('life.companion.social.perspectiveStage')" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_social_enabled" /><span>{{ t('life.companion.social.enable') }}</span></label>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.selfhood.title') }}</h3>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.selfhood.timeDiscount') }}</span><input v-model.number="settingsForm.cog_selfhood_discount" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>{{ t('life.companion.selfhood.detailScale') }}</span><input v-model.number="settingsForm.cog_selfhood_detail" type="number" step="1" min="1" max="50" class="field tiny" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_selfhood_enabled" /><span>{{ t('life.companion.selfhood.enable') }}</span></label>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.attachmentCard.title') }}</h3>
          <p class="hint">{{ t('life.companion.attachmentCard.hint') }}</p>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_attachment_enabled" /><span>{{ t('life.companion.attachmentCard.enable') }}</span></label>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.metric.attachmentType') }}</span><AppSelect v-model="settingsForm.cog_attachment_type" :options="attachmentTypeOptions" :aria-label="t('life.companion.metric.attachmentType')" /></label>
          </div>
          <p class="hint">{{ t('life.companion.attachmentCard.hint2') }}</p>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.tsundereCard.title') }}</h3>
          <p class="hint">{{ t('life.companion.tsundereCard.hint') }}</p>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_tsundere_enabled" /><span>{{ t('life.companion.tsundereCard.enable') }}</span></label>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.persona.tsundereType') }}</span><AppSelect v-model="settingsForm.cog_tsundere_type" :options="tsundereTypeOptions" :aria-label="t('life.companion.persona.tsundereType')" /></label>
          </div>
          <p class="hint">{{ t('life.companion.tsundereCard.hint2') }}</p>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.yandereCard.title') }}</h3>
          <p class="hint">{{ t('life.companion.yandereCard.hint') }}</p>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_yandere_enabled" /><span>{{ t('life.companion.yandereCard.enable') }}</span></label>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.yandereCard.type') }}</span><AppSelect v-model="settingsForm.cog_yandere_type" :options="yandereTypeOptions" :aria-label="t('life.companion.yandereCard.type')" /></label>
          </div>
          <p class="hint">{{ t('life.companion.yandereCard.hint2') }}</p>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.personadynCard.title') }}</h3>
          <p class="hint">{{ t('life.companion.personadynCard.hint') }}</p>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_personadyn_enabled" /><span>{{ t('life.companion.personadynCard.enable') }}</span></label>
          <div class="settings-grid">
            <label><span>{{ t('life.companion.persona.personaArchetype') }}</span><AppSelect v-model="settingsForm.cog_personadyn_type" :options="personadynAllTypes" :aria-label="t('life.companion.persona.personaArchetype')" /></label>
            <label><span>{{ t('life.companion.persona.genderSocialScript') }}</span><AppSelect v-model="settingsForm.cog_personadyn_gender" :options="personadynGenderOptions" :aria-label="t('life.companion.persona.genderSocialScriptAria')" /></label>
          </div>
          <p class="hint">{{ t('life.companion.personadynCard.hint2') }}</p>
          <p class="hint">{{ t('life.companion.personadynCard.hint3') }}</p>
        </article>

        <article class="card">
          <h3>{{ t('life.companion.memoryCard.title') }}</h3>
          <p class="hint">{{ t('life.companion.memoryCard.hint') }}</p>
          <div class="switches">
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_memory_encode" /><span>{{ t('life.companion.memoryCard.selectiveEncoding') }}</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_sleep_replay" /><span>{{ t('life.companion.memoryCard.sleepReplay') }}</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_memory_reconsolidate" /><span>{{ t('life.companion.memoryCard.reconsolidate') }}</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_cls_interleave" /><span>{{ t('life.companion.memoryCard.cls') }}</span></label>
          </div>
        </article>
      </div>
    </section>

    <!-- 02 世界 -->
    <section v-show="tab === 'world'" data-panel="world" class="panel">
      <div class="section-head"><div><h2>{{ t('life.companion.world.title') }}</h2><p class="desc">{{ t('life.companion.world.desc') }}</p></div>
        <div class="head-actions"><button class="btn filled sm" @click="saveSettings">{{ t('life.companion.saveSettings') }}</button></div>
      </div>
      <article class="card">
        <h3>{{ t('life.companion.world.density') }}</h3>
        <div class="settings-grid">
          <label><span>{{ t('life.companion.world.density') }}</span><AppSelect v-model="worldDensity" :options="worldDensityOptions" :aria-label="t('life.companion.world.densityAria')" /></label>
        </div>
        <p class="hint">{{ t('life.companion.world.densityHint') }}</p>
      </article>
      <article class="card">
        <h3>{{ t('life.companion.world.personaTraits') }}</h3>
        <p class="hint">{{ t('life.companion.world.personaTraitsHint') }}</p>
        <label class="world-field"><span class="world-label">{{ t('life.companion.world.personaText') }}</span>
          <textarea v-model="personaText" class="world-text" rows="4" :placeholder="t('life.companion.world.personaPlaceholder')"></textarea>
        </label>
      </article>
      <article class="card">
        <h3>{{ t('life.companion.world.location') }}</h3>
        <p class="hint">{{ t('life.companion.world.locationHint') }}</p>
        <div class="settings-grid">
          <label><span>{{ t('life.companion.world.worldType') }}</span><AppSelect v-model="worldFictional" :options="worldFictionalOptions" :aria-label="t('life.companion.world.worldType')" /></label>
          <label><span>{{ t('life.companion.world.country') }}</span><input v-model="worldCountry" class="field" :placeholder="t('life.companion.world.countryPlaceholder')" /></label>
          <label><span>{{ t('life.companion.world.city') }}</span><input v-model="worldCity" class="field" :placeholder="t('life.companion.world.cityPlaceholder')" /></label>
          <label><span>{{ t('life.companion.world.district') }}</span><input v-model="worldDistrict" class="field" :placeholder="t('life.companion.world.districtPlaceholder')" /></label>
        </div>
        <label class="world-field"><span class="world-label">{{ t('life.companion.world.premiseLabel') }}</span>
          <textarea v-model="worldPremise" class="world-text" rows="3" :placeholder="t('life.companion.world.premisePlaceholder')"></textarea>
        </label>
        <label class="world-field"><span class="world-label">{{ t('life.companion.world.actorsLabel') }}</span>
          <textarea v-model="worldActors" class="world-text" rows="4" :placeholder="t('life.companion.world.actorsPlaceholder')"></textarea>
        </label>
        <label class="world-field"><span class="world-label">{{ t('life.companion.world.placesLabel') }}</span>
          <textarea v-model="worldPlaces" class="world-text" rows="2" :placeholder="t('life.companion.world.placesPlaceholder')"></textarea>
        </label>
        <div class="world-actions">
          <button class="btn filled sm" type="button" :disabled="worldBusy" @click="generateMapOnly">{{ worldBusy ? t('life.companion.world.generating') : t('life.companion.world.generateMapOnly') }}</button>
          <button class="btn tonic sm" type="button" :disabled="worldBusy" @click="generateWorld">{{ worldBusy ? t('life.companion.world.generating') : t('life.companion.world.generateWorld') }}</button>
          <span class="hint">{{ t('life.companion.world.generateHint') }}</span>
        </div>
      </article>
      <article class="card">
        <div class="wm-head">
          <h3>{{ t('life.companion.world.map') }} <span class="count-pill">{{ worldMap.locations.length }}</span></h3>
          <span v-if="worldview" class="wm-place">{{ worldview.fictional ? t('life.companion.worldFictional.fictional') : t('life.companion.worldFictional.real') }} · {{ [worldview.country, worldview.city, worldview.district].filter(Boolean).join(' / ') || t('life.companion.world.unnamed') }}</span>
        </div>
        <p v-if="worldview?.premise" class="hint wm-premise">{{ worldview.premise }}</p>
        <div class="wm-map-wrap">
          <div ref="mapEl" class="world-map-leaflet" :class="{ 'is-empty': !worldMap.locations.length }"></div>
          <div v-if="offlineHint" class="wm-offline">{{ t('life.companion.world.offline') }}</div>
          <template v-if="worldMap.locations.length">
            <button v-if="worldMap.kind !== 'real' && worldMap.nation" type="button" class="wm-scope" @click="toggleScope">{{ scope === 'city' ? t('life.companion.world.nationView') : t('life.companion.world.cityView') }}</button>
            <button type="button" class="wm-reset" @click="resetView">{{ t('life.companion.world.resetView') }}</button>
            <div v-if="worldMap.kind !== 'real' && scope === 'city'" class="wm-compass" aria-hidden="true"><i>N</i></div>
          </template>
        </div>
        <p v-if="!worldMap.locations.length" class="empty">{{ t('life.companion.world.noMap') }}</p>
        <div v-if="worldMap.locations.length" class="wm-legend">
          <span v-for="k in usedKinds" :key="k"><i :class="'k-' + k"></i>{{ t(KIND_LABEL[k]) }}</span>
          <span><i class="k-actor"></i>{{ t('life.companion.world.actorsCount', { n: worldMap.actors.length }) }}</span>
          <template v-if="worldMap.kind !== 'real'">
            <span><i class="k-hw"></i>{{ t('life.companion.world.highwayLoop') }}</span>
            <span><i class="k-arterial"></i>{{ t('life.companion.world.arterial') }}</span>
            <span><i class="k-street"></i>{{ t('life.companion.world.street') }}</span>
            <span><i class="k-metro"></i>{{ t('life.companion.world.metro') }}</span>
            <span><i class="k-bus"></i>{{ t('life.companion.world.bus') }}</span>
            <span><i class="k-park2"></i>{{ t('life.companion.kind.park') }}</span>
            <span><i class="k-water"></i>{{ t('life.companion.world.water') }}</span>
          </template>
        </div>
        <div v-if="worldMap.locations.length && worldMap.kind !== 'real' && scope === 'city'" class="wm-routes">
          <div v-if="(worldMap.metro || []).length" class="wm-routes-col">
            <h4>{{ t('life.companion.world.metroRoutes') }}</h4>
            <ul>
              <li v-for="(m, i) in worldMap.metro" :key="'m' + i">
                <b :style="{ color: m.color }">{{ m.name }}</b>
                <span>{{ (m.stations || []).map((s: any) => s.name).filter(Boolean).join(' · ') }}</span>
              </li>
            </ul>
          </div>
          <div v-if="(worldMap.bus || []).length" class="wm-routes-col">
            <h4>{{ t('life.companion.world.busRoutes') }}</h4>
            <ul>
              <li v-for="(b, i) in worldMap.bus" :key="'b' + i">
                <b :style="{ color: b.color }">{{ b.name }}</b>
                <span>{{ (b.stops || []).map((s: any) => s.name).filter(Boolean).join(' · ') }}</span>
              </li>
            </ul>
          </div>
        </div>
      </article>
      <article class="card">
        <div class="wm-head">
          <h3>{{ t('life.companion.world.recentEvents') }} <span class="count-pill">{{ worldEvents.length }}</span></h3>
          <button v-if="worldEvents.length" type="button" class="btn tonic sm" @click="clearWorld">{{ t('life.companion.world.clearTitle') }}</button>
        </div>
        <ol class="feed"><li v-for="e in worldEvents" :key="e.id"><span class="meta">{{ e.created_at }}</span><strong>{{ e.summary }}</strong></li>
          <li v-if="!worldEvents.length" class="empty">{{ t('life.companion.world.noEvents') }}</li></ol>
      </article>
    </section>

    <!-- 03 状态 -->
    <!-- 04 消息平台（只读概览；完整增删改在「设置 → 消息平台」） -->
    <section v-show="tab === 'adapters'" data-panel="adapters" class="panel">
      <!-- The full messaging-platform CRUD (accounts) lives here now; it used to
           be a separate Settings tab. -->
      <AdapterSettingsPage />
    </section>

    <section v-show="tab === 'state'" data-panel="state" class="panel">
      <div class="section-head"><div><h2>{{ t('life.companion.state.title') }}</h2><p class="desc">{{ t('life.companion.state.desc') }}</p></div></div>
      <article class="card">
        <h3>{{ t('life.companion.state.relationships') }} <span class="count-pill">{{ relationships.length }}</span></h3>
        <p class="hint">{{ t('life.companion.state.relationshipsHint') }}</p>
        <ol class="feed">
          <li v-for="r in relationships" :key="r.user_id" class="rel-card">
            <div class="rel-head">
              <strong>{{ r.user_id }}</strong>
              <span class="meta">{{ t('life.companion.state.lastSeenLabel') }} {{ (r.last_seen || '').slice(0, 16).replace('T', ' ') || '—' }}</span>
            </div>
            <div class="rel-track-row">
              <span class="rel-track-label">{{ t('life.companion.state.stage') }}</span>
              <span class="rel-track" role="img" :aria-label="stageLabel(r.stage)">
                <span v-for="(s, i) in REL_STAGES" :key="s" class="rel-seg" :class="{ done: i < relStageIndex(r.stage), cur: i === relStageIndex(r.stage) }"></span>
              </span>
              <span class="rel-stage-name">{{ stageLabel(r.stage) }}</span>
            </div>
            <div class="gauge" :title="t('life.companion.effect.affinity')">
              <span class="gauge-head"><span class="gauge-name">{{ t('life.companion.state.affinity') }}<em class="gauge-alias">{{ t('life.companion.alias.affinity') }}</em></span><span class="gauge-val"><b class="gauge-state" :class="Number(r.affinity) >= 0 ? 'good' : 'bad'">{{ t('life.companion.gw.affinity.' + signedBand(Number(r.affinity) || 0)) }}</b> {{ fmtNum(r.affinity, 2) }}</span></span>
              <span class="gauge-bar signed"><i class="gauge-fill" :class="Number(r.affinity) >= 0 ? 'good' : 'bad'" :style="signedBarStyle(Number(r.affinity) || 0)"></i></span>
              <span class="gauge-effect">{{ t('life.companion.effect.affinity') }}</span>
            </div>
            <div v-if="r.interaction" class="rel-mode">
              <span class="chip">{{ t('life.companion.state.interaction') }} · {{ interactionLabel(r.interaction) }}</span>
              <span class="meta">{{ interactionEffect(r.interaction) }}</span>
            </div>
          </li>
          <li v-if="!relationships.length" class="empty">{{ t('life.companion.state.noRelationships') }}</li>
        </ol>
      </article>
      <article class="card">
        <h3>{{ t('life.companion.state.commitments') }} <span class="count-pill">{{ commitments.length }}</span></h3>
        <p class="hint">{{ t('life.companion.state.commitmentsHint') }}</p>
        <ol class="feed"><li v-for="c in commitments" :key="c.id"><strong>{{ c.text }}</strong><span class="meta">{{ c.user_id }}</span></li>
          <li v-if="!commitments.length" class="empty">{{ t('life.companion.state.noCommitments') }}</li></ol>
      </article>
      <div class="grid2">
        <article class="card">
          <h3>{{ t('life.companion.state.userModel') }}</h3>
          <p class="hint">{{ t('life.companion.state.userModelHint') }}</p>
          <ol class="feed"><li v-for="m in userModels" :key="m.user_id"><strong>{{ m.user_id }}</strong>
            <span class="meta">{{ t('life.companion.state.likes', { items: parseList(m.preferences).join(t('life.companion.listSeparator')) || '—' }) }}</span>
            <span class="meta">{{ t('life.companion.state.taboos', { items: parseList(m.taboos).join(t('life.companion.listSeparator')) || '—' }) }}</span>
            <span class="meta">{{ t('life.companion.state.concerns', { items: parseList(m.concerns).join(t('life.companion.listSeparator')) || '—' }) }}</span></li>
            <li v-if="!userModels.length" class="empty">{{ t('life.companion.state.noUserModel') }}</li></ol>
        </article>
        <article class="card">
          <h3>{{ t('life.companion.state.values') }}</h3>
          <p class="hint">{{ t('life.companion.state.valuesHint') }}</p>
          <ol class="feed">
            <li v-for="v in valuesList" :key="v.k" class="value-row">
              <span class="value-name">{{ v.k }}</span>
              <span class="value-bar"><i :class="v.v >= 0 ? 'good' : 'bad'" :style="signedBarStyle(v.v)"></i></span>
              <span class="value-num">{{ v.v.toFixed(2) }}</span>
            </li>
            <li v-if="!valuesList.length" class="empty">{{ t('life.companion.state.noValues') }}</li>
          </ol>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div><h2>{{ t('life.companion.danger.title') }}</h2>
          <p class="desc">{{ t('life.companion.danger.desc') }}</p>
        </div>
      </div>
      <div class="grid2">
        <article class="card">
          <h3>{{ t('life.companion.danger.reset') }}</h3>
          <p class="hint">{{ t('life.companion.danger.resetHint') }}</p>
          <p class="hint" style="margin-top:10px"><strong>{{ t('life.companion.danger.doubleConfirm') }}</strong></p>
          <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn danger" :disabled="personBusy" @click="resetPerson">
              {{ personBusy ? t('life.companion.danger.resetting') : t('life.companion.danger.reset') }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Shared design tokens + component vocabulary come from kit.ts so this page
   and the standalone 消息平台 settings page stay in lockstep. Only the
   world-map and cognition-panel rules are page-specific. */
.world-field{display:block;margin:10px 0}
.world-label{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}
.world-text{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}
.world-text:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
.world-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}
.wm-head{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}
.wm-place{font-size:12px;color:var(--md-on-surface-variant)}
.wm-premise{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}
.wm-map-wrap{position:relative;margin-top:8px}
.world-map-leaflet{height:clamp(460px, 72vh, 820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}
.world-map-leaflet.is-empty{display:none}
.wm-reset{position:absolute;top:10px;right:10px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:rgba(255,255,255,.94);color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.18)}
.wm-reset:hover{background:#fff}
.wm-compass{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay,2000);width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.92);border:1px solid #b9c3cd;box-shadow:0 1px 4px rgba(0,0,0,.18);display:grid;place-items:center}
.wm-compass i{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}
.wm-compass i::before{content:'';position:absolute;left:50%;top:-9px;transform:translateX(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}
.wm-scope{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:rgba(255,255,255,.94);color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.18)}
.wm-scope:hover{background:#fff}
.wm-offline{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:var(--z-overlay,2000);background:rgba(209,73,91,.94);color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.25)}
.wm-routes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:18px;margin-top:14px}
.wm-routes h4{margin:0 0 6px;font-size:13px;font-weight:800}
.wm-routes ul{list-style:none;margin:0;padding:0}
.wm-routes li{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}
.wm-routes b{flex:0 0 88px}
.wm-routes span{color:var(--md-on-surface-variant);line-height:1.5}
.wm-legend{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}
.wm-legend span{display:inline-flex;align-items:center;gap:6px}
.wm-legend i{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}
.wm-legend i.k-home{background:#e07a5f}
.wm-legend i.k-work{background:#5b8def}
.wm-legend i.k-shop{background:#e0a23d}
.wm-legend i.k-food{background:#57a773}
.wm-legend i.k-park{background:#3faead}
.wm-legend i.k-transit{background:#8b6fd6}
.wm-legend i.k-other{background:#8a94a6}
.wm-legend i.k-actor{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}
.wm-legend i.k-metro{background:#d64545}
.wm-legend i.k-bus{background:#e08a2e}
.wm-legend i.k-park2{background:#9bd08f}
.wm-legend i.k-water{background:#8fbfe6}
.wm-legend i.k-hw{background:#f08c2e}
.wm-legend i.k-arterial{background:#f7cf8a}
.wm-legend i.k-street{background:#fff;border-color:#b9c3cd}

.pfield{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
/* `#app .pcp .field{height:52px}` in kit.ts is (1,2,0) and out-ranks a scoped
   `.pfield textarea.field` (0,2,2), so `height:auto` never applied and the
   multi-line persona fields sat at a fixed 70px (the scoped `min-height`) with
   an inner scrollbar instead of growing with their content. Repeating the
   `#app .pcp` prefix here wins the declaration back — the same trick
   MemoryPage already uses for its own textareas. */
#app .pcp .pfield textarea.field{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}
.cog-metric{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);
  background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}
.cog-metric span{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}
.cog-metric strong{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cog-metric.warn{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}
.cog-metric.warn span,.cog-metric.warn strong{color:var(--md-error,#b3261e)}
.som-channels{margin-top:10px;display:flex;flex-direction:column;gap:6px}
/* The label track was a fixed 52px, which a longer localised channel name
   ("Cardiorespiratory", "心血管") could not fit — it spilled over the bar. Give
   it room to grow up to 88px and let an unbreakable word wrap inside that. */
.som-chan{display:grid;grid-template-columns:minmax(52px,88px) minmax(0,1fr) 48px;align-items:center;gap:10px}
.som-chan-name{font-size:12px;font-weight:600;color:var(--md-on-surface-variant);overflow-wrap:anywhere}
.som-chan-bar{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}
.som-chan-bar i{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}
.som-chan-val{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}

/* ── intuitive read-outs ────────────────────────────────────────────────────
   Gauges carry a one-line "what it changes"; the fill color encodes whether
   the current value is good / middling / bad for that metric's direction. */
.at-a-glance{display:grid;grid-template-columns:190px minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start;margin:8px 0 4px}
@media(max-width:900px){.at-a-glance{grid-template-columns:1fr 1fr}}
@media(max-width:620px){.at-a-glance{grid-template-columns:1fr}}
.mood-plot-wrap{position:relative;width:190px;padding:26px 22px 40px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:var(--r-md);box-sizing:border-box}
.mood-plot{display:block;width:100%}
.plot-frame{fill:var(--md-surface-container-lowest);stroke:var(--md-outline-variant)}
.plot-grid{stroke:var(--md-outline-variant);stroke-width:1;stroke-dasharray:3 4}
.plot-dot{fill:var(--md-primary)}
.plot-halo{fill:var(--md-primary);opacity:.22}
.plot-label{position:absolute;font-size:10px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);pointer-events:none}
.plot-n{top:6px;left:50%;transform:translateX(-50%)}
.plot-s{bottom:26px;left:50%;transform:translateX(-50%)}
.plot-w{left:8px;top:50%;transform:translateY(-58%)}
.plot-e{right:8px;top:50%;transform:translateY(-58%)}
.plot-quadrant{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:12px;font-weight:800;color:var(--md-primary)}
.glance-col{display:flex;flex-direction:column;gap:8px;min-width:0}
.glance-title{display:flex;align-items:center;gap:8px;margin:0;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}
.gauge-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin:8px 0}
.gauge{display:flex;flex-direction:column;gap:5px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);min-width:0}
.gauge-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.gauge-name{font-size:12px;font-weight:700;color:var(--md-on-surface-variant);overflow-wrap:anywhere}
/* plain-language restatement riding next to the term: "迷走平静 · 有多沉着" */
.gauge-alias{font-style:normal;font-weight:500;font-size:11px;color:var(--md-on-surface-variant);opacity:.8;margin-left:6px}
.gauge-val{font-size:13px;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap}
.gauge-state{font-weight:800;margin-right:2px}
.gauge-state.good{color:var(--md-success)}
.gauge-state.mid{color:var(--md-primary)}
.gauge-state.bad{color:var(--md-error)}
.gauge-bar{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest);overflow:visible}
/* center tick for signed (-1..1) tracks */
.gauge-bar.signed::before{content:'';position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}
.gauge-fill{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}
.gauge-fill.good{background:var(--md-success)}
.gauge-fill.mid{background:var(--md-primary)}
.gauge-fill.bad{background:var(--md-error)}
.gauge-effect{font-size:11px;line-height:1.45;color:var(--md-on-surface-variant)}
.chip-row{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
.chip.warn{background:var(--md-error-container);color:var(--md-on-error-container)}
.rel-card{display:flex;flex-direction:column;gap:10px}
.rel-head{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}
.rel-track-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center}
.rel-track-label,.rel-stage-name{font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--md-on-surface-variant);white-space:nowrap}
.rel-stage-name{color:var(--md-primary)}
.rel-track{display:flex;gap:3px;height:10px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-highest)}
.rel-seg{flex:1 1 0;background:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}
.rel-seg.done{background:color-mix(in srgb,var(--md-primary) 45%,transparent)}
.rel-seg.cur{background:var(--md-primary)}
.rel-mode{display:flex;flex-direction:column;gap:4px;align-items:flex-start}
.value-row{display:grid;grid-template-columns:minmax(72px,140px) minmax(0,1fr) 44px;gap:10px;align-items:center}
.value-name{font-size:13px;font-weight:700;overflow-wrap:anywhere}
.value-bar{position:relative;display:block;height:8px;border-radius:999px;background:var(--md-surface-container-highest)}
.value-bar::before{content:'';position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;border-radius:1px;background:var(--md-outline-variant)}
.value-bar i{position:absolute;top:0;bottom:0;border-radius:999px;transition:width .35s var(--ease-out,.25s ease),left .35s var(--ease-out,.25s ease)}
.value-bar i.good{background:var(--md-success)}
.value-bar i.bad{background:var(--md-error)}
.value-num{font-size:12px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums;color:var(--md-on-surface-variant)}

.chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;
  background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}
.chip.ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}

#app .pcp .cog-metric{background:var(--md-surface-container)}
/* "Updated at HH:MM" stamp on the real-time card — quieter than the status pill. */
.sync-pill{font-weight:500;opacity:.85}
</style>

<style>
/* Map chrome dark variants ride on the host's html[data-theme] toggle (scoped
   styles cannot express an html-level selector). The map canvas palette itself
   is drawn by Leaflet and stays a light "paper map" in both themes. */
html[data-theme="dark"] #app .pcp .world-map-leaflet{background:#10151c}
html[data-theme="dark"] #app .pcp .wm-reset,
html[data-theme="dark"] #app .pcp .wm-scope{background:color-mix(in srgb,var(--md-surface-container-high) 94%,transparent);color:var(--md-on-surface)}
html[data-theme="dark"] #app .pcp .wm-reset:hover,
html[data-theme="dark"] #app .pcp .wm-scope:hover{background:var(--md-surface-container-highest)}
html[data-theme="dark"] #app .pcp .wm-compass{background:color-mix(in srgb,var(--md-surface-container-high) 92%,transparent);border-color:var(--md-outline-variant)}
html[data-theme="dark"] .wm-district-inner{color:#aeb9c4;text-shadow:none}
html[data-theme="dark"] .wm-station .wm-route-inner{background:#1a2230;color:#d7dee6}
html[data-theme="dark"] .leaflet-container{background:#10151c}
</style>

<style>
/* Leaflet creates its markers outside Vue's scoped CSS, so these live in a
   plain (unscoped) block. All names are prefixed to avoid collisions. */
.wm-pin-holder,.wm-actor-holder{background:none;border:none}
.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);
  border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.45);transform:translate(-50%,-50%)}
.wm-pin::after{content:'';position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translateX(-50%);opacity:.7}
.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:rgba(18,20,26,.82);color:#fff;
  font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}
.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;
  border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;
  transform:translate(-50%,-50%);box-shadow:0 2px 6px rgba(0,0,0,.5);z-index:600}
.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;
  font-weight:700;padding:1px 7px;border-radius:9px;transform:translateX(-50%)}
.wm-district{background:none;border:none}
.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;
  font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}
.wm-route{background:none;border:none}
.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;
  font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.35);pointer-events:none}
/* filler building names hide when zoomed out, to keep the map readable */
.wm-zoom-low .wm-minor{display:none}
/* metro station names: small white pills with the line colour as the border */
.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}
.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}
.leaflet-container a{color:#2f6fed}
.leaflet-popup-content{font-size:13px;line-height:1.5}
</style>
