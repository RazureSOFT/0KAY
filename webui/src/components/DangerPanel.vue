<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useWizardStore } from '../stores/wizard'

const { t } = useI18n()
const wizard = useWizardStore()
const router = useRouter()

function resetAll() {
  wizard.resetWizard()
  router.push('/')
}
</script>

<template>
  <div class="content-card danger">
    <h2>{{ t('settings.tabs.danger') }}</h2>
    <p class="card-desc">{{ t('settings.resetDesc') }}</p>

    <div class="danger-box">
      <div>
        <strong>{{ t('settings.reset') }}</strong>
        <p>{{ t('settings.resetWarning') }}</p>
      </div>
      <button class="btn btn-danger" @click="resetAll">
        {{ t('settings.reset') }}
      </button>
    </div>
  </div>
</template>
