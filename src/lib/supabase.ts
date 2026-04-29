import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

export type { User }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const SUPABASE_CONFIG_ERROR_MESSAGE =
  'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
  'For GitHub Actions: add them in Settings → Secrets and variables → Actions.'

type SupabaseClient = ReturnType<typeof createClient>
type QueryResult = { data: null; error: Error }
type QueryStub = Promise<QueryResult> & {
  select: () => QueryStub
  insert: () => QueryStub
  update: () => QueryStub
  delete: () => QueryStub
  eq: () => QueryStub
  gte: () => QueryStub
  order: () => QueryStub
  limit: () => QueryStub
  single: () => QueryStub
  maybeSingle: () => QueryStub
}

function createSupabaseConfigError() {
  return new Error(SUPABASE_CONFIG_ERROR_MESSAGE)
}

function createQueryStub(result: QueryResult): QueryStub {
  const query = Promise.resolve(result) as QueryStub
  query.select = () => query
  query.insert = () => query
  query.update = () => query
  query.delete = () => query
  query.eq = () => query
  query.gte = () => query
  query.order = () => query
  query.limit = () => query
  query.single = () => query
  query.maybeSingle = () => query
  return query
}

function createUnavailableSupabaseClient(): SupabaseClient {
  const configError = createSupabaseConfigError()
  const result = { data: null, error: configError }

  return {
    from: () => ({
      select: () => createQueryStub(result),
      insert: () => createQueryStub(result),
      update: () => createQueryStub(result),
      delete: () => createQueryStub(result),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: configError }),
      signInWithPassword: async () => ({ data: { user: null }, error: configError }),
      signOut: async () => ({ error: null }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: configError }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as unknown as SupabaseClient
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createUnavailableSupabaseClient()
