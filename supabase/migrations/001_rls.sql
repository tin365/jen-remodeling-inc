-- =============================================================================
-- RLS (Row Level Security) policies for JEN Remodeling
-- Run via: supabase db push  (or run this file in SQL Editor)
-- =============================================================================

-- Helper: only users listed in admin_users are considered admins
-- Use in USING / WITH CHECK: EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())

-- -----------------------------------------------------------------------------
-- admin_users: authenticated can only read their own row (to check if admin)
-- -----------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read own record" ON public.admin_users;
DROP POLICY IF EXISTS "Users can read own admin row" ON public.admin_users;

CREATE POLICY "Users can read own admin row"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- contact_submissions: anon + authenticated can insert; only admins read/delete
-- -----------------------------------------------------------------------------
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated insert on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can read contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact_submissions" ON public.contact_submissions;

CREATE POLICY "Allow anonymous insert on contact_submissions"
ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated insert on contact_submissions"
ON public.contact_submissions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can read contact_submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete contact_submissions"
ON public.contact_submissions FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- -----------------------------------------------------------------------------
-- reviews: anon + authenticated can insert and read; only admins delete
-- -----------------------------------------------------------------------------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated insert on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow anonymous read on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated read on reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;

CREATE POLICY "Allow anonymous insert on reviews"
ON public.reviews FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated insert on reviews"
ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow anonymous read on reviews"
ON public.reviews FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated read on reviews"
ON public.reviews FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can read reviews"
ON public.reviews FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- -----------------------------------------------------------------------------
-- projects: public read; only admins full CRUD
-- -----------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;

CREATE POLICY "Public can read projects"
ON public.projects FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can manage projects"
ON public.projects FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- -----------------------------------------------------------------------------
-- project_images: public read; only admins full CRUD
-- -----------------------------------------------------------------------------
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read project_images" ON public.project_images;
DROP POLICY IF EXISTS "Admins can manage project_images" ON public.project_images;

CREATE POLICY "Public can read project_images"
ON public.project_images FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can manage project_images"
ON public.project_images FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- -----------------------------------------------------------------------------
-- Storage (bucket project-images): configure in Dashboard or a separate migration
-- - Public read: SELECT on storage.objects for bucket_id = 'project-images'
-- - Admin write: INSERT/UPDATE/DELETE for authenticated + in admin_users
-- -----------------------------------------------------------------------------
