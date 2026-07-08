# HRMS Architecture

## Stack
- React 19 + TypeScript + Vite
- React Router for route composition
- TanStack React Query for server-state orchestration
- React Hook Form + Zod for form modeling and validation
- Tailwind CSS + custom design tokens
- Supabase for PostgreSQL, Auth, RLS, Realtime, Storage

## Frontend Layers
- `app`: app bootstrap and routing.
- `providers`: global providers (query, theme, future auth provider).
- `layouts`: shell composition and cross-page layout concerns.
- `components`: reusable UI and domain widgets.
- `pages`: route-level page composition.
- `hooks`: reusable behavior and data hooks.
- `services`: repository-style data access and server orchestration.
- `schemas`: Zod schemas for runtime validation.
- `types`: domain and database contracts.
- `lib`: external client singletons (Supabase).

## Backend Architecture (Supabase)
- SQL migrations in `database/migrations`.
- RBAC and RLS policy design enforced at database layer.
- Soft deletes and audit logs embedded in schema design.

## Module Delivery Strategy
Each module follows this sequence:
1. Implement feature scope.
2. Refactor for maintainability.
3. Validate `npm run lint`, `npm run typecheck`, `npm run build`.
4. Commit only when module passes quality gates.
