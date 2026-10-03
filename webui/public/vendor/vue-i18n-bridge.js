// Host vue-i18n bridge for plugin bare `import { useI18n } from "vue-i18n"`.
// Resolved via index.html importmap; re-exports the host copy injected as
// window.__0KAY_VUE_I18N__ so plugin pages share the app's i18n instance
// (and therefore its injection symbol).
const M = globalThis.__0KAY_VUE_I18N__
if (!M) {
  throw new Error('[0kay] window.__0KAY_VUE_I18N__ is not ready (load after WebUI main)')
}

export default M

export const {
  createI18n, useI18n, I18nInjectionKey, vT, vTDirective, Translation, useTranslate,
} = M
