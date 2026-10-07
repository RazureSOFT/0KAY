<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from './stores/wizard'
import { useLifeStore } from './stores/life'
import { useChatStore } from './stores/chat'
import { useUIPatchesStore } from './stores/uiPatches'
import SetupWizard from './components/SetupWizard.vue'
import GlobalAgentInbox from './components/GlobalAgentInbox.vue'
import ComputerUsePip from './components/ComputerUsePip.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import AppSelect from './components/AppSelect.vue'
import LifeApprovalDialog from './components/LifeApprovalDialog.vue'
import MinecraftConsentDialog from './components/MinecraftConsentDialog.vue'
import NavIcon from './components/NavIcon.vue'
import ToastHost from './components/ToastHost.vue'
import { setLanguage, getLanguage, LOCALES } from './i18n'
import { authRequired, submitLogin, cancelLogin, pinRequired, submitPin, cancelPin, verifyPin, pinConfigured, pinSetupRequired, setPin, pinGuard, pinUnlocked, pinPages, pinEnabled, pageRequiresPin, requirePagePin } from './auth'
import PinInput from './components/PinInput.vue'

const { t } = useI18n()
const wizard = useWizardStore()
const life = useLifeStore()
const chat = useChatStore()
const ui = useUIPatchesStore()
const route = useRoute()
const router = useRouter()
const lang = computed(() => getLanguage())

const pageTitle = computed(() => {
  const key = route.meta.titleKey as string | undefined
  if (key) return t(key)
  const p = ui.routerPatches.find((r) => r.path === route.path || r.name === route.name)
  if (p) {
    if (p.titleKey) {
      const s = t(p.titleKey)
      if (s && s !== p.titleKey) return s
    }
    return p.title || t('app.title')
  }
  return t('app.title')
})

function navLabel(item: { labelKey?: string; label?: string; id: string }) {
  if (item.labelKey) {
    const s = t(item.labelKey)
    if (s && s !== item.labelKey) return s
  }
  return item.label || item.id
}

/** Resolve badgeFrom e.g. "life.onlineAgents" */
function navBadge(item: { badgeFrom?: string; badge?: number | string | null; id: string }): number | string | null {
  if (item.badgeFrom?.startsWith('life.')) {
    const key = item.badgeFrom.slice(5) as keyof typeof life
    const v = (life as any)[key]
    if (v !== undefined && v !== null && v !== '' && v !== 0) return v as number | string
  }
  if (item.badgeFrom?.startsWith('chat.')) {
    const key = item.badgeFrom.slice(5) as keyof typeof chat
    const v = (chat as any)[key]
    if (v !== undefined && v !== null && v !== '' && v !== 0) return v as number | string
  }
  if (item.badge != null && item.badge !== '') return item.badge
  return null
}

function onNav(item: { to?: string; href?: string; external?: boolean }) {
  if (item.href || item.external) {
    if (item.href) window.open(item.href, '_blank', 'noopener')
    return
  }
  if (item.to) router.push(item.to)
}

function isActive(item: { id: string; to?: string }) {
  // Exact path match for any nav target (including "/" for chat).
  if (item.to) {
    if (item.to === '/') return route.path === '/' || route.name === 'chat'
    return route.path === item.to || route.name === item.id
  }
  return route.name === item.id
}

// --- per-page PIN guard ----------------------------------------------------
// Purely a WebUI convenience: routes ticked in 设置 › 安全 challenge on entry.
// Core does not trust this scope — sensitive actions always re-check the PIN —
// so this guard only decides when to prompt before a page is usable. The
// challenge fires once per tab; pinUnlocked stays true afterwards.
watch(
  () => [
    route.path,
    pinConfigured.value,
    pinEnabled.value,
    pinPages.value.join('\u0000'),
    pinUnlocked.value,
  ],
  () => {
    if (pinUnlocked.value || pinRequired.value) return
    // Never stack the prompt on top of the wizard, the login or the PIN setup.
    if (!wizard.isCompleted || pinSetupRequired.value || authRequired.value) return
    if (pageRequiresPin(route.path)) requirePagePin()
  },
  { immediate: true },
)

onMounted(() => {
  wizard.loadFromStorage()
  ui.startPolling(15000)
  if (wizard.isCompleted) {
    if (!life.isConnected) life.connect()
    if (!chat.isConnected) chat.connect()
  }
})

onUnmounted(() => {
  ui.stopPolling()
  life.disconnect()
})

function changeLang(code: string) {
  setLanguage(code)
}

function onWizardComplete() {
  wizard.loadFromStorage()
  if (!life.isConnected) life.connect()
  if (!chat.isConnected) chat.connect()
  router.replace('/')
}

// --- pairing / PIN login overlay ------------------------------------------
const authToken = ref('')
const authBusy = ref(false)
const authError = ref('')
const authInvalid = ref(false)
const useTokenInput = ref(false)

function resetAuth() {
  authError.value = ''
  authInvalid.value = false
  authToken.value = ''
  useTokenInput.value = false
}

function toggleAuthMode() {
  useTokenInput.value = !useTokenInput.value
  authToken.value = ''
  authError.value = ''
  authInvalid.value = false
}

async function onAuthSubmit() {
  if (authBusy.value) return
  const credential = authToken.value.trim()
  if (!credential) { authError.value = t('auth.failed'); authInvalid.value = true; return }
  authBusy.value = true
  authError.value = ''
  authInvalid.value = false
  try {
    await submitLogin(credential)
    authToken.value = ''
    // The cookie is set now, so live channels can connect.
    if (wizard.isCompleted) {
      if (!life.isConnected) life.connect()
      if (!chat.isConnected) chat.connect()
    }
  } catch (e: any) {
    authError.value = e?.message || t('auth.failed')
    authInvalid.value = true
    authToken.value = ''
  } finally {
    authBusy.value = false
  }
}

/**
 * A configured + enabled PIN is a real gate, not a convenience prompt: Core
 * rejects browser callers without a session, so there is nothing to "skip".
 */
const pinGate = computed(() => pinConfigured.value && pinEnabled.value)

function onAuthCancel() {
  if (pinGate.value) return
  resetAuth()
  cancelLogin()
}

// --- sensitive-action PIN prompt ------------------------------------------
const pinInput = ref('')
const pinError = ref('')
const pinInvalid = ref(false)

async function onPinSubmit() {
  const pin = pinInput.value.trim()
  if (pin.length !== 6) return
  pinError.value = ''
  pinInvalid.value = false
  const ok = await verifyPin(pin)
  if (!ok) {
    pinError.value = t('auth.pinWrong')
    pinInvalid.value = true
    pinInput.value = ''
    setTimeout(() => { pinInvalid.value = false }, 400)
    return
  }
  submitPin(pin)
  pinInput.value = ''
}

function onPinCancel() {
  pinError.value = ''
  pinInvalid.value = false
  pinInput.value = ''
  cancelPin()
}

// --- first-run / upgrade PIN setup ----------------------------------------
const setupPin = ref('')
const setupConfirm = ref('')
const setupError = ref('')
const setupBusy = ref(false)
const setupInvalid = ref(false)

async function onSetupSubmit() {
  if (setupBusy.value) return
  const pin = setupPin.value
  if (pin.length !== 6 || setupConfirm.value.length !== 6) return
  if (pin !== setupConfirm.value) {
    setupError.value = t('wizard.pinMismatch')
    setupInvalid.value = true
    setupConfirm.value = ''
    setTimeout(() => { setupInvalid.value = false }, 400)
    return
  }
  setupBusy.value = true
  setupError.value = ''
  try {
    await setPin(pin)
    setupPin.value = ''
    setupConfirm.value = ''
  } catch (e: any) {
    setupError.value = e?.message || t('auth.failed')
    setupInvalid.value = true
  } finally {
    setupBusy.value = false
  }
}
</script>

<template>
  <ToastHost />
  <Teleport to="body">
    <!-- First run / upgrade: choose a 6-digit access PIN -->
    <Transition name="auth">
    <div
      v-if="pinSetupRequired && !authRequired"
      class="auth-scrim"
      role="dialog"
      aria-modal="true"
      :aria-label="t('auth.setupTitle')"
    >
      <form class="auth-dialog" @submit.prevent="onSetupSubmit">
        <span class="auth-mark" role="img" aria-label="0kay"></span>
        <h2>{{ t('auth.setupTitle') }}</h2>
        <p class="auth-hint">{{ t('auth.setupHint') }}</p>
        <label class="auth-label">{{ t('auth.pinNew') }}</label>
        <PinInput v-model="setupPin" :invalid="setupInvalid" autofocus />
        <label class="auth-label">{{ t('auth.pinConfirm') }}</label>
        <PinInput v-model="setupConfirm" :invalid="setupInvalid" error-id="setup-pin-error" @complete="onSetupSubmit" />
        <p v-if="setupError" id="setup-pin-error" role="alert" class="auth-error">{{ setupError }}</p>
        <footer class="auth-actions">
          <button type="submit" class="auth-primary" :disabled="setupBusy">{{ t('auth.savePin') }}</button>
        </footer>
      </form>
    </div>
    </Transition>

    <Transition name="auth">
    <div
      v-if="authRequired"
      class="auth-scrim"
      role="dialog"
      aria-modal="true"
      :aria-label="t('auth.title')"
    >
      <form class="auth-dialog" @submit.prevent="onAuthSubmit">
        <span class="auth-mark" role="img" aria-label="0kay"></span>
        <h2>{{ t('auth.title') }}</h2>
        <p class="auth-hint">{{ t('auth.hint') }}</p>
        <PinInput
          v-if="pinConfigured && !useTokenInput"
          v-model="authToken"
          :invalid="authInvalid"
          error-id="auth-pin-error"
          autofocus
          @complete="onAuthSubmit"
        />
        <input
          v-else
          v-model="authToken"
          type="password"
          class="auth-input"
          :placeholder="t('auth.token')"
          autocomplete="current-password"
        />
        <p v-if="authError" id="auth-pin-error" role="alert" class="auth-error">{{ authError }}</p>
        <footer class="auth-actions">
          <button type="button" class="auth-secondary" @click="pinConfigured && toggleAuthMode()">
            {{ pinConfigured && !useTokenInput ? t('auth.useToken') : t('auth.usePin') }}
          </button>
          <button v-if="!pinGate" type="button" class="auth-secondary" @click="onAuthCancel">{{ t('auth.cancel') }}</button>
          <button v-if="!pinConfigured || useTokenInput" type="submit" class="auth-primary" :disabled="authBusy">{{ t('auth.submit') }}</button>
        </footer>
      </form>
    </div>
    </Transition>

    <Transition name="auth">
    <div
      v-if="pinRequired"
      class="auth-scrim"
      role="dialog"
      aria-modal="true"
      :aria-label="t('auth.pinTitle')"
    >
      <form class="auth-dialog" @submit.prevent="onPinSubmit">
        <span class="auth-mark" role="img" aria-label="0kay"></span>
        <h2>{{ t('auth.pinTitle') }}</h2>
        <p class="auth-hint">{{ t('auth.pinHint') }}</p>
        <PinInput v-model="pinInput" :invalid="pinInvalid" error-id="pin-error" autofocus @complete="onPinSubmit" />
        <p v-if="pinError" id="pin-error" role="alert" class="auth-error">{{ pinError }}</p>
        <p v-if="pinGuard" class="auth-hint">{{ t('auth.pinGuardHint') }}</p>
        <footer class="auth-actions">
          <button v-if="!pinGuard" type="button" class="auth-secondary" @click="onPinCancel">{{ t('auth.cancel') }}</button>
        </footer>
      </form>
    </div>
    </Transition>
  </Teleport>

  <Transition name="shell" mode="out-in">
    <SetupWizard
      v-if="!wizard.isCompleted"
      key="wizard"
      @complete="onWizardComplete"
    />

    <div v-else key="shell" class="app-shell">
    <GlobalAgentInbox />
    <ComputerUsePip />
    <ConfirmDialog />
    <LifeApprovalDialog />
<MinecraftConsentDialog />
    <header class="app-header">
      <div class="brand">
        <span class="brand-mark" role="img" aria-label="0kay"></span>
        <span class="page-title">{{ pageTitle }}</span>
      </div>

      <div class="header-actions">
        <span
          class="conn-dot"
          :class="{ on: life.isConnected }"
          role="img"
          :aria-label="life.isConnected ? t('status.connected') : t('status.disconnected')"
          :title="life.isConnected ? t('status.connected') : t('status.disconnected')"
        ></span>
        <AppSelect
          class="lang-select"
          :model-value="lang"
          :options="LOCALES.map(option => ({ value: option.code, label: option.label }))"
          :aria-label="t('app.switchLang')"
          @update:model-value="changeLang"
        />
        <button
          class="icon-btn settings-btn"
          :class="{ active: route.name === 'settings' }"
          :title="t('nav.settings')"
          @click="router.push('/settings')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="app-body">
      <!-- @ui-ext:nav — items come from BUILTIN_NAV + /api/ui/patches -->
      <nav class="nav-rail" aria-label="main">
        <component
          :is="item.to && !item.external && !item.href ? 'router-link' : 'button'"
          v-for="item in ui.navItems"
          :key="item.id"
          :to="item.to && !item.external && !item.href ? item.to : undefined"
          :class="['nav-item', { active: isActive(item) }]"
          :title="navLabel(item)"
          :aria-current="isActive(item) ? 'page' : undefined"
          @click="!(item.to && !item.external && !item.href) && onNav(item)"
        >
          <span class="nav-icon">
            <NavIcon :name="item.icon || item.id" />
          </span>
          <span class="nav-label">{{ navLabel(item) }}</span>
          <span v-if="navBadge(item) != null" class="badge">{{ navBadge(item) }}</span>
        </component>
      </nav>

      <main class="app-main">
        <RouterView v-slot="{ Component }">
          <Transition name="route" mode="out-in">
            <div :key="route.path" class="route-view"><component :is="Component" /></div>
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
  </Transition>
</template>

<style scoped>
/* ---------------------------------------------------------------------------
 * The app chrome is owned by styles/theme.css.
 *
 * Every `#app .app-header` / `.nav-rail` / `.nav-item` / `.app-main` rule there
 * is an ID selector — (1,1,0) or higher — and always beats a scoped rule in
 * this file (0,2,0). Only the declarations theme.css does NOT set are kept
 * below. The rest (heights, padding, gaps, radii, backgrounds, borders, font
 * sizes, and the whole nav-indicator box) used to sit here carrying *different*
 * values from the ones that actually rendered — header 64px here vs 76px there,
 * rail 88px vs 100px — which made this block actively misleading to anyone
 * editing it. Change the chrome in styles/theme.css.
 * ------------------------------------------------------------------------- */
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  /* Chrome is not content: keep the brand + controls out of any select-all /
     drag selection so copying a chat can never drag "0kay" and nav labels in. */
  user-select: none;
}

.brand {
  display: flex;
  min-width: 0;
  user-select: none;
}

.page-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
}

.conn-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--md-outline);
  margin-right: 4px;
  transition: background-color var(--duration-medium, 220ms) var(--ease-out, ease-out),
    box-shadow var(--duration-medium, 220ms) var(--ease-out, ease-out);
}
.conn-dot.on {
  background: var(--md-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--md-success) 20%, transparent);
}

/* Box (44x44, radius 18, surface background) comes from `#app .icon-btn` in
   theme.css. `.icon-btn.active` is deliberately NOT kept here: the platform
   rule's `background` is (1,1,0) and beat this block's `.icon-btn.active`
   (0,3,0), so the settings button never painted its active surface. That state
   now lives in theme.css, where it can win. */
.icon-btn {
  padding: 0 12px;
  border: none;
  color: var(--md-on-surface-variant);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
}
.icon-btn:hover {
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}

.lang-select {
  width: 148px;
  flex-shrink: 0;
}
#app .lang-select :deep(.app-select-trigger) {
  min-height: 44px;
  border-radius: 18px;
  background-color: var(--md-surface-container-lowest);
  padding: 0 10px 0 14px;
  font-size: 13px;
  font-weight: 650;
}
#app .lang-select :deep(.app-select-chevron) {
  width: 22px;
  height: 22px;
}

.app-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.nav-rail {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  /* Nav labels are chrome, not chat: exclude them from selection entirely. */
  user-select: none;
}

/* Layout only. Width, padding, gap, radius, font-size and the active pill
   (`.nav-item::before`) all come from theme.css, which out-ranks this block —
   the values here used to disagree with the rendered ones (rail 88px vs 100px,
   item padding 12px 4px vs 9px 6px). */
.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--md-on-surface-variant);
  text-decoration: none;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-item:hover {
  background: color-mix(in srgb, var(--md-on-surface) 6%, transparent);
}

.nav-icon {
  display: flex;
  position: relative;
  z-index: 1;
}

.badge {
  position: absolute;
  top: 6px;
  right: 14px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--radius-full);
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Mobile: the rail becomes a bottom bar. Its width, padding, item box and the
   active pill all come from the `max-width: 720px` block in theme.css — only
   the direction, overflow and the badge offset are ours. */
@media (max-width: 720px) {
  .app-body {
    flex-direction: column-reverse;
  }
  .nav-rail {
    flex-direction: row;
    justify-content: space-around;
    overflow-x: auto;
  }
  .nav-item {
    flex: 1;
  }
  .badge { right: calc(50% - 24px); }
  .page-title { display: none; }
}

.auth-scrim {
  position: fixed;
  inset: 0;
  z-index: var(--z-auth, 7000);
  display: grid;
  place-items: center;
  padding: 20px;
  background: color-mix(in srgb, var(--md-scrim, #000) 45%, transparent);
  backdrop-filter: blur(6px);
}

/* Auth gate enters with the shared dialog rise; leaves accelerate out so the
   hand-off to the app shell never feels like a flash cut. */
.auth-enter-active { transition: opacity var(--duration-medium, 220ms) var(--ease-out, ease-out); }
.auth-leave-active { transition: opacity var(--duration-short, 140ms) var(--ease-emphasized-accel, ease-in); }
.auth-enter-from,
.auth-leave-to { opacity: 0; }
.auth-enter-active .auth-dialog { animation: dialog-arrive var(--duration-long, 360ms) var(--ease-spring, ease-out) both; }

/* Wizard -> shell swap: the wizard shrinks away, the shell fades in. */
.shell-enter-active { transition: opacity var(--duration-medium, 220ms) var(--ease-out, ease-out); }
.shell-leave-active { transition: opacity var(--duration-short, 140ms) var(--ease-emphasized-accel, ease-in), transform var(--duration-short, 140ms) var(--ease-emphasized-accel, ease-in); }
.shell-enter-from { opacity: 0; }
.shell-leave-to { opacity: 0; transform: scale(0.985); }

.auth-dialog {
  width: min(420px, 100%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  border-radius: 28px;
  background: var(--md-surface);
  color: var(--md-on-surface);
  box-shadow: var(--shadow-4, 0 22px 60px #30205724);
}

.auth-mark {
  /* Same handwritten mark as the header brand, via a mask so the strokes
     follow the dialog's on-surface color. */
  display: inline-block;
  width: 28px;
  height: 28px;
  background-color: var(--md-on-surface);
  -webkit-mask: url('/okay-logo-mono.svg') no-repeat center / contain;
  mask: url('/okay-logo-mono.svg') no-repeat center / contain;
}

.auth-dialog h2 {
  margin: 0;
  font-size: 22px;
}

.auth-hint {
  margin: 0;
  font-size: 13px;
  color: var(--md-on-surface-variant);
}

.auth-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface-variant);
}

.auth-dialog :deep(.pin-boxes) { margin-inline: -6px; }

.auth-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-low);
  color: inherit;
  font: inherit;
}

.auth-input:focus {
  outline: 2px solid var(--md-primary);
  outline-offset: 1px;
}

.auth-error {
  margin: 0;
  font-size: 13px;
  color: var(--md-error, #b3261e);
}

.auth-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

.auth-actions button {
  min-height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: var(--radius-full);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.auth-secondary {
  background: transparent;
  color: var(--md-on-surface-variant);
}

.auth-primary {
  background: var(--md-primary);
  color: var(--md-on-primary);
}

.auth-primary:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
