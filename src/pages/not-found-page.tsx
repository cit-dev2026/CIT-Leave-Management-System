import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-6">
      <Card className="w-full space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Error</p>
        <h2 className="text-3xl font-bold">Page not found</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          The page you requested does not exist or is currently unavailable.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--bg-accent)] px-4 text-sm font-semibold text-white"
        >
          Return to Dashboard
        </Link>
      </Card>
    </div>
  )
}
