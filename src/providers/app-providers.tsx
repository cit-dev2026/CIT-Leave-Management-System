import { type PropsWithChildren } from 'react'

import { QueryProvider } from '@/providers/query-provider'
import { ErrorProvider } from '@/contexts/error-context'
import { ToastProvider } from '@/contexts/toast-context'
import { ThemeContextProvider } from '@/contexts/theme-context'
import { AuthProvider } from '@/contexts/auth-context'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <ErrorProvider>
        <ToastProvider>
          <ThemeContextProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeContextProvider>
        </ToastProvider>
      </ErrorProvider>
    </QueryProvider>
  )
}