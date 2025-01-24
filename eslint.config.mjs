import { configs } from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...configs.recommended.rules, // Default recommended JS rules
      ...tsPlugin.configs.recommended.rules, // TypeScript rules
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "react/react-in-jsx-scope": "off", // For Next.js users
    },
  },
];