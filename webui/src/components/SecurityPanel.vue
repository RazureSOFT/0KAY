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

    <div class="sec-stack">
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

      <section class="sec-card">
        <div class="sec-card-head">
          <strong>{{ pinConfigured ? t('security.changePin') : t('auth.setupTitle') }}</strong>
          <span class="sec-chip" :class="{ on: pinConfigured }">
            {{ pinConfigured ? t('security.pinSet') : t('security.pinUnset') }}
          </span>
        </div>
        <div class="sec-pin-grid">
          <div class="sec-pin-col">
            <span class="sec-pin-label">{{ t('auth.pinNew') }}</span>
            <PinInput v-model="newPin" />
          </div>
          <div class="sec-pin-col">
            <span class="sec-pin-label">{{ t('auth.pinConfirm') }}</span>
            <PinInput v-model="confirmPin" @complete="onChangePin" />
          </div>
        </div>
        <div class="sec-actions">
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
      </section>

      <section class="sec-card">
        <div class="sec-card-head">
          <strong>{{ t('security.pages') }}</strong>
          <span class="sec-chip">{{ t('security.pageCount', { n: pinPages.length }) }}</span>
        </div>
        <p class="helper-text">{{ t('security.pagesHelp') }}</p>
        <div class="page-list">
          <label v-for="page in pages" :key="page.path" class="page-item">
            <input
              type="checkbox"
              :checked="pinPages.includes(page.path)"
              :disabled="busy"
              @change="onTogglePage(page.path, ($event.target as HTMLInputElement).checked)"
            />
            <span class="toggle-slider"></span>
            <span class="page-text">
              <span class="page-name">{{ page.label }}</span>
              <code>{{ page.path }}</code>
            </span>
          </label>
        </div>
      </section>
    </div>

    <p v-if="msg" class="helper-text sec-msg">{{ msg }}</p>
    <p v-if="error" class="sec-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.security-panel { max-width: 920px; }

/* Uniform card stack: the switches reuse the global .toggle-label card, so
   every section below shares the same border/radius/surface tokens. */
.sec-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.sec-card {
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 60%, transparent);
  border-radius: 22px;
  background: var(--md-surface-container-lowest);
}

.sec-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}
.sec-card-head strong { font-size: 15px; font-weight: 700; }

.sec-chip {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: var(--md-on-surface-variant);
  background: var(--md-surface-container);
}
.sec-chip.on {
  color: color-mix(in srgb, var(--md-primary) 80%, var(--md-on-surface));
  background: color-mix(in srgb, var(--md-primary) 12%, transparent);
}

.sec-card > .helper-text { margin: 2px 0 12px; }

/* Each PIN group sits in its own tinted inset, so the new-PIN and confirm
   boxes never share a row or overlap. Scoped names avoid the wizard's
   #app .pin-row rules entirely. */
.sec-pin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
  max-width: 720px;
  margin-top: 12px;
}
.sec-pin-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 12px 14px 14px;
  border-radius: 16px;
  background: var(--md-surface-container-low);
}
.sec-pin-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface-variant);
}

.sec-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
}

/* Page scope: light rows inside the card instead of nested cards. */
.page-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 6px;
}
.page-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 160ms;
}
.page-item:hover { background: var(--md-surface-container); }
.page-item:has(input:checked) {
  background: color-mix(in srgb, var(--md-primary) 8%, transparent);
}
.page-item input { position: absolute; opacity: 0; width: 0; height: 0; }
.page-item .toggle-slider { width: 44px; height: 26px; }
.page-item .toggle-slider::after {
  left: 3px;
  width: 16px;
  height: 16px;
  font-size: 10px;
}
.page-item input:checked + .toggle-slider {
  background: var(--md-primary);
  border-color: var(--md-primary);
}
.page-item input:checked + .toggle-slider::after {
  left: 25px;
  background: var(--md-on-primary);
  color: var(--md-primary);
}
.page-item input:focus-visible + .toggle-slider {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-primary) 22%, transparent);
}
.page-text {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}
.page-name {
  font-size: 13px;
  font-weight: 650;
  color: var(--md-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.page-text code {
  font-size: 11px;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sec-msg { margin-top: 12px; }
.sec-error { color: var(--md-error); font-size: 12.5px; margin-top: 8px; }

@media (max-width: 640px) {
  .sec-pin-grid { grid-template-columns: 1fr; }
}
</style>
