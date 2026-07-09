/**
 * src/contexts/error-context.tsx
 *
 * Global error handling context for the application.
 * Provides centralized error logging, user-friendly messages, and error recovery.
 */

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export interface AppError {
  id: string
  code: string
  message: string
  details?: string
  timestamp: Date
  isDismissed: boolean
}

interface ErrorContextType {
  errors: AppError[]
  addError: (code: string, message: string, details?: string) => string
  removeError: (id: string) => void
  dismissError: (id: string) => void
  clearErrors: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

/**
 * Error Context Provider
 */
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>([])

  const addError = useCallback((code: string, message: string, details?: string) => {
    const id = `${code}-${Date.now()}`
    const error: AppError = {
      id,
      code,
      message,
      details,
      timestamp: new Date(),
      isDismissed: false,
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${code}]`, message, details)
    }

    setErrors((prev) => [...prev, error])
    return id
  }, [])

  const removeError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id))
  }, [])

  const dismissError = useCallback((id: string) => {
    setErrors((prev) =>
      prev.map((error) => (error.id === id ? { ...error, isDismissed: true } : error)),
    )
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const value: ErrorContextType = {
    errors,
    addError,
    removeError,
    dismissError,
    clearErrors,
  }

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}

/**
 * Hook to use error context
 */
export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within ErrorProvider')
  }
  return context
}

/**
 * User-friendly error message helper
 */
export function getUserFriendlyErrorMessage(code: string, fallback: string): string {
  const messages: Record<string, string> = {
    PGRST116: 'The requested resource was not found.',
    '42P01': 'The requested table or resource does not exist.',
    RLS_VIOLATION: 'You do not have permission to perform this action.',
    AUTH_REQUIRED: 'You must be logged in to perform this action.',
    NETWORK_ERROR: 'Network connection failed. Please check your internet and try again.',
    VALIDATION_ERROR: 'The provided data is invalid. Please check your inputs.',
    UNIQUE_VIOLATION: 'This item already exists. Please use a different value.',
    SERVICE_ERROR: 'An error occurred while processing your request. Please try again.',
  }

  return messages[code] || fallback
}
