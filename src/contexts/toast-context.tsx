/**
 * src/contexts/toast-context.tsx
 *
 * Toast/notification system context for temporary user feedback.
 * Supports success, error, warning, and info messages with auto-dismiss.
 */

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export interface Toast {
  id: string
  type: ToastType
  message: string
  description?: string
  duration?: number // milliseconds, 0 = no auto-dismiss
  isVisible: boolean
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, description?: string, duration?: number) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const DEFAULT_DURATION = 3000 // 3 seconds

/**
 * Toast Context Provider
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = ToastType.Info, description?: string, duration = DEFAULT_DURATION) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const toast: Toast = {
        id,
        type,
        message,
        description,
        duration,
        isVisible: true,
      }

      setToasts((prev) => [...prev, toast])

      // Auto-dismiss if duration > 0
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    [removeToast],
  )

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

/**
 * Hook to use toast context
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

/**
 * Convenience hook for common toast scenarios
 */
export function useToastNotify() {
  const { addToast } = useToast()

  return {
    success: (message: string, description?: string) =>
      addToast(message, ToastType.Success, description, DEFAULT_DURATION),
    error: (message: string, description?: string) =>
      addToast(message, ToastType.Error, description, DEFAULT_DURATION),
    warning: (message: string, description?: string) =>
      addToast(message, ToastType.Warning, description, DEFAULT_DURATION),
    info: (message: string, description?: string) =>
      addToast(message, ToastType.Info, description, DEFAULT_DURATION),
  }
}
