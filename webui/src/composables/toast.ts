import { ref } from 'vue'

export type ToastKind = 'info' | 'success' | 'error'

export interface ToastItem {
  id: number
  kind: ToastKind
  message: string
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
