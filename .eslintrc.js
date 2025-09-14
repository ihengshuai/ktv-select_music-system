module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    __isDev__: "readonly",
    PUBLIC_PATH: "readonly",
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType:'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    // "standard",
    'plugin:vue/vue3-recommended',
    "plugin:prettier/recommended",
  ],
  plugins: ["import", "vue", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-explicit-any": "off",
    "ban-types": "off",
    "no-unused-vars": "warn",
    "no-debugger": "warn",
    "prefer-promise-reject-errors": ["error", {"allowEmptyReject": true}],
    "camelcase": ["error", { allow: ["^__", "Window"] }],
    "prefer-promise-reject-errors": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: true,
        },
        filter: {
          regex: "ProvidedContext",
          match: false,
        }
      },
    ],
    'import/first': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
            position: 'after'
          }
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
      },
    ],
    // vue
    "vue/no-v-html": "off",
    "vue/multi-word-component-names": "off",
    "vue/one-component-per-file": "off",
  },
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        'import/order': 'off',
      },
    },
  ]
}
