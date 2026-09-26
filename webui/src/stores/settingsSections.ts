import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SettingsField {
  key: string
  type: string
  label: string
  labelKey?: string
  default_value?: string
  options?: string[]
  help?: string
  helpKey?: string
}

export interface SettingsSection {
  id: string
  label: string
  labelKey?: string
  icon?: string
  order?: number
  description?: string
  descriptionKey?: string
  fields: SettingsField[]
  plugin_id?: string
  plugin_name?: string
  /** Present only when fetched with `?values=1`. */
  values?: Record<string, unknown>
}

export const useSettingsSectionsStore = defineStore('settingsSections', () => {
  const sections = ref<SettingsSection[]>([])
  const values = ref<Record<string, Record<string, unknown>>>({})
  const loading = ref(false)

  async function fetchSections() {
    loading.value = true
    try {
      // `?values=1` embeds each section's values so the page does not fan out
      // into one request per section.
      const res = await fetch('/api/settings/sections?values=1')
      if (!res.ok) return
      const data = await res.json()
      const rows: SettingsSection[] = data.sections || []
      sections.value = rows
      const embedded: Record<string, Record<string, unknown>> = {}
      for (const section of rows) {
        if (section.values) embedded[section.id] = section.values
      }
      values.value = { ...values.value, ...embedded }
    } finally {
      loading.value = false
    }
  }

  async function loadValues(id: string) {
    const res = await fetch(`/api/settings/${encodeURIComponent(id)}`)
    if (!res.ok) return
    const data = await res.json()
    values.value = { ...values.value, [id]: data.values || {} }
  }

  async function saveValues(id: string, vals: Record<string, unknown>) {
    const res = await fetch(`/api/settings/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vals),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    values.value = { ...values.value, [id]: data.values || vals }
  }

  return { sections, values, loading, fetchSections, loadValues, saveValues }
})
