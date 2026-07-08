import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { env } from '@/config/env'
import { type Database } from '@/types/database'

let supabaseClient: SupabaseClient<Database> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createClient<Database>(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    },
  )

  return supabaseClient
}

export const supabase = getSupabaseClient()
