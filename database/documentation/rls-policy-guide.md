# RLS and Policy Guide

## Authentication Model
Supabase Auth issues JWTs. Database policies evaluate claims via `auth.uid()` and role resolution from `public.user_profiles`.

## Role Definitions
- Super Administrator
- Administrator
- HR Manager
- HR Officer
- Department Manager
- Supervisor
- Employee
- Guest

## Authorization Functions
- `public.current_user_role()`: resolves effective app role.
- `public.is_hr_privileged()`: true for HR administrative roles.
- `public.is_line_manager(target_employee_id)`: true if current user manages target employee.

## Policy Patterns
- Self access: employee can read own records.
- Manager access: line managers can access direct-report records.
- HR access: privileged roles can perform full CRUD for operational tables.
- Audit logs: read-only for HR privileged roles.

## Operational Notes
- Always test policy behavior with representative JWT identities before production rollout.
- Keep policies in numbered SQL migrations only.
- Avoid bypassing RLS through service-role clients in user-facing code paths.
