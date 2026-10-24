import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { i18n } from '../i18n'

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
  values?: Record<string, unknown>
}

function tr(key?: string): string {
  if (!key) return ''
  const value = i18n.global.t(key)
  return value === key ? '' : value
}

function localize(rows: SettingsSection[]): SettingsSection[] {
  return rows.map((section) => ({
    ...section,
    label: tr(section.labelKey) || tr(`settings.tabs.${section.id}`) || section.label,
    description:
      tr(section.descriptionKey) || tr(`settings.sections.${section.id}.desc`) || section.description,
    fields: (section.fields || []).map((field) => ({
      ...field,
      label:
        tr(field.labelKey) || tr(`settings.fields.${section.id}.${field.key}.label`) || field.label,
      help: tr(field.helpKey) || tr(`settings.fields.${section.id}.${field.key}.help`) || field.help,
    })),
  }))
}

export const useSettingsSectionsStore = defineStore('settingsSections', () => {
  const rawSections = ref<SettingsSection[]>([])
  const sections = computed(() => {
    void i18n.global.locale.value
    return localize(rawSections.value)
  })
  const values = ref<Record<string, Record<string, unknown>>>({})
  const loading = ref(false)

  async function fetchSections() {
    loading.value = true
    try {
      const res = await fetch('/api/settings/sections?values=1')
      if (!res.ok) return
      const data = await res.json()
      const rows: SettingsSection[] = data.sections || []
      rawSections.value = rows
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
