<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/wizard'
import AppSelect from './AppSelect.vue'
import { PROVIDERS, WIZARD_STEPS } from '../composables/wizard'
import PinInput from './PinInput.vue'
import { LOCALES, setLanguage, getLanguage } from '../i18n'

const { t } = useI18n()
const wizard = useWizardStore()
const emit = defineEmits<{ complete: [] }>()

const STEP_KEY = ['chooseLanguage', 'welcome', 'selectProvider', 'apiConfig', 'selectModels', 'complete']
const ICONS: Record<number, string> = {
  1: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18',
  2: 'M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2z',
  3: 'M7 18a4 4 0 0 1 .7-7.94A5.5 5.5 0 0 1 18 11.5a3.5 3.5 0 0 1-.5 6.5z',
  4: 'M15 3a6 6 0 0 0-5.6 8.1L4 16.5V20h3.5l5.4-5.4A6 6 0 1 0 15 3zm1.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  5: 'M12 3l9 5-9 5-9-5 9-5zm9 9l-9 5-9-5',
  6: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-4 9l3 3 5-6',
}

const currentLang = ref(getLanguage())
function chooseLanguage(code: string) {
  currentLang.value = code
  setLanguage(code)
}

function stepTitle(id: number) { return t('wizard.' + STEP_KEY[id - 1]) }
function stepDesc(id: number) { return t('wizard.' + STEP_KEY[id - 1] + 'Desc') }
function goStep(id: number) { if (id <= wizard.currentStep) wizard.currentStep = id }

const customModels = ref('')
const isLoading = ref(false)
const error = ref('')
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

const newPin = ref('')
const confirmPin = ref('')
const pinError = ref('')
const savingPin = ref(false)

async function finish() {
  pinError.value = ''
  const pin = newPin.value.trim()
  if (pin) {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) { pinError.value = t('wizard.pinTooShort'); return }
    if (pin !== confirmPin.value.trim()) { pinError.value = t('wizard.pinMismatch'); return }
    savingPin.value = true
    try {
      const res = await fetch('/api/security/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || `HTTP ${res.status}`)
      }
    } catch (e: any) {
      pinError.value = e?.message || String(e)
      savingPin.value = false
      return
    }
    savingPin.value = false
  }
  wizard.completeWizard()
  emit('complete')
}

function onPinComplete() {
  const pin = newPin.value.trim()
  if (pin.length === 6 && pin === confirmPin.value.trim()) void finish()
}

function useCustomModels() {
  const models = customModels.value.split(',').map(m => m.trim()).filter(m => m)
  if (models.length > 0) wizard.setFetchedModels(models)
}
</script>

<template>
  <div class="wizard-overlay">
    <div class="wizard-sheet">
            <aside class="wizard-rail">
        <div class="rail-brand">
          <img class="brand-mark" src="/okay-logo.svg" alt="" width="44" height="44" />
          <div class="brand-text">
            <strong>{{ t('wizard.title') }}</strong>
            <span>{{ t('wizard.subtitle') }}</span>
          </div>
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
          <div class="track"><div class="fill" :style="{ transform: `scaleX(${progress / 100})` }"></div></div>
        </div>
      </aside>

            <section class="wizard-body">
        <header class="body-head">
          <span class="eyebrow">{{ t('wizard.title') }} · {{ wizard.currentStep }}/{{ wizard.totalSteps }}</span>
          <h1>{{ stepTitle(wizard.currentStep) }}</h1>
          <p>{{ stepDesc(wizard.currentStep) }}</p>
        </header>

        <div class="wizard-scroll">
                    <div v-if="wizard.currentStep === 1" class="pane">
            <div class="lang-grid">
              <button
                v-for="option in LOCALES"
                :key="option.code"
                class="lang-card"
                :class="{ selected: currentLang === option.code }"
                @click="chooseLanguage(option.code)"
              >
                <span class="lang-text">
                  <b>{{ option.label }}</b>
                  <span>{{ option.english }}</span>
                </span>
                <span class="lang-check" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </button>
            </div>
            <p class="lead">{{ t('wizard.languageHint') }}</p>
          </div>

                    <div v-if="wizard.currentStep === 2" class="pane">
            <div class="feature-grid">
              <div class="feature">
                <span class="feature-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 18a4 4 0 0 1 .7-7.94A5.5 5.5 0 0 1 18 11.5a3.5 3.5 0 0 1-.5 6.5z" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                <b>{{ t('wizard.featureProvider') }}</b>
              </div>
              <div class="feature">
                <span class="feature-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg></span>
                <b>{{ t('wizard.featureChat') }}</b>
              </div>
            </div>
            <p class="lead">{{ t('wizard.welcomeDesc') }}</p>
          </div>

                    <div v-if="wizard.currentStep === 3" class="pane">
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

                    <div v-if="wizard.currentStep === 4" class="pane">
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

                    <div v-if="wizard.currentStep === 5" class="pane">
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

                    <div v-if="wizard.currentStep === 6" class="pane complete">
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
            </div>

            <div class="pin-card">
              <h3>{{ t('wizard.pinTitle') }}</h3>
              <p class="pin-hint">{{ t('wizard.pinHint') }}</p>
              <div class="pin-row">
                <div class="pin-field">
                  <label class="pin-label">{{ t('wizard.pinNew') }}</label>
                  <PinInput v-model="newPin" autofocus />
                </div>
                <div class="pin-field">
                  <label class="pin-label">{{ t('wizard.pinConfirm') }}</label>
                  <PinInput v-model="confirmPin" @complete="onPinComplete" />
                </div>
              </div>
              <p v-if="pinError" class="pin-error">{{ pinError }}</p>
            </div>
          </div>
        </div>

        <footer class="wizard-footer">
          <button class="btn btn-tonal" @click="wizard.prevStep()" :disabled="wizard.currentStep === 1">{{ t('wizard.back') }}</button>
          <div class="footer-right">
                        <p v-if="!wizard.canProceed && wizard.blockedHint" class="blocked-hint" role="status">{{ t(wizard.blockedHint) }}</p>
            <button v-if="wizard.currentStep < 6" class="btn btn-primary" @click="wizard.nextStep()" :disabled="!wizard.canProceed">{{ t('wizard.next') }}</button>
            <button v-else class="btn btn-primary" :disabled="savingPin" @click="finish">{{ t('wizard.startChatting') }}</button>
          </div>
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
  height: min(90vh, 760px);
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: minmax(0, 1fr);
  background: var(--md-surface-container-low);
  border-radius: 32px;
  box-shadow: var(--shadow-4, 0 24px 64px rgba(24, 16, 48, 0.28));
  overflow: hidden;
  animation: sheet-in 380ms var(--ease-spring, cubic-bezier(.22,1.3,.36,1)) both;
}

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
  display: block;
  /* The logo is its own tile; cover keeps its silhouette inside the brand
     radius instead of framing a second one around it. */
  object-fit: cover;
  border-radius: 15px 15px 15px 5px;
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
#app .step-title { font-size: 14px; font-weight: 650; }
#app .step-desc { font-size: 12px; opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

#app .rail-progress { padding: 0 6px; }
#app .rail-progress > span { font-size: 12px; color: var(--md-on-surface-variant); }
#app .rail-progress .track { height: 6px; margin-top: 6px; border-radius: 999px; background: var(--md-surface-container-highest); overflow: hidden; }
#app .rail-progress .fill { height: 100%; width: 100%; transform-origin: left; border-radius: 999px; background: var(--md-primary); transition: transform var(--duration-long) var(--ease-spring); }

#app .wizard-body { display: flex; flex-direction: column; min-width: 0; min-height: 0; background: var(--md-surface); }
#app .body-head { padding: 28px 32px 16px; }
#app .body-head .eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--md-primary); }
#app .body-head h1 { margin: 6px 0 4px; font-size: 26px; font-weight: 750; letter-spacing: -0.5px; color: var(--md-on-surface); }
#app .body-head p { margin: 0; font-size: 14px; color: var(--md-on-surface-variant); }

#app .wizard-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 8px 32px 20px; }
#app .pane { display: flex; flex-direction: column; gap: 16px; animation: pane-in 260ms var(--ease-spring, ease) both; }

#app .lang-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
#app .lang-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  min-height: 0;
  border: 2px solid var(--md-outline-variant);
  border-radius: 20px;
  background: var(--md-surface-container-low);
  cursor: pointer;
  text-align: left;
  transition: border-color 180ms, background-color 180ms, border-radius 320ms var(--ease-spring, ease);
}
#app .lang-card:hover { border-color: var(--md-outline); }
#app .lang-card.selected { border-color: var(--md-primary); background: var(--md-primary-container); border-radius: 24px 24px 24px 8px; }
#app .lang-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
#app .lang-text b { font-size: 15px; }
#app .lang-text span { font-size: 12px; color: var(--md-on-surface-variant); }
#app .lang-card.selected .lang-text span { color: var(--md-on-primary-container); opacity: 0.8; }
#app .lang-check { position: absolute; top: 12px; right: 12px; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: var(--md-primary); color: var(--md-on-primary); opacity: 0; transform: scale(0.6); transition: opacity 180ms, transform 260ms var(--ease-spring, ease); }
#app .lang-card.selected .lang-check { opacity: 1; transform: scale(1); }

#app .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
#app .feature { display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: 20px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); }
#app .feature-icon { width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center; background: var(--md-primary-container); color: var(--md-on-primary-container); }
#app .feature b { font-size: 14px; font-weight: 600; line-height: 1.4; }
#app .lead { margin: 0; color: var(--md-on-surface-variant); font-size: 14px; line-height: 1.6; }

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

#app .field { display: flex; flex-direction: column; }
#app .field > label { font-size: 13px; font-weight: 600; color: var(--md-on-surface-variant); margin-bottom: 7px; }
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
#app .helper-link { display: inline-block; margin-top: 8px; font-size: 13px; font-weight: 600; color: var(--md-primary); text-decoration: none; }
#app .helper-link:hover { text-decoration: underline; }
#app .helper-text { margin: 8px 0 0; font-size: 13px; color: var(--md-on-surface-variant); }
#app .helper-text a { color: var(--md-primary); }
#app .alert { padding: 12px 14px; border-radius: 14px; background: var(--md-error-container); color: var(--md-on-error-container); font-size: 13px; }

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

#app .switch-row { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 18px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); cursor: pointer; }
#app .switch-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
#app .switch-text b { font-size: 14px; }
#app .switch-text span { font-size: 13px; color: var(--md-on-surface-variant); }
#app .switch input { display: none; }
#app .switch-track { display: block; width: 50px; height: 30px; border-radius: 999px; background: var(--md-outline-variant); transition: background-color 200ms; position: relative; }
#app .switch-thumb { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: transform 240ms var(--ease-spring, ease); }
#app .switch input:checked + .switch-track { background: var(--md-primary); }
#app .switch input:checked + .switch-track .switch-thumb { transform: translateX(20px); }
#app .dropzone { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 22px; border: 2px dashed var(--md-outline-variant); border-radius: 18px; color: var(--md-on-surface-variant); text-align: center; cursor: pointer; transition: border-color 180ms, background-color 180ms; }
#app .dropzone:hover { border-color: var(--md-primary); background: var(--md-surface-container-low); color: var(--md-primary); }
#app .hidden-input { display: none; }
#app .file-name { color: var(--md-primary); font-weight: 600; }

#app .complete { align-items: center; text-align: center; }
#app .complete-emblem { width: 76px; height: 76px; border-radius: 26px 26px 26px 8px; display: grid; place-items: center; background: var(--md-success-container); color: #0d1f06; animation: emblem-in 500ms var(--ease-spring, ease) both; }
#app .summary { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 8px; }
#app .summary-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; border-radius: 14px; background: var(--md-surface-container-low); }
#app .summary-row .label { color: var(--md-on-surface-variant); font-size: 13px; }
#app .summary-row .value { font-weight: 650; font-size: 14px; }

#app .wizard-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 32px; border-top: 1px solid var(--md-outline-variant); background: var(--md-surface); }
#app .wizard-footer .btn-primary { background: var(--md-primary); color: var(--md-on-primary); }
.footer-right { display: flex; align-items: center; gap: 14px; min-width: 0; }
.blocked-hint { margin: 0; font-size: 12.5px; color: var(--md-error); text-align: right; }

@keyframes sheet-in { from { opacity: 0; transform: translateY(22px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes pane-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes emblem-in { from { opacity: 0; transform: scale(.6) rotate(-10deg); } to { opacity: 1; transform: scale(1) rotate(0); } }

@media (max-width: 860px) {
  #app .wizard-sheet { grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr); height: 94vh; }
  #app .wizard-rail { border-right: 0; border-bottom: 1px solid var(--md-outline-variant); }
  #app .steps { flex-direction: row; overflow-x: auto; }
  #app .step-desc { display: none; }
  #app .feature-grid, #app .pv-grid { grid-template-columns: 1fr 1fr; }
}

#app .pin-card {
  margin-top: 18px;
  padding: 16px 18px;
  border: 1px solid var(--md-outline-variant);
  border-radius: 16px;
  background: var(--md-surface-container-low);
}
#app .pin-card h3 { margin: 0 0 4px; font-size: 15px; font-weight: 700; }
#app .pin-hint { margin: 0 0 12px; font-size: 12.5px; color: var(--md-on-surface-variant); }
#app .pin-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
#app .pin-field { display: flex; flex-direction: column; gap: 6px; }
#app .pin-label { font-size: 12px; font-weight: 600; color: var(--md-on-surface-variant); }
#app .pin-error { margin: 10px 0 0; color: var(--md-error); font-size: 12.5px; }
@media (max-width: 640px) { #app .pin-row { grid-template-columns: 1fr; } }
</style>
