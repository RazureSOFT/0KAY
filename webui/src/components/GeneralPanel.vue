<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLanguage, getLanguage } from '../i18n'
import PairingPanel from './PairingPanel.vue'

const { t, locale } = useI18n()
const currentLang = ref(getLanguage())

function toggleLanguage() {
  const next = currentLang.value === 'en' ? 'zh' : 'en'
  currentLang.value = next
  locale.value = next
  setLanguage(next)
}
</script>

<template>
  <div class="content-card">
    <PairingPanel />
    <h2>{{ t('settings.tabs.general') }}</h2>
    <p class="card-desc">{{ t('settings.generalDesc') }}</p>

    <div class="field">
      <label>{{ t('settings.language') }}</label>
      <div class="segmented">
        <button
          class="seg"
          :class="{ active: currentLang === 'zh' }"
          @click="currentLang = 'zh'; locale = 'zh'; setLanguage('zh')"
        >中文</button>
        <button
          class="seg"
          :class="{ active: currentLang === 'en' }"
          @click="currentLang = 'en'; locale = 'en'; setLanguage('en')"
        >English</button>
      </div>
      <button class="btn btn-ghost lang-swap" @click="toggleLanguage">
        {{ t('settings.switchLang') }}
      </button>
    </div>
  </div>
</template>
