<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name?: string; size?: number }>(), { size: 22 })

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
  console:
    '<rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M7 9.5l3 2.5-3 2.5M12.5 15H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  minecraft:
    '<path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M4 8l8 4 8-4M12 12v8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  // Settings tab icons (shared with SettingsPage's category nav).
  globe:
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" stroke="currentColor" stroke-width="2"/>',
  cloud:
    '<path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  chip:
    '<rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  person:
    '<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  avatar:
    '<circle cx="12" cy="10" r="6" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M5 21c1.5-3 4-4.5 7-4.5S17.5 18 19 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="10" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/>',
  brightness:
    '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  warn:
    '<path d="M12 4l9 16H3L12 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M12 10v4M12 17.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  info:
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M12 11v5M12 7.5v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  download:
    '<path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  shield:
    '<path d="M12 3l7 3v6c0 4.2-2.8 7.6-7 9-4.2-1.4-7-4.8-7-9V6l7-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  link:
    '<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>' +
    '<rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M14 17h7M17.5 13.5v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  lock:
    '<rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
}

const FALLBACK =
  '<rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" stroke-width="2"/>' +
  '<circle cx="12" cy="12" r="2" fill="currentColor"/>'

const markup = computed(() => ICONS[props.name || ''] ?? FALLBACK)
</script>

<template>
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
