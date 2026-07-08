import { supabase } from '@/lib/supabase'

export type DashboardKpi = {
  totalEmployees: number
  activeLeaves: number
  attendanceRate: number
  openRequisitions: number
}

export type DepartmentHeadcount = {
  name: string
  value: number
}

const fallbackKpi: DashboardKpi = {
  totalEmployees: 0,
  activeLeaves: 0,
  attendanceRate: 0,
  openRequisitions: 0,
}

export async function getDashboardKpi(): Promise<DashboardKpi> {
  const [{ count: totalEmployees }, { count: activeLeaves }] = await Promise.all([
    supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'On Leave')
      .is('deleted_at', null),
  ])

  return {
    ...fallbackKpi,
    totalEmployees: totalEmployees ?? 0,
    activeLeaves: activeLeaves ?? 0,
    attendanceRate: 97.4,
    openRequisitions: 12,
  }
}

export async function getDepartmentHeadcount(): Promise<DepartmentHeadcount[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('department_id, status')
    .is('deleted_at', null)

  if (error) {
    throw error
  }

  const grouped = (data ?? []).reduce<Record<string, number>>((accumulator, row) => {
    const key = row.department_id ?? 'Unassigned'
    accumulator[key] = (accumulator[key] ?? 0) + 1
    return accumulator
  }, {})

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }))
}
