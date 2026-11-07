<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * The installed agent extensions.
 *
 * This panel reads and writes Core directly rather than going through the saved
 * settings: a plugin is a directory on disk, and turning one on is an action
 * that takes effect immediately, not a form field waiting for Save. That is also
 * why each row says what the plugin changes — otherwise enabling one is a
 * decision made blind.
 */
interface ExtensionRow {
  name: string
  title?: string
  version?: string
  description?: string
  author?: string
  entry?: string
  permissions?: string[]
  behaviour?: Record<string, any>
  enabled: boolean
  dir: string
  problem?: string
}

const { t } = useI18n()

const rows = ref<ExtensionRow[]>([])
const dir = ref('')
const explicit = ref(false)
const loading = ref(true)
const error = ref('')
const busy = ref('')
const notice = ref('')

async function load(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('/api/agent/extensions', { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    const body = await response.json()
    rows.value = Array.isArray(body?.extensions) ? body.extensions : []
    dir.value = String(body?.dir || '')
    explicit.value = Boolean(body?.explicit)
    if (body?.agent && body.agent.ok === false) {
      notice.value = t('settings.extensions.agentDown', { reason: String(body.agent.error || '') })
    }
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : String(failure)
  } finally {
    loading.value = false
  }
}

async function toggle(row: ExtensionRow): Promise<void> {
  await act(row, row.enabled ? 'disable' : 'enable')
}

async function act(row: ExtensionRow, action: 'enable' | 'disable' | 'remove'): Promise<void> {
  busy.value = row.name
  notice.value = ''
  error.value = ''
  try {
    const response = await fetch('/api/agent/extensions/' + (action === 'remove' ? 'remove' : 'enable'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action === 'remove' ? { name: row.name } : { name: row.name, enabled: action === 'enable' }),
      signal: AbortSignal.timeout(20000),
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body?.message || `${response.status} ${response.statusText}`)
    if (action === 'remove') {
      rows.value = rows.value.filter((entry) => entry.name !== row.name)
      notice.value = t('settings.extensions.removed', { name: row.name })
    } else {
      const reloaded = body?.agent?.report?.loaded
      notice.value = action === 'enable'
        ? t('settings.extensions.enabled', { name: row.name })
        : t('settings.extensions.disabled', { name: row.name })
      if (body?.agent && body.agent.ok === false) {
        notice.value += ' ' + t('settings.extensions.agentDown', { reason: String(body.agent.error || '') })
      } else if (Array.isArray(reloaded)) {
        notice.value += ' ' + t('settings.extensions.loadedNow', { names: reloaded.join(', ') || '—' })
      }
      await load()
    }
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : String(failure)
  } finally {
    busy.value = ''
  }
}

/** What a row changes, as a short list of labels rather than raw JSON. */
function effects(row: ExtensionRow): string[] {
  const out: string[] = []
  const behaviour = row.behaviour || {}
  if (typeof behaviour.prompt === 'string' && behaviour.prompt.trim()) out.push(t('settings.extensions.effectPrompt'))
  if (Array.isArray(behaviour.rules) && behaviour.rules.length) out.push(t('settings.extensions.effectRules', { n: behaviour.rules.length }))
  if (behaviour.tools?.hide?.length) out.push(t('settings.extensions.effectHide', { n: behaviour.tools.hide.length }))
  if (behaviour.model) out.push(t('settings.extensions.effectModel'))
  if (row.entry) out.push(t('settings.extensions.effectCode'))
  return out
}

const enabledCount = computed(() => rows.value.filter((row) => row.enabled && !row.problem).length)

onMounted(load)
</script>

<template>
  <div class="extensions-panel">
    <p class="helper-text extensions-lead">{{ t('settings.extensions.lead') }}</p>

    <p v-if="error" class="extensions-error" role="alert">{{ error }}</p>
    <p v-if="notice" class="extensions-notice" role="status">{{ notice }}</p>

    <p v-if="loading" class="helper-text">{{ t('settings.extensions.loading') }}</p>

    <p v-else-if="!rows.length" class="extensions-empty">
      {{ t('settings.extensions.empty') }}
      <br />
      <small>{{ t('settings.extensions.emptyHint') }}</small>
    </p>

    <ul v-else class="extensions-list">
      <li v-for="row in rows" :key="row.name" class="extension" :class="{ off: !row.enabled, broken: !!row.problem }">
        <div class="extension-head">
          <label class="toggle-label">
            <input
              type="checkbox"
              :checked="row.enabled && !row.problem"
              :disabled="!!row.problem || busy === row.name"
              @change="toggle(row)"
            />
            <span class="toggle-slider"></span>
            <span class="extension-name">
              <strong>{{ row.title || row.name }}</strong>
              <span v-if="row.version" class="extension-version">{{ row.version }}</span>
            </span>
          </label>
          <button
            class="btn btn-text compact extension-remove"
            type="button"
            :disabled="busy === row.name"
            @click="act(row, 'remove')"
          >
            {{ t('settings.extensions.remove') }}
          </button>
        </div>

        <p v-if="row.problem" class="extension-problem">{{ row.problem }}</p>
        <p v-if="row.description" class="extension-desc">{{ row.description }}</p>

        <div v-if="effects(row).length" class="extension-effects">
          <span v-for="effect in effects(row)" :key="effect" class="extension-chip">{{ effect }}</span>
        </div>

        <div v-if="row.permissions?.length" class="extension-perms">
          <span class="extension-perms-label">{{ t('settings.extensions.permissions') }}</span>
          <code v-for="permission in row.permissions" :key="permission">{{ permission }}</code>
        </div>
        <p v-else-if="row.entry" class="extension-warn">{{ t('settings.extensions.noPermissions') }}</p>
      </li>
    </ul>

    <p v-if="rows.length" class="helper-text extensions-footer">
      {{ t('settings.extensions.count', { on: enabledCount, total: rows.length }) }}
      <template v-if="!explicit"> {{ t('settings.extensions.allOn') }}</template>
    </p>
    <p v-if="dir" class="helper-text extensions-dir">{{ t('settings.extensions.dir', { dir }) }}</p>
  </div>
</template>

<style scoped>
.extensions-panel { display: flex; flex-direction: column; gap: 10px; }
.extensions-lead { margin: 0; }
.extensions-error { margin: 0; padding: 8px 12px; border-radius: 10px; font-size: 13px; background: color-mix(in srgb, var(--md-error, #ba1a1a) 12%, transparent); color: var(--md-error, #ba1a1a); }
.extensions-notice { margin: 0; padding: 8px 12px; border-radius: 10px; font-size: 13px; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }
.extensions-empty { margin: 0; padding: 16px; border-radius: 12px; background: var(--md-surface-container-low); font-size: 13px; color: var(--md-on-surface-variant); }
.extensions-empty small { color: var(--md-on-surface-variant); opacity: .8; }
.extensions-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.extension { padding: 12px 14px; border-radius: 14px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); display: flex; flex-direction: column; gap: 6px; }
.extension.off { opacity: .68; }
.extension.broken { border-style: dashed; }
.extension-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.extension-head .toggle-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.extension-name { display: inline-flex; align-items: baseline; gap: 8px; }
.extension-version { font-family: var(--code-font, ui-monospace, monospace); font-size: 11px; color: var(--md-on-surface-variant); }
.extension-remove { flex: none; }
.extension-desc { margin: 0; font-size: 13px; color: var(--md-on-surface-variant); }
.extension-problem { margin: 0; font-size: 13px; color: var(--md-error, #ba1a1a); }
.extension-effects { display: flex; flex-wrap: wrap; gap: 6px; }
.extension-chip { padding: 2px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 600; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }
.extension-perms { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 11.5px; }
.extension-perms-label { color: var(--md-on-surface-variant); }
.extension-perms code { padding: 1px 6px; border-radius: 6px; font-size: 11px; background: color-mix(in srgb, var(--md-primary) 10%, transparent); color: var(--md-primary); }
.extension-warn { margin: 0; font-size: 12px; color: var(--md-on-surface-variant); font-style: italic; }
.extensions-footer { margin: 0; }
.extensions-dir { margin: 0; font-family: var(--code-font, ui-monospace, monospace); font-size: 11.5px; word-break: break-all; opacity: .75; }
</style>
