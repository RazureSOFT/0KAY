<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{ reasoning?: string; open?: boolean; label?: string }>()
const pre = ref<HTMLElement | null>(null)

async function toBottom() {
  await nextTick()
  const el = pre.value
  if (el) el.scrollTop = el.scrollHeight
}

// The chain streams in token by token; keep the newest line in view while it
// is still being written, and when it is (re)opened.
watch(() => props.reasoning, () => { if (props.open) void toBottom() })
watch(() => props.open, (value) => { if (value) void toBottom() })
</script>

<template>
  <details class="think-chain" :open="open">
    <summary>{{ label }}</summary>
    <pre ref="pre">{{ reasoning }}</pre>
  </details>
</template>

<style scoped>
.think-chain{margin:2px 0 8px;border:0;border-radius:10px;background:var(--md-surface-container-low);overflow:hidden}
.think-chain>summary{display:inline-flex;align-items:center;gap:5px;cursor:pointer;list-style:none;padding:3px 10px;font-size:11px;font-weight:600;letter-spacing:.03em;color:var(--md-on-surface-variant);user-select:none;border-radius:999px;background:var(--md-surface-container)}
.think-chain>summary::-webkit-details-marker{display:none}
.think-chain>summary::before{content:'▸';display:inline-block;transition:transform .15s}
.think-chain[open]>summary::before{transform:rotate(90deg)}
.think-chain>pre{margin:0;padding:6px 10px 8px;max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--code-font);font-size:11.5px;line-height:1.55;color:var(--md-on-surface-variant)}
</style>
