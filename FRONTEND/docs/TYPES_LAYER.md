# 🔷 TYPES LAYER - Quy tắc Types layer

## 📌 Table of Contents
- [Philosophy](#philosophy)
- [Allowed in /types](#allowed-in-types)
- [Forbidden in /types](#forbidden-in-types)
- [ESLint Rules](#eslint-rules)
- [Why These Rules?](#why-these-rules)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Migration Guide](#migration-guide)

---

## 🎯 Philosophy

```
/types folder is COMPILE-TIME ONLY
→ Zero runtime code
→ Zero JavaScript output
→ Pure TypeScript types and interfaces
```

### Core Principle

**Types layer should have ZERO impact on bundle size.**

When you build the project:
```bash
npm run build
```

Files in `/types` should generate **ZERO JavaScript code**.

---

## ✅ Allowed in /types

### 1. Type Alias

```typescript
// ✅ ALLOWED
export type UserRole = 'admin' | 'user' | 'guest'
export type ID = string | number
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
```

---

### 2. Interface

```typescript
// ✅ ALLOWED
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface Blog {
  id: string
  title: string
  content: string
  author: User
}
```

---

### 3. Union Types

```typescript
// ✅ ALLOWED
export type Status = 'draft' | 'published' | 'archived'
export type Theme = 'light' | 'dark' | 'auto'
export type SortOrder = 'asc' | 'desc'
```

---

### 4. Intersection Types

```typescript
// ✅ ALLOWED
export type Timestamped = {
  createdAt: string
  updatedAt: string
}

export type BlogPost = Blog & Timestamped
```

---

### 5. Generic Types

```typescript
// ✅ ALLOWED
export type ApiResponse<T> = {
  data: T
  message: string
  status: number
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  limit: number
}
```

---

### 6. Utility Types

```typescript
// ✅ ALLOWED
export type PartialUser = Partial<User>
export type RequiredBlog = Required<Blog>
export type UserWithoutPassword = Omit<User, 'password'>
export type UserNameEmail = Pick<User, 'name' | 'email'>
```

---

### 7. Mapped Types

```typescript
// ✅ ALLOWED
export type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

export type Optional<T> = {
  [P in keyof T]?: T[P]
}
```

---

### 8. Conditional Types

```typescript
// ✅ ALLOWED
export type NonNullable<T> = T extends null | undefined ? never : T
export type Awaited<T> = T extends Promise<infer U> ? U : T
```

---

## ❌ Forbidden in /types

### 1. ❌ Enum

**STRICTLY FORBIDDEN:**

```typescript
// ❌ FORBIDDEN - Generates runtime code
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// Generates this JavaScript:
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["User"] = "user";
    UserRole["Guest"] = "guest";
})(UserRole || (UserRole = {}));
```

**✅ Use this instead:**

```typescript
// ✅ CORRECT - Zero runtime code
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
// UserRole = 'admin' | 'user' | 'guest'
```

**Why?**
- `enum` generates JavaScript code → Increases bundle size
- `const` object is compile-time only → Zero bundle impact
- `as const` makes it type-safe

**Where to put enum alternatives?**
```
src/const/roles.ts  ← Put const objects here
```

---

### 2. ❌ Functions

**STRICTLY FORBIDDEN:**

```typescript
// ❌ FORBIDDEN - Generates runtime code
export function mapUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
  }
}
```

**✅ Put functions in `/utils` instead:**

```typescript
// ✅ CORRECT - src/utils/user.ts
import type { User } from '@/types'

export function mapUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
  }
}
```

---

### 3. ❌ Classes

**STRICTLY FORBIDDEN:**

```typescript
// ❌ FORBIDDEN - Generates runtime code
export class UserModel {
  constructor(
    public id: string,
    public name: string
  ) {}
  
  getFullName() {
    return this.name
  }
}
```

**✅ Use interface + factory function instead:**

```typescript
// ✅ src/types/user.type.ts
export interface User {
  id: string
  name: string
}

// ✅ src/utils/user.ts
import type { User } from '@/types'

export function createUser(id: string, name: string): User {
  return { id, name }
}

export function getUserFullName(user: User): string {
  return user.name
}
```

---

### 4. ❌ Variables

**STRICTLY FORBIDDEN:**

```typescript
// ❌ FORBIDDEN - Generates runtime code
export const DEFAULT_USER: User = {
  id: '',
  name: 'Guest',
  email: 'guest@example.com',
}

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
}
```

**✅ Put variables in `/const` instead:**

```typescript
// ✅ src/const/defaults.ts
import type { User } from '@/types'

export const DEFAULT_USER: User = {
  id: '',
  name: 'Guest',
  email: 'guest@example.com',
}

// ✅ src/const/endpoints.ts
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const
```

---

### 5. ❌ Executable Logic

**STRICTLY FORBIDDEN:**

```typescript
// ❌ FORBIDDEN - Any executable code
console.log('Types loaded')

if (process.env.NODE_ENV === 'development') {
  // ...
}

export const users = fetchUsers() // API call

// Side effects
window.addEventListener('load', () => {})
```

---

## 🔒 ESLint Rules

Dự án có ESLint rules tự động kiểm tra và báo lỗi nếu vi phạm:

```javascript
// eslint.config.js
{
  files: ['src/types/**/*.ts'],
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

### Running ESLint

```bash
# Check violations
npm run lint

# Auto-fix (cannot fix /types violations automatically)
npm run lint:fix
```

---

## 🤔 Why These Rules?

### 1. Zero Bundle Size Impact

```typescript
// types/user.type.ts - ZERO bytes in production bundle
export interface User {
  id: string
  name: string
}

// ✅ Build output: 0 KB
```

vs.

```typescript
// types/user.type.ts - Adds to bundle size
export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

// ❌ Build output: ~200 bytes (small, but unnecessary)
```

**In a large project with 100+ enums:**
```
100 enums × 200 bytes = 20 KB wasted
```

---

### 2. Prevent Circular Dependencies

```
types/ → utils/ → types/  ← CIRCULAR!
```

If `/types` can import from other folders, circular dependencies become possible.

**With strict rules:**
```
types/ ← utils/  ✅ One-way dependency
types/ ← apis/   ✅ One-way dependency
types/ ← hooks/  ✅ One-way dependency
```

---

### 3. Compile-Time Safety

```typescript
// ✅ Types are checked at compile time
const user: User = {
  id: '123',
  name: 'John',
  email: 'john@example.com',
}

// TypeScript error if wrong type
const user: User = {
  id: 123, // ❌ Error: Type 'number' is not assignable to type 'string'
}
```

No runtime overhead, but full type safety.

---

### 4. Clear Separation of Concerns

```
types/     → Type definitions only
const/     → Runtime constants
utils/     → Helper functions
```

Clear boundaries make code easier to understand and maintain.

---

## 💡 Best Practices

### 1. Organize by Domain

```
types/
├── index.ts          # Re-export all types
├── user.type.ts      # User-related types
├── blog.type.ts      # Blog-related types
├── comment.type.ts   # Comment-related types
├── api.type.ts       # API response types
└── common.type.ts    # Shared types
```

---

### 2. Re-export from index.ts

```typescript
// types/index.ts
export * from './user.type'
export * from './blog.type'
export * from './comment.type'
export * from './api.type'
export * from './common.type'
```

**Usage:**
```typescript
// ✅ GOOD - Import from index
import type { User, Blog, Comment } from '@/types'

// ❌ BAD - Import from individual files
import type { User } from '@/types/user.type'
import type { Blog } from '@/types/blog.type'
```

---

### 3. Use Descriptive Names

```typescript
// ✅ GOOD
export interface CreateBlogDto {
  title: string
  content: string
}

export interface UpdateBlogDto {
  title?: string
  content?: string
}

export interface BlogListQuery {
  page: number
  limit: number
  search?: string
}
```

**Naming conventions:**
- API request: `{Action}{Resource}Dto`
- API query params: `{Resource}ListQuery` or `{Resource}Query`
- API response: `{Resource}Response`

---

### 4. Document Complex Types

```typescript
/**
 * User authentication status
 * - authenticated: User is logged in
 * - guest: User is not logged in
 * - pending: Authentication in progress
 */
export type AuthStatus = 'authenticated' | 'guest' | 'pending'

/**
 * Paginated API response wrapper
 * @template T - Type of items in the response
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}
```

---

### 5. Use Union Types for String Literals

```typescript
// ✅ GOOD - Type-safe strings
export type SortOrder = 'asc' | 'desc'
export type Theme = 'light' | 'dark' | 'auto'
export type UserRole = 'admin' | 'user' | 'guest'

function sortBy(order: SortOrder) {
  // TypeScript ensures only 'asc' or 'desc'
}

// ❌ BAD - Any string accepted
function sortBy(order: string) {
  // No type safety
}
```

---

## 📝 Examples

### Example 1: User Types

```typescript
// types/user.type.ts

/**
 * User role in the system
 */
export type UserRole = 'admin' | 'user' | 'guest'

/**
 * User status
 */
export type UserStatus = 'active' | 'inactive' | 'banned'

/**
 * Base user interface
 */
export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}

/**
 * User registration DTO
 */
export interface RegisterUserDto {
  name: string
  email: string
  password: string
}

/**
 * User login DTO
 */
export interface LoginUserDto {
  email: string
  password: string
}

/**
 * User update DTO
 */
export interface UpdateUserDto {
  name?: string
  email?: string
  avatar?: string
}

/**
 * User list query parameters
 */
export interface UserListQuery {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  status?: UserStatus
}
```

---

### Example 2: Blog Types

```typescript
// types/blog.type.ts

import type { User } from './user.type'
import type { Category } from './category.type'
import type { Tag } from './tag.type'

/**
 * Blog status
 */
export type BlogStatus = 'draft' | 'published' | 'archived'

/**
 * Blog interface
 */
export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  authorId: string
  author: User
  categoryId: string
  category: Category
  tags: Tag[]
  likesCount: number
  commentsCount: number
  viewsCount: number
  isLiked: boolean
  status: BlogStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Create blog DTO (FormData)
 */
export interface CreateBlogDto {
  title: string
  content: string
  excerpt: string
  image: File
  categoryId: string
  tagIds: string[]
}

/**
 * Update blog DTO
 */
export interface UpdateBlogDto {
  title?: string
  content?: string
  excerpt?: string
  image?: File
  categoryId?: string
  tagIds?: string[]
  status?: BlogStatus
}

/**
 * Blog list query
 */
export interface BlogListQuery {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  tagId?: string
  authorId?: string
  status?: BlogStatus
  sortBy?: 'createdAt' | 'updatedAt' | 'likesCount' | 'viewsCount'
  sortOrder?: 'asc' | 'desc'
}
```

---

### Example 3: API Response Types

```typescript
// types/api.type.ts

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * API error response
 */
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}
```

---

## 🔄 Migration Guide

### Migrating from Enum to Union Type

**Before (with enum):**
```typescript
// ❌ types/user.type.ts
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// Usage
const role: UserRole = UserRole.Admin
```

**After (with const + union type):**

**Step 1: Move to const/**
```typescript
// ✅ const/roles.ts
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
```

**Step 2: Update types/**
```typescript
// ✅ types/user.type.ts
import type { UserRole } from '@/const/roles'

export interface User {
  id: string
  name: string
  role: UserRole
}
```

**Step 3: Update usage:**
```typescript
// ✅ Usage
import { USER_ROLES } from '@/const/roles'
import type { UserRole } from '@/const/roles'

const role: UserRole = USER_ROLES.ADMIN
```

---

### Migrating Functions from Types to Utils

**Before:**
```typescript
// ❌ types/user.type.ts
export interface User {
  id: string
  name: string
}

export function createUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
  }
}
```

**After:**

```typescript
// ✅ types/user.type.ts
export interface User {
  id: string
  name: string
}

// ✅ utils/user.ts
import type { User } from '@/types'

export function createUser(data: any): User {
  return {
    id: data.id,
    name: data.name,
  }
}
```

---

## 🚨 Common Violations

### Violation 1: Enum in Types

```typescript
// ❌ types/blog.type.ts
export enum BlogStatus {
  Draft = 'draft',
  Published = 'published',
}
```

**ESLint Error:**
```
❌ enum is NOT allowed in /types. Use type or interface only.
```

**Fix:**
```typescript
// ✅ types/blog.type.ts
export type BlogStatus = 'draft' | 'published'
```

---

### Violation 2: Function in Types

```typescript
// ❌ types/user.type.ts
export function isAdmin(user: User): boolean {
  return user.role === 'admin'
}
```

**ESLint Error:**
```
❌ function is NOT allowed in /types.
```

**Fix:**
```typescript
// ✅ utils/user.ts
import type { User } from '@/types'

export function isAdmin(user: User): boolean {
  return user.role === 'admin'
}
```

---

### Violation 3: Variable in Types

```typescript
// ❌ types/constants.ts
export const MAX_FILE_SIZE = 5 * 1024 * 1024
```

**ESLint Error:**
```
❌ variables are NOT allowed in /types.
```

**Fix:**
```typescript
// ✅ const/file-upload.ts
export const MAX_FILE_SIZE = 5 * 1024 * 1024
```

---

## ✅ Quick Reference

| Scenario | ❌ Don't | ✅ Do |
|----------|---------|-------|
| String constants | `enum` in `/types` | `const` in `/const` + union type |
| Default values | Variables in `/types` | Variables in `/const` |
| Helper functions | Functions in `/types` | Functions in `/utils` |
| Data models | Classes in `/types` | Interfaces + factory in `/utils` |

---

## 🔗 Related Documents

- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Chi tiết folder structure
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Coding conventions
- [ESLINT_RULES.md](./ESLINT_RULES.md) - ESLint configuration

---

**"Keep /types pure. Keep it compile-time only. Keep it simple."**
