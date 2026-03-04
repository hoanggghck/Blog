# ⚙️ Backend — Blog Platform

Built with **NestJS**, **TypeORM**, **PostgreSQL**, **Redis**, and **JWT**.

The backend is architected around NestJS's module system, with a strong emphasis on separation of concerns, predictable response contracts, observability, and security. Every layer has a deliberate purpose.

---

## 🗂️ Folder Structure

```
BACKEND/
├── src/
│   ├── modules/                  # Feature modules (one per domain)
│   │   ├── auth/                 # AuthModule: login, register, OAuth, token refresh
│   │   ├── users/                # UsersModule: profile CRUD, role management
│   │   ├── posts/                # PostsModule: blog post CRUD, pagination, filtering
│   │   ├── comments/             # CommentsModule: single-level comment system
│   │   ├── likes/                # LikesModule: Redis-backed like/unlike
│   │   ├── tags/                 # TagsModule
│   │   ├── categories/           # CategoriesModule
│   │   └── upload/               # UploadModule: image handling, static serving
│   │
│   ├── common/
│   │   ├── decorators/           # Custom decorators: @CurrentUser, @Public, @Roles
│   │   ├── filters/              # Global exception filter (maps exceptions → standard response)
│   │   ├── guards/               # JwtAuthGuard, RolesGuard, RefreshTokenGuard
│   │   ├── interceptors/         # LoggingInterceptor, TransformInterceptor
│   │   ├── pipes/                # Validation pipes
│   │   └── response/             # Shared response helpers (see Response Convention below)
│   │
│   ├── config/                   # Configuration modules (database, redis, jwt, throttle)
│   ├── database/
│   │   ├── entities/             # TypeORM entities
│   │   ├── migrations/           # Database migrations
│   │   └── seeders/              # Seed data (users, posts, categories, tags)
│   └── main.ts
```

> **Philosophy:** Domain logic never leaks across modules. Each module owns its own entities, services, and controllers. Cross-module communication is done via injected services — not direct database queries from foreign modules.

---

## 📐 Response Convention

All API responses follow a consistent envelope structure. Standardized via shared helper functions — controllers never construct raw response objects:

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Post created successfully"
}
```

### Paginated
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 87,
    "totalPages": 9
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Access token expired"
  }
}
```

These shapes are enforced through a **GlobalExceptionFilter** and a **TransformInterceptor**, so even unhandled errors return the same structure — the frontend always knows what to expect.

---

## 🔐 Authentication — AT + RT Strategy

### Access Token (AT)
- Short-lived (15 minutes)
- Sent as `Authorization: Bearer <token>` header
- Validated by `JwtAuthGuard` on every protected route
- Never stored in the database

### Refresh Token (RT)
- Long-lived (7 days)
- Stored **hashed** in the database (user record)
- Sent via **HttpOnly cookie** — inaccessible to JavaScript
- `POST /auth/refresh` validates the RT, issues a new AT + RT pair (rotation)
- On logout, the RT is **revoked** (deleted from DB) — prevents reuse

### Google OAuth2
- Passport.js `GoogleStrategy` handles the OAuth handshake
- On success, user is upserted (created if new, fetched if existing)
- AT + RT are issued the same way as password login — consistent token contract

---

## ⚡ Redis — Likes & High-Frequency Writes

Likes are a write-heavy, latency-sensitive operation. Hitting PostgreSQL on every like/unlike would not scale. Redis solves this:

```
User clicks ❤️
    → SADD post:{postId}:likes {userId}   (or SREM for unlike)
    → Return live count from SCARD

Background job (cron / queue)
    → Flush Redis counts → persist to PostgreSQL
```

**Benefits:**
- Like/unlike responds in sub-millisecond
- PostgreSQL write load reduced dramatically
- Redis acts as the source of truth for real-time counts; PostgreSQL for durable storage

---

## 🪵 Logger

Uses NestJS's built-in logger, extended with a custom **LoggingInterceptor** that logs:
- Incoming request: method, URL, IP, user ID (if authenticated)
- Outgoing response: status code, duration (ms)
- All errors: stack trace in development, sanitized message in production

Log format is structured (JSON in production) for easy ingestion into log aggregation tools (Datadog, CloudWatch, etc.).

```
[2024-01-15 10:23:45] INFO  GET /api/posts 200 43ms
[2024-01-15 10:23:46] INFO  POST /api/posts 201 87ms | userId: 42
[2024-01-15 10:23:47] ERROR POST /api/auth/login 401 12ms — Invalid credentials
```

---

## 🛡️ Rate Limiting

Powered by `@nestjs/throttler`. Guards against brute force attacks and API abuse:

| Endpoint group | Limit |
|---------------|-------|
| Auth endpoints (`/auth/login`, `/auth/register`) | 5 requests / minute / IP |
| General API | 100 requests / minute / IP |
| Upload endpoints | 10 requests / minute / user |

Responses include standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`.

---

## 🌱 Database Seeder

Running `docker-compose up` seeds the database automatically on first startup.

Seed data includes:
- 1 Admin account
- 20 Blogger accounts
- Sample categories & tags
- 50+ blog posts with realistic content
- Sample comments and likes

Seeders are idempotent — safe to run multiple times without duplicating data.

```bash
# Run seeder manually
npm run seed
```

---

## 🗄️ TypeORM

- Entities are the single source of truth for the database schema
- Migrations are used instead of `synchronize: true` in production — prevents accidental data loss
- Repository pattern: services inject TypeORM repositories, never query the DB directly from controllers

---

## 🔧 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog
DB_USER=postgres
DB_PASSWORD=secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=...
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES=7d

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3088/auth/google/callback

# App
PORT=3088
NODE_ENV=development
```

---

## 🚀 Run Locally

```bash
npm install
npm run start:dev     # Development (watch mode)
npm run build         # Production build
npm run start:prod    # Production
npm run migration:run # Run pending migrations
npm run seed          # Seed the database
```

---

## 📊 API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new account |
| POST | `/auth/login` | ❌ | Login with email/password |
| GET | `/auth/google` | ❌ | Initiate Google OAuth |
| POST | `/auth/refresh` | RT Cookie | Refresh access token |
| POST | `/auth/logout` | ✅ | Revoke refresh token |
| GET | `/posts` | ❌ | List posts (paginated, filterable) |
| GET | `/posts/:slug` | ❌ | Get post by slug |
| POST | `/posts` | ✅ | Create post |
| PUT | `/posts/:id` | ✅ | Update post |
| DELETE | `/posts/:id` | ✅ | Delete post |
| POST | `/posts/:id/like` | ✅ | Toggle like (Redis) |
| GET | `/comments?postId=` | ❌ | List comments for a post |
| POST | `/comments` | ✅ | Add comment |
| DELETE | `/comments/:id` | ✅ | Delete comment |
| POST | `/upload/image` | ✅ | Upload image |
| GET | `/categories` | ❌ | List categories |
| GET | `/tags` | ❌ | List tags |
