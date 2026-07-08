import { type AppRole } from '@/constants/roles'

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          code: string
          name: string
          is_active: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          code: string
          name: string
          is_active?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string
          name?: string
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          id: string
          employee_number: string
          first_name: string
          last_name: string
          email: string
          gender: string | null
          company_id: string
          department_id: string | null
          branch_id: string | null
          manager_id: string | null
          employment_type: string | null
          status: string
          hire_date: string
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_number: string
          first_name: string
          last_name: string
          email: string
          gender?: string | null
          company_id: string
          department_id?: string | null
          branch_id?: string | null
          manager_id?: string | null
          employment_type?: string | null
          status?: string
          hire_date: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          first_name?: string
          last_name?: string
          email?: string
          gender?: string | null
          company_id?: string
          department_id?: string | null
          branch_id?: string | null
          manager_id?: string | null
          employment_type?: string | null
          status?: string
          hire_date?: string
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          user_id: string
          role: AppRole
          employee_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          role: AppRole
          employee_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          role?: AppRole
          employee_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
