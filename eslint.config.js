import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/", "assets/js/bootstrap.min.js"],
  },
  {
    files: ["assets/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        confirm: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    files: ["server.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
  },
  {
    files: ["tests/**/*.test.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        process: "readonly",
        console: "readonly",
        confirm: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    files: ["eslint.config.js", "vitest.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
];
