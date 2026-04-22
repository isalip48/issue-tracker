# IssueForge — Technical Documentation

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Models](#data-models)
3. [API Reference](#api-reference)
4. [Business Logic & Authorization](#business-logic--authorization)
5. [Authentication Flow](#authentication-flow)
6. [Security](#security)
7. [State Management](#state-management)
8. [Deployment](#deployment)
9. [Environment Variables](#environment-variables)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Keyboard Shortcuts](#keyboard-shortcuts)

---

## Architecture Overview

IssueForge is built on a full **MERN** stack (MongoDB, Express, React, Node.js) with **TypeScript** across the entire codebase. The frontend and backend are maintained in a **monorepo** using npm workspaces, enabling shared tooling and a single `npm run dev` command to start both.

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Vercel)                      │
│  React 18 + Vite · TanStack Query · Zustand · Tailwind CSS  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS API calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS EC2 t2.micro                         │
│                                                             │
│  ┌──────────┐       ┌─────────────────────────────────┐    │
│  │  Caddy   │──────▶│  Express.js (Docker :5000)       │    │
│  │  :443    │       │  Controllers · Middleware · Zod  │    │
│  └──────────┘       └──────────────┬────────────────────┘  │
│                                    │                         │
└────────────────────────────────────┼─────────────────────────┘
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │   MongoDB Atlas (M0)    │
                        │  Users · Issues         │
                        │  Projects · ActivityLog │
                        └────────────────────────┘
```

### Backend - Express.js

The API is a stateless REST server. All routes (except `/auth/register` and `/auth/login`) require a valid JWT in the `Authorization: Bearer <token>` header.

```
server/src/
├── controllers/      # Business logic — one file per domain
├── middleware/       # auth.ts (JWT guard), rateLimiter.ts, errorHandler
├── models/           # Mongoose schemas with TypeScript interfaces
├── routes/           # Express routers, middleware chain per route
└── utils/            # db.ts, jwt.ts, validators.ts (Zod schemas)
```

### Frontend - React + Vite

The frontend follows a strict separation between server state (TanStack Query) and UI state (Zustand). No component fetches data directly - all data access goes through custom hooks.

```
client/src/
├── api/              # Axios instances — one file per domain
├── components/
│   ├── issues/       # Domain components: IssueCard, TipTapEditor, ActivityLog
│   ├── layout/       # Sidebar, Navbar, AppLayout (Fixed-height shell)
│   └── shared/       # Reusable: FormSelect, AssigneeSelect, StatusBadge, etc.
├── hooks/            # React Query hooks: useIssues, useProjects, useUsers
├── pages/            # Route-level components
├── store/            # Zustand: uiStore (dark mode, sidebar), authStore (tokens)
├── types/            # All TypeScript interfaces and enums
└── utils/            # cn(), formatDate, Zod schemas, exportToCSV/JSON
```

---

## Data Models

### User

| Field          | Type   | Constraints                                                      |
| -------------- | ------ | ---------------------------------------------------------------- |
| `name`         | String | Required, 2–50 chars, trimmed                                    |
| `email`        | String | Required, unique, lowercase                                      |
| `passwordHash` | String | `select: false` — never returned in API responses                |
| `role`         | Enum   | `admin` \| `developer` \| `qa` \| `other` — default: `developer` |
| `createdAt`    | Date   | Auto (timestamps)                                                |
| `updatedAt`    | Date   | Auto (timestamps)                                                |

> Passwords are hashed via a Mongoose `pre-save` hook using **bcrypt with 12 salt rounds** before the document is written to MongoDB.

### Project

| Field         | Type     | Constraints                  |
| ------------- | -------- | ---------------------------- |
| `name`        | String   | Required, unique, 2–50 chars |
| `description` | String   | Optional, max 200 chars      |
| `color`       | String   | Hex color, default `#6366f1` |
| `createdBy`   | ObjectId | Reference → User             |
| `createdAt`   | Date     | Auto                         |
| `updatedAt`   | Date     | Auto                         |

### Issue

| Field         | Type     | Constraints                                                         |
| ------------- | -------- | ------------------------------------------------------------------- |
| `title`       | String   | Required, 3–150 chars                                               |
| `description` | String   | Required, min 10 chars (HTML from TipTap)                           |
| `project`     | ObjectId | Required — reference → Project                                      |
| `status`      | Enum     | `Open` \| `In Progress` \| `Resolved` \| `Closed` — default: `Open` |
| `priority`    | Enum     | `Low` \| `Medium` \| `High` \| `Critical` — default: `Medium`       |
| `severity`    | Enum     | `Minor` \| `Major` \| `Critical` \| `Blocker` — default: `Minor`    |
| `tags`        | String[] | Stored lowercase, trimmed                                           |
| `reporter`    | ObjectId | Reference → User (set to `req.user` on creation)                    |
| `assignee`    | ObjectId | Optional reference → User                                           |
| `resolvedAt`  | Date     | Auto-set by `pre-save` hook when status → Resolved/Closed           |
| `createdAt`   | Date     | Auto                                                                |
| `updatedAt`   | Date     | Auto                                                                |

**Indexes:**

- `{ title: "text", description: "text" }` — enables `$text` full-text search
- `{ status: 1, priority: 1 }` — compound index for common filter queries
- `{ reporter: 1 }`, `{ project: 1 }` — single-field indexes

### ActivityLog

| Field       | Type     | Description                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| `issue`     | ObjectId | Reference → Issue (indexed)                                  |
| `user`      | ObjectId | Reference → User                                             |
| `action`    | String   | Human-readable description e.g. `"Updated status"`           |
| `changes`   | Mixed    | `{ fieldName: { from: T, to: T } }` — diff of changed fields |
| `timestamp` | Date     | Auto (`Date.now`)                                            |

> ActivityLog documents are **immutable** — they are never edited after creation. The `timestamps` option is disabled (`createdAt: false, updatedAt: false`) and `timestamp` is set manually.

---

## API Reference

All protected routes require the header:

```
Authorization: Bearer <accessToken>
```

### Authentication — `/api/auth`

| Method | Endpoint    | Auth | Description                                                          |
| ------ | ----------- | ---- | -------------------------------------------------------------------- |
| POST   | `/register` | ❌   | Create account. Returns user + token pair. Default role: `developer` |
| POST   | `/login`    | ❌   | Authenticate. Returns user + token pair                              |
| POST   | `/refresh`  | ❌   | Exchange refresh token for new access token                          |
| GET    | `/me`       | ✅   | Get the currently authenticated user                                 |

### Issues — `/api/issues`

| Method | Endpoint        | Auth | Description                                             |
| ------ | --------------- | ---- | ------------------------------------------------------- |
| GET    | `/`             | ✅   | Paginated issue list with filters                       |
| POST   | `/`             | ✅   | Create a new issue                                      |
| GET    | `/stats`        | ✅   | Counts by status/priority + 7-day trend                 |
| GET    | `/:id`          | ✅   | Single issue with populated reporter, assignee, project |
| PATCH  | `/:id`          | ✅   | Update any issue fields. Logs changes to ActivityLog    |
| DELETE | `/:id`          | ✅   | Delete issue. Restricted — see Business Rules           |
| GET    | `/:id/activity` | ✅   | Activity log for a specific issue                       |

**Query Parameters — `GET /api/issues`:**

| Parameter  | Type   | Default     | Description                                         |
| ---------- | ------ | ----------- | --------------------------------------------------- |
| `page`     | number | `1`         | Page number                                         |
| `limit`    | number | `10`        | Results per page                                    |
| `search`   | string | —           | Full-text search on title + description             |
| `status`   | string | —           | Filter: `Open`, `In Progress`, `Resolved`, `Closed` |
| `priority` | string | —           | Filter: `Low`, `Medium`, `High`, `Critical`         |
| `severity` | string | —           | Filter: `Minor`, `Major`, `Critical`, `Blocker`     |
| `project`  | string | —           | Filter by project ObjectId                          |
| `sortBy`   | string | `createdAt` | `createdAt`, `updatedAt`, `priority`, `status`      |
| `order`    | string | `desc`      | `asc` or `desc`                                     |

**Pagination Response Shape:**

```json
{
  "success": true,
  "data": { "issues": [] },
  "pagination": {
    "total": 42,
    "page": 2,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

### Projects — `/api/projects`

| Method | Endpoint | Auth       | Description                                |
| ------ | -------- | ---------- | ------------------------------------------ |
| GET    | `/`      | ✅         | All projects, sorted alphabetically        |
| POST   | `/`      | ✅         | Create a project                           |
| PATCH  | `/:id`   | ✅         | Update project name, description, or color |
| DELETE | `/:id`   | ✅ (Admin) | Delete project — blocked if issues exist   |

### Users — `/api/users`

| Method | Endpoint | Auth | Description                                                                          |
| ------ | -------- | ---- | ------------------------------------------------------------------------------------ |
| GET    | `/`      | ✅   | All users — used to populate assignee dropdown. Returns `name`, `email`, `role` only |

---

## Business Logic & Authorization

### Issue Deletion Rules

Issue deletion is restricted to prevent unauthorised removal of work. A `DELETE /api/issues/:id` request is only permitted if the authenticated user is:

- An **Admin**, OR
- The **original Reporter** of the issue, OR
- The **assigned Developer** on that issue

All other authenticated users receive a `403 Forbidden` response.

### Project Deletion Constraints

Projects are the root of the workspace hierarchy. Two constraints apply:

1. Only users with the **Admin** role can call `DELETE /api/projects/:id`
2. If any issues (regardless of status) reference the project, deletion is **blocked** with a `409 Conflict` response — you must reassign or delete the linked issues first

This prevents orphaned issue documents with a dangling `project` reference.

### Mandatory Issue Fields

Every issue created via `POST /api/issues` must include:

| Field         | Minimum                                                 |
| ------------- | ------------------------------------------------------- |
| `title`       | 3 characters                                            |
| `description` | 10 characters (enforced at both Zod and Mongoose level) |
| `project`     | Must reference a valid Project `_id`                    |

Requests missing any of these return a `400 Bad Request` with a Zod field-level error array.

### Auto-Resolved Timestamp

A Mongoose `pre-save` hook automatically sets `resolvedAt` when `status` changes to `Resolved` or `Closed`, and clears it if status reverts to `Open` or `In Progress`. This enables accurate time-to-resolution reporting without manual tracking.

---

## Authentication Flow

### Token Architecture

IssueForge uses a dual-token pattern:

```
Access Token -> short-lived (15 min), sent with every API request
Refresh Token -> long-lived (7 days), used only to obtain new access tokens
```

If an access token expires mid-session, the Axios response interceptor silently calls `/auth/refresh`, updates the stored token, and retries the original request - the user never sees a logout.

### Silent Refresh Sequence

```
Client sends request with expired access token
        ↓
Server returns 401
        ↓
Axios interceptor catches 401
        ↓
POST /api/auth/refresh with refreshToken
        ↓
New accessToken received → stored in localStorage
        ↓
Original request retried with new token
        ↓
Response delivered to component as if nothing happened
```

Concurrent requests during a refresh are queued and replayed once the new token arrives, preventing duplicate refresh calls.

---

## Security

| Measure          | Implementation                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Password hashing | bcrypt, 12 salt rounds via Mongoose `pre-save` hook                                         |
| Token signing    | Separate `JWT_SECRET` and `JWT_REFRESH_SECRET`                                              |
| HTTP headers     | `helmet()` — sets `X-Content-Type-Options`, `X-Frame-Options`, CSP, etc.                    |
| Rate limiting    | Global: 100 req / 15 min. Auth routes: 10 req / 15 min                                      |
| CORS             | Restricted to known origins via `CLIENT_URL` env variable                                   |
| Body size limit  | `express.json({ limit: "10kb" })` — rejects oversized payloads                              |
| Field exposure   | `passwordHash` has `select: false` — excluded from all queries by default                   |
| Error messages   | In production, `500` errors return `"Internal server error"` — no stack traces              |
| Auth ambiguity   | Login returns the same error for wrong email AND wrong password — prevents user enumeration |

---

## State Management

### TanStack Query - Server State

All data fetched from the API lives in the React Query cache. Components never call Axios directly - they use custom hooks that wrap `useQuery` and `useMutation`.

```
useIssues(filters)     → paginated issue list, re-fetches on filter change
useIssue(id)           → single issue, enabled only when id is defined
useIssueStats()        → dashboard stats, 2-min stale time
useCreateIssue()       → POST + invalidates lists + stats on success
useUpdateIssue()       → PATCH + optimistic update on detail cache
useDeleteIssue()       → DELETE + invalidates lists + stats
useProjects()          → project list, 5-min stale time
useUsers()             → user list for assignee dropdown, 5-min stale time
```

**Optimistic Updates** - `useUpdateIssue` immediately applies the change to the detail cache before the server responds. If the server returns an error, the previous snapshot (saved in `onMutate`) is restored.

### Zustand - UI State

```
uiStore    -> isDarkMode, isSidebarOpen
             persisted to localStorage via zustand/middleware/persist

authStore -> user, accessToken, refreshToken, isAuthenticated
             persisted to localStorage
             setAuth() also writes tokens to localStorage for Axios interceptor
             clearAuth() removes tokens and resets all fields
```

---

## Deployment

### Architecture

```
┌─────────────────────────────────────────────────────┐
│  GitHub (main branch push)                          │
│         ↓                                           │
│  GitHub Actions                                     │
│  ├── tsc --noEmit (client)                          │
│  ├── tsc --noEmit (server)                          │
│  ├── vite build (client)                            │
│  ├── docker build (server image check)              │
│  ├── Vercel auto-deploys frontend ──→ Vercel CDN    │
│  └── SSH → EC2 → git pull → docker compose up       │
└─────────────────────────────────────────────────────┘

Vercel CDN (Frontend)
  https://issue-tracker-client-tau.vercel.app
          ↓ /api/* requests
AWS EC2 t2.micro
  Caddy :443 (TLS termination + reverse proxy)
          ↓
  Express :5000 (Docker container)
          ↓
  MongoDB Atlas M0 (cloud database)
```

### Caddy Configuration

```caddyfile
issueforge.duckdns.org {
    handle /api/* {
        reverse_proxy localhost:5000
    }
    handle {
        root * /var/www/issue-tracker
        try_files {path} /index.html
        file_server
    }
}
```

Caddy automatically provisions and renews SSL certificates from Let's Encrypt and redirects all HTTP traffic to HTTPS — no manual certificate management required.

---

## Environment Variables

### Root / Server (`.env`)

In production, the `docker-compose.prod.yml` loads environment variables from the `.env` file located in the project root.

| Variable                 | Required | Description                                         |
| ------------------------ | -------- | --------------------------------------------------- |
| `PORT`                   | ✅       | HTTP port (default: `5000`)                         |
| `MONGODB_URI`            | ✅       | MongoDB connection string                           |
| `JWT_SECRET`             | ✅       | Access token signing secret (min 32 chars)          |
| `JWT_REFRESH_SECRET`     | ✅       | Refresh token signing secret (min 32 chars)         |
| `JWT_EXPIRES_IN`         | ✅       | Access token expiry e.g. `15m`                      |
| `JWT_REFRESH_EXPIRES_IN` | ✅       | Refresh token expiry e.g. `7d`                      |
| `CLIENT_URL`             | ✅       | Allowed CORS origin — your Vercel URL in production |
| `NODE_ENV`               | ❌       | `development` or `production`                       |

### Client (`client/.env`)

| Variable       | Required | Description                                                |
| -------------- | -------- | ---------------------------------------------------------- |
| `VITE_API_URL` | ✅       | Backend base URL e.g. `https://issueforge.duckdns.org/api` |

> Generate secure secrets with `openssl rand -base64 32`

---

## CI/CD Pipeline

Defined in `.github/workflows/ci.yml`:

```
on: push to main or pull_request to main

Jobs (run in parallel):
  server -> npm install -> tsc --noEmit -> npm run build
  client -> npm install -> tsc --noEmit -> npm run build
  docker -> verifies server + client builds
  deploy -> SSH into EC2 -> git reset -> git pull origin main -> docker compose up
```

**GitHub Secrets required:**

| Secret        | Description                          |
| ------------- | ------------------------------------ |
| `EC2_HOST`    | EC2 Elastic IP or DuckDNS hostname   |
| `EC2_SSH_KEY` | Full contents of the `.pem` key file |

---

## Keyboard Shortcuts

| Shortcut   | Action                                         |
| ---------- | ---------------------------------------------- |
| `Ctrl + I` | Open create new issue form                     |
| `Ctrl + K` | Open command palette (fuzzy search navigation) |
| `Ctrl + B` | Toggle sidebar open / collapsed                |
| `Ctrl + H` | Show / hide keyboard shortcuts reference panel |
| `Ctrl + 1` | Navigate to Dashboard                          |
| `Ctrl + 2` | Navigate to All Issues                         |
| `Esc`      | Close any active modal or dialog               |

Shortcuts are registered via a custom `useKeyboardShortcuts` hook that checks `isContentEditable`, `INPUT`, `TEXTAREA`, and `SELECT` targets before firing - so they never interfere with typing in forms or the TipTap editor.

---

\*Built by **Isali Perera\*
