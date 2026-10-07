<script setup lang="ts">
/**
 * Nav icon, resolved from an icon key.
 *
 * This replaces a 90-line v-if/v-else-if chain of inline <svg> inside App.vue.
 * Two things were wrong with that: adding an icon meant editing the template's
 * markup (so the `console` entry could not just declare `icon: 'console'`), and
 * every icon was matched on `item.icon === 'x' || item.id === 'x'`, so an id
 * could silently pick up the wrong glyph.
 *
 * Icons are a data table now: one entry per name, no template branching, and an
 * explicit fallback. Paths are stroke-based on a 24x24 grid so they inherit
 * `currentColor` and stay legible in both themes.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name?: string; size?: number }>(), { size: 22 })

/** name -> inner SVG markup. */
const ICONS: Record<string, string> = {
  chat: '<path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  agents:
    '<rect x="4" y="7" width="16" height="12" rx="4" stroke="currentColor" stroke-width="2"/>' +
    '<circle cx="9" cy="13" r="1.5" fill="currentColor"/>' +
    '<circle cx="15" cy="13" r="1.5" fill="currentColor"/>' +
    '<path d="M12 7V4M8 4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  plugins: '<path d="M8 3v4M16 3v4M3 10h18M7 14h4v7H7v-7zM13 14h4v4h-4v-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  usage:
    '<path d="M4 19V5M4 19h16" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M8 15v-4M12 15V8M16 15v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  updates:
    '<path d="M12 4v10M12 14l-3.5-3.5M12 14l3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M5 17.5A4 4 0 0 0 8.5 20h7a4 4 0 0 0 .5-7.97" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  settings:
    '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  search:
    '<circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M16 16l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  // The console icon: a terminal prompt, which reads as "diagnostics" at a glance
  // and is distinguishable from the chat bubble at 22px.
  console:
    '<rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M7 9.5l3 2.5-3 2.5M12.5 15H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  minecraft:
    '<path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M4 8l8 4 8-4M12 12v8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
}

/** Fallback glyph for an unknown key: a neutral rounded square. */
const FALLBACK =
  '<rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" stroke-width="2"/>' +
  '<circle cx="12" cy="12" r="2" fill="currentColor"/>'

const markup = computed(() => ICONS[props.name || ''] ?? FALLBACK)
</script>

<template>
  <!-- Decorative: the adjacent label already names the destination, so the SVG
       is hidden from assistive tech rather than announced twice. -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
    v-html="markup"
  />
</template>
