import { ref } from 'vue'

export type ConfirmOptions = {
  title?: string
  message: string
  /** Optional icon (URL) shown beside the title, e.g. a plugin avatar. */
  icon?: string
  /** Optional short summary shown under the title. */
  description?: string
  /** Optional Markdown body (e.g. a plugin README) rendered in a scroll area. */
  readme?: string
  /** Optional bullet list rendered under the message (e.g. requested permissions). */
  details?: string[]
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

type Pending = {
  options: ConfirmOptions
  resolve: (ok: boolean) => void
}

const pending = ref<Pending | null>(null)

export function useConfirm() {
  function confirm(options: ConfirmOptions | string): Promise<boolean> {
    const opts = typeof options === 'string' ? { message: options } : options
    if (pending.value) pending.value.resolve(false)
    return new Promise<boolean>((resolve) => {
      pending.value = { options: opts, resolve }
    })
  }

  function settle(ok: boolean) {
    const current = pending.value
    pending.value = null
    current?.resolve(ok)
  }

  return { confirmState: pending, confirm, settle }
}
