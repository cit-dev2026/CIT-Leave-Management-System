/**
 * src/services/base-service.ts
 * 
 * Generic service layer providing common patterns for Supabase operations.
 * All database operations are strongly typed using the Database interface.
 */

import { supabase } from '@/lib/supabase'

/**
 * Response wrapper for all service operations
 */
export interface ServiceResponse<T> {
  data: T | null
  error: ServiceError | null
  isLoading: boolean
}

/**
 * Standardized error type
 */
export interface ServiceError {
  code: string
  message: string
  details?: string
  original?: unknown
}

/**
 * Query options for list operations
 */
export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  ascending?: boolean
  filters?: Record<string, unknown>
}

/**
 * Create a standardized error response
 */
export function createServiceError(error: unknown, context?: string): ServiceError {
  if (error instanceof Error) {
    return {
      code: 'SERVICE_ERROR',
      message: error.message,
      details: context,
      original: error,
    }
  }

  const supabaseError = error as { code?: string; message?: string }
  return {
    code: supabaseError?.code || 'UNKNOWN_ERROR',
    message: supabaseError?.message || 'An unknown error occurred',
    details: context,
    original: error,
  }
}

/**
 * Generic query handler
 */
export async function queryTable<T extends Record<string, unknown>>(
  tableName: string,
  options: QueryOptions = {},
): Promise<ServiceResponse<T[]>> {
  try {
    let query = supabase.from(tableName).select('*')

    // Apply filters
    if (options.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== null) {
          if (typeof value === 'boolean') {
            query = query.eq(key, value)
          } else if (Array.isArray(value)) {
            query = query.in(key, value)
          } else {
            query = query.eq(key, value)
          }
        }
      }
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true })
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit)
    }
    if (options.offset) {
      query = query.range(options.offset, (options.offset + (options.limit ?? 10)) - 1)
    }

    const { data, error } = await query

    if (error) {
      return {
        data: null,
        error: createServiceError(error, `Query failed for table: ${tableName}`),
        isLoading: false,
      }
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      data: (data as T[]) || [],
      error: null,
      isLoading: false,
    }
  } catch (error) {
    return {
      data: null,
      error: createServiceError(error, `Unexpected error querying ${tableName}`),
      isLoading: false,
    }
  }
}

/**
 * Generic insert handler
 */
export async function insertIntoTable<T extends Record<string, unknown>>(
  tableName: string,
  data: unknown,
): Promise<ServiceResponse<T>> {
  try {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const { data: result, error } = await (supabase
      .from(tableName) as any)
      .insert(data)
      .select()
      .single()
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

    if (error) {
      return {
        data: null,
        error: createServiceError(error, `Insert failed for table: ${tableName}`),
        isLoading: false,
      }
    }

    return {
      data: (result as T) || null,
      error: null,
      isLoading: false,
    }
  } catch (error) {
    return {
      data: null,
      error: createServiceError(error, `Unexpected error inserting into ${tableName}`),
      isLoading: false,
    }
  }
}

/**
 * Generic update handler
 */
export async function updateInTable<T extends Record<string, unknown>>(
  tableName: string,
  id: string,
  data: unknown,
): Promise<ServiceResponse<T>> {
  try {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const { data: result, error } = await (supabase
      .from(tableName) as any)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

    if (error) {
      return {
        data: null,
        error: createServiceError(error, `Update failed for table: ${tableName}`),
        isLoading: false,
      }
    }

    return {
      data: (result as T) || null,
      error: null,
      isLoading: false,
    }
  } catch (error) {
    return {
      data: null,
      error: createServiceError(error, `Unexpected error updating ${tableName}`),
      isLoading: false,
    }
  }
}

/**
 * Generic delete handler
 */
export async function deleteFromTable(
  tableName: string,
  id: string,
): Promise<ServiceResponse<boolean>> {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      return {
        data: null,
        error: createServiceError(error, `Delete failed for table: ${tableName}`),
        isLoading: false,
      }
    }

    return {
      data: true,
      error: null,
      isLoading: false,
    }
  } catch (error) {
    return {
      data: null,
      error: createServiceError(error, `Unexpected error deleting from ${tableName}`),
      isLoading: false,
    }
  }
}

/**
 * Generic get-by-id handler
 */
export async function getById<T extends Record<string, unknown>>(
  tableName: string,
  id: string,
): Promise<ServiceResponse<T>> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return {
        data: null,
        error: createServiceError(error, `Get by ID failed for table: ${tableName}`),
        isLoading: false,
      }
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      data: (data as T) || null,
      error: null,
      isLoading: false,
    }
  } catch (error) {
    return {
      data: null,
      error: createServiceError(error, `Unexpected error getting ${tableName} by ID`),
      isLoading: false,
    }
  }
}
