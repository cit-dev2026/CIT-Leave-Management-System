import { useQuery } from '@tanstack/react-query'

import { getDashboardKpi, getDepartmentHeadcount } from '@/services/dashboard-service'

export function useDashboardKpi() {
  return useQuery({
    queryKey: ['dashboard', 'kpi'],
    queryFn: getDashboardKpi,
  })
}

export function useDepartmentHeadcount() {
  return useQuery({
    queryKey: ['dashboard', 'department-headcount'],
    queryFn: getDepartmentHeadcount,
  })
}
