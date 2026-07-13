import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { type EmployeeCrudSchema, type EmployeeFilterSchema } from '@/schemas/employee-schema'
import {
  createEmployee,
  deactivateEmployee,
  getEmployeeById,
  getEmployeeFormOptions,
  getActiveCompanies,
  getEmployees,
  softDeleteEmployees,
  updateEmployee,
  updateEmployeeCompany,
} from '@/services/employee-service'

export function useEmployees(filters: EmployeeFilterSchema, enabled = true) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => getEmployees(filters),
    enabled,
  })
}

export function useActiveCompanies() {
  return useQuery({
    queryKey: ['companies', 'active'],
    queryFn: async () => getActiveCompanies(),
  })
}

export function useEmployeeFormOptions(companyId: string | null) {
  return useQuery({
    queryKey: ['employees', 'form-options', companyId],
    queryFn: async () => getEmployeeFormOptions(companyId as string),
    enabled: Boolean(companyId),
  })
}

export function useEmployeeById(employeeId: string | null, companyId: string | null) {
  return useQuery({
    queryKey: ['employees', 'detail', employeeId, companyId],
    queryFn: async () => getEmployeeById(employeeId as string, companyId as string),
    enabled: Boolean(employeeId) && Boolean(companyId),
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      input,
      companyId,
      actorId,
    }: {
      input: EmployeeCrudSchema
      companyId: string
      actorId: string | null
    }) => createEmployee(input, companyId, actorId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      employeeId,
      input,
      companyId,
      actorId,
    }: {
      employeeId: string
      input: EmployeeCrudSchema
      companyId: string
      actorId: string | null
    }) => updateEmployee(employeeId, input, companyId, actorId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useDeactivateEmployee() {
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
    }) => deactivateEmployee(employeeId, companyId, actorId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
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
