// Test double for `@0kay/host`.
//
// In the real page this module comes from the WebUI import map: the host hands
// the plugin a bridge to its own Vue/i18n/Pinia instances. Under vitest there is
// no host, so the alias in vitest.config.ts points here instead. Keep this small:
// only what components actually import, and make the translation function return
// the key so an assertion can look for `agent.page.x` and mean it.

export const i18n = {
  global: {
    t: (key: string, named?: Record<string, unknown>) => {
      if (!named) return key
      return Object.entries(named).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        key,
      )
    },
    locale: { value: 'en' },
  },
}

let counter = 0
export const uid = (prefix = 'id') => `${prefix}-${++counter}`

export const useConfirm = () => ({
  confirm: async () => true,
})

// A dropdown is a real component in the host, so the stub renders the options it
// is given: assertions can then check what the user would have been able to pick.
export const AppSelect = {
  name: 'AppSelect',
  props: { modelValue: { default: '' }, options: { type: Array, default: () => [] } },
  emits: ['update:modelValue'],
  template: '<select><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
}
