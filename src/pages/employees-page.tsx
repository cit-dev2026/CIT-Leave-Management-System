import { Download, Filter, Plus, Trash2, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEmployees, useSoftDeleteEmployees } from '@/hooks/use-employees'
import { employeeFilterSchema, type EmployeeFilterSchema } from '@/schemas/employee-schema'

const defaultFilters: EmployeeFilterSchema = employeeFilterSchema.parse({
  search: '',
  statuses: [],
  branchIds: [],
  companyIds: [],
  departmentIds: [],
  employmentTypes: [],
})

export function EmployeesPage() {
  const [filters] = useState<EmployeeFilterSchema>(defaultFilters)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const employeesQuery = useEmployees(filters)
  const softDeleteMutation = useSoftDeleteEmployees()

  const employeeData = useMemo(() => employeesQuery.data ?? [], [employeesQuery.data])

  const allSelected = employeeData.length > 0 && selectedIds.length === employeeData.length

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Employee Module
          </p>
          <h2 className="text-2xl font-bold lg:text-3xl">Employee Management</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            Filters
          </Button>
          <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />}>
            Import
          </Button>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Employee</Button>
        </div>
      </header>

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="search"
            className="h-10 w-full rounded-xl border border-[var(--border-primary)] bg-transparent px-3 text-sm outline-none lg:max-w-md"
            placeholder="Global search: employee no, name, email"
            defaultValue={filters.search}
          />
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span>{selectedIds.length} selected</span>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              disabled={selectedIds.length === 0 || softDeleteMutation.isPending}
              onClick={() => {
                void softDeleteMutation.mutateAsync({
                  employeeIds: selectedIds,
                  actorId: null,
                })
              }}
            >
              Bulk Delete
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-primary)] text-[var(--text-secondary)]">
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedIds(employeeData.map((employee) => employee.id))
                        return
                      }

                      setSelectedIds([])
                    }}
                  />
                </th>
                <th className="px-3 py-2">Employee #</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Employment Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Hire Date</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee) => {
                const isSelected = selectedIds.includes(employee.id)

                return (
                  <tr
                    key={employee.id}
                    className="border-b border-[var(--border-primary)]/60 transition hover:bg-cyan-500/5"
                  >
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(event) => {
                          setSelectedIds((currentIds) => {
                            if (event.target.checked) {
                              return [...currentIds, employee.id]
                            }

                            return currentIds.filter((id) => id !== employee.id)
                          })
                        }}
                      />
                    </td>
                    <td className="px-3 py-2 font-semibold">{employee.employeeNumber}</td>
                    <td className="px-3 py-2">{employee.fullName}</td>
                    <td className="px-3 py-2">{employee.email}</td>
                    <td className="px-3 py-2">{employee.employmentType}</td>
                    <td className="px-3 py-2">{employee.status}</td>
                    <td className="px-3 py-2">{employee.hireDate}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}
