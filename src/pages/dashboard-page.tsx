import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, CalendarClock, TrendingUp, Users2 } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

import { StatCard } from '@/components/dashboard/stat-card'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { useDashboardKpi, useDepartmentHeadcount } from '@/hooks/use-dashboard'
import { useUserProfile } from '@/hooks/use-user-profile'
import { isAllowedUserProfileRole } from '@/services/user-profile-service'

export function DashboardPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { profile, isLoading, isError, error } = useUserProfile()
  const kpiQuery = useDashboardKpi()
  const departmentHeadcountQuery = useDepartmentHeadcount()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const shouldInvalidateSession = useMemo(() => {
    if (!profile) {
      return false
    }

    return !profile.is_active || !isAllowedUserProfileRole(profile.role)
  }, [profile])

  useEffect(() => {
    if (isLoading || isError || !shouldInvalidateSession || isSigningOut) {
      return
    }

    let isMounted = true

    const invalidateSession = async () => {
      setIsSigningOut(true)

      try {
        await signOut()
      } finally {
        if (isMounted) {
          await navigate('/login', { replace: true })
          setIsSigningOut(false)
        }
      }
    }

    void invalidateSession()

    return () => {
      isMounted = false
    }
  }, [isLoading, isError, shouldInvalidateSession, isSigningOut, signOut, navigate])

  if (isLoading || isSigningOut) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-base font-medium text-[var(--text-secondary)]">
          Checking authentication...
        </p>
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Foundation Module
          </p>
          <h2 className="text-2xl font-bold lg:text-3xl">HRMS Operations Dashboard</h2>
        </header>
        <Card>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Unable to load your profile</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {error?.message ?? 'Please refresh the page or sign in again.'}
            </p>
          </div>
        </Card>
      </section>
    )
  }

  if (shouldInvalidateSession) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-base font-medium text-[var(--text-secondary)]">
          Validating access...
        </p>
      </div>
    )
  }

  const companyId = profile.company_id
  const role = profile.role

  const kpi = kpiQuery.data

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          Foundation Module
        </p>
        <h2 className="text-2xl font-bold lg:text-3xl">HRMS Operations Dashboard</h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Company scope: {companyId} | Role: {role}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={String(kpi?.totalEmployees ?? 0)}
          subtitle="Across all companies"
          icon={Users2}
        />
        <StatCard
          title="Active Leave Cases"
          value={String(kpi?.activeLeaves ?? 0)}
          subtitle="Pending and approved"
          icon={CalendarClock}
        />
        <StatCard
          title="Attendance Rate"
          value={`${String(kpi?.attendanceRate ?? 0)}%`}
          subtitle="Month to date"
          icon={Activity}
        />
        <StatCard
          title="Open Requisitions"
          value={String(kpi?.openRequisitions ?? 0)}
          subtitle="Recruitment pipeline"
          icon={TrendingUp}
        />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Department Headcount</h3>
          <p className="text-xs text-[var(--text-secondary)]">Near real-time from Supabase</p>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentHeadcountQuery.data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--bg-accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  )
}
