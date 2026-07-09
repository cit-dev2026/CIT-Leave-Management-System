import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/contexts/auth-context'

export function ProtectedRoute() {
  const location = useLocation()
  const { user, session, loading } = useAuth()

  // Keep UI stable while Supabase restores persisted session.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-base font-medium text-[var(--text-secondary)]">
          Checking authentication...
        </p>
      </div>
    )
  }

  if (!user || !session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
