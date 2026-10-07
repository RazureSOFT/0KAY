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
  /** Present only when fetched with `?values=1`. */
  values?: Record<string, unknown>
}

/**
 * Resolve a translation key, returning '' when it is not defined.
 *
 * vue-i18n renders a missing key as the key itself, so comparing against the key
 * is how "no translation" is detected and the server's literal label is kept.
 * A missing key must not blank out a section: the fields would render as empty
 * labels, which is worse than showing them in the server's language.
 */
function tr(key?: string): string {
  if (!key) return ''
  const value = i18n.global.t(key)
  return value === key ? '' : value
}

/**
 * Localise a section registered by a service.
 *
 * Core and mocr register their settings sections over gRPC, and the protobuf
 * SettingsSection carries no key fields — only literal labels. Rather than change
 * the wire format for a presentation concern, labels are resolved here by the
 * section id and field key the server already sends:
 *
 *   settings.tabs.<id>                          section tab label
 *   settings.sections.<id>.desc                 section description
 *   settings.fields.<id>.<field>.label          field label
 *   settings.fields.<id>.<field>.help           field help
 *
 * An explicit labelKey/helpKey wins when a plugin does send one, and anything
 * unresolved keeps the server's literal. The server still owns the section; the
 * WebUI owns how it is worded, which is what makes it translatable.
 */
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
  // Raw rows as the server sent them; `sections` is the localised view.
  const rawSections = ref<SettingsSection[]>([])
  // Reading the locale here makes the computed re-resolve when the language
  // changes, so tabs already on screen update without a refetch.
  const sections = computed(() => {
    // Referencing the locale makes this computed depend on it, so switching
    // language re-resolves the labels already on screen without a refetch.
    void i18n.global.locale.value
    return localize(rawSections.value)
  })
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
