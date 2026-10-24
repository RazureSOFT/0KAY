const FONT_VAR = '--font-family'
const CODE_FONT_VAR = '--code-font'

function applyVar(name: string, raw: unknown): void {
  const value = String(raw ?? '').trim()
  const root = document.documentElement
  if (value) root.style.setProperty(name, value)
  else root.style.removeProperty(name)
}

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
  }
}
