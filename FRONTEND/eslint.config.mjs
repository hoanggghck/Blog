import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default [
  /* ============================================================
   *  Global ignores
   * ============================================================ */
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
    ],
  },
  /* ============================================================
   *  Base TypeScript setup
   * ============================================================ */
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
  /* ============================================================
   *  TYPES LAYER – Strict compile-time only
   * ============================================================ */
  /*
    Folder: src/types

    Allowed:
    - type
    - interface
    - export type / export interface

    Forbidden:
    - function
    - class
    - enum
    - variable
    - executable logic
  */
  {
    files: ['src/types/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        // ❌ enum
        {
          selector: 'TSEnumDeclaration',
          message: '❌ enum is NOT allowed in /types. Use type or interface only.',
        },
        // ❌ class
        {
          selector: 'ClassDeclaration',
          message: '❌ class is NOT allowed in /types. Use type or interface only.',
        },
        // ❌ function (mọi loại)
        {
          selector:
            'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression',
          message: '❌ function is NOT allowed in /types.',
        },
        // ❌ biến
        {
          selector: 'VariableDeclaration',
          message: '❌ variables are NOT allowed in /types.',
        },
        // ❌ export value
        {
          selector:
            'ExportNamedDeclaration > :not(TSTypeAliasDeclaration):not(TSInterfaceDeclaration)',
          message:
            '❌ Only export type or interface is allowed in /types.',
        },
      ],
    },
  },
  /* ============================================================
   *  IMPORT PATH CONVENTION
   * ============================================================ */
  /*
    ❌ Forbidden:
      ../something
      ../../something

    ✅ Allowed:
      ./local-file
      @/absolute/path
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
  /* ============================================================
   *  IMPORT ORDER – Readable & predictable
   * ============================================================ */
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
            ['builtin', 'external'],// react, vue, next, axios...
            ['type'],// import type { ... }
            ['internal']// ./local
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
