<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/wizard'
import AppSelect from './AppSelect.vue'
import { PROVIDERS, WIZARD_STEPS } from '../composables/wizard'

const { t } = useI18n()
const wizard = useWizardStore()
const emit = defineEmits<{ complete: []; language: [] }>()

const STEP_KEY = ['welcome', 'selectProvider', 'apiConfig', 'selectModels', 'createPersona', 'live2d', 'complete']
const ICONS: Record<number, string> = {
  1: 'M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2z',
  2: 'M7 18a4 4 0 0 1 .7-7.94A5.5 5.5 0 0 1 18 11.5a3.5 3.5 0 0 1-.5 6.5z',
  3: 'M15 3a6 6 0 0 0-5.6 8.1L4 16.5V20h3.5l5.4-5.4A6 6 0 1 0 15 3zm1.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  4: 'M12 3l9 5-9 5-9-5 9-5zm9 9l-9 5-9-5',
  5: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0',
  6: 'M4 5h16v14H4zM4 15l5-5 3 3 3-3 5 5',
  7: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-4 9l3 3 5-6',
}

function stepTitle(id: number) { return t('wizard.' + STEP_KEY[id - 1]) }
function stepDesc(id: number) { return t('wizard.' + STEP_KEY[id - 1] + 'Desc') }
function goStep(id: number) { if (id <= wizard.currentStep) wizard.currentStep = id }

const customModels = ref('')
const isLoading = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFileName = ref('')
const folderInput = ref<HTMLInputElement | null>(null)
const uploadingFolder = ref(false)
const folderMessage = ref('')

function openFilePicker() { fileInput.value?.click() }

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
})

const progress = computed(() => ((wizard.currentStep - 1) / (wizard.totalSteps - 1)) * 100)

function selectProvider(provider: any) { wizard.setProvider(provider.id, provider.baseUrl) }
function getProviderName(id: string): string { return t(`providers.${id}.name`) }
function getProviderDesc(id: string): string { return t(`providers.${id}.description`) }

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
      body: JSON.stringify({ provider: wizard.provider, base_url: wizard.baseUrl, api_key: wizard.apiKey }),
    })
    if (!response.ok) throw new Error('Failed to fetch models')
    const data = await response.json()
    wizard.setFetchedModels(data.models || [])
  } catch (e: any) {
    error.value = e.message || t('wizard.fetchFailed')
    const selectedProvider = PROVIDERS.find(p => p.id === wizard.provider)
    if (selectedProvider) wizard.setFetchedModels(selectedProvider.defaultModels)
  } finally {
    isLoading.value = false
  }
}

function toggleModel(model: string) {
  const idx = wizard.selectedModels.indexOf(model)
  if (idx > -1) wizard.selectedModels.splice(idx, 1)
  else wizard.selectedModels.push(model)
}

function finish() {
  wizard.completeWizard()
  emit('complete')
}

function useCustomModels() {
  const models = customModels.value.split(',').map(m => m.trim()).filter(m => m)
  if (models.length > 0) wizard.setFetchedModels(models)
}

function openLanguage() { emit('language') }
</script>

<template>
  <div class="wizard-overlay">
    <div class="wizard-sheet">
      <!-- Step rail -->
      <aside class="wizard-rail">
        <div class="rail-brand">
          <span class="brand-mark">0K</span>
          <div class="brand-text">
            <strong>{{ t('wizard.title') }}</strong>
            <span>{{ t('wizard.subtitle') }}</span>
          </div>
          <button class="icon-btn" :title="t('settings.language')" :aria-label="t('settings.language')" @click="openLanguage">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <ol class="steps">
          <li v-for="step in WIZARD_STEPS" :key="step.id">
            <button
              class="step"
              :class="{ active: step.id === wizard.currentStep, done: step.id < wizard.currentStep }"
              :disabled="step.id > wizard.currentStep"
              @click="goStep(step.id)"
            >
              <span class="step-ind">
                <svg v-if="step.id < wizard.currentStep" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"><path :d="ICONS[step.id]" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="step-text">
                <span class="step-title">{{ stepTitle(step.id) }}</span>
                <span class="step-desc">{{ stepDesc(step.id) }}</span>
              </span>
            </button>
          </li>
        </ol>

        <div class="rail-progress">
          <span>{{ wizard.currentStep }} / {{ wizard.totalSteps }}</span>
          <div class="track"><div class="fill" :style="{ width: `${progress}%` }"></div></div>
        </div>
      </aside>

      <!-- Body -->
      <section class="wizard-body">
        <header class="body-head">
          <span class="eyebrow">{{ t('wizard.title') }} · {{ wizard.currentStep }}/{{ wizard.totalSteps }}</span>
          <h1>{{ stepTitle(wizard.currentStep) }}</h1>
          <p>{{ stepDesc(wizard.currentStep) }}</p>
        </header>

        <div class="wizard-scroll">
          <!-- Step 1: Welcome -->
          <div v-if="wizard.currentStep === 1" class="pane">
            <div class="feature-grid">
              <div class="feature">
                <span class="feature-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 18a4 4 0 0 1 .7-7.94A5.5 5.5 0 0 1 18 11.5a3.5 3.5 0 0 1-.5 6.5z" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                <b>{{ t('wizard.featureProvider') }}</b>
              </div>
              <div class="feature">
                <span class="feature-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                <b>{{ t('wizard.featurePersona') }}</b>
              </div>
              <div class="feature">
                <span class="feature-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg></span>
                <b>{{ t('wizard.featureChat') }}</b>
              </div>
            </div>
            <p class="lead">{{ t('wizard.welcomeDesc') }}</p>
          </div>

          <!-- Step 2: Provider -->
          <div v-if="wizard.currentStep === 2" class="pane">
            <div class="pv-grid">
              <button
                v-for="p in PROVIDERS"
                :key="p.id"
                class="pv-card"
                :class="{ selected: wizard.provider === p.id }"
                @click="selectProvider(p)"
              >
                <span class="pv-icon">
                  <img v-if="p.logo" :src="p.logo" :alt="p.name" class="pv-logo" />
                  <span v-else class="pv-glyph">{{ p.name.charAt(0) }}</span>
                </span>
                <span class="pv-text">
                  <b>{{ getProviderName(p.id) }}</b>
                  <span>{{ getProviderDesc(p.id) }}</span>
                </span>
                <span class="pv-check" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </button>
            </div>
          </div>

          <!-- Step 3: API -->
          <div v-if="wizard.currentStep === 3" class="pane">
            <div class="field">
              <label>{{ t('wizard.apiKey') }}</label>
              <input type="password" v-model="wizard.apiKey" :placeholder="t('wizard.apiKeyPlaceholder')" class="wiz-input" />
              <a
                v-if="wizard.provider !== 'custom'"
                :href="PROVIDERS.find(p => p.id === wizard.provider)?.apiKeyUrl"
                target="_blank"
                class="helper-link"
              >{{ t('wizard.getApiKey') }}</a>
            </div>

            <div class="field">
              <label>{{ t('wizard.baseUrl') }}</label>
              <input type="text" v-model="wizard.baseUrl" :placeholder="t('wizard.baseUrlPlaceholder')" class="wiz-input" />
            </div>

            <button class="btn btn-tonal" @click="fetchModels" :disabled="isLoading">
              {{ isLoading ? t('wizard.fetching') : t('wizard.fetchModels') }}
            </button>

            <div v-if="error" class="alert">{{ error }}</div>
          </div>

          <!-- Step 4: Models -->
          <div v-if="wizard.currentStep === 4" class="pane">
            <div v-if="wizard.fetchedModels.length > 0" class="model-list">
              <label v-for="model in wizard.fetchedModels" :key="model" class="model-item" :class="{ chosen: wizard.selectedModels.includes(model) }">
                <input type="checkbox" :checked="wizard.selectedModels.includes(model)" @change="toggleModel(model)" />
                <span class="model-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                <span class="model-name">{{ model }}</span>
              </label>
            </div>

            <div v-else class="custom-models">
              <p>{{ t('wizard.noModels') }}</p>
              <input v-model="customModels" placeholder="model1, model2, model3" class="wiz-input" />
              <button class="btn btn-tonal" @click="useCustomModels">{{ t('wizard.useModels') }}</button>
            </div>

            <div v-if="wizard.selectedModels.length > 0" class="field">
              <label>{{ t('wizard.defaultModel') }}</label>
              <AppSelect v-model="wizard.defaultModel" class="wiz-input" :aria-label="t('wizard.defaultModel')" :options="wizard.selectedModels" />
            </div>
          </div>

          <!-- Step 5: Persona -->
          <div v-if="wizard.currentStep === 5" class="pane">
            <div class="form-row">
              <div class="field">
                <label>{{ t('wizard.name') }} *</label>
                <input v-model="wizard.persona.name" :placeholder="t('wizard.namePlaceholder')" class="wiz-input" />
              </div>
              <div class="field">
                <label>{{ t('wizard.birthDate') }}</label>
                <input v-model="wizard.persona.birthDate" type="date" class="wiz-input" />
              </div>
            </div>
            <div class="field">
              <label>{{ t('wizard.avatarUrl') }}</label>
              <input v-model="wizard.persona.avatar" :placeholder="t('wizard.avatarPlaceholder')" class="wiz-input" />
            </div>
            <div class="field">
              <label>{{ t('wizard.description') }}</label>
              <textarea v-model="wizard.persona.description" :placeholder="t('wizard.descriptionPlaceholder')" class="wiz-input" rows="3"></textarea>
            </div>
            <div class="field">
              <label>{{ t('wizard.personality') }}</label>
              <textarea v-model="wizard.persona.personality" :placeholder="t('wizard.personalityPlaceholder')" class="wiz-input" rows="3"></textarea>
            </div>
            <div class="field">
              <label>{{ t('wizard.greeting') }}</label>
              <textarea v-model="wizard.persona.greeting" :placeholder="t('wizard.greetingPlaceholder')" class="wiz-input" rows="2"></textarea>
            </div>
          </div>

          <!-- Step 6: Live2D -->
          <div v-if="wizard.currentStep === 6" class="pane">
            <label class="switch-row">
              <span class="switch-text">
                <b>{{ t('wizard.enableLive2d') }}</b>
                <span>{{ t('wizard.live2dDesc') }}</span>
              </span>
              <span class="switch">
                <input type="checkbox" v-model="wizard.live2d.enabled" />
                <span class="switch-track"><span class="switch-thumb"></span></span>
              </span>
            </label>

            <div v-if="wizard.live2d.enabled" class="live2d-config">
              <div class="field">
                <label>{{ t('wizard.modelUrl') }}</label>
                <input v-model="wizard.live2d.modelUrl" :placeholder="t('wizard.modelUrlPlaceholder')" class="wiz-input" />
                <p class="helper-text">
                  {{ t('wizard.live2dHelp') }}
                  <a href="https://www.live2d.com/en/learn/sample/" target="_blank">{{ t('wizard.live2dSamples') }}</a>
                </p>
              </div>

              <div class="field">
                <label>{{ t('wizard.orUpload') }}</label>
                <div class="dropzone" @click="openFilePicker">
                  <input ref="fileInput" type="file" accept=".moc3,.model3.json" @change="onFileSelected" class="hidden-input" />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span v-if="uploadedFileName" class="file-name">{{ uploadedFileName }}</span>
                  <span v-else>{{ t('wizard.uploadHint') }}</span>
                </div>
              </div>

              <div class="field">
                <label>{{ t('wizard.uploadFolder') }}</label>
                <div class="dropzone" @click="openFolderPicker">
                  <input ref="folderInput" type="file" webkitdirectory directory multiple hidden @change="onFolderSelected" />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>
                  <span>{{ uploadingFolder ? t('wizard.uploading') : t('wizard.uploadFolderHint') }}</span>
                </div>
                <p v-if="folderMessage" class="helper-text">{{ folderMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Step 7: Complete -->
          <div v-if="wizard.currentStep === 7" class="pane complete">
            <div class="complete-emblem">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <p class="lead">{{ t('wizard.completeDesc') }}</p>
            <div class="summary">
              <div class="summary-row">
                <span class="label">{{ t('wizard.provider') }}</span>
                <span class="value">{{ getProviderName(wizard.provider) || wizard.provider || '—' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">{{ t('wizard.defaultModel') }}</span>
                <span class="value">{{ wizard.defaultModel || '—' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">{{ t('wizard.name') }}</span>
                <span class="value">{{ wizard.persona.name || '—' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">{{ t('wizard.live2d') }}</span>
                <span class="value">{{ wizard.live2d.enabled ? '✓' : '✗' }}</span>
              </div>
            </div>
          </div>
        </div>

        <footer class="wizard-footer">
          <button class="btn btn-tonal" @click="wizard.prevStep()" :disabled="wizard.currentStep === 1">{{ t('wizard.back') }}</button>
          <button v-if="wizard.currentStep < 7" class="btn btn-primary" @click="wizard.nextStep()" :disabled="!wizard.canProceed">{{ t('wizard.next') }}</button>
          <button v-else class="btn btn-primary" @click="finish">{{ t('wizard.startChatting') }}</button>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
#app .wizard-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: color-mix(in srgb, var(--md-surface) 30%, #1a1530 60%);
  backdrop-filter: blur(10px);
  animation: fadeIn 200ms ease-out;
}

#app .wizard-sheet {
  width: min(940px, 100%);
  max-height: min(90vh, 760px);
  display: grid;
  grid-template-columns: 300px 1fr;
  background: var(--md-surface-container-low);
  border-radius: 32px;
  box-shadow: var(--shadow-4, 0 24px 64px rgba(24, 16, 48, 0.28));
  overflow: hidden;
  animation: sheet-in 380ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
}

/* Rail */
#app .wizard-rail {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 18px;
  background: var(--md-surface-container);
  border-right: 1px solid var(--md-outline-variant);
}
#app .rail-brand { display: flex; align-items: center; gap: 12px; padding: 0 6px; }
#app .brand-mark {
  flex: none;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 15px 15px 15px 5px;
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-weight: 750;
  letter-spacing: -0.5px;
}
#app .brand-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
#app .brand-text strong { font-size: 15px; }
#app .brand-text span { font-size: 12px; color: var(--md-on-surface-variant); }
#app .icon-btn {
  flex: none;
  width: 38px;
  height: 38px;
  min-height: 0;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 12px;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  cursor: pointer;
}
#app .icon-btn:hover { background: var(--md-surface-container-highest); }

#app .steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; flex: 1; }
#app .step {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  min-height: 0;
  border: none;
  border-radius: 18px;
  background: transparent;
  color: var(--md-on-surface-variant);
  text-align: left;
  cursor: pointer;
  transition: background-color 200ms, color 200ms, border-radius 350ms var(--ease-spring, ease);
}
#app .step:disabled { cursor: default; opacity: 0.55; }
#app .step.active { background: var(--md-primary-container); color: var(--md-on-primary-container); border-radius: 22px 22px 22px 8px; }
#app .step.done { color: var(--md-on-surface); }
#app .step-ind {
  flex: none;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
  transition: background-color 200ms, color 200ms, transform 300ms var(--ease-spring, ease);
}
#app .step.active .step-ind { background: var(--md-primary); color: var(--md-on-primary); transform: scale(1.05); }
#app .step.done .step-ind { background: var(--md-success-container); color: #0d1f06; }
#app .step-text { display: flex; flex-direction: column; min-width: 0; }
#app .step-title { font-size: 13.5px; font-weight: 650; }
#app .step-desc { font-size: 11.5px; opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

#app .rail-progress { padding: 0 6px; }
#app .rail-progress > span { font-size: 11px; color: var(--md-on-surface-variant); }
#app .rail-progress .track { height: 6px; margin-top: 6px; border-radius: 999px; background: var(--md-surface-container-highest); overflow: hidden; }
#app .rail-progress .fill { height: 100%; border-radius: 999px; background: var(--md-primary); transition: width 400ms var(--ease-spring, ease); }

/* Body */
#app .wizard-body { display: flex; flex-direction: column; min-width: 0; background: var(--md-surface); }
#app .body-head { padding: 28px 32px 16px; }
#app .body-head .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--md-primary); }
#app .body-head h1 { margin: 6px 0 4px; font-size: 26px; font-weight: 750; letter-spacing: -0.5px; color: var(--md-on-surface); }
#app .body-head p { margin: 0; font-size: 14px; color: var(--md-on-surface-variant); }

#app .wizard-scroll { flex: 1; overflow-y: auto; padding: 8px 32px 20px; }
#app .pane { display: flex; flex-direction: column; gap: 16px; animation: pane-in 260ms var(--ease-spring, ease) both; }

/* Welcome */
#app .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
#app .feature { display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: 20px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); }
#app .feature-icon { width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center; background: var(--md-primary-container); color: var(--md-on-primary-container); }
#app .feature b { font-size: 13.5px; font-weight: 600; line-height: 1.4; }
#app .lead { margin: 0; color: var(--md-on-surface-variant); font-size: 14px; line-height: 1.6; }

/* Provider */
#app .pv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
#app .pv-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  min-height: 0;
  border: 2px solid var(--md-outline-variant);
  border-radius: 20px;
  background: var(--md-surface-container-low);
  cursor: pointer;
  text-align: left;
  transition: border-color 180ms, background-color 180ms, border-radius 320ms var(--ease-spring, ease);
}
#app .pv-card:hover { border-color: var(--md-outline); }
#app .pv-card.selected { border-color: var(--md-primary); background: var(--md-primary-container); border-radius: 24px 24px 24px 8px; }
#app .pv-icon { flex: none; width: 46px; height: 46px; border-radius: 15px; display: grid; place-items: center; background: var(--md-surface-container-lowest); overflow: hidden; }
#app .pv-logo { width: 30px; height: 30px; object-fit: contain; }
#app .pv-glyph { font-size: 20px; font-weight: 700; color: var(--md-primary); }
#app .pv-text { display: flex; flex-direction: column; min-width: 0; }
#app .pv-text b { font-size: 14px; }
#app .pv-text span { font-size: 12px; color: var(--md-on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#app .pv-card.selected .pv-text span { color: var(--md-on-primary-container); opacity: 0.8; }
#app .pv-check { position: absolute; top: 12px; right: 12px; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: var(--md-primary); color: var(--md-on-primary); opacity: 0; transform: scale(0.6); transition: opacity 180ms, transform 260ms var(--ease-spring, ease); }
#app .pv-card.selected .pv-check { opacity: 1; transform: scale(1); }

/* Fields */
#app .field { display: flex; flex-direction: column; }
#app .field > label { font-size: 12.5px; font-weight: 600; color: var(--md-on-surface-variant); margin-bottom: 7px; }
#app .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
#app .wiz-input {
  width: 100%;
  min-height: 48px;
  padding: 13px 15px;
  font-family: inherit;
  font-size: 14px;
  color: var(--md-on-surface);
  border: 1px solid var(--md-outline-variant);
  border-radius: 14px;
  background: var(--md-surface-container-low);
  transition: border-color 180ms, box-shadow 180ms, background-color 180ms;
}
#app .wiz-input:focus { outline: none; border-color: var(--md-primary); background: var(--md-surface-container-lowest); box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-primary) 12%, transparent); }
#app textarea.wiz-input { resize: vertical; min-height: 80px; }
#app .helper-link { display: inline-block; margin-top: 8px; font-size: 12.5px; font-weight: 600; color: var(--md-primary); text-decoration: none; }
#app .helper-link:hover { text-decoration: underline; }
#app .helper-text { margin: 8px 0 0; font-size: 12.5px; color: var(--md-on-surface-variant); }
#app .helper-text a { color: var(--md-primary); }
#app .alert { padding: 12px 14px; border-radius: 14px; background: var(--md-error-container); color: #410e0b; font-size: 13px; }

/* Models */
#app .model-list { display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; padding-right: 2px; }
#app .model-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); cursor: pointer; transition: border-color 160ms, background-color 160ms; }
#app .model-item:hover { border-color: var(--md-outline); }
#app .model-item.chosen { border-color: var(--md-primary); background: var(--md-primary-container); }
#app .model-item input { display: none; }
#app .model-check { flex: none; width: 20px; height: 20px; border-radius: 7px; display: grid; place-items: center; background: var(--md-surface-container-highest); color: transparent; transition: background-color 160ms, color 160ms; }
#app .model-item.chosen .model-check { background: var(--md-primary); color: var(--md-on-primary); }
#app .model-name { font-family: ui-monospace, monospace; font-size: 13px; }
#app .custom-models { padding: 16px; border-radius: 16px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); display: flex; flex-direction: column; gap: 12px; }
#app .custom-models p { margin: 0; color: var(--md-on-surface-variant); font-size: 13px; }

/* Live2D switch + dropzone */
#app .switch-row { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 18px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); cursor: pointer; }
#app .switch-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
#app .switch-text b { font-size: 14px; }
#app .switch-text span { font-size: 12.5px; color: var(--md-on-surface-variant); }
#app .switch input { display: none; }
#app .switch-track { display: block; width: 50px; height: 30px; border-radius: 999px; background: var(--md-outline-variant); transition: background-color 200ms; position: relative; }
#app .switch-thumb { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: transform 240ms var(--ease-spring, ease); }
#app .switch input:checked + .switch-track { background: var(--md-primary); }
#app .switch input:checked + .switch-track .switch-thumb { transform: translateX(20px); }
#app .live2d-config { display: flex; flex-direction: column; gap: 16px; animation: pane-in 240ms ease both; }
#app .dropzone { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 22px; border: 2px dashed var(--md-outline-variant); border-radius: 18px; color: var(--md-on-surface-variant); text-align: center; cursor: pointer; transition: border-color 180ms, background-color 180ms; }
#app .dropzone:hover { border-color: var(--md-primary); background: var(--md-surface-container-low); color: var(--md-primary); }
#app .hidden-input { display: none; }
#app .file-name { color: var(--md-primary); font-weight: 600; }

/* Complete */
#app .complete { align-items: center; text-align: center; }
#app .complete-emblem { width: 76px; height: 76px; border-radius: 26px 26px 26px 8px; display: grid; place-items: center; background: var(--md-success-container); color: #0d1f06; animation: emblem-in 500ms var(--ease-spring, ease) both; }
#app .summary { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 8px; }
#app .summary-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; border-radius: 14px; background: var(--md-surface-container-low); }
#app .summary-row .label { color: var(--md-on-surface-variant); font-size: 13px; }
#app .summary-row .value { font-weight: 650; font-size: 13.5px; }

/* Footer */
#app .wizard-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 32px; border-top: 1px solid var(--md-outline-variant); background: var(--md-surface); }
#app .wizard-footer .btn-primary { background: var(--md-primary); color: var(--md-on-primary); }

@keyframes sheet-in { from { opacity: 0; transform: translateY(22px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes pane-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes emblem-in { from { opacity: 0; transform: scale(.6) rotate(-10deg); } to { opacity: 1; transform: scale(1) rotate(0); } }

@media (max-width: 860px) {
  #app .wizard-sheet { grid-template-columns: 1fr; max-height: 94vh; }
  #app .wizard-rail { border-right: 0; border-bottom: 1px solid var(--md-outline-variant); }
  #app .steps { flex-direction: row; overflow-x: auto; }
  #app .step-desc { display: none; }
  #app .feature-grid, #app .pv-grid { grid-template-columns: 1fr 1fr; }
}
</style>
