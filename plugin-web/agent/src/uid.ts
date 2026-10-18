// crypto.randomUUID is unavailable on insecure origins (LAN HTTP).
export function uid(prefix = ''): string {
  const core =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`
  return prefix ? `${prefix}-${core}` : core
}
