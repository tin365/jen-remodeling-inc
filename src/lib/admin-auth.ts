import { supabase, type User } from './supabase'

export type AdminSession = { user: User; isAdmin: true }

/**
 * Get current session and verify admin role via admin_users table.
 * RLS ensures only the user's own row is readable.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!data) return null
  return { user, isAdmin: true }
}

/**
 * Sign in with email and password. Returns admin session if user is in admin_users.
 */
export async function signInAdmin(email: string, password: string): Promise<{ error: string | null }> {
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password })
  if (authError) {
    const msg = authError.message.toLowerCase()
    if (msg.includes('invalid') || msg.includes('credentials') || msg.includes('email') || msg.includes('password')) {
      return { error: 'Invalid email or password.' }
    }
    return { error: 'Sign in failed. Please try again.' }
  }
  if (!user) return { error: 'Sign in failed. Please try again.' }

  const { data } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!data) {
    await supabase.auth.signOut()
    return { error: 'Access denied. You are not an administrator.' }
  }
  return { error: null }
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut()
}
