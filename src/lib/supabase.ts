import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

export type { User }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'For GitHub Actions: add them in Settings → Secrets and variables → Actions.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
