import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

// Get saved language from localStorage or use browser language
const savedLang = localStorage.getItem('0kay_lang')
const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en'
const defaultLang = savedLang || browserLang

export const i18n = createI18n({
  legacy: false,
  locale: defaultLang,
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
})

export function setLanguage(lang: string) {
  if (lang !== 'en' && lang !== 'zh') return
  i18n.global.locale.value = lang
  localStorage.setItem('0kay_lang', lang)
  document.documentElement.lang = lang
}

export function getLanguage(): string {
  return i18n.global.locale.value
}
