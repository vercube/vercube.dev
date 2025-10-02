// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['*.vue'],
  rules: {
    'eslint-disable vue/no-multiple-template-root': 'off'
  }
})
