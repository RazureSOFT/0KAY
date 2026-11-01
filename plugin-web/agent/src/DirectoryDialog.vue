<script setup lang="ts">
// The workspace folder picker.
//
// It was one minified line inside the agent page, which made it impossible to
// test and hard to change: the dialog only ever renders the state it is handed
// and reports what the user chose, so it does not need to live in a 2800-line
// component.
import { computed, ref, watch } from 'vue'
import { i18n } from '@0kay/host'

const props = defineProps<{
  open: boolean
  busy?: boolean
  error?: string
  path?: string
  parent?: string
  dirs?: Array<{ name: string; path: string }>
  roots?: string[]
  defaultDir?: string
  hostname?: string
  folder?: string
}>()

const emit = defineEmits<{
  close: []
  browse: [path: string]
  create: [name: string]
  select: []
}>()

const t = (key: string, named?: Record<string, unknown>) => i18n.global.t(key, named ?? {})
const folderName = ref(props.folder || '')
const path = computed(() => props.path || '')
const parent = computed(() => {
  // At a drive root the server reports the root as its own parent, which made the
  // "go up" row vanish exactly when you reached D:\ — a dead end with no way back
  // to the drive list. Going up from a root means the list itself (empty path).
  const reported = props.parent || ''
  if (reported && reported === (props.path || '')) return ''
  return reported
})
const dirs = computed(() => props.dirs || [])
const roots = computed(() => props.roots || [])
const canCreate = computed(() => !!folderName.value.trim() && !!path.value && !props.busy)
const canSelect = computed(() => !!path.value && !props.busy && !props.error)

// The parent folder is the first real destination; only offer it when it is not
// the current folder, which is what makes it useful as a "go up" button.
const showParent = computed(() => !!path.value && (parent.value !== path.value))

watch(() => props.open, (open) => { if (!open) folderName.value = '' })

function submitFolder() {
  if (!canCreate.value) return
  emit('create', folderName.value.trim())
  folderName.value = ''
}
</script>

<template>
  <!-- Teleported: the composer it is rendered from is transformed, and a
       position:fixed child of a transformed ancestor is sized by that ancestor —
       which is why this dialog kept appearing tiny no matter what width it got. -->
  <Teleport to="body">
  <div v-if="open" class="directory-backdrop" @click.self="emit('close')">
    <section class="directory-dialog" role="dialog" aria-modal="true" tabindex="-1"
      :aria-label="t('agent.page.selectWorkspaceDirAria')">
      <header>
        <h2>{{ t('agent.page.directoryTitle', { name: hostname || t('agent.page.executor') }) }}</h2>
        <button type="button" @click="emit('close')">{{ t('agent.page.close') }}</button>
      </header>
      <div class="directory-roots">
        <button v-for="root in roots" :key="root" type="button" :disabled="busy" @click="emit('browse', root)">
          {{ root }}
        </button>
        <button type="button" :disabled="busy" @click="emit('browse', defaultDir || '')">
          {{ t('agent.page.defaultDirectory') }}
        </button>
      </div>
      <code>{{ path }}</code>
      <form class="new-folder" @submit.prevent="submitFolder">
        <input v-model="folderName" :placeholder="t('agent.page.newFolderName')"
          :aria-label="t('agent.page.newFolderName')" :disabled="busy" />
        <button type="submit" :disabled="!canCreate">{{ t('agent.page.createFolder') }}</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="busy">{{ t('agent.page.readingDirectory') }}</p>
      <div v-else class="directory-list">
        <button v-if="showParent" type="button" class="parent" @click="emit('browse', parent)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l-6 6 6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ t('agent.page.parentDirectory') }}
        </button>
        <button v-for="dir in dirs" :key="dir.path" type="button" @click="emit('browse', dir.path)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
              stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          </svg>
          {{ dir.name }}
        </button>
        <p v-if="!dirs.length" class="muted">{{ t('agent.page.noSubdirectories') }}</p>
      </div>
      <footer>
        <button type="button" :disabled="!canSelect" @click="emit('select')">
          {{ t('agent.page.selectCurrentDirectory') }}
        </button>
      </footer>
    </section>
  </div>
  </Teleport>
</template>

<style scoped>
/* Modelled on the 0.1.1 dialog: a bordered sheet, and rows that keep a quiet
   container colour instead of being stripped bare. Clearing a button's own
   background made it inherit the plugin's global input style, which is what made
   the list read as a column of text fields. */
.directory-backdrop{position:fixed;inset:0;z-index:var(--z-modal,6000);display:grid;place-items:center;padding:20px;background:#14111acc}
.directory-dialog{display:flex;flex-direction:column;gap:14px;width:min(680px,100%);max-height:85vh;padding:22px;
  border:1px solid var(--md-outline-variant);border-radius:20px;
  background:var(--md-surface);color:var(--md-on-surface);box-shadow:var(--shadow-4)}
.directory-dialog header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.directory-dialog h2{margin:0;font-size:16px;font-weight:650}

/* Text action: no container, so it cannot be mistaken for a field. */
.directory-dialog header button{flex:none;padding:4px 10px;border:0;border-radius:9px;background:transparent;
  color:var(--md-primary);font:inherit;font-size:12.5px;font-weight:600;cursor:pointer}
.directory-dialog header button:hover{background:color-mix(in srgb,var(--md-primary) 10%,transparent)}

.directory-roots{display:flex;flex-wrap:wrap;gap:8px}
.directory-roots button{padding:6px 12px;border:1px solid var(--md-outline-variant);border-radius:999px;
  background:transparent;color:var(--md-on-surface);font:inherit;font-size:12px;cursor:pointer}
.directory-roots button:hover:not(:disabled){border-color:var(--md-primary);color:var(--md-primary)}

.directory-dialog code{padding:8px 10px;border-radius:10px;background:var(--md-surface-container-low);
  font-family:var(--code-font);font-size:12px;overflow-wrap:anywhere}

.new-folder{display:flex;gap:8px}
.new-folder input{flex:1;min-width:0;padding:8px 10px;border:1px solid var(--md-outline-variant);border-radius:10px;
  background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:13px}
.new-folder button{flex:none;padding:8px 14px;border:0;border-radius:10px;
  background:var(--md-secondary-container);color:var(--md-on-secondary-container);
  font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.new-folder button:disabled{opacity:.45;cursor:not-allowed}

.directory-dialog .error{margin:0;color:var(--md-error,#ba1a1a);font-size:12.5px}

/* Rows keep a quiet container, which is what separates them from the path field. */
.directory-list{display:flex;flex-direction:column;gap:6px;min-height:180px;max-height:360px;overflow:auto}
.directory-list button{display:flex;align-items:center;gap:9px;justify-content:flex-start;
  padding:8px 10px;border:0;border-radius:10px;
  background:var(--md-surface-container-low);color:var(--md-on-surface);
  font:inherit;font-size:13px;text-align:left;cursor:pointer}
.directory-list button:hover:not(:disabled){background:var(--md-secondary-container)}
.directory-list button svg{flex:none;color:var(--md-on-surface-variant)}
.muted{margin:6px 2px;opacity:.7;font-size:12.5px}

.directory-dialog footer{display:flex;justify-content:flex-end}
.directory-dialog footer button{padding:9px 18px;border:0;border-radius:999px;
  background:var(--md-primary);color:var(--md-on-primary);
  font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.directory-dialog footer button:disabled{opacity:.45;cursor:not-allowed}
</style>
