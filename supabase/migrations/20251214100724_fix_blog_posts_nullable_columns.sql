/*
  # Fix blog_posts nullable columns

  ## Changes
  - Make meta_title, meta_description, excerpt, reading_time, author_id, and tags nullable
  - This prevents null constraint violations during article generation
  - Allows fallback values to be applied after initial insert if needed

  ## Reasoning
  OpenAI may sometimes return incomplete JSON responses, causing insert failures.
  Making these columns nullable allows the generation to succeed with fallback values.
*/

-- Make SEO and metadata columns nullable
ALTER TABLE blog_posts 
  ALTER COLUMN meta_title DROP NOT NULL,
  ALTER COLUMN meta_description DROP NOT NULL,
  ALTER COLUMN excerpt DROP NOT NULL,
  ALTER COLUMN reading_time DROP NOT NULL,
  ALTER COLUMN author_id DROP NOT NULL,
  ALTER COLUMN tags DROP NOT NULL;