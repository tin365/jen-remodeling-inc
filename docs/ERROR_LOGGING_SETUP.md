# Error Logging Setup (Supabase)

Client errors are logged to a Supabase table so you can monitor the app without paying for an external service. Sentry remains optional: if `NEXT_PUBLIC_SENTRY_DSN` is set, errors are also sent to Sentry; if unset, only Supabase (and the browser console) are used.

## 1. Create the table and RLS

Run the migration so the `error_logs` table exists:

```bash
supabase db push
```

Or run the following SQL once in the Supabase Dashboard → SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert on error_logs" ON public.error_logs;
CREATE POLICY "Allow anonymous insert on error_logs"
ON public.error_logs FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated insert on error_logs" ON public.error_logs;
CREATE POLICY "Allow authenticated insert on error_logs"
ON public.error_logs FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read error_logs" ON public.error_logs;
CREATE POLICY "Admins can read error_logs"
ON public.error_logs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
```

- **Insert:** anonymous and authenticated users can insert (the client reports errors).
- **Select:** only users listed in `admin_users` can read rows.

## 2. Environment

- **NEXT_PUBLIC_SUPABASE_URL** and **NEXT_PUBLIC_SUPABASE_ANON_KEY** — required for the app; used by error reporting to insert into `error_logs`.
- **NEXT_PUBLIC_SENTRY_DSN** — optional. If set, errors are also sent to Sentry. If you remove it (e.g. to stop paying for Sentry), errors still go to Supabase and the console.

## 3. Viewing errors

- **Supabase Dashboard:** Table Editor → `error_logs` (use the service role or an admin account).
- **Admin site:** Log in as admin and open the **Errors** tab to see recent entries (message, url, date; stack expandable).

## 4. Optional: email on new error

To get an email when a new row is inserted into `error_logs`:

1. **Database webhook:** In Supabase Dashboard → Database → Webhooks, create a webhook on `error_logs` for INSERT events, pointing to your existing `send-notification` Edge Function URL (or a variant that handles `error_logs`).
2. **Edge Function:** In [supabase/functions/send-notification/index.ts](supabase/functions/send-notification/index.ts) a branch for table `error_logs` is already added: it sends an email with subject `[JEN Site] New error: <message>` and body with message, url, and stack. Ensure the webhook payload matches what the function expects (e.g. Supabase Database Webhooks send `type`, `table`, `record`).

If you use a different webhook provider, adapt the payload so the function receives `table === 'error_logs'` and `record` with `message`, `url`, `stack`.
