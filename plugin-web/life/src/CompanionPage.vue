<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppSelect from './AppSelect.vue'
import { useConfirm } from './confirm'
import ConfirmDialog from './ConfirmDialog.vue'

const { confirm } = useConfirm()
const data = ref<any>({ settings: {}, cognition: null })
const loading = ref(false); const error = ref(''); const notice = ref('')
const tab = ref('cognition')
const pageEl = ref<HTMLElement | null>(null)
const navItems = [
  { key: 'cognition', i: '01', label: '认知', icon: '◉' },
  { key: 'persona', i: '02', label: '人设', icon: '✎' },
  { key: 'world', i: '03', label: '世界', icon: '✦' },
  { key: 'state', i: '04', label: '状态', icon: '☺' },
]

function flash(message: string) { notice.value = message; setTimeout(() => { if (notice.value === message) notice.value = '' }, 2500) }
/** Turn raw gateway/gRPC dial errors into a calm, actionable message. */
function friendlyError(e: any): string {
  const text = String(e?.message || e || '')
  if (/connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(text)) {
    return 'LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。'
  }
  return text || '操作失败'
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function load(attempt = 0): Promise<void> {
  loading.value = true; error.value = ''
  try {
    const r = await fetch('/api/life/companion')
    if (!r.ok) throw Error(await r.text() || String(r.status))
    data.value = await r.json()
    syncSettings()
    loading.value = false
  } catch (e: any) {
    if (attempt < 4) { await sleep(1500); return load(attempt + 1) }
    error.value = friendlyError(e)
    loading.value = false
  }
}
async function act(action: string, payload: any) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) })
      if (!r.ok) throw Error(await r.text())
      const body = await r.json().catch(() => ({}))
      await load(); return body
    } catch (e: any) {
      if (attempt < 2 && /connection refused|Unavailable|actively refused|dial tcp|502|503|life unavailable/i.test(String(e?.message || e))) { await sleep(1200); continue }
      error.value = friendlyError(e); return null
    }
  }
  return null
}
function jump(target: string) {
  tab.value = target
  const behavior: ScrollBehavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  const el = pageEl.value
  if (el) el.scrollTo({ top: 0, behavior }); else window.scrollTo({ top: 0, behavior })
}

// --- cognition core --------------------------------------------------------
// Mirrors CompanionSystem.SETTING_DEFAULTS on the backend.  Booleans are stored
// as '1'/'0' strings; every other knob is numeric except the two enums.
const COG_DEFAULTS: Record<string, string> = {
  cog_enabled: '1',
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
  cog_attachment_enabled: '0', cog_attachment_type: '依存型',
  cog_tsundere_enabled: '0', cog_tsundere_type: '经典傲娇',
  // memory & consolidation. On by default — they are what makes lived
  // experience leave a trace; turn one off to ablate it.
  cog_memory_encode: '1', cog_sleep_replay: '1', cog_memory_reconsolidate: '1',
  cog_cls_interleave: '1',
}
const COG_BOOL_KEYS = ['cog_enabled', 'cog_modulate_affect', 'cog_modulate_language', 'cog_modulate_social',
  'cog_modulate_selfhood', 'cog_use_cerebellum', 'cog_use_thalamic_gate', 'cog_use_ofc_map',
  'cog_use_prospection', 'cog_use_limbic_bias', 'cog_affect_enabled', 'cog_affect_somatic', 'cog_affect_persona_llm', 'cog_language_enabled',
  'cog_social_enabled', 'cog_selfhood_enabled', 'cog_attachment_enabled', 'cog_tsundere_enabled',
  'cog_memory_encode', 'cog_sleep_replay', 'cog_memory_reconsolidate', 'cog_cls_interleave']
const COG_TEXT_KEYS = ['cog_affect_profile', 'cog_language_framing', 'cog_attachment_type', 'cog_tsundere_type']
const attachmentTypeOptions = ['独占型', '依存型', '妄想型', '监视型', '自伤型', '排除型']
const tsundereTypeOptions = ['经典傲娇', '高冷傲娇', '暴躁傲娇', '迁就傲娇']
const cogProfileOptions = ['typical', 'depression', 'anxiety', 'bpd', 'alexithymia']
const cogFramingOptions = ['independent', 'interchanging', 'cognitive_determinism', 'weak_whorf',
  'thinking_for_speaking', 'radical_connectionism', 'determinism']
const cogStageOptions = ['0 · egocentric', '1 · subjective', '2 · self-reflective', '3 · mutual', '4 · societal-symbolic']
const cogStageValue = computed({
  get: () => `${Number(settingsForm.value.cog_social_stage ?? 2)} · ${['egocentric', 'subjective', 'self-reflective', 'mutual', 'societal-symbolic'][Number(settingsForm.value.cog_social_stage ?? 2)] || 'self-reflective'}`,
  set: (value: string) => { settingsForm.value.cog_social_stage = Number(String(value).split('·')[0].trim()) },
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
const episode = computed(() => wave2.value?.episode || null)
const episodeStateLabel = (value: string) => ({ euthymic: '平稳', subthreshold: '下滑中', episode: '低落发作' } as Record<string, string>)[value] || '—'

// --- life on/off (开始生命 / 暂停生命) -------------------------------------
const life = computed(() => cognition.value?.life || null)
const lifeBusy = ref(false)
const lifeGreet = ref(true)
function lifeAgeText() {
  const born = life.value?.born_at
  if (!born) return '—'
  const ms = Date.now() - new Date(born).getTime()
  if (!isFinite(ms) || ms < 0) return '—'
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  return days > 0 ? `${days} 天 ${hours} 小时` : `${hours} 小时`
}
async function startLife() {
  lifeBusy.value = true
  try {
    const result = await act('life_start', { greet: lifeGreet.value })
    if (result) flash(result.greeting ? `她开始生活了：${result.greeting}` : '生命已开始：她开始有自己的生活了')
  } finally { lifeBusy.value = false }
}
async function stopLife() {
  lifeBusy.value = true
  try {
    const result = await act('life_stop', {})
    if (result) flash('已暂停：她不再主动思考，记忆与内心状态保留')
  } finally { lifeBusy.value = false }
}

// One-click configurations: set the relevant knobs then save.
function applyPreset(fields: Record<string, any>, label: string) {
  Object.assign(settingsForm.value, fields)
  void saveSettings().then(() => flash(`已套用并保存「${label}」`))
}
const PRESETS = [
  { label: '常规', fields: { cog_affect_enabled: true, cog_affect_profile: 'typical', cog_affect_threat: 0.2, cog_affect_reward: 1, cog_attachment_enabled: false, cog_tsundere_enabled: false } },
  { label: '抑郁倾向', fields: { cog_affect_enabled: true, cog_affect_profile: 'depression', cog_affect_threat: 0.45, cog_affect_reward: 0.7 } },
  { label: '傲娇', fields: { cog_tsundere_enabled: true, cog_tsundere_type: '经典傲娇' } },
  { label: '病娇·独占', fields: { cog_affect_enabled: true, cog_affect_profile: 'depression', cog_attachment_enabled: true, cog_attachment_type: '独占型' } },
  { label: '病娇·依存', fields: { cog_affect_enabled: true, cog_attachment_enabled: true, cog_attachment_type: '依存型' } },
  { label: '病娇·妄想', fields: { cog_affect_enabled: true, cog_affect_profile: 'depression', cog_attachment_enabled: true, cog_attachment_type: '妄想型' } },
]
const somaticChannels = computed(() => cognition.value?.wave2?.somatic_channels || null)
const channelLabel = (name: string) => ({ fatigue: '疲劳', pain: '疼痛', cardiorespiratory: '心慌',
  gastrointestinal: '胃肠', dizziness: '头晕', sleep: '睡眠' } as Record<string, string>)[name] || name
const somScale = (value: any) => Math.max(0.02, Math.min(1, Number(value))).toFixed(3)
const personaEvidenceText = computed(() => {
  const evidence = personaInfo.value?.evidence || {}
  return Object.entries(evidence).map(([dim, words]) => `${dim}(${(words as string[]).join('、')})`).join('；')
})
function fmtNum(value: any, digits = 3) { return value == null || value === '' ? '—' : Number(value).toFixed(digits) }

// --- worldsim / state ------------------------------------------------------
const worldEvents = computed(() => (data.value.timeline || []).filter((t: any) => t.topic === '世界').slice(0, 30))
const commitments = computed(() => data.value.commitments || [])
const userModels = computed(() => data.value.user_model || [])
const valuesList = computed(() => Object.entries(data.value.values || {})
  .map(([k, v]) => ({ k, v: Number(v) })).sort((a: any, b: any) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 20))
function parseList(text: string) { try { const v = JSON.parse(text || '[]'); return Array.isArray(v) ? v : [] } catch { return [] } }

const settingsForm = ref<Record<string, any>>({})
const worldDensity = ref('off')
const worldDensityOptions = [{ value: 'off', label: '关闭' }, { value: 'texture', label: '纹理（只记录）' }, { value: 'full', label: '完整（可主动提及）' }]
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
const worldFictionalOptions = [{ value: 'fictional', label: '虚构' }, { value: 'real', label: '真实' }]

// worldview snapshot (identity + renderable map + current actor positions)
const worldview = computed(() => data.value.worldview || null)
const worldMap = computed(() => worldview.value?.map || { locations: [], edges: [], actors: [], width: 1000, height: 700, title: '' })
const actorLocations = computed(() => worldview.value?.actor_locations || {})
function locById(id: string) { return (worldMap.value.locations || []).find((l: any) => l.id === id) || null }
const MAP_KINDS = ['home', 'work', 'shop', 'food', 'park', 'transit', 'other']
const KIND_LABEL: Record<string, string> = { home: '家', work: '工作', shop: '商店', food: '餐饮', park: '公园', transit: '交通', other: '其他' }
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
    const tiles = L.tileLayer(TILE_URL, { subdomains: ['1', '2', '3', '4'], maxZoom: 19, minZoom: 3, attribution: '© 高德地图' })
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
      ;(pk.trees || []).forEach((t: any) => L.circleMarker(xy(t[0], t[1]), { pane: 'pParks', radius: 2.6, stroke: false, fillColor: '#82bd79', fillOpacity: 1 }).addTo(markerLayer))
      if (pk.name && pk.name !== '公园') L.marker(path(pk.points)[0], { pane: 'pLabels', interactive: false, icon: routeLabel(pk.name, '#5a9e52') }).addTo(markerLayer)
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
async function saveSettings() {
  const settings = { ...cogPayload(), world_density: worldDensity.value,
    world_fictional: worldFictional.value, world_country: worldCountry.value,
    world_city: worldCity.value, world_district: worldDistrict.value,
    world_premise: worldPremise.value, world_actors: worldActors.value, world_places: worldPlaces.value,
    persona_text: personaText.value }
  const result = await act('settings_set', { settings })
  if (result?.rejected?.length) flash(`已保存，忽略无效项：${result.rejected.join('、')}`); else flash('设置已保存')
}
async function generateWorld() {
  if (worldBusy.value) return
  const ok = await confirm({
    title: '✦ AI 重写设定',
    message: '这会用模型结果覆盖上面的 国家 / 城市 / 前言 / 演员 / 地点 等设定。只想更新地图，请用「只生成地图（保留设定）」',
    confirmLabel: '覆盖并生成',
    danger: true,
  })
  if (!ok) return
  worldBusy.value = true
  try {
    const result = await act('world_generate', { instructions: '' })
    if (result?.worldview) flash('已由 AI 完善世界观并生成地图')
  } finally {
    worldBusy.value = false
  }
}
async function generateMapOnly() {
  if (worldBusy.value) return
  worldBusy.value = true
  try {
    const result = await act('world_map_generate', { instructions: '' })
    if (result?.worldview) flash('已按当前设定重新生成地图（设定未改动）')
  } finally {
    worldBusy.value = false
  }
}
async function clearWorld() {
  const ok = await confirm({
    title: '清除世界事件',
    message: '会删除时间线里所有「世界」事件、世界触发的主动消息与相关记忆，并重置世界状态（演员位置等）。此操作不可撤销。',
    confirmLabel: '清除',
    danger: true,
  })
  if (!ok) return
  const result = await act('world_clear', {})
  if (result) flash('已清除世界事件并重置世界状态')
}
async function resetPerson() {
  const first = await confirm({
    title: '重置整个人',
    message:
      '这是唯一一次可以「重来」的操作——日常里删除一条记忆或撤回一句话都是不可逆的。\n\n' +
      '会清空：全部记忆与本地备份、关系与亲密度、承诺、目标与进展日志、未完成话题、用户画像与用户模型、' +
      '价值取向、人设演化、日记与梦境、每日复盘、技能与常用表达、社交节点与边、群内关系、时间线与见闻、' +
      '主动消息与回执，以及认知内核（自我叙事、互惠关系、情感历史、学到的价值表）。\n\n' +
      '会保留：你自己的设置（限额、端点、群策略、日历规则）。\n\n此操作不可撤销。',
    confirmLabel: '继续',
    danger: true,
  })
  if (!first) return
  const second = await confirm({
    title: '再确认一次',
    message: '真的要把这个人恢复到出厂状态吗？之后他不会再记得发生过的任何事。',
    confirmLabel: '重置整个人',
    danger: true,
  })
  if (!second) return
  personBusy.value = true
  try {
    await act('reset_person', {})
    flash('已重置整个人')
    await load()
  } finally { personBusy.value = false }
}
// --- persona (moved out of Settings → 人设) --------------------------------
type PersonaForm = { name: string; avatar: string; birthDate: string; gender: string; description: string; personality: string; greeting: string; customPrompt: string }
const emptyPersona = (): PersonaForm => ({ name: '', avatar: '', birthDate: '', gender: '', description: '', personality: '', greeting: '', customPrompt: '' })
const genderOptions = [
  { value: '', label: '不判定' },
  { value: 'female', label: '女' },
  { value: 'male', label: '男' },
  { value: 'other', label: '其它' },
]
function genderLabel(value: string) {
  return (genderOptions.find((o) => o.value === value) || genderOptions[0]).label
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
const erqOptions = ['typical', 'depression', 'anxiety', 'bpd', 'alexithymia']
const characterSelectOptions = computed(() => [
  { value: '', label: '（不判定）' },
  ...((analysis.value?.options?.character || []) as any[]).map((o) => ({ value: o.key, label: o.label })),
])
const relationshipSelectOptions = computed(() => [
  { value: '', label: '（不判定）' },
  ...((analysis.value?.options?.relationship || []) as any[]).map((o) => ({
    value: o.key,
    label: o.label + (o.pathological ? ' · 病娇族' : ''),
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
  if (!body.text.trim()) { flash('请先填写「描述」或「性格」'); return }
  analyzeBusy.value = true
  try {
    const result = await act('persona_analyze', { text: body.text, gender: personaForm.value.gender })
    if (result) {
      analysis.value = result
      if (!personaForm.value.gender && result.gender) personaForm.value.gender = result.gender
      flash(result.source === 'llm' ? '已由模型理解，请核对/微调参数' : '模型不可用，已用本地词典理解，请核对')
    }
  } finally { analyzeBusy.value = false }
}
async function savePersona() {
  if (!analysis.value) { flash('请先点「LLM 理解」并核对参数，再保存'); return }
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
    flash('人设与参数已保存')
  } finally { personaBusy.value = false }
}
onMounted(loadPersona)
watch(tab, (value) => { if (value === 'persona') loadPersona() })

onMounted(load)
</script>

<template>
  <main class="pcp" ref="pageEl">
    <header class="hero">
      <div class="hero-main">
        <div class="hero-copy">
          <p class="eyebrow"><b>◉</b> L.I.F.E / COGNITION</p>
          <h1>陪伴面板 · 认知内核</h1>
          <p class="sub">五套认知回路（决策仲裁 / 情感生理 / 语言习得 / 社会学习 / 自我与时间）。它们始终在后台记录状态；只有打开对应的「调节」开关，状态才会写进提示词。全部关闭时行为与旧版完全一致。</p>
        </div>
        <div class="hero-actions">
          <button class="btn" :class="{ tonic: !life?.alive }" :disabled="lifeBusy || loading" @click="life?.alive ? stopLife() : startLife()">{{ lifeBusy ? '…' : (life?.alive ? '⏸ 暂停生命' : '❍ 开始生命') }}</button>
          <button class="fab" :disabled="loading" @click="saveSettings"><span class="fab-ic">✦</span>保存设置</button>
          <button class="btn tonic" :disabled="loading" @click="load">{{ loading ? '刷新中…' : '刷新' }}</button>
        </div>
      </div>

      <div class="state-row">
        <span class="pill" :class="{ bad: cognition && !cognition.enabled }">认知内核 {{ cognition?.available === false ? '不可用' : cognition?.enabled ? '运行中' : '已停止' }}</span>
        <span class="pill soft">已决策 {{ wave1?.turns ?? 0 }} 轮</span>
        <span class="pill soft">情景痕迹 {{ wave1?.engrams ?? 0 }}</span>
        <span class="pill soft">词汇量 {{ wave3?.lexicon_size ?? 0 }}</span>
      </div>
    </header>

    <p v-if="error" class="banner err">{{ error }}</p>
    <p v-if="notice" class="banner ok">{{ notice }}</p>

    <nav class="tabs" aria-label="视图">
      <button v-for="item in navItems" :key="item.key" class="tab" :class="{ active: tab === item.key }" @click="jump(item.key)">
        <i>{{ item.i }}</i><span class="tab-ic">{{ item.icon }}</span>{{ item.label }}
      </button>
    </nav>

    <!-- 02 人设（原设置页 → 人设，移到陪伴） -->
    <section v-show="tab === 'persona'" class="panel">
      <div class="section-head"><div><h2>人设</h2><p class="desc">角色的名字、描述与性格。描述 + 性格是模型读取人设的全部来源：它同时驱动情绪画像、依恋动力学（病娇）的型别与初始值、以及抑郁倾向。改完文字后必须先用「LLM 理解」解析成参数、核对微调，才能保存。</p></div>
        <div class="head-actions">
          <button class="btn tonic sm" :disabled="analyzeBusy || loading" @click="analyzePersona">{{ analyzeBusy ? '理解中…' : 'LLM 理解' }}</button>
          <button class="btn filled sm" :disabled="personaBusy || !analysis" @click="savePersona">保存人设</button>
        </div>
      </div>
      <article class="card">
        <div class="settings-grid">
          <label><span>名字</span><input v-model="personaForm.name" class="field" /></label>
          <label><span>性别</span><AppSelect v-model="personaForm.gender" :options="genderOptions" aria-label="性别" /></label>
          <label><span>头像 URL</span><input v-model="personaForm.avatar" class="field" /></label>
          <label><span>生日</span><input v-model="personaForm.birthDate" type="date" class="field" /></label>
        </div>
        <label class="pfield"><span>描述</span><textarea v-model="personaForm.description" rows="3" class="field"></textarea></label>
        <label class="pfield"><span>性格</span><textarea v-model="personaForm.personality" rows="3" class="field"></textarea></label>
        <label class="pfield"><span>问候语</span><textarea v-model="personaForm.greeting" rows="2" class="field"></textarea></label>
        <label class="pfield"><span>自定义提示词（作为 system 提示逐字发送）</span><textarea v-model="personaForm.customPrompt" rows="5" class="field"></textarea></label>
        <p class="hint">填写/修改「描述」或「性格」后，先点右上角「LLM 理解」：模型会把文字解析成下面的参数，你核对或微调后「保存人设」才会写回；改了文字需要重新理解。</p>
      </article>
      <article v-if="analysis" class="card">
        <h3>解析结果 <span class="count-pill ok">{{ analysis.source === 'llm' ? '模型理解' : '本地词典' }}</span></h3>
        <div class="settings-grid">
          <label><span>性别</span><AppSelect v-model="analysis.gender" :options="genderOptions" aria-label="性别" /></label>
          <label><span>性格原型</span><AppSelect v-model="analysis.character.key" :options="characterSelectOptions" aria-label="性格原型" /></label>
          <label><span>关系 / 依恋类型</span><AppSelect v-model="analysis.relationship.key" :options="relationshipSelectOptions" aria-label="关系类型" /></label>
        </div>
        <p class="hint">
          性别：{{ genderLabel(analysis.gender) }}。
          <template v-if="analysis.relationship?.label">
            关系判定：{{ analysis.relationship.label }}
            <template v-if="analysis.relationship.pathological">（病娇族 → 才会启用依恋动力学）</template>
            <template v-else>（健康型 → 不启用病态依恋）</template>
          </template>
        </p>
        <p v-if="analysis.character?.expression || analysis.expression" class="hint">说话风格：{{ analysis.character?.expression || analysis.expression }}</p>

        <h4>情绪 / 躯体参数</h4>
        <div class="settings-grid">
          <label><span>威胁基线</span><input v-model.number="analysis.traits.threat_baseline" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>奖赏基线</span><input v-model.number="analysis.traits.reward_baseline" type="number" step="0.1" min="0" max="2" class="field tiny" /></label>
          <label><span>灾难化</span><input v-model.number="analysis.traits.catastrophizing" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>情绪调节画像</span><AppSelect v-model="analysis.traits.erq_profile" :options="erqOptions" aria-label="情绪调节画像" /></label>
          <label><span>作息（睡眠小时 0-23）</span><input v-model.number="analysis.traits.sleep_hour" type="number" min="0" max="23" class="field tiny" /></label>
        </div>

        <h4>性格维度</h4>
        <div class="settings-grid">
          <label><span>外向性</span><input v-model.number="analysis.traits.extraversion" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>宜人性</span><input v-model.number="analysis.traits.agreeableness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>尽责性</span><input v-model.number="analysis.traits.conscientiousness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>开放性</span><input v-model.number="analysis.traits.openness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>依恋焦虑</span><input v-model.number="analysis.traits.attach_anxiety" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          <label><span>依恋回避</span><input v-model.number="analysis.traits.attach_avoidance" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
        </div>
        <details class="pdetails">
          <summary>更多风格参数（表达 / 语气）</summary>
          <div class="settings-grid" style="margin-top:10px">
            <label><span>表达欲</span><input v-model.number="analysis.traits.expressiveness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>主动性</span><input v-model.number="analysis.traits.initiative" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>幽默</span><input v-model.number="analysis.traits.humor" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>亲和</span><input v-model.number="analysis.traits.warmth" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>正式程度</span><input v-model.number="analysis.traits.formality" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>强势 / 支配</span><input v-model.number="analysis.traits.assertiveness" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          </div>
        </details>

        <template v-if="analysis.attachment.type">
          <h4>病态依恋 · 由关系类型「{{ analysis.relationship.label }}」决定</h4>
          <div class="settings-grid">
            <label><span>依恋型别（随关系类型）</span><input class="field" :value="analysis.attachment.type + '（' + (analysis.relationship.label || '') + '）'" disabled /></label>
            <label><span>初始焦虑 X</span><input v-model.number="analysis.attachment.initial.X" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>初始安全感 S</span><input v-model.number="analysis.attachment.initial.S" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          </div>
          <p class="hint">文字只是来源，真正保存进 LIFE 的是这里调好的数值。依恋型别由「关系/依恋类型」自动决定，改关系类型即可换型别。想更贴合「病娇常伴抑郁」，把情绪调节画像设为 depression。</p>
        </template>
        <p v-else class="hint">当前关系类型不是病娇族，不启用病态依恋动力学（病度、嫉妒、执念等由关系动力学单独驱动）。</p>

        <template v-if="analysis.tsundere && analysis.tsundere.type">
          <h4>傲娇动力学 · 由人设关键词决定</h4>
          <div class="settings-grid">
            <label><span>傲娇型别</span><input class="field" :value="analysis.tsundere.type" disabled /></label>
            <label><span>初始好感 A</span><input v-model.number="analysis.tsundere.initial.A" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>初始傲娇表达 T</span><input v-model.number="analysis.tsundere.initial.T" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>初始病娇执念 Y</span><input v-model.number="analysis.tsundere.initial.Y" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          </div>
          <p class="hint">文字只是来源，真正保存进 LIFE 的是这里调好的数值。改人设里的关键词即可换型别（口嫌体正直→经典，高冷→高冷，暴躁→暴躁，迁就→迁就）。</p>
        </template>
        <p v-else class="hint">人设里没有傲娇关键词，不启用傲娇动力学（可在下方「傲娇 / 病娇动力学」卡片手动开启）。</p>
      </article>
    </section>

    <!-- 01 认知 -->
    <section v-show="tab === 'cognition'" class="panel">
      <div class="section-head"><div><h2>认知内核</h2><p class="desc">实时状态与全部参数。改动后点右上角「保存设置」才会生效。</p></div>
        <div class="head-actions"><button class="btn filled sm" @click="saveSettings">保存设置</button></div>
      </div>

      <article class="card">
        <h3>生命 <span class="count-pill" :class="{ ok: life?.alive }">{{ life?.alive ? '活着' : '未开始 / 已暂停' }}</span></h3>
        <div class="settings-grid">
          <div class="cog-metric"><span>状态</span><strong>{{ life?.alive ? '活着' : '未开始 / 已暂停' }}</strong></div>
          <div class="cog-metric"><span>已活</span><strong>{{ lifeAgeText() }}</strong></div>
          <div class="cog-metric"><span>思考步数</span><strong>{{ life?.ticks ?? 0 }}</strong></div>
          <div class="cog-metric"><span>常驻思考</span><strong>{{ life?.resident_running ? '运行中' : '停止' }}</strong></div>
          <div class="cog-metric"><span>主动行为</span><strong>{{ life?.proactive_enabled ? '开' : '关' }}</strong></div>
          <div class="cog-metric"><span>上次思考</span><strong>{{ (life?.last_tick || '').slice(0, 16).replace('T', ' ') || '—' }}</strong></div>
        </div>
        <p v-if="life?.last_thought" class="hint">此刻的念头：{{ life.last_thought }}</p>
        <p v-if="life?.focus" class="hint">当前专注：{{ life.focus }}</p>
        <p v-if="life?.active_goal" class="hint">想推进的目标：{{ life.active_goal }}</p>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:10px">
          <label class="sw"><input type="checkbox" v-model="lifeGreet" /><span>开始时让她先主动说一句</span></label>
          <button class="btn sm" :class="{ filled: !life?.alive }" :disabled="lifeBusy || loading" @click="life?.alive ? stopLife() : startLife()">
            {{ lifeBusy ? '…' : (life?.alive ? '⏸ 暂停生命' : '❍ 开始生命') }}
          </button>
        </div>
        <p class="hint">「开始生命」一次打开：认知内核 + 常驻思考 + 主动行为（主动消息/做梦），并立刻让她想第一件事。暂停后不再自主思考，但内心状态与记忆都保留。</p>
      </article>

      <article class="card">
        <h3>实时状态 <span class="count-pill" :class="{ ok: cognition?.enabled }">{{ cognition?.enabled ? '运行中' : '已停止' }}</span></h3>
        <div v-if="!cognition" class="empty">尚无状态数据（刷新后显示）</div>
        <div v-else class="settings-grid">
          <div class="cog-metric"><span>仲裁模式</span><strong>{{ lastControl?.mode || '—' }}</strong></div>
          <div class="cog-metric"><span>本轮策略</span><strong>{{ lastControl?.action || '—' }}</strong></div>
          <div class="cog-metric"><span>控制需求</span><strong>{{ fmtNum(lastControl?.need) }}</strong></div>
          <div class="cog-metric"><span>置信度</span><strong>{{ fmtNum(lastControl?.confidence) }}</strong></div>
          <div class="cog-metric"><span>已决策轮数</span><strong>{{ wave1?.turns ?? 0 }}</strong></div>
          <div class="cog-metric"><span>情景痕迹</span><strong>{{ wave1?.engrams ?? 0 }}</strong></div>
          <div class="cog-metric"><span>模型可靠性</span><strong>{{ fmtNum(wave1?.reliability) }}</strong></div>
          <div class="cog-metric"><span>心境</span><strong>{{ fmtNum(wave2?.mood) }}</strong></div>
          <div class="cog-metric"><span>迷走张力</span><strong>{{ fmtNum(wave2?.vagal_tone) }}</strong></div>
          <div class="cog-metric"><span>躯体化指数</span><strong>{{ fmtNum(wave2?.somatization_index) }}</strong></div>
          <div class="cog-metric"><span>健康焦虑</span><strong>{{ fmtNum(wave2?.health_anxiety) }}</strong></div>
          <div class="cog-metric"><span>躯体负担</span><strong>{{ fmtNum(wave2?.somatic_burden) }}</strong></div>
          <div class="cog-metric"><span>人设特质</span><strong>{{ personaInfo?.applied ? (personaInfo.source === 'llm' ? '已应用 · LLM' : '已应用 · 词典') : '未解析' }}</strong></div>
          <div class="cog-metric"><span>词汇量</span><strong>{{ wave3?.lexicon_size ?? 0 }}</strong></div>
          <div class="cog-metric"><span>共情权重</span><strong>{{ fmtNum(wave4a?.empathy) }}</strong></div>
          <div class="cog-metric"><span>视角阶段</span><strong>{{ wave4a?.perspective_name || '—' }}</strong></div>
          <div class="cog-metric"><span>注意状态</span><strong>{{ wave4b?.attention_state || '—' }}</strong></div>
          <div class="cog-metric"><span>耐心</span><strong>{{ fmtNum(wave4b?.patience) }}</strong></div>
          <template v-if="attachment?.enabled">
            <div class="cog-metric"><span>依恋型别</span><strong>{{ attachment.label || attachment.type }}</strong></div>
            <div class="cog-metric"><span>病度</span><strong>{{ fmtNum(attachment.severity, 2) }} · {{ attachment.band }}</strong></div>
            <div class="cog-metric"><span>主导倾向</span><strong>{{ attachment.dominant || '—' }}</strong></div>
            <div class="cog-metric"><span>依恋压力</span><strong>{{ fmtNum(attachment.distress, 2) }}</strong></div>
            <div class="cog-metric"><span>抑郁共病</span><strong>{{ fmtNum(attachment.comorbid_depression, 2) }}</strong></div>
          </template>
          <template v-if="episode">
            <div class="cog-metric"><span>情绪病程</span><strong>{{ episodeStateLabel(episode.state) }}</strong></div>
            <div class="cog-metric"><span>病程严重度</span><strong>{{ fmtNum(episode.severity, 2) }}</strong></div>
            <div class="cog-metric"><span>发作 / 复发</span><strong>{{ episode.episodes }} / {{ episode.relapses }}</strong></div>
            <div v-if="episode.state === 'episode'" class="cog-metric"><span>已持续</span><strong>{{ fmtNum(episode.days_in_episode, 1) }} 天</strong></div>
          </template>
        </div>
        <p v-if="episode" class="hint">
          情绪病程：连续两次评估越过阈值才算「低落发作」，连续两次回落才算「缓解」；缓解期内再次发作计为「复发」。
          它由情绪、快感缺失、稳态负荷、反刍、睡眠合成——沉默与慢性压力会把它推高。
        </p>
        <p v-if="attachment?.enabled" class="hint">
          依恋动力学已开启：{{ attachment.label }}。病度 {{ fmtNum(attachment.severity, 2) }}（{{ attachment.band }}）由依恋、嫉妒、焦虑、执念等合成；
          {{ attachment.safe_mode ? '已进入安全层（只表达情绪、不给伤害方法）。' : '低于 0.85 不会触发安全层。' }}
          它与抑郁双向影响：低落会放大不安、依恋压力也会拖累情绪。
        </p>
        <p v-if="personaInfo?.applied" class="hint">人设特质已生效（{{ personaInfo.source === 'llm' ? 'LLM 精修' : '本地词典' }}）：{{ personaEvidenceText || '—' }}。改人设请到 设置 → 人设，下一条消息自动生效。</p>
        <div v-if="somaticChannels" class="som-channels">
          <div v-for="(value, name) in somaticChannels" :key="name" class="som-chan">
            <span class="som-chan-name">{{ channelLabel(name) }}</span>
            <span class="som-chan-bar"><i :style="{ transform: 'scaleX(' + somScale(value) + ')' }"></i></span>
            <span class="som-chan-val">{{ fmtNum(value, 2) }}</span>
          </div>
          <p v-if="Number(wave2?.somatic_chronicity) > 0.1" class="hint">慢性化程度 {{ fmtNum(wave2?.somatic_chronicity) }} — 反复报告的通道已开始敏化。</p>
        </div>
      </article>

      <article class="card">
        <h3>总开关与提示词调节</h3>
        <div class="switches">
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_enabled" /><span>启用认知内核</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_modulate_affect" /><span>情感影响提示词</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_modulate_language" /><span>语言影响提示词</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_modulate_social" /><span>社会认知影响提示词</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_modulate_selfhood" /><span>自我与时间影响提示词</span></label>
        </div>
      </article>

      <article class="card">
        <h3>快速预设</h3>
        <p class="hint">一键套用常见配置并保存（套用后仍可逐项微调）：常规、抑郁倾向、病娇（独占 / 依存 / 妄想）。病娇预设会同时把情绪调节画像设为 depression，贴合"常伴抑郁"。</p>
        <div class="preset-row">
          <button v-for="preset in PRESETS" :key="preset.label" type="button" class="btn sm" @click="applyPreset(preset.fields, preset.label)">{{ preset.label }}</button>
        </div>
      </article>

      <div class="grid2">
        <article class="card">
          <h3>决策仲裁（第一波）</h3>
          <div class="settings-grid">
            <label><span>规划深度</span><input v-model.number="settingsForm.cog_plan_depth" type="number" min="1" max="6" class="field tiny" /></label>
            <label><span>工作记忆容量</span><input v-model.number="settingsForm.cog_wm_capacity" type="number" min="1" max="12" class="field tiny" /></label>
            <label><span>策略温度 τ</span><input v-model.number="settingsForm.cog_tau" type="number" step="0.05" min="0.05" max="1" class="field tiny" /></label>
            <label><span>折扣 γ</span><input v-model.number="settingsForm.cog_gamma" type="number" step="0.01" min="0" max="0.999" class="field tiny" /></label>
            <label><span>习惯学习率</span><input v-model.number="settingsForm.cog_alpha_habit" type="number" step="0.01" min="0" max="1" class="field tiny" /></label>
            <label><span>无模型学习率</span><input v-model.number="settingsForm.cog_alpha_mf" type="number" step="0.01" min="0" max="1" class="field tiny" /></label>
            <label><span>惊讶阈值 θ_pe</span><input v-model.number="settingsForm.cog_theta_pe" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>新颖阈值 θ_n</span><input v-model.number="settingsForm.cog_theta_n" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>前瞻视野</span><input v-model.number="settingsForm.cog_prospection_horizon" type="number" min="1" max="8" class="field tiny" /></label>
          </div>
          <div class="switches">
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_thalamic_gate" /><span>丘脑门控</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_cerebellum" /><span>小脑预测误差</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_ofc_map" /><span>OFC 认知地图</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_prospection" /><span>未来奖赏前瞻</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_use_limbic_bias" /><span>边缘系统偏向</span></label>
          </div>
        </article>

        <article class="card">
          <h3>情感与生理（第二波）</h3>
          <div class="settings-grid">
            <label><span>情绪调节画像</span><AppSelect v-model="settingsForm.cog_affect_profile" :options="cogProfileOptions" aria-label="情绪调节画像" /></label>
            <label><span>迷走基线</span><input v-model.number="settingsForm.cog_affect_vagal" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>威胁基线</span><input v-model.number="settingsForm.cog_affect_threat" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>奖赏基线</span><input v-model.number="settingsForm.cog_affect_reward" type="number" step="0.1" min="0" max="2" class="field tiny" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_affect_enabled" /><span>启用情感与生理回路</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_affect_somatic" /><span>启用躯体化网关（人设含体弱、心慌等标记时自动开启）</span></label>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_affect_persona_llm" /><span>人设特质由模型理解（改动人设后下一条消息精修一次，失败自动回退本地词典）</span></label>
        </article>

        <article class="card">
          <h3>语言习得（第三波）</h3>
          <div class="settings-grid">
            <label><span>语言-思维耦合</span><AppSelect v-model="settingsForm.cog_language_framing" :options="cogFramingOptions" aria-label="语言-思维耦合" /></label>
            <label><span>分词边界阈值</span><input v-model.number="settingsForm.cog_language_boundary" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_language_enabled" /><span>启用语言习得回路</span></label>
        </article>

        <article class="card">
          <h3>社会学习（第四波）</h3>
          <div class="settings-grid">
            <label><span>共情权重</span><input v-model.number="settingsForm.cog_social_empathy" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>观点采择阶段</span><AppSelect v-model="cogStageValue" :options="cogStageOptions" aria-label="观点采择阶段" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_social_enabled" /><span>启用社会学习回路</span></label>
        </article>

        <article class="card">
          <h3>自我与时间（第四波）</h3>
          <div class="settings-grid">
            <label><span>时间折扣 k</span><input v-model.number="settingsForm.cog_selfhood_discount" type="number" step="0.05" min="0" max="1" class="field tiny" /></label>
            <label><span>人设细节尺度</span><input v-model.number="settingsForm.cog_selfhood_detail" type="number" step="1" min="1" max="50" class="field tiny" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_selfhood_enabled" /><span>启用自我与时间回路</span></label>
        </article>

        <article class="card">
          <h3>病态依恋 / 病娇（可选）</h3>
          <p class="hint">
            把"占有欲、嫉妒、黏人、多疑"做成一个**会自己演化的状态**，而不是一句人设标签。默认关闭；
            开启后由真实互动驱动——你的消息、回复快慢、沉默天数、是否提到别人、睡眠——并和抑郁互相影响。
            无论多严重，极重度（≥0.85）都会自动进入安全层：只表达情绪、请求陪伴，不生成自伤或伤人的方法。
          </p>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_attachment_enabled" /><span>启用依恋动力学</span></label>
          <div class="settings-grid">
            <label><span>依恋型别</span><AppSelect v-model="settingsForm.cog_attachment_type" :options="attachmentTypeOptions" aria-label="依恋型别" /></label>
          </div>
          <p class="hint">
            怎么配：① 打开开关并选型别（独占 / 依存 / 妄想 / 监视 / 自伤 / 排除）——
            型别只改变"同一种动力的权重"，不是硬编码台词；或 ② 直接在人设里写关键词，
            系统会自动启用并按人设填初始值：如"占有欲强、爱吃醋"→独占型，"很黏人、离不开你"→依存型，
            "老是查岗、跟踪"→监视型，"疑神疑鬼、总觉得被骗"→妄想型。想更贴近"病娇常伴抑郁"，
            把上方「情绪调节画像」设为 depression，两者会互相加重。
          </p>
        </article>

        <article class="card">
          <h3>傲娇 / 病娇动力学（可选）</h3>
          <p class="hint">
            把"表面毒舌、内心温柔"和"以爱为名的执念"做成同一个**会自己演化的三变量系统**
            （好感 A / 傲娇表达 T / 病娇执念 Y）。默认关闭；开启后由真实互动驱动——
            你的消息温度、回复快慢、沉默天数、是否提到别人——并且病娇化是可逆的：
            停止冷遇、持续关爱就会退回傲娇。极重度（≥0.85）自动进入安全层。
          </p>
          <label class="sw"><input type="checkbox" v-model="settingsForm.cog_tsundere_enabled" /><span>启用傲娇动力学</span></label>
          <div class="settings-grid">
            <label><span>傲娇型别</span><AppSelect v-model="settingsForm.cog_tsundere_type" :options="tsundereTypeOptions" aria-label="傲娇型别" /></label>
          </div>
          <p class="hint">
            怎么配：① 打开开关并选型别（经典 / 高冷 / 暴躁 / 迁就）——型别只改变
            "同一种动力的权重"（黑化快慢、嘴硬程度），不是硬编码台词；或 ② 直接在人设里写关键词，
            系统会自动启用并按人设填初始值：如"口嫌体正直、嘴硬"→经典傲娇，"高冷、冰山"→高冷傲娇，
            "一点就炸、暴躁"→暴躁傲娇，"好脾气、别扭地关心"→迁就傲娇。若人设里还写了"病娇/占有欲"，
            建议同时启用上方「病态依恋」，两者会互相影响。
          </p>
        </article>

        <article class="card">
          <h3>记忆与巩固（默认开启）</h3>
          <p class="hint">这四项决定「经历会不会留下痕迹」：写入情景记忆、睡眠期回放、日终再巩固、交错学习（CLS）。默认开启——关掉时人格被固定在人设上，经历不留痕，行为与无认知内核时完全一致（可逐个消融）。</p>
          <div class="switches">
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_memory_encode" /><span>选择性情景编码</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_sleep_replay" /><span>睡眠期回放巩固</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_memory_reconsolidate" /><span>日终痕迹再巩固</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.cog_cls_interleave" /><span>交错学习 + 一致性门控（CLS）</span></label>
          </div>
        </article>
      </div>
    </section>

    <!-- 02 世界 -->
    <section v-show="tab === 'world'" class="panel">
      <div class="section-head"><div><h2>世界</h2><p class="desc">本地小模型驱动的虚构生活世界：事件、演员表与账本。默认关闭。</p></div>
        <div class="head-actions"><button class="btn filled sm" @click="saveSettings">保存设置</button></div>
      </div>
      <article class="card">
        <h3>虚构浓度</h3>
        <div class="settings-grid">
          <label><span>world_density</span><AppSelect v-model="worldDensity" :options="worldDensityOptions" aria-label="虚构浓度" /></label>
        </div>
        <p class="hint">off 完全不影响现有行为；texture 只把事件写进时间线与记忆；full 允许作为主动话题提及（上线需你明确确认）。</p>
      </article>
      <article class="card">
        <h3>人设 → 特质数据</h3>
        <p class="hint">把角色人设写在这里（性格、体质、作息、情绪风格）。保存后解析为认知内核的特质参数（威胁、奖赏基线、情绪调节画像、躯体化增益、作息等）：默认先由本地词典即时生效，并由模型对改动人设做一次精修（失败自动回退词典）。写明「体弱多病 / 心慌失眠」等会自动开启躯体化网关。</p>
        <label class="world-field"><span class="world-label">人设文本</span>
          <textarea v-model="personaText" class="world-text" rows="4" placeholder="例：她性格开朗但容易焦虑，体质偏弱，经常心慌失眠，遇到事爱钻牛角尖。"></textarea>
        </label>
      </article>
      <article class="card">
        <h3>世界观 · 定位</h3>
        <p class="hint">说清这是哪里：国家 / 城市 / 小区（可真实可虚构）。填不全也没关系——点「AI 完善」会补全设定并生成一份带坐标的地图。改了演员或地点后，之前生成的事件会作废、重新开始。</p>
        <div class="settings-grid">
          <label><span>世界类型</span><AppSelect v-model="worldFictional" :options="worldFictionalOptions" aria-label="世界类型" /></label>
          <label><span>国家</span><input v-model="worldCountry" class="field" placeholder="中国 / 架空：曦京" /></label>
          <label><span>城市</span><input v-model="worldCity" class="field" placeholder="杭州 / 临海市" /></label>
          <label><span>城区 · 小区</span><input v-model="worldDistrict" class="field" placeholder="西湖区 · 文一西路" /></label>
        </div>
        <label class="world-field"><span class="world-label">世界设定 / 前言</span>
          <textarea v-model="worldPremise" class="world-text" rows="3" placeholder="例：她住在一座临海小城，开着一家旧书店，养了一只叫煤球的猫。"></textarea>
        </label>
        <label class="world-field"><span class="world-label">演员表（每行一个：名字 — 名字|关系；关系可为 朋友/同事/家人）</span>
          <textarea v-model="worldActors" class="world-text" rows="4" placeholder="林小满|朋友&#10;阿哲|同事&#10;妈妈|家人"></textarea>
        </label>
        <label class="world-field"><span class="world-label">地点（逗号或换行分隔）</span>
          <textarea v-model="worldPlaces" class="world-text" rows="2" placeholder="楼下便利店, 常去的咖啡馆, 城西书店"></textarea>
        </label>
        <div class="world-actions">
          <button class="btn filled sm" type="button" :disabled="worldBusy" @click="generateMapOnly">{{ worldBusy ? '生成中…' : '✦ 只生成地图（保留设定）' }}</button>
          <button class="btn tonic sm" type="button" :disabled="worldBusy" @click="generateWorld">{{ worldBusy ? '生成中…' : 'AI 完善设定 + 生成地图' }}</button>
          <span class="hint">「只生成地图」不会动上面的设定文本；「完善设定」会用它重写设定。</span>
        </div>
      </article>
      <article class="card">
        <div class="wm-head">
          <h3>世界地图 <span class="count-pill">{{ worldMap.locations.length }}</span></h3>
          <span v-if="worldview" class="wm-place">{{ worldview.fictional ? '虚构' : '真实' }} · {{ [worldview.country, worldview.city, worldview.district].filter(Boolean).join(' / ') || '未命名' }}</span>
        </div>
        <p v-if="worldview?.premise" class="hint wm-premise">{{ worldview.premise }}</p>
        <div class="wm-map-wrap">
          <div ref="mapEl" class="world-map-leaflet" :class="{ 'is-empty': !worldMap.locations.length }"></div>
          <div v-if="offlineHint" class="wm-offline">底图加载失败（可能离线），仍可查看城市标记</div>
          <template v-if="worldMap.locations.length">
            <button v-if="worldMap.kind !== 'real' && worldMap.nation" type="button" class="wm-scope" @click="toggleScope">{{ scope === 'city' ? '全国视图' : '城市视图' }}</button>
            <button type="button" class="wm-reset" @click="resetView">⟲ 复位视角</button>
            <div v-if="worldMap.kind !== 'real' && scope === 'city'" class="wm-compass" aria-hidden="true"><i>N</i></div>
          </template>
        </div>
        <p v-if="!worldMap.locations.length" class="empty">还没有地图。点上面的「AI 完善并生成地图」。</p>
        <div v-if="worldMap.locations.length" class="wm-legend">
          <span v-for="k in usedKinds" :key="k"><i :class="'k-' + k"></i>{{ KIND_LABEL[k] }}</span>
          <span><i class="k-actor"></i>角色（{{ worldMap.actors.length }}）</span>
          <template v-if="worldMap.kind !== 'real'">
            <span><i class="k-hw"></i>高速/环线</span>
            <span><i class="k-arterial"></i>主干道</span>
            <span><i class="k-street"></i>街道</span>
            <span><i class="k-metro"></i>地铁</span>
            <span><i class="k-bus"></i>公交</span>
            <span><i class="k-park2"></i>公园</span>
            <span><i class="k-water"></i>水域</span>
          </template>
        </div>
        <div v-if="worldMap.locations.length && worldMap.kind !== 'real' && scope === 'city'" class="wm-routes">
          <div v-if="(worldMap.metro || []).length" class="wm-routes-col">
            <h4>地铁线路表</h4>
            <ul>
              <li v-for="(m, i) in worldMap.metro" :key="'m' + i">
                <b :style="{ color: m.color }">{{ m.name }}</b>
                <span>{{ (m.stations || []).map((s: any) => s.name).filter(Boolean).join(' · ') }}</span>
              </li>
            </ul>
          </div>
          <div v-if="(worldMap.bus || []).length" class="wm-routes-col">
            <h4>公交线路表</h4>
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
          <h3>最近世界事件 <span class="count-pill">{{ worldEvents.length }}</span></h3>
          <button v-if="worldEvents.length" type="button" class="btn tonic sm" @click="clearWorld">清除世界事件</button>
        </div>
        <ol class="feed"><li v-for="e in worldEvents" :key="e.id"><span class="meta">{{ e.created_at }}</span><strong>{{ e.summary }}</strong></li>
          <li v-if="!worldEvents.length" class="empty">还没有世界事件（开启后由本地模型生成）。</li></ol>
      </article>
    </section>

    <!-- 03 状态 -->
    <section v-show="tab === 'state'" class="panel">
      <div class="section-head"><div><h2>状态</h2><p class="desc">承诺账本、结构化用户模型与价值取向。</p></div></div>
      <article class="card">
        <h3>承诺账本 <span class="count-pill">{{ commitments.length }}</span></h3>
        <ol class="feed"><li v-for="c in commitments" :key="c.id"><strong>{{ c.text }}</strong><span class="meta">{{ c.user_id }}</span></li>
          <li v-if="!commitments.length" class="empty">没有未了结的承诺。</li></ol>
      </article>
      <div class="grid2">
        <article class="card">
          <h3>用户模型</h3>
          <ol class="feed"><li v-for="m in userModels" :key="m.user_id"><strong>{{ m.user_id }}</strong>
            <span class="meta">喜欢：{{ parseList(m.preferences).join('、') || '—' }}</span>
            <span class="meta">雷区：{{ parseList(m.taboos).join('、') || '—' }}</span>
            <span class="meta">关心：{{ parseList(m.concerns).join('、') || '—' }}</span></li>
            <li v-if="!userModels.length" class="empty">还没有结构化画像。</li></ol>
        </article>
        <article class="card">
          <h3>价值取向</h3>
          <ol class="feed"><li v-for="v in valuesList" :key="v.k"><strong>{{ v.k }}</strong><span class="meta">{{ Number(v.v).toFixed(2) }}</span></li>
            <li v-if="!valuesList.length" class="empty">还没有形成稳定价值取向。</li></ol>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div><h2>危险操作</h2>
          <p class="desc">日常操作不可撤销：撤回一句话、删除一条记忆都是永久的。这里保留唯一一次「重来」的机会。</p>
        </div>
      </div>
      <div class="grid2">
        <article class="card">
          <h3>重置整个人</h3>
          <p class="hint">清空记忆与备份、关系、承诺、目标、日记与梦境、价值取向、人设演化与认知内核，回到出厂状态。你自己的设置会保留。</p>
          <p class="hint" style="margin-top:10px"><strong>需要二次确认。</strong></p>
          <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn danger" :disabled="personBusy" @click="resetPerson">
              {{ personBusy ? '重置中…' : '重置整个人' }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
  <ConfirmDialog />
</template>

<style scoped>
.pcp{
  --r-xs:10px; --r-sm:14px; --r-md:20px; --r-lg:28px; --r-xl:36px;
  --spring:cubic-bezier(.2,.9,.25,1.15);
  height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;
  background:var(--md-surface);color:var(--md-on-surface);
  max-width:1240px;margin:0 auto;
}
h1,h2,h3,h4{margin:0;letter-spacing:-.01em}
.eyebrow{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}
.eyebrow b{font-size:9px}

/* Hero */
.hero{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;
  background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);
  color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}
.hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}
.hero-main{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}
.hero-copy h1{font-size:clamp(26px,3.4vw,40px);font-weight:800}
.sub{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}
.hero-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.fab{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);
  transition:transform .28s var(--spring),box-shadow .28s}
@media (hover: hover) and (pointer: fine){.fab:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}
.fab:disabled{opacity:.6;cursor:not-allowed}
.fab-ic{font-size:17px}
.state-row{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
.pill{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}
.pill.soft{font-weight:500;color:var(--md-on-surface-variant)}
.pill.bad{background:#ffdcc6;color:#7a3a00}

.banner{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}
.banner.err{background:var(--md-error-container);color:var(--md-on-error-container)}
.banner.ok{background:var(--md-primary-container);color:var(--md-on-primary-container)}

/* Tabs */
.tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}
.tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);
  border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;
  transition:background .25s,color .25s,transform .25s var(--spring)}
.tab i{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}
.tab-ic{font-size:14px}
.tab:hover{background:var(--md-surface-container-high)}
.tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
.tab.active i{opacity:.85}

.panel{animation:fade .32s var(--spring)}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
.section-head h2{font-size:22px;font-weight:800}
.desc{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}
.head-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* Buttons */
.btn{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}
.btn.sm{height:34px;padding:0 14px;font-size:13px}
.btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){.btn:hover:not(:disabled){transform:translateY(-1px)}}
.btn.filled{background:var(--md-primary);color:var(--md-on-primary,#fff)}
.btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.btn.text{background:transparent;color:var(--md-primary)}
.btn.danger{background:var(--md-error-container);color:var(--md-on-error-container)}
.link{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}

/* Cards */
.card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
.card > h3{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.card.sub{padding:16px;margin-bottom:0}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
.sub-label{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
.hint{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}
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
.wm-reset{position:absolute;top:10px;right:10px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:rgba(255,255,255,.94);color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.18)}
.wm-reset:hover{background:#fff}
.wm-compass{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay);width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.92);border:1px solid #b9c3cd;box-shadow:0 1px 4px rgba(0,0,0,.18);display:grid;place-items:center}
.wm-compass i{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}
.wm-compass i::before{content:'';position:absolute;left:50%;top:-9px;transform:translateX(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}
.wm-scope{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:rgba(255,255,255,.94);color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.18)}
.wm-scope:hover{background:#fff}
.wm-offline{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:var(--z-overlay);background:rgba(209,73,91,.94);color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.25)}
.wm-routes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:14px}
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
.meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}
.empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}

/* Fields */
.field{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}
.field:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
.field.tiny{width:104px;height:38px;padding:0 12px;font-size:13px}
.preset-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.switches{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}
.sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}
.sw input{width:18px;height:18px;accent-color:var(--md-primary)}
.settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
.settings-grid label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
.settings-grid .field{height:40px}
.pfield{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
.pfield textarea.field{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}
.cog-metric{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);
  background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}
.cog-metric span{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}
.cog-metric strong{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.som-channels{margin-top:10px;display:flex;flex-direction:column;gap:6px}
.som-chan{display:grid;grid-template-columns:52px 1fr 48px;align-items:center;gap:10px}
.som-chan-name{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
.som-chan-bar{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}
.som-chan-bar i{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}
.som-chan-val{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}

/* Chips / status */
.chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;
  background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}
.chip.ok{background:var(--md-success-container);color:#0d3b1e}
.count-pill{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
.count-pill.ok{background:var(--md-success-container);color:#0d3b1e}
.actions-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}

/* Material 3 Expressive align */
#app .pcp .card{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
#app .pcp .field{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}
#app .pcp .field:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app .pcp .field.tiny{height:40px}
#app .pcp .settings-grid .field{height:44px}
#app .pcp .btn{height:44px;padding:0 20px}
#app .pcp .btn.sm{height:36px;padding:0 15px}
#app .pcp .cog-metric{background:var(--md-surface-container)}

@media (prefers-reduced-motion: reduce){
  .panel{animation:none}
  .fab,.btn,.tab,.som-chan-bar i{transition:none}
  .fab:hover:not(:disabled),.btn:hover:not(:disabled),.tab.active{transform:none}
}

@media (prefers-color-scheme: dark){
  .pill.bad{background:#5a2d00;color:#ffd7b0}
}

@media(max-width:820px){.grid2,.grid3{grid-template-columns:1fr}.settings-grid label.wide{grid-column:span 1}}
@media(max-width:560px){.pcp{padding:var(--space-lg) var(--space-lg) 80px}.hero{padding:20px}.hero-actions{width:100%}}
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
