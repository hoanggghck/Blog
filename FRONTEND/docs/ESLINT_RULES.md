# ⚙️ ESLINT RULES - Giải thích ESLint Configuration

## 📌 Table of Contents
- [Overview](#overview)
- [Configuration Structure](#configuration-structure)
- [Global Ignores](#global-ignores)
- [TypeScript Setup](#typescript-setup)
- [Types Layer Rules](#types-layer-rules)
- [Import Path Rules](#import-path-rules)
- [Import Order Rules](#import-order-rules)
- [How to Fix Violations](#how-to-fix-violations)
- [Customization Guide](#customization-guide)

---

## 🎯 Overview

ESLint configuration của dự án được thiết kế để:
- ✅ Enforce architectural rules
- ✅ Maintain code consistency
- ✅ Prevent common mistakes
- ✅ Guide developers to best practices

### Configuration File

```javascript
// eslint.config.js
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default [
  // Global ignores
  { ignores: [...] },
  
  // TypeScript base setup
  { files: [...], languageOptions: {...} },
  
  // Types layer rules
  { files: ['src/types/**/*.ts'], rules: {...} },
  
  // Import path convention
  { files: [...], rules: {...} },
  
  // Import order
  { files: [...], rules: {...} },
]
```

---

## 🚫 Global Ignores

### Configuration

```javascript
{
  ignores: [
    'node_modules/**',
    '.next/**',
    'dist/**',
    'build/**',
  ],
}
```

### Why?

**node_modules/**
- Third-party code không cần lint
- Giảm thời gian lint

**.next/**
- Next.js build output
- Auto-generated code

**dist/** & **build/**
- Production build output
- Không cần lint compiled code

### Adding More Ignores

```javascript
{
  ignores: [
    'node_modules/**',
    '.next/**',
    'dist/**',
    'build/**',
    'public/**',        // ← Add static files
    '**/*.config.js',   // ← Add config files
  ],
}
```

---

## 🔷 TypeScript Setup

### Configuration

```javascript
{
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      sourceType: 'module',
    },
  },
}
```

### Why?

**Files:** `src/**/*.{ts,tsx}`
- Apply to all TypeScript files
- Both `.ts` (logic) and `.tsx` (components)

**Parser:** `tseslint.parser`
- Parse TypeScript syntax
- Understand type annotations

**Source Type:** `module`
- Use ES6 modules (import/export)
- Not CommonJS (require/module.exports)

---

## 🔒 Types Layer Rules

### Configuration

```javascript
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
      // ❌ function
      {
        selector: 'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression',
        message: '❌ function is NOT allowed in /types.',
      },
      // ❌ variables
      {
        selector: 'VariableDeclaration',
        message: '❌ variables are NOT allowed in /types.',
      },
      // ❌ export value
      {
        selector: 'ExportNamedDeclaration > :not(TSTypeAliasDeclaration):not(TSInterfaceDeclaration)',
        message: '❌ Only export type or interface is allowed in /types.',
      },
    ],
  },
}
```

### Rule Breakdown

#### 1. No Enum

**Selector:** `TSEnumDeclaration`

**What it catches:**
```typescript
// ❌ FORBIDDEN
export enum UserRole {
  Admin = 'admin',
  User = 'user',
}
```

**Why?**
- `enum` generates runtime JavaScript code
- Increases bundle size unnecessarily
- Defeats "compile-time only" purpose

**Fix:**
```typescript
// ✅ CORRECT - Move to /const
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
```

---

#### 2. No Class

**Selector:** `ClassDeclaration`

**What it catches:**
```typescript
// ❌ FORBIDDEN
export class User {
  constructor(public name: string) {}
}
```

**Why?**
- Classes generate runtime code
- Not type definitions

**Fix:**
```typescript
// ✅ types/user.type.ts
export interface User {
  name: string
}

// ✅ utils/user.ts
export function createUser(name: string): User {
  return { name }
}
```

---

#### 3. No Functions

**Selector:** `FunctionDeclaration, FunctionExpression, ArrowFunctionExpression`

**What it catches:**
```typescript
// ❌ FORBIDDEN - All function types
export function validateUser(user: User) { }
export const validate = function(user: User) { }
export const validate = (user: User) => { }
```

**Why?**
- Functions are runtime code
- Belong in `/utils` or `/lib`

**Fix:**
```typescript
// ✅ types/user.type.ts
export interface User {
  name: string
  email: string
}

// ✅ utils/validation.ts
import type { User } from '@/types'

export function validateUser(user: User): boolean {
  return !!user.name && !!user.email
}
```

---

#### 4. No Variables

**Selector:** `VariableDeclaration`

**What it catches:**
```typescript
// ❌ FORBIDDEN
export const DEFAULT_USER = { name: 'Guest' }
export const MAX_AGE = 100
```

**Why?**
- Variables are runtime values
- Belong in `/const`

**Fix:**
```typescript
// ✅ const/defaults.ts
import type { User } from '@/types'

export const DEFAULT_USER: User = {
  name: 'Guest',
  email: 'guest@example.com',
}
```

---

#### 5. Export Only Types

**Selector:** `ExportNamedDeclaration > :not(TSTypeAliasDeclaration):not(TSInterfaceDeclaration)`

**What it catches:**
```typescript
// ❌ FORBIDDEN - Export anything other than type/interface
export { User } from './user'        // Re-exporting value
export const helper = () => {}       // Function export
export default class User {}         // Default export
```

**Why?**
- Only allow pure type exports
- Prevent accidental runtime code

**Fix:**
```typescript
// ✅ CORRECT
export type { User } from './user.type'
export interface Admin extends User { }
export type UserRole = 'admin' | 'user'
```

---

### Violation Examples

#### Example 1: Enum in Types

**Code:**
```typescript
// src/types/user.type.ts
export enum UserRole {
  Admin = 'admin',
  User = 'user',
}
```

**Error:**
```
❌ enum is NOT allowed in /types. Use type or interface only.
```

**Fix:**
```typescript
// src/types/user.type.ts
export type UserRole = 'admin' | 'user'

// src/const/roles.ts
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const
```

---

#### Example 2: Function in Types

**Code:**
```typescript
// src/types/user.type.ts
export function isAdmin(user: User): boolean {
  return user.role === 'admin'
}
```

**Error:**
```
❌ function is NOT allowed in /types.
```

**Fix:**
```typescript
// src/types/user.type.ts
export interface User {
  role: string
}

// src/utils/user.ts
import type { User } from '@/types'

export function isAdmin(user: User): boolean {
  return user.role === 'admin'
}
```

---

## 🛣️ Import Path Rules

### Configuration

```javascript
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
}
```

### Rule Breakdown

**Pattern:** `../*`

**What it catches:**
```typescript
// ❌ FORBIDDEN - Relative imports going up
import { Button } from '../../components/ui/button'
import { useAuth } from '../../../hooks/use-auth'
import { User } from '../../types/user.type'
```

**Why?**
- Hard to refactor (paths break when moving files)
- Hard to read (count ../../../)
- Inconsistent across codebase

**Fix:**
```typescript
// ✅ CORRECT - Absolute imports with @/
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/types'

// ✅ CORRECT - Local imports (same folder)
import { helper } from './helper'
import { BlogCard } from './blog-card'
```

---

### Allowed Patterns

| Pattern | Example | Status |
|---------|---------|--------|
| `./file` | `import { x } from './helper'` | ✅ Allowed |
| `@/path` | `import { x } from '@/components/button'` | ✅ Allowed |
| `../file` | `import { x } from '../utils'` | ❌ Forbidden |
| `../../file` | `import { x } from '../../types'` | ❌ Forbidden |

---

### Violation Examples

**Code:**
```typescript
// src/features/blog/blog-list-feature.tsx
import { Button } from '../../components/ui/button'
import { useBlog } from '../../hooks/use-blog'
```

**Error:**
```
❌ Không dùng relative import vượt folder. Chỉ dùng "./" hoặc "@/".
```

**Fix:**
```typescript
// src/features/blog/blog-list-feature.tsx
import { Button } from '@/components/ui/button'
import { useBlog } from '@/hooks/use-blog'
```

---

## 📦 Import Order Rules

### Configuration

```javascript
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
          ['builtin', 'external'],  // react, next, axios
          ['type'],                  // import type { ... }
          ['internal'],              // @/ imports
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'ignore',
        },
      },
    ],
  },
}
```

### Rule Breakdown

**Groups:**
1. `builtin` & `external` - Node.js built-ins + npm packages
2. `type` - Type imports
3. `internal` - Project imports (with @/ alias)

**Newlines Between:** `always`
- Blank line between each group
- Improves readability

**Alphabetize:** `ignore`
- Don't sort alphabetically within groups
- Allow manual ordering for readability

---

### Correct Import Order

```typescript
// ✅ CORRECT ORDER

// 1. External imports (react, next, third-party)
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// 2. Type imports
import type { Blog, User } from '@/types'

// 3. Internal imports (components, hooks, utils)
import { useBlog } from '@/hooks/use-blog'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/blog/blog-card'
import { formatDate } from '@/utils/date'
```

---

### Violation Example

**Code:**
```typescript
// ❌ BAD ORDER
import { BlogCard } from '@/components/blog/blog-card'
import { useState } from 'react'
import type { Blog } from '@/types'
import { useRouter } from 'next/navigation'
import { useBlog } from '@/hooks/use-blog'
```

**Error:**
```
⚠️ Warning: Import order incorrect
```

**Fix - Auto:**
```bash
npm run lint:fix
```

**Fix - Manual:**
```typescript
// ✅ CORRECT
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Blog } from '@/types'

import { useBlog } from '@/hooks/use-blog'
import { BlogCard } from '@/components/blog/blog-card'
```

---

## 🔧 How to Fix Violations

### Check for Violations

```bash
npm run lint
```

**Output:**
```
src/types/user.type.ts
  5:1  error  enum is NOT allowed in /types  no-restricted-syntax

src/features/blog.tsx
  2:1  error  Không dùng relative import vượt folder  no-restricted-imports
  
src/components/button.tsx
  1:1  warning  Import order incorrect  import/order
```

---

### Auto-Fix (Import Order)

```bash
npm run lint:fix
```

**Note:** Chỉ fix được `import/order`, không fix được các rules khác.

---

### Manual Fix

#### Types Layer Violations

**Violation:** Enum in types
```bash
# Move enum to const folder
mv src/types/roles.ts src/const/roles.ts

# Update type definition
# In src/types/user.type.ts
export type UserRole = 'admin' | 'user'

# Update imports
# Replace: import { UserRole } from '@/types'
# With: import { USER_ROLES, type UserRole } from '@/const/roles'
```

---

#### Import Path Violations

**Violation:** Using `../`

**Quick fix with IDE:**
1. Select import line
2. Delete it
3. Type import name
4. Let IDE auto-import with correct path

**Manual fix:**
```typescript
// Before
import { Button } from '../../components/ui/button'

// After
import { Button } from '@/components/ui/button'
```

---

### Setup TypeScript Path Alias

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Verify:**
```typescript
// Should work without errors
import { User } from '@/types'
```

---

## ⚙️ Customization Guide

### Add New Ignored Files

```javascript
{
  ignores: [
    'node_modules/**',
    '.next/**',
    'dist/**',
    'build/**',
    // ↓ Add new ignores
    'coverage/**',
    '**/*.test.ts',
    '__tests__/**',
  ],
}
```

---

### Add Custom Rules

```javascript
export default [
  // ... existing rules
  
  // New custom rule
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Warn on console.log
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      
      // Disallow var
      'no-var': 'error',
      
      // Prefer const
      'prefer-const': 'error',
    },
  },
]
```

---

### Disable Rule for Specific Files

```javascript
{
  files: ['src/scripts/**/*.ts'],
  rules: {
    // Allow console in scripts
    'no-console': 'off',
  },
}
```

---

### Disable Rule Inline

```typescript
// Disable for next line
// eslint-disable-next-line no-console
console.log('Debug info')

// Disable for file
/* eslint-disable no-console */
console.log('File-level disable')

// Disable specific rule for block
/* eslint-disable no-restricted-syntax */
export enum Status {
  Active = 'active',
}
/* eslint-enable no-restricted-syntax */
```

**⚠️ Warning:** Avoid inline disables. Fix the issue instead.

---

## 📊 Rule Severity Levels

| Level | Symbol | Description |
|-------|--------|-------------|
| `off` or `0` | - | Rule disabled |
| `warn` or `1` | ⚠️ | Warning (doesn't fail build) |
| `error` or `2` | ❌ | Error (fails build) |

**Current Configuration:**
- Types layer rules: `error` (strict enforcement)
- Import path rules: `error` (must fix)
- Import order rules: `warn` (can ignore, but shouldn't)

---

## 🎯 Best Practices

### 1. Run Lint Frequently

```bash
# Before commit
npm run lint

# Watch mode (auto-fix on save)
npm run lint -- --fix --watch
```

---

### 2. Setup IDE Integration

**VS Code:**

Install extension: `ESLint`

**.vscode/settings.json:**
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact"
  ]
}
```

---

### 3. Pre-commit Hook

**Install Husky:**
```bash
npm install --save-dev husky lint-staged
npx husky install
```

**Add hook:**
```bash
npx husky add .husky/pre-commit "npm run lint-staged"
```

**package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "git add"
    ]
  }
}
```

---

## 🐛 Common Issues

### Issue 1: Cannot Find Module '@/...'

**Error:**
```
Unable to resolve path to module '@/components/button'
```

**Fix:**
Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Issue 2: ESLint Not Working in IDE

**Fix:**
1. Reload VS Code window
2. Check ESLint extension is enabled
3. Check `eslint.config.js` has no syntax errors
4. Restart ESLint server: `Ctrl+Shift+P` → "ESLint: Restart ESLint Server"

---

### Issue 3: Too Many Errors

**Gradual Fix:**
```javascript
// Temporarily change to warn
{
  rules: {
    'no-restricted-syntax': 'warn',  // Change to 'warn'
    'no-restricted-imports': 'warn', // Change to 'warn'
  },
}

// Fix violations gradually
// Then change back to 'error'
```

---

## 📝 Summary

| Rule | Purpose | Severity |
|------|---------|----------|
| Types layer | Keep /types compile-time only | Error ❌ |
| Import path | Use @/ instead of ../ | Error ❌ |
| Import order | Consistent import grouping | Warn ⚠️ |

**Philosophy:**
```
Linting is not about being strict.
It's about being consistent and preventing mistakes.
```

---

## 🔗 Related Documents

- [TYPES_LAYER.md](./TYPES_LAYER.md) - Detailed types layer rules
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Overall coding standards
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Where to put files

---

**"ESLint is your friend, not your enemy."**
