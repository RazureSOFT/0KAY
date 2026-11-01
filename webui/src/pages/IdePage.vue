<script setup lang="ts">
/**
 * The IDE: files on the left, contents in the middle, the agent on the right.
 *
 * This is the first slice — it reads and asks. Editing goes through the agent
 * rather than a text box, because the agent already owns the write path (and its
 * approval rules); a second editor writing files directly would be a second
 * policy to keep in sync.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type Entry = { name: string; path: string }
type Row = {
  task_id: string
  session_id?: string
  kind?: string
  state?: string
  prompt?: string
  result?: string
  started_at?: string
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
  if (!text || sending.value) return
  if (!sessionId.value) await ensureSession().catch(() => undefined)
  if (!sessionId.value) {
    chatError.value = t('ide.noSession')
    return
  }
  sending.value = true
  chatError.value = ''
  try {
    draft.value = ''
    const response = await fetch('/api/agent/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId.value, prompt: text, agent_type: 'general' }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    await loadTurns()
  } catch (error) {
    chatError.value = error instanceof Error ? error.message : String(error)
  } finally {
    sending.value = false
  }
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
        <form class="chat-form" @submit.prevent="send">
          <textarea
            v-model="draft"
            rows="2"
            :placeholder="t('ide.askAnything')"
            @keydown.enter.exact.prevent="send"
          ></textarea>
          <div class="chat-actions">
            <span v-if="chatError" class="hint bad">{{ chatError }}</span>
            <button type="submit" class="primary" :disabled="sending || !draft.trim()">{{ t('ide.send') }}</button>
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

.chat-form { border-top: 1px solid var(--md-outline-variant); padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.chat-form textarea { width: 100%; resize: vertical; border: 1px solid var(--md-outline-variant); border-radius: 10px; padding: 8px 10px; font: inherit; font-size: 12.5px; background: var(--md-surface-container-lowest); color: var(--md-on-surface); }
.chat-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
.primary { border: 0; border-radius: 9px; padding: 6px 14px; background: var(--md-primary); color: var(--md-on-primary); font-weight: 600; font-size: 12.5px; cursor: pointer; }
.primary:disabled { opacity: .45; cursor: not-allowed; }
.ghost { border: 1px solid var(--md-outline-variant); background: transparent; border-radius: 8px; padding: 3px 9px; font-size: 11.5px; cursor: pointer; color: var(--md-on-surface-variant); }
.hint { margin: 8px 12px; color: var(--md-on-surface-variant); font-size: 12px; }
.hint.bad { color: var(--md-error); }
</style>
