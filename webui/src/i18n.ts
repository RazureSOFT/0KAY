import { createI18n } from 'vue-i18n'
import enRaw from './locales/en.json'
import jaRaw from './locales/ja.json'
import zhRaw from './locales/zh.json'
import zhHantRaw from './locales/zh-Hant.json'

/**
 * Unwrap a locale module.
 *
 * The locale files are served through a build-time virtual module (see
 * precompile-i18n.ts). Depending on the bundler path that module arrives either
 * as the message table itself or wrapped as `{ default: table }`, and a wrapped
 * table makes every lookup miss — the page then renders every label as its own
 * key, and vue-i18n reports "Not found … key" for keys that are plainly there.
 *
 * Unwrapping happens here, once, instead of at each use site.
 */
function messagesOf<T>(module: T): Record<string, any> {
  if (!module || typeof module !== 'object') return {}
  const table = module as unknown as Record<string, unknown>
  const keys = Object.keys(table)
  const wrapped = table.default
  if (keys.length === 1 && wrapped && typeof wrapped === 'object') {
    return wrapped as Record<string, any>
  }
  return table as Record<string, any>
}

// Typed as a plain record on purpose: the JSON literal types are enormous, and
// letting the composer infer from them makes instantiation explode downstream.
const en = messagesOf(enRaw)
const ja = messagesOf(jaRaw)
const zh = messagesOf(zhRaw)
const zhHant = messagesOf(zhHantRaw)

export const LOCALES = [
  { code: 'en', label: 'English', english: 'English' },
  { code: 'ja', label: '日本語', english: 'Japanese' },
  { code: 'zh', label: '简体中文', english: 'Simplified Chinese' },
  { code: 'zh-Hant', label: '繁體中文', english: 'Traditional Chinese' },
] as const

const CODES: string[] = LOCALES.map((locale) => locale.code)
type LocaleCode = (typeof LOCALES)[number]['code']

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

//  is a plain record, so the composer's generic inference would recurse
// through it and blow up type instantiation downstream (chat.ts:446). The cast
// keeps the public shape (, ) and stops the
// inference; the message tables are unchecked either way, they come from JSON.
export const i18n: any = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, ja, zh, 'zh-Hant': zhHant },
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