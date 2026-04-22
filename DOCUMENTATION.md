# IssueForge Documentation 📚

## 🏗️ Architecture Overview

IssueForge is built on a modern **MERN** stack (MongoDB, Express, React, Node.js) using **TypeScript** across the entire codebase for enhanced reliability and developer experience.

### Backend (Server)
- **Framework**: Express.js with TypeScript.
- **Data Persistence**: MongoDB with Mongoose ODM.
- **Validation**: Strict schema validation using **Zod**.
- **Security**: Stateless JWT authentication with short-lived access tokens and secure refresh token rotation.

### Frontend (Client)
- **Framework**: React 18 with Vite.
- **State Management**:
    - **TanStack Query**: Server state caching, background syncing, and optimistic updates.
    - **Zustand**: Lightweight global state for UI (sidebar, dark mode, keyboard shortcuts).
- **Styling**: Tailwind CSS with a focus on Glassmorphism and modern UI patterns.
- **Editor**: TipTap for headless, rich-text issue descriptions.

---

## 🗄️ Data Models

### User
| Field | Type | Description |
|---|---|---|
| `name` | String | User's full name |
| `email` | String | Unique login identifier |
| `role` | Enum | `Admin`, `QA`, `Developer`, `Other` |

### Project
| Field | Type | Description |
|---|---|---|
| `name` | String | Unique project title |
| `description` | String | Optional context |
| `createdBy` | ObjectId | Reference to the project creator |

### Issue
| Field | Type | Description |
|---|---|---|
| `title` | String | Concise summary |
| `project` | ObjectId | Mandatory link to a Project workspace |
| `status` | Enum | `Open`, `In Progress`, `Resolved`, `Closed` |
| `priority` | Enum | `Low`, `Medium`, `High`, `Critical` |
| `reporter` | ObjectId | Reference to the issue creator |
| `assignee` | ObjectId | Reference to the developer handling the fix |

---

## 🚀 API Reference

### Authentication
- `POST /api/auth/register`: Create a new account (**Default Role: Developer**).
- `POST /api/auth/login`: Authenticate and receive Access/Refresh token pair.
- `POST /api/auth/refresh`: Rotate refresh tokens for seamless sessions.

### Issues
- `GET /api/issues`: List issues with pagination, sorting, and full-text search.
- `GET /api/issues/stats`: Retrieve statistics for dashboard charts.
- `GET /api/issues/:id`: Detailed issue view.
- `DELETE /api/issues/:id`: **Protected**: Allowed only for Admin, Reporter, or Assignee.
- `GET /api/issues/:id/activity`: Full history of changes for an issue.

### Projects
- `GET /api/projects`: List all project workspaces.
- `POST /api/projects`: Register a new project.
- `DELETE /api/projects/:id`: **Protected**: Admin only. Fails if issues are linked.

---

## 🔒 Security & Security Considerations

- **Password Hashing**: Bcrypt with 12 salt rounds.
- **JWT Security**: Access tokens (15m expiry) and Refresh tokens (7d expiry, stored securely).
- **Middleware**:
    - `helmet`: Sets secure HTTP headers.
    - `express-rate-limit`: Prevents brute-force on auth routes and spamming API endpoints.
- **CORS**: Restricted to approved frontend domains (Vercel).

---

## ⏲️ Power User Shortcuts

| Keys | Action |
|---|---|
| `Ctrl + I` | Open New Issue form |
| `Ctrl + K` | Focus Search / Command Palette |
| `Ctrl + B` | Toggle Sidebar |
| `Ctrl + H` | Show/Hide Keyboard Shortcuts guide |
| `Ctrl + 1` | Navigate to Dashboard |
| `Ctrl + 2` | Navigate to All Issues |
| `Esc` | Close any active Modal or Dialog |

---

## 🚢 Deployment & Infrastructure

- **Frontend**: Hosted on **Vercel** with automatic CI/CD.
- **Backend**: Deployed on **AWS EC2** (Ubuntu 22.04).
- **Reverse Proxy**: **Caddy** handles automatic HTTPS (Let's Encrypt) and proxies requests to the Node.js Docker container.
- **Database**: **MongoDB Atlas** (Cluster M0) for cloud-native persistence.

---

Built by **Isali Perera**.
