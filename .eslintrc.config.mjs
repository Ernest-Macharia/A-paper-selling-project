module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'prettier'
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    rules: {
      'eol-last': ['error', 'always'],
      'key-spacing': ['error'],
      'keyword-spacing': ['error'],
      'linebreak-style': ['error', 'unix'],
      'max-len': ['error', { code: 120 }],
      'no-lonely-if': ['error'],
      'no-multi-spaces': ['error'],
      'no-nested-ternary': ['error'],
      'no-unneeded-ternary': ['error'],
      'no-unused-vars': ['error', { args: 'none' }],
      'no-var': ['error'],
      'no-trailing-spaces': ['error'],
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'space-before-blocks': ['error'],
      'vue/html-self-closing': 'off',
      'vue/html-closing-bracket-newline': [
          'error',
          {
              singleline: 'never',
              multiline: 'always',
          },
      ],
      'vue/html-closing-bracket-spacing': ['error'],
      'vue/html-indent': [
          'error',
          4,
          {
              attribute: 1,
              closeBracket: 0,
              alignAttributesVertically: true,
              ignores: [],
          },
      ],
      'vue/max-attributes-per-line': [
          'error',
          {
              singleline: {
                  max: 2,
              },
              multiline: {
                  max: 1,
              },
          },
      ],
      'vue/no-template-shadow': 'off',
      'vue/prop-name-casing': 'off',
      'vue/require-default-prop': 'off',
      'vue/script-indent': [
          'error',
          4,
          {
              baseIndent: 1,
          },
      ],
      'vue/this-in-template': ['error'],
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
    }
  }
  