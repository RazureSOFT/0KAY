<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
const props = defineProps<{ content: string }>()
const html = computed(() => DOMPurify.sanitize(marked.parse(props.content, { async: false, breaks: true }) as string))
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
</style>
