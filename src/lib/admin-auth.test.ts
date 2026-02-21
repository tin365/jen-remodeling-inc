import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAdminSession, signInAdmin, signOutAdmin } from './admin-auth'

const mockUser = { id: 'user-1', email: 'admin@test.com' } as { id: string; email?: string }

const mockGetUser = vi.fn()
const mockSignInWithPassword = vi.fn()
const mockSignOut = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
      signInWithPassword: (opts: { email: string; password: string }) => mockSignInWithPassword(opts),
      signOut: () => mockSignOut(),
    },
    from: (table: string) => mockFrom(table),
  },
}))

function chainSelectEqMaybeSingle(data: { user_id: string } | null) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data }),
  }
}

describe('getAdminSession', () => {
  beforeEach(() => {
    mockGetUser.mockReset()
    mockFrom.mockReset()
  })

  it('returns null when no user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    expect(await getAdminSession()).toBeNull()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('returns null when user is not in admin_users', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } })
    mockFrom.mockReturnValue(chainSelectEqMaybeSingle(null))
    expect(await getAdminSession()).toBeNull()
    expect(mockFrom).toHaveBeenCalledWith('admin_users')
  })

  it('returns session when user is in admin_users', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser } })
    mockFrom.mockReturnValue(chainSelectEqMaybeSingle({ user_id: mockUser.id }))
    const session = await getAdminSession()
    expect(session).toEqual({ user: mockUser, isAdmin: true })
  })
})

describe('signInAdmin', () => {
  beforeEach(() => {
    mockSignInWithPassword.mockReset()
    mockSignOut.mockReset()
    mockFrom.mockReset()
  })

  it('returns error null when valid credentials and user in admin_users', async () => {
    mockSignInWithPassword.mockResolvedValue({ data: { user: mockUser }, error: null })
    mockFrom.mockReturnValue(chainSelectEqMaybeSingle({ user_id: mockUser.id }))
    const result = await signInAdmin('admin@test.com', 'password')
    expect(result.error).toBeNull()
    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('returns Invalid email or password for invalid credentials', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' } as Error,
    })
    const result = await signInAdmin('bad@test.com', 'wrong')
    expect(result.error).toBe('Invalid email or password.')
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('returns Invalid email or password when message contains email', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Email not confirmed' } as Error,
    })
    const result = await signInAdmin('a@b.com', 'pass')
    expect(result.error).toBe('Invalid email or password.')
  })

  it('returns Access denied and signs out when user not in admin_users', async () => {
    mockSignInWithPassword.mockResolvedValue({ data: { user: mockUser }, error: null })
    mockFrom.mockReturnValue(chainSelectEqMaybeSingle(null))
    const result = await signInAdmin('user@test.com', 'password')
    expect(result.error).toBe('Access denied. You are not an administrator.')
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('returns generic message for other auth errors', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Network error' } as Error,
    })
    const result = await signInAdmin('a@b.com', 'pass')
    expect(result.error).toBe('Sign in failed. Please try again.')
  })

  it('returns Sign in failed when no user in response', async () => {
    mockSignInWithPassword.mockResolvedValue({ data: { user: null }, error: null })
    const result = await signInAdmin('a@b.com', 'pass')
    expect(result.error).toBe('Sign in failed. Please try again.')
  })
})

describe('signOutAdmin', () => {
  beforeEach(() => {
    mockSignOut.mockReset()
  })

  it('calls supabase.auth.signOut', async () => {
    mockSignOut.mockResolvedValue(undefined)
    await signOutAdmin()
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })
})
