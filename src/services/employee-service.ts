import { type EmployeeFilterSchema } from '@/schemas/employee-schema'
import { supabase } from '@/lib/supabase'

export type EmployeeListItem = {
  id: string
  employeeNumber: string
  fullName: string
  email: string
  companyId: string
  companyName: string
  status: string
  employmentType: string
  hireDate: string
}

export type CompanyOption = {
  id: string
  name: string
}

type EmployeeWithCompanyRow = {
  id: string
  employee_number: string
  first_name: string
  last_name: string
  email: string
  company_id: string
  status: string
  employment_type: string | null
  hire_date: string
  companies: {
    name: string
  } | null
}

export async function getEmployees(filters: EmployeeFilterSchema) {
  let query = supabase
    .from('employees')
    .select('id, employee_number, first_name, last_name, email, company_id, status, employment_type, hire_date, companies(name)')
    .is('deleted_at', null)

  if (filters.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,employee_number.ilike.%${filters.search}%`,
    )
  }

  if (filters.statuses.length > 0) {
    query = query.in('status', filters.statuses)
  }

  if (filters.employmentTypes.length > 0) {
    query = query.in('employment_type', filters.employmentTypes)
  }

  if (filters.companyIds.length > 0) {
    query = query.in('company_id', filters.companyIds)
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(200)

  if (error) {
    throw error
  }

  const employeeRows = (data ?? []) as unknown as EmployeeWithCompanyRow[]

  return employeeRows.map<EmployeeListItem>((employee) => ({
    id: employee.id,
    employeeNumber: employee.employee_number,
    fullName: `${employee.first_name} ${employee.last_name}`,
    email: employee.email,
    companyId: employee.company_id,
    companyName: employee.companies?.name ?? 'Unassigned',
    status: employee.status,
    employmentType: employee.employment_type ?? 'N/A',
    hireDate: employee.hire_date,
  }))
}

export async function getActiveCompanies() {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []) as CompanyOption[]
}

export async function updateEmployeeCompany(
  employeeId: string,
  companyId: string,
  actorId: string | null,
) {
  const { error } = await supabase
    .from('employees')
    .update({
      company_id: companyId,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', employeeId)
    .is('deleted_at', null)

  if (error) {
    throw error
  }
}

export async function softDeleteEmployees(employeeIds: string[], actorId: string | null) {
  if (employeeIds.length === 0) {
    return
  }

  const { error } = await supabase
    .from('employees')
    .update({
      deleted_at: new Date().toISOString(),
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .in('id', employeeIds)

  if (error) {
    throw error
  }
}
