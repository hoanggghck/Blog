# 🎨 Frontend — Blog Platform

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **React Query**, and **Zustand**.

The frontend is designed with a clear separation of concerns, performance-first mindset, and long-term maintainability. Every architectural decision was made intentionally — from folder structure to token management — to reflect production-grade thinking.

---

## 🗂️ Folder Structure

```
FRONTEND/
├── app/                          # Next.js App Router (pages & layouts)
│   ├── (auth)/                   # Route group: login, register, OAuth callback
│   ├── (main)/                   # Route group: public-facing blog pages
│   │   ├── blog/[slug]/          # Dynamic blog post page (SSR for SEO)
│   │   ├── category/[slug]/
│   │   └── tag/[slug]/
│   ├── dashboard/                # Protected route group (CSR)
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── ui/                       # shadcn/ui base components (do not modify)
│   ├── common/                   # Shared components: Navbar, Footer, Avatar...
│   ├── blog/                     # Blog-specific: PostCard, PostDetail, CommentList...
│   └── dashboard/                # Dashboard-specific: editor, stats, upload...
│
├── features/                     # Business logic layer (React Query + API calls)
│   ├── auth/
│   │   ├── useLogin.ts           # useMutation → call API, handle token storage, redirect
│   │   ├── useLogout.ts
│   │   └── useGoogleOAuth.ts
│   ├── posts/
│   │   ├── useGetPosts.ts        # useQuery → fetch paginated posts
│   │   ├── useGetPostBySlug.ts
│   │   ├── useCreatePost.ts      # useMutation → create post, invalidate cache
│   │   ├── useUpdatePost.ts
│   │   ├── useDeletePost.ts
│   │   └── useToggleLike.ts      # Optimistic update → like/unlike
│   ├── comments/
│   │   ├── useGetComments.ts
│   │   └── useAddComment.ts
│   ├── upload/
│   │   └── useUploadImage.ts
│   └── users/
│       └── useGetProfile.ts
│
├── lib/
│   ├── api/
│   │   ├── public.ts             # Axios instance for public endpoints (no auth header)
│   │   └── private.ts            # Axios instance for private endpoints (AT injection + RT refresh)
│   ├── hooks/                    # Custom React hooks (useAuth, usePosts, useLike...)
│   ├── stores/                   # Zustand global state
│   └── utils/                    # Pure utility functions
│
├── types/                        # TypeScript interfaces & types (only types/interfaces exported here)
├── constants/                    # App-wide constants (routes, config keys...)
└── public/                       # Static assets
```

> **Philosophy:** Each folder has a single responsibility. `components/` only knows how to render — it receives props and displays UI. `features/` owns all business logic, API calls, and side effects. `types/` enforces a strict export rule — only `interface` and `type` declarations are allowed, enforced by ESLint.

---

## 🧩 Features Layer — Business Logic Separation

The `features/` folder is the core architectural decision that keeps this codebase maintainable at scale.

### The Rule
| Layer | Responsibility | Can call API? | Can use React Query? |
|-------|---------------|---------------|----------------------|
| `components/` | Render UI only. Receives data via props | ❌ | ❌ |
| `features/` | Handle business logic, data fetching, mutations | ✅ | ✅ |
| `lib/api/` | Raw HTTP layer — Axios instances only | ✅ | ❌ |

### Why This Matters

Without this separation, components become bloated with `useQuery`, `useMutation`, error handling, loading states, and redirect logic all tangled together. A component called `PostCard` should not know anything about how posts are fetched — it should only know how to display one.

With `features/`, the split is clean:

```tsx
// ❌ Before — component handles both render AND business logic
function PostCard() {
  const { data, isLoading } = useQuery(['post'], () => axios.get('/posts'))
  const mutation = useMutation(() => axios.post('/posts/like'))
  // ... 80 more lines of logic mixed with JSX
}

// ✅ After — component is pure render
function PostCard({ post, onLike }: PostCardProps) {
  return <div>...</div>  // just JSX, zero API knowledge
}

// features/posts/useToggleLike.ts handles everything else
function PostDetail() {
  const { post } = useGetPostBySlug(slug)  // from features/
  const { toggleLike } = useToggleLike()   // from features/
  return <PostCard post={post} onLike={toggleLike} />
}
```

### What lives in a `features/` hook

Each hook in `features/` encapsulates:
- The **React Query** call (`useQuery` / `useMutation`)
- The **API function** call via `lib/api/public.ts` or `lib/api/private.ts`
- **Cache invalidation** after mutations (e.g. invalidate posts list after creating a post)
- **Optimistic updates** where appropriate (e.g. like count updates instantly before server confirms)
- **Error handling** and toast notifications
- **Side effects** like redirects after login/logout

```ts
// features/posts/useCreatePost.ts
export function useCreatePost() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: CreatePostDto) => privateApi.post('/posts', payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      router.push(`/blog/${data.slug}`)
      toast.success('Post published!')
    },
    onError: (err) => toast.error(err.message),
  })
}
```

> This means `components/` is fully **testable in isolation** — no mocking of API calls needed. And `features/` hooks are reusable across multiple pages without duplicating logic.

---

## 🔌 API Layer — 2-Tier Design

A deliberate split into **two Axios instances** to isolate authentication concerns:

### `lib/api/public.ts` — For unauthenticated requests
- Sets `baseURL` from environment variable
- No Authorization header
- Used for: fetching blog posts, categories, tags, searching

### `lib/api/private.ts` — For authenticated requests
- Injects `Authorization: Bearer <accessToken>` on every request via request interceptor
- Automatically handles **Access Token expiry**: on 401, triggers a silent refresh using the Refresh Token (stored in HttpOnly cookie)
- If refresh fails (RT expired or revoked), clears auth state and redirects to login
- Used for: creating posts, liking, commenting, profile updates

```
Request → private.ts → inject AT → 401? → call /auth/refresh → retry with new AT → success
                                         → refresh fails → logout → redirect /login
```

> This pattern eliminates the need for the user to manually re-login on AT expiry. The experience is seamless.

---

## 🔐 Authentication Flow

### Google OAuth2
- Initiates redirect to Google from the frontend
- Callback is handled by the backend, which issues AT + RT
- Frontend receives tokens via redirect query params or secure cookie, then stores accordingly

### Token Storage Strategy
| Token | Storage | Reason |
|-------|---------|--------|
| Access Token | Memory (Zustand) | Short-lived; not persisted to prevent XSS theft |
| Refresh Token | HttpOnly Cookie | Not accessible by JS; safe from XSS |

On page reload, the app calls `/auth/refresh` with the RT cookie to silently restore the session — no login screen flash.

---

## ⚡ Performance & UX

### Rendering Strategy
| Page | Strategy | Reason |
|------|----------|--------|
| Blog post detail | **SSR** | SEO — crawlers need full content |
| Category / Tag listing | **SSR** | SEO-indexed pages |
| Dashboard | **CSR** | No need for SSR; avoids unnecessary server load |
| Interactive widgets | **CSR** | Like count, comment form — dynamic per user |

### Lazy Loading & Suspense
- Route-level code splitting is automatic with App Router
- Heavy components (rich text editor, image cropper) are wrapped in `next/dynamic` with `ssr: false`
- `<Suspense>` boundaries with skeleton loaders prevent jarring layout shifts
- Avoids the dreaded "spinner on the tab bar" — users see meaningful content immediately

### Image Optimization
- All blog images go through `next/image` — automatic WebP conversion, responsive `srcset`, lazy loading by default
- Above-the-fold hero images use `priority` prop to prevent LCP regression
- Uploaded images are size-validated on the client before upload to avoid wasted bandwidth

### SEO
- Each blog post page generates dynamic `<title>`, `<meta description>`, and Open Graph tags via Next.js `generateMetadata()`
- Structured data (JSON-LD) for blog posts improves rich snippet eligibility
- Canonical URLs to prevent duplicate content from pagination or tag pages

---

## 🧹 Code Quality

### TypeScript
- Strict mode enabled — no `any` unless absolutely justified with a comment
- All API response shapes are typed; if the backend changes a field, TypeScript catches it at build time
- Easier to onboard new developers — types serve as living documentation

### ESLint
Custom rules enforce architectural conventions:
- `types/` folder: only `interface` and `type` exports allowed
- `components/`: no direct API calls or `useQuery`/`useMutation` — business logic must live in `features/`
- `components/ui/`: no direct modifications (shadcn components stay pristine)
- Import ordering: external → internal → relative (keeps files readable)
- Naming conventions for components (PascalCase), hooks (`use` prefix), utilities (camelCase)

---

## 🌐 Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3088
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

---

## 🚀 Run Locally

```bash
npm install
npm run dev       # Development
npm run build     # Production build
npm run lint      # ESLint check
```
