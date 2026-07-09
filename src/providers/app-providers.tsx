import { type PropsWithChildren } from 'react'

import { ThemeContextProvider } from '@/contexts/theme-context'
import { ErrorProvider } from '@/contexts/error-context'
import { ToastProvider } from '@/contexts/toast-context'
import { ToastContainer } from '@/components/toast/toast-container'
import { QueryProvider } from '@/providers/query-provider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <ErrorProvider>
        <ToastProvider>
          <ThemeContextProvider>
            {children}
            <ToastContainer />
          </ThemeContextProvider>
        </ToastProvider>
      </ErrorProvider>
    </QueryProvider>
  )
}
