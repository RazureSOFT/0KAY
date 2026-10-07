<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useWizardStore } from '../stores/wizard'
import { useConfirm } from '../composables/confirm'

const { t } = useI18n()
const wizard = useWizardStore()
const router = useRouter()
const { confirm } = useConfirm()
const resetting = ref(false)

async function resetAll() {
  if (resetting.value) return
  // The most destructive control in the app; every other destructive path
  // already goes through the shared confirm, this one just never had it.
  const ok = await confirm({
    title: t('settings.reset'),
    message: t('settings.resetConfirmMsg'),
    confirmLabel: t('settings.reset'),
    danger: true,
  })
  if (!ok) return
  resetting.value = true
  try {
    wizard.resetWizard()
    router.push('/')
  } finally {
    resetting.value = false
  }
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
      <button class="btn btn-danger" :disabled="resetting" @click="resetAll">
        {{ t('settings.reset') }}
      </button>
    </div>
  </div>
</template>
