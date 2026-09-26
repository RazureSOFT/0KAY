<script setup lang="ts">
import { shallowRef, watch } from 'vue'

const props = defineProps<{ module: string }>()

const comp = shallowRef<any>(null)
const error = shallowRef('')

watch(
  () => props.module,
  async (url) => {
    if (!url) {
      comp.value = null
      error.value = ''
      return
    }
    try {
      const mod: any = await import(/* @vite-ignore */ url)
      comp.value = mod?.default || mod
      error.value = ''
    } catch (e: any) {
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
  <div v-else class="plugin-pane-message">Loading plugin module…</div>
</template>

<style scoped>
.plugin-pane-message {
  padding: var(--space-xl);
  color: var(--md-on-surface-variant);
}
</style>
