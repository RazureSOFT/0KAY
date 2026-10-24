<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    onDismiss?: () => void
    dismissOnScrim?: boolean
    initialFocus?: 'first' | 'close' | 'none'
    labelledBy?: string
    describedBy?: string
    panelClass?: string
    maxHeight?: string
    role?: 'dialog' | 'alertdialog'
  }>(),
  { dismissOnScrim: true, initialFocus: 'first' },
)

const panel = ref<HTMLElement | null>(null)
const primary = ref<HTMLElement | null>(null)
const cancel = ref<HTMLElement | null>(null)
let restoreFocusTo: HTMLElement | null = null

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

function focusables(): HTMLElement[] {
  if (!panel.value) return []
  return [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
}

function focusInitial() {
  if (props.initialFocus === 'none') return
  const target = props.initialFocus === 'close' ? cancel.value : primary.value || focusables()[0]
  target?.focus()
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      restoreFocusTo = document.activeElement as HTMLElement | null
      await nextTick()
      focusInitial()
    } else {
      panel.value = null
      restoreFocusTo?.focus?.()
      restoreFocusTo = null
    }
  },
)

onBeforeUnmount(() => {
  restoreFocusTo?.focus?.()
})

function onKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape' && props.onDismiss) {
    event.preventDefault()
    event.stopPropagation()
    props.onDismiss()
    return
  }
  if (event.key !== 'Tab' || !panel.value) return
  const items = focusables()
  if (!items.length) {
    event.preventDefault()
    panel.value.focus()
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  if (event.shiftKey && (active === first || active === panel.value)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

defineExpose({ focusInitial })
</script>

<template>
  <Teleport to="body">
        <Transition name="modal">
    <div
      v-if="open"
      class="modal-scrim"
      role="presentation"
      @click.self="dismissOnScrim && onDismiss?.()"
      @keydown="onKeydown"
    >
      <section
        ref="panel"
        class="modal-panel"
        :class="panelClass"
        :style="maxHeight ? { maxHeight } : undefined"
        :role="role || 'dialog'"
        aria-modal="true"
        :aria-label="labelledBy ? undefined : title"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
        tabindex="-1"
      >
        <slot />
      </section>
    </div>
    </Transition>
  </Teleport>
</template>

<style>

.modal-scrim {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal, 4000);
  display: grid;
  place-items: center;
  padding: 20px;
  background: var(--md-scrim, rgb(18 15 26 / 45%));
  backdrop-filter: blur(6px);
  animation: modal-scrim-in var(--duration-medium, 200ms) var(--ease-out, ease-out);
}

.modal-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(460px, 100%);
  max-height: min(84vh, 720px);
  overflow: auto;
  padding: 24px;
  border-radius: 28px;
  background: var(--md-surface);
  color: var(--md-on-surface);
  box-shadow: 0 24px 70px rgb(0 0 0 / 25%);
  animation: modal-panel-in var(--duration-medium, 200ms) var(--ease-emphasized, cubic-bezier(0.2, 0, 0, 1));
}

.modal-panel:focus {
  outline: none;
}

@keyframes modal-scrim-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-panel-in {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: none; }
}

.modal-leave-active {
  transition: opacity var(--duration-short, 140ms) var(--ease-emphasized-accel, ease-in);
}
.modal-leave-to { opacity: 0; }
.modal-leave-active .modal-panel {
  animation: modal-panel-out var(--duration-short, 140ms) var(--ease-emphasized-accel, ease-in) both;
}

@keyframes modal-panel-out {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateY(8px) scale(0.98); }
}

@media (prefers-reduced-motion: reduce) {
  .modal-scrim,
  .modal-panel {
    animation: none;
  }
  .modal-leave-active { transition-duration: 1ms; }
}
</style>
