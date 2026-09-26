<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChatStore } from '../stores/chat'
import { useWizardStore } from '../stores/wizard'
import MessageBubble from './MessageBubble.vue'

const { t, locale } = useI18n()
const chatStore = useChatStore()
const wizard = useWizardStore()

const inputText = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const pendingImages = ref<string[]>([])
const imageInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

function sendMessage() {
  const text = inputText.value.trim()
  if (!text && pendingImages.value.length === 0) return

  const images = [...pendingImages.value]
  pendingImages.value = []
  chatStore.sendMessage(text, images)
  inputText.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function openImagePicker() {
  imageInput.value?.click()
}

async function onImagePicked(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  if (!files.length) return
  uploading.value = true
  try {
    for (const f of files) {
      const url = await chatStore.uploadImage(f)
      pendingImages.value.push(url)
    }
  } catch (err) {
    console.error('image upload failed:', err)
  } finally {
    uploading.value = false
  }
}

function removePendingImage(url: string) {
  pendingImages.value = pendingImages.value.filter((u) => u !== url)
}

function downloadHistory() {
  const messages = chatStore.messages
  if (!messages.length) return
  const personaName = wizard.persona.name || t('chat.defaultCharacter')
  const fmt = new Intl.DateTimeFormat(locale.value, {
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit',
  })
  const lines: string[] = []
  lines.push(`# ${t('chat.exportTitle')}`, '')
  lines.push(`- ${t('chat.defaultCharacter')}: ${personaName}`)
  lines.push(`- ${fmt.format(new Date())}`, '')
  for (const m of messages) {
    if (!m.content && !m.images?.length) continue
    const who = m.role === 'user' ? t('chat.you') : personaName
    lines.push(`## ${who} · ${fmt.format(m.timestamp)}`)
    if (m.content) lines.push('', m.content)
    if (m.images?.length) { lines.push(''); for (const u of m.images) lines.push(`![image](${u})`) }
    lines.push('')
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const a = document.createElement('a')
  a.href = url
  a.download = `0kay-chat-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.md`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  chatStore.restoreHistory()
  if (!chatStore.isConnected) chatStore.connect()
})

watch(
  () => chatStore.messages.length,
  async () => {
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
)
</script>

<template>
  <div class="chat-panel">
    <div class="chat-container" ref="chatContainer">
      <div class="messages">
        <div v-if="chatStore.messages.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>
              <circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3>{{ t('chat.empty') }}</h3>
          <p>{{ t('chat.emptyHint', { name: wizard.persona.name || t('chat.defaultCharacter') }) }}</p>
        </div>

        <MessageBubble
          v-for="message in chatStore.messages"
          :key="message.id"
          :message="message"
        />

        <div v-if="chatStore.isTyping" class="typing-indicator">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="typing-text">
            {{ wizard.persona.name || 'AI' }} {{ t('chat.thinking') }}
          </span>
        </div>
      </div>
    </div>

    <div class="input-area">
      <div v-if="pendingImages.length" class="pending-images">
        <div v-for="url in pendingImages" :key="url" class="pending-thumb">
          <img :src="url" alt="" />
          <button class="remove-img" type="button" :title="t('chat.removeImage')" @click="removePendingImage(url)">
            ×
          </button>
        </div>
      </div>
      <div class="input-wrapper">
        <input
          ref="imageInput"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          multiple
          hidden
          @change="onImagePicked"
        />
        <button
          class="attach-btn"
          type="button"
          :title="t('chat.attachImage')"
          :disabled="uploading || !chatStore.isConnected"
          @click="openImagePicker"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
            <path d="M4 17l5-5 4 4 3-3 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <textarea
          v-model="inputText"
          class="message-input"
          :placeholder="t('chat.inputPlaceholder')"
          rows="1"
          @keydown="handleKeydown"
          :disabled="!chatStore.isConnected"
        ></textarea>
        <button
          class="send-button"
          @click="sendMessage"
          :disabled="(!inputText.trim() && !pendingImages.length) || !chatStore.isConnected"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="input-footer">
        <span v-if="!chatStore.isConnected" class="connection-status disconnected">
          <span class="status-dot"></span>
          {{ t('chat.disconnected') }}
        </span>
        <span v-else class="connection-status connected">
          <span class="status-dot"></span>
          {{ t('chat.connected') }}
        </span>
        <span class="hint">上下文约 {{ chatStore.contextTokens.toLocaleString() }} tokens</span>
        <button class="context-btn" type="button" :disabled="chatStore.messages.length === 0" @click="downloadHistory">
          {{ t('chat.download') }}
        </button>
        <button class="context-btn" type="button" :disabled="chatStore.compacting" @click="chatStore.compactContext">
          {{ chatStore.compacting ? '整理中…' : '整理上下文' }}
        </button>
        <button class="context-btn danger" type="button" @click="chatStore.clearMessages">清除对话</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--neutral-gray-2);
}
.context-btn{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);padding:4px 9px;font-size:12px;cursor:pointer}.context-btn:disabled{opacity:.6;cursor:wait}.context-btn.danger{color:var(--md-error)}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-xl);
}

.messages {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--neutral-gray-30);
}

.empty-icon {
  margin-bottom: var(--space-xl);
  opacity: 0.5;
}

.empty-state h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--neutral-gray-50);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  font-size: var(--font-size-base);
  color: var(--neutral-gray-30);
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  color: var(--neutral-gray-30);
  font-size: var(--font-size-sm);
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: var(--neutral-gray-20);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.input-area {
  padding: var(--space-lg) var(--space-xl);
  background: var(--neutral-white);
  border-top: 1px solid var(--neutral-gray-6);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: var(--space-sm);
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-sm);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
}

.input-wrapper:focus-within {
  background: var(--neutral-white);
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px var(--brand-light);
}

.message-input {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-base);
  font-family: inherit;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  min-height: 24px;
  max-height: 120px;
}

.message-input::placeholder {
  color: var(--neutral-gray-20);
}

.pending-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 800px;
  margin: 0 auto var(--space-sm);
}

.pending-thumb {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--neutral-gray-6);
}

.pending-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attach-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-round);
  background: transparent;
  color: var(--neutral-gray-30);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.attach-btn:hover:not(:disabled) {
  background: var(--neutral-gray-6);
  color: var(--neutral-gray-50);
}

.attach-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-round);
  background: var(--brand-primary);
  color: var(--neutral-white);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.send-button:hover:not(:disabled) {
  background: var(--brand-hover);
}

.send-button:disabled {
  background: var(--neutral-gray-8);
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: var(--space-sm);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 var(--space-sm);
}

.connection-status {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.connected .status-dot {
  background: var(--success);
}

.disconnected .status-dot {
  background: var(--error);
}

.hint {
  font-size: var(--font-size-xs);
  color: var(--neutral-gray-20);
}
</style>
