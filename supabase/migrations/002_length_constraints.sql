-- =============================================================================
-- Length constraints for contact_submissions and reviews (abuse prevention)
-- Run after 001_rls.sql (or after full-setup.sql). Safe to re-run: drops first.
-- =============================================================================

-- Contact submissions: cap message and field lengths
ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS chk_contact_message_length,
  DROP CONSTRAINT IF EXISTS chk_contact_name_length,
  DROP CONSTRAINT IF EXISTS chk_contact_email_length,
  DROP CONSTRAINT IF EXISTS chk_contact_phone_length;

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT chk_contact_message_length CHECK (char_length(message) <= 10000),
  ADD CONSTRAINT chk_contact_name_length CHECK (char_length(name) <= 200),
  ADD CONSTRAINT chk_contact_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT chk_contact_phone_length CHECK (char_length(phone) <= 50);

-- Reviews: cap text and name lengths
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS chk_review_text_length,
  DROP CONSTRAINT IF EXISTS chk_review_name_length;

ALTER TABLE public.reviews
  ADD CONSTRAINT chk_review_text_length CHECK (char_length(text) <= 5000),
  ADD CONSTRAINT chk_review_name_length CHECK (char_length(name) <= 200);
