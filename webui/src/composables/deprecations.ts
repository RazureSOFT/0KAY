// Deprecation notices for the patch/slot contract.
//
// The `iframe` slot still renders — installed patches in the wild use it — but it
// is not the contract any more: a page must ship an ES module so the host can
// share its single Vue/i18n/store instance. Rendering an iframe forks all of that
// state, which is why a slot inside one cannot see the host theme or stores.
//
// Kept as a separate module so the notice is testable and can be raised from more
// than one place without duplicating the "warn once" bookkeeping.

const warned = new Set<string>()

/** Warn once per slot id that a slot is still using the deprecated iframe shape. */
export function warnIframeSlot(slotId: string, sink: Pick<Console, 'warn'> = console): boolean {
  const id = String(slotId || '')
  if (!id || warned.has(id)) return false
  warned.add(id)
  sink.warn(
    `[0kay] chat slot "${id}" uses component: "iframe", which is deprecated: ` +
    'iframe slots run in a separate document and cannot share the host stores, i18n or theme. ' +
    'Publish the slot as an ES module (component: "module", module: "/api/plugins/<name>/ui/<page>.js") instead. ' +
    'Iframe slots keep working for now.',
  )
  return true
}

/** Test seam: forget what has been warned. */
export function resetIframeWarnings(): void {
  warned.clear()
}
