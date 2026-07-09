-- 006_seed_dev_data.sql
-- Development seed data for testing Phase 1 infrastructure
-- NOTE: This migration bypasses RLS for seed operations ONLY
-- RLS is re-enabled automatically after seeding

-- Temporarily disable RLS on seeded tables
alter table public.companies disable row level security;
alter table public.departments disable row level security;
alter table public.job_titles disable row level security;
alter table public.grades disable row level security;
alter table public.shifts disable row level security;
alter table public.leave_types disable row level security;
alter table public.employment_types disable row level security;
alter table public.employee_statuses disable row level security;
alter table public.nationalities disable row level security;
alter table public.document_types disable row level security;

-- ============================================================================
-- 1. SEED COMPANIES
-- ============================================================================
insert into public.companies (code, name, is_active) values
  ('CIT', 'CIT Global Solutions', true),
  ('CITTECH', 'CIT Technologies Division', true)
on conflict do nothing;

-- ============================================================================
-- 2. SEED DEPARTMENTS
-- ============================================================================
insert into public.departments (company_id, code, name, is_active)
select 
  c.id, 
  depts.code,
  depts.name,
  true
from (
  select 'HR' as code, 'Human Resources' as name
  union all select 'IT', 'Information Technology'
  union all select 'SALES', 'Sales & Marketing'
  union all select 'OPS', 'Operations'
  union all select 'DEV', 'Development'
) depts
cross join public.companies c
where c.code = 'CIT' or (c.code = 'CITTECH' and depts.code = 'DEV')
on conflict do nothing;

-- ============================================================================
-- 3. SEED BRANCHES
-- ============================================================================
insert into public.branches (company_id, code, name, is_active)
select 
  c.id,
  b.code,
  b.name,
  true
from (
  select 'HQ' as code, 'Head Quarter - Singapore' as name
  union all select 'MALH', 'Malaysia - Kuala Lumpur'
  union all select 'BNG', 'Bangalore, India'
) b
cross join public.companies c
where (c.code = 'CIT' and b.code in ('HQ', 'MALH')) or (c.code = 'CITTECH' and b.code = 'BNG')
on conflict do nothing;

-- ============================================================================
-- 4. SEED JOB TITLES
-- ============================================================================
insert into public.job_titles (code, name, is_active) values
  ('CEO', 'Chief Executive Officer', true),
  ('HRHEAD', 'HR Head', true),
  ('HRMGR', 'HR Manager', true),
  ('HROFC', 'HR Officer', true),
  ('ITHEAD', 'IT Director', true),
  ('ITMGR', 'IT Manager', true),
  ('SOFTENG', 'Software Engineer', true),
  ('SALES', 'Sales Executive', true),
  ('ACME', 'Finance Officer', true)
on conflict do nothing;

-- ============================================================================
-- 5. SEED GRADES
-- ============================================================================
insert into public.grades (code, name, rank_order, is_active) values
  ('E1', 'Executive Level', 1, true),
  ('M1', 'Senior Manager', 2, true),
  ('M2', 'Manager', 3, true),
  ('S1', 'Senior Staff', 4, true),
  ('S2', 'Staff', 5, true),
  ('J1', 'Junior Staff', 6, true)
on conflict do nothing;

-- ============================================================================
-- 6. SEED SHIFTS
-- ============================================================================
insert into public.shifts (code, name, start_time, end_time, is_night_shift, is_active) values
  ('STD', 'Standard Shift', '09:00', '18:00', false, true),
  ('EARLY', 'Early Shift', '07:00', '16:00', false, true),
  ('LATE', 'Late Shift', '12:00', '21:00', false, true),
  ('NIGHT', 'Night Shift', '22:00', '06:00', true, true)
on conflict do nothing;

-- ============================================================================
-- 7. SEED LEAVE TYPES
-- ============================================================================
insert into public.leave_types (code, name, default_quota, requires_attachment, is_paid, is_active) values
  ('AL', 'Annual Leave', 20, false, true, true),
  ('SL', 'Sick Leave', 10, true, true, true),
  ('EL', 'Emergency Leave', 3, false, true, true),
  ('UL', 'Unpaid Leave', 5, false, false, true),
  ('ML', 'Maternity Leave', 60, false, true, true)
on conflict do nothing;

-- ============================================================================
-- 8. SEED EMPLOYMENT TYPES
-- ============================================================================
insert into public.employment_types (code, name, is_active) values
  ('FT', 'Full Time', true),
  ('PT', 'Part Time', true),
  ('CTR', 'Contractor', true),
  ('INTERN', 'Intern', true)
on conflict do nothing;

-- ============================================================================
-- 9. SEED EMPLOYEE STATUSES
-- ============================================================================
insert into public.employee_statuses (code, name, is_active) values
  ('ACTIVE', 'Active', true),
  ('INACTIVE', 'Inactive', true),
  ('ONLEAVE', 'On Leave', true),
  ('SUSPENDED', 'Suspended', true)
on conflict do nothing;

-- ============================================================================
-- 10. SEED NATIONALITIES
-- ============================================================================
insert into public.nationalities (iso_code, name, is_active) values
  ('SG', 'Singapore', true),
  ('MY', 'Malaysia', true),
  ('IN', 'India', true),
  ('US', 'United States', true),
  ('GB', 'United Kingdom', true)
on conflict do nothing;

-- ============================================================================
-- 11. SEED DOCUMENT TYPES
-- ============================================================================
insert into public.document_types (code, name, category, is_active) values
  ('PASSPORT', 'Passport', 'Identity', true),
  ('IC', 'National ID', 'Identity', true),
  ('VISA', 'Visa', 'Work Authorization', true),
  ('CERT', 'Professional Certificate', 'Qualification', true)
on conflict do nothing;

-- Re-enable RLS on all tables
alter table public.companies enable row level security;
alter table public.departments enable row level security;
alter table public.job_titles enable row level security;
alter table public.grades enable row level security;
alter table public.shifts enable row level security;
alter table public.leave_types enable row level security;
alter table public.employment_types enable row level security;
alter table public.employee_statuses enable row level security;
alter table public.nationalities enable row level security;
alter table public.document_types enable row level security;

-- ============================================================================
-- Verification queries (safe - no data modifications)
-- ============================================================================

-- Verify seed data loaded
do $$
declare
  company_count int;
  dept_count int;
  jt_count int;
begin
  select count(*) into company_count from public.companies;
  select count(*) into dept_count from public.departments;
  select count(*) into jt_count from public.job_titles;
  
  raise notice 'Seed verification: % companies, % departments, % job titles',
    company_count, dept_count, jt_count;
end $$;
