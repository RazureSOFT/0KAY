<script setup lang="ts">
/**
 * Renders the shared toast queue (see composables/toast.ts). Teleported so it
 * sits above every dialog; the region is one polite live area, so screen
 * readers hear toasts without them stealing focus.
 */
import { useToasts, dismissToast } from '../composables/toast'

const toasts = useToasts()

const icons: Record<string, string> = {
  success: 'M20 6 9 17l-5-5',
  error: 'M18 6 6 18M6 6l12 12',
  info: 'M12 8h.01M11 12h1v4h1',
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-region" role="status" aria-live="polite">
      <TransitionGroup name="toast">
        <div v-for="item in toasts" :key="item.id" class="toast" :class="`toast-${item.kind}`">
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              v-if="item.kind !== 'info'"
              :d="icons[item.kind]"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <template v-else>
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
              <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </template>
          </svg>
          <span class="toast-message">{{ item.message }}</span>
          <button
            v-if="item.kind === 'error'"
            type="button"
            class="toast-close"
            @click="dismissToast(item.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="14" height="14">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-region {
  position: fixed;
  inset-inline: 0;
  bottom: calc(20px + env(safe-area-inset-bottom));
  z-index: var(--z-toast, 6000);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm, 8px);
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(480px, calc(100vw - 32px));
  padding: 12px 18px;
  border-radius: 16px;
  background: var(--md-inverse-surface, #322f35);
  color: var(--md-inverse-on-surface, #f5eff7);
  font-size: 14px;
  line-height: 1.45;
  box-shadow: var(--shadow-3, 0 14px 44px #30205720);
}

.toast-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.toast-success .toast-icon { color: var(--md-inverse-primary, #d0bcff); }
.toast-error .toast-icon { color: #ffb4ab; }

.toast-message {
  overflow-wrap: anywhere;
}

.toast-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  flex-shrink: 0;
}
.toast-close:hover { background: color-mix(in srgb, currentColor 12%, transparent); }

.toast-enter-active {
  transition: opacity var(--duration-medium, 220ms) var(--ease-emphasized-decel, ease-out),
    transform var(--duration-medium, 220ms) var(--ease-emphasized-decel, ease-out);
}
.toast-leave-active {
  transition: opacity var(--duration-short, 140ms) var(--ease-emphasized-accel, ease-in),
    transform var(--duration-short, 140ms) var(--ease-emphasized-accel, ease-in);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

@media (max-width: 720px) {
  .toast-region { bottom: calc(84px + env(safe-area-inset-bottom)); }
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active { transition: opacity var(--duration-short, 140ms) linear; }
  .toast-enter-from,
  .toast-leave-to { transform: none; }
}
</style>
