// @ts-check
import eslintPluginAstro from 'eslint-plugin-astro'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['public/scripts/**', 'scripts/**', '.astro/**', 'dist/**', 'src/env.d.ts']
  },
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    }
  }
])
