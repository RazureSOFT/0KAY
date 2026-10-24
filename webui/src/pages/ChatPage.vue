<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChatPanel from '../components/ChatPanel.vue'
import StatusPanel from '../components/StatusPanel.vue'
import Live2DStage from '../components/Live2DStage.vue'
import { useUIPatchesStore } from '../stores/uiPatches'
import { useChatStore } from '../stores/chat'

const { t } = useI18n()
const ui = useUIPatchesStore()
const chat = useChatStore()
const isMobile = ref(false)

const stageSlots = computed(() => ui.chatRegion('stage'))
const chatSlots = computed(() => ui.chatRegion('chat'))
const hasChat = computed(() => chatSlots.value.some((s) => s.component === 'chat'))

const RATIO_KEY = '0kay.web.chat_panel_width_ratio'
const MIN_CHAT = 320
const MIN_STAGE = 360
const MAX_CHAT = 960
const chatRatio = ref(0.34)
const pageEl = ref<HTMLElement | null>(null)
let dragging = false

function loadRatio() {
  try {
    const v = Number(localStorage.getItem(RATIO_KEY))
    if (v > 0 && v < 1) chatRatio.value = v
  } catch { }
}

function saveRatio(v: number) {
  chatRatio.value = v
  try { localStorage.setItem(RATIO_KEY, String(v)) } catch { }
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

function onResizerKeydown(e: KeyboardEvent) {
  if (isMobile.value) return
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  const el = pageEl.value
  if (!el) return
  e.preventDefault()
  const rect = el.getBoundingClientRect()
  const chatPx = chatRatio.value * rect.width
  const next = e.key === 'ArrowLeft' ? chatPx + 24 : chatPx - 24
  saveRatio(clampRatio(rect.width, next))
}

function checkMobile() {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 960
  if (!isMobile.value) {
    chatOpen.value = true
  } else if (!wasMobile) {
    chatOpen.value = false
  }
}

onMounted(() => {
  loadRatio()
  checkMobile()
  chat.setChatVisible(true)
  window.addEventListener('resize', checkMobile)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
})

onUnmounted(() => {
  chat.setChatVisible(false)
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

// On mobile the chat column lives off-screen; this toggles the chat drawer
// (the status panel is always visible in the stage column), so the control is
// named and iconed as chat, not status.
const chatOpen = ref(false)
function toggleChat() {
  chatOpen.value = !chatOpen.value
}
</script>

<template>
  <div
    ref="pageEl"
    class="chat-page"
    :class="{ 'no-chat': !hasChat }"
    :style="isMobile ? undefined : { '--chat-w': `min(${MAX_CHAT}px, max(${MIN_CHAT}px, ${chatRatio * 100}%))` }"
  >
        <div v-if="stageSlots.length" class="stage-column">
      <template v-for="slot in stageSlots" :key="slot.id">
        <Live2DStage v-if="slot.component === 'live2d'" class="stage-host" />
        <StatusPanel v-else-if="slot.component === 'status'" class="status-panel" />
        <iframe
          v-else-if="slot.component === 'iframe' && slot.src"
          class="slot-frame"
          :src="slot.src"
          :title="slot.title || slot.id"
          sandbox="allow-scripts allow-forms allow-popups"
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
      role="separator"
      aria-orientation="vertical"
      tabindex="0"
      :aria-label="t('chat.resizePanel')"
      :title="t('chat.resizePanel')"
      @pointerdown="onPointerDown"
      @keydown="onResizerKeydown"
    ></div>

    <div
      v-if="hasChat"
      class="chat-column"
      :class="{ open: chatOpen || !isMobile }"
    >
      <template v-for="slot in chatSlots" :key="slot.id">
        <ChatPanel v-if="slot.component === 'chat'" />
        <iframe
          v-else-if="slot.component === 'iframe' && slot.src"
          class="slot-frame fill"
          :src="slot.src"
          :title="slot.title || slot.id"
          sandbox="allow-scripts allow-forms allow-popups"
        />
        <div v-else class="slot-note" :data-chat-slot="slot.id">
          {{ slot.titleKey ? t(slot.titleKey) : slot.title || slot.id }}
        </div>
      </template>
    </div>

    <button
      v-if="isMobile && hasChat"
      class="status-fab"
      :title="t('chat.openChat')"
      :aria-label="t('chat.openChat')"
      @click="toggleChat"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M8.5 11h7M8.5 14h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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
  position: relative;
}

/* The slot children used to be direct flex children of .chat-column; the wrapper
   has to disappear from layout so nothing shifts. */
.chat-slots {
  display: contents;
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
    
    visibility: hidden;
    transition: transform var(--transition-normal), visibility 0s linear var(--duration-medium);
  }
  .chat-column.open {
    transform: translateX(0);
    visibility: visible;
    transition: transform var(--transition-normal), visibility 0s linear 0s;
  }
}
</style>
