-- 002_master_data.sql
-- Master data tables for enterprise HRMS

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id),
  code text not null,
  name text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id),
  unique (company_id, code)
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id),
  code text not null,
  name text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id),
  unique (company_id, code)
);

create table if not exists public.business_units (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id),
  code text not null,
  name text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id),
  unique (company_id, code)
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches (id),
  code text not null,
  name text not null,
  address_line_1 text null,
  address_line_2 text null,
  city text null,
  country text null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id),
  unique (branch_id, code)
);

create table if not exists public.job_titles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.job_descriptions (
  id uuid primary key default gen_random_uuid(),
  job_title_id uuid not null references public.job_titles (id),
  summary text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employment_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_statuses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.cost_centres (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id),
  code text not null,
  name text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id),
  unique (company_id, code)
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  rank_order integer not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.pay_scales (
  id uuid primary key default gen_random_uuid(),
  grade_id uuid not null references public.grades (id),
  min_amount numeric(12,2) not null,
  max_amount numeric(12,2) not null,
  currency_code text not null,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  start_time time not null,
  end_time time not null,
  is_night_shift boolean not null default false,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.leave_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  annual_quota numeric(6,2) not null default 0,
  requires_attachment boolean not null default false,
  is_paid boolean not null default true,
  is_active boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.holiday_calendar (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id),
  holiday_date date not null,
  holiday_name text not null,
  is_national boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id),
  unique (company_id, holiday_date)
);

create table if not exists public.nationalities (
  id uuid primary key default gen_random_uuid(),
  iso_code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.document_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  category text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create index if not exists idx_departments_company_id on public.departments (company_id);
create index if not exists idx_branches_company_id on public.branches (company_id);
create index if not exists idx_locations_branch_id on public.locations (branch_id);
create index if not exists idx_business_units_company_id on public.business_units (company_id);

alter table public.companies enable row level security;
alter table public.departments enable row level security;
alter table public.branches enable row level security;
alter table public.business_units enable row level security;
alter table public.locations enable row level security;
alter table public.job_titles enable row level security;
alter table public.job_descriptions enable row level security;
alter table public.employment_types enable row level security;
alter table public.employee_statuses enable row level security;
alter table public.cost_centres enable row level security;
alter table public.grades enable row level security;
alter table public.pay_scales enable row level security;
alter table public.shifts enable row level security;
alter table public.leave_types enable row level security;
alter table public.holiday_calendar enable row level security;
alter table public.nationalities enable row level security;
alter table public.document_types enable row level security;

create policy master_data_authenticated_read
  on public.companies
  for select
  to authenticated
  using (deleted_at is null);

create policy master_data_hr_manage_companies
  on public.companies
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

-- Reusable policy pattern for master data tables managed by HR.
create policy master_data_hr_manage_departments
  on public.departments
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_branches
  on public.branches
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_business_units
  on public.business_units
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_locations
  on public.locations
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_job_titles
  on public.job_titles
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_job_descriptions
  on public.job_descriptions
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_employment_types
  on public.employment_types
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_employee_statuses
  on public.employee_statuses
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_cost_centres
  on public.cost_centres
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_grades
  on public.grades
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_pay_scales
  on public.pay_scales
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_shifts
  on public.shifts
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_leave_types
  on public.leave_types
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_holiday_calendar
  on public.holiday_calendar
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_nationalities
  on public.nationalities
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy master_data_hr_manage_document_types
  on public.document_types
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create trigger trg_companies_updated_at before update on public.companies for each row execute function public.set_updated_at();
create trigger trg_departments_updated_at before update on public.departments for each row execute function public.set_updated_at();
create trigger trg_branches_updated_at before update on public.branches for each row execute function public.set_updated_at();
create trigger trg_business_units_updated_at before update on public.business_units for each row execute function public.set_updated_at();
create trigger trg_locations_updated_at before update on public.locations for each row execute function public.set_updated_at();
create trigger trg_job_titles_updated_at before update on public.job_titles for each row execute function public.set_updated_at();
create trigger trg_job_descriptions_updated_at before update on public.job_descriptions for each row execute function public.set_updated_at();
create trigger trg_employment_types_updated_at before update on public.employment_types for each row execute function public.set_updated_at();
create trigger trg_employee_statuses_updated_at before update on public.employee_statuses for each row execute function public.set_updated_at();
create trigger trg_cost_centres_updated_at before update on public.cost_centres for each row execute function public.set_updated_at();
create trigger trg_grades_updated_at before update on public.grades for each row execute function public.set_updated_at();
create trigger trg_pay_scales_updated_at before update on public.pay_scales for each row execute function public.set_updated_at();
create trigger trg_shifts_updated_at before update on public.shifts for each row execute function public.set_updated_at();
create trigger trg_leave_types_updated_at before update on public.leave_types for each row execute function public.set_updated_at();
create trigger trg_holiday_calendar_updated_at before update on public.holiday_calendar for each row execute function public.set_updated_at();
create trigger trg_nationalities_updated_at before update on public.nationalities for each row execute function public.set_updated_at();
create trigger trg_document_types_updated_at before update on public.document_types for each row execute function public.set_updated_at();

create trigger trg_companies_audit after insert or update or delete on public.companies for each row execute function public.log_audit_event();
create trigger trg_departments_audit after insert or update or delete on public.departments for each row execute function public.log_audit_event();
create trigger trg_branches_audit after insert or update or delete on public.branches for each row execute function public.log_audit_event();
create trigger trg_business_units_audit after insert or update or delete on public.business_units for each row execute function public.log_audit_event();
create trigger trg_locations_audit after insert or update or delete on public.locations for each row execute function public.log_audit_event();
create trigger trg_job_titles_audit after insert or update or delete on public.job_titles for each row execute function public.log_audit_event();
create trigger trg_job_descriptions_audit after insert or update or delete on public.job_descriptions for each row execute function public.log_audit_event();
create trigger trg_employment_types_audit after insert or update or delete on public.employment_types for each row execute function public.log_audit_event();
create trigger trg_employee_statuses_audit after insert or update or delete on public.employee_statuses for each row execute function public.log_audit_event();
create trigger trg_cost_centres_audit after insert or update or delete on public.cost_centres for each row execute function public.log_audit_event();
create trigger trg_grades_audit after insert or update or delete on public.grades for each row execute function public.log_audit_event();
create trigger trg_pay_scales_audit after insert or update or delete on public.pay_scales for each row execute function public.log_audit_event();
create trigger trg_shifts_audit after insert or update or delete on public.shifts for each row execute function public.log_audit_event();
create trigger trg_leave_types_audit after insert or update or delete on public.leave_types for each row execute function public.log_audit_event();
create trigger trg_holiday_calendar_audit after insert or update or delete on public.holiday_calendar for each row execute function public.log_audit_event();
create trigger trg_nationalities_audit after insert or update or delete on public.nationalities for each row execute function public.log_audit_event();
create trigger trg_document_types_audit after insert or update or delete on public.document_types for each row execute function public.log_audit_event();
