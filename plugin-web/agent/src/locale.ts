// Plugin-local i18n locale (host vue-i18n stays private to the WebUI).
// Mirrors the host's persisted `0kay_lang` key; refreshed on each page mount.
import { ref } from 'vue'

function read(): 'zh' | 'en' {
  const saved = localStorage.getItem('0kay_lang')
  if (saved === 'en' || saved === 'zh') return saved
  return navigator.language.startsWith('zh') ? 'zh' : 'en'
}

export const locale = ref<'zh' | 'en'>(read())

export function syncLocale() {
  locale.value = read()
}
