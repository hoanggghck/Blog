# 🏗️ ARCHITECTURE - Kiến trúc & Design Philosophy

## 📌 Table of Contents
- [Design Philosophy](#design-philosophy)
- [Architectural Principles](#architectural-principles)
- [Layer Architecture](#layer-architecture)
- [Data Flow](#data-flow)
- [State Management Strategy](#state-management-strategy)
- [Why This Architecture?](#why-this-architecture)
- [Trade-offs](#trade-offs)

---

## 🎯 Design Philosophy

### Core Beliefs

```
1. "Separation of Concerns > Code Cleverness"
2. "Explicit > Implicit"
3. "Maintainability > Flexibility"
4. "Team Onboarding Speed > Individual Productivity"
```

### Guiding Principles

#### 1. **Single Responsibility**
Mỗi module, mỗi file chỉ làm một việc duy nhất:
- Component chỉ render UI
- Hook chỉ quản lý logic
- API module chỉ call API
- Feature chỉ orchestrate business logic

#### 2. **Predictable Structure**
Developer mới join team có thể đoán được:
- File X nằm ở đâu
- Logic Y được xử lý ở đâu
- Component Z được dùng như thế nào

#### 3. **Zero Magic**
Không có:
- Hidden global state
- Auto-import không rõ ràng
- HOC phức tạp
- Render props lồng nhau
- Magic strings

#### 4. **Testable By Default**
Mỗi layer được thiết kế để test dễ dàng:
- Pure functions dễ unit test
- Components nhận props, dễ snapshot test
- Features có thể mock dependencies

---

## 🧱 Architectural Principles

### 1. **Unidirectional Data Flow**

```
User Action
    ↓
Feature Container (orchestrator)
    ↓
Hook (React Query) → API Module → Backend
    ↓
Component (render)
    ↓
UI Update
```

### 2. **Layered Architecture**

```
┌─────────────────────────────────────┐
│   APP LAYER (Routing & Layout)      │
│   - Next.js App Router               │
│   - Page components                  │
│   - Layouts                          │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│   FEATURE LAYER (Business Logic)    │
│   - Orchestrate data fetching        │
│   - Handle user interactions         │
│   - Connect hooks + components       │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│   COMPONENT LAYER (Pure UI)         │
│   - Receive props                    │
│   - Render JSX                       │
│   - Emit events (callbacks)          │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│   HOOK LAYER (Data Management)      │
│   - React Query hooks                │
│   - Custom hooks                     │
│   - State management                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│   API LAYER (Data Fetching)         │
│   - Axios instances                  │
│   - API modules                      │
│   - Request/Response handling        │
└─────────────────────────────────────┘
```

### 3. **Dependency Rule**

**Outer layers CAN depend on inner layers**
**Inner layers CANNOT depend on outer layers**

```
✅ ALLOWED:
App → Feature → Component → Hook → API
Feature → Component
Hook → API

❌ FORBIDDEN:
API → Hook
Component → Feature
Hook → App
```

---

## 🔄 Layer Architecture

### Layer 1: APP (Routing & Layout)

**Responsibility:** Routing, layout composition, SEO

```typescript
// ✅ GOOD - app/blog/[id]/page.tsx
export default async function BlogDetailPage({ params }: Props) {
  // Chỉ fetch data cho SEO
  const blog = await getBlogById(params.id)
  
  return (
    <BlogLayout>
      <BlogDetailFeature blogId={params.id} initialData={blog} />
    </BlogLayout>
  )
}
```

```typescript
// ❌ BAD - Không xử lý business logic ở đây
export default function BlogDetailPage({ params }: Props) {
  const [likes, setLikes] = useState(0)
  const handleLike = async () => { /* ... */ } // ❌ Logic nằm sai chỗ
  
  return <div>...</div>
}
```

**Rules:**
- ✅ Next.js App Router pages
- ✅ Layouts và nested layouts
- ✅ SEO metadata
- ✅ Server-side data fetching (chỉ cho SEO)
- ❌ Business logic
- ❌ State management
- ❌ API calls (trừ SSR cho SEO)

---

### Layer 2: FEATURES (Business Logic Orchestration)

**Responsibility:** Kết nối hooks + components, xử lý user interactions

```typescript
// ✅ GOOD - features/blog/blog-detail.tsx
export function BlogDetailFeature({ blogId }: Props) {
  // Fetch data
  const { data: blog, isLoading } = useBlog(blogId)
  const { data: comments } = useComments(blogId)
  
  // Mutations
  const likeMutation = useLikeBlog()
  const commentMutation = useCreateComment()
  
  // Handlers
  const handleLike = () => likeMutation.mutate(blogId)
  const handleComment = (text: string) => {
    commentMutation.mutate({ blogId, text })
  }
  
  // Render UI
  if (isLoading) return <BlogSkeleton />
  
  return (
    <div>
      <BlogCard blog={blog} onLike={handleLike} />
      <CommentSection 
        comments={comments} 
        onSubmit={handleComment} 
      />
    </div>
  )
}
```

**Rules:**
- ✅ Import và sử dụng custom hooks
- ✅ Xử lý user interactions (handlers)
- ✅ Điều phối data flow
- ✅ Loading/Error states
- ✅ Conditional rendering logic
- ❌ Không có JSX phức tạp (delegate cho components)
- ❌ Không call API trực tiếp (dùng hooks)

---

### Layer 3: COMPONENTS (Pure UI)

**Responsibility:** Render UI, nhận props, emit events

```typescript
// ✅ GOOD - components/blog-card.tsx
interface BlogCardProps {
  blog: Blog
  onLike: () => void
  onShare: () => void
}

export function BlogCard({ blog, onLike, onShare }: BlogCardProps) {
  return (
    <div className="card">
      <img src={blog.image} alt={blog.title} />
      <h2>{blog.title}</h2>
      <p>{blog.excerpt}</p>
      
      <div className="actions">
        <button onClick={onLike}>
          <Heart /> {blog.likesCount}
        </button>
        <button onClick={onShare}>
          <Share />
        </button>
      </div>
    </div>
  )
}
```

```typescript
// ❌ BAD - Component không nên fetch data
export function BlogCard({ blogId }: Props) {
  const { data } = useBlog(blogId) // ❌ Fetching nằm sai chỗ
  const handleLike = async () => {
    await blogApi.like(blogId) // ❌ API call nằm sai chỗ
  }
  return <div>...</div>
}
```

**Rules:**
- ✅ Pure presentation
- ✅ Nhận data qua props
- ✅ Emit events qua callbacks (onXxx)
- ✅ Local UI state (open/close, hover...)
- ❌ Không fetch data
- ❌ Không gọi API
- ❌ Không xử lý business logic

---

### Layer 4: HOOKS (Data Management)

**Responsibility:** Fetch data, cache, mutations, client state

```typescript
// ✅ GOOD - hooks/use-blog.ts
export function useBlog(id: string) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getById(id),
    staleTime: 5 * 60 * 1000, // 5 phút
  })
}

export function useLikeBlog() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (blogId: string) => blogApi.like(blogId),
    onSuccess: (_, blogId) => {
      // Invalidate cache
      queryClient.invalidateQueries(['blog', blogId])
      queryClient.invalidateQueries(['blogs'])
    },
  })
}
```

**Rules:**
- ✅ React Query hooks (useQuery, useMutation)
- ✅ Custom hooks cho logic tái sử dụng
- ✅ Zustand hooks cho client state
- ✅ Cache management
- ❌ Không render UI
- ❌ Không xử lý routing

---

### Layer 5: API (Data Fetching)

**Responsibility:** HTTP requests, response handling

```typescript
// ✅ GOOD - apis/blog.api.ts
export const blogApi = {
  getAll: (params: BlogQuery) => 
    apiService.get<Blog[]>('/blogs', { params }),
    
  getById: (id: string) => 
    apiService.get<Blog>(`/blogs/${id}`),
    
  create: (data: FormData) => 
    apiServiceUpload.post<Blog>('/blogs', data),
    
  update: (id: string, data: UpdateBlogDto) => 
    apiService.put<Blog>(`/blogs/${id}`, data),
    
  delete: (id: string) => 
    apiService.delete(`/blogs/${id}`),
    
  like: (id: string) => 
    apiService.post(`/blogs/${id}/like`),
}
```

**Rules:**
- ✅ Pure API calls
- ✅ Type-safe request/response
- ✅ Organized by domain (blog, auth, user...)
- ❌ Không xử lý UI
- ❌ Không xử lý caching (để React Query lo)
- ❌ Không xử lý business logic

---

## 🔄 Data Flow

### Read Flow (GET)

```
User visits page
    ↓
App Router renders Feature
    ↓
Feature calls hook: useBlog(id)
    ↓
Hook (React Query) checks cache
    ├─ Cache hit → Return data
    └─ Cache miss → Call API
        ↓
    API module: blogApi.getById(id)
        ↓
    Axios → Backend
        ↓
    Response → Hook → Feature
        ↓
    Feature passes data to Component
        ↓
    Component renders UI
```

### Write Flow (POST/PUT/DELETE)

```
User clicks button
    ↓
Component emits event: onClick={onLike}
    ↓
Feature handles event: handleLike()
    ↓
Feature calls mutation: likeMutation.mutate(id)
    ↓
Hook (useMutation) calls API
    ↓
API module: blogApi.like(id)
    ↓
Axios → Backend
    ↓
Success response
    ↓
Hook invalidates cache (queryClient.invalidate)
    ↓
React Query auto refetch
    ↓
UI auto updates
```

---

## 🗄️ State Management Strategy

### Server State (React Query)

**Use for:** Data từ backend

```typescript
// Server state: Blogs, Users, Comments
const { data: blogs } = useBlogs()
```

**Why React Query?**
- ✅ Auto caching
- ✅ Auto refetch on window focus
- ✅ Stale-while-revalidate
- ✅ Optimistic updates
- ✅ Retry on failure
- ✅ Pagination & infinite scroll

### Client State (Zustand)

**Use for:** UI state, auth state

```typescript
// Client state: Theme, sidebar open/close, current user
const { user, setUser } = useAuthStore()
const { theme, toggleTheme } = useThemeStore()
```

**Why Zustand?**
- ✅ Simple API
- ✅ No boilerplate
- ✅ TypeScript-friendly
- ✅ No Provider hell
- ✅ DevTools support

### Decision Tree

```
Câu hỏi: State này cần lưu ở đâu?

Data từ API? 
    → YES → React Query
    → NO → Continue

Data này shared giữa nhiều components không liên quan?
    → YES → Zustand
    → NO → Continue

Data này chỉ dùng trong 1 component/feature?
    → YES → useState / useReducer
```

---

## ✅ Why This Architecture?

### 1. **Easy to Scale**
```
Thêm feature mới:
1. Tạo types
2. Tạo API module
3. Tạo hooks
4. Tạo components
5. Tạo feature container
6. Thêm route

→ Không ảnh hưởng code cũ
```

### 2. **Easy to Test**
```
- Components: Pure → Snapshot test
- Hooks: Mock API → Unit test
- API: Mock Axios → Integration test
- Features: Mock hooks → Integration test
```

### 3. **Easy to Onboard**
```
Junior dev join team:
- Đọc FOLDER_STRUCTURE.md → Hiểu cấu trúc
- Đọc 1 feature → Hiểu pattern
- Copy pattern → Tạo feature mới
→ Productive trong 2-3 ngày
```

### 4. **Easy to Refactor**
```
Cần đổi UI?
→ Chỉ sửa Components

Cần đổi API endpoint?
→ Chỉ sửa API module

Cần đổi caching strategy?
→ Chỉ sửa Hooks

→ Thay đổi isolated, không ảnh hưởng layers khác
```

---

## ⚖️ Trade-offs

### ✅ Pros

1. **Predictable & Consistent**
   - Mọi feature follow cùng 1 pattern
   - Không có "surprise" khi đọc code

2. **Type-Safe**
   - TypeScript ở mọi layer
   - Compile-time error detection

3. **Performance**
   - React Query caching
   - Code splitting tự động (Next.js)
   - Lazy loading components

4. **Developer Experience**
   - Fast feedback loop
   - Hot reload
   - TypeScript IntelliSense

### ❌ Cons

1. **More Files**
   - 1 feature = nhiều files (types, api, hooks, components, feature)
   - Trade-off: Dễ maintain hơn là ít files

2. **Learning Curve**
   - Junior dev cần học convention
   - Trade-off: Onboard 1 lần, productive mãi mãi

3. **Boilerplate**
   - Setup types, api, hooks cho mỗi feature
   - Trade-off: Explicit > Magic, dễ debug

---

## 🎓 Learning Path

### For New Developers

**Week 1: Understand Structure**
- Đọc tất cả docs
- Chạy project
- Explore code

**Week 2: Read Code**
- Đọc 1 feature hoàn chỉnh (Blog)
- Hiểu data flow
- Hiểu layer separation

**Week 3: Small Task**
- Fix bug nhỏ
- Thêm field mới vào form
- Styling component

**Week 4: New Feature**
- Implement 1 feature nhỏ (e.g., Comment)
- Follow pattern có sẵn
- Code review

---

## 🔗 Related Documents

- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Chi tiết từng folder
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Coding conventions
- [FEATURE_DEVELOPMENT.md](./FEATURE_DEVELOPMENT.md) - Step-by-step guide

---

**"Good architecture makes the system easy to understand, develop, maintain, and deploy."**
— Robert C. Martin (Uncle Bob)
