<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLanguage, getLanguage, LOCALES } from '../i18n'
import PairingPanel from './PairingPanel.vue'

const { t } = useI18n()
const currentLang = ref(getLanguage())

function changeLanguage(code: string) {
  currentLang.value = code
  setLanguage(code)
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
          v-for="option in LOCALES"
          :key="option.code"
          class="seg"
          :class="{ active: currentLang === option.code }"
          @click="changeLanguage(option.code)"
        >{{ option.label }}</button>
      </div>
    </div>
  </div>
</template>
