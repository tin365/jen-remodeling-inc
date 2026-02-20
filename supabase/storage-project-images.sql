-- Project images bucket and RLS (run after full-setup.sql)
--
-- Option A: Create bucket in Supabase Dashboard → Storage → New bucket
--   Name: project-images
--   Public bucket: ON
--   File size limit: 5 MB
--   Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- Then run only "2. RLS policies" below.
--
-- Option B: Create bucket via SQL (run once; if duplicate key, bucket exists — run policies only)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);
-- If you get "duplicate key" error, the bucket already exists; run only the policies below.

-- 2. RLS policies for storage.objects (bucket_id = 'project-images')

-- Anyone can view (public bucket)
DROP POLICY IF EXISTS "Public read project-images" ON storage.objects;
CREATE POLICY "Public read project-images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'project-images');

-- Only admins can upload
DROP POLICY IF EXISTS "Admins insert project-images" ON storage.objects;
CREATE POLICY "Admins insert project-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project-images'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Only admins can delete
DROP POLICY IF EXISTS "Admins delete project-images" ON storage.objects;
CREATE POLICY "Admins delete project-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-images'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );
