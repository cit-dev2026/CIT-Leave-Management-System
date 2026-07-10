-- 20260709000005_multi_company_support.sql
-- Multi-company support hardening: required companies seed and employee company safety checks.

-- ============================================================================
-- 1) Ensure the required companies exist (idempotent)
-- ============================================================================
insert into public.companies (code, name, is_active)
values
  ('MARAVI', 'Maravi', true),
  ('PORTUGAL_CONSULATE', 'Portugal Consulate', true),
  ('ENTELLECT', 'Entellect', true),
  ('SUN_INTERNATIONAL', 'Sun International', true),
  ('CIT', 'CIT', true),
  ('TCM', 'TCM', true)
on conflict (code)
do update set
  name = excluded.name,
  is_active = excluded.is_active,
  updated_at = now();

-- ============================================================================
-- 2) Keep companies.updated_at synchronized using existing trigger function
-- ============================================================================
drop trigger if exists trg_companies_updated_at on public.companies;

create trigger trg_companies_updated_at
before update on public.companies
for each row
execute function public.set_updated_at();

-- ============================================================================
-- 3) Employee company assignment safety checks (no-op when already configured)
-- ============================================================================
do $$
begin
  -- Add company_id only if missing in older environments.
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'employees'
      and column_name = 'company_id'
  ) then
    alter table public.employees
      add column company_id uuid;
  end if;

  -- Add foreign key only if missing.
  if not exists (
    select 1
    from pg_constraint
    where conname = 'employees_company_id_fkey'
      and conrelid = 'public.employees'::regclass
  ) then
    alter table public.employees
      add constraint employees_company_id_fkey
      foreign key (company_id)
      references public.companies (id);
  end if;

  -- Backfill null company_id values with CIT to keep existing rows valid.
  update public.employees
  set company_id = (
    select id
    from public.companies
    where code = 'CIT'
    limit 1
  )
  where company_id is null;

  -- Enforce assignment once backfill is complete.
  alter table public.employees
    alter column company_id set not null;
end;
$$;

create index if not exists idx_employees_company_id on public.employees (company_id);
