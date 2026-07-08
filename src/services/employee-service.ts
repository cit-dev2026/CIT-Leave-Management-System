import { type EmployeeFilterSchema } from '@/schemas/employee-schema'
import { supabase } from '@/lib/supabase'

export type EmployeeListItem = {
  id: string
  employeeNumber: string
  fullName: string
  email: string
  status: string
  employmentType: string
  hireDate: string
}

export async function getEmployees(filters: EmployeeFilterSchema) {
  let query = supabase
    .from('employees')
    .select('id, employee_number, first_name, last_name, email, status, employment_type, hire_date')
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

  const { data, error } = await query.order('created_at', { ascending: false }).limit(200)

  if (error) {
    throw error
  }

  return (data ?? []).map<EmployeeListItem>((employee) => ({
    id: employee.id,
    employeeNumber: employee.employee_number,
    fullName: `${employee.first_name} ${employee.last_name}`,
    email: employee.email,
    status: employee.status,
    employmentType: employee.employment_type ?? 'N/A',
    hireDate: employee.hire_date,
  }))
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
