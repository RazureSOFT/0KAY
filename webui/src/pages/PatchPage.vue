<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUIPatchesStore } from '../stores/uiPatches'

const route = useRoute()
const { t } = useI18n()
const ui = useUIPatchesStore()

const patch = computed(() => {
  const name = String(route.name || '')
  return ui.routerPatches.find((r) => r.name === name || r.path === route.path) || null
})

const title = computed(() => {
  if (!patch.value) return route.path
  if (patch.value.titleKey) {
    const s = t(patch.value.titleKey)
    if (s && s !== patch.value.titleKey) return s
  }
  return patch.value.title || patch.value.name
})

const src = computed(() => String(route.meta.src || patch.value?.src || ''))
const moduleUrl = computed(() => String(route.meta.module || patch.value?.module || ''))
</script>

<template>
  <div class="patch-page">
    <header class="patch-header">
      <h1>{{ title }}</h1>
      <a v-if="src" :href="src" target="_blank" rel="noopener" class="open-link">↗</a>
    </header>
    <iframe v-if="src && !moduleUrl" class="patch-frame" :src="src" :title="title" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
    <div v-else-if="!src && !moduleUrl" class="patch-empty">No embed URL for this route.</div>
    <div v-else-if="!src && moduleUrl" class="patch-empty">Plugin module failed to load: {{ moduleUrl }}</div>
  </div>
</template>

<style scoped>
.patch-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--md-surface);
}
.patch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--md-outline-variant);
}
.patch-header h1 {
  font-size: var(--font-size-lg);
  font-weight: 600;
}
.open-link {
  color: var(--md-primary);
  text-decoration: none;
  font-size: 18px;
}
.patch-frame {
  flex: 1;
  width: 100%;
  border: none;
  background: #fff;
}
.patch-empty {
  padding: var(--space-xl);
  color: var(--md-on-surface-variant);
}
</style>
