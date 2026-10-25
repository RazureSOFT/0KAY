<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ module: string }>()

const comp = shallowRef<any>(null)
const error = shallowRef('')
let loadToken = 0

watch(
  () => props.module,
  async (url) => {
    if (!url) {
      comp.value = null
      error.value = ''
      return
    }
    const token = ++loadToken
    try {
      const mod: any = await import(/* @vite-ignore */ url)
      if (token !== loadToken) return
      comp.value = mod?.default || mod
      error.value = ''
    } catch (e: any) {
      if (token !== loadToken) return
      comp.value = null
      error.value = e?.message || String(e)
    }
  },
  { immediate: true },
)
</script>

<template>
  <component :is="comp" v-if="comp" />
  <div v-else-if="error" class="plugin-pane-message">
    {{ error }}
  </div>
  <div v-else class="plugin-pane-message">{{ t('pluginPane.loading') }}</div>
</template>

<style scoped>
.plugin-pane-message {
  padding: var(--space-xl);
  color: var(--md-on-surface-variant);
}
</style>
