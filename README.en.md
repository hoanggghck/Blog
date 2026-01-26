Blog Web Application (Fullstack)

The Blog Web Application is built using a Fullstack architecture with a clear separation between Frontend and Backend, aiming for scalability, long-term maintainability, and team growth.

==================================================

OVERALL ARCHITECTURE

- Frontend (FE): Next.js (App Router)
- Backend (BE): NestJS (REST API)
- Database: PostgreSQL
- Cache / Session: Redis

==================================================

FRONTEND (FE)

The frontend is built to serve a full-featured Blog Web Application, including user-facing features and an admin dashboard.

Tech Stack:
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- lucide-react
- React Query
- Zustand

Main Features:
- Display blog list
- Search blogs by:
  - Title
  - Category
- Blog CRUD operations
- User registration and authentication
- Commenting and liking blogs
- Admin dashboard:
  - User management
  - Blog management
  - Tag management
  - Category management

==================================================

BACKEND (BE)

The backend is built with NestJS following a modular architecture, focusing on clean architecture principles and clear separation of business logic.

Tech Stack:
- NestJS
- TypeORM
- PostgreSQL
- Redis
- Logger
- Seeder

Responsibilities:
- REST APIs for all blog-related features
- Authentication and authorization
- Request / response logging
- Initial data seeding
- Cache and session handling using Redis

==================================================

PROJECT STRUCTURE

.
├── frontend/
├── backend/
└── README.md

==================================================

PROJECT GOALS

- Clear separation between frontend and backend
- Easy to scale and extend
- Maintainable long-term architecture
- Suitable for real-world production systems, not demos
- Designed for team collaboration and growth

==================================================
