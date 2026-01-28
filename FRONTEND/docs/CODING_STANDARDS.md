# 📐 CODING STANDARDS - Quy tắc code & Best practices

## 📌 Table of Contents
- [Import Rules](#import-rules)
- [TypeScript Guidelines](#typescript-guidelines)
- [Component Guidelines](#component-guidelines)
- [Function Guidelines](#function-guidelines)
- [Naming Conventions](#naming-conventions)
- [Code Organization](#code-organization)
- [Comments & Documentation](#comments--documentation)
- [Performance Best Practices](#performance-best-practices)

---

## 📦 Import Rules

### 1. Import Path Convention

**❌ FORBIDDEN - Relative imports vượt folder:**
```typescript
import { Button } from '../../components/ui/button'
import { useAuth } from '../../../hooks/use-auth'
```

**✅ ALLOWED - Local imports hoặc absolute imports:**
```typescript
// ✅ Local import (cùng folder)
import { helper } from './helper'
import { BlogCard } from './blog-card'

// ✅ Absolute import với alias @/
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Blog } from '@/types'
```

**Why?**
- Dễ refactor (move files)
- Dễ đọc (không phải đếm ../../../)
- Consistent across codebase

---

### 2. Import Order

Imports phải được sắp xếp theo thứ tự:

```typescript
// 1. External libraries (React, Next.js, third-party)
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// 2. Type imports
import type { Blog, User } from '@/types'

// 3. Internal imports (absolute @/ imports)
import { useAuth } from '@/hooks/use-auth'
import { BlogCard } from '@/components/blog/blog-card'
import { Button } from '@/components/ui/button'
```

**ESLint auto-fix:**
```bash
npm run lint:fix
```

---

### 3. Named vs Default Export

**✅ PREFER Named Export:**
```typescript
// ✅ components/blog-card.tsx
export function BlogCard() { }

// ✅ hooks/use-blog.ts
export function useBlog() { }

// ✅ apis/blog.api.ts
export const blogApi = { }
```

**❌ AVOID Default Export (except Next.js pages):**
```typescript
// ❌ components/blog-card.tsx
export default function BlogCard() { }

// ✅ EXCEPTION - app/blog/page.tsx (Next.js requirement)
export default function BlogPage() { }
```

**Why prefer named exports?**
- Better IDE support (auto-import đúng tên)
- Easier to search
- No naming confusion

---

## 🔷 TypeScript Guidelines

### 1. Always Type Everything

**❌ BAD:**
```typescript
const user = { name: 'John', age: 30 }
function getUser() { return user }
```

**✅ GOOD:**
```typescript
interface User {
  name: string
  age: number
}

const user: User = { name: 'John', age: 30 }
function getUser(): User { return user }
```

---

### 2. Type vs Interface

**Use `type` for:**
- Union types
- Primitive types
- Utility types

```typescript
type Status = 'active' | 'inactive'
type ID = string | number
type PartialUser = Partial<User>
```

**Use `interface` for:**
- Object shapes
- Extendable types

```typescript
interface User {
  id: string
  name: string
}

interface Admin extends User {
  role: 'admin'
}
```

---

### 3. Avoid `any`, Use `unknown`

**❌ BAD:**
```typescript
function process(data: any) {
  return data.name // No type check
}
```

**✅ GOOD:**
```typescript
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name
  }
  throw new Error('Invalid data')
}
```

---

### 4. Generic Naming

**✅ GOOD:**
```typescript
// Single generic
function identity<T>(value: T): T {
  return value
}

// Multiple generics
function map<TInput, TOutput>(
  items: TInput[],
  mapper: (item: TInput) => TOutput
): TOutput[] {
  return items.map(mapper)
}
```

**Conventions:**
- Single generic: `T`
- Multiple: `T`, `U`, `V`
- Descriptive: `TInput`, `TOutput`, `TData`, `TError`

---

### 5. Utility Types

```typescript
// Partial - Make all properties optional
type PartialUser = Partial<User>

// Required - Make all properties required
type RequiredUser = Required<User>

// Pick - Select specific properties
type UserNameEmail = Pick<User, 'name' | 'email'>

// Omit - Exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>

// Record - Create object type with specific keys
type UserRoles = Record<string, 'admin' | 'user'>
```

---

## 🧩 Component Guidelines

### 1. Component Structure Template

```typescript
// 1. Imports
import { useState } from 'react'

import type { Blog } from '@/types'

import { Button } from '@/components/ui/button'

// 2. Types/Interfaces
interface BlogCardProps {
  blog: Blog
  onLike?: () => void
  onDelete?: () => void
}

// 3. Component
export function BlogCard({ blog, onLike, onDelete }: BlogCardProps) {
  // 3a. Hooks
  const [isHovered, setIsHovered] = useState(false)
  
  // 3b. Handlers
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  
  // 3c. Computed values
  const cardClassName = isHovered ? 'card card-hover' : 'card'
  
  // 3d. Early returns
  if (!blog) return null
  
  // 3e. Main render
  return (
    <div 
      className={cardClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2>{blog.title}</h2>
      <Button onClick={onLike}>Like</Button>
      {onDelete && <Button onClick={onDelete}>Delete</Button>}
    </div>
  )
}
```

---

### 2. Props Naming

**✅ GOOD:**
```typescript
interface CardProps {
  title: string
  isActive: boolean
  onCardClick: () => void
  onActionClick: () => void
}
```

**Conventions:**
- Boolean props: `is`, `has`, `should`, `can`
- Event handlers: `on{Event}`, `handle{Event}`
- Data props: noun (title, user, blog)

---

### 3. Event Handler Naming

**✅ GOOD:**
```typescript
// Component emits events với "on"
interface BlogCardProps {
  onLike: () => void
  onShare: () => void
  onDelete: () => void
}

// Component internal handlers với "handle"
export function BlogCard({ onLike, onShare }: BlogCardProps) {
  const handleLikeClick = () => {
    // Some logic
    onLike()
  }
  
  const handleShareClick = () => {
    // Some logic
    onShare()
  }
  
  return (
    <div>
      <button onClick={handleLikeClick}>Like</button>
      <button onClick={handleShareClick}>Share</button>
    </div>
  )
}
```

**Pattern:**
- Props callback: `onXxx`
- Internal handler: `handleXxx`

---

### 4. Conditional Rendering

**✅ GOOD:**
```typescript
// Early return for loading/error
if (isLoading) return <Spinner />
if (error) return <Error message={error.message} />
if (!data) return null

// Short-circuit for optional rendering
{user && <UserProfile user={user} />}
{count > 0 && <Badge count={count} />}

// Ternary for simple conditions
<div className={isActive ? 'active' : 'inactive'}>

// Extracted to variables for complex conditions
const showActions = isOwner && !isDeleted
return (
  <div>
    {showActions && <ActionButtons />}
  </div>
)
```

**❌ BAD:**
```typescript
// Nested ternary (hard to read)
{user ? user.isAdmin ? <AdminPanel /> : <UserPanel /> : <Login />}

// Complex inline condition
{user && user.role === 'admin' && user.isActive && !user.isBanned && <AdminPanel />}
```

---

### 5. Component Composition

**✅ GOOD - Composition:**
```typescript
export function BlogCard({ blog }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BlogContent content={blog.content} />
      </CardContent>
      <CardFooter>
        <BlogActions blog={blog} />
      </CardFooter>
    </Card>
  )
}
```

**❌ BAD - Monolithic:**
```typescript
export function BlogCard({ blog }: Props) {
  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        <p>{blog.author}</p>
      </div>
      <div>
        {blog.content}
      </div>
      <div>
        <button onClick={handleLike}>Like</button>
        <button onClick={handleShare}>Share</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}
```

---

## 🔧 Function Guidelines

### 1. Function Naming

```typescript
// ✅ Verb + Noun
function getUserById(id: string) { }
function calculateTotal(items: Item[]) { }
function validateEmail(email: string) { }

// ✅ Boolean functions: is, has, should, can
function isValidEmail(email: string): boolean { }
function hasPermission(user: User, resource: string): boolean { }
function shouldShowNotification(): boolean { }

// ✅ Event handlers: handle + Event
function handleClick() { }
function handleSubmit(data: FormData) { }
function handleInputChange(value: string) { }
```

---

### 2. Function Parameters

**Max 3 parameters, otherwise use object:**

**❌ BAD:**
```typescript
function createUser(
  name: string,
  email: string,
  password: string,
  role: string,
  isActive: boolean
) { }
```

**✅ GOOD:**
```typescript
interface CreateUserParams {
  name: string
  email: string
  password: string
  role: string
  isActive: boolean
}

function createUser(params: CreateUserParams) { }
```

---

### 3. Pure Functions

**✅ GOOD - Pure:**
```typescript
// Same input → Same output
function add(a: number, b: number): number {
  return a + b
}

// No side effects
function formatDate(date: Date): string {
  return date.toISOString()
}
```

**❌ BAD - Impure:**
```typescript
let total = 0

// Mutates external state
function add(value: number) {
  total += value
  return total
}
```

---

### 4. Function Length

**Keep functions short (< 20 lines):**

**❌ BAD:**
```typescript
function processData(data: Data) {
  // 50 lines of code
  // Hard to understand
  // Hard to test
}
```

**✅ GOOD:**
```typescript
function processData(data: Data) {
  const validated = validateData(data)
  const transformed = transformData(validated)
  const saved = saveData(transformed)
  return saved
}

function validateData(data: Data) { /* ... */ }
function transformData(data: Data) { /* ... */ }
function saveData(data: Data) { /* ... */ }
```

---

## 🏷️ Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Components | `PascalCase.tsx` | `BlogCard.tsx` |
| Features | `PascalCaseFeature.tsx` | `BlogListFeature.tsx` |
| Hooks | `use-{name}.ts` | `use-blog.ts` |
| API modules | `{domain}.api.ts` | `blog.api.ts` |
| Types | `{domain}.type.ts` | `blog.type.ts` |
| Utils | `kebab-case.ts` | `date-utils.ts` |
| Stores | `camelCase.ts` | `authStore.ts` |

---

### Variables

```typescript
// ✅ camelCase for variables
const userName = 'John'
const isActive = true
const blogList = []

// ✅ UPPER_SNAKE_CASE for constants
const API_URL = 'https://api.example.com'
const MAX_RETRIES = 3
const DEFAULT_PAGE_SIZE = 10

// ✅ PascalCase for types/interfaces/components
type User = { }
interface BlogPost { }
function BlogCard() { }
```

---

### Booleans

```typescript
// ✅ GOOD - Use prefixes
const isLoading = true
const hasPermission = false
const shouldRender = true
const canEdit = false

// ❌ BAD - No prefix
const loading = true
const permission = false
const render = true
const edit = false
```

---

### Arrays

```typescript
// ✅ GOOD - Plural
const users = []
const blogs = []
const comments = []

// ❌ BAD - Singular
const user = []
const blog = []
```

---

## 📂 Code Organization

### 1. File Structure Order

```typescript
// 1. External imports
import { useState } from 'react'

// 2. Type imports
import type { User } from '@/types'

// 3. Internal imports
import { Button } from '@/components/ui/button'

// 4. Types/Interfaces (specific to this file)
interface Props { }

// 5. Constants (specific to this file)
const MAX_ITEMS = 10

// 6. Main export
export function Component() { }

// 7. Helper functions (if needed)
function helper() { }
```

---

### 2. Group Related Code

**✅ GOOD:**
```typescript
// hooks/use-blog.ts
export function useBlog(id: string) { }
export function useBlogs(params: BlogQuery) { }
export function useCreateBlog() { }
export function useUpdateBlog() { }
export function useDeleteBlog() { }
```

**❌ BAD:**
```typescript
// Scattered across multiple files
// hooks/use-get-blog.ts
// hooks/use-get-blogs.ts
// hooks/use-create-blog.ts
```

---

## 💬 Comments & Documentation

### 1. When to Comment

**✅ Comment WHY, not WHAT:**
```typescript
// ✅ GOOD - Explain why
// Debounce search to avoid excessive API calls
const debouncedSearch = useDebounce(searchTerm, 500)

// Retry 3 times because API is unstable during peak hours
const { data } = useQuery({ retry: 3 })
```

**❌ BAD - State the obvious:**
```typescript
// Set loading to true
setLoading(true)

// Call API
await api.get('/users')
```

---

### 2. JSDoc for Public APIs

```typescript
/**
 * Fetch blog by ID
 * @param id - Blog ID
 * @returns Blog object or null if not found
 * @throws {Error} When network fails
 */
export async function getBlogById(id: string): Promise<Blog | null> {
  const response = await api.get(`/blogs/${id}`)
  return response.data
}
```

---

### 3. TODO Comments

```typescript
// TODO: Implement pagination
// TODO: Add error handling
// FIXME: Memory leak when component unmounts
// HACK: Temporary workaround for API bug
```

---

## ⚡ Performance Best Practices

### 1. Memoization

```typescript
// ✅ useMemo for expensive calculations
const sortedBlogs = useMemo(() => {
  return blogs.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}, [blogs])

// ✅ useCallback for callbacks passed to children
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])

// ✅ React.memo for expensive renders
export const ExpensiveComponent = React.memo(function ExpensiveComponent(props: Props) {
  // Heavy rendering logic
})
```

**When NOT to use:**
```typescript
// ❌ Premature optimization
const name = useMemo(() => user.name, [user]) // Overkill
```

---

### 2. Code Splitting

```typescript
// ✅ Lazy load heavy components
const AdminPanel = lazy(() => import('@/features/admin/admin-panel'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminPanel />
    </Suspense>
  )
}
```

---

### 3. Avoid Inline Objects/Functions

**❌ BAD:**
```typescript
// Creates new object every render
<BlogCard style={{ margin: 10 }} />

// Creates new function every render
<Button onClick={() => handleClick(id)} />
```

**✅ GOOD:**
```typescript
const cardStyle = { margin: 10 }
<BlogCard style={cardStyle} />

const handleButtonClick = useCallback(() => handleClick(id), [id])
<Button onClick={handleButtonClick} />
```

---

## 🎨 CSS & Styling

### 1. Tailwind Conventions

```typescript
// ✅ GOOD - Logical grouping
<div className="
  flex items-center justify-between
  px-4 py-2
  bg-white border border-gray-200 rounded-lg
  hover:shadow-md transition
">
```

**Order:**
1. Layout (flex, grid, position)
2. Spacing (p, m)
3. Sizing (w, h)
4. Typography (text, font)
5. Colors (bg, text, border)
6. Effects (shadow, opacity)
7. Interactions (hover, focus, transition)

---

### 2. Conditional Classes

```typescript
import { cn } from '@/lib/utils'

// ✅ GOOD - Use cn() helper
<div className={cn(
  'base-styles',
  isActive && 'active-styles',
  isDisabled && 'disabled-styles'
)} />
```

---

## 🔒 Security Best Practices

### 1. Sanitize User Input

```typescript
// ✅ GOOD
import DOMPurify from 'dompurify'

function BlogContent({ html }: Props) {
  const clean = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

---

### 2. Environment Variables

```typescript
// ✅ GOOD - Use NEXT_PUBLIC_ prefix for client-side
const API_URL = process.env.NEXT_PUBLIC_API_URL

// ✅ Server-side only (no prefix)
const SECRET_KEY = process.env.SECRET_KEY
```

---

## ✅ Checklist Before Commit

- [ ] ESLint passes: `npm run lint`
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Code formatted: `npm run format`
- [ ] All imports use `@/` or `./`
- [ ] No `any` types (use `unknown`)
- [ ] No `console.log` (use proper logging)
- [ ] Components are pure (no business logic)
- [ ] Functions are small (< 20 lines)
- [ ] Meaningful variable names
- [ ] Comments explain WHY, not WHAT

---

## 🔗 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc tổng quan
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Cấu trúc thư mục
- [TYPES_LAYER.md](./TYPES_LAYER.md) - TypeScript types rules
- [ESLINT_RULES.md](./ESLINT_RULES.md) - ESLint configuration

---

**"Code is read more often than it is written."**
— Guido van Rossum
