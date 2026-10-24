import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'public/**', 'scripts/**', '**/*.cjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    rules: {
      // vue-tsc already enforces these; ESLint focuses on correctness/style.
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
      // Every one of these is a deliberate "swallow and carry on" (a malformed
      // SSE frame, a disabled storage API). They used to carry a comment saying
      // so; the comment strip removed it and turned them into bare `catch {}`.
      // Repeating the same sentence 67 times would be worse than the rule.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
)
