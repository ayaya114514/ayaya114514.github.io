// @ts-check
import js from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  {
    ignores: [
      'public/scripts/**',
      'scripts/**/*.py',
      'scripts/.venv/**',
      'scripts/debug/**',
      '.astro/**',
      'dist/**',
      'src/env.d.ts'
    ]
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node
    }
  },
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    }
  }
])
