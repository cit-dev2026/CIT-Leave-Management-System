import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'
import { useError } from '@/contexts/error-context'

/**
 * Authentication State
 * Tracks current Supabase session and user
 * Role/is_active checks handled by authorization layer (later card)
 */
type AuthState = {
  // Supabase user object (email, id, etc.)
  user: SupabaseUser | null

  // Supabase JWT session
  session: Session | null

  // Loading states
  isLoading: boolean
  isInitializing: boolean

  // Computed: is user authenticated
  isAuthenticated: boolean

  // Error handling
  error: AuthError | null
}

type AuthError = {
  code: string
  message: string
  timestamp: Date
}

type AuthContextType = AuthState & {
  // Methods
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  getCurrentUser: () => SupabaseUser | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Component
 *
 * Manages authentication state and session lifecycle
 *
 * On mount:
 *   1. Restore session from localStorage
 *   2. Set up auth state change listener
 *   3. Unblock UI when initialization complete
 *
 * Responsibilities:
 *   - Track Supabase user and session
 *   - Handle login/logout operations
 *   - Restore sessions on app startup
 *   - Listen for auth state changes
 *   - Manage loading and error states
 *
 * Does NOT handle:
 *   - JWT token management (Supabase manages)
 *   - Role/permission checks (authorization layer)
 *   - User profile data (user_profiles table)
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: false,
    isInitializing: true,
    isAuthenticated: false,
    error: null,
  })

  const { addError } = useError()

  /**
   * Set error state and dispatch to error context
   */
  const setError = useCallback(
    (code: string, message: string) => {
      const error: AuthError = {
        code,
        message,
        timestamp: new Date(),
      }
      setState((prev) => ({ ...prev, error }))
      addError(code, message)
    },
    [addError],
  )

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  /**
   * Get current user (synchronous)
   */
  const getCurrentUser = useCallback(() => {
    return state.user || null
  }, [state.user])

  /**
   * Sign out user
   * Clears session and user state
   */
  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      // Call Supabase signOut - clears localStorage session
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Clear all auth state
      setState({
        user: null,
        session: null,
        isLoading: false,
        isInitializing: false,
        isAuthenticated: false,
        error: null,
      })

      clearError()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed'
      setError('SIGN_OUT_ERROR', message)
      throw err
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [setError, clearError])

  /**
   * Refresh session
   * Calls Supabase to refresh JWT token before expiry
   */
  const refreshSession = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        throw error
      }

      if (data.session) {
        setState((prev) => ({
          ...prev,
          session: data.session,
          user: data.user || prev.user,
        }))
        clearError()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Session refresh failed'
      setError('REFRESH_SESSION_ERROR', message)
      throw err
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [setError, clearError])

  /**
   * Restore session on app startup
   * Reads localStorage and validates session
   */
  useEffect(() => {
    let mounted = true

    const restoreSession = async () => {
      try {
        // Get session from localStorage via Supabase
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (!mounted) return

        if (data.session) {
          // Session exists and is valid
          setState((prev) => ({
            ...prev,
            session: data.session,
            user: data.session.user,
            isAuthenticated: true,
            isInitializing: false,
            error: null,
          }))
        } else {
          // No valid session
          setState((prev) => ({
            ...prev,
            session: null,
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            error: null,
          }))
        }
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : 'Failed to restore session'
          setState({
            user: null,
            session: null,
            isLoading: false,
            isInitializing: false,
            isAuthenticated: false,
            error: {
              code: 'SESSION_RESTORE_ERROR',
              message,
              timestamp: new Date(),
            },
          })
        }
      }
    }

    void restoreSession()

    return () => {
      mounted = false
    }
  }, [])

  /**
   * Listen for Supabase auth state changes
   * Updates state when user logs in/out or session changes
   */
  useEffect(() => {
    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        // Initial session check already handled in restoreSession useEffect
        return
      }

      if (event === 'SIGNED_IN') {
        // User signed in successfully
        setState((prev) => ({
          ...prev,
          session,
          user: session?.user || null,
          isAuthenticated: !!session,
          error: null,
        }))
      } else if (event === 'SIGNED_OUT') {
        // User signed out or session expired
        setState((prev) => ({
          ...prev,
          session: null,
          user: null,
          isAuthenticated: false,
          error: null,
        }))
      } else if (event === 'TOKEN_REFRESHED') {
        // Token was automatically refreshed
        setState((prev) => ({
          ...prev,
          session,
          user: session?.user || prev.user,
          isAuthenticated: !!session,
        }))
      } else if (event === 'USER_UPDATED') {
        // User data changed (e.g., email, password)
        setState((prev) => ({
          ...prev,
          user: session?.user || null,
        }))
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    ...state,
    signOut,
    refreshSession,
    getCurrentUser,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 *
 * Access authentication state and methods in any component
 *
 * Usage:
 *   const { user, session, isAuthenticated, signOut } = useAuth()
 *
 * Throws error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
