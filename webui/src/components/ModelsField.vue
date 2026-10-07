<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSelect from './AppSelect.vue'

const { t } = useI18n()

const props = defineProps<{ modelValue: string; options: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

/** Ordered list, highest priority first. */
const list = computed(() => String(props.modelValue || '').split(',').map((value) => value.trim()).filter(Boolean))
const available = computed(() => props.options.filter((id) => !list.value.includes(id)))

function update(next: string[]) { emit('update:modelValue', next.join(',')) }
function add(id: string) { if (id && !list.value.includes(id)) update([...list.value, id]) }
function remove(id: string) { update(list.value.filter((existing) => existing !== id)) }
function move(index: number, delta: number) {
  const next = [...list.value]
  const target = index + delta
  if (target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target], next[index]]
  update(next)
}
</script>

<template>
  <div class="models-field">
    <ol v-if="list.length" class="models-list">
      <li v-for="(id, index) in list" :key="id">
        <span class="models-rank">{{ index + 1 }}</span>
        <span class="models-name" :title="id">{{ id }}</span>
        <span class="models-actions">
          <button type="button" :disabled="index === 0" :aria-label="t('models.higher')" @click="move(index, -1)">↑</button>
          <button type="button" :disabled="index === list.length - 1" :aria-label="t('models.lower')" @click="move(index, 1)">↓</button>
          <button type="button" :aria-label="t('common.remove')" @click="remove(id)">✕</button>
        </span>
      </li>
    </ol>
    <p v-else class="models-empty">{{ t('models.empty') }}</p>
    <AppSelect
      v-if="available.length"
      :options="available"
      model-value=""
      :placeholder="t('models.addPlaceholder')"
      @update:model-value="add"
    />
  </div>
</template>

<style scoped>
.models-field{display:flex;flex-direction:column;gap:8px}
.models-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.models-list li{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}
.models-rank{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}
.models-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
.models-actions{display:inline-flex;gap:4px}
.models-actions button{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}
.models-actions button:disabled{opacity:.35;cursor:not-allowed}
.models-actions button:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.models-empty{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}
</style>
