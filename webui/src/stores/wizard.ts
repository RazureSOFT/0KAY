import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PersonaConfig, Live2DConfig, ProviderConfig } from '../composables/wizard'
import { DEFAULT_LIVE2D_MODEL_URL } from '../composables/wizard'

export const useWizardStore = defineStore('wizard', () => {
  const isCompleted = ref(false)
  const currentStep = ref(1)
  const totalSteps = 8

  const provider = ref('')
  const apiKey = ref('')
  const baseUrl = ref('')
  const selectedModels = ref<string[]>([])
  const defaultModel = ref('')
  const fetchedModels = ref<string[]>([])
  const isLoadingModels = ref(false)

  // Not a wizard step: the persona and the Live2D model are the app's config.
  // ChatPanel reads the persona and Live2DStage reads the model, and both are
  // persisted through saveToStorage() below.
  const persona = ref<PersonaConfig>({
    name: '',
    avatar: '',
    birthDate: '',
    description: '',
    personality: '',
    greeting: '',
    customPrompt: '',
  })

  const live2d = ref<Live2DConfig>({
    enabled: true,
    modelUrl: DEFAULT_LIVE2D_MODEL_URL,
    modelData: null,
  })

  const canProceed = computed(() => {
    switch (currentStep.value) {
      case 1: return true
      case 2: return true
      case 3: return provider.value !== ''
      case 4: return apiKey.value !== '' && baseUrl.value !== ''
      case 5: return defaultModel.value !== ''
      case 6: return true
      default: return false
    }
  })

  const blockedHint = computed(() => {
    switch (currentStep.value) {
      case 3: return 'wizard.needProvider'
      case 4:
        if (apiKey.value === '' && baseUrl.value === '') return 'wizard.needKeyAndUrl'
        if (apiKey.value === '') return 'wizard.needApiKey'
        return 'wizard.needBaseUrl'
      case 5: return 'wizard.needModel'
      default: return ''
    }
  })

  function setProvider(providerId: string, defaultBaseUrl: string) {
    provider.value = providerId
    baseUrl.value = defaultBaseUrl
  }

  function setApiKey(key: string) {
    apiKey.value = key
  }

  function setBaseUrl(url: string) {
    baseUrl.value = url
  }

  function setFetchedModels(models: string[]) {
    fetchedModels.value = models
  }

  function setModels(models: string[], defaultM: string) {
    selectedModels.value = models
    defaultModel.value = defaultM
  }

  function setPersona(p: Partial<PersonaConfig>) {
    persona.value = { ...persona.value, ...p }
  }

  function setLive2D(config: Partial<Live2DConfig>) {
    live2d.value = { ...live2d.value, ...config }
  }

  function nextStep() {
    if (currentStep.value < totalSteps && canProceed.value) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function completeWizard() {
    isCompleted.value = true
    saveToStorage()
    void pushProvidersToCore()
  }

  function saveToStorage() {
    const config = {
      provider: provider.value,
      baseUrl: baseUrl.value,
      models: selectedModels.value,
      defaultModel: defaultModel.value,
      persona: persona.value,
      live2d: { ...live2d.value, modelData: null },
    }
    localStorage.setItem('0kay_config', JSON.stringify(config))
    localStorage.setItem('0kay_wizard_complete', 'true')
  }

  /**
   * Treat setup as done when Core already has a usable provider.
   *
   * The wizard writes to Core, so Core is the authority; localStorage is only a
   * cache of that fact. Without this, a fresh browser profile re-ran setup.
   */
  async function reconcileWithCore() {
    try {
      const res = await fetch('/api/providers')
      if (!res.ok) return
      const body = await res.json()
      const providers = Array.isArray(body?.providers) ? body.providers : []
      const usable = providers.filter((p: any) => p && (p.enabled !== false) && String(p.api_key || '').trim())
      if (!usable.length) return
      const first = usable[0]
      provider.value = provider.value || first.provider || first.id || ''
      baseUrl.value = baseUrl.value || first.base_url || ''
      if (!defaultModel.value) defaultModel.value = first.default_model || (first.models?.[0] ?? '')
      if (!selectedModels.value.length && Array.isArray(first.models)) selectedModels.value = first.models
      if (!isCompleted.value) {
        isCompleted.value = true
        localStorage.setItem('0kay_wizard_complete', 'true')
      }
    } catch {
      // Offline or a locked-down Core: fall back to whatever localStorage said.
    }
  }

  async function pushProvidersToCore() {
    if (!provider.value || !apiKey.value || !baseUrl.value) return
    try {
      const models = selectedModels.value.length ? selectedModels.value : (defaultModel.value ? [defaultModel.value] : [])
      const norm = (u: string) => String(u || '').trim().replace(/\/+$/, '')
      let existing: ProviderConfig[] = []
      try {
        const res = await fetch('/api/providers')
        if (res.ok) existing = ((await res.json()).providers || []) as ProviderConfig[]
      } catch { }
      const match = existing.find(p => p.id === provider.value)
        || existing.find(p => p.provider === provider.value && norm(p.base_url) === norm(baseUrl.value))
      const sameKey = !match?.api_key || match.api_key === apiKey.value
      if (match && match.provider === provider.value && norm(match.base_url) === norm(baseUrl.value)
          && sameKey && (match.models || []).join('\n') === models.join('\n')) {
        await fetch('/api/providers/defaults', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ default_provider_id: match.id, default_model: defaultModel.value || match.default_model }),
        })
        return
      }
      const id = match?.id || provider.value
      const merged = match ? Array.from(new Set([...(match.models || []), ...models])) : models
      const format = match?.format || (provider.value === 'anthropic' ? 'anthropic' : '')
      const body = {
        provider: {
          id,
          provider: provider.value,
          api_key: apiKey.value,
          base_url: baseUrl.value,
          models: merged,
          disabled_models: (match?.disabled_models || []).filter(m => merged.includes(m)),
          default_model: defaultModel.value || (merged.includes(match?.default_model || '') ? match!.default_model : merged[0] || ''),
          enabled: true,
          format,
        },
        default_provider_id: id,
        default_model: defaultModel.value || (merged.includes(match?.default_model || '') ? match!.default_model : merged[0] || ''),
      }
      await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
    }
  }

  function loadFromStorage() {
    const complete = localStorage.getItem('0kay_wizard_complete')
    if (complete === 'true') {
      isCompleted.value = true
    }
    // Completion used to live only in localStorage, so a different browser (or a
    // cleared profile) walked the user through setup again even though the server
    // already had a working provider. Ask Core as well.
    void reconcileWithCore()
    try {
      const config = JSON.parse(localStorage.getItem('0kay_config') || '{}')
      provider.value = config.provider || provider.value
      baseUrl.value = config.baseUrl || baseUrl.value
      selectedModels.value = config.models || selectedModels.value
      defaultModel.value = config.defaultModel || defaultModel.value
      if (config.persona) persona.value = { ...persona.value, ...config.persona }
      if (config.live2d) {
        live2d.value = {
          enabled: config.live2d.enabled !== false,
          modelUrl: config.live2d.modelUrl || DEFAULT_LIVE2D_MODEL_URL,
          modelData: null,
        }
      } else {
        live2d.value = { enabled: true, modelUrl: DEFAULT_LIVE2D_MODEL_URL, modelData: null }
      }
    } catch (e) {
      console.error('Failed to load config:', e)
    }
  }

  function resetWizard() {
    isCompleted.value = false
    currentStep.value = 1
    provider.value = ''
    apiKey.value = ''
    baseUrl.value = ''
    selectedModels.value = []
    defaultModel.value = ''
    fetchedModels.value = []
    persona.value = { name: '', avatar: '', birthDate: '', description: '', personality: '', greeting: '', customPrompt: '' }
    live2d.value = { enabled: true, modelUrl: DEFAULT_LIVE2D_MODEL_URL, modelData: null }
    localStorage.removeItem('0kay_wizard_complete')
    localStorage.removeItem('0kay_config')
  }

  return {
    isCompleted,
    currentStep,
    totalSteps,
    provider,
    apiKey,
    baseUrl,
    selectedModels,
    defaultModel,
    fetchedModels,
    isLoadingModels,
    persona,
    live2d,
    canProceed,
    blockedHint,
    reconcileWithCore,
    setProvider,
    setApiKey,
    setBaseUrl,
    setFetchedModels,
    setModels,
    setPersona,
    setLive2D,
    nextStep,
    prevStep,
    completeWizard,
    saveToStorage,
    loadFromStorage,
    resetWizard,
  }
})
