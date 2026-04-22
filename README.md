# IssueForge

A high-performance, full-stack issue tracking application designed for modern developer teams. Create, assign, prioritize, and resolve bugs and tasks with a sleek glassmorphic UI, rich text descriptions, real-time analytics, and power-user keyboard shortcuts.

![Version](https://img.shields.io/badge/version-1.0.0-6366f1?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3b82f6?style=flat-square)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square)

---

## 🔗 Live Demo

- **Frontend**: [https://issue-tracker-client-tau.vercel.app/](https://issue-tracker-client-tau.vercel.app/)
- **Backend API**: [https://issueforge.duckdns.org/api/health](https://issueforge.duckdns.org/api/health)

> **Test Credentials**
> - **Email**: `demo@issueforge.com` (Example)
> - **Password**: `Demo1234`

---

## ✨ Features

### 🛠️ Core Management

- **Full CRUD**: Seamlessly create, view, edit, and delete issues.
- **Project Workspaces**: Organize issues into dedicated projects for better categorization.
- **Rich Text Editor**: Descriptive issue reporting powered by TipTap with full formatting support.
- **Activity Logs**: A complete audit trail for every issue, tracking status changes and updates.

### 📊 Dashboard & Analytics

- **Real-time Stats**: Instant overview of Open, In Progress, Resolved, and Closed issues.
- **Visual Insights**: Interactive Bar, Donut, and Trend charts for workload analysis.
- **Recent Activity**: Quick access to the latest updates across your workspace.

### 🔐 Authentication & RBAC

- **Secure Login**: JWT-based authentication with seamless silent refresh tokens.
- **Role-Based Access**: Specialized roles (**Admin**, **QA**, **Developer**, **Other**) with tailored permissions.
- **Permission Pattern**: Deletion restricted to Admins, the original Reporter, or the Assigned Developer.

### ⌨️ Power User Features

- **Keyboard Shortcuts**: `Ctrl + I` for new issue, `Ctrl + K` for search, `Ctrl + H` for shortcuts.
- **Command Palette**: Fuzzy search navigation to jump between issues and projects.
- **Data Export**: One-click export of issue data to **CSV** or **JSON**.
- **Dark Mode**: High-end, glassmorphic dark theme persisted across sessions.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                                         |
| ------------ | ---------------------------------------------------------------------------------- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, TanStack Query, Zustand, Lucide/Material Icons |
| **Backend**  | Node.js, Express, TypeScript, Mongoose, Zod Validation                             |
| **Database** | MongoDB (Atlas)                                                                    |
| **DevOps**   | Docker, Caddy, GitHub Actions, AWS EC2                                             |

---

## 📂 Project Structure

```bash
issue-tracker/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # API service layer
│   │   ├── components/     # UI Components (shared & domain)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Layout & Page views
│   │   ├── store/          # Global state (Zustand)
│   │   └── types/          # TypeScript definitions
│   └── .env.example        # Frontend example env
├── server/                 # Express + Node.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # Middleware & Utilities
│   └── .env.example        # Backend example env
└── README.md               # You are here
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- MongoDB
- Docker Desktop (optional — for containerized setup)

### Setup & Run

1. **Clone & Install**:

   ```bash
   git clone https://github.com/isalip48/issue-tracker.git
   cd issue-tracker
   npm install
   ```

2. **Environment Configuration**:
   Create `.env` files in both `client/` and `server/` directories using the provided `.env.example` templates.

3. **Development Mode**:
   ```bash
   # Runs both frontend and backend concurrently
   npm run dev
   ```
   Visit `http://localhost:5173`.

---

## 🐳 Docker Setup

For a fully containerized backend environment:

1. **Configure Root Environment**:
   Create a `.env` file in the root directory with necessary database and JWT secrets (refer to `server/.env.example`).

2. **Launch with Docker Compose**:
   ```bash
   # Build and start the backend service
   docker-compose up --build -d
   ```

3. **Check Logs**:
   ```bash
   docker-compose logs -f server
   ```

---

## 📖 Further Documentation

For detailed architectural information, API reference, and security considerations, please see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.

---

Built by **Isali Perera**.
