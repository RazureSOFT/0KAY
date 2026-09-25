<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useConfirm } from './confirm'

const { confirmState, settle } = useConfirm()
const dialog = ref<HTMLElement | null>(null)
const cancelBtn = ref<HTMLButtonElement | null>(null)
let previousFocus: HTMLElement | null = null

const en = () => (document.documentElement.lang || '').startsWith('en')
const title = () => confirmState.value?.options.title || (en() ? 'Confirm' : '请确认')
const confirmLabel = () => confirmState.value?.options.confirmLabel || (en() ? 'Confirm' : '确认')
const cancelLabel = () => confirmState.value?.options.cancelLabel || (en() ? 'Cancel' : '取消')

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
        tabindex="-1"
      >
        <h2>{{ title() }}</h2>
        <p>{{ confirmState.options.message }}</p>
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
  z-index: 13000;
  background: #21173566;
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 20px;
}
.confirm-dialog {
  width: min(440px, 100%);
  background: var(--md-surface-container-high, var(--md-surface, #fff));
  color: var(--md-on-surface);
  border: 1px solid var(--md-outline-variant, transparent);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 24px 70px #18132d33;
  outline: none;
}
.confirm-dialog h2 { margin: 0 0 10px; font-size: 22px; font-weight: 650; }
.confirm-dialog p { margin: 0; font-size: 14px; line-height: 1.65; color: var(--md-on-surface-variant); overflow-wrap: anywhere; }
.confirm-dialog footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.confirm-dialog footer button {
  border: 0;
  border-radius: 999px;
  padding: 12px 22px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  background: var(--md-secondary-container, #e7e0ec);
  color: var(--md-on-secondary-container, #1d1b20);
}
.confirm-dialog footer .confirm-primary { background: var(--md-primary, #6750a4); color: var(--md-on-primary, #fff); }
.confirm-dialog footer .confirm-primary.danger { background: var(--md-error, #b3261e); color: var(--md-on-error, #fff); }
.confirm-dialog footer button:focus-visible { outline: 3px solid var(--md-primary); outline-offset: 3px; }
</style>
