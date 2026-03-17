import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Creates a real client; calls will fail gracefully if env vars are missing.
export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'placeholder',
)

/** True when Supabase is properly configured */
export const SUPABASE_ENABLED = !!(supabaseUrl && supabaseAnonKey)
