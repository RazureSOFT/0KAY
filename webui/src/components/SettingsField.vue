<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppSelect from './AppSelect.vue'
import ModelsField from './ModelsField.vue'
import MarkdownContent from './MarkdownContent.vue'

const { t } = useI18n()

/**
 * One settings field, rendered by type. The three field lists in SettingsPage
 * (provider runtime, plugin sections, patch-declared tabs) used to carry three
 * near-identical copies of these branches; they live here once.
 *
 * Labels are associated with their control: native inputs via for/id, custom
 * controls via aria-label (their focusable element is inside a wrapper).
 */
const props = defineProps<{
  field: { key: string; type: string; default_value?: string; options?: string[] }
  label: string
  help?: string
  modelValue: unknown
  /** Stable prefix for the generated input id (usually the section id). */
  sectionId: string
  options?: Array<string | { value: string; label: string }>
  modelOptions?: Array<string | { value: string; label: string }>
  availableModels?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
  (e: 'browse'): void
}>()

function inputId(): string {
  return `field-${props.sectionId}-${props.field.key}`
}

function onNativeInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', props.field.type === 'number' ? Number(value) : value)
}
</script>

<template>
  <div class="field">
    <template v-if="field.type === 'bool'">
      <label class="toggle-label">
        <input
          type="checkbox"
          :checked="Boolean(modelValue)"
          @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        />
        <span class="toggle-slider"></span>
        <span>
          <strong>{{ label }}</strong>
          <br v-if="help" />
          <small v-if="help" class="helper-text">{{ help }}</small>
        </span>
      </label>
    </template>

    <template v-else-if="field.type === 'note'">
      <div class="field-note">
        <strong v-if="label">{{ label }}</strong>
        <MarkdownContent :content="help || ''" />
      </div>
    </template>

    <template v-else-if="field.type === 'select'">
      <label :for="inputId()">{{ label }}</label>
      <AppSelect
        :input-id="inputId()"
        class="input"
        :aria-label="label"
        :model-value="String(modelValue ?? '')"
        :options="field.options ?? options ?? []"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <p v-if="help" class="helper-text">{{ help }}</p>
    </template>

    <template v-else-if="field.type === 'model'">
      <label :for="inputId()">{{ label }}</label>
      <AppSelect
        :input-id="inputId()"
        class="input"
        :aria-label="label"
        :model-value="String(modelValue ?? '')"
        :options="modelOptions || []"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <p v-if="help" class="helper-text">{{ help }}</p>
    </template>

    <template v-else-if="field.type === 'models'">
      <label :for="inputId()">{{ label }}</label>
      <ModelsField
        :model-value="String(modelValue ?? '')"
        :options="availableModels || []"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <p v-if="help" class="helper-text">{{ help }}</p>
    </template>

    <template v-else-if="field.type === 'dir'">
      <label :for="inputId()">{{ label }}</label>
      <div class="path-row">
        <input
          :id="inputId()"
          class="input"
          type="text"
          spellcheck="false"
          :value="String(modelValue ?? '')"
          :placeholder="field.default_value || ''"
          @input="onNativeInput"
        />
        <button class="btn btn-tonal compact" type="button" @click="emit('browse')">
          {{ t('settings.browse') }}
        </button>
      </div>
      <p v-if="help" class="helper-text">{{ help }}</p>
    </template>

    <template v-else>
      <label :for="inputId()">{{ label }}</label>
      <input
        :id="inputId()"
        class="input"
        :type="field.type === 'number' ? 'number' : 'text'"
        :value="modelValue === undefined || modelValue === null ? '' : String(modelValue)"
        @input="onNativeInput"
      />
      <p v-if="help" class="helper-text">{{ help }}</p>
    </template>
  </div>
</template>
