<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { loginEnabled, pinConfigured, submitLogin, getSession } from '../auth'
import PinInput from '../components/PinInput.vue'

// /login is a page, not an overlay.
//
// The gate used to be an overlay that appeared whenever a request came back 401.
// That works by accident and fails on purpose: a user who is told "sign in" has
// nowhere to go, and a browser that has never talked to Core sees a blank shell
// rather than a form. This route is the destination that message implies.
//
// Loopback users never land here — Core trusts this machine. It exists for LAN
// access, which is exactly the case that needs a credential.

const { t } = useI18n()
const router = useRouter()

const credential = ref('')
const busy = ref(false)
const error = ref('')
const invalid = ref(false)
const useTokenInput = ref(false)

const pinMode = computed(() => pinConfigured.value && loginEnabled.value && !useTokenInput.value)

onMounted(async () => {
  // Someone who is already signed in should not be parked on a login form.
  const state = await getSession()
  if (state?.authenticated) void router.replace('/')
  if (!pinConfigured.value) useTokenInput.value = true
})

async function submit(): Promise<void> {
  if (busy.value) return
  const value = credential.value.trim()
  if (!value) {
    error.value = t('auth.failed')
    invalid.value = true
    return
  }
  busy.value = true
  error.value = ''
  invalid.value = false
  try {
    await submitLogin(value)
    credential.value = ''
    void router.replace('/')
  } catch (e: any) {
    error.value = e?.message || t('auth.failed')
    invalid.value = true
    credential.value = ''
  } finally {
    busy.value = false
  }
}

function toggleMode(): void {
  useTokenInput.value = !useTokenInput.value
  credential.value = ''
  error.value = ''
  invalid.value = false
}
</script>

<template>
  <main class="login-page">
    <form class="login-card" @submit.prevent="submit">
      <span class="auth-mark" role="img" aria-label="0kay" />
      <h1>{{ t('auth.title') }}</h1>
      <p class="login-hint">{{ pinMode ? t('auth.hint') : t('auth.loginLanHint') }}</p>

      <PinInput
        v-if="pinMode"
        v-model="credential"
        :invalid="invalid"
        error-id="login-error"
        autofocus
        @complete="submit"
      />
      <input
        v-else
        v-model="credential"
        type="password"
        class="login-input"
        :placeholder="t('auth.token')"
        autocomplete="current-password"
      />

      <p v-if="error" id="login-error" role="alert" class="login-error">{{ error }}</p>
      <p v-if="!loginEnabled" class="login-hint">{{ t('auth.loginDisabled') }}</p>

      <footer class="login-actions">
        <button v-if="pinConfigured" type="button" class="login-secondary" @click="toggleMode">
          {{ pinMode ? t('auth.useToken') : t('auth.usePin') }}
        </button>
        <button type="submit" class="login-primary" :disabled="busy">{{ t('auth.submit') }}</button>
      </footer>
    </form>
  </main>
</template>

<style scoped>
.login-page{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;background:var(--md-surface)}
.login-card{width:min(380px,100%);display:flex;flex-direction:column;gap:14px;padding:30px 28px;border-radius:22px;background:var(--md-surface-container-low);box-shadow:var(--shadow-2,0 10px 30px rgba(0,0,0,.12))}
.login-card h1{margin:6px 0 0;font-size:20px;font-weight:700;letter-spacing:-.01em;color:var(--md-on-surface)}
.login-hint{margin:0;font-size:13px;line-height:1.6;color:var(--md-on-surface-variant)}
.login-input{height:44px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);font-size:15px;color:var(--md-on-surface)}
.login-input:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
.login-error{margin:0;font-size:12.5px;color:var(--md-error,#b3261e)}
.login-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}
.login-primary{height:40px;padding:0 20px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font-weight:650}
.login-primary:disabled{opacity:.5}
.login-secondary{height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font-weight:600}
.auth-mark{width:40px;height:40px;border-radius:12px;background:var(--md-primary)}
</style>
