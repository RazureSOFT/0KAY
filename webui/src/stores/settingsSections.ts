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
}

export const useSettingsSectionsStore = defineStore('settingsSections', () => {
  const sections = ref<SettingsSection[]>([])
  const values = ref<Record<string, Record<string, unknown>>>({})
  const loading = ref(false)

  async function fetchSections() {
    loading.value = true
    try {
      const res = await fetch('/api/settings/sections')
      if (!res.ok) return
      const data = await res.json()
      sections.value = data.sections || []
      // load values for each
      for (const sec of sections.value) {
        await loadValues(sec.id)
      }
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
