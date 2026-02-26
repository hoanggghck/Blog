# 📝 Blog Platform — Fullstack

A full-stack blog web application with a clearly separated Frontend and Backend, built for scalability and long-term maintainability.

---

## 🧱 Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | Next.js (App Router)    |
| Backend  | NestJS (REST API)       |
| Database | PostgreSQL              |
| Cache    | Redis                   |

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose

### Run everything (one command)

```bash
docker-compose up --build
```

| Service    | URL                   |
|------------|-----------------------|
| Frontend   | http://localhost:3000 |
| Backend    | http://localhost:3088 |
| PostgreSQL | localhost:5432        |
| Redis      | localhost:6379        |

> Seed data is automatically imported on first startup.

### Sample accounts

| Role    | Email             | Password |
|---------|-------------------|----------|
| Admin   | admin@test.com    | 123456   |
| Blogger | john@test.com     | 123456   |
| Blogger | michael@test.com  | 123456   |
| Blogger | david@test.com    | 123456   |

> 17 additional blogger accounts are available with the format `{name}@test.com` / `123456`: james, robert, william, daniel, joseph, thomas, charles, christopher, andrew, joshua, ryan, nathan, kevin, brian, eric, steven, adam.

### Run individual services

```bash
# Frontend only
docker-compose up --build frontend

# Backend only
docker-compose up --build backend

# Database & Redis only
docker-compose up db redis
```

### Stop & clean up

```bash
# Stop services
docker-compose down

# Stop and remove all data (database, redis volumes)
docker-compose down -v
```

---

## ✅ Features

### 🔐 Authentication & Security
- **Access Token (AT) + Refresh Token (RT)** strategy — AT is short-lived for each request; RT is long-lived, stored in DB, used to silently renew AT without forcing re-login. Supports token revocation on logout.
- **Google OAuth2** login integration
- **Rate limiting** per IP/user to prevent brute force and API abuse

### 📋 CRUD
- Blog posts, Users, Tags, Categories

### 🖼️ Image Upload
- Upload images to the NestJS static folder, served directly as static assets

### 💬 Comments
- Single-level comment system on blog posts

### ❤️ Likes
- Like / unlike blog posts handled via **Redis** for high-performance write operations without hitting the database on every interaction

---

## 🗂️ Project Structure

```
.
├── FRONTEND/           # Next.js App → see FRONTEND/README.md
├── BACKEND/            # NestJS App  → see BACKEND/README.md
└── docker-compose.yml
```

> Detailed documentation for each service is maintained in its own README.

---

## 🎨 Frontend

Built with **Next.js App Router**, **Tailwind CSS**, **shadcn/ui**, **React Query**, and **Zustand**.

Key highlights: AT/RT auto-refresh via Axios interceptor, SSR for SEO-critical pages, CSR for interactive UI.

→ **See [FRONTEND/README.md](./FRONTEND/README.md) for full details.**

---

## ⚙️ Backend

Built on **NestJS** with **TypeORM**, following a clean module-based architecture.

Key highlights: AT/RT auth flow, Redis caching, image upload, OAuth2, request/response logging, and database seeding.

→ **See [BACKEND/README.md](./BACKEND/README.md) for full details.**

---

## 🧹 Code Quality

- Custom **ESLint rules** enforcing naming conventions, import ordering, and per-folder export constraints (e.g. `types/` folder only allows `interface` / `type` exports)
- Consistent codebase structure for easier code review and team onboarding