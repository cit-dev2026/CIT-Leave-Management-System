-- 001_initial_setup.sql
-- Core security model, audit, tenancy metadata, and shared functions

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'app_role'
      and n.nspname = 'public'
  ) then
    create type public.app_role as enum (
      'CompanyOwner',
      'HROfficer'
    );
  end if;
end
$$;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'CompanyOwner',
  employee_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  row_id uuid null,
  actor_id uuid null references auth.users (id),
  old_data jsonb null,
  new_data jsonb null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.user_profiles where user_id = auth.uid()), 'CompanyOwner'::public.app_role);
$$;

create or replace function public.is_hr_privileged()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('CompanyOwner', 'HROfficer');
$$;

create or replace function public.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    table_name,
    action,
    row_id,
    actor_id,
    old_data,
    new_data
  )
  values (
    tg_table_name,
    tg_op,
    case
      when tg_op = 'DELETE' then old.id
      else new.id
    end,
    auth.uid(),
    to_jsonb(old),
    to_jsonb(new)
  );

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

alter table public.user_profiles enable row level security;
alter table public.audit_logs enable row level security;

create policy user_profiles_self_read
  on public.user_profiles
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_hr_privileged());

create policy user_profiles_hr_manage
  on public.user_profiles
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy audit_logs_hr_read
  on public.audit_logs
  for select
  to authenticated
  using (public.is_hr_privileged());
