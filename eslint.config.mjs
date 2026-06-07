import next from "eslint-config-next";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  // Project-wide ignores (extend Next's defaults).
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "drizzle/**",
      "data/**",
      "next-env.d.ts",
      "*.config.{js,mjs,cjs}",
    ],
  },

  // Next.js base + TypeScript rules + React + a11y + import resolver settings.
  ...next,

  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      // --- Code quality ---
      "no-nested-ternary": "error",
      complexity: ["warn", 8],
      "max-depth": ["warn", 3],
      "max-lines-per-function": ["warn", { max: 60, skipBlankLines: true, skipComments: true }],
      "no-var": "error",
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: "error",
      curly: "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "no-useless-return": "warn",
      "no-unneeded-ternary": "error",
      "no-else-return": "warn",

      // --- TypeScript ---
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      // The unused-imports plugin owns this so its --fix can drop them.
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // --- React ---
      "react/jsx-no-useless-fragment": "warn",

      // --- Imports ---
      "import/first": "error",
      "import/newline-after-import": "error",
      // Smarter than `no-duplicate-imports`: understands `import type`.
      "import/no-duplicates": "error",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. Side-effect imports (e.g. `import "server-only"`).
            ["^\\u0000"],
            // 2. React.
            ["^react$", "^react/.*"],
            // 3. Next.js.
            ["^next($|/)"],
            // 4. Other external libraries.
            ["^@?\\w"],
            // 5. Internal lib / utils / services / hooks / configs / constants / types.
            ["^@/(lib|utils|services|hooks|configs?|constants|types)(/.*|$)"],
            // 6. Feature/domain imports.
            ["^@/features(/.*|$)"],
            // 7. UI components.
            ["^@/components(/.*|$)"],
            // 8. Other internal `@/` imports.
            ["^@/"],
            // 9. Parent imports.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // 10. Sibling/index imports.
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // 11. Style imports.
            ["^.+\\.s?css$"],
          ],
        },
      ],
    },
  },

  // Test files: relax line-length / complexity caps.
  {
    files: ["**/*.{test,spec}.{ts,tsx}", "**/__tests__/**/*"],
    rules: {
      "max-lines-per-function": "off",
      complexity: "off",
    },
  },

  // Must come last: turn off any rule that conflicts with Prettier's formatting.
  prettier,
];
