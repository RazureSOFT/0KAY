<script setup lang="ts">
/**
 * In-app directory picker for `dir` settings fields.
 *
 * Settings used to be "type the absolute path into a text box", which is a trap
 * on Windows (`D:\Genie` vs `D:/Genie` vs a typo'd drive) and impossible to
 * verify before saving. The backend that can list directories already exists —
 * the agent's `workspace_browse` tool, exposed as `GET /api/agent/workspace` —
 * and so does a native dialog (`GET /api/agent/pick-folder`), so this component
 * only has to be the UI for them. Nothing here writes to disk.
 *
 * Both endpoints go through the agent, so an offline executor shows a hint and
 * leaves the text box editable rather than pretending the folder is empty.
 */
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ModalShell from './ModalShell.vue'

const props = defineProps<{
  open: boolean
  /** Starting directory; falls back to the executor's cwd when empty. */
  initial?: string
  title?: string
}>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void; (e: 'pick', path: string): void }>()

const { t } = useI18n()

const cwd = ref('')
const parent = ref('')
const roots = ref<string[]>([])
const dirs = ref<Array<{ name: string; path: string }>>([])
const loading = ref(false)
const error = ref('')
const typed = ref('')
const nativeBusy = ref(false)

/**
 * Where the last browse session ended. An empty field (e.g. the ONNX model
 * directory, which lives inside the install directory) should open next to what
 * the user just picked instead of dropping them at the executor's cwd.
 */
let lastBrowsed = ''

async function load(target: string) {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`/api/agent/workspace?path=${encodeURIComponent(target || '')}`)
    if (!res.ok) {
      const body: { error?: string } = await res.json().catch(() => ({}))
      // Keep the previous listing: a bad path must not wipe the panel.
      error.value = body?.error || `HTTP ${res.status}`
      return
    }
    const data = await res.json()
    cwd.value = String(data?.path || '')
    parent.value = String(data?.parent || '')
    roots.value = Array.isArray(data?.roots) ? data.roots.map(String) : []
    dirs.value = Array.isArray(data?.directories)
      ? data.directories.map((d: { name?: string; path?: string }) => ({ name: String(d?.name || ''), path: String(d?.path || '') }))
      : []
    typed.value = cwd.value
    lastBrowsed = cwd.value
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    error.value = ''
    const start = (props.initial || '').trim() || lastBrowsed
    typed.value = start
    void load(start)
  },
  { immediate: true },
)

function close() { emit('update:open', false) }

function choose() {
  const value = (cwd.value || typed.value).trim()
  if (!value) return
  emit('pick', value)
  close()
}

function enter(dir: { path: string }) { void load(dir.path) }

function goUp() {
  if (parent.value && parent.value !== cwd.value) void load(parent.value)
}

/** OS dialog on the executor host: the only way to pick a path on another drive
 *  without navigating to it, and the familiar affordance for most users. */
async function nativePick() {
  if (nativeBusy.value) return
  nativeBusy.value = true
  error.value = ''
  try {
    const res = await fetch(`/api/agent/pick-folder?title=${encodeURIComponent(props.title || t('settings.pathPickTitle'))}`)
    // Cancel is a 400 with no message — that is not an error worth showing.
    if (res.ok) {
      const data: { path?: string } = await res.json().catch(() => ({}))
      if (data?.path) { emit('pick', String(data.path)); close() }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    nativeBusy.value = false
  }
}
</script>

<template>
  <ModalShell
    :open="open"
    :title="title || t('settings.pathPickTitle')"
    :on-dismiss="close"
    initial-focus="first"
    panel-class="path-picker-panel"
  >
    <header class="pp-head">
      <h2>{{ title || t('settings.pathPickTitle') }}</h2>
      <button class="pp-icon" type="button" :aria-label="t('settings.pathUp')" :disabled="loading" @click="goUp">↑</button>
    </header>

    <div class="pp-roots">
      <button
        v-for="root in roots"
        :key="root"
        class="pp-root"
        type="button"
        :class="{ 'is-active': cwd === root }"
        @click="load(root)"
      >{{ root }}</button>
    </div>

    <input
      v-model="typed"
      class="input pp-path"
      :placeholder="t('settings.pathPlaceholder')"
      spellcheck="false"
      @keydown.enter.prevent="load(typed)"
    />

    <div class="pp-list" role="listbox" :aria-busy="loading">
      <p v-if="loading" class="pp-empty">{{ t('settings.pathLoading') }}</p>
      <p v-else-if="error" class="pp-empty pp-error">{{ error }}</p>
      <p v-else-if="!dirs.length" class="pp-empty">{{ t('settings.pathEmpty') }}</p>
      <template v-else>
        <button
          v-for="dir in dirs"
          :key="dir.path"
          class="pp-item"
          type="button"
          role="option"
          :title="dir.path"
          @click="enter(dir)"
        >
          <span class="pp-folder" aria-hidden="true">▸</span>
          <span class="pp-name">{{ dir.name }}</span>
        </button>
      </template>
    </div>

    <p class="pp-current" :title="cwd">{{ t('settings.pathSelected', { path: cwd || typed || '—' }) }}</p>

    <footer class="pp-foot">
      <button class="btn btn-text" type="button" :disabled="nativeBusy" @click="nativePick">
        {{ nativeBusy ? t('settings.pathNativeBusy') : t('settings.pathNative') }}
      </button>
      <span class="pp-spacer"></span>
      <button class="btn btn-text" type="button" @click="close">{{ t('settings.cancel') }}</button>
      <button class="btn btn-primary" type="button" :disabled="loading || !(cwd || typed)" @click="choose">
        {{ t('settings.pathUse') }}
      </button>
    </footer>
  </ModalShell>
</template>

<style scoped>
.pp-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.pp-head h2 { margin: 0; font-size: 18px; }
.pp-icon {
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container); color: var(--md-on-surface); font-size: 15px; cursor: pointer;
}
.pp-icon:disabled { opacity: .45; cursor: not-allowed; }
.pp-roots { display: flex; flex-wrap: wrap; gap: 6px; }
.pp-root {
  padding: 4px 10px; border-radius: 999px; border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container); color: var(--md-on-surface-variant);
  font-size: 12px; font-family: monospace; cursor: pointer;
}
.pp-root.is-active { border-color: var(--md-primary); color: var(--md-primary); }
.pp-path { font-family: monospace; font-size: 13px; }
.pp-list {
  display: flex; flex-direction: column; gap: 2px; min-height: 180px; max-height: 42vh; overflow: auto;
  padding: 6px; border-radius: 14px; border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-lowest, var(--md-surface));
}
.pp-item {
  display: flex; align-items: center; gap: 8px; padding: 7px 10px; border: 0; border-radius: 10px;
  background: none; color: var(--md-on-surface); font-size: 13px; text-align: left; cursor: pointer;
}
.pp-item:hover, .pp-item:focus-visible { background: var(--md-surface-container-high); outline: none; }
.pp-folder { color: var(--md-primary); font-size: 13px; line-height: 1; opacity: .85; }
.pp-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pp-empty { margin: 0; padding: 24px 8px; text-align: center; font-size: 13px; color: var(--md-on-surface-variant); }
.pp-error { color: var(--md-error, #b3261e); }
.pp-current {
  margin: 0; font-family: monospace; font-size: 12px; color: var(--md-on-surface-variant);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.pp-foot { display: flex; align-items: center; gap: 8px; }
.pp-spacer { flex: 1; }
</style>
