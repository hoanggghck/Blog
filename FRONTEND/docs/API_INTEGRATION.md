# 🔌 API INTEGRATION - Hướng dẫn tích hợp API

## 📌 Table of Contents
- [API Architecture](#api-architecture)
- [API Layer Structure](#api-layer-structure)
- [Axios Configuration](#axios-configuration)
- [API Module Pattern](#api-module-pattern)
- [React Query Integration](#react-query-integration)
- [Error Handling](#error-handling)
- [Authentication Flow](#authentication-flow)
- [File Upload](#file-upload)
- [Best Practices](#best-practices)

---

## 🏗️ API Architecture

### Layer Overview

```
┌─────────────────────────────┐
│   Feature (Business Logic)  │
│   - Handle user actions      │
│   - Manage UI state          │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│   Hooks (React Query)       │
│   - useQuery, useMutation    │
│   - Caching & revalidation   │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│   API Module (Axios)        │
│   - HTTP requests            │
│   - Request/Response format  │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│   Axios Instance (Core)     │
│   - Interceptors             │
│   - Base config              │
└──────────────┬──────────────┘
               ↓
         Backend API
```

---

## 📁 API Layer Structure

### Directory Structure

```
src/
├── lib/
│   └── api/
│       ├── base-api.public.ts      # Public API (no auth)
│       ├── base-api.private.ts     # Private API (auth required)
│       └── index.ts                # Exports
├── apis/
│   ├── auth.api.ts                 # Auth endpoints
│   ├── blog.api.ts                 # Blog CRUD
│   ├── comment.api.ts              # Comment CRUD
│   ├── user.api.ts                 # User management
│   ├── category.api.ts             # Category CRUD
│   └── tag.api.ts                  # Tag CRUD
└── hooks/
    ├── use-auth.ts                 # Auth hooks
    ├── use-blog.ts                 # Blog hooks
    ├── use-comment.ts              # Comment hooks
    └── use-user.ts                 # User hooks
```

---

## ⚙️ Axios Configuration

### Base API - Public (No Authentication)

```typescript
// lib/api/base-api.public.ts
import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const apiServicePublic = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Response interceptor
apiServicePublic.interceptors.response.use(
  (response) => {
    // Return only data from response
    return response.data
  },
  (error: AxiosError) => {
    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message)
    
    // Return error data or original error
    return Promise.reject(error.response?.data || error)
  }
)
```

---

### Base API - Private (With Authentication)

```typescript
// lib/api/base-api.private.ts
import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const apiServicePrivate = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor - Inject token
apiServicePrivate.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiServicePrivate.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message)
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login
      window.location.href = '/login'
    }
    
    return Promise.reject(error.response?.data || error)
  }
)
```

---

### Upload File Instance

```typescript
// lib/api/base-api.private.ts (continued)

export const apiServicePrivateUploadFile = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // 60 seconds for file upload
})

// Request interceptor
apiServicePrivateUploadFile.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiServicePrivateUploadFile.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    console.error('Upload Error:', error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    return Promise.reject(error.response?.data || error)
  }
)
```

---

### Export API Services

```typescript
// lib/api/index.ts
export { apiServicePublic as apiService } from './base-api.public'
export { 
  apiServicePrivate,
  apiServicePrivateUploadFile as apiServiceUpload 
} from './base-api.private'
```

---

## 🔌 API Module Pattern

### Template Structure

```typescript
// apis/{domain}.api.ts
import { apiService, apiServicePrivate, apiServiceUpload } from '@/lib/api'

import type { 
  Resource, 
  CreateResourceDto, 
  UpdateResourceDto,
  ResourceQuery 
} from '@/types'

export const resourceApi = {
  // GET all with query params
  getAll: (params: ResourceQuery) => 
    apiService.get<Resource[]>('/resources', { params }),
    
  // GET single by ID
  getById: (id: string) => 
    apiService.get<Resource>(`/resources/${id}`),
    
  // POST create
  create: (data: CreateResourceDto) => 
    apiServicePrivate.post<Resource>('/resources', data),
    
  // PUT update
  update: (id: string, data: UpdateResourceDto) => 
    apiServicePrivate.put<Resource>(`/resources/${id}`, data),
    
  // DELETE
  delete: (id: string) => 
    apiServicePrivate.delete(`/resources/${id}`),
}
```

---

### Example: Blog API

```typescript
// apis/blog.api.ts
import { apiService, apiServicePrivate, apiServiceUpload } from '@/lib/api'

import type { 
  Blog, 
  CreateBlogDto, 
  UpdateBlogDto,
  BlogListQuery,
  PaginatedResponse 
} from '@/types'

export const blogApi = {
  /**
   * Get all blogs with filters
   */
  getAll: (params: BlogListQuery) => 
    apiService.get<PaginatedResponse<Blog>>('/blogs', { params }),
    
  /**
   * Get single blog by ID
   */
  getById: (id: string) => 
    apiService.get<Blog>(`/blogs/${id}`),
    
  /**
   * Create new blog (with file upload)
   */
  create: (data: FormData) => 
    apiServiceUpload.post<Blog>('/blogs', data),
    
  /**
   * Update blog
   */
  update: (id: string, data: FormData) => 
    apiServiceUpload.put<Blog>(`/blogs/${id}`, data),
    
  /**
   * Delete blog
   */
  delete: (id: string) => 
    apiServicePrivate.delete(`/blogs/${id}`),
    
  /**
   * Like blog
   */
  like: (id: string) => 
    apiServicePrivate.post(`/blogs/${id}/like`),
    
  /**
   * Unlike blog
   */
  unlike: (id: string) => 
    apiServicePrivate.delete(`/blogs/${id}/like`),
    
  /**
   * Publish blog
   */
  publish: (id: string) => 
    apiServicePrivate.post(`/blogs/${id}/publish`),
}
```

---

### Example: Auth API

```typescript
// apis/auth.api.ts
import { apiService } from '@/lib/api'

import type { 
  LoginUserDto, 
  RegisterUserDto, 
  AuthResponse,
  User 
} from '@/types'

export const authApi = {
  /**
   * Login
   */
  login: (data: LoginUserDto) => 
    apiService.post<AuthResponse>('/auth/login', data),
    
  /**
   * Register
   */
  register: (data: RegisterUserDto) => 
    apiService.post<AuthResponse>('/auth/register', data),
    
  /**
   * Logout
   */
  logout: () => 
    apiService.post('/auth/logout'),
    
  /**
   * Get current user profile
   */
  getProfile: () => 
    apiService.get<User>('/auth/profile'),
    
  /**
   * Refresh token
   */
  refreshToken: (refreshToken: string) => 
    apiService.post<AuthResponse>('/auth/refresh', { refreshToken }),
}
```

---

## 🎣 React Query Integration

### Query Hooks (GET)

```typescript
// hooks/use-blog.ts
import { useQuery } from '@tanstack/react-query'

import { blogApi } from '@/apis/blog.api'

import type { BlogListQuery } from '@/types'

/**
 * Get all blogs
 */
export function useBlogs(params: BlogListQuery = {}) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => blogApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

/**
 * Get single blog
 */
export function useBlog(id: string) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id, // Only run if id exists
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Get trending blogs
 */
export function useTrendingBlogs() {
  return useQuery({
    queryKey: ['blogs', 'trending'],
    queryFn: () => blogApi.getAll({ sortBy: 'viewsCount', sortOrder: 'desc', limit: 10 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

---

### Mutation Hooks (POST/PUT/DELETE)

```typescript
// hooks/use-blog.ts (continued)
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Create blog
 */
export function useCreateBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: FormData) => blogApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch blogs list
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

/**
 * Update blog
 */
export function useUpdateBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      blogApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific blog
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] })
      // Invalidate blogs list
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

/**
 * Delete blog
 */
export function useDeleteBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

/**
 * Like blog with optimistic update
 */
export function useLikeBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => blogApi.like(id),
    onMutate: async (blogId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['blog', blogId] })
      
      // Snapshot previous value
      const previousBlog = queryClient.getQueryData(['blog', blogId])
      
      // Optimistically update
      queryClient.setQueryData(['blog', blogId], (old: any) => ({
        ...old,
        isLiked: true,
        likesCount: old.likesCount + 1,
      }))
      
      return { previousBlog }
    },
    onError: (err, blogId, context) => {
      // Rollback on error
      if (context?.previousBlog) {
        queryClient.setQueryData(['blog', blogId], context.previousBlog)
      }
    },
    onSettled: (_, __, blogId) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] })
    },
  })
}
```

---

### Usage in Feature

```typescript
// features/blog/blog-detail-feature.tsx
'use client'

import { useBlog, useLikeBlog, useDeleteBlog } from '@/hooks/use-blog'

export function BlogDetailFeature({ blogId }: Props) {
  // Query
  const { data: blog, isLoading, error } = useBlog(blogId)
  
  // Mutations
  const likeMutation = useLikeBlog()
  const deleteMutation = useDeleteBlog()
  
  // Handlers
  const handleLike = () => {
    likeMutation.mutate(blogId, {
      onSuccess: () => {
        toast.success('Đã thích bài viết')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Có lỗi xảy ra')
      },
    })
  }
  
  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xoá?')) return
    
    deleteMutation.mutate(blogId, {
      onSuccess: () => {
        toast.success('Đã xoá bài viết')
        router.push('/blog')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Không thể xoá')
      },
    })
  }
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />
  if (!blog) return <NotFound />
  
  return (
    <div>
      <BlogCard blog={blog} onLike={handleLike} />
      <Button onClick={handleDelete} loading={deleteMutation.isPending}>
        Xoá
      </Button>
    </div>
  )
}
```

---

## ⚠️ Error Handling

### API Error Types

```typescript
// types/api.type.ts
export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]> // Validation errors
}
```

---

### Global Error Handler (Interceptor)

Already handled in `base-api.private.ts`:

```typescript
apiServicePrivate.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiError>) => {
    const apiError = error.response?.data
    
    // Handle different status codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - logout
        localStorage.removeItem('token')
        window.location.href = '/login'
        break
        
      case 403:
        // Forbidden
        console.error('Permission denied')
        break
        
      case 404:
        // Not found
        console.error('Resource not found')
        break
        
      case 422:
        // Validation error
        console.error('Validation error:', apiError?.errors)
        break
        
      case 500:
        // Server error
        console.error('Server error')
        break
    }
    
    return Promise.reject(apiError || error)
  }
)
```

---

### Per-Request Error Handling

```typescript
// In feature component
const mutation = useCreateBlog()

const handleSubmit = (data: FormData) => {
  mutation.mutate(data, {
    onError: (error: ApiError) => {
      if (error.statusCode === 422) {
        // Handle validation errors
        Object.entries(error.errors || {}).forEach(([field, messages]) => {
          form.setError(field, { message: messages[0] })
        })
      } else {
        toast.error(error.message || 'Có lỗi xảy ra')
      }
    },
  })
}
```

---

### Display Validation Errors

```typescript
// components/forms/blog-form.tsx
import { useForm } from 'react-hook-form'

export function BlogForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors }, setError } = useForm()
  
  const mutation = useCreateBlog()
  
  const submit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Tạo blog thành công')
      },
      onError: (error: ApiError) => {
        // Set validation errors
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            setError(field as any, { message: messages[0] })
          })
        } else {
          toast.error(error.message)
        }
      },
    })
  }
  
  return (
    <form onSubmit={handleSubmit(submit)}>
      <Input 
        {...register('title')} 
        error={errors.title?.message}
      />
      <Button type="submit" loading={mutation.isPending}>
        Tạo blog
      </Button>
    </form>
  )
}
```

---

## 🔐 Authentication Flow

### Login Flow

```typescript
// hooks/use-auth.ts
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { authApi } from '@/apis/auth.api'
import { useAuthStore } from '@/stores/auth-store'

import type { LoginUserDto } from '@/types'

export function useLogin() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  
  return useMutation({
    mutationFn: (data: LoginUserDto) => authApi.login(data),
    onSuccess: (response) => {
      // Save to store (also saves to localStorage via persist)
      setUser(response.user)
      setToken(response.token)
      
      // Redirect to home
      router.push('/')
      
      toast.success('Đăng nhập thành công')
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Đăng nhập thất bại')
    },
  })
}
```

---

### Logout Flow

```typescript
// hooks/use-auth.ts (continued)
export function useLogout() {
  const router = useRouter()
  const { logout: clearAuth } = useAuthStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear auth state
      clearAuth()
      
      // Clear all queries
      queryClient.clear()
      
      // Redirect to login
      router.push('/login')
      
      toast.success('Đã đăng xuất')
    },
  })
}
```

---

### Protected Routes (middleware.ts)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/profile', '/blog/create']
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  if (isProtectedRoute && !token) {
    // Redirect to login with callback URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/blog/create',
    '/blog/:id/edit',
  ]
}
```

---

## 📤 File Upload

### Prepare FormData

```typescript
// features/blog/blog-create-feature.tsx
import { useCreateBlog } from '@/hooks/use-blog'

export function BlogCreateFeature() {
  const createMutation = useCreateBlog()
  
  const handleSubmit = (data: BlogFormData) => {
    // Create FormData
    const formData = new FormData()
    
    // Append text fields
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('excerpt', data.excerpt)
    formData.append('categoryId', data.categoryId)
    
    // Append array
    data.tagIds.forEach(tagId => {
      formData.append('tagIds[]', tagId)
    })
    
    // Append file
    if (data.image) {
      formData.append('image', data.image)
    }
    
    // Submit
    createMutation.mutate(formData, {
      onSuccess: (blog) => {
        toast.success('Tạo blog thành công')
        router.push(`/blog/${blog.id}`)
      },
      onError: (error: ApiError) => {
        toast.error(error.message)
      },
    })
  }
  
  return <BlogForm onSubmit={handleSubmit} />
}
```

---

### Upload with Progress

```typescript
// apis/blog.api.ts
import { apiServiceUpload } from '@/lib/api'

export const blogApi = {
  createWithProgress: (data: FormData, onProgress?: (progress: number) => void) => {
    return apiServiceUpload.post<Blog>('/blogs', data, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress?.(progress)
        }
      },
    })
  },
}
```

```typescript
// features/blog/blog-create-feature.tsx
const [uploadProgress, setUploadProgress] = useState(0)

const handleSubmit = (data: FormData) => {
  blogApi.createWithProgress(data, setUploadProgress)
    .then((blog) => {
      toast.success('Upload thành công')
    })
    .catch((error) => {
      toast.error(error.message)
    })
}

return (
  <div>
    <BlogForm onSubmit={handleSubmit} />
    {uploadProgress > 0 && (
      <ProgressBar value={uploadProgress} />
    )}
  </div>
)
```

---

## ✅ Best Practices

### 1. Type Safety

```typescript
// ✅ GOOD - Type-safe API calls
const { data: blogs } = useBlogs()
// blogs: PaginatedResponse<Blog> | undefined

const mutation = useCreateBlog()
// mutation.mutate expects FormData
```

---

### 2. Query Key Management

```typescript
// ✅ GOOD - Hierarchical keys
['blogs']                    // All blogs
['blogs', params]           // Blogs with filters
['blog', id]                // Single blog
['blogs', 'trending']       // Trending blogs
```

---

### 3. Cache Invalidation

```typescript
// ✅ GOOD - Invalidate related queries
queryClient.invalidateQueries({ queryKey: ['blog', id] })  // Single blog
queryClient.invalidateQueries({ queryKey: ['blogs'] })     // All blog lists
```

---

### 4. Loading States

```typescript
// ✅ GOOD - Handle all states
const { data, isLoading, error, isSuccess } = useBlogs()

if (isLoading) return <Spinner />
if (error) return <ErrorMessage error={error} />
if (!data) return null

return <BlogList blogs={data.items} />
```

---

### 5. Optimistic Updates

```typescript
// ✅ GOOD - For better UX
const likeMutation = useLikeBlog()

// Update UI immediately, rollback on error
likeMutation.mutate(blogId, {
  onMutate: () => {
    // Update cache optimistically
  },
  onError: () => {
    // Rollback
  },
})
```

---

## 🔗 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc tổng quan
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Cấu trúc thư mục
- [FEATURE_DEVELOPMENT.md](./FEATURE_DEVELOPMENT.md) - Feature development guide

---

**"Good API integration is invisible - it just works."**
