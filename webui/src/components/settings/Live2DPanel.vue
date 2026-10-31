<script setup lang="ts">
// The Live2D tab: pick a model, upload a model folder, save.
//
// Pure presentation: every action is emitted, and the page owns the state and the
// requests. That keeps one source of truth for `wizard.live2d` and makes this
// panel testable without a running Core.
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Live2DStage from '../Live2DStage.vue'
import { DEFAULT_LIVE2D_MODELS } from '../../composables/wizard'

const props = defineProps<{
  enabled: boolean
  modelUrl: string
  uploaded?: Array<{ id: string; label: string; url: string }>
  msg?: string
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:enabled': [value: boolean]
  'update:modelUrl': [value: string]
  save: []
  upload: [files: FileList]
  delete: [model: { id: string; label: string; url: string }]
}>()

const { t } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)

function pickFolder() { fileInput.value?.click() }

function choose(url: string) {
  emit('update:modelUrl', url)
  emit('update:enabled', true)
}

function onFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || !files.length) return
  emit('upload', files)
  input.value = ''
}
</script>

<template>
  <div class="content-card">
    <h2>{{ t('settings.live2d') }}</h2>

    <Live2DStage class="live2d-preview" />

    <label class="toggle-label">
      <input type="checkbox" :checked="enabled" @change="emit('update:enabled', ($event.target as HTMLInputElement).checked)" />
      <span class="toggle-slider"></span>
      <span>{{ t('wizard.enableLive2d') }}</span>
    </label>

    <div class="field">
      <label>{{ t('wizard.modelUrl') }}</label>
      <div class="model-choices">
        <label v-for="m in DEFAULT_LIVE2D_MODELS" :key="m.id" class="model-choice" :class="{ selected: modelUrl === m.url }">
          <input type="radio" name="live2d-model" :value="m.url" :checked="modelUrl === m.url" @change="choose(m.url)" />
          <span>{{ m.label }}</span>
          <code>{{ m.url }}</code>
        </label>
      </div>
      <input :value="modelUrl" :placeholder="t('wizard.modelUrlPlaceholder')" class="input"
        @input="emit('update:modelUrl', ($event.target as HTMLInputElement).value)" />
      <p class="helper-text">
        {{ t('wizard.live2dHelp') }}
        <a href="https://www.live2d.com/en/learn/sample/" target="_blank" rel="noopener">{{ t('wizard.live2dSamples') }}</a>
      </p>
    </div>

    <p class="helper-text">{{ t('settings.live2dHelper') }}</p>
    <button class="btn btn-tonal" :disabled="saving" @click="emit('save')">
      {{ saving ? t('settings.saving') : t('settings.saveLife2d') }}
    </button>

    <div class="field">
      <label>{{ t('settings.uploadFolder') }}</label>
      <button type="button" class="upload-area" :disabled="saving" @click="pickFolder">
        <span>{{ t('settings.uploadFolderHint') }}</span>
      </button>
      <input ref="fileInput" type="file" webkitdirectory directory multiple class="file-input" @change="onFiles" />
      <p v-if="msg" class="helper-text" role="status">{{ msg }}</p>
      <div v-if="uploaded && uploaded.length" class="model-choices" style="margin-top: 12px">
        <label v-for="m in uploaded" :key="m.id" class="model-choice" :class="{ selected: modelUrl === m.url }">
          <input type="radio" name="live2d-uploaded" :value="m.url" :checked="modelUrl === m.url" @change="choose(m.url)" />
          <span>{{ m.label }}</span>
          <code>{{ m.url }}</code>
          <button type="button" class="btn btn-danger" @click.prevent="emit('delete', m)">{{ t('settings.deleteModel') }}</button>
        </label>
      </div>
    </div>
  </div>
</template>
