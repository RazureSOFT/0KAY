<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsMeta } from '../composables/settingsMeta'

const { t } = useI18n()
const { tabLabel, tabMeta, fieldLabel, fieldHelp } = useSettingsMeta()

const perms = ref({ screen_watch: false, computer_use: false, report_agent_host: '' })
const permMsg = ref('')

async function loadPermissions() {
  try {
    const res = await fetch('/api/life/permissions')
    if (res.ok) {
      const data = await res.json()
      perms.value = {
        screen_watch: !!data.screen_watch,
        computer_use: !!data.computer_use,
        report_agent_host: data.report_agent_host || '',
      }
    }
  } catch { /* offline */ }
}

async function savePermissions() {
  permMsg.value = ''
  try {
    const res = await fetch('/api/life/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perms.value),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    perms.value = {
      screen_watch: !!data.screen_watch,
      computer_use: !!data.computer_use,
      report_agent_host: data.report_agent_host || '',
    }
    permMsg.value = t('settings.permSaved')
  } catch {
    permMsg.value = t('settings.permFailed')
  }
}

onMounted(loadPermissions)
</script>

<template>
  <div class="content-card">
    <h2>{{ tabLabel('permissions') }}</h2>
    <p class="card-desc">{{ tabMeta('permissions')?.descriptionKey ? t(tabMeta('permissions')!.descriptionKey!) : t('settings.permissionsDesc') }}</p>

    <label class="toggle-label">
      <input type="checkbox" v-model="perms.screen_watch" @change="savePermissions" />
      <span class="toggle-slider"></span>
      <span>
        <strong>{{ fieldLabel(tabMeta('permissions'), 'screen_watch', 'settings.screenWatch') }}</strong>
        <br />
        <small class="helper-text">{{ fieldHelp(tabMeta('permissions'), 'screen_watch', 'settings.screenWatchDesc') }}</small>
      </span>
    </label>

    <label class="toggle-label">
      <input type="checkbox" v-model="perms.computer_use" @change="savePermissions" />
      <span class="toggle-slider"></span>
      <span>
        <strong>{{ fieldLabel(tabMeta('permissions'), 'computer_use', 'settings.computerUse') }}</strong>
        <br />
        <small class="helper-text">{{ fieldHelp(tabMeta('permissions'), 'computer_use', 'settings.computerUseDesc') }}</small>
      </span>
    </label>

    <div class="field">
      <label>{{ fieldLabel(tabMeta('permissions'), 'report_agent_host', 'settings.reportAgentHost') }}</label>
      <input v-model="perms.report_agent_host" class="input" :placeholder="fieldHelp(tabMeta('permissions'), 'report_agent_host', 'settings.reportAgentHostDesc')" @change="savePermissions" />
      <p class="helper-text">{{ fieldHelp(tabMeta('permissions'), 'report_agent_host', 'settings.reportAgentHostDesc') }}</p>
    </div>

    <div v-if="permMsg" class="helper-text">{{ permMsg }}</div>
    <div class="actions-row">
      <button class="btn btn-primary" type="button" @click="savePermissions">{{ t('settings.save') }}</button>
    </div>
  </div>
</template>
