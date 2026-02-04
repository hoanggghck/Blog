# 📁 FOLDER STRUCTURE - Cấu trúc thư mục chi tiết

## 📌 Table of Contents
- [Overview](#overview)
- [Root Structure](#root-structure)
- [src/ Directory](#src-directory)
- [Folder Details](#folder-details)
- [File Naming Conventions](#file-naming-conventions)

---

## 🎯 Overview

```
blog-web-app/
├── public/              # Static assets
├── src/                 # Source code
│   ├── apis/           # API modules
│   ├── app/            # Next.js App Router
│   ├── assets/         # Images, fonts, icons
│   ├── components/     # Pure UI components
│   ├── const/          # Constants & enums
│   ├── features/       # Business logic containers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Core libraries & utilities
│   ├── providers/      # React Context providers
│   ├── services/       # Server-side caching services
│   ├── stores/         # Zustand stores
│   ├── styles/         # Global CSS
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
│   └── layouts/        # App layout
├── middleware.ts       # Next.js middleware
├── .env.local          # Environment variables
├── .eslintrc.js        # ESLint configuration
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

---

## 🗂️ Root Structure

### `public/`
Chứa static assets được serve trực tiếp, không qua build process.

```
public/
├── images/
│   ├── logo.svg
│   └── placeholder.png
├── fonts/
│   └── custom-font.woff2
├── favicon.ico
└── robots.txt
```

**Rules:**
- ✅ Static files không thay đổi
- ✅ Images, fonts, icons
- ✅ robots.txt, sitemap.xml
- ❌ Không chứa code
- ❌ Không chứa config files

---

### `middleware.ts`
Next.js middleware cho authentication và route protection.

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}
```

**Responsibility:**
- ✅ Authentication check
- ✅ Route protection
- ✅ Redirect logic
- ✅ Request/Response modification
- ❌ Không xử lý business logic
- ❌ Không gọi API (tốn performance)

---

## 📂 src/ Directory

### 📘 `apis/` - API Modules

**Purpose:** Chứa các API modules, organized by domain.

```
apis/
├── auth.api.ts         # Authentication APIs
├── blog.api.ts         # Blog CRUD APIs
├── user.api.ts         # User management APIs
├── comment.api.ts      # Comment APIs
├── category.api.ts     # Category APIs
└── tag.api.ts          # Tag APIs
```

**Example:**
```typescript
// apis/blog.api.ts
import { apiService, apiServiceUpload } from '@/lib/api'

import type { Blog, BlogQuery, CreateBlogDto, UpdateBlogDto } from '@/types'

export const blogApi = {
  // GET
  getAll: (params: BlogQuery) => 
    apiService.get<Blog[]>('/blogs', { params }),
    
  getById: (id: string) => 
    apiService.get<Blog>(`/blogs/${id}`),
    
  // POST
  create: (data: FormData) => 
    apiServiceUpload.post<Blog>('/blogs', data),
    
  // PUT
  update: (id: string, data: UpdateBlogDto) => 
    apiService.put<Blog>(`/blogs/${id}`, data),
    
  // DELETE
  delete: (id: string) => 
    apiService.delete(`/blogs/${id}`),
    
  // Actions
  like: (id: string) => 
    apiService.post(`/blogs/${id}/like`),
    
  unlike: (id: string) => 
    apiService.delete(`/blogs/${id}/like`),
}
```

**Rules:**
- ✅ Export object với methods
- ✅ Type-safe với generics
- ✅ Sử dụng apiService từ `lib/`
- ✅ Organized by domain
- ❌ Không xử lý UI
- ❌ Không xử lý caching (React Query lo)
- ❌ Không xử lý error display (Feature lo)

**File naming:** `{domain}.api.ts`

---

### 📘 `app/` - Next.js App Router

**Purpose:** Routing, layouts, pages, metadata.

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (main)/
│   ├── blog/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── layout.tsx
├── dashboard/
│   ├── blogs/
│   │   └── page.tsx
│   ├── users/
│   │   └── page.tsx
│   └── layout.tsx
├── layout.tsx           # Root layout
├── page.tsx            # Home page
└── not-found.tsx       # 404 page
```

**Example - Page:**
```typescript
// app/(main)/blog/[id]/page.tsx
import { Metadata } from 'next'

import { BlogDetailFeature } from '@/features/blog/blog-detail-feature'
import { getBlogById } from '@/services/blog.service'

type Props = {
  params: { id: string }
}

// SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogById(params.id)
  
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      images: [blog.image],
    },
  }
}

// Page Component
export default function BlogDetailPage({ params }: Props) {
  return <BlogDetailFeature blogId={params.id} />
}
```

**Example - Layout:**
```typescript
// app/(main)/layout.tsx
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container mx-auto py-8">
        {children}
      </main>
      <Footer />
    </>
  )
}
```

**Rules:**
- ✅ Routing và layout composition
- ✅ SEO metadata (generateMetadata)
- ✅ Server Components cho SEO
- ✅ Render Feature components
- ❌ Không xử lý business logic
- ❌ Không gọi API (trừ SSR cho SEO)
- ❌ Không quản lý state phức tạp

**Conventions:**
- `(group)/` - Route groups (không ảnh hưởng URL)
- `[param]/` - Dynamic routes
- `page.tsx` - Page component
- `layout.tsx` - Layout wrapper
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI

---

### 📘 `assets/` - Static Assets

**Purpose:** Images, icons, fonts dùng trong code.

```
assets/
├── images/
│   ├── hero-banner.png
│   ├── default-avatar.svg
│   └── logo.svg
├── icons/
│   ├── chevron-down.svg
│   └── close.svg
└── fonts/
    └── custom-font.woff2
```

**Usage:**
```typescript
import HeroBanner from '@/assets/images/hero-banner.png'
import Logo from '@/assets/images/logo.svg'

export function Hero() {
  return (
    <div>
      <img src={HeroBanner.src} alt="Hero" />
      <Logo className="w-32 h-32" />
    </div>
  )
}
```

**Rules:**
- ✅ Import trong code
- ✅ Optimized bởi Next.js
- ✅ TypeScript support
- ❌ Khác với `public/` (dùng cho static serving)

---

### 📘 `components/` - Pure UI Components

**Purpose:** Presentational components, không có business logic.

```
components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── card.tsx
├── layout/
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
├── blog/
│   ├── blog-card.tsx
│   ├── blog-list.tsx
│   └── blog-skeleton.tsx
├── comment/
│   ├── comment-item.tsx
│   ├── comment-list.tsx
│   └── comment-form.tsx
└── common/
    ├── loading-spinner.tsx
    ├── error-message.tsx
    └── empty-state.tsx
```

**Example:**
```typescript
// components/blog/blog-card.tsx
import { Heart, Share2 } from 'lucide-react'

import type { Blog } from '@/types'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface BlogCardProps {
  blog: Blog
  onLike?: () => void
  onShare?: () => void
  onCardClick?: () => void
}

export function BlogCard({ blog, onLike, onShare, onCardClick }: BlogCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition" onClick={onCardClick}>
      <img 
        src={blog.image} 
        alt={blog.title} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="text-xl font-bold">{blog.title}</h3>
        <p className="text-gray-600 mt-2">{blog.excerpt}</p>
        
        <div className="flex items-center justify-between mt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation()
              onLike?.()
            }}
          >
            <Heart className="w-4 h-4 mr-1" />
            {blog.likesCount}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onShare?.()
            }}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

**Rules:**
- ✅ Pure presentation
- ✅ Nhận data qua props
- ✅ Emit events qua callbacks (onXxx)
- ✅ Local UI state (hover, focus, open/close)
- ✅ Styled với Tailwind CSS
- ❌ Không fetch data
- ❌ Không gọi API
- ❌ Không xử lý business logic
- ❌ Không import hooks (trừ UI hooks như useToggle)

**File naming:** `kebab-case.tsx`

---

### 📘 `const/` - Constants & Enums

**Purpose:** Lưu trữ constants, enums, config values.

```
const/
├── routes.ts           # Route constants
├── roles.ts            # User roles
├── status.ts           # Status constants
└── app-config.ts       # App configuration
```

**Example:**
```typescript
// const/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BLOG: {
    LIST: '/blog',
    DETAIL: (id: string) => `/blog/${id}`,
    CREATE: '/blog/create',
    EDIT: (id: string) => `/blog/${id}/edit`,
  },
  DASHBOARD: {
    HOME: '/dashboard',
    BLOGS: '/dashboard/blogs',
    USERS: '/dashboard/users',
    CATEGORIES: '/dashboard/categories',
    TAGS: '/dashboard/tags',
  },
  PROFILE: '/profile',
} as const

// const/roles.ts
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// const/status.ts
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export type BlogStatus = typeof BLOG_STATUS[keyof typeof BLOG_STATUS]
```

**Rules:**
- ✅ Use `const` objects thay vì `enum`
- ✅ Use `as const` để type-safe
- ✅ Export types từ constants
- ❌ Không dùng `enum` (ESLint rule)
- ❌ Không chứa functions

**Why no enum?**
```typescript
// ❌ enum tạo ra runtime code
enum Status {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

// ✅ const object không có runtime overhead
const STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const
```

---

### 📘 `features/` - Business Logic Containers

**Purpose:** Orchestrate data fetching, handle user interactions, connect hooks + components.

```
features/
├── auth/
│   ├── login-feature.tsx
│   └── register-feature.tsx
├── blog/
│   ├── blog-list-feature.tsx
│   ├── blog-detail-feature.tsx
│   ├── blog-create-feature.tsx
│   └── blog-edit-feature.tsx
├── comment/
│   └── comment-section-feature.tsx
├── dashboard/
│   ├── dashboard-blogs-feature.tsx
│   ├── dashboard-users-feature.tsx
│   └── dashboard-stats-feature.tsx
└── profile/
    └── profile-feature.tsx
```

**Example:**
```typescript
// features/blog/blog-detail-feature.tsx
'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useBlog, useLikeBlog, useDeleteBlog } from '@/hooks/use-blog'
import { useComments, useCreateComment } from '@/hooks/use-comment'
import { useAuthStore } from '@/stores/auth-store'

import { BlogCard } from '@/components/blog/blog-card'
import { CommentSection } from '@/components/comment/comment-section'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { ErrorMessage } from '@/components/common/error-message'
import { Button } from '@/components/ui/button'

import { ROUTES } from '@/const/routes'

interface BlogDetailFeatureProps {
  blogId: string
}

export function BlogDetailFeature({ blogId }: BlogDetailFeatureProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  
  // Queries
  const { data: blog, isLoading, error } = useBlog(blogId)
  const { data: comments } = useComments(blogId)
  
  // Mutations
  const likeMutation = useLikeBlog()
  const deleteMutation = useDeleteBlog()
  const createCommentMutation = useCreateComment()
  
  // Handlers
  const handleLike = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập')
      router.push(ROUTES.LOGIN)
      return
    }
    
    likeMutation.mutate(blogId, {
      onSuccess: () => toast.success('Đã thích bài viết'),
      onError: () => toast.error('Có lỗi xảy ra'),
    })
  }
  
  const handleDelete = () => {
    if (!confirm('Bạn có chắc muốn xoá?')) return
    
    deleteMutation.mutate(blogId, {
      onSuccess: () => {
        toast.success('Đã xoá bài viết')
        router.push(ROUTES.BLOG.LIST)
      },
    })
  }
  
  const handleComment = (text: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập')
      return
    }
    
    createCommentMutation.mutate({ blogId, text }, {
      onSuccess: () => toast.success('Đã thêm bình luận'),
    })
  }
  
  const handleEdit = () => {
    router.push(ROUTES.BLOG.EDIT(blogId))
  }
  
  // Loading state
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  // Error state
  if (error || !blog) {
    return <ErrorMessage message="Không tìm thấy bài viết" />
  }
  
  // Render
  const isAuthor = user?.id === blog.authorId
  
  return (
    <div className="max-w-4xl mx-auto">
      <BlogCard 
        blog={blog} 
        onLike={handleLike}
      />
      
      {isAuthor && (
        <div className="flex gap-2 mt-4">
          <Button onClick={handleEdit}>Chỉnh sửa</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Xoá
          </Button>
        </div>
      )}
      
      <CommentSection 
        comments={comments || []} 
        onSubmit={handleComment}
        isSubmitting={createCommentMutation.isPending}
      />
    </div>
  )
}
```

**Rules:**
- ✅ Import hooks
- ✅ Xử lý user interactions
- ✅ Loading/Error/Success states
- ✅ Toast notifications
- ✅ Navigation logic
- ✅ Permission checks
- ❌ Không có complex JSX (delegate cho components)
- ❌ Không gọi API trực tiếp (dùng hooks)

**File naming:** `{feature-name}-feature.tsx`

---

### 📘 `hooks/` - Custom React Hooks

**Purpose:** Data fetching với React Query, custom logic hooks.

```
hooks/
├── use-blog.ts
├── use-comment.ts
├── use-user.ts
├── use-category.ts
├── use-tag.ts
├── use-auth.ts
└── use-toggle.ts        # UI helper hook
```

**Example - React Query:**
```typescript
// hooks/use-blog.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { blogApi } from '@/apis/blog.api'

import type { BlogQuery, CreateBlogDto, UpdateBlogDto } from '@/types'

// GET all blogs
export function useBlogs(params: BlogQuery) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => blogApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// GET single blog
export function useBlog(id: string) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id,
  })
}

// CREATE blog
export function useCreateBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: FormData) => blogApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

// UPDATE blog
export function useUpdateBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogDto }) => 
      blogApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

// DELETE blog
export function useDeleteBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

// LIKE blog
export function useLikeBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => blogApi.like(id),
    onSuccess: (_, blogId) => {
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] })
    },
  })
}
```

**Example - Custom Hook:**
```typescript
// hooks/use-toggle.ts
import { useState, useCallback } from 'react'

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  
  return { value, toggle, setTrue, setFalse }
}
```

**Rules:**
- ✅ React Query hooks cho server data
- ✅ Custom hooks cho reusable logic
- ✅ Type-safe
- ✅ Proper cache invalidation
- ❌ Không render UI
- ❌ Không xử lý routing

**File naming:** `use-{name}.ts`

---

### 📘 `lib/` - Core Libraries

**Purpose:** Core setup cho API, utilities, third-party config.

```
lib/
├── api/
│   ├── base-api.public.ts      # Public API (no auth)
│   ├── base-api.private.ts     # Private API (with auth)
│   └── index.ts                # Exports
├── utils.ts                     # shadcn/ui utils
└── query-client.ts              # React Query config
```

**Example - API Setup:**
```typescript
// lib/api/base-api.public.ts
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const apiServicePublic = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor
apiServicePublic.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || error)
  }
)
```

```typescript
// lib/api/base-api.private.ts
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const apiServicePrivate = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Inject token
apiServicePrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiServicePrivate.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on 401
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// Upload file instance
export const apiServicePrivateUploadFile = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

apiServicePrivateUploadFile.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)
```

```typescript
// lib/api/index.ts
export { apiServicePublic as apiService } from './base-api.public'
export { 
  apiServicePrivate,
  apiServicePrivateUploadFile as apiServiceUpload 
} from './base-api.private'
```

**Example - React Query:**
```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

**Rules:**
- ✅ Core setup và configuration
- ✅ Axios instances
- ✅ Interceptors
- ✅ Reusable utilities
- ❌ Không chứa business logic
- ❌ Không chứa components

---

### 📘 `providers/` - React Context Providers

**Purpose:** Wrap app với các providers cần thiết.

```
providers/
├── query-provider.tsx
├── theme-provider.tsx
└── index.tsx
```

**Example:**
```typescript
// providers/query-provider.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/lib/query-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

```typescript
// providers/index.tsx
'use client'

import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryProvider>
  )
}
```

**Usage in root layout:**
```typescript
// app/layout.tsx
import { Providers } from '@/providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

---

### 📘 `services/` - Server-Side Caching

**Purpose:** Server-side data fetching với caching cho SEO.

```
services/
├── blog.service.ts
├── user.service.ts
└── category.service.ts
```

**Example:**
```typescript
// services/blog.service.ts
import { cache } from 'react'

import { blogApi } from '@/apis/blog.api'

// Cache data để tránh fetch nhiều lần trong cùng 1 request
export const getBlogById = cache(async (id: string) => {
  return blogApi.getById(id)
})

export const getBlogs = cache(async () => {
  return blogApi.getAll({})
})
```

**Usage:**
```typescript
// app/blog/[id]/page.tsx - Server Component
import { getBlogById } from '@/services/blog.service'

export default async function BlogPage({ params }: Props) {
  // Data được cache, không fetch lại nếu gọi nhiều lần
  const blog = await getBlogById(params.id)
  
  return <BlogDetailFeature blogId={params.id} initialData={blog} />
}
```

**Rules:**
- ✅ Dùng `cache()` từ React
- ✅ Chỉ dùng trong Server Components
- ✅ Cho SEO metadata
- ❌ Không dùng trong Client Components

---

### 📘 `stores/` - Zustand Stores

**Purpose:** Client-side state management.

```
stores/
├── auth-store.ts
├── theme-store.ts
└── ui-store.ts
```

**Example:**
```typescript
// stores/auth-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
)
```

```typescript
// stores/theme-store.ts
import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))
```

**Usage:**
```typescript
// In component
const { user, logout } = useAuthStore()
const { theme, toggleTheme } = useThemeStore()
```

**Rules:**
- ✅ Client-side state only
- ✅ UI state, auth state
- ✅ TypeScript interface
- ❌ Không dùng cho server data (dùng React Query)

**File naming:** `{name}-store.ts`

---

### 📘 `styles/` - Global Styles

**Purpose:** Global CSS, Tailwind directives, CSS variables.

```
styles/
└── globals.css
```

**Example:**
```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
  }
}

@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
}
```

---

### 📘 `types/` - TypeScript Types

**Purpose:** Compile-time type definitions ONLY.

```
types/
├── index.ts            # Re-exports
├── blog.type.ts
├── user.type.ts
├── comment.type.ts
├── category.type.ts
├── tag.type.ts
└── api.type.ts         # API response types
```

**Example:**
```typescript
// types/blog.type.ts
export interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  authorId: string
  author: {
    id: string
    name: string
    avatar: string
  }
  categoryId: string
  category: {
    id: string
    name: string
  }
  tags: Array<{
    id: string
    name: string
  }>
  likesCount: number
  commentsCount: number
  isLiked: boolean
  status: BlogStatus
  createdAt: string
  updatedAt: string
}

export interface CreateBlogDto {
  title: string
  content: string
  excerpt: string
  image: File
  categoryId: string
  tagIds: string[]
}

export interface UpdateBlogDto {
  title?: string
  content?: string
  excerpt?: string
  image?: File
  categoryId?: string
  tagIds?: string[]
}

export interface BlogQuery {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  tagId?: string
  status?: BlogStatus
}

export type BlogStatus = 'draft' | 'published' | 'archived'
```

**CRITICAL ESLint Rules:**
```typescript
// ✅ ALLOWED in /types
export type UserRole = 'admin' | 'user'
export interface User { id: string; name: string }
export type ApiResponse<T> = { data: T }

// ❌ FORBIDDEN in /types
export enum Status { ... }           // No enum
export const DEFAULT_USER = { ... }  // No variables
export function mapUser() { ... }    // No functions
export class UserModel { ... }       // No classes
```

**Rules:**
- ✅ `type` và `interface` ONLY
- ✅ `export type` và `export interface`
- ❌ NO `enum` (dùng union types)
- ❌ NO functions
- ❌ NO classes
- ❌ NO variables
- ❌ NO executable code

**File naming:** `{domain}.type.ts`

Xem chi tiết tại: [TYPES_LAYER.md](./TYPES_LAYER.md)

---

### 📘 `utils/` - Helper Functions

**Purpose:** Pure utility functions.

```
utils/
├── date.ts
├── string.ts
├── validation.ts
└── format.ts
```

**Example:**
```typescript
// utils/date.ts
import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy') {
  return format(new Date(date), pattern, { locale: vi })
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale: vi 
  })
}
```

```typescript
// utils/string.ts
export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

**Rules:**
- ✅ Pure functions (no side effects)
- ✅ Reusable across app
- ✅ Well tested
- ❌ Không gọi API
- ❌ Không modify global state

---

## 📝 File Naming Conventions

### Components
```
kebab-case.tsx
✅ blog-card.tsx
✅ comment-form.tsx
❌ BlogCard.tsx
❌ commentForm.tsx
```

### Features
```
kebab-case-feature.tsx
✅ blog-list-feature.tsx
✅ dashboard-stats-feature.tsx
```

### Hooks
```
use-{name}.ts
✅ use-blog.ts
✅ use-auth.ts
❌ useBlog.ts
❌ blogHooks.ts
```

### API Modules
```
{domain}.api.ts
✅ blog.api.ts
✅ auth.api.ts
❌ blogApi.ts
❌ api-blog.ts
```

### Types
```
{domain}.type.ts
✅ blog.type.ts
✅ user.type.ts
❌ blogTypes.ts
❌ types-blog.ts
```

### Stores
```
{name}-store.ts
✅ auth-store.ts
✅ theme-store.ts
❌ authStore.ts
❌ store-auth.ts
```

---

## 🎯 Summary

| Folder | Purpose | Can Import From | Cannot Import From |
|--------|---------|-----------------|-------------------|
| `apis/` | API calls | `lib/`, `types/` | `hooks/`, `components/`, `features/`, `app/` |
| `app/` | Routing | All | - |
| `components/` | UI | `types/`, `assets/`, `utils/` | `hooks/`, `features/`, `apis/` |
| `features/` | Business logic | All except `app/` | `app/` |
| `hooks/` | Data management | `apis/`, `types/`, `stores/` | `components/`, `features/`, `app/` |
| `types/` | Types only | Nothing | Everything |
| `stores/` | Client state | `types/` | `apis/`, `hooks/`, `components/` |
| `lib/` | Core setup | `types/` | `hooks/`, `components/`, `features/` |

---

## 🔗 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc tổng quan
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Coding conventions
- [TYPES_LAYER.md](./TYPES_LAYER.md) - Chi tiết về types layer
- [ESLINT_RULES.md](./ESLINT_RULES.md) - ESLint configuration

---

**"A place for everything, and everything in its place."**
