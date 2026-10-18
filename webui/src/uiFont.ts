/**
 * Global UI font (Settings → 外观).
 *
 * The font is stored in Core (settings section `appearance`) and applied as a
 * CSS custom property on :root, so every page — including plugin pages, which
 * inherit the host's variables — picks it up. An empty value restores the
 * default font by removing the override.
 */

const FONT_VAR = '--font-family'
const CODE_FONT_VAR = '--code-font'

function applyVar(name: string, raw: unknown): void {
  const value = String(raw ?? '').trim()
  const root = document.documentElement
  if (value) root.style.setProperty(name, value)
  else root.style.removeProperty(name)
}

/** Fetch the appearance section and apply the configured fonts. Best-effort. */
export async function applyUiFont(): Promise<void> {
  try {
    const res = await fetch('/api/settings/sections?values=1')
    if (!res.ok) return
    const data = await res.json()
    const section = (data.sections || []).find((row: any) => row.id === 'appearance')
    const values = section?.values || {}
    applyVar(FONT_VAR, values.ui_font)
    applyVar(CODE_FONT_VAR, values.ui_code_font)
  } catch {
    /* non-fatal: keep the default font */
  }
}
