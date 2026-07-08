import { type PropsWithChildren } from 'react'

import { ThemeContextProvider } from '@/contexts/theme-context'
import { QueryProvider } from '@/providers/query-provider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </QueryProvider>
  )
}
