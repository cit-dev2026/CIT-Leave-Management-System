# Supabase Auth Configuration Guide

## Overview

Sprint 2 Step 1 configures Supabase Authentication for CompanyOwner and HROfficer access to the CIT Leave Management System. This guide covers the Supabase console setup required to enable email/password authentication for authorized company users.

**Key Points:**
- CompanyOwner and HROfficer roles only (V1 does not support employee access)
- Email/Password authentication provider
- 1-hour access tokens with 7-day refresh tokens
- Email confirmation required before login
- Service Role Key is **NEVER** used in frontend code

---

## Architecture

### User Authentication Flow

```
1. Company user enters email/password on login page
2. Supabase Auth validates credentials
3. JWT token issued (1 hour expiry)
4. Refresh token issued (7 days expiry)
5. Session persisted in localStorage
6. Frontend automatically refreshes token before expiry
7. Access to leave management system granted via RLS policies
```

### Database Security

- **user_profiles table** links `auth.users` to application context
- **Row-Level Security (RLS)** enforces access control at database level
- **Policies:**
  - Users can only view their own profile
  - Users cannot modify their own role
   - Only active CompanyOwner users can view all user profiles
  - Profiles cannot be deleted (use is_active flag to deactivate)

---

## Supabase Console Configuration

### Step 1: Enable Email/Password Authentication

1. Open your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Email** provider and ensure it's **Enabled**
4. Configure email settings:
   - Enable **Confirm email** (required - users must confirm email before login)
   - Email link expiration: **24 hours** (default)
   - Double confirm change: **Optional** (toggle as needed)

### Step 2: Configure JWT Settings

1. Navigate to **Authentication** → **Auth Providers** → **Email**
2. Under **JWT Settings**, configure:
   - **JWT Expiry Limit**: `3600` (1 hour - access token)
   - **Refresh Token Rotation**: **Enabled** (auto-refresh tokens)
   - **Refresh Token Reuse Window**: `10` seconds (secure rotation window)

### Step 3: Set Refresh Token Expiry

1. Navigate to **Authentication** → **User Sessions** (or **Auth Providers** tab)
2. Configure session duration:
   - **Max Inactive**: `604800` (7 days - refresh token expiry)
   - **Inactivity Timeout**: `3600` (1 hour - optional, for extra security)

### Step 4: Configure Redirect URLs

1. Navigate to **Authentication** → **URL Configuration**
2. Under **Site URL**, enter your production domain:
   ```
   https://yourdomain.example.com
   ```
3. Add **Redirect URLs** for OAuth and magic link flows:
   ```
   http://localhost:5173/auth/callback
   https://yourdomain.example.com/auth/callback
   ```
4. Add **Logout URLs**:
   ```
   http://localhost:5173/login
   https://yourdomain.example.com/login
   ```

### Step 5: Configure Email Templates (Optional)

1. Navigate to **Authentication** → **Email Templates**
2. Customize confirmation email (optional):
   - Keep default or customize with company branding
   - Ensure link is functional: `{{ .ConfirmationURL }}`
3. Customize password reset email (optional for future use)

---

## User Management

### Creating Company User Accounts

**Method 1: Supabase Dashboard (Manual)**

1. Navigate to **Authentication** → **Users**
2. Click **Add User**
3. Enter email address and temporary password
4. User will receive confirmation email
5. After email confirmation, the user profile will be created via backend process
6. CompanyOwner must activate account (`is_active = true`) before user can login

**Method 2: Backend API (Programmatic - Phase 2 Step 3)**

A backend API will be created to:
1. Accept company user email/phone/details and target role
2. Create user via Supabase Admin API (Service Role Key)
3. Send confirmation email
4. Create user_profiles record with `is_active = false`
5. Return user creation result

### User Deactivation

To disable a company user account:
1. Navigate to **Authentication** → **Users**
2. Find the user record
3. In application: Set `user_profiles.is_active = false`
4. User cannot login even with valid credentials

To fully remove user:
1. Backend: Delete from user_profiles (cascades to auth.users)
2. Or: Disable via Supabase Dashboard (marks user as suspended)

---

## Security Constraints

### ✅ What IS Allowed

- Email/Password login from frontend
- JWT token stored in localStorage
- Auto-refresh of tokens 60 seconds before expiry
- Session persistence across browser refreshes
- Sign-out to clear session

### ❌ What IS NOT Allowed

- **Service Role Key in Frontend**: Never expose or use in client-side code
- **Employee Self-Service**: No employee access in V1
- **Role Creation**: Only CompanyOwner and HROfficer roles available in V1
- **Password Reset**: Not implemented in V1 (manual reset via admin)
- **Social Login**: Email/Password only in V1

### Environment Variables

**Frontend (.env) - Public Keys Only:**
```env
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Backend/Admin - Service Role Key (NEVER in .env file):**
- Store in secure configuration management
- Use only in trusted backend environments
- Create user_profiles after Supabase Auth signup

---

## Testing Authentication

### Manual Testing Checklist

- [ ] Create test company user account via Supabase dashboard
- [ ] Confirm email from inbox
- [ ] Activate user profile (`is_active = true`)
- [ ] Login with email/password
- [ ] Verify session persists on page refresh
- [ ] Check JWT token in browser localStorage
- [ ] Wait for token expiry (3600 seconds) or manually test refresh
- [ ] Logout and verify session cleared
- [ ] Deactivate user (`is_active = false`)
- [ ] Attempt login with deactivated account (should fail)

### Verify RLS Policies

- [ ] User can view their own profile only
- [ ] User cannot see other profiles
- [ ] Admin users can see all user profiles
- [ ] User cannot modify their own role
- [ ] Attempts to delete profile are rejected

---

## Environment-Specific Configuration

### Development

```env
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key-here
VITE_AUTH_CALLBACK_URL=http://localhost:5173/auth/callback
VITE_AUTH_LOGOUT_URL=http://localhost:5173/login
```

### Production

```env
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key-here
VITE_AUTH_CALLBACK_URL=https://cit-hrms.example.com/auth/callback
VITE_AUTH_LOGOUT_URL=https://cit-hrms.example.com/login
```

---

## Configuration Summary

| Setting | Value | Purpose |
|---------|-------|---------|
| **JWT Expiry** | 3600 (1 hour) | Access token validity |
| **Refresh Expiry** | 604800 (7 days) | Refresh token validity |
| **Provider** | Email/Password | Company user login method |
| **Confirm Email** | Enabled | Security - verify email ownership |
| **Auto Refresh** | Enabled | Auto-refresh tokens on frontend |
| **Session Persist** | Enabled | Remember user across refreshes |
| **Service Role Key** | Not in Frontend | Security - never expose |

---

## Notes

- **Phase 2 Step 2** (following this step): Create `user_profiles` table via migration 007_auth_config.sql and enable RLS policies
- **Phase 2 Step 3** (following step 2): Create auth context provider for frontend authentication UI
- **Future Phases** will add password reset, email verification UI, and other auth features
- Production deployment requires HTTPS and proper domain configuration

---

## Support

For Supabase-specific issues, refer to:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JWT Authentication](https://supabase.com/docs/learn/auth-deep-dive/auth-deep-dive-jwts)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
