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
</style>
<style>
/* Dark token colors ride on the host's html[data-theme] toggle rather than the
   OS media query (a manual light/dark choice in Settings must be honored).
   Unscoped because scoped styles cannot express an html-level selector; the
   #app prefix keeps the rules from leaking. */
html[data-theme="dark"] #app .hl-code .hljs-comment,html[data-theme="dark"] #app .hl-code .hljs-quote{color:#8b949e}
html[data-theme="dark"] #app .hl-code .hljs-keyword,html[data-theme="dark"] #app .hl-code .hljs-selector-tag,html[data-theme="dark"] #app .hl-code .hljs-doctag,html[data-theme="dark"] #app .hl-code .hljs-formula{color:#ff7b72}
html[data-theme="dark"] #app .hl-code .hljs-string,html[data-theme="dark"] #app .hl-code .hljs-regexp,html[data-theme="dark"] #app .hl-code .hljs-addition{color:#a5d6ff}
html[data-theme="dark"] #app .hl-code .hljs-number,html[data-theme="dark"] #app .hl-code .hljs-literal,html[data-theme="dark"] #app .hl-code .hljs-attr,html[data-theme="dark"] #app .hl-code .hljs-attribute,html[data-theme="dark"] #app .hl-code .hljs-built_in,html[data-theme="dark"] #app .hl-code .hljs-selector-attr,html[data-theme="dark"] #app .hl-code .hljs-selector-pseudo,html[data-theme="dark"] #app .hl-code .hljs-meta .hljs-keyword{color:#79c0ff}
html[data-theme="dark"] #app .hl-code .hljs-title,html[data-theme="dark"] #app .hl-code .hljs-section,html[data-theme="dark"] #app .hl-code .hljs-name,html[data-theme="dark"] #app .hl-code .hljs-selector-id,html[data-theme="dark"] #app .hl-code .hljs-selector-class{color:#d2a8ff}
html[data-theme="dark"] #app .hl-code .hljs-variable,html[data-theme="dark"] #app .hl-code .hljs-template-variable,html[data-theme="dark"] #app .hl-code .hljs-symbol,html[data-theme="dark"] #app .hl-code .hljs-bullet,html[data-theme="dark"] #app .hl-code .hljs-link{color:#ffa657}
html[data-theme="dark"] #app .hl-code .hljs-tag,html[data-theme="dark"] #app .hl-code .hljs-meta,html[data-theme="dark"] #app .hl-code .hljs-deletion{color:#7ee787}
html[data-theme="dark"] #app .hl-code .hljs-type,html[data-theme="dark"] #app .hl-code .hljs-class .hljs-title,html[data-theme="dark"] #app .hl-code .hljs-params{color:#79c0ff}
</style>
