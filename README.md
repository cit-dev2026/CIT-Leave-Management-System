# CIT Leave Management System (Enterprise HRMS)

Production-grade Human Resources Management System built for multi-company enterprise operations.

## Tech Stack
- React 19
- TypeScript (strict)
- Vite
- React Router
- TanStack React Query
- React Hook Form + Zod
- Tailwind CSS
- Lucide Icons
- Recharts
- Framer Motion
- Supabase (PostgreSQL, Auth, RLS, Storage, Realtime)

## Environment Variables
Create `.env` from `.env.example`:

```env
VITE_SUPABASE_URL=<SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<SUPABASE_PUBLISHABLE_KEY>
```

Credentials are loaded only from environment variables.

## Commands
```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Enterprise Folder Structure
```text
src/
  app/
  components/
  features/
  layouts/
  pages/
  hooks/
  services/
  types/
  schemas/
  contexts/
  providers/
  utils/
  constants/
  config/
  assets/
  lib/

database/
  migrations/
  seed/
  documentation/

documentation/
```

## Database
Migrations are stored in numbered SQL files:
- `001_initial_setup.sql`
- `002_master_data.sql`
- `003_employees.sql`
- `004_leave.sql`
- `005_attendance.sql`

## Current Status
- Module 1 (Foundation) completed.
- Includes enterprise shell, dashboard foundation, employee module foundation, strict tooling, Supabase singleton integration, and initial DB architecture.
