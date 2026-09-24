import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProviderConfig, PersonaConfig, Live2DConfig } from '../composables/wizard'
import { DEFAULT_LIVE2D_MODEL_URL } from '../composables/wizard'

export const useWizardStore = defineStore('wizard', () => {
  const isCompleted = ref(false)
  const currentStep = ref(1)
  const totalSteps = 7

  // Provider config
  const provider = ref('')
  const apiKey = ref('')
  const baseUrl = ref('')
  const selectedModels = ref<string[]>([])
  const defaultModel = ref('')
  const fetchedModels = ref<string[]>([])
  const isLoadingModels = ref(false)

  // Persona config
  const persona = ref<PersonaConfig>({
    name: '',
    avatar: '',
    birthDate: '',
    description: '',
    personality: '',
    greeting: '',
  })

  // Live2D config — model list comes from upload API (sample models removed)
  const live2d = ref<Live2DConfig>({
    enabled: true,
    modelUrl: DEFAULT_LIVE2D_MODEL_URL,
    modelData: null,
  })

  const canProceed = computed(() => {
    switch (currentStep.value) {
      case 1: return true
      case 2: return provider.value !== ''
      case 3: return apiKey.value !== '' && baseUrl.value !== ''
      case 4: return defaultModel.value !== ''
      case 5: return persona.value.name !== ''
      case 6: return true // Live2D is optional
      case 7: return true
      default: return false
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
  }

  function saveToStorage() {
    const config = {
      provider: provider.value,
      apiKey: apiKey.value,
      baseUrl: baseUrl.value,
      models: selectedModels.value,
      defaultModel: defaultModel.value,
      persona: persona.value,
      live2d: { ...live2d.value, modelData: null },
    }
    localStorage.setItem('0kay_config', JSON.stringify(config))
    localStorage.setItem('0kay_wizard_complete', 'true')
    // Push provider config to Core so chat/agent can use real credentials
    void pushProvidersToCore()
  }

  async function pushProvidersToCore() {
    if (!provider.value || !apiKey.value || !baseUrl.value) return
    try {
      const id = provider.value
      const body = {
        provider: {
          id,
          provider: provider.value,
          api_key: apiKey.value,
          base_url: baseUrl.value,
          models: selectedModels.value.length ? selectedModels.value : (defaultModel.value ? [defaultModel.value] : []),
          default_model: defaultModel.value,
          enabled: true,
        },
        default_provider_id: id,
        default_model: defaultModel.value,
      }
      await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      /* offline — keep localStorage copy */
    }
  }

  function loadFromStorage() {
    const complete = localStorage.getItem('0kay_wizard_complete')
    if (complete === 'true') {
      isCompleted.value = true
    }
    try {
      const config = JSON.parse(localStorage.getItem('0kay_config') || '{}')
      provider.value = config.provider || provider.value
      apiKey.value = config.apiKey || apiKey.value
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
    persona.value = { name: '', avatar: '', description: '', personality: '', greeting: '' }
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
