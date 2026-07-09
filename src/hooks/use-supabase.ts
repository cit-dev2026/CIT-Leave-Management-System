/**
 * src/hooks/use-supabase.ts
 *
 * Custom React hooks for Supabase query and mutation operations.
 * Provides loading states, error handling, and automatic refetch logic.
 */

import { useCallback, useEffect, useState } from 'react'
import {
  deleteFromTable,
  getById,
  insertIntoTable,
  queryTable,
  type QueryOptions,
  type ServiceError,
  updateInTable,
} from '@/services/base-service'

/**
 * Loading state enum for better UX
 */
export enum LoadingState {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

/**
 * Hook for querying table data
 */
export function useSupabaseQuery<T extends Record<string, unknown>>(
  tableName: string,
  options?: QueryOptions,
) {
  const [state, setState] = useState<LoadingState>(LoadingState.Idle)
  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<ServiceError | null>(null)

  const refetch = useCallback(async () => {
    setState(LoadingState.Loading)
    const result = await queryTable<T>(tableName, options)
    setState(result.error ? LoadingState.Error : LoadingState.Success)
    setData(result.data)
    setError(result.error)
  }, [tableName, options])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch()
  }, [refetch])

  return {
    data,
    error,
    isLoading: state === LoadingState.Loading,
    state,
    refetch,
  }
}

/**
 * Hook for fetching a single record by ID
 */
export function useSupabaseGetById<T extends Record<string, unknown>>(
  tableName: string,
  id: string | null,
) {
  const [state, setState] = useState<LoadingState>(LoadingState.Idle)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ServiceError | null>(null)

  const refetch = useCallback(async () => {
    if (!id) return

    setState(LoadingState.Loading)
    const result = await getById<T>(tableName, id)
    setState(result.error ? LoadingState.Error : LoadingState.Success)
    setData(result.data)
    setError(result.error)
  }, [tableName, id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch()
  }, [refetch])

  return {
    data,
    error,
    isLoading: state === LoadingState.Loading,
    state,
    refetch,
  }
}

/**
 * Hook for insert mutations
 */
export function useSupabaseInsert<T extends Record<string, unknown>>(tableName: string) {
  const [state, setState] = useState<LoadingState>(LoadingState.Idle)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ServiceError | null>(null)

  const mutate = useCallback(
    async (insertData: unknown) => {
      setState(LoadingState.Loading)
      setError(null)

      const result = await insertIntoTable<T>(tableName, insertData)

      if (result.error) {
        setState(LoadingState.Error)
        setError(result.error)
        return result
      }

      setState(LoadingState.Success)
      setData(result.data)
      return result
    },
    [tableName],
  )

  const reset = useCallback(() => {
    setState(LoadingState.Idle)
    setData(null)
    setError(null)
  }, [])

  return {
    data,
    error,
    isLoading: state === LoadingState.Loading,
    state,
    mutate,
    reset,
  }
}

/**
 * Hook for update mutations
 */
export function useSupabaseUpdate<T extends Record<string, unknown>>(tableName: string) {
  const [state, setState] = useState<LoadingState>(LoadingState.Idle)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ServiceError | null>(null)

  const mutate = useCallback(
    async (id: string, updateData: unknown) => {
      setState(LoadingState.Loading)
      setError(null)

      const result = await updateInTable<T>(tableName, id, updateData)

      if (result.error) {
        setState(LoadingState.Error)
        setError(result.error)
        return result
      }

      setState(LoadingState.Success)
      setData(result.data)
      return result
    },
    [tableName],
  )

  const reset = useCallback(() => {
    setState(LoadingState.Idle)
    setData(null)
    setError(null)
  }, [])

  return {
    data,
    error,
    isLoading: state === LoadingState.Loading,
    state,
    mutate,
    reset,
  }
}

/**
 * Hook for delete mutations
 */
export function useSupabaseDelete(tableName: string) {
  const [state, setState] = useState<LoadingState>(LoadingState.Idle)
  const [error, setError] = useState<ServiceError | null>(null)

  const mutate = useCallback(
    async (id: string) => {
      setState(LoadingState.Loading)
      setError(null)

      const result = await deleteFromTable(tableName, id)

      if (result.error) {
        setState(LoadingState.Error)
        setError(result.error)
        return result
      }

      setState(LoadingState.Success)
      return result
    },
    [tableName],
  )

  const reset = useCallback(() => {
    setState(LoadingState.Idle)
    setError(null)
  }, [])

  return {
    error,
    isLoading: state === LoadingState.Loading,
    state,
    mutate,
    reset,
  }
}
