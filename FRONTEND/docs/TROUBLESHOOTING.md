# 🔧 TROUBLESHOOTING - Common Issues & Solutions

## 📌 Table of Contents
- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [ESLint Errors](#eslint-errors)
- [TypeScript Errors](#typescript-errors)
- [Network Errors](#network-errors)
- [Authentication Issues](#authentication-issues)
- [Performance Issues](#performance-issues)

---

## 🏗️ Build Errors

### Error 1: Module Not Found

**Error Message:**
```
Error: Cannot find module '@/components/button'
```

**Cause:**
- TypeScript path alias not configured
- File doesn't exist
- Wrong import path

**Solution:**

1. **Check `tsconfig.json`:**
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

2. **Verify file exists:**
```bash
ls src/components/button.tsx
```

3. **Check import statement:**
```typescript
// ✅ CORRECT
import { Button } from '@/components/ui/button'

// ❌ WRONG
import { Button } from '@/components/button'
```

---

### Error 2: Build Failed - Type Error

**Error Message:**
```
Type error: Property 'xxx' does not exist on type 'YYY'
```

**Cause:**
- Type definition outdated
- Missing property in interface

**Solution:**

1. **Update type definition:**
```typescript
// types/blog.type.ts
export interface Blog {
  id: string
  title: string
  // Add missing property
  excerpt: string
}
```

2. **Rebuild:**
```bash
npm run build
```

---

### Error 3: .next Cache Issue

**Error Message:**
```
Error: Module build failed (from ./node_modules/next/dist/build/...)
```

**Cause:**
- Corrupted Next.js cache

**Solution:**

```bash
# Clear .next folder
rm -rf .next

# Clear node_modules (if needed)
rm -rf node_modules
npm install

# Rebuild
npm run dev
```

---

### Error 4: Out of Memory

**Error Message:**
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
JavaScript heap out of memory
```

**Cause:**
- Large project
- Not enough memory allocated

**Solution:**

```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

## 🐛 Runtime Errors

### Error 1: Hydration Mismatch

**Error Message:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**Cause:**
- Different rendering between server and client
- Using browser-only APIs in server components
- Random values in server components

**Solution:**

1. **Use client component:**
```typescript
'use client'

export function MyComponent() {
  // Now can use browser APIs
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return <div>{/* Your content */}</div>
}
```

2. **Avoid random values in server:**
```typescript
// ❌ BAD - Different on server/client
<div id={Math.random()}>

// ✅ GOOD - Use stable ID
<div id="my-component">
```

---

### Error 2: Cannot Read Properties of Undefined

**Error Message:**
```
TypeError: Cannot read properties of undefined (reading 'xxx')
```

**Cause:**
- Data not loaded yet
- API returned null/undefined

**Solution:**

1. **Add loading check:**
```typescript
export function BlogCard({ blog }: Props) {
  // ✅ Early return if no data
  if (!blog) return null
  
  return (
    <div>
      <h2>{blog.title}</h2>
    </div>
  )
}
```

2. **Use optional chaining:**
```typescript
// ✅ Safe access
<p>{blog?.author?.name}</p>

// ✅ With fallback
<p>{blog?.author?.name || 'Unknown'}</p>
```

---

### Error 3: Too Many Re-renders

**Error Message:**
```
Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

**Cause:**
- Setting state in render
- Inline function in setState

**Solution:**

1. **Don't call setState in render:**
```typescript
// ❌ BAD
function Component() {
  const [count, setCount] = useState(0)
  setCount(count + 1) // Causes infinite loop
  return <div>{count}</div>
}

// ✅ GOOD
function Component() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    setCount(count + 1)
  }, [])
  
  return <div>{count}</div>
}
```

2. **Use callback form:**
```typescript
// ❌ BAD - Creates new function every render
<button onClick={() => setCount(count + 1)}>

// ✅ GOOD - Use useCallback
const increment = useCallback(() => {
  setCount(prev => prev + 1)
}, [])

<button onClick={increment}>
```

---

### Error 4: localStorage is Not Defined

**Error Message:**
```
ReferenceError: localStorage is not defined
```

**Cause:**
- Accessing localStorage in server component
- Next.js SSR doesn't have localStorage

**Solution:**

1. **Check if window exists:**
```typescript
// ✅ Safe access
const token = typeof window !== 'undefined' 
  ? localStorage.getItem('token') 
  : null
```

2. **Use client component:**
```typescript
'use client'

export function MyComponent() {
  const [token, setToken] = useState<string | null>(null)
  
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])
  
  return <div>{token}</div>
}
```

---

## ⚠️ ESLint Errors

### Error 1: Enum Not Allowed in /types

**Error Message:**
```
❌ enum is NOT allowed in /types. Use type or interface only.
```

**Cause:**
- Using enum in types folder

**Solution:**

```typescript
// ❌ WRONG - types/status.ts
export enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

// ✅ CORRECT - const/status.ts
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export type Status = typeof STATUS[keyof typeof STATUS]
```

**See:** [TYPES_LAYER.md](./TYPES_LAYER.md)

---

### Error 2: Relative Import Not Allowed

**Error Message:**
```
❌ Không dùng relative import vượt folder. Chỉ dùng "./" hoặc "@/".
```

**Cause:**
- Using `../` in imports

**Solution:**

```typescript
// ❌ WRONG
import { Button } from '../../components/ui/button'

// ✅ CORRECT
import { Button } from '@/components/ui/button'
```

---

### Error 3: Import Order Incorrect

**Error Message:**
```
⚠️ Warning: `@/hooks/use-blog` import should occur before import of `react`
```

**Cause:**
- Imports not ordered correctly

**Solution:**

```bash
# Auto-fix
npm run lint:fix
```

**Or manually:**
```typescript
// ✅ CORRECT ORDER
// 1. External
import { useState } from 'react'

// 2. Types
import type { Blog } from '@/types'

// 3. Internal
import { useBlog } from '@/hooks/use-blog'
```

---

## 🔷 TypeScript Errors

### Error 1: Type 'string' is Not Assignable to Type 'never'

**Error Message:**
```
Type 'string' is not assignable to type 'never'
```

**Cause:**
- Array initialized as empty without type

**Solution:**

```typescript
// ❌ WRONG
const items = []
items.push('hello') // Error: Type 'string' not assignable to 'never'

// ✅ CORRECT
const items: string[] = []
items.push('hello') // OK
```

---

### Error 2: Property Does Not Exist on Type

**Error Message:**
```
Property 'email' does not exist on type 'User'
```

**Cause:**
- Type definition missing property
- Wrong type used

**Solution:**

1. **Add to interface:**
```typescript
export interface User {
  id: string
  name: string
  email: string  // Add missing property
}
```

2. **Or use optional:**
```typescript
export interface User {
  id: string
  name: string
  email?: string  // Optional property
}
```

---

### Error 3: Argument of Type X is Not Assignable to Parameter of Type Y

**Error Message:**
```
Argument of type 'string' is not assignable to parameter of type 'number'
```

**Cause:**
- Wrong type passed to function

**Solution:**

```typescript
// ❌ WRONG
const age: string = '25'
calculateAge(age)

// ✅ CORRECT
const age: number = 25
calculateAge(age)

// Or convert
const age: string = '25'
calculateAge(Number(age))
```

---

### Error 4: Object is Possibly 'undefined'

**Error Message:**
```
Object is possibly 'undefined'
```

**Cause:**
- Accessing property without null check

**Solution:**

```typescript
// ❌ WRONG
const name = user.name

// ✅ CORRECT - Optional chaining
const name = user?.name

// ✅ CORRECT - Null check
if (user) {
  const name = user.name
}

// ✅ CORRECT - Non-null assertion (use carefully)
const name = user!.name
```

---

## 🌐 Network Errors

### Error 1: 401 Unauthorized

**Error Message:**
```
Error 401: Unauthorized
```

**Cause:**
- No token
- Token expired
- Invalid token

**Solution:**

1. **Check token:**
```typescript
const token = localStorage.getItem('token')
console.log('Token:', token)
```

2. **Refresh token:**
```typescript
// hooks/use-auth.ts
export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => 
      authApi.refreshToken(refreshToken),
    onSuccess: (response) => {
      localStorage.setItem('token', response.token)
    },
  })
}
```

3. **Re-login:**
```bash
# Clear storage
localStorage.clear()

# Login again
```

---

### Error 2: 404 Not Found

**Error Message:**
```
Error 404: Not Found
```

**Cause:**
- Wrong API endpoint
- Resource doesn't exist
- Typo in URL

**Solution:**

1. **Check endpoint:**
```typescript
// Check API URL
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)

// Check full URL
console.log('Request URL:', `${API_URL}/blogs/${id}`)
```

2. **Verify resource exists:**
```bash
# Test with curl
curl https://api.example.com/blogs/123
```

---

### Error 3: CORS Error

**Error Message:**
```
Access to fetch at 'https://api.example.com' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Cause:**
- Backend not configured for CORS
- Wrong origin

**Solution:**

1. **Backend must allow origin:**
```javascript
// Backend (Express)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
```

2. **Or use Next.js proxy:**
```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ]
  },
}
```

---

### Error 4: Request Timeout

**Error Message:**
```
Error: timeout of 30000ms exceeded
```

**Cause:**
- API too slow
- Network issue
- Server down

**Solution:**

1. **Increase timeout:**
```typescript
// lib/api/base-api.ts
export const apiService = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds
})
```

2. **Add retry:**
```typescript
// hooks/use-blog.ts
export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getAll(),
    retry: 3,
    retryDelay: 1000,
  })
}
```

---

## 🔐 Authentication Issues

### Issue 1: User Logged Out Automatically

**Cause:**
- Token expired
- 401 response triggers auto-logout

**Solution:**

1. **Check token expiration:**
```typescript
// utils/token.ts
export function isTokenExpired(token: string): boolean {
  const payload = JSON.parse(atob(token.split('.')[1]))
  return payload.exp * 1000 < Date.now()
}
```

2. **Refresh token before expiration:**
```typescript
useEffect(() => {
  const token = localStorage.getItem('token')
  if (token && isTokenExpired(token)) {
    // Refresh token
    refreshTokenMutation.mutate()
  }
}, [])
```

---

### Issue 2: Protected Route Accessible Without Login

**Cause:**
- Middleware not working
- Wrong matcher pattern

**Solution:**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
  ]
}
```

---

### Issue 3: Token Not Sent in Request

**Cause:**
- Interceptor not working
- Token not in localStorage

**Solution:**

1. **Check interceptor:**
```typescript
// lib/api/base-api.private.ts
apiServicePrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('Token being sent:', token) // Debug
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  }
)
```

2. **Check storage:**
```javascript
// In browser console
localStorage.getItem('token')
```

---

## ⚡ Performance Issues

### Issue 1: Slow Page Load

**Cause:**
- Large bundle size
- Too many API calls
- No code splitting

**Solution:**

1. **Analyze bundle:**
```bash
npm run build
npm run analyze
```

2. **Lazy load components:**
```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('@/components/heavy-component'))

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

3. **Optimize images:**
```typescript
import Image from 'next/image'

<Image 
  src="/image.jpg" 
  width={500} 
  height={300}
  alt="Description"
  loading="lazy"
/>
```

---

### Issue 2: Too Many Re-renders

**Cause:**
- Unnecessary state updates
- Missing memoization

**Solution:**

1. **Use React DevTools Profiler:**
```bash
# Install React DevTools extension
# Record component renders
# Identify unnecessary renders
```

2. **Memoize expensive calculations:**
```typescript
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name))
}, [items])
```

3. **Memoize callbacks:**
```typescript
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])
```

---

### Issue 3: API Called Multiple Times

**Cause:**
- React Query not caching properly
- Component mounting multiple times

**Solution:**

1. **Check staleTime:**
```typescript
export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

2. **Check component mounting:**
```typescript
useEffect(() => {
  console.log('Component mounted')
  return () => console.log('Component unmounted')
}, [])
```

---

## 🆘 Getting More Help

### Check Logs

**Browser Console:**
```javascript
// Press F12
// Check Console tab for errors
// Check Network tab for API requests
```

**Server Logs:**
```bash
# Check terminal where npm run dev is running
```

---

### Debug Mode

```typescript
// Add debug logs
console.log('State:', state)
console.log('Props:', props)
console.log('API Response:', response)

// Remove before commit!
```

---

### Ask for Help

**Include in your question:**
1. Error message (full text)
2. Code snippet (relevant part)
3. What you tried
4. Screenshots (if UI issue)

**Example:**
```
## Issue
Getting "Cannot find module '@/components/button'" error

## Error
[Full error message]

## Code
[Code snippet]

## Tried
- Checked tsconfig.json ✅
- Verified file exists ✅
- Restarted dev server ❌ Didn't work

## Environment
- Node: 18.17.0
- Next.js: 14.0.0
- OS: macOS
```

---

## 🔗 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Understanding architecture
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Coding best practices
- [ESLINT_RULES.md](./ESLINT_RULES.md) - ESLint configuration

---

**Still stuck? Don't hesitate to ask the team! 🙋**

*"There are no stupid questions, only questions not asked."*
