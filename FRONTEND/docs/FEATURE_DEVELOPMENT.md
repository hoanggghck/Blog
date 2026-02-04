# 🚀 FEATURE DEVELOPMENT - Hướng dẫn phát triển feature mới

## 📌 Table of Contents
- [Overview](#overview)
- [Development Workflow](#development-workflow)
- [Step-by-Step Guide](#step-by-step-guide)
- [Example: Comments Feature](#example-comments-feature)
- [Testing Strategy](#testing-strategy)
- [Checklist](#checklist)

---

## 🎯 Overview

Hướng dẫn này giúp developer (đặc biệt là junior) implement một feature mới từ A-Z, following best practices và architecture của dự án.

### Feature Development Flow

```
Requirements
    ↓
1. Define Types
    ↓
2. Create API Module
    ↓
3. Create Hooks
    ↓
4. Build Components
    ↓
5. Create Feature Container
    ↓
6. Add Routes
    ↓
7. Testing
```

---

## 🔄 Development Workflow

### Phase 1: Planning (15 minutes)

**Questions to answer:**
1. Tên feature gì? (e.g., Comments, Notifications)
2. Có những entities nào? (e.g., Comment, Reply)
3. Có những actions nào? (CRUD operations)
4. Cần authentication không?
5. Có upload file không?

---

### Phase 2: Implementation (1-2 hours)

Follow 7 steps dưới đây.

---

### Phase 3: Testing (30 minutes)

- Manual testing
- Edge cases
- Error handling

---

## 📋 Step-by-Step Guide

### Step 1: Define Types

**Location:** `src/types/{feature}.type.ts`

**Tasks:**
- [ ] Create main entity interface
- [ ] Create DTO interfaces (Create, Update)
- [ ] Create query parameters interface
- [ ] Export all types from `types/index.ts`

**Template:**
```typescript
// types/comment.type.ts

import type { User } from './user.type'

/**
 * Comment entity
 */
export interface Comment {
  id: string
  content: string
  blogId: string
  userId: string
  user: User
  createdAt: string
  updatedAt: string
}

/**
 * Create comment DTO
 */
export interface CreateCommentDto {
  content: string
  blogId: string
}

/**
 * Update comment DTO
 */
export interface UpdateCommentDto {
  content: string
}

/**
 * Comment query parameters
 */
export interface CommentQuery {
  blogId?: string
  userId?: string
  page?: number
  limit?: number
}
```

**Export:**
```typescript
// types/index.ts
export * from './comment.type'
```

---

### Step 2: Create API Module

**Location:** `src/apis/{feature}.api.ts`

**Tasks:**
- [ ] Import correct Axios instance
- [ ] Import types
- [ ] Create API methods (GET, POST, PUT, DELETE)
- [ ] Add JSDoc comments

**Template:**
```typescript
// apis/comment.api.ts

import { apiService, apiServicePrivate } from '@/lib/api'

import type { 
  Comment, 
  CreateCommentDto, 
  UpdateCommentDto,
  CommentQuery 
} from '@/types'

export const commentApi = {
  /**
   * Get comments for a blog
   */
  getByBlogId: (blogId: string, params?: CommentQuery) => 
    apiService.get<Comment[]>(`/blogs/${blogId}/comments`, { params }),
    
  /**
   * Get single comment
   */
  getById: (id: string) => 
    apiService.get<Comment>(`/comments/${id}`),
    
  /**
   * Create comment (requires auth)
   */
  create: (data: CreateCommentDto) => 
    apiServicePrivate.post<Comment>('/comments', data),
    
  /**
   * Update comment (requires auth)
   */
  update: (id: string, data: UpdateCommentDto) => 
    apiServicePrivate.put<Comment>(`/comments/${id}`, data),
    
  /**
   * Delete comment (requires auth)
   */
  delete: (id: string) => 
    apiServicePrivate.delete(`/comments/${id}`),
}
```

**Checklist:**
- [ ] Use correct apiService (public/private/upload)
- [ ] Type-safe generics
- [ ] JSDoc comments
- [ ] Consistent naming

---

### Step 3: Create Hooks

**Location:** `src/hooks/use-{feature}.ts`

**Tasks:**
- [ ] Create query hooks (useQuery)
- [ ] Create mutation hooks (useMutation)
- [ ] Setup cache invalidation
- [ ] Add optimistic updates (if needed)

**Template:**
```typescript
// hooks/use-comment.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { commentApi } from '@/apis/comment.api'

import type { CreateCommentDto, UpdateCommentDto, CommentQuery } from '@/types'

/**
 * Get comments for a blog
 */
export function useComments(blogId: string, params?: CommentQuery) {
  return useQuery({
    queryKey: ['comments', blogId, params],
    queryFn: () => commentApi.getByBlogId(blogId, params),
    enabled: !!blogId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Get single comment
 */
export function useComment(id: string) {
  return useQuery({
    queryKey: ['comment', id],
    queryFn: () => commentApi.getById(id),
    enabled: !!id,
  })
}

/**
 * Create comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateCommentDto) => commentApi.create(data),
    onSuccess: (newComment) => {
      // Invalidate comments list for this blog
      queryClient.invalidateQueries({ 
        queryKey: ['comments', newComment.blogId] 
      })
    },
  })
}

/**
 * Update comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentDto }) => 
      commentApi.update(id, data),
    onSuccess: (updatedComment) => {
      // Invalidate specific comment
      queryClient.invalidateQueries({ 
        queryKey: ['comment', updatedComment.id] 
      })
      // Invalidate comments list
      queryClient.invalidateQueries({ 
        queryKey: ['comments', updatedComment.blogId] 
      })
    },
  })
}

/**
 * Delete comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => commentApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidate all comments (we don't know blogId here)
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}
```

**Checklist:**
- [ ] Query keys are hierarchical
- [ ] Proper cache invalidation
- [ ] Enable/disable based on dependencies
- [ ] Set appropriate staleTime

---

### Step 4: Build Components

**Location:** `src/components/{feature}/`

**Tasks:**
- [ ] Create list component
- [ ] Create item component
- [ ] Create form component
- [ ] Create loading skeleton

**Template - List Component:**
```typescript
// components/comment/comment-list.tsx

import type { Comment } from '@/types'

import { CommentItem } from './comment-item'
import { EmptyState } from '@/components/common/empty-state'

interface CommentListProps {
  comments: Comment[]
  onEdit?: (comment: Comment) => void
  onDelete?: (id: string) => void
}

export function CommentList({ comments, onEdit, onDelete }: CommentListProps) {
  if (comments.length === 0) {
    return <EmptyState message="Chưa có bình luận nào" />
  }
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
```

**Template - Item Component:**
```typescript
// components/comment/comment-item.tsx

import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

import type { Comment } from '@/types'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { formatDate } from '@/utils/date'

interface CommentItemProps {
  comment: Comment
  onEdit?: (comment: Comment) => void
  onDelete?: (id: string) => void
}

export function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  return (
    <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
      <Avatar src={comment.user.avatar} alt={comment.user.name} />
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{comment.user.name}</p>
            <p className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </p>
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(comment)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(comment.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xoá
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <p className="mt-2 text-gray-700">{comment.content}</p>
      </div>
    </div>
  )
}
```

**Template - Form Component:**
```typescript
// components/comment/comment-form.tsx

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface CommentFormProps {
  initialValue?: string
  onSubmit: (content: string) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function CommentForm({ 
  initialValue = '', 
  onSubmit, 
  onCancel,
  isSubmitting 
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent('')
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Viết bình luận..."
        rows={3}
        required
      />
      
      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting}>
          Gửi
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Huỷ
          </Button>
        )}
      </div>
    </form>
  )
}
```

**Checklist:**
- [ ] Pure presentation
- [ ] Props for data + callbacks
- [ ] No business logic
- [ ] Proper TypeScript types

---

### Step 5: Create Feature Container

**Location:** `src/features/{feature}/`

**Tasks:**
- [ ] Import hooks
- [ ] Import components
- [ ] Handle loading/error states
- [ ] Implement event handlers
- [ ] Connect hooks to components

**Template:**
```typescript
// features/comment/comment-section-feature.tsx

'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { useComments, useCreateComment, useDeleteComment } from '@/hooks/use-comment'
import { useAuthStore } from '@/stores/auth-store'

import { CommentList } from '@/components/comment/comment-list'
import { CommentForm } from '@/components/comment/comment-form'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { ErrorMessage } from '@/components/common/error-message'
import { Button } from '@/components/ui/button'

interface CommentSectionFeatureProps {
  blogId: string
}

export function CommentSectionFeature({ blogId }: CommentSectionFeatureProps) {
  const { user } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  
  // Queries
  const { 
    data: comments = [], 
    isLoading, 
    error 
  } = useComments(blogId)
  
  // Mutations
  const createMutation = useCreateComment()
  const deleteMutation = useDeleteComment()
  
  // Handlers
  const handleCreateComment = (content: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập')
      return
    }
    
    createMutation.mutate(
      { blogId, content },
      {
        onSuccess: () => {
          toast.success('Đã thêm bình luận')
          setShowForm(false)
        },
        onError: (error: any) => {
          toast.error(error.message || 'Có lỗi xảy ra')
        },
      }
    )
  }
  
  const handleDeleteComment = (commentId: string) => {
    if (!confirm('Bạn có chắc muốn xoá?')) return
    
    deleteMutation.mutate(commentId, {
      onSuccess: () => {
        toast.success('Đã xoá bình luận')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Không thể xoá')
      },
    })
  }
  
  // Loading state
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  // Error state
  if (error) {
    return <ErrorMessage message="Không thể tải bình luận" />
  }
  
  // Render
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Bình luận ({comments.length})
        </h2>
        
        {user && !showForm && (
          <Button onClick={() => setShowForm(true)}>
            Thêm bình luận
          </Button>
        )}
      </div>
      
      {showForm && (
        <CommentForm
          onSubmit={handleCreateComment}
          onCancel={() => setShowForm(false)}
          isSubmitting={createMutation.isPending}
        />
      )}
      
      <CommentList
        comments={comments}
        onDelete={handleDeleteComment}
      />
    </div>
  )
}
```

**Checklist:**
- [ ] Import hooks
- [ ] Loading/Error handling
- [ ] Event handlers
- [ ] Permission checks
- [ ] Toast notifications

---

### Step 6: Add Routes

**Location:** `src/app/`

**Tasks:**
- [ ] Create page route
- [ ] Add to navigation (if needed)
- [ ] Setup metadata for SEO

**Example - Integrate into Blog Detail:**
```typescript
// app/blog/[id]/page.tsx

import { Metadata } from 'next'

import { BlogDetailFeature } from '@/features/blog/blog-detail-feature'
import { CommentSectionFeature } from '@/features/comment/comment-section-feature'
import { getBlogById } from '@/services/blog.service'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogById(params.id)
  
  return {
    title: blog.title,
    description: blog.excerpt,
  }
}

export default function BlogDetailPage({ params }: Props) {
  return (
    <div className="container mx-auto py-8">
      <BlogDetailFeature blogId={params.id} />
      
      <div className="mt-12">
        <CommentSectionFeature blogId={params.id} />
      </div>
    </div>
  )
}
```

---

### Step 7: Update Middleware (if needed)

**Location:** `middleware.ts`

If feature requires authentication:

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/blog/create',
    '/blog/:id/edit',
    '/comments/:id/edit',  // ← Add new route
  ]
}
```

---

## 📝 Example: Comments Feature

### Complete File Structure

```
src/
├── types/
│   ├── comment.type.ts          ✅ Step 1
│   └── index.ts                 ✅ Export
├── apis/
│   └── comment.api.ts           ✅ Step 2
├── hooks/
│   └── use-comment.ts           ✅ Step 3
├── components/
│   └── comment/
│       ├── comment-list.tsx     ✅ Step 4
│       ├── comment-item.tsx     ✅ Step 4
│       └── comment-form.tsx     ✅ Step 4
└── features/
    └── comment/
        └── comment-section-feature.tsx  ✅ Step 5
```

### Integration

```typescript
// app/blog/[id]/page.tsx
import { CommentSectionFeature } from '@/features/comment/comment-section-feature'

export default function BlogDetailPage({ params }: Props) {
  return (
    <div>
      <BlogDetailFeature blogId={params.id} />
      <CommentSectionFeature blogId={params.id} />  {/* ✅ Step 6 */}
    </div>
  )
}
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Happy Path:**
- [ ] Create comment → Success
- [ ] View comments → Display correctly
- [ ] Edit comment → Update successfully
- [ ] Delete comment → Remove from list

**Error Cases:**
- [ ] Create without login → Show login prompt
- [ ] Create empty comment → Show validation error
- [ ] Delete other's comment → Show permission error
- [ ] Network error → Show error message

**Edge Cases:**
- [ ] No comments → Show empty state
- [ ] Very long comment → Truncate or wrap properly
- [ ] Many comments → Pagination works
- [ ] Concurrent edits → Handle correctly

---

### Unit Testing (Optional)

```typescript
// __tests__/hooks/use-comment.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useComments } from '@/hooks/use-comment'

describe('useComments', () => {
  it('should fetch comments', async () => {
    const queryClient = new QueryClient()
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
    
    const { result } = renderHook(
      () => useComments('blog-123'),
      { wrapper }
    )
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    expect(result.current.data).toBeDefined()
  })
})
```

---

## ✅ Development Checklist

### Before Starting
- [ ] Read requirements carefully
- [ ] Check if similar feature exists (copy pattern)
- [ ] Understand data model

### During Development
- [ ] Follow 7 steps in order
- [ ] Test each step before moving to next
- [ ] Commit after each major step

### After Development
- [ ] Manual testing (happy path + errors)
- [ ] Check console for errors/warnings
- [ ] Test on different screen sizes
- [ ] Test with/without authentication
- [ ] Code review with senior

### Before Commit
- [ ] ESLint passes: `npm run lint`
- [ ] TypeScript compiles: `npm run type-check`
- [ ] No console.log statements
- [ ] Clean up unused imports
- [ ] Update documentation (if needed)

---

## 🎓 Tips for Junior Developers

### 1. Start Small
Don't implement everything at once. Start with:
1. Read-only view (GET)
2. Then add Create
3. Then add Update/Delete

### 2. Copy Existing Patterns
Find similar feature and copy its structure:
```bash
# Example: Copy Comment pattern for Reply feature
cp -r src/features/comment src/features/reply
# Then modify files
```

### 3. Ask for Help
Stuck? Ask senior developer:
- "I'm implementing X feature, should it follow Y pattern?"
- "How should I handle Z case?"
- "Can you review my types before I continue?"

### 4. Use TypeScript
Let TypeScript guide you:
```typescript
const mutation = useCreateComment()

// TypeScript will tell you what mutate() expects
mutation.mutate(???) // Hover to see type
```

### 5. Test Frequently
Don't wait until everything is done. Test after each step:
- Step 1 done → Check types compile
- Step 2 done → Test API in browser console
- Step 3 done → Test hook in feature
- Etc.

---

## 🔄 Iteration Guide

### Version 1: MVP (Minimum Viable Product)
- [ ] Basic CRUD
- [ ] No pagination
- [ ] Simple UI
- [ ] Basic error handling

### Version 2: Enhancement
- [ ] Add pagination
- [ ] Better UI/UX
- [ ] Loading skeletons
- [ ] Better error messages

### Version 3: Optimization
- [ ] Optimistic updates
- [ ] Infinite scroll
- [ ] Real-time updates (if needed)
- [ ] Advanced features

---

## 🔗 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Hiểu kiến trúc tổng quan
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Biết đặt file ở đâu
- [API_INTEGRATION.md](./API_INTEGRATION.md) - Cách tích hợp API
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Coding conventions

---

**"Follow the pattern, deliver value, iterate."**
