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
