<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiGet, ApiError } from '../api'

const { t } = useI18n()
const aboutLoading = ref(false)
const updateResult = ref<{ current: string; latest?: string; has_update: boolean; url?: string } | null>(null)
const updateError = ref('')
const pluginsLoading = ref(false)
const pluginResults = ref<Array<{ name: string; version: string; latest?: string; has_update: boolean; repository?: string; error?: string }> | null>(null)
const pluginsError = ref('')

async function checkUpdates() {
  aboutLoading.value = true
  updateError.value = ''
  try {
    updateResult.value = await apiGet('/api/update/check')
  } catch (error: unknown) {
    updateError.value = error instanceof ApiError && error.status === 404
      ? t('settings.about.unsupported')
      : error instanceof Error ? error.message : String(error)
  } finally {
    aboutLoading.value = false
  }
}

async function checkPluginUpdates() {
  pluginsLoading.value = true
  pluginsError.value = ''
  try {
    const data = await apiGet('/api/update/check-plugins')
    pluginResults.value = data.plugins || []
  } catch (error: unknown) {
    pluginsError.value = error instanceof ApiError && error.status === 404
      ? t('settings.about.unsupported')
      : error instanceof Error ? error.message : String(error)
  } finally {
    pluginsLoading.value = false
  }
}

onMounted(() => {
  void checkUpdates()
  void checkPluginUpdates()
})
</script>

<template>
  <div class="content-card">
    <h2>{{ t('settings.tabs.about') }}</h2>
    <p class="card-desc">{{ t('settings.about.description') }}</p>
    <h3>0KAY <small>v{{ updateResult?.current || '0.1.0' }}</small></h3>
    <div class="actions-row">
      <button class="btn btn-tonal" :disabled="aboutLoading" @click="checkUpdates">{{ t(aboutLoading ? 'settings.about.checking' : 'settings.about.check') }}</button>
      <button class="btn btn-tonal" :disabled="pluginsLoading" @click="checkPluginUpdates">{{ t(pluginsLoading ? 'settings.about.checking' : 'settings.about.plugins') }}</button>
    </div>
    <p v-if="updateError" role="alert">{{ updateError }}</p>
    <p v-else-if="updateResult" role="status">
      {{ t(updateResult.has_update ? 'settings.about.available' : (updateResult.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}
      <a v-if="updateResult.url" :href="updateResult.url" target="_blank" rel="noopener noreferrer">{{ updateResult.latest }}</a>
    </p>
    <p v-if="pluginsError" role="alert">{{ pluginsError }}</p>
    <div v-if="pluginResults" class="about-plugins">
      <div v-for="plugin in pluginResults" :key="plugin.name" class="about-plugin">
        <strong>{{ plugin.name }}</strong>
        <span>{{ plugin.version || '—' }} → {{ plugin.latest || '—' }}</span>
        <span>{{ plugin.error || t(plugin.has_update ? 'settings.about.available' : (plugin.latest ? 'settings.about.latest' : 'settings.about.noRelease')) }}</span>
      </div>
      <p v-if="!pluginResults.length">{{ t('settings.about.noPlugins') }}</p>
    </div>
    <p class="helper-text">{{ t('settings.about.updateHint') }}</p>
    <code>0kay-pm update &lt;package&gt;@&lt;version&gt;</code>
  </div>
</template>
