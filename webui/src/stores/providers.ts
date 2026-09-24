import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProviderConfig } from '../composables/wizard'

export interface ProvidersFile {
  default_provider_id: string
  default_model: string
  providers: ProviderConfig[]
}

export const useProvidersStore = defineStore('providers', () => {
  const providers = ref<ProviderConfig[]>([])
  const defaultProviderId = ref('')
  const defaultModel = ref('')
  const loading = ref(false)
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch('/api/providers')
      if (!res.ok) throw new Error(String(res.status))
      const data: ProvidersFile = await res.json()
      providers.value = data.providers || []
      defaultProviderId.value = data.default_provider_id || ''
      defaultModel.value = data.default_model || ''
    } catch (e: any) {
      error.value = e.message || 'load failed'
    } finally {
      loading.value = false
    }
  }

  async function upsert(p: ProviderConfig) {
    const res = await fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: p }),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data: ProvidersFile = await res.json()
    providers.value = data.providers || []
    defaultProviderId.value = data.default_provider_id || defaultProviderId.value
    defaultModel.value = data.default_model || defaultModel.value
  }

  async function remove(id: string) {
    const res = await fetch(`/api/providers/delete?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error(String(res.status))
    const data: ProvidersFile = await res.json()
    providers.value = data.providers || []
    defaultProviderId.value = data.default_provider_id || ''
    defaultModel.value = data.default_model || ''
  }

  async function setDefaults(providerId: string, model: string) {
    const res = await fetch('/api/providers/defaults', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ default_provider_id: providerId, default_model: model }),
    })
    if (!res.ok) throw new Error(String(res.status))
    defaultProviderId.value = providerId
    defaultModel.value = model
  }

  async function replaceAll(file: ProvidersFile) {
    const res = await fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(file),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data: ProvidersFile = await res.json()
    providers.value = data.providers || []
    defaultProviderId.value = data.default_provider_id || ''
    defaultModel.value = data.default_model || ''
  }

  return {
    providers,
    defaultProviderId,
    defaultModel,
    loading,
    error,
    fetchAll,
    upsert,
    remove,
    setDefaults,
    replaceAll,
  }
})
