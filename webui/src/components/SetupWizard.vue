<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/wizard'
import AppSelect from './AppSelect.vue'
import { setLanguage, getLanguage, LOCALES } from '../i18n'
import { PROVIDERS, WIZARD_STEPS } from '../composables/wizard'

const { t, locale } = useI18n()
const wizard = useWizardStore()
const emit = defineEmits<{ complete: [] }>()

const customModels = ref('')
const isLoading = ref(false)
const error = ref('')
const currentLang = ref(getLanguage())
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFileName = ref('')
const folderInput = ref<HTMLInputElement | null>(null)
const uploadingFolder = ref(false)
const folderMessage = ref('')

function openFilePicker() {
  fileInput.value?.click()
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    wizard.live2d.modelData = file
    uploadedFileName.value = file.name
  }
}

function openFolderPicker() { folderInput.value?.click() }

async function onFolderSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  if (!files.length) return
  uploadingFolder.value = true
  folderMessage.value = ''
  try {
    const form = new FormData()
    const paths: string[] = []
    for (const file of files) {
      const relative = (file as any).webkitRelativePath || file.name
      paths.push(relative)
      form.append('files', file, file.name)
    }
    form.append('paths', JSON.stringify(paths))
    const response = await fetch('/api/live2d', { method: 'POST', body: form })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const body = await response.json()
    if (body.model_url) wizard.live2d.modelUrl = body.model_url
    wizard.live2d.enabled = true
    folderMessage.value = t('wizard.uploadedCount', { count: files.length })
  } catch (error: any) {
    folderMessage.value = error?.message || t('wizard.uploadFailed')
  } finally { uploadingFolder.value = false }
}

onMounted(() => {
  wizard.loadFromStorage()
  currentLang.value = locale.value
})

const progress = computed(() => {
  return ((wizard.currentStep - 1) / (wizard.totalSteps - 1)) * 100
})

function selectProvider(provider: any) {
  wizard.setProvider(provider.id, provider.baseUrl)
}

function getProviderName(id: string): string {
  return t(`providers.${id}.name`)
}

function getProviderDesc(id: string): string {
  return t(`providers.${id}.description`)
}

async function fetchModels() {
  if (!wizard.apiKey || !wizard.baseUrl) {
    error.value = t('wizard.apiConfigDesc')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/models/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: wizard.provider,
        base_url: wizard.baseUrl,
        api_key: wizard.apiKey,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch models')
    }

    const data = await response.json()
    wizard.setFetchedModels(data.models || [])
  } catch (e: any) {
    error.value = e.message || t('wizard.fetchFailed')

    const selectedProvider = PROVIDERS.find(p => p.id === wizard.provider)
    if (selectedProvider) {
      wizard.setFetchedModels(selectedProvider.defaultModels)
    }
  } finally {
    isLoading.value = false
  }
}

function toggleModel(model: string) {
  const idx = wizard.selectedModels.indexOf(model)
  if (idx > -1) {
    wizard.selectedModels.splice(idx, 1)
  } else {
    wizard.selectedModels.push(model)
  }
}

function finish() {
  wizard.completeWizard()
  emit('complete')
}

function useCustomModels() {
  const models = customModels.value.split(',').map(m => m.trim()).filter(m => m)
  if (models.length > 0) {
    wizard.setFetchedModels(models)
  }
}

function changeLanguage(code: string) {
  currentLang.value = code
  setLanguage(code)
}
</script>

<template>
  <div class="wizard-overlay">
    <div class="wizard-container">
      <!-- Header -->
      <div class="wizard-header">
        <div class="wizard-top">
          <div class="wizard-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2"/>
              <path d="M10 16L14 20L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <select
            class="lang-select"
            v-model="currentLang"
            @change="changeLanguage(currentLang)"
            :aria-label="t('settings.language')"
          >
            <option v-for="option in LOCALES" :key="option.code" :value="option.code">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="wizard-title">{{ t('wizard.title') }}</div>
        <div class="wizard-subtitle">{{ t('wizard.subtitle') }}</div>
      </div>

      <!-- Progress -->
      <div class="wizard-progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="progress-steps">
          <div
            v-for="step in WIZARD_STEPS"
            :key="step.id"
            class="step-dot"
            :class="{ 'active': step.id === wizard.currentStep, 'completed': step.id < wizard.currentStep }"
          >
            <span class="step-check" v-if="step.id < wizard.currentStep">✓</span>
            <span v-else>{{ step.id }}</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="wizard-content">
        <!-- Step 1: Welcome -->
        <div v-if="wizard.currentStep === 1" class="wizard-step">
          <div class="welcome-icon">👋</div>
          <h2>{{ t('wizard.welcome') }}</h2>
          <p>{{ t('wizard.welcomeDesc') }}</p>
          <ul class="feature-list">
            <li>🔗 {{ t('wizard.featureProvider') }}</li>
            <li>🎭 {{ t('wizard.featurePersona') }}</li>
            <li>💬 {{ t('wizard.featureChat') }}</li>
          </ul>
        </div>

        <!-- Step 2: Provider Selection -->
        <div v-if="wizard.currentStep === 2" class="wizard-step">
          <h2>{{ t('wizard.selectProvider') }}</h2>
          <p>{{ t('wizard.selectProviderDesc') }}</p>
          <div class="provider-grid">
            <button
              v-for="p in PROVIDERS"
              :key="p.id"
              class="provider-card"
              :class="{ selected: wizard.provider === p.id }"
              @click="selectProvider(p)"
            >
              <span class="provider-icon">
                <img v-if="p.logo" :src="p.logo" :alt="p.name" class="provider-logo" />
                <span v-else>{{ p.icon }}</span>
              </span>
              <span class="provider-name">{{ getProviderName(p.id) }}</span>
              <span class="provider-desc">{{ getProviderDesc(p.id) }}</span>
            </button>
          </div>
        </div>

        <!-- Step 3: API Key -->
        <div v-if="wizard.currentStep === 3" class="wizard-step">
          <h2>{{ t('wizard.apiConfig') }}</h2>
          <p>{{ t('wizard.apiConfigDesc') }}</p>

          <div class="form-group">
            <label>{{ t('wizard.apiKey') }}</label>
            <input
              type="password"
              v-model="wizard.apiKey"
              :placeholder="t('wizard.apiKeyPlaceholder')"
              class="input"
            />
            <a
              v-if="wizard.provider !== 'custom'"
              :href="PROVIDERS.find(p => p.id === wizard.provider)?.apiKeyUrl"
              target="_blank"
              class="helper-link"
            >
              {{ t('wizard.getApiKey') }}
            </a>
          </div>

          <div class="form-group">
            <label>{{ t('wizard.baseUrl') }}</label>
            <input
              type="text"
              v-model="wizard.baseUrl"
              :placeholder="t('wizard.baseUrlPlaceholder')"
              class="input"
            />
          </div>

          <div class="form-actions">
            <button class="btn btn-primary" @click="fetchModels" :disabled="isLoading">
              {{ isLoading ? t('wizard.fetching') : t('wizard.fetchModels') }}
            </button>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
        </div>

        <!-- Step 4: Model Selection -->
        <div v-if="wizard.currentStep === 4" class="wizard-step">
          <h2>{{ t('wizard.selectModels') }}</h2>
          <p>{{ t('wizard.selectModelsDesc') }}</p>

          <div v-if="wizard.fetchedModels.length > 0" class="model-list">
            <label
              v-for="model in wizard.fetchedModels"
              :key="model"
              class="model-item"
            >
              <input
                type="checkbox"
                :checked="wizard.selectedModels.includes(model)"
                @change="toggleModel(model)"
              />
              <span class="model-name">{{ model }}</span>
            </label>
          </div>

          <div v-else class="custom-models">
            <p>{{ t('wizard.noModels') }}</p>
            <input
              v-model="customModels"
              placeholder="model1, model2, model3"
              class="input"
            />
            <button class="btn btn-secondary" @click="useCustomModels">
              {{ t('wizard.useModels') }}
            </button>
          </div>

          <div v-if="wizard.selectedModels.length > 0" class="form-group">
            <label>{{ t('wizard.defaultModel') }}</label>
            <AppSelect v-model="wizard.defaultModel" class="input" :aria-label="t('wizard.defaultModel')" :options="wizard.selectedModels" />
          </div>
        </div>

        <!-- Step 5: Persona -->
        <div v-if="wizard.currentStep === 5" class="wizard-step">
          <h2>{{ t('wizard.createPersona') }}</h2>
          <p>{{ t('wizard.createPersonaDesc') }}</p>

          <div class="persona-form">
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('wizard.name') }} *</label>
                <input
                  v-model="wizard.persona.name"
                  :placeholder="t('wizard.namePlaceholder')"
                  class="input"
                />
              </div>

              <div class="form-group">
                <label>{{ t('wizard.avatarUrl') }}</label>
                <input
                  v-model="wizard.persona.avatar"
                  :placeholder="t('wizard.avatarPlaceholder')"
                  class="input"
                />
              </div>
              <div class="form-group">
                <label>{{ t('wizard.birthDate') }}</label>
                <input v-model="wizard.persona.birthDate" type="date" class="input" />
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('wizard.description') }}</label>
              <textarea
                v-model="wizard.persona.description"
                :placeholder="t('wizard.descriptionPlaceholder')"
                class="input textarea"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('wizard.personality') }}</label>
              <textarea
                v-model="wizard.persona.personality"
                :placeholder="t('wizard.personalityPlaceholder')"
                class="input textarea"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('wizard.greeting') }}</label>
              <textarea
                v-model="wizard.persona.greeting"
                :placeholder="t('wizard.greetingPlaceholder')"
                class="input textarea"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Step 6: Live2D (Optional) -->
        <div v-if="wizard.currentStep === 6" class="wizard-step">
          <h2>{{ t('wizard.live2d') }}</h2>
          <p>{{ t('wizard.live2dDesc') }}</p>

          <div class="live2d-setup">
            <label class="toggle-label">
              <input type="checkbox" v-model="wizard.live2d.enabled" />
              <span class="toggle-slider"></span>
              <span>{{ t('wizard.enableLive2d') }}</span>
            </label>

            <div v-if="wizard.live2d.enabled" class="live2d-config">
              <div class="form-group">
                <label>{{ t('wizard.modelUrl') }}</label>
                <input
                  v-model="wizard.live2d.modelUrl"
                  :placeholder="t('wizard.modelUrlPlaceholder')"
                  class="input"
                />
                <p class="helper-text">
                  {{ t('wizard.live2dHelp') }}
                  <a href="https://www.live2d.com/en/learn/sample/" target="_blank">
                    {{ t('wizard.live2dSamples') }}
                  </a>
                </p>
              </div>

              <div class="form-group">
                <label>{{ t('wizard.orUpload') }}</label>
                <div class="upload-area" @click="openFilePicker">
                  <input
                    ref="fileInput"
                    type="file"
                    accept=".moc3,.model3.json"
                    @change="onFileSelected"
                    class="file-input"
                  />
                  <span v-if="uploadedFileName" class="file-name">{{ uploadedFileName }}</span>
                  <span v-else>{{ t('wizard.uploadHint') }}</span>
                </div>
              </div>

              <div class="form-group">
                <label>{{ t('wizard.uploadFolder') }}</label>
                <div class="upload-area" @click="openFolderPicker">
                  <input ref="folderInput" type="file" webkitdirectory directory multiple hidden @change="onFolderSelected" />
                  <span>{{ uploadingFolder ? t('wizard.uploading') : t('wizard.uploadFolderHint') }}</span>
                </div>
                <p v-if="folderMessage" class="helper-text">{{ folderMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 7: Complete -->
        <div v-if="wizard.currentStep === 7" class="wizard-step complete-step">
          <div class="complete-icon">🎉</div>
          <h2>{{ t('wizard.complete') }}</h2>
          <p>{{ t('wizard.completeDesc') }}</p>

          <div class="summary">
            <div class="summary-row">
              <span class="label">{{ t('wizard.provider') }}</span>
              <span class="value">{{ getProviderName(wizard.provider) || wizard.provider }}</span>
            </div>
            <div class="summary-row">
              <span class="label">{{ t('wizard.defaultModel') }}:</span>
              <span class="value">{{ wizard.defaultModel }}</span>
            </div>
            <div class="summary-row">
              <span class="label">{{ t('wizard.name') }}:</span>
              <span class="value">{{ wizard.persona.name }}</span>
            </div>
            <div class="summary-row">
              <span class="label">{{ t('wizard.live2d') }}:</span>
              <span class="value">{{ wizard.live2d.enabled ? '✓' : '✗' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="wizard-footer">
        <button
          class="btn btn-ghost"
          @click="wizard.prevStep()"
          :disabled="wizard.currentStep === 1"
        >
          {{ t('wizard.back') }}
        </button>
        <button
          v-if="wizard.currentStep < 7"
          class="btn btn-primary"
          @click="wizard.nextStep()"
          :disabled="!wizard.canProceed"
        >
          {{ t('wizard.next') }}
        </button>
        <button
          v-else
          class="btn btn-primary"
          @click="finish"
        >
          {{ t('wizard.startChatting') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wizard-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.wizard-container {
  width: 640px;
  max-height: 90vh;
  background: var(--neutral-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.wizard-header {
  text-align: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--neutral-gray-6);
}

.wizard-top {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: var(--space-md);
}

.wizard-logo {
  color: var(--brand-primary);
}

.lang-select {
  position: absolute;
  right: 0;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
  background: var(--neutral-gray-4);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.lang-select:hover {
  background: var(--neutral-gray-6);
}

.wizard-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--neutral-gray-70);
}

.wizard-subtitle {
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-30);
  margin-top: var(--space-xs);
}

.wizard-progress {
  padding: var(--space-lg) var(--space-xl);
}

.progress-track {
  height: 4px;
  background: var(--neutral-gray-6);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.progress-fill {
  height: 100%;
  background: var(--brand-primary);
  border-radius: var(--radius-sm);
  transition: width var(--transition-normal);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
}

.step-dot {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-round);
  background: var(--neutral-gray-4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-30);
  transition: all var(--transition-fast);
}

.step-dot.active {
  background: var(--brand-primary);
  color: var(--neutral-white);
}

.step-dot.completed {
  background: var(--success);
  color: var(--neutral-white);
}

.wizard-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-xl);
}

.wizard-step {
  animation: fadeIn var(--transition-normal);
}

.wizard-step h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--neutral-gray-70);
  margin-bottom: var(--space-xs);
}

.wizard-step > p {
  color: var(--neutral-gray-30);
  margin-bottom: var(--space-xl);
}

/* Welcome */
.welcome-icon {
  font-size: 64px;
  text-align: center;
  margin-bottom: var(--space-lg);
}

.feature-list {
  list-style: none;
  padding: 0;
  text-align: left;
  max-width: 320px;
  margin: 0 auto;
}

.feature-list li {
  padding: var(--space-sm) 0;
  color: var(--neutral-gray-50);
}

/* Provider Grid */
.provider-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.provider-card {
  padding: var(--space-lg);
  background: var(--neutral-white);
  border: 2px solid var(--neutral-gray-6);
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: center;
  transition: all var(--transition-fast);
}

.provider-card:hover {
  border-color: var(--neutral-gray-8);
}

.provider-card.selected {
  border-color: var(--brand-primary);
  background: var(--brand-light);
}

.provider-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-sm);
  font-size: 32px;
}

.provider-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.provider-name {
  display: block;
  font-weight: 600;
  color: var(--neutral-gray-70);
  margin-bottom: var(--space-xs);
}

.provider-desc {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-30);
}

/* Forms */
.form-group {
  margin-bottom: var(--space-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--neutral-gray-50);
  margin-bottom: var(--space-sm);
}

.input {
  width: 100%;
  padding: var(--space-md);
  font-size: var(--font-size-base);
  border: 1px solid var(--neutral-gray-8);
  border-radius: var(--radius-sm);
  background: var(--neutral-white);
}

.input:focus {
  outline: none;
  border-color: var(--brand-primary);
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.helper-link {
  display: inline-block;
  margin-top: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--brand-primary);
  text-decoration: none;
}

.helper-link:hover {
  text-decoration: underline;
}

.form-actions {
  margin-top: var(--space-lg);
}

.error-message {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: #fee;
  color: var(--error);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

/* Models */
.model-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--neutral-gray-6);
  border-radius: var(--radius-sm);
}

.model-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  cursor: pointer;
  border-bottom: 1px solid var(--neutral-gray-4);
}

.model-item:hover {
  background: var(--neutral-gray-2);
}

.model-item:last-child {
  border-bottom: none;
}

.model-name {
  font-family: monospace;
  font-size: var(--font-size-sm);
}

.custom-models {
  padding: var(--space-lg);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-md);
}

.custom-models p {
  margin-bottom: var(--space-md);
  color: var(--neutral-gray-50);
}

.custom-models .btn {
  margin-top: var(--space-md);
}

/* Persona */
.persona-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Live2D */
.toggle-label {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
  margin-bottom: var(--space-xl);
}

.toggle-label input {
  display: none;
}

.toggle-slider {
  width: 44px;
  height: 24px;
  background: var(--neutral-gray-8);
  border-radius: var(--radius-sm);
  position: relative;
  transition: background var(--transition-fast);
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--neutral-white);
  border-radius: var(--radius-round);
  transition: transform var(--transition-fast);
}

.toggle-label input:checked + .toggle-slider {
  background: var(--brand-primary);
}

.toggle-label input:checked + .toggle-slider::after {
  transform: translateX(20px);
}

.live2d-config {
  animation: slideUp var(--transition-normal);
}

.helper-text {
  font-size: var(--font-size-sm);
  color: var(--neutral-gray-30);
  margin-top: var(--space-sm);
}

.helper-text a {
  color: var(--brand-primary);
}

.upload-area {
  padding: var(--space-xl);
  border: 2px dashed var(--neutral-gray-8);
  border-radius: var(--radius-md);
  text-align: center;
  color: var(--neutral-gray-30);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.upload-area:hover {
  border-color: var(--brand-primary);
  background: var(--brand-light);
}

.file-input {
  display: none;
}

.file-name {
  color: var(--brand-primary);
  font-weight: 500;
}

/* Complete */
.complete-step {
  text-align: center;
}

.complete-icon {
  font-size: 64px;
  margin-bottom: var(--space-lg);
}

.summary {
  max-width: 360px;
  margin: var(--space-xl) auto;
  text-align: left;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-md);
  background: var(--neutral-gray-4);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
}

.summary-row .label {
  color: var(--neutral-gray-40);
}

.summary-row .value {
  font-weight: 500;
  color: var(--neutral-gray-70);
}

.btn-large {
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-md);
}

/* Footer */
.wizard-footer {
  display: flex;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  border-top: 1px solid var(--neutral-gray-6);
}

.btn-secondary {
  background: var(--neutral-gray-4);
  color: var(--neutral-gray-70);
}

.btn-secondary:hover {
  background: var(--neutral-gray-6);
}
</style>
