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
const parent = computed(() => props.parent || '')
const dirs = computed(() => props.dirs || [])
const roots = computed(() => props.roots || [])
const canCreate = computed(() => !!folderName.value.trim() && !!path.value && !props.busy)
const canSelect = computed(() => !!path.value && !props.busy && !props.error)

// The parent folder is the first real destination; only offer it when it is not
// the current folder, which is what makes it useful as a "go up" button.
const showParent = computed(() => !!parent.value && parent.value !== path.value)

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
/* Material 3 Expressive: one elevated sheet, large corner radius, and three
   clearly ranked actions — text (close), tonal (secondary), filled (the way out).
   Every rule here exists because the plugin's global `button,input` rule paints
   everything like a text field; without them the dialog reads as a column of
   boxes. */
.directory-backdrop{position:fixed;inset:0;z-index:var(--z-modal,6000);display:flex;align-items:center;justify-content:center;padding:24px;background:color-mix(in srgb,#0b1220 42%,transparent)}
.directory-dialog{
  display:flex;flex-direction:column;gap:16px;width:min(720px,100%);max-height:min(760px,92vh);
  padding:24px;border-radius:28px;
  background:var(--md-surface-container-high,var(--md-surface-container-lowest));
  color:var(--md-on-surface);
  box-shadow:0 24px 60px color-mix(in srgb,#0b1220 32%,transparent);
}
.directory-dialog header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.directory-dialog h2{margin:0;font-size:20px;font-weight:600;line-height:1.3;letter-spacing:-.01em}

/* Text button: the least important action, so it carries no container. */
.directory-dialog header button{flex:none;height:40px;padding:0 14px;border:0;border-radius:999px;
  background:transparent;box-shadow:none;color:var(--md-primary);font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.directory-dialog header button:hover{background:color-mix(in srgb,var(--md-primary) 10%,transparent)}

/* Root chips: outlined, 32px tall, the shape a filter chip has. */
.directory-roots{display:flex;flex-wrap:wrap;gap:8px}
.directory-roots button{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;
  background:transparent;box-shadow:none;color:var(--md-on-surface-variant);font:inherit;font-size:12.5px;font-weight:500;cursor:pointer}
.directory-roots button:hover:not(:disabled){border-color:var(--md-primary);color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 8%,transparent)}

.directory-dialog code{display:block;padding:12px 14px;border:0;border-radius:12px;
  background:var(--md-surface-container-highest,var(--md-surface-container-low));
  font-family:var(--code-font);font-size:12.5px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}

/* Filled field: a container with no outline, which is how M3 marks input. */
.new-folder{display:flex;gap:8px}
.new-folder input{flex:1;min-width:0;height:44px;padding:0 14px;border:0;border-radius:12px;
  background:var(--md-surface-container-highest,var(--md-surface-container-low));color:var(--md-on-surface);font:inherit;font-size:13px}
.new-folder input::placeholder{color:var(--md-on-surface-variant)}
.new-folder button{flex:none;height:44px;padding:0 18px;border:0;border-radius:999px;
  background:var(--md-secondary-container);color:var(--md-on-secondary-container);
  font:inherit;font-size:13px;font-weight:600;cursor:pointer;box-shadow:none}
.new-folder button:hover:not(:disabled){filter:brightness(1.04)}
.new-folder button:disabled{opacity:.4;cursor:not-allowed}

.directory-dialog .error{margin:0;color:var(--md-error,#ba1a1a);font-size:12.5px}
/* Rows: list items. 12px radius, hover only. */
.directory-list{display:flex;flex-direction:column;gap:2px;min-height:120px;max-height:340px;overflow:auto;padding:2px}
.directory-list button{display:flex;align-items:center;gap:10px;justify-content:flex-start;width:100%;
  border:0;border-radius:12px;background:transparent;box-shadow:none;
  padding:0 12px;height:44px;font:inherit;font-size:13.5px;text-align:left;color:var(--md-on-surface);cursor:pointer}
.directory-list button:hover:not(:disabled){background:var(--md-surface-container-highest,var(--md-surface-container-low))}
.directory-list button svg{flex:none;color:var(--md-on-surface-variant)}
.directory-list button.parent{color:var(--md-on-surface-variant)}

.directory-dialog footer{display:flex;justify-content:flex-end;gap:8px}
.directory-dialog footer button{height:44px;padding:0 24px;border:0;border-radius:999px;
  background:var(--md-primary);color:var(--md-on-primary);
  font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;box-shadow:0 1px 2px color-mix(in srgb,#0b1220 24%,transparent)}
.directory-dialog footer button:hover:not(:disabled){filter:brightness(1.06)}
.directory-dialog footer button:disabled{opacity:.4;cursor:not-allowed}
.muted{opacity:.7;font-size:12.5px;margin:8px 12px}
</style>
