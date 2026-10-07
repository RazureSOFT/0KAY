<script setup lang="ts">
// Live syntax-highlighted code editor: a transparent <textarea> overlaid on a
// highlighted <pre>. Both share identical font metrics and padding; the textarea
// owns scrolling and the backdrop follows it, so the text and colors stay in
// lockstep as you type.
import { nextTick, onUnmounted, ref, watch } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

const props = defineProps<{ modelValue: string; path?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const textarea = ref<HTMLTextAreaElement | null>(null)
const backdrop = ref<HTMLElement | null>(null)

// Highlighting is O(n) over the whole buffer, so feeding the raw model value
// re-highlighted on every keystroke. The textarea itself is uncontrolled-fast
// (its own value updates instantly); the backdrop trails typing by a short
// debounce instead. Real value stays exact for save/dirty tracking.
const highlightSource = ref(props.modelValue)
let highlightTimer: ReturnType<typeof setTimeout> | null = null
watch(() => props.modelValue, (value) => {
  if (highlightTimer) clearTimeout(highlightTimer)
  highlightTimer = setTimeout(() => { highlightTimer = null; highlightSource.value = value }, 150)
})
onUnmounted(() => { if (highlightTimer) clearTimeout(highlightTimer) })

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function onScroll() {
  const input = textarea.value
  const back = backdrop.value
  if (!input || !back) return
  back.scrollTop = input.scrollTop
  back.scrollLeft = input.scrollLeft
}

// Tab indents instead of moving focus (two spaces), matching the code view.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Tab') return
  event.preventDefault()
  const input = textarea.value
  if (!input) return
  const start = input.selectionStart
  const end = input.selectionEnd
  emit('update:modelValue', `${input.value.slice(0, start)}  ${input.value.slice(end)}`)
  nextTick(() => { input.selectionStart = input.selectionEnd = start + 2 })
}

function focus() { textarea.value?.focus() }
defineExpose({ focus })
</script>

<template>
  <div class="code-editor">
    <div ref="backdrop" class="code-editor-backdrop" aria-hidden="true">
      <HighlightedCode :code="(highlightSource || '') + '\n'" :path="path" />
    </div>
    <textarea
      ref="textarea"
      class="code-editor-input"
      :value="modelValue"
      spellcheck="false"
      autocomplete="off"
      autocapitalize="off"
      :aria-label="path || 'code'"
      @input="onInput"
      @scroll="onScroll"
      @keydown="onKeydown"
    />
  </div>
</template>

<style scoped>
/* The host styles `#app :is(input, select, textarea)` with a high-specificity
   rule (four :not()s) that sets an opaque background — which would hide the
   highlight layer behind the transparent text and make the editor look blank.
   `!important` is the reliable way past it here. */
#app .code-editor{position:relative;flex:1;min-height:0;overflow:hidden;background-color:var(--md-surface-container-lowest)}
#app .code-editor-backdrop{position:absolute;inset:0;overflow:hidden;pointer-events:none;user-select:none}
#app .code-editor-input{
  position:absolute;inset:0;width:100%;height:100%;margin:0!important;
  padding:12px 14px!important;border:0!important;border-radius:0!important;
  resize:none!important;outline:none!important;tab-size:2;box-shadow:none!important;
  font-family:var(--code-font,ui-monospace,'Cascadia Code','JetBrains Mono',Consolas,'SFMono-Regular',Menlo,monospace)!important;
  font-size:12px!important;line-height:1.6!important;
  white-space:pre!important;overflow:auto!important;
  background-color:transparent!important;background-image:none!important;
  color:transparent!important;-webkit-text-fill-color:transparent!important;caret-color:var(--md-on-surface)!important;
}
#app .code-editor-input:focus{box-shadow:none!important;border-color:transparent!important;outline:none!important}
#app .code-editor:focus-within{box-shadow:inset 0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}
#app .code-editor-input::selection{background:color-mix(in srgb,var(--md-primary) 32%,transparent)}
#app .code-editor-backdrop :deep(.hl-code){background-color:transparent!important}
</style>
