-- JEN Remodeling – full Supabase setup (run once, or re-run safely)
-- Order: tables first, then RLS, then policies, then data.

-- 1. Tables
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_contact TEXT NOT NULL DEFAULT 'email',
  service TEXT NOT NULL,
  project_type TEXT,
  budget TEXT,
  timeline TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  service TEXT NOT NULL CHECK (service IN ('basement', 'kitchen', 'bathroom', 'living-room', 'other')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Contact submissions: anon insert
DROP POLICY IF EXISTS "Allow anonymous insert on contact_submissions" ON contact_submissions;
CREATE POLICY "Allow anonymous insert on contact_submissions"
  ON contact_submissions FOR INSERT TO anon WITH CHECK (true);

-- 4. Reviews: anon read + insert
DROP POLICY IF EXISTS "Allow anonymous read on reviews" ON reviews;
CREATE POLICY "Allow anonymous read on reviews"
  ON reviews FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert on reviews" ON reviews;
CREATE POLICY "Allow anonymous insert on reviews"
  ON reviews FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated insert on reviews" ON reviews;
CREATE POLICY "Allow authenticated insert on reviews"
  ON reviews FOR INSERT TO authenticated WITH CHECK (true);

-- 5. Admin: who can read own row
DROP POLICY IF EXISTS "Users can read own admin row" ON admin_users;
CREATE POLICY "Users can read own admin row"
  ON admin_users FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 6. Admin: read/delete contact_submissions
DROP POLICY IF EXISTS "Admins can read contact_submissions" ON contact_submissions;
CREATE POLICY "Admins can read contact_submissions"
  ON contact_submissions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can delete contact_submissions" ON contact_submissions;
CREATE POLICY "Admins can delete contact_submissions"
  ON contact_submissions FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 7. Admin: read + delete reviews
DROP POLICY IF EXISTS "Admins can read reviews" ON reviews;
CREATE POLICY "Admins can read reviews"
  ON reviews FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;
CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 8. Add your admin user (run after that user exists in Authentication → Users)
INSERT INTO admin_users (user_id) VALUES ('24764d28-21b5-423f-96e0-1fcbf8820c8a')
ON CONFLICT (user_id) DO NOTHING;
