-- 007_auth_config.sql
-- Supabase Auth Configuration & Infrastructure
-- HR-only authentication setup with user_profiles table and RLS policies
-- 
-- Purpose: 
--   - Create user_profiles table linking auth.users to application context
--   - Enable RLS for auth infrastructure tables
--   - Establish HR_ADMIN role-based access control
--   - Enforce HR users only (no employee access in V1)

-- ============================================================================
-- 1. CREATE USER_ROLE ENUM
-- ============================================================================
-- Represents available user roles in the system
-- V1: HR_ADMIN only (future versions will add more roles)
create type public.user_role as enum ('HR_ADMIN');

-- ============================================================================
-- 2. CREATE USER_PROFILES TABLE
-- ============================================================================
-- Links Supabase auth.users to application-specific user data
-- All users in this table are HR administrators in V1
-- References:
--   - user_id: Foreign key to auth.users (Supabase managed)
--   - role: User role in the system (HR_ADMIN only in V1)
--   - is_active: Account activation status
--   - employee_id: Optional link to employee record (for employee HR access later)
create table public.user_profiles (
  id bigserial primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role public.user_role not null default 'HR_ADMIN',
  is_active boolean not null default false,
  full_name text not null,
  phone text,
  employee_id bigint references public.employees(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  created_by uuid,
  updated_at timestamp with time zone not null default now(),
  updated_by uuid
);

-- Create indexes for common queries
create index user_profiles_user_id_idx on public.user_profiles(user_id);
create index user_profiles_role_idx on public.user_profiles(role);
create index user_profiles_is_active_idx on public.user_profiles(is_active);
create index user_profiles_employee_id_idx on public.user_profiles(employee_id);

-- Add table comment for documentation
comment on table public.user_profiles is 
  'Links Supabase auth.users to application context. HR_ADMIN only in V1.';

comment on column public.user_profiles.is_active is 
  'When false, user cannot login even with valid credentials';

comment on column public.user_profiles.created_by is 
  'UUID of the HR admin who created this profile (initially NULL for first admin)';

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================================================
-- Enable RLS on user_profiles table
alter table public.user_profiles enable row level security;

-- ============================================================================
-- 4. ROW LEVEL SECURITY POLICIES FOR USER_PROFILES
-- ============================================================================

-- Policy 1: HR Admins can view their own profile
create policy "users_can_view_own_profile"
  on public.user_profiles
  for select
  using (auth.uid() = user_id);

-- Policy 2: HR Admins cannot update their own role
-- (Role changes must be done by system administrator via admin panel)
create policy "users_cannot_update_own_role"
  on public.user_profiles
  for update
  using (auth.uid() = user_id)
  with check (role = (select role from public.user_profiles where user_id = auth.uid()));

-- Policy 3: Users cannot delete profiles (only deactivate)
create policy "users_cannot_delete_profiles"
  on public.user_profiles
  for delete
  using (false); -- Deny all deletes, use is_active flag instead

-- Policy 4: Only active HR admins can view all user profiles
-- (For admin panel - show list of users)
create policy "admins_view_all_user_profiles"
  on public.user_profiles
  for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.user_id = auth.uid()
      and up.role = 'HR_ADMIN'
      and up.is_active = true
    )
  );

-- ============================================================================
-- 5. AUTHENTICATION CONFIGURATION NOTES
-- ============================================================================
-- 
-- CONFIGURE IN SUPABASE CONSOLE:
-- 
-- 1. Auth Settings → General
--    - Site URL: Production domain (e.g., https://cit-hrms.example.com)
--    - Redirect URLs: Include http://localhost:5173/auth/callback (dev)
-- 
-- 2. Auth Settings → Security
--    - JWT Expiry: 3600 (1 hour access token)
--    - Refresh Token Rotation: Enabled
--    - Refresh Token Reuse Window: 10 seconds
--    - Maximum Inactive: 604800 (7 days)
-- 
-- 3. Auth Settings → Email
--    - Enable "Confirm email" for sign-ups
--    - Email confirmation link expires: 24 hours
-- 
-- 4. Auth Providers
--    - Email/Password: Enabled (primary provider for V1)
--    - Autoconfirm: FALSE (HR admin must confirm emails)
-- 
-- 5. Service Role Key
--    - NEVER expose in frontend code
--    - Use only in backend/server environment
--    - Create user_profiles via backend after user sign-up/confirmation
-- 
-- ============================================================================
-- 6. IMPORTANT CONSTRAINTS FOR V1
-- ============================================================================
-- 
-- ✓ HR_ADMIN is the ONLY role available in V1
-- ✓ All user_profiles must have is_active = false initially
-- ✓ HR admin must explicitly activate new user accounts
-- ✓ Service Role Key is NEVER used in frontend (violates security model)
-- ✓ User login creates JWT token valid for 1 hour
-- ✓ Refresh token valid for 7 days (auto-refresh before expiry)
-- ✓ Session persisted in localStorage (web apps)
-- ✓ No employee self-service access in V1
-- 
-- ============================================================================
