import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { useError } from '@/contexts/error-context'
import { useToastNotify } from '@/contexts/toast-context'
import {
  useCreateEmployee,
  useDeactivateEmployee,
  useEmployeeFormOptions,
  useEmployees,
  useUpdateEmployee,
} from '@/hooks/use-employees'
import { useUserProfile } from '@/hooks/use-user-profile'
import {
  employeeCrudSchema,
  employeeFilterSchema,
  type EmployeeCrudSchema,
  type EmployeeFilterSchema,
} from '@/schemas/employee-schema'
import { getEmployeeById } from '@/services/employee-service'

const defaultFilters: EmployeeFilterSchema = employeeFilterSchema.parse({
  search: '',
  statuses: [],
  branchIds: [],
  companyIds: [],
  departmentIds: [],
  employmentTypes: [],
})

const defaultEmployeeForm: EmployeeCrudSchema = {
  employeeNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  idPassportNumber: '',
  dateOfBirth: '',
  gender: '',
  employmentDate: '',
  employmentType: '',
  departmentId: '',
  jobTitleId: '',
  leaveCycle: '',
  nextOfKinName: '',
  nextOfKinPhoneNumber: '',
  address: '',
  managerId: null,
}

export function EmployeesPage() {
  const { user } = useAuth()
  const { addError } = useError()
  const toast = useToastNotify()
  const { profile, isLoading: profileLoading, isError: profileError } = useUserProfile()
  const companyId = profile?.company_id ?? null

  const [filters, setFilters] = useState<EmployeeFilterSchema>(defaultFilters)
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<EmployeeCrudSchema>(defaultEmployeeForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isLoadingEmployeeDetail, setIsLoadingEmployeeDetail] = useState(false)

  const scopedFilters = useMemo<EmployeeFilterSchema>(() => {
    return {
      ...filters,
      companyIds: companyId ? [companyId] : [],
    }
  }, [filters, companyId])

  const employeesQuery = useEmployees(scopedFilters, Boolean(companyId) && !profileLoading)
  const formOptionsQuery = useEmployeeFormOptions(companyId)

  const createEmployeeMutation = useCreateEmployee()
  const updateEmployeeMutation = useUpdateEmployee()
  const deactivateEmployeeMutation = useDeactivateEmployee()

  const employeeData = useMemo(() => employeesQuery.data ?? [], [employeesQuery.data])
  const isFormOpen = formMode !== null
  const isSaving = createEmployeeMutation.isPending || updateEmployeeMutation.isPending

  const departments = formOptionsQuery.data?.departments ?? []
  const jobTitles = formOptionsQuery.data?.jobTitles ?? []
  const managers = formOptionsQuery.data?.managers ?? []

  const resetForm = () => {
    setFormMode(null)
    setEditingEmployeeId(null)
    setFormValues(defaultEmployeeForm)
    setFormErrors({})
  }

  const updateFormValue = <K extends keyof EmployeeCrudSchema>(
    field: K,
    value: EmployeeCrudSchema[K],
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))

    if (formErrors[field]) {
      setFormErrors((currentErrors) => {
        const nextErrors = { ...currentErrors }
        delete nextErrors[field]
        return nextErrors
      })
    }
  }

  const handleOpenCreate = () => {
    setFormMode('create')
    setEditingEmployeeId(null)
    setFormValues(defaultEmployeeForm)
    setFormErrors({})
  }

  const handleOpenEdit = async (employeeId: string) => {
    if (!companyId) {
      return
    }

    setFormMode('edit')
    setEditingEmployeeId(employeeId)
    setFormErrors({})
    setIsLoadingEmployeeDetail(true)

    try {
      const employeeDetail = await getEmployeeById(employeeId, companyId)

      setFormValues({
        employeeNumber: employeeDetail.employeeNumber,
        firstName: employeeDetail.firstName,
        lastName: employeeDetail.lastName,
        email: employeeDetail.email,
        phoneNumber: employeeDetail.phoneNumber,
        idPassportNumber: employeeDetail.idPassportNumber,
        dateOfBirth: employeeDetail.dateOfBirth,
        gender: employeeDetail.gender,
        employmentDate: employeeDetail.employmentDate,
        employmentType: employeeDetail.employmentType,
        departmentId: employeeDetail.departmentId,
        jobTitleId: employeeDetail.jobTitleId,
        leaveCycle: employeeDetail.leaveCycle,
        nextOfKinName: employeeDetail.nextOfKinName,
        nextOfKinPhoneNumber: employeeDetail.nextOfKinPhoneNumber,
        address: employeeDetail.address,
        managerId: employeeDetail.managerId,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load employee details.'
      addError('EMPLOYEE_DETAIL_LOAD_FAILED', message)
      toast.error('Unable to load employee details', message)
      resetForm()
    } finally {
      setIsLoadingEmployeeDetail(false)
    }
  }

  const handleFormSubmit = async () => {
    if (!companyId) {
      return
    }

    const parsed = employeeCrudSchema.safeParse(formValues)

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      const flattenedErrors = parsed.error.flatten().fieldErrors

      for (const [field, messages] of Object.entries(flattenedErrors)) {
        if (messages?.[0]) {
          nextErrors[field] = messages[0]
        }
      }

      setFormErrors(nextErrors)
      toast.error('Validation failed', 'Please review the highlighted fields.')
      return
    }

    try {
      if (formMode === 'edit' && editingEmployeeId) {
        await updateEmployeeMutation.mutateAsync({
          employeeId: editingEmployeeId,
          input: parsed.data,
          companyId,
          actorId: user?.id ?? null,
        })
        toast.success('Employee updated successfully')
      } else {
        await createEmployeeMutation.mutateAsync({
          input: parsed.data,
          companyId,
          actorId: user?.id ?? null,
        })
        toast.success('Employee created successfully')
      }

      resetForm()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save employee.'
      addError('EMPLOYEE_SAVE_FAILED', message)
      toast.error('Employee save failed', message)
    }
  }

  const handleDeactivateEmployee = async (employeeId: string) => {
    if (!companyId) {
      return
    }

    const confirmed = window.confirm('Deactivate this employee? This action can be reversed later.')

    if (!confirmed) {
      return
    }

    try {
      await deactivateEmployeeMutation.mutateAsync({
        employeeId,
        companyId,
        actorId: user?.id ?? null,
      })
      toast.success('Employee deactivated successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to deactivate employee.'
      addError('EMPLOYEE_DEACTIVATE_FAILED', message)
      toast.error('Employee deactivation failed', message)
    }
  }

  if (profileLoading || employeesQuery.isLoading || formOptionsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-base font-medium text-[var(--text-secondary)]">Checking authentication...</p>
      </div>
    )
  }

  if (profileError || employeesQuery.isError || formOptionsQuery.isError) {
    return (
      <section className="space-y-4">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Employee Module
          </p>
          <h2 className="text-2xl font-bold lg:text-3xl">Employee Management</h2>
        </header>
        <Card>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Unable to load employees</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Please refresh the page or sign in again.
            </p>
          </div>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Employee Module
          </p>
          <h2 className="text-2xl font-bold lg:text-3xl">Employee Management</h2>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
          Add Employee
        </Button>
      </header>

      {isFormOpen && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {formMode === 'edit' ? 'Edit Employee' : 'Add Employee'}
            </h3>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          {formMode === 'edit' && isLoadingEmployeeDetail ? (
            <div className="py-4 text-sm text-[var(--text-secondary)]">Loading employee details...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Employee Number</label>
                <input
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.employeeNumber}
                  onChange={(event) => updateFormValue('employeeNumber', event.target.value)}
                />
                {formErrors.employeeNumber && <p className="mt-1 text-xs text-red-500">{formErrors.employeeNumber}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Email</label>
                <input
                  type="email"
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.email}
                  onChange={(event) => updateFormValue('email', event.target.value)}
                />
                {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">First Name</label>
                <input
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.firstName}
                  onChange={(event) => updateFormValue('firstName', event.target.value)}
                />
                {formErrors.firstName && <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Last Name</label>
                <input
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.lastName}
                  onChange={(event) => updateFormValue('lastName', event.target.value)}
                />
                {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Phone Number</label>
                <input
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.phoneNumber}
                  onChange={(event) => updateFormValue('phoneNumber', event.target.value)}
                />
                {formErrors.phoneNumber && <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">ID / Passport Number</label>
                <input
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.idPassportNumber}
                  onChange={(event) => updateFormValue('idPassportNumber', event.target.value)}
                />
                {formErrors.idPassportNumber && <p className="mt-1 text-xs text-red-500">{formErrors.idPassportNumber}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Date of Birth</label>
                <input
                  type="date"
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.dateOfBirth}
                  onChange={(event) => updateFormValue('dateOfBirth', event.target.value)}
                />
                {formErrors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{formErrors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Gender</label>
                <select
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.gender}
                  onChange={(event) => updateFormValue('gender', event.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && <p className="mt-1 text-xs text-red-500">{formErrors.gender}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Employment Date</label>
                <input
                  type="date"
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.employmentDate}
                  onChange={(event) => updateFormValue('employmentDate', event.target.value)}
                />
                {formErrors.employmentDate && <p className="mt-1 text-xs text-red-500">{formErrors.employmentDate}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Employment Type</label>
                <select
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.employmentType}
                  onChange={(event) => updateFormValue('employmentType', event.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
                {formErrors.employmentType && <p className="mt-1 text-xs text-red-500">{formErrors.employmentType}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Department</label>
                <select
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.departmentId}
                  onChange={(event) => updateFormValue('departmentId', event.target.value)}
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {formErrors.departmentId && <p className="mt-1 text-xs text-red-500">{formErrors.departmentId}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Job Title / Position</label>
                <select
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.jobTitleId}
                  onChange={(event) => updateFormValue('jobTitleId', event.target.value)}
                >
                  <option value="">Select position</option>
                  {jobTitles.map((jobTitle) => (
                    <option key={jobTitle.id} value={jobTitle.id}>
                      {jobTitle.name}
                    </option>
                  ))}
                </select>
                {formErrors.jobTitleId && <p className="mt-1 text-xs text-red-500">{formErrors.jobTitleId}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Leave Cycle</label>
                <input
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.leaveCycle}
                  onChange={(event) => updateFormValue('leaveCycle', event.target.value)}
                />
                {formErrors.leaveCycle && <p className="mt-1 text-xs text-red-500">{formErrors.leaveCycle}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Manager (Optional)</label>
                <select
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.managerId ?? ''}
                  onChange={(event) => updateFormValue('managerId', event.target.value || null)}
                >
                  <option value="">No manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Next of Kin Name</label>
                <input
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.nextOfKinName}
                  onChange={(event) => updateFormValue('nextOfKinName', event.target.value)}
                />
                {formErrors.nextOfKinName && <p className="mt-1 text-xs text-red-500">{formErrors.nextOfKinName}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Next of Kin Phone Number</label>
                <input
                  className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
                  value={formValues.nextOfKinPhoneNumber}
                  onChange={(event) => updateFormValue('nextOfKinPhoneNumber', event.target.value)}
                />
                {formErrors.nextOfKinPhoneNumber && <p className="mt-1 text-xs text-red-500">{formErrors.nextOfKinPhoneNumber}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">Address</label>
                <textarea
                  className="min-h-[96px] w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 py-2 text-sm outline-none"
                  value={formValues.address}
                  onChange={(event) => updateFormValue('address', event.target.value)}
                />
                {formErrors.address && <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              disabled={isSaving || (formMode === 'edit' && isLoadingEmployeeDetail)}
              onClick={() => void handleFormSubmit()}
            >
              {isSaving ? 'Saving...' : formMode === 'edit' ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </Card>
      )}

      {employeeData.length === 0 ? (
        <Card>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No employees yet</h3>
            <p className="text-sm text-[var(--text-secondary)]">No employees have been added yet.</p>
          </div>
        </Card>
      ) : (
        <Card className="space-y-4">
          <div className="flex w-full flex-col gap-2 lg:max-w-3xl lg:flex-row">
            <input
              type="search"
              className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none"
              placeholder="Search employee number, name"
              value={filters.search}
              onChange={(event) => {
                setFilters((previous) => ({
                  ...previous,
                  search: event.target.value,
                }))
              }}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-primary)] text-[var(--text-secondary)]">
                  <th className="px-3 py-2">Employee Number</th>
                  <th className="px-3 py-2">Full Name</th>
                  <th className="px-3 py-2">Department</th>
                  <th className="px-3 py-2">Position</th>
                  <th className="px-3 py-2">Employment Type</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-[var(--border-primary)]/60 transition hover:bg-cyan-500/5"
                  >
                    <td className="px-3 py-2 font-semibold">{employee.employeeNumber}</td>
                    <td className="px-3 py-2">{employee.fullName}</td>
                    <td className="px-3 py-2">{employee.department}</td>
                    <td className="px-3 py-2">{employee.position}</td>
                    <td className="px-3 py-2">{employee.employmentType}</td>
                    <td className="px-3 py-2">{employee.status}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          leftIcon={<Pencil className="h-4 w-4" />}
                          onClick={() => void handleOpenEdit(employee.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          leftIcon={<Trash2 className="h-4 w-4" />}
                          disabled={deactivateEmployeeMutation.isPending}
                          onClick={() => void handleDeactivateEmployee(employee.id)}
                        >
                          Deactivate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  )
}
