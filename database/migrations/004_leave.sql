-- 004_leave.sql
-- Leave management domain

create table if not exists public.leave_balances (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  leave_type_id uuid not null references public.leave_types (id),
  balance_year integer not null,
  opening_balance numeric(6,2) not null default 0,
  accrued numeric(6,2) not null default 0,
  used numeric(6,2) not null default 0,
  carried_forward numeric(6,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id),
  unique (employee_id, leave_type_id, balance_year)
);

create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  leave_type_id uuid not null references public.leave_types (id),
  start_date date not null,
  end_date date not null,
  days_requested numeric(6,2) not null,
  reason text null,
  approval_status text not null default 'Pending' check (approval_status in ('Pending', 'Approved', 'Rejected', 'Cancelled')),
  approved_by uuid null references auth.users (id),
  approved_at timestamptz null,
  rejected_reason text null,
  cancelled_at timestamptz null,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id)
);

create table if not exists public.leave_attachments (
  id uuid primary key default gen_random_uuid(),
  leave_request_id uuid not null references public.leave_requests (id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  created_at timestamptz not null default now(),
  created_by uuid null references auth.users (id)
);

create index if not exists idx_leave_requests_employee_id on public.leave_requests (employee_id);
create index if not exists idx_leave_requests_status on public.leave_requests (approval_status);
create index if not exists idx_leave_requests_dates on public.leave_requests (start_date, end_date);

alter table public.leave_balances enable row level security;
alter table public.leave_requests enable row level security;
alter table public.leave_attachments enable row level security;

create policy leave_balances_self_or_manager_or_hr_read
  on public.leave_balances
  for select
  to authenticated
  using (
    employee_id = (select employee_id from public.user_profiles where user_id = auth.uid())
    or public.is_line_manager(employee_id)
    or public.is_hr_privileged()
  );

create policy leave_balances_hr_manage
  on public.leave_balances
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy leave_requests_self_or_manager_or_hr_read
  on public.leave_requests
  for select
  to authenticated
  using (
    employee_id = (select employee_id from public.user_profiles where user_id = auth.uid())
    or public.is_line_manager(employee_id)
    or public.is_hr_privileged()
  );

create policy leave_requests_self_create
  on public.leave_requests
  for insert
  to authenticated
  with check (
    employee_id = (select employee_id from public.user_profiles where user_id = auth.uid())
    or public.is_hr_privileged()
  );

create policy leave_requests_manager_or_hr_update
  on public.leave_requests
  for update
  to authenticated
  using (public.is_line_manager(employee_id) or public.is_hr_privileged())
  with check (public.is_line_manager(employee_id) or public.is_hr_privileged());

create policy leave_requests_hr_delete
  on public.leave_requests
  for delete
  to authenticated
  using (public.is_hr_privileged());

create policy leave_attachments_self_or_manager_or_hr_read
  on public.leave_attachments
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.leave_requests lr
      where lr.id = leave_request_id
        and (
          lr.employee_id = (select employee_id from public.user_profiles where user_id = auth.uid())
          or public.is_line_manager(lr.employee_id)
          or public.is_hr_privileged()
        )
    )
  );

create policy leave_attachments_self_or_hr_create
  on public.leave_attachments
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.leave_requests lr
      where lr.id = leave_request_id
        and (
          lr.employee_id = (select employee_id from public.user_profiles where user_id = auth.uid())
          or public.is_hr_privileged()
        )
    )
  );

create trigger trg_leave_balances_updated_at before update on public.leave_balances for each row execute function public.set_updated_at();
create trigger trg_leave_requests_updated_at before update on public.leave_requests for each row execute function public.set_updated_at();

create trigger trg_leave_balances_audit after insert or update or delete on public.leave_balances for each row execute function public.log_audit_event();
create trigger trg_leave_requests_audit after insert or update or delete on public.leave_requests for each row execute function public.log_audit_event();
create trigger trg_leave_attachments_audit after insert or update or delete on public.leave_attachments for each row execute function public.log_audit_event();
