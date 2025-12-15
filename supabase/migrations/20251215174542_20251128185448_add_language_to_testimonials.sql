/*
  # Add Language Support to Testimonials

  1. Changes
    - Add `language` column to testimonials table (values: 'fr', 'en', 'es')
    - Set default language to 'fr' for existing testimonials
    - Add index on language column for faster queries

  2. Notes
    - Existing testimonials are marked as French ('fr')
    - New testimonials can specify language
    - Enables filtering testimonials by user's selected language
*/

-- Add language column to testimonials table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'language'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN language text NOT NULL DEFAULT 'fr' CHECK (language IN ('fr', 'en', 'es'));
  END IF;
END $$;

-- Create index for language filtering
CREATE INDEX IF NOT EXISTS idx_testimonials_language ON testimonials(language);

-- Create composite index for featured + language queries
CREATE INDEX IF NOT EXISTS idx_testimonials_featured_language ON testimonials(featured, language) WHERE featured = true;