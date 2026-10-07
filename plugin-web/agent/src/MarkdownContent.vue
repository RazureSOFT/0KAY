<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { escapeHtml, highlightFence } from './highlight'
const props = defineProps<{ content: string }>()

// An odd number of fence markers means the last block is still streaming in;
// half-received code would re-highlight (and jump) on every token, so those
// blocks fall back to plain escaped text until the closing fence arrives.
function fencesClosed(source: string): boolean {
  const markers = source.match(/^[ \t]*(```|~~~)/gm)
  return !markers || markers.length % 2 === 0
}
// `marked.parse` below is synchronous, so this flag is read inside the renderer
// without any reentrancy between parses.
let streaming = false
marked.use({
  breaks: true,
  renderer: {
    code(token: { text?: unknown; lang?: unknown }) {
      const raw = String(token?.text ?? '')
      const language = String(token?.lang || '').trim().split(/\s+/)[0].toLowerCase()
      if (streaming) return `<pre><code>${escapeHtml(raw)}</code></pre>`
      return `<pre><code class="hljs${language ? ` language-${language}` : ''}">${highlightFence(raw, language)}</code></pre>`
    },
  },
})
const html = computed(() => {
  streaming = !fencesClosed(props.content)
  try {
    return DOMPurify.sanitize(marked.parse(props.content, { async: false }) as string)
  } finally { streaming = false }
})
</script>
<template><div class="markdown-content" v-html="html" /></template>
<style scoped>
.markdown-content{line-height:1.75;overflow-wrap:anywhere;font-size:14px}
.markdown-content :deep(pre){padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}
.markdown-content :deep(code){font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}
.markdown-content :deep(pre code){padding:0;background:none}
.markdown-content :deep(table){display:block;overflow:auto;border-collapse:collapse;margin:12px 0}
.markdown-content :deep(th),.markdown-content :deep(td){border:1px solid var(--md-outline-variant);padding:8px 12px}
.markdown-content :deep(blockquote){border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}
.markdown-content :deep(ul),.markdown-content :deep(ol){padding-left:24px}
.markdown-content :deep(a){color:var(--md-primary);text-decoration:underline}
.markdown-content :deep(img){max-width:100%}
.markdown-content :deep(h1),.markdown-content :deep(h2),.markdown-content :deep(h3){margin:16px 0 8px}
/* Fenced code now renders through the shared highlighter (src/highlight.ts);
   token colors mirror HighlightedCode's palette for this scope. */
.markdown-content :deep(.hljs-comment),.markdown-content :deep(.hljs-quote){color:#6a737d}
.markdown-content :deep(.hljs-keyword),.markdown-content :deep(.hljs-selector-tag),.markdown-content :deep(.hljs-doctag),.markdown-content :deep(.hljs-formula){color:#d73a49}
.markdown-content :deep(.hljs-string),.markdown-content :deep(.hljs-regexp),.markdown-content :deep(.hljs-addition){color:#032f62}
.markdown-content :deep(.hljs-number),.markdown-content :deep(.hljs-literal),.markdown-content :deep(.hljs-attr),.markdown-content :deep(.hljs-attribute),.markdown-content :deep(.hljs-built_in),.markdown-content :deep(.hljs-selector-attr),.markdown-content :deep(.hljs-selector-pseudo),.markdown-content :deep(.hljs-meta .hljs-keyword){color:#005cc5}
.markdown-content :deep(.hljs-title),.markdown-content :deep(.hljs-section),.markdown-content :deep(.hljs-name),.markdown-content :deep(.hljs-selector-id),.markdown-content :deep(.hljs-selector-class){color:#6f42c1}
.markdown-content :deep(.hljs-variable),.markdown-content :deep(.hljs-template-variable),.markdown-content :deep(.hljs-symbol),.markdown-content :deep(.hljs-bullet),.markdown-content :deep(.hljs-link){color:#e36209}
.markdown-content :deep(.hljs-tag),.markdown-content :deep(.hljs-meta),.markdown-content :deep(.hljs-deletion){color:#22863a}
.markdown-content :deep(.hljs-type),.markdown-content :deep(.hljs-class .hljs-title),.markdown-content :deep(.hljs-params){color:#005cc5}
</style>
<style>
/* Dark token colors ride on the host's html[data-theme] toggle rather than the
   OS media query (a manual light/dark choice in Settings must be honored).
   Unscoped because scoped styles cannot express an html-level selector; the
   .markdown-content prefix keeps the rules from leaking elsewhere. */
html[data-theme="dark"] .markdown-content .hljs-comment,html[data-theme="dark"] .markdown-content .hljs-quote{color:#8b949e}
html[data-theme="dark"] .markdown-content .hljs-keyword,html[data-theme="dark"] .markdown-content .hljs-selector-tag,html[data-theme="dark"] .markdown-content .hljs-doctag,html[data-theme="dark"] .markdown-content .hljs-formula{color:#ff7b72}
html[data-theme="dark"] .markdown-content .hljs-string,html[data-theme="dark"] .markdown-content .hljs-regexp,html[data-theme="dark"] .markdown-content .hljs-addition{color:#a5d6ff}
html[data-theme="dark"] .markdown-content .hljs-number,html[data-theme="dark"] .markdown-content .hljs-literal,html[data-theme="dark"] .markdown-content .hljs-attr,html[data-theme="dark"] .markdown-content .hljs-attribute,html[data-theme="dark"] .markdown-content .hljs-built_in,html[data-theme="dark"] .markdown-content .hljs-selector-attr,html[data-theme="dark"] .markdown-content .hljs-selector-pseudo,html[data-theme="dark"] .markdown-content .hljs-meta .hljs-keyword{color:#79c0ff}
html[data-theme="dark"] .markdown-content .hljs-title,html[data-theme="dark"] .markdown-content .hljs-section,html[data-theme="dark"] .markdown-content .hljs-name,html[data-theme="dark"] .markdown-content .hljs-selector-id,html[data-theme="dark"] .markdown-content .hljs-selector-class{color:#d2a8ff}
html[data-theme="dark"] .markdown-content .hljs-variable,html[data-theme="dark"] .markdown-content .hljs-template-variable,html[data-theme="dark"] .markdown-content .hljs-symbol,html[data-theme="dark"] .markdown-content .hljs-bullet,html[data-theme="dark"] .markdown-content .hljs-link{color:#ffa657}
html[data-theme="dark"] .markdown-content .hljs-tag,html[data-theme="dark"] .markdown-content .hljs-meta,html[data-theme="dark"] .markdown-content .hljs-deletion{color:#7ee787}
html[data-theme="dark"] .markdown-content .hljs-type,html[data-theme="dark"] .markdown-content .hljs-class .hljs-title,html[data-theme="dark"] .markdown-content .hljs-params{color:#79c0ff}
</style>
