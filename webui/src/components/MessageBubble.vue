<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Message } from '../stores/chat'

const props = defineProps<{
  message: Message
}>()

const { locale } = useI18n()

const isUser = computed(() => props.message.role === 'user')
const thinkOpen = ref(false)
const think = computed(() => {
  if (!props.message.thinkSummary) return null
  try {
    const parsed = JSON.parse(props.message.thinkSummary)
    if (typeof parsed.raw === 'string' && parsed.raw.trim()) return { raw: parsed.raw }
    if (typeof parsed.summary === 'string' && parsed.summary.trim()) return parsed
    // Normalize summaries persisted by the previous non-linear THINK UI.
    const intent = parsed.intent || '他好像是在和我打招呼'
    const strategy = parsed.strategy || '温柔地接住这句话'
    return { summary: `嗯，我听懂啦：${intent}。我现在心里暖暖的，想用轻松一点的方式回应他；先${strategy}，再陪他继续聊下去。` }
  } catch { return { summary: props.message.thinkSummary } }
})
const dateTimeStr = computed(() => {
  const ts = props.message.timestamp
  const sameYear = ts.getFullYear() === new Date().getFullYear()
  return new Intl.DateTimeFormat(locale.value, {
    ...(sameYear ? {} : { year: 'numeric' }),
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(ts)
})
</script>

<template>
  <div class="message" :class="{ 'user': isUser, 'assistant': !isUser }">
    <div class="avatar" :class="{ 'user-avatar': isUser, 'assistant-avatar': !isUser }">
      <template v-if="isUser">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/>
          <path d="M3 14C3 11.5 5.5 10 8 10C10.5 10 13 11.5 13 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </template>
      <template v-else>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="6" cy="7" r="1" fill="currentColor"/>
          <circle cx="10" cy="7" r="1" fill="currentColor"/>
          <path d="M6 10C6.5 10.5 7.2 11 8 11C8.8 11 9.5 10.5 10 10" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
        </svg>
      </template>
    </div>

    <div class="content-wrapper">
      <div v-if="message.images?.length" class="images">
        <img v-for="(src, i) in message.images" :key="i" :src="src" alt="" class="msg-img" />
      </div>
      <div v-if="message.content" class="content">{{ message.content }}</div>
      <div v-if="!isUser && think" class="think-panel">
        <button class="think-toggle" type="button" @click="thinkOpen = !thinkOpen">
          <span>THINK</span><span>{{ thinkOpen ? '收起' : '展开' }}</span>
        </button>
        <div v-if="thinkOpen" class="think-body">
          <pre v-if="think.raw" class="think-raw">{{ think.raw }}</pre>
          <p v-else-if="think.summary" class="think-summary">{{ think.summary }}</p>
        </div>
      </div>
      <div class="meta">
        <span class="time">{{ dateTimeStr }}</span>
        <template v-if="!isUser && message.emotion">
          <span class="separator">·</span>
          <span class="emotion" :style="{ color: getEmotionColor(message.emotion) }">
            {{ getEmotionLabel(message.emotion) }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function getEmotionColor(emotion: any): string {
  if (emotion.irritation > 0.7) return '#d13438'
  if (emotion.valence > 0.5) return '#107c10'
  if (emotion.valence < -0.3) return '#0078d4'
  return '#8a8886'
}

function getEmotionLabel(emotion: any): string {
  if (emotion.irritation > 0.7) return 'Irritated'
  if (emotion.valence > 0.5) return 'Happy'
  if (emotion.valence < -0.3) return 'Down'
  return 'Neutral'
}
</script>

<style scoped>
.message {
  display: flex;
  gap: var(--space-md);
  animation: slideUp 0.2s ease;
}

.message.user {
  flex-direction: row-reverse;
}

.avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  background: var(--neutral-gray-60);
  color: var(--neutral-white);
}

.assistant-avatar {
  background: var(--brand-primary);
  color: var(--neutral-white);
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
}

.msg-img {
  max-width: 240px;
  max-height: 240px;
  border-radius: var(--radius-md);
  object-fit: cover;
  display: block;
}

.content-wrapper {
  max-width: 70%;
}

.content {
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.user .content {
  background: var(--brand-primary);
  color: var(--neutral-white);
  border-bottom-right-radius: var(--radius-sm);
}

.assistant .content {
  background: var(--neutral-white);
  color: var(--neutral-gray-70);
  border-bottom-left-radius: var(--radius-sm);
  box-shadow: var(--shadow-2);
}
.think-panel{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p{margin:4px 0}.think-body b{color:var(--md-on-surface)}
.think-summary{margin:6px 0;color:var(--md-on-surface);line-height:1.55}
.think-raw{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}

.meta {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--neutral-gray-20);
}

.user .meta {
  justify-content: flex-end;
}

.separator {
  color: var(--neutral-gray-10);
}

.emotion {
  font-weight: 500;
}
</style>
