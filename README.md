# TaskFlow — Team Task Management

A frontend-only task management app for a supervisor/employee team, built with React + Vite + Tailwind CSS. All data is mocked and persisted to `localStorage` — there is no backend yet, and the codebase is structured so Supabase can be dropped in later without a UI rewrite.

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

The `vercel.json` file is included so this deploys to Vercel with no extra configuration (`vercel --prod`, or connect the repo in the Vercel dashboard).

## Demo credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Employee | `arjun` | `user123` |
| Employee | `priya` | `user123` |
| Employee | `rohit` | `user123` |
| Employee | `sneha` | `user123` |
| Employee (inactive) | `karan` | `user123` |

These are also shown in-app on the login screen under "Demo credentials."

## Project structure

```
src/
  components/       Reusable UI (badges, modals, cards) and feature components (tasks, users, layout)
  context/          AuthContext, DataContext, ToastContext — app-wide state
  data/             mockData.js — seed users & tasks (only used the first time the app runs)
  layouts/          AdminLayout, UserLayout — sidebar + topbar shells per role
  pages/            admin/* and user/* route pages, plus Login
  routes/           ProtectedRoute — role-based route guarding
  services/         db.js (data access) and authService.js (session/login) — the swap points for Supabase
  utils/            date and task-status/stats helpers
```

## Replacing the mock layer with Supabase later

Everything the UI touches goes through two files:

- `src/services/db.js` — `getUsers`, `addUser`, `updateUser`, `deleteUser`, `getTasks`, `addTask`, `updateTask`, `deleteTask`. Every function already returns a Promise. Swap the bodies for Supabase client calls (`supabase.from('users').select()`, etc.) and nothing else needs to change.
- `src/services/authService.js` — `login`, `logout`, `getSession`. Replace with `supabase.auth.signInWithPassword`, `supabase.auth.signOut`, and `supabase.auth.onAuthStateChange`.

No page or component talks to `localStorage` directly, so this stays a contained change.

## What's implemented

- Login with role-based redirect, protected routes, persisted session
- Admin: dashboard with team stats, user management (add/edit/deactivate/delete), task management (create/edit/delete/reassign/filter), team progress by date range, full task history, settings with a "reset demo data" utility
- Employee: personal dashboard, My Tasks with filters, task detail with mark-complete/not-completed (with notes/reasons), My Progress by date range, personal task history, settings
- Automatic overdue detection based on deadline, dynamically computed stats (nothing hardcoded), all changes persisted to `localStorage`
