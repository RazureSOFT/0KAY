<script setup lang="ts">
/**
 * The IDE: files on the left, contents in the middle, the agent on the right.
 *
 * This is the first slice — it reads and asks. Editing goes through the agent
 * rather than a text box, because the agent already owns the write path (and its
 * approval rules); a second editor writing files directly would be a second
 * policy to keep in sync.
 */
import { computed, onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { parseRefs, refFor, resolveRefs, refsForModel } from '../stores/attachment-refs'
import { latestPlan } from '../stores/plan-card'

type Entry = { name: string; path: string }
type Row = {
  task_id: string
  session_id?: string
  kind?: string
  state?: string
  prompt?: string
  result?: string
  started_at?: string
  /** JSON string written by the agent's plan tool, see src/tools/plan.ts. */
  plan?: string
}

const { t } = useI18n()

const rootPath = ref('')
const roots = ref<string[]>([])
const entries = ref<Entry[]>([])
const expanded = ref<Record<string, Entry[]>>({})
const openDirs = ref<Record<string, boolean>>({})
const treeLoading = ref(false)
const treeError = ref('')

const filePath = ref('')
const fileContent = ref('')
const fileLines = ref(0)
const fileLoading = ref(false)
const fileError = ref('')

const sessionId = ref('')
const turns = ref<Row[]>([])
const draft = ref('')
const sending = ref(false)
const chatError = ref('')

// Attachments for the next turn. Images and files are kept apart because the
// reference grammar addresses them as separate numbered pools — `@image#1` and
// `@file#1` both exist in the same message.
const pendingImages = ref<Array<{ name: string; url: string }>>([])
const pendingFiles = ref<Array<{ name: string; url: string; mime?: string; size?: number }>>([])
const uploading = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const draftInput = ref<HTMLTextAreaElement | null>(null)

// The chips shown under the composer, resolved from the draft text so the chip
// and the text can never disagree about what is attached.
const draftRefs = computed(() =>
  resolveRefs(
    parseRefs(draft.value),
    pendingImages.value.map((image) => image.url),
    pendingFiles.value,
  ),
)

let events: EventSource | null = null

const breadcrumb = computed(() => {
  if (!filePath.value) return ''
  const root = rootPath.value.replace(/\\/g, '/')
  return filePath.value.replace(/\\/g, '/').replace(root, '').replace(/^\//, '')
})

const numbered = computed(() => fileContent.value.split(String.fromCharCode(10)))

async function listDir(path: string): Promise<{ entries: Entry[]; roots: string[] }> {
  const response = await fetch(`/api/agent/workspace?path=${encodeURIComponent(path)}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()
  return { entries: (data.directories || []) as Entry[], roots: (data.roots || []) as string[] }
}

async function openRoot(path = '') {
  treeLoading.value = true
  treeError.value = ''
  try {
    const data = await listDir(path)
    rootPath.value = path || rootPath.value
    roots.value = data.roots
    entries.value = data.entries
    expanded.value = {}
    openDirs.value = {}
  } catch (error) {
    treeError.value = error instanceof Error ? error.message : String(error)
  } finally {
    treeLoading.value = false
  }
}

async function toggleDir(entry: Entry) {
  if (openDirs.value[entry.path]) {
    openDirs.value = { ...openDirs.value, [entry.path]: false }
    return
  }
  try {
    const data = await listDir(entry.path)
    expanded.value = { ...expanded.value, [entry.path]: data.entries }
    openDirs.value = { ...openDirs.value, [entry.path]: true }
  } catch (error) {
    treeError.value = error instanceof Error ? error.message : String(error)
  }
}

async function openFile(entry: Entry) {
  fileLoading.value = true
  fileError.value = ''
  filePath.value = entry.path
  try {
    const response = await fetch(`/api/agent/file?path=${encodeURIComponent(entry.path)}&limit=4000`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    fileContent.value = String(data.content ?? '')
    fileLines.value = Number(data.totalLines ?? 0)
  } catch (error) {
    fileContent.value = ''
    fileError.value = error instanceof Error ? error.message : String(error)
  } finally {
    fileLoading.value = false
  }
}

function renderTurn(row: Row): { role: 'you' | 'her'; text: string } | null {
  if (row.kind === 'user') return { role: 'you', text: String(row.prompt || '') }
  const text = String(row.result || '').trim()
  if (!text) return null
  return { role: 'her', text }
}

// A plan is not a chat turn — it is a handoff waiting for a decision, so it is
// parsed out into a card instead of rendered as another bubble. `latestPlan`
// lives in its own module because the row is written by another process.
const activePlan = computed(() => latestPlan(turns.value))

const planOpen = ref(false)

// Building a plan is a new task whose prompt is the plan itself — the agent
// that wrote it is gone by now, so the plan has to carry everything the build
// needs. This is the handoff the plan tool exists for.
async function buildPlan() {
  const plan = activePlan.value
  if (!plan || sending.value) return
  if (!sessionId.value) await ensureSession().catch(() => undefined)
  if (!sessionId.value) {
    chatError.value = t('ide.noSession')
    return
  }
  sending.value = true
  chatError.value = ''
  try {
    const prompt = `${t('ide.buildPromptLead')}\n\n${plan.markdown}`
    const response = await fetch('/api/agent/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId.value, prompt, agent_type: 'general' }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    planOpen.value = false
    await loadTurns()
  } catch (error) {
    chatError.value = error instanceof Error ? error.message : String(error)
  } finally {
    sending.value = false
  }
}

async function copyPlan() {
  const plan = activePlan.value
  if (!plan) return
  try {
    await navigator.clipboard.writeText(plan.markdown)
    chatError.value = ''
  } catch {
    chatError.value = t('ide.copyFailed')
  }
}

const conversation = computed(() =>
  turns.value
    .map(renderTurn)
    .filter((line): line is { role: 'you' | 'her'; text: string } => !!line)
    .slice(-40),
)

async function loadTurns() {
  if (!sessionId.value) return
  try {
    const response = await fetch(`/api/agent/sessions/${encodeURIComponent(sessionId.value)}/turns?limit=50`)
    if (!response.ok) return
    const data = await response.json()
    turns.value = (data.tasks || []) as Row[]
  } catch { /* an empty conversation is not an error */ }
}

async function ensureSession() {
  const response = await fetch('/api/agent/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'IDE' }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()
  sessionId.value = String(data.session_id || data.id || '')
}

async function send() {
  const text = draft.value.trim()
  const images = pendingImages.value.map((image) => image.url)
  if ((!text && !images.length && !pendingFiles.value.length) || sending.value) return
  if (!sessionId.value) await ensureSession().catch(() => undefined)
  if (!sessionId.value) {
    chatError.value = t('ide.noSession')
    return
  }
  sending.value = true
  chatError.value = ''
  try {
    // The prompt keeps the references (they are what names the attachment) and
    // gains a note for any reference that resolved to nothing, so a stale chip
    // cannot be mistaken for a real file.
    const prompt = refsForModel(text, images, pendingFiles.value)
    const attachments = [
      ...pendingImages.value.map((image) => ({ name: image.name, url: image.url, mime: 'image/*' })),
      ...pendingFiles.value,
    ]
    draft.value = ''
    pendingImages.value = []
    pendingFiles.value = []
    const response = await fetch('/api/agent/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId.value, prompt, agent_type: 'general', attachments }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    await loadTurns()
  } catch (error) {
    chatError.value = error instanceof Error ? error.message : String(error)
  } finally {
    sending.value = false
  }
}

/** Put text at the caret and leave the cursor after it. */
function insertAtCaret(text: string) {
  const input = draftInput.value
  if (!input) {
    draft.value += text
    return
  }
  const start = input.selectionStart ?? draft.value.length
  const end = input.selectionEnd ?? start
  const before = draft.value.slice(0, start)
  const after = draft.value.slice(end)
  const lead = before && !/\s$/.test(before) ? ' ' : ''
  draft.value = `${before}${lead}${text}${after}`
  const caret = start + lead.length + text.length
  void nextTick(() => {
    input.focus()
    input.setSelectionRange(caret, caret)
  })
}

async function uploadImage(file: File) {
  const form = new FormData()
  form.append('file', file)
  const response = await fetch('/api/images', { method: 'POST', body: form })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()
  if (!data.url) throw new Error('no url')
  // Core names the stored file `img_<nanos>.<ext>`. The person's own name is
  // what the reference should show, so it is kept here and sent alongside.
  const name = file.name || String(data.file || 'image')
  pendingImages.value.push({ name, url: data.url as string })
  insertAtCaret(refFor('image', pendingImages.value.length, name))
}

async function uploadFile(file: File) {
  const form = new FormData()
  form.append('file', file)
  const response = await fetch('/api/files', { method: 'POST', body: form })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()
  if (!data.url) throw new Error('no url')
  const name = data.name || file.name
  pendingFiles.value.push({ name, url: data.url as string, mime: data.mime, size: data.size })
  insertAtCaret(refFor('file', pendingFiles.value.length, name))
}

async function addFiles(files: File[]) {
  if (!files.length) return
  uploading.value = true
  try {
    for (const file of files) {
      if (file.type.startsWith('image/')) await uploadImage(file)
      else await uploadFile(file)
    }
  } catch (error) {
    chatError.value = error instanceof Error ? error.message : String(error)
  } finally {
    uploading.value = false
  }
}

async function onPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  await addFiles(files)
}

async function onPaste(event: ClipboardEvent) {
  const files = Array.from(event.clipboardData?.files || [])
  if (!files.length) return
  event.preventDefault()
  await addFiles(files)
}

function removeRef(raw: string) {
  // Drop the reference text itself and tidy the double space it leaves behind.
  draft.value = draft.value
    .replace(raw, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .trimEnd()
}

/** Any task touching this session means the conversation moved; refetch. */
function watchTasks() {
  events?.close()
  events = new EventSource('/api/tasks/events?cursor=')
  events.addEventListener('tasks', (event) => {
    try {
      const data = JSON.parse((event as MessageEvent).data)
      const rows = (data.tasks || []) as Row[]
      if (!rows.some((row) => row.session_id === sessionId.value)) return
      void loadTurns()
    } catch { /* keep-alive frame */ }
  })
}

onMounted(async () => {
  await openRoot()
  watchTasks()
})

onBeforeUnmount(() => {
  events?.close()
  events = null
})
</script>

<template>
  <div class="ide">
    <header class="ide-bar">
      <strong>0KAY IDE</strong>
      <span class="path">{{ breadcrumb || rootPath || '—' }}</span>
      <button type="button" class="ghost" :disabled="treeLoading" @click="openRoot()">{{ t('ide.refresh') }}</button>
    </header>

    <div class="ide-body">
      <aside class="ide-tree" :aria-label="t('ide.files')">
        <div class="tree-roots">
          <button v-for="root in roots" :key="root" type="button" class="chip" @click="openRoot(root)">{{ root }}</button>
        </div>
        <p v-if="treeLoading" class="hint">{{ t('ide.loading') }}</p>
        <p v-if="treeError" class="hint bad">{{ treeError }}</p>
        <ul>
          <li v-for="entry in entries" :key="entry.path">
            <button type="button" class="dir" @click="toggleDir(entry)">
              <span class="caret">{{ openDirs[entry.path] ? '▾' : '▸' }}</span>{{ entry.name }}
            </button>
            <ul v-if="openDirs[entry.path]" class="nested">
              <li v-for="child in expanded[entry.path] || []" :key="child.path">
                <button type="button" class="file" @click="openFile(child)">{{ child.name }}</button>
              </li>
            </ul>
          </li>
        </ul>
      </aside>

      <section class="ide-code" :aria-label="t('ide.file')">
        <p v-if="fileLoading" class="hint">{{ t('ide.loading') }}</p>
        <p v-else-if="fileError" class="hint bad">{{ fileError }}</p>
        <p v-else-if="!filePath" class="hint">{{ t('ide.pickFile') }}</p>
        <div v-else class="code-scroll">
          <pre class="code"><code><span v-for="(line, index) in numbered" :key="index" class="line"><span class="ln">{{ index + 1 }}</span>{{ line }}{{ '' }}
</span></code></pre>
        </div>
      </section>

      <section class="ide-chat" :aria-label="t('ide.agent')">
        <div class="chat-log">
          <p v-for="(line, index) in conversation" :key="index" :class="['turn', line.role]">{{ line.text }}</p>
          <p v-if="!conversation.length" class="hint">{{ t('ide.askAnything') }}</p>
        </div>
        <div v-if="activePlan" class="plan-card">
          <div class="plan-head">
            <span class="plan-badge">{{ t('ide.planReady') }}</span>
            <strong class="plan-title">{{ activePlan.title }}</strong>
            <span class="plan-steps">{{ t('ide.planSteps', { n: activePlan.steps }) }}</span>
          </div>
          <div v-if="planOpen" class="plan-body">
            <pre class="plan-md">{{ activePlan.markdown }}</pre>
            <iframe
              v-if="activePlan.demoHtml"
              class="plan-demo"
              :srcdoc="activePlan.demoHtml"
              sandbox=""
              :title="t('ide.planDemo')"
            ></iframe>
          </div>
          <div class="plan-actions">
            <button type="button" class="ghost" @click="planOpen = !planOpen">
              {{ planOpen ? t('ide.planHide') : t('ide.planShow') }}
            </button>
            <button type="button" class="ghost" @click="copyPlan">{{ t('ide.copyPlan') }}</button>
            <button type="button" class="primary" :disabled="sending" @click="buildPlan">{{ t('ide.buildThisPlan') }}</button>
          </div>
        </div>
        <form class="chat-form" @submit.prevent="send">
          <div v-if="draftRefs.length" class="ref-row">
            <span
              v-for="(ref, index) in draftRefs"
              :key="`${ref.raw}-${index}`"
              class="ref-chip"
              :class="{ missing: !ref.resolved }"
            >
              <span class="ref-kind">{{ ref.kind === 'path' ? t('ide.refPath') : ref.kind === 'image' ? t('ide.refImage') : t('ide.refFile') }}</span>
              <span class="ref-name">{{ ref.target }}</span>
              <button
                type="button"
                class="ref-drop"
                :aria-label="t('ide.removeRef')"
                :title="t('ide.removeRef')"
                @click="removeRef(ref.raw)"
              >×</button>
              <span v-if="ref.resolved" class="ref-preview" role="tooltip">
                <img v-if="ref.kind === 'image' && ref.url" :src="ref.url" alt="" />
                <span v-else class="ref-preview-text">{{ ref.url || ref.target }}</span>
              </span>
            </span>
          </div>
          <textarea
            ref="draftInput"
            v-model="draft"
            rows="2"
            :placeholder="t('ide.askAnything')"
            @keydown.enter.exact.prevent="send"
            @paste="onPaste"
          ></textarea>
          <input ref="imageInput" type="file" accept="image/*" multiple hidden @change="onPicked" />
          <input ref="fileInput" type="file" multiple hidden @change="onPicked" />
          <div class="chat-actions">
            <button type="button" class="attach" :title="t('ide.attachImage')" :disabled="uploading" @click="imageInput?.click()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                <path d="M4 17l5-5 4 4 3-3 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button type="button" class="attach" :title="t('ide.attachFile')" :disabled="uploading" @click="fileInput?.click()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <span v-if="uploading" class="hint inline">{{ t('ide.uploading') }}</span>
            <span v-if="chatError" class="hint bad inline">{{ chatError }}</span>
            <button type="submit" class="primary" :disabled="sending || uploading || (!draft.trim() && !pendingImages.length && !pendingFiles.length)">
              {{ t('ide.send') }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.ide { display: flex; flex-direction: column; height: 100%; min-height: 0; background: var(--md-surface); }
.ide-bar { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid var(--md-outline-variant); }
.ide-bar strong { font-size: 13px; letter-spacing: .02em; }
.ide-bar .path { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--md-on-surface-variant); font-size: 12px; }

.ide-body { flex: 1; min-height: 0; display: grid; grid-template-columns: 220px minmax(0, 1fr) 340px; }
.ide-tree { border-right: 1px solid var(--md-outline-variant); overflow: auto; padding: 8px; font-size: 12.5px; }
.ide-code { overflow: hidden; display: flex; flex-direction: column; min-width: 0; }
.ide-chat { border-left: 1px solid var(--md-outline-variant); display: flex; flex-direction: column; min-height: 0; }

.tree-roots { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.chip { border: 1px solid var(--md-outline-variant); background: transparent; border-radius: 7px; padding: 2px 7px; font-size: 11.5px; cursor: pointer; color: var(--md-on-surface-variant); }
.ide-tree ul { list-style: none; margin: 0; padding: 0; }
.nested { padding-left: 12px !important; }
.dir, .file { width: 100%; text-align: left; border: 0; background: transparent; padding: 3px 4px; border-radius: 6px; cursor: pointer; font: inherit; color: var(--md-on-surface); }
.dir:hover, .file:hover { background: color-mix(in srgb, var(--md-primary) 9%, transparent); }
.caret { display: inline-block; width: 12px; color: var(--md-on-surface-variant); }

.code-scroll { flex: 1; overflow: auto; }
.code { margin: 0; padding: 10px 0; font: 12px/1.55 ui-monospace, Consolas, "Cascadia Mono", monospace; }
.code .line { display: block; white-space: pre; padding: 0 12px; }
.code .ln { display: inline-block; width: 44px; margin-right: 12px; text-align: right; color: var(--md-on-surface-variant); opacity: .55; user-select: none; }

.chat-log { flex: 1; overflow: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.turn { margin: 0; font-size: 12.5px; line-height: 1.5; overflow-wrap: anywhere; padding: 7px 10px; border-radius: 10px; }
.turn.you { align-self: flex-end; background: color-mix(in srgb, var(--md-primary) 12%, transparent); }
.turn.her { align-self: flex-start; background: var(--md-surface-container); }

/* The plan handoff: a card, not a chat bubble, because the next move is a
   decision (build it) rather than a reply. */
.plan-card { margin: 0 12px 10px; border: 1px solid var(--md-outline-variant); border-left: 3px solid var(--md-primary); border-radius: 10px; background: var(--md-surface-container-lowest); display: flex; flex-direction: column; min-height: 0; }
.plan-head { display: flex; align-items: center; gap: 8px; padding: 8px 10px; }
.plan-badge { flex: none; padding: 1px 6px; border-radius: 999px; background: color-mix(in srgb, var(--md-primary) 15%, transparent); color: var(--md-primary); font-size: 10px; text-transform: uppercase; letter-spacing: .04em; }
.plan-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12.5px; }
.plan-steps { flex: none; color: var(--md-on-surface-variant); font-size: 11px; }
.plan-body { max-height: 260px; overflow: auto; border-top: 1px solid var(--md-outline-variant); }
.plan-md { margin: 0; padding: 10px; font: 12px/1.55 ui-monospace, Consolas, "Cascadia Mono", monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.plan-demo { width: 100%; height: 220px; border: 0; border-top: 1px solid var(--md-outline-variant); background: #fff; }
.plan-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 8px 10px; border-top: 1px solid var(--md-outline-variant); }

.chat-form { border-top: 1px solid var(--md-outline-variant); padding: 10px; display: flex; flex-direction: column; gap: 8px; }

/* One chip per reference in the draft. The chip and the text are two views of
   the same thing, so removing the chip edits the text. */
.ref-row { display: flex; flex-wrap: wrap; gap: 6px; }
.ref-chip { position: relative; display: inline-flex; align-items: center; gap: 5px; max-width: 100%; padding: 3px 6px 3px 8px; border: 1px solid var(--md-outline-variant); border-radius: 999px; background: var(--md-surface-container); font-size: 11.5px; }
.ref-chip.missing { border-color: var(--md-error); border-style: dashed; }
.ref-kind { color: var(--md-on-surface-variant); text-transform: uppercase; letter-spacing: .04em; font-size: 10px; }
.ref-name { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ref-drop { border: 0; background: transparent; color: var(--md-on-surface-variant); cursor: pointer; font-size: 13px; line-height: 1; padding: 0 1px; }
.ref-drop:hover { color: var(--md-error); }
/* Hover preview. Kept in the DOM and revealed with visibility so it does not
   take part in layout and cannot be hovered into by accident. */
.ref-preview { position: absolute; bottom: calc(100% + 6px); left: 0; z-index: 20; visibility: hidden; opacity: 0; transition: opacity .12s ease; padding: 6px; border: 1px solid var(--md-outline-variant); border-radius: 10px; background: var(--md-surface); box-shadow: 0 8px 24px rgb(0 0 0 / 18%); }
.ref-chip:hover .ref-preview, .ref-chip:focus-within .ref-preview { visibility: visible; opacity: 1; }
.ref-preview img { display: block; max-width: 240px; max-height: 180px; border-radius: 6px; }
.ref-preview-text { display: block; max-width: 260px; overflow-wrap: anywhere; font-size: 11.5px; color: var(--md-on-surface-variant); }

.chat-form textarea { width: 100%; resize: vertical; border: 1px solid var(--md-outline-variant); border-radius: 10px; padding: 8px 10px; font: inherit; font-size: 12.5px; background: var(--md-surface-container-lowest); color: var(--md-on-surface); }
.chat-actions { display: flex; align-items: center; gap: 8px; }
.attach { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 1px solid var(--md-outline-variant); border-radius: 8px; background: transparent; color: var(--md-on-surface-variant); cursor: pointer; }
.attach:hover:not(:disabled) { color: var(--md-primary); border-color: var(--md-primary); }
.attach:disabled { opacity: .45; cursor: not-allowed; }
.primary { margin-left: auto; border: 0; border-radius: 9px; padding: 6px 14px; background: var(--md-primary); color: var(--md-on-primary); font-weight: 600; font-size: 12.5px; cursor: pointer; }
.primary:disabled { opacity: .45; cursor: not-allowed; }
.ghost { border: 1px solid var(--md-outline-variant); background: transparent; border-radius: 8px; padding: 3px 9px; font-size: 11.5px; cursor: pointer; color: var(--md-on-surface-variant); }
.hint { margin: 8px 12px; color: var(--md-on-surface-variant); font-size: 12px; }
.hint.bad { color: var(--md-error); }
.hint.inline { margin: 0; }
</style>
