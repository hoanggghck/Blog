import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
    ],
  },
  // ✅ APPLY TYPESCRIPT PARSER TO ALL TS FILES
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
  /*
  ### Types Folder Rules
  The `/types` directory is reserved strictly for TypeScript type definitions.
  Only the following constructs are allowed in this folder:
  - `type`
  - `interface`
  - `enum`
  Runtime constructs such as functions, classes, variables, or executable logic are strictly forbidden.
  This rule ensures that `/types` remains a pure, side-effect-free layer,
  used only for compile-time type safety and shared contracts across the application.
  */
  {
    files: ['src/types/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Program:has(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression)",
          message:
            'Functions are not allowed in /types. Only type, interface, and enum are permitted.',
        },
        {
          selector: 'ClassDeclaration',
          message:
            'Classes are not allowed in /types. Only type, interface, and enum are permitted.',
        },
        {
          selector: 'VariableDeclaration',
          message:
            'Variables are not allowed in /types. Only type, interface, and enum are permitted.',
        },
      ],
    },
  },
  /*
  ### Import Path Convention
  Relative imports that traverse outside the current directory (e.g. `../` or `../../`) are not allowed.
  Only the following import styles are permitted:
  - Local imports within the same directory using `./`
  - Absolute imports using the project alias `@/`
  This rule prevents accidental cross-layer coupling,
  keeps the architecture boundaries explicit,
  and makes refactoring safer and more predictable as the codebase grows.
  */
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: '❌ Không dùng relative import vượt folder. Chỉ dùng "./" hoặc "@/".',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],          // block 1: third-party
            ['type'],                     // block 2: Type
            ['internal'],                     // block 3: code mình viết (@/)
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'ignore',
          },
        },
      ],
    },
  },
]
