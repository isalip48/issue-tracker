# IssueForge

> A high-performance, full-stack issue tracking application built for modern developer teams.

Create, assign, prioritise, and resolve bugs and tasks with a sleek dark UI, rich text descriptions, real-time analytics, project workspaces, and power-user keyboard shortcuts - deployed on a split-hosting architecture for production-grade performance.

![Version](https://img.shields.io/badge/version-1.0.0-6366f1?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3b82f6?style=flat-square)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-20.x-22c55e?style=flat-square)

---

## Live Demo

| Service            | URL                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **Frontend**       | [https://issue-tracker-client-tau.vercel.app](https://issue-tracker-client-tau.vercel.app) |
| **Backend Health** | [https://issueforge.duckdns.org/api/health](https://issueforge.duckdns.org/api/health)     |

> **Test Credentials** - Email: `demo@issueforge.com` · Password: `Demo1234`

---

## Features

### Core Issue Management

- **Full CRUD** - create, view, edit, and delete issues with confirmation prompts
- **Project Workspaces** - organise issues into colour-coded projects
- **Rich Text Descriptions** - TipTap editor with bold, italic, code, lists, blockquotes
- **Activity Log** - complete audit trail of every field change with timestamps
- **Quick Status Updates** - change status directly from the issue list without opening the detail page
- **Assignee & Reporter** - assign issues to team members with role-aware dropdowns

### Dashboard & Analytics

- **Live Statistics** - Open, In Progress, Resolved, and Closed issue counts
- **Bar Chart** - issues broken down by status
- **Donut Chart** - issues broken down by priority
- **7-Day Trend Line** - visualise issue creation velocity over time
- **Recent Issues** - quick access to the latest activity across your workspace

### Authentication & Access Control

- **Secure Registration & Login** - email and password with bcrypt hashing
- **JWT Auth** - short-lived access tokens (15 min) with silent refresh (7 days)
- **Role-Based Access** - Admin, QA, Developer, and Other roles with tailored permissions
- **Deletion Rules** - issues can only be deleted by an Admin, the original Reporter, or the assigned Developer
- **Project Constraints** - projects can only be deleted by an Admin; deletion is blocked if issues are still linked to the project

### Search & Filtering

- **Debounced Full-Text Search** - optimised API calls, no request on every keystroke
- **Filter by Status, Priority, Severity, and Project**
- **Sort** by created date, updated date, priority, or status
- **Pagination** - configurable page size

###  Power User Features

- **Keyboard Shortcuts** - `Ctrl+I` new issue, `Ctrl+K` command palette, `Ctrl+H` shortcuts guide
- **Command Palette** - fuzzy search to jump to any page instantly
- **CSV & JSON Export** - one-click data export from the issue list
- **Dark Mode** - high-contrast dark theme persisted across sessions via Zustand
- **Collapsible Sidebar** - more screen space when you need it

### Infrastructure

- **Dockerised Backend** - runs with a single `docker compose` command
- **Automatic HTTPS** - Caddy reverse proxy with Let's Encrypt (zero config SSL)
- **CI/CD Pipeline** - GitHub Actions runs type checks and deploys on every push to `main`
- **Split Hosting** - Vercel for the frontend CDN, EC2 for the API server

---

## Tech Stack

| Layer          | Technology                                        |
| -------------- | ------------------------------------------------- |
| **Frontend**   | React 18, TypeScript, Vite, Tailwind CSS          |
| **State**      | TanStack Query (server state), Zustand (UI state) |
| **Forms**      | React Hook Form + Zod validation                  |
| **Editor**     | TipTap (headless rich text)                       |
| **Charts**     | Recharts                                          |
| **Backend**    | Node.js, Express.js, TypeScript                   |
| **Database**   | MongoDB, Mongoose ODM                             |
| **Validation** | Zod (both client and server)                      |
| **Auth**       | JWT (access + refresh tokens), bcryptjs           |
| **DevOps**     | Docker, Caddy, GitHub Actions, AWS EC2, Vercel    |

---

## Project Structure

```
issue-tracker/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── api/                   # Axios API service layer
│   │   ├── components/
│   │   │   ├── issues/            # Issue-specific components
│   │   │   ├── layout/            # Sidebar, Navbar, AppLayout
│   │   │   └── shared/            # Reusable UI components
│   │   ├── hooks/                 # React Query data hooks
│   │   ├── pages/                 # Route-level page components
│   │   ├── store/                 # Zustand UI stores
│   │   ├── types/                 # TypeScript interfaces
│   │   └── utils/                 # Helpers, schemas, export utilities
│   ├── .env.example
│   └── Dockerfile
├── server/                        # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # Auth guard, rate limiter
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # Route definitions
│   │   └── utils/                 # JWT helpers, DB connection, validators
│   ├── .env.example
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
├── docker-compose.yml             # Local development
├── docker-compose.prod.yml        # Production (EC2)
├── Caddyfile                      # Reverse proxy + HTTPS config
├── DOCUMENTATION.md               # Architecture, API reference, business rules
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- MongoDB (local via Compass, or MongoDB Atlas)
- Docker Desktop (optional)

### 1. Clone & Install

```bash
git clone https://github.com/isalip48/issue-tracker.git
cd issue-tracker

# Installs dependencies for all workspaces (client + server) in one command
npm install
```

### 2. Configure Environment Variables

**Server** — create `server/.env` from the example:

```bash
cp server/.env.example server/.env
```

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/issue-tracker
JWT_SECRET=          # generate: openssl rand -base64 32
JWT_REFRESH_SECRET=  # generate: openssl rand -base64 32
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Client** — create `client/.env` from the example:

```bash
cp client/.env.example client/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run in Development Mode

```bash
# Starts both frontend (port 5173) and backend (port 5000) using
npm run dev
```

Visit `http://localhost:5173` - you'll be redirected to the login page.

---

## Docker

### Local Development

```bash
docker-compose up --build
```

### Production (EC2)

```bash
docker compose -f docker-compose.prod.yml up -d --build

# Stream logs
docker compose -f docker-compose.prod.yml logs -f

# Tear down
docker compose -f docker-compose.prod.yml down
```

---

## Deployment Architecture

```
Developer pushes to GitHub (main)
          ↓
  GitHub Actions CI
  ├── TypeScript type check (client + server)
  ├── Production build verification
  ├── Docker image build check
  ├── Vercel auto-deploys frontend -> Vercel CDN (global)
  └── SSH → EC2 → git pull → docker compose up -> AWS EC2 t2.micro
```

| Service         | Platform         | Notes                            |
| --------------- | ---------------- | -------------------------------- |
| **Frontend**    | Vercel           | Global CDN, auto-deploys on push |
| **Backend API** | AWS EC2 t2.micro | Docker container, Caddy HTTPS    |
| **Database**    | MongoDB Atlas M0 | Free tier, cloud hosted          |

> **Why split hosting?** Running both frontend builds and the backend on a single t2.micro (1 GB RAM) caused disk space exhaustion during Docker builds. Vercel handles the React frontend with zero server overhead, while EC2 runs the Express API exclusively - a cleaner separation of concerns and a more production-realistic architecture.

---

## Keyboard Shortcuts

| Shortcut   | Action                            |
| ---------- | --------------------------------- |
| `Ctrl + I` | Create new issue                  |
| `Ctrl + K` | Open command palette              |
| `Ctrl + B` | Toggle sidebar                    |
| `Ctrl + H` | Show keyboard shortcuts reference |
| `Ctrl + 1` | Go to Dashboard                   |
| `Ctrl + 2` | Go to All Issues                  |
| `Esc`      | Close any active modal or dialog  |

---

## Further Reading

For detailed architectural decisions, full API reference, data models, business rules, and security considerations, see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.


---

Built by **Isali Perera**
_Associate Frontend Engineer Assessment_
