<script setup lang="ts">
import { computed } from 'vue'
import { highlightCode } from './highlight'
const props = defineProps<{ code: string; path?: string }>()
const html = computed(() => highlightCode(props.code, props.path))
</script>

<template><pre class="hl-code"><code class="hljs" v-html="html" /></pre></template>

<style scoped>
/* Metrics here must stay identical to CodeEditor's textarea (no italic/bold)
   so the highlighted backdrop lines up with the editable text. */
.hl-code{margin:0;padding:12px 14px;font-family:var(--code-font,ui-monospace,'Cascadia Code','JetBrains Mono',Consolas,'SFMono-Regular',Menlo,monospace);font-size:12px;line-height:1.6;white-space:pre;tab-size:2;color:var(--md-on-surface)}
.hl-code code{font:inherit;background:none;padding:0}
.hl-code :deep(.hljs-comment),.hl-code :deep(.hljs-quote){color:#6a737d}
.hl-code :deep(.hljs-keyword),.hl-code :deep(.hljs-selector-tag),.hl-code :deep(.hljs-doctag),.hl-code :deep(.hljs-formula){color:#d73a49}
.hl-code :deep(.hljs-string),.hl-code :deep(.hljs-regexp),.hl-code :deep(.hljs-addition){color:#032f62}
.hl-code :deep(.hljs-number),.hl-code :deep(.hljs-literal),.hl-code :deep(.hljs-attr),.hl-code :deep(.hljs-attribute),.hl-code :deep(.hljs-built_in),.hl-code :deep(.hljs-selector-attr),.hl-code :deep(.hljs-selector-pseudo),.hl-code :deep(.hljs-meta .hljs-keyword){color:#005cc5}
.hl-code :deep(.hljs-title),.hl-code :deep(.hljs-section),.hl-code :deep(.hljs-name),.hl-code :deep(.hljs-selector-id),.hl-code :deep(.hljs-selector-class){color:#6f42c1}
.hl-code :deep(.hljs-variable),.hl-code :deep(.hljs-template-variable),.hl-code :deep(.hljs-symbol),.hl-code :deep(.hljs-bullet),.hl-code :deep(.hljs-link){color:#e36209}
.hl-code :deep(.hljs-tag),.hl-code :deep(.hljs-meta),.hl-code :deep(.hljs-deletion){color:#22863a}
.hl-code :deep(.hljs-type),.hl-code :deep(.hljs-class .hljs-title),.hl-code :deep(.hljs-params){color:#005cc5}
@media (prefers-color-scheme: dark){
  .hl-code :deep(.hljs-comment),.hl-code :deep(.hljs-quote){color:#8b949e}
  .hl-code :deep(.hljs-keyword),.hl-code :deep(.hljs-selector-tag),.hl-code :deep(.hljs-doctag),.hl-code :deep(.hljs-formula){color:#ff7b72}
  .hl-code :deep(.hljs-string),.hl-code :deep(.hljs-regexp),.hl-code :deep(.hljs-addition){color:#a5d6ff}
  .hl-code :deep(.hljs-number),.hl-code :deep(.hljs-literal),.hl-code :deep(.hljs-attr),.hl-code :deep(.hljs-attribute),.hl-code :deep(.hljs-built_in),.hl-code :deep(.hljs-selector-attr),.hl-code :deep(.hljs-selector-pseudo),.hl-code :deep(.hljs-meta .hljs-keyword){color:#79c0ff}
  .hl-code :deep(.hljs-title),.hl-code :deep(.hljs-section),.hl-code :deep(.hljs-name),.hl-code :deep(.hljs-selector-id),.hl-code :deep(.hljs-selector-class){color:#d2a8ff}
  .hl-code :deep(.hljs-variable),.hl-code :deep(.hljs-template-variable),.hl-code :deep(.hljs-symbol),.hl-code :deep(.hljs-bullet),.hl-code :deep(.hljs-link){color:#ffa657}
  .hl-code :deep(.hljs-tag),.hl-code :deep(.hljs-meta),.hl-code :deep(.hljs-deletion){color:#7ee787}
  .hl-code :deep(.hljs-type),.hl-code :deep(.hljs-class .hljs-title),.hl-code :deep(.hljs-params){color:#79c0ff}
}
</style>
