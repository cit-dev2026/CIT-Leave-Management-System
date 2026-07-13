import { type EmployeeFilterSchema } from '@/schemas/employee-schema'
import { createServiceError } from '@/services/base-service'
import { supabase } from '@/lib/supabase'

export type EmployeeListItem = {
  id: string
  employeeNumber: string
  fullName: string
  department: string
  position: string
  employmentType: string
  status: string
}

export type EmployeeOption = {
  id: string
  name: string
}

export type ManagerOption = {
  id: string
  name: string
}

export type EmployeeFormOptions = {
  departments: EmployeeOption[]
  jobTitles: EmployeeOption[]
  managers: ManagerOption[]
}

export type EmployeeCrudInput = {
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  idPassportNumber: string
  dateOfBirth: string
  gender: string
  employmentDate: string
  employmentType: string
  departmentId: string
  jobTitleId: string
  leaveCycle: string
  nextOfKinName: string
  nextOfKinPhoneNumber: string
  address: string
  managerId: string | null
}

export type EmployeeFormData = EmployeeCrudInput & {
  id: string
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
  company_id: string
  status: string
  employment_type: string | null
  departments: {
    name: string
  } | null
  job_titles: {
    name: string
  } | null
  deleted_at: string | null
}


type EmployeeMetadata = {
  idPassportNumber: string
  leaveCycle: string
}

function parseEmployeeMetadata(notes: string | null): EmployeeMetadata {
  if (!notes) {
    return {
      idPassportNumber: '',
      leaveCycle: '',
    }
  }

  try {
    const payload = JSON.parse(notes) as Partial<EmployeeMetadata>
    return {
      idPassportNumber: payload.idPassportNumber ?? '',
      leaveCycle: payload.leaveCycle ?? '',
    }
  } catch {
    return {
      idPassportNumber: '',
      leaveCycle: '',
    }
  }
}

function serializeEmployeeMetadata(input: EmployeeCrudInput): string {
  return JSON.stringify({
    idPassportNumber: input.idPassportNumber,
    leaveCycle: input.leaveCycle,
  })
}

async function ensureUniqueEmployeeNumber(
  employeeNumber: string,
  companyId: string,
  employeeId?: string,
) {
  let query = supabase
    .from('employees')
    .select('id')
    .eq('company_id', companyId)
    .eq('employee_number', employeeNumber)
    .is('deleted_at', null)
    .limit(1)

  if (employeeId) {
    query = query.neq('id', employeeId)
  }

  const { data, error } = await query

  if (error) {
    const serviceError = createServiceError(error, 'Failed to validate employee number uniqueness')
    throw new Error(serviceError.message)
  }

  if ((data ?? []).length > 0) {
    throw new Error('Employee Number already exists for this company.')
  }
}

export async function getEmployees(filters: EmployeeFilterSchema) {
  let query = supabase
    .from('employees')
    .select('id, employee_number, first_name, last_name, company_id, status, employment_type, departments(name), job_titles(name)')
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
    department: employee.departments?.name ?? 'Unassigned',
    position: employee.job_titles?.name ?? 'Unassigned',
    employmentType: employee.employment_type ?? 'N/A',
    status: employee.deleted_at ? 'Inactive' : employee.status === 'Active' ? 'Active' : 'Inactive',
  }))
}

export async function getEmployeeFormOptions(companyId: string): Promise<EmployeeFormOptions> {
  const [departmentsResult, jobTitlesResult, managersResult] = await Promise.all([
    supabase
      .from('departments')
      .select('id, name')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name', { ascending: true }),
    supabase
      .from('job_titles')
      .select('id, name')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name', { ascending: true }),
    supabase
      .from('employees')
      .select('id, first_name, last_name')
      .eq('company_id', companyId)
      .eq('status', 'Active')
      .is('deleted_at', null)
      .order('first_name', { ascending: true }),
  ])

  if (departmentsResult.error) {
    throw new Error(createServiceError(departmentsResult.error, 'Failed to load departments').message)
  }

  if (jobTitlesResult.error) {
    throw new Error(createServiceError(jobTitlesResult.error, 'Failed to load job titles').message)
  }

  if (managersResult.error) {
    throw new Error(createServiceError(managersResult.error, 'Failed to load managers').message)
  }

  const departments = (departmentsResult.data ?? []).map((department) => ({
    id: department.id,
    name: department.name,
  }))

  const jobTitles = (jobTitlesResult.data ?? []).map((jobTitle) => ({
    id: jobTitle.id,
    name: jobTitle.name,
  }))

  const managers = (managersResult.data ?? []).map((manager) => ({
    id: manager.id,
    name: `${manager.first_name} ${manager.last_name}`,
  }))

  return {
    departments,
    jobTitles,
    managers,
  }
}

export async function getEmployeeById(employeeId: string, companyId: string): Promise<EmployeeFormData> {
  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .eq('company_id', companyId)
    .is('deleted_at', null)
    .maybeSingle()

  if (employeeError) {
    throw new Error(createServiceError(employeeError, 'Failed to load employee record').message)
  }

  if (!employee) {
    throw new Error('Employee record not found for your company.')
  }

  const { data: contact, error: contactError } = await supabase
    .from('employee_contacts')
    .select('id, full_name, phone_number, address')
    .eq('employee_id', employeeId)
    .eq('contact_type', 'Next of Kin')
    .limit(1)
    .maybeSingle()

  if (contactError) {
    throw new Error(createServiceError(contactError, 'Failed to load next of kin details').message)
  }

  const metadata = parseEmployeeMetadata(employee.notes)
  const nextOfKin = contact ?? null

  return {
    id: employee.id,
    employeeNumber: employee.employee_number,
    firstName: employee.first_name,
    lastName: employee.last_name,
    email: employee.email,
    phoneNumber: employee.phone_number ?? '',
    idPassportNumber: metadata.idPassportNumber,
    dateOfBirth: employee.date_of_birth ?? '',
    gender: employee.gender ?? '',
    employmentDate: employee.hire_date,
    employmentType: employee.employment_type ?? '',
    departmentId: employee.department_id ?? '',
    jobTitleId: employee.job_title_id ?? '',
    leaveCycle: metadata.leaveCycle,
    nextOfKinName: nextOfKin?.full_name ?? '',
    nextOfKinPhoneNumber: nextOfKin?.phone_number ?? '',
    address: nextOfKin?.address ?? '',
    managerId: employee.manager_id,
  }
}

export async function createEmployee(
  input: EmployeeCrudInput,
  companyId: string,
  actorId: string | null,
) {
  await ensureUniqueEmployeeNumber(input.employeeNumber, companyId)

  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .insert({
      employee_number: input.employeeNumber,
      company_id: companyId,
      department_id: input.departmentId,
      job_title_id: input.jobTitleId,
      manager_id: input.managerId,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone_number: input.phoneNumber,
      date_of_birth: input.dateOfBirth,
      gender: input.gender,
      employment_type: input.employmentType,
      hire_date: input.employmentDate,
      status: 'Active',
      notes: serializeEmployeeMetadata(input),
      created_by: actorId,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (employeeError) {
    throw new Error(createServiceError(employeeError, 'Failed to create employee').message)
  }

  const { error: contactError } = await supabase
    .from('employee_contacts')
    .insert({
      employee_id: employee.id,
      contact_type: 'Next of Kin',
      full_name: input.nextOfKinName,
      phone_number: input.nextOfKinPhoneNumber,
      address: input.address,
      created_by: actorId,
      updated_by: actorId,
    })

  if (contactError) {
    throw new Error(createServiceError(contactError, 'Failed to create next of kin details').message)
  }
}

export async function updateEmployee(
  employeeId: string,
  input: EmployeeCrudInput,
  companyId: string,
  actorId: string | null,
) {
  await ensureUniqueEmployeeNumber(input.employeeNumber, companyId, employeeId)

  const { error: employeeError } = await supabase
    .from('employees')
    .update({
      employee_number: input.employeeNumber,
      company_id: companyId,
      department_id: input.departmentId,
      job_title_id: input.jobTitleId,
      manager_id: input.managerId,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone_number: input.phoneNumber,
      date_of_birth: input.dateOfBirth,
      gender: input.gender,
      employment_type: input.employmentType,
      hire_date: input.employmentDate,
      notes: serializeEmployeeMetadata(input),
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', employeeId)
    .eq('company_id', companyId)
    .is('deleted_at', null)

  if (employeeError) {
    throw new Error(createServiceError(employeeError, 'Failed to update employee').message)
  }

  const { data: existingContact, error: contactLookupError } = await supabase
    .from('employee_contacts')
    .select('id')
    .eq('employee_id', employeeId)
    .eq('contact_type', 'Next of Kin')
    .limit(1)
    .maybeSingle()

  if (contactLookupError) {
    throw new Error(createServiceError(contactLookupError, 'Failed to load next of kin contact').message)
  }

  if (existingContact?.id) {
    const { error: updateContactError } = await supabase
      .from('employee_contacts')
      .update({
        full_name: input.nextOfKinName,
        phone_number: input.nextOfKinPhoneNumber,
        address: input.address,
        updated_by: actorId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingContact.id)

    if (updateContactError) {
      throw new Error(createServiceError(updateContactError, 'Failed to update next of kin details').message)
    }

    return
  }

  const { error: createContactError } = await supabase
    .from('employee_contacts')
    .insert({
      employee_id: employeeId,
      contact_type: 'Next of Kin',
      full_name: input.nextOfKinName,
      phone_number: input.nextOfKinPhoneNumber,
      address: input.address,
      created_by: actorId,
      updated_by: actorId,
    })

  if (createContactError) {
    throw new Error(createServiceError(createContactError, 'Failed to create next of kin details').message)
  }
}

export async function deactivateEmployee(
  employeeId: string,
  companyId: string,
  actorId: string | null,
) {
  const { error } = await supabase
    .from('employees')
    .update({
      status: 'Inactive',
      deleted_at: new Date().toISOString(),
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', employeeId)
    .eq('company_id', companyId)
    .is('deleted_at', null)

  if (error) {
    throw new Error(createServiceError(error, 'Failed to deactivate employee').message)
  }
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
