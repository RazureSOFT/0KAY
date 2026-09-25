<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALES, setLanguage, getLanguage } from '../i18n'

const emit = defineEmits<{ select: [code: string] }>()
const { t } = useI18n()
const pending = ref(getLanguage())

function confirm() {
  setLanguage(pending.value)
  emit('select', pending.value)
}
</script>

<template>
  <div class="language-page">
    <div class="language-panel">
      <div class="language-logo">
        <svg width="44" height="44" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2"/>
          <path d="M10 16L14 20L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1>{{ t('wizard.chooseLanguage') }}</h1>
      <p class="language-hint">{{ t('wizard.languageHint') }}</p>

      <div class="language-grid">
        <button
          v-for="option in LOCALES"
          :key="option.code"
          class="language-option"
          :class="{ selected: pending === option.code }"
          @click="pending = option.code"
        >
          <span class="language-label">{{ option.label }}</span>
          <span class="language-english">{{ option.english }}</span>
        </button>
      </div>

      <button class="language-continue" @click="confirm">
        {{ t('wizard.continue') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.language-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background:
    radial-gradient(1200px 600px at 50% -10%, color-mix(in srgb, var(--md-primary) 18%, transparent), transparent),
    var(--md-surface);
  z-index: 1000;
}

.language-panel {
  width: min(440px, 100%);
  padding: 40px 32px 32px;
  text-align: center;
  background: var(--md-surface-container-lowest, #fff);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-xl, 20px);
  box-shadow: var(--shadow-16, 0 12px 40px rgba(0, 0, 0, .12));
}

.language-logo {
  display: flex;
  justify-content: center;
  color: var(--md-primary);
  margin-bottom: var(--space-md);
}

.language-panel h1 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: var(--md-on-surface, #253044);
  margin-bottom: var(--space-xs);
}

.language-hint {
  font-size: 13px;
  color: var(--md-on-surface-variant, #657086);
  margin-bottom: var(--space-xl);
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.language-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 18px 12px;
  background: var(--md-surface-container-low, #f8f9fb);
  border: 2px solid var(--md-outline-variant);
  border-radius: 14px;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  transition: border-color .15s, background .15s, transform .1s;
}

.language-option:hover {
  border-color: var(--md-outline, var(--md-outline-variant));
}

.language-option:active {
  transform: scale(.98);
}

.language-option.selected {
  border-color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 10%, transparent);
}

.language-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--md-on-surface, #253044);
}

.language-english {
  font-size: 12px;
  color: var(--md-on-surface-variant, #657086);
}

.language-continue {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  color: var(--md-on-primary, #fff);
  background: var(--md-primary);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: filter .15s, transform .1s;
}

.language-continue:hover {
  filter: brightness(1.05);
}

.language-continue:active {
  transform: translateY(1px);
}
</style>
