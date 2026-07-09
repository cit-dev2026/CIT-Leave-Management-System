-- 003_employees.sql
-- Employee core and supporting records

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_number text not null unique,
  company_id uuid not null references public.companies (id),
  department_id uuid null references public.departments (id),
  branch_id uuid null references public.branches (id),
  business_unit_id uuid null references public.business_units (id),
  location_id uuid null references public.locations (id),
  job_title_id uuid null references public.job_titles (id),
  manager_id uuid null references public.employees (id),
  cost_centre_id uuid null references public.cost_centres (id),
  grade_id uuid null references public.grades (id),
  shift_id uuid null references public.shifts (id),
  first_name text not null,
  middle_name text null,
  last_name text not null,
  email text not null unique,
  phone_number text null,
  gender text null,
  date_of_birth date null,
  nationality_id uuid null references public.nationalities (id),
  marital_status text null,
  employment_type text null,
  status text not null default 'Active',
  hire_date date not null,
  probation_end_date date null,
  profile_photo_path text null,
  notes text null,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

alter table public.user_profiles
  add constraint user_profiles_employee_fk
  foreign key (employee_id)
  references public.employees (id)
  on delete set null;

create table if not exists public.employee_contacts (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  contact_type text not null check (contact_type in ('Next of Kin', 'Emergency')),
  full_name text not null,
  relationship text null,
  phone_number text not null,
  email text null,
  address text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_documents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  document_type_id uuid not null references public.document_types (id),
  file_name text not null,
  storage_path text not null,
  issued_on date null,
  expires_on date null,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_qualifications (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  institution_name text not null,
  qualification_name text not null,
  grade text null,
  completed_on date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_skills (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  skill_name text not null,
  proficiency_level text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_training (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  course_name text not null,
  provider_name text null,
  completion_date date null,
  certificate_path text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_licences (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  licence_name text not null,
  licence_number text null,
  issued_on date null,
  expires_on date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_assets (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  asset_name text not null,
  asset_tag text null,
  assigned_on date null,
  returned_on date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_salary (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  pay_scale_id uuid null references public.pay_scales (id),
  base_salary numeric(12,2) not null,
  currency_code text not null,
  effective_from date not null,
  effective_to date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.employee_history (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  event_type text not null,
  event_date date not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  created_by uuid null references auth.users (id)
);

create table if not exists public.employee_notes (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  note text not null,
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create or replace function public.is_line_manager(target_employee_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.employees manager
    join public.user_profiles up on up.employee_id = manager.id
    join public.employees target on target.manager_id = manager.id
    where up.user_id = auth.uid() and target.id = target_employee_id
  );
$$;

create index if not exists idx_employees_company_id on public.employees (company_id);
create index if not exists idx_employees_department_id on public.employees (department_id);
create index if not exists idx_employees_branch_id on public.employees (branch_id);
create index if not exists idx_employees_manager_id on public.employees (manager_id);
create index if not exists idx_employees_status on public.employees (status);
create index if not exists idx_employees_deleted_at on public.employees (deleted_at);

alter table public.employees enable row level security;
alter table public.employee_contacts enable row level security;
alter table public.employee_documents enable row level security;
alter table public.employee_qualifications enable row level security;
alter table public.employee_skills enable row level security;
alter table public.employee_training enable row level security;
alter table public.employee_licences enable row level security;
alter table public.employee_assets enable row level security;
alter table public.employee_salary enable row level security;
alter table public.employee_history enable row level security;
alter table public.employee_notes enable row level security;

create policy employees_self_or_manager_or_hr_read
  on public.employees
  for select
  to authenticated
  using (
    id = (select employee_id from public.user_profiles where user_id = auth.uid())
    or public.is_line_manager(id)
    or public.is_hr_privileged()
  );

create policy employees_hr_manage
  on public.employees
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_read
  on public.employee_contacts
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.employees e
      where e.id = employee_id
        and (
          e.id = (select employee_id from public.user_profiles where user_id = auth.uid())
          or public.is_line_manager(e.id)
          or public.is_hr_privileged()
        )
    )
  );

create policy employee_child_records_hr_manage_contacts
  on public.employee_contacts
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_documents
  on public.employee_documents
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_qualifications
  on public.employee_qualifications
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_skills
  on public.employee_skills
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_training
  on public.employee_training
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_licences
  on public.employee_licences
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_assets
  on public.employee_assets
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_salary
  on public.employee_salary
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_history
  on public.employee_history
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy employee_child_records_hr_manage_notes
  on public.employee_notes
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create trigger trg_employees_updated_at before update on public.employees for each row execute function public.set_updated_at();
create trigger trg_employee_contacts_updated_at before update on public.employee_contacts for each row execute function public.set_updated_at();
create trigger trg_employee_documents_updated_at before update on public.employee_documents for each row execute function public.set_updated_at();
create trigger trg_employee_qualifications_updated_at before update on public.employee_qualifications for each row execute function public.set_updated_at();
create trigger trg_employee_skills_updated_at before update on public.employee_skills for each row execute function public.set_updated_at();
create trigger trg_employee_training_updated_at before update on public.employee_training for each row execute function public.set_updated_at();
create trigger trg_employee_licences_updated_at before update on public.employee_licences for each row execute function public.set_updated_at();
create trigger trg_employee_assets_updated_at before update on public.employee_assets for each row execute function public.set_updated_at();
create trigger trg_employee_salary_updated_at before update on public.employee_salary for each row execute function public.set_updated_at();
create trigger trg_employee_notes_updated_at before update on public.employee_notes for each row execute function public.set_updated_at();

create trigger trg_employees_audit after insert or update or delete on public.employees for each row execute function public.log_audit_event();
create trigger trg_employee_contacts_audit after insert or update or delete on public.employee_contacts for each row execute function public.log_audit_event();
create trigger trg_employee_documents_audit after insert or update or delete on public.employee_documents for each row execute function public.log_audit_event();
create trigger trg_employee_qualifications_audit after insert or update or delete on public.employee_qualifications for each row execute function public.log_audit_event();
create trigger trg_employee_skills_audit after insert or update or delete on public.employee_skills for each row execute function public.log_audit_event();
create trigger trg_employee_training_audit after insert or update or delete on public.employee_training for each row execute function public.log_audit_event();
create trigger trg_employee_licences_audit after insert or update or delete on public.employee_licences for each row execute function public.log_audit_event();
create trigger trg_employee_assets_audit after insert or update or delete on public.employee_assets for each row execute function public.log_audit_event();
create trigger trg_employee_salary_audit after insert or update or delete on public.employee_salary for each row execute function public.log_audit_event();
create trigger trg_employee_history_audit after insert or update or delete on public.employee_history for each row execute function public.log_audit_event();
create trigger trg_employee_notes_audit after insert or update or delete on public.employee_notes for each row execute function public.log_audit_event();
