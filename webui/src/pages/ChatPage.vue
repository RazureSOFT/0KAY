<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChatPanel from '../components/ChatPanel.vue'
import StatusPanel from '../components/StatusPanel.vue'
import Live2DStage from '../components/Live2DStage.vue'
import { useUIPatchesStore } from '../stores/uiPatches'

const { t } = useI18n()
const ui = useUIPatchesStore()
const showStatus = ref(false)
const isMobile = ref(false)

/**
 * ChatPage regions come from BUILTIN_CHAT + target:"chat" patches.
 * life.patch declares stage (live2d+status) and chat slots here.
 */
const stageSlots = computed(() => ui.chatRegion('stage'))
const chatSlots = computed(() => ui.chatRegion('chat'))
const hasStatus = computed(() => stageSlots.value.some((s) => s.component === 'status'))
const hasChat = computed(() => chatSlots.value.some((s) => s.component === 'chat'))

// EchoBot-style split: large stage left, chat right, draggable resizer
const RATIO_KEY = '0kay.web.chat_panel_width_ratio'
const MIN_CHAT = 320
const MIN_STAGE = 360
const MAX_CHAT = 960
const chatRatio = ref(0.34)
const resizer = ref<HTMLElement | null>(null)
const pageEl = ref<HTMLElement | null>(null)
let dragging = false

function loadRatio() {
  try {
    const v = Number(localStorage.getItem(RATIO_KEY))
    if (v > 0 && v < 1) chatRatio.value = v
  } catch { /* ignore */ }
}

function saveRatio(v: number) {
  chatRatio.value = v
  try { localStorage.setItem(RATIO_KEY, String(v)) } catch { /* ignore */ }
}

function clampRatio(total: number, chatPx: number) {
  const minChat = Math.min(MIN_CHAT, total * 0.3)
  const maxChat = Math.min(MAX_CHAT, total - MIN_STAGE)
  const clamped = Math.min(Math.max(chatPx, minChat), maxChat)
  return clamped / total
}

function onPointerDown(e: PointerEvent) {
  if (isMobile.value) return
  dragging = true
  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function onPointerMove(e: PointerEvent) {
  if (!dragging || !pageEl.value) return
  const rect = pageEl.value.getBoundingClientRect()
  const chatPx = rect.right - e.clientX
  saveRatio(clampRatio(rect.width, chatPx))
}

function onPointerUp() {
  if (!dragging) return
  dragging = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

function checkMobile() {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 960
  if (!isMobile.value) {
    showStatus.value = true
  } else if (!wasMobile) {
    // Entering mobile: keep chat closed so the stage stays visible.
    showStatus.value = false
  }
}

onMounted(() => {
  loadRatio()
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

function toggleStatus() {
  showStatus.value = !showStatus.value
}
</script>

<template>
  <div
    ref="pageEl"
    class="chat-page"
    :class="{ 'no-chat': !hasChat }"
    :style="isMobile ? undefined : { '--chat-w': `min(${MAX_CHAT}px, max(${MIN_CHAT}px, ${chatRatio * 100}%))` }"
  >
    <!-- @ui-ext:chat-stage — slots from BUILTIN_CHAT + /api/ui/patches -->
    <div v-if="stageSlots.length" class="stage-column">
      <template v-for="slot in stageSlots" :key="slot.id">
        <Live2DStage v-if="slot.component === 'live2d'" class="stage-host" />
        <StatusPanel v-else-if="slot.component === 'status'" class="status-panel" />
        <iframe
          v-else-if="slot.component === 'iframe' && slot.src"
          class="slot-frame"
          :src="slot.src"
          :title="slot.title || slot.id"
        />
        <div v-else class="slot-note" :data-chat-slot="slot.id">
          {{ slot.titleKey ? t(slot.titleKey) : slot.title || slot.id }}
        </div>
      </template>
    </div>

    <div
      v-if="!isMobile && hasChat && stageSlots.length"
      ref="resizer"
      class="page-resizer"
      title="Drag to resize"
      @pointerdown="onPointerDown"
    ></div>

    <!-- @ui-ext:chat-panel — conversation column from patches -->
    <div
      v-if="hasChat"
      class="chat-column"
      :class="{ open: showStatus && isMobile }"
      v-show="showStatus || !isMobile"
    >
      <template v-for="slot in chatSlots" :key="slot.id">
        <ChatPanel v-if="slot.component === 'chat'" />
        <iframe
          v-else-if="slot.component === 'iframe' && slot.src"
          class="slot-frame fill"
          :src="slot.src"
          :title="slot.title || slot.id"
        />
        <div v-else class="slot-note" :data-chat-slot="slot.id">
          {{ slot.titleKey ? t(slot.titleKey) : slot.title || slot.id }}
        </div>
      </template>
    </div>

    <button
      v-if="isMobile && hasStatus"
      class="status-fab"
      :title="t('app.status')"
      @click="toggleStatus"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.chat-page {
  position: relative;
  display: grid;
  grid-template-columns: minmax(360px, 1fr) 6px minmax(320px, var(--chat-w, 34%));
  flex: 1;
  height: 100%;
  min-height: 0;
  background: var(--md-surface);
}

.chat-page.no-chat {
  grid-template-columns: 1fr;
}

.stage-column {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md);
  overflow: hidden;
}

.stage-host {
  flex: 1;
  min-height: 240px;
}

.status-panel {
  flex: 0 0 auto;
  max-height: 40%;
  background: transparent;
  border-radius: var(--radius-lg);
  border: 1px solid var(--md-outline-variant);
  overflow: hidden;
}

.slot-frame {
  flex: 1;
  min-height: 200px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--neutral-white);
}

.slot-frame.fill {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
}

.slot-note {
  padding: var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-40);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-md);
}

.page-resizer {
  cursor: col-resize;
  background: var(--md-outline-variant);
  transition: background var(--transition-fast);
}
.page-resizer:hover,
.page-resizer:active {
  background: var(--md-primary);
}

.chat-column {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-low);
}

.status-fab {
  position: absolute;
  right: var(--space-lg);
  bottom: var(--space-lg);
  width: 56px;
  height: 56px;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-3);
  z-index: 6;
}

@media (max-width: 960px) {
  .chat-page {
    display: flex;
    flex-direction: column;
  }
  .stage-column {
    flex: 1;
    min-height: 0;
  }
  .page-resizer { display: none; }
  .chat-column {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: min(360px, 92vw);
    z-index: 5;
    box-shadow: var(--shadow-8);
    transform: translateX(100%);
    transition: transform var(--transition-normal);
  }
  .chat-column.open {
    transform: translateX(0);
  }
}
</style>
