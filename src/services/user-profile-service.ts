/**
 * src/services/user-profile-service.ts
 *
 * Service layer for authenticated user profile operations.
 * Follows the existing Supabase service pattern used across the project.
 */

import { createServiceError } from '@/services/base-service'
import { supabase } from '@/lib/supabase'
import { type Database } from '@/types/database'

type UserProfileRow = Database['public']['Tables']['user_profiles']['Row']

export type CurrentUserProfile = Pick<
  UserProfileRow,
  'user_id' | 'role' | 'created_at' | 'updated_at'
> & {
  company_id: string
  is_active: boolean
}

export const ALLOWED_USER_PROFILE_ROLES = ['CompanyOwner', 'HROfficer'] as const

/**
 * Check whether a user profile role is allowed to access protected V1 modules.
 */
export function isAllowedUserProfileRole(role: CurrentUserProfile['role']): boolean {
  return ALLOWED_USER_PROFILE_ROLES.includes(role)
}

/**
 * Fetch the currently authenticated user's profile from public.user_profiles.
 *
 * Steps:
 * 1. Resolve authenticated user from Supabase Auth.
 * 2. Query user_profiles by user_id.
 * 3. Return authorization-relevant profile fields.
 *
 * @throws Error when no authenticated user exists.
 * @throws Error when profile lookup fails.
 * @throws Error when no profile row is found for the authenticated user.
 */
export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError) {
    const serviceError = createServiceError(authError, 'Failed to resolve authenticated user')
    throw new Error(`Unable to resolve authenticated user: ${serviceError.message}`)
  }

  if (!authData.user) {
    throw new Error('No authenticated user found. Please sign in and try again.')
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', authData.user.id)
    .maybeSingle()

  if (error) {
    const serviceError = createServiceError(error, 'Failed to query user_profiles')
    throw new Error(`Unable to fetch user profile: ${serviceError.message}`)
  }

  if (!data) {
    throw new Error(`User profile not found for authenticated user: ${authData.user.id}`)
  }

  const profileRecord = data as Record<string, unknown>
  const companyId = profileRecord.company_id
  const isActive = profileRecord.is_active

  if (typeof companyId !== 'string' || typeof isActive !== 'boolean') {
    throw new Error(
      'User profile is missing required fields (company_id, is_active). Ensure latest migrations are applied.',
    )
  }

  return {
    user_id: data.user_id,
    company_id: companyId,
    role: data.role,
    is_active: isActive,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}
