<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLifeStore } from '../stores/life'
import { useWizardStore } from '../stores/wizard'
import { live2dRuntimeReady } from '../live2d-runtime'

const { t } = useI18n()
const life = useLifeStore()
const wizard = useWizardStore()

const stageEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const modelMeta = ref('')
const loadState = ref<'idle' | 'loading' | 'ok' | 'error' | 'disabled' | 'no-libs'>('idle')
const errorMsg = ref('')

const enabled = computed(() => wizard.live2d.enabled)
const modelUrl = computed(() => wizard.live2d.modelUrl.trim())
const mood = computed(() => life.emotionMood)
const accent = computed(() => life.emotionColor)

const builtInModels = ref<{ id: string; label: string; url: string }[]>([])

async function loadModelList() {
  try {
    const res = await fetch('/api/live2d')
    if (res.ok) {
      const data = await res.json()
      builtInModels.value = data.models || []
    }
  } catch {
    builtInModels.value = []
  }
}

let pixiApp: any = null
let live2dModel: any = null
let resizeObserver: ResizeObserver | null = null
let loadToken = 0
let rafId = 0
let transformSaveTimer = 0
let lastPointer = { x: 0, y: 0, has: false }
let dragging = false
let dragPointerId: number | null = null
let dragOffset = { x: 0, y: 0 }

const TRANSFORM_KEY_PREFIX = '0kay.web.live2d.transform.'

function libsReady(): boolean {
  return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore)
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function transformKey() {
  return TRANSFORM_KEY_PREFIX + (modelUrl.value || 'default')
}

function loadSavedTransform(): { x: number; y: number; scale: number } | null {
  try {
    const raw = localStorage.getItem(transformKey())
    if (!raw) return null
    const p = JSON.parse(raw)
    if (typeof p?.x === 'number' && typeof p?.y === 'number' && typeof p?.scale === 'number') return p
  } catch { /* ignore */ }
  return null
}

function saveTransform(immediate = false) {
  if (!live2dModel) return
  const snap = () => {
    try {
      localStorage.setItem(transformKey(), JSON.stringify({
        x: Math.round(live2dModel.x * 100) / 100,
        y: Math.round(live2dModel.y * 100) / 100,
        scale: Math.round(live2dModel.scale.x * 10000) / 10000,
      }))
    } catch { /* ignore */ }
  }
  if (immediate) {
    if (transformSaveTimer) { clearTimeout(transformSaveTimer); transformSaveTimer = 0 }
    snap()
    return
  }
  if (transformSaveTimer) clearTimeout(transformSaveTimer)
  transformSaveTimer = window.setTimeout(() => {
    transformSaveTimer = 0
    snap()
  }, 140)
}

function disposeModel() {
  endDrag()
  if(transformSaveTimer) {clearTimeout(transformSaveTimer);transformSaveTimer=0}
  if (live2dModel) {
    try {
      if (pixiApp?.stage) pixiApp.stage.removeChild(live2dModel)
      live2dModel.destroy?.()
    } catch { /* ignore */ }
    live2dModel = null
  }
}

function disposeApp() {
  unbindStageInteraction()
  disposeModel()
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (transformSaveTimer) {
    clearTimeout(transformSaveTimer)
    transformSaveTimer = 0
  }
  if (pixiApp) {
    try {
      // keep the <canvas> element — Vue owns it
      pixiApp.destroy(false, { children: true, texture: false, baseTexture: false })
    } catch { /* ignore */ }
    pixiApp = null
  }
}

function measureBaseSize(model: any) {
  if (typeof model.getLocalBounds === 'function') {
    const b = model.getLocalBounds()
    if (b && b.width > 0 && b.height > 0) return { width: b.width, height: b.height }
  }
  const sx = Math.max(Math.abs(model.scale.x) || 0, 1e-4)
  const sy = Math.max(Math.abs(model.scale.y) || 0, 1e-4)
  return { width: Math.max(model.width / sx, 1), height: Math.max(model.height / sy, 1) }
}

function defaultFit(model: any = live2dModel) {
  if (!model || !pixiApp) return false
  const w = pixiApp.screen.width
  const h = pixiApp.screen.height
  if (!w || !h) return false
  const base = measureBaseSize(model)
  if (base.width > 0 && base.height > 0) {
    const scale = Math.min(w / base.width, h / base.height) * 0.88
    model.anchor?.set?.(0.5, 0.5)
    model.scale.set(scale, scale)
  }
  model.position.set(w * 0.5, h * 0.55)
  // Align using screen-space bounds so origin/anchor quirks can't push the model off-view.
  try {
    const b = model.getBounds?.()
    if (b && b.width > 0 && b.height > 0) {
      model.x += w * 0.5 - (b.x + b.width * 0.5)
      model.y += h * 0.55 - (b.y + b.height * 0.55)
      const fb = model.getBounds?.()
      if (fb && fb.width > 0 && fb.height > 0) {
        const fit = Math.min(w / fb.width, h / fb.height) * 0.88
        const cur = Math.abs(model.scale.x) || 1
        if (Number.isFinite(fit) && fit > 0 && Math.abs(fit - cur) / cur > 0.08) {
          const next = cur * fit
          model.scale.set(next, next)
          const b2 = model.getBounds?.()
          if (b2 && b2.width > 0) {
            model.x += w * 0.5 - (b2.x + b2.width * 0.5)
            model.y += h * 0.55 - (b2.y + b2.height * 0.55)
          }
        }
      }
    }
  } catch { /* ignore */ }
  return true
}

function modelHalfSize() {
  if (!live2dModel) return { hw: 0, hh: 0 }
  const base = measureBaseSize(live2dModel)
  const sx = Math.abs(live2dModel.scale.x) || 1
  const sy = Math.abs(live2dModel.scale.y) || 1
  return { hw: (base.width * sx) / 2, hh: (base.height * sy) / 2 }
}

function clampPosition() {
  if (!live2dModel || !pixiApp) return
  const w = pixiApp.screen.width
  const h = pixiApp.screen.height
  const { hw, hh } = modelHalfSize()
  // Keep at least ~30% of the model inside the viewport.
  const allowX = Math.min(hw * 0.7, w * 0.5)
  const allowY = Math.min(hh * 0.7, h * 0.5)
  const minX = allowX - hw
  const maxX = w - allowX + hw
  const minY = allowY - hh
  const maxY = h - allowY + hh
  const x = minX <= maxX ? clamp(live2dModel.x, minX, maxX) : w * 0.5
  const y = minY <= maxY ? clamp(live2dModel.y, minY, maxY) : h * 0.55
  live2dModel.position.set(x, y)
}

function fitModel() {
  if (!live2dModel || !pixiApp) return
  const saved = loadSavedTransform()
  if (saved && Number.isFinite(saved.scale) && saved.scale > 0) {
    live2dModel.anchor?.set?.(0.5, 0.5)
    live2dModel.scale.set(saved.scale, saved.scale)
    live2dModel.position.set(saved.x, saved.y)
    clampPosition()
    return
  }
  defaultFit()
}

function toModelPoint(globalX: number, globalY: number) {
  if (!live2dModel || !window.PIXI || typeof window.PIXI.Point !== 'function') return null
  if (typeof live2dModel.toModelPosition !== 'function') return null
  try {
    const g = new window.PIXI.Point(globalX, globalY)
    return live2dModel.toModelPosition(g, new window.PIXI.Point())
  } catch { return null }
}

function normalizeAxis(value: number, min: number, max: number) {
  const span = max - min
  if (!Number.isFinite(span) || Math.abs(span) <= 1e-4) return 0
  return clamp(((value - min) / span) * 2 - 1, -1, 1)
}

function applyFocusFromGlobal(globalX: number, globalY: number) {
  const internal = live2dModel?.internalModel
  const focus = internal?.focusController
  if (!focus || typeof focus.focus !== 'function' || !pixiApp) return

  // Stage-normalized target: works anywhere on the viewport with magnitude.
  const sw = pixiApp.screen.width || 1
  const sh = pixiApp.screen.height || 1
  let rawX = (globalX / sw) * 2 - 1
  let rawY = (globalY / sh) * 2 - 1

  // Blend with model-space when pointer maps cleanly onto the model,
  // so gaze tracks the face more precisely when hovering near it.
  const local = toModelPoint(globalX, globalY)
  if (local && internal.originalWidth && internal.originalHeight) {
    const mx = normalizeAxis(local.x, 0, internal.originalWidth)
    const my = normalizeAxis(local.y, 0, internal.originalHeight)
    const inside = mx >= -1 && mx <= 1 && my >= -1 && my <= 1
    if (inside) {
      rawX = rawX * 0.35 + mx * 0.65
      rawY = rawY * 0.35 + my * 0.65
    }
  }

  rawX = clamp(rawX, -1, 1)
  rawY = clamp(rawY, -1, 1)
  focus.focus(rawX, -rawY)
}

function refreshFocusFromLastPointer() {
  if (lastPointer.has) applyFocusFromGlobal(lastPointer.x, lastPointer.y)
}

function onStagePointerMove(e: PointerEvent) {
  if (!live2dModel || !pixiApp || !stageEl.value) return
  const rect = stageEl.value.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const gx = ((e.clientX - rect.left) / rect.width) * pixiApp.screen.width
  const gy = ((e.clientY - rect.top) / rect.height) * pixiApp.screen.height
  lastPointer = { x: gx, y: gy, has: true }

  if (dragging && e.pointerId === dragPointerId) {
    live2dModel.position.set(gx + dragOffset.x, gy + dragOffset.y)
    clampPosition()
    saveTransform()
  }
  applyFocusFromGlobal(gx, gy)
}

function onStagePointerDown(e: PointerEvent) {
  if (!live2dModel || !pixiApp || !stageEl.value) return
  if (e.button !== 0 && e.pointerType === 'mouse') return
  const rect = stageEl.value.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const gx = ((e.clientX - rect.left) / rect.width) * pixiApp.screen.width
  const gy = ((e.clientY - rect.top) / rect.height) * pixiApp.screen.height
  dragging = true
  dragPointerId = e.pointerId
  dragOffset = { x: live2dModel.x - gx, y: live2dModel.y - gy }
  try { stageEl.value.setPointerCapture(e.pointerId) } catch { /* ignore */ }
  if (stageEl.value) stageEl.value.style.cursor = 'grabbing'
}

function endDrag(e?: PointerEvent) {
  if (!dragging) return
  if (e && dragPointerId !== null && e.pointerId !== dragPointerId) return
  dragging = false
  if (stageEl.value) {
    try { if (dragPointerId !== null) stageEl.value.releasePointerCapture(dragPointerId) } catch { /* ignore */ }
    stageEl.value.style.cursor = 'grab'
  }
  dragPointerId = null
  saveTransform(true)
}

function onStageWheel(e: WheelEvent) {
  if (!live2dModel || loadState.value !== 'ok') return
  e.preventDefault()
  const step = e.deltaY < 0 ? 1.06 : 0.94
  const next = clamp(live2dModel.scale.x * step, 0.08, 3.2)
  live2dModel.scale.set(next, next)
  clampPosition()
  refreshFocusFromLastPointer()
  saveTransform()
}

function resetView() {
  if (!live2dModel || !pixiApp) return
  try { localStorage.removeItem(transformKey()) } catch { /* ignore */ }
  if (transformSaveTimer) {
    clearTimeout(transformSaveTimer)
    transformSaveTimer = 0
  }
  try { pixiApp.resize?.() } catch { /* ignore */ }
  if (pixiApp?.stage) pixiApp.stage.hitArea = pixiApp.screen
  defaultFit()
  refreshFocusFromLastPointer()
  // Do not re-save immediately — leave cleared so reload re-fits cleanly.
}

function bindStageInteraction() {
  unbindStageInteraction()
  const el = stageEl.value
  if (!el) return
  el.style.cursor = 'grab'
  el.addEventListener('pointermove', onStagePointerMove)
  el.addEventListener('pointerdown', onStagePointerDown)
  el.addEventListener('pointerup', endDrag)
  el.addEventListener('pointercancel', endDrag)
  el.addEventListener('pointerleave', endDrag)
  el.addEventListener('wheel', onStageWheel, { passive: false })
}

function unbindStageInteraction() {
  const el = stageEl.value
  if (!el) return
  el.removeEventListener('pointermove', onStagePointerMove)
  el.removeEventListener('pointerdown', onStagePointerDown)
  el.removeEventListener('pointerup', endDrag)
  el.removeEventListener('pointercancel', endDrag)
  el.removeEventListener('pointerleave', endDrag)
  el.removeEventListener('wheel', onStageWheel)
  dragging = false
  dragPointerId = null
}

function initPixi() {
  if (pixiApp || !canvasEl.value || !stageEl.value) return
  const PIXI = window.PIXI
  pixiApp = new PIXI.Application({
    view: canvasEl.value,
    resizeTo: stageEl.value,
    autoStart: true,
    antialias: true,
    backgroundAlpha: 0,
    powerPreference: 'high-performance',
  })
  if (pixiApp.stage) {
    pixiApp.stage.interactive = true
    pixiApp.stage.hitArea = pixiApp.screen
  }

  resizeObserver = new ResizeObserver(() => {
    try { pixiApp?.resize?.() } catch { /* ignore */ }
    if (pixiApp?.stage) pixiApp.stage.hitArea = pixiApp.screen
    if (live2dModel) {
      const saved = loadSavedTransform()
      if (saved && Number.isFinite(saved.scale) && saved.scale > 0) {
        live2dModel.position.set(saved.x, saved.y)
        live2dModel.scale.set(saved.scale, saved.scale)
        clampPosition()
      } else {
        defaultFit()
      }
    }
    refreshFocusFromLastPointer()
  })
  resizeObserver.observe(stageEl.value)

  bindStageInteraction()
}

async function loadModel() {
  try { await live2dRuntimeReady } catch (error: any) {loadState.value='error';errorMsg.value=`Live2D runtime: ${error.message}`;return}
  const token = ++loadToken
  disposeModel()

  if (!enabled.value) {
    loadState.value = 'disabled'
    modelMeta.value = ''
    return
  }
  if (!libsReady()) {
    loadState.value = 'no-libs'
    errorMsg.value = t('live2d.libsMissing')
    return
  }
  const url = modelUrl.value || builtInModels.value[0]?.url
  if (!url) {
    loadState.value = 'error'
    errorMsg.value = t('live2d.noModel')
    return
  }

  loadState.value = 'loading'
  errorMsg.value = ''
  modelMeta.value = url.split('/').pop() || url

  await nextTick()
  if (!pixiApp) initPixi()
  if (!pixiApp) {
    loadState.value = 'error'
    errorMsg.value = t('live2d.stageMissing')
    return
  }

  try {
    const model = await window.PIXI.live2d.Live2DModel.from(url, { autoInteract: false })
    if (token !== loadToken) {
      try { model.destroy?.() } catch { /* ignore */ }
      return
    }
    live2dModel = model
    bindStageInteraction()
    model.anchor?.set?.(0.5, 0.5)
    pixiApp.stage.addChild(model)
    fitModel()
    loadState.value = 'ok'
    refreshFocusFromLastPointer()

    // play idle motion if available
    try {
      const groups = model.internalModel?.motionManager?.definitions
      if (groups && groups.Idle?.length) {
        model.motion('Idle')
      }
    } catch { /* optional */ }
  } catch (e: any) {
    if (token !== loadToken) return
    console.error('Live2D load failed:', e)
    loadState.value = 'error'
    errorMsg.value = e?.message || t('live2d.loadError')
  }
}

// gentle idle mouth/blink already handled by cubism; keep stage alive via mood accent CSS
function scheduleReload() {
  if (!enabled.value) {
    disposeApp()
    loadState.value = 'disabled'
    return
  }
  loadModel()
}

onMounted(async () => {
  window.addEventListener('live2d-models-changed',loadModelList)
  try {
    const response=await fetch('/api/settings/live2d')
    if(response.ok) {const {values}=await response.json();if(values && typeof values.enabled==='boolean')wizard.live2d.enabled=values.enabled;if(values && typeof values.model_url==='string')wizard.live2d.modelUrl=values.model_url}
  } catch { /* retain local configuration when LIFE is unavailable */ }
  await loadModelList()
  if (enabled.value) loadModel()
  else loadState.value = 'disabled'
})

onUnmounted(() => {
  window.removeEventListener('live2d-models-changed',loadModelList)
  loadToken++
  cancelAnimationFrame(rafId)
  disposeApp()
})

watch(enabled, scheduleReload)
watch(modelUrl, () => {
  if (enabled.value) loadModel()
})

function selectModel(url: string) {
  wizard.live2d.modelUrl = url
  wizard.live2d.enabled = true
  wizard.saveToStorage()
}
</script>

<template>
  <div class="live2d-stage" :class="{ on: enabled }">
    <div class="stage-chrome">
      <span class="stage-title">Live2D</span>
      <div class="stage-actions">
        <button
          v-for="m in builtInModels"
          :key="m.id"
          class="chip"
          :class="{ active: modelUrl.endsWith(m.url) || modelUrl === m.url }"
          type="button"
          @click="selectModel(m.url)"
        >{{ m.label }}</button>
        <span class="chip" :class="{ active: enabled }">
          {{ enabled ? t('live2d.on') : t('live2d.off') }}
        </span>
        <button
          v-if="enabled && loadState === 'ok'"
          class="chip"
          type="button"
          :title="t('live2d.resetView')"
          @click="resetView"
        >{{ t('live2d.resetView') }}</button>
      </div>
    </div>

    <div ref="stageEl" class="stage-viewport" :style="{ '--mood': accent }" :title="enabled && loadState === 'ok' ? t('live2d.interactHint') : ''">
      <canvas ref="canvasEl" class="stage-canvas"></canvas>

      <div v-if="!enabled" class="stage-placeholder">
        <p>{{ t('live2d.disabledHint') }}</p>
        <button v-if="builtInModels[0]" class="btn btn-tonal" type="button" @click="selectModel(builtInModels[0].url)">
          {{ t('live2d.configure') }}
        </button>
      </div>

      <div v-else-if="loadState === 'loading'" class="stage-status">
        {{ t('live2d.loading') }}
      </div>

      <div v-else-if="loadState === 'error' || loadState === 'no-libs'" class="stage-status warn">
        {{ errorMsg || t('live2d.loadError') }}
      </div>

      <div class="stage-gradient"></div>
      <div class="stage-hint">{{ mood }}</div>
    </div>

    <div class="stage-meta">
      <span class="meta-label">{{ t('live2d.model') }}</span>
      <span class="meta-value">{{ modelMeta || '—' }}</span>
    </div>
  </div>
</template>

<style scoped>
.live2d-stage {
  display: flex;
  flex-direction: column;
  background: var(--md-surface-container);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--md-outline-variant);
  min-height: 320px;
}

.stage-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  flex-wrap: wrap;
  padding: var(--space-md) var(--space-lg);
  background: var(--md-surface-container-high);
}

.stage-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--md-on-surface);
}

.stage-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.stage-actions .chip {
  height: 28px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.stage-viewport {
  position: relative;
  flex: 1;
  min-height: 260px;
  overflow: hidden;
  touch-action: none;
  cursor: grab;
  user-select: none;
  background:
    radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--mood, #6750A4) 22%, transparent), transparent 55%),
    radial-gradient(circle at 70% 80%, color-mix(in srgb, var(--mood, #6750A4) 12%, transparent), transparent 50%),
    linear-gradient(180deg, #f3edf7 0%, #e7e0ec 55%, #d0bcff33 100%);
}

.stage-viewport:active {
  cursor: grabbing;
}

.stage-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
  pointer-events: none;
}

.stage-gradient {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 55%, rgba(33, 0, 93, 0.18) 100%);
}

.stage-hint {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 3;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--md-inverse-surface) 75%, transparent);
  color: var(--md-inverse-on-surface);
  font-size: 12px;
  text-transform: capitalize;
  pointer-events: none;
}

.stage-placeholder {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  background: color-mix(in srgb, var(--md-surface) 72%, transparent);
  color: var(--md-on-surface-variant);
  font-size: 14px;
  text-align: center;
  padding: var(--space-lg);
}

.stage-status {
  position: absolute;
  left: var(--space-md);
  bottom: var(--space-md);
  z-index: 5;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--md-inverse-surface);
  color: var(--md-inverse-on-surface);
  font-size: 12px;
}

.stage-status.warn {
  background: var(--md-error-container);
  color: #410E0B;
  max-width: 90%;
  word-break: break-word;
}

.stage-meta {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  font-size: 12px;
  background: var(--md-surface-container-low);
  border-top: 1px solid var(--md-outline-variant);
}

.meta-label { color: var(--md-on-surface-variant); }
.meta-value {
  color: var(--md-on-surface);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60%;
}
</style>
