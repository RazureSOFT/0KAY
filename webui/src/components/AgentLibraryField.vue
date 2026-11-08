<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * The rules the library learned, for one workspace.
 *
 * The library sits between the user's message and the model: it classifies the
 * turn, turns a correction into a rule, and injects the rules that match. Until
 * now that list was invisible, which meant a wrong rule ("never touch auth")
 * kept steering every session and there was no way to find it.
 *
 * Rules are per workspace, because they are about a codebase: the same rule in
 * two repositories is two different pieces of advice. So this panel needs a
 * workspace to show anything, and it says so instead of guessing.
 *
 * Core forwards to the agent, which owns the file. Nothing is stored here, so
 * the list can never disagree with what the agent actually matches against.
 */
interface LibraryRule {
  id: string
  text: string
  source: 'correction' | 'manual'
  origin?: string
  createdAt?: number
  hits?: number
}

const { t } = useI18n()

const workspace = ref('')
const rules = ref<LibraryRule[]>([])
const loading = ref(false)
const error = ref('')
const notice = ref('')
const busy = ref('')
const draft = ref('')
const adding = ref(false)

const sorted = computed(() => [...rules.value].sort((a, b) => (b.hits || 0) - (a.hits || 0) || (b.createdAt || 0) - (a.createdAt || 0)))

async function load(): Promise<void> {
  if (!workspace.value.trim()) {
    rules.value = []
    return
  }
  loading.value = true
  error.value = ''
  try {
    const url = '/api/agent/library?workspace=' + encodeURIComponent(workspace.value.trim())
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body?.error || `${response.status} ${response.statusText}`)
    rules.value = Array.isArray(body?.rules) ? body.rules : []
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : String(failure)
  } finally {
    loading.value = false
  }
}

async function post(payload: Record<string, unknown>): Promise<{ rules?: LibraryRule[] }> {
  const response = await fetch('/api/agent/library', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, workspace: workspace.value.trim() }),
    signal: AbortSignal.timeout(20000),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body?.error || `${response.status} ${response.statusText}`)
  return body
}

async function add(): Promise<void> {
  const text = draft.value.trim()
  if (!text) return
  adding.value = true
  error.value = ''
  notice.value = ''
  try {
    const body = await post({ action: 'add', text })
    if (Array.isArray(body.rules)) rules.value = body.rules
    draft.value = ''
    notice.value = t('settings.library.added')
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : String(failure)
  } finally {
    adding.value = false
  }
}

async function remove(rule: LibraryRule): Promise<void> {
  busy.value = rule.id
  error.value = ''
  notice.value = ''
  try {
    const body = await post({ action: 'remove', id: rule.id })
    rules.value = Array.isArray(body.rules) ? body.rules.filter((row) => row.id !== rule.id) : rules.value.filter((row) => row.id !== rule.id)
    notice.value = t('settings.library.removed')
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : String(failure)
  } finally {
    busy.value = ''
  }
}

function hits(rule: LibraryRule): string {
  const count = rule.hits || 0
  return count === 1 ? t('settings.library.hitOnce') : t('settings.library.hits', { n: count })
}

onMounted(() => {
  const saved = window.localStorage.getItem('0kay.library.workspace')
  if (saved) workspace.value = saved
})

function remember(): void {
  window.localStorage.setItem('0kay.library.workspace', workspace.value.trim())
  void load()
}
</script>

<template>
  <div class="library-panel">
    <p class="helper-text library-lead">{{ t('settings.library.lead') }}</p>

    <div class="library-workspace">
      <input
        v-model="workspace"
        class="input"
        :placeholder="t('settings.library.workspacePlaceholder')"
        :aria-label="t('settings.library.workspace')"
        @keydown.enter.prevent="remember"
      />
      <button class="btn btn-text compact" type="button" :disabled="loading || !workspace.trim()" @click="remember">
        {{ loading ? t('settings.library.loading') : t('settings.library.load') }}
      </button>
    </div>

    <p v-if="error" class="library-error" role="alert">{{ error }}</p>
    <p v-if="notice" class="library-notice" role="status">{{ notice }}</p>

    <p v-if="!workspace.trim()" class="library-empty">{{ t('settings.library.needWorkspace') }}</p>

    <template v-else>
      <ul v-if="sorted.length" class="library-list">
        <li v-for="rule in sorted" :key="rule.id" class="library-rule">
          <div class="library-rule-head">
            <span class="library-source" :class="rule.source">{{ rule.source === 'manual' ? t('settings.library.manual') : t('settings.library.learned') }}</span>
            <span class="library-hits">{{ hits(rule) }}</span>
            <button
              class="btn btn-text compact"
              type="button"
              :disabled="busy === rule.id"
              :aria-label="t('settings.library.remove')"
              @click="remove(rule)"
            >×</button>
          </div>
          <p class="library-text">{{ rule.text }}</p>
          <p v-if="rule.origin" class="library-origin">{{ t('settings.library.origin') }} {{ rule.origin }}</p>
        </li>
      </ul>
      <p v-else-if="!loading" class="library-empty">{{ t('settings.library.empty') }}</p>

      <form class="library-add" @submit.prevent="add">
        <input
          v-model="draft"
          class="input"
          :placeholder="t('settings.library.addPlaceholder')"
          :aria-label="t('settings.library.addLabel')"
        />
        <button class="btn btn-text compact" type="submit" :disabled="adding || !draft.trim()">
          {{ t('settings.library.add') }}
        </button>
      </form>
    </template>
  </div>
</template>

<style scoped>
.library-panel { display: flex; flex-direction: column; gap: 10px; }
.library-lead { margin: 0; }
.library-workspace { display: flex; gap: 8px; align-items: center; }
.library-workspace .input { flex: 1; min-width: 0; }
.library-error { margin: 0; padding: 8px 12px; border-radius: 10px; font-size: 13px; background: color-mix(in srgb, var(--md-error, #ba1a1a) 12%, transparent); color: var(--md-error, #ba1a1a); }
.library-notice { margin: 0; padding: 8px 12px; border-radius: 10px; font-size: 13px; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }
.library-empty { margin: 0; padding: 16px; border-radius: 12px; background: var(--md-surface-container-low); font-size: 13px; color: var(--md-on-surface-variant); }
.library-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.library-rule { padding: 10px 12px; border-radius: 12px; background: var(--md-surface-container-low); border: 1px solid var(--md-outline-variant); display: flex; flex-direction: column; gap: 5px; }
.library-rule-head { display: flex; align-items: center; gap: 8px; }
.library-source { padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }
.library-source.correction { background: color-mix(in srgb, var(--md-primary) 12%, transparent); color: var(--md-primary); }
.library-hits { font-size: 11.5px; color: var(--md-on-surface-variant); }
.library-rule-head .btn { margin-left: auto; }
.library-text { margin: 0; font-size: 13px; line-height: 1.5; }
.library-origin { margin: 0; font-size: 11.5px; color: var(--md-on-surface-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.library-add { display: flex; gap: 8px; align-items: center; }
.library-add .input { flex: 1; min-width: 0; }
</style>
