## Frontend – Blog Web Application

The frontend of the Blog Web Application is built with Next.js (App Router) and designed with a Senior Frontend Developer mindset, focusing on scalability, long-term maintainability, and fast onboarding for new team members.

==================================================

## TECH STACK

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- React Query (server state)
- Zustand (client state)
- Axios

==================================================

## MAIN FEATURES

- Display blog list
- Search blogs by title and category
- Create, update, delete blogs
- User registration and authentication
- Comment and like blogs
- Admin dashboard:
  + User management
  + Blog management
  + Tag management
  + Category management

==================================================

## ARCHITECTURE PRINCIPLES

- app directory is only responsible for routing and layout, call api for SEO
- Components only render UI, no data or business logic
- Business logic lives in features and hooks
- API layer is fully separated from UI

==================================================

## FOLDER STRUCTURE

src/
├── apis/
├── app/
├── assets/
├── components/
├── const/
├── features/
├── hooks/
├── lib/
├── providers/
├── stores/
├── styles/
├── types/
├── utils/
middleware.ts

==================================================

## DETAILED STRUCTURE DESCRIPTION

apis/
Contains root API modules built on top of a core Axios service. APIs are grouped by domain (blog, auth, user, etc.). No business logic is handled here, only API requests and responses.

Example:
export const blogApi = {
  createBlog: async (p: FormData) =>
    apiServicePrivateUploadFile.post('/blog', p),
}

--------------------------------------------------

app/
Uses Next.js App Router. This directory is responsible only for routing, receiving URL params, wrapping layouts and Suspense, and rendering child components. Call API to SEO

--------------------------------------------------

assets/
Stores images, fonts, and static files used across the project.

--------------------------------------------------

components/
Contains pure UI components. Components only render HTML/JSX, receive props and callbacks. No API calls and no business logic.

--------------------------------------------------

services/
Catching data fetching from server prevent recall

--------------------------------------------------

const/
Stores shared enums and constants used across the project such as roles, routes, and status mappings.

--------------------------------------------------

features/
The core business layer of the frontend. Contains components responsible for data fetching, business logic handling, and connecting APIs with UI components.

Each feature represents a domain such as: auth, blog, user, dashboard.

--------------------------------------------------

hooks/
Contains custom hooks used throughout the project. Mainly uses React Query for API calls, caching, retrying, and invalidation. No UI rendering.

--------------------------------------------------

lib/
Contains shared libraries for the entire project.

The API core is divided into:
- base-api.public: for APIs that do not require authentication
- base-api.private: for APIs that require authentication

Handles Axios instances, interceptors, token injection, request/response handling, and shared API logic.

--------------------------------------------------

providers/
Contains application-level providers such as React Query Provider, Theme Provider, and Router Provider.

--------------------------------------------------

stores/
Uses Zustand for managing client-side state such as authentication, user data, and UI state. Server state is not stored here.

--------------------------------------------------

styles/
Contains global CSS, themes, and custom styles.

--------------------------------------------------

types/
Stores shared TypeScript types and interfaces used across the project.

--------------------------------------------------

utils/
Contains shared helper functions and utility methods.

--------------------------------------------------

middleware.ts
Handles authentication for private routes. Validates tokens and redirects users when accessing protected pages such as the dashboard.

==================================================

## ARCHITECTURE GOALS

- Easy to extend new features
- High maintainability
- Easy to test
- Fast onboarding for new developers
- Designed for real-world production projects, not demos

==================================================
