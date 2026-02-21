-- =============================================================================
-- error_logs: client error reporting (budget-friendly monitoring)
-- Anon insert; only admins can read. Run via: supabase db push (or SQL Editor)
-- =============================================================================

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

-- Anon can insert (client reports errors; no PII stored)
DROP POLICY IF EXISTS "Allow anonymous insert on error_logs" ON public.error_logs;
CREATE POLICY "Allow anonymous insert on error_logs"
ON public.error_logs FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated insert on error_logs" ON public.error_logs;
CREATE POLICY "Allow authenticated insert on error_logs"
ON public.error_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Only admins can read
DROP POLICY IF EXISTS "Admins can read error_logs" ON public.error_logs;
CREATE POLICY "Admins can read error_logs"
ON public.error_logs FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
