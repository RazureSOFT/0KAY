import { nextTick, watch, type Ref } from 'vue'

/**
 * Focus management for modal dialogs: move focus in on open, keep Tab cycling
 * inside the dialog, and restore the previously focused element on close.
 *
 * Mirrors the ConfirmDialog behaviour so every `role="dialog"` /
 * `role="alertdialog"` shell is usable from the keyboard and screen readers.
 */
export function useFocusTrap(
  isOpen: () => boolean,
  container: Ref<HTMLElement | null>,
  initial?: Ref<HTMLElement | null>,
) {
  let previous: HTMLElement | null = null
  let wasOpen = false

  watch(isOpen, async (open) => {
    if (open && !wasOpen) {
      previous = document.activeElement as HTMLElement | null
      await nextTick()
      ;(initial?.value ?? container.value)?.focus()
    } else if (!open && wasOpen) {
      previous?.focus?.()
      previous = null
    }
    wasOpen = open
  })

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !container.value) return
    const focusable = Array.from(
      container.value.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement)
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

  return { onKeydown }
}
