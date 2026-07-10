import { useQuery } from '@tanstack/react-query'

import {
  getCurrentUserProfile,
  type CurrentUserProfile,
} from '@/services/user-profile-service'

/**
 * React Query hook for the authenticated user's profile.
 *
 * Provides a stable, cached profile query for the current session.
 *
 * Returns:
 * - profile: CurrentUserProfile | undefined
 * - isLoading: boolean
 * - isError: boolean
 * - error: Error | null
 * - refetch: () => Promise<QueryObserverResult<CurrentUserProfile, Error>>
 */
export function useUserProfile() {
  const query = useQuery<CurrentUserProfile, Error>({
    queryKey: ['user-profile'],
    queryFn: getCurrentUserProfile,
  })

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
