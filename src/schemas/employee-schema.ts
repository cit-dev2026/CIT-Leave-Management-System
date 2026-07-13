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

const phonePattern = /^\+?[0-9()\-\s]{7,20}$/

export const employeeCrudSchema = z.object({
  employeeNumber: z.string().trim().min(1, 'Employee Number is required'),
  firstName: z.string().trim().min(1, 'First Name is required'),
  lastName: z.string().trim().min(1, 'Last Name is required'),
  email: z.string().trim().email('Valid email is required'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone Number is required')
    .regex(phonePattern, 'Phone Number format is invalid'),
  idPassportNumber: z.string().trim().min(1, 'ID / Passport Number is required'),
  dateOfBirth: z.string().trim().min(1, 'Date of Birth is required'),
  gender: z.string().trim().min(1, 'Gender is required'),
  employmentDate: z.string().trim().min(1, 'Employment Date is required'),
  employmentType: z.string().trim().min(1, 'Employment Type is required'),
  departmentId: z.string().uuid('Department is required'),
  jobTitleId: z.string().uuid('Job Title / Position is required'),
  leaveCycle: z.string().trim().min(1, 'Leave Cycle is required'),
  nextOfKinName: z.string().trim().min(1, 'Next of Kin Name is required'),
  nextOfKinPhoneNumber: z
    .string()
    .trim()
    .min(1, 'Next of Kin Phone Number is required')
    .regex(phonePattern, 'Next of Kin Phone Number format is invalid'),
  address: z.string().trim().min(1, 'Address is required'),
  managerId: z.string().uuid().nullable(),
})

export type EmployeeCrudSchema = z.infer<typeof employeeCrudSchema>

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
