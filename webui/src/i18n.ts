import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import zhHant from './locales/zh-Hant.json'

/** Languages offered in the UI. `zh` is Simplified, `zh-Hant` Traditional. */
export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '简体中文' },
  { code: 'zh-Hant', label: '繁體中文' },
] as const

const CODES: string[] = LOCALES.map((locale) => locale.code)
type LocaleCode = (typeof LOCALES)[number]['code']

/** Resolve the initial locale from storage, then the browser, then English. */
function detectLocale(): string {
  const saved = localStorage.getItem('0kay_lang')
  if (saved && CODES.includes(saved)) return saved
  const lang = (navigator.language || 'en').toLowerCase()
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('zh')) {
    if (['tw', 'hk', 'mo', 'hant'].some((tag) => lang.includes(tag))) return 'zh-Hant'
    return 'zh'
  }
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ja,
    zh,
    'zh-Hant': zhHant,
  },
})

export function setLanguage(lang: string) {
  if (!CODES.includes(lang)) return
  i18n.global.locale.value = lang as LocaleCode
  localStorage.setItem('0kay_lang', lang)
  document.documentElement.lang = lang
}

export function getLanguage(): string {
  return i18n.global.locale.value
}
