import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().min(1),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  // Auth Configuration (optional in development, required in production)
  VITE_AUTH_CALLBACK_URL: z.string().optional().default(''),
  VITE_AUTH_LOGOUT_URL: z.string().optional().default(''),
})

const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${parsedEnv.error.message}`)
}

export const env = parsedEnv.data

export const isSupabaseConfigured =
  !env.VITE_SUPABASE_URL.includes('<') && !env.VITE_SUPABASE_ANON_KEY.includes('<')
