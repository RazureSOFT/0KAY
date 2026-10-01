<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIPatchesStore } from '../stores/uiPatches'
import { useConfirm } from '../composables/confirm'
import PinInput from './PinInput.vue'
import {
  pinConfigured,
  pinEnabled,
  loginEnabled,
  pinPages,
  refreshPinStatus,
  saveSecurityPrefs,
  clearPin,
  setPin,
} from '../auth'

const { t, locale } = useI18n()
const { confirm } = useConfirm()
const ui = useUIPatchesStore()

const busy = ref(false)
const msg = ref('')
const error = ref('')
const newPin = ref('')
const confirmPin = ref('')

/** Every routable page: sidebar entries plus pages registered by patches. */
const pages = computed<{ path: string; label: string }[]>(() => {
  const out: { path: string; label: string }[] = []
  const seen = new Set<string>()
  const push = (path: string | undefined, label: string) => {
    if (!path || seen.has(path)) return
    seen.add(path)
    out.push({ path, label: label || path })
  }
  for (const item of ui.navItems) {
    const path = item.to || (item.id === 'chat' ? '/' : '')
    if (!path) continue
    let label = item.labelKey ? t(item.labelKey) : ''
    if (!label || label === item.labelKey) label = item.label || item.id
    push(path, label)
  }
  for (const r of ui.routerPatches) {
    let label = r.titleKey ? t(r.titleKey) : ''
    if (!label || label === r.titleKey) label = r.title || String(r.name || r.path)
    push(r.path, label)
  }
  return out
})

onMounted(() => { void refreshPinStatus() })

async function save(patch: { enabled?: boolean; login_enabled?: boolean; pages?: string[] }) {
  busy.value = true
  msg.value = ''
  error.value = ''
  try {
    await saveSecurityPrefs(patch)
    msg.value = t('settings.saved')
    setTimeout(() => { msg.value = '' }, 1500)
  } catch (e: any) {
    error.value = e?.message || t('settings.permFailed')
  } finally {
    busy.value = false
  }
}

function onToggleSwitch(key: 'enabled' | 'login_enabled', value: boolean) {
  void save({ [key]: value } as { enabled?: boolean; login_enabled?: boolean })
}

function onTogglePage(path: string, checked: boolean) {
  const next = new Set(pinPages.value)
  if (checked) next.add(path)
  else next.delete(path)
  void save({ pages: [...next] })
}

async function onChangePin() {
  error.value = ''
  if (newPin.value.length !== 6) {
    error.value = t('wizard.pinTooShort')
    return
  }
  if (newPin.value !== confirmPin.value) {
    error.value = t('wizard.pinMismatch')
    return
  }
  busy.value = true
  try {
    await setPin(newPin.value)
    newPin.value = ''
    confirmPin.value = ''
    msg.value = t('settings.saved')
    setTimeout(() => { msg.value = '' }, 1500)
  } catch (e: any) {
    error.value = e?.message || t('settings.permFailed')
  } finally {
    busy.value = false
  }
}

async function onRemovePin() {
  const ok = await confirm({
    title: t('security.removePin'),
    message: t('security.removePinConfirm'),
    confirmLabel: locale.value === 'en' ? 'Delete' : '删除',
    danger: true,
  })
  if (!ok) return
  busy.value = true
  error.value = ''
  try {
    await clearPin()
    msg.value = t('settings.saved')
    setTimeout(() => { msg.value = '' }, 1500)
  } catch (e: any) {
    error.value = e?.message || t('settings.permFailed')
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="content-card security-panel">
    <h2>{{ t('settings.tabs.security') }}</h2>
    <p class="card-desc">{{ t('security.desc') }}</p>

    <div class="sec-block">
      <label class="toggle-label">
        <input
          type="checkbox"
          :checked="pinEnabled"
          :disabled="busy"
          @change="onToggleSwitch('enabled', ($event.target as HTMLInputElement).checked)"
        />
        <span class="toggle-slider"></span>
        <span>
          <strong>{{ t('security.pinSwitch') }}</strong>
          <small class="helper-text">{{ t('security.pinSwitchHelp') }}</small>
        </span>
      </label>
    </div>

    <div class="sec-block">
      <label class="toggle-label">
        <input
          type="checkbox"
          :checked="loginEnabled"
          :disabled="busy"
          @change="onToggleSwitch('login_enabled', ($event.target as HTMLInputElement).checked)"
        />
        <span class="toggle-slider"></span>
        <span>
          <strong>{{ t('security.loginSwitch') }}</strong>
          <small class="helper-text">{{ t('security.loginSwitchHelp') }}</small>
        </span>
      </label>
    </div>

    <div class="sec-block">
      <div class="sec-block-head">
        <strong>{{ pinConfigured ? t('security.changePin') : t('auth.setupTitle') }}</strong>
        <span class="sec-state" :class="{ on: pinConfigured }">
          {{ pinConfigured ? t('security.pinSet') : t('security.pinUnset') }}
        </span>
      </div>
      <div class="pin-row">
        <div class="pin-field">
          <label class="pin-label">{{ t('auth.pinNew') }}</label>
          <PinInput v-model="newPin" />
        </div>
        <div class="pin-field">
          <label class="pin-label">{{ t('auth.pinConfirm') }}</label>
          <PinInput v-model="confirmPin" @complete="onChangePin" />
        </div>
      </div>
      <div class="actions-row">
        <button class="btn btn-primary" type="button" :disabled="busy" @click="onChangePin">
          {{ t('auth.savePin') }}
        </button>
        <button
          v-if="pinConfigured"
          class="btn btn-tonal"
          type="button"
          :disabled="busy"
          @click="onRemovePin"
        >
          {{ t('security.removePin') }}
        </button>
      </div>
    </div>

    <div class="sec-block">
      <div class="sec-block-head">
        <strong>{{ t('security.pages') }}</strong>
        <span class="sec-state">{{ t('security.pageCount', { n: pinPages.length }) }}</span>
      </div>
      <p class="helper-text">{{ t('security.pagesHelp') }}</p>
      <div class="page-list">
        <label v-for="page in pages" :key="page.path" class="toggle-label page-toggle">
          <input
            type="checkbox"
            :checked="pinPages.includes(page.path)"
            :disabled="busy"
            @change="onTogglePage(page.path, ($event.target as HTMLInputElement).checked)"
          />
          <span class="toggle-slider"></span>
          <span class="page-name">
            {{ page.label }}
            <code>{{ page.path }}</code>
          </span>
        </label>
      </div>
    </div>

    <p v-if="msg" class="helper-text">{{ msg }}</p>
    <p v-if="error" class="sec-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.security-panel { max-width: 920px; }

.sec-block {
  margin-bottom: 26px;
  padding-bottom: 22px;
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent);
}
.sec-block:last-of-type { border-bottom: 0; padding-bottom: 0; }

.sec-block-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}
.sec-block-head strong { font-size: 15px; font-weight: 700; }
.sec-state {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--md-on-surface-variant);
}
.sec-state.on { color: var(--md-primary); }

.sec-block .helper-text { margin-bottom: 12px; }
.sec-block .sec-block-head + .pin-row { margin-top: 12px; }
/* Inside a switch card the help line sits under the title, not after the card. */
#app .security-panel .toggle-label .helper-text { margin-bottom: 0; }

/* PIN entry — the wizard's .pin-row/.pin-field styles are scoped to it, so the
   layout has to be declared here or the boxes stretch to the full card width. */
.pin-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  max-width: 620px;
}
.pin-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.pin-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  color: var(--md-on-surface-variant);
}

.page-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
}
/* The global switch card rule is #app-scoped, so matching it needs the same head. */
#app .security-panel .page-toggle { padding: 12px 14px; gap: 12px; border-radius: 18px; }
.page-name { font-size: 13px; font-weight: 600; }
.page-name code {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

.sec-error { color: var(--md-error); font-size: 12.5px; margin-top: 8px; }

@media (max-width: 720px) {
  .pin-row { grid-template-columns: 1fr; }
}
</style>
