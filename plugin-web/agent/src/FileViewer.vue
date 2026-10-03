<script setup lang="ts">
// Renders a file according to its type: code/markdown-source use the live
// highlighter editor; markdown renders; PDF uses the browser's PDF viewer over a
// blob URL; docx/pptx are rendered by docx-preview / pptx-preview; images show
// inline.
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import CodeEditor from './CodeEditor.vue'
import MarkdownContent from './MarkdownContent.vue'
import { renderAsync } from 'docx-preview'
import { init as initPptx } from 'pptx-preview'
import SpreadsheetWorker from './spreadsheet.worker?worker&inline'
import DOMPurify from 'dompurify'

const props = defineProps<{
  path: string
  view: string
  modelValue: string
  bytes: Uint8Array | null
  mime: string
  text?: string
  mdSource: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const docxHost = ref<HTMLElement | null>(null)
const pptxHost = ref<HTMLElement | null>(null)
const pdfUrl = ref('')
const dataUrl = ref('')
const renderError = ref('')
const rendering = ref(false)
const sheetNames = ref<string[]>([])
const activeSheet = ref(0)
const sheetHtml = ref('')
let sheets: string[] = []
let cancelSpreadsheet: (() => void) | null = null

function parseSpreadsheet(bytes: Uint8Array): Promise<{ names: string[]; sheets: string[] }> {
  if (bytes.byteLength > 16 * 1024 * 1024) return Promise.reject(new Error('Spreadsheet exceeds 16 MiB preview limit'))
  return new Promise((resolve, reject) => {
    const worker = new SpreadsheetWorker()
    const finish = () => { clearTimeout(timer); worker.terminate(); cancelSpreadsheet = null }
    const timer = setTimeout(() => { finish(); reject(new Error('Spreadsheet preview timed out')) }, 10000)
    cancelSpreadsheet = () => { finish(); reject(new Error('Spreadsheet preview cancelled')) }
    worker.onerror = () => { finish(); reject(new Error('Spreadsheet parsing failed')) }
    worker.onmessage = ({ data }) => { finish(); data.error ? reject(new Error(data.error)) : resolve(data) }
    worker.postMessage(bytes)
  })
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  return btoa(binary)
}

function clearAssets() {
  cancelSpreadsheet?.()
  if (pdfUrl.value) { URL.revokeObjectURL(pdfUrl.value); pdfUrl.value = '' }
  dataUrl.value = ''
  sheetNames.value = []
  activeSheet.value = 0
  sheetHtml.value = ''
  sheets = []
  if (docxHost.value) docxHost.value.innerHTML = ''
  if (pptxHost.value) pptxHost.value.innerHTML = ''
}

// --- spreadsheets (xlsx/xls/ods via SheetJS) ---
function renderSheet() {
  sheetHtml.value = DOMPurify.sanitize(sheets[activeSheet.value] || '')
}
function selectSheet(index: number) { activeSheet.value = index; renderSheet() }

// Monotonic token so a slow render for a previous file can't write into the
// next one (or into a closed panel).
let renderToken = 0
async function render() {
  const token = ++renderToken
  clearAssets()
  renderError.value = ''
  const bytes = props.bytes
  if (!bytes || !bytes.length) return
  rendering.value = true
  try {
    await nextTick()
    if (token !== renderToken) return
    if (props.view === 'pdf') {
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
      if (token !== renderToken) { URL.revokeObjectURL(url); return }
      pdfUrl.value = url
    } else if (props.view === 'spreadsheet') {
      const workbook = await parseSpreadsheet(bytes)
      if (token !== renderToken) return
      sheetNames.value = workbook.names
      sheets = workbook.sheets
      activeSheet.value = 0
      renderSheet()
    } else if (props.view === 'image') {
      dataUrl.value = `data:${props.mime || 'image/png'};base64,${bytesToBase64(bytes)}`
    } else if (props.view === 'docx') {
      const host = docxHost.value
      if (host) await renderAsync(new Blob([bytes]), host, undefined, { inWrapper: true, ignoreWidth: true, breakPages: true, renderHeaders: true, renderFooters: true })
    } else if (props.view === 'pptx') {
      const host = pptxHost.value
      if (host && token === renderToken) {
        const width = host.clientWidth || 720
        const previewer = initPptx(host, { width, height: Math.round((width * 9) / 16) })
        previewer.preview(bytes.buffer)
      }
    }
  } catch (e: any) { if (token === renderToken) renderError.value = e?.message || 'render failed' }
  finally { if (token === renderToken) rendering.value = false }
}

watch(() => [props.view, props.bytes], () => { void render() })
onMounted(() => { void render() })
onBeforeUnmount(() => { renderToken++; clearAssets() })
</script>

<template>
  <div class="file-viewer">
    <CodeEditor
      v-if="view === 'code' || (view === 'markdown' && mdSource)"
      :model-value="modelValue"
      :path="path"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <div v-else-if="view === 'markdown'" class="fv-scroll fv-md"><MarkdownContent :content="modelValue" /></div>
    <iframe v-else-if="view === 'pdf' && pdfUrl" class="fv-pdf" :src="pdfUrl" :title="path" />
    <div v-else-if="view === 'spreadsheet'" class="fv-scroll fv-sheet">
      <div v-if="sheetNames.length > 1" class="sheet-tabs">
        <button v-for="(name, i) in sheetNames" :key="name" type="button" :class="{ active: i === activeSheet }" @click="selectSheet(i)">{{ name }}</button>
      </div>
      <div class="sheet-grid" v-html="sheetHtml" />
    </div>
    <div v-else-if="view === 'image'" class="fv-scroll fv-center"><img v-if="dataUrl" class="fv-img" :src="dataUrl" :alt="path" /></div>
    <div v-else-if="view === 'docx'" ref="docxHost" class="fv-scroll fv-docx" />
    <div v-else-if="view === 'pptx'" ref="pptxHost" class="fv-scroll fv-pptx" />
    <div v-else-if="view === 'text'" class="fv-scroll fv-text"><pre class="fv-plain">{{ text || '（没有可提取的文本）' }}</pre></div>
    <div v-else class="fv-msg">{{ rendering ? '渲染中…' : '无法预览此文件' }}</div>
    <div v-if="rendering" class="fv-loading"><span class="fv-spin" aria-hidden="true"></span>{{ '渲染中…' }}</div>
    <div v-if="renderError" class="fv-error">{{ renderError }}</div>
  </div>
</template>

<style scoped>
#app .file-viewer{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;background:var(--md-surface-container-lowest)}
#app .fv-scroll{flex:1;min-height:0;overflow:auto}
#app .fv-md{padding:18px 22px}
#app .fv-md :deep(.markdown-content){max-width:820px;margin:0 auto}
#app .fv-pdf{flex:1;min-height:0;width:100%;border:0;border-top:1px solid var(--md-outline-variant);background:#fff}
#app .fv-center{display:flex;align-items:center;justify-content:center;padding:16px;background:var(--md-surface-container)}
#app .fv-img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;box-shadow:var(--shadow-2)}
#app .fv-sheet{padding:0}
#app .sheet-tabs{position:sticky;top:0;z-index:1;display:flex;gap:4px;padding:8px 10px;background:var(--md-surface-container-low);border-bottom:1px solid var(--md-outline-variant);overflow-x:auto}
#app .sheet-tabs button{height:26px;padding:0 12px;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:12px;white-space:nowrap;cursor:pointer;transition:background-color 140ms,transform 140ms var(--ease-emphasized-decel)}
#app .sheet-tabs button:hover{background:var(--md-surface-container-high)}
#app .sheet-tabs button:active{transform:scale(.97)}
#app .sheet-tabs button.active{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}
#app .sheet-grid{padding:12px}
#app .sheet-grid table{border-collapse:collapse;font-size:12px;font-family:var(--code-font)}
#app .sheet-grid td{border:1px solid var(--md-outline-variant);padding:3px 9px;white-space:nowrap;max-width:340px;overflow:hidden;text-overflow:ellipsis}
#app .fv-docx{padding:12px}
#app .fv-docx :deep(.docx-wrapper){background:transparent;padding:0}
#app .fv-docx :deep(.docx-wrapper>section.docx){margin:0 auto 12px;box-shadow:var(--shadow-2)}
#app .fv-pptx{padding:12px}
#app .fv-text{padding:18px 22px}
#app .fv-plain{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-family:inherit;font-size:13.5px;line-height:1.75;color:var(--md-on-surface)}
#app .fv-msg{padding:30px 18px;text-align:center;color:var(--md-on-surface-variant);font-size:13px}
#app .fv-loading{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;gap:9px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);color:var(--md-on-surface-variant);font-size:12.5px}
#app .fv-spin{width:16px;height:16px;border-radius:50%;border:2px solid color-mix(in srgb,var(--md-primary) 28%,transparent);border-top-color:var(--md-primary);animation:fv-spin .7s linear infinite}
@keyframes fv-spin{to{transform:rotate(360deg)}}
#app .fv-error{position:absolute;left:12px;right:12px;bottom:12px;z-index:3;padding:8px 12px;border-radius:10px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:12px;overflow-wrap:anywhere;box-shadow:var(--shadow-2)}
</style>
