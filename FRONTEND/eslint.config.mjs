import tseslint from 'typescript-eslint'

export default [
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
]
