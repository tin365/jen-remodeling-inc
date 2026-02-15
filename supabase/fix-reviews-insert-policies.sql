-- Run this once in Supabase Dashboard → SQL Editor to fix "new row violates row-level security policy" when submitting a review.
-- This ensures both anonymous and logged-in users can insert into reviews.

DROP POLICY IF EXISTS "Allow anonymous insert on reviews" ON reviews;
CREATE POLICY "Allow anonymous insert on reviews"
  ON reviews FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated insert on reviews" ON reviews;
CREATE POLICY "Allow authenticated insert on reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);
