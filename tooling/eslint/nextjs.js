/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["plugin:@next/next/recommended"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "no-console": ["error", { allow: ["warn", "error"] }],
  },
};

module.exports = config;
