<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/wizard'
import { useSettingsMeta } from '../composables/settingsMeta'

const { t } = useI18n()
const wizard = useWizardStore()
const { tabLabel, tabMeta } = useSettingsMeta()
</script>

<template>
  <div class="content-card">
    <h2>{{ tabLabel('persona') }}</h2>
    <p class="card-desc">{{ tabMeta('persona')?.descriptionKey ? t(tabMeta('persona')!.descriptionKey!) : t('settings.personaDesc') }}</p>

    <div class="field-row">
      <div class="field">
        <label>{{ t('wizard.name') }}</label>
        <input v-model="wizard.persona.name" :placeholder="t('wizard.namePlaceholder')" class="input" />
      </div>
      <div class="field">
        <label>{{ t('wizard.avatarUrl') }}</label>
        <input v-model="wizard.persona.avatar" :placeholder="t('wizard.avatarPlaceholder')" class="input" />
      </div>
      <div class="field">
        <label>出生日期</label>
        <input v-model="wizard.persona.birthDate" type="date" class="input" />
      </div>
    </div>

    <div class="field">
      <label>{{ t('wizard.description') }}</label>
      <textarea v-model="wizard.persona.description" :placeholder="t('wizard.descriptionPlaceholder')" class="input" rows="3"></textarea>
    </div>

    <div class="field">
      <label>{{ t('wizard.personality') }}</label>
      <textarea v-model="wizard.persona.personality" :placeholder="t('wizard.personalityPlaceholder')" class="input" rows="3"></textarea>
    </div>

    <div class="field">
      <label>{{ t('wizard.greeting') }}</label>
      <textarea v-model="wizard.persona.greeting" :placeholder="t('wizard.greetingPlaceholder')" class="input" rows="2"></textarea>
    </div>
  </div>
</template>
