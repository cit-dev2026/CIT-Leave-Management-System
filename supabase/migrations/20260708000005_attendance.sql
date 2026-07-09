-- 005_attendance.sql
-- Attendance and shift capture

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  shift_id uuid null references public.shifts (id),
  attendance_date date not null,
  check_in_at timestamptz null,
  check_out_at timestamptz null,
  attendance_status text not null check (attendance_status in ('Present', 'Absent', 'Late', 'Half Day', 'On Leave')),
  remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users (id),
  updated_by uuid null references auth.users (id),
  unique (employee_id, attendance_date)
);

create table if not exists public.attendance_anomalies (
  id uuid primary key default gen_random_uuid(),
  attendance_record_id uuid not null references public.attendance_records (id) on delete cascade,
  anomaly_type text not null,
  details text null,
  resolved_at timestamptz null,
  resolved_by uuid null references auth.users (id),
  created_at timestamptz not null default now(),
  created_by uuid null references auth.users (id)
);

create index if not exists idx_attendance_records_employee_id on public.attendance_records (employee_id);
create index if not exists idx_attendance_records_date on public.attendance_records (attendance_date);
create index if not exists idx_attendance_records_status on public.attendance_records (attendance_status);

alter table public.attendance_records enable row level security;
alter table public.attendance_anomalies enable row level security;

create policy attendance_self_or_manager_or_hr_read
  on public.attendance_records
  for select
  to authenticated
  using (
    employee_id = (select employee_id from public.user_profiles where user_id = auth.uid())
    or public.is_line_manager(employee_id)
    or public.is_hr_privileged()
  );

create policy attendance_hr_manage
  on public.attendance_records
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create policy attendance_anomalies_manager_or_hr_read
  on public.attendance_anomalies
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.attendance_records ar
      where ar.id = attendance_record_id
        and (
          ar.employee_id = (select employee_id from public.user_profiles where user_id = auth.uid())
          or public.is_line_manager(ar.employee_id)
          or public.is_hr_privileged()
        )
    )
  );

create policy attendance_anomalies_hr_manage
  on public.attendance_anomalies
  for all
  to authenticated
  using (public.is_hr_privileged())
  with check (public.is_hr_privileged());

create trigger trg_attendance_records_updated_at before update on public.attendance_records for each row execute function public.set_updated_at();

create trigger trg_attendance_records_audit after insert or update or delete on public.attendance_records for each row execute function public.log_audit_event();
create trigger trg_attendance_anomalies_audit after insert or update or delete on public.attendance_anomalies for each row execute function public.log_audit_event();
