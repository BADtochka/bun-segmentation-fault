import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "*.d.ts"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },

  {
    files: [
      "**/*.module.ts",
      "**/*.service.ts",
      "**/*.controller.ts",
      "**/*.guard.ts",
      "**/*.strategy.ts",
      "**/*.filter.ts",
      "**/*.interceptor.ts",
      "**/*.pipe.ts",
      "**/*.resolver.ts",
      "**/*.gateway.ts",
    ],
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportDeclaration[importKind='type']",
          message:
            "Do not use `import type` in NestJS layers (module/service/controller/guard/strategy, etc). Dependency injection and decorators require runtime imports.",
        },
      ],
    },
  },

  {
    files: ["**/types/**/*.ts", "**/dto/**/*.ts", "**/interfaces/**/*.ts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },
];
