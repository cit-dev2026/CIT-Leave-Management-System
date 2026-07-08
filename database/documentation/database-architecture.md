# Database Architecture

## Overview
This HRMS data layer is designed for enterprise multi-company usage on Supabase PostgreSQL.

## Design Principles
- UUID primary keys for distributed-safe records.
- Explicit `created_at`, `updated_at`, `created_by`, `updated_by` fields on domain tables.
- Soft delete support via `deleted_at` where retention is required.
- Strict row-level security and role-based access controls.
- Audit trail for all core HR and master-data changes.

## Migration Order
1. `001_initial_setup.sql`: app roles, user profiles, shared functions, audit logging.
2. `002_master_data.sql`: company and core HR master references.
3. `003_employees.sql`: employee profile and related HR subdomains.
4. `004_leave.sql`: leave balances, requests, attachments.
5. `005_attendance.sql`: attendance records and anomaly tracking.

## Security
- RLS is enabled on all public tables.
- Policies derive authorization from `auth.uid()` and `public.user_profiles.role`.
- Privileged updates are restricted to HR roles via `public.is_hr_privileged()`.
- Manager-level visibility is derived via `public.is_line_manager(employee_id)`.

## Audit
- `public.audit_logs` stores table-level mutation snapshots.
- Trigger `public.log_audit_event()` logs INSERT/UPDATE/DELETE changes.

## Indexing
Primary query paths are indexed:
- Employee organization lookups (`company_id`, `department_id`, `manager_id`)
- Leave workflow reporting (`approval_status`, date ranges)
- Attendance analysis (`employee_id`, `attendance_date`, status)
