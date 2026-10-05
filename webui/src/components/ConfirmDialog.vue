<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfirm } from '../composables/confirm'
import MarkdownContent from './MarkdownContent.vue'

const { t, locale } = useI18n()
const { confirmState, settle } = useConfirm()
const dialog = ref<HTMLElement | null>(null)
const cancelBtn = ref<HTMLButtonElement | null>(null)
let previousFocus: HTMLElement | null = null

const title = () => {
  const state = confirmState.value
  if (state?.options.title) return state.options.title
  return locale.value === 'en' ? 'Confirm' : '请确认'
}
const confirmLabel = () => confirmState.value?.options.confirmLabel
  || (locale.value === 'en' ? 'Confirm' : '确认')
const cancelLabel = () => confirmState.value?.options.cancelLabel
  || t('settings.cancel')

watch(() => !!confirmState.value, async (open) => {
  if (open) {
    previousFocus = document.activeElement as HTMLElement
    await nextTick()
    dialog.value?.focus()
    cancelBtn.value?.focus()
  } else {
    dialog.value = null
    previousFocus?.focus?.()
  }
})

function onKeydown(event: KeyboardEvent) {
  if (!confirmState.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    settle(false)
    return
  }
  if (event.key !== 'Tab' || !dialog.value) return
  const focusable = [...dialog.value.querySelectorAll<HTMLElement>('button:not(:disabled)')]
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="confirmState"
      class="confirm-scrim"
      role="presentation"
      @click.self="settle(false)"
      @keydown="onKeydown"
    >
      <section
        ref="dialog"
        class="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        tabindex="-1"
      >
        <header class="confirm-head">
          <img
            v-if="confirmState.options.icon"
            class="confirm-icon"
            :src="confirmState.options.icon"
            alt=""
            loading="lazy"
          />
          <div class="confirm-headtext">
            <h2 id="confirm-dialog-title">{{ title() }}</h2>
            <p v-if="confirmState.options.description" class="confirm-desc">{{ confirmState.options.description }}</p>
          </div>
        </header>
        <p id="confirm-dialog-message">{{ confirmState.options.message }}</p>
        <ul v-if="confirmState.options.details?.length" class="confirm-details">
          <li v-for="(item, i) in confirmState.options.details" :key="i">{{ item }}</li>
        </ul>
        <div v-if="confirmState.options.readme" class="confirm-readme">
          <MarkdownContent :content="confirmState.options.readme" />
        </div>
        <footer>
          <button ref="cancelBtn" type="button" @click="settle(false)">{{ cancelLabel() }}</button>
          <button
            type="button"
            class="confirm-primary"
            :class="{ danger: confirmState.options.danger !== false }"
            @click="settle(true)"
          >{{ confirmLabel() }}</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style>
.confirm-scrim {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal, 4000);
  background: #21173566;
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 20px;
  animation: fadeIn 180ms ease-out;
}
.confirm-dialog {
  width: min(680px, 100%);
  max-height: min(88vh, 900px);
  display: flex;
  flex-direction: column;
  background: var(--md-surface-container-high, var(--md-surface, #fff));
  color: var(--md-on-surface);
  border: 1px solid var(--md-outline-variant, transparent);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 24px 70px #18132d33;
  animation: dialog-arrive 320ms var(--ease-emphasized, ease-out) both;
  outline: none;
}
.confirm-head {
  display: flex;
  align-items: center;
  gap: 14px;
}
.confirm-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 14px;
  object-fit: cover;
  background: var(--md-surface-container, #f3edf7);
}
.confirm-headtext {
  min-width: 0;
}
.confirm-dialog h2 {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 650;
}
.confirm-headtext h2 {
  margin-bottom: 2px;
}
.confirm-desc {
  margin: 0;
  font-size: 13px;
  color: var(--md-on-surface-variant);
  overflow-wrap: anywhere;
}
.confirm-readme {
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--md-surface-container-low, var(--md-surface-container, #f3edf7));
  overflow-y: auto;
  min-height: 0;
  flex: 1 1 auto;
}
.confirm-dialog p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--md-on-surface-variant);
  overflow-wrap: anywhere;
}
.confirm-details {
  margin: 14px 0 0;
  padding: 12px 14px 12px 30px;
  list-style: disc;
  border-radius: 16px;
  background: var(--md-surface-container, var(--md-surface-container-high, #f3edf7));
  color: var(--md-on-surface);
  font-size: 13px;
  line-height: 1.7;
  overflow-wrap: anywhere;
  max-height: 40vh;
  overflow-y: auto;
}
.confirm-details li + li {
  margin-top: 4px;
}
.confirm-dialog footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}.confirm-dialog footer button {
  border: 0;
  border-radius: 999px;
  padding: 12px 22px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  background: var(--md-secondary-container, #e7e0ec);
  color: var(--md-on-secondary-container, #1d1b20);
  transition: transform 160ms var(--ease-spring, ease), background-color 160ms;
}
.confirm-dialog footer button:active {
  transform: scale(0.96);
}
.confirm-dialog footer .confirm-primary {
  background: var(--md-primary, #6750a4);
  color: var(--md-on-primary, #fff);
}
.confirm-dialog footer .confirm-primary.danger {
  background: var(--md-error, #b3261e);
  color: var(--md-on-error, #fff);
}
.confirm-dialog footer button:focus-visible {
  outline: 3px solid var(--md-primary);
  outline-offset: 3px;
}
/* Defined locally (not just in the global theme.css) so the enter animation
   cannot be lost if the component is used without the global sheet. */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes dialog-arrive {
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .confirm-scrim,
  .confirm-dialog,
  .confirm-dialog footer button {
    animation: none;
    transition: none;
  }
}
</style>
