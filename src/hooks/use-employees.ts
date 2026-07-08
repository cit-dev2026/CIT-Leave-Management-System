import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { type EmployeeFilterSchema } from '@/schemas/employee-schema'
import { getEmployees, softDeleteEmployees } from '@/services/employee-service'

export function useEmployees(filters: EmployeeFilterSchema) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => getEmployees(filters),
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
