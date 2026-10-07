<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfirm } from '../composables/confirm'
import MarkdownContent from './MarkdownContent.vue'
import ModalShell from './ModalShell.vue'

const { t } = useI18n()
const { confirmState, settle } = useConfirm()

const title = computed(() => {
  const state = confirmState.value
  if (state?.options.title) return state.options.title
  return t('confirm.title')
})
const confirmLabel = computed(
  () => confirmState.value?.options.confirmLabel || t('confirm.confirm'),
)
const cancelLabel = computed(() => confirmState.value?.options.cancelLabel || t('settings.cancel'))
</script>

<template>
  <!--
    Scrim, focus trap, Escape handling and focus restore now live in ModalShell.
    ConfirmDialog keeps only its content, which is why the panel width and the
    header/body styling below are unchanged.
  -->
  <ModalShell
    :open="!!confirmState"
    :title="title"
    panel-class="confirm-dialog"
    max-height="min(88vh, 900px)"
    labelled-by="confirm-dialog-title"
    described-by="confirm-dialog-message"
    :on-dismiss="() => settle(false)"
    role="alertdialog"
  >
    <template v-if="confirmState">
      <header class="confirm-head">
        <img
          v-if="confirmState.options.icon"
          class="confirm-icon"
          :src="confirmState.options.icon"
          alt=""
          loading="lazy"
        />
        <div class="confirm-headtext">
          <h2 id="confirm-dialog-title">{{ title }}</h2>
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
        <button type="button" @click="settle(false)">{{ cancelLabel }}</button>
        <button
          type="button"
          class="confirm-primary"
          :class="{ danger: confirmState.options.danger !== false }"
          @click="settle(true)"
        >{{ confirmLabel }}</button>
      </footer>
    </template>
  </ModalShell>
</template>

<style>
/* Scoped to the shared shell: the shell owns .modal-panel's geometry, this only
   widens the reading measure and restyles the interior. */
.confirm-dialog {
  width: min(680px, 100%);
  background: var(--md-surface-container-high, var(--md-surface, #fff));
  border: 1px solid var(--md-outline-variant, transparent);
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
}
.confirm-dialog footer button {
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
@media (prefers-reduced-motion: reduce) {
  .confirm-dialog footer button {
    transition: none;
  }
}
</style>
