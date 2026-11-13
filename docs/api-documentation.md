# FCIT 2.0 — REST API Documentation

Base URL: `/api`

## Authentication & RBAC
- Cookie based JWT session (`httpOnly`, `sameSite=lax`, `secure` in production).
- Roles: `super_admin`, `admin`, `faculty`, `team_member`, `student`, `visitor`.

### Auth Endpoints
- `POST /api/auth/login` — Authenticate with email and password (rate limited).
- `POST /api/auth/register` — Public student/visitor account registration (locked strictly to `student` or `visitor` role; privileged roles require `super_admin`).
- `POST /api/auth/logout` — Clear session cookie.
- `GET /api/auth/me` — Return currently authenticated user profile.
- `GET /api/auth/users` — List accounts (`super_admin` only).
- `PATCH /api/auth/users/:id/role` — Update role or active status (`super_admin` only).

### Public Read & Participation Endpoints
- `GET /api/health` — Database and service health check.
- `GET /api/faculty` — List published faculty profiles sorted by `displayOrder`.
- `GET /api/team` — List published student team members (supports `?academicYear=`).
- `GET /api/teams` — List published executive cohorts.
- `GET /api/events` — List published events (supports `?status=upcoming|completed&category=`).
- `GET /api/events/:slug` — Single event detail by slug.
- `POST /api/events/:id/register` — Submit student event registration (Zod validated, duplicate protection).
- `GET /api/history` — List published history milestones sorted by `displayOrder`.
- `GET /api/gallery/albums` — List published gallery albums.
- `GET /api/gallery/images` — List published gallery photos (supports `?albumId=&category=&year=`).
- `GET /api/achievements` — List published achievements.
- `GET /api/projects` — List published student projects.
- `GET /api/alumni` — List published alumni profiles.
- `GET /api/resources` — List published learning resources (supports `?category=`).
- `GET /api/announcements` — List active published announcements.
- `POST /api/contact` — Submit inquiry to `contactMessages` (rate limited + Zod validated).

### Admin Management Endpoints (Authenticated + Role Authorized)
- `GET /api/admin/overview` — Live collection counts & recent messages/registrations (`admin`, `super_admin`, `faculty`, `team_member`).
- Resource CRUD, reorder (`PATCH .../reorder`), publish toggle (`PATCH .../publish`), and photo upload/replace/delete (`POST/DELETE .../photo`) for all content collections (`/api/faculty`, `/api/team`, `/api/events`, `/api/history`, `/api/gallery/*`, `/api/achievements`, `/api/projects`, `/api/alumni`, `/api/resources`, `/api/announcements`, `/api/contact`).
