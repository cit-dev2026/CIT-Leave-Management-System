import { z } from 'zod'

export const employeeFilterSchema = z.object({
  search: z.string().trim().default(''),
  companyIds: z.array(z.uuid()).default([]),
  departmentIds: z.array(z.uuid()).default([]),
  branchIds: z.array(z.uuid()).default([]),
  employmentTypes: z.array(z.string()).default([]),
  statuses: z.array(z.string()).default([]),
})

export type EmployeeFilterSchema = z.infer<typeof employeeFilterSchema>

export const employeeFormSchema = z.object({
  employeeNumber: z.string().min(2),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  companyId: z.uuid(),
  departmentId: z.uuid().nullable(),
  employmentType: z.string().min(1),
  status: z.string().min(1),
  hireDate: z.string().min(1),
})

export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>
