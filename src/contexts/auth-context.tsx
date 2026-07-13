import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { supabase } from '@/lib/supabase'
import { useError } from '@/contexts/error-context'

type AuthError = {
  code: string
  message: string
  timestamp: Date
}

type AuthState = {
  user: SupabaseUser | null
  session: Session | null
  isLoading: boolean
  isInitializing: boolean
  isAuthenticated: boolean
  error: AuthError | null
}

type AuthContextType = AuthState & {
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  getCurrentUser: () => SupabaseUser | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: false,
    isInitializing: true,
    isAuthenticated: false,
    error: null,
  })

  const { addError } = useError()

  const setError = useCallback(
    (code: string, message: string) => {
      setState((prev) => ({
        ...prev,
        error: {
          code,
          message,
          timestamp: new Date(),
        },
      }))

      addError(code, message)
    },
    [addError],
  )

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }))
  }, [])

  const getCurrentUser = useCallback(() => {
    return state.user
  }, [state.user])

  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }))

      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

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
      const message =
        err instanceof Error
          ? err.message
          : 'Sign out failed'

      setError('SIGN_OUT_ERROR', message)

      throw err
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }))
    }
  }, [clearError, setError])

  const refreshSession = useCallback(async () => {
    try {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }))

      const { data, error } =
        await supabase.auth.refreshSession()

      if (error) {
        throw error
      }

      if (data.session) {
        const session = data.session

        setState((prev) => ({
          ...prev,
          session,
          user: session.user,
          isAuthenticated: true,
        }))
      }

      clearError()
          } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Session refresh failed'

      setError('REFRESH_SESSION_ERROR', message)
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }))
    }
  }, [clearError, setError])

  useEffect(() => {
    let mounted = true

    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (!mounted) return

        setState((prev) => ({
          ...prev,
          session: data.session,
          user: data.session?.user ?? null,
          isAuthenticated: !!data.session,
          isInitializing: false,
          error: null,
        }))
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to restore session'

        setState((prev) => ({
          ...prev,
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
        }))
      }
    }

    void restoreSession()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
      }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    ...state,
    loading: state.isInitializing || state.isLoading,
    signOut,
    refreshSession,
    getCurrentUser,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}