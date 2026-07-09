import { type AppRole } from '@/constants/roles'

export interface Database {
  public: {
    Tables: {
      // Core security & audit
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
          role?: AppRole
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
      audit_logs: {
        Row: {
          id: string
          table_name: string
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          row_id: string | null
          actor_id: string | null
          old_data: Record<string, unknown> | null
          new_data: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          table_name: string
          action: 'INSERT' | 'UPDATE' | 'DELETE'
          row_id?: string | null
          actor_id?: string | null
          old_data?: Record<string, unknown> | null
          new_data?: Record<string, unknown> | null
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      // Master data
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
      departments: {
        Row: {
          id: string
          company_id: string
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
          company_id: string
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
      branches: {
        Row: {
          id: string
          company_id: string
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
          company_id: string
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
      business_units: {
        Row: {
          id: string
          company_id: string
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
          company_id: string
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
      locations: {
        Row: {
          id: string
          branch_id: string
          code: string
          name: string
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          country: string | null
          is_active: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          branch_id: string
          code: string
          name: string
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
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
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      job_titles: {
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
      job_descriptions: {
        Row: {
          id: string
          job_title_id: string
          summary: string
          responsibilities: string[]
          requirements: string[]
          is_active: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          job_title_id: string
          summary: string
          responsibilities?: string[]
          requirements?: string[]
          is_active?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          summary?: string
          responsibilities?: string[]
          requirements?: string[]
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employment_types: {
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
      employee_statuses: {
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
      cost_centres: {
        Row: {
          id: string
          company_id: string
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
          company_id: string
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
      grades: {
        Row: {
          id: string
          code: string
          name: string
          rank_order: number
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
          rank_order: number
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
          rank_order?: number
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      pay_scales: {
        Row: {
          id: string
          grade_id: string
          min_amount: number
          max_amount: number
          currency_code: string
          is_active: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          grade_id: string
          min_amount: number
          max_amount: number
          currency_code: string
          is_active?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          min_amount?: number
          max_amount?: number
          currency_code?: string
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          id: string
          code: string
          name: string
          start_time: string
          end_time: string
          is_night_shift: boolean
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
          start_time: string
          end_time: string
          is_night_shift?: boolean
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
          start_time?: string
          end_time?: string
          is_night_shift?: boolean
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      leave_types: {
        Row: {
          id: string
          code: string
          name: string
          default_quota: number
          requires_attachment: boolean
          is_paid: boolean
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
          default_quota?: number
          requires_attachment?: boolean
          is_paid?: boolean
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
          default_quota?: number
          requires_attachment?: boolean
          is_paid?: boolean
          is_active?: boolean
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      holiday_calendar: {
        Row: {
          id: string
          company_id: string
          holiday_date: string
          holiday_name: string
          is_national: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          company_id: string
          holiday_date: string
          holiday_name: string
          is_national?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          holiday_name?: string
          is_national?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      nationalities: {
        Row: {
          id: string
          iso_code: string
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          iso_code: string
          name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          iso_code?: string
          name?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      document_types: {
        Row: {
          id: string
          code: string
          name: string
          category: string
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          code: string
          name: string
          category: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string
          name?: string
          category?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      // Employee records
      employees: {
        Row: {
          id: string
          employee_number: string
          company_id: string
          department_id: string | null
          branch_id: string | null
          business_unit_id: string | null
          location_id: string | null
          job_title_id: string | null
          manager_id: string | null
          cost_centre_id: string | null
          grade_id: string | null
          shift_id: string | null
          first_name: string
          middle_name: string | null
          last_name: string
          email: string
          phone_number: string | null
          gender: string | null
          date_of_birth: string | null
          nationality_id: string | null
          marital_status: string | null
          employment_type: string | null
          status: string
          hire_date: string
          probation_end_date: string | null
          profile_photo_path: string | null
          notes: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_number: string
          company_id: string
          department_id?: string | null
          branch_id?: string | null
          business_unit_id?: string | null
          location_id?: string | null
          job_title_id?: string | null
          manager_id?: string | null
          cost_centre_id?: string | null
          grade_id?: string | null
          shift_id?: string | null
          first_name: string
          middle_name?: string | null
          last_name: string
          email: string
          phone_number?: string | null
          gender?: string | null
          date_of_birth?: string | null
          nationality_id?: string | null
          marital_status?: string | null
          employment_type?: string | null
          status?: string
          hire_date: string
          probation_end_date?: string | null
          profile_photo_path?: string | null
          notes?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          employee_number?: string
          company_id?: string
          department_id?: string | null
          branch_id?: string | null
          business_unit_id?: string | null
          location_id?: string | null
          job_title_id?: string | null
          manager_id?: string | null
          cost_centre_id?: string | null
          grade_id?: string | null
          shift_id?: string | null
          first_name?: string
          middle_name?: string | null
          last_name?: string
          email?: string
          phone_number?: string | null
          gender?: string | null
          date_of_birth?: string | null
          nationality_id?: string | null
          marital_status?: string | null
          employment_type?: string | null
          status?: string
          hire_date?: string
          probation_end_date?: string | null
          profile_photo_path?: string | null
          notes?: string | null
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_contacts: {
        Row: {
          id: string
          employee_id: string
          contact_type: 'Next of Kin' | 'Emergency'
          full_name: string
          relationship: string | null
          phone_number: string
          email: string | null
          address: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          contact_type: 'Next of Kin' | 'Emergency'
          full_name: string
          relationship?: string | null
          phone_number: string
          email?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          contact_type?: 'Next of Kin' | 'Emergency'
          full_name?: string
          relationship?: string | null
          phone_number?: string
          email?: string | null
          address?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          id: string
          employee_id: string
          document_type_id: string
          file_name: string
          storage_path: string
          issued_on: string | null
          expires_on: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          document_type_id: string
          file_name: string
          storage_path: string
          issued_on?: string | null
          expires_on?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          document_type_id?: string
          file_name?: string
          storage_path?: string
          issued_on?: string | null
          expires_on?: string | null
          is_verified?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_qualifications: {
        Row: {
          id: string
          employee_id: string
          institution_name: string
          qualification_name: string
          grade: string | null
          completed_on: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          institution_name: string
          qualification_name: string
          grade?: string | null
          completed_on?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          institution_name?: string
          qualification_name?: string
          grade?: string | null
          completed_on?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_skills: {
        Row: {
          id: string
          employee_id: string
          skill_name: string
          proficiency_level: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          skill_name: string
          proficiency_level?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          skill_name?: string
          proficiency_level?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_training: {
        Row: {
          id: string
          employee_id: string
          course_name: string
          provider_name: string | null
          completion_date: string | null
          certificate_path: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          course_name: string
          provider_name?: string | null
          completion_date?: string | null
          certificate_path?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          course_name?: string
          provider_name?: string | null
          completion_date?: string | null
          certificate_path?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_licences: {
        Row: {
          id: string
          employee_id: string
          licence_name: string
          licence_number: string | null
          issued_on: string | null
          expires_on: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          licence_name: string
          licence_number?: string | null
          issued_on?: string | null
          expires_on?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          licence_name?: string
          licence_number?: string | null
          issued_on?: string | null
          expires_on?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_assets: {
        Row: {
          id: string
          employee_id: string
          asset_name: string
          asset_tag: string | null
          assigned_on: string | null
          returned_on: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          asset_name: string
          asset_tag?: string | null
          assigned_on?: string | null
          returned_on?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_name?: string
          asset_tag?: string | null
          assigned_on?: string | null
          returned_on?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_salary: {
        Row: {
          id: string
          employee_id: string
          pay_scale_id: string | null
          base_salary: number
          currency_code: string
          effective_from: string
          effective_to: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          pay_scale_id?: string | null
          base_salary: number
          currency_code: string
          effective_from: string
          effective_to?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          pay_scale_id?: string | null
          base_salary?: number
          currency_code?: string
          effective_from?: string
          effective_to?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      employee_history: {
        Row: {
          id: string
          employee_id: string
          event_type: string
          event_date: string
          payload: Record<string, unknown>
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          event_type: string
          event_date: string
          payload?: Record<string, unknown>
          created_at?: string
          created_by?: string | null
        }
        Update: never
        Relationships: []
      }
      employee_notes: {
        Row: {
          id: string
          employee_id: string
          note: string
          is_private: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          note: string
          is_private?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          note?: string
          is_private?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      // Leave management
      leave_balances: {
        Row: {
          id: string
          employee_id: string
          leave_type_id: string
          balance_year: number
          opening_balance: number
          accrued: number
          used: number
          carried_forward: number
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          leave_type_id: string
          balance_year: number
          opening_balance?: number
          accrued?: number
          used?: number
          carried_forward?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          opening_balance?: number
          accrued?: number
          used?: number
          carried_forward?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          id: string
          employee_id: string
          leave_type_id: string
          start_date: string
          end_date: string
          days_requested: number
          reason: string | null
          approval_status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
          approved_by: string | null
          approved_at: string | null
          rejected_reason: string | null
          cancelled_at: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          leave_type_id: string
          start_date: string
          end_date: string
          days_requested: number
          reason?: string | null
          approval_status?: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
          approved_by?: string | null
          approved_at?: string | null
          rejected_reason?: string | null
          cancelled_at?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          reason?: string | null
          approval_status?: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'
          approved_by?: string | null
          approved_at?: string | null
          rejected_reason?: string | null
          cancelled_at?: string | null
          deleted_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      leave_attachments: {
        Row: {
          id: string
          leave_request_id: string
          file_name: string
          storage_path: string
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          leave_request_id: string
          file_name: string
          storage_path: string
          created_at?: string
          created_by?: string | null
        }
        Update: never
        Relationships: []
      }
      // Attendance
      attendance_records: {
        Row: {
          id: string
          employee_id: string
          shift_id: string | null
          attendance_date: string
          check_in_at: string | null
          check_out_at: string | null
          attendance_status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave'
          remarks: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          shift_id?: string | null
          attendance_date: string
          check_in_at?: string | null
          check_out_at?: string | null
          attendance_status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave'
          remarks?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          shift_id?: string | null
          check_in_at?: string | null
          check_out_at?: string | null
          attendance_status?: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave'
          remarks?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      attendance_anomalies: {
        Row: {
          id: string
          attendance_record_id: string
          anomaly_type: string
          details: string | null
          resolved_at: string | null
          resolved_by: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          attendance_record_id: string
          anomaly_type: string
          details?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          anomaly_type?: string
          details?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
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
