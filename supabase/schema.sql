
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

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on contact_submissions"
  ON contact_submissions FOR INSERT
  TO anon
  WITH CHECK (true);


CREATE POLICY "Allow anonymous read on reviews"
  ON reviews FOR SELECT
  TO anon
  USING (true);


CREATE POLICY "Allow anonymous insert on reviews"
  ON reviews FOR INSERT
  TO anon
  WITH CHECK (true);

