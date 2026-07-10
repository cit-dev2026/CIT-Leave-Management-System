-- 20260709000004_user_profile_provisioning.sql
-- Provision user_profiles rows from auth.users and keep updated_at current.

-- ============================================================================
-- 1) Provisioning function: create user_profiles row for new auth.users rows
-- ============================================================================
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.user_profiles (
		user_id,
		role
	)
	values (
		new.id,
		'CompanyOwner'::public.app_role
	)
	on conflict (user_id) do nothing;

	return new;
end;
$$;

comment on function public.handle_new_user_profile is
'Automatically provisions a user_profiles record whenever a new auth.users record is created.';

-- ============================================================================
-- 2) Backfill existing auth users without profiles (safe/idempotent)
-- ============================================================================
insert into public.user_profiles (
	user_id,
	role
)
select
	au.id,
	'CompanyOwner'::public.app_role
from auth.users au
left join public.user_profiles up
	on up.user_id = au.id
where up.user_id is null;

-- ============================================================================
-- 3) Trigger on auth.users -> public.handle_new_user_profile
-- ============================================================================
drop trigger if exists trg_auth_users_create_user_profile on auth.users;

create trigger trg_auth_users_create_user_profile
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

-- ============================================================================
-- 4) Keep user_profiles.updated_at in sync using existing public.set_updated_at
-- ============================================================================
drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;

create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();
