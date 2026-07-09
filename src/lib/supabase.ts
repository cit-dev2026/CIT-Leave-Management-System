import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { AUTH_CONFIG } from '@/config/auth'
import { env } from '@/config/env'
import { type Database } from '@/types/database'

let supabaseClient: SupabaseClient<Database> | null = null

/**
 * Initialize and return Supabase client
 * 
 * Configuration:
 * - Uses Supabase anon key only (public key)
 * - Never exposes Service Role Key in frontend
 * - Auto-refreshes tokens before expiry
 * - Persists session in localStorage
 * - Detects JWT tokens in URL for OAuth/email link flows
 */
export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createClient<Database>(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        // Auto-refresh token 60 seconds before expiry
        autoRefreshToken: AUTH_CONFIG.SESSION.AUTO_REFRESH_TOKEN,
        // Persist session to localStorage
        persistSession: AUTH_CONFIG.SESSION.PERSIST_SESSION,
        // Detect JWT in URL for magic link flows
        detectSessionInUrl: AUTH_CONFIG.SESSION.DETECT_SESSION_IN_URL,
        // Storage options for session persistence
        storage: {
          getItem: (key: string) => localStorage.getItem(key),
          setItem: (key: string, value: string) => localStorage.setItem(key, value),
          removeItem: (key: string) => localStorage.removeItem(key),
        },
      },
      // Enable real-time subscriptions with all events
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    },
  )

  return supabaseClient
}

export const supabase = getSupabaseClient()
