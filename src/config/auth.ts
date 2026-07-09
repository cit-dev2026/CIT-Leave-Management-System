/**
 * Authentication Configuration
 * HR-only authentication setup for CIT Leave Management System
 * 
 * JWT Expiry: 1 hour (3600 seconds) - Access token
 * Refresh Expiry: 7 days (604800 seconds) - Refresh token
 * User Role: HR_ADMIN (only role for V1)
 */

export const AUTH_CONFIG = {
  // JWT Token Configuration
  JWT_EXPIRY_SECONDS: 3600, // 1 hour access token
  REFRESH_TOKEN_EXPIRY_SECONDS: 604800, // 7 days refresh token

  // User Roles (HR-only in V1)
  ROLES: {
    HR_ADMIN: 'HR_ADMIN',
  } as const,

  // Role Permissions (HR_ADMIN has full access to leave management system)
  ROLE_PERMISSIONS: {
    HR_ADMIN: {
      manage_employees: true,
      manage_leaves: true,
      manage_leave_types: true,
      view_attendance: true,
      manage_attendance: true,
      manage_user_access: true,
      system_configuration: true,
    },
  } as const,

  // Session Configuration
  SESSION: {
    AUTO_REFRESH_TOKEN: true,
    PERSIST_SESSION: true,
    DETECT_SESSION_IN_URL: true,
  } as const,

  // Auth Redirect URLs (configure in Supabase console)
  REDIRECT_URLS: {
    // Development
    CALLBACK_URL_DEV: 'http://localhost:5173/auth/callback',
    LOGOUT_URL_DEV: 'http://localhost:5173/login',

    // Production (set in environment variables)
    CALLBACK_URL_PROD: process.env.VITE_AUTH_CALLBACK_URL || '',
    LOGOUT_URL_PROD: process.env.VITE_AUTH_LOGOUT_URL || '',
  } as const,

  // Auth Error Messages
  ERRORS: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User account not found',
    EMAIL_NOT_CONFIRMED: 'Email address not confirmed',
    WEAK_PASSWORD: 'Password does not meet security requirements',
    EMAIL_ALREADY_IN_USE: 'Email is already in use',
    SESSION_EXPIRED: 'Your session has expired. Please login again',
    UNAUTHORIZED: 'You do not have permission to access this resource',
    SERVICE_ERROR: 'An error occurred. Please try again later',
  } as const,
} as const

export type UserRole = typeof AUTH_CONFIG.ROLES[keyof typeof AUTH_CONFIG.ROLES]
