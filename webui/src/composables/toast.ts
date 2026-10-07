import { ref } from 'vue'

/**
 * App-wide toast queue. The `--z-toast` layer was reserved in the token ladder
 * long before anything rendered into it, so success/failure feedback degraded
 * into per-page inline banners (some at the bottom of long pages, some cleared
 * by the next poll, some only in the console). This is the single channel.
 *
 * Usage: `toast('Saved', 'success')` from anywhere; <ToastHost/> in App.vue
 * renders the region. Errors outlive successes by default because a missed
 * error is a bug report, while a missed "Saved" is nothing.
 */
export type ToastKind = 'info' | 'success' | 'error'

export interface ToastItem {
  id: number
  kind: ToastKind
  message: string
  /** Sticky while hovered: the dismiss timer pauses, so long errors stay readable. */
  duration: number
}

const toasts = ref<ToastItem[]>([])
let seq = 0

const timers = new Map<number, ReturnType<typeof setTimeout>>()

function dismiss(id: number) {
  const timer = timers.get(id)
  if (timer) clearTimeout(timer)
  timers.delete(id)
  toasts.value = toasts.value.filter((item) => item.id !== id)
}

export function toast(message: string, kind: ToastKind = 'info', duration?: number) {
  const item: ToastItem = {
    id: ++seq,
    kind,
    message,
    duration: duration ?? (kind === 'error' ? 6500 : 3500),
  }
  // Cap the stack: a poll loop that toasts on every tick must not bury the UI.
  toasts.value = [...toasts.value.slice(-4), item]
  timers.set(item.id, setTimeout(() => dismiss(item.id), item.duration))
  return item.id
}

export function dismissToast(id: number) {
  dismiss(id)
}

export function useToasts() {
  return toasts
}
