import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig(
  [
    {
      ignores: ["*.mjs", ".config/", "dist/", "tsconfig.json", ".angular/","**/*.yml"] // acts as global ignores, due to the absence of other properties
    },
    { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
    { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
    {
      plugins: {
        '@stylistic': stylistic
      },
      rules: {
        
        "@typescript-eslint/member-ordering": "error",
        "@stylistic/space-before-blocks": "error",
        "@stylistic/quotes": ["error", "single"],
        "@stylistic/key-spacing": "error",
        "@stylistic/semi-spacing": "error",
        "@typescript-eslint/naming-convention":
          [
            "warn",
            {
              "selector": "class",
              "format": ["PascalCase"]
            },
            {
              "selector": "classMethod",
              "format": ["camelCase"]
            },
            {
              "selector": "classProperty",
              "modifiers": ["private"],
              "format": ["camelCase"],
              "leadingUnderscore": "allow"
            },
            {
              "selector": "classProperty",
              "modifiers": ["public"],
              "format": ["camelCase"]
            },
            {
              "selector": "interface",
              "format": ["PascalCase"]
            },
            {
              "selector": "typeProperty",
              "format": ["camelCase"]
            },
            {
              "selector": "variable",
              "format": ["camelCase"]
            }
          ]
      }
    },
    tseslint.configs.recommended,
    {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  ]);