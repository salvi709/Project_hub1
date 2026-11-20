# ProjectHub — Phase 1: Foundation & Initial Setup

ProjectHub is a centralized personal workspace designed to manage projects, tasks, deadlines, GitHub repositories, notes, and productivity. Phase 1 establishes the application shell, **Obsidian Green** design system, routing, Supabase client/schema preparation, and Progressive Web App (PWA) configuration.

Repository: `salvi709/project_hub`

---

## Implemented in Phase 1

- **Application Foundation**: React 19, TypeScript, Vite, Tailwind CSS v4, reusable UI primitives (`Button`, `Card`, `Input`, `Dialog`, `Switch`, `Tabs`, `Separator`, `Skeleton`, `EmptyState`), and modular feature architecture.
- **Obsidian Green Design System**: Pure black primary canvas (`#050505`), deep obsidian surfaces (`#0A0B0C`), emerald green accents (`#10B981`), hairline borders (`#1A1D22`), tabular numerals, `Plus Jakarta Sans` + `DM Sans` + `JetBrains Mono` typography, and theme-ready light/dark CSS tokens.
- **Application Shell**: Collapsible desktop sidebar, mobile drawer, ProjectHub logo & branding, 8 navigation routes (`Overview`, `My Projects`, `Tasks`, `Calendar`, `GitHub`, `Notes & Resources`, `Analytics`, `Settings`), user profile menu, global command search (`⌘K` / `Ctrl+K`), interactive notifications popover, and theme toggle.
- **Initial Dashboard UI (Sample Preview Data)**: Welcome header, 4-card KPI strip (`Total Projects`, `Active Projects`, `Completed Tasks`, `Pending Tasks`), Recent Projects, interactive Upcoming Tasks preview checklist, Recent Activity timeline, and interactive Weekly Productivity placeholder chart.
- **Supabase Preparation**: Client initialization (`src/lib/supabase.ts`), safe env validator (`src/lib/env.ts`), `authService` (Email sign-in/sign-up, GitHub OAuth, logout, session persistence), `profileService`, and `ProtectedRoute` architecture.
- **Database Migrations**: SQL schemas and Row Level Security policies in `supabase/migrations/` for `profiles`, `workspaces`, `workspace_members` (future team collaboration ready), `projects`, `tasks`, and `subtasks`, plus an auth signup trigger bootstrapping a personal workspace.
- **PWA Preparation**: `vite-plugin-pwa` manifest, Workbox application-shell precaching, custom PNG icons (`192x192`, `512x512`, `512x512 maskable`, `180x180 apple-touch-icon`), SVG icon, in-app install prompt (`PWAInstallButton`), and offline connectivity indicator.

---

## Incomplete / Deferred Integrations (Not Active in Phase 1)

- **Live Authentication Testing**: Email auth and GitHub OAuth code paths are prepared, but live sign-in cannot be verified until valid `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and GitHub OAuth provider credentials are supplied.
- **Database CRUD Persistence**: Dashboard, Projects, Tasks, Calendar, Notes, and Notifications currently render clearly marked **sample preview data** (`isSamplePreview: true`). Live PostgreSQL reads/writes arrive in Phase 2.
- **GitHub API Sync**: Repository feeds, live issues, and pull requests are deferred to Phase 2.
- **Offline Data Sync**: Phase 1 caches static application shell assets only; offline mutation queuing and synchronization are not implemented.
- **AI Assistant, Full Analytics Backend & Team Collaboration**: Deferred to future phases.

---

## Local Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and populate your Supabase project values:
   ```bash
   cp .env.example .env
   ```
   Required client-side variables:
   ```env
   VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```
   > Never place `SUPABASE_SERVICE_ROLE_KEY` in client-side `VITE_` environment variables.

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app serves on `http://localhost:3000`.

4. **Typecheck & Production Build**:
   ```bash
   npm run lint
   npm run build
   ```

---

## Supabase Configuration Requirements

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Apply the SQL migrations in order via the Supabase SQL Editor or Supabase CLI (`supabase db push`):
   - `supabase/migrations/202611200001_initial_schema.sql`
   - `supabase/migrations/202611200002_rls_policies.sql`
3. In **Authentication -> Providers**:
   - Enable **Email** provider.
   - Enable **GitHub** provider and supply your GitHub OAuth App Client ID & Client Secret.
4. In **Authentication -> URL Configuration**:
   - Set **Site URL** to your application URL (e.g., `http://localhost:3000` for local dev).
   - Add `<YOUR_APP_URL>/auth/callback` to **Redirect URLs**.
5. Copy **Project URL** and **anon public key** from **Project Settings -> API** into `.env`.
