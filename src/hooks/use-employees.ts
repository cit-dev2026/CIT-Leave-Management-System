import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { type EmployeeFilterSchema } from '@/schemas/employee-schema'
import {
  getActiveCompanies,
  getEmployees,
  softDeleteEmployees,
  updateEmployeeCompany,
} from '@/services/employee-service'

export function useEmployees(filters: EmployeeFilterSchema) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => getEmployees(filters),
  })
}

export function useActiveCompanies() {
  return useQuery({
    queryKey: ['companies', 'active'],
    queryFn: async () => getActiveCompanies(),
  })
}

export function useSoftDeleteEmployees() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      employeeIds,
      actorId,
    }: {
      employeeIds: string[]
      actorId: string | null
    }) => softDeleteEmployees(employeeIds, actorId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useUpdateEmployeeCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      employeeId,
      companyId,
      actorId,
    }: {
      employeeId: string
      companyId: string
      actorId: string | null
    }) => updateEmployeeCompany(employeeId, companyId, actorId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
