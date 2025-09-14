// https://stylelint.io/

module.exports = {
  plugins: ["stylelint-prettier" /* stylelint-order */],
  extends: [
    // standard 规则集合
    // "stylelint-config-standard",
    // 样式属性顺序规则
    'stylelint-config-recess-order',
    // vue规则
    // "stylelint-config-html/vue",
    // "stylelint-config-recommended-vue",
    "stylelint-config-standard-less",
    // 接入 Prettier 规则
    "stylelint-config-prettier",
    "stylelint-prettier/recommended",
  ],
  // customSyntax: "postcss-html",
  // allowEmptyInput: true,
  overrides: [
    {
      "files": ["**/*.vue", "**/*.tsx"],
      "customSyntax": "postcss-html"
    },
    {
      "files": ["**/*.less"],
      "customSyntax": "postcss-less"
    }
  ],
  // 配置 rules
  rules: {
    // 开启 Prettier 自动格式化功能
    "prettier/prettier": true,
    // less插件
    "less/no-duplicate-variables": null,
    "selector-class-pattern": ".",
    // "ignoreMediaFeatureNames": "",
    // 默认
    "function-url-quotes": "always",
    "at-rule-no-unknown": null,
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: [
          "fade",
          "fadeout",
          "tint",
          "darken",
          "ceil",
          "fadein",
          "floor",
          "unit",
          "shade",
          "lighten",
          "percentage",
          "-",
          "~`colorPalette",
          "extract"
        ],
      },
    ],
  },
};
