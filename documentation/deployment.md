# Deployment Guide

## Frontend
1. Configure environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Build with `npm run build`.
3. Deploy static assets from `dist/` to your hosting platform.

## Supabase
1. Create Supabase project for each environment.
2. Apply migrations in order from `database/migrations`.
3. Configure Auth providers and password policies.
4. Create Storage buckets for employee photos and documents.
5. Configure Edge Functions for privileged workflows as modules expand.

## Quality Gates
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Runtime Controls
- Enable structured logging and monitor query performance.
- Review RLS policies before release.
- Enforce backup and restore policies at database level.
