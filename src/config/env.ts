import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().min(1),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
})

const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${parsedEnv.error.message}`)
}

export const env = parsedEnv.data

export const isSupabaseConfigured =
  !env.VITE_SUPABASE_URL.includes('<') && !env.VITE_SUPABASE_ANON_KEY.includes('<')
